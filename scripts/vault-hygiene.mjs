#!/usr/bin/env node
// Vault hygiene check for the aistack-docs repo.
// Walks the repo, runs three checks, and prints a report.
//
// Checks:
//   1. Broken internal links — standard Markdown links of the form
//      `[text](target.md)` or `[text](target.md#heading)` (with or without
//      a leading `./`/`../`) whose target file or heading anchor does not
//      resolve. Links inside fenced or inline code blocks are ignored.
//   2. Frontmatter       — every note has a YAML frontmatter block with a
//      `title`. Notes under `10-Projects/` and `20-Areas/` must also have
//      at least one tag. `status` (if present) must be one of the values
//      allowed by Conventions.md.
//   3. Stale inbox       — any file under `00-Inbox/` (other than
//      `README.md`) whose last meaningful change is older than
//      `--stale-days` (default 14).
//
// Usage:
//   node scripts/vault-hygiene.mjs [root] [--json] [--stale-days=N]
//
// Exit codes:
//   0  — clean
//   1  — issues found (see report)
//   2  — script error (bad args, root not found, etc.)

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, basename, relative, resolve, dirname } from "node:path";
import { execFileSync } from "node:child_process";

// ---------- args ----------

const argv = process.argv.slice(2);
const jsonOut = argv.includes("--json");
const staleArg = argv.find((a) => a.startsWith("--stale-days="));
const staleDays = staleArg ? Number(staleArg.split("=")[1]) : 14;
const positional = argv.filter((a) => !a.startsWith("--"));
const repoRoot = resolve(positional[0] ?? ".");

if (!Number.isFinite(staleDays) || staleDays < 0) {
  console.error(`Invalid --stale-days value: ${staleArg}`);
  process.exit(2);
}
if (!existsSync(repoRoot)) {
  console.error(`Root not found: ${repoRoot}`);
  process.exit(2);
}

// ---------- walk ----------

const SKIP_DIRS = new Set([".git", "node_modules", "dist"]);

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) {
      yield* walk(p);
    } else if (name.endsWith(".md")) {
      yield p;
    }
  }
}

const allFiles = [...walk(repoRoot)];
const fileSet = new Set(allFiles.map((f) => resolve(f)));

// ---------- helpers ----------

function stripCode(raw) {
  return raw.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
}

// GitHub-style heading slugifier: lowercase, drop punctuation (keep word
// chars, spaces and hyphens), collapse spaces to hyphens.
function slugify(heading) {
  return heading
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// Minimal frontmatter parser — extracts title, tags, status, etc.
// Supports the subset of YAML used in Conventions.md §2 (scalar `key: value`,
// list `key:\n  - item`). Good enough to validate structure, not a full YAML impl.
function parseFrontmatter(raw) {
  if (!raw.startsWith("---")) {
    return { ok: false, reason: "NO_FRONTMATTER" };
  }
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) {
    return { ok: false, reason: "MALFORMED_FRONTMATTER" };
  }
  const block = m[1];
  const fields = {};
  const lines = block.split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "" || line.trim().startsWith("#")) {
      i++;
      continue;
    }
    const kv = line.match(/^([A-Za-z_][A-Za-z0-9_-]*)\s*:\s*(.*)$/);
    if (!kv) {
      i++;
      continue;
    }
    const key = kv[1];
    const rest = kv[2].trim();
    if (rest === "" || rest === "|" || rest === ">") {
      // Possibly a list on subsequent indented lines.
      const items = [];
      let j = i + 1;
      while (j < lines.length && /^\s+-\s+/.test(lines[j])) {
        items.push(lines[j].replace(/^\s+-\s+/, "").trim());
        j++;
      }
      if (items.length > 0) {
        fields[key] = items;
        i = j;
        continue;
      }
      fields[key] = null;
      i++;
      continue;
    }
    fields[key] = rest.replace(/^["']|["']$/g, "").trim();
    i++;
  }
  return { ok: true, fields };
}

function folderOf(file) {
  const rel = relative(repoRoot, file);
  return rel.split("/")[0];
}

function lastChangeIso(file) {
  // Prefer git's last-commit time so timestamps survive filesystem clock changes.
  try {
    const out = execFileSync(
      "git",
      ["log", "-1", "--format=%ct", "--", file],
      { encoding: "utf8", cwd: repoRoot, stdio: ["ignore", "pipe", "ignore"] },
    ).trim();
    if (out) return new Date(Number(out) * 1000).toISOString();
  } catch {
    // fall through
  }
  try {
    return statSync(file).mtime.toISOString();
  } catch {
    return null;
  }
}

// ---------- check 1: broken internal links ----------

// Templates under 90-Templates/ are copy-and-fill-in skeletons whose example
// links point at sibling files that only exist once a project space is
// instantiated from the template — they are not real navigable links.
const LINK_CHECK_SKIP_DIRS = new Set(["90-Templates"]);

// Heading slugs per file, computed lazily and cached.
const headingSlugCache = new Map();
function headingSlugs(file) {
  if (headingSlugCache.has(file)) return headingSlugCache.get(file);
  let slugs = new Set();
  try {
    const stripped = stripCode(readFileSync(file, "utf8"));
    for (const line of stripped.split(/\r?\n/)) {
      const m = line.match(/^#{1,6}\s+(.+)$/);
      if (m) slugs.add(slugify(m[1].trim()));
    }
  } catch {
    slugs = null;
  }
  headingSlugCache.set(file, slugs);
  return slugs;
}

// Matches `](target.md)` or `](target.md#anchor)`, excluding external URLs.
const LINK_RE = /\]\(([^)\s]+\.md(?:#[^)\s]*)?)\)/g;

const brokenLinks = [];
for (const f of allFiles) {
  if (LINK_CHECK_SKIP_DIRS.has(folderOf(f))) continue;
  const raw = readFileSync(f, "utf8");
  const scanned = stripCode(raw);
  let m;
  while ((m = LINK_RE.exec(scanned)) !== null) {
    const target = m[1];
    if (/^[a-z]+:\/\//i.test(target) || target.startsWith("/")) continue;
    const [pathPart, anchor] = target.split("#");
    const resolved = resolve(dirname(f), pathPart);
    if (!fileSet.has(resolved)) {
      brokenLinks.push({
        file: relative(repoRoot, f),
        target,
        reason: "MISSING_FILE",
      });
      continue;
    }
    if (anchor) {
      const slugs = headingSlugs(resolved);
      if (slugs && !slugs.has(anchor)) {
        brokenLinks.push({
          file: relative(repoRoot, f),
          target,
          reason: "MISSING_ANCHOR",
        });
      }
    }
  }
}

// ---------- check 2: frontmatter ----------

const ALLOWED_STATUS = new Set([
  "draft",
  "proposed",
  "in-review",
  "active",
  "published",
  "archived",
]);
const frontmatterIssues = [];
for (const f of allFiles) {
  const rel = relative(repoRoot, f);
  const content = readFileSync(f, "utf8");
  const fm = parseFrontmatter(content);
  if (!fm.ok) {
    frontmatterIssues.push({ file: rel, issue: fm.reason });
    continue;
  }
  const fields = fm.fields;
  if (typeof fields.title !== "string" || fields.title.length === 0) {
    frontmatterIssues.push({ file: rel, issue: "MISSING_TITLE" });
  }
  // Tags are required in 10-Projects/ and 20-Areas/.
  const folder = folderOf(f);
  const tags = fields.tags;
  const tagCount = Array.isArray(tags) ? tags.length : tags ? 1 : 0;
  if ((folder === "10-Projects" || folder === "20-Areas") && tagCount === 0) {
    frontmatterIssues.push({ file: rel, issue: "MISSING_TAGS" });
  }
  if (typeof fields.status === "string" && !ALLOWED_STATUS.has(fields.status)) {
    frontmatterIssues.push({
      file: rel,
      issue: `INVALID_STATUS:${fields.status}`,
    });
  }
}

// ---------- check 3: stale inbox ----------

const staleInbox = [];
const inboxDir = join(repoRoot, "00-Inbox");
if (existsSync(inboxDir)) {
  const cutoff = Date.now() - staleDays * 24 * 60 * 60 * 1000;
  for (const f of walk(inboxDir)) {
    const name = basename(f);
    if (name === "README.md") continue;
    const changedIso = lastChangeIso(f);
    if (!changedIso) continue;
    const changedMs = Date.parse(changedIso);
    if (Number.isNaN(changedMs)) continue;
    if (changedMs < cutoff) {
      staleInbox.push({
        file: relative(repoRoot, f),
        lastChanged: changedIso,
        ageDays: Math.floor((Date.now() - changedMs) / (24 * 60 * 60 * 1000)),
      });
    }
  }
  staleInbox.sort((a, b) => a.ageDays - b.ageDays);
}

// ---------- report ----------

const summary = {
  filesScanned: allFiles.length,
  brokenLinks: brokenLinks.length,
  frontmatterIssues: frontmatterIssues.length,
  staleInbox: staleInbox.length,
};
const report = {
  root: repoRoot,
  generatedAt: new Date().toISOString(),
  staleDaysThreshold: staleDays,
  summary,
  details: { brokenLinks, frontmatterIssues, staleInbox },
};

if (jsonOut) {
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
} else {
  const lines = [];
  lines.push(`# Vault hygiene report — ${report.generatedAt}`);
  lines.push("");
  lines.push(`- Root: \`${repoRoot}\``);
  lines.push(`- Files scanned: ${summary.filesScanned}`);
  lines.push(`- Stale-inbox threshold: ${staleDays} days`);
  lines.push("");
  lines.push("## Summary");
  lines.push(`- Broken links: **${summary.brokenLinks}**`);
  lines.push(`- Frontmatter issues: **${summary.frontmatterIssues}**`);
  lines.push(`- Stale inbox items: **${summary.staleInbox}**`);
  lines.push("");
  if (summary.brokenLinks > 0) {
    lines.push("## Broken links");
    for (const b of brokenLinks) {
      lines.push(`- \`${b.file}\` → \`${b.target}\` (${b.reason})`);
    }
    lines.push("");
  }
  if (summary.frontmatterIssues > 0) {
    lines.push("## Frontmatter issues");
    for (const f of frontmatterIssues) {
      lines.push(`- \`${f.file}\`: ${f.issue}`);
    }
    lines.push("");
  }
  if (summary.staleInbox > 0) {
    lines.push(`## Stale inbox items (> ${staleDays} days)`);
    for (const s of staleInbox) {
      lines.push(`- \`${s.file}\` — last changed ${s.lastChanged} (${s.ageDays} d)`);
    }
    lines.push("");
  }
  if (
    summary.brokenLinks === 0 &&
    summary.frontmatterIssues === 0 &&
    summary.staleInbox === 0
  ) {
    lines.push("All clean. No action required.");
    lines.push("");
  }
  process.stdout.write(lines.join("\n"));
}

const dirty =
  summary.brokenLinks + summary.frontmatterIssues + summary.staleInbox;
process.exit(dirty === 0 ? 0 : 1);

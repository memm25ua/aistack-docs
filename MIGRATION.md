---
title: MIGRATION
tags:
  - meta/migration
  - vault/index
created: 2026-06-15
---

# Migration notes

This repo was created on 2026-06-15 by migrating the company Obsidian vault
out of the Onboarding project (`docs/obsidian-vault/`) into a standalone
public repository at `github.com/memm25ua/aistack-docs`. This page records
what moved, what was dropped, and the conversion rules applied so the next
reader can trust the diff.

## What moved

Everything that was authored as durable documentation in the Onboarding
project's `docs/obsidian-vault/` tree — a PARA-shaped, project-and-area
hierarchy of notes about the company, the Eduker product, and the docs
conventions themselves.

| Source (Onboarding) | Destination (aistack-docs) | Notes |
| --- | --- | --- |
| `docs/obsidian-vault/README.md` | `README.md` | Rewritten for Aistack as the company identity. |
| `docs/obsidian-vault/Conventions.md` | `Conventions.md` | Rewritten for GitHub-native rendering (no Obsidian runtime). |
| `docs/obsidian-vault/Hygiene.md` | `Hygiene.md` | Updated to point at the Onboarding script (which stays there) and the aistack-docs path under check. |
| `docs/obsidian-vault/Setup.md` | `Setup.md` | Rewritten — the Obsidian-skills install story is gone; this is now plain `git` + GitHub. |
| `docs/obsidian-vault/Welcome.md` | `Welcome.md` | Wikilinks rewritten; sample note kept as-is. |
| `docs/obsidian-vault/00-Inbox/` | `00-Inbox/` | Untouched content, links rewritten. |
| `docs/obsidian-vault/10-Projects/Eduker/*` | `10-Projects/Eduker/*` | Project space kept; links rewritten; `Eduker/README.md` gained cross-refs to the other Aistack repos. |
| `docs/obsidian-vault/20-Areas/`, `30-Resources/`, `40-Archives/` | same | Untouched content, links rewritten (only `README.md` index files exist today). |
| `docs/obsidian-vault/90-Templates/` | `90-Templates/` | Untouched content; wikilinks re-rendered as same-folder relative links (templates are copied into a new project space, so they should resolve to same-folder targets). |

## What was dropped

- **`.obsidian/`** — Obsidian's app-specific config (app preferences, plugin
  state, editor settings). Not content; safe to drop.
- **`.canvas` and `.base` files** — Obsidian-only formats (JSON Canvas,
  Obsidian Bases) that GitHub does not render. The information they held
  was not lost: see "Lifted artifacts" below.
- **Wikilink syntax (`[[Note]]`)** — replaced with standard Markdown links
  with relative paths. The semantic content (target, display text, heading
  anchor) is preserved.
- **Obsidian-flavored callouts that are not part of the standard
  callout syntax** — there were none in this vault. All `> [!info]`,
  `> [!tip]`, `> [!warning]`, etc. callouts were preserved verbatim
  (GitHub renders them natively).

## Lifted artifacts

Two Obsidian-only formats were converted into plain Markdown siblings:

- `10-Projects/Eduker/Architecture.canvas` → `10-Projects/Eduker/Architecture.canvas.md`
  The node/edge data is preserved as plain Markdown headings and lists.
  The original `.canvas` is dropped. If you want a renderable diagram,
  re-author in Mermaid or SVG and replace the `.canvas.md` with the
  renderable version.

- `10-Projects/Eduker/Project Notes.base` → `10-Projects/Eduker/Project Notes.base.md`
  The Obsidian Bases YAML is preserved verbatim inside a fenced code block
  in the lifted Markdown. The original `.base` is dropped. If you want a
  live view, re-author as a query in the tool of your choice.

Naming convention: `<original-stem>.canvas.md` and `<original-stem>.base.md`.
This avoids name collisions with existing Markdown files (e.g. `Architecture.md`
sits next to `Architecture.canvas.md`).

## Conversion rules applied

For every `.md` file in the source vault:

1. **Wikilink → Markdown link.** The regex was
   `(!?)\[\[([^\]|#]+(?:#[^\]|]*)?)(?:\|([^\]]+))?\]\]`. The conversion
   resolved targets using Obsidian-like rules:
   - exact path under vault root (with or without extension)
   - basename in the directory of the current file
   - title match (from frontmatter) vault-wide
   - basename match vault-wide

   If none resolved, the wikilink was rendered as inline code (e.g.
   `\`Project Charter\``) so the name is visible but does not render as a
   broken link on GitHub.

2. **Heading anchors.** When a wikilink included a heading
   (`[[Note#Heading]]`), the heading was slugified to GitHub's algorithm
   (lowercase, dash-separated, punctuation stripped) and appended as a
   fragment.

3. **Embeds (`![[Note]]`)** were dropped to a regular link to the file.
   The `!` was discarded; the link text was the last path component of
   the target.

4. **Templates (`90-Templates/**`)** were treated specially. Their
   wikilinks were rendered as **same-folder relative** links (since the
   template is meant to be copied into a new project space), with one
   exception: the vault-level meta references (`Conventions`, `README`,
   `Setup`, `Hygiene`) were rendered as `../<Name>.md` with as many
   `..` segments as needed to reach the vault root (templates are at
   depth 2 from the root).

5. **Frontmatter** was preserved as-is (GitHub renders it as a collapsed
   block).

6. **Callouts** (`> [!info]`, `> [!tip]`, etc.) were preserved as-is
   (GitHub renders them natively with the same syntax).

7. **`.obsidian/`** directory was dropped.

8. **`.canvas` files** were converted to `*.canvas.md` siblings (see
   "Lifted artifacts").

9. **`.base` files** were converted to `*.base.md` siblings (see
   "Lifted artifacts").

## Top-level identity rewrites

Four files were rewritten to make the new identity explicit:

- `README.md` — "Eduker Vault" → "Aistack Docs". Eduker is called out
  as the active product space (`10-Projects/Eduker/`). The repo is
  presented as a public, plain-markdown, GitHub-native resource (no
  Obsidian runtime, no install story).
- `Conventions.md` — same. The "Internal links → wikilinks" rule was
  updated to "Internal links → standard Markdown links with relative
  paths." Sections 7 and 8 (Bases and Canvas) were updated to point
  readers at the `.base.md` / `.canvas.md` siblings rather than the
  Obsidian-specific tooling.
- `Hygiene.md` and `Setup.md` — rewritten for the GitHub-native reality
  (no Obsidian runtime, no install story; the hygiene script lives in
  the Onboarding repo and is path-agnostic).

## What is out of scope

- Restructuring the Onboarding app's docs surface beyond pointing the
  existing cross-references at the new location.
- Setting up CI / previews on aistack-docs.
- Migrating the `pedrourban/fortress-content-shield` and
  `memm25ua/drive-watermark` repos' content — they were not in the
  Obsidian vault.

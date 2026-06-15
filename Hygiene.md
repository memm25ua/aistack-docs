---
title: Hygiene
tags:
  - meta/conventions
  - vault/index
  - topic/automation
---

# Vault hygiene routine

A [Paperclip routine](#how-it-runs) walks this repo every week and runs a
small battery of structural checks. The output is posted as a comment on the
designated [EDU-24 Vault hygiene reports](/EDU/issues/EDU-24) issue, where
the docs owner can triage findings and decide what to fix.

## What it checks

`<onboarding-repo>/scripts/vault-hygiene.mjs` (the script still lives in the
Onboarding project because it predates the move to aistack-docs and is
git-tracked there) runs three checks against this repo:

1. **Broken internal links** — any standard Markdown link of the form
   `[text](path.md)` or `[text](path.md#slug)` whose `path.md` does not
   resolve to a file in the repo. The script is link-syntax-agnostic: it
   walks the tree, scans for `](` patterns, and looks up the target
   relative to the file. Links inside fenced or inline code blocks are
   ignored. Inline-code names like `\`Foo\`` (the post-migration shape of
   placeholder references) are not flagged — they are not links.
2. **Frontmatter** — every note has a YAML frontmatter block with a `title`;
   notes in `10-Projects/` and `20-Areas/` are also required to have at
   least one tag. `status` (if present) must be one of
   `draft`, `proposed`, `in-review`, `active`, `published`, `archived`.
3. **Stale inbox** — any file under `00-Inbox/` (other than `README.md`)
   whose last meaningful change is older than 14 days. "Last meaningful
   change" prefers the file's last `git log` timestamp, falling back to
   filesystem mtime.

## How to run it manually

The script lives in the Onboarding project, not in this repo (it was
authored before the move). Clone the Onboarding repo and pass a path to
this repo:

```bash
# Human-readable report
node <onboarding-repo>/scripts/vault-hygiene.mjs /path/to/aistack-docs

# Machine-readable JSON
node <onboarding-repo>/scripts/vault-hygiene.mjs /path/to/aistack-docs --json

# Custom staleness window
node <onboarding-repo>/scripts/vault-hygiene.mjs /path/to/aistack-docs --stale-days=21
```

Exit codes: `0` clean, `1` issues found, `2` script error.

> [!tip] Why is the script still in the Onboarding repo?
> The script shares code paths and conventions with the rest of the Onboarding
> project (e.g. it uses the same frontmatter parser the Onboarding Express
> app uses). Moving it would split the convention tooling across two repos
> for no real gain. The script is path-agnostic: it can be pointed at this
> repo, the Onboarding repo's own docs, or any other vault-shaped tree.

## How it runs

- **Routine owner:** CTO
- **Project:** Onboarding (where the script lives)
- **Vault under check:** this repo, `memm25ua/aistack-docs`
- **Schedule:** weekly, Monday 09:00 UTC
- **Trigger type:** cron (`0 9 * * 1`)
- **Concurrency policy:** `coalesce_if_active` (skip a new run if the
  previous week's report is still in flight)
- **Catch-up policy:** `skip_missed` (do not enqueue backlog after downtime)
- **Output target:** [EDU-24 Vault hygiene reports](/EDU/issues/EDU-24)
  — subscribe to that issue to be notified of weekly reports.

## Triage workflow

When a new report lands on [EDU-24](/EDU/issues/EDU-24):

1. Skim the summary counts at the top. Anything other than 0/0/0 needs a
   look.
2. **Broken internal links** — usually a renamed note or a typo. Fix the
   file in place (markdown links are not auto-rewritten the way Obsidian
   wikilinks are). `grep -rE '\]\(' --include='*.md' .` to find candidates.
3. **Frontmatter issues** — typically a missing `title`, a note that
   graduated from `00-Inbox/` to `10-Projects/` without adding tags, or a
   `status` value outside the allowed set.
4. **Stale inbox** — either triage the note (move to a project/area,
   archive, or delete) or relax the staleness threshold in the routine
   if your team has a different cadence.

If the conventions need to change (e.g. a new allowed `status` value), edit
[Conventions](Conventions.md) first and update the `ALLOWED_STATUS` set in
the Onboarding repo's `scripts/vault-hygiene.mjs` to match.

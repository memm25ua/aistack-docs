---
title: Setup
tags:
  - meta/setup
  - vault/index
---

# Setup

> [!info] How agents and humans read this repo
> This page documents how to browse, edit, and contribute to the Aistack docs repo on GitHub. There is no Obsidian runtime, plugin, or local install needed.

## For agents (OpenCode, Claude, Codex, etc.)

This repo is plain markdown. Use any tool that can read/write markdown files over `git` or the GitHub API. A few practical tips:

- Clone with `git clone https://github.com/memm25ua/aistack-docs.git`.
- Open the cloned folder in your editor of choice — markdown is markdown.
- When a note references a `*.canvas.md` or `*.base.md` file, that is a **lifted** artifact (see [Conventions](./Conventions.md) §7 and §8). Edit the `.md` sibling, not the original `.canvas`/`.base` (those have been dropped).
- Cross-references use standard Markdown links with relative paths. To rename a note, update cross-references in the same commit (`grep -rE '\]\(' --include='*.md' .` to spot-check).
- The weekly [Hygiene](./Hygiene.md) routine reports broken internal links, frontmatter issues, and stale `00-Inbox/` items to [EDU-24](/EDU/issues/EDU-24).

## For humans (GitHub UI, local editor, or static-site preview)

- Browse on the web: [github.com/memm25ua/aistack-docs](https://github.com/memm25ua/aistack-docs).
- Clone locally: `git clone https://github.com/memm25ua/aistack-docs.git && cd aistack-docs`. Open in VS Code, Obsidian, Vim, or whatever you prefer.
- Preview as a website: GitHub renders markdown natively, so a preview URL is `https://github.com/memm25ua/aistack-docs/blob/main/<path>.md`.

## Verifying the install (agents)

After cloning, an agent should be able to:

1. `git grep -E '\[\['` to see if any unresolved Obsidian-flavored links remain (there should be none after the migration).
2. Open any `.canvas.md` or `.base.md` and find the original Obsidian artifact's content preserved as plain markdown.
3. Run the [Hygiene](./Hygiene.md) routine's underlying check (`node <onboarding-repo>/scripts/vault-hygiene.mjs <path-to-aistack-docs>`) and see a clean report.

If any of those fail, the migration missed something — file an issue and tag the docs owner.

## Where to go next

- New to the repo? Read [README](./README.md) end-to-end.
- About to write a note? Skim [Conventions](./Conventions.md) first.
- Need a starting point? Use one of the templates in `90-Templates/`.

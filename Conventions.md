---
title: Conventions
tags:
  - meta/conventions
  - vault/index
---

# Vault Conventions

> [!summary] The rules of the road
> Follow these conventions so the vault stays navigable for both humans (browsing on GitHub) and agents (via `git`, the GitHub API, or any markdown editor). When in doubt, prefer consistency with the existing notes in a folder.

## 1. File layout

> Aistack is the company. **Eduker** is the active product space — see `10-Projects/Eduker/`. New projects get their own `10-Projects/<ProjectName>/` folder following the same shape.

```
aistack-docs/                  # this repo, on GitHub at memm25ua/aistack-docs
├── README.md                  # Landing page (this repo's home)
├── Conventions.md             # This file
├── Hygiene.md                 # How the weekly hygiene routine works
├── 00-Inbox/                  # Quick capture, triage weekly
├── 10-Projects/               # One sub-folder per active project
│   └── Eduker/                # The active Aistack product
├── 20-Areas/                  # Ongoing responsibilities
├── 30-Resources/              # Reference material
├── 40-Archives/               # Completed / inactive work
└── 90-Templates/              # Note templates — copy, don't edit in place
```

**Why PARA + project spaces?** PARA keeps the long-term stuff (Areas, Resources) separate from the time-boxed stuff (Projects). Adding `10-Projects/<Project>/` inside it gives us a per-team "Confluence space" feel, which matches the goal stated in [README](README.md).

## 2. Frontmatter (required on every note)

Every note should start with YAML frontmatter. At minimum:

```yaml
---
title: Human-readable title
tags:
  - topic/subtopic
  - status/draft
---
```

Supported fields (Obsidian `properties`):

| Field | Required | Notes |
| --- | --- | --- |
| `title` | Recommended | The note's display title. |
| `tags` | Recommended | See [Tags](#5-tags). |
| `aliases` | Optional | Alternate names for the note (Obsidian resolves wikilinks against aliases). |
| `status` | Optional | One of `draft`, `proposed`, `in-review`, `active`, `published`, `archived`. The hygiene routine (see [Hygiene](Hygiene.md)) flags anything outside this list. |
| `owner` | Optional | Agent or person who maintains the note. |
| `created` | Optional | ISO date (`YYYY-MM-DD`). |
| `updated` | Optional | ISO date. Update when substantially changing. |
| `related` | Optional | List of wikilinks. |

> [!tip] Start small
> If a note is a quick capture in `00-Inbox/`, frontmatter can be just `title` + one tag. Notes that graduate to `10-Projects/` or `20-Areas/` should be fleshed out.

## 3. Naming and filenames

- **One note per file.** No giant `all-things.md`.
- **Filenames match the note's primary title** so wikilinks work without a custom display text.
  - `Project Charter.md` not `proj-charter-v3-final.md`
- **Folders are the namespace.** If two projects want a `Roadmap` note, put them in different folders: `10-Projects/Eduker/Roadmap.md` and `10-Projects/Other/Roadmap.md`.
- **Use `PascalCase.md` or `kebab-case.md` consistently within a folder.** Don't mix.
- **Avoid spaces in folder names.** Use `-` to separate words (`10-Projects/Eduker/`, not `10-Projects/Eduker Docs/`).

## 4. Linking

- **Internal links → wikilinks.** ``Project Charter``, ``Project Charter``, ``charter``.
- **External links → markdown links.** `[Obsidian help](https://help.obsidian.md/)`.
- **Embeds when showing, links when navigating.** ``Project Charter`` to inline content, ``Project Charter`` to jump.
- **Avoid broken-link sprawl.** When you rename a note, Obsidian rewrites wikilinks automatically — but check `git grep '\[\['` after a rename if you are working outside Obsidian.

## 5. Tags

- **Lowercase, kebab-case.** `project/eduker`, `area/security`, `status/draft`.
- **Namespace with `/`.** Pick from: `project/*`, `area/*`, `resource/*`, `status/*`, `topic/*`.
- **Tags complement folders, not replace them.** A note in `10-Projects/Eduker/Roadmap.md` should *also* be tagged `project/eduker` so it surfaces in tag-based views.
- **Don't over-tag.** 1–5 tags per note is plenty. If you have more, you probably want a sub-page.

## 6. Callouts (use sparingly)

Callouts highlight things readers should not miss.

```markdown
> [!note] A neutral aside
> [!info] Background context
> [!tip] A useful shortcut
> [!warning] Things to watch for
> [!danger] Stop and read this
> [!question] Open question
> [!example] Concrete example
> [!quote] Citing someone
```

Rule of thumb: a note with more than 3 callouts is trying to do too much — split it.

## 7. Bases (`.base.md`)

A `.base` file is an Obsidian Bases view definition. It is **not** rendered on GitHub. When migrating, drop the `.base` and lift its raw YAML into a sibling `.base.md` file in the same folder. Future views are best expressed as a small script or a query in the tool of your choice.

Example: see `10-Projects/Eduker/Project Notes.base.md` for the lifted version of the original Obsidian Bases config.

## 8. Canvas (`.canvas.md`)

A `.canvas` file is a [JSON Canvas](https://jsoncanvas.org/) spatial diagram. It is **not** rendered on GitHub. When migrating, drop the `.canvas` and lift its node/edge data into a sibling `.canvas.md` file in the same folder. For new diagrams, prefer a renderable format (Mermaid, SVG) that GitHub renders natively.

Example: see `10-Projects/Eduker/Architecture.canvas.md` for the lifted version of the original `Architecture.canvas`.

## 9. Commit hygiene

This repo is public on GitHub. Please:

- Commit doc changes separately from code changes when practical (`docs: ...` commit prefix).
- Keep one logical change per commit (don't fold "updated 12 unrelated notes" into a single commit).
- Don't commit anything you wouldn't want on the open internet — secrets go in the secret manager, not in this repo.

## 10. When *not* to write a note

- The thing is a one-line clarification → reply in the Paperclip issue thread, not in the vault.
- The thing is a code change → open a PR, not a note.
- The thing is ephemeral chat → use the company chat, not the vault.

The vault is for **durable, searchable, structured** knowledge.

## 11. Automated hygiene

A [Paperclip routine](Hygiene.md) walks this repo every Monday 09:00 UTC and
posts a short report on the [Vault hygiene reports](/EDU/issues/EDU-24)
issue, flagging broken internal links, frontmatter issues, and stale items in
`00-Inbox/`. See [Hygiene](Hygiene.md) for the full contract.

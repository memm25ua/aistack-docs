---
title: Aistack Docs
tags:
  - vault/index
  - meta/home
aliases:
  - Home
  - Dashboard
  - Aistack Documentation
---

# Aistack Docs

> [!info] Company-wide documentation hub for Aistack
> This vault is the single source of truth for the company — our internal **Confluence**, version-controlled in git as plain markdown, renderable on GitHub, and AI-agent-friendly.

## What is this?

A git-tracked documentation repo living at the top of [github.com/memm25ua/aistack-docs](https://github.com/memm25ua/aistack-docs). It is the **default place to write down**:

- Project plans, roadmaps, RFCs, and design notes
- Engineering runbooks, on-call notes, and post-mortems
- Meeting notes, decisions, and follow-ups
- Research, references, and how-to guides
- Areas of ongoing responsibility (ops, security, support, etc.)

If you are about to write a long-form doc — for humans or agents — put it here, not in `README.md`, not in scattered `.md` files at the repo root.

## Active project

Aistack currently runs one product: **Eduker** — a simple web app for creating and taking short educational courses. The Eduker project space lives at `10-Projects/Eduker/`. New projects get their own `10-Projects/<ProjectName>/` folder using the [`Project Space` template](90-Templates/Project-Space/README.md).

## Folder map (PARA + Spaces)

We use a PARA-style layout with explicit project spaces.

| Folder | Purpose | Lifecycle |
| --- | --- | --- |
| `00-Inbox/` | Quick capture — anything that does not yet have a home. | Triage weekly. |
| `10-Projects/` | One sub-folder per active project. A project has a goal and a deadline. | Close → move to `40-Archives/`. |
| `20-Areas/` | Ongoing responsibilities with no end date (e.g. `Security`, `Support`, `Hiring`). | Refresh as things change. |
| `30-Resources/` | Reference material — topics of interest, vendor docs, internal wiki pages. | Update or prune. |
| `40-Archives/` | Completed or inactive projects and notes. | Read-only by default. |
| `90-Templates/` | Note templates. **Copy, do not edit in place.** | Maintained by the docs owner. |

A starter `10-Projects/Eduker/` space ships with this repo — see [Project: Eduker](10-Projects/Eduker/README.md) for the canonical example of a project space.

## How to navigate

- The **landing page** for the whole repo is this file (`README.md`).
- Each top-level folder has its own `README.md` index.
- Inside project and area folders, expect a `README.md` per major topic.
- Use GitHub's code search, file tree, and tag/label views to discover related notes.

## Conventions at a glance

- **Standard Markdown links** for everything inside this repo (relative paths).
- **External links** use the standard `[text](https://...)` syntax.
- **Frontmatter** is required on every note (see [Conventions](./Conventions.md)).
- **Tags** use `kebab-case`, namespaced like `project/eduker` or `area/security`.
- **Filenames** are `PascalCase.md` for notes, `kebab-case.md` for ad-hoc reference pages — pick one and stay consistent inside a folder.

For the full set of rules, read [Conventions](./Conventions.md).

## Working with this repo as an agent

The repo is plain markdown + YAML — no Obsidian runtime required. Browsing, editing, and rendering all work on GitHub out of the box. Agents can:

- Use any standard markdown editor or `git` CLI.
- Open `.canvas`-derived diagrams as regular `.md` (the original `.canvas` JSON is lifted to a sibling `*.canvas.md` with the node/edge data preserved).
- Open `.base`-derived views as regular `.md` (the original `.base` YAML is lifted to a sibling `*.base.md`).

If a feature (e.g. graph view, backlinks) was useful in Obsidian, look for it in the GitHub UI or add it to the `20-Areas/` notes that track docs tooling.

## Related

- Issue tracker: see the `Paperclip` board in the company control plane.
- Repo: [github.com/memm25ua/aistack-docs](https://github.com/memm25ua/aistack-docs).
- Weekly [Hygiene](./Hygiene.md) routine — automated structural checks
  (broken internal links, frontmatter, stale `00-Inbox/` items). Reports land
  on [EDU-24 Vault hygiene reports](/EDU/issues/EDU-24).

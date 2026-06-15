---
title: "Project Notes"
tags:
  - meta/base-lift
source_format: obsidian-bases
lifted_from: Project Notes.base
---

# Project Notes (lifted from Obsidian Base)

> [!info] Lifted from `.base` (Obsidian Bases)
> GitHub does not render Obsidian Bases. The raw YAML config is preserved
> below so the view definitions are not lost. Re-author as a query or
> a small script in your tool of choice.

## Source YAML

```yaml
filters:
  and:
    - file.inFolder("docs/obsidian-vault/10-Projects/Eduker")
    - 'file.ext == "md"'

formulas:
  is_stale: 'if(updated, (today() - date(updated)).days > 30, true)'
  status_icon: 'if(status == "published", "✅", if(status == "in-review", "🟡", if(status == "archived", "📦", "📝")))'

properties:
  title:
    displayName: "Title"
  status:
    displayName: "Status"
  formula.status_icon:
    displayName: ""
  formula.is_stale:
    displayName: "Stale (>30d)"
  owner:
    displayName: "Owner"
  updated:
    displayName: "Last updated"

views:
  - type: table
    name: "Project Notes"
    order:
      - formula.status_icon
      - title
      - status
      - owner
      - updated
      - formula.is_stale
    groupBy:
      property: status
      direction: ASC
    summaries:
      formula.is_stale: Filled

  - type: cards
    name: "Recently updated"
    filters:
      and:
        - 'status != "archived"'
    order:
      - title
      - status
      - updated
    limit: 6
```

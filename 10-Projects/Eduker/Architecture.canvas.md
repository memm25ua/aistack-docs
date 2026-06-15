---
title: "Architecture"
tags:
  - meta/canvas-lift
source_format: json-canvas
lifted_from: Architecture.canvas
---

# Architecture (lifted from JSON Canvas)

> [!info] Lifted from `.canvas` (JSON Canvas)
> GitHub does not render `.canvas` files natively. The node and edge data is
> preserved below as plain markdown. Re-author the diagram in a tool that
> exports to a renderable format (Mermaid, SVG) if you need the layout.

## Nodes

### Browser

# Browser

Learners and instructors hit the Express server over HTTP. Server-rendered pages, JSON for the quiz API.

_color: `1`_

### Express server

# Express server

Routes → services → repositories. No async queue, no cache. Auth not yet wired (see RFC).

_color: `4`_

### SQLite

# SQLite

Single file database. Schema lives in `src/db/migrations/`. Backed up nightly via the host's filesystem snapshot.

_color: `6`_

### Group: MVP runtime

Position: `x=-540, y=-260`, size: `1240×300`.

## Edges

- `a1b2c3d4e5f60001` → `a1b2c3d4e5f60002` — _HTTP_
- `a1b2c3d4e5f60002` → `a1b2c3d4e5f60003` — _SQL_

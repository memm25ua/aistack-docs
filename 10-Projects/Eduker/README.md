---
title: Project Eduker
tags:
  - project/eduker
  - vault/index
  - status/active
owner: CTO
created: 2026-06-14
status: active
---

# Project: Eduker

> [!quote] Goal
> Eduker is a simple web app for creating and taking short educational courses. Instructors create courses of lessons (text/video + a short quiz), and learners browse, complete, and get quizzed.

## Status

| | |
| --- | --- |
| **Owner** | CTO |
| **Stage** | Phase 1 — MVP foundations |
| **Repo** | This repository |
| **Stack** | Node.js + TypeScript, Express, SQLite (planned) |

## Contents

- [Roadmap](./Roadmap.md) — what we're building and when
- [Architecture](./Architecture.md) — high-level system design
- [RFCs](./RFCs/Index.md) — proposals under review
- [Meetings](./Meetings/README.md) — meeting notes and decisions
- [Postmortems](./Postmortems/README.md) — incident write-ups

## Quick links

- Source: `src/` (in the Onboarding repo, where the Eduker app lives)
- Server entry: `src/index.ts`
- Database: SQLite (planned), see [Roadmap](./Roadmap.md)
- Companion marketing site: [`pedrourban/fortress-content-shield`](https://github.com/pedrourban/fortress-content-shield) — the public-facing landing page for Eduker
- Drive-watermark service: [`memm25ua/drive-watermark`](https://github.com/memm25ua/drive-watermark) — the affiliates/partners platform

## How to contribute

1. Skim [Roadmap](./Roadmap.md) to see what's in scope right now.
2. For non-trivial changes, open an RFC in [RFCs](./RFCs/Index.md).
3. For bugs, file a Paperclip issue — link it from the relevant postmortem or RFC.

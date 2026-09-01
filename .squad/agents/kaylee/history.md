# Project Context

- **Owner:** Zack Way
- **Project:** Lucia marketing site (luciahome.net) — public-facing Docusaurus docs and blog for the Lucia Privacy-First AI Home Assistant
- **Stack:** Docusaurus 3.9, React 19, TypeScript, MDX
- **Application repo:** /mnt/games/github/lucia-dotnet
- **Created:** 2026-04-14

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

- **Mermaid diagrams:** The site uses `@docusaurus/theme-mermaid` and it's fully working. Existing architecture docs (overview.md, orchestration.md, data-flow.md) use `graph TB`, `graph LR`, `graph TD`, `flowchart TD`, and `sequenceDiagram` types. Node labels with special chars like parentheses need double-quoted strings (`"Speech Enhancement (GTCRN)"`). Edge labels use `-->|label text|` syntax. I/O nodes use `([rounded])` shape, decisions use `{diamond}` shape. Always test with `npm run build` after adding mermaid — MDX parsing is strict.

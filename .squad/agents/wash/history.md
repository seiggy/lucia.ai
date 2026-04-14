# Project Context

- **Owner:** Zack Way
- **Project:** Lucia marketing site (luciahome.net) — public-facing Docusaurus docs and blog for the Lucia Privacy-First AI Home Assistant
- **Stack:** Docusaurus 3.9, React 19, TypeScript, MDX
- **Application repo:** /mnt/games/github/lucia-dotnet
- **Created:** 2026-04-14

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-04-14 — 1.2.x Documentation Batch Validation

**TypeScript:** ✅ PASS — `npm run typecheck` clean, zero errors.

**Build:** ❌ FAIL — `npm run build` exits 1. Three MDX compilation failures caused by bare `<` characters before numbers in markdown tables/text. MDX parses `<100ms` as a JSX opening tag for an element named `100ms`, which is invalid.

**Failing files and lines:**
1. `docs/architecture/voice-platform.md` — lines 261, 263 (`<100ms`)
2. `docs/dashboard/voice-platform.md` — line 253 (`<50ms`)
3. `docs/deployment/data-providers.md` — lines 426, 427 (`<1ms`)

**Fix:** Wrap bare `<` values in backticks (e.g., `` `<100ms` ``) or use HTML entity `&lt;`. Backticks preferred for consistency with the rest of the docs.

**Key learning:** In Docusaurus MDX, any `<` followed by a non-letter character (especially digits) will fail compilation. Always wrap "less than" comparisons or values in backticks when writing MDX content.

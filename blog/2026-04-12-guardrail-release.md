---
slug: guardrail-release
title: "v1.2.2 Guardrail — Navigation, Scroll Fixes, and Command Parsing Edge Cases"
authors: [lucia-team]
tags: [release, patch, bugfix]
---

**Guardrail (v1.2.2)** is a targeted bugfix release addressing three user-reported issues: dashboard navigation, UI scroll jitter, and the fast-path pattern matcher incorrectly claiming non-light device commands.

<!-- truncate -->

## What's fixed

### Dashboard Navigation
- **"Back to Traces" link** now navigates to `/traces` instead of `/` (Activity page)
- **Impact:** Users can now return to the trace list after viewing trace details

### Entity Checkbox Scroll
- **BulkActionBar layout shift** — Clicking entity checkboxes no longer causes page scroll jitter
- **Fix:** The bulk action bar now collapses via CSS (`h-0 invisible overflow-hidden`) instead of unmounting from the DOM
- **Impact:** Smooth, jitter-free entity management in the dashboard

### Fast-Path Pattern Matcher
- **Non-light device bail** — Commands like "turn office fan on", "turn off the AC", "turn on the TV" no longer incorrectly match `LightControlSkill`
- **New non-light device token set** (fan, ac, tv, lock, door, speaker, vacuum, etc.) causes the pattern matcher to reject the match and defer to the LLM orchestrator
- **Temporal preposition fix** — "in" and "at" no longer unconditionally trigger bail signals
  - They now only bail when followed by a number, duration word, or time token (e.g., "7pm", "10am", "30min")
  - Spatial prepositions like "in the kitchen" now pass through correctly
- **Impact:** "lights on in the kitchen" no longer triggers false climate/timer routing

## Test coverage

- 20 new `CommandPatternMatcherTests` across:
  - Temporal bail (4 tests)
  - Spatial pass-through (2 tests)
  - Fan bail (4 tests)
  - Other non-light devices (6 tests)
  - Light-word exception regressions (4 tests)
- All 35 pattern matcher tests passing
- 278/279 Wyoming test suite passing

## Upgrade notes

This is a **fully backward-compatible patch release** — no configuration changes required. Simply upgrade and restart.

## Learn more

For complete technical detail:
- [Lucia v1.2.2 Release Notes](https://github.com/seiggy/lucia-dotnet/blob/master/RELEASE_NOTES.md)
- [GitHub Releases](https://github.com/seiggy/lucia-dotnet/releases)

---

**Guardrail is available now.** Small but important fixes that improve stability and accuracy. Upgrade recommended for all users. Questions? Open an issue or join [GitHub Discussions](https://github.com/seiggy/lucia-dotnet/discussions).

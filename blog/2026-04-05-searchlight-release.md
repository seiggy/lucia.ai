---
slug: searchlight-release
title: "v1.2.1 Searchlight — Quality-Driven Routing and Small-Model Compatibility"
authors: [lucia-team]
tags: [release, quality, performance]
---

**Searchlight (v1.2.1)** is a quality-focused patch that dramatically improves orchestrator routing accuracy — **especially for smaller local models like Gemma 4**. Starting from real-world traces where "turn off the lights" was confidently misrouted to climate control, this release introduces systematic prompt engineering for 9B-parameter models, comprehensive eval coverage, and full timer-agent routing support.

<!-- truncate -->

## What's improved

- **Orchestrator eval suite grew from 7 to 56 scenarios** — Now covers all 7 agent types with cross-domain confusion tests, multi-agent splitting, ambiguous requests, and STT variants
- **Gemma 4 routing accuracy: 0% → 100%** — Infrastructure crash fixes + prompt engineering + eval fixture overhaul restored full test coverage
- **Router prompt engineering** — New rules for time-delayed actions, domain inference hints, and multi-domain detection enable even 9B parameter models to route correctly
- **Timer agent routing support** — "turn off the AC in 5 minutes" now routes to timer-agent, not climate-agent
- **Multi-backend benchmark comparison** — Side-by-side eval runs across different Ollama models

## Why it matters

Smaller models (7B–13B parameters) can match full-size model accuracy on domain-specific tasks when routing rules are precise. This release proves it: Gemma 4 went from crashing the test infrastructure to 100% routing accuracy through:

1. **Rule 0 — Time-Delayed Action Priority**: "in X minutes" / "at X PM" → timer-agent regardless of what device is mentioned
2. **Rule 8 — Domain Inference Hints**: Implicit language mapping (warmer→climate, bright→light, play→music)
3. **Rule 9 — Multi-Domain Detection**: Explicit split rules prevent collapsing multi-intent requests like "turn on the lights and set the temperature"
4. **Skill examples enabled**: Agent catalog now includes per-agent example prompts for pattern matching

## Testing: From broken to bulletproof

| Metric | Before | After |
|--------|--------|-------|
| Test infrastructure | ❌ All crashed | ✅ All pass |
| Routing accuracy | 0/20 (0%) | 24/24 (100%) |
| Agent coverage | 3 of 7 agents testable | 7 of 7 agents testable |
| YAML scenarios | 7 | 56 |
| xUnit test methods | 7 | 24 |

**Root cause:** EvalTestFixture only registered 3 of 7 agent cards. Climate, lists, scene, and timer cards were extracted but never passed to the mock registry, making it impossible to catch cross-domain routing bugs. Fixed and verified.

## Under the hood

- 56 YAML eval scenarios with categories: basic routing, room-specific, cross-domain confusion, multi-agent, ambiguous, STT variants, timer/scheduler, entity IDs
- **Negative assertions**: Light requests assert NOT climate; timer requests assert NOT device agents
- **Full timer-agent wiring** with dependency graph in `EvalTestFixture`
- **Climate agent two-step tool pattern** (Find→Set) for Gemma 4 compatibility
- **Multi-backend UI** with Spectre.Console rendering for side-by-side model comparison

## No breaking changes

All changes are **additive** — new tests, expanded YAML scenarios, and prompt improvements that are backward-compatible with existing agent configurations. Upgrade and go.

## Known issues

- **Timer skill cross-visibility**: `ListTimers` doesn't show scheduled actions created via `ScheduleAction` — they're in separate stores. Workaround: ask "any scheduled tasks?" instead of "any timers?"
- **Dashboard Tasks page**: Shows A2A platform tasks instead of user-created scheduled tasks. Coming in a future release.

## Learn more

For complete technical detail:
- [Lucia v1.2.1 Release Notes](https://github.com/seiggy/lucia-dotnet/blob/master/RELEASE_NOTES.md)
- [GitHub Releases](https://github.com/seiggy/lucia-dotnet/releases)

---

**Searchlight is available now.** Upgrade to unlock small-model compatibility and comprehensive routing validation. Questions? Join [GitHub Discussions](https://github.com/seiggy/lucia-dotnet/discussions).

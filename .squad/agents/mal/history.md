# Project Context

- **Owner:** Zack Way
- **Project:** Lucia marketing site (luciahome.net) — public-facing Docusaurus docs and blog for the Lucia Privacy-First AI Home Assistant
- **Stack:** Docusaurus 3.9, React 19, TypeScript, MDX
- **Application repo:** /mnt/games/github/lucia-dotnet
- **Created:** 2026-04-14

## Learnings

### 1.2.x Release Documentation Gap Analysis (April 2026)
- **Wyoming Voice Platform** is the marquee 1.2.0 feature — entire subsystem of speech-to-text engines, speaker verification, wake word detection, speech enhancement. Needs dedicated architecture doc + dashboard guide.
- **Conversation Command Parser** fundamentally changes HA integration — moved from JSON-RPC agent selection to REST `/api/conversation` endpoint with structured context. HA integration config docs are **critically out of date**.
- **Pluggable Data Providers** (SQLite, InMemory cache) is a major selling point for self-hosted deployments — need clear deployment guides showing when you can omit Redis/MongoDB.
- **Home Assistant component v1.2.0** completely changes integration setup (no agent selection step anymore) — config docs need complete refresh.
- **Response Templates** system is new feature for operator customization — needs dashboard doc + API reference.
- **Personality Prompt** feature allows tone rewriting via separate LLM — needs configuration guide showing ModelConnectionName field.
- **Orchestrator routing improvements (1.2.1)** — new rules for timer priority, domain inference hints, multi-domain detection. Router prompt docs need updating.
- **Command Pattern Matcher fixes (1.2.2)** — non-light device bail, temporal preposition fixes. Need reference doc explaining matcher behavior.
- **Critical path to docs completion:** HA config → REST API → Conversation Parser → Wyoming Platform. These unblock everything else.
- **46-60 hours of doc work** ahead in 3 phases. Phase 1 (critical) is 12-16 hours and will unblock customers.
- **Release notes are comprehensive** source of truth — reference them heavily. Implementation is in `/mnt/games/github/lucia-dotnet`.
- **Docs Gap Analysis Session (2026-04-14):** Completed comprehensive analysis of 74 doc pages. Identified 8 HIGH priority broken pages (HA config, REST API, data provider settings, environment vars), 5 new pages required (Wyoming Platform, Conversation API, Personality, Data Providers, Command Patterns), 7 medium priority gaps. 46-60 hour roadmap in 3 phases. Decision merged to `.squad/decisions.md`. Orchestration logged to `.squad/orchestration-log/2026-04-14T15:03:00Z-mal.md`.

<!-- Append new learnings below. Each entry is something lasting about the project. -->

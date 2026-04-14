# Lucia Decisions Archive

## 2026-04-14: v1.2.x REST Migration Documentation

**Date:** 2026-04-14  
**Author:** Inara  
**Status:** Implemented  
**Scope:** 4 high-priority HA documentation pages  

### Context

Lucia v1.2.0 introduced a breaking change: the Home Assistant integration migrated from JSON-RPC 2.0 to a REST `POST /api/conversation` endpoint with structured context. Additionally, the "Agent Selection" UI was removed—the orchestrator now auto-routes requests to appropriate agents.

### Decision

Updated all 4 HA integration docs to reflect v1.2.x changes:

- **docs/home-assistant/configuration.md** — Removed Agent Selection section, added REST Integration subsection, simplified 4-step to 3-step flow
- **docs/home-assistant/conversation-api.md** — Migrated from JSON-RPC to REST with endpoint documentation and curl examples
- **docs/getting-started/home-assistant-setup.md** — Removed agent selection, updated test command, simplified flow
- **docs/api/rest-api.md** — Added Conversation and Response Templates endpoints with structured context reference

### Rationale

- **Accuracy:** Old docs contradicted v1.2.0 product state
- **User Clarity:** Simpler setup (URL + API key only)
- **Completeness:** Added missing endpoint documentation with examples
- **Maintenance:** Docs now map directly to RELEASE_NOTES.md

---

## 2026-04-14: DataProvider and PersonalityPrompt Documentation (v1.2.0)

**Date:** 2026-04-14  
**Author:** Inara (Content Writer)  
**Status:** Completed

### Decision

Updated 4 high-priority documentation pages to reflect feature additions:

- **docs/reference/environment-variables.md** — Added DataProvider section with Cache, Store, SqlitePath env vars
- **docs/reference/configuration.md** — Added PersonalityPrompt and DataProvider sections with deployment pattern tables
- **docs/dashboard/configuration.md** — Documented textarea field type, added UI-level configuration examples
- **docs/deployment/docker-compose.md** — Added minimal, CPU-only, and HA mono-container deployment patterns

### Key Messaging

- **DataProvider:** Enables deployment flexibility from InMemory+SQLite (add-ons) to Redis+MongoDB (production)
- **PersonalityPrompt:** Response tone customization with optional separate model for cost optimization
- **Backward Compatibility:** Sensible defaults with clear migration paths
- **Zero-Cost Opt-In:** No overhead when features not configured

---

## 2026-04-15: Documentation Coverage for v1.2.0 Critical Features

**Date:** 2026-04-15  
**Author:** Inara (Content Writer)  
**Status:** Complete

### Decision

Created three new comprehensive documentation pages to close zero-coverage gaps:

- **docs/architecture/voice-platform.md** — Wyoming protocol, multi-engine STT, speaker verification, wake word detection, speech enhancement, ONNX auto-detection
- **docs/api/conversation-api.md** — Complete REST API reference for command parser with request/response examples, pattern syntax, confidence scoring
- **docs/deployment/data-providers.md** — Pluggable data provider system for minimal-hardware deployments

### Rationale

- **Voice Platform:** Largest v1.2.0 feature, was completely undocumented
- **Conversation API:** Critical for integration developers, was missing API reference
- **Data Providers:** Enables flagship HA add-on deployment, was completely undocumented

### Coverage Closed

- Home Assistant add-on adoption (no guidance on data providers or voice platform)
- Integration developers (no conversation API reference)
- Power users (no technical depth on voice architecture)

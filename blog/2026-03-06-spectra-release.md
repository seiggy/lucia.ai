---
slug: spectra-release
title: "v1.1.0-preview.1 Spectra — HybridEntityMatcher & Prompt Cache Overhaul"
authors: [seiggy]
tags: [release, feature]
---

**Spectra** overhauls Lucia's entity matching and prompt caching infrastructure. Just as a spectrum reveals the distinct wavelengths hidden in a beam of light, this release decomposes the monolithic entity lookup into a multi-signal search pipeline.

<!-- truncate -->

## Highlights

- **Unified Entity Model** — All Home Assistant entity types now share a common `HomeAssistantEntity` base with domain-specific subtypes, replacing fragmented per-skill entity caches.
- **HybridEntityMatcher** — Multi-weighted entity search using Levenshtein distance, Jaro-Winkler similarity, phonetic (Soundex/Metaphone) matching, and alias resolution — all tunable via `HybridMatchOptions`.
- **Prompt Cache Embedding Fix** — Embeddings are now correctly persisted to Redis, making semantic cache matching fully functional for the first time.
- **Split Cache Thresholds** — Routing cache and chat cache now have independent similarity thresholds, preventing dangerous cross-action cache hits like "turn off" matching "turn on".
- **Entity Visibility Filtering** — New API and dashboard controls for filtering entities by HA's exposed entity list.
- **Preview Docker Releases** — CI/CD now supports `-preview.N` suffixed tags for pre-release testing.

## HybridEntityMatcher

The new matcher combines multiple signals into a weighted composite score:

- **Levenshtein distance** — Edit distance normalization
- **Jaro-Winkler similarity** — Prefix-weighted string comparison
- **Token overlap** — Shared word matching
- **Phonetic matching** — Soundex and Double Metaphone
- **Exact/prefix bonuses** — For high-confidence matches

All weights are configurable via `HybridMatchOptions`, letting you tune matching behavior per search context.

## Prompt Cache Overhaul

The prompt cache system was rearchitected to fix several critical issues:

- **Embedding persistence** — `[JsonIgnore]` attributes were silently preventing embeddings from being serialized to Redis. Removed.
- **Split thresholds** — `SemanticSimilarityThreshold` (0.95) for routing and `ChatCacheSemanticThreshold` (0.98) for chat, independently configurable.
- **Hot-reload** — Thresholds update within 5 seconds of a dashboard config change via `IOptionsMonitor`.
- **Hit count tracking** — Routing cache exact-match hits now correctly persist to Redis.

## Bug Fixes

- Prompt cache embeddings never persisted (b7e9c3d)
- Chat cache replaying wrong action due to overly-liberal matching (6a6a375)
- Routing cache hit count always 0 (a429ede)
- Config changes required restart (6a6a375)
- Embedding provider race condition (0d044bf)
- Tracing duration always 0ms (0d044bf)
- Dashboard dependency vulnerabilities patched (26a4a90)

## Upgrade Notes

1. **Evict caches** after upgrading via the dashboard or API to clear entries without embeddings.
2. **New config properties**: `RouterExecutor:SemanticSimilarityThreshold` (0.95) and `RouterExecutor:ChatCacheSemanticThreshold` (0.98).
3. **Breaking**: Skills using `FindLightsByAreaAsync`, `FindLightAsync`, or `GetCachedEntitiesAsync` must migrate to unified entity tools.

Full release notes: [GitHub Release](https://github.com/seiggy/lucia-dotnet/releases)

---
slug: spectra-release
title: "v1.1.0 Spectra — Smarter Matching, Stronger Reliability, and Brave Search"
authors: [seiggy]
tags: [release, feature, stability]
---

**Spectra (v1.1.0)** is rolling out with Lucia's biggest entity-intelligence upgrade yet, plus a wide set of stability and usability improvements across setup, plugins, Home Assistant conversation flow, and CI.

<!-- truncate -->

## Highlights

- **HybridEntityMatcher + unified entities** for much better Home Assistant entity resolution
- **Prompt cache overhaul** with fixed embedding persistence, split routing/chat thresholds, and hot-reload config
- **Embedding resiliency and live progress UI** with throttled background generation and per-item regenerate controls
- **Home Assistant multi-turn continuity** fixes for stronger follow-up behavior
- **OpenRouter support + model discovery** improvements
- **Brave Search API plugin** with dashboard-managed API key configuration
- **Plugin/setup/dashboard stabilization** and CI hardening

## What's improved in day-to-day use

- Better matching when users use nicknames, partial names, or phrasing variations
- More reliable prompt cache behavior (and fewer risky semantic collisions)
- Smoother embedding generation for larger homes with clear progress visibility
- Cleaner setup/plugin flows and stronger release pipeline reliability

## Upgrade notes

After upgrading to **v1.1.0**, we recommend:

1. **Evict prompt/chat caches** once to clear old entries that were stored without embeddings
2. Review the new cache settings:
   - `RouterExecutor:SemanticSimilarityThreshold` (routing)
   - `RouterExecutor:ChatCacheSemanticThreshold` (chat)
3. If you maintain custom skills, migrate any legacy entity lookup paths to the unified `EntityLocationService` flow

## Read the full release notes

For complete technical detail, including file-level changes and full bug-fix/test coverage, see:

- [Lucia v1.1.0 Release Notes](https://github.com/seiggy/lucia-dotnet/blob/master/RELEASE_NOTES.md)
- [GitHub Releases](https://github.com/seiggy/lucia-dotnet/releases)

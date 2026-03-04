---
sidebar_position: 10
title: Prompt Cache
---

# Prompt Cache

The Prompt Cache page gives you visibility into Lucia's two-tier prompt caching system.

![Prompt Cache](/img/dashboard/prompt-cache.png)

## Cache Tiers

Lucia maintains two separate cache namespaces:

- **Routing Cache** -- caches orchestrator routing decisions so repeated queries skip the routing LLM call.
- **Chat Cache** -- caches agent responses for identical prompts to reduce latency and token usage.

## Tabbed View

Each cache tier is displayed in its own tab. Switch between tabs to inspect entries, view stats, or clear a specific namespace independently.

## Statistics

Each tab shows key metrics:

- **Total Entries** -- number of cached items.
- **Hit Rate** -- percentage of requests served from cache.
- **Memory Usage** -- approximate memory consumed by cached data.

## Managing the Cache

Browse individual cache entries to see the cached prompt, response, and expiration time. Use the **Clear Cache** button to flush all entries in the selected namespace. Cache configuration (TTL, max size) is managed on the **Configuration** page.

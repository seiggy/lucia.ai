---
sidebar_position: 16
title: Matcher Debug
---

# Matcher Debug

The Matcher Debug page provides an interactive testing interface for Lucia's **HybridEntityMatcher**, the system responsible for resolving natural language references to Home Assistant entities.

![Matcher Debug](/img/dashboard/matcher-debug.png)

## How to Use

1. Enter a natural language query in the input field (e.g., "living room lights" or "upstairs thermostat").
2. Click **Match** to run the query against the matcher.
3. Review the scored results displayed below.

## Scored Results

Each matched entity is shown with its overall confidence score and a breakdown of the individual signals that contributed to the match:

- **Name similarity**: how closely the query matches the entity's friendly name.
- **Area match**: whether the query references the entity's assigned area.
- **Domain match**: whether the query implies a specific entity domain (light, climate, etc.).
- **Alias match**: matches against configured entity aliases.

## Pattern Matcher Improvements (v1.2.2)

The **command pattern matcher** now correctly bails to the LLM orchestrator for non-light device commands:

### Non-Light Device Detection
Commands like "turn on the AC", "turn off the fan", "lock the front door" now route to the LLM instead of matching the `LightControlSkill`. The matcher maintains a device-type token set including: fan, AC, TV, lock, door, speaker, vacuum, and other non-light devices.

### Temporal Preposition Fix
Temporal prepositions like "in" and "at" now only trigger a bail signal when followed by time-related words or durations (e.g., "in 5 minutes", "at 7pm", "in 30 seconds"), not when used spatially ("lights on in the kitchen" continues to work correctly).

See [Command Patterns Reference](../reference/command-patterns.md) for the full pattern syntax and matcher logic.

## Debugging

Use this page to identify why a query matches the wrong entity or fails to match at all. Adjust entity names, aliases, or area assignments based on the signal breakdowns to improve matching accuracy.

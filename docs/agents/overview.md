---
sidebar_position: 1
title: Agents Overview
---

# Agents Overview

Lucia uses a **multi-agent architecture** where a central orchestrator delegates each user request to the specialized agent best equipped to handle it. Every agent has a focused domain, its own system prompt, and a curated set of tools -- this keeps individual agents small, fast, and accurate.

## Agent Table

| Agent | Domain | Transport | Description |
|---|---|---|---|
| **LightAgent** | Lighting | In-process | Turn lights on/off, set brightness, color, and color temperature |
| **ClimateAgent** | HVAC / Fans | In-process | Temperature control, mode selection, fan speed |
| **SceneAgent** | Scenes | In-process | Discover and activate Home Assistant scenes |
| **MusicAgent** | Media Playback | In-process | Control Music Assistant -- play, pause, skip, volume, queue |
| **TimerAgent** | Timers / Alarms | A2A | Create timers, schedule alarms, voice dismiss/snooze |
| **ListsAgent** | Lists | In-process | Manage todo and reminder lists |
| **GeneralAgent** | Fallback | In-process | Open-ended questions, general knowledge, web search |

## In-Process vs A2A Agents

Lucia supports two agent transport modes depending on the deployment needs of the agent.

### In-Process Agents

In-process agents run inside the Lucia Agent Host process. They share the same memory space and communicate with the orchestrator through direct method calls.

- **Lowest latency** -- no network hop between orchestrator and agent.
- **Simplest deployment** -- no extra containers or services to manage.
- **Best for** agents that call Home Assistant services directly (lights, climate, scenes, lists).

### A2A (Agent-to-Agent) Satellite Agents

A2A agents run as separate processes (typically their own container) and communicate with the orchestrator over the [Agent-to-Agent protocol](/docs/architecture/a2a-protocol). The orchestrator discovers them via their Agent Card and sends JSON-RPC messages over HTTP.

- **Independent lifecycle** -- can be restarted, scaled, or updated without affecting the host.
- **Language-agnostic** -- satellite agents can be written in any language that speaks A2A.
- **Best for** agents that maintain long-running state (timers, media sessions) or depend on external runtimes.

```
User Request
    |
    v
Orchestrator (router LLM)
    |
    +---> LightAgent      [in-process]
    +---> ClimateAgent     [in-process]
    +---> SceneAgent       [in-process]
    +---> ListsAgent       [in-process]
    +---> GeneralAgent     [in-process]
    +---> MusicAgent       [in-process]
    +---> TimerAgent       [A2A satellite]
```

## How Routing Works

When a user message arrives, the orchestrator uses a lightweight router LLM call to classify the intent and select the appropriate agent. The router prompt includes each agent's name and a short description. If no specialized agent matches, the request falls through to the **GeneralAgent**.

:::tip
You can add your own agents to the routing table at runtime through the dashboard -- see [Custom Agents](./custom-agents.md) for details.
:::

## What's Next?

Explore each agent in detail:

- [Light Agent](./light-agent.md)
- [Climate Agent](./climate-agent.md)
- [Scene Agent](./scene-agent.md)
- [Music Agent](./music-agent.md)
- [Timer Agent](./timer-agent.md)
- [Lists Agent](./lists-agent.md)
- [General Agent](./general-agent.md)
- [Custom Agents](./custom-agents.md)

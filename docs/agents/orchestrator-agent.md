---
sidebar_position: 1.5
title: Orchestrator Agent
---

# Orchestrator Agent

The Orchestrator Agent is the central routing layer that receives every user request and delegates it to the best specialized agent. It uses a lightweight LLM call to classify intent, select one or more agents, and generate focused sub-prompts for each.

## How It Works

When a message arrives, the orchestrator:

1. **Applies domain-specific routing rules** — v1.2.1 introduces specialized rules that handle common cases before the general router LLM:
   - **Rule 0 — Time-Delayed Action Priority**: Requests containing time expressions like "in X minutes" or "at X PM" are routed to the Timer Agent before domain matching, enabling fast-path execution.
   - **Rule 8 — Domain Inference Hints**: Implicit language mapping helps the router understand intent when no explicit domain is mentioned (e.g., "warmer" → climate, "brighter" → lights, "play" → music, "bedtime" → scene).
   - **Rule 9 — Multi-Domain Detection**: Requests spanning multiple independent domains (e.g., "turn on the lights and play music") are explicitly split and routed to multiple agents rather than collapsed into GeneralAgent.

2. **Classifies intent** — a router LLM call analyzes the user's request against the agent catalog, including per-agent example prompts for better pattern matching.

3. **Selects agents** — picks a primary agent and optionally additional agents for parallel execution.

4. **Generates sub-prompts** — creates focused, standalone instructions for each selected agent containing only the relevant part of the user's request.

```
User: "Dim the living room lights and play some jazz"
    |
    v
Orchestrator (router LLM)
    |
    +---> LightAgent:  "Dim the living room lights"
    +---> MusicAgent:  "Play some jazz"
    |
    v
Aggregated response to user
```

## Parallelization

When a request spans multiple domains (e.g., lights and music), the orchestrator routes to multiple agents in parallel. Each agent receives only the portion of the request relevant to its domain.

## Routing Improvements in v1.2.1

The introduction of small model support (Gemma 4, 9B parameters) required specialized routing rules to compensate for reduced reasoning capacity. These rules now bring accuracy from 0% to 100% on Gemma 4 while maintaining performance on larger models.

### Rule 0: Time-Delayed Action Priority

Any request containing temporal language is immediately routed to the Timer Agent before the general domain router runs:

```
User: "Turn off the AC in 5 minutes"
      |
      v
Router detects: "in 5 minutes" (Rule 0 match)
      |
      v
Immediate dispatch to TimerAgent
(TimerAgent internally routes to ClimateAgent via ScheduleAction)
```

This prevents ambiguity and ensures time-sensitive requests execute with proper scheduling.

### Rule 8: Domain Inference Hints

The router includes implicit language hints to recognize intent when domain keywords are absent:

| User Says | Maps To | Agent |
|---|---|---|
| "Make it warmer" | Temperature control | Climate |
| "Make it brighter" | Light dimming/intensity | Light |
| "Play some music" | Playback | Music |
| "Activate bedtime" | Scene execution | Scene |

These hints guide the router's selection without requiring explicit entity mentions.

### Rule 9: Multi-Domain Detection

Requests explicitly spanning multiple domains are decomposed into separate agent calls:

```
User: "Turn on the living room lights and play soft music"
      |
      v
Router applies Rule 9: multi-domain detected
      |
      +---> LightAgent:  "Turn on the living room lights"
      +---> MusicAgent:  "Play soft music"
      |
      v
Parallel execution → aggregated response
```

This prevents the router from incorrectly collapsing multi-intent requests into GeneralAgent.

### Per-Agent Example Prompts

The router now includes example patterns for each agent in the catalog (IncludeSkillExamples feature). These examples help small models recognize agent-specific patterns more reliably.

## Confidence & Clarification

The router assigns a confidence score to each routing decision:

| Confidence | Meaning |
|---|---|
| 0.90–1.00 | Clear, single-domain request with strong match |
| 0.70–0.89 | Clear domain but minor uncertainty (e.g., missing location) |
| 0.40–0.69 | Ambiguous target — may ask a clarifying question |
| 0.10–0.39 | Very unclear intent — picks most plausible agent and asks for clarification |

When confidence is low, the orchestrator generates a natural clarifying question without exposing internal agent names or routing details.

## Default Instructions

The following system prompt is sent to the router LLM when classifying and routing a request:

```text
# Role
You are Lucia.RouterExecutor. Your job is to analyze the user's smart-home request
and route it to the best specialized agent.

# Agent Catalog
You can only choose agents from this catalog. The agentId you return must exactly
match one of the IDs listed below.
<<AGENT_CATALOG>>

# Decision Rules
1) Agent selection
   - Map the user's intent to an agent whose domain and capabilities best match
     the request.
   - The chosen agentId must exactly match one of the catalog IDs listed above.
   - Prefer agents that explicitly mention the requested device/domain, location,
     or capability.

2) Parallelization (additionalAgents)
   - Populate additionalAgents when the user's request clearly spans multiple
     independent domains (e.g., "dim the living room lights and play soft music").
   - Do not include the primary agentId in additionalAgents.
   - Keep the list minimal and strictly relevant.

3) Per-agent instructions (agentInstructions)
   - Always provide agentInstructions — an array of objects, each with agentId
     and instruction.
   - Include an entry for the primary agentId and every agent in additionalAgents.
   - Each instruction must be a focused, standalone sub-prompt containing only the
     part of the user's request relevant to that agent, stripping away context
     meant for other agents.
   - For single-agent routing, extract just the actionable instruction without
     extraneous context (e.g., location data, timestamps, or multi-domain preamble
     that the agent doesn't need).

4) Ambiguity & Clarification
   - If the intent or target entity is ambiguous (missing room, device, or service),
     choose the most likely agentId, set a lower confidence, and put a concise
     clarifying question as the final sentence of reasoning ending with '?'.
   - Do not output anything outside the JSON object.

5) Confidence calibration
   - 0.90–1.00: Clear, single-domain request with strong catalog match.
   - 0.70–0.89: Clear domain but minor uncertainty (e.g., missing location but
     typical default).
   - 0.40–0.69: Ambiguous target/device; needs a clarifying question.
   - 0.10–0.39: Very unclear intent; pick the most plausible agent and ask a
     precise clarifying question.

6) Reasoning style
   - Be brief (1–2 sentences).
   - Reference the specific domain, location, or capability that informed the
     decision.
   - If clarification is needed, end reasoning with the clarifying question '?'
     as the last sentence.

# Output Contract (JSON only)
Return only a single JSON object conforming to the AgentChoiceResult schema with
fields: agentId, reasoning, confidence, additionalAgents, and agentInstructions.
```

When the router's confidence is too low to dispatch, a separate clarification prompt is used:

```text
You are a friendly home assistant. The system couldn't confidently determine which
capability should handle the user's request. Your job is to ask the user a brief,
natural clarification question so we can help them.

Rules:
- Never mention agent names, internal routing, or system internals.
- Frame the question in terms of what the user might want to do (lights, music,
  temperature, fans, timers, etc.).
- Keep it to 1-2 sentences maximum.
- Be conversational and helpful, not robotic.
```

## Configuration

The Orchestrator Agent runs in-process as part of the Lucia Agent Host. It uses the agent catalog (populated from both built-in and [custom agents](/docs/agents/custom-agents)) to make routing decisions. No additional configuration is required beyond registering agents.

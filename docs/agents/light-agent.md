---
sidebar_position: 2
title: Light Agent
---

# Light Agent

The Light Agent controls all lighting entities in your Home Assistant instance. It uses semantic entity search to resolve natural-language references like "the kitchen lights" or "the lamp next to the couch" into concrete entity IDs, then calls the appropriate Home Assistant services.

## Capabilities

| Action | Example Utterance |
|---|---|
| Turn on / off | "Turn off the bedroom lights" |
| Set brightness | "Set the living room to 40%" |
| Set color | "Make the desk lamp blue" |
| Set color temperature | "Set the kitchen lights to warm white" |
| Query state | "Are the garage lights on?" |

## Entity Resolution

The Light Agent relies on two key services to resolve user intent into Home Assistant entities.

### HybridEntityMatcher

The `HybridEntityMatcher` combines multiple matching strategies to find the right entity even when the user's phrasing is imprecise:

1. **Exact match** -- direct entity ID or friendly name lookup.
2. **Fuzzy match** -- Levenshtein-distance scoring against friendly names and aliases.
3. **Semantic match** -- embedding-based similarity search for natural-language references.

```
User: "Turn on the reading light"
            |
            v
   HybridEntityMatcher
     1. Exact  --> no match
     2. Fuzzy  --> "Reading Lamp" (score 0.91)
     3. Semantic --> "Reading Lamp" (score 0.88)
            |
            v
   Resolved: light.reading_lamp
```

:::tip
You can test entity matching interactively from the [Matcher Debug](/docs/dashboard/matcher-debug) page in the dashboard.
:::

### EntityLocationService

The `EntityLocationService` maps floor, area, and entity relationships so the agent can resolve spatial references:

- **Floor-level** -- "Turn off all the lights upstairs"
- **Area-level** -- "Dim the kitchen lights"
- **Entity-level** -- "Turn on the desk lamp"

The service builds its hierarchy from Home Assistant's floor, area, and device registries and keeps it in sync via the integration.

## Tool Functions

The Light Agent exposes the following tools to the LLM:

### `turn_on_light`

Turns on one or more lights with optional parameters.

```json
{
  "entity_ids": ["light.living_room_ceiling"],
  "brightness_pct": 80,
  "color_name": null,
  "color_temp_kelvin": null
}
```

### `turn_off_light`

Turns off one or more lights.

```json
{
  "entity_ids": ["light.living_room_ceiling", "light.living_room_lamp"]
}
```

### `set_brightness`

Sets brightness without changing on/off state.

```json
{
  "entity_ids": ["light.kitchen_pendant"],
  "brightness_pct": 50
}
```

### `set_color`

Sets the color of an RGB-capable light.

```json
{
  "entity_ids": ["light.desk_lamp"],
  "color_name": "blue"
}
```

### `set_color_temp`

Sets the color temperature in Kelvin.

```json
{
  "entity_ids": ["light.kitchen_pendant"],
  "color_temp_kelvin": 3000
}
```

### `get_light_state`

Returns the current state of one or more lights including brightness, color, and on/off status.

```json
{
  "entity_ids": ["light.living_room_ceiling"]
}
```

## Example Interaction

```
User: "Make the living room cozy"

Orchestrator -> LightAgent

LightAgent:
  1. EntityLocationService resolves "living room" -> area.living_room
  2. Finds lights in area: light.living_room_ceiling, light.living_room_lamp
  3. Calls turn_on_light with brightness_pct=40, color_temp_kelvin=2700
  4. Responds: "I've set the living room lights to a warm 40% brightness."
```

## Default Instructions

The following system prompt is sent to the LLM when the Light Agent handles a request:

```text
You are a specialized Light Control Agent for a home automation system.

Your responsibilities:
- Control lights and light switches (turn on/off, dimming, color changes)
- Report on light status when asked

You have two tools:
- GetLightsState: Find lights by name, area, or floor and return their current state
- ControlLights: Find lights by name, area, or floor and set them to a new state (on/off, brightness, color)

Both tools accept natural language search terms — you can use room names ("kitchen"),
floor names ("upstairs"), or specific light names ("bedroom lamp"). You can pass
multiple search terms at once to target lights across different locations.

## MANDATORY RULES
1. You MUST call a tool for EVERY request. NEVER assume the state of any light.
2. For control requests (turn on/off, dim, color): call ControlLights directly.
   Do NOT call GetLightsState first — just send the desired state.
3. For status questions ("are the lights on?"): call GetLightsState.
4. Use the user's own words as search terms. Don't try to guess entity IDs.

## Response format
* Keep responses short and informative. Examples: "Done — kitchen lights turned on
  at 50%.", "The living room light is on at 80% brightness."
* Do not offer additional assistance or suggestions.
* If no lights match, say so and ask for clarification ending with '?'.
* Focus only on lighting — politely redirect other home automation requests.
```

## Configuration

The Light Agent requires no additional configuration beyond a working Home Assistant connection. Entity matching behavior can be tuned from the [Entity Location](/docs/dashboard/entity-location) and [Matcher Debug](/docs/dashboard/matcher-debug) dashboard pages.

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

## Configuration

The Light Agent requires no additional configuration beyond a working Home Assistant connection. Entity matching behavior can be tuned from the [Entity Location](/docs/dashboard/entity-location) and [Matcher Debug](/docs/dashboard/matcher-debug) dashboard pages.

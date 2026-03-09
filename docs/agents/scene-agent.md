---
sidebar_position: 4
title: Scene Agent
---

# Scene Agent

The Scene Agent activates and manages Home Assistant scenes. Scenes are pre-configured snapshots of entity states -- a single scene can set lights, thermostats, media players, and any other entity to specific values in one action.

## Capabilities

| Action | Example Utterance |
|---|---|
| Activate scene | "Activate movie night" |
| List scenes | "What scenes are available?" |
| Describe scene | "What does the bedtime scene do?" |

## Scene Discovery

The Scene Agent queries Home Assistant for all registered `scene.*` entities at startup and keeps the list in sync via the integration's state change events. Each scene is indexed with its friendly name and entity ID so the agent can resolve natural-language references.

```
User: "Turn on movie mode"
            |
            v
   HybridEntityMatcher
     Fuzzy match --> "Movie Night" (scene.movie_night, score 0.89)
            |
            v
   scene.turn_on -> scene.movie_night
```

## Tool Functions

### `activate_scene`

Activates a Home Assistant scene by entity ID.

```json
{
  "entity_id": "scene.movie_night"
}
```

### `list_scenes`

Returns all available scenes with their friendly names.

```json
{
  "scenes": [
    { "entity_id": "scene.movie_night", "friendly_name": "Movie Night" },
    { "entity_id": "scene.bedtime", "friendly_name": "Bedtime" },
    { "entity_id": "scene.good_morning", "friendly_name": "Good Morning" }
  ]
}
```

### `get_scene_entities`

Returns the entities and their target states for a given scene. This is used when the user asks what a scene does.

```json
{
  "entity_id": "scene.movie_night",
  "entities": [
    { "entity_id": "light.living_room_ceiling", "state": "on", "brightness": 20 },
    { "entity_id": "light.tv_backlight", "state": "on", "color": [0, 0, 255] },
    { "entity_id": "media_player.living_room_tv", "state": "on" }
  ]
}
```

## Example Interaction

```
User: "Set the scene for movie night"

Orchestrator -> SceneAgent

SceneAgent:
  1. Matches "movie night" -> scene.movie_night
  2. Calls activate_scene with entity_id="scene.movie_night"
  3. Responds: "Movie Night scene activated. Living room lights dimmed and TV backlight set to blue."
```

:::tip
Scenes are created and managed in Home Assistant. You can build new scenes from the Home Assistant UI or via YAML configuration and they will be immediately available to the Scene Agent.
:::

## Default Instructions

The following system prompt is sent to the LLM when the Scene Agent handles a request:

```text
You are a specialized Scene Control Agent for a home automation system.

Your responsibilities:
- Activate Home Assistant scenes by name or entity ID
- List available scenes
- Find scenes by area/room

You have access to these scene control functions:
- ListScenesAsync: List all available scenes
- FindScenesByAreaAsync: Find scenes in a specific area (e.g., living room, bedroom)
- ActivateSceneAsync: Activate a scene by entity ID (e.g., scene.movie_mode)

## MANDATORY RULES
1. For "activate scene X" requests: use ListScenesAsync or FindScenesByAreaAsync
   first to find the scene entity ID, then call ActivateSceneAsync with that
   entity ID.
2. When the user mentions an area (e.g., "living room scene"), use
   FindScenesByAreaAsync to find scenes in that area.
3. Scene entity IDs use the format scene.NAME (e.g., scene.movie_mode,
   scene.romantic). Pass the full entity ID to ActivateSceneAsync.

## Response format
* Keep responses short and informative (e.g., "I've activated the movie scene.",
  "Scene 'Movie Mode' activated.").
* Do not offer to provide other assistance.
* Focus only on scenes — if asked about lights, climate, or other domains,
  politely indicate another agent handles those.
```

## Configuration

The Scene Agent requires no additional configuration. It automatically discovers all scenes from your connected Home Assistant instance.

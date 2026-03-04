---
sidebar_position: 4
title: Entity Management
---

# Entity Management

Lucia only interacts with Home Assistant entities that you explicitly expose. Entity management controls which devices, sensors, and automations are visible to the agent system, and how they are organized by location.

## Entity Visibility Filtering

By default, no entities are exposed to Lucia. You choose exactly which entities the agents can see and control. This gives you fine-grained security over what your AI assistant can do.

### Exposing Entities in Home Assistant

Home Assistant provides a built-in mechanism for controlling which entities are exposed to conversation agents:

1. Navigate to **Settings** > **Voice assistants**.
2. Click **Expose** at the top of the page.
3. Toggle on the entities you want Lucia to access.

Only entities marked as exposed will be sent to the Lucia agent host. Everything else is invisible to the agents.

:::info
Entity exposure is a Home Assistant feature, not a Lucia-specific setting. The same exposure list applies to all conversation agents configured in HA. If you need different exposure sets for different assistants, consider using separate HA instances or areas to segment access.
:::

## Dashboard Controls

The Lucia dashboard provides a read-only view of the entities that Home Assistant has exposed:

- **Entity list** -- view all entities currently visible to agents, grouped by domain (lights, switches, climate, etc.).
- **Status indicators** -- see whether each entity is available and responsive.
- **Area assignments** -- view the area and floor each entity belongs to.

Entity exposure changes must be made in Home Assistant. The Lucia dashboard reflects the current state but does not modify it.

## WebSocket Entity Synchronization

The Lucia custom component uses Home Assistant's **WebSocket API** to maintain a live list of exposed entities. When you add or remove an entity from the exposure list, the change is pushed to the Lucia agent host in real time -- no restart required.

The sync process works as follows:

1. On startup, the component fetches the full list of exposed entities via WebSocket.
2. The component subscribes to entity registry change events.
3. When an entity is exposed or unexposed, the component sends an update to the agent host.
4. The agent host updates its internal entity catalog.

## EntityLocationService

Lucia organizes entities into a **floor/area/entity hierarchy** using the `EntityLocationService`. This service maps Home Assistant's location model into a structure the agents can reason about.

### Hierarchy

```
Floor (e.g., "First Floor")
  └── Area (e.g., "Living Room")
        ├── light.living_room_ceiling
        ├── light.living_room_lamp
        ├── climate.living_room_thermostat
        └── media_player.living_room_tv
```

### How Agents Use Location

When you say "turn off the lights downstairs," the orchestrator:

1. Resolves "downstairs" to a floor using the `EntityLocationService`.
2. Finds all areas on that floor.
3. Collects all light entities in those areas.
4. Routes the command to the Light Agent with the filtered entity list.

This location awareness allows natural, context-rich commands without specifying exact entity IDs.

### Configuring Floors and Areas

Floors and areas are configured in Home Assistant:

1. **Floors** -- Navigate to **Settings** > **Areas & Zones** > **Floors**. Create floors like "First Floor," "Second Floor," or "Basement."
2. **Areas** -- Navigate to **Settings** > **Areas & Zones**. Assign each area to a floor.
3. **Entities** -- Assign entities to areas through their device or entity settings.

:::tip
Well-organized floors and areas significantly improve Lucia's ability to understand location-based commands. Take the time to assign every exposed entity to the correct area and floor.
:::

## Best Practices

- **Expose only what you need.** Start with the entities you actively want to control via voice and expand from there.
- **Use descriptive area names.** "Living Room" is much better than "Room 1" for natural language understanding.
- **Assign all exposed entities to areas.** Entities without area assignments cannot be targeted by location-based commands.
- **Review the exposure list periodically.** As you add new devices, make sure to expose them if you want Lucia to control them.

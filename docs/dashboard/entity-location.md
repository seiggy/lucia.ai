---
sidebar_position: 15
title: Entity Location
---

# Entity Location

The Entity Location page lets you manage the hierarchical organization of Home Assistant entities within Lucia.

![Entity Location](/img/dashboard/entity-location.png)

## Hierarchy

Entities are organized into a three-level hierarchy:

- **Floors** -- top-level grouping (e.g., Ground Floor, First Floor).
- **Areas** -- rooms or zones within a floor (e.g., Kitchen, Living Room).
- **Entities** -- individual devices and sensors within an area.

You can drag and drop entities between areas and reorder floors to match your home layout.

## Visibility Toggle

Each entity has a visibility toggle. Hidden entities are excluded from Lucia's natural language matching, keeping responses focused on the devices you actively use. Bulk visibility controls are available at the area and floor level.

## Home Assistant Sync

Click **Pull from HA** to fetch the current list of exposed entities from Home Assistant via WebSocket. Lucia will update the hierarchy with any new entities, areas, or floors that have been added since the last sync. Existing assignments are preserved.

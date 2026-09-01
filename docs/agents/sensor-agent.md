---
sidebar_position: 8
title: Sensor Agent
---

# Sensor Agent

The Sensor Agent provides read-only access to Home Assistant `sensor` and `binary_sensor` entities. It handles temperature, humidity, motion, doors, windows, batteries, power, illuminance, and similar readings.

## Capabilities

| Action | Example |
|---|---|
| Read a sensor | "What is the living room temperature?" |
| Check a binary sensor | "Is the front door open?" |
| Query an area | "Show me the sensors in the kitchen" |
| Query a device class | "Are any motion sensors active?" |

The agent resolves sensors by name, alias, area, and device type, then reads the current Home Assistant state before answering.

## Configuration

The `SensorControlSkill` section is hot-reloadable:

| Setting | Default | Purpose |
|---|---:|---|
| `EntityDomains` | `sensor`, `binary_sensor` | Domains included in sensor search |
| `HybridSimilarityThreshold` | `0.55` | Minimum entity match score |
| `EmbeddingWeight` | `0.4` | Weight assigned to embedding similarity |
| `CacheRefreshMinutes` | `5` | Home Assistant sensor cache refresh interval |

Changing the embedding provider invalidates cached sensor embeddings so they can be rebuilt safely.

---
sidebar_position: 13
title: Presence Detection
---

# Presence Detection

The Presence Detection page shows real-time occupancy information for rooms in your home, powered by auto-discovered sensors from Home Assistant.

## Sensor Discovery

Lucia automatically discovers compatible sensors from your Home Assistant instance, including:

- **Motion sensors** -- PIR-based motion detectors.
- **Occupancy sensors** -- binary occupancy indicators.
- **mmWave sensors** -- millimeter-wave presence detectors that can sense stationary occupants.

No manual configuration is required. Sensors are mapped to rooms based on their Home Assistant area assignments.

## Room-Level Confidence

Each room displays a confidence score representing how likely it is that someone is present. The score is calculated by combining signals from all sensors assigned to that room. Rooms with multiple sensor types produce higher-confidence readings.

## Dashboard View

Rooms are displayed as cards with color-coded confidence indicators. Green indicates high confidence of presence, yellow indicates uncertain, and gray indicates empty. Sensor details and last-triggered timestamps are visible when you expand a room card.

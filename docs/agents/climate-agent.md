---
sidebar_position: 3
title: Climate Agent
---

# Climate Agent

The Climate Agent manages HVAC systems and fans through Home Assistant's `climate` and `fan` domains. It handles temperature adjustments, mode selection, and fan speed control using the same semantic entity resolution as the Light Agent.

## Capabilities

| Action | Example Utterance |
|---|---|
| Set temperature | "Set the thermostat to 72" |
| Change HVAC mode | "Switch to cooling mode" |
| Fan speed | "Turn the bedroom fan to medium" |
| Turn on / off | "Turn off the AC" |
| Query state | "What's the thermostat set to?" |

## Supported Entity Domains

The Climate Agent works with two Home Assistant entity domains:

### `climate.*`

HVAC thermostats, mini-splits, and smart AC controllers.

### `fan.*`

Ceiling fans, portable fans, and exhaust fans.

## Tool Functions

### `set_temperature`

Sets the target temperature for a climate entity.

```json
{
  "entity_id": "climate.living_room_thermostat",
  "temperature": 72,
  "unit": "F"
}
```

:::info
The agent infers Fahrenheit or Celsius from your Home Assistant unit system configuration. You can also say "Set it to 22 Celsius" explicitly.
:::

### `set_hvac_mode`

Changes the operating mode of a climate entity.

```json
{
  "entity_id": "climate.living_room_thermostat",
  "mode": "cool"
}
```

Supported modes depend on the device but commonly include:

| Mode | Description |
|---|---|
| `heat` | Heating only |
| `cool` | Cooling only |
| `heat_cool` | Auto-switch between heating and cooling |
| `auto` | Device-managed automatic mode |
| `fan_only` | Fan circulation without heating or cooling |
| `off` | System off |

### `set_fan_speed`

Sets the speed of a fan entity.

```json
{
  "entity_id": "fan.bedroom_ceiling",
  "percentage": 66
}
```

Some fans also support named presets:

```json
{
  "entity_id": "fan.bedroom_ceiling",
  "preset_mode": "sleep"
}
```

### `turn_on` / `turn_off`

Turns a climate or fan entity on or off.

```json
{
  "entity_id": "climate.living_room_thermostat"
}
```

### `get_climate_state`

Returns current state including temperature, target temperature, mode, and humidity (if available).

```json
{
  "entity_id": "climate.living_room_thermostat"
}
```

Response:

```json
{
  "state": "cool",
  "current_temperature": 75,
  "target_temperature": 72,
  "humidity": 45,
  "unit": "F"
}
```

## Example Interaction

```
User: "It's too warm in here, cool it down a bit"

Orchestrator -> ClimateAgent

ClimateAgent:
  1. Resolves "here" using conversation context -> area.living_room
  2. Finds climate.living_room_thermostat in area
  3. Gets current state: target is 74 F, mode is "heat_cool"
  4. Calls set_temperature with temperature=70
  5. Calls set_hvac_mode with mode="cool"
  6. Responds: "I've set the living room to cool at 70 F."
```

## Configuration

The Climate Agent uses the same `EntityLocationService` and `HybridEntityMatcher` as the Light Agent for entity resolution. No additional configuration is required beyond a working Home Assistant connection.

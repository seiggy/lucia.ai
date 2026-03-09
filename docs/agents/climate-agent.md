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

## Default Instructions

The following system prompt is sent to the LLM when the Climate Agent handles a request:

```text
You are a specialized Climate Control Agent for a home automation system.

Your responsibilities:
- Control HVAC systems (set temperature, change modes like heat/cool/auto/off)
- Control fans (turn on/off, adjust speed, set direction)
- Monitor temperature, humidity, and comfort levels
- Respond to comfort-related requests using natural language

## Available Tools
### Climate/HVAC Tools:
- FindClimateDevice: Find an HVAC/thermostat by name or description
- FindClimateDevicesByArea: Find all climate devices in a specific area
- GetClimateState: Get current state (temperature, mode, humidity, etc.)
- SetClimateTemperature: Set the target temperature
- SetClimateHvacMode: Set the HVAC mode (heat, cool, auto, off, heat_cool, dry, fan_only)
- SetClimateFanMode: Set the HVAC fan mode (auto, low, medium, high, on)
- SetClimateHumidity: Set the target humidity percentage
- SetClimatePresetMode: Set the HVAC preset mode (e.g., none, sleep, eco, away)
- SetClimateSwingMode: Set the HVAC swing/vane mode (e.g., on, off, Auto, Position 1-5)
- GetComfortAdjustment: Get the configured comfort adjustment value in °F

### Fan Tools:
- FindFan: Find a fan by name or description
- FindFansByArea: Find all fans in a specific area
- GetFanState: Get current fan state (on/off, speed, direction, oscillation)
- SetFanState: Turn a fan on or off
- SetFanSpeed: Set fan speed as a percentage (0-100)
- SetFanDirection: Set fan direction (forward/reverse)
- SetFanOscillation: Toggle fan oscillation on or off
- SetFanPresetMode: Set a fan's preset mode (e.g., auto, nature, sleep)

## MANDATORY RULES — NEVER SKIP THESE
1. You MUST call at least one tool function for EVERY request. NEVER respond based
   on assumptions.
2. You do NOT know the current state of any device. You MUST call a tool to check.
3. NEVER say a device "is already off/on" without first calling the appropriate
   Get state tool.
4. For control requests: call Find FIRST to get entity IDs, then call the
   appropriate control tool.
5. For status questions: call Find FIRST, then call the appropriate Get state tool.

## Handling Comfort Requests
When users express comfort with natural language:
- "I'm cold" or "it's chilly": Call GetComfortAdjustment to get the adjustment
  value, then find the climate device in the user's area, check its current state,
  and INCREASE the target temperature by the comfort adjustment value.
  Also consider turning on heat mode if it's in cool/off mode.
- "I'm hot" or "it's warm": Call GetComfortAdjustment to get the adjustment value,
  then find the climate device in the user's area, check its current state,
  and DECREASE the target temperature by the comfort adjustment value.
  Also consider turning on fans in the area.
- "I'm comfortable" or "it's perfect": Acknowledge and take no action.

## Understanding User Context
The orchestrator provides context about where the user is located. Use this
to determine which area's devices to control when the user doesn't specify.
For example, if the user says "I'm cold" and they're in the living room,
find and adjust the climate device that serves the living room.

## Fan Direction Guidance
- Forward (counter-clockwise): Creates a wind-chill effect, good for summer cooling
- Reverse (clockwise): Pushes warm air down from ceiling, good for winter heating

## Response Format
* Keep responses short and informative. Examples: "I've set the thermostat to 72°F.",
  "The living room is currently 68°F with heat mode active."
* Do not offer additional assistance.
* If you need clarification, end your response with '?'.
* Focus only on climate and fan control — if asked about other features,
  politely indicate that another agent handles those functions.
```

## Configuration

The Climate Agent uses the same `EntityLocationService` and `HybridEntityMatcher` as the Light Agent for entity resolution. No additional configuration is required beyond a working Home Assistant connection.

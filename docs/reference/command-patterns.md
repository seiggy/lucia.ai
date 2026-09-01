---
sidebar_position: 1
title: Command Pattern Reference
---

# Command Pattern Reference

Command patterns are template-based rules that enable the **fast-path command parser** to match voice commands to specific skill actions and execute them directly against Home Assistant—with zero LLM involvement. This results in sub-50ms response times for recognized commands like "turn on the kitchen lights" or "set the thermostat to 72 degrees."

## What Are Command Patterns?

A command pattern is a template that:

1. **Defines a sentence structure** — placeholders and optional segments
2. **Captures entity/parameter values** from the user's voice input
3. **Maps to a skill and action** — e.g., LightControlSkill + toggle
4. **Executes directly** — bypasses the orchestrator's LLM routing and agent dispatch

**Example pattern:**
```
turn [on|off] {light} [in the {area}]
```

Matches:
- "turn on the bedroom lights"
- "turn off the kitchen"
- "turn on the lights in the living room"

Does not match:
- "turn the lights purple" (unsupported action—falls back to LLM)
- "turn on my speakers" (non-light device—bails to LLM)

## Pattern Syntax

### Required Placeholder: `{name}`

Captures any text at this position.

```
turn on {light}
```

- Input: "turn on the ceiling fan"
- Captures: `light = "ceiling fan"`

Matched text is resolved against Home Assistant entities to find the target device.

### Constrained Placeholder: `{name:opt1|opt2}`

Captures only if the text matches one of the listed options.

```
turn {state:on|off} the {light}
```

- Input: "turn on the lights" → matches
- Captures: `state = "on"`, `light = "lights"`
- Input: "turn purple the lights" → no match
- Reason: "purple" doesn't match `on|off`

Use constrained placeholders for actions with finite options (on/off, increase/decrease, heat/cool).

### Optional Segment: `[optional text]`

Segments within square brackets may or may not appear in the input.

```
turn [on|off] the {light} [in the {area}]
```

- Input: "turn on the lights" → matches
- Input: "turn on the lights in the kitchen" → matches
- Input: "turn off the lights" → matches

Both options and non-options can be optional: `[set to {temp} degrees]`.

### Combining Syntax

You can mix all three:

```
set the {device} in the {area} to {temp:cool|warm|auto} mode
```

Matches:
- "set the ac in the bedroom to cool mode"

Does not match:
- "set the ac in the bedroom to blue mode" (blue ∉ `{cool|warm|auto}`)

## Confidence Scoring

When multiple patterns could match the same input, the parser scores each candidate:

1. **Exact word matches** — patterns that match the most constrained options score higher
2. **Captured text quality** — more specific captures (fewer words) score higher
3. **Priority-based tiebreaking** — skill priority (lights > scenes > climate) breaks ties

Example: For input "turn on the lights", patterns with constrained placeholders (`{state:on|off}`) score higher than patterns with open placeholders (`{action}`).

The highest-scoring pattern wins. If no pattern scores above the threshold, the parser falls back to the LLM.

## Built-in Patterns by Skill

### LightControlSkill

| Action | Example Pattern | Notes |
|--------|---|---|
| **toggle** | `` `turn [on\|off] {light}` `` | Basic on/off |
| **toggle** | `` `switch [on\|off] the {light}` `` | Alternate phrasing |
| **brightness** | `` `set {light} to {brightness:0-100}%` `` | Percentage input |
| **brightness** | `` `dim the {light} to {brightness}%` `` | Dim variant |
| **color** | `` `set {light} to {color}` `` | Color names or values |

### ClimateControlSkill

| Action | Example Pattern | Notes |
|--------|---|---|
| **set_temperature** | `` `set [the] temperature to {temp:60-85}` `` | Thermostat control |
| **set_temperature** | `` `set the {device} to {temp}` `` | Device-specific |
| **adjust_temperature** | `` `raise [the] temperature [by\|to] {delta}` `` | Relative adjustment |
| **set_mode** | `` `switch [to\|the] {mode:heat\|cool\|auto}` `` | Mode selection |

### SceneControlSkill

| Action | Example Pattern | Notes |
|--------|---|---|
| **activate** | `` `activate [the] {scene}` `` | Scene by name |
| **activate** | `` `turn on [the] {scene}` `` | Alternate trigger |

## Non-Light Device Detection & Bail

**Important:** The parser deliberately rejects commands targeting non-light devices.

If a pattern matches but the captured entity is a **non-light device** (fan, AC, TV, lock, door, speaker, vacuum, etc.), the parser **bails to the LLM** instead of executing the light control skill.

Example: Input "turn on the office fan"

1. Matches pattern: `turn [on|off] {light}`
2. Captures: `light = "office fan"`
3. Parser detects "fan" in device name → **bails to LLM**
4. LLM routes to ClimateAgent (fan control) instead

This prevents light control commands from being misapplied to non-light entities.

### Temporal Preposition Handling

**"in" and "at" only trigger bail when followed by time tokens**, not spatial prepositions.

| Input | Behavior | Reason |
|-------|----------|--------|
| "lights on in the kitchen" | Match | "in" used spatially (preposition for location) |
| "turn on lights at 7pm" | Bail to LLM | "at" followed by time token (temporal) |
| "lights in 5 minutes" | Bail to LLM | "in" followed by duration (temporal) |
| "lights in the bedroom" | Match | "in" is spatial preposition |

This distinction prevents false positives where spatial descriptions ("in the kitchen") are confused with temporal ones ("in 5 minutes").

## DirectSkillExecutor: How Matched Patterns Execute

When a pattern matches and validation passes, the `DirectSkillExecutor` dispatches the matched route to the appropriate skill method:

1. **Resolve entities** — captured text is matched against Home Assistant entity registry using semantic similarity
2. **Build parameters** — captured values are assembled into the skill method parameters
3. **Call skill** — direct call to `LightControlSkill.SetLightBrightness()`, `ClimateControlSkill.SetTemperature()`, etc.
4. **Return result** — skill method executes against Home Assistant and returns success/error

The skill execution is synchronous and fast—typical round-trip < 50ms.

## Response Templates

After a pattern is matched and executed, the parser consults **Response Templates** to compose a natural-sounding response.

Example:

Pattern: `turn [on|off] {light}`  
Input: "turn on the bedroom lights"  
Skill execution: Success

Response template: `"{entity} {action}."` interpolates to:  
"Bedroom lights turned on."

See [`docs/dashboard/response-templates.md`](/docs/dashboard/response-templates) for template management.

## API Endpoint: `GET /api/conversation/patterns`

Inspect all registered patterns and their metadata:

```bash
curl http://localhost:7235/api/conversation/patterns
```

Response:

```json
[
  {
    "skillId": "LightControlSkill",
    "action": "light.toggle",
    "pattern": "turn [on|off] {light}",
    "placeholders": ["light"],
    "exampleTemplates": [
      "{entity} {action}.",
      "Done! I've {action} {entity}."
    ]
  },
  {
    "skillId": "ClimateControlSkill",
    "action": "climate.set_temperature",
    "pattern": "set [the] temperature to {temp}",
    "placeholders": ["temp"],
    "exampleTemplates": [
      "Thermostat set to {action}."
    ]
  }
]
```

This endpoint is used by the dashboard's Response Templates page to populate skill/action dropdowns.

## Full API Reference

For comprehensive REST API documentation including request/response examples, see [`docs/api/conversation-api.md`](/docs/api/conversation-api).

Key endpoints:

- **`POST /api/conversation`** — Parse and execute a command (with LLM fallback)
- **`GET /api/conversation/patterns`** — Inspect registered patterns (this document)

## Performance Characteristics

| Operation | Latency |
|-----------|---------|
| Pattern matching | < 5ms |
| Entity resolution | 10-30ms |
| Skill execution | 20-50ms |
| Response rendering | < 1ms |
| **Total** | **< 50ms** (typical) |

Compare to LLM-based orchestration: typically 1-3 seconds.

## Fallback to LLM

The parser falls back to the LLM orchestrator if:

1. **No pattern matches** — no template fits the input structure
2. **Pattern matches but confidence is low** — user phrasing is ambiguous
3. **Non-light device detected** — bail signal triggered
4. **Temporal preposition detected** — user is referring to timing, not immediate action
5. **Skill execution fails** — Home Assistant returns an error
6. **Unrecognized entity** — captured text doesn't resolve to a real Home Assistant entity

Fallback is transparent to the user. The parser returns an SSE stream and the LLM handles the request from scratch.

## Extending Command Patterns

**Note:** Command patterns are currently hard-coded in the codebase. Custom pattern definition via dashboard is planned for a future release. For now, to add patterns:

1. Edit `lucia.Wyoming/CommandRouting/CommandPatternDefinitions.cs`
2. Add new pattern to the appropriate skill section
3. Rebuild and restart

See [lucia-dotnet/RELEASE_NOTES.md](https://github.com/seiggy/lucia-dotnet/blob/main/RELEASE_NOTES.md) for pattern evolution across releases.

## See Also

- **Conversation API** — [`docs/api/conversation-api.md`](/docs/api/conversation-api)
- **Response Templates** — [`docs/dashboard/response-templates.md`](/docs/dashboard/response-templates)
- **Fast-Path Overview** — [Conversation Command Parser](/docs/api/conversation-api#overview)

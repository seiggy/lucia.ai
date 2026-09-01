---
sidebar_position: 5
title: Conversation Command Parser API
---

# Conversation Command Parser API

The Conversation Command Parser API implements a **fast-path LLM bypass** for pattern-matched smart home commands. Common voice queries like "turn on the kitchen lights" or "set the temperature to 72" are matched against registered command templates, then executed directly against Home Assistant—delivering sub-50ms response times without LLM involvement. For unrecognized requests, the system seamlessly falls back to LLM-based orchestration.

## Overview

This is a two-tier architecture:

```
User utterance
    ↓
Pattern match? ──YES→ Direct skill execution (JSON response) ⚡ ~30–50ms
    ↓ NO
SSE stream to LLM orchestrator ↩️ ~2–5s (normal flow)
```

The API is consumed by:
- **Wyoming Voice Platform** — transcribes user speech and sends text to this endpoint
- **Home Assistant conversation integration** — forwards user messages for command execution
- **Dashboard Conversation Test page** — interactive testing interface
- **Custom home automation clients** — any application that needs fast smart home command execution

## POST /api/conversation

**Main endpoint** for executing or routing conversation requests.

### Request

```json
{
  "text": "turn on the kitchen lights",
  "conversationId": "550e8400-e29b-41d4-a716-446655440000",
  "context": {
    "device_id": "esp32_living_room",
    "area": "living_room",
    "type": "remote",
    "user_id": "zack",
    "timestamp": "2026-04-15T14:30:45Z",
    "location": [39.7392, -104.9903]
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `text` | string | ✓ | User's spoken or typed request |
| `conversationId` | string (UUID) | — | Unique conversation session. Server generates if omitted. |
| `context.device_id` | string | — | Originating device ID (e.g., ESP32 name) |
| `context.area` | string | — | Room/area context (e.g., "kitchen", "bedroom") |
| `context.type` | string | — | Device type (e.g., "remote", "voice", "mobile") |
| `context.user_id` | string | — | User identifier for multi-user homes |
| `context.timestamp` | ISO 8601 | — | Request timestamp |
| `context.location` | [lat, lon] | — | Geographic coordinates |

**Note:** `context` is optional, but area information significantly improves entity resolution for commands like "lights in the kitchen."

### Response: Command Matched (200 OK)

```json
{
  "conversationId": "550e8400-e29b-41d4-a716-446655440000",
  "matched": true,
  "command": {
    "skill": "LightControlSkill",
    "action": "toggle",
    "entities": ["light.kitchen_ceiling", "light.kitchen_under_cabinet"],
    "parameters": {
      "brightness": null,
      "color": null
    }
  },
  "response": "Turning on the kitchen lights.",
  "responseMetadata": {
    "source": "pattern_match",
    "executionTimeMs": 23,
    "templateUsed": "Turning on the `{entity}` lights."
  }
}
```

**Response fields:**

| Field | Description |
|-------|-------------|
| `conversationId` | Session ID for multi-turn continuity |
| `matched` | `true` — command was pattern-matched |
| `command.skill` | Executed skill (LightControlSkill, ClimateControlSkill, SceneControlSkill) |
| `command.action` | Action name (e.g., "toggle", "set_temperature", "activate") |
| `command.entities` | Resolved Home Assistant entity IDs |
| `command.parameters` | Extracted command parameters (brightness, temperature, etc.) |
| `response` | Human-readable response text (from response templates) |
| `responseMetadata.source` | "pattern_match" — command was parsed locally |
| `responseMetadata.executionTimeMs` | Actual execution latency |
| `responseMetadata.templateUsed` | Response template that generated the response |

### Response: LLM Fallback (200 OK, Server-Sent Events)

When a command doesn't match patterns, the response is an SSE stream:

```bash
curl -N http://localhost:5151/api/conversation \
  -H "Content-Type: application/json" \
  -d '{"text": "write a poem about smart homes"}'
```

```
data: {"type":"response","partial":"Writing","conversationId":"550e8400-e29b-41d4-a716-446655440000"}
data: {"type":"response","partial":" a poem","conversationId":"550e8400-e29b-41d4-a716-446655440000"}
data: {"type":"response","partial":"..."}
data: {"type":"done","matched":false,"response":"...full response...","responseMetadata":{"source":"llm_orchestrator","executionTimeMs":2341}}
```

| Stream message | Description |
|---|---|
| `type: "response"` | Partial token streamed from LLM |
| `type: "done"` | Final response complete |
| `matched: false` | LLM orchestrator handled this |

**JavaScript example:**

```javascript
const response = await fetch('/api/conversation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'turn on the kitchen lights',
    context: { area: 'kitchen' }
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const text = decoder.decode(value);
  const lines = text.trim().split('\n');
  
  lines.forEach(line => {
    if (line.startsWith('data: ')) {
      const event = JSON.parse(line.slice(6));
      if (event.type === 'response') console.log(event.partial);
      if (event.type === 'done') console.log('Final:', event.response);
    }
  });
}
```

## GET /api/conversation/patterns

**Read-only endpoint** exposing all registered command patterns for dashboard tooling and client discovery.

### Response

```json
[
  {
    "id": "light-toggle",
    "skillId": "LightControlSkill",
    "action": "toggle",
    "template": "turn [on|off] the {entity} [in {area}]",
    "placeholders": [
      { "name": "entity", "type": "string", "description": "Light name or entity ID" },
      { "name": "area", "type": "string", "description": "Room or area", "optional": true }
    ],
    "examples": [
      "turn on the lights",
      "turn off the kitchen ceiling light",
      "turn on the lights in the bedroom"
    ],
    "confidence": 0.95
  },
  {
    "id": "climate-set-temp",
    "skillId": "ClimateControlSkill",
    "action": "set_temperature",
    "template": "set the temperature to {temp:number}",
    "placeholders": [
      { "name": "temp", "type": "number", "description": "Target temperature (°F)" }
    ],
    "examples": [
      "set the temperature to 72",
      "make it 68 degrees"
    ],
    "confidence": 0.92
  }
]
```

## Command Pattern Matching

Patterns use a lightweight template syntax:

### Template Syntax

| Syntax | Meaning | Example |
|--------|---------|---------|
| `{name}` | Required capture | `{entity}` captures the device name |
| `{name:opt1\|opt2}` | Choice capture | `{action:on\|off}` captures "on" or "off" |
| `[optional]` | Optional phrase | `[in {area}]` makes the area specification optional |
| Literal text | Exact phrase match | "turn" matches the word "turn" |

### Example Patterns

**Light toggle:**
```
turn [on|off] the {entity} [in {area}]
```
Matches:
- "turn on the lights"
- "turn off the kitchen ceiling light"
- "turn on the bedroom lights"

**Climate:**
```
set the temperature to {temp:number}
```
Matches:
- "set the temperature to 72"
- "make it 68 degrees"

**Scene activation:**
```
activate the {scene_name} scene
```
Matches:
- "activate the movie scene"

### Confidence Scoring & Priority

Each pattern has an associated confidence score (0.0–1.0). When multiple patterns match:

1. **Exact phrase matches** score highest
2. **Partial token matches** score lower
3. **Low-confidence matches** are rejected if they fall below `MinConfidenceThreshold`
4. **Priority tiebreaker** — when scores are equal, the **most recently registered** pattern wins

**Tiebreaker example:** If both "turn on the lights" and "activate the lights" have 0.92 confidence, whichever was registered/edited last takes precedence.

## Supported Skills

### LightControlSkill

**Actions:** `toggle`, `on`, `off`, `set_brightness`, `set_color`

**Example patterns:**
- "turn on the kitchen lights"
- "set the bedroom brightness to 50%"
- "make the living room lights red"

**Response templates:**
- Turning on the `{entity}` lights.
- Brightness set to `{brightness}`%.

### ClimateControlSkill

**Actions:** `set_temperature`, `set_mode`, `set_fan_speed`

**Example patterns:**
- "set the temperature to 72 degrees"
- "switch to cooling mode"

**Response templates:**
- Temperature set to `{temperature}`°F.
- Climate mode changed to `{mode}`.

### SceneControlSkill

**Actions:** `activate`

**Example patterns:**
- "activate the movie scene"
- "turn on the bedtime scene"

**Response templates:**
- Activating `{scene_name}`.

### Non-Light Device Bail

Commands referencing **non-light devices** automatically defer to the LLM:

```
Devices triggering bail: fan, ac, tv, lock, door, speaker, vacuum, etc.
```

**Example:** "turn on the office fan" does NOT match `LightControlSkill` and routes to the LLM orchestrator instead.

**Temporal preposition bail:** Time-related prepositions ("in 5 minutes", "at 3pm") also trigger LLM routing, as they likely belong to the Timer Agent.

## Response Templates

Response templates are customizable MongoDB documents:

```json
{
  "skillId": "LightControlSkill",
  "action": "toggle",
  "template": "Turning on the {entity}.",
  "variants": [
    "Lights on in {area}.",
    "Got it, turning on the {entity}.",
    "The {entity} are now on."
  ],
  "seedDefault": true
}
```

**Interpolation placeholders:**

| Placeholder | Value |
|---|---|
| `` `{entity}` `` | Resolved device friendly name |
| `` `{action}` `` | Action name (e.g., "toggle", "set_temperature") |
| `` `{area}` `` | Room/area context |
| `` `{brightness}` `` | Brightness value (0–100) |
| `` `{temperature}` `` | Temperature in °F |
| `` `{scene_name}` `` | Scene activation name |

**Variant selection:** One variant is chosen randomly per response for natural variety. The same random seed (based on request context) ensures deterministic responses during the same conversation.

**Dashboard management:** Response Templates page provides full CRUD with:
- Skill/Action dropdown population from patterns API
- Token insertion buttons for placeholder shortcuts
- Template preview with sample values
- Bulk edit and export functionality

## DirectSkillExecutor

The direct execution path:

```python
def execute_command(command: ParsedCommand, context: ConversationContext) -> Result:
    # 1. Resolve entities from captured text + area context
    entities = resolver.resolve(command.captured_entities, context.area)
    
    # 2. Execute skill method directly
    if command.skill == "LightControlSkill":
        result = light_skill.toggle(entities)
    elif command.skill == "ClimateControlSkill":
        result = climate_skill.set_temperature(entities, command.parameters.temp)
    
    # 3. Interpolate response template
    response = template_renderer.render(
        template=command.response_template,
        entity=entities[0].friendly_name,
        action=command.action,
        area=context.area
    )
    
    return { matched: true, response, executionTimeMs: elapsed }
```

## Telemetry & Dashboard Metrics

OpenTelemetry counters track command parsing:

```csharp
Meter.CreateCounter<long>("conversation.command_parsed")
Meter.CreateCounter<long>("conversation.llm_fallback")
Meter.CreateCounter<long>("conversation.command_parsed.errors")
```

**Activity Dashboard:**
- Command Parsed counter — total locally-executed commands
- LLM Fallback counter — total LLM-routed requests
- Parser Rate % — ratio of command_parsed / (command_parsed + llm_fallback)

## Multi-Turn Conversations

Each conversation is identified by a stable `conversationId`:

```
Turn 1: { text: "turn on the lights", conversationId: <generated UUID> }
    ↓ Server returns UUID
Turn 2: { text: "make them brighter", conversationId: <same UUID> }
    ↓ Context from Turn 1 persists
```

**Server-side behavior:**
- If `conversationId` is omitted, server generates a new UUID
- If provided, the existing conversation state is loaded
- Multi-turn context (area, device, user) is preserved across commands

## Error Handling

### 400 Bad Request

```json
{
  "error": "Invalid request",
  "details": "Missing required field: text"
}
```

### 503 Service Unavailable

```json
{
  "error": "Service unavailable",
  "details": "Home Assistant connection lost",
  "responseMetadata": {
    "source": "error",
    "executionTimeMs": 150
  }
}
```

LLM fallback fails if Home Assistant is unreachable and the matched command requires entity resolution.

## curl Examples

**Command match:**
```bash
curl -X POST http://localhost:5151/api/conversation \
  -H "Content-Type: application/json" \
  -d '{
    "text": "turn on the kitchen lights",
    "context": { "area": "kitchen" }
  }'
```

**LLM fallback (streaming):**
```bash
curl -N -X POST http://localhost:5151/api/conversation \
  -H "Content-Type: application/json" \
  -d '{"text": "what is the weather like"}'
```

**List patterns:**
```bash
curl http://localhost:5151/api/conversation/patterns
```

## Integration with Wyoming Voice Platform

See [Wyoming Voice Platform](../architecture/voice-platform.md) for the full voice-to-command flow.

## Next Steps

- [Response Templates Dashboard](../dashboard/overview.md) — manage templates from the UI
- [Wyoming Voice Platform](../architecture/voice-platform.md) — voice transcription to command parsing
- [REST API Reference](./rest-api.md) — full API documentation

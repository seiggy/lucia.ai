---
sidebar_position: 5
title: Conversation API
---

# Conversation API

As of v1.2.0, the Home Assistant integration uses the new `POST /api/conversation` REST endpoint instead of JSON-RPC. This page explains the request/response flow and documents both the new REST endpoint and the command pattern matching system.

## Overview

When a user speaks or types a command in Home Assistant, the Assist pipeline forwards it to the configured conversation agent. If Lucia is set as the conversation agent, the custom component receives the text and sends it to the Lucia agent host via REST for processing.

## REST Conversation Endpoint

### POST /api/conversation

The primary endpoint for processing conversations.

**Request:**

```bash
curl -X POST https://localhost:7235/api/conversation \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Turn on the kitchen lights",
    "conversationId": "ha-conv-abc123",
    "context": {
      "deviceId": "light.kitchen_ceiling",
      "area": "kitchen",
      "type": "light",
      "userId": "ha-user-1",
      "timestamp": "2026-02-20T10:30:00Z",
      "location": null
    }
  }'
```

**Structured Context:**

The `context` object contains:

| Field | Type | Description |
|-------|------|-------------|
| `deviceId` | string | The Home Assistant entity ID triggering the command |
| `area` | string | Physical location (e.g., "kitchen", "living room") |
| `type` | string | Entity domain (light, climate, fan, etc.) |
| `userId` | string | User identifier for personalization |
| `timestamp` | ISO 8601 | Request time for temporal commands |
| `location` | object (optional) | GPS coordinates `{lat, lon}` |

### Instant JSON Response (Command Parsed)

When Lucia's command parser pattern-matches a common command (light on/off, climate setpoint, scene activation), it responds instantly with JSON:

```json
{
  "response": {
    "speech": {
      "plain": {
        "speech": "I've turned on the kitchen lights."
      }
    },
    "response_type": "action_done",
    "data": {
      "targets": [
        {
          "id": "light.kitchen_ceiling",
          "name": "Kitchen Ceiling",
          "type": "entity"
        }
      ],
      "success": ["light.kitchen_ceiling"],
      "failed": []
    }
  },
  "conversationId": "ha-conv-abc123"
}
```

### SSE Streaming Response (LLM Fallback)

For complex requests that don't match known patterns, Lucia falls back to the LLM orchestrator and streams the response via Server-Sent Events:

```
data: {"type":"start"}
data: {"type":"delta","text":"Let me help "}
data: {"type":"delta","text":"with that."}
data: {"type":"done","response":{"speech":{"plain":{"speech":"Let me help with that."}}},"conversationId":"ha-conv-abc123"}
```

### Response Template Interpolation

Lucia uses **response templates** to generate natural language responses. Templates support placeholder interpolation:

- `` `{entity}` `` — friendly name of the target entity
- `` `{action}` `` — the action performed (on, off, set to, etc.)
- `` `{area}` `` — the area name
- `` `{value}` `` — numeric value (brightness, temperature)

Example template:
```
I've turned `{action}` the `{entity}` in the `{area}`.
```

Becomes:
```
I've turned on the kitchen ceiling in the kitchen.
```

### Multi-Turn Continuity

The `conversationId` enables multi-turn conversations. Lucia auto-generates a UUID for first-turn requests and maintains it across follow-ups. This allows the agent to understand context:

**Turn 1:**
```json
{"text": "What's the temperature in the living room?", "conversationId": "ha-conv-abc123"}
```
Response: `"The living room thermostat reads 72 degrees."`

**Turn 2:**
```json
{"text": "Set it to 68.", "conversationId": "ha-conv-abc123"}
```
Response: `"I've set the living room thermostat to 68 degrees."` (understands "it" from turn 1)

## Command Pattern Matching

Lucia includes a **fast-path command parser** that recognizes common patterns and executes them directly against Home Assistant, bypassing the LLM:

### Supported Patterns

**Lights:**
- "turn on/off [the] `{area}` light[s]"
- "set [the] `{area}` light[s] to `{brightness}`% brightness"
- "dim the `{area}` light[s]"

**Climate:**
- "set [the] `{area}` thermostat to `{temperature}` degrees"
- "turn on/off the `{area}` fan"
- "set the `{area}` AC to cooling"

**Scenes:**
- "activate [the] `{area}` `{scene}` scene"
- "turn on `{scene}`"

### Pattern Matching Details

- Confidence scoring ensures high-quality matches before fast-path execution
- Non-light device mentions (fan, AC, TV, lock) bail to the LLM
- Temporal prepositions ("in 5 minutes", "at 7pm") correctly trigger the scheduler, not the device agent
- Spatial prepositions ("in the kitchen") are preserved for area context

## Legacy JSON-RPC (Deprecated)

:::warning
The older JSON-RPC 2.0 protocol is **deprecated** as of v1.2.0. It may be removed in a future release. New implementations should use the REST endpoint documented above.
:::

For reference, the old JSON-RPC flow:

```json
{
  "jsonrpc": "2.0",
  "method": "conversation.process",
  "params": {
    "text": "Turn off the kitchen lights",
    "conversationId": "ha-conv-abc123",
    "language": "en",
    "exposedEntities": ["light.kitchen_ceiling"],
    "context": {"userId": "ha-user-1"}
  },
  "id": 1
}
```

## Error Handling

If the command parser fails or the agent host is unreachable, Lucia returns an error response:

```json
{
  "response": {
    "speech": {
      "plain": {
        "speech": "I'm sorry, I wasn't able to process that request."
      }
    },
    "response_type": "error",
    "data": {"code": "agent_unavailable"}
  }
}
```

Home Assistant displays or speaks the error message so the user receives feedback even when something goes wrong.

## Examples

### Turn on lights with cURL

```bash
curl -X POST https://localhost:7235/api/conversation \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "text": "Turn on the kitchen lights",
    "conversationId": "conv-001",
    "context": {
      "area": "kitchen",
      "type": "light",
      "userId": "user-1",
      "timestamp": "2026-02-20T10:30:00Z"
    }
  }'
```

### Set temperature with multi-turn

```bash
# First turn: ask temperature
curl -X POST https://localhost:7235/api/conversation \
  -H "Content-Type: application/json" \
  -d '{
    "text": "What is the living room temperature?",
    "conversationId": "conv-002",
    "context": {"area": "living room", "type": "climate"}
  }'

# Second turn: adjust it (context preserved via conversationId)
curl -X POST https://localhost:7235/api/conversation \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Set it to 70 degrees",
    "conversationId": "conv-002",
    "context": {"area": "living room", "type": "climate"}
  }'
```

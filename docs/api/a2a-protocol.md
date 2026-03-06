---
sidebar_position: 2
title: A2A Protocol
---

# A2A Protocol

Lucia uses the **Agent-to-Agent (A2A) Protocol** for communication between the AgentHost and satellite agents (such as TimerAgent). A2A is built on **JSON-RPC 2.0** and provides a standardized way for agents to discover each other and exchange messages.

## Agent Discovery

Satellite agents expose a discovery endpoint that returns their capabilities and metadata.

### Request

```bash
curl http://localhost:5201/agents
```

### Response

```json
[
  {
    "name": "TimerAgent",
    "description": "Sets countdown timers, named timers, and one-shot reminders",
    "capabilities": ["timer.set", "timer.cancel", "timer.list", "reminder.set"],
    "version": "1.0.0",
    "protocol": "a2a"
  }
]
```

| Field | Type | Description |
|---|---|---|
| `name` | `string` | Unique agent name |
| `description` | `string` | Human-readable description of the agent |
| `capabilities` | `string[]` | List of supported actions |
| `version` | `string` | Agent version |
| `protocol` | `string` | Communication protocol (always `a2a`) |

## Sending Messages

Messages are sent to agents using the `message/send` JSON-RPC method via HTTP POST.

### Endpoint

```
POST /a2a/{agent-name}
```

### Request Format

```json
{
  "jsonrpc": "2.0",
  "id": "req-001",
  "method": "message/send",
  "params": {
    "message": {
      "kind": "text",
      "role": "user",
      "parts": [
        {
          "type": "text",
          "text": "Play some jazz music in the living room"
        }
      ]
    },
    "messageId": "msg-abc123",
    "contextId": "ctx-xyz789"
  }
}
```

| Field | Type | Description |
|---|---|---|
| `jsonrpc` | `string` | JSON-RPC version (always `"2.0"`) |
| `id` | `string` | Unique request identifier |
| `method` | `string` | RPC method name (`message/send`) |
| `params.message.kind` | `string` | Message kind (`text`, `tool_call`, `tool_result`) |
| `params.message.role` | `string` | Message role (`user`, `assistant`, `system`) |
| `params.message.parts` | `array` | Message content parts |
| `params.messageId` | `string` | Unique message identifier |
| `params.contextId` | `string` | Conversation context identifier |

### Response Format

```json
{
  "jsonrpc": "2.0",
  "id": "req-001",
  "result": {
    "message": {
      "kind": "text",
      "role": "assistant",
      "parts": [
        {
          "type": "text",
          "text": "Now playing jazz music in the living room."
        }
      ]
    },
    "messageId": "msg-def456"
  }
}
```

## Full curl Examples

### Send a Message to TimerAgent

```bash
curl -X POST http://localhost:5201/a2a/TimerAgent \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "req-001",
    "method": "message/send",
    "params": {
      "message": {
        "kind": "text",
        "role": "user",
        "parts": [
          {
            "type": "text",
            "text": "Set a timer for 5 minutes"
          }
        ]
      },
      "messageId": "msg-abc123",
      "contextId": "ctx-xyz789"
    }
  }'
```

### Send Another Message to TimerAgent

```bash
curl -X POST http://localhost:5201/a2a/TimerAgent \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "req-002",
    "method": "message/send",
    "params": {
      "message": {
        "kind": "text",
        "role": "user",
        "parts": [
          {
            "type": "text",
            "text": "Set a timer for 10 minutes"
          }
        ]
      },
      "messageId": "msg-ghi789",
      "contextId": "ctx-xyz789"
    }
  }'
```

### Discover Available Agents

```bash
# TimerAgent discovery
curl http://localhost:5201/agents
```

## Message Parts

The `parts` array supports multiple content types:

| Type | Description | Example |
|---|---|---|
| `text` | Plain text content | User messages, agent responses |
| `tool_call` | Tool invocation from the LLM | Function calls to Home Assistant |
| `tool_result` | Result of a tool call | HA API response data |

### Text Part

```json
{
  "type": "text",
  "text": "Turn on the kitchen lights"
}
```

### Tool Call Part

```json
{
  "type": "tool_call",
  "toolCallId": "call-001",
  "name": "homeassistant.turn_on",
  "arguments": {
    "entity_id": "light.kitchen_main"
  }
}
```

### Tool Result Part

```json
{
  "type": "tool_result",
  "toolCallId": "call-001",
  "content": "{\"state\": \"on\"}"
}
```

## Context Management

The `contextId` field ties related messages together into a conversation. All messages within the same context share conversation history, allowing agents to maintain state across multiple turns.

```bash
# First message in a context
curl -X POST http://localhost:5201/a2a/TimerAgent \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "req-010",
    "method": "message/send",
    "params": {
      "message": {
        "kind": "text",
        "role": "user",
        "parts": [{"type": "text", "text": "Set a timer for 10 minutes"}]
      },
      "messageId": "msg-010",
      "contextId": "ctx-session-001"
    }
  }'

# Follow-up in the same context
curl -X POST http://localhost:5201/a2a/TimerAgent \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "req-011",
    "method": "message/send",
    "params": {
      "message": {
        "kind": "text",
        "role": "user",
        "parts": [{"type": "text", "text": "Cancel that timer"}]
      },
      "messageId": "msg-011",
      "contextId": "ctx-session-001"
    }
  }'
```

## Error Responses

A2A errors follow the JSON-RPC 2.0 error format:

```json
{
  "jsonrpc": "2.0",
  "id": "req-001",
  "error": {
    "code": -32603,
    "message": "Agent timeout: TimerAgent did not respond within 30s"
  }
}
```

| Code | Meaning |
|---|---|
| `-32600` | Invalid request |
| `-32601` | Method not found |
| `-32602` | Invalid parameters |
| `-32603` | Internal error |
| `-32000` | Agent not found |
| `-32001` | Agent timeout |

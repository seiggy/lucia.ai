---
sidebar_position: 1
title: REST API
---

# REST API

Lucia exposes a REST API through the AgentHost for managing agents, configuration, plugins, traces, and more. When running via .NET Aspire, the following service endpoints are available.

## Service Endpoints

| Service | URL | Description |
|---|---|---|
| AgentHost (HTTP) | `http://localhost:5151` | Primary API endpoint |
| AgentHost (HTTPS) | `https://localhost:7235` | Secure API endpoint |
| Aspire Dashboard | `https://localhost:17274` | .NET Aspire orchestrator dashboard |
| Scalar API Docs | `https://localhost:7235/scalar` | Interactive API documentation |
| Health Check | `http://localhost:5151/health` | Health check endpoint |

:::tip
The Scalar API docs at `https://localhost:7235/scalar` provide an interactive interface for exploring and testing all available endpoints.
:::

## Health Check

```bash
curl http://localhost:5151/health
```

```json
{
  "status": "Healthy",
  "checks": {
    "mongodb": "Healthy",
    "redis": "Healthy",
    "homeassistant": "Healthy"
  }
}
```

## API Groups

### Agents

Manage and interact with registered agents.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/agents` | List all registered agents |
| `GET` | `/api/agents/{name}` | Get agent details by name |
| `GET` | `/api/agents/{name}/status` | Get agent health status |
| `POST` | `/api/agents/{name}/invoke` | Invoke an agent directly |

```bash
# List all agents
curl http://localhost:5151/api/agents

# Invoke an agent
curl -X POST http://localhost:5151/api/agents/LightAgent/invoke \
  -H "Content-Type: application/json" \
  -d '{"message": "Turn on the kitchen lights"}'
```

### Conversation (v1.2.0+)

Process conversation commands with pattern matching and LLM fallback.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/conversation` | Process a conversation request |
| `GET` | `/api/conversation/patterns` | List registered command patterns |

#### POST /api/conversation

Process a user request with structured context. Returns instant JSON for parsed commands or Server-Sent Events for LLM streaming.

**Request:**

```json
{
  "text": "Turn on the kitchen lights",
  "conversationId": "ha-conv-abc123",
  "context": {
    "deviceId": "light.kitchen_ceiling",
    "area": "kitchen",
    "type": "light",
    "userId": "user-1",
    "timestamp": "2026-02-20T10:30:00Z",
    "location": null
  }
}
```

**Response (Parsed Command - Instant JSON):**

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
      "targets": ["light.kitchen_ceiling"],
      "success": ["light.kitchen_ceiling"],
      "failed": []
    }
  },
  "conversationId": "ha-conv-abc123"
}
```

**Response (LLM Fallback - Server-Sent Events):**

```
data: {"type":"start"}
data: {"type":"delta","text":"Let me help "}
data: {"type":"delta","text":"with that."}
data: {"type":"done","response":{...},"conversationId":"ha-conv-abc123"}
```

#### GET /api/conversation/patterns

Retrieve registered command patterns for dashboard tooling.

**Response:**

```json
{
  "patterns": [
    {
      "skillId": "LightControlSkill",
      "action": "toggle",
      "template": "turn {action:on|off} [the] {area} light[s]",
      "placeholders": ["action", "area"],
      "examples": ["turn on the kitchen lights", "turn off bedroom ceiling light"]
    },
    {
      "skillId": "ClimateControlSkill",
      "action": "setTemperature",
      "template": "set [the] {area} thermostat to {temperature} degrees",
      "placeholders": ["area", "temperature"],
      "examples": ["set the living room thermostat to 72 degrees"]
    }
  ]
}
```

**Examples:**

```bash
# Turn on lights (command parsed)
curl -X POST http://localhost:5151/api/conversation \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Turn on the kitchen lights",
    "conversationId": "conv-001",
    "context": {"area": "kitchen", "type": "light", "userId": "user-1"}
  }'

# List available command patterns
curl http://localhost:5151/api/conversation/patterns
```

### Response Templates (v1.2.0+)

Manage customizable response templates used by the command parser.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/response-templates` | List all response templates |
| `POST` | `/api/response-templates` | Create a new template |
| `GET` | `/api/response-templates/{id}` | Get a specific template |
| `PUT` | `/api/response-templates/{id}` | Update a template |
| `DELETE` | `/api/response-templates/{id}` | Delete a template |

**Response Template Model:**

```json
{
  "id": "light-on-001",
  "skillId": "LightControlSkill",
  "action": "on",
  "template": "I've turned on the {entity} in the {area}.",
  "variants": [
    "The {entity} is now on.",
    "Done! {entity} is lit up."
  ],
  "placeholders": ["entity", "area"]
}
```

**Examples:**

```bash
# List templates
curl http://localhost:5151/api/response-templates

# Create a template
curl -X POST http://localhost:5151/api/response-templates \
  -H "Content-Type: application/json" \
  -d '{
    "skillId": "LightControlSkill",
    "action": "on",
    "template": "I've turned on the {entity}.",
    "variants": ["The {entity} is now on.", "Done!"]
  }'

# Update a template
curl -X PUT http://localhost:5151/api/response-templates/light-on-001 \
  -H "Content-Type: application/json" \
  -d '{"template": "Successfully activated the {entity}."}'
```

### Configuration

Read and update schema-driven configuration through the active SQLite, PostgreSQL, or MongoDB provider.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/configuration` | Get all configuration sections |
| `GET` | `/api/configuration/{section}` | Get a specific configuration section |
| `PUT` | `/api/configuration/{section}` | Replace a configuration section |
| `PATCH` | `/api/configuration/{section}` | Merge fields into a configuration section |

```bash
# Get router configuration
curl http://localhost:5151/api/configuration/RouterExecutor

# Update router threshold
curl -X PUT http://localhost:5151/api/configuration/RouterExecutor \
  -H "Content-Type: application/json" \
  -d '{"semanticSimilarityThreshold": 0.80}'
```

Use `PUT` when sending the complete section. Use `PATCH` for a partial update that should preserve unspecified fields.

### Per-User Memory (v1.2.3+)

Authenticated callers can manage durable user-specific memory:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/memory/{userId}` | List a user's memories |
| `GET` | `/api/memory/{userId}/{key}` | Get one memory |
| `PUT` | `/api/memory/{userId}/{key}` | Store or replace one memory |
| `DELETE` | `/api/memory/{userId}/{key}` | Delete one memory |

```bash
curl -X PUT http://localhost:5151/api/memory/user-1/preferred_temperature \
  -H "Content-Type: application/json" \
  -d '{"value":"70 F","ttlSeconds":31536000}'
```

The optional TTL can be a .NET `TimeSpan` string in `ttl` or a numeric `ttlSeconds` value up to one year. User-authenticated callers can only access their own memory; API-key and internal-service callers can act on behalf of users.

### Plugins

Manage the plugin system including installation, removal, and repository management.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/plugins/installed` | List installed plugins |
| `GET` | `/api/plugins/store` | Browse available plugins |
| `GET` | `/api/plugins/repositories` | List plugin repositories |
| `POST` | `/api/plugins/install` | Install a plugin |
| `DELETE` | `/api/plugins/{id}` | Uninstall a plugin |

```bash
# List installed plugins
curl http://localhost:5151/api/plugins/installed

# Browse plugin store
curl http://localhost:5151/api/plugins/store
```

### Traces

Access captured trace data for debugging and observability.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/traces` | List recent traces |
| `GET` | `/api/traces/{id}` | Get a specific trace |
| `DELETE` | `/api/traces/{id}` | Delete a trace |

```bash
# List recent traces
curl http://localhost:5151/api/traces

# Get trace details
curl http://localhost:5151/api/traces/abc123
```

### Exports

Export trace and configuration data.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/exports/traces` | Export traces as JSON |
| `GET` | `/api/exports/config` | Export current configuration |

```bash
# Export all traces
curl http://localhost:5151/api/exports/traces -o traces.json
```

### Entity Visibility

Control which Home Assistant entities are visible to agents.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/entity-visibility` | Get entity visibility settings |
| `PUT` | `/api/entity-visibility` | Update entity visibility |

```bash
# Get entity visibility
curl http://localhost:5151/api/entity-visibility

# Hide an entity from agents
curl -X PUT http://localhost:5151/api/entity-visibility \
  -H "Content-Type: application/json" \
  -d '{"entityId": "sensor.bedroom_temperature", "visible": false}'
```

### Entity Query (v1.2.3+)

`GET /api/entities` returns a paginated entity catalog for dashboard and integration tooling.

| Query | Default | Description |
|---|---:|---|
| `nameFilter` | -- | Match entity IDs, friendly names, and aliases |
| `locationFilter` | -- | Match area or floor IDs, names, and aliases |
| `domain` | -- | Comma-separated entity domains |
| `agent` | -- | Include entities visible to an agent |
| `page` | `1` | Page number |
| `pageSize` | `100` | Items per page, maximum `500` |

```bash
curl "http://localhost:5151/api/entities?domain=sensor,binary_sensor&locationFilter=kitchen&pageSize=50"
```

### Matcher Debug

Debug the entity matcher to understand how user input maps to Home Assistant entities.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/matcher/debug` | Test entity matching for a query |

```bash
# Debug entity matching
curl -X POST http://localhost:5151/api/matcher/debug \
  -H "Content-Type: application/json" \
  -d '{"query": "kitchen lights"}'
```

```json
{
  "query": "kitchen lights",
  "matches": [
    {
      "entityId": "light.kitchen_main",
      "friendlyName": "Kitchen Main Light",
      "score": 0.95,
      "matchType": "semantic"
    },
    {
      "entityId": "light.kitchen_counter",
      "friendlyName": "Kitchen Counter Lights",
      "score": 0.87,
      "matchType": "semantic"
    }
  ]
}
```

### Prompt Cache

Manage the prompt and response cache.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/prompt-cache` | Get routing cache stats |
| `GET` | `/api/chat-cache` | Get chat cache stats |
| `DELETE` | `/api/prompt-cache` | Clear routing cache |
| `DELETE` | `/api/chat-cache` | Clear chat cache |

```bash
# View routing cache stats
curl http://localhost:5151/api/prompt-cache

# Clear chat cache
curl -X DELETE http://localhost:5151/api/chat-cache
```

### System

System management endpoints.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/system/restart` | Restart the AgentHost |

```bash
# Restart AgentHost
curl -X POST http://localhost:5151/api/system/restart
```

:::caution
The `/api/system/restart` endpoint will restart the entire AgentHost process. All in-flight requests will be terminated.
:::

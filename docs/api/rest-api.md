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

### Configuration

Read and update the schema-driven configuration stored in MongoDB.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/configuration` | Get all configuration sections |
| `GET` | `/api/configuration/{section}` | Get a specific configuration section |
| `PUT` | `/api/configuration/{section}` | Update a configuration section |

```bash
# Get router configuration
curl http://localhost:5151/api/configuration/RouterExecutor

# Update router threshold
curl -X PUT http://localhost:5151/api/configuration/RouterExecutor \
  -H "Content-Type: application/json" \
  -d '{"semanticSimilarityThreshold": 0.80}'
```

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

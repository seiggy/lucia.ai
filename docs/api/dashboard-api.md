---
sidebar_position: 4
title: Dashboard API
---

# Dashboard API

The Lucia Dashboard communicates with the AgentHost through a set of REST endpoints for managing plugins, system operations, entity visibility, matcher debugging, and prompt caching.

## Plugin APIs

### List Installed Plugins

Returns all currently installed plugins.

```bash
GET /api/plugins/installed
```

```bash
curl http://localhost:5151/api/plugins/installed
```

```json
[
  {
    "id": "lucia-plugin-weather",
    "name": "Weather Plugin",
    "version": "1.2.0",
    "enabled": true,
    "author": "community",
    "description": "Adds weather forecast capabilities"
  }
]
```

### Browse Plugin Store

Returns available plugins from all configured repositories.

```bash
GET /api/plugins/store
```

```bash
curl http://localhost:5151/api/plugins/store
```

```json
[
  {
    "id": "lucia-plugin-calendar",
    "name": "Calendar Plugin",
    "version": "1.0.0",
    "author": "community",
    "description": "Google Calendar and CalDAV integration",
    "downloads": 1250,
    "rating": 4.5
  }
]
```

### List Plugin Repositories

Returns the configured plugin repository sources.

```bash
GET /api/plugins/repositories
```

```bash
curl http://localhost:5151/api/plugins/repositories
```

```json
[
  {
    "name": "official",
    "url": "https://plugins.lucia.ai/registry",
    "enabled": true
  },
  {
    "name": "community",
    "url": "https://github.com/lucia-community/plugins",
    "enabled": true
  }
]
```

### Additional Plugin Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/plugins/installed/{id}/enable` | Enable a plugin |
| `POST` | `/api/plugins/installed/{id}/disable` | Disable a plugin |
| `DELETE` | `/api/plugins/installed/{id}` | Uninstall a plugin |
| `POST` | `/api/plugins/store/{id}/install` | Install a plugin from the store |
| `POST` | `/api/plugins/repositories` | Add a plugin repository |
| `DELETE` | `/api/plugins/repositories/{id}` | Remove a plugin repository |
| `POST` | `/api/plugins/repositories/{id}/sync` | Sync a plugin repository |

## System

### Restart AgentHost

Triggers a graceful restart of the AgentHost process. All in-flight requests are allowed to complete before the restart.

```bash
POST /api/system/restart
```

```bash
curl -X POST http://localhost:5151/api/system/restart
```

```json
{
  "status": "restarting",
  "message": "AgentHost will restart momentarily"
}
```

:::caution
The restart endpoint will cause a brief period of unavailability. The Dashboard will automatically reconnect once the AgentHost is back online.
:::

### Health Check

```bash
GET /health
```

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

## Entity Visibility

Controls which Home Assistant entities are visible to Lucia agents. Hidden entities will not appear in agent tool calls or entity matching.

### Get Entity Visibility

Returns the current visibility settings for all entities.

```bash
GET /api/entity-visibility
```

```bash
curl http://localhost:5151/api/entity-visibility
```

```json
{
  "entities": [
    {
      "entityId": "light.kitchen_main",
      "friendlyName": "Kitchen Main Light",
      "domain": "light",
      "visible": true
    },
    {
      "entityId": "sensor.server_cpu_temp",
      "friendlyName": "Server CPU Temperature",
      "domain": "sensor",
      "visible": false
    }
  ],
  "totalEntities": 142,
  "visibleEntities": 98,
  "hiddenEntities": 44
}
```

### Update Entity Visibility

Update the visibility of one or more entities.

```bash
POST /api/entity-visibility
```

```bash
curl -X POST http://localhost:5151/api/entity-visibility \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      { "entityId": "sensor.server_cpu_temp", "visible": false },
      { "entityId": "sensor.server_ram_usage", "visible": false }
    ]
  }'
```

```json
{
  "updated": 2,
  "message": "Entity visibility updated successfully"
}
```

## Matcher Debug

Test how Lucia's HybridEntityMatcher resolves natural language queries to Home Assistant entities. Useful for diagnosing issues where agents act on the wrong device.

### Debug Entity Matching

```bash
POST /api/matcher/debug
```

```bash
curl -X POST http://localhost:5151/api/matcher/debug \
  -H "Content-Type: application/json" \
  -d '{"query": "bedroom lights"}'
```

```json
{
  "query": "bedroom lights",
  "processingTimeMs": 12,
  "matches": [
    {
      "entityId": "light.bedroom_main",
      "friendlyName": "Bedroom Main Light",
      "score": 0.96,
      "matchType": "semantic",
      "domain": "light"
    },
    {
      "entityId": "light.bedroom_nightstand",
      "friendlyName": "Bedroom Nightstand Lamp",
      "score": 0.84,
      "matchType": "semantic",
      "domain": "light"
    }
  ],
  "selectedEntity": "light.bedroom_main"
}
```

| Field | Type | Description |
|---|---|---|
| `query` | `string` | The input query |
| `processingTimeMs` | `integer` | Time taken to process the match |
| `matches` | `array` | All candidate matches with scores |
| `matches[].score` | `float` | Cosine similarity score (0-1) |
| `matches[].matchType` | `string` | `semantic`, `exact`, or `fuzzy` |
| `selectedEntity` | `string` | The entity that would be selected |

## Prompt Cache

Manage the routing and chat response caches. Caching reduces LLM API calls by reusing responses for semantically similar inputs.

### Get Routing Cache Stats

```bash
GET /api/prompt-cache
```

```bash
curl http://localhost:5151/api/prompt-cache
```

```json
{
  "entries": 1247,
  "hitRate": 0.73,
  "totalHits": 8921,
  "totalMisses": 3312,
  "memoryUsageMb": 12.4
}
```

### Get Chat Cache Stats

```bash
GET /api/chat-cache
```

```bash
curl http://localhost:5151/api/chat-cache
```

```json
{
  "entries": 3456,
  "hitRate": 0.45,
  "totalHits": 5678,
  "totalMisses": 6890,
  "memoryUsageMb": 34.2
}
```

### Clear Routing Cache

```bash
DELETE /api/prompt-cache
```

```bash
curl -X DELETE http://localhost:5151/api/prompt-cache
```

```json
{
  "cleared": 1247,
  "message": "Routing cache cleared"
}
```

### Clear Chat Cache

```bash
DELETE /api/chat-cache
```

```bash
curl -X DELETE http://localhost:5151/api/chat-cache
```

```json
{
  "cleared": 3456,
  "message": "Chat cache cleared"
}
```

:::tip
Clear the prompt cache after making changes to agent system prompts or entity visibility settings to ensure agents use updated information.
:::

## API Documentation

Interactive API docs are available via Scalar at `https://localhost:7235/scalar` when running via Aspire.

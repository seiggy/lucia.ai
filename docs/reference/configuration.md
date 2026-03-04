---
sidebar_position: 1
title: Configuration Reference
---

# Configuration Reference

Lucia uses a schema-driven configuration system stored in MongoDB. Configuration is managed through the `luciaconfig` database and can be modified via the Dashboard UI or the REST API. Most settings are hot-reloadable -- changes take effect without restarting the AgentHost.

## Configuration Sections

| Section | Purpose | Hot-Reloadable |
|---|---|---|
| HomeAssistant | HA connection settings | Yes |
| RouterExecutor | Routing model and thresholds | Yes |
| AgentInvoker | Agent execution settings | Yes |
| ResultAggregator | Response aggregation | Yes |
| Redis | Cache and persistence | No |
| MusicAssistant | Music Agent integration | Yes |
| TraceCapture | Telemetry and tracing | Yes |
| ConnectionStrings | Service connection strings | No |
| Agents | Agent definitions and registration | Yes |
| ModelProviders | Per-agent model assignment | Yes |
| PromptCache | Routing and chat cache thresholds | Yes |

## HomeAssistant

Controls the connection between Lucia and your Home Assistant instance.

| Key | Type | Default | Description |
|---|---|---|---|
| `baseUrl` | `string` | `http://homeassistant.local:8123` | Base URL of your Home Assistant instance |
| `accessToken` | `string` | -- | Long-lived access token for HA API |
| `timeout` | `integer` | `30` | Request timeout in seconds |
| `sslVerify` | `boolean` | `true` | Whether to verify SSL certificates |

```json
{
  "HomeAssistant": {
    "baseUrl": "http://homeassistant.local:8123",
    "accessToken": "eyJ0eXAiOi...",
    "timeout": 30,
    "sslVerify": true
  }
}
```

:::warning
Store your Home Assistant access token securely. Avoid committing it to version control. Use environment variables or a secrets manager in production.
:::

## RouterExecutor

Configures the semantic router that dispatches user messages to the appropriate agent.

| Key | Type | Default | Description |
|---|---|---|---|
| `routingModel` | `string` | `gpt-4o-mini` | Model used for intent classification |
| `semanticSimilarityThreshold` | `float` | `0.78` | Minimum cosine similarity for route match |
| `fallbackAgent` | `string` | `GeneralAgent` | Agent to use when no route matches |
| `maxRetries` | `integer` | `2` | Maximum routing retries on failure |

```json
{
  "RouterExecutor": {
    "routingModel": "gpt-4o-mini",
    "semanticSimilarityThreshold": 0.78,
    "fallbackAgent": "GeneralAgent",
    "maxRetries": 2
  }
}
```

:::tip
Lower the `semanticSimilarityThreshold` if the router is falling back to GeneralAgent too often. Raise it if agents are receiving misrouted requests.
:::

## AgentInvoker

Controls how agents are invoked by the orchestrator.

| Key | Type | Default | Description |
|---|---|---|---|
| `timeout` | `integer` | `30` | Maximum seconds to wait for an agent response |
| `parallelExecution` | `boolean` | `true` | Whether to invoke multiple agents in parallel |
| `maxConcurrent` | `integer` | `5` | Maximum number of concurrent agent invocations |

```json
{
  "AgentInvoker": {
    "timeout": 30,
    "parallelExecution": true,
    "maxConcurrent": 5
  }
}
```

## ResultAggregator

Controls how responses from multiple agents are combined into a single reply.

| Key | Type | Default | Description |
|---|---|---|---|
| `strategy` | `string` | `merge` | Aggregation strategy (`merge`, `first`, `best`) |
| `deduplication` | `boolean` | `true` | Remove duplicate information across agent responses |
| `maxTokens` | `integer` | `1024` | Maximum tokens in the aggregated response |

```json
{
  "ResultAggregator": {
    "strategy": "merge",
    "deduplication": true,
    "maxTokens": 1024
  }
}
```

## Redis

Redis connection and caching configuration.

| Key | Type | Default | Description |
|---|---|---|---|
| `connectionString` | `string` | `localhost:6379` | Redis server connection string |
| `defaultTtl` | `string` | `24:00:00` | Default time-to-live for cached entries |
| `keyPrefix` | `string` | `lucia:` | Prefix applied to all Redis keys |
| `persistenceEnabled` | `boolean` | `true` | Whether to persist conversation context |

```json
{
  "Redis": {
    "connectionString": "localhost:6379",
    "defaultTtl": "24:00:00",
    "keyPrefix": "lucia:",
    "persistenceEnabled": true
  }
}
```

:::caution
Changes to the Redis section require a restart of the AgentHost to take effect.
:::

## MusicAssistant

Configuration for the Music Assistant integration used by MusicAgent.

| Key | Type | Default | Description |
|---|---|---|---|
| `baseUrl` | `string` | `http://localhost:8095` | Music Assistant server URL |
| `enabled` | `boolean` | `true` | Whether the Music Assistant integration is active |

```json
{
  "MusicAssistant": {
    "baseUrl": "http://localhost:8095",
    "enabled": true
  }
}
```

## TraceCapture

Controls telemetry and trace collection for debugging and observability.

| Key | Type | Default | Description |
|---|---|---|---|
| `enabled` | `boolean` | `true` | Whether to capture traces |
| `storageBackend` | `string` | `mongodb` | Where traces are stored |
| `retentionDays` | `integer` | `30` | How long traces are retained |
| `verboseMode` | `boolean` | `false` | Capture full LLM request/response payloads |

```json
{
  "TraceCapture": {
    "enabled": true,
    "storageBackend": "mongodb",
    "retentionDays": 30,
    "verboseMode": false
  }
}
```

## ConnectionStrings

Service connection strings for the backing infrastructure.

| Key | Format | Description |
|---|---|---|
| `Traces` | MongoDB URI | Trace storage database |
| `Config` | MongoDB URI | Configuration database |
| `Tasks` | MongoDB URI | Task/timer storage database |
| `Redis` | `host:port` | Redis cache connection |
| `chat-model` | Lucia connection string | Primary chat LLM |
| `routing-model` | Lucia connection string | Router LLM |

```json
{
  "ConnectionStrings": {
    "Traces": "mongodb://localhost:27017/luciatraces",
    "Config": "mongodb://localhost:27017/luciaconfig",
    "Tasks": "mongodb://localhost:27017/luciatasks",
    "Redis": "localhost:6379",
    "chat-model": "Endpoint=https://api.openai.com;AccessKey=sk-...;Model=gpt-4o;Provider=openai",
    "routing-model": "Endpoint=https://api.openai.com;AccessKey=sk-...;Model=gpt-4o-mini;Provider=openai"
  }
}
```

:::info
See the [Connection Strings](./connection-strings.md) reference for the full connection string format and provider-specific examples.
:::

## Agents

Defines the set of registered agents and their configuration.

| Key | Type | Description |
|---|---|---|
| `name` | `string` | Unique agent identifier |
| `enabled` | `boolean` | Whether the agent is active |
| `mode` | `string` | `inprocess` or `a2a` |
| `endpoint` | `string` | A2A endpoint (for satellite agents only) |

```json
{
  "Agents": [
    { "name": "LightAgent", "enabled": true, "mode": "inprocess" },
    { "name": "ClimateAgent", "enabled": true, "mode": "inprocess" },
    { "name": "SceneAgent", "enabled": true, "mode": "inprocess" },
    { "name": "ListsAgent", "enabled": true, "mode": "inprocess" },
    { "name": "GeneralAgent", "enabled": true, "mode": "inprocess" },
    { "name": "MusicAgent", "enabled": true, "mode": "a2a", "endpoint": "http://localhost:5200" },
    { "name": "TimerAgent", "enabled": true, "mode": "a2a", "endpoint": "http://localhost:5201" }
  ]
}
```

## ModelProviders

Maps each agent to its assigned LLM model and provider. This allows you to run different agents on different models -- for example, a fast model for routing and a more capable model for complex agents.

| Key | Type | Description |
|---|---|---|
| `agentName` | `string` | Name of the agent |
| `connectionStringKey` | `string` | Key in ConnectionStrings to use |

```json
{
  "ModelProviders": {
    "RouterExecutor": "routing-model",
    "LightAgent": "chat-model",
    "ClimateAgent": "chat-model",
    "SceneAgent": "chat-model",
    "GeneralAgent": "chat-model",
    "ListsAgent": "chat-model"
  }
}
```

:::tip
You can create multiple connection string entries (e.g., `fast-model`, `smart-model`) and assign different agents to each. This lets you balance cost and quality per agent.
:::

## PromptCache

Controls the prompt and chat response caching layer. Caching reduces LLM costs by reusing responses for semantically similar inputs.

| Key | Type | Default | Description |
|---|---|---|---|
| `routingCacheThreshold` | `float` | `0.95` | Similarity threshold for routing cache hits |
| `chatCacheThreshold` | `float` | `0.92` | Similarity threshold for chat cache hits |
| `enabled` | `boolean` | `true` | Whether prompt caching is active |
| `maxEntries` | `integer` | `10000` | Maximum number of cached entries |

```json
{
  "PromptCache": {
    "routingCacheThreshold": 0.95,
    "chatCacheThreshold": 0.92,
    "enabled": true,
    "maxEntries": 10000
  }
}
```

:::info
PromptCache settings are hot-reloadable. Changes take effect on the next request without restarting the AgentHost.
:::

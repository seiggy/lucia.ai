---
sidebar_position: 1
title: Configuration Reference
---

# Configuration Reference

Lucia uses a schema-driven configuration system stored by the selected SQLite, PostgreSQL, or MongoDB provider. Configuration can be modified through the Dashboard UI or REST API. Most settings are hot-reloadable, so changes take effect without restarting the AgentHost.

## Configuration Sections

| Section | Purpose | Hot-Reloadable |
|---|---|---|
| HomeAssistant | HA connection settings | Yes |
| RouterExecutor | Routing model and thresholds | Yes |
| AgentInvoker | Agent execution settings | Yes |
| ResultAggregator | Response aggregation | Yes |
| PersonalityPrompt | Response personality and tone rewriting | Yes |
| DataProvider | Cache and storage backend selection | No |
| InputRequiredTimeout | Timeout for tasks awaiting user input | Yes |
| Observability | OpenTelemetry signal level | No |
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

## PersonalityPrompt

Configures optional response personality rewriting (available since v1.2.0). When enabled, the aggregated response is passed through an LLM with your personality instructions, allowing customization of tone and style.

| Key | Type | Default | Description |
|---|---|---|---|
| `instructions` | `string` | -- | System prompt defining the personality (multi-line text) |
| `modelConnectionName` | `string` | -- | Optional: Use a different/cheaper model for rewriting (defaults to primary chat model) |

```json
{
  "PersonalityPrompt": {
    "instructions": "You are a helpful home assistant with a warm, conversational tone. Keep responses concise but friendly. Use casual language and occasional emoji when appropriate.",
    "modelConnectionName": "gpt-4o-mini"
  }
}
```

**Behavior:**
- **Hot-reloadable**: Changes take effect on the next request without restart
- **Zero-cost opt-in**: When `instructions` is empty or not set, the pipeline is unchanged (no LLM call)
- **Graceful fallback**: If the personality model is misconfigured, a warning is logged and the raw aggregated response is returned for that request
- **Model flexibility**: Optionally route personality rewriting to a different (faster/cheaper) model than your main orchestrator

:::tip
Use a smaller model like `gpt-4o-mini` or `claude-3-haiku` for personality rewriting to reduce costs without sacrificing quality.
:::

## DataProvider

Configures pluggable cache and storage backends (available since v1.2.0). This enables flexible deployment from resource-constrained devices to high-availability clusters.

| Key | Type | Default | Description |
|---|---|---|---|
| `cache` | `string` | `Redis` | Cache provider: `InMemory` or `Redis` |
| `store` | `string` | `MongoDB` | Store provider: `SQLite`, `PostgreSQL`, or `MongoDB` |
| `sqlitePath` | `string` | `./data/lucia.db` | Path to SQLite database (used when store=`SQLite`) |

```json
{
  "DataProvider": {
    "cache": "InMemory",
    "store": "SQLite",
    "sqlitePath": "./data/lucia.db"
  }
}
```

**Common Deployment Patterns:**

| Scenario | Cache | Store | Notes |
|---|---|---|---|
| **Development** | `InMemory` | `SQLite` | Single-process, no external services |
| **Home Assistant Add-on** | `InMemory` | `SQLite` | Minimal resource footprint, embedded |
| **Production / HA** | `Redis` | `MongoDB` | Clustering, persistent state, high-availability ready |
| **Production / Jetson** | `Redis` | `PostgreSQL` | Relational persistence, concurrent search, ARM64 stack |
| **Docker on Raspberry Pi** | `InMemory` | `SQLite` | Limited memory, single-container deployment |

**Requirements:**
- Changes to DataProvider require an AgentHost restart to take effect
- When `store=MongoDB`, ensure `ConnectionStrings__Config`, `ConnectionStrings__Traces`, and `ConnectionStrings__Tasks` are configured
- When `store=PostgreSQL`, configure `ConnectionStrings__luciaconfig`, `ConnectionStrings__luciatraces`, and `ConnectionStrings__luciatasks`
- When `cache=Redis`, ensure `ConnectionStrings__redis` is configured

## InputRequiredTimeout

Tasks that pause for user input are durable, but should not remain open forever:

| Key | Type | Default | Description |
|---|---|---|---|
| `timeout` | `TimeSpan` | `00:01:00` | Time before an unanswered task is canceled |
| `sweepInterval` | `TimeSpan` | `00:00:10` | Frequency of timeout checks |

## Observability

Select which OpenTelemetry signals Lucia records:

| Key | Type | Default | Description |
|---|---|---|---|
| `mode` | `string` | `Trace` | `Off`, `Metrics`, `Trace`, or `Profile` |

`Metrics` exports runtime, process, HTTP, agent, and speech measurements. `Trace` adds correlated logs and 10% parent-based tracing. `Profile` records every span and adds a process correlation ID. See [Observability](../deployment/observability.md).

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
    { "name": "MusicAgent", "enabled": true, "mode": "inprocess" },
    { "name": "TimerAgent", "enabled": true, "mode": "a2a", "endpoint": "http://localhost:5201" }
  ]
}
```

## ModelProviders

Maps each agent to its assigned LLM model and provider. This lets you run different agents on different models; for example, a fast model can handle routing while a more capable model handles complex agents.

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

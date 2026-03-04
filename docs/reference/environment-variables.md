---
sidebar_position: 2
title: Environment Variables
---

# Environment Variables

Lucia is configured primarily through environment variables. These can be set directly, through a `.env` file, or via your container orchestrator.

:::tip
When running with Docker Compose, set environment variables in the `environment` section of your `docker-compose.yml`. For systemd deployments, use the `EnvironmentFile` directive pointing to `/etc/lucia/lucia.env`.
:::

## Core

| Variable | Default | Description |
|---|---|---|
| `LUCIA_PORT` | `5000` | Port the AgentHost listens on |
| `LUCIA_ENV` | `development` | Environment name (`development`, `staging`, `production`) |
| `LUCIA_LOG_LEVEL` | `Information` | Minimum log level (`Trace`, `Debug`, `Information`, `Warning`, `Error`, `Critical`) |
| `LUCIA_ENABLE_TELEMETRY` | `true` | Enable OpenTelemetry trace export |

```bash
export LUCIA_PORT=5000
export LUCIA_ENV=production
export LUCIA_LOG_LEVEL=Warning
export LUCIA_ENABLE_TELEMETRY=true
```

## Home Assistant

| Variable | Default | Description |
|---|---|---|
| `HOMEASSISTANT_URL` | -- | Base URL of your Home Assistant instance (e.g., `http://homeassistant.local:8123`) |
| `HOMEASSISTANT_ACCESS_TOKEN` | -- | Long-lived access token for HA API authentication |
| `HOMEASSISTANT_CONNECTION_TIMEOUT` | `30` | Connection timeout in seconds |
| `HOMEASSISTANT_RETRY_COUNT` | `3` | Number of retries on failed HA API calls |

```bash
export HOMEASSISTANT_URL=http://homeassistant.local:8123
export HOMEASSISTANT_ACCESS_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOi...
export HOMEASSISTANT_CONNECTION_TIMEOUT=30
export HOMEASSISTANT_RETRY_COUNT=3
```

:::warning
Never commit your `HOMEASSISTANT_ACCESS_TOKEN` to version control. Use a secrets manager or environment file with restricted permissions (`chmod 600`).
:::

## Redis

| Variable | Default | Description |
|---|---|---|
| `REDIS_CONNECTION_STRING` | `localhost:6379` | Redis server connection string |
| `REDIS_TIMEOUT` | `5000` | Connection timeout in milliseconds |
| `REDIS_KEY_PREFIX` | `lucia:` | Prefix applied to all Redis keys |
| `REDIS_PERSISTENCE_TTL` | `24:00:00` | Time-to-live for persisted conversation context |

```bash
export REDIS_CONNECTION_STRING=localhost:6379
export REDIS_TIMEOUT=5000
export REDIS_KEY_PREFIX=lucia:
export REDIS_PERSISTENCE_TTL=24:00:00
```

## LLM Connection Strings

LLM providers are configured using the `ConnectionStrings__<key>` format. The value follows Lucia's unified connection string format.

| Variable | Description |
|---|---|
| `ConnectionStrings__chat-model` | Primary chat model used by agents |
| `ConnectionStrings__routing-model` | Model used by the semantic router |
| `ConnectionStrings__embedding-model` | Model used for embeddings |

Each connection string uses the format:

```
Endpoint=<endpoint>;AccessKey=<key>;Model=<model_name>;Provider=<provider>
```

**Examples:**

```bash
# OpenAI
export ConnectionStrings__chat-model="Endpoint=https://api.openai.com;AccessKey=sk-proj-abc123;Model=gpt-4o;Provider=openai"

# Azure OpenAI
export ConnectionStrings__chat-model="Endpoint=https://myresource.openai.azure.com;AccessKey=abc123;Model=gpt-4o;Provider=azureopenai"

# Ollama (local)
export ConnectionStrings__chat-model="Endpoint=http://localhost:11434;AccessKey=not-used;Model=llama3.1;Provider=ollama"

# Anthropic
export ConnectionStrings__chat-model="Endpoint=https://api.anthropic.com;AccessKey=sk-ant-abc123;Model=claude-sonnet-4-20250514;Provider=anthropic"
```

:::info
See the [Connection Strings](./connection-strings.md) reference for the full format specification and all supported providers.
:::

## Agent Registry

| Variable | Default | Description |
|---|---|---|
| `AGENT_REGISTRY_URL` | -- | URL for remote agent registry (mesh mode) |
| `AGENT_TIMEOUT` | `30` | Maximum seconds to wait for an agent response |
| `AGENT_RETRY_POLICY` | `exponential-backoff` | Retry policy (`none`, `fixed`, `exponential-backoff`) |

```bash
export AGENT_REGISTRY_URL=http://localhost:5151
export AGENT_TIMEOUT=30
export AGENT_RETRY_POLICY=exponential-backoff
```

## Security

| Variable | Default | Description |
|---|---|---|
| `ENABLE_HTTPS` | `false` | Enable HTTPS on the AgentHost |
| `CERTIFICATE_PATH` | -- | Path to the TLS certificate file (`.pem` or `.pfx`) |
| `CERTIFICATE_KEY_PATH` | -- | Path to the TLS certificate private key |
| `ALLOWED_ORIGINS` | `*` | Comma-separated list of allowed CORS origins |

```bash
export ENABLE_HTTPS=true
export CERTIFICATE_PATH=/etc/lucia/certs/lucia.pem
export CERTIFICATE_KEY_PATH=/etc/lucia/certs/lucia.key
export ALLOWED_ORIGINS=http://homeassistant.local:8123,https://lucia.local
```

:::caution
In production, always set `ALLOWED_ORIGINS` to your specific Home Assistant URL rather than using the default wildcard (`*`).
:::

## MongoDB Connection Strings

MongoDB databases are configured through the `ConnectionStrings__<db>` format.

| Variable | Default | Description |
|---|---|---|
| `ConnectionStrings__Traces` | -- | MongoDB URI for trace storage |
| `ConnectionStrings__Config` | -- | MongoDB URI for configuration storage |
| `ConnectionStrings__Tasks` | -- | MongoDB URI for task/timer storage |

```bash
export ConnectionStrings__Traces=mongodb://localhost:27017/luciatraces
export ConnectionStrings__Config=mongodb://localhost:27017/luciaconfig
export ConnectionStrings__Tasks=mongodb://localhost:27017/luciatasks
```

## Full Example

A complete `.env` file for a production deployment:

```bash title="/etc/lucia/lucia.env"
# Core
LUCIA_PORT=5000
LUCIA_ENV=production
LUCIA_LOG_LEVEL=Warning
LUCIA_ENABLE_TELEMETRY=true

# Home Assistant
HOMEASSISTANT_URL=http://homeassistant.local:8123
HOMEASSISTANT_ACCESS_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOi...
HOMEASSISTANT_CONNECTION_TIMEOUT=30
HOMEASSISTANT_RETRY_COUNT=3

# Redis
REDIS_CONNECTION_STRING=localhost:6379
REDIS_TIMEOUT=5000
REDIS_KEY_PREFIX=lucia:
REDIS_PERSISTENCE_TTL=24:00:00

# MongoDB
ConnectionStrings__Traces=mongodb://localhost:27017/luciatraces
ConnectionStrings__Config=mongodb://localhost:27017/luciaconfig
ConnectionStrings__Tasks=mongodb://localhost:27017/luciatasks
ConnectionStrings__Redis=localhost:6379

# LLM
ConnectionStrings__chat-model=Endpoint=https://api.openai.com;AccessKey=sk-proj-abc123;Model=gpt-4o;Provider=openai
ConnectionStrings__routing-model=Endpoint=https://api.openai.com;AccessKey=sk-proj-abc123;Model=gpt-4o-mini;Provider=openai

# Security
ENABLE_HTTPS=true
CERTIFICATE_PATH=/etc/lucia/certs/lucia.pem
CERTIFICATE_KEY_PATH=/etc/lucia/certs/lucia.key
ALLOWED_ORIGINS=http://homeassistant.local:8123
```

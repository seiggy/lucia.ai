---
sidebar_position: 4
title: Connection Strings
---

# Connection Strings

Lucia uses a unified connection string format for LLM providers and standard connection strings for infrastructure services (MongoDB, Redis).

## LLM Connection String Format

All LLM providers use the same semicolon-delimited format:

```
Endpoint=<endpoint>;AccessKey=<key>;Model=<model_name>;Provider=<provider>
```

| Field | Required | Description |
|---|---|---|
| `Endpoint` | Yes | The provider's API endpoint URL |
| `AccessKey` | Yes | API key or access token |
| `Model` | Yes | Model name or deployment ID |
| `Provider` | Yes | Provider identifier (see table below) |

### Provider Identifiers

| Provider | Identifier |
|---|---|
| OpenAI | `openai` |
| Azure OpenAI | `azureopenai` |
| Ollama | `ollama` |
| Anthropic | `anthropic` |
| Google Gemini | `gemini` |
| Azure AI Inference | `azureaiinference` |
| GitHub Copilot SDK | `githubcopilot` |
| ONNX | `onnx` |

## LLM Connection String Examples

### OpenAI

```bash
ConnectionStrings__chat-model="Endpoint=https://api.openai.com;AccessKey=sk-proj-abc123;Model=gpt-4o;Provider=openai"
```

### Azure OpenAI

```bash
ConnectionStrings__chat-model="Endpoint=https://myresource.openai.azure.com;AccessKey=abc123def456;Model=gpt-4o;Provider=azureopenai"
```

### Ollama

```bash
ConnectionStrings__chat-model="Endpoint=http://localhost:11434;AccessKey=not-used;Model=llama3.1;Provider=ollama"
```

:::info
Ollama does not require authentication. The `AccessKey` field must be present but its value is ignored. Use any non-empty placeholder such as `not-used`.
:::

### Azure AI Inference

```bash
ConnectionStrings__chat-model="Endpoint=https://models.inference.ai.azure.com;AccessKey=ghp_abc123;Model=gpt-4o;Provider=azureaiinference"
```

### Anthropic

```bash
ConnectionStrings__chat-model="Endpoint=https://api.anthropic.com;AccessKey=sk-ant-abc123;Model=claude-sonnet-4-20250514;Provider=anthropic"
```

### Google Gemini

```bash
ConnectionStrings__chat-model="Endpoint=https://generativelanguage.googleapis.com;AccessKey=AIza...;Model=gemini-2.0-flash;Provider=gemini"
```

## Named Connection String Keys

Lucia uses named keys to assign connection strings to different roles:

| Key | Purpose |
|---|---|
| `chat-model` | Primary model used by agents for conversation |
| `routing-model` | Model used by the semantic router for intent classification |
| `embedding-model` | Model used for generating text embeddings |

These are set as environment variables using the `ConnectionStrings__<key>` format:

```bash
export ConnectionStrings__chat-model="Endpoint=https://api.openai.com;AccessKey=sk-proj-abc123;Model=gpt-4o;Provider=openai"
export ConnectionStrings__routing-model="Endpoint=https://api.openai.com;AccessKey=sk-proj-abc123;Model=gpt-4o-mini;Provider=openai"
export ConnectionStrings__embedding-model="Endpoint=https://myresource.openai.azure.com;AccessKey=abc123;Model=text-embedding-3-small;Provider=azureopenai"
```

You can also define custom keys and map them to specific agents via the `ModelProviders` configuration. See the [Configuration Reference](./configuration.md#modelproviders) for details.

## MongoDB Connection Strings

Lucia uses three MongoDB databases for different concerns. Each follows the standard MongoDB URI format.

| Key | Database | Purpose |
|---|---|---|
| `Traces` | `luciatraces` | Trace and telemetry storage |
| `Config` | `luciaconfig` | Schema-driven configuration storage |
| `Tasks` | `luciatasks` | Timer and task persistence |

```bash
export ConnectionStrings__Traces=mongodb://localhost:27017/luciatraces
export ConnectionStrings__Config=mongodb://localhost:27017/luciaconfig
export ConnectionStrings__Tasks=mongodb://localhost:27017/luciatasks
```

### MongoDB with Authentication

```bash
export ConnectionStrings__Traces=mongodb://lucia_user:password@localhost:27017/luciatraces?authSource=admin
export ConnectionStrings__Config=mongodb://lucia_user:password@localhost:27017/luciaconfig?authSource=admin
export ConnectionStrings__Tasks=mongodb://lucia_user:password@localhost:27017/luciatasks?authSource=admin
```

### MongoDB Replica Set

```bash
export ConnectionStrings__Traces=mongodb://mongo1:27017,mongo2:27017,mongo3:27017/luciatraces?replicaSet=rs0
```

## Redis Connection String

Redis uses a simple `host:port` format.

```bash
export ConnectionStrings__Redis=localhost:6379
```

### Redis with Authentication

```bash
export ConnectionStrings__Redis=password@localhost:6379
```

### Redis with TLS

```bash
export ConnectionStrings__Redis=localhost:6380,ssl=true,password=mypassword
```

## Docker Compose Example

A complete `environment` block using connection strings:

```yaml
environment:
  # MongoDB
  - ConnectionStrings__Traces=mongodb://mongo:27017/luciatraces
  - ConnectionStrings__Config=mongodb://mongo:27017/luciaconfig
  - ConnectionStrings__Tasks=mongodb://mongo:27017/luciatasks
  - ConnectionStrings__Redis=redis:6379
  # LLM
  - ConnectionStrings__chat-model=Endpoint=https://api.openai.com;AccessKey=sk-proj-abc123;Model=gpt-4o;Provider=openai
  - ConnectionStrings__routing-model=Endpoint=https://api.openai.com;AccessKey=sk-proj-abc123;Model=gpt-4o-mini;Provider=openai
```

:::warning
Connection strings containing API keys should be stored securely. In Docker Compose, consider using a `.env` file with restricted permissions rather than inline values. In Kubernetes, use Secrets.
:::

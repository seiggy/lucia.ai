---
sidebar_position: 3
title: Model Providers
---

# Model Providers

Lucia supports multiple LLM providers through a unified connection string interface. You can mix and match providers across agents -- for example, use a fast local model for routing and a cloud model for complex agents.

## Supported Providers

| Provider | Status | Function Calling | Streaming | Provider Key |
|---|---|---|---|---|
| Azure OpenAI | Supported | Yes | Yes | `azureopenai` |
| OpenAI | Supported | Yes | Yes | `openai` |
| Ollama | Supported | Yes | Yes | `ollama` |
| Anthropic | Supported | Yes | Yes | `anthropic` |
| Google Gemini | Supported | Yes | Yes | `gemini` |
| Azure AI Inference | Supported | Yes | Yes | `azureaiinference` |
| OpenRouter / OpenAI-compatible | Supported | Yes | Yes | `openai` |
| GitHub Copilot SDK | Experimental | Yes | Yes | `githubcopilot` |
| ONNX | Supported | No | No | `onnx` |

:::warning
ONNX models do not support function calling. Agents that rely on tool use (LightAgent, ClimateAgent, SceneAgent, etc.) cannot use ONNX models. ONNX is suitable only for embedding or classification tasks.
:::

## Connection String Format

All providers use the same unified connection string format:

```
Endpoint=<endpoint>;AccessKey=<key>;Model=<model_name>;Provider=<provider>
```

## Provider Configuration

### Azure OpenAI

```bash
ConnectionStrings__chat-model="Endpoint=https://myresource.openai.azure.com;AccessKey=abc123def456;Model=gpt-4o;Provider=azureopenai"
```

| Field | Value |
|---|---|
| `Endpoint` | Your Azure OpenAI resource URL |
| `AccessKey` | Azure OpenAI API key |
| `Model` | Deployment name (e.g., `gpt-4o`, `gpt-4o-mini`) |
| `Provider` | `azureopenai` |

### OpenAI

```bash
ConnectionStrings__chat-model="Endpoint=https://api.openai.com;AccessKey=sk-proj-abc123;Model=gpt-4o;Provider=openai"
```

| Field | Value |
|---|---|
| `Endpoint` | `https://api.openai.com` |
| `AccessKey` | OpenAI API key (starts with `sk-`) |
| `Model` | Model name (e.g., `gpt-4o`, `gpt-4o-mini`, `gpt-4.1`) |
| `Provider` | `openai` |

### Ollama

```bash
ConnectionStrings__chat-model="Endpoint=http://localhost:11434;AccessKey=not-used;Model=llama3.1;Provider=ollama"
```

| Field | Value |
|---|---|
| `Endpoint` | Ollama server URL (default: `http://localhost:11434`) |
| `AccessKey` | Any non-empty string (not validated) |
| `Model` | Model name as shown by `ollama list` |
| `Provider` | `ollama` |

:::info
For Ollama, the `AccessKey` field is required by the connection string parser but is not sent to the Ollama server. Use any placeholder value such as `not-used`.
:::

### Anthropic

```bash
ConnectionStrings__chat-model="Endpoint=https://api.anthropic.com;AccessKey=sk-ant-abc123;Model=claude-sonnet-4-20250514;Provider=anthropic"
```

| Field | Value |
|---|---|
| `Endpoint` | `https://api.anthropic.com` |
| `AccessKey` | Anthropic API key (starts with `sk-ant-`) |
| `Model` | Model name (e.g., `claude-sonnet-4-20250514`, `claude-haiku-4-20250414`) |
| `Provider` | `anthropic` |

### Google Gemini

```bash
ConnectionStrings__chat-model="Endpoint=https://generativelanguage.googleapis.com;AccessKey=AIza...;Model=gemini-2.0-flash;Provider=gemini"
```

| Field | Value |
|---|---|
| `Endpoint` | `https://generativelanguage.googleapis.com` |
| `AccessKey` | Google AI API key |
| `Model` | Model name (e.g., `gemini-2.0-flash`, `gemini-2.5-pro`) |
| `Provider` | `gemini` |

### Azure AI Inference

```bash
ConnectionStrings__chat-model="Endpoint=https://models.inference.ai.azure.com;AccessKey=ghp_abc123;Model=gpt-4o;Provider=azureaiinference"
```

| Field | Value |
|---|---|
| `Endpoint` | Azure AI Inference endpoint |
| `AccessKey` | GitHub PAT or Azure credential |
| `Model` | Model name available on the endpoint |
| `Provider` | `azureaiinference` |

### OpenRouter / OpenAI-Compatible

Any service that exposes an OpenAI-compatible API can be used with the `openai` provider key by changing the endpoint.

```bash
ConnectionStrings__chat-model="Endpoint=https://openrouter.ai/api/v1;AccessKey=sk-or-abc123;Model=meta-llama/llama-3.1-70b-instruct;Provider=openai"
```

| Field | Value |
|---|---|
| `Endpoint` | Provider's OpenAI-compatible base URL |
| `AccessKey` | Provider's API key |
| `Model` | Model identifier as specified by the provider |
| `Provider` | `openai` |

### GitHub Copilot SDK

:::caution
GitHub Copilot SDK support is experimental and may change in future releases.
:::

```bash
ConnectionStrings__chat-model="Endpoint=https://api.github.com/copilot;AccessKey=ghp_abc123;Model=gpt-4o;Provider=githubcopilot"
```

### ONNX

```bash
ConnectionStrings__embedding-model="Endpoint=file:///models/onnx;AccessKey=not-used;Model=all-MiniLM-L6-v2;Provider=onnx"
```

:::note
ONNX models are loaded from the local filesystem. The `Endpoint` field should be a `file://` URI pointing to the model directory.
:::

## Embedding Support

Lucia uses embeddings for semantic routing, prompt caching, and entity matching. Currently, embedding support is available for:

| Provider | Embedding Support | Recommended Model |
|---|---|---|
| Azure OpenAI | Yes | `text-embedding-3-small` |
| OpenAI | Planned | -- |
| Ollama | Planned | -- |

```bash
ConnectionStrings__embedding-model="Endpoint=https://myresource.openai.azure.com;AccessKey=abc123;Model=text-embedding-3-small;Provider=azureopenai"
```

:::info
Embedding support for additional providers is on the roadmap. Currently only Azure OpenAI embeddings are fully supported with `text-embedding-3-small` as the recommended model.
:::

## Multi-Provider Configuration

You can define multiple connection strings and assign them to different agents through the `ModelProviders` configuration:

```json
{
  "ConnectionStrings": {
    "fast-model": "Endpoint=http://localhost:11434;AccessKey=not-used;Model=llama3.1;Provider=ollama",
    "smart-model": "Endpoint=https://api.openai.com;AccessKey=sk-proj-abc123;Model=gpt-4o;Provider=openai",
    "routing-model": "Endpoint=https://api.openai.com;AccessKey=sk-proj-abc123;Model=gpt-4o-mini;Provider=openai"
  },
  "ModelProviders": {
    "RouterExecutor": "routing-model",
    "LightAgent": "fast-model",
    "ClimateAgent": "fast-model",
    "GeneralAgent": "smart-model",
    "SceneAgent": "smart-model"
  }
}
```

This configuration uses a local Ollama model for simple device control agents and a cloud model for agents that need stronger reasoning.

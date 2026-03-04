---
sidebar_position: 4
title: Multi-LLM Setup
---

# Multi-LLM Setup

Lucia supports multiple LLM providers simultaneously. You can assign different models to different agents -- for example, a fast local model for simple tasks and a cloud model for complex reasoning. This tutorial shows you how to configure providers and assign them to agents.

## Step 1 -- Navigate to Model Providers

Open the Lucia dashboard and click **Model Providers** in the sidebar. This page lists all configured LLM connections.

## Step 2 -- Add a Provider

Click **Add Provider** and fill in the connection details. Each provider uses a connection string with the following format:

```
Endpoint=<url>;AccessKey=<key>;Model=<model>;Provider=<provider>
```

### Provider Examples

#### Azure AI Foundry

```
Endpoint=https://your-resource.openai.azure.com;AccessKey=your-azure-key;Model=gpt-4o;Provider=AzureAIFoundry
```

| Field | Value |
|---|---|
| Endpoint | Your Azure OpenAI resource URL |
| AccessKey | Azure API key |
| Model | Deployment name (e.g. `gpt-4o`, `gpt-4o-mini`) |
| Provider | `AzureAIFoundry` |

#### OpenAI

```
Endpoint=https://api.openai.com;AccessKey=sk-your-openai-key;Model=gpt-4o;Provider=OpenAI
```

| Field | Value |
|---|---|
| Endpoint | `https://api.openai.com` |
| AccessKey | Your OpenAI API key |
| Model | Model name (e.g. `gpt-4o`, `gpt-4o-mini`) |
| Provider | `OpenAI` |

#### Ollama

```
Endpoint=http://ollama:11434;AccessKey=not-required;Model=llama3.1;Provider=Ollama
```

| Field | Value |
|---|---|
| Endpoint | Ollama server URL (default `http://ollama:11434`) |
| AccessKey | Not required for Ollama -- use any placeholder value |
| Model | Model name as shown by `ollama list` (e.g. `llama3.1`, `qwen2.5`) |
| Provider | `Ollama` |

:::tip
For the best privacy-first experience, run Ollama locally. All inference stays on your hardware.
:::

#### Anthropic

```
Endpoint=https://api.anthropic.com;AccessKey=sk-ant-your-key;Model=claude-sonnet-4-20250514;Provider=Anthropic
```

| Field | Value |
|---|---|
| Endpoint | `https://api.anthropic.com` |
| AccessKey | Your Anthropic API key |
| Model | Model name (e.g. `claude-sonnet-4-20250514`, `claude-haiku-4-20250414`) |
| Provider | `Anthropic` |

#### Google Gemini

```
Endpoint=https://generativelanguage.googleapis.com;AccessKey=your-google-key;Model=gemini-2.0-flash;Provider=Gemini
```

| Field | Value |
|---|---|
| Endpoint | `https://generativelanguage.googleapis.com` |
| AccessKey | Your Google AI API key |
| Model | Model name (e.g. `gemini-2.0-flash`, `gemini-2.5-pro`) |
| Provider | `Gemini` |

## Step 3 -- Set a Default Provider

One provider must be marked as the **default**. This is the model used by agents that do not have a specific model override. Click the star icon next to a provider to make it the default.

## Step 4 -- Assign Models to Agents

Navigate to **Agent Definitions** in the sidebar. Select an agent and set the **Model Connection** field to the name of the provider you want that agent to use.

Leave the field blank to use the system default.

### Example Configuration

| Agent | Provider | Rationale |
|---|---|---|
| Orchestrator | Azure OpenAI (GPT-4o) | Best routing accuracy |
| LightAgent | Ollama (llama3.1) | Fast, local, simple tool calls |
| ClimateAgent | Ollama (llama3.1) | Fast, local, simple tool calls |
| GeneralAgent | OpenAI (GPT-4o) | Complex reasoning and knowledge |
| MusicAgent | Anthropic (Claude Sonnet) | Strong conversational ability |

## Verifying the Configuration

After saving your provider and agent settings:

1. Open the **Conversations** page.
2. Send a message that targets each agent.
3. Expand the conversation trace -- the **Model** field shows which provider handled the request.

:::tip
If an agent's assigned provider is unreachable, Lucia will log an error and the request will fail. It does not automatically fall back to another provider.
:::

## What's Next?

- [Build a Custom Agent](./custom-agent.md) -- create agents with specific model assignments.
- [Export Training Data](./training-export.md) -- export conversations for fine-tuning.

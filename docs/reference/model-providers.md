---
sidebar_position: 3
title: Model Providers
---

# Model Providers

Lucia supports multiple LLM providers through a unified interface. You can mix and match providers across agents -- for example, use a fast local model for routing and a cloud model for complex agents. All provider configuration is managed through the **Providers** page in the Lucia dashboard.

## Supported Providers

| Provider | Status | Function Calling | Streaming |
|---|---|---|---|
| Azure OpenAI | Supported | Yes | Yes |
| OpenAI | Supported | Yes | Yes |
| Ollama | Supported | Yes ¹ | Yes |
| Anthropic | Supported | Yes | Yes |
| Google Gemini | Supported | Yes | Yes |
| Azure AI Inference | Supported | Yes | Yes |
| OpenRouter / OpenAI-compatible | Supported | Yes ¹ | Yes |
| GitHub Copilot SDK | Experimental | Yes | Yes |

:::warning Function Calling Required
Lucia agents depend on function calling (tool use) to interact with Home Assistant services. **Only models that support function calling are compatible.** This is especially important for Ollama and OpenRouter, where not all models support tool use.

¹ For **Ollama**, use models with tool support such as `llama3.1`, `qwen2.5`, or `mistral`. Check `ollama show <model>` for the `tools` capability.

¹ For **OpenRouter**, select the **OpenRouter** provider type in the dashboard — it pre-filters the model list to only show models that support tool calling. If a model is missing from the list, it likely does not support function calling.
:::

## Managing Providers in the Dashboard

Navigate to **Providers** in the sidebar to view and manage your configured model providers.

![Model Providers List](/img/dashboard/model-providers-list.png)

Each provider card shows its display name, provider type, model, endpoint, authentication method, and status. From here you can:

- **Test** -- send a test prompt to verify the provider is working.
- **Edit** -- modify the provider's configuration.
- **Select Model** -- browse and select from available models (supported by Ollama and OpenRouter).
- **Delete** -- remove a non-default provider.

## Adding a Provider

Click **+ Add Provider** to configure a new model provider.

![Add Model Provider](/img/dashboard/model-providers-add.png)

Fill in the following fields:

| Field | Description |
|---|---|
| **Provider ID** | A unique key to reference this provider (e.g., `gpt4o-prod`, `ollama-local`). |
| **Display Name** | A human-readable label shown in the dashboard. |
| **Purpose** | Whether this provider is for **Chat** (LLM text generation) or **Embedding**. |
| **Provider Type** | The backend service -- select from the dropdown. |
| **Endpoint URL** | The API endpoint. Leave blank for providers with well-known defaults (e.g., OpenAI, Anthropic). |
| **Model / Deployment Name** | The model identifier. You can type it manually or use **Load Models** to discover available models. |
| **Auth Type** | Authentication method -- typically **API Key** for cloud providers, or **None** for local services like Ollama. |
| **API Key** | Your API key or access token (if applicable). |

### Selecting a Provider Type

The **Provider Type** dropdown lists all supported backends:

![Provider Type Dropdown](/img/dashboard/model-providers-type-dropdown.png)

The dashboard auto-fills the default endpoint URL and adjusts the available options based on the selected provider type.

## Editing a Provider

Click **Edit** on any provider card to modify its configuration.

![Edit Provider](/img/dashboard/model-providers-edit.png)

All fields except the Provider ID can be changed. Click **Save Changes** to apply, or **Cancel** to discard.

## Model Discovery

Ollama and OpenRouter support **model discovery** -- the dashboard can query the provider's API to list available models, so you don't need to remember or look up model identifiers manually.

There are two ways to discover models:

### Select Model (from the provider list)

On the main Providers page, click **Select Model** on any Ollama or OpenRouter provider card. This opens an inline model picker with a searchable dropdown of all available models.

![Ollama Select Model](/img/dashboard/model-providers-ollama-select.png)

### Load Models (from the edit form)

When editing a provider, click the **↻ Load models** button to fetch the model list from the provider's API. A **Select model** dropdown appears above the manual model field, letting you pick from discovered models.

![OpenRouter Model Discovery](/img/dashboard/model-providers-openrouter-discovery.png)

The dropdown includes a **Type to filter** search box -- useful for OpenRouter, which exposes hundreds of models. The OpenRouter provider pre-filters this list to only include models that support function calling. If a model you expect is missing, it likely does not support tool use.

![OpenRouter Select Model](/img/dashboard/model-providers-openrouter-select.png)

## Provider-Specific Notes

### Ollama

- **Endpoint**: Defaults to `http://localhost:11434`. Change this if Ollama runs on a different host.
- **Auth**: Set to **None** -- Ollama does not require authentication.
- **Model Discovery**: Queries your Ollama instance for installed models. Only models with function calling support will work with Lucia agents -- use models such as `llama3.1`, `qwen2.5`, or `mistral`.

### OpenRouter

- **Endpoint**: Set to `https://openrouter.ai/api/v1/`.
- **Auth**: Requires an OpenRouter API key.
- **Model Discovery**: The model list is pre-filtered to only show models that support function calling. If a model you expect is missing from the list, it likely does not support tool use.

### Azure OpenAI

- **Endpoint**: Your Azure OpenAI resource URL (e.g., `https://myresource.openai.azure.com/`).
- **Model**: Use the deployment name, not the base model name.

### Anthropic

- **Endpoint**: Defaults to `https://api.anthropic.com`.
- **Auth**: Requires an Anthropic API key (starts with `sk-ant-`).

### Google Gemini

- **Endpoint**: Defaults to `https://generativelanguage.googleapis.com`.
- **Auth**: Requires a Google AI API key.

## Embedding Providers

Lucia uses embeddings for semantic routing, prompt caching, and entity matching. When adding a provider, set the **Purpose** to **Embedding** to configure an embedding model.

| Provider | Embedding Support | Recommended Model |
|---|---|---|
| Azure OpenAI | Yes | `text-embedding-3-small` |
| Ollama | Yes | `nomic-embed-text` |

## Multi-Provider Setup

You can configure multiple providers and assign them to different agents. This lets you use a fast, cheap model for simple device control and a more capable model for complex reasoning tasks. Agent-to-provider assignment is managed through the [Agent Definitions](/docs/dashboard/agent-definitions) page.

For example, a typical multi-provider setup might include:

- A local **Ollama** model for the RouterExecutor (fast intent classification).
- An **Azure OpenAI** deployment for LightAgent and ClimateAgent (reliable tool use).
- An **OpenAI** model for GeneralAgent (strong reasoning for open-ended queries).

## Testing Providers

After adding or editing a provider, click **Test** to send a verification prompt. The test confirms that the endpoint is reachable, authentication is valid, and the model responds correctly. For embedding providers, click **Test Embedding** to verify embedding generation.

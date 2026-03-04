---
sidebar_position: 6
title: Model Providers
---

# Model Providers

The Model Providers page lets you manage connections to LLM provider backends.

![Model Providers](/img/dashboard/model-providers.png)

## Supported Providers

Lucia supports multiple LLM providers out of the box:

- **Azure AI Foundry** -- connect with your Azure deployment endpoint and API key.
- **OpenAI** -- use the OpenAI API directly.
- **Ollama** -- connect to a local Ollama instance for self-hosted models.
- Additional providers can be added through the plugin system.

## Adding a Provider

Click **Add Provider**, select the provider type, and enter the required credentials (API key, endpoint URL, etc.). Lucia will validate the connection before saving.

## Per-Agent Model Assignment

Once providers are configured, you can assign specific models to individual agents. This allows you to route lightweight requests to smaller, faster models while reserving larger models for complex tasks. Model assignments are configured on the **Agent Definitions** page or through the configuration editor.

## Provider Status

Each provider card shows its connection status, configured models, and recent error count.

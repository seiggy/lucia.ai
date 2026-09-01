---
sidebar_position: 1
title: Introduction
---

# Introduction

**Lucia** (pronounced "LOO-sha") is an open-source, privacy-first AI home assistant designed to replace cloud-dependent assistants like Amazon Alexa and Google Home. Named after the Nordic goddess of light, Lucia brings intelligent voice and text control to your smart home while keeping your data under your control.

Built on the [Microsoft Agent Framework](https://github.com/microsoft/agent-framework) with a multi-agent architecture, Lucia integrates deeply with [Home Assistant](https://www.home-assistant.io/) to give you natural-language control over your entire home -- lights, climate, media, sensors, automations, and more.

## Key Features

- **Multi-Agent Orchestration** -- A central orchestrator delegates tasks to specialized agents (lighting, climate, media, routines, and more), each optimized for its domain.
- **Sensor and Security Agents** -- Read live sensor values, check doors and motion, arm alarm panels, and control locks through dedicated agents.
- **Semantic Understanding** -- Lucia interprets natural language and maps it to Home Assistant entities, services, and automations without rigid command syntax.
- **Local Voice Control** -- Wyoming protocol integration enables fast, local speech-to-text via multiple inference engines (Sherpa, Granite, Hybrid). See [Voice Platform](../architecture/voice-platform.md) for details.
- **Fast Command Execution** -- Recognized commands execute in `<50ms` via the [Conversation Command Parser](../api/conversation-api.md), with instant JSON responses for parsed patterns.
- **Privacy First** -- Run everything locally with Ollama, or choose your own cloud provider. Your conversations and home data never leave your infrastructure unless you decide otherwise.
- **Deep Home Assistant Integration** -- A custom integration connects Lucia directly to the HA Conversation API, exposing all entities, areas, and automations to the agent framework.
- **Full Dashboard** -- A built-in web UI with System, Light, and Dark themes for configuration, conversation history, agent monitoring, and diagnostics.
- **Extensible Plugin System** -- Add custom agents, tools, and integrations to tailor Lucia to your exact setup.
- **Production Observability** -- Optional OpenTelemetry, Grafana, Tempo, Prometheus, and Loki deployment with service, speech, database, and Jetson dashboards.
- **Flexible Persistence** -- Choose SQLite, PostgreSQL, or MongoDB for durable data and InMemory or Redis for caching.

## Supported Inference Platforms

Lucia supports a wide range of LLM providers through the Microsoft Agent Framework:

| Platform | Status |
|---|---|
| Azure OpenAI | Supported |
| OpenAI | Supported |
| Ollama | Supported |
| Anthropic | Supported |
| Google Gemini | Supported |
| Azure AI Inference | Supported |
| OpenRouter | Supported |
| Inception | Supported |
| GitHub Copilot SDK | Experimental |

All providers must support **function calling** (tool use), which is required for Lucia's agentic architecture. For Ollama, use models with tool support such as `llama3.1` or `qwen2.5`. For OpenRouter, the dashboard pre-filters to tool-calling models — if a model is missing from the list, it likely doesn't support function calling.

:::tip
For the best privacy-first experience, pair Lucia with [Ollama](https://ollama.com/) running a local model. For the best overall performance, Azure OpenAI or OpenAI with GPT-OSS-120b is recommended.
:::

## What's Next?

Head to the [Quickstart](./quickstart.md) guide to get Lucia running in minutes with Docker Compose.

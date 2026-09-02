---
sidebar_position: 1
title: Dashboard Overview
---

# Dashboard Overview

Lucia's management dashboard is a single-page application built with **React 19**, **Vite**, **TanStack Query**, and **Tailwind CSS**. It provides over 20 pages for monitoring and configuring every aspect of your Lucia installation.

## Theme

Choose **System**, **Light**, or **Dark** from the dashboard theme control. Explicit choices persist in the browser; System follows the operating-system preference. The preference is resolved before the application paints to avoid a flash of the wrong theme.

## Authentication

Access to the dashboard is gated by API key authentication. On first load you will be prompted to enter your API key. The key is stored in the browser and sent with every request.

## Key Features

- **Real-time monitoring**: live metrics, activity feeds, and trace inspection.
- **Accessible themes**: System, Light, and Dark modes backed by shared semantic color tokens.
- **Agent management**: register A2A agents, define custom agents, and assign model providers.
- **Tool integration**: connect MCP servers and discover available tools.
- **Configuration**: schema-driven editor for all Lucia settings with sensitive value masking.
- **Data exports**: export labeled traces as training datasets for RLHF workflows.
- **Plugin ecosystem**: install, manage, and browse community plugins.

## Navigation

The sidebar organizes pages into logical groups. The **Activity** page is the default landing page and provides an at-a-glance view of system health. Use the pages listed in this section to explore each feature in detail.

## Pages Overview

### Monitoring & Diagnostics
- **Activity**: Real-time mesh topology, request metrics, and activity feed
- **Traces**: Conversation history with per-agent breakdown, labeling, and exports
- **Conversation Test**: Interactive chat interface at `/conversation` for testing the command parser directly

### Configuration & Management
- **Agent Definitions**: Create and edit custom agents with tool assignments and model providers
- **Model Providers**: Connect and manage LLM backends (OpenAI, Azure, Anthropic, Ollama, etc.)
- **MCP Servers**: Discover and manage Model Context Protocol tool servers
- **Response Templates**: Manage response templates per skill for customizing command output
- **Configuration**: Schema-driven settings editor with live validation
- **Voice Platform**: Wyoming speech pipeline configuration, speaker profiles, wake words, and real-time session monitoring

### Data & Administration
- **Dataset Exports**: Generate OpenAI-compatible JSONL files from conversation traces
- **Tasks**: Active and archived task management with cancellation
- **Plugins**: Install, enable/disable, and manage community plugins
- **API Keys**: Create and rotate authentication keys
- **Appliance**: On Appliance OS, inspect the Jetson, storage, services, Wi-Fi, telemetry, and available releases

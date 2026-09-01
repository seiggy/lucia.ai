---
sidebar_position: 1
title: Home Assistant Integration
---

# Home Assistant Integration

Lucia integrates with [Home Assistant](https://www.home-assistant.io/) through a custom component that connects your smart home to the Lucia agent system. The integration implements Home Assistant's **Conversation API**, allowing you to use Lucia as your voice and text assistant directly within the HA ecosystem.

## Architecture

The integration is a **Python custom component** that runs inside Home Assistant. It sends structured requests to the Lucia .NET agent host through `POST /api/conversation`, receiving immediate JSON for fast-path commands or streamed events for LLM orchestration.

```mermaid
graph LR
    subgraph HA["Home Assistant"]
        LC["Lucia Component<br/>(Conversation API)"]
        HAData["Entities, Areas,<br/>Automations"]
    end

    subgraph Lucia["Lucia Agent Host"]
        Orch["AgentHost<br/>Orchestrator"]
        Agents["Agents"]
        Orch --> Agents
    end

    LC -- "REST Conversation<br/>Request / Response" --> Orch
    Orch -- "JSON or SSE<br/>Response" --> LC
    Agents -. "Service Calls" .-> HAData
```

## How It Works

1. **Voice or text input** arrives in Home Assistant (via the Assist pipeline, a dashboard card, or a voice satellite).
2. The **Lucia custom component** receives the input through the Conversation API.
3. The component sends text and Home Assistant context to the **Lucia agent host** through the REST Conversation API.
4. The **AgentHost orchestrator** routes the request to the appropriate specialized agent (lighting, climate, media, etc.).
5. The agent processes the command, calls Home Assistant services as needed, and returns a response.
6. The response returns as JSON or Server-Sent Events, then the custom component delivers it to Home Assistant for **speech output or display**.

## Key Capabilities

- **Natural language control**: "Turn off the living room lights" or "Set the thermostat to 72" without rigid command syntax.
- **Entity awareness**: Lucia sees your exposed entities, areas, and floors, and uses them to understand context.
- **Conversation history**: Multi-turn conversations are maintained so you can issue follow-up commands naturally.
- **Automatic routing**: Lucia chooses the best specialized agent from the request and Home Assistant context.

## What's Next?

- [Installation](./installation.md): install the custom component via HACS or manually.
- [Configuration](./configuration.md): connect the component to your Lucia instance.
- [Entity Management](./entity-management.md): control which entities Lucia can see and interact with.
- [Conversation API](./conversation-api.md): understand the request/response flow in detail.

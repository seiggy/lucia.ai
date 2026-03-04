---
sidebar_position: 4
title: Agent Registry
---

# Agent Registry

The Agent Registry page displays all agents currently registered with Lucia, including both built-in and external A2A agents.

![Agent Registry](/img/dashboard/agents.png)

## Agent Cards

Each agent is shown as a card listing its:

- **Name** and description.
- **Capabilities** -- the set of actions the agent can perform.
- **Skills** -- specific skills the agent advertises.
- **Status** -- whether the agent is online, offline, or degraded.

## Registering an Agent

Click **Register Agent** to add a new A2A-compatible agent. Provide the agent's URL endpoint and Lucia will fetch its agent card to populate capabilities and metadata automatically.

## Test Messages

Select any agent and click **Send Test Message** to open a test panel. Enter a prompt and send it directly to the agent, bypassing the orchestrator. The response and any tool calls are displayed in the panel. This is useful for verifying connectivity and expected behavior before routing live traffic to the agent.

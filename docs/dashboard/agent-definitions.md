---
sidebar_position: 5
title: Agent Definitions
---

# Agent Definitions

The Agent Definitions page lets you create and manage custom agents at runtime without writing any code.

![Agent Definitions](/img/dashboard/agent-definitions.png)

## Creating an Agent

Click **New Agent** and fill in the following fields:

- **Name** -- a unique identifier for the agent.
- **System Prompt** -- the instructions that define the agent's behavior.
- **Model Override** -- optionally select a specific model and provider instead of using the system default.
- **MCP Tools** -- use the tool picker to select which MCP tools this agent is allowed to invoke.

## Managing Agents

Existing agent definitions are listed in a table. Each row shows the agent name, assigned model, and tool count. Click an agent to edit its definition or delete it.

## How It Works

Agent definitions are stored in the database and loaded by the orchestrator at routing time. Changes take effect immediately -- there is no restart required. Custom agents participate in the same routing logic as built-in agents.

---
sidebar_position: 1
title: Build a Custom Agent
---

# Build a Custom Agent

This tutorial walks you through creating a custom agent entirely from the Lucia dashboard. By the end you will have a new agent that the orchestrator can route requests to, backed by the MCP tools of your choice.

## Prerequisites

- Lucia running with the dashboard accessible.
- At least one MCP tool server registered (see [Working with MCP Tools](./mcp-tools.md) if you need to add one).

## Step 1 -- Register MCP Tool Servers

Before you can assign tools to an agent, the tool servers must be registered in Lucia.

Navigate to **MCP Servers** in the dashboard sidebar. Click **Add Server** and fill in the transport details.

### stdio (Local Tools)

Use stdio transport for tools that run on the same host as Lucia. The tool process is spawned and managed by the agent host.

| Field | Example Value |
|---|---|
| Name | `dotnet-tools` |
| Transport | stdio |
| Command | `dnx` |
| Arguments | `run --project /tools/MyTools.csproj` |

### HTTP/SSE (Remote Tools)

Use HTTP/SSE transport for tools running as standalone services, on other machines, or in separate containers.

| Field | Example Value |
|---|---|
| Name | `search-service` |
| Transport | HTTP/SSE |
| URL | `http://search-tools:8080/mcp` |

After adding each server, click **Connect** and then **Discover Tools** to pull the tool manifest.

## Step 2 -- Create the Agent Definition

Navigate to **Agent Definitions** in the dashboard sidebar and click **New Agent**.

Fill in the following fields:

| Field | Description |
|---|---|
| **Name** | Internal identifier used by the orchestrator for routing (e.g. `SecurityAgent`). Must be unique. |
| **Display Name** | Human-readable name shown in the dashboard and conversation UI (e.g. `Security Agent`). |
| **Instructions** | The system prompt that defines the agent's personality, domain expertise, and behavioral rules. |
| **Model Connection** | *(Optional)* Override the default model provider for this agent. Leave blank to use the system default. |
| **MCP Tools** | Select the tools this agent should have access to from the discovered tool list. |

### Example: Weather Agent

| Field | Value |
|---|---|
| Name | `WeatherAgent` |
| Display Name | `Weather Agent` |
| Instructions | `You are a weather assistant. Use the get_forecast tool to answer questions about current and upcoming weather conditions. Always include the location and time range in your response.` |
| Model Connection | *(blank -- use system default)* |
| MCP Tools | `get_forecast`, `get_current_conditions` |

## Step 3 -- Save and Verify

Click **Save**. The agent is immediately registered with the orchestrator and available for routing -- no restart required.

To verify, open the **Conversations** page and send a message that matches your agent's domain. The conversation trace will show which agent handled the request.

## Extending the Container for Non-.NET Runtimes

If your MCP tools require a runtime that is not included in the default Lucia image (for example, Python or Node.js), you can extend the container.

Create a `Dockerfile` that builds on the Lucia base image:

```dockerfile
FROM ghcr.io/lucia-ai/lucia:latest

# Install Node.js for JavaScript-based MCP tools
RUN apt-get update && \
    apt-get install -y --no-install-recommends nodejs npm && \
    rm -rf /var/lib/apt/lists/*

# Install your tool dependencies
COPY tools/package.json /tools/package.json
RUN cd /tools && npm install

COPY tools/ /tools/
```

Build and run the extended image in place of the default one:

```bash
docker build -t lucia-custom .
docker run -d --name lucia -p 7235:8080 lucia-custom
```

:::tip
When using Docker Compose, replace the `image` field in your `docker-compose.yml` with a `build` directive pointing to your custom Dockerfile.
:::

## What's Next?

- [Working with MCP Tools](./mcp-tools.md) -- learn more about registering and managing tool servers.
- [Multi-LLM Setup](./multi-llm.md) -- assign a specific model provider to your custom agent.
- [Agents Overview](/docs/agents/overview) -- understand how the orchestrator routes requests to agents.

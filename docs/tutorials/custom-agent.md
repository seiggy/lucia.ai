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

Navigate to **MCP Servers** in the dashboard sidebar. You'll see any servers already configured.

![MCP Servers List](/img/tutorials/mcp-servers-list.png)

Click **+ Add Server** to register a new tool server.

![Add MCP Server](/img/tutorials/mcp-add-server.png)

Fill in the form fields:

| Field | Description |
|---|---|
| **Name** | A human-readable name for the server (e.g., `search-service`). |
| **Transport Type** | **stdio** for tools running on the same host (Lucia spawns the process), or **HTTP/SSE** for remote tool servers. |
| **Command** *(stdio only)* | The command to start the tool process (e.g., `npx`, `dnx`, `python`). |
| **Arguments** *(stdio only)* | Command arguments (e.g., `-y @modelcontextprotocol/server-github`). |
| **URL** *(HTTP/SSE only)* | The remote server endpoint (e.g., `http://search-tools:8080/mcp`). |
| **Environment Variables** | Any env vars the tool process needs (e.g., API keys). |

After creating the server, click **Connect** and then **Discover Tools** to pull the tool manifest.

## Step 2 -- Create the Agent Definition

Navigate to **Definitions** in the dashboard sidebar. You'll see the list of existing agents.

![Agent Definitions List](/img/tutorials/agent-definitions-list.png)

Click **+ New Agent** to open the creation form.

![Create Agent Form](/img/tutorials/agent-create-form.png)

Fill in the following fields:

| Field | Description |
|---|---|
| **Name** | Internal identifier used by the orchestrator for routing (e.g., `weather-agent`). Must be unique. |
| **Display Name** | Human-readable name shown in the dashboard (e.g., `Weather Agent`). |
| **Model Provider** | *(Optional)* Override the default model provider for this agent. Leave blank to use the system default. |
| **Embedding Provider** | *(Optional)* Override the embedding provider for skills that use vector search. |
| **Description** | A short summary of what the agent does. |
| **Instructions** | The system prompt that defines the agent's personality, domain expertise, and behavioral rules. |
| **MCP Tools** | Select the tools this agent should have access to from discovered tool servers. |

### Example: A Completed Agent

Here's what a configured custom agent looks like -- in this case a "Dad Joke Agent" with a detailed system prompt and a specific model override:

![Edit Agent Example](/img/tutorials/agent-edit-example.png)

## Step 3 -- Save and Verify

Click **Create Agent**. The agent is immediately registered with the orchestrator and available for routing -- no restart required.

To verify, open the **Traces** page and send a message through Home Assistant that matches your agent's domain. The conversation trace will show which agent handled the request.

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

---
sidebar_position: 3
title: Working with MCP Tools
---

# Working with MCP Tools

MCP (Model Context Protocol) is the standard Lucia uses to connect agents to external tools. This tutorial shows you how to register MCP tool servers, discover their tools, and assign those tools to agent definitions.

## Overview

MCP tool servers expose capabilities that agents can invoke during conversations. Lucia supports two transport modes:

| Transport | Use Case | How It Works |
|---|---|---|
| **stdio** | Local tools running on the same host | Lucia spawns the tool process and communicates over standard input/output |
| **HTTP/SSE** | Remote tools running as standalone services | Lucia connects to the tool server over HTTP with Server-Sent Events for streaming |

## Step 1 -- Navigate to MCP Servers

Open the Lucia dashboard and click **MCP Servers** in the sidebar. This page lists all registered tool servers and their connection status.

## Step 2 -- Add a Tool Server

Click **Add Server**. Fill in the form based on your transport type.

### stdio Transport (Local Tools)

Use stdio for tools that run locally. This is ideal for .NET-based tools using the `dnx` runtime or any CLI tool that speaks MCP over stdin/stdout.

| Field | Description | Example |
|---|---|---|
| **Name** | A unique identifier for this server | `ha-entity-tools` |
| **Transport** | Select `stdio` | -- |
| **Command** | The executable to run | `dnx` |
| **Arguments** | Command-line arguments | `run --project /tools/EntityTools.csproj` |
| **Working Directory** | *(Optional)* Working directory for the process | `/tools` |
| **Environment Variables** | *(Optional)* Key-value pairs passed to the process | `HA_TOKEN=your_token` |

### HTTP/SSE Transport (Remote Tools)

Use HTTP/SSE for tools running as separate services, in other containers, or on remote machines.

| Field | Description | Example |
|---|---|---|
| **Name** | A unique identifier for this server | `web-search` |
| **Transport** | Select `HTTP/SSE` | -- |
| **URL** | The MCP endpoint URL | `http://searxng:8080/mcp` |
| **Headers** | *(Optional)* Custom HTTP headers for authentication | `Authorization: Bearer token123` |

## Step 3 -- Connect and Discover Tools

After adding the server:

1. Click **Connect** to establish the connection. The status indicator will turn green when connected.
2. Click **Discover Tools** to pull the tool manifest from the server.

Lucia reads the tool definitions -- including name, description, and input schema -- and makes them available for assignment.

:::tip
If discovery fails, check that the tool server is running and reachable. For stdio servers, verify the command and arguments. For HTTP/SSE servers, confirm the URL is correct and any required headers are set.
:::

## Step 4 -- Assign Tools to Agent Definitions

Navigate to **Agent Definitions** in the sidebar. Select an existing agent or create a new one (see [Build a Custom Agent](./custom-agent.md)).

In the **MCP Tools** section, select the tools you want this agent to have access to. The dropdown shows all discovered tools across all connected servers.

Click **Save**. The agent can now invoke the selected tools during conversations.

## Example: Adding SearXNG Web Search

This example registers a SearXNG instance as an MCP tool server and assigns it to the GeneralAgent.

1. **Add Server:**
   - Name: `searxng`
   - Transport: HTTP/SSE
   - URL: `http://searxng:8080/mcp`

2. **Connect and Discover.** You should see tools like `web_search` and `image_search`.

3. **Assign to Agent:**
   - Open the `GeneralAgent` definition.
   - In MCP Tools, select `web_search`.
   - Save.

The GeneralAgent can now search the web when answering questions.

## Managing Tool Servers

### Refresh Tools

If a tool server updates its manifest (adds or removes tools), click **Discover Tools** again to refresh.

### Remove a Server

Click the delete icon next to a server entry. Any agents that had tools from this server assigned will lose access to those tools.

### Connection Status

The dashboard shows a real-time connection status for each server:

| Status | Meaning |
|---|---|
| **Connected** | Server is reachable and tools are available |
| **Disconnected** | Connection lost -- Lucia will retry automatically |
| **Error** | Configuration issue -- check server settings |

## What's Next?

- [Build a Custom Agent](./custom-agent.md) -- create an agent that uses your MCP tools.
- [Multi-LLM Setup](./multi-llm.md) -- configure multiple model providers.

---
sidebar_position: 9
title: Custom Agents
---

# Custom Agents

Lucia allows you to create new agents at runtime through the dashboard -- no code changes, no redeployment, no container rebuilds. Custom agents are immediately available to the orchestrator's router.

## How It Works

Custom agents are powered by **MCP (Model Context Protocol) Tool Servers**. You register one or more MCP servers, then create an agent definition that references the tools those servers expose. The orchestrator treats custom agents identically to built-in agents for routing purposes.

## Step 1: Register MCP Tool Servers

Navigate to **Dashboard > MCP Servers** and add your tool server.

Lucia supports two MCP transport modes:

### stdio (Local Process)

The agent host spawns the MCP server as a child process and communicates over stdin/stdout.

```json
{
  "name": "weather-tools",
  "transport": "stdio",
  "command": "npx",
  "args": ["-y", "@example/weather-mcp-server"]
}
```

### HTTP/SSE (Remote)

The MCP server runs as a standalone HTTP service. Lucia connects to its Server-Sent Events endpoint.

```json
{
  "name": "calendar-tools",
  "transport": "sse",
  "url": "http://calendar-mcp-server:3001/sse"
}
```

:::tip
HTTP/SSE servers can run anywhere -- in a sidecar container, on a remote machine, or as a cloud service. This is the recommended transport for production deployments.
:::

## Step 2: Define the Agent

Navigate to **Dashboard > Agent Definitions** and create a new agent.

| Field | Description | Example |
|---|---|---|
| **Name** | Internal identifier (no spaces) | `weather_agent` |
| **Display Name** | Human-readable name shown in UI | `Weather Agent` |
| **Instructions** | System prompt for the agent LLM | "You are a weather assistant. Use the available tools to answer weather questions." |
| **Model Connection** | Override the default LLM (optional) | `ollama/llama3` |
| **MCP Tools** | Select tools from registered MCP servers | `weather-tools.get_forecast`, `weather-tools.get_current` |

### Instructions (System Prompt)

The instructions field is the system prompt passed to the LLM when this agent is invoked. Write it as if you are briefing the agent on its role:

```
You are a weather assistant integrated into a smart home system.
When the user asks about weather, use the get_forecast and get_current tools.
Always include the location and time period in your response.
If the user doesn't specify a location, use their home location.
```

### Model Connection Override

By default, custom agents use the same LLM provider configured for the system. You can override this per-agent -- for example, using a smaller local model for simple lookup agents or a more capable model for complex reasoning.

## Step 3: Agent Is Available

Once saved, the custom agent is immediately registered with the orchestrator. The router's agent table is updated to include the new agent's name and description, so it can be selected for matching requests.

No restart is required. You can test the agent immediately from the dashboard's chat interface.

```
User: "What's the weather forecast for tomorrow?"

Orchestrator:
  1. Router sees "weather_agent" in the agent table
  2. Routes to WeatherAgent
  3. WeatherAgent calls get_forecast tool via MCP
  4. Returns the forecast to the user
```

## Extending the Container for npx-based MCP Tools

The default Lucia container runs on a .NET base image that does not include Node.js. If your MCP tool servers use `npx` (common for community MCP packages), you need to extend the container image.

### Dockerfile

```dockerfile
FROM seiggy/lucia-agenthost:latest

# Install Node.js 22.x
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Verify installation
RUN node --version && npm --version && npx --version
```

### Build and Use

```bash
docker build -t lucia-agenthost-node:latest .
```

Update your `docker-compose.yml` to use the custom image:

```yaml
services:
  lucia:
    image: lucia-agenthost-node:latest
    # ... rest of your configuration
```

:::warning
Only install Node.js if you need `npx`-based MCP servers. The additional layer adds approximately 100 MB to the image. If all your MCP servers use HTTP/SSE transport, the default image is sufficient.
:::

## Example: Creating a GitHub Agent

Here is a complete example of creating a custom agent that can query GitHub repositories.

### 1. Register the MCP Server

```json
{
  "name": "github-tools",
  "transport": "stdio",
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx"
  }
}
```

### 2. Define the Agent

| Field | Value |
|---|---|
| Name | `github_agent` |
| Display Name | `GitHub Agent` |
| Instructions | "You are a GitHub assistant. Help the user query repositories, issues, and pull requests." |
| MCP Tools | `github-tools.search_repositories`, `github-tools.list_issues`, `github-tools.get_pull_request` |

### 3. Test It

```
User: "Show me open issues in the lucia repo"

GitHubAgent:
  1. Calls search_repositories to find the Lucia repo
  2. Calls list_issues with state=open
  3. Responds with a summary of open issues
```

## Limitations

- Custom agents cannot currently define their own entity matchers -- they rely on the MCP tools for domain logic.
- stdio-based MCP servers run as child processes of the agent host. If the agent host restarts, the MCP server process restarts as well.
- Custom agents are stored in the Lucia configuration database and persist across restarts.

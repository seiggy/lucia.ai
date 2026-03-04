---
sidebar_position: 7
title: MCP Servers
---

# MCP Servers

The MCP Servers page lets you register and manage Model Context Protocol tool servers that extend Lucia's capabilities.

![MCP Servers](/img/dashboard/mcp-servers.png)

## Transport Types

Lucia supports two MCP transport modes:

- **stdio** -- for locally running tool servers. Lucia spawns the process and communicates over standard input/output.
- **HTTP/SSE** -- for remote tool servers. Lucia connects to the server's HTTP endpoint and receives tool updates via Server-Sent Events.

## Registering a Server

Click **Add Server** and select the transport type. For stdio servers, provide the command and arguments. For HTTP/SSE servers, provide the URL. Lucia will attempt to connect immediately.

## Tool Discovery

Once connected, Lucia automatically discovers the tools exposed by the server. The discovered tools are listed under each server entry with their names, descriptions, and input schemas.

## Managing Servers

You can disconnect, reconnect, or remove servers from this page. Connected servers show a green status indicator. Tools from connected servers become available for assignment to agents on the Agent Definitions page.

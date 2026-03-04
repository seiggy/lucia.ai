---
sidebar_position: 4
title: Plugin API
---

# Plugin API

Lucia exposes a REST API for managing plugins, browsing the plugin store, and configuring plugin repositories. All endpoints are served by the agent host on the same port as the main application.

## Installed Plugins

### List Installed Plugins

```http
GET /api/plugins/installed
```

Returns all plugins currently installed on the system, including their enabled/disabled state.

**Response:**

```json
[
  {
    "id": "metamcp-bridge",
    "name": "MetaMCP Bridge",
    "version": "1.0.1",
    "enabled": true,
    "author": "Lucia Team"
  },
  {
    "id": "searxng-search",
    "name": "SearXNG Web Search",
    "version": "1.0.0",
    "enabled": false,
    "author": "Lucia Team"
  }
]
```

### Enable a Plugin

```http
POST /api/plugins/installed/{pluginId}/enable
```

Enables a previously disabled plugin. Requires a restart to take effect.

### Disable a Plugin

```http
POST /api/plugins/installed/{pluginId}/disable
```

Disables a plugin without removing it from disk. Requires a restart to take effect.

### Uninstall a Plugin

```http
DELETE /api/plugins/installed/{pluginId}
```

Removes the plugin folder from disk. Requires a restart to take effect.

:::warning
Uninstalling a plugin permanently deletes its folder and all files within it. This action cannot be undone.
:::

## Plugin Store

### Browse Available Plugins

```http
GET /api/plugins/store
```

Returns all plugins available for installation across all configured repositories.

**Response:**

```json
[
  {
    "id": "metamcp-bridge",
    "name": "MetaMCP Bridge",
    "description": "Bridges MetaMCP tool aggregation into the Lucia agent system.",
    "version": "1.0.1",
    "author": "Lucia Team",
    "tags": ["mcp", "tools"],
    "repositoryId": "official",
    "installed": true
  }
]
```

### Install a Plugin

```http
POST /api/plugins/store/{pluginId}/install
```

Downloads and installs the plugin from its repository. Requires a restart to activate.

**Request body (optional):**

```json
{
  "repositoryId": "official"
}
```

If `repositoryId` is omitted, Lucia searches all configured repositories and installs from the first match.

## Plugin Repositories

### List Repositories

```http
GET /api/plugins/repositories
```

Returns all configured plugin repositories.

**Response:**

```json
[
  {
    "id": "official",
    "name": "Lucia Official Plugins",
    "type": "git",
    "url": "https://github.com/lucia-ai/plugins",
    "lastSynced": "2026-03-04T12:00:00Z"
  }
]
```

### Add a Repository

```http
POST /api/plugins/repositories
```

**Request body:**

```json
{
  "id": "my-repo",
  "name": "My Plugin Repository",
  "type": "git",
  "url": "https://github.com/myorg/lucia-plugins",
  "blobSourceStrategy": "release"
}
```

### Update a Repository

```http
PUT /api/plugins/repositories/{repositoryId}
```

Updates the configuration for an existing repository.

### Delete a Repository

```http
DELETE /api/plugins/repositories/{repositoryId}
```

Removes a repository from the configuration. Does not uninstall any plugins that were installed from it.

### Sync a Repository

```http
POST /api/plugins/repositories/{repositoryId}/sync
```

Fetches the latest plugin manifest from the repository, updating the local cache of available plugins.

## System

### Graceful Restart

```http
POST /api/system/restart
```

Triggers a graceful restart of the agent host. All running agents are stopped, plugin changes are picked up, and the system restarts.

:::info
After calling this endpoint, the server will return `202 Accepted` and begin the shutdown sequence. The client should poll the health endpoint until the system is back online.
:::

**Response:**

```json
{
  "status": "restarting",
  "message": "Agent host is shutting down and will restart momentarily."
}
```

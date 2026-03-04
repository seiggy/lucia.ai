---
sidebar_position: 1
title: Plugin System
---

# Plugin System

Lucia's plugin system lets you extend the agent host with custom functionality -- new services, HTTP endpoints, tools, and integrations -- without recompiling the core application. Plugins are plain C# script files powered by [Roslyn CSharpScript](https://github.com/dotnet/roslyn/wiki/Scripting-API-Samples). There are no project files, no DLLs, and no build steps.

## How It Works

1. Create a folder under the `plugins/` directory.
2. Add a `plugin.cs` file that implements `ILuciaPlugin`.
3. Restart Lucia (or install via the API).
4. Your plugin is loaded, compiled, and executed automatically.

That's it. No `.csproj`, no `dotnet build`, no NuGet restore. The script runtime handles compilation and dependency resolution at startup.

## Directory Structure

```
plugins/
  my-plugin/
    plugin.cs          # Required -- plugin entry point
    README.md          # Optional -- description for the store
    config.json        # Optional -- default configuration
```

Each plugin lives in its own folder. The folder name is the plugin identifier used by the management API.

## Key Concepts

| Concept | Description |
|---|---|
| **Script-based** | Plugins are `.cs` files evaluated by Roslyn CSharpScript at runtime. |
| **ILuciaPlugin** | The interface every plugin must implement. Provides lifecycle hooks for DI registration, initialization, endpoint mapping, and startup. |
| **Auto-imported namespaces** | Common namespaces are imported automatically so scripts stay concise. |
| **Lifecycle hooks** | Four ordered hooks give plugins access to the host builder, service provider, HTTP pipeline, and post-startup events. |
| **Repository system** | Plugins can be discovered and installed from local or Git-based repositories. |

## Management

Plugins are managed through the REST API or the Lucia dashboard:

- **Install** plugins from configured repositories.
- **Enable / Disable** plugins without removing them.
- **Uninstall** plugins to remove them entirely.
- **Restart** the agent host to pick up changes.

See the [Plugin API](./api.md) reference for full endpoint documentation.

## What's Next?

- [Creating Plugins](./creating-plugins.md) -- write your first plugin from scratch.
- [Plugin Lifecycle](./lifecycle.md) -- understand the four lifecycle hooks in detail.
- [Plugin Repositories](./repositories.md) -- publish and share plugins.
- [Official Plugins](./official-plugins.md) -- browse the plugins maintained by the Lucia team.

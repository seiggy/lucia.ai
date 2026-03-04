---
slug: nebula-release
title: "Nebula — Plugin System & Extensibility Framework"
authors: [seiggy]
tags: [release, feature]
---

**Nebula** introduces a full plugin system to Lucia — a dynamic, script-based architecture that lets users extend the assistant with community and first-party plugins without recompiling.

<!-- truncate -->

## Highlights

- **Roslyn Script Plugin Engine** — Plugins are plain C# scripts (`plugin.cs`) evaluated at startup. No compilation step, no DLL projects.
- **Four-Hook Plugin Lifecycle** — `ConfigureServices` → `ExecuteAsync` → `MapEndpoints` → `OnSystemReadyAsync`.
- **Plugin Repository System** — Discover, install, enable/disable, and uninstall plugins through a new dashboard UI.
- **Git Blob Source Strategies** — Repositories support release assets, tag archives, and branch archives with automatic fallback.
- **IWebSearchSkill Abstraction** — Web search is now a pluggable capability via the SearXNG plugin.

## Plugin Engine

Each plugin lives in `plugins/{name}/plugin.cs` and implements `ILuciaPlugin`:

```csharp
public class MyPlugin : ILuciaPlugin
{
    public string PluginId => "my-plugin";

    public void ConfigureServices(IHostApplicationBuilder builder)
    {
        builder.Services.AddSingleton<IMyService, MyServiceImpl>();
    }

    public async Task ExecuteAsync(IServiceProvider services, CancellationToken ct)
    {
        var logger = services.GetRequiredService<ILoggerFactory>()
            .CreateLogger("MyPlugin");
        logger.LogInformation("Plugin initialized.");
    }
}

new MyPlugin()
```

No project files, no NuGet references — the host provides all standard assemblies and auto-imports common namespaces.

## Plugin Repository & Store

The dashboard's new **Plugins** page has three tabs:

- **Installed** — View, enable/disable, and uninstall plugins
- **Store** — Browse available plugins from all configured repositories with one-click install
- **Repositories** — Add, remove, and sync plugin repositories

Repositories are defined by a `lucia-plugins.json` manifest. Git-based repos support three download modes: GitHub Release assets (preferred), tag archives, and branch archives.

## Official Plugins

Two plugins ship with this release:

- **MetaMCP Bridge** — Seeds a MetaMCP tool server into the agent registry
- **SearXNG Web Search** — Registers `IWebSearchSkill` for privacy-respecting web search

## REST APIs

New endpoints for plugin management:

- `GET/POST /api/plugins/installed` — List, enable/disable, uninstall
- `GET/POST /api/plugins/store` — Browse and install from repositories
- `GET/POST/DELETE /api/plugins/repositories` — Manage repositories
- `POST /api/system/restart` — Graceful restart after plugin changes

Full release notes: [GitHub Release](https://github.com/seiggy/lucia-dotnet/releases)

---
sidebar_position: 2
title: Create a Plugin
---

# Create a Plugin

This tutorial walks you through building a Lucia plugin from scratch. Plugins let you extend Lucia with custom services, HTTP endpoints, and startup logic using C# scripts.

## Step 1 -- Create the Plugin Folder

Create a new directory under `plugins/`. The folder name becomes the plugin identifier.

```
plugins/
  my-plugin/
    plugin.cs
```

## Step 2 -- Implement ILuciaPlugin

Open `plugins/my-plugin/plugin.cs` and define a class that implements `ILuciaPlugin`. The interface exposes four lifecycle hooks that Lucia calls at different stages of startup.

```csharp
public class MyPlugin : ILuciaPlugin
{
    public string Name => "My Plugin";
    public string Version => "1.0.0";

    // Hook 1: ConfigureServices
    // Called during host building. Register your DI services here.
    public void ConfigureServices(IHostApplicationBuilder builder)
    {
        builder.Services.AddSingleton<MyPluginService>();
    }

    // Hook 2: ExecuteAsync
    // Called after the host is built but before agents come online.
    // Use this for initialization work like loading data or warming caches.
    public async Task ExecuteAsync(IServiceProvider services, CancellationToken cancellationToken)
    {
        var logger = services.GetRequiredService<ILogger<MyPlugin>>();
        logger.LogInformation("MyPlugin initializing...");

        var svc = services.GetRequiredService<MyPluginService>();
        await svc.WarmCacheAsync(cancellationToken);
    }

    // Hook 3: MapEndpoints
    // Called during endpoint routing configuration.
    // Register custom HTTP endpoints here.
    public void MapEndpoints(WebApplication app)
    {
        app.MapGet("/api/my-plugin/health", () => Results.Ok(new { status = "healthy" }));

        app.MapPost("/api/my-plugin/notify", async (HttpContext ctx, MyPluginService svc) =>
        {
            var body = await ctx.Request.ReadFromJsonAsync<NotifyRequest>();
            svc.Send(body!.Message);
            return Results.Accepted();
        });
    }

    // Hook 4: OnSystemReadyAsync
    // Called after all agents are online and the system is fully operational.
    // Use this for work that depends on the agent framework being available.
    public async Task OnSystemReadyAsync(IServiceProvider services, CancellationToken cancellationToken)
    {
        var logger = services.GetRequiredService<ILogger<MyPlugin>>();
        logger.LogInformation("System ready -- MyPlugin fully started.");
        await Task.CompletedTask;
    }
}

public class MyPluginService
{
    private readonly ILogger<MyPluginService> _logger;

    public MyPluginService(ILogger<MyPluginService> logger)
    {
        _logger = logger;
    }

    public Task WarmCacheAsync(CancellationToken ct)
    {
        _logger.LogInformation("Cache warmed.");
        return Task.CompletedTask;
    }

    public void Send(string message)
    {
        _logger.LogInformation("Notification sent: {Message}", message);
    }
}

public record NotifyRequest(string Message);

// REQUIRED: The script must end with an expression returning an ILuciaPlugin instance
new MyPlugin()
```

:::warning
The final expression (`new MyPlugin()`) is required. Without it the script runtime cannot obtain your plugin instance and the plugin will fail to load.
:::

## Lifecycle Hook Summary

| Hook | When It Runs | Typical Use |
|---|---|---|
| `ConfigureServices` | During host building | Register DI services, add configuration sections |
| `ExecuteAsync` | After host built, before agents start | Initialize data, warm caches, validate configuration |
| `MapEndpoints` | During endpoint routing setup | Register custom HTTP routes |
| `OnSystemReadyAsync` | After all agents are online | Work that depends on the full agent framework |

## Auto-Imported Namespaces

The plugin script host automatically imports common namespaces, so you do not need explicit `using` statements for them:

| Namespace | Purpose |
|---|---|
| `System` | Core types |
| `System.Collections.Generic` | Collections |
| `System.Linq` | LINQ |
| `System.Threading` | Threading primitives |
| `System.Threading.Tasks` | Async/await support |
| `System.Net.Http` | HTTP client |
| `lucia.Agents.Abstractions` | Plugin and agent interfaces |
| `Microsoft.Extensions.DependencyInjection` | DI container |
| `Microsoft.Extensions.Hosting` | Host builder |
| `Microsoft.Extensions.Logging` | Logging |
| `Microsoft.Extensions.Configuration` | Configuration access |
| `Microsoft.Extensions.AI` | AI abstractions |

Add additional `using` statements at the top of your script if you need types outside this list.

## Step 3 -- Restart Lucia

Plugins are loaded at startup. To activate your new plugin, restart the Lucia process:

- **Docker:** `docker restart lucia`
- **Dashboard:** Navigate to **System** and click **Restart**, or call `POST /api/system/restart`.

Check the logs for your plugin name to confirm it loaded successfully:

```
info: MyPlugin[0] MyPlugin initializing...
info: MyPlugin[0] System ready -- MyPlugin fully started.
```

## What's Next?

- [Plugin Overview](/docs/plugins/overview) -- understand the plugin architecture.
- [Working with MCP Tools](./mcp-tools.md) -- expose your plugin's capabilities as MCP tools.

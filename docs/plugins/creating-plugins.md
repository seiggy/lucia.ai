---
sidebar_position: 2
title: Creating Plugins
---

# Creating Plugins

This guide walks you through creating a Lucia plugin from scratch. By the end you will have a working plugin that registers a service, exposes an HTTP endpoint, and runs startup logic.

## Folder Setup

Create a new folder under the `plugins/` directory. The folder name becomes the plugin identifier.

```
plugins/
  my-first-plugin/
    plugin.cs
```

## Implement ILuciaPlugin

Your `plugin.cs` file must do two things:

1. Define a class that implements `ILuciaPlugin`.
2. End with an expression that returns an instance of that class.

```csharp
using lucia.Agents.Abstractions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

public class MyFirstPlugin : ILuciaPlugin
{
    public string Name => "My First Plugin";
    public string Version => "1.0.0";

    public void ConfigureServices(IHostApplicationBuilder builder)
    {
        // Register services with the DI container
        builder.Services.AddSingleton<MyCustomService>();
    }

    public async Task ExecuteAsync(IServiceProvider services, CancellationToken cancellationToken)
    {
        // Run after the host is built but before agents come online
        var logger = services.GetRequiredService<ILogger<MyFirstPlugin>>();
        logger.LogInformation("MyFirstPlugin is initializing...");
        await Task.CompletedTask;
    }

    public void MapEndpoints(WebApplication app)
    {
        // Register custom HTTP endpoints
        app.MapGet("/api/my-plugin/status", () => Results.Ok(new { status = "running" }));
    }

    public async Task OnSystemReadyAsync(IServiceProvider services, CancellationToken cancellationToken)
    {
        // Called after all agents are online
        var logger = services.GetRequiredService<ILogger<MyFirstPlugin>>();
        logger.LogInformation("System is ready -- MyFirstPlugin fully started.");
        await Task.CompletedTask;
    }
}

public class MyCustomService
{
    public string GetGreeting() => "Hello from MyFirstPlugin!";
}

// The script MUST end with an expression returning an ILuciaPlugin instance
new MyFirstPlugin()
```

:::warning
The final expression (`new MyFirstPlugin()`) is required. Without it the script runtime has no way to obtain your plugin instance and the plugin will fail to load.
:::

## Auto-Imported Namespaces

The script host automatically imports the following namespaces, so you do not need explicit `using` statements for them:

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

You can add additional `using` statements at the top of your script if you need types outside this list.

## Additional Assemblies

The following assemblies are loaded into the script context automatically and are available for use in your plugins:

- `System.Text.Json` -- JSON serialization and deserialization
- `System.ComponentModel.Primitives` -- Component model attributes
- `System.Diagnostics.DiagnosticSource` -- Diagnostic events and tracing
- `Microsoft.AspNetCore` -- ASP.NET Core types (endpoint routing, results, etc.)

## Minimal Example

If you only need one or two lifecycle hooks, you can rely on the default no-op implementations for the rest:

```csharp
public class PingPlugin : ILuciaPlugin
{
    public string Name => "Ping";
    public string Version => "1.0.0";

    public void MapEndpoints(WebApplication app)
    {
        app.MapGet("/api/ping", () => Results.Ok("pong"));
    }
}

new PingPlugin()
```

## Testing Your Plugin

1. Place your plugin folder in `plugins/`.
2. Restart Lucia or call `POST /api/system/restart`.
3. Check the logs for your plugin name.
4. Call any endpoints you registered.

:::tip
During development, use a [local plugin repository](./repositories.md) to iterate quickly without Git overhead.
:::

## What's Next?

- [Plugin Lifecycle](./lifecycle.md) -- understand when each hook is called.
- [Plugin API](./api.md) -- manage plugins through the REST API.

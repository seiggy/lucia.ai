---
sidebar_position: 3
title: Plugin Lifecycle
---

# Plugin Lifecycle

Every Lucia plugin implements `ILuciaPlugin`, which defines four lifecycle hooks. The hooks are called in a fixed order during the agent host startup sequence. All four have default no-op implementations, so you only need to override the ones your plugin requires.

## Hook Execution Order

```
1. ConfigureServices
2. ExecuteAsync
3. MapEndpoints
4. OnSystemReadyAsync
```

The diagram below shows where each hook fits into the overall startup:

```
Host Builder Created
       |
       v
 +--------------------------+
 | ConfigureServices        |  <-- Register DI services
 +--------------------------+
       |
       v
    Host Built
       |
       v
 +--------------------------+
 | ExecuteAsync             |  <-- Post-build initialization
 +--------------------------+
       |
       v
  HTTP Pipeline Configured
       |
       v
 +--------------------------+
 | MapEndpoints             |  <-- Register HTTP routes
 +--------------------------+
       |
       v
  Agents Come Online
       |
       v
 +--------------------------+
 | OnSystemReadyAsync       |  <-- System fully ready
 +--------------------------+
```

## 1. ConfigureServices

```csharp
void ConfigureServices(IHostApplicationBuilder builder)
```

Called while the host is still being built. Use this hook to register your own services, configure options, or add middleware.

**When to use:** You need to add types to the DI container that other parts of the system (or your own later hooks) will resolve.

```csharp
public void ConfigureServices(IHostApplicationBuilder builder)
{
    builder.Services.AddSingleton<IWeatherClient, OpenMeteoClient>();
    builder.Services.Configure<WeatherOptions>(
        builder.Configuration.GetSection("Plugins:Weather"));
}
```

:::info
This is the only hook that receives the `IHostApplicationBuilder`. After this hook completes, the builder is finalized and the service provider is created.
:::

## 2. ExecuteAsync

```csharp
Task ExecuteAsync(IServiceProvider services, CancellationToken cancellationToken)
```

Called after the host is built. The full DI container is available. Use this hook for one-time initialization that must happen before the HTTP pipeline or agents start.

**When to use:** Database migrations, cache warming, validating configuration, establishing external connections.

```csharp
public async Task ExecuteAsync(IServiceProvider services, CancellationToken cancellationToken)
{
    var client = services.GetRequiredService<IWeatherClient>();
    await client.ValidateApiKeyAsync(cancellationToken);

    var logger = services.GetRequiredService<ILogger<WeatherPlugin>>();
    logger.LogInformation("Weather API key validated successfully.");
}
```

## 3. MapEndpoints

```csharp
void MapEndpoints(WebApplication app)
```

Called during HTTP pipeline configuration. Use this hook to register custom API endpoints, middleware, or static file serving.

**When to use:** Your plugin exposes REST endpoints, webhooks, or serves a UI.

```csharp
public void MapEndpoints(WebApplication app)
{
    app.MapGet("/api/weather/current", async (IWeatherClient client) =>
    {
        var forecast = await client.GetCurrentAsync();
        return Results.Ok(forecast);
    });

    app.MapPost("/api/weather/webhook", async (HttpRequest request) =>
    {
        // Handle incoming webhook
        return Results.Accepted();
    });
}
```

## 4. OnSystemReadyAsync

```csharp
Task OnSystemReadyAsync(IServiceProvider services, CancellationToken cancellationToken)
```

Called after all agents are online and the system is fully operational. Use this hook for logic that depends on the agent framework being available.

**When to use:** Sending a startup notification, registering tools with agents, starting background workers that depend on agent availability.

```csharp
public async Task OnSystemReadyAsync(IServiceProvider services, CancellationToken cancellationToken)
{
    var logger = services.GetRequiredService<ILogger<WeatherPlugin>>();
    logger.LogInformation("All agents online -- weather plugin ready.");

    // Start a background task that periodically refreshes weather data
    var client = services.GetRequiredService<IWeatherClient>();
    _ = client.StartPeriodicRefreshAsync(cancellationToken);
}
```

## Default Implementations

All four hooks have default no-op implementations. A minimal plugin only needs to override what it uses:

```csharp
public class MinimalPlugin : ILuciaPlugin
{
    public string Name => "Minimal";
    public string Version => "1.0.0";

    // Only override OnSystemReadyAsync -- everything else is a no-op
    public async Task OnSystemReadyAsync(IServiceProvider services, CancellationToken cancellationToken)
    {
        var logger = services.GetRequiredService<ILogger<MinimalPlugin>>();
        logger.LogInformation("Minimal plugin says hello!");
        await Task.CompletedTask;
    }
}

new MinimalPlugin()
```

## Error Handling

If a plugin throws an exception during any lifecycle hook, Lucia logs the error and continues loading other plugins. A failing plugin does not prevent the rest of the system from starting.

:::warning
Exceptions in `ConfigureServices` are the most impactful because they can prevent services from being registered. If other plugins or agents depend on those services, they will fail to resolve at runtime.
:::

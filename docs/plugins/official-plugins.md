---
sidebar_position: 6
title: Official Plugins
---

# Official Plugins

The Lucia team maintains a set of official plugins that extend core functionality. These plugins are available from the official plugin repository and can be installed through the dashboard or the [Plugin API](./api.md).

## MetaMCP Bridge

Bridges [MetaMCP](https://metamcp.com/) tool aggregation into the Lucia agent system, allowing agents to discover and call tools from any MCP-compatible server through a single integration point.

| Field | Value |
|---|---|
| **ID** | `metamcp-bridge` |
| **Version** | `1.0.1` |
| **Author** | Lucia Team |
| **Tags** | `mcp`, `tools` |

### What It Does

MetaMCP is a tool aggregation layer that connects to multiple MCP (Model Context Protocol) servers and exposes their tools through a unified interface. The MetaMCP Bridge plugin connects Lucia to a MetaMCP instance, making all aggregated tools available to Lucia's agents.

### Example

```csharp
public class MetaMcpBridgePlugin : ILuciaPlugin
{
    public string Name => "MetaMCP Bridge";
    public string Version => "1.0.1";

    public void ConfigureServices(IHostApplicationBuilder builder)
    {
        // Register the MetaMCP client with configuration from appsettings
        builder.Services.AddSingleton<IMetaMcpClient>(sp =>
        {
            var config = sp.GetRequiredService<IConfiguration>();
            var endpoint = config["Plugins:MetaMcp:Endpoint"]
                ?? "http://localhost:3000";
            return new MetaMcpClient(endpoint);
        });
    }

    public async Task ExecuteAsync(IServiceProvider services, CancellationToken cancellationToken)
    {
        var client = services.GetRequiredService<IMetaMcpClient>();
        var logger = services.GetRequiredService<ILogger<MetaMcpBridgePlugin>>();

        var tools = await client.DiscoverToolsAsync(cancellationToken);
        logger.LogInformation("Discovered {Count} tools from MetaMCP.", tools.Count);
    }

    public async Task OnSystemReadyAsync(IServiceProvider services, CancellationToken cancellationToken)
    {
        var client = services.GetRequiredService<IMetaMcpClient>();
        var logger = services.GetRequiredService<ILogger<MetaMcpBridgePlugin>>();

        await client.RegisterWithAgentsAsync(cancellationToken);
        logger.LogInformation("MetaMCP tools registered with agents.");
    }
}

new MetaMcpBridgePlugin()
```

---

## SearXNG Web Search

Provides privacy-respecting web search capabilities to Lucia agents through a self-hosted [SearXNG](https://docs.searxng.org/) instance. Agents can search the web without sending queries to commercial search engines.

| Field | Value |
|---|---|
| **ID** | `searxng-search` |
| **Version** | `1.0.0` |
| **Author** | Lucia Team |
| **Tags** | `search`, `privacy`, `web` |

### What It Does

SearXNG is a free, self-hosted metasearch engine that aggregates results from multiple search providers without tracking users. This plugin connects Lucia to your SearXNG instance and exposes a search tool that agents can invoke during conversations.

### Example

```csharp
public class SearxngSearchPlugin : ILuciaPlugin
{
    public string Name => "SearXNG Web Search";
    public string Version => "1.0.0";

    public void ConfigureServices(IHostApplicationBuilder builder)
    {
        builder.Services.AddHttpClient("searxng", client =>
        {
            var config = builder.Configuration;
            var baseUrl = config["Plugins:SearXNG:BaseUrl"]
                ?? "http://localhost:8080";
            client.BaseAddress = new Uri(baseUrl);
        });

        builder.Services.AddSingleton<ISearxngSearchService, SearxngSearchService>();
    }

    public void MapEndpoints(WebApplication app)
    {
        app.MapGet("/api/search", async (
            string query,
            ISearxngSearchService search,
            CancellationToken cancellationToken) =>
        {
            var results = await search.SearchAsync(query, cancellationToken);
            return Results.Ok(results);
        });
    }

    public async Task OnSystemReadyAsync(IServiceProvider services, CancellationToken cancellationToken)
    {
        var search = services.GetRequiredService<ISearxngSearchService>();
        var logger = services.GetRequiredService<ILogger<SearxngSearchPlugin>>();

        var healthy = await search.HealthCheckAsync(cancellationToken);
        if (healthy)
        {
            logger.LogInformation("SearXNG connection verified.");
        }
        else
        {
            logger.LogWarning("SearXNG instance is not reachable. Web search will be unavailable.");
        }
    }
}

new SearxngSearchPlugin()
```

:::tip
You can run SearXNG alongside Lucia using Docker Compose. Add a `searxng` service to your `docker-compose.yml` and configure the plugin to point to it.
:::

## Installing Official Plugins

Install either plugin through the API:

```http
POST /api/plugins/store/metamcp-bridge/install
```

```http
POST /api/plugins/store/searxng-search/install
```

Or browse and install them from the **Plugins** page in the Lucia dashboard.

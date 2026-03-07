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

## Brave Search

Provides LLM-optimized web search capabilities to Lucia agents through the [Brave LLM Context API](https://api-dashboard.search.brave.com/documentation/services/llm-context). An alternative to SearXNG that requires no self-hosted infrastructure — just an API key.

| Field | Value |
|---|---|
| **ID** | `brave-search` |
| **Version** | `1.1.0` |
| **Author** | Lucia Team |
| **Tags** | `search`, `privacy`, `web`, `llm` |

### What It Does

Unlike traditional search APIs that return links and snippets, the Brave LLM Context API delivers **pre-extracted web content** — text chunks, tables, code blocks, and structured data — optimized for grounding LLM responses. This means Lucia's agents can reason over actual page content directly, without needing to scrape or fetch individual URLs.

Key capabilities:

- **Pre-extracted content** — Get actual page content ready for LLM consumption in a single API call.
- **Token budget control** — Configure `maximum_number_of_tokens` (1024–32768) and URL limits to control context size.
- **Relevance filtering** — Adjustable `context_threshold_mode` (`strict`, `balanced`, `lenient`, `disabled`) ensures only relevant content reaches the agent.
- **Goggles support** — Use Brave's [Goggles](https://api-dashboard.search.brave.com/documentation/resources/goggles) to control which sources ground your LLM responses.
- **Location-aware queries** — Provide location headers for local/POI results.

### Configuration

| Key | Description | Default |
|---|---|---|
| `Plugins:BraveSearch:ApiKey` | Brave API subscription token (required) | — |
| `Plugins:BraveSearch:MaxTokens` | Approximate maximum tokens in context | `8192` |
| `Plugins:BraveSearch:MaxUrls` | Maximum URLs in the response | `20` |
| `Plugins:BraveSearch:ThresholdMode` | Relevance filtering mode | `balanced` |

These can also be set via the `BRAVE_SEARCH_API_KEY` environment variable and the plugin config GUI in the dashboard.

### Example

```csharp
public class BraveSearchPlugin : ILuciaPlugin
{
    public string Name => "Brave Search";
    public string Version => "1.1.0";

    public void ConfigureServices(IHostApplicationBuilder builder)
    {
        builder.Services.AddHttpClient("brave-search", client =>
        {
            var config = builder.Configuration;
            var apiKey = config["Plugins:BraveSearch:ApiKey"]
                ?? throw new InvalidOperationException("Brave Search API key is required.");
            client.BaseAddress = new Uri("https://api.search.brave.com/res/v1/llm/");
            client.DefaultRequestHeaders.Add("X-Subscription-Token", apiKey);
            client.DefaultRequestHeaders.Add("Accept", "application/json");
        });

        builder.Services.AddSingleton<IWebSearchSkill, BraveLlmContextSkill>();
    }

    public async Task OnSystemReadyAsync(IServiceProvider services, CancellationToken cancellationToken)
    {
        var search = services.GetRequiredService<IWebSearchSkill>();
        var logger = services.GetRequiredService<ILogger<BraveSearchPlugin>>();

        var healthy = await search.HealthCheckAsync(cancellationToken);
        if (healthy)
        {
            logger.LogInformation("Brave LLM Context API connection verified.");
        }
        else
        {
            logger.LogWarning("Brave LLM Context API is not reachable. Web search will be unavailable.");
        }
    }
}

new BraveSearchPlugin()
```

:::tip
You can get a Brave Search API key at [brave.com/search/api](https://brave.com/search/api/). The free tier includes up to 2,000 queries per month. For details on the LLM Context endpoint, see the [API documentation](https://api-dashboard.search.brave.com/documentation/services/llm-context).
:::

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

Install any plugin through the API:

```http
POST /api/plugins/store/metamcp-bridge/install
```

```http
POST /api/plugins/store/brave-search/install
```

```http
POST /api/plugins/store/searxng-search/install
```

Or browse and install them from the **Plugins** page in the Lucia dashboard.

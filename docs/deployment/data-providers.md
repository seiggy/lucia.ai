---
sidebar_position: 4
title: Pluggable Data Providers
---

# Pluggable Data Providers

Lucia can run on **minimal hardware** with in-memory caching and SQLite, or scale with Redis plus PostgreSQL or MongoDB. The same provider interfaces support single-container Home Assistant deployments and production database servers.

## Why Pluggable Providers?

Traditional Lucia deployment required:
- **Redis**: for conversation caching, prompt caching, and task storage
- **MongoDB**: for configuration, traces, voice profiles, and response templates
- **Docker Compose** or **Kubernetes**: to orchestrate multiple containers
- **Minimum 4GB RAM**: for all three services

With pluggable providers:
- **Standalone deployment**: single binary or container
- **Home Assistant add-on**: embedded dashboard, no CLI setup
- **Raspberry Pi compatible**: 1–2GB RAM deployments with InMemory + SQLite
- **Production scalable**: swap to Redis plus PostgreSQL or MongoDB when needed

## Provider Architecture

### Cache Providers (Redis Alternative)

Providers replace Redis for ephemeral, TTL-based data:

| Service | InMemory | Redis |
|---------|----------|-------|
| **Session cache** | `InMemorySessionCacheService` | `RedisSessionCacheService` |
| **Device cache** | `InMemoryDeviceCacheService` | `RedisDeviceCacheService` |
| **Prompt cache** | `InMemoryPromptCacheService` | `RedisPromptCacheService` |
| **Task store** | `InMemoryTaskStore` | `RedisTaskStore` |
| **Entity location** | `InMemoryEntityLocationService` | `RedisEntityLocationService` |

**InMemory characteristics:**
- Data persists only in process memory
- Lost on restart (acceptable, since caches are ephemeral)
- Configurable TTL and periodic cleanup
- No network latency (faster than Redis)
- Perfect for HA add-on, limited by available RAM

### Store Providers

Providers replace MongoDB for persistent, queryable data:

| Database | SQLite | PostgreSQL | MongoDB |
|----------|--------|------------|---------|
| **luciaconfig** | Embedded | Supported | Supported |
| **luciatraces** | Embedded | Supported | Supported |
| **luciatasks** | Embedded | Supported | Supported |
| **Voice profiles and transcripts** | Embedded | Supported | Supported |

**SQLite characteristics:**
- Single file (`lucia.db`) or configurable path
- 17 repository implementations covering all data types
- Hybrid schema: indexed columns + JSON blob for flexibility
- Code-first migrations with versioning
- Hot-reload config polling matching MongoDB behavior
- Production-ready for single-host deployments

**PostgreSQL characteristics:**
- Full configuration, trace, task, memory, presence, plugin, and voice-profile persistence
- Three logical databases: `luciaconfig`, `luciatraces`, and `luciatasks`
- Concurrent trigram indexes for production trace and task searches
- Best fit for multi-service production and Jetson deployments

## Configuration

### Environment Variables

Set provider via configuration:

```bash
DataProvider__Cache=InMemory        # or Redis
DataProvider__Store=SQLite          # or PostgreSQL / MongoDB
DataProvider__SqlitePath=./data/lucia.db
```

### appsettings.json

```json
{
  "DataProvider": {
    "Cache": "InMemory",
    "Store": "SQLite",
    "SqlitePath": "./data/lucia.db"
  }
}
```

### Defaults

- **Cache default:** `Redis` (if ConnectionStrings:Redis is configured, falls back to `InMemory`)
- **Store default:** `MongoDB`; select `SQLite` or `PostgreSQL` explicitly for those providers
- **Backward compatible:** Existing deployments with Redis + MongoDB are unchanged

## Cache Providers Detail

### InMemorySessionCacheService

Multi-turn conversation state with sliding expiration:

```csharp
public interface ISessionCacheService
{
    Task SetAsync(string sessionId, ConversationState state, TimeSpan? ttl = null);
    Task<ConversationState?> GetAsync(string sessionId);
    Task DeleteAsync(string sessionId);
}
```

- TTL: Configurable, default 24 hours
- Eviction: Periodic background cleanup on TTL expiry
- Perfect for: Voice conversations, chat sessions

### InMemoryDeviceCacheService

Home Assistant entity state caching:

```csharp
public interface IDeviceCacheService
{
    Task SetAsync(string entityId, EntityState state, TimeSpan? ttl = null);
    Task<EntityState?> GetAsync(string entityId);
    Task InvalidateAsync(string area);  // Invalidate all entities in an area
}
```

- TTL: Configurable, default 5 minutes
- Listening to HA events invalidates cache entries
- Perfect for: Entity state lookups

### InMemoryPromptCacheService

Routing and response caching with SHA256 + semantic similarity:

```csharp
public interface IPromptCacheService
{
    Task SetAsync(CachedPromptEntry entry);
    Task<CachedPromptEntry?> GetBySimilarityAsync(string userText, float threshold = 0.95f);
    Task IncrementHitCountAsync(string cacheKey);
}
```

- Hit count tracking for cache effectiveness metrics
- Semantic similarity threshold configurable from dashboard
- TTL: 7 days (configurable)
- Perfect for: Deduplicating router requests

### InMemoryTaskStore

A2A task persistence for satellite agent coordination:

```csharp
public interface ITaskStore
{
    Task<string> InsertAsync(TaskRecord record);
    Task<TaskRecord?> GetAsync(string taskId);
    Task UpdateAsync(TaskRecord record);
    Task ListAsync(DateTime since);  // For archival
}
```

- TTL: Configurable, default 30 days
- Periodic cleanup removes expired tasks
- Perfect for: Inter-agent RPC tracking

### InMemoryEntityLocationService

Floor/area/entity graph with hybrid entity matching:

```csharp
public interface IEntityLocationService
{
    Task<AreaInfo?> GetAreaAsync(string area);
    Task<FloorInfo?> GetFloorAsync(string floor);
    Task<EntityMatch?> FindEntityAsync(string query, string? area = null);
}
```

- Embeds phonetic matching (Soundex, Double Metaphone)
- Entity alias resolution
- Token overlap matching
- Perfect for: Natural language entity resolution

## Store Providers Detail

### SQLite Schema

17 repository implementations:

| Repository | Purpose |
|---|---|
| `SqliteConfigStore` | Lucia configuration (router, personality, voice settings) |
| `SqliteAgentDefinitionStore` | Custom agent definitions |
| `SqliteModelProviderStore` | LLM provider connections |
| `SqliteTraceStore` | Conversation traces (json blob + indexed fields) |
| `SqliteTaskStore` | Platform tasks and satellite coordination |
| `SqlitePromptCacheStore` | Cached prompts with embeddings |
| `SqliteResponseTemplateStore` | Response templates for command parser |
| `SqliteSpeakerProfileStore` | Speaker verification profiles |
| `SqliteWakeWordStore` | Wake word registrations |
| `SqliteAudioClipStore` | Stored audio samples for profiles |
| `SqlitePluginStore` | Installed plugins and metadata |
| `SqliteModelCatalogStore` | Wyoming voice models |
| `SqliteActivityLogStore` | Event logs for dashboard activity feed |
| `SqliteEntityVisibilityStore` | Per-entity visibility settings |
| `SqlitePromptCacheStatStore` | Cache hit/miss metrics |
| `SqliteAlarmStore` | User-created alarms and timers |
| `SqlitePresenceStore` | Occupancy/presence state |

### Hybrid Schema: Indexed Columns + JSON Blob

Each table combines queryable columns with flexible JSON storage:

```sql
CREATE TABLE configs (
    id TEXT PRIMARY KEY,
    section TEXT NOT NULL,
    data JSON NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (section),
    INDEX idx_section (section)
);
```

**Benefits:**
- Queries by `section` are fast (indexed)
- New fields don't require schema migrations
- JSON path queries supported (`json_extract(data, '$.PropertyName')`)
- Full document retrieval when needed
- Easy export/backup

### Code-First Migrations

`SqliteMigrationRunner` applies versioned schema changes on startup:

```csharp
public class CreateConfigsTable : IMigration
{
    public int Version => 1;
    public async Task UpAsync(SqliteConnection conn)
    {
        const string sql = """
            CREATE TABLE IF NOT EXISTS configs (
                id TEXT PRIMARY KEY,
                section TEXT NOT NULL UNIQUE,
                data JSON NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """;
        await conn.ExecuteAsync(sql);
    }
}
```

All migrations run in order. Completed migrations are tracked in `_migrations` table.

## Deployment Scenarios

### Scenario 1: Development

```json
{
  "DataProvider": {
    "Cache": "InMemory",
    "Store": "SQLite",
    "SqlitePath": "./data/lucia.db"
  }
}
```

| Component | Service | Status |
|---|---|---|
| Cache | InMemory | ✓ |
| Store | SQLite | ✓ |
| External Dependencies | None | ✓ |

**Setup:** Just start Lucia. Data persists to `./data/lucia.db`.

### Scenario 2: Home Assistant Add-on (CPU-Only)

```yaml
# ha-addon/config.yaml
version: 1.3.1
name: Lucia Voice Assistant
description: Local speech + smart home orchestration
arch: [amd64, armv7, aarch64]
ports:
  5000/tcp: 5000  # Dashboard
  10700/tcp: 10700  # Wyoming
volumes:
  - /data -> /data  # SQLite DB
  - /app/models -> /app/models  # Voice models
  - /app/plugins -> /app/plugins  # Plugins

options:
  wyoming_port: 10700
  data_path: /data
  cpu_only: true
```

Single container, zero external services:

```dockerfile
# Dockerfile.ha
FROM mcr.microsoft.com/dotnet/runtime:10-bookworm-slim

# Build with CpuOnly=true to exclude GPU ONNX packages
COPY --from=builder /app ./app
ENV DataProvider__Cache=InMemory
ENV DataProvider__Store=SQLite
ENV DataProvider__SqlitePath=/data/lucia.db

EXPOSE 5000 10700
VOLUME ["/data", "/app/models", "/app/plugins"]
CMD ["./app/lucia.AppHost"]
```

**Deployment:** `HA Settings → Add-ons → Add-on Store → Search "Lucia" → Install`

### Scenario 3: Small Self-Hosted (Single Server)

```json
{
  "DataProvider": {
    "Cache": "InMemory",
    "Store": "SQLite"
  }
}
```

Docker Compose (no Redis/MongoDB):

```yaml
version: '3.8'
services:
  lucia:
    image: seiggy/lucia-agenthost:latest
    environment:
      DataProvider__Cache: InMemory
      DataProvider__Store: SQLite
      DataProvider__SqlitePath: /data/lucia.db
    ports:
      - "5000:5000"    # Dashboard
      - "10700:10700"  # Wyoming
    volumes:
      - lucia_data:/data
      - lucia_models:/app/models

volumes:
  lucia_data:
  lucia_models:
```

### Scenario 4: Production (High Availability)

```json
{
  "DataProvider": {
    "Cache": "Redis",
    "Store": "MongoDB"
  },
  "ConnectionStrings": {
    "Redis": "redis://redis:6379",
    "MongoDB": "mongodb://mongo:27017"
  }
}
```

Docker Compose with full stack:

```yaml
version: '3.8'
services:
  lucia:
    image: seiggy/lucia-agenthost:latest
    environment:
      DataProvider__Cache: Redis
      DataProvider__Store: MongoDB
      ConnectionStrings__Redis: redis://redis:6379
      ConnectionStrings__MongoDB: mongodb://mongo:27017
    depends_on:
      - redis
      - mongodb

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  mongodb:
    image: mongo:7
    ports: ["27017:27017"]
    volumes: [mongo_data:/data/db]

volumes:
  mongo_data:
```

### Scenario 5: PostgreSQL Production or Jetson

```yaml
services:
  lucia:
    image: seiggy/lucia-agenthost:latest
    environment:
      DataProvider__Cache: Redis
      DataProvider__Store: PostgreSQL
      ConnectionStrings__luciaconfig: Host=postgres;Database=luciaconfig;Username=postgres;Password=${POSTGRES_PASSWORD}
      ConnectionStrings__luciatraces: Host=postgres;Database=luciatraces;Username=postgres;Password=${POSTGRES_PASSWORD}
      ConnectionStrings__luciatasks: Host=postgres;Database=luciatasks;Username=postgres;Password=${POSTGRES_PASSWORD}
```

PostgreSQL is also the persistent store in the v1.3 Jetson ARM64 CUDA voice stack.

## Migration from Redis + MongoDB

Existing deployments work unchanged. To migrate to pluggable providers:

1. **No data loss**: the system is backward compatible
2. **Choose your target:**
   - InMemory + SQLite (self-hosted, add-on)
   - Redis + PostgreSQL (production, Jetson)
   - Keep Redis + MongoDB (production)
   - Mix (InMemory for cache, SQLite for store)
3. **Update configuration** and restart
4. **Lucia automatically seeds SQLite** with default configuration on first launch

**Example migration path:**

```
Old: Redis + MongoDB (Docker Compose)
    ↓
Update docker-compose.yml: remove Redis/MongoDB services, set DataProvider vars
    ↓
New: InMemory + SQLite (single container)
    ↓ Later, if scaling to multi-host:
Redeploy with Redis + PostgreSQL or MongoDB, just change config
```

## Performance Comparison

| Operation | InMemory | Redis | SQLite |
|---|---|---|---|
| Session cache get | `<1ms` | 5–10ms | 2–3ms |
| Entity lookup | `<1ms` | 5–10ms | 3–5ms |
| Config reload | Polling: 5s | Real-time | Polling: 5s |
| Max concurrent sessions | RAM limited | Unlimited | Disk I/O limited |
| Failover/HA | Manual restart | Redis cluster | Replicate DB file |

## CpuOnly Build Flag

For Home Assistant add-ons and CPU-only deployments, exclude GPU ONNX packages:

```bash
dotnet publish -c Release /p:CpuOnly=true
```

This removes:
- `Microsoft.ML.OnnxRuntime.Gpu.Linux`
- `Microsoft.ML.OnnxRuntime.Gpu.Windows`
- GPU provider detection code

Result: Smaller container image, no GPU driver dependencies, graceful CPU-only ONNX execution.

## Volume Mounts (Add-on Deployments)

When deploying with Docker volumes:

| Volume | Purpose | Persistence |
|---|---|---|
| `/data` | SQLite database file | ✓ Persistent |
| `/app/models` | Wyoming voice models | ✓ Persistent |
| `/app/plugins` | Script plugins | ✓ Persistent |
| Temp dirs | Build artifacts, logs | ✗ Ephemeral |

**Backup strategy:** Back up `/data/lucia.db` for full state recovery.

## Configuration Interface Abstractions

New abstractions enable provider-agnostic configuration:

```csharp
public interface IConfigStoreWriter
{
    Task<T?> GetAsync<T>(string section);
    Task SaveAsync<T>(string section, T config);
    Task DeleteAsync(string section);
}

public interface ITaskIdIndex
{
    Task<IEnumerable<string>> ListTaskIdsAsync(DateTime since);
}
```

All API endpoints and internal services use these abstractions, with no direct `IMongoClient` or `IConnectionMultiplexer` injection.

**Example: ConfigSeeder**

```csharp
public class ConfigSeeder
{
    private readonly IConfigStoreWriter _store;
    
    public async Task SeedAsync()
    {
        await _store.SaveAsync("Router", new RouterConfig { /* defaults */ });
        // Works with MongoDB, SQLite, or any provider implementing IConfigStoreWriter
    }
}
```

## Next Steps

- [Deployment Guide](./overview.md): full deployment scenarios
- [Docker Compose](./docker-compose.md): quick-start deployment
- [Home Assistant Integration](../home-assistant/overview.md): add-on installation
- [Wyoming Voice Platform](../architecture/voice-platform.md): voice model storage requirements

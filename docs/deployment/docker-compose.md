---
sidebar_position: 2
title: Docker Compose
---

# Docker Compose

Docker Compose is the recommended deployment method for most users. It bundles the AgentHost, MongoDB, and Redis into a single stack that can be started with one command.

## Prerequisites

- [Docker](https://www.docker.com/) v20.10 or later and Docker Compose v2.0 or later
- A supported LLM provider API key (or a local Ollama instance)

## Using the Pre-Built Image

Create a `docker-compose.yml`:

```yaml title="docker-compose.yml"
services:
  lucia-redis:
    image: redis:8.2-alpine
    container_name: lucia-redis
    networks: [lucia-network]
    ports: ["127.0.0.1:6379:6379"]
    command: >
      redis-server --appendonly yes
      --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes: [lucia-redis-data:/data]
    healthcheck:
      test: ["CMD", "redis-cli", "PING"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

  lucia-mongo:
    image: mongo:8.0
    container_name: lucia-mongo
    networks: [lucia-network]
    ports: ["127.0.0.1:27017:27017"]
    volumes: [lucia-mongo-data:/data/db]
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.runCommand('ping').ok"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

  lucia:
    image: seiggy/lucia-agenthost:latest
    container_name: lucia
    depends_on:
      lucia-redis: { condition: service_healthy }
      lucia-mongo: { condition: service_healthy }
    networks: [lucia-network]
    ports: ["7233:8080"]
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ASPNETCORE_URLS=http://+:8080
      - ConnectionStrings__luciatraces=mongodb://lucia-mongo:27017/luciatraces
      - ConnectionStrings__luciaconfig=mongodb://lucia-mongo:27017/luciaconfig
      - ConnectionStrings__luciatasks=mongodb://lucia-mongo:27017/luciatasks
      - ConnectionStrings__redis=lucia-redis:6379
      - DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false
      - DOTNET_RUNNING_IN_CONTAINER=true
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:8080/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

networks:
  lucia-network:
    driver: bridge

volumes:
  # Redis persistent data
  lucia-redis-data:
    driver: local
  
  # MongoDB persistent data
  lucia-mongo-data:
    driver: local
```

### Start the Stack

```bash
docker compose up -d
```

Open `http://localhost:7233` and follow the setup wizard to configure your LLM providers and Home Assistant connection.

Verify the services are running:

```bash
docker compose ps
```

Check the AgentHost health:

```bash
curl http://localhost:7233/health
```

## Building from Source

```bash
git clone https://github.com/seiggy/lucia-dotnet.git
cd lucia-dotnet/infra/docker
docker compose up -d
```

The repo's `docker-compose.yml` builds the image from the local Dockerfile.

## Adding Satellite Agents

To run TimerAgent alongside the AgentHost, add it to your `docker-compose.yml`. Note that MusicAgent runs in-process inside the AgentHost and does not require a separate container.

You must also set the AgentHost to **mesh mode** by adding the `Deployment__Mode` environment variable to the `lucia` service:

```yaml
  lucia:
    environment:
      # ... existing environment variables ...
      - Deployment__Mode=mesh
```

Then add the satellite agent service:

```yaml
  timer-agent:
    image: seiggy/lucia-timeragent:latest
    container_name: lucia-timer-agent
    networks: [lucia-network]
    restart: unless-stopped
    ports:
      - "5201:8080"
    environment:
      - ConnectionStrings__luciatasks=mongodb://lucia-mongo:27017/luciatasks
```

See [Deployment Modes](../architecture/deployment-modes.md) for more details on standalone vs mesh mode.

## Common Operations

### View Logs

```bash
# All services
docker compose logs -f

# AgentHost only
docker compose logs -f lucia

# Last 100 lines
docker compose logs --tail 100 lucia
```

### Restart Services

```bash
# Restart all services
docker compose restart

# Restart AgentHost only
docker compose restart lucia
```

### Update to Latest Version

```bash
docker compose pull
docker compose up -d
```

### Stop and Remove

```bash
# Stop services (preserves data)
docker compose down

# Stop and remove volumes (destroys data)
docker compose down -v
```

:::caution
Using `docker compose down -v` removes all MongoDB data including configuration, traces, and tasks. Only use this if you want a clean start.
:::

## Data Persistence

MongoDB and Redis data are stored in named Docker volumes (`lucia-mongo-data`, `lucia-redis-data`) by default. To persist data to the host filesystem instead, replace the volume references with bind mounts:

```yaml
services:
  lucia-mongo:
    volumes:
      - ./data/mongo:/data/db

  lucia-redis:
    volumes:
      - ./data/redis:/data
```

## Next Steps

- [Environment Variables](../reference/environment-variables.md) -- Full list of configuration options
- [Configuration Reference](../reference/configuration.md) -- Schema-driven configuration
- [Deployment Comparison](./comparison.md) -- Compare with other deployment methods

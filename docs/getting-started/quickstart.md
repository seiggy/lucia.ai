---
sidebar_position: 2
title: Quickstart
---

# Quickstart

Get Lucia up and running in minutes using Docker Compose.

## Prerequisites

Before you begin, make sure you have:

- **Docker** (v20.10 or later) and **Docker Compose** (v2.0 or later)
- **Home Assistant** 2024.12 or newer
- An **API key** from at least one supported LLM provider (OpenAI, Azure OpenAI, Anthropic, Ollama, etc.)

:::info
If you plan to use Ollama for fully local inference, you do not need an external API key -- just a running Ollama instance with a chat model and embedding model pulled.
:::

## Docker Compose Setup

Create a `docker-compose.yml` file in your project directory:

```yaml
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

## Start Lucia

Run the following command from the directory containing your `docker-compose.yml`:

```bash
docker compose up -d
```

Docker will pull the required images and start all three services. You can verify everything is running with:

```bash
docker compose ps
```

You should see `lucia-agenthost`, `lucia-redis`, and `lucia-mongo` all in a healthy/running state.

## Open the Setup Wizard

Once the containers are up, open your browser and navigate to:

```
http://localhost:7233
```

The setup wizard will guide you through:

1. Choosing your LLM provider and entering your API key
2. Connecting to your Home Assistant instance
3. Selecting which agents to enable
4. Creating your admin credentials

:::warning
The setup wizard is only available on the first run. Make sure to save your API key and credentials in a safe place.
:::

## Next Steps

Once the setup wizard completes, head to [First Conversation](./first-conversation.md) to start talking to Lucia.

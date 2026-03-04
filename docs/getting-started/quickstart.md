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
  redis:
    image: redis:8.2-alpine
    container_name: lucia-redis
    restart: unless-stopped
    ports:
      - "6379:6379"

  mongo:
    image: mongo:8.0
    container_name: lucia-mongo
    restart: unless-stopped
    ports:
      - "27017:27017"

  lucia:
    image: seiggy/lucia-agenthost:latest
    container_name: lucia-agenthost
    restart: unless-stopped
    ports:
      - "7233:8080"
    environment:
      - ConnectionStrings__Traces=mongodb://mongo:27017/luciatraces
      - ConnectionStrings__Config=mongodb://mongo:27017/luciaconfig
      - ConnectionStrings__Tasks=mongodb://mongo:27017/luciatasks
      - ConnectionStrings__Redis=redis:6379
    depends_on:
      - redis
      - mongo
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

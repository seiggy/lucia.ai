---
sidebar_position: 8
title: Configuration
---

# Configuration

The Configuration page provides a schema-driven editor for all Lucia settings.

![Configuration](/img/dashboard/configuration.png)

## Categories

Settings are organized into the following categories:

- **High Availability** -- clustering, failover, and replication settings.
- **Orchestration** -- routing behavior, retry policies, and timeout values.
- **Redis** -- connection details for the Redis cache and pub/sub layer.
- **MongoDB** -- connection string and database settings.
- **Music Assistant** -- integration settings for Music Assistant.
- **Traces** -- retention policies and storage limits for conversation traces.
- **Agents** -- default agent behavior and routing weights.
- **Model Providers** -- global model provider defaults.
- **Prompt Cache** -- cache TTL, size limits, and eviction policies.

## Schema-Driven Editor

Each setting is rendered from a JSON schema definition. The editor validates input types, enforces constraints, and shows descriptions for every field. Invalid values are highlighted before you save.

## Sensitive Values

Fields marked as sensitive (API keys, passwords, connection strings) are masked by default. Click the eye icon to reveal a value temporarily. Sensitive values are encrypted at rest.

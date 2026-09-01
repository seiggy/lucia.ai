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
- **Personality Prompt** -- response personalization through configurable instructions.
- **Data Provider** -- cache and storage backend selection (InMemory/Redis, SQLite/MongoDB).
- **Redis** -- connection details for the Redis cache and pub/sub layer.
- **MongoDB** -- connection string and database settings.
- **Music Assistant** -- integration settings for Music Assistant.
- **Traces** -- retention policies and storage limits for conversation traces.
- **Agents** -- default agent behavior and routing weights.
- **Model Providers** -- global model provider defaults.
- **Prompt Cache** -- cache TTL, size limits, and eviction policies.

## Schema-Driven Editor

Each setting is rendered from a JSON schema definition. The editor validates input types, enforces constraints, and shows descriptions for every field. Invalid values are highlighted before you save.

### Field Types

The editor supports various field types including:
- **Text** -- single-line string input
- **Textarea** -- multi-line text input (used for personality prompts and instructions)
- **Number** -- numeric values with optional min/max validation
- **Boolean** -- toggle switches
- **Dropdown** -- predefined options (e.g., model provider selection)

### Configuring Personality Prompt

Navigate to **Configuration → Personality Prompt** to customize Lucia's response tone:

1. **Instructions** — A multi-line textarea where you define the personality system prompt. Examples:
   - "You are a helpful assistant with a casual, friendly tone. Use everyday language."
   - "You are a formal, professional assistant. Always use proper grammar and technical accuracy."
   - "You are a pirate. Respond with pirate dialect and occasionally use 'arr'."

2. **Model Connection Name** — Optional dropdown to select a different LLM for personality rewriting. Leave blank to use the primary chat model. This is useful for cost optimization when using a smaller model (e.g., `gpt-4o-mini`) for rewriting.

### Configuring Data Provider

Navigate to **Configuration → Data Provider** to select your storage backends:

- **Cache** — Choose `InMemory` (fast, ephemeral) or `Redis` (distributed, persistent)
- **Store** — Choose `SQLite` (single-file), `PostgreSQL` (production/Jetson), or `MongoDB` (document storage)
- **SQLite Path** — If using SQLite storage, specify the path to the database file (default: `./data/lucia.db`)

## Sensitive Values

Fields marked as sensitive (API keys, passwords, connection strings) are masked by default. Click the eye icon to reveal a value temporarily. Sensitive values are encrypted at rest.

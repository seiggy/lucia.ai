---
sidebar_position: 4
title: Connection Strings
---

# Connection Strings

Lucia uses standard connection strings for infrastructure services (MongoDB, Redis). LLM provider configuration is managed through the dashboard -- see [Model Providers](./model-providers.md) for details.

## MongoDB Connection Strings

Lucia uses three MongoDB databases for different concerns. Each follows the standard MongoDB URI format.

| Key | Database | Purpose |
|---|---|---|
| `Traces` | `luciatraces` | Trace and telemetry storage |
| `Config` | `luciaconfig` | Schema-driven configuration storage |
| `Tasks` | `luciatasks` | Timer and task persistence |

```bash
export ConnectionStrings__Traces=mongodb://localhost:27017/luciatraces
export ConnectionStrings__Config=mongodb://localhost:27017/luciaconfig
export ConnectionStrings__Tasks=mongodb://localhost:27017/luciatasks
```

### MongoDB with Authentication

```bash
export ConnectionStrings__Traces=mongodb://lucia_user:password@localhost:27017/luciatraces?authSource=admin
export ConnectionStrings__Config=mongodb://lucia_user:password@localhost:27017/luciaconfig?authSource=admin
export ConnectionStrings__Tasks=mongodb://lucia_user:password@localhost:27017/luciatasks?authSource=admin
```

### MongoDB Replica Set

```bash
export ConnectionStrings__Traces=mongodb://mongo1:27017,mongo2:27017,mongo3:27017/luciatraces?replicaSet=rs0
```

## Redis Connection String

Redis uses a simple `host:port` format.

```bash
export ConnectionStrings__Redis=localhost:6379
```

### Redis with Authentication

```bash
export ConnectionStrings__Redis=password@localhost:6379
```

### Redis with TLS

```bash
export ConnectionStrings__Redis=localhost:6380,ssl=true,password=mypassword
```

## Docker Compose Example

A complete `environment` block using connection strings:

```yaml
environment:
  # MongoDB
  - ConnectionStrings__Traces=mongodb://mongo:27017/luciatraces
  - ConnectionStrings__Config=mongodb://mongo:27017/luciaconfig
  - ConnectionStrings__Tasks=mongodb://mongo:27017/luciatasks
  - ConnectionStrings__Redis=redis:6379
```

:::warning
Connection strings containing credentials should be stored securely. In Docker Compose, consider using a `.env` file with restricted permissions rather than inline values. In Kubernetes, use Secrets.
:::

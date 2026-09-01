---
sidebar_position: 6
title: Deployment Comparison
---

# Deployment Comparison

A detailed comparison of all supported deployment methods to help you choose the right one for your environment.

## Quick Reference

| | Docker Compose | Kubernetes | systemd | Jetson ARM64 |
|---|---|---|---|---|
| **Best For** | Home servers, fast setup | HA, scalability, production | Traditional Linux, bare metal | Local CUDA voice |
| **Difficulty** | Low | High | Medium | Medium |
| **Setup Time** | < 2 minutes | 5-10 minutes | 5-15 minutes | 10-20 minutes |
| **High Availability** | No | Yes | No | No |
| **Auto-Scaling** | No | Yes (HPA) | No | No |
| **Rolling Updates** | No | Yes | No | Immutable image + rollback |
| **Resource Overhead** | Low | Medium | Lowest | GPU optimized |

## Feature Comparison

| Feature | Docker Compose | Kubernetes | systemd |
|---|---|---|---|
| Auto-restart | Yes | Yes | Yes |
| Multi-node | No | Yes | No |
| Auto-failover | No | Yes | No |
| Rolling updates | No | Yes | No |
| Resource limits | Via compose | Native | Manual (cgroups) |
| Secrets handling | `.env` file | K8s Secrets | EnvironmentFile |
| Log aggregation | `docker compose logs` | kubectl / Loki / EFK | journalctl |
| Health checks | Docker healthcheck | Liveness/readiness probes | Watchdog |
| Persistent storage | Docker volumes | PVCs | Filesystem |
| Network isolation | Docker network | Network policies | Firewall rules |
| Satellite agents | Additional containers | Separate pods | Separate units |
| TLS termination | Reverse proxy | Ingress controller | Reverse proxy |

## Decision Tree

1. **Do you have a Kubernetes cluster?**
   - Yes -- Consider [Kubernetes](./kubernetes.md) or [Helm](./helm.md)
   - No -- Continue
2. **Are you comfortable with Docker?**
   - Yes -- **[Docker Compose](./docker-compose.md)** (recommended)
   - No -- **[systemd](./systemd.md)**
3. **Do you need high availability?**
   - Yes -- **[Kubernetes](./kubernetes.md)**
   - No -- **[Docker Compose](./docker-compose.md)**

## Migration Paths

### Docker Compose to Kubernetes

1. Export your environment variables and connection strings from `.env`
2. Create Kubernetes Secrets and ConfigMaps from your configuration
3. Apply the Kubernetes manifests or install the Helm chart
4. Verify all pods are healthy
5. Update your Home Assistant custom component to point to the new AgentHost URL

### Docker Compose to systemd

1. Install the .NET 10 runtime or download the self-contained binary
2. Copy the AgentHost binary to `/opt/lucia/agenthost/`
3. Create `/etc/lucia/lucia.env` from your Docker `.env` file
4. Install and enable the systemd service units
5. Stop the Docker Compose stack

### systemd to Docker Compose

1. Create a `docker-compose.yml` from the template in the [Docker Compose](./docker-compose.md) guide
2. Transfer your `/etc/lucia/lucia.env` values to the Docker environment section
3. Start the Docker Compose stack
4. Stop and disable the systemd services

All methods use the same configuration format, making migration straightforward.

## Data Provider Comparison

As of v1.2.0, Lucia supports **pluggable data providers**, eliminating the need for mandatory Redis and MongoDB in many deployments. Choose the combination that fits your infrastructure:

| Provider Combo | Dependencies | Best For | Trade-offs |
|---|---|---|---|
| InMemory + SQLite | None | HA add-on, dev, Raspberry Pi | No clustering, single-instance only |
| Redis + MongoDB | Redis, MongoDB | Production, multi-instance, HA | More infrastructure, better performance at scale |
| Redis + PostgreSQL | Redis, PostgreSQL | Production, Jetson, relational operations | More infrastructure, strong concurrency and search |
| InMemory + MongoDB | MongoDB only | Medium deployments | Persistent store, lightweight cache layer |

See [Data Providers](./data-providers.md) for full configuration details.

## Deployment Size Comparison

| Deployment Type | Size | Best For |
|---|---|---|
| **Mono-container (HA add-on)** | ~150MB container | Home Assistant add-on, zero dependencies, CPU-only |
| **Docker Compose (minimal)** | Redis (5MB) + SQLite (variable) | Home labs, constrained devices |
| **Docker Compose (full stack)** | Redis (5MB) + MongoDB (1GB+) | Production, advanced features |
| **Kubernetes** | Multi-pod cluster | Enterprise, multi-zone HA |

:::info
The mono-container HA deployment uses `InMemory` cache + `SQLite` store, requiring no external services. Build with `/p:CpuOnly=true` to exclude GPU libraries.
:::

## Recommendation

:::tip
**Start with Docker Compose.** It provides the best balance of simplicity, reliability, and performance for most home automation setups. You can always migrate to Kubernetes later if your needs grow.

For resource-constrained environments (Raspberry Pi, HA add-ons), use the **InMemory + SQLite** data provider configuration.
:::

| Scenario | Recommendation |
|---|---|
| Home lab / single host | Docker Compose |
| Home Assistant add-on / Raspberry Pi | Docker Compose + InMemory + SQLite |
| Existing K8s cluster | Helm Chart |
| Jetson Orin Nano voice host | Jetson ARM64 CUDA Compose stack |
| Dedicated server, no Docker | systemd |
| Production with SLA requirements | Kubernetes |
| Development / testing | Docker Compose |

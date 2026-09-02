---
sidebar_position: 6
title: Deployment Comparison
---

# Deployment Comparison

Every channel receives the same Lucia application features. Appliance OS owns the host for you; the other paths leave infrastructure choices in your hands.

## Quick Reference

| | Appliance OS | Docker Compose | Kubernetes | systemd |
|---|---|---|---|---|
| **Best For** | New dedicated Lucia system | Existing home servers | Clusters and external operations | Linux hosts without containers |
| **Difficulty** | Low | Low | High | Medium |
| **Setup** | Captive portal | Compose file | Manifests or Helm | Unit files |
| **Host management** | Lucia | You | Cluster operator | You |
| **High availability** | No | No | Yes | No |
| **Local GPU voice** | Included | Image and driver setup | Node-specific setup | Manual setup |
| **Application updates** | Dashboard in v1.4.1 | Pull a new image | Rolling deployment | Replace binaries |
| **OS updates** | A/B slots in v1.4.1 | Host-managed | Node-managed | Host-managed |

The v1.4.1 update controls aren't available in v1.4.0. Until v1.4.1 ships, Appliance OS can discover releases but can't install them.

## Feature Comparison

| Feature | Appliance OS | Docker Compose | Kubernetes | systemd |
|---|---|---|---|---|
| Auto-restart | systemd | Docker | Kubernetes | systemd |
| Multi-node | No | No | Yes | Manual |
| Secrets handling | Appliance data partition | `.env` file | K8s Secrets | EnvironmentFile |
| Logs | Appliance dashboard / journal | `docker compose logs` | `kubectl` / log stack | `journalctl` |
| Persistent storage | Dedicated `LUCIA_DATA` partition | Docker volumes | PVCs | Filesystem |
| TLS | Per-device certificate | Reverse proxy | Ingress controller | Reverse proxy |

## Decision Tree

1. **Building a new dedicated Lucia device on the supported Jetson?**
   - Use [Appliance OS](../getting-started/appliance-os.md).
2. **Already have a server?**
   - Use [Docker Compose](./docker-compose.md), or [systemd](./systemd.md) when containers don't fit.
3. **Running a Kubernetes cluster?**
   - Use [Helm](./helm.md) or the [Kubernetes manifests](./kubernetes.md).

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
| **Appliance OS** | Full Jetson OS and Lucia payload | Dedicated supported Jetson |
| **Mono-container (HA add-on)** | ~150MB container | Home Assistant add-on, zero dependencies, CPU-only |
| **Docker Compose (minimal)** | Redis (5MB) + SQLite (variable) | Home labs, constrained devices |
| **Docker Compose (full stack)** | Redis (5MB) + MongoDB (1GB+) | Production, advanced features |
| **Kubernetes** | Multi-pod cluster | Enterprise, multi-zone HA |

:::info
The mono-container HA deployment uses `InMemory` cache + `SQLite` store, requiring no external services. Build with `/p:CpuOnly=true` to exclude GPU libraries.
:::

## Recommendation

:::tip
**Start with Appliance OS** on the supported Jetson Orin Nano Super. It removes host setup and bundles local GPU-accelerated voice.

Docker Compose remains the default choice for an existing server. Resource-constrained systems can use the **InMemory + SQLite** provider configuration.
:::

| Scenario | Recommendation |
|---|---|
| New dedicated Lucia device | Appliance OS on Jetson Orin Nano Super |
| Home lab / single host | Docker Compose |
| Home Assistant add-on / Raspberry Pi | Docker Compose + InMemory + SQLite |
| Existing K8s cluster | Helm Chart |
| Existing operator-managed Jetson host | Jetson CUDA Compose stack |
| Dedicated server, no Docker | systemd |
| Production with SLA requirements | Kubernetes |
| Development / testing | Docker Compose |

---
sidebar_position: 6
title: Deployment Comparison
---

# Deployment Comparison

A detailed comparison of all supported deployment methods to help you choose the right one for your environment.

## Quick Reference

| | Docker Compose | Kubernetes | systemd |
|---|---|---|---|
| **Best For** | Home servers, fast setup | HA, scalability, production | Traditional Linux, bare metal |
| **Difficulty** | Low | High | Medium |
| **Setup Time** | < 2 minutes | 5-10 minutes | 5-15 minutes |
| **High Availability** | No | Yes | No |
| **Auto-Scaling** | No | Yes (HPA) | No |
| **Rolling Updates** | No | Yes | No |
| **Resource Overhead** | Low | Medium | Lowest |

## Performance

All methods tested on 4 CPU / 8 GB RAM with 100 HA devices:

| Metric | Docker Compose | Kubernetes | systemd |
|---|---|---|---|
| **p50 latency** | 45 ms | 65 ms | 35 ms |
| **p95 latency** | 120 ms | 180 ms | 95 ms |
| **p99 latency** | 120 ms | 180 ms | 95 ms |
| **Throughput** | 850 req/s | 790 req/s | 920 req/s |
| **Memory** | 180 MB | 210 MB | 160 MB |
| **Startup** | 15-30s | 30-60s | 5-10s |

:::info
Differences are negligible for typical home automation workloads. LLM inference time (500-3000 ms) dominates total request latency regardless of deployment method. Choose based on operational fit, not performance.
:::

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

## Recommendation

:::tip
**Start with Docker Compose.** It provides the best balance of simplicity, reliability, and performance for most home automation setups. You can always migrate to Kubernetes later if your needs grow.
:::

| Scenario | Recommendation |
|---|---|
| Home lab / single host | Docker Compose |
| Existing K8s cluster | Helm Chart |
| Dedicated server, no Docker | systemd |
| Production with SLA requirements | Kubernetes |
| Development / testing | Docker Compose |

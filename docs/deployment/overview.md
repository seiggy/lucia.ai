---
sidebar_position: 1
title: Deployment Overview
---

# Deployment Overview

Lucia can be deployed using several methods depending on your infrastructure, scale, and operational preferences. All methods deploy the same AgentHost application with the same capabilities.

## Deployment Methods

| Method | Best For | Setup Time | Complexity |
|---|---|---|---|
| [Docker Compose](./docker-compose.md) | Home servers, fast setup, single-node | < 2 minutes | Low |
| [Kubernetes](./kubernetes.md) | High availability, scalability, production | 5-10 minutes | Medium |
| [Helm Chart](./helm.md) | Kubernetes with templated config | 5-10 minutes | Medium |
| [systemd](./systemd.md) | Traditional Linux, bare metal, no containers | 5-15 minutes | Medium |
| [Jetson ARM64 CUDA](./docker-compose.md#jetson-arm64-cuda-voice-deployment) | Local GPU voice on Jetson Orin Nano | 10-20 minutes | Medium |

## Deployment Modes

Lucia supports two deployment topologies via `Deployment__Mode`:

- **Standalone** (default) -- All agents run in the main AgentHost process. Storage and cache providers are selectable.
- **Mesh** -- Agents run as separate A2A containers. Used for Kubernetes and multi-node deployments.

## CI/CD

Lucia includes GitHub Actions workflows for automated builds, testing, and deployment. See the `.github/workflows` directory in the repository for the pipeline definitions.

## Architecture

Every deployment requires Home Assistant and an LLM provider. Persistence and caching can be embedded or external:

```mermaid
graph LR
    AH[AgentHost] --> Store[(SQLite / PostgreSQL / MongoDB)]
    AH --> Cache[(InMemory / Redis)]
    AH --> HA[Home Assistant]
    AH --> LLM[LLM Provider]
```

| Service | Purpose | Required |
|---|---|---|
| **SQLite, PostgreSQL, or MongoDB** | Configuration, traces, memory, and task storage | Yes, choose one |
| **InMemory or Redis** | Conversation context and prompt cache | Yes, choose one |
| **Home Assistant** | Smart home platform | Yes |
| **LLM Provider** | Language model for agent reasoning | Yes |

## Choosing a Deployment Method

```mermaid
graph TD
    Start[How do you want to deploy?] --> Q1{Running on a<br/>dedicated server?}
    Q1 -->|No, local/dev| Docker[Docker Compose]
    Q1 -->|Yes| Q2{Need high<br/>availability?}
    Q2 -->|No| Q3{Prefer containers<br/>or bare metal?}
    Q2 -->|Yes| K8s[Kubernetes]
    Q3 -->|Containers| Docker
    Q3 -->|Bare metal| Systemd[systemd]
```

:::tip
If you are unsure which method to choose, **start with Docker Compose**. It is the fastest path to a working deployment. You can migrate to Kubernetes later if needed -- all configuration is portable across methods.
:::

## Minimum Requirements

| Resource | Minimum | Recommended |
|---|---|---|
| CPU | 2 cores | 4 cores |
| RAM | 2 GB | 4 GB |
| Disk | 5 GB | 20 GB |
| Network | LAN access to Home Assistant | -- |

:::info
These requirements cover AgentHost and lightweight providers. External databases, the observability stack, local LLMs, and voice models need additional resources.
:::

## Next Steps

- [Docker Compose](./docker-compose.md) -- Recommended for most users
- [Kubernetes](./kubernetes.md) -- For production and high-availability deployments
- [Helm Chart](./helm.md) -- Kubernetes deployment with Helm
- [systemd](./systemd.md) -- Bare metal deployment
- [Observability](./observability.md) -- Remote telemetry and Grafana dashboards
- [Deployment Comparison](./comparison.md) -- Detailed comparison of all methods

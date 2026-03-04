---
sidebar_position: 4
title: Helm Chart
---

# Helm Chart

Deploy Lucia on Kubernetes using Helm for templated, repeatable configuration management.

## Prerequisites

- A running Kubernetes cluster (v1.25 or later)
- [Helm](https://helm.sh/) v3.0 or later
- `kubectl` configured with cluster access

## Installation

```bash
helm install lucia infra/kubernetes/helm/lucia-helm \
  --namespace lucia \
  --create-namespace
```

## Install with Custom Values

Create a `values.yaml` file to override default settings:

```yaml title="values.yaml"
agentHost:
  replicaCount: 1
  image:
    repository: seiggy/lucia-agenthost
    tag: latest
  environment:
    ASPNETCORE_ENVIRONMENT: Production
    Deployment__Mode: mesh
  resources:
    requests:
      cpu: 250m
      memory: 512Mi
    limits:
      cpu: "1"
      memory: 1Gi

mongodb:
  enabled: true
  persistence:
    size: 10Gi

redis:
  enabled: true

homeassistant:
  url: http://homeassistant.local:8123
  accessToken: eyJ0eXAiOiJKV1QiLCJhbGciOi...

connectionStrings:
  chatModel: "Endpoint=https://api.openai.com;AccessKey=sk-proj-abc123;Model=gpt-4o;Provider=openai"
  routingModel: "Endpoint=https://api.openai.com;AccessKey=sk-proj-abc123;Model=gpt-4o-mini;Provider=openai"

agents:
  musicAgent:
    enabled: true
    replicas: 1
  timerAgent:
    enabled: true
    replicas: 1

ingress:
  enabled: false
  host: lucia.local
```

Install with custom values:

```bash
helm install lucia infra/kubernetes/helm/lucia-helm \
  --namespace lucia \
  --create-namespace \
  -f values.yaml
```

:::warning
Avoid storing API keys directly in `values.yaml` if it will be committed to version control. Use `--set` flags or a Helm secrets plugin instead.
:::

## Using --set for Secrets

Pass sensitive values via the command line:

```bash
helm install lucia infra/kubernetes/helm/lucia-helm \
  --namespace lucia \
  --create-namespace \
  --set homeassistant.accessToken="eyJ0eXAiOi..." \
  --set connectionStrings.chatModel="Endpoint=https://api.openai.com;AccessKey=sk-proj-abc123;Model=gpt-4o;Provider=openai"
```

## Chart Values Reference

| Key | Default | Description |
|---|---|---|
| `agentHost.replicaCount` | `1` | Number of AgentHost replicas |
| `agentHost.image.repository` | `seiggy/lucia-agenthost` | Container image repository |
| `agentHost.image.tag` | `latest` | Container image tag |
| `agentHost.resources.requests.cpu` | `250m` | CPU request |
| `agentHost.resources.requests.memory` | `512Mi` | Memory request |
| `agentHost.resources.limits.cpu` | `1` | CPU limit |
| `agentHost.resources.limits.memory` | `1Gi` | Memory limit |
| `mongodb.enabled` | `true` | Deploy MongoDB as part of the chart |
| `mongodb.persistence.size` | `10Gi` | MongoDB PVC size |
| `redis.enabled` | `true` | Deploy Redis as part of the chart |
| `homeassistant.url` | -- | Home Assistant base URL |
| `homeassistant.accessToken` | -- | HA long-lived access token |
| `connectionStrings.chatModel` | -- | Chat model connection string |
| `connectionStrings.routingModel` | -- | Routing model connection string |
| `agents.musicAgent.enabled` | `true` | Deploy MusicAgent |
| `agents.musicAgent.replicas` | `1` | MusicAgent replicas |
| `agents.timerAgent.enabled` | `true` | Deploy TimerAgent |
| `agents.timerAgent.replicas` | `1` | TimerAgent replicas |
| `ingress.enabled` | `false` | Enable Ingress resource |
| `ingress.host` | `lucia.local` | Ingress hostname |

## Upgrading

```bash
helm upgrade lucia infra/kubernetes/helm/lucia-helm \
  --namespace lucia \
  -f values.yaml
```

## Rollback

```bash
# List release history
helm history lucia -n lucia

# Rollback to a previous revision
helm rollback lucia 1 -n lucia
```

## Uninstalling

```bash
helm uninstall lucia --namespace lucia
```

:::caution
Uninstalling the Helm release removes all Kubernetes resources but preserves PersistentVolumeClaims by default. Delete PVCs manually if you want to remove stored data.
:::

## Verify Deployment

```bash
# Check Helm release status
helm status lucia -n lucia

# Check pods
kubectl get pods -n lucia

# Check AgentHost health
kubectl port-forward -n lucia svc/lucia-agenthost 7233:8080
curl http://localhost:7233/health
```

See the chart's `values.yaml` for all configurable parameters.

## Next Steps

- [Kubernetes](./kubernetes.md) -- Manual manifest deployment
- [Deployment Comparison](./comparison.md) -- Compare all deployment methods

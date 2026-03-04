---
sidebar_position: 3
title: Kubernetes
---

# Kubernetes

Deploy Lucia on Kubernetes for high-availability and production workloads. Kubernetes deployment runs in **mesh mode** by default, with MusicAgent and TimerAgent as separate pods communicating via the A2A protocol.

## Prerequisites

- A running Kubernetes cluster (v1.25 or later)
- `kubectl` configured with cluster access
- Container images accessible from the cluster (Docker Hub or a private registry)

## Quick Deploy with Manifests

Apply the provided Kubernetes manifests:

```bash
kubectl apply -f infra/kubernetes/manifests/
```

This creates the following resources:

| Resource | Kind | Description |
|---|---|---|
| `lucia` | Namespace | Dedicated namespace for all Lucia resources |
| `lucia-agenthost` | Deployment | AgentHost application |
| `lucia-agenthost` | Service | ClusterIP service for AgentHost |
| `lucia-mongo` | StatefulSet | MongoDB with persistent storage |
| `lucia-mongo` | Service | Headless service for MongoDB |
| `lucia-redis` | Deployment | Redis cache |
| `lucia-redis` | Service | ClusterIP service for Redis |
| `lucia-music-agent` | Deployment | MusicAgent satellite |
| `lucia-music-agent` | Service | ClusterIP service for MusicAgent |
| `lucia-timer-agent` | Deployment | TimerAgent satellite |
| `lucia-timer-agent` | Service | ClusterIP service for TimerAgent |
| `lucia-config` | ConfigMap | Non-sensitive configuration |
| `lucia-secrets` | Secret | API keys and tokens |

## Verify Deployment

```bash
# Check all pods are running
kubectl get pods -n lucia

# Check services
kubectl get svc -n lucia

# View AgentHost logs
kubectl logs -n lucia -l app=lucia-agenthost -f
```

Expected output:

```
NAME                                  READY   STATUS    RESTARTS   AGE
lucia-agenthost-7d8f9c6b4d-abc12     1/1     Running   0          2m
lucia-mongo-0                         1/1     Running   0          2m
lucia-redis-5f6g7h8i9j-klm01         1/1     Running   0          2m
lucia-music-agent-3a4b5c6d7e-fgh89   1/1     Running   0          2m
lucia-timer-agent-1b2c3d4e5f-ijk01   1/1     Running   0          2m
```

## Configuration

### Secrets

Create or update the Kubernetes Secret with your credentials:

```yaml title="lucia-secrets.yaml"
apiVersion: v1
kind: Secret
metadata:
  name: lucia-secrets
  namespace: lucia
type: Opaque
stringData:
  chat-model: "Endpoint=https://api.openai.com;AccessKey=sk-proj-abc123;Model=gpt-4o;Provider=openai"
  routing-model: "Endpoint=https://api.openai.com;AccessKey=sk-proj-abc123;Model=gpt-4o-mini;Provider=openai"
  ha-access-token: "eyJ0eXAiOiJKV1QiLCJhbGciOi..."
```

```bash
kubectl apply -f lucia-secrets.yaml
```

### ConfigMap

Non-sensitive configuration is stored in a ConfigMap:

```yaml title="lucia-config.yaml"
apiVersion: v1
kind: ConfigMap
metadata:
  name: lucia-config
  namespace: lucia
data:
  LUCIA_ENV: "production"
  LUCIA_LOG_LEVEL: "Warning"
  HOMEASSISTANT_URL: "http://homeassistant.local:8123"
  HOMEASSISTANT_CONNECTION_TIMEOUT: "30"
  HOMEASSISTANT_RETRY_COUNT: "3"
  Deployment__Mode: "mesh"
```

```bash
kubectl apply -f lucia-config.yaml
```

## Mesh Mode

Kubernetes deployments use mesh mode (`Deployment__Mode=mesh`) by default. This means:

- AgentHost runs as the main pod
- MusicAgent and TimerAgent run as separate pods
- Agents communicate over the A2A protocol via Kubernetes service DNS

:::warning Single-Instance Constraint
The AgentHost must run as a **single replica**. The in-memory `ScheduledTaskStore` and `ActiveTimerStore` cannot be shared across instances.
:::

## Exposing the AgentHost

### NodePort

```bash
kubectl expose deployment lucia-agenthost -n lucia --type=NodePort --port=8080 --name=lucia-nodeport
```

### Ingress

```yaml title="lucia-ingress.yaml"
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: lucia-ingress
  namespace: lucia
  annotations:
    nginx.ingress.kubernetes.io/proxy-read-timeout: "60"
spec:
  rules:
    - host: lucia.local
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: lucia-agenthost
                port:
                  number: 8080
```

## Persistent Storage

MongoDB uses a PersistentVolumeClaim for data storage:

```yaml
volumeClaimTemplates:
  - metadata:
      name: mongo-data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi
```

:::caution
Ensure your cluster has a default StorageClass configured, or specify one explicitly in the PVC.
:::

## Health Checks

The AgentHost deployment includes liveness and readiness probes:

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 15
  periodSeconds: 30
readinessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 10
```

## Troubleshooting

### Pod Not Starting

```bash
# Check events
kubectl describe pod -n lucia <pod-name>

# Check logs
kubectl logs -n lucia <pod-name>
```

### Cannot Connect to MongoDB

Verify the MongoDB pod is running and the service is reachable:

```bash
kubectl exec -n lucia -it <agenthost-pod> -- curl -s lucia-mongo:27017
```

### Cannot Connect to Home Assistant

Ensure the Home Assistant URL is reachable from within the cluster. If HA is running outside the cluster, verify network policies allow egress traffic.

## Next Steps

- [Helm Chart](./helm.md) -- Deploy with Helm for templated configuration
- [Deployment Comparison](./comparison.md) -- Compare with other methods

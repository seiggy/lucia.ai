---
sidebar_position: 6
title: Observability
---

# Observability

Lucia v1.3.0 includes an optional remote observability stack built from OpenTelemetry Collector, Grafana, Tempo, Prometheus, Loki, and Caddy. Telemetry export is fail-open: an unavailable collector does not stop AgentHost request processing.

## Telemetry Modes

Set `Observability__Mode` before AgentHost starts:

| Mode | Exported signals | Sampling |
|---|---|---|
| `Off` | None | None |
| `Metrics` | Runtime, process, HTTP, agent, and speech metrics | N/A |
| `Trace` | Metrics, correlated logs, and traces | 10% parent-based |
| `Profile` | Metrics, correlated logs, and traces | All spans |

```bash
Observability__Mode=Metrics
OTEL_EXPORTER_OTLP_ENDPOINT=https://telemetry.example.internal:4317
OTEL_EXPORTER_OTLP_HEADERS=Authorization=Basic%20BASE64_CREDENTIALS
```

The legacy `Observability__Enabled=true|false` setting maps to `Trace|Off`. Do not configure it together with `Observability__Mode`.

Exports use bounded queues and short timeouts. If the collector is slow or unavailable, Lucia drops excess telemetry instead of blocking application work.

## Remote Stack

The deployment in [`infra/observability`](https://github.com/seiggy/lucia-dotnet/tree/master/infra/observability) publishes authenticated OTLP and Grafana through Caddy. Tempo, Prometheus, Loki, and the collector remain private inside the Compose network.

```bash
cd infra/observability
cp .env.example .env
chmod 600 .env
./scripts/bootstrap.sh
./scripts/smoke-test.sh
```

The default retention is 30 days for metrics, 14 days for traces, and 7 days for logs. Size the Docker data filesystem for the expected ingestion rate and back up the Compose volumes with `scripts/backup.sh`.

## Grafana Dashboards

Five dashboards are provisioned in the **Lucia** folder:

- **Service health** -- CPU, memory, allocations, garbage collection, exceptions, HTTP, and dependencies
- **Speech pipeline** -- queue wait, STT, enhancement, retranscription, diarization, and transcript-write latency
- **Jetson host** -- CPU, memory, disk, load, networking, and process pressure
- **PostgreSQL** -- availability, connections, transactions, cache, locks, and database size
- **Redis** -- availability, memory, clients, commands, keyspace, and network activity

Speech metrics appear after a completed utterance and the next 30-second metrics export.

## Jetson Telemetry

The Jetson voice deployment adds private PostgreSQL and Redis exporters plus a local OpenTelemetry Collector. The collector forwards infrastructure and AgentHost telemetry to the remote stack over authenticated TLS; exporter ports are not published to the host.

See [Docker Compose](./docker-compose.md#jetson-arm64-cuda-voice-deployment) for the application stack.

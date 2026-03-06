---
sidebar_position: 5
title: systemd
---

# systemd

Deploy Lucia directly on a Linux host using systemd service units. This method provides the lowest overhead and fastest response times, suitable for bare-metal or VM deployments.

## Prerequisites

- A Linux host with systemd
- .NET 10 runtime (or the self-contained AgentHost binary)
- MongoDB and Redis installed or accessible on the network
- Home Assistant accessible on the network

## Service Units

Lucia provides pre-built systemd service unit files in [`infra/systemd/`](https://github.com/seiggy/lucia-dotnet/tree/main/infra/systemd).

### Install the Service Files

```bash
sudo cp infra/systemd/*.service /etc/systemd/system/
sudo systemctl daemon-reload
```

This installs the following service units:

| Unit | Description |
|---|---|
| `lucia-agenthost.service` | Main AgentHost process (includes MusicAgent) |
| `lucia-timer-agent.service` | TimerAgent satellite (optional) |

## Configuration

Create the environment file at `/etc/lucia/lucia.env`:

```bash
sudo mkdir -p /etc/lucia
sudo touch /etc/lucia/lucia.env
sudo chmod 600 /etc/lucia/lucia.env
```

```bash title="/etc/lucia/lucia.env"
# Core
LUCIA_ENV=production
LUCIA_LOG_LEVEL=Warning
LUCIA_ENABLE_TELEMETRY=true

# Home Assistant
HOMEASSISTANT_URL=http://homeassistant.local:8123
HOMEASSISTANT_ACCESS_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOi...
HOMEASSISTANT_CONNECTION_TIMEOUT=30
HOMEASSISTANT_RETRY_COUNT=3

# MongoDB
ConnectionStrings__luciatraces=mongodb://localhost:27017/luciatraces
ConnectionStrings__luciaconfig=mongodb://localhost:27017/luciaconfig
ConnectionStrings__luciatasks=mongodb://localhost:27017/luciatasks

# Redis
ConnectionStrings__redis=localhost:6379
REDIS_TIMEOUT=5000
REDIS_KEY_PREFIX=lucia:
REDIS_PERSISTENCE_TTL=24:00:00

# LLM
ConnectionStrings__chat-model=Endpoint=https://api.openai.com;AccessKey=sk-proj-abc123;Model=gpt-4o;Provider=openai
ConnectionStrings__routing-model=Endpoint=https://api.openai.com;AccessKey=sk-proj-abc123;Model=gpt-4o-mini;Provider=openai
```

:::warning
The environment file contains API keys and tokens. Set restrictive permissions with `chmod 600 /etc/lucia/lucia.env` and ensure only root and the lucia service user can read it.
:::

## Service Unit Example

The AgentHost service unit:

```ini title="/etc/systemd/system/lucia-agenthost.service"
[Unit]
Description=Lucia AgentHost
After=network.target mongod.service redis.service
Wants=mongod.service redis.service

[Service]
Type=notify
User=lucia
Group=lucia
WorkingDirectory=/opt/lucia/agenthost
ExecStart=/opt/lucia/agenthost/Lucia.AgentHost
EnvironmentFile=/etc/lucia/lucia.env
Restart=always
RestartSec=5
WatchdogSec=30

# Security hardening
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/log/lucia

[Install]
WantedBy=multi-user.target
```

## Start the Services

```bash
# Enable and start the AgentHost
sudo systemctl enable lucia-agenthost
sudo systemctl start lucia-agenthost

# Optionally enable satellite agents
sudo systemctl enable lucia-timer-agent
sudo systemctl start lucia-timer-agent
```

## Verify

```bash
# Check service status
sudo systemctl status lucia-agenthost

# Check health endpoint
curl http://localhost:5000/health

# View logs
sudo journalctl -u lucia-agenthost -f
```

## Common Operations

### View Logs

```bash
# Follow logs
sudo journalctl -u lucia-agenthost -f

# Last 100 lines
sudo journalctl -u lucia-agenthost -n 100

# Logs since boot
sudo journalctl -u lucia-agenthost -b

# Filter by time
sudo journalctl -u lucia-agenthost --since "1 hour ago"
```

### Restart

```bash
sudo systemctl restart lucia-agenthost
```

### Stop

```bash
sudo systemctl stop lucia-agenthost
```

### Update

```bash
# Stop the service
sudo systemctl stop lucia-agenthost

# Replace the binary
sudo cp /path/to/new/Lucia.AgentHost /opt/lucia/agenthost/

# Start the service
sudo systemctl start lucia-agenthost
```

## Creating a Service User

For security, run Lucia under a dedicated user:

```bash
sudo useradd --system --no-create-home --shell /usr/sbin/nologin lucia
sudo mkdir -p /opt/lucia/agenthost /var/log/lucia
sudo chown -R lucia:lucia /opt/lucia /var/log/lucia
```

## Performance

systemd has the lowest overhead of all deployment methods:

| Metric | systemd |
|---|---|
| Startup time | 5-10s |
| Memory overhead | 10-20 MB |
| Idle CPU | 1-5% |
| p50 latency | 35 ms |
| p99 latency | < 95 ms |

## Next Steps

- [Environment Variables](../reference/environment-variables.md) -- Full configuration reference
- [Deployment Comparison](./comparison.md) -- Compare with other deployment methods

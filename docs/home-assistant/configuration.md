---
sidebar_position: 3
title: Configuration
---

# Configuration

Once the Lucia integration is installed, configure it through the Home Assistant UI to connect to your Lucia agent host.

## Adding the Integration

1. Navigate to **Settings** > **Devices & Services**.
2. Click **Add Integration** (bottom-right corner).
3. Search for **Lucia** and select it.

## Configuration Flow

The setup wizard guides you through the following steps:

### Step 1: Agent Repository URL

Enter the URL of your Lucia agent host. This is the base URL where the agent host API is accessible from your Home Assistant instance.

```
http://192.168.1.100:7233
```

:::tip
If Lucia and Home Assistant are running on the same Docker network, use the container name instead of an IP address: `http://lucia-agenthost:8080`
:::

### Step 2: API Key

Enter the API key you created during the Lucia setup wizard. This key authenticates the Home Assistant integration with the agent host.

:::warning
The API key is stored in Home Assistant's internal configuration store. It is not exposed in YAML files, but treat it as a secret and do not share it.
:::

### Step 3: Agent Selection

Choose which Lucia agent should handle your Home Assistant conversations. The integration fetches the list of available agents from the agent host.

Common options include:

- **Orchestrator** -- routes requests to the best agent automatically (recommended).
- **Light Agent** -- handles only lighting commands.
- **Climate Agent** -- handles only climate and thermostat commands.

You can change the selected agent at any time through the integration's options flow.

### Step 4: Set as Conversation Agent

After adding the integration, set Lucia as your default conversation agent:

1. Navigate to **Settings** > **Voice assistants**.
2. Select your assistant (or create a new one).
3. Under **Conversation agent**, select **Lucia**.
4. Click **Save**.

Lucia will now handle all voice and text commands routed through this assistant.

## Reconfiguring

To change settings after initial setup:

1. Go to **Settings** > **Devices & Services**.
2. Find the **Lucia** integration.
3. Click **Configure**.
4. Update the agent repository URL, API key, or selected agent.

## Multiple Instances

You can add the Lucia integration multiple times if you run separate agent host instances (for example, one for upstairs and one for downstairs). Each instance gets its own configuration entry with its own URL, API key, and agent selection.

## Troubleshooting

| Issue | Solution |
|---|---|
| Integration not found after install | Restart Home Assistant and clear browser cache. |
| Connection refused | Verify the agent host URL is reachable from HA. Check firewalls and Docker networking. |
| Authentication failed | Regenerate the API key in the Lucia dashboard and re-enter it in HA. |
| No agents listed | Ensure at least one agent is enabled in the Lucia dashboard. |

## What's Next?

- [Entity Management](./entity-management.md) -- control which entities Lucia can see.
- [Conversation API](./conversation-api.md) -- understand the request/response flow.

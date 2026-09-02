---
sidebar_position: 4
title: Home Assistant Setup
---

# Home Assistant Setup

Connect Lucia to Home Assistant so it can serve as your conversation agent and control your smart home devices.

There are two ways to install the Lucia custom integration: **HACS** (recommended) or **manual**.

## Option 1: HACS (Recommended)

[HACS](https://hacs.xyz/) (Home Assistant Community Store) is the easiest way to install and keep the integration updated.

1. Open Home Assistant and navigate to **HACS** > **Integrations**.
2. Click the three-dot menu in the top right and select **Custom repositories**.
3. Add the following repository:
   - **Repository:** `https://github.com/seiggy/lucia-dotnet`
   - **Category:** Integration
4. Click **Add**.
5. Search for **Lucia** in the HACS Integrations list.
6. Click **Download** and confirm the version.
7. **Restart Home Assistant.**
8. After restart, go to **Settings** > **Devices & Services** > **Add Integration** and search for **Lucia**.

:::tip
HACS will notify you when updates to the Lucia integration are available, making it easy to stay on the latest version.
:::

## Option 2: Manual Installation

If you prefer not to use HACS, you can install the integration manually.

1. Clone or download the [lucia-dotnet repository](https://github.com/seiggy/lucia-dotnet).
2. Copy the custom component into your Home Assistant configuration directory:

   ```bash
   cp -r custom_components/lucia /path/to/homeassistant/config/custom_components/lucia
   ```

3. **Restart Home Assistant.**
4. After restart, go to **Settings** > **Devices & Services** > **Add Integration** and search for **Lucia**.

:::warning
With manual installation you will need to repeat this process for each update. Consider using HACS for automatic update notifications.
:::

## Configure the Integration

As of v1.2.0, the setup flow is greatly simplified. You only need to provide:

1. Navigate to **Settings** > **Devices & Services**.
2. Click **Add Integration** and search for **Lucia**.
3. Enter the following details:
   - **Appliance OS Host URL:** `https://<hostname>.local:8099`
   - **Other installations:** Use the AgentHost address reachable from Home Assistant, such as `http://192.168.1.20:7233`
   - **API Key:** The dashboard owner key shown during setup
4. Click **Submit**.

:::info
`localhost` points back to Home Assistant, not to a separate Lucia host. Use the appliance hostname or the server's LAN address.
:::

:::note
As of v1.2.0, agent selection is no longer part of the setup flow. The orchestrator automatically routes requests to the best available agent based on intent.
:::

## Set Lucia as Your Conversation Agent

To make Lucia handle all voice and text commands through Home Assistant Assist:

1. Go to **Settings** > **Voice Assistants**.
2. Open the **Assist** configuration (or create a new assistant).
3. Under **Conversation agent**, select **Lucia**.
4. Click **Save**.

From this point on, Lucia processes any command sent through Assist, whether typed in the UI, spoken through a voice satellite, or triggered by an automation.

## Verify the Connection

Test the integration by opening the Assist dialog in Home Assistant (click the Assist icon in the top bar or press `e`) and typing:

> Turn on the living room lights

Lucia should respond by turning on the lights and confirming the action.

## Troubleshooting

| Issue | Solution |
|---|---|
| Integration not appearing after install | Make sure you restarted Home Assistant after copying files or downloading via HACS. |
| Connection refused | Check the appliance at `https://<hostname>.local:8099`, or verify the AgentHost container and published port on a Docker installation. |
| "Invalid API key" error | Re-check the API key from the Lucia setup wizard. You can view it in the Lucia dashboard under Settings. |
| Commands not working | Ensure Lucia is selected as the conversation agent under **Settings** > **Voice Assistants** > **Assist**. Also verify at least one agent is enabled in the Lucia dashboard. |

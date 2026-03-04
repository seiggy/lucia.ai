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

Once the integration is installed and Home Assistant has restarted:

1. Navigate to **Settings** > **Devices & Services**.
2. Click **Add Integration** and search for **Lucia**.
3. Enter the following details:
   - **Agent Repository URL:** `https://localhost:7235`
   - **API Key:** The API key generated during the Lucia setup wizard
4. Select the agent you want to use as the default conversation handler.
5. Click **Submit**.

:::info
The Agent Repository URL uses port `7235` and HTTPS by default. If you changed the port mapping or TLS settings in your Docker Compose configuration, adjust the URL accordingly.
:::

## Set Lucia as Your Conversation Agent

To make Lucia handle all voice and text commands through Home Assistant Assist:

1. Go to **Settings** > **Voice Assistants**.
2. Open the **Assist** configuration (or create a new assistant).
3. Under **Conversation agent**, select **Lucia**.
4. Click **Save**.

From this point on, any command sent through Assist -- whether typed in the UI, spoken through a voice satellite, or triggered by an automation -- will be processed by Lucia.

## Verify the Connection

Test the integration by opening the Assist dialog in Home Assistant (click the Assist icon in the top bar or press `e`) and typing:

> What devices are in the living room?

Lucia should respond with a list of entities assigned to the living room area.

## Troubleshooting

| Issue | Solution |
|---|---|
| Integration not appearing after install | Make sure you restarted Home Assistant after copying files or downloading via HACS. |
| Connection refused on port 7235 | Verify the Lucia agent host container is running (`docker compose ps`) and the port is not blocked by a firewall. |
| "Invalid API key" error | Re-check the API key from the Lucia setup wizard. You can view it in the Lucia dashboard under Settings. |
| Assist not using Lucia | Confirm Lucia is selected as the conversation agent under **Settings** > **Voice Assistants** > **Assist**. |

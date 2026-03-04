---
sidebar_position: 2
title: Installation
---

# Installation

The Lucia Home Assistant integration can be installed through HACS (recommended) or manually.

## Prerequisites

- **Home Assistant** 2024.12 or newer
- A running **Lucia agent host** accessible from your HA instance
- **HACS** (Home Assistant Community Store) installed, if using the HACS method

## Method 1: HACS (Recommended)

HACS provides automatic updates and a streamlined installation experience.

### Step 1: Add the Custom Repository

1. Open Home Assistant and navigate to **HACS** in the sidebar.
2. Click the **three-dot menu** in the top-right corner.
3. Select **Custom repositories**.
4. Enter the repository URL:
   ```
   https://github.com/lucia-ai/ha-lucia
   ```
5. Set the category to **Integration**.
6. Click **Add**.

### Step 2: Install the Integration

1. In HACS, search for **Lucia**.
2. Click on the **Lucia** integration.
3. Click **Download**.
4. Select the latest version and confirm.

### Step 3: Restart Home Assistant

1. Navigate to **Settings** > **System** > **Restart**.
2. Click **Restart** and wait for Home Assistant to come back online.

:::info
After the restart, the Lucia integration will be available to add through the standard integrations page. Head to [Configuration](./configuration.md) to complete the setup.
:::

## Method 2: Manual Installation

If you prefer not to use HACS, you can install the component manually.

### Step 1: Download the Component

Download the latest release from the [GitHub releases page](https://github.com/lucia-ai/ha-lucia/releases) or clone the repository:

```bash
git clone https://github.com/lucia-ai/ha-lucia.git
```

### Step 2: Copy Files to Custom Components

Copy the `lucia` directory into your Home Assistant `custom_components` folder:

```bash
cp -r ha-lucia/custom_components/lucia /config/custom_components/lucia
```

Your directory structure should look like this:

```
/config/
  custom_components/
    lucia/
      __init__.py
      config_flow.py
      const.py
      conversation.py
      manifest.json
      strings.json
      translations/
        en.json
```

### Step 3: Restart Home Assistant

1. Navigate to **Settings** > **System** > **Restart**.
2. Click **Restart** and wait for Home Assistant to come back online.

:::warning
When updating manually, always replace the entire `lucia` directory rather than overwriting individual files. This ensures removed or renamed files do not cause conflicts.
:::

## Verifying the Installation

After restarting, verify the component is loaded:

1. Go to **Settings** > **Devices & Services**.
2. Click **Add Integration**.
3. Search for **Lucia** -- it should appear in the list.

If Lucia does not appear, check the Home Assistant logs at **Settings** > **System** > **Logs** for any errors related to the `lucia` component.

## What's Next?

Head to [Configuration](./configuration.md) to connect the integration to your Lucia agent host.

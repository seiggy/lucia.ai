---
sidebar_position: 2
title: Quickstart
---

# Quickstart

## Preferred: Lucia Appliance OS

For a new dedicated Lucia system, use the **Appliance OS Image** on an NVIDIA Jetson Orin Nano Super 8GB Developer Kit. It installs the operating system, local GPU voice stack, storage, dashboard, and device management through a phone-friendly captive portal.

[Install Lucia Appliance OS](./appliance-os.md)

The v1.4.0 image supports the P3767-0005 module and an NVMe drive of 64 GB or larger. Other Jetson models need a supported installation path below.

## Other Supported Installations

Docker Compose, Kubernetes, Helm, and systemd remain supported with the same Lucia features. Pick one when you're reusing a server, deploying to a cluster, or managing your own Linux host.

| Method | Use it for |
|---|---|
| [Docker Compose](../deployment/docker-compose.md) | Existing home servers and the fastest non-appliance setup |
| [Kubernetes](../deployment/kubernetes.md) or [Helm](../deployment/helm.md) | Clusters, external secrets, and managed storage |
| [systemd](../deployment/systemd.md) | Native services on Linux hardware you administer |

## Finish in the Dashboard

Save the dashboard owner key when setup shows it. Appliance OS displays the key in the captive portal before its first power-off; other installations create it during onboarding.

After signing in:

1. Configure a chat model and embedding model.
2. Enter the Home Assistant URL and long-lived access token.
3. Install the [Home Assistant integration](./home-assistant-setup.md).

Then send a [first conversation](./first-conversation.md).

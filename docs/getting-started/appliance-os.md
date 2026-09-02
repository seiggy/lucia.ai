---
sidebar_position: 2
title: Appliance OS Installation
---

# Appliance OS Installation

Lucia Appliance OS is the preferred installation path for a new Lucia system. It turns a supported Jetson into a headless appliance with local GPU voice processing, Redis, SQLite, the dashboard, and device management already installed. Docker isn't used on the finished appliance.

Other installation methods remain supported and receive the same Lucia features. Use [Docker Compose](../deployment/docker-compose.md), [Kubernetes](../deployment/kubernetes.md), or [systemd](../deployment/systemd.md) when you need different hardware or want to manage the host yourself.

## Supported Hardware

Version 1.4.0 supports one board:

- **NVIDIA Jetson Orin Nano Super 8GB Developer Kit**
- **Module:** P3767-0005
- **NVMe:** 64 GB or larger
- **Network:** Wi-Fi for first-time setup; USB Ethernet and the recovery shell remain fallback options

:::danger Check the board before downloading
The original Jetson Nano, Jetson Xavier NX, other Jetson modules, and third-party carrier boards aren't supported by the v1.4.0 image.
:::

You'll also need a microSD card for the temporary installer, a card reader, and a phone or computer with Wi-Fi. The installer copies Lucia to NVMe and then powers the Jetson off so you can remove the microSD card.

## Download the Installer

Open the [latest Lucia release](https://github.com/seiggy/lucia-dotnet/releases/latest) and download:

- `lucia-appliance-manifest.json`
- `SHA256SUMS`
- every `lucia-appliance-<version>-installer.img.zst.partNN` file

GitHub limits release assets to 2 GB, so the compressed installer arrives in ordered parts. Version 1.4.0 has five parts totaling about 8.6 GB. Keep every file in one folder.

### Verify and Join the Parts

On Linux or macOS:

```bash
grep 'installer.img.zst.part' SHA256SUMS | sha256sum -c -
cat lucia-appliance-*-installer.img.zst.part* > lucia-appliance-installer.img.zst
sha256sum lucia-appliance-installer.img.zst
```

macOS ships `shasum` instead of `sha256sum`; use `shasum -a 256` for both checks.

On Windows, compare each part with `SHA256SUMS`:

```powershell
Get-FileHash .\lucia-appliance-*-installer.img.zst.part* -Algorithm SHA256
```

Then join the v1.4.0 parts in their numbered order:

```bat
copy /b lucia-appliance-1.4.0-installer.img.zst.part00+lucia-appliance-1.4.0-installer.img.zst.part01+lucia-appliance-1.4.0-installer.img.zst.part02+lucia-appliance-1.4.0-installer.img.zst.part03+lucia-appliance-1.4.0-installer.img.zst.part04 lucia-appliance-installer.img.zst
```

Compare the joined file's SHA-256 with `channels.installer.sha256` in `lucia-appliance-manifest.json`. For v1.4.0, the expected joined hash is:

```text
b824285e1080b8d67612d1b8f08b7fc1cf56860967c67cba21ef3dd62d4e91eb
```

Don't flash an image when a part hash or the joined hash differs.

## Flash the microSD Card

[Rufus 4.7 or newer](https://rufus.ie/) can write the joined `.img.zst` file directly:

1. Insert the microSD card into your computer.
2. Open Rufus and select the microSD card under **Device**.
3. Choose `lucia-appliance-installer.img.zst` as the boot image.
4. Start the write and approve erasing the microSD card.
5. Eject the card after Rufus finishes.

On Linux or macOS, decompress the file with `zstd` and write the resulting `.img` with a raw-image tool that you trust.

:::danger Pick the right removable drive
Flashing erases the selected microSD card. The later appliance setup also erases the NVMe selected in the captive portal.
:::

## Run the Captive Setup Portal

Insert the microSD card into the powered-off Jetson, make sure the target NVMe is installed, and turn the board on. After boot, the Jetson creates an open setup network named `Lucia-XXXXXX`, using the last six characters of its device serial.

The network isolates connected clients and blocks forwarding beyond the installer. It still has no Wi-Fi password, so keep the Jetson physically controlled until setup finishes.

### Claim the Setup Session

1. Connect a phone or computer to the `Lucia-XXXXXX` network.
2. Wait for the captive portal to open. If it doesn't, browse to [http://lucia.setup/install](http://lucia.setup/install).
3. Select **Begin setup**.

The first browser claims the installer until the Jetson restarts. A second browser receives an "already being set up" message and can't change the installation.

### Choose the NVMe

The storage page lists whole NVMe drives. Lucia rejects mounted drives and drives smaller than 64 GB. Occupied drives remain selectable but show a warning.

Select the intended NVMe carefully. The installer binds approval to that drive's model, serial or WWN, current partition layout, and the installer image hash; approval can't move to another drive after you review it.

### Set Network and Identity

Choose the home Wi-Fi network that Lucia should use after installation. The portal lists WPA2 Personal networks; it doesn't list enterprise 802.1X networks.

Set two local values:

- **Hostname:** 1 to 63 lowercase letters, numbers, or hyphens. It can't start or end with a hyphen.
- **Recovery password:** 12 to 128 characters. The `lucia-recovery` account can open NetworkManager's text interface but has no `sudo` access.

If the Wi-Fi test fails, the installer rolls back the temporary NetworkManager checkpoint and returns to setup mode. Correct the network credentials on the retry screen; you won't need to rewrite the NVMe.

### Approve the Erase

The review page shows the hostname, Wi-Fi network, and selected NVMe. To continue, type the exact phrase shown by the portal:

```text
ERASE <device serial or identity>
```

Lucia verifies that phrase and the drive identity again before it wipes anything.

### Save the Dashboard Key

Installation moves through six visible stages: image verification, NVMe erase, image write, A/B slot setup, storage sync, and power-off.

The portal shows a `lk_...` dashboard owner key once. Copy it to a password manager, then confirm that you've saved it. The installer waits for this confirmation before powering off.

When the Jetson powers down:

1. Remove the microSD card.
2. Turn the Jetson back on.
3. Open `https://<hostname>.local:8099`.
4. Accept the local certificate warning once, then sign in with the dashboard owner key.

Each appliance creates its own certificate during setup. HTTPS listens on port 8099; the plain HTTP service on port 8098 only accepts local connections from the appliance.

## What the Image Installs

Jetson Linux 36.5.2 boots from two operating-system slots named `APP` and `APP_b`. A separate `LUCIA` partition stores versioned Lucia application releases under `/opt/lucia`, while `LUCIA_DATA` keeps Redis AOF data, SQLite databases, certificates, configuration, and update state under `/var/lib/lucia`.

Lucia runs as native systemd services:

| Service | Purpose |
|---|---|
| AgentHost | Dashboard, APIs, agents, and local voice pipeline |
| Redis | Session and cache data with AOF persistence |
| Appliance Manager | Restricted host status, restart, reboot, telemetry, and update operations |
| OpenTelemetry Collector | Optional remote telemetry; disabled until configured |
| Redis exporter | Optional Redis metrics; disabled until configured |

The installed voice stack includes the ARM64 ONNX Runtime CUDA provider, sherpa-onnx libraries, and pinned speech models. It uses the Jetson GPU without a container runtime.

## Appliance Dashboard

Open **Appliance** in the dashboard navigation to view:

- board, Jetson Linux, storage, Wi-Fi, and service status;
- controls to restart a Lucia service or reboot the Jetson;
- remote OpenTelemetry settings, with stored credentials omitted from API responses;
- compatible Lucia and OS releases discovered from GitHub.

Version 1.4.0 only discovers updates. Its install control stays disabled because release attestation checks and rollback weren't finished when that version shipped.

## Lucia and OS Updates

Lucia publishes separate full-payload channels:

| Channel | Contents | Install behavior |
|---|---|---|
| **Lucia** | AgentHost, dashboard, plugins, GPU libraries, Redis, and voice models | Switches the versioned application release while keeping appliance data |
| **OS** | Jetson root filesystem, kernel, and device tree | Writes the inactive A/B operating-system slot, then reboots into it |
| **Installer** | Complete microSD image | Used for a new appliance or manual recovery |

### v1.4.0

The Appliance page checks the latest GitHub release, reads `lucia-appliance-manifest.json`, and reports compatible newer Lucia or OS payloads. It can't install them. Don't download the `lucia.tar.zst` or `os.tar.zst` channel files for manual replacement; v1.4.0 has no supported apply command.

### Planned for v1.4.1

Version 1.4.1 is expected to add update installation and rollback from the Appliance page. This work is still on the `appliance-signed-updates` branch, so labels and exact steps may change before release.

The planned flow checks the release tag, repository, signed manifest, GitHub build attestation, every downloaded part's size and hash, and the assembled payload hash before writing. Only one update operation runs at a time, with status shown as queued, running, succeeded, or failed.

A Lucia app update will back up persistent config, databases, and Redis data before stopping services. It installs the new release under `/opt/lucia/releases`, swaps `/opt/lucia/current`, and checks AgentHost health; a failed health check restores the previous release and backup.

An OS update will write the inactive `APP` slot plus its kernel and device-tree partitions, run a filesystem check, set that slot active, and reboot. A first-boot validation service checks the new slot and AgentHost health. If validation fails, the appliance selects the previous slot and reboots.

:::caution Wait for the v1.4.1 release
Don't copy update scripts from a development branch onto a v1.4.0 appliance. Use the dashboard controls only after the installed version exposes them.
:::

## Recovery and Current Limits

Use the `lucia-recovery` account over local SSH when Wi-Fi settings need repair. That account opens `nmtui` and has no general shell or `sudo` access.

Version 1.4.0 doesn't include secure boot, disk encryption, physical power-cut recovery guarantees, automatic QSPI compatibility reporting, or a full occupied-drive layout report. Keep backups of data you can't recreate.

## Continue Setup

Once the appliance dashboard opens:

1. Configure an LLM provider.
2. Add the Home Assistant connection and long-lived access token.
3. Install the [Home Assistant integration](./home-assistant-setup.md).
4. Send a [first conversation](./first-conversation.md).

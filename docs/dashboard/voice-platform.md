---
sidebar_position: 15
title: Voice Platform
---

# Voice Platform

The Voice Platform dashboard is a unified control room for Lucia's speech pipeline. From here you can manage voice models, speaker profiles, wake words, monitor active sessions in real-time, and configure voice behavior settings.

Navigate to **Settings → Voice Platform** to access these controls.

## Overview

The Voice Platform ties together:

- **Multiple speech engines** — STT (Speech-to-Text), VAD (Voice Activity Detection), Wake Word detection, Speaker Embedding extraction, Speech Enhancement
- **Model management** — Download, activate, delete models with real-time progress tracking
- **Speaker profiles** — Enroll and manage voice identification profiles
- **Session monitoring** — Real-time view of active voice sessions and transcripts
- **Configuration** — Voice verification thresholds, adaptive profiles, retention settings

## Status Tab

The **Status** tab displays system health and readiness.

### Engine Readiness Tiles

Each engine displays:
- **Engine name** (e.g., "STT - Hybrid", "Wake Word - Sherpa")
- **Readiness indicator** (green = ready, amber = initializing, red = failed)
- **Active model** name (if loaded)
- **Model status** (Ready, Downloading, Activating, Failed)
- **Pipeline state** when VAD or wake-word registration is disabled by a feature flag

### ONNX Provider Detection

A dedicated **GPU Status** card shows the detected ONNX execution provider:

- **CPU** (default fallback)
- **CUDA** (NVIDIA GPU)
- **ROCm** (AMD GPU)
- **OpenVINO** (Intel accelerators)
- **CoreML** (Apple Silicon)

If GPU acceleration is detected, a **GPU badge** appears on the status card. This shows which hardware accelerator Lucia is using for voice inference.

### Guided Next Steps

A **Setup Checklist** guides you through initial configuration:

- [ ] Download STT model (required)
- [ ] Download VAD model (recommended)
- [ ] Download Wake Word model (optional)
- [ ] Enroll speaker profile (optional)
- [ ] Configure voice settings (optional)

Click items to navigate directly to the Models or Profiles tabs.

## Models Tab

The **Models** tab is where you browse available models, download them, activate them, and delete them when no longer needed.

### Model Browser

Models are organized by **engine type**:

- **STT** — Speech-to-Text engines (Hybrid, Sherpa Streaming, Sherpa Offline, Granite ONNX)
- **VAD** — Voice Activity Detection
- **Wake Word** — Custom phrase detection
- **Speaker Embedding** — Voice identification models
- **Speech Enhancement** — Noise reduction (GTCRN)

Each model shows:
- **Model name** and description
- **Size** (download size and disk footprint)
- **Language support** (where applicable)
- **Status** (Not Downloaded, Downloaded, Active, Failed)

### Downloading Models

Click **Download** on any model to start the download process.

**Real-time progress** is displayed:

- **Stage indicator** — "Downloading", "Extracting", "Validating"
- **Progress bar** — percentage complete with file size
- **Speed** — current download speed and estimated time

Downloads run in the background; you can navigate away and monitor progress from the Status tab.

### Activating Models

Downloaded models show an **Activate** button. Click to make that model active for its engine type.

**Hot-reload:** Model activation does not require a restart. The engine switches to the new model within seconds.

### Multiple STT Engines

If you have multiple STT models downloaded (e.g., "Sherpa Streaming" and "Sherpa Offline"), you can activate them independently or toggle between them. Your most recent activation is remembered as your **preferred STT engine** across restarts.

### Deleting Models

Downloaded but unused models can be freed by clicking **Delete**. This removes the model from disk and makes it available for re-download if needed later.

## Profiles Tab

The **Profiles** tab manages **speaker profiles** for voice identification.

### Enrolled Profiles

**Enrolled profiles** are verified voice samples that Lucia can reliably identify. You can:

- **View profile info** — name, enrollment date, speaker confidence
- **Rename inline** — click the name to edit
- **Manage audio clips** — view, playback, reassign clips to other profiles
- **Delete profile** — removes all clips and voice data

### Provisional Profiles

**Provisional profiles** are auto-discovered speakers that don't have enough samples for full enrollment yet. Lucia tracks these over time and can:

- **Promote to Enrolled** — once confidence is high enough, move to the enrolled list
- **Rename** — give the provisional speaker a friendly name
- **View activity** — see recent session counts and confidence trends
- **Delete** — discard if you don't need long-term tracking

### Audio Clip Management

Each profile shows its **audio clips**:

- **Clip count** — total recorded samples
- **Playback** — click to hear a sample
- **Reassign** — move a clip to a different profile (useful if auto-discovery misidentified)
- **Delete clip** — remove individual samples

### Speaker Enrollment Onboarding

Use the **Enroll New Profile** button to create a new speaker profile:

1. **Name** — give the profile a friendly name
2. **Optional wake-word enrollment** — record custom wake phrases in this person's voice
3. **Audio quality validation** — system checks SNR (signal-to-noise ratio) and duration
4. **Confirmation** — verify enrolled samples sound clear

Enrollment typically requires 3-5 clear voice samples.

## Wake Words Tab

The **Wake Words** tab manages custom wake phrases Lucia responds to.

### Default Wake Word

By default, Lucia listens for "hey Lucia" or "lucia". This is always active.

### Custom Wake Words

You can register additional phrases:

- **"ok computer"**, **"hey home"**, **"lucia, wake up"** — any phrase you prefer
- **Per-speaker customization** — optionally enroll a wake word in a specific speaker's voice for personalized activation

### Adding Wake Words

1. Click **Register Wake Word**
2. Enter the phrase
3. (Optional) Select a speaker profile to link this phrase to their voice
4. Click **Save**

The system will recognize the new wake word within seconds (no restart needed).

### Managing Wake Words

Each wake word shows:

- **Phrase** — the activation trigger
- **Enrolled speaker** (if linked)
- **Status** — Active/Inactive toggle
- **Delete** — remove the wake word

Toggle **Inactive** to temporarily disable a wake word without deleting it.

## Monitor Tab

The **Monitor** tab provides real-time visibility into active voice sessions.

### Live Session Stream

Active voice sessions appear with:

- **Session ID** and start time
- **Connection status** — active, idle, disconnected
- **Transcript log** — live-updating conversation text
- **Speaker identification** — detected speaker name (if known)
- **Audio levels** — real-time meters showing input audio amplitude

### Audio Level Meters

Visual feedback shows:

- **Current level** — green (quiet), yellow (normal), red (loud)
- **Peak level** — highest level during the session
- **Clipping indicator** — red X if audio clips (distortion warning)

This helps diagnose audio quality issues and positioning of microphones.

### Transcript Log

A scrollable feed shows the recognized text as it's being transcribed:

- **Interim transcripts** — lower confidence, updates as speech continues
- **Final transcripts** — confirmed text after speech pauses
- **Timestamps** — when each segment was recognized

### Connection Status

Shows whether each connected satellite is online and transmitting audio. Helps identify network or hardware issues.

## Config Panel

The **Config Panel** (bottom right of most tabs) provides voice-specific settings.

### Voice Verification Threshold

- **Default: 0.50** (cosine similarity score 0-1)
- Raise to require higher confidence for speaker identification
- Lower to accept provisional identifications more readily

### Provisional Profile Settings

- **Auto-discovery enabled** — check to track unknown speakers
- **Confidence threshold** — when to auto-promote provisional→enrolled
- **Max provisional profiles** — limit to prevent unbounded growth

### Adaptive Profiles

- **Enable adaptive updates** — profiles learn and adjust with new samples
- **Decay factor** — exponential moving average for profile adaptation

### Retention Controls

- **Archive audio after N days** — move old clips to archive storage
- **Delete sessions after N days** — purge session logs for privacy
- **Retention policy** — FIFO or LRU selection

Changes save immediately through the configured SQLite, PostgreSQL, or MongoDB provider.

## Performance Optimization

The Voice Platform is engineered for low-latency inference:

- **STT latency** — ~90ms finalization on benchmark audio (hybrid online+offline model)
- **Speaker identification** — ~1ms lookup (Redis-cached embeddings)
- **Wake word detection** — real-time streaming, sub-10ms per frame
- **Speech enhancement** — real-time streaming, `<50ms` latency

GPU acceleration (CUDA, ROCm, etc.) dramatically improves throughput for concurrent sessions.

In v1.3.1, generic AgentHost deployments skip VAD and wake-word engine registration by default. Enable `FeatureManagement__VadPipeline` and `FeatureManagement__WakeWordPipeline` when Lucia must perform those stages rather than receiving a bounded utterance from the upstream voice device.

## Technical Architecture

For deep dives into the voice platform architecture, see [`docs/architecture/voice-platform.md`](/docs/architecture/voice-platform).

Topics covered:

- Wyoming protocol implementation
- Multi-engine STT pipeline
- Speaker verification algorithms
- Wake word detection mechanics
- ONNX auto-detection logic
- Model lifecycle and persistence
- Performance tuning

## Wyoming Integration with Home Assistant

The Voice Platform runs a Wyoming satellite server that Home Assistant can discover and use as an input device. After setting up Lucia:

1. In Home Assistant, go to **Settings → Devices & Services**
2. Click **Create Automation** and search for **Wyoming**
3. Lucia should appear in the list (auto-discovered via Zeroconf)
4. Connect and select "Lucia" as your voice input

Multi-turn conversations then flow through Lucia's command parser and orchestration pipeline.

## Troubleshooting

### Models Fail to Download

- Check your internet connection
- Verify HuggingFace API access (public models should not require auth)
- See logs for specific error messages

### Speaker Identification Not Working

- **Verify threshold** — check Voice Verification Threshold in Config Panel
- **Enroll more samples** — profiles with few clips have low confidence
- **Check audio quality** — ensure microphone placement and levels are good

### Wake Word Not Detected

- **Ensure VAD is active** — speech detection must be enabled
- **Check microphone** — test audio input in Monitor tab
- **Verify phrase** — exactly match the registered wake word

### GPU Not Being Used

- **Check GPU status card** — shows if GPU was detected and loaded
- **Verify drivers** — CUDA 12.x or ROCm should be installed
- **Check logs** — fallback to CPU is graceful; see logs for why

## See Also

- **Wyoming Protocol** — [`docs/architecture/voice-platform.md`](/docs/architecture/voice-platform)
- **Conversation Command Parser** — [`docs/api/conversation-api.md`](/docs/api/conversation-api)
- **Response Templates** — [`docs/dashboard/response-templates.md`](/docs/dashboard/response-templates)

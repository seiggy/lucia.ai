---
slug: pulsar-release
title: "v1.2.0 Pulsar — Voice Platform, Fast Commands, Personalization, and Zero-Dependency Deployment"
authors: [seiggy]
tags: [release, feature, voice, wyoming, productivity]
---

**Pulsar (v1.2.0)** is Lucia's biggest release since Galaxy — a transformational upgrade that brings a **full local voice pipeline** to your smart home, **sub-50ms command execution** via pattern matching, **customizable AI personality**, **pluggable data providers** for resource-constrained deployment, and **simplified Home Assistant integration** with a unified dashboard for all voice and automation settings.

<!-- truncate -->

## Highlights

- **Wyoming Voice Platform** — Local speech-to-text, speaker verification, wake words, speech enhancement, and multi-engine model management. No cloud calls. No latency. Full privacy.
- **Conversation Command Parser** — Pattern-matched commands (lights, climate, scenes) bypass the LLM entirely for sub-50ms responses. LLM fallback for everything else, seamlessly.
- **Personality Prompt** — Define how Lucia sounds. Pirate speak, formal assistant, casual friend — your choice. Applies to all agent responses without adding latency when disabled.
- **Pluggable Data Providers** — InMemory + SQLite backends eliminate Redis/MongoDB requirements. Perfect for Raspberry Pi or Home Assistant add-on deployment.
- **Voice Platform Dashboard** — Single control room for model management, speaker profiles, wake words, engine status, and real-time session monitoring.
- **Simplified HA Integration** — v1.2 component drops agent selection. Just point to host and go. REST-based, vastly simpler setup.
- **Response Templates** — Customize responses per skill with `{placeholder}` interpolation. Manage everything from the dashboard.

## What's new

### Voice: Wyoming Protocol Server
Lucia now implements the full **Wyoming protocol** — Home Assistant's standard for voice satellites. You get:
- **Streaming STT** with progressive re-transcription for best-of-both-worlds latency/accuracy
- **Speaker verification** with enrolled profiles, auto-discovery, and adaptive profile updates
- **Wake word detection** with custom phrases and per-speaker calibration
- **Speech enhancement** (GTCRN noise reduction) for cleaner audio in noisy rooms
- **ONNX auto-detection** — CPU, CUDA, ROCm, OpenVINO, DirectML all supported. Zero config.
- **Model management** — Download, activate, delete STT/VAD/wake-word/speaker-embedding/enhancement models from the dashboard

Six inference engines ship in the box: Sherpa streaming, Sherpa offline, Parakeet, IBM Granite 4.0, custom voice encoder chains, and speech enhancement. Start simple; dial in precision as needed.

### Commands: Conversation Command Parser
New `POST /api/conversation` endpoint that executes recognized patterns instantly:
- **Light commands**: "turn on the kitchen lights", "set living room brightness to 50"
- **Climate commands**: "set temperature to 72", "turn up the AC"
- **Scene commands**: "activate movie scene"

Pattern-matched commands hit Home Assistant directly — **zero LLM latency**. Unrecognized commands fall back to the LLM with structured context. Responses use customizable templates with `{entity}`, `{action}`, `{area}` placeholders and random variants for natural variety.

### Personality: Customizable AI Persona
Add a system prompt on the Configuration page under **Personality Prompt**. When set, all orchestrator responses flow through an LLM that rewrites them to match your tone. Optionally use a cheaper/faster model for the rewrite — separate from the main orchestrator. When personality is off, zero overhead.

### Deployment: Pluggable Data Providers & Mono-Container
Stop managing Redis and MongoDB. Lucia now supports:
- **InMemory cache** — Multi-turn sessions, entity caching, response templates, all in-process with configurable TTL
- **SQLite store** — 17 repositories covering traces, config, tasks, Wyoming data. Single `lucia.db` file. Migrations included.

New `Dockerfile.ha` creates a **mono-container deployment** with CPU-only ONNX, embedded dashboard, and zero external dependencies. Perfect for Home Assistant add-on installation.

### Dashboard: Voice Platform Control Center
New **Voice Platform** section provides:
- **Status tab** — Engine readiness, active models, ONNX provider detection, next-steps checklist
- **Models tab** — Browse, download, activate models per engine with real-time download progress
- **Profiles tab** — Enrolled speaker profiles, inline rename, merge, audio clip management with playback
- **Wake Words tab** — Register custom wake phrases, optional speaker enrollment
- **Monitor tab** — Real-time session monitoring with audio level meters, transcript log, connection status
- **Config tab** — Verification thresholds, profile settings, adaptive updates, retention controls

### HA Integration: Simplified REST Migration
The **Home Assistant Component v1.2** strips away complexity:
- **REST migration** from A2A JSON-RPC 2.0 to structured `POST /api/conversation` with context objects
- **No agent selection** — Just configure host URL + API key
- **Automatic conversation IDs** — Multi-turn continuity built-in
- **SSE streaming** for both instant JSON responses and LLM fallback streams

## Under the hood

- **Multi-engine STT pipeline** with hybrid online/offline for latency + accuracy
- **Cosine-similarity speaker identification** with 256-dim embeddings
- **Lexicon-based temporal parsing** ("5 minutes", "1 hour 30 minutes") — no LLM calls
- **Response template system** with random variant selection and `{placeholder}` interpolation
- **ONNX model lifecycle** with hot-reload without restarts
- **Streaming architecture** — no buffering, real-time audio processing end-to-end
- **230+ Wyoming tests + 17 conversation tests** covering protocol edge cases, speaker verification, command patterns, and fallback flows

## Upgrade notes

**New infrastructure dependencies:**
- MongoDB optional but recommended for speaker profiles and response templates
- Redis optional but recommended for profile caching

**Voice setup required:**
1. After upgrading, navigate to **Voice Platform → Models**
2. Download and activate at least one STT model
3. Download and activate VAD, Wake Word, Speaker Embedding, and Enhancement models
4. Add the **Lucia Wyoming satellite** in Home Assistant under Settings → Devices & Services → Add Integration → Wyoming

**Home Assistant component upgrade:**
- Remove and re-add the Lucia integration in Home Assistant
- New setup flow only requires host URL + API key

**GPU acceleration (optional):**
- The project now ships with `Microsoft.ML.OnnxRuntime.Gpu.Linux` for automatic CUDA support
- Install CUDA 12.x + cuDNN 9.x locally; ONNX provider detection handles it
- Docker voice image includes all GPU dependencies

**Data providers:**
- Default (Redis + MongoDB) is unchanged and fully backward-compatible
- To enable new providers, set `DataProvider:Cache=InMemory` and `DataProvider:Store=SQLite` in config
- Mono-container `Dockerfile.ha` uses SQLite + InMemory by default

## What comes next

- **Climate Agent enhancements** — More HVAC modes, humidity control, fan presets
- **Scene automation** — Trigger complex multi-device scenes from natural language
- **Voice-specific optimizations** — Wake word tuning, speaker profile training, acoustic model fine-tuning
- **Multi-satellite coordination** — Distribute voice processing across multiple satellites

## Learn more

For complete technical detail:
- [Lucia v1.2.0 Release Notes](https://github.com/seiggy/lucia-dotnet/blob/master/RELEASE_NOTES.md)
- [Wyoming Protocol Documentation](https://www.wyomingprotocol.org/)
- [GitHub Releases](https://github.com/seiggy/lucia-dotnet/releases)

---

**Pulsar is available now.** Upgrade via Docker, Kubernetes Helm chart, or manual .NET build. Feedback and issues go to [GitHub Discussions](https://github.com/seiggy/lucia-dotnet/discussions).

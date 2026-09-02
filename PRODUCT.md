# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Home Assistant households seeking an appliance-like voice assistant that is easy to set up and use without giving up privacy or visibility into how it works.

## Product Purpose

Lucia is an open-source voice assistant for Home Assistant. It makes private, local-first whole-home voice control approachable while retaining the flexibility to use hybrid or cloud-backed models when desired.

Success means a household can install Lucia, complete setup from a phone, control its home naturally, and understand or troubleshoot the assistant's decisions without specialist knowledge.

## Positioning

Lucia combines appliance-simple setup and private local voice with transparent routing through specialized agents. The system exposes traces, provider controls, diagnostics, and agent behavior instead of hiding orchestration behind one opaque prompt.

## Operating Context

- Voice and text requests enter through Home Assistant Assist, dashboard widgets, or connected satellites.
- Lucia routes requests to focused agents for lighting, climate, scenes, music, timers, lists, sensors, security, and general conversation.
- Households configure and inspect the system through the Lucia dashboard.
- Installation paths include Lucia Appliance OS on supported Jetson Orin Nano Super hardware and self-hosted Docker, Kubernetes, or systemd deployments.

## Capabilities and Constraints

- Deep Home Assistant integration through its Conversation API, services, entities, areas, and automations.
- Local, hybrid, and cloud-backed model paths, including Ollama and supported hosted providers.
- Local GPU voice on supported Lucia Appliance OS hardware.
- Operational dashboard for setup, configuration, providers, agents, traces, exports, and diagnostics.
- Extensibility through plugins, MCP tool servers, custom agents, and A2A-connected agents.
- Production observability through OpenTelemetry and the bundled Grafana, Tempo, Prometheus, and Loki stack.
- The website and documentation are built with Docusaurus and deployed as a static web experience.

## Brand Commitments

- Product name: Lucia.
- Open-source and Home Assistant-centered.
- Privacy-first without implying that every deployment is fully local.
- Explain sophisticated orchestration in language suitable for households, while preserving accurate technical detail for operators and developers.

## Evidence on Hand

- Real dashboard screenshots are stored under `static/img/dashboard/`.
- The homepage includes trace-based routing demonstrations sourced from the maintainer's homelab.
- Product capabilities, architecture, setup, deployment, dashboard, API, plugin, and tutorial documentation are maintained under `docs/`.
- The roadmap in `src/components/Roadmap/index.tsx` distinguishes shipped, in-progress, and planned work.
- No customer testimonials, customer logos, independent benchmarks, pricing claims, or press proof are currently established; future work must not fabricate them.

## Product Principles

1. Make the private local path feel appliance-simple for a household.
2. Keep agent decisions inspectable and operationally understandable.
3. Integrate deeply with Home Assistant rather than recreating the home-control layer.
4. Preserve deployment and model choice without exposing avoidable setup complexity.
5. State shipped capabilities and evidence precisely; never blur roadmap work into current product claims.

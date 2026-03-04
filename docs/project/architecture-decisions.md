---
sidebar_position: 2
title: Architecture Decisions
---

# Architecture Decisions

This page logs significant architectural decisions made during the development of Lucia. Each entry captures the decision, the context that led to it, and the rationale behind the choice.

---

## DEC-001: Privacy-First Multi-Agent System on .NET

**Status:** Accepted
**Date:** 2025-01-15

### Decision

Build Lucia as a privacy-focused multi-agent AI home assistant on the .NET platform using C#.

### Context

Existing AI home assistants (Alexa, Google Home) are cloud-dependent and provide limited control over data privacy. Users who care about data sovereignty need an alternative that can run entirely on local infrastructure while still delivering strong natural-language understanding.

### Rationale

- .NET provides a mature, high-performance runtime with excellent tooling and cross-platform support.
- C# offers strong typing and first-class async/await, which are important for an agent framework that orchestrates concurrent tool calls.
- A multi-agent architecture allows each domain (lighting, climate, media) to be handled by a focused agent with its own tools and system prompt, keeping individual agents simple and accurate.
- Privacy-first means supporting fully local inference (Ollama) as a first-class option, not an afterthought.

---

## DEC-002: Microsoft Agent Framework + MagenticOne Pattern

**Status:** Accepted
**Date:** 2025-02-01

### Decision

Adopt the Microsoft Agent Framework as the foundation for agent orchestration, following the MagenticOne multi-agent pattern.

### Context

Building a multi-agent orchestrator from scratch would require significant investment in routing, tool calling, memory management, and protocol handling. The Microsoft Agent Framework provides these capabilities out of the box.

### Rationale

- The Microsoft Agent Framework offers a production-ready agent runtime with built-in support for tool calling, conversation history, and multi-model backends.
- The MagenticOne pattern (a central orchestrator that delegates to specialized workers) maps directly to Lucia's architecture -- one orchestrator routing to domain-specific agents.
- Using a framework maintained by Microsoft aligns with the .NET ecosystem choice and benefits from ongoing investment in AI tooling.

---

## DEC-003: A2A Protocol for Agent Communication

**Status:** Accepted
**Date:** 2025-03-10

### Decision

Use the Agent-to-Agent (A2A) protocol -- JSON-RPC 2.0 over HTTP -- for communication between the orchestrator and satellite agents.

### Context

Some agents need to run as separate processes (for independent scaling, different runtimes, or long-running state). A standard protocol is needed for the orchestrator to discover and communicate with these satellite agents.

### Rationale

- JSON-RPC 2.0 is a simple, well-specified protocol that is easy to implement in any language.
- HTTP transport means satellite agents can run in separate containers, on different hosts, or behind load balancers.
- Agent Cards (discovery documents) allow the orchestrator to learn about satellite agents at runtime without hardcoded configuration.
- The A2A protocol is language-agnostic, enabling satellite agents written in Python, TypeScript, or any other language.

---

## DEC-004: Python Custom Component for Home Assistant

**Status:** Accepted
**Date:** 2025-02-15

### Decision

Implement the Home Assistant integration as a Python custom component that communicates with the Lucia agent host via HTTP API.

### Context

Home Assistant custom integrations must be written in Python and follow HA's component lifecycle. Lucia's core is written in .NET. A bridge is needed between the two systems.

### Rationale

- HA custom components are the standard extension mechanism and integrate natively with the Conversation API, entity registry, and configuration flow.
- HTTP communication between the Python component and the .NET agent host provides a clean separation of concerns. The HA integration handles entity exposure and conversation routing; the agent host handles AI orchestration.
- This approach avoids embedding a .NET runtime inside Home Assistant or vice versa.

---

## DEC-005: Microsoft C# Coding Guidelines

**Status:** Accepted
**Date:** 2025-01-15

### Decision

Follow the official Microsoft C# coding guidelines and conventions across the entire .NET codebase.

### Context

A consistent coding style reduces friction for contributors and makes the codebase easier to navigate and review.

### Rationale

- Microsoft's C# guidelines are the de facto standard for .NET projects and are familiar to most C# developers.
- Consistency with the broader .NET ecosystem lowers the barrier to contribution.
- Tooling (EditorConfig, dotnet format, analyzers) enforces the guidelines automatically.

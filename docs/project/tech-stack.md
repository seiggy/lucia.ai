---
sidebar_position: 3
title: Tech Stack
---

# Tech Stack

This page documents the technologies and frameworks used across the Lucia project.

## Core

| Technology | Version | Purpose |
|---|---|---|
| ASP.NET Core | .NET 10 | Web framework and application host |
| C# | 13 | Primary language for the agent host and tooling |

## AI Framework

| Technology | Version | Purpose |
|---|---|---|
| Microsoft Agent Framework | 1.0.0 | Agent orchestration, tool calling, conversation management |

## Databases

| Technology | Purpose |
|---|---|
| Redis | Caching, pub/sub, session state, prompt cache |
| MongoDB | Persistent storage for conversations, agent definitions, entity data, plugin state |

## LLM Providers

| Provider | Models | Notes |
|---|---|---|
| OpenAI | GPT-4o, GPT-4o-mini | Cloud inference |
| Google Gemini | Gemini 2.0 Flash, Gemini 2.5 Pro | Cloud inference |
| Anthropic | Claude Sonnet, Claude Haiku | Cloud inference |
| Ollama | Llama 3.1, Qwen 2.5, and others | Local inference -- privacy first |
| Azure AI Foundry | Azure-hosted OpenAI deployments | Enterprise cloud inference |

## Frontend

| Technology | Version | Purpose |
|---|---|---|
| Python | 3.12+ | Home Assistant custom integration |
| React | 19 | Dashboard UI framework |
| Vite | 7 | Dashboard build tooling and dev server |

## Infrastructure

| Technology | Version | Purpose |
|---|---|---|
| Docker | -- | Containerization for all services |
| Kubernetes | -- | Production orchestration via Helm charts |
| .NET Aspire | 13.1.1 | Local development orchestration and service discovery |

## Testing

| Technology | Purpose |
|---|---|
| xUnit | Unit and integration test framework |
| FakeItEasy | Mocking library |
| Aspire.Hosting.Testing | Integration testing with .NET Aspire |

## CI/CD

| Technology | Purpose |
|---|---|
| GitHub Actions | Continuous integration and deployment pipelines |

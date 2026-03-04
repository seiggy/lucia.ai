---
sidebar_position: 4
title: Contributing
---

# Contributing

Thank you for your interest in contributing to Lucia. This guide covers the workflow and areas where help is most welcome.

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally.
3. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes.** Follow the existing code style and conventions (see [Architecture Decisions](./architecture-decisions.md) for guidelines).
5. **Add tests** for any new functionality.
6. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/) format:
   ```bash
   git commit -m "feat: add calendar entity support to GeneralAgent"
   ```
7. **Push** your branch and open a Pull Request against `main`.

## Conventional Commit Types

| Type | Use When |
|---|---|
| `feat` | Adding a new feature |
| `fix` | Fixing a bug |
| `docs` | Documentation changes only |
| `refactor` | Code restructuring without behavior changes |
| `test` | Adding or updating tests |
| `chore` | Build, CI, or tooling changes |

## Contribution Areas

### New Agents

Build specialized agents for domains not yet covered (calendar, security, notifications). See the [Agents Overview](/docs/agents/overview) for architecture guidance.

### Community Plugins

Create plugins that extend Lucia with new tools, services, or integrations. See [Create a Plugin](/docs/tutorials/plugin-creation) for the development workflow.

### LLM Integrations

Add support for new LLM providers or improve existing provider implementations.

### Home Assistant Integrations

Expand entity support, add new service calls, or improve the HA custom component.

### Dashboard Features

Improve the React dashboard with new views, better UX, or accessibility enhancements.

### Documentation

Fix typos, improve existing docs, add examples, or write new guides and tutorials.

### Test Coverage

Increase unit and integration test coverage across the codebase.

### Translations

Help make Lucia accessible to non-English speakers by contributing translations for agent prompts and the dashboard UI.

## Code Review

All pull requests are reviewed before merging. Reviewers will check for:

- Correctness and test coverage.
- Consistency with existing patterns and conventions.
- Clear commit messages that explain the "why."
- No unintended breaking changes.

## Reporting Issues

If you find a bug or want to request a feature, open a GitHub Issue. Please include:

- Steps to reproduce (for bugs).
- Expected vs actual behavior.
- Lucia version and deployment method (Docker, Kubernetes, Aspire).
- Relevant logs or screenshots.

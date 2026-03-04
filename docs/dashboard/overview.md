---
sidebar_position: 1
title: Dashboard Overview
---

# Dashboard Overview

Lucia's management dashboard is a single-page application built with **React 19**, **Vite 7**, **TanStack Query**, and **Tailwind CSS**. It ships with a dark theme and provides over 20 pages for monitoring and configuring every aspect of your Lucia installation.

## Authentication

Access to the dashboard is gated by API key authentication. On first load you will be prompted to enter your API key. The key is stored in the browser and sent with every request.

## Key Features

- **Real-time monitoring** -- live metrics, activity feeds, and trace inspection.
- **Agent management** -- register A2A agents, define custom agents, and assign model providers.
- **Tool integration** -- connect MCP servers and discover available tools.
- **Configuration** -- schema-driven editor for all Lucia settings with sensitive value masking.
- **Data exports** -- export labeled traces as training datasets for RLHF workflows.
- **Plugin ecosystem** -- install, manage, and browse community plugins.

## Navigation

The sidebar organizes pages into logical groups. The **Activity** page is the default landing page and provides an at-a-glance view of system health. Use the pages listed in this section to explore each feature in detail.

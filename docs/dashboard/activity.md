---
sidebar_position: 2
title: Activity
---

# Activity

The Activity page is the default landing page of the dashboard. It gives you a real-time snapshot of system health and recent operations.

![Activity Dashboard](/img/dashboard/activity.png)

## Metrics

Four metric cards are displayed at the top of the page:

- **Total Requests** -- cumulative request count since last restart.
- **Error Rate** -- percentage of requests that returned an error.
- **Cache Hit Rate** -- percentage of prompts served from cache.
- **Task Completion** -- ratio of completed tasks to total tasks.

## Mesh Graph

An interactive graph powered by **React Flow** visualizes the runtime topology. Nodes represent the orchestrator, registered agents, and connected tools. Edges show communication paths. You can pan, zoom, and click nodes for details.

## Live Activity Feed

A Server-Sent Events (SSE) feed streams activity in real time at the bottom of the page. Each entry shows the timestamp, source agent, action type, and a short summary. The feed auto-scrolls but can be paused by scrolling up.

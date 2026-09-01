---
sidebar_position: 2
title: Activity
---

# Activity

The Activity page is the default landing page of the dashboard. It gives you a real-time snapshot of system health and recent operations.

![Activity Dashboard](/img/dashboard/activity.png)

## Metrics

Seven metric cards are displayed at the top of the page:

- **Total Requests** -- cumulative request count since last restart.
- **Error Rate** -- percentage of requests that returned an error.
- **Cache Hit Rate** -- percentage of prompts served from cache.
- **Task Completion** -- ratio of completed tasks to total tasks.
- **Command Parsed** -- count of commands handled locally by the pattern matcher without LLM involvement.
- **LLM Fallback** -- count of commands forwarded to the LLM orchestrator for processing.
- **Parser Rate** -- percentage showing the ratio of commands parsed locally vs. forwarded to the LLM.

## Mesh Graph

An interactive graph powered by **React Flow** visualizes the runtime topology. Nodes represent the orchestrator, registered agents, and connected tools. Edges show communication paths. You can pan, zoom, and click nodes for details.

## Command Parser Metrics Explained

In v1.2.0, Lucia introduced a **Conversation Command Parser** that pattern-matches common smart home commands before invoking the LLM. This provides sub-50ms responses for recognized patterns while maintaining full LLM flexibility for novel requests.

- **Parsed Locally** -- "Turn off the kitchen lights" matches a pattern and executes directly via the skill system (DirectSkillExecutor), bypassing the LLM entirely.
- **Forwarded to LLM** -- "Turn off the kitchen lights and set the temperature to 72 degrees" contains a multi-domain request that doesn't match a single pattern, so it's sent to the LLM Orchestrator for decomposition and agent routing.
- **Parser Rate** -- A high rate (e.g., 85%) means most commands are well-handled by pattern matching. A lower rate suggests users are asking more complex, multi-domain questions.

The Parser Rate metric helps you understand usage patterns — if it's consistently high, you may benefit from tweaking response templates. If it's low, the LLM orchestrator is doing the heavy lifting on complex requests.

## Live Activity Feed

A Server-Sent Events (SSE) feed streams activity in real time at the bottom of the page. Each entry shows the timestamp, source agent, action type, and a short summary. The feed auto-scrolls but can be paused by scrolling up.

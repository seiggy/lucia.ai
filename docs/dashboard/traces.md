---
sidebar_position: 3
title: Traces
---

# Traces

The Traces page lets you monitor and inspect individual conversations processed by Lucia.

![Traces](/img/dashboard/traces.png)

## Filtering

Use the filter bar to narrow results by:

- **Label** -- filter by user-applied or auto-applied labels.
- **Agent** -- show only traces handled by a specific agent.
- **Date** -- restrict to a date range.

## Trace List

Traces are displayed in a scrollable list with color-coded counters indicating message count and status. Each row shows the trace ID, timestamp, participating agents, and labels.

## Trace Detail

Click any trace to open its detail view. The detail panel shows the full routing chain: which agent was selected, what tools were invoked, and the complete message history. Token counts and latency are displayed for each turn.

## Labels

Labels can be applied to traces for organization and later used when exporting training datasets. Apply labels from the detail view or in bulk from the list.

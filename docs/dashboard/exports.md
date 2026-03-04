---
sidebar_position: 9
title: Dataset Exports
---

# Dataset Exports

The Dataset Exports page lets you export labeled conversation traces as structured training datasets.

![Exports](/img/dashboard/exports.png)

## Filtering

Before exporting, narrow the dataset using filters:

- **Label** -- select one or more labels to include only matching traces.
- **Date Range** -- restrict to traces within a specific time window.
- **Agent** -- include only traces handled by a particular agent.

## Export Formats

Exported datasets are structured for common fine-tuning and evaluation workflows. The export includes conversation turns, tool calls, and metadata.

## RLHF Support

Traces with quality labels can be exported in a format suitable for Reinforcement Learning from Human Feedback (RLHF) pipelines. Positive and negative examples are separated based on their labels, making it straightforward to build preference datasets.

## Workflow

1. Label traces on the **Traces** page during regular usage.
2. Navigate to **Dataset Exports** and apply your filters.
3. Click **Export** to generate and download the dataset file.

---
sidebar_position: 5
title: Export Training Data
---

# Export Training Data

Lucia records full conversation traces for every interaction. You can export these traces as structured datasets for fine-tuning models or reinforcement learning from human feedback (RLHF). This tutorial shows you how to filter, review, and download training data from the dashboard.

## Step 1 -- Navigate to Exports

Open the Lucia dashboard and click **Exports** in the sidebar. This page provides tools for filtering and downloading conversation data.

## Step 2 -- Filter Conversations

Use the filter controls to narrow down the conversations you want to include in your dataset.

| Filter | Description |
|---|---|
| **Label** | Filter by conversation label (e.g. `good`, `needs-correction`, `complex`). Labels can be applied from the conversation view. |
| **Date Range** | Select a start and end date to limit the export window. |
| **Agent** | Filter by the agent that handled the conversation (e.g. `LightAgent`, `GeneralAgent`). |

You can combine filters. For example, selecting label `good` + agent `LightAgent` + last 30 days gives you a curated set of successful lighting interactions.

## Step 3 -- Include Human Corrections

When reviewing conversations in the dashboard, you can provide corrected responses for messages where the agent's output was not ideal. These corrections are stored alongside the original traces.

To include corrections in your export:

1. Enable the **Include Human Corrections** toggle on the Exports page.
2. Corrected turns are exported with both the original agent response and the human-provided correction, making the data suitable for RLHF and preference-based fine-tuning.

### Correction Format

Each corrected turn in the exported dataset includes:

```json
{
  "role": "assistant",
  "content": "The original agent response.",
  "correction": "The human-corrected response.",
  "corrected": true
}
```

## Step 4 -- Download the Dataset

Click **Export**. Lucia generates a structured dataset file and presents a download link.

The exported file includes:

- **System prompts** -- the instructions given to each agent.
- **Conversation turns** -- the full message history (user, assistant, tool calls, tool results).
- **Metadata** -- timestamps, agent name, model used, token counts.
- **Corrections** -- human-provided corrections when the toggle is enabled.

:::tip
Export regularly and label your conversations as you review them. A well-labeled dataset is far more valuable for fine-tuning than a large unlabeled one.
:::

## Use Cases

| Goal | Recommended Filters |
|---|---|
| Fine-tune a lighting model | Agent: `LightAgent`, Label: `good` |
| Build an RLHF dataset | Include Human Corrections: enabled, Label: `needs-correction` |
| General improvement | Date range: last 7 days, all agents |
| Domain-specific training | Agent: specific agent, Date range: all time |

## What's Next?

- [Multi-LLM Setup](./multi-llm.md) -- configure the model providers you are fine-tuning for.
- [Build a Custom Agent](./custom-agent.md) -- create agents that use your fine-tuned models.

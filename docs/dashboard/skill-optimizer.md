---
sidebar_position: 18
title: Skill Optimizer
---

# Skill Optimizer

The Skill Optimizer page helps you refine and test the skills assigned to your agents for better routing accuracy and response quality.

![Skill Optimizer](/img/dashboard/skill-optimizer.png)

## Optimizing Skills

Select an agent to view its current skill definitions. Each skill includes a name, description, and example phrases. The optimizer analyzes your trace history to suggest improvements:

- **Description refinements** -- clearer wording that reduces routing ambiguity.
- **Missing skills** -- patterns found in traces that no current skill covers.
- **Overlapping skills** -- skills across agents that compete for the same queries.

Apply suggested changes individually or in bulk.

## Testing Skills

Use the test panel to enter a natural language query and see which agent and skill the orchestrator would select. The result shows the confidence score and any competing matches, helping you verify that routing behaves as expected after making changes.

## Workflow

1. Review optimizer suggestions based on recent trace data.
2. Apply changes to skill definitions.
3. Test with sample queries to confirm improved routing.

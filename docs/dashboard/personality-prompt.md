---
sidebar_position: 13
title: Personality Prompt
---

# Personality Prompt

The Personality Prompt feature lets you give Lucia a customizable voice and tone. When enabled, all agent responses are rewritten through an LLM with your personality instructions as the system prompt before being delivered to the user.

## How It Works

After the orchestrator composes a response from multiple agents, the `ResultAggregatorExecutor` passes the composed message through a personality rewriting LLM. The personality system prompt defines the desired tone, style, or persona—and the LLM transforms the technical response into something that matches your preferences.

### Zero-Cost Opt-In

**No personality configured?** No LLM call is made. The pipeline runs unchanged with zero added latency. Personality is completely optional.

### Graceful Degradation

If the personality rewriting model is misconfigured or unavailable:
- A warning is logged
- The raw (unrewritten) response is returned
- Orchestration completes successfully

The personality system is designed to enhance, never to fail your conversations.

## Configuration

Navigate to **Settings → Configuration** and scroll to the **Personality Prompt** section.

### Instructions

The **Instructions** field accepts a multi-line system prompt that shapes Lucia's voice. This is a textarea field for easy editing.

**Example personalities:**

- **Professional Assistant:** "You are a professional, courteous home automation assistant. Respond with clear, jargon-free language. Always prioritize clarity and accuracy."
- **Casual Friend:** "You're a friendly, laid-back home assistant. Use casual language, occasional humor, and keep responses concise and conversational."
- **Pirate Speak:** "Respond like a swashbuckling pirate. Use nautical terminology, say 'arr' occasionally, and make it fun. Still answer questions accurately!"
- **Formal Butler:** "You are a refined, formal English butler attending to the household. Use proper diction, address the user respectfully, and maintain an air of dignified service."

### Optional: Separate Model

By default, personality rewriting uses the same model as the orchestrator. You can optionally select a different (typically cheaper or faster) model from the **ModelConnectionName** dropdown.

This dropdown is populated from your configured **Chat-type** model providers. Select a provider to route personality rewrites to that specific model while keeping the orchestrator's primary model unchanged.

**Common pattern:** Use a large model (GPT-4o) for orchestration, a smaller model (GPT-4 Turbo or Gemini) for personality rewriting.

## Dashboard Display

The Personality Prompt section appears automatically in the Configuration page sidebar via the schema API. The **textarea** field type provides a resizable input with proper multi-line support.

If you have configured model providers, the **ModelConnectionName** field renders as a **searchable dropdown** populated from your chat-type providers, matching the pattern used in Agent Definitions.

## Hot Reload

Changes to the Personality Prompt take effect immediately via `IOptionsMonitor`. No restart required—save your configuration and the next request will use the updated personality.

## API Integration

The personality rewriting is handled internally by the orchestration pipeline. If you're calling the REST API directly:

- **Personality rewrite is transparent** — the aggregated response you receive from the API is already personality-rewritten if configured
- **No separate API call needed** — the rewriting happens inside the orchestrator's result aggregation step

## Performance Implications

When personality is enabled, each conversation incurs one additional LLM call (the rewrite). For reference:
- **Routing cost**: ~1 LLM call per orchestration (with prompt cache, often 0)
- **Personality cost**: +1 LLM call per response when enabled
- **Total throughput**: Typically sub-second for both routing and personality rewriting combined

## Examples

### Transforming a Technical Response

**Without Personality:**
```
Lights in the kitchen are on with brightness at 100%. Motion detected. No occupancy threshold reached.
```

**With Casual Friend Personality:**
```
The kitchen lights are fully on and nobody's hanging around. Motion sensor picked up some movement, but it doesn't look like anyone's actually there.
```

### Multi-Agent Response

When multiple agents contribute (e.g., light control + climate adjustment), the aggregator combines them into a single message, then personality applies to the whole thing:

**Orchestrator aggregation:** "Lights in the living room have been dimmed to 50%. Thermostat is now set to 72°F."

**Professional Assistant personality:** "I've adjusted the living room lighting to 50% brightness for ambiance, and set the thermostat to a comfortable 72 degrees."

## Troubleshooting

### Personality Not Applying

- **Check configuration:** Make sure the **Instructions** field is not empty
- **Check logs:** Look for `Personality rewriting failed` warnings
- **Verify model:** If using a separate `ModelConnectionName`, ensure that provider is configured and online

### Slow Responses

- **Personality is an extra LLM call** — if you notice latency, consider using a faster model for the `ModelConnectionName`
- **Check prompt cache:** Orchestrator routing cache still works independently; personality adds time only for the rewrite call

### Inconsistent Results

Personality rewriting is non-deterministic (temperature is set by the LLM backend). For consistent outputs:
- Use a model with deterministic settings (if supported)
- Keep personality instructions specific and behavioral (avoid vague guidelines)

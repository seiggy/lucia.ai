---
sidebar_position: 8
title: General Agent
---

# General Agent

The General Agent is the fallback for requests that do not match any specialized agent. It handles open-ended questions, general knowledge, conversational responses, and -- when the SearXNG plugin is enabled -- web searches.

## When Is It Used?

The orchestrator routes to the General Agent when:

- The request is a general knowledge question ("What's the capital of France?")
- The user wants a conversational response ("Tell me a joke")
- No other agent's domain matches the intent
- The user explicitly asks for a web search ("Search for the weather in Denver")

## Capabilities

| Action | Example Utterance |
|---|---|
| General knowledge | "What year did the moon landing happen?" |
| Conversational | "Good morning" |
| Math / reasoning | "What's 15% tip on $84?" |
| Web search | "Search for how to reset a Nest thermostat" |
| Summarization | "Summarize the latest news about AI" |

## Web Search with IWebSearchSkill

The General Agent accepts an optional `IWebSearchSkill` dependency. When the [SearXNG plugin](/docs/plugins/official-plugins) is installed and enabled, the agent gains the ability to search the web and incorporate results into its responses.

### Without SearXNG

The agent relies solely on the LLM's training data for answers. It will indicate when it does not have up-to-date information.

### With SearXNG

The agent can perform live web searches and ground its answers in current results.

```
User: "What's the weather like in Denver today?"

GeneralAgent:
  1. Determines the question requires current information
  2. Calls IWebSearchSkill.search("weather Denver today")
  3. Receives search results from SearXNG
  4. Synthesizes a response grounded in the results
  5. Responds: "Denver is currently 45 F and partly cloudy with a high of 52 F expected today."
```

### Enabling SearXNG

Install the SearXNG plugin from the [Plugins](/docs/dashboard/plugins-page) dashboard page, or add the SearXNG container to your Docker Compose:

```yaml
services:
  searxng:
    image: searxng/searxng:latest
    container_name: lucia-searxng
    restart: unless-stopped
    ports:
      - "8888:8080"
    environment:
      - SEARXNG_BASE_URL=http://searxng:8080
```

Then configure the plugin in the dashboard with the SearXNG URL.

## Tool Functions

### `web_search`

Searches the web via SearXNG. Only available when the plugin is enabled.

```json
{
  "query": "how to reset Nest thermostat",
  "num_results": 5
}
```

Response:

```json
{
  "results": [
    {
      "title": "How to Reset Your Nest Thermostat",
      "url": "https://example.com/nest-reset",
      "snippet": "To factory reset your Nest thermostat, go to Settings > Reset > All Settings..."
    }
  ]
}
```

### `get_current_time`

Returns the current date and time in the user's configured timezone. Useful for time-sensitive questions.

```json
{
  "datetime": "2026-03-04T14:30:00-07:00",
  "timezone": "America/Denver"
}
```

## Example Interaction

```
User: "Tell me about the James Webb Space Telescope"

Orchestrator -> GeneralAgent

GeneralAgent:
  1. No specialized agent matches this request
  2. LLM generates a response from training data
  3. Responds with a summary of JWST's mission, launch date, and key discoveries
```

## Default Instructions

The following system prompt is sent to the LLM when the General Agent handles a request:

```text
You are a specialized general knowledge agent for a Home Assistant platform.

Your responsibilities:
- Be informative and friendly.
- Answer questions to the best of your ability, but don't invent facts or make up
  knowledge
- If you do not know the answer, simply state in your response "I do not know."
- Try to answer the user's request to the best of your ability. Keep your response
  short enough to be about 6-10 seconds of audio. Roughly about 2 sentences at most.
- When asked about recent events, news, or facts that may change, use the web_search
  tool to find current information before answering.

## IMPORTANT
* Keep your responses short. Aim for about 2 sentences max.
* Do not offer to provide other assistance.
```

## Configuration

The General Agent works out of the box with no additional configuration. To enable web search, install and configure the SearXNG plugin as described above.

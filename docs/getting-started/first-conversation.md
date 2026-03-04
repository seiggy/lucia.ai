---
sidebar_position: 3
title: First Conversation
---

# First Conversation

Now that Lucia is running and the setup wizard is complete, it is time to send your first message.

## Using the Dashboard

1. Open the Lucia dashboard at `http://localhost:7233`.
2. Sign in with the API key or credentials you created during setup.
3. You will see the main conversation interface with a text input at the bottom.
4. Type a message like:

   > Turn on the living room lights

5. Lucia will process your request through the agent pipeline and respond with a confirmation.

:::tip
Try natural language -- you do not need rigid commands. Phrases like "make it warmer in the bedroom", "what's the garage temperature?", or "start movie time" all work if the relevant entities and automations exist in Home Assistant.
:::

## Using the A2A API

Lucia exposes an [Agent-to-Agent (A2A)](https://google.github.io/A2A/) endpoint that you can call directly. This is useful for integrations, scripts, and testing.

Send a request to a specific agent using JSON-RPC:

```bash
curl -X POST http://localhost:7233/a2a/light-agent \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: $LUCIA_API_KEY" \
  -d '{
    "jsonrpc": "2.0",
    "method": "message/send",
    "params": {
      "message": {
        "role": "user",
        "parts": [
          {
            "kind": "text",
            "text": "Turn on the living room lights"
          }
        ]
      }
    },
    "id": "1"
  }'
```

The agent will process the request and return a JSON-RPC response with the result.

## How the Conversation Flow Works

When you send a message to Lucia, it passes through several stages:

```
User Input
  |
  v
Home Assistant --> Conversation API
                      |
                      v
                  Orchestrator
                      |
                      v
                  Agent (e.g., Light Agent)
                      |
                      v
                    LLM (inference)
                      |
                      v
                  Response --> Home Assistant --> User
```

1. **User Input** -- You send a message through the dashboard, voice, or the HA Conversation API.
2. **Home Assistant** -- If the request originates from HA (e.g., a voice assistant), it hits the Lucia custom integration which forwards it to the Conversation API.
3. **Orchestrator** -- The central orchestrator analyzes the intent and routes the request to the appropriate specialized agent.
4. **Agent** -- The selected agent (lighting, climate, media, etc.) constructs a prompt with relevant HA entity context and sends it to the LLM.
5. **LLM** -- The language model processes the prompt, determines the appropriate HA service calls, and generates a natural-language response.
6. **Response** -- The result flows back through the chain to the user, and any service calls are executed against Home Assistant.

## Next Steps

To connect Lucia directly to Home Assistant as a conversation agent, follow the [Home Assistant Setup](./home-assistant-setup.md) guide.

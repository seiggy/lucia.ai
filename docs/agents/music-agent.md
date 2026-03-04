---
sidebar_position: 5
title: Music Agent
---

# Music Agent

The Music Agent controls media playback through [Music Assistant](https://music-assistant.io/), a dedicated music server that integrates with Home Assistant. It runs as an **A2A satellite agent** in its own container, communicating with the Lucia orchestrator over the Agent-to-Agent protocol.

## Why A2A?

Music playback involves long-running sessions, streaming state, and tight integration with the Music Assistant API. Running as a satellite allows the Music Agent to:

- Maintain a persistent connection to the Music Assistant server.
- Manage queue state independently of the orchestrator lifecycle.
- Be updated or restarted without affecting other agents.

## Capabilities

| Action | Example Utterance |
|---|---|
| Play music | "Play some jazz" |
| Play artist/album/track | "Play Abbey Road by the Beatles" |
| Pause / Resume | "Pause the music" |
| Skip track | "Next song" |
| Set volume | "Turn the volume up to 60" |
| Queue management | "Add this to the queue" |
| Player selection | "Play it in the kitchen" |

## Architecture

```
Lucia Orchestrator
      |  (A2A / JSON-RPC over HTTP)
      v
Music Agent (satellite container)
      |  (Music Assistant API)
      v
Music Assistant Server
      |
      v
Media Players (Chromecast, Sonos, AirPlay, etc.)
```

## Tool Functions

### `play_media`

Searches for and plays music on a target player.

```json
{
  "query": "Abbey Road by the Beatles",
  "player_id": "media_player.kitchen_speaker",
  "media_type": "album"
}
```

Supported `media_type` values: `track`, `album`, `artist`, `playlist`, `radio`.

### `playback_control`

Controls playback state.

```json
{
  "player_id": "media_player.kitchen_speaker",
  "action": "pause"
}
```

Supported actions: `play`, `pause`, `stop`, `next`, `previous`.

### `set_volume`

Sets volume level on a player.

```json
{
  "player_id": "media_player.kitchen_speaker",
  "volume_level": 0.6
}
```

### `queue_add`

Adds a track, album, or playlist to the current queue.

```json
{
  "player_id": "media_player.kitchen_speaker",
  "query": "Bohemian Rhapsody",
  "media_type": "track"
}
```

### `get_now_playing`

Returns the currently playing track, artist, album, and playback state.

```json
{
  "player_id": "media_player.kitchen_speaker"
}
```

### `get_players`

Lists all available media players.

```json
{
  "players": [
    { "player_id": "media_player.kitchen_speaker", "friendly_name": "Kitchen Speaker", "state": "playing" },
    { "player_id": "media_player.living_room", "friendly_name": "Living Room", "state": "idle" }
  ]
}
```

## Example Interaction

```
User: "Play some chill music in the living room"

Orchestrator -> MusicAgent (A2A)

MusicAgent:
  1. Resolves "living room" -> media_player.living_room
  2. Searches Music Assistant for "chill music" (playlist/radio)
  3. Calls play_media with query="chill", media_type="playlist"
  4. Responds: "Now playing Chill Vibes playlist on Living Room."
```

## Deployment

The Music Agent runs as a separate container alongside the Lucia Agent Host. Add it to your `docker-compose.yml`:

```yaml
services:
  lucia-music-agent:
    image: seiggy/lucia-music-agent:latest
    container_name: lucia-music-agent
    restart: unless-stopped
    ports:
      - "7240:8080"
    environment:
      - MusicAssistant__Url=http://music-assistant:8095
      - Lucia__AgentHostUrl=http://lucia:8080
```

:::info
The Music Agent requires a running [Music Assistant](https://music-assistant.io/) instance. See the Music Assistant documentation for setup instructions.
:::

## Configuration

After deployment, the Music Agent registers itself with the orchestrator via its A2A Agent Card. You can verify the connection from the [Agents](/docs/dashboard/agents-page) page in the dashboard.

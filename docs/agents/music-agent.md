---
sidebar_position: 5
title: Music Agent
---

# Music Agent

The Music Agent controls media playback through [Music Assistant](https://music-assistant.io/), a dedicated music server that integrates with Home Assistant. It runs **in-process** inside the AgentHost, like all other core agents.

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
Lucia AgentHost (in-process)
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

Orchestrator -> MusicAgent (in-process)

MusicAgent:
  1. Resolves "living room" -> media_player.living_room
  2. Searches Music Assistant for "chill music" (playlist/radio)
  3. Calls play_media with query="chill", media_type="playlist"
  4. Responds: "Now playing Chill Vibes playlist on Living Room."
```

## Configuration

The Music Agent runs in-process inside the AgentHost. Configure Music Assistant connection details through the AgentHost's environment variables or configuration file:

```yaml
environment:
  - MusicAssistant__Url=http://music-assistant:8095
```

:::info
The Music Agent requires a running [Music Assistant](https://music-assistant.io/) instance. See the Music Assistant documentation for setup instructions.
:::

You can verify the Music Agent is active from the [Agents](/docs/dashboard/agents-page) page in the dashboard.

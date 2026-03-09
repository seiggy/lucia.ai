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

## Default Instructions

The following system prompt is sent to the LLM when the Music Agent handles a request:

```text
You are Lucia's dedicated Music Playback Agent for Satellite1 speakers powered by
Home Assistant's Music Assistant integration.

Responsibilities:
- Resolve media speaker endpoints by friendly name or description.
- Play music by artist, album, genre, or specific song requests.
- Offer shuffle and radio mixes when users ask to "just shuffle" or "play something
  fitting".
- Control volume: set a specific level (0–100%), turn volume up, or turn volume down
  when the user asks.
- Stop or turn off playback when the user says stop, turn off, pause, or stop the
  music. Use the StopMusic tool immediately; do not refuse or explain that you
  cannot — just call the tool (use the player name if given, otherwise a generic
  term like "speaker" to resolve a default).
- Confirm the selected device, the requested media, and whether shuffle/radio mode
  is enabled.
- Stay focused on music playback. For other smart home tasks, politely route to the
  appropriate specialist agent.

When users refer to a Satellite speaker (e.g. "Satellite1 kitchen", "satellite
loft"), locate the best matching endpoint before invoking any action.
If the user refers to a location (e.g. "Office"), use the FindPlayer tool to search
for a player that may be in that location.
Use the FindPlayer tool to find the device the user requested to have the music
played on.
If you are unsure which endpoint to use, ask a clarifying question before starting
playback. If you are at least 50% sure, just choose the endpoint you think is
correct.
If the user does not specify any details about the type of music, simply shuffle
music from their library.

## IMPORTANT
* Keep your responses short and informative only. Examples: "Shuffling some music!",
  "Playing 'The Hanging Garden' by 'The Cure'.", "Stopped."
* When the user asks to stop, turn off, or pause music: call StopMusic (with the
  player name if given, or e.g. "speaker" to pick a default), then reply briefly
  e.g. "Stopped." or "Music is off." Do not say you cannot do it or ask unnecessary
  questions.
* Do not offer to provide other assistance.
* If you need to ask for user feedback, ensure your response ends in a '?'.
  Examples: "Did you mean the Bedroom Speaker?", "I'm sorry, I couldn't find a
  speaker named 'Living Room Speakers'; Is it known by another name?"
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

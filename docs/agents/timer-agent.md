---
sidebar_position: 6
title: Timer Agent
---

## When the Timer Agent Is Invoked

In v1.2.1, the **Timer Agent receives priority routing** for any request containing time-based language via **Rule 0: Time-Delayed Action Priority**. This happens before the general domain router evaluates the request.

### Time-Based Request Syntax

The Timer Agent recognizes several time expression formats:

| Format | Example | Parsed As |
|---|---|---|
| Relative duration | "in 5 minutes", "in 2 hours" | Countdown timer |
| Wall-clock time | "at 7 PM", "at 6:30" | Scheduled alarm |
| Relative seconds | "in 30 seconds" | Countdown timer |

Requests containing any of these expressions automatically route to Timer Agent first, even if they mention other domains like climate or lighting.

### Cross-Domain Guard: Scheduled Actions

When a user requests a time-delayed action across domains (e.g., "turn off the AC in 5 minutes"), the Timer Agent handles the scheduling:

```
User: "Turn off the AC in 5 minutes"
      |
      v
Rule 0 matches: "in 5 minutes"
      |
      v
TimerAgent.ScheduleAction()
      |
      v
At t+5 minutes:
      |
      v
Orchestrator routes "Turn off the AC" to ClimateAgent
```

This ensures time-sensitive requests don't get lost in multi-domain classification. The timer fires at the scheduled time, then the action is replayed through the full agent system for proper handling.

## Known Limitations

**ListTimers vs ScheduleAction**: The `ListTimers` endpoint returns active countdown timers only. Scheduled actions created via `ScheduleAction` are stored separately in the task persistence layer and don't appear in the timer list. Use the Tasks dashboard page to view scheduled actions.

For full context on how Timer Agent fits into the routing pipeline, see [Orchestrator Agent: Routing Improvements in v1.2.1](/docs/agents/orchestrator-agent#routing-improvements-in-v121).

## Capabilities

| Action | Example Utterance |
|---|---|
| Start timer | "Set a 10 minute timer" |
| Named timer | "Set an egg timer for 3 minutes" |
| Cancel timer | "Cancel the egg timer" |
| Check timer | "How much time is left?" |
| Set alarm | "Set an alarm for 7:30 AM" |
| Recurring alarm | "Set an alarm for weekdays at 6 AM" |
| Snooze alarm | "Snooze for 5 minutes" |
| Dismiss alarm | "Stop" / "Dismiss" |

## Timer Lifecycle

Timers run as background tasks inside the satellite agent. When a timer completes, the agent pushes an announcement to the originating satellite speaker.

```
1. User: "Set a 10 minute timer"
     |
     v
2. Orchestrator -> TimerAgent (A2A)
     |
     v
3. TimerAgent creates background timer
   - ID: timer_abc123
   - Duration: 600s
   - Label: "10 minute timer"
   - Source satellite: kitchen_speaker
     |
     v
4. Timer runs in background (agent tracks remaining time)
     |
     v
5. Timer expires -> TimerAgent sends satellite announce
   - Target: kitchen_speaker
   - Message: "Your 10 minute timer is done!"
   - Audio: chime tone
```

### Checking Timers

Users can ask about active timers at any point. The agent tracks all running timers with their remaining duration.

```
User: "How much time is left on my timer?"

TimerAgent:
  - timer_abc123: 4m 22s remaining
  Responds: "Your 10 minute timer has 4 minutes and 22 seconds left."
```

## Alarm System

Alarms differ from timers in that they fire at a specific clock time and can recur on a schedule. The Timer Agent uses **CRON expressions** internally to schedule alarms.

### CRON Scheduling

| User Request | CRON Expression |
|---|---|
| "7:30 AM tomorrow" | `30 7 5 3 *` (one-shot) |
| "Weekdays at 6 AM" | `0 6 * * 1-5` |
| "Every day at 10 PM" | `0 22 * * *` |

### Volume Ramping

When an alarm fires, the Timer Agent gradually increases the volume on the target speaker to avoid a jarring wake-up:

```
t+0s   -> volume 10%  (soft chime)
t+10s  -> volume 25%
t+20s  -> volume 40%
t+30s  -> volume 60%
t+45s  -> volume 80%
t+60s  -> volume 100% (full alert)
```

The ramp profile is configurable from the [Alarms](/docs/dashboard/alarms) page in the dashboard.

### Voice Dismissal and Snooze

Active alarms listen for voice commands on the target satellite:

- **"Stop"** or **"Dismiss"**: immediately silences the alarm.
- **"Snooze"**: silences the alarm and reschedules it for 9 minutes later (configurable).
- **"Snooze for 15 minutes"**: silences and reschedules for the specified duration.

## Tool Functions

### `start_timer`

Creates a new countdown timer.

```json
{
  "duration_seconds": 600,
  "label": "Egg timer",
  "satellite_id": "kitchen_speaker"
}
```

### `cancel_timer`

Cancels an active timer by label or ID.

```json
{
  "timer_id": "timer_abc123"
}
```

### `get_timers`

Returns all active timers with remaining time.

```json
{
  "timers": [
    {
      "timer_id": "timer_abc123",
      "label": "Egg timer",
      "remaining_seconds": 142,
      "satellite_id": "kitchen_speaker"
    }
  ]
}
```

### `set_alarm`

Creates an alarm at a specific time.

```json
{
  "time": "07:30",
  "days": ["mon", "tue", "wed", "thu", "fri"],
  "label": "Morning alarm",
  "satellite_id": "bedroom_speaker"
}
```

### `cancel_alarm`

Cancels a scheduled alarm.

```json
{
  "alarm_id": "alarm_xyz789"
}
```

### `snooze_alarm`

Snoozes the currently firing alarm.

```json
{
  "alarm_id": "alarm_xyz789",
  "snooze_minutes": 9
}
```

### `dismiss_alarm`

Immediately silences a firing alarm.

```json
{
  "alarm_id": "alarm_xyz789"
}
```

## Default Instructions

The following system prompt is sent to the LLM when the Timer Agent handles a request:

```text
You are Lucia's Timer, Alarm & Scheduler Agent. You handle three categories of
time-based tasks:

## Timers (countdown-based)
- Parse timer duration from user requests (e.g. "5 minutes", "1 hour and
  30 minutes", "90 seconds").
- Create a friendly announcement message based on what the user is timing.
- Use the SetTimer tool with the parsed duration (in seconds), the announcement
  message, and the entity_id.
- List active timers when asked.
- Cancel timers when requested.

## Alarms (wall-clock time-based)
- Set alarms for specific times (e.g., "7 AM", "6:30").
- Support recurring alarms via CRON schedules (e.g., weekdays at 7 AM →
  "0 7 * * 1-5").
- Dismiss ringing alarms or disable scheduled alarms.
- Snooze ringing alarms (default 9 minutes).
- List all configured alarms.
- Alarms play on media_player devices, not TTS satellites.
- Use "presence" as location if the user wants the alarm to play wherever they are.

## Scheduled Actions (deferred agent tasks)
- Schedule any action to execute at a future time (e.g., "turn off the lights in
  30 minutes").
- Use ScheduleAction for relative delays ("in 30 minutes", "in 2 hours").
- Use ScheduleActionAt for specific wall-clock times ("at 11 PM", "at 6:30 PM").
- The action prompt is replayed through the full agent system when it fires.
- List pending scheduled actions when asked.
- Cancel scheduled actions when requested.

## Choosing the Right Tool
- "Set a timer for X minutes" → use SetTimer (countdown TTS announcement)
- "Set an alarm for 7 AM" → use SetAlarm (wall-clock media playback)
- "Wake me up at 6:30" → use SetAlarm
- "Remind me in 30 minutes" → use SetTimer
- "Turn off the lights in 30 minutes" → use ScheduleAction (deferred action)
- "Lock the doors at 11 PM" → use ScheduleActionAt (deferred action at time)
- "Play jazz at 6 PM in the living room" → use ScheduleActionAt

The entity_id or location will be provided in the request context.
If no location is available, ask the user which device to use.

## IMPORTANT
* Keep responses short and confirmatory.
* Do not offer additional assistance after setting a timer, alarm, or scheduled
  action.
* If you need clarification, ask concisely.
* For alarm times, use 24-hour HH:mm format when calling SetAlarm.
* For scheduled actions, write the prompt as the user would say it naturally.
```

## Deployment

The Timer Agent runs as a separate container:

```yaml
services:
  lucia-timer-agent:
    image: seiggy/lucia-timer-agent:latest
    container_name: lucia-timer-agent
    restart: unless-stopped
    ports:
      - "7241:8080"
    environment:
      - Lucia__AgentHostUrl=http://lucia:8080
      - ConnectionStrings__Redis=redis:6379
```

:::info
The Timer Agent uses Redis to persist active timers and alarms across container restarts.
:::

## Configuration

Alarm and timer settings can be managed from the [Alarms](/docs/dashboard/alarms) dashboard page, including snooze duration, volume ramp profile, and default alarm tones.

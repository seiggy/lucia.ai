---
sidebar_position: 9
title: Security Agent
---

# Security Agent

The Security Agent controls Home Assistant alarm panels and locks, and reports the current state of configured security devices.

## Capabilities

| Action | Example |
|---|---|
| Arm an alarm | "Arm the house alarm" |
| Disarm an alarm | "Disarm the alarm with code 1234" |
| Lock a door | "Lock the front door" |
| Unlock a door | "Unlock the garage entry" |
| Check status | "Is the house secure?" |

The agent always queries Home Assistant before reporting state and only confirms an action after Home Assistant reports success. Alarm and unlock codes are passed through when supplied by the user.

## Supported Entity Domains

- `alarm_control_panel.*`
- `lock.*`
- Configured camera entities for status reporting

## Configuration

The **Security Control** section in the agent editor controls entity matching and the model assigned to `security-agent`. Use Home Assistant entity visibility controls to limit which security devices Lucia can access.

:::warning
Security actions are only as secure as the Home Assistant account and Lucia API key used by the integration. Protect both credentials and expose Lucia only on trusted networks.
:::

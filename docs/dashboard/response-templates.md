---
sidebar_position: 14
title: Response Templates
---

# Response Templates

Response Templates let you customize how Lucia responds to parsed commands. Instead of generic skill output, you can define custom templates that interpolate command details (entity name, action, area) into natural-sounding responses.

## Overview

When the **Conversation Command Parser** matches a voice command to a skill action (e.g., "turn on the kitchen lights" → LightControl + Toggle action), it consults the Response Templates to compose a response. Multiple templates per action create variety, since each request randomly selects one template to avoid repetitive outputs.

Access templates at **Settings → Response Templates** on the dashboard.

## Dashboard Page

The Response Templates page is organized by **skill** and **action** grouping. Features include:

- **Skill/Action navigation**: dropdowns pre-populated with registered command patterns
- **Template preview**: see how your template renders with sample values
- **Template editor**: textarea for multi-line template entry
- **Token insertion buttons**: click `{entity}`, `{action}`, or `{area}` to insert placeholders at cursor
- **CRUD operations**: add, edit, delete templates via dashboard
- **Random variant selection**: multiple templates per action rotate automatically

## Template Syntax

Templates use simple **placeholder interpolation** with three supported tokens:

| Token | Description | Example |
|-------|-------------|---------|
| `{entity}` | Friendly name of the target entity | "bedroom lights", "living room thermostat" |
| `{action}` | Human-readable action description | "turned on", "dimmed to 50%", "set to 72°F" |
| `{area}` | Area/room where action occurred | "kitchen", "master bedroom" |

### Basic Examples

**Light Control:**
```
{entity} in the {area} {action}.
```
Renders as: "Bedroom lights in the master bedroom turned on."

**Climate:**
```
I've {action} the thermostat to your preference.
```
Renders as: "I've set the thermostat to 72°F."

**Scene Activation:**
```
Activating the {action} scene in the {area}.
```
Renders as: "Activating the movie scene in the living room."

## Supported Skills & Actions

Templates are organized by **skill** and **action**. The dashboard query endpoint (`GET /api/conversation/patterns`) exposes all registered patterns:

### LightControlSkill

| Action | Example Tokens |
|--------|----------------|
| `light.toggle` | entity, action, area |
| `light.brightness` | entity, action (e.g., "set to 75%"), area |
| `light.color` | entity, action (e.g., "set to warm white"), area |

### ClimateControlSkill

| Action | Example Tokens |
|--------|----------------|
| `climate.set_temperature` | action (e.g., "set to 72°F"), area |
| `climate.set_humidity` | action (e.g., "set humidity to 45%"), area |
| `climate.set_mode` | action (e.g., "set to heating"), area |

### SceneControlSkill

| Action | Example Tokens |
|--------|----------------|
| `scene.activate` | action (e.g., "movie scene"), area |

## Adding & Editing Templates

1. Navigate to **Settings → Response Templates**
2. Select a **Skill** from the dropdown
3. Select an **Action** from the action dropdown
4. Enter your template in the textarea or use token buttons
5. Click **Preview** to see rendered output with sample values
6. Click **Save**

### Inserting Tokens

Use the token buttons (`{entity}`, `{action}`, `{area}`) to insert placeholders at your cursor position without typing errors. The buttons are aligned above the textarea for easy access.

## Default Templates

On first launch, Lucia automatically seeds **default templates** for all supported command patterns. These defaults are functional and ready to use:

- **LightControl**: "turned on", "dimmed", "set to warm white", etc.
- **ClimateControl**: "set to 72°F", "adjusted humidity", "changed to cooling mode"
- **SceneControl**: "activated the movie scene", "turned on the bedtime routine"

Feel free to customize or replace these with your own.

## Random Variant Selection

To create variety, define **multiple templates for the same action**:

```
Template 1: {entity} {action}.
Template 2: Done! I've {action} the {entity}.
Template 3: All set. {action} in the {area}.
```

Each time a command matches this action, the parser **randomly selects one template** to render. This prevents repetitive "X turned on" responses.

## API Integration

### CRUD Endpoints

Response templates are managed via REST API:

- **`GET /api/response-templates`**: List all templates
- **`GET /api/response-templates?skill={skillId}&action={action}`**: Filter by skill/action
- **`POST /api/response-templates`**: Create new template
- **`PUT /api/response-templates/{id}`**: Update template
- **`DELETE /api/response-templates/{id}`**: Delete template

### Request Format

```json
{
  "skillId": "LightControlSkill",
  "action": "light.toggle",
  "template": "{entity} in the {area} {action}."
}
```

### Template Rendering

When the parser matches a command, it:

1. Looks up templates for the matched skill/action pair
2. Randomly selects one template
3. Interpolates tokens with actual entity/action/area values
4. Returns the rendered string in the response

## Grouping by Skill

Templates are conceptually grouped by skill because each skill exposes different token availability:

- **LightControlSkill** provides entity names, brightness levels, colors
- **ClimateControlSkill** provides temperature, humidity, mode names
- **SceneControlSkill** provides scene names and area context

The dashboard's skill/action dropdown filters to show only relevant templates for each grouping.

## Seeding & Upgrades

- **First launch:** Default templates are seeded for all supported actions
- **Upgrade:** If new actions are added in a release, new default templates are seeded automatically
- **Customization:** Your custom templates are preserved across upgrades; only missing defaults are added

To reset to defaults, delete your custom templates and restart the application (defaults will be re-seeded if missing).

## Performance

Template rendering is extremely lightweight: simple string interpolation with negligible latency. The cost of parsing a command (< 50ms) dominates; template rendering adds microseconds.

## Examples

### Light Toggle with Personality

**Template:**
```
I've {action} {entity}.
```

**Parsed command:** `light.toggle` on "bedroom lights"

**Rendered:** "I've turned on the bedroom lights."

### Multi-Token Template

**Template:**
```
Setting {entity} in the {area} to {action}. This should feel perfect.
```

**Parsed command:** `light.brightness` on "ceiling lights" in kitchen, action = "70%"

**Rendered:** "Setting ceiling lights in the kitchen to 70%. This should feel perfect."

### Climate Control

**Template:**
```
Thermostat adjusted to {action}.
```

**Parsed command:** `climate.set_temperature`, action = "72°F"

**Rendered:** "Thermostat adjusted to 72°F."

## Tips

- **Keep it conversational**: avoid overly technical language; let the action speak
- **Use variety**: define 3-5 templates per action for natural conversational flow
- **Test with preview**: click Preview before saving to ensure tokens interpolate correctly
- **Area context**: including `{area}` gives users spatial awareness of what just happened
- **Action clarity**: descriptive actions (e.g., "set to warm white") are better than vague ones (e.g., "changed")

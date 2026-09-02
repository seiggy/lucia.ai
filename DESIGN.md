---
name: Lucia
description: A luminous domestic control room for private, inspectable home intelligence.
colors:
  lucia-cyan: "#3ecbcb"
  lucia-cyan-hover: "#2fb5b5"
  lucia-cyan-light-mode: "#1a9e9e"
  alert-gold: "#d4a44a"
  status-amber: "#f59e0b"
  deep-space: "#0d0b08"
  deep-space-surface: "#1a1610"
  frosted-cream: "#faf9f7"
  frosted-cream-text: "#e8e2d8"
typography:
  display:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "4rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
  title:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.06em"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
    fontSize: "0.88rem"
    fontWeight: 400
    lineHeight: 1.5
  button:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.5
rounded:
  control: "0.4rem"
  compact: "8px"
  card: "12px"
  panel: "14px"
  container: "16px"
  pill: "999px"
spacing:
  2xs: "0.375rem"
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  section: "4rem"
components:
  button-primary:
    backgroundColor: "{colors.lucia-cyan}"
    textColor: "#ffffff"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0.375rem 1.5rem"
  button-primary-hover:
    backgroundColor: "{colors.lucia-cyan-hover}"
    textColor: "#ffffff"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.lucia-cyan}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0.375rem 1.5rem"
  input-search:
    backgroundColor: "{colors.deep-space-surface}"
    textColor: "{colors.frosted-cream-text}"
    typography: "{typography.body}"
    rounded: "{rounded.compact}"
    padding: "0.5rem 1rem"
  card-glass:
    backgroundColor: "rgba(26, 22, 16, 0.6)"
    textColor: "{colors.frosted-cream-text}"
    rounded: "{rounded.card}"
    padding: "{spacing.lg}"
  chip-selected:
    backgroundColor: "{colors.lucia-cyan}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0.4rem 0.8rem"
---

# Design System: Lucia

## Overview

**Creative North Star: "The Domestic Control Room"**

Lucia is capable, technical, and operational without feeling industrial. Its public surfaces translate a private home-intelligence stack into a domestic control room: live routes, compact status language, observable systems, and clear actions sit inside a warm, approachable shell.

The material philosophy is an ambient command center. Luminous glass, floating surfaces, soft atmospheric gradients, and restrained motion create cinematic depth; the experience should not collapse into flat documentation styling. Dark mode is the primary expression, while light mode preserves the same layered hierarchy with frosted, warm surfaces.

**Key Characteristics:**
- Dark-first, warm-black environments with cyan routing signals and gold attention states.
- Translucent, blurred surfaces edged by low-contrast borders.
- Operational diagrams, traces, badges, and metadata presented as understandable household controls.
- Compact system labels paired with direct, high-contrast headings and readable body copy.
- Responsive compositions that simplify from multi-column control planes to single-column flows.

## Colors

The palette pairs cool system telemetry with warm domestic light across dark and frosted themes.

### Primary
- **Lucia Cyan:** The main routing signal for links, primary actions, shipped states, progress, and active system paths. Its darker light-theme counterpart maintains contrast on Frosted Cream.

### Secondary
- **Alert Gold:** A warm attention color for luminous borders, active nodes, sparkle accents, and domestic-light cues.
- **Status Amber:** Reserved for in-progress states, partial outcomes, and animated roadmap activity.

### Neutral
- **Deep Space:** The dark-mode canvas behind the control room.
- **Deep Space Surface:** The warmer raised surface used by cards, footer, and framed media.
- **Frosted Cream:** The light-mode canvas; it remains warm rather than paper white.
- **Frosted Cream Text:** The primary warm light text used over dark atmospheric surfaces.

### Named Rules

**The Signal Hierarchy Rule.** Lucia Cyan carries routing, links, progress, and supported states; Alert Gold marks attention, active playback, or in-progress work. Never swap their semantic jobs.

**The Warm Neutral Rule.** Use warm blacks and creams for structural surfaces; pure black and white are limited to contrast-critical details and embedded assets.

## Typography

**Display Font:** System UI (with Segoe UI and Roboto fallbacks)  
**Body Font:** System UI (with Segoe UI and Roboto fallbacks)  
**Label/Mono Font:** UI monospace (with SFMono-Regular, Menlo, Monaco, and Consolas fallbacks)

**Character:** A single system sans keeps setup and documentation familiar, while heavy, tight display type gives the homepage operational authority. Monospace is reserved for traces, prompts, metrics, and machine-readable output.

### Hierarchy
- **Display** (800, 4rem, 1.05): Hero statements; it contracts to 2.9rem below the main responsive breakpoint.
- **Headline** (700, 1.5rem, 1.25): Major section and documentation headings.
- **Title** (700, 1.25rem, 1.25): Cards, panels, and grouped control titles.
- **Body** (400, 1rem, 1.65): Explanations and documentation; supporting interface copy commonly tightens to roughly 1.4–1.5 line-height.
- **Label** (700, 0.75rem, 0.06em tracking, uppercase): Status, metadata, connectors, and compact system wayfinding.
- **Mono** (400, 0.88rem, 1.5): Trace consoles and request/response output.

### Named Rules

**The Operational Label Rule.** Uppercase, tracked labels are reserved for compact metadata, status, and system wayfinding—not paragraphs or promotional headings.

**The One Sans Rule.** Keep the system stack for display and reading roles; technical distinction comes from weight, scale, tracking, and the dedicated mono role rather than a decorative display face.

## Layout

The Docusaurus container supplies a centered 1140px working width and expands to 1320px on wide screens. Marketing sections use a recurring 4rem vertical rhythm; dense control-room modules sit within narrower 860–900px frames, while cards use fluid grids with 0.6–1.5rem gaps.

At 996px, two-column hero, architecture, demo, trust, and explanatory layouts collapse to one column, the hero centers its lead content, and dense architecture grids reduce to two columns. Roadmap cards collapse at 768px. Documentation heading sizes tighten again at 576px. Wide comparison data remains horizontally scrollable instead of compressing below legibility.

**The Control Plane Collapse Rule.** Preserve the sequence and relationships of operational content on small screens; convert columns and horizontal pipelines into stacked flows rather than shrinking controls until they become unreadable.

## Elevation & Depth

Depth is a hybrid of atmospheric color, translucency, blur, hairline borders, and diffuse shadows. Resting cards often use blur without a heavy shadow; framed media, active routing states, the hero graph, and tooltips receive stronger lift. Hover movement is slight—usually one or two pixels—so depth feels ambient rather than spring-loaded.

### Shadow Vocabulary
- **Ambient Card:** `0 8px 32px rgba(0, 0, 0, 0.2)` for a hovered dark glass card.
- **Framed Media:** `0 4px 24px rgba(212, 164, 74, 0.12), 0 8px 48px rgba(0, 0, 0, 0.4)` for screenshots and high-value visual evidence.
- **Hero Control Plane:** `0 20px 54px rgba(0, 0, 0, 0.38), 0 0 0 1px rgba(62, 203, 203, 0.08) inset` for the large orchestration surface.
- **Active Signal:** `0 0 0 1px rgba(255, 214, 143, 0.32) inset, 0 8px 24px rgba(255, 179, 71, 0.18)` for selected traces and active paths.
- **Floating Tooltip:** `0 14px 34px rgba(0, 0, 0, 0.3)` for transient explanatory overlays.

### Named Rules

**The Ambient Command Center Rule.** Major surfaces combine translucency, blur, a quiet border, and diffuse shadow; depth is cinematic and luminous rather than flat or hard-edged.

**The Responsive Lift Rule.** Use stronger shadow only for hierarchy, interaction, or evidence frames; ordinary surfaces establish depth through tint, border, and blur first.

## Shapes

The form language is softly technical. Compact controls begin near a 0.4rem radius; cards cluster around 10–14px; large containers use 16px; badges, progress tracks, and filter chips are fully pill-shaped. One-pixel translucent borders describe surface edges, while circles are reserved for status nodes, numbered steps, and binary comparison marks. Conversation bubbles may square one lower corner to indicate speaker direction.

## Components

### Buttons
- **Shape:** Compact rounded control corners, scaled proportionally for the large variant.
- **Primary:** Lucia Cyan fill, white text, bold system type, and generous horizontal padding.
- **Hover / Focus:** Hover darkens one cyan step; focus uses the browser/Docusaurus visible focus treatment. State changes use the 200ms fast transition.
- **Secondary / Outline:** Transparent at rest with a cyan border and label; it fills on hover.

### Chips
- **Style:** Fully rounded metadata capsules. Neutral chips use translucent white or Deep Space fills; selected chips use Lucia Cyan, while active signal chips use a translucent Alert Gold treatment.
- **State:** Selection is communicated by fill, border, and contrast together rather than color alone.

### Cards / Containers
- **Corner Style:** Soft 12px cards, with 14–16px for major panels.
- **Background:** Translucent Deep Space Surface in dark mode and translucent white over Frosted Cream in light mode.
- **Shadow Strategy:** Resting cards lead with border and blur; hover and evidence frames use the Elevation vocabulary.
- **Border:** One-pixel cyan or gold-tinted translucent stroke.
- **Internal Padding:** 1–1.5rem for cards; larger framing surfaces may use 2rem.

### Inputs / Fields
- **Style:** Eight-pixel corners, a one-pixel neutral emphasis border, Deep Space Surface fill in dark mode, and 0.5rem by 1rem padding.
- **Focus:** Shift the border toward Lucia Cyan and retain a visible outline rather than relying on glow alone.
- **Error / Disabled:** Preserve Docusaurus semantic behavior; disabled controls reduce opacity and stop pointer interaction.

### Navigation
- **Style:** A 3.75rem Docusaurus navigation bar uses body-weight system text, Deep Space Surface or Frosted Cream backing, and Lucia Cyan for hover and active links. At the framework breakpoint, links move into the native sidebar rather than becoming a custom compressed menu.

### Trace Console

The signature operational component combines a dark or frosted mono console, compact metric chips, an outcome panel, route chips, and a stepped execution timeline. Completed route stages turn cyan; the active stage turns gold; pending stages remain deliberately quiet. Transitions are short, while replay and dataflow motion may run longer to make system sequence legible.

## Do's and Don'ts

### Do:
- **Do** use Lucia Cyan for system flow and Alert Gold for attention so operational meaning remains stable.
- **Do** build major surfaces from tint, translucent border, blur, and selective diffuse shadow.
- **Do** preserve both dark and light expressions; Frosted Cream should retain the same depth hierarchy as Deep Space.
- **Do** stack dense diagrams and tables responsively while preserving their reading order and minimum legibility.
- **Do** honor reduced-motion preferences for decorative or repeating motion.

### Don't:
- **Don't** flatten cards, diagrams, and controls into undifferentiated documentation panels.
- **Don't** use hard offset shadows; they conflict with the incumbent ambient depth model.
- **Don't** use Alert Gold as a general-purpose link or primary-action color.
- **Don't** introduce a decorative display face; hierarchy comes from the incumbent system sans and mono pairing.
- **Don't** propagate the incumbent emoji and text-glyph icons as system primitives; future surfaces use the existing Lucide/SVG pattern instead.

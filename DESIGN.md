---
name: Lucia
description: A dusk garden under directional rain, anchored by one black frame holding the product's own record.
colors:
  garden: "#273532"
  garden-band: "#1d2927"
  garden-deep: "#111b1a"
  flower-black: "#080d0c"
  mist: "#dbe5dd"
  moss: "#8fc8b6"
  rain-blue: "#4ca4e8"
  rain-red: "#d75a4a"
  pollen: "#dfbd63"
  lucia-cyan: "#3ecbcb"
  lucia-cyan-light-mode: "#1a9e9e"
  alert-gold: "#d4a44a"
  status-amber: "#f59e0b"
  deep-space: "#0d0b08"
  deep-space-surface: "#1a1610"
  frosted-cream: "#faf9f7"
typography:
  display:
    fontFamily: "'Bricolage Grotesque', system-ui, sans-serif"
    fontSize: "clamp(4rem, 6.4vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "-0.04em"
  display-compact:
    fontFamily: "'Bricolage Grotesque', system-ui, sans-serif"
    fontSize: "clamp(3.25rem, 15.5vw, 4.6rem)"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "'Bricolage Grotesque', system-ui, sans-serif"
    fontSize: "clamp(2.8rem, 5vw, 5rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.035em"
  headline-compact:
    fontFamily: "'Bricolage Grotesque', system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 4.4rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.035em"
  title:
    fontFamily: "'Bricolage Grotesque', system-ui, sans-serif"
    fontSize: "1.45rem"
    fontWeight: 700
    lineHeight: 1.3
  title-large:
    fontFamily: "'Bricolage Grotesque', system-ui, sans-serif"
    fontSize: "1.55rem"
    fontWeight: 700
    lineHeight: 1.3
  lead:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.7
  body:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 700
    lineHeight: 1.4
  caption:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.08em"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace"
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  square: "0"
  leaf-corner: "1.5rem"
  leaf: "0 1.5rem 1.5rem 1.5rem"
  leaf-figure: "2.5rem 0.5rem 2.5rem 0.5rem"
  round: "50%"
  compact: "8px"
  card: "12px"
  container: "16px"
  pill: "999px"
spacing:
  xs: "0.45rem"
  sm: "0.65rem"
  md: "1rem"
  lg: "1.25rem"
  xl: "2rem"
  2xl: "4rem"
  section: "clamp(5rem, 9vw, 8rem)"
components:
  action-primary:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.flower-black}"
    rounded: "{rounded.leaf}"
    padding: "0.75rem 1rem 0.75rem 1.25rem"
    height: "48px"
  action-primary-hover:
    backgroundColor: "{colors.rain-blue}"
    textColor: "{colors.flower-black}"
  action-text:
    backgroundColor: "transparent"
    textColor: "{colors.mist}"
    height: "44px"
  action-text-hover:
    textColor: "{colors.rain-blue}"
  evidence-frame:
    backgroundColor: "{colors.flower-black}"
    textColor: "{colors.mist}"
    rounded: "{rounded.square}"
    padding: "0.75rem 0.75rem 0"
  trace-figure:
    backgroundColor: "{colors.flower-black}"
    textColor: "{colors.mist}"
    rounded: "{rounded.leaf-figure}"
  jump-nav:
    backgroundColor: "rgba(17, 27, 26, 0.92)"
    textColor: "{colors.mist}"
    typography: "{typography.label}"
    padding: "0.85rem"
  deployment-path:
    backgroundColor: "transparent"
    textColor: "{colors.mist}"
    padding: "{spacing.xl}"
    height: "19rem"
  ledger-row:
    backgroundColor: "transparent"
    textColor: "{colors.mist}"
    padding: "1.2rem 0"
  card-glass:
    backgroundColor: "rgba(26, 22, 16, 0.6)"
    textColor: "{colors.frosted-cream}"
    rounded: "{rounded.card}"
    padding: "1.5rem"
---

# Design System: Lucia

## Overview

**Creative North Star: "The Gravity Garden"**

Lucia's public face is a dusk garden seen from inside: green-gray air, a slow directional rain of blue and red hairlines, and one black frame holding a real capture of the product's own record. The garden is not decoration around the product — it is the medium the product hangs in. Every surface is a tone of the same damp green, every divider is a hairline, and the only object allowed to be genuinely opaque and black is the frame around real evidence. The world earns attention by making one thing solid in a field of atmosphere.

The system proves rather than illustrates. There are no feature cards, no invented diagrams, and no stock imagery; the two hero-weight images are unretouched captures of the Lucia dashboard, and their captions carry real counts. Density is editorial rather than dashboard-like: long hairline ledgers of steps, plugins, and deployment paths, each row separated by a single pixel instead of a container. Type carries the drama — Bricolage Grotesque set enormous, tight, and sub-one leading against small quiet body copy — so the layout itself can stay calm.

Motion is singular and physical. One authored moment exists: the hero's canvas rain, in which the pointer behaves as a mass that bends drops into an orbit and slings them back out. Everything else in the system moves in short 160–180ms state changes and a two-pixel lift. The documentation shell retains the earlier warm teal-and-amber glass expression; that world still ships and is legitimate, but the garden is the normative world for new marketing and landing surfaces.

**Key Characteristics:**
- A four-step green-black surface ladder, separated by tone and hairline rather than by cards or shadows.
- Blue and red rain that only ever appears as a stroke, a wash, or a canvas hairline — never as a fill.
- Self-hosted Bricolage Grotesque at 700/800 only, set huge with negative tracking and sub-one leading.
- Asymmetric "leaf" corner radii on controls and figures, against a hard-square evidence anchor.
- Real product captures as the only imagery, framed in flower-black and captioned with real numbers.
- One authored motion (the pointer-as-mass gravity field), gated by visibility and reduced-motion.

## Colors

A damp dusk-green environment lit by two cold rain signals, one warm moss, and a single grain of pollen.

### Primary
- **Rain Blue** (`{colors.rain-blue}`): The directional signal of the world. It draws the falling drops on the hero canvas, the diagonal rain washes across every section, the hairline under the jump nav, the petal mark after every h2, the trace figure's border, the hover wash on ledger rows and deployment paths, and the hover fill of the primary action. It is also the Infima primary on the landing page, so framework-rendered links inherit it.
- **Rain Red** (`{colors.rain-red}`): The counter-direction, deliberately rare — roughly one drop in five on the canvas, the mono step indices, the plugin row's leading mark, the evidence section's tilted arc, and one end of the closing gradient rules. It is a second weather, not an error color.

### Secondary
- **Moss** (`{colors.moss}`): The warm living edge. It carries the second line of the hero headline, the fact-list icons, the definition terms, the "Open guide" affordances, and — at 0.12 to 0.26 alpha — nearly every hairline arc and border in the garden. It is also the `::selection` background across the landing page.
- **Pollen** (`{colors.pollen}`): The single grain of warmth. It appears in exactly three roles: the focus ring, the handled-count in the hero caption, and the appliance mark. Nothing else earns it.

### Neutral
- **Mist** (`{colors.mist}`): The text and light of the world, and the fill of the primary action. Body copy steps down through an alpha ladder rather than through additional gray tokens.
- **Garden** (`{colors.garden}`): The default section floor — the lit air of the garden.
- **Garden Band** (`{colors.garden-band}`): One step deeper, used to set the evidence section apart from its neighbours without a border.
- **Garden Deep** (`{colors.garden-deep}`): The hero and plugin floor, and the page background behind the whole landing route.
- **Flower Black** (`{colors.flower-black}`): The anchor. Reserved for the frames that hold real product captures, the closing section, the footer, and the text sitting on a mist-filled control.

### Incumbent documentation shell
The docs, plugins, and roadmap surfaces still ship the earlier warm expression: **Lucia Cyan** (`{colors.lucia-cyan}`, with `{colors.lucia-cyan-light-mode}` for light mode) as the routing and link signal, **Alert Gold** (`{colors.alert-gold}`) for luminous borders and attention, **Status Amber** (`{colors.status-amber}`) for in-progress state, over **Deep Space** / **Deep Space Surface** in dark mode and **Frosted Cream** in light. Preserve it where it lives; do not blend it into a garden surface.

### Named Rules

**The Four Floors Rule.** Garden surfaces come from exactly four tones — flower-black, garden-deep, garden-band, garden. A new section picks one of the four. It does not invent a fifth tint, and it does not separate itself from its neighbour with a border when a tone change will do it.

**The Rain Never Fills Rule.** Rain blue and rain red exist only as 1px strokes, canvas hairlines, and washes at ≤0.34 alpha (section rain runs as low as 0.045). Neither color is ever a solid background, a button fill at rest, or a block of text. Their thinness is what makes them read as weather.

**The Pollen Grain Rule.** Pollen is punctuation, not a palette entry to spend. It marks focus, the one real number in the hero caption, and the appliance note. If a fourth pollen use appears on a surface, one of them is wrong.

**The Mist Ladder Rule.** Text below headline level is mist at descending alpha — 0.82 lede, 0.72 section body, 0.68 supporting copy, 0.62 row detail, 0.55 caption — and hairlines are moss at 0.12–0.26 or mist at 0.14–0.18. Reach for an alpha step before reaching for a new gray.

## Typography

**Display Font:** Bricolage Grotesque, self-hosted at weights 700 and 800 (with `system-ui` fallback)
**Body Font:** System UI (with `-apple-system`, Segoe UI, and Roboto fallbacks)
**Label/Mono Font:** UI monospace (with SFMono-Regular and Consolas fallbacks)

**Character:** A wide, slightly eccentric grotesque set enormous and tight against plain, quiet system prose. The display face does all the talking — 11 characters wide, leading below the cap height, second line indented into the first — while body copy stays deliberately unstyled so the captures and the numbers carry the credibility. Monospace is reserved for machine indices.

### Hierarchy
- **Display** (800, `clamp(4rem, 6.4vw, 6rem)`, 0.86, -0.04em): The hero headline only. Capped at 11ch so it breaks into stacked lines; its final line indents 0.52em and turns moss. Drops to `clamp(3.25rem, 15.5vw, 4.6rem)` below 768px with a 0.22em indent.
- **Headline** (700, `clamp(2.8rem, 5vw, 5rem)`, 0.95, -0.035em): The wide variant, used by the two section-intro h2s and capped at 12ch.
- **Headline Compact** (700, `clamp(2.5rem, 5vw, 4.4rem)`, 0.95, -0.035em): The same voice one step down, used by the plugin, evidence, and closing h2s. The evidence heading caps at 9ch.
- **Title** (700, 1.45rem, Bricolage): Step and card headings. Deployment cards run one step larger at 1.55rem.
- **Lead** (400, 1.05rem, 1.7): Section and closing body copy. The hero lede runs 1.08rem at a 35rem measure.
- **Body** (400, 1rem, 1.6): Row and step descriptions, capped at 54rem.
- **Label** (700, 0.82rem): Jump-nav links. Fact rows run 0.84rem at mist 0.68.
- **Caption** (0.78rem, 0.08em tracking, uppercase): The hero evidence caption rail. The trace figure caption uses the same size at weight 700 without uppercasing.
- **Mono** (400, 0.8rem): Zero-padded step indices only, in rain red.

### Named Rules

**The Two Weights Rule.** Only 700 and 800 exist as font files. Never specify another Bricolage weight, and never an italic — there is no face behind it, and the browser will synthesize a counterfeit.

**The Sub-One Leading Rule.** Display and headline set below 1.0 line-height (0.86 and 0.95) with negative tracking; body and lead never go below 1.5. The compression is reserved for the voice, never applied to reading copy.

**The Quiet Body Rule.** The system stack is not a fallback that lost — it is the deliberate second voice. Do not promote body copy to Bricolage to add emphasis; change size, alpha, or measure instead.

## Layout

The landing route runs full-bleed sections inside the Docusaurus container. The hero fills `calc(100vh - var(--ifm-navbar-height))` with `clamp(4rem, 8vw, 7rem)` of top padding; every following section uses `clamp(5rem, 9vw, 8rem)` of vertical padding. A sticky jump nav sits directly under the navbar at `top: var(--ifm-navbar-height)` with a 12px backdrop blur.

Composition is consistently asymmetric two-column: the hero is `minmax(19rem, 0.78fr) minmax(0, 1.22fr)` (copy narrower than evidence), section intros are `minmax(0, 0.72fr) minmax(20rem, 1.28fr)` with the heading capped at 12ch and the paragraph spanning both rows, and the evidence grid is `minmax(18rem, 0.7fr) minmax(32rem, 1.3fr)`. Gaps are fluid: `clamp(2rem, 4vw, 4rem)` in the hero, up to `clamp(2rem, 6vw, 6rem)` in the evidence grid.

Long content is a ledger, not a card grid. Steps use a `3.5rem 2.5rem 1fr` track (index, icon, prose) at 1.6rem vertical padding; plugin rows use `2rem minmax(9rem, 0.4fr) minmax(15rem, 1fr) 1.5rem` at 1.2rem; deployment paths are three equal columns with 2rem padding, a 19rem minimum height, and 1px vertical dividers between them.

Three breakpoints. At **1100px** the hero and evidence grids collapse to one column and the hero capture relaxes to 1440/760. At **768px** everything else folds: action rows become vertical stacks, the section intro linearizes, the step grid tightens to `2.5rem 2rem 1fr`, plugin rows drop to three tracks with the description spanning below, deployment paths become a stacked list with bottom dividers, the jump nav becomes horizontally scrollable, and the hero capture switches to a 4/3 crop anchored top-left. At **520px** the trace caption stacks.

**The Hairline Ledger Rule.** Repeating content is separated by 1px rules at mist 0.16, not by cards, backgrounds, or gaps. A row's only container is the line above and below it.

**The Reach Rule.** Interactive rows and controls hold real touch targets — 48px minimum on the primary action, 44px on text actions — even though the visual language is thin.

## Elevation & Depth

The garden is flat by construction. Depth comes from the four-tone surface ladder, 1px hairlines, and large out-of-frame arcs — thin ellipses (54rem × 28rem, rotated -11°) bleeding past the section edges, plus a 34rem ring in the hero — that suggest a space larger than the viewport without a single gradient panel. Two backdrop blurs exist: 12px under the sticky jump nav and 16px under the navbar.

Shadows are rationed to two elements, both of which hold real product captures. They are deep, soft, and entirely un-offset, so the frames read as objects resting in the garden's air rather than as UI chrome lifted off a page.

### Shadow Vocabulary
- **Evidence Anchor** (`box-shadow: 0 2.5rem 5.5rem rgba(8, 13, 12, 0.72)`): The hero capture frame. A large, very soft pool in flower-black.
- **Framed Capture** (`box-shadow: 0 30px 70px rgba(0, 0, 0, 0.3)`): The secondary trace figure in the evidence section.

The incumbent documentation shell keeps its own ambient vocabulary — `0 8px 32px rgba(0, 0, 0, 0.2)` on hovered glass cards and `0 4px 24px rgba(0, 0, 0, 0.3)` on screenshot containers — over translucent surfaces with 12px blur.

### Named Rules

**The Two Shadows Rule.** Only frames holding real product captures cast a shadow. Every other surface in the garden is flat and is separated from its neighbour by tone and hairline. A new shadow on a new element is a signal that the element should have been a hairline.

**The Zero-Offset Rule.** Depth is a pool directly beneath, never a hard offset slab. Both shadows have no horizontal offset and a blur several times their vertical drop.

## Shapes

Three corner registers, used for three different jobs, and they do not mix.

**Square (0)** is the evidence register: the hero capture frame is hard-cornered on all four corners, as are section bands, ledger rows, and the jump nav. Anything presenting an unretouched fact is square.

**Leaf (asymmetric)** is the interactive and figure register. The primary action carries `0 1.5rem 1.5rem 1.5rem` — one square corner at top-left, three generously rounded — so the control reads as a leaf rather than a pill. The secondary trace figure carries a larger diagonal variant, `2.5rem 0.5rem 2.5rem 0.5rem`. These asymmetries are the signature; a symmetric radius on a control breaks the world immediately.

**Round (50%)** is the botanical register: the large tilted arcs bleeding past section edges, the 0.35rem nav dot that rises on hover, and the petal mark appended after every h2 — a 0.72em × 0.32em ellipse in rain blue with a transparent left border, rotated -18° and lifted -0.35em, so each heading ends with a falling petal.

Borders are always exactly 1px: moss 0.12–0.26 for garden edges and arcs, mist 0.14–0.18 for ledger rules, rain blue 0.22 on the trace figure, rain red 0.16 on the evidence arc.

**The Leaf Corner Rule.** Controls and figures use asymmetric radii with one deliberately sharp corner; evidence frames stay square. Never apply a uniform radius to a garden control, and never round the corners of a frame holding a real capture.

## Components

### Buttons
- **Shape:** The leaf corner (`0 1.5rem 1.5rem 1.5rem`), 48px minimum height, asymmetric padding (`0.75rem 1rem 0.75rem 1.25rem`) that gives the square corner more room than the round ones.
- **Primary:** Mist fill with flower-black text at weight 800, a matching 1px mist border, and a 1rem inline arrow icon.
- **Hover / Focus:** Fill and border shift to rain blue with a 2px rise, over 180ms ease on color, background, and transform. Focus-visible draws a 3px pollen outline at 4px offset. The transition is removed entirely under reduced motion.
- **Text action (secondary):** No fill or border. Mist at weight 700, 44px minimum height, underlined at mist 0.35 with a 0.3em offset; on hover the text turns rain blue and the underline takes `currentColor`.

### Cards / Containers
The garden has no cards. Grouped content is a ledger row or a bordered column: transparent background, 1px mist 0.16 dividers, 1.2–2rem of vertical padding, and a hover wash of rain blue 0.08 (a left-to-right gradient on plugin rows, a flat tint on deployment paths, 180ms). The incumbent documentation shell retains its glass card — translucent Deep Space Surface at 0.6, 12px backdrop blur, 1px alert-gold border at 0.15, 12px radius, 1.5rem padding — for docs and plugin surfaces only.

### Navigation
- **Jump nav:** Sticky under the navbar, centered, on garden-deep at 0.92 with a 12px blur and a diagonal rain-blue hairline (0.34) laid across it via gradient. Links are 0.82rem at weight 700, mist 0.72, brightening to full mist on hover. A 0.35rem rain-blue dot fades and rises into place beneath the link on hover and focus (160ms). Below 768px the row scrolls horizontally rather than wrapping or collapsing.
- **Navbar:** The Docusaurus navbar is re-themed on this route only — garden-deep at 0.92, a 16px blur, a moss 0.14 bottom hairline, and mist link text.

### Evidence Frame (signature)
The anchor of the whole world. A flower-black `<figure>` with square corners, a 1px moss 0.2 border, 0.75rem of padding on three sides, and the Evidence Anchor shadow. It holds a real dashboard capture at a 1440/900 aspect, cropped `top left` so the product's own chrome stays readable; the caption rail beneath is a baseline-aligned row of uppercase 0.78rem text tracked 0.08em at mist 0.55, with the right-hand cell — a real measured count — in pollen. Below 1100px the crop relaxes to 1440/760; below 768px it becomes 4/3 and the caption stacks. Images are eager-loaded with explicit width/height.

### Hero Gravity Field (signature)
A full-bleed canvas behind the hero, `aria-hidden`, `pointer-events: none`, sitting at z-index -1 above the atmosphere layer. Between 45 and 190 drops (scaled to `width / 8`) fall under gravity proportional to their depth (0.32–1), drawn as tapered 1–1.4px strokes in rain blue, with roughly one in five in rain red.

The pointer is a mass, not a highlight. Within a bounded 340px radius the drop takes an acceleration of `1.7 × falloff²  × depth`, applied mostly tangentially (0.9 tangential to 0.45 radial) so drops curve into an orbit and slingshot back out instead of collapsing into a knot; inside 54px a repulsive core pushes them away so the orbit never closes. Velocity damps at 0.972/0.978 per frame and is capped at 16, tail length and stroke alpha both scale with speed (alpha `0.1 + depth×0.3 + min(0.34, speed×0.032)`), so the pointer's wake reads as a lit disturbance rather than a denser patch of the same gray. Scrolling adds a decaying horizontal lean.

It is honest about cost: the rAF loop is started and stopped by an `IntersectionObserver` with a 120px root margin, a `ResizeObserver` re-seeds on resize, device pixel ratio is capped at 2, pointer tracking is gated on `(pointer: fine)`, and `prefers-reduced-motion` renders exactly one static frame and never starts the loop — with a live listener so toggling the preference takes effect immediately.

**The One Field Rule.** The system carries exactly one authored motion. Everything else is a 160–180ms state transition and a ≤2px lift. A second ambient animation anywhere on a garden surface is a defect, not an enhancement.

### Browser Surfaces
Focus is a 3px pollen outline at 4px offset on every interactive element — actions, nav links, ledger rows, deployment paths. Selection is themed on the landing route: flower-black text on a moss background.

## Do's and Don'ts

### Do:
- **Do** build sections from the four garden tones and separate them with 1px hairlines (moss 0.12–0.26, mist 0.14–0.18) instead of borders-plus-cards.
- **Do** step body copy down the mist alpha ladder (0.82 → 0.55) rather than introducing new gray tokens.
- **Do** give controls and figures asymmetric leaf radii, and keep frames around real captures square.
- **Do** use real, unretouched Lucia dashboard captures as imagery, with real numbers in the caption rail and explicit width/height on every `<img>`.
- **Do** set display type huge, tight, and clamped to a character count so it wraps into stacked lines.
- **Do** gate any canvas work behind `IntersectionObserver`, cap device pixel ratio at 2, and render a single static frame under `prefers-reduced-motion`.
- **Do** keep the 3px pollen focus ring at 4px offset on every interactive element.
- **Do** draw icons as inline Lucide SVGs sized 1rem–2rem and marked `aria-hidden` when adjacent text carries the meaning.

### Don't:
- **Don't** fill any surface, button rest state, or text block with rain blue or rain red; they are stroke and wash colors only.
- **Don't** spend pollen beyond focus, the one real caption number, and the appliance mark.
- **Don't** request a Bricolage Grotesque weight other than 700 or 800, or an italic — no font file exists and the browser will synthesize one.
- **Don't** promote body copy to the display face for emphasis; change size, alpha, or measure.
- **Don't** add a shadow to anything that isn't a frame holding a real product capture, and never use a hard offset shadow — the depth model is a soft zero-offset pool.
- **Don't** add a second ambient animation to a garden surface; the gravity field is the only authored motion.
- **Don't** use uppercase tracked type outside figure captions and compact metadata labels; headings and prose are never set in caps.
- **Don't** blend the incumbent teal/amber glass shell into a garden surface, and don't swap the semantic jobs of Lucia Cyan (routing) and Alert Gold (attention) where that shell still ships.
- **Don't** propagate the incumbent emoji glyph icons from the roadmap component into new surfaces; they are a carried defect, not a system primitive — use inline Lucide SVGs.

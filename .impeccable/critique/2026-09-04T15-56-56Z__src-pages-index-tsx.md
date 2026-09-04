---
target: the new portal landing page
total_score: 21
max_score: 36
na_heuristics: 7
p0_count: 0
p1_count: 3
target_identity: "file:E:\\github\\lucia.ai\\src\\pages\\index.tsx"
target_fingerprint: "sha256:6580b0e504a00d3cdc6bab8aaecb7b502ba6c06569aa2505afc9f8ea102c03e3"
target_path: "E:\\github\\lucia.ai\\src\\pages\\index.tsx"
timestamp: 2026-09-04T15-56-56Z
slug: src-pages-index-tsx
---
Method: dual-agent (A: critique-a-design · B: critique-b-detector)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Step count and active node are clear; zoom/minimap/custom-agent impact feedback is weak. |
| 2 | Match System / Real World | 3 | Credible for self-hosters, but "SSE", "A2AHost", "Synthetic" land before any grounding. |
| 3 | User Control and Freedom | 2 | Pan/zoom/minimap recovery is icon-only; no "reset the map" after exploring. |
| 4 | Consistency and Standards | 2 | 35 tap targets under 44x44 at 390px; four distinct text sizes below 12px. |
| 5 | Error Prevention | 2 | Custom mode can be activated before its effect is understood; fast/custom read as crossed states. |
| 6 | Recognition Rather Than Recall | 2 | The visitor must assemble the story from ~18 hero controls instead of being walked through it. |
| 7 | Flexibility and Efficiency | n/a | Persuade surface, not a repeated workflow. |
| 8 | Aesthetic and Minimalist Design | 2 | Strong world, but hero control density fights the persuasion goal. |
| 9 | Error Recovery | 2 | Overview helps; nothing explains what changed after activation. |
| 10 | Help and Documentation | 3 | Docs links are present and relevant; inline term explanation is thin. |
| **Total** | | **21/36** | **Distinct and promising, but overloaded** |

Heuristic 4 was moved down from Assessment A's 3 to 2: the detector's tap-target and undersized-text
measurements are a standards failure the design review could not see by eye.

## Design Specificity Verdict

**LLM assessment:** Genuinely product-specific, not a reskinned SaaS hero. The green-gray field,
blue/red rain, curved routes, and black flow canvas deliver the direction contract, and the
fast-path/LLM-fallback split maps to real Lucia behavior. But the hero drifts from trajectory into
React Flow tool UI - the visitor operates a diagram before understanding why it matters. The
custom-agent story, which is the page's actual thesis, is carried by a small toolbar control labeled
"Preview EnergyAgent" and undercut by the word "Synthetic."

**Deterministic scan:** `src/pages/index.tsx` - 0 findings, exit 0. `build/index.html` - 23 findings
(3 low-contrast, 1 undersized-ui-text, 4 cramped-padding, 8 design-system-color, 1 design-system-font,
3 design-system-radius, 1 design-system-font-size, 1 dark-glow, 1 repeating-stripes-gradient).
In-page injected detector reported 36 anti-patterns. The real debt is `src/pages/index.module.css`:
89 findings (61 design-system-color, 16 design-system-font-size, 5 design-system-font,
7 design-system-radius) - the untriaged backlog from the redesign, now measured precisely.

**False positives:** the 3 low-contrast findings in `build/index.html` are wrong. Live computed
contrast passes everywhere: hero h1 13.60:1, cyan span 6.51:1, "Fast path" 10.35:1, phase rail labels
15.15:1, all 40 flow node labels 15.15:1, CTAs 9.91-16.68:1. The static scan mis-resolved cascade
colors at line 0.

**Visual overlays:** injection succeeded - mutation preflight passed, live server ran on port 8400,
`detect.js` executed in-page and logged `[impeccable] 36 anti-patterns found`. Server stopped.

## Overall Impression

The world is real and the architecture is honest - that is the hard part, and it is done. What is
broken is staging. The hero hands the visitor a control panel (mode switch + custom-agent toggle +
7 phase buttons + Previous/Overview/Next + zoom + minimap + sticky jump nav) and asks them to discover
the story. Biggest opportunity: turn the hero from an explorable map into a guided three-act sequence,
and demote exploration behind one "Explore full map" affordance.

## What's Working

1. **The visual world is authored, not assembled.** Directional rain, curved routes, and the black
   canvas anchor pass the interchangeability test - no other product could run this unchanged.
2. **The architecture earns technical trust.** Fast path vs. LLM fallback is real lucia-dotnet
   behavior, and the timing chips give evaluators something to check.
3. **Accessibility fundamentals are genuinely solid.** 18/18 hero interactives have accessible names,
   0 images missing alt, exactly one h1, zero heading-level skips, visible focus outlines on all 15
   first-tabbable elements, 0 console errors, 0 failed requests.

## Priority Issues

**[P1] The hero is over-controlled.**
- Why it matters: ~18 interactive elements compete in the first viewport. Visitors operate a diagram
  before they know why it matters. The phase rail alone breaks the 4-option rule at 7-8 buttons.
- Fix: Stage it as three acts - built-in route, activate EnergyAgent, changed trace, deploy. Move
  minimap, zoom controls, and the phase rail behind one "Explore full map" toggle.
- Suggested command: /impeccable distill

**[P1] The custom-agent proof reads as synthetic.**
- Why it matters: The page's whole claim is transparent, inspectable, real routing. "Synthetic
  EnergyAgent active" and "illustrative" hand a skeptical self-hoster a reason to discount everything
  else on the page.
- Fix: Use a real documented plugin/custom-agent example, or keep the demo but put real config/code/
  trace evidence adjacent to it.
- Suggested command: /impeccable clarify

**[P1] Text and touch fall below platform minimums.**
- Why it matters: 4 distinct sizes under 12px - phase rail buttons 11.2px, .flowMapLabel 10.88px,
  40 .flowNodeTiming labels 11.52px, .fieldStatus 11.52px. And 35 tap targets under 44x44 at 390px,
  including the navbar toggle at 30x30 and React Flow controls at 36x36.
- Fix: Floor functional text at 12px, raise the map label to 12px or drop it, and pad the phase rail,
  mode switch, and flow controls to 44px minimum touch height.
- Suggested command: /impeccable adapt

**[P2] Both lanes are always in the DOM.**
- Why it matters: All 40 flow node labels are present regardless of mode. Screen-reader users get a
  graph roughly twice the size of the one on screen, describing a route the visitor did not select.
- Fix: aria-hidden the inactive lane, and add a concise ordered trace list under the graph as the
  non-visual route narrative.
- Suggested command: /impeccable harden

**[P2] Reduced motion is only half-honored.**
- Why it matters: The shipped @media (prefers-reduced-motion: reduce) block covers Docusaurus
  transitions, .hero--primary, animated edge paths, and .primaryAction - but fitView and setCenter in
  index.tsx run duration: 750 with no guard. Separately, .hero--primary no longer matches the
  redesigned hero, so that rule is dead code.
- Suggested command: /impeccable animate

## Persona Red Flags

**Technical self-hoster (evaluating whether to run this):** "Synthetic EnergyAgent active" and
"illustrative" create doubt about what is real. Three equal-weight deployment cards - Docker Compose,
Kubernetes + Helm, systemd - give no recommended starting point at the exact moment they are deciding
to commit.

**First-time visitor (never heard of Lucia):** "New forces," "routing field," "A2AHost," "SSE," and
"Preview EnergyAgent" all arrive before anything answers "what is this and why trust it?"

**Keyboard / screen-reader user:** Focus indicators and accessible names are correct, but the exposed
route object model is double-size, and zoom/minimap recovery is visual-first with no keyboard
equivalent.

## Minor Observations

- Mode switch labels are 82x34 and 105x34 - under touch minimum, and adjacent, so mis-taps flip the
  entire narrative.
- .heroGrid overflows its parent by 8px at 390px (366 > 358), and .finalSection by 31px (421 > 390).
  Neither causes document-level scroll - scrollWidth equals innerWidth at both 390 and 1440.
- 4 cramped-padding findings on extensionSection, evidenceSection, deploymentSection, finalSection.
- "bricolage grotesque" fires as design-system-font: it is the shipped display face but is not in
  DESIGN.md typography, which still records the system-ui stack. DESIGN.md is stale against the build.
- The final CTA h2 (retitled to "Your home stays yours." during this run) carries cursor: crosshair -
  a page-level cursor leaking onto non-interactive text.
- The dashboard proof image lands late and is cropped on first arrival.

## Questions to Consider

1. What if activating EnergyAgent were the hero - one large act - instead of a control in a toolbar?
2. Should the map stay locked until the visitor finishes the guided story?
3. Does a proof-led page earn the right to use any synthetic agent at all?
4. What would make deployment feel appliance-safe rather than merely technically available?

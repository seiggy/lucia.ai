---
target: landing page of the portal
total_score: 22
max_score: 36
na_heuristics: 7
p0_count: 0
p1_count: 4
target_identity: "file:E:\\github\\lucia.ai\\src\\pages\\index.tsx"
target_fingerprint: "sha256:5f8d5dc744621b2aff568fcf5553467c174a7ae7ef30c3e32034d2352059bae8"
target_path: "E:\\github\\lucia.ai\\src\\pages\\index.tsx"
timestamp: 2026-09-02T14-03-09Z
slug: src-pages-index-tsx
closed: true
---
Method: dual-agent (A: `landing-design-review` · B: `landing-detector-review`)

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of System Status | 3 | The route replay communicates progress well; the hero graph lacks pause/context. |
| 2 | Match System / Real World | 3 | Household concepts are clear, but `AgentHost`, A2A, JSON-RPC, and observability jargon arrive too early. |
| 3 | User Control and Freedom | 2 | No pause for looping motion and no anchor navigation through the 9,396px page. |
| 4 | Consistency and Standards | 2 | Emoji and purple gradient headings diverge from the documented Lucide/SVG and cyan/gold system. |
| 5 | Error Prevention | 3 | Few risky interactions; repository-stat failures degrade safely. |
| 6 | Recognition Rather Than Recall | 2 | Ten sections, repeated agent inventories, and no page-level wayfinding increase recall load. |
| 7 | Flexibility and Efficiency | n/a | This persuasion surface has no repeat-task workflow to accelerate. |
| 8 | Aesthetic and Minimalist Design | 1 | Architecture and agent detail are repeated at equal weight instead of progressively disclosed. |
| 9 | Error Recovery | 3 | The only implemented data failure has a readable fallback, though coverage is narrow. |
| 10 | Help and Documentation | 3 | Contextual documentation links are frequent, but not branched by household versus self-hoster intent. |
| **Total** |  | **22/36** | **Acceptable — significant improvements needed** |

## Design Specificity Verdict

**Authored for Lucia, but structured like an exhaustive feature inventory rather than household persuasion.** The live route replay, real dashboard imagery, and dark cyan/gold control-room atmosphere are highly product-specific. The weakness is not generic styling; it is indiscriminate exposure. A household visitor gets the same AgentHost, A2A, JSON-RPC, telemetry, and twelve-card architecture depth as a technical evaluator.

**Deterministic scan:** the CLI found six `design-system-color` advisories in `src/pages/index.tsx:163-169`. All are defensible false positives: vendor brand colors for OpenAI, Microsoft, Anthropic, Google, Ollama, and OpenRouter—not Lucia UI tokens.

**Visual overlays:** injection succeeded at 1280×720 and **137 overlays are visible in the `[Human] Lucia landing critique` browser tab**. Most “AI palette,” glow, glass, and nested-card warnings are false positives against the explicitly documented Domestic Control Room direction. The useful signals corroborate the critique: repeated undersized functional/body text, nine long-line flags, three low-contrast marks, cramped comparison-table padding, and a layout-property animation. Mobile behavior was source-reviewed at the 996px breakpoint but could not be rendered because the browser canvas exposes no viewport control.

## Overall Impression

The first viewport is confident and memorable; the route replay is excellent proof. The page then spends too long proving engineering sophistication before resolving the household visitor’s core questions: Is it private, is it easy, and which installation path is for me? The biggest opportunity is to reorder and collapse, not add.

## What’s Working

1. **The interactive route replay is the strongest proof on the page.** It turns multi-agent routing from a claim into an observable outcome.
2. **Real dashboard screenshots build legitimate trust.** The `lucia.local` frame makes operational visibility tangible without fabricated customer proof.
3. **The visual world is distinct.** Warm-black glass, Lucia Cyan routing signals, and Alert Gold active states create a coherent domestic command-center identity.

## Priority Issues

### **P1 — The page buries the household promise beneath implementation detail**

**Why it matters:** Privacy and deployment reassurance appears after multiple architecture sections. First-timers encounter AgentHost, A2A, JSON-RPC, ChatCache, and the observability stack before the page earns trust.

**Fix:** Move the local-first / transparent / cloud-optional trust strip directly below the hero. Replace early implementation labels with household outcomes; keep the technical vocabulary inside the later architecture deep dive.

**Suggested command:** `/impeccable clarify`

### **P1 — Architecture is repeated instead of progressively disclosed**

**Why it matters:** The hero graph, request lifecycle, nine-agent list, route replay, and twelve-card architecture diagram repeat the same concept. This creates the page’s main cognitive and scroll burden.

**Fix:** Keep the hero graph and route replay. Remove the duplicate nine-agent inventory and collapse the deep architecture grid into a concise summary plus “Explore architecture.” Add compact anchors for Demo, Compare, and Install.

**Suggested command:** `/impeccable distill`

### **P1 — Repeating motion lacks meaningful reduced-motion behavior and user control**

**Why it matters:** Only the blinking cursor honors `prefers-reduced-motion`; the hero tour and ambient gradient continue indefinitely. This violates the documented design rule and can make the page unusable for motion-sensitive visitors.

**Fix:** Freeze the hero graph after `fitView`, disable ambient animation under reduced motion, and provide a visible pause control for the auto-tour.

**Suggested command:** `/impeccable harden`

### **P1 — Comparison detail is unavailable to keyboard and touch users**

**Why it matters:** “Partial” explanations live in tooltips triggered by non-focusable spans. Keyboard and mobile visitors cannot access the context required to trust the comparison.

**Fix:** Use focusable button triggers with visible focus states; expose details on tap and render them inline on narrow screens.

**Suggested command:** `/impeccable audit`

### **P2 — The visual system’s small details are inconsistent and sometimes illegible**

**Why it matters:** Bare emoji sit beside Lucide SVGs, every section repeats the same sparkle/gradient heading, purple enters outside the documented palette, and the rendered detector flags tiny metadata and low-contrast comparison indicators.

**Fix:** Replace decorative emoji with existing Lucide/SVG icons, reserve gradient headings for major peaks, return gradients to the documented cyan/gold range, and raise functional metadata to a readable floor.

**Suggested command:** `/impeccable polish`

## Cognitive Load

**Moderate-to-high: four checklist failures.** Single focus, minimal choices, recognition, and progressive disclosure fail. The dashboard picker exposes five peer options; the architecture section exposes twelve technical cards; nine agents are enumerated three times; and the page has no anchor navigation despite ten major sections.

The hero also introduces two installation paths—Appliance OS or your own server—without telling a first-time visitor which one to choose.

## Emotional Journey

The page opens with confidence, then drops into technical-diagram overload. Real dashboard evidence and the route replay recover trust, but dense architecture creates a second valley. Privacy reassurance and the simple three-step setup arrive too late. The closing “Boardroom Panic Index” is memorable, but mixing invented joke metrics with real GitHub data creates credibility whiplash at the final conversion moment.

## Persona Red Flags

**Jordan, first-timer:** The hero forks between Jetson and self-hosting without guidance. `v1.4.0` receives the same weight as privacy claims. Technical terms arrive before reassurance, and the primary privacy proof is buried deep in the page.

**Casey, distracted mobile visitor:** The source collapses columns at 996px, but the comparison table still requires horizontal scrolling and its details are hover-only. The long page has no jump navigation, while large diagrams and dashboard images increase the cost of reaching installation.

**Sam, keyboard/screen-reader user:** Comparison tooltip triggers are not focusable. Bare emoji may be announced as redundant content. Continuous motion has no complete reduced-motion path or pause control; several low-contrast and tiny-text overlays appear around comparison and closing metrics.

## Minor Observations

- The seven-provider layout likely leaves an uneven final row, though it remains understandable.
- Third-party brand colors are valid exceptions and should not be added to Lucia’s token palette.
- The “3–8s” Lucia latency needs hardware context and a sentence framing the privacy trade-off.
- The navbar lacks an Install/Get Started action once the hero CTA scrolls away.
- The joke statistics should be visually separated from factual repository statistics or removed from the conversion close.

## Questions to Consider

- If appliance simplicity is the flagship promise, should the first proof be a person controlling the home rather than an orchestration graph?
- Is the self-hoster truly a first-class landing-page journey, or should it be a clearly labeled secondary route?
- Does the humor at the end strengthen community personality enough to justify weakening factual trust?
- Which single architecture artifact would you keep if the page could only support one?

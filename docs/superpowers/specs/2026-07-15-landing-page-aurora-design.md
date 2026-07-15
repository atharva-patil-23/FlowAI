# Landing Page Redesign — "Aurora"

**Date:** 2026-07-15
**Status:** Approved design, pending implementation plan
**Mockup:** [Aurora, approved 2026-07-15](https://claude.ai/code/artifact/959ff62a-b627-4660-a373-caf86c22f0d4)

## Goal

Replace the current landing page with a premium, information-rich page that makes a
first-time visitor feel the product is unusually well made. Scroll-driven motion and
microinteractions carry that feeling; real product detail earns the trust.

The current page ([client/src/pages/LandingPage.jsx](../../../client/src/pages/LandingPage.jsx))
is a single 150-line file with three sections: hero, three feature cards, footer. It tells
roughly a third of the product's story and contains one factual overclaim.

## Scope

**In scope:** the `/` route only.

**Not in scope:** login, signup, dashboard, inbox, project detail, settings. These keep the
existing red glassmorphic look. The visual shift on clicking "Start with AI" is a known,
accepted seam — decided 2026-07-15.

**Non-goals:** pricing page, blog, testimonials, logo wall, dark/light theming of the landing
page (Aurora deliberately commits to one world), any backend change.

## Chosen direction

Aurora, kept pure — no blending from the other three mockups. Deep space ground, an aurora
that reacts to scroll velocity and pointer, editorial serif display against a clean sans body,
and a single warm accent reserved for calls to action.

Rejected: Ember (safe but not distinctive enough), Editorial (premium but not fun), Kinetic
(most memorable, but "fun" fights "premium").

## Design system

Tokens are scoped to `.landing-root` — **never** `:root`. The dashboard reads the global
tokens in `client/src/index.css` and will break if they change.

### Color

| Token | Value | Role |
|---|---|---|
| `--void` | `#06070f` | Ground |
| `--void-2` | `#0b0d1a` | Raised surfaces |
| `--jade` | `#4ade80` | Aurora band, eyebrows, live indicators |
| `--indigo` | `#818cf8` | Aurora band, Medium priority, spotlights |
| `--magenta` | `#e879f9` | Aurora band, code strings |
| `--coral` | `#ff6b4a` | **CTAs and High priority only** — the single warm note |
| `--ice` | `#eceefb` | Primary text |
| `--haze` | `#9aa0c4` | Secondary text (indigo-biased, deliberately not neutral grey) |
| `--haze-dim` | `#7d82ad` | Captions, mono labels |

Coral is the page's one piece of boldness. It never appears as decoration — only where we
want a click, or to mark a High priority. Everything else stays cool.

### Type

No webfonts. Font CDNs are blocked in the artifact sandbox and a silent fallback is worse than
a considered system stack. All three faces ship with macOS/iOS and degrade sensibly elsewhere.

- **Display** — `"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif`
  at weight 400, `letter-spacing: -.02em`. Used for `h1`/`h2` and FAQ summaries.
- **Body** — `"SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif`.
- **Utility** — `ui-monospace, "SF Mono", Menlo, Consolas, monospace` for eyebrows, labels,
  captions, and the JSON specimen.

Running text stays near 62ch. Headings get `text-wrap: balance`. Uppercase mono labels carry
`.22em` letter-spacing. Digits that stack in columns use `font-variant-numeric: tabular-nums`.

### Motion

Motion is scroll-driven and physical, never decorative:

- **Aurora** — canvas ribbons whose turbulence and opacity rise with scroll velocity, with a
  slow drift toward the pointer.
- **Hero** — line-by-line mask reveal on load.
- **Sections** — a 30px rise with opacity, staggered ~80ms within a group, fired once by
  IntersectionObserver and then unobserved.
- **Buttons** — magnetic; they lean up to 5px toward the cursor and spring back.
- **Task cards** — a cursor-tracked indigo spotlight via a radial gradient on `::before`.
- **Counters** — count up on entry with a cubic ease-out.
- **Nav** — condenses into a glass bar past 24px of scroll.

Every one of these is disabled under `prefers-reduced-motion: reduce`, where the aurora canvas
is removed entirely and all reveals resolve to their final state.

## Page structure

Eleven sections, up from three. Order matters: the signature moment lands before any argument.

1. **Nav** — sticky, condenses on scroll.
2. **Hero** — headline, sub, two CTAs.
3. **Generator stage** — *the thesis*. A goal types itself, a beam pulses, six task cards
   assemble with stagger. Replayable. Runs once when scrolled into view.
4. **Stats** — four figures: 8 tasks per prompt, 30s ceiling, 3 priority levels, 0 refreshes.
5. **The loop** — three numbered beats. Numbering earns its place: this is a true sequence.
6. **Generation** — the differentiator, beside the real JSON shape Claude returns.
7. **Realtime** — two devices, one socket.
8. **Inbox** — cross-project assigned list.
9. **Task anatomy** — the six fields a task actually holds.
10. **Access** — owner/editor/viewer, private by default.
11. **FAQ → CTA → footer**.

## Copy accuracy

Every claim must be checkable against the code. This is a design requirement, not a detail —
a premium page dies on one visible lie.

**Fix required.** The current page claims *"Every task lands with priority, due date, and
tags."* The AI does not generate due dates: the Zod schema at
[server/controllers/aiController.js:8-17](../../../server/controllers/aiController.js#L8-L17)
returns `title`, `description`, `priority`, and `tags` only. Due dates are set by hand.

The new FAQ leads with this admission. Owning the limit reads as more confident than the
overclaim does.

Claims and their sources:

| Claim | Source |
|---|---|
| 1–8 tasks per prompt | `aiRoutes.js` validation |
| 30-second generation ceiling | `aiController.js` AbortController timeout |
| High / Medium / Low | `task.model.js` priority enum |
| Todo / In progress / Completed | `task.model.js` status enum |
| Up to 6 lowercase tags | `aiController.js` prompt + slice |
| Claude sees only goal + project title/description | `aiController.js` prompt construction |
| Owner / editor / viewer | `Project.model.js` collaborators enum |
| Private by default | `Project.model.js` visibility default |
| Nothing saves until you choose | Generation returns suggestions; no write |
| Realtime over sockets | `lib/socket.js`, `useProjectRealtime.js` |

## Architecture

`LandingPage.jsx` currently does everything in one file. The new page is far larger, so it
composes small, focused components instead. Each owns one section, takes no props beyond its
content, and can be read without holding the rest of the page in your head.

```text
client/src/pages/LandingPage.jsx          composes sections, owns the body-theme effect
client/src/styles/landing.css             tokens scoped to .landing-root, section styles
client/src/components/landing/
  AuroraCanvas.jsx      canvas ribbons; scroll velocity + pointer drift
  Starfield.jsx         static star layer, redrawn on resize
  LandingNav.jsx
  Hero.jsx
  GeneratorStage.jsx    the signature demo; owns its own sequence state
  StatsRow.jsx
  LoopSection.jsx
  FeatureRow.jsx        reusable: generation, realtime, inbox, access
  TaskAnatomy.jsx
  FaqSection.jsx
  ClosingCta.jsx
  LandingFooter.jsx
  hooks/
    useReveal.js        IntersectionObserver → .in, fires once
    useCountUp.js       rAF counter, starts on entry
    useMagnetic.js      pointer-lean, fine pointers only
    useScrollVelocity.js  shared velocity signal for the aurora
```

`FeatureRow` is used four times with different content and an optional `flip` to alternate
sides. The three hooks are the only shared behaviour; keeping them separate from the canvas
means the canvas can be tested and tuned on its own.

### The body background problem

`client/src/index.css` sets a fixed red radial gradient on `body` inside `@layer base`. It is
global, so the landing page cannot simply paint over it without also affecting other routes.

**Approach:** `LandingPage` toggles a class on mount and removes it on unmount.

```js
useEffect(() => {
  document.body.classList.add("landing-theme");
  return () => document.body.classList.remove("landing-theme");
}, []);
```

```css
body.landing-theme { background-color: #06070f; background-image: none; }
```

This keeps the change reversible, scoped to the route's lifetime, and leaves `index.css`'s
base layer untouched. Navigating to `/signup` restores the red ground automatically.

Rejected alternatives: editing the `@layer base` body rule (breaks every other route);
`body:has(.landing-root)` (works, but couples the stylesheet to DOM structure and is harder to
reason about than an explicit effect).

### Canvas performance

- Render the aurora at `0.3` scale and blur it up with a CSS `filter` — cheap, and blur hides
  the low resolution entirely.
- One `requestAnimationFrame` loop, four ribbons, 40 segments each.
- **Pause the loop when the tab is hidden**, and only then. An earlier draft of this spec also
  called for pausing once the user scrolled past the fold; that was wrong. The canvas is
  `position: fixed` and every section below it is translucent, so the aurora is genuinely
  visible for the full length of the page — stopping it on scroll would visibly freeze the
  ribbons mid-motion. A hidden tab is the only moment nobody is looking.
- Skip pointer drift on coarse pointers.
- Never mount the canvas at all under `prefers-reduced-motion`.

## Accessibility

- FAQ uses native `<details>`/`<summary>` — keyboard and screen-reader support for free.
- All interactive elements get a visible `:focus-visible` ring in jade at 2px/3px offset.
- Decorative canvases are `aria-hidden` and pointer-events: none.
- Contrast, measured against `--void` rather than assumed:

  | Pair | Ratio | Grade |
  | --- | --- | --- |
  | `--ice` on `--void` | 17.41 | AAA |
  | `--jade` on `--void` | 11.53 | AAA |
  | `--haze` on `--void` | 7.85 | AAA |
  | `--coral` on `--void` | 7.13 | AAA |
  | `#180402` on `--coral` (button label) | 7.05 | AAA |
  | `--haze-dim` on `--void` | 5.42 | AA |

  `--haze-dim` was originally `#5f6488`, which measured **3.51 — below the 4.5 AA floor** while
  being used for small mono captions. It was corrected to `#7d82ad` (5.42) in both the spec and
  the mockup. Any future dimming of this token must be re-measured, not eyeballed.
- The generator's replay control is a real `<button>`.

## Verification

The client has no test runner — `vitest` is configured in `server/` only, and adding a
front-end test setup is out of scope here. Verification is therefore manual plus the existing
static checks:

- `cd client && npm run lint` passes.
- `cd client && npm run build` passes.
- Drive the page in a browser and confirm: hero reveal fires on load; the generator runs once
  on scroll-in and replays on click; the aurora responds to fast scrolling; buttons lean toward
  the cursor; the nav condenses; counters count.
- Toggle "Reduce motion" at the OS level and reload — no canvas, no animation, all content
  present and readable.
- Navigate `/` → `/signup` → back, and confirm the red background returns and then leaves
  again cleanly. This is the regression the body-class approach is most likely to break.
- Check the dashboard still renders correctly, proving global tokens were untouched.
- Narrow to 375px and confirm nothing scrolls horizontally.

## Risks

- **Global token leakage.** The single largest risk. Any edit to `:root` or `@layer base` in
  `index.css` affects every screen. Mitigation: scope to `.landing-root`, verify the dashboard
  before landing.
- **Body class leaking across routes.** If the cleanup misses, other pages lose their red
  ground. Mitigation: the explicit unmount test above.
- **Canvas battery cost.** Mitigated by pausing offscreen and on tab hide.
- **Font stack on Windows/Linux.** Iowan Old Style is absent; the page falls back to Georgia,
  which is a genuinely good serif and holds the design. Acceptable.

# Hire-ready pass + visual system

**Date:** 2026-09-01
**Branch:** `redesign/hire-ready-and-visual-system`
**Commit:** `eca3f92`
**Changelog entry:** [0.2.0](../CHANGELOG.md#020--2026-09-01)

This is the reference doc for the design system introduced in that commit.
The changelog says *what* changed. This says *why*, and how to stay inside
the system when adding to the site.

---

## 1. Why the site needed this

Two separate problems, fixed in one pass.

**It did not work as a job application.** There was no CV to download, the
link preview pointed at a leftover file on someone else's bucket, and the
page showed no rate, hours, or timezone. Indeed runs on resumes. Upwork and
OnlineJobs.ph buyers filter on rate and availability before reading anything.

**It read as generated.** Measured in-browser: 44 distinct text styles across
16 font sizes, 33 frosted-glass surfaces, 8 corner radii, and the same
italic-accent headline device in all four sections. Every choice was
defensible alone. Together they were the median output of a generator.

---

## 2. The type system

### Faces

| Role | Family | Where it goes |
| --- | --- | --- |
| Display | **Archivo** | `h1`–`h4`, the wordmark. Run at `font-stretch: 112%`–`120%`. |
| Body | **Instrument Sans** | All running text. |
| Data | **JetBrains Mono** | Dates, metrics, tool names, eyebrow labels, the footer. |

Chosen for the galactic theme. A wide grotesque reads as observatory and
mission signage; a mono for every number reads as telemetry. Cormorant
Garamond was removed because an elegant Garamond is a wedding-invitation
face, and the subject is voice agents and n8n workflows.

Inter was removed because it is the AI-default face, named as such in the
2026 design press.

**Rule:** if a value is data — a date, a duration, a count, a tool name, a
licence number — set it in mono. That single habit does most of the work.

### Scale

Seven steps, all fluid via `clamp()`. One set of values covers 390px to
1440px, so there are no mobile-specific font-size overrides anywhere.

```css
--step-mono: 0.6875rem;                                    /* 11px  micro labels */
--step--2:   0.75rem;                                      /* 12px  captions, meta */
--step--1:   0.875rem;                                     /* 14px  secondary, bullets */
--step-0:    clamp(1rem,      0.97rem + 0.13vw, 1.0625rem); /* 16 → 17  body */
--step-1:    clamp(1.0625rem, 0.98rem + 0.36vw, 1.25rem);   /* 17 → 20  lead */
--step-2:    clamp(1.25rem,   1.07rem + 0.76vw, 1.625rem);  /* 20 → 26  h3 */
--step-3:    clamp(1.75rem,   1.29rem + 1.9vw,  2.75rem);   /* 28 → 44  h2 */
--step-4:    clamp(2.125rem,  1.42rem + 2.9vw,  3.5rem);    /* 34 → 56  h1 */
```

**Rule:** never write a raw font size. Use a step. Tailwind arbitrary values
like `text-[15px]` are how the old 16-size sprawl happened; if you need one,
write `text-[length:var(--step--1)]`.

### Utilities

- `.label-mono` — the uppercase mono micro-label. Use instead of hand-rolling
  `text-xs uppercase tracking-[0.3em]`.
- `.section-heading` — `--step-3`, 116% width, `max-width: 18ch`.

---

## 3. Surfaces — panels, not glass

The background is a soft nebula. When the panels were *also* soft, everything
mushed together and depth stopped meaning anything. Soft ground plus crisp
panel is the contrast that reads as designed.

A panel is: flat fill, one hairline border, and a 1px lit top rim, as if the
edge is catching starlight.

```css
--glass-bg: …;      /* panel fill */
--glass-border: …;  /* hairline */
--glass-shadow: …;  /* tight ambient shadow, not a glow */
--panel-rim: inset 0 1px 0 …;   /* the lit top edge */
--glass-blur: none;             /* switches off 29 backdrop-filters at once */
--navbar-blur: blur(20px) saturate(180%);
```

The token names still say `glass` so the 29 existing call sites did not need
touching. `--glass-blur: none` is the switch: set it back to a blur value and
the old treatment returns everywhere, which is a deliberate escape hatch.

**Blur is allowed in exactly two places:** the sticky navbar, which genuinely
overlaps scrolling content, and the three video play buttons.

**Rule:** new surfaces get `background: var(--glass-bg)`, `border: 1px solid
var(--glass-border)`, `box-shadow: var(--panel-rim), var(--glass-shadow)`.
No `backdrop-filter`.

---

## 4. Radii

Two tokens, plus real circles.

```css
--radius-pill:  999px;  /* controls: buttons, chips, pills */
--radius-panel: 14px;   /* surfaces: cards, panels, inputs */
```

Tailwind's `--radius-xl` is aliased to `--radius-panel` so `rounded-xl` stays
inside the system. `border-radius: 50%` is fine — that is a circle, not a
third guess at a corner.

---

## 5. Colour

One accent (`--accent`), and it has **one job: the thing you want clicked.**

Before, cyan was the eyebrow colour, the italic colour, the link colour, the
bullet dot, the icon colour, the hover border, and the timeline rail. When
one colour marks everything, it marks nothing. Structure and mono now carry
what colour used to.

---

## 6. Motion

One orchestrated entrance in the hero: staggered children, 12–20px rise.

Everywhere else, `opacity` only. The repeated 24px fade-up on roughly fifteen
elements was the Framer Motion default, and motion that never varies stops
being motion and becomes a loading delay.

Every animated component honours `useReducedMotion()`, including the hero deck
fan and the per-card scroll tilt: under reduced motion the fan transition is
instant and the tilt is held flat.

---

## 7. The one grid break

Everything on the page sits in a tidy centred column, except the project
demos. Those are a **deck fan** — a hand of cards, not a row:

- a wider container than the text measure (1440px vs 1200px)
- eight fixed slots; slots with no project yet show a "coming soon" card
- one card is at the front, the rest fan out left and right, tucked tighter
  the further out they sit, dimmed to 74% and scaled down
- the fan spread is measured from the real container width, so the outermost
  card never reaches under the arrow buttons

Navigation is overlay arrow buttons, dots, arrow keys, Home/End, and clicking
a background card. There is deliberately **no** scroll or wheel navigation: the
deck sits in the hero, so capturing the wheel would trap a visitor who only
wanted to scroll down the page.

It resets to a plain grid below 1100px, where it shows the real projects plus
a single "coming soon" card rather than the full eight slots.

**Rule:** this is the *only* grid break. A second one makes both of them
ordinary. If a future section wants to be special, it takes this one's place.

---

## 8. Copy rules

- Say what happens, not what it enables. "Voice agents that answer and
  qualify" beats "elevate customer experience".
- Banned: elevate, streamline, solutions, leverage, seamless, unlock.
- No emoji as design elements.
- The italic-accent headline device is used **once**, in the hero. Every other
  section heading is a plain statement.
- A button's label must match what it opens. "View Case Study" pointed at a
  YouTube video; it is now "Watch the Demo".

---

## 9. Verification method

Everything above was measured, not eyeballed. The audit walked the live DOM
in headless Chrome and counted computed styles:

- distinct `fontFamily | fontSize | fontWeight` triples
- every non-zero `borderRadius`
- every element with a non-`none` `backdropFilter`
- `document.documentElement.scrollWidth` vs `clientWidth` for overflow

Checked at 390 / 820 / 1440px in both themes. Repeat this before claiming a
future change did not regress the system.

---

## 10. Still open

Carried over from the audits; none of it is done.

1. **Images.** ~2.5MB of unoptimised JPEGs. No WebP, no `srcset`.
   `bg-dark.jpg` is 666KB and loads eagerly. Project images ship at 1280px
   and display at 366px.
2. **No third-party proof.** Zero testimonials, client names, or logos. Every
   trust signal is self-authored.
3. **Unattributed metrics.** "3.2x recovery lift" has no client, date range,
   or measurement note.
4. **The automation is never shown.** The proof is three YouTube videos
   totalling about 11 minutes. No workflow diagram, no before-and-after,
   nothing a visitor can poke.

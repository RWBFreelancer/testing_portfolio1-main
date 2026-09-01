# Changelog

Notable changes to the BinAI portfolio site. Newest first.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Dates are `YYYY-MM-DD`.

---

## [0.3.0] — 2026-09-01

Branch: `main`

The hero project row became a deck fan, so more than three projects fit. An
adversarial review of the new deck followed, and its findings are fixed here.

### Added

- Hero deck fan. Eight fixed slots, one card at the front, the rest fanned
  left and right. Replaces the three-column `.hero-project-grid`.
- `CardPlaceholder` — a "More work coming soon" card for a slot with no
  project yet. Slots 4-8 use it today.
- Overlay arrow buttons, a dot strip, a `NN / NN` counter, and an instruction
  line above the deck. Arrow keys, Home and End work on the deck itself.
- `useMediaQuery` hook. The fan positions are inline transforms, which a
  stylesheet cannot undo, so the fallback layout has to be a JS decision.
- The fan spread is measured from the real container width with a
  `ResizeObserver`, so eight cards fit at any width from 1101px up.

### Changed

- The deck card surface got its own `--card-bg` token, at 0.96 alpha instead
  of the shared `--glass-bg` at 0.82. The fan overlaps its own cards, and at
  0.82 the title of the card behind read through the card in front. Still not
  fully opaque, so the page ground still tints it. Panels elsewhere on the
  page do not overlap, so they keep `--glass-bg`.
- Project order: the Hyperlite LED Chatbot is third in the roster now, behind
  the two family-law voice agents.

### Removed

- Wheel and scroll navigation of the deck. It was built, then cut: the deck is
  in the hero, so capturing the wheel meant a visitor scrolling down the page
  had to flick seven times before the page moved. That is scroll-jacking.
- `useIdlePeek`. The sibling-peek mechanism it served was removed with the old
  grid, and the hook could no longer fire.
- `FlipCard`'s unused `entryDelayMs` prop and an empty `whileHover={{}}`.

### Fixed

Everything below came out of an adversarial review of the deck.

- The turned-away card face stayed in the tab order and the accessibility
  tree. `backface-visibility: hidden` hides a face on screen only. Both faces
  now take `aria-hidden` and `inert`, so keyboard focus never lands on an
  invisible "Watch the Demo" link and a screen reader stops reading every
  project twice.
- The deck used `role="listbox"` / `role="option"`, which forbids focusable
  descendants — and every card held a button and a link. It is now the
  `carousel` / `slide` roledescription pattern, with a polite live region that
  announces the card as it changes.
- The arrow buttons used `disabled`, so reaching either end of the deck threw
  focus to `<body>` and the next Tab restarted at the top of the page. They
  now use `aria-disabled` and stay focusable.
- An open card kept its YouTube video playing after the visitor scrolled away.
  An `IntersectionObserver` now closes the card when the deck leaves the view.
- `useScrollTilt` ignored `prefers-reduced-motion` entirely, and `FlipCard`
  read the preference once at module load, so it never noticed a change made
  mid-session. Both now go through `useReducedMotion()`, and the tilt is held
  flat when reduced motion is on.
- The dots were 9px targets — WCAG 2.2 asks for 24px — and the inactive dot
  measured 1.91:1 against the light ground, where 3:1 is the minimum. The
  painted dot is still 9px inside a 24px button, at full `--text-muted`.
- `CardBack` broke the type scale in five places (`text-[9px]`, `text-[10px]`,
  `text-[12px]`, `text-base`, `text-sm`) and set metric values and tool names
  in Archivo rather than mono. It now uses `--step-*` and `--font-mono`, and
  matches the card front it flips from.
- `CardBack` also used `--primary`, a second blue, so flipping a card changed
  the accent colour. It uses `--accent` and `.cta-primary` now.
- Two deck surfaces hard-coded `rgba(0, 102, 204, …)`, the light-theme blue,
  under a `var(--accent)` foreground. In dark theme the wash stayed blue while
  the icon went cyan. Both are `color-mix` on `--accent` now.
- At 1280px both arrow buttons overlapped the outermost card's tilted top
  corner by about 22px, and won on `z-index`, so a click aimed at the card
  stepped the deck instead. The reserved edge lane went from 76px to 140px,
  which clears the 60px button plus the 96px rotation swing.
- The card front's tagline could push the metrics past the card's clipped
  bottom edge with no scrollbar. It is capped at three lines.
- The stacked fallback below 1101px rendered all eight slots, which on a phone
  is about 2,700px of "coming soon". It now shows the real projects plus one
  placeholder.
- Clicking a background card to bring it to the front stopped working. The
  `inert` attribute added above keeps a hidden card out of the tab order, but
  it swallows clicks too. The click target is now a transparent overlay button
  that is a sibling of the inert wrapper, so the card is clickable while its
  content stays hidden from the keyboard and the screen reader. Hovering a
  background card now also shows a small "View" badge.
- A dead `@media (max-width: 1024px)` rule that restated the base rule.

---

## [0.2.1] — 2026-09-01

Branch: `redesign/hire-ready-and-visual-system`
Commit: `bfc14cb`

Polish pass on the contact section and the panel treatment, plus a contrast
audit that turned up three real failures.

### Fixed

- The two contact cards had different backgrounds. The form card still carried
  a hardcoded `rgba(255,255,255,0.52)` fill with a `!important` and an inline
  `boxShadow: none`, so it missed the panel fill, the lit rim and the shadow
  that the Book-a-Call card had. Both now share one shell.
- The Book-a-Call card was a two-column grid with the social icons bottom-right
  against a tall left column, which read lopsided. It is now a single column,
  same 820px width as the form card, with the links on a hairline rule below
  the button.
- Text contrast, measured by compositing every translucent layer down to the
  page ground:
  - dark `--text-muted` was 3.84:1 on a panel → `#8c9db5`
  - light `--primary`, used as a text colour via `text-primary`, was 3.17:1
    → `oklch(0.52 0.17 245)`
  - light `--text-muted` was 4.41:1 in the footer → `#55637a`
  All measured text now clears 4.5:1, or 3:1 for large type.
- Removed `!bg-background/50` from the three form fields; it was overriding the
  new `--field-bg` token.

### Added

- `.cta-primary` — the one loud control. Gradient fill, ink label, layered
  glow, and a specular sweep on hover that is disabled under reduced motion.
  Focus draws a real ring rather than reusing the hover shadow.
  `.site-navbar__cta` shares the rule, so every "Book a Call" matches.
- `--cta-from` / `--cta-to` / `--cta-ink` / `--cta-glow` tokens, per theme.
- `--panel-sheen` — one soft highlight falling from the top-left, layered over
  the panel fill on the project, experience, earlier-career and contact
  surfaces, so the whole page reads as lit by a single source.
- `--field-bg` token for inputs.

### Changed

- Panel fill raised for legibility: dark `0.66` → `0.78`, light `0.72` → `0.82`.
- `--glass-shadow` is now three layered stops instead of two, which reads as
  depth rather than as a dropped rectangle.
- Removed the old `::after` pill hack behind the CTA and two more dead
  `backdrop-filter` declarations.

### Verified

22 text styles, 9 font sizes, 4 blurred surfaces, radii still on token. No
console errors, no failed requests, no horizontal overflow at 390px or 1440px,
both themes.

---

## [0.2.0] — 2026-09-01

Branch: `redesign/hire-ready-and-visual-system`
Commit: `eca3f92`
Docs: [docs/2026-09-01-hire-ready-and-visual-system.md](docs/2026-09-01-hire-ready-and-visual-system.md)

Two jobs in one pass. First, make the site work as a job application on
Indeed, Upwork and OnlineJobs.ph. Second, give it a visual system, so it
stops reading as generated.

### Added

- `public/Reynaldo-Binay-an-CV.pdf` — downloadable CV. Indeed runs on
  resumes, and the site had none.
- `public/og-image.png` — a rendered 1200x630 link preview.
- `public/favicon.svg`, `public/robots.txt`, `public/sitemap.xml`.
- "Download CV" in the navbar and the mobile menu.
- Availability strip in the hero: status, hours, timezone, rate on request.
  These are the first three filters job-board buyers apply.
- Facebook Automation Specialist role (08/2025 - 06/2026), which was on the
  CV but missing from the site.
- Three Oracle Cloud AI certifications.
- A seven-step fluid type scale (`--step--2` through `--step-4`), sized with
  `clamp()` so one set of values covers 390px to 1440px.
- Two radius tokens, `--radius-pill` and `--radius-panel`.
- `.label-mono` utility for every piece of data on the page.

### Changed

- **Typefaces.** Inter and Cormorant Garamond out; Archivo (display, run at
  112-120% width), Instrument Sans (body) and JetBrains Mono (data) in.
- **Surfaces.** Frosted glass replaced with lit panels: flat fill, hairline
  border, 1px top rim. Glass survives on the navbar and the three video play
  buttons only.
- **Experience** split into recent automation roles plus a collapsed earlier
  career, so nine chronological cards no longer bury the automation work.
- **Education** rebuilt as a ruled credential register. The old equal-height
  card pair left ~150px of empty space in the shorter card.
- **Contact** left-aligned and single-column. The symmetric 1-3-1 layout had
  two tall empty rails, and the section out-measured the work.
- **Project demos** break the grid once: unequal column widths, wider than the
  text measure, each card set 44px lower than the last.
- **Motion.** The 24px entrance rise now runs in the hero only.
- **Headlines.** The italic-accent device appears once, in the hero, instead
  of in all four sections.
- Page metadata: real description, canonical URL, `og:url`, image dimensions.
- `ctaLabel` "View Case Study" renamed "Watch the Demo" — the link opens a
  YouTube video, not a case study.
- Hero copy rewritten off "elevate customer experience".
- `scroll-padding-top` / `scroll-margin-top` so anchored sections stop landing
  under the fixed navbar.
- Section padding trimmed; ~400px of dead vertical space removed.

### Removed

- The stale Open Graph image, which pointed at a Lovable preview file on a
  Cloudflare R2 bucket outside this project's control.
- Generator boilerplate page description.
- The "HI, I'M REY 👋" emoji badge.
- Fake `01 / 02 / 03 / 04` section numbering — the content is not a sequence.

### Fixed

- "Book a Call" was hidden below 640px, so phone visitors had to open the
  burger menu to book.
- Missing favicon caused a 404 on every page load.
- Freelance start date corrected to 01/2026, matching the CV.

### Measured

| | Before | After |
| --- | --- | --- |
| Distinct text styles | 44 | 22 |
| Font sizes | 16 | 9 |
| `backdrop-filter` surfaces | 33 | 4 |
| Corner radii | 8 | 2 + circles |
| Page height (1440px) | 7,032px | 5,753px |

Verified at 390 / 820 / 1440px in both themes: no console errors, no failed
requests, no horizontal overflow.

### Known gaps

- Images are still unoptimised JPEGs, about 2.5MB total. No WebP, no `srcset`.
  `bg-dark.jpg` alone is 666KB and loads eagerly.
- No testimonials, client names, or third-party proof anywhere on the site.
- Project metrics carry no attribution or measurement note.
- The site still shows no automation actually running — the proof is three
  YouTube videos totalling about 11 minutes.

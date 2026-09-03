# Changelog

Notable changes to the BinAI portfolio site. Newest first.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Dates are `YYYY-MM-DD`.

---

## [0.6.0] - 2026-09-03

Branch: `main`

Six projects instead of three, and every thumbnail is now a screenshot of the
real tool.

### Added

- Three project cards: **Field Service Voice Agent** (an after-hours voice
  agent for a mobile fleet and equipment repair company, client unnamed under
  NDA), **AI Marketing Department** (a marketing workspace built into a
  client's CRM, with the walkthrough video), and **Make.com Audit & Repair**
  (broken scenarios traced to their cause across several client accounts).
- `scripts/make-card-thumbs.mjs` - builds the six card thumbnails from the
  screenshots in Google Drive. Each entry names the crop, so the framing is
  recorded rather than remembered. Run by hand; only the WebP output is
  committed.
- A card with no recorded demo renders a still frame: no play button, and the
  corner badge says the demo is coming. A play button that opens nothing is
  worse than no play button. `Project.youtubeId` is optional to carry this.

### Changed

- Every project thumbnail is now a screenshot of the tool that does the work:
  the n8n workflows, the chatbot flow, the live Retell dashboard, the CRM
  workspace, the Make scenario list. The generated cyan illustrations are
  gone. They were decoration in a place where a visitor is looking for proof.
- The card assets are named after their project rather than `project-1..3`.
- The top three cards load eagerly, not just the first. On a wide screen the
  row is three across, and all three are above the fold.
- Card order groups the work: the three voice agents first, then the chat,
  CRM and repair jobs.

### Security

- The Make scenario list names the agency's own clients and the people who own
  each scenario. Those strips are blurred at full resolution before the image
  is scaled down, so there is no unredacted copy in the repo and nothing to
  recover from the shipped WebP. The run counts, data volumes, dates,
  connectors and live toggles stay sharp, and they are the part that is
  evidence.

---

## [0.5.0] - 2026-09-02

Branch: `main`

Card art and the share card, generated with fal.ai at build time.

### Added

- `scripts/fal-generate.mjs` - generates the decorative art with fal.ai
  (FLUX dev). Run by hand, never at build or at runtime: the visitor's browser
  must never call an image API. The key is read from the environment and is
  never written into this repo.
- `scripts/make-og.mjs` - renders `public/og-image.png` in headless Chrome
  over the site's own backdrop, using the real site fonts. Shot at 2x and
  resampled to 1200x630.

### Changed

- The three project thumbnails are cyan line-art illustrations in one shared
  style, replacing the text-on-gradient title cards. They also got smaller:
  14-18 kB each down to 8-10 kB.
- The play button sits bottom left instead of centred. Each illustration has
  one centred subject and a centred button landed straight on it - on the
  inbound card, a circle on a circle.
- The share card carries the new headline, the real site fonts, and the site's
  own nebula. It was still selling "that solve real bottlenecks" in a serif
  face that appears nowhere on the site. 971 kB to 91 kB.
- `index.html` meta and OG descriptions now say "small and medium businesses"
  rather than "real business bottlenecks".

### Changed

- The nebula backdrop drifts and breathes. Same image, no new bytes: the layer
  is oversized 7% on every side and animated with `transform` only, over a
  96s loop, with a colour-only bloom on `body::before` on a 37s loop. The two
  periods are not multiples of each other, so the pair never visibly repeats.
  Both are transform and opacity, so the compositor runs them on the GPU and
  the main thread never repaints. Off entirely under reduced motion.

### Fixed

- `#bg-layer` needed `max-width: none`. Tailwind Preflight sets
  `img { max-width: 100% }`, which clamped the oversized backdrop back to the
  viewport width and left a bare strip down the right edge. It was invisible
  while the layer was exactly 100% wide.

### Notes

Two things fal.ai was deliberately not used for.

Text: diffusion models garble letterforms, so anything carrying real words is
composed in a browser from real fonts instead.

Proof: no generated product screenshot, dashboard, client logo, testimonial,
or person presented as a client. That would fabricate evidence of work, which
is the credibility problem the card copy was rewritten to avoid. The two open
items that need real proof - third-party references, and footage of the
automations actually running - cannot be closed by an image model, and are
still open.

## [0.4.0] - 2026-09-02

Branch: `main`

A second adversarial review, run through three personas - an agency hiring
manager screening 40 portfolios, a non-technical business owner, and an HR
screener - returned a verdict of REHAUL on the deck fan. The fan showed one
readable card out of eight, five of which were empty placeholders, and it
needed a 27-word instruction line to explain itself. It is replaced by a
row of holo-tilt cards: every project side by side, readable with no clicks.

### Added

- `HoloDeck` - the project row. It renders `projects.length` cards. There is
  no fixed slot count and no placeholder, so a stranger never sees what has
  not been built yet.
- `StarField` - a canvas star field behind the row. One layer, not 90 DOM
  nodes. The loop stops when the hero leaves the viewport or the tab is
  hidden, and reduced motion gets one static frame and no loop.
- `useHoloTilt` - the hover effect. The card tilts up to 6.5 degrees towards
  the pointer, a nebula sheen tracks its position, a rim highlight rakes
  across, and the thumbnail slides the opposite way behind the frame. Every
  pointer-driven value is written to a CSS custom property on the element and
  batched into one animation frame, so a mouse move repaints but never
  re-renders. Mouse pointers only; touch and pen have no hover to leave.
- `ProjectCard` - one flat card, no flip. Automation type, title, Problem,
  Solution, tech stack. All of it visible at once.
- `DemoModal` - the demo player. The iframe mounts only while the dialog is
  open, so no YouTube code loads on first paint and closing really stops
  playback.
- A real hero call to action: **Book a Call** and **Download CV**, next to the
  availability row.
- `scripts/optimize-images.mjs` - resizes each asset to the largest size the
  layout can use and writes a WebP beside it. Run by hand, not at build time.

### Changed

- Project cards now carry `problem` and `solution` instead of metrics. The
  numbers claimed 3.2x, 100%, 95% and +62% with no client, date range or
  method behind any of them, so they are gone until they can be attributed.
- Demo videos open muted. The flip card autoplayed with sound on one click,
  which failed WCAG 2.1 SC 1.4.2 (Audio Control).
- Images are WebP and sized to the layout: 2448 kB of JPEG became 108 kB.
- The hero headline is now "I build AI systems for small and medium
  businesses." It names the buyer instead of describing the craft, so a small
  business owner can tell in one line that this is aimed at them.
- The light card is `rgba(244, 247, 252, 0.97)`, a cool paper tone, not pure
  white. A sheen laid over `#fff` has no tone to shift, so it reads as a stain
  rather than as light. `--card-bg` is used only by this card.
- The thumbnail is inset by a 10px frame instead of running flush to the card
  edge, with a radius of `calc(var(--radius-panel) - 10px)` so the inner and
  outer curves stay concentric. Flush, the video read as a picture pasted on
  the front; framed, it reads as a tile inside the panel.
- The sheen bloom is wider and gentler (520px, fading to 72%) and the rake
  spans 22%-78% instead of 38%-62%. A narrow hard band reads as a drawn line;
  a wide soft one reads as light.
- Card copy is grounded. The Problem lines no longer assert statistics about
  real clients that cannot be attributed ("half the calls were never logged",
  "buyers waited hours"). Each Problem now states the situation the work was
  built for, and each Solution names the real tools - Retell, GoHighLevel,
  n8n, QuickCEP, Shopify - because a named tool is checkable and an adjective
  is not.
- The holo hover colours are set per theme, not derived from `--accent`. On
  the near-white light card the old white rake was invisible and the pale
  wash only greyed the panel, which read as washed out. Light now gets a
  saturated blue bloom and a blue rake; dark is unchanged. Checked: body copy
  stays near 6:1 on the tinted panel.
- The hero states "Philippines" next to UTC+8. A timezone is a hint, not an
  answer, for a screener checking work location.
- `Project.metrics` is now optional. `Project.description`, `badge`,
  `ctaLabel` and `ctaUrl` are unread by the hero and marked as such.

### Removed

- `FlipCardGrid`, `FlipCard`, `CardFront`, `CardBack`, `CardPlaceholder`,
  the `useFlipCard` and `useScrollTilt` hooks, and the `FlipState` type.
- The arrow buttons, the dot strip, the `NN / NN` counter, and the
  instruction line. A pattern that needs a manual is the wrong pattern.
- The six source JPEGs, replaced by WebP.

### Fixed

- The card hover lift ignored `prefers-reduced-motion`. Every lift, zoom and
  drift in the row is now inside a `no-preference` query.
- Thumbnails shipped at 1280px into a 340px slot with no lazy loading. They
  now carry `sizes`, `decoding`, and lazy loading on all but the first card.

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

|                            | Before  | After       |
| -------------------------- | ------- | ----------- |
| Distinct text styles       | 44      | 22          |
| Font sizes                 | 16      | 9           |
| `backdrop-filter` surfaces | 33      | 4           |
| Corner radii               | 8       | 2 + circles |
| Page height (1440px)       | 7,032px | 5,753px     |

Verified at 390 / 820 / 1440px in both themes: no console errors, no failed
requests, no horizontal overflow.

### Known gaps

- Images are still unoptimised JPEGs, about 2.5MB total. No WebP, no `srcset`.
  `bg-dark.jpg` alone is 666KB and loads eagerly.
- No testimonials, client names, or third-party proof anywhere on the site.
- Project metrics carry no attribution or measurement note.
- The site still shows no automation actually running — the proof is three
  YouTube videos totalling about 11 minutes.

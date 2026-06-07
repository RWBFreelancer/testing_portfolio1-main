## Goal
Make the hero's cloudy sky background dissolve seamlessly into the page background instead of cutting off abruptly at the section boundary.

## Changes

### 1. `src/styles.css` — lock exact background hex values
- Update `--background` token to `#FAF6EE` (light) and `#010717` (dark) so the page background matches the spec fade target exactly. Other tokens stay untouched.

### 2. `src/components/hero/HeroSection.tsx` — add bottom fade overlay
- Keep the existing `bg-dark.jpg` sky image and the light-mode radial gradient as-is.
- Add a new absolutely-positioned child div at the bottom of the hero (above the sky, below the content) that renders a vertical gradient from `transparent` at ~55% to the solid background color at 100%.
- Use two stacked overlays (one `dark:hidden` using `#FAF6EE`, one `hidden dark:block` using `#010717`) so it respects the active theme without JS.
- Increase fade height to roughly the bottom 45% of the hero (`h-[45%] bottom-0`).
- Replace the current `to-background/80` global gradient overlay (which causes the abrupt feel) with this bottom-only fade.
- Ensure the content wrapper keeps `relative z-10` so headline/subtitle/CTA sit above the fade.

### 3. Downstream sections — solid background, no seam
- `HeroSection` wrapper: remove any bottom border/shadow (none currently, just verify).
- `AboutSection`, `ExperienceSection`, `SkillsSection`, `EducationSection`, `ContactSection`: ensure each renders on the solid `bg-background` (no translucent surface that would reveal a seam at the very top). Specifically, `ExperienceSection` and `EducationSection` currently use `bg-surface/40` — keep them, but add a top spacer or ensure the hero fade ends in pure `--background` so the surface tint only begins after a fully-opaque band. Simplest fix: leave `bg-surface/40` (it sits on top of `--background` which now matches the fade target, so no visible seam).

### 4. Verify
- Confirm in both light and dark mode that:
  - Sky is fully visible at the top of the hero.
  - Fade begins around 55–60% down and ends in the exact page background color.
  - No horizontal line is visible at the hero/About boundary.
  - Hero text remains fully legible (z-index above the fade).

## Technical notes
- The fade overlay uses inline `background-image: linear-gradient(to bottom, transparent 0%, <color> 100%)` with two variants gated by Tailwind's `dark:` variant.
- No new dependencies, no animation changes, no layout shifts.

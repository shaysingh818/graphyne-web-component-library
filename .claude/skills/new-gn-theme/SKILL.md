---
name: new-gn-theme
description: Scaffold a new design-token theme (a named set of CSS custom property overrides) for @graphyne/web-components, following this repo's established conventions. Use when the user asks to create, add, or scaffold a new theme, color scheme, or brand variant.
---

# Scaffolding a new Graphyne theme

Every component already exposes its colors as `--gn-<component>-*` custom
properties with a hardcoded fallback declared locally in that component's
own `<style scoped>` block (see `packages/web-components/CLAUDE.md`'s "four-variable
color override" section) — e.g. `GnBackBar` owns
`--gn-back-bar-background: #ffffff` on `.gn-back-bar`. `tokens.css` exists
at `src/styles/tokens.css` but is currently empty; no component reads
from it yet.

That means there are two different ways a "theme" could work here, and
this repo hasn't picked one yet. **Settle this before scaffolding the
first theme**, then rewrite this section to lock in the answer instead of
presenting both:

- **Override block (lower risk, works today)**: a theme is a CSS class or
  `[data-theme="x"]` selector that re-declares the same
  `--gn-<component>-*` variables components already consume, scoped to
  that selector. No component code changes required. Downside: there's no
  small shared palette to tweak once — every component's variables need
  restating per theme, and a new component means updating every theme
  file too.
- **Shared primitive tokens (bigger refactor)**: `tokens.css` defines a
  small set of primitives (`--gn-color-accent`, `--gn-color-surface`,
  `--gn-color-text`, etc.), and every existing component's fallback is
  rewritten to reference them (e.g.
  `var(--gn-back-bar-accent, var(--gn-color-accent, #f97316))`) instead of
  a bare hex. A theme then only needs to override the small primitive
  set. Touches every existing component's `<style scoped>` block, so this
  is a larger, separate piece of work — don't fold it into scaffolding
  the first theme without calling that out to the user explicitly.

## 1. Ask if unclear

- Which of the two approaches above (or confirm one has already been
  chosen since this was written, and update this file accordingly).
- Theme name and where it applies (global default vs. an opt-in
  `[data-theme]`/class toggle vs. relying on the per-component override
  props that already exist, e.g. `color`/`backgroundColor`).
- Is this a one-off accent color swap, or does it need to flip a full
  light/dark pairing (background + text + border together, not just one
  accent)?

## 2. Create the token file

```
packages/web-components/src/styles/themes/<theme-name>.css
```

Import it from `src/index.ts` (production build) and
`.storybook/preview.ts` (Storybook canvas), alongside the existing
`tailwind.css` / `tokens.css` / `shared.css` imports — same wiring those
three already have.

## 3. Verify

- Spot-check the theme against a couple of components from different
  groups (e.g. a button and a nav component) in Storybook, not just one —
  confirm every color the theme sets is actually visible somewhere.
- `pnpm --filter @graphyne/web-components run typecheck` and
  `pnpm --filter @graphyne/web-components run test` should stay green — a theme is
  CSS-only and shouldn't touch component logic.

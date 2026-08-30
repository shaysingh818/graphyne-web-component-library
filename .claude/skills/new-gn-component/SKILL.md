---
name: new-gn-component
description: Scaffold a new Graphyne component in packages/core (Vue SFC + stories + tests + full wiring), following this repo's established conventions. Use when the user asks to create, add, or scaffold a new Gn* component, or to finish/wire up an existing half-built one.
---

# Scaffolding a new Graphyne component

Full conventions live in `packages/core/CLAUDE.md` — read it first if it
hasn't already been loaded this session. This skill is the checklist for
turning those conventions into a complete, working component in one pass.

## 1. Ask if unclear

Before writing anything, make sure you know:
- Component name (`GnPascalCase`) and which `components/<group>/` it goes in
  (`buttons`, `forms`, `layout`, `navigation`, or a new group).
- Whether it has a value (`v-model`) or is stateless/presentational.
- Whether it needs an icon slot (never a hardcoded icon prop/library).

## 2. Create the four files

```
src/components/<group>/GnExample/
  GnExample.vue
  GnExample.stories.ts
  GnExample.test.ts
  index.ts
```

- `GnExample.vue` — `<script setup lang="ts">` with a JSDoc block explaining
  purpose and any non-obvious API decisions, `withDefaults(defineProps<...>())`,
  the four-variable color-override `style` computed if it renders anything
  visual, emits following the `update:modelValue` + `gn-update` pairing if
  it has a value, and a `<style scoped>` block using `var(--x, fallback)` —
  never redeclaring the variable as a flat default inside the same rule.
- `index.ts` — `export { default as GnExample } from "./GnExample.vue";`
- `GnExample.stories.ts` — a `meta` with `parameters.docs.description.component`,
  and every exported story with its own `parameters.docs.description.story`.
  Cover at minimum: Default, Disabled (if applicable), WithError (if it has
  an `error` prop), a custom-color story, and a WithFontAwesome story if it
  takes an icon slot.
- `GnExample.test.ts` — `@vue/test-utils` + `vitest`. Cover: default/no-override
  state, each color prop independently, disabled behavior, error/aria wiring
  if applicable, and any emits.

## 3. Wire it in — do not skip this

A component isn't usable from outside its own folder until:

1. `components/<group>/index.ts` has `export * from "./GnExample";`
2. `src/index.ts` imports it in the `./components/<group>` import line and
   registers it in the plugin: `app.component("GnExample", GnExample);`
3. If `<group>/index.ts` didn't already exist or wasn't exported from
   `src/index.ts`, add `export * from "./components/<group>";` there too.

## 4. Verify before calling it done

```bash
pnpm --filter @graphyne/core run test -- GnExample
pnpm --filter @graphyne/core run typecheck
```

Then check it renders in the Storybook preview (the `storybook` launch
config in `.claude/launch.json`) — navigate to
`http://localhost:6006/iframe.html?id=<group>-gnexample--default&viewMode=story`
and confirm computed styles/behavior match what the props claim, not just
that it renders without throwing.

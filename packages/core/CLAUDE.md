# @graphyne/core — component conventions

Every component lives in its own folder under `src/components/<group>/<ComponentName>/`
with four files:

```
GnExample/
  GnExample.vue
  GnExample.stories.ts
  GnExample.test.ts
  index.ts
```

None of that is optional — a component isn't done until all four exist and
it's wired into the package (see "Wiring a new component" below). Reference
implementations, cleanest to copy from: `GnFormInputField` (input pattern),
`GnIconButton` (icon-slot pattern), `GnNavigationItem` (layout-variant + optional
slot pattern).

## Props: the four-variable color override

Don't give a component one `color` prop that does everything. Split color
into independent overrides, each optional and `undefined` by default, each
mapped to its own CSS custom property only when set:

```ts
const props = withDefaults(
  defineProps<{
    /** Overrides the accent color used for the focus ring (any valid CSS color). */
    color?: string;
    /** Overrides the field's background color (any valid CSS color). */
    backgroundColor?: string;
    /** Overrides the color of the text in the field (any valid CSS color). */
    textColor?: string;
    /** Overrides the field's border color (any valid CSS color). Use "transparent" to remove the border. */
    borderColor?: string;
  }>(),
  { color: undefined, backgroundColor: undefined, textColor: undefined, borderColor: undefined }
);

const style = computed(() => {
  const overrides: Record<string, string> = {};
  if (props.color) overrides["--gn-input-accent"] = props.color;
  if (props.backgroundColor) overrides["--gn-input-background"] = props.backgroundColor;
  if (props.textColor) overrides["--gn-input-text-color"] = props.textColor;
  if (props.borderColor) overrides["--gn-input-border"] = props.borderColor;
  return Object.keys(overrides).length ? overrides : undefined;
});
```

Bind it with `:style="style"` on the root element, and consume the variables
in `<style scoped>` **with a fallback default, never a redeclaration**:

```css
.gn-input {
  border: 1px solid var(--gn-input-border, #d1d5db);
  background-color: var(--gn-input-background, #ffffff);
  color: var(--gn-input-text-color, #111827);
}
```

Redeclaring `--gn-input-border: #d1d5db;` as a flat property inside the rule
instead of a `var()` fallback silently clobbers whatever the consumer passed
in — this exact bug has bitten this codebase before. If a new component
needs its own variable namespace (not sharing `--gn-input-*`), name it
`--gn-<component>-<thing>`, e.g. `--gn-nav-item-accent`.

## Emits: v-model + namespaced event

Components with a value emit both, always:

```ts
const emit = defineEmits<{
  "update:modelValue": [value: string];
  "gn-update": [payload: string];
}>();

function handleInput(event: Event) {
  if (props.disabled) return;
  const value = (event.target as HTMLInputElement).value;
  emit("update:modelValue", value);
  emit("gn-update", value);
}
```

`update:modelValue` makes `v-model` work inside Vue; `gn-update` exists
because `v-model` doesn't cross the custom-element boundary once this
compiles to a native element. Guard against `disabled` before emitting.

## Icons: slot, never a hardcoded icon prop or library

Never bake in `<font-awesome-icon>` or an icon-name string prop (FontAwesome
is a `devDependency` here, used only in stories — a real component that
hard-imports it breaks for any consumer without it installed). Accept the
icon via the default slot instead, so inline SVG, an icon font, or any icon
library all work identically:

```html
<template>
  <button class="gn-icon-button" :aria-label="label">
    <slot />
  </button>
</template>
```

If the icon is genuinely optional (e.g. a nav item that can be label-only),
skip the wrapper entirely rather than rendering it empty:

```html
<span v-if="$slots.default" class="gn-navigation-item__icon"><slot /></span>
```

## `useId()` and cross-app id collisions

`useId()` on its own only guarantees uniqueness *within one Vue app
instance* — Storybook's docs page mounts every story as its own separate
app, so two components that both fall back to bare `useId()` can collide on
`v-0`. If a component pairs an id with something else on the page that has
to match it 1:1 (a `<label for>` target, a `popovertarget`, an `anchor-name`
used by CSS anchor positioning), pair `useId()` with a module-scope counter
declared in a plain (non-`setup`) `<script>` block so it survives across
app instances:

```html
<script lang="ts">
let instanceCount = 0;
</script>
<script setup lang="ts">
const generatedId = `${useId()}-${instanceCount++}`;
</script>
```

Anything that must be page-wide unique per instance (e.g. `anchor-name`) has
to flow through this id too, not be hardcoded as a literal string in
`<style scoped>` — `scoped` only scopes selectors, not property *values*.

## Wiring a new component into the package

Four places, or it's unreachable from outside the folder:

1. `GnExample/index.ts` — `export { default as GnExample } from "./GnExample.vue";`
2. `components/<group>/index.ts` — `export * from "./GnExample";`
3. `src/index.ts` — add to the `import { ... } from "./components/<group>"` line
   and to the `install(app)` plugin body: `app.component("GnExample", GnExample);`
4. If `<group>/index.ts` didn't exist yet, also add
   `export * from "./components/<group>";` to `src/index.ts`.

## Stories

One `meta` with a component-level description, one export per variant with
its own description — both via `parameters.docs.description`, which
`@storybook/addon-docs` (already configured in `.storybook/main.ts`) renders
on the autodocs page:

```ts
const meta = {
  title: "Forms/GnExample",
  component: GnExample,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "One or two sentences on what this component is for and its overall API shape."
      }
    }
  },
  // ...argTypes, args, render
} satisfies Meta<typeof GnExample>;

export const Disabled: Story = {
  args: { disabled: true },
  parameters: {
    docs: {
      description: {
        story: "What this specific variant demonstrates and when you'd reach for it."
      }
    }
  }
};
```

Multi-instance composition demos (e.g. several nav items stacked to show a
real side nav) get their own `render:` with a manual template — see
`GnNavigationItem.stories.ts`'s `SideNav`/`TopBar`/`CompactTopBar` stories.

## Tests

`@vue/test-utils` + `vitest`, one `describe` block per component, testing
observable behavior — not implementation details:

```ts
describe("GnExample", () => {
  it("does not set inline color overrides by default", () => {
    const wrapper = mount(GnExample);
    expect(wrapper.attributes("style")).toBeUndefined();
  });

  it("applies backgroundColor, textColor, and borderColor as independent overrides", () => {
    const wrapper = mount(GnExample, {
      props: { backgroundColor: "rgb(28, 25, 23)", textColor: "#f97316", borderColor: "transparent" }
    });
    const style = wrapper.attributes("style");
    expect(style).toContain("--gn-input-background: rgb(28, 25, 23)");
    expect(style).not.toContain("--gn-input-accent");
  });
});
```

Always cover: default (no-override) state, each color override applied
independently, disabled behavior (no emit), and — for anything with an
`error` prop — that `aria-invalid`/`aria-describedby` get set correctly.

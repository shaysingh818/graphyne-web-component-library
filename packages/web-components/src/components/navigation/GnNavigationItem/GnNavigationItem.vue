<script setup lang="ts">
/**
 * GnNavigationItem
 *
 * A single navigation entry pairing an optional icon with a label, meant to
 * be repeated inside a nav container. Like GnIconButton, the icon is
 * provided via the default slot (an inline SVG, an icon-font `<i>`, a
 * `<font-awesome-icon>`, whatever the consumer already uses) rather than a
 * hardcoded icon prop, so the component stays framework- and
 * library-agnostic when compiled to a custom element. Omit the slot for a
 * text-only item — the icon wrapper (and its gap) only renders when
 * something is actually passed in. `direction` switches
 * the item between a column layout (icon stacked above the label, for a
 * vertical side nav) and a row layout (icon beside the label, for a
 * horizontal top/bottom bar).
 */
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /** Visible label rendered next to (or below) the icon. */
    label?: string;
    /** Lays the icon and label out in a column (vertical side nav) or a row (horizontal top/bottom bar). */
    direction?: "row" | "col";
    /** Overrides the icon's accent color (any valid CSS color). */
    color?: string;
    /** Overrides the item's background color (any valid CSS color). */
    backgroundColor?: string;
    /** Overrides the label's text color (any valid CSS color). */
    textColor?: string;
    /** Overrides the item's border color (any valid CSS color). Use "transparent" to remove the border. */
    borderColor?: string;
  }>(),
  {
    label: undefined,
    direction: "col",
    color: undefined,
    backgroundColor: undefined,
    textColor: undefined,
    borderColor: undefined
  }
);

const style = computed(() => {
  const overrides: Record<string, string> = {};
  if (props.color) overrides["--gn-nav-item-accent"] = props.color;
  if (props.backgroundColor) overrides["--gn-nav-item-background"] = props.backgroundColor;
  if (props.textColor) overrides["--gn-nav-item-text-color"] = props.textColor;
  if (props.borderColor) overrides["--gn-nav-item-border"] = props.borderColor;
  return Object.keys(overrides).length ? overrides : undefined;
});
</script>

<template>
  <div
    class="gn-navigation-item"
    :class="direction === 'row' ? 'gn-navigation-item--row' : 'gn-navigation-item--col'"
    :style="style"
  >
    <span v-if="$slots.default" class="gn-navigation-item__icon"><slot /></span>
    <p v-if="label" class="gn-navigation-item__label">{{ label }}</p>
  </div>
</template>

<style scoped>

.gn-navigation-item {
  --gn-nav-item-accent: #f97316;
  --gn-nav-item-background: transparent;
  --gn-nav-item-text-color: #b5b3b3;
  --gn-nav-item-border: transparent;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: var(--gn-nav-item-background);
  border: 1px solid var(--gn-nav-item-border);
  font-family: inherit;
}

.gn-navigation-item--col {
  flex-direction: column;
}

.gn-navigation-item--row {
  flex-direction: row;
}

.gn-navigation-item__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--gn-nav-item-accent);
}

.gn-navigation-item__icon :deep(svg) {
  width: 1.125rem;
  height: 1.125rem;
  fill: currentColor;
}

.gn-navigation-item__label {
  margin: 0;
  color: var(--gn-nav-item-text-color);
  font-size: 10px;
}
</style>

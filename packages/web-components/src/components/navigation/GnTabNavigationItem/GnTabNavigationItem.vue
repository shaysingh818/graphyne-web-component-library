<script setup lang="ts">
/**
 * GnTabNavigationItem
 *
 * A single tab within a GnTabNavigationBar — an icon+label button that
 * shows a bottom accent-colored indicator when `selected`. Like every other
 * icon-taking component here, the icon comes from the default slot (inline
 * SVG, an icon-font `<i>`, a `<font-awesome-icon>`, whatever the consumer
 * already uses) rather than a hardcoded icon-name prop, so the component
 * stays framework- and library-agnostic once compiled to a custom element.
 * It doesn't track its own selected state — pair it with GnTabNavigationBar's
 * `v-model`/scoped-slot `active`/`select`:
 *
 * ```html
 * <GnTabNavigationBar v-model="activeTab" v-slot="{ active, select }">
 *   <GnTabNavigationItem
 *     label="Home"
 *     :selected="active === 'home'"
 *     @gn-click="select('home')"
 *   ><font-awesome-icon icon="fa-solid fa-house" /></GnTabNavigationItem>
 * </GnTabNavigationBar>
 * ```
 */
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /** Visible label. */
    label: string;
    /** Whether this is the active tab — toggles the bottom accent indicator. */
    selected?: boolean;
    /** Overrides the accent color used for the icon and the selected-state indicator (any valid CSS color). */
    color?: string;
    /** Overrides the item's background color (any valid CSS color). */
    backgroundColor?: string;
    /** Overrides the label's text color (any valid CSS color). */
    textColor?: string;
  }>(),
  {
    selected: false,
    color: undefined,
    backgroundColor: undefined,
    textColor: undefined
  }
);

defineEmits<{
  /** Fires on click. Carries the native MouseEvent — pair it with GnTabNavigationBar's `select` in the handler. */
  "gn-click": [payload: MouseEvent];
}>();

const style = computed(() => {
  const overrides: Record<string, string> = {};
  if (props.color) overrides["--gn-tab-nav-item-accent"] = props.color;
  if (props.backgroundColor) overrides["--gn-tab-nav-item-background"] = props.backgroundColor;
  if (props.textColor) overrides["--gn-tab-nav-item-text-color"] = props.textColor;
  return Object.keys(overrides).length ? overrides : undefined;
});
</script>

<template>
  <button
    type="button"
    class="gn-tab-nav-item"
    :class="{ 'gn-tab-nav-item--selected': selected }"
    :style="style"
    role="tab"
    :aria-selected="selected"
    @click="(event: MouseEvent) => $emit('gn-click', event)"
  >
    <span v-if="$slots.default" class="gn-tab-nav-item__icon"><slot /></span>
    <span class="gn-tab-nav-item__label">{{ label }}</span>
  </button>
</template>

<style scoped>
.gn-tab-nav-item {
  --gn-tab-nav-item-accent: #f97316;
  --gn-tab-nav-item-background: transparent;
  --gn-tab-nav-item-text-color: #b5b3b3;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border: none;
  border-bottom: 2px solid transparent;
  background-color: var(--gn-tab-nav-item-background);
  color: var(--gn-tab-nav-item-text-color);
  font-family: inherit;
  font-size: 0.8125rem;
  line-height: 1;
  cursor: pointer;
  transition: border-color 120ms ease;
}

.gn-tab-nav-item--selected {
  border-bottom-color: var(--gn-tab-nav-item-accent);
}

.gn-tab-nav-item__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--gn-tab-nav-item-accent);
}

.gn-tab-nav-item__icon :deep(svg) {
  width: 1rem;
  height: 1rem;
  fill: currentColor;
}

.gn-tab-nav-item__label {
  white-space: nowrap;
}
</style>

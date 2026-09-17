<script setup lang="ts">
/**
 * GnDropDownMenuItem
 *
 * A single selectable row inside a GnDropDownMenu's `items` slot — an
 * optional icon paired with a label, rendered as a real `<button>` for free
 * keyboard support (the same reasoning GnListTile documents for its own
 * clickable region). Like every other icon-taking component here, the icon
 * comes from the default slot (inline SVG, an icon-font `<i>`, a
 * `<font-awesome-icon>`, whatever the consumer already uses) rather than a
 * hardcoded icon-name prop — the source this was ported from took `icon` as
 * a required `String` passed straight to a single shared
 * `<font-awesome-icon :icon="icon" />`, which is exactly the anti-pattern
 * this library avoids: it would hard-couple every consumer to FontAwesome
 * even though it's only a devDependency here, used in stories. Omit the
 * slot for a text-only item — the icon wrapper (and its gap) only renders
 * when something is actually passed in, same as GnNavigationItem.
 *
 * Does not close its parent GnDropDownMenu itself — GnDropDownMenu's own
 * `closeOnSelect` listens for any click bubbling up from its `items` slot,
 * so this component only needs to emit `gn-click` and stay unaware of the
 * menu that contains it.
 */
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /** Visible label. */
    label: string;
    /** Disables the item and prevents the click event from firing. */
    disabled?: boolean;
    /** Overrides the icon's accent color (any valid CSS color). */
    color?: string;
    /** Overrides the item's background color on hover (any valid CSS color). */
    backgroundColor?: string;
    /** Overrides the label's text color (any valid CSS color). */
    textColor?: string;
  }>(),
  {
    disabled: false,
    color: undefined,
    backgroundColor: undefined,
    textColor: undefined
  }
);

defineEmits<{
  /** Fires on click, unless the item is disabled. */
  "gn-click": [payload: MouseEvent];
}>();

const style = computed(() => {
  const overrides: Record<string, string> = {};
  if (props.color) overrides["--gn-dropdown-menu-item-accent"] = props.color;
  if (props.backgroundColor) overrides["--gn-dropdown-menu-item-hover-background"] = props.backgroundColor;
  if (props.textColor) overrides["--gn-dropdown-menu-item-text-color"] = props.textColor;
  return Object.keys(overrides).length ? overrides : undefined;
});
</script>

<template>
  <button
    type="button"
    class="gn-dropdown-menu-item"
    :style="style"
    :disabled="disabled"
    @click="(event: MouseEvent) => !disabled && $emit('gn-click', event)"
  >
    <span v-if="$slots.default" class="gn-dropdown-menu-item__icon"><slot /></span>
    <span class="gn-dropdown-menu-item__label">{{ label }}</span>
  </button>
</template>

<style scoped>
.gn-dropdown-menu-item {
  --gn-dropdown-menu-item-accent: #f97316;
  --gn-dropdown-menu-item-hover-background: #f3f4f6;
  --gn-dropdown-menu-item-text-color: #b5b3b3;
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
  padding: 0.4375rem 0.75rem;
  border: none;
  background-color: transparent;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: background-color 120ms ease, opacity 120ms ease;
}

.gn-dropdown-menu-item:not(:disabled):hover {
  background-color: var(--gn-dropdown-menu-item-hover-background);
}

.gn-dropdown-menu-item:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.gn-dropdown-menu-item__icon {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  color: var(--gn-dropdown-menu-item-accent);
}

.gn-dropdown-menu-item__icon :deep(svg) {
  width: 1rem;
  height: 1rem;
  fill: currentColor;
}

.gn-dropdown-menu-item__label {
  color: var(--gn-dropdown-menu-item-text-color);
  font-size: 0.8125rem;
  white-space: nowrap;
}
</style>

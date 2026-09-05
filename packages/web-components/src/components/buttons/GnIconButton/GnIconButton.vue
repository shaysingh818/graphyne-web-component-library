<script setup lang="ts">
/**
 * GnIconButton
 *
 * A circular, icon-only button that mirrors GnButton's variant/disabled/color
 * API, plus a `size` prop (sm/md/lg) that scales both the button diameter
 * and the slotted icon together. The icon itself is provided via the default
 * slot (an inline SVG, an icon-font `<i>`, whatever the consumer already
 * uses) rather than a hardcoded icon prop, so the component stays
 * framework- and library-agnostic when compiled to a custom element.
 * Because there's no visible label, `label` is required and is applied as
 * `aria-label`.
 */
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /** Accessible name for the button; required since there's no text content. */
    label: string;
    /** Visual style of the button. */
    variant?: "primary" | "secondary" | "ghost";
    /** Overall diameter of the button and its icon. */
    size?: "sm" | "md" | "lg";
    /** Disables the button and prevents the click event from firing. */
    disabled?: boolean;
    /** Overrides the accent color used by all variants (any valid CSS color). */
    color?: string;
  }>(),
  {
    variant: "primary",
    size: "md",
    disabled: false,
    color: undefined
  }
);

defineEmits<{
  /** Fires on click, unless the button is disabled. */
  "gn-click": [payload: MouseEvent];
}>();

const style = computed(() =>
  props.color ? { "--gn-icon-button-accent": props.color } : undefined
);
</script>

<template>
  <button
    class="gn-icon-button"
    :class="[`gn-icon-button--${variant}`, `gn-icon-button--${size}`]"
    :style="style"
    :disabled="disabled"
    :aria-label="label"
    type="button"
    @click="(event: MouseEvent) => !disabled && $emit('gn-click', event)"
  >
    <slot />
  </button>
</template>

<style scoped>
.gn-icon-button {
  --gn-icon-button-accent: #f97316;
  --gn-icon-button-diameter: 2.5rem;
  --gn-icon-button-icon-size: 1.125rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--gn-icon-button-diameter);
  height: var(--gn-icon-button-diameter);
  padding: 0;
  border-radius: 9999px;
  border: 1px solid transparent;
  font-family: inherit;
  line-height: 1;
  cursor: pointer;
  flex: none;
  transition: background-color 120ms ease, border-color 120ms ease, opacity 120ms ease;
}

.gn-icon-button :deep(svg) {
  width: var(--gn-icon-button-icon-size);
  height: var(--gn-icon-button-icon-size);
  fill: currentColor;
}

.gn-icon-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.gn-icon-button--sm {
  --gn-icon-button-diameter: 2rem;
  --gn-icon-button-icon-size: 0.875rem;
}

.gn-icon-button--md {
  --gn-icon-button-diameter: 2.5rem;
  --gn-icon-button-icon-size: 1.125rem;
}

.gn-icon-button--lg {
  --gn-icon-button-diameter: 3rem;
  --gn-icon-button-icon-size: 1.375rem;
}

.gn-icon-button--primary {
  background-color: var(--gn-icon-button-accent);
  border-color: var(--gn-icon-button-accent);
  color: #ffffff;
}

.gn-icon-button--primary:not(:disabled):hover {
  background-color: color-mix(in srgb, var(--gn-icon-button-accent) 85%, black);
  border-color: color-mix(in srgb, var(--gn-icon-button-accent) 85%, black);
}

.gn-icon-button--secondary {
  background-color: color-mix(in srgb, var(--gn-icon-button-accent) 12%, white);
  border-color: color-mix(in srgb, var(--gn-icon-button-accent) 35%, white);
  color: color-mix(in srgb, var(--gn-icon-button-accent) 70%, black);
}

.gn-icon-button--secondary:not(:disabled):hover {
  background-color: color-mix(in srgb, var(--gn-icon-button-accent) 20%, white);
}

.gn-icon-button--ghost {
  background-color: transparent;
  border-color: transparent;
  color: var(--gn-icon-button-accent);
}

.gn-icon-button--ghost:not(:disabled):hover {
  background-color: color-mix(in srgb, var(--gn-icon-button-accent) 12%, white);
}
</style>

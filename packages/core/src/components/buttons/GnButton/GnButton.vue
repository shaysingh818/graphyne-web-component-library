<script setup lang="ts">
/**
 * GnButton
 *
 * A minimal example component demonstrating the pattern every Graphyne
 * component should follow: typed props with defaults, a namespaced custom
 * event (`gn-click`) so it dispatches cleanly as a native CustomEvent when
 * compiled to a custom element, and a default slot for content.
 */
 import { computed } from "vue";
 
const props = withDefaults(
  defineProps<{
    /** Visual style of the button. */
    variant?: "primary" | "secondary" | "ghost";
    /** Disables the button and prevents the click event from firing. */
    disabled?: boolean;
    /** Overrides the accent color used by all variants (any valid CSS color). */
    color?: string;
  }>(),
  {
     variant: "primary",
     disabled: false,
     color: undefined
   }
 );

defineEmits<{
  /** Fires on click, unless the button is disabled. */
  "gn-click": [payload: MouseEvent];
}>();

const style = computed(() =>
  props.color ? { "--gn-button-accent": props.color } : undefined
);
</script>

<template>
  <button
    class="gn-button"
    :class="[`gn-button--${variant}`]"
    :style="style"
    :disabled="disabled"
    type="button"
    @click="(event: MouseEvent) => !disabled && $emit('gn-click', event)"
  >
    <slot />
  </button>
</template>

<style scoped>
.gn-button {
  --gn-button-accent: #F97316;
  font-family: inherit;
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.2;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color 120ms ease, border-color 120ms ease, opacity 120ms ease;
}

.gn-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.gn-button--primary {
  background-color:  var(--gn-button-accent);
  border-color: var(--gn-button-accent);
  color: #ffffff;
}

.gn-button--primary:not(:disabled):hover {
  background-color: color-mix(in srgb, var(--gn-button-accent) 85%, black);
  border-color: color-mix(in srgb, var(--gn-button-accent) 85%, black);
}

.gn-button--secondary {
  background-color: color-mix(in srgb, var(--gn-button-accent) 12%, white);
  border-color: color-mix(in srgb, var(--gn-button-accent) 35%, white);
  color: color-mix(in srgb, var(--gn-button-accent) 70%, black);
}

.gn-button--secondary:not(:disabled):hover {
  background-color: color-mix(in srgb, var(--gn-button-accent) 20%, white);
}
.gn-button--ghost {
  background-color: transparent;
  border-color: transparent;
  color: var(--gn-button-accent);
}
.gn-button--ghost:not(:disabled):hover {
  background-color: color-mix(in srgb, var(--gn-button-accent) 12%, white);
}
</style>

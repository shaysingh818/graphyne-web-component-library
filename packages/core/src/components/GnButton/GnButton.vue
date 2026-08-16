<script setup lang="ts">
/**
 * GnButton
 *
 * A minimal example component demonstrating the pattern every Graphyne
 * component should follow: typed props with defaults, a namespaced custom
 * event (`gn-click`) so it dispatches cleanly as a native CustomEvent when
 * compiled to a custom element, and a default slot for content.
 */
withDefaults(
  defineProps<{
    /** Visual style of the button. */
    variant?: "primary" | "secondary" | "ghost";
    /** Disables the button and prevents the click event from firing. */
    disabled?: boolean;
  }>(),
  {
    variant: "primary",
    disabled: false
  }
);

defineEmits<{
  /** Fires on click, unless the button is disabled. */
  "gn-click": [payload: MouseEvent];
}>();
</script>

<template>
  <button
    class="gn-button"
    :class="[`gn-button--${variant}`]"
    :disabled="disabled"
    type="button"
    @click="(event: MouseEvent) => !disabled && $emit('gn-click', event)"
  >
    <slot />
  </button>
</template>

<style scoped>
.gn-button {
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
  background-color: #4f46e5;
  border-color: #4f46e5;
  color: #ffffff;
}

.gn-button--primary:not(:disabled):hover {
  background-color: #4338ca;
}

.gn-button--secondary {
  background-color: #eef2ff;
  border-color: #c7d2fe;
  color: #3730a3;
}

.gn-button--secondary:not(:disabled):hover {
  background-color: #e0e7ff;
}

.gn-button--ghost {
  background-color: transparent;
  border-color: transparent;
  color: #4f46e5;
}

.gn-button--ghost:not(:disabled):hover {
  background-color: #eef2ff;
}
</style>

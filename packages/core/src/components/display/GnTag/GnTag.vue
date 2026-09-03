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
     /** Overrides the accent color used by all variants (any valid CSS color). */
     label?: string;
     /** Visual style of the button. */
     variant?: "primary" | "secondary" | "ghost";
     /** Disables the button and prevents the click event from firing. */
     disabled?: boolean;
     /** Overrides the accent color used by all variants (any valid CSS color). */
     color?: string;     
     /** Height of tag component */
     width?: string;     
     /** Width of tag component. */
     height?: string;
   }>(),
   {
     label: "tag",
     variant: "primary",
     disabled: false,
     color: undefined,
     width: "10px",
     height: "10px"
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
<div
  class="tag"
  :style="{width: width, height: height }"
>
  <p>{{ label }}</p>
</div>
</template>

<style scoped>
.tag {
  border-radius: 5px;
  background-color: #f97316;
  padding: 5px;
  white-space: nowrap;
}

p {
  font-weight: normal;
  font-size: 10px;
  color: white;
}
</style>

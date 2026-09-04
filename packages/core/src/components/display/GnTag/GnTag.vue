<script setup lang="ts">
/**
 * GnTag
 *
 * A small label/badge for showing metadata associated with content (a
 * category, a status, a count). Like GnButton, there's no width/height
 * prop — the tag sizes itself to fit its `label` via padding, the same way
 * GnButton sizes itself to its slot content. An earlier version of this
 * component had a `width`/`height` prop pair (default "10px"/"10px")
 * force-applied via inline `:style`, which clipped/overflowed almost any
 * real label — that's what was actually going on when tags looked
 * "messed up". The `color` override was also silently non-functional: the
 * template's `:style` bound a literal `{width, height}` object instead of
 * the `style` computed value that actually holds `--gn-tag-accent`, so
 * `color` was a dead prop no matter what was passed in.
 */
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /** Visible text. */
    label?: string;
    /** Visual style of the tag. */
    variant?: "primary" | "secondary";
    /** Overrides the accent color used by all variants (any valid CSS color). */
    color?: string;
  }>(),
  {
    label: "tag",
    variant: "primary",
    color: undefined
  }
);

const style = computed(() =>
  props.color ? { "--gn-tag-accent": props.color } : undefined
);
</script>

<template>
<div
  class="gn-tag"
  :class="[`gn-tag--${variant}`]"
  :style="style"
>
  <p>{{ label }}</p>
</div>
</template>

<style scoped>
.gn-tag {
    --gn-tag-accent: #f97316;
    /*
     * inline-flex, not flex — a block-level flex container stretches to
     * fill its containing block's width in a normal block layout context
     * (it only happened to shrink-wrap to its label inside GnListTile's
     * tags row because that row is itself a flex container, where items
     * size to content on the main axis by default; standalone, "flex"
     * stretched the tag across nearly the full canvas width instead).
     * Every other self-sizing element in this library — GnIconButton,
     * GnTabNavigationItem, etc. — uses inline-flex for this exact reason.
     */
    display: inline-flex;
    border-radius: 5px;
    padding: 5px;
    white-space: nowrap;
    align-items: center;
    justify-content: center;
    transition: background-color 120ms ease, border-color 120ms ease, opacity 120ms ease;
}

.gn-tag--primary { 
    background-color:  var(--gn-tag-accent);
    border-color: var(--gn-tag-accent);
    color: #ffffff;
}

.gn-tag--secondary {
  background-color: color-mix(in srgb, var(--gn-tag-accent) 30%, white);
  border-color: color-mix(in srgb, var(--gn-tag-accent) 35%, white);
  color: color-mix(in srgb, var(--gn-tag-accent) 70%, black);
}

p {
  font-weight: bold;
  font-size: 10px;
}
</style>

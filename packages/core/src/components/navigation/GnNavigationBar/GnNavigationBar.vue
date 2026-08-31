<script setup lang="ts">
/**
 * GnNavigationBar
 *
 * A layout shell that arranges a header, a list of nav items, and optional
 * trailing content into one bar — a vertical side nav or a horizontal
 * top/bottom bar, depending on `direction`. Unlike most components here,
 * this one is composed from other Graphyne components rather than plain
 * markup: place a <GnNavigationHeader> in the `header` slot, one or more
 * <GnNavigationItem>s in the `items` slot, and anything else (a user menu,
 * an icon button) in `trailing`. GnNavigationBar only owns the outer
 * layout — each slotted component keeps its own props (icon, color, size
 * overrides, etc.) completely independent, so no prop-forwarding is needed
 * here, and any section left empty simply doesn't render.
 */
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /** Lays the bar out as a vertical side nav (col) or a horizontal top/bottom bar (row). */
    direction?: "row" | "col";
    /** Overrides the bar's background color (any valid CSS color). */
    backgroundColor?: string;
    /** Overrides the bar's border color (any valid CSS color). Use "transparent" to remove the border. */
    borderColor?: string;
  }>(),
  {
    direction: "col",
    backgroundColor: undefined,
    borderColor: undefined
  }
);

const style = computed(() => {
  const overrides: Record<string, string> = {};
  if (props.backgroundColor) overrides["--gn-nav-bar-background"] = props.backgroundColor;
  if (props.borderColor) overrides["--gn-nav-bar-border"] = props.borderColor;
  return Object.keys(overrides).length ? overrides : undefined;
});
</script>

<template>
  <div
    class="gn-navigation-bar"
    :class="direction === 'row' ? 'gn-navigation-bar--row' : 'gn-navigation-bar--col'"
    :style="style"
  >
    <div v-if="$slots.header" class="gn-navigation-bar__header">
      <slot name="header" />
    </div>

    <nav v-if="$slots.items" class="gn-navigation-bar__items">
      <slot name="items" />
    </nav>

    <div v-if="$slots.trailing" class="gn-navigation-bar__trailing">
      <slot name="trailing" />
    </div>
  </div>
</template>

<style scoped>
.gn-navigation-bar {
  --gn-nav-bar-background: transparent;
  --gn-nav-bar-border: transparent;
  display: flex;
  gap: 1.5rem;
  background-color: var(--gn-nav-bar-background);
  border: 1px solid var(--gn-nav-bar-border);
  font-family: inherit;
}

.gn-navigation-bar--col {
  flex-direction: column;
  align-items: stretch;
  padding: 1rem;
}

.gn-navigation-bar--row {
  flex-direction: row;
  align-items: center;
  padding: 0.5rem 1rem;
}

.gn-navigation-bar__items {
  display: flex;
  flex: 1;
  gap: 0.5rem;
}

.gn-navigation-bar--col .gn-navigation-bar__items {
  flex-direction: column;
}

.gn-navigation-bar--row .gn-navigation-bar__items {
  flex-direction: row;
}

.gn-navigation-bar--col .gn-navigation-bar__trailing {
  margin-top: auto;
}

.gn-navigation-bar--row .gn-navigation-bar__trailing {
  margin-left: auto;
}
</style>

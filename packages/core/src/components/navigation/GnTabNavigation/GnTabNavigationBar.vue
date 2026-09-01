<script setup lang="ts">
/**
 * GnTabNavigationBar
 *
 * A horizontal tab bar shell for a "sub nav" beneath a page's main
 * navigation — e.g. a row of tabs across the top of a section, each one
 * swapping the content/subpage shown below. Like GnNavigationBar, it
 * doesn't render tab items itself: place them (GnTabNavigationItem, or your
 * own) in the default slot. What it *does* own is which tab is active —
 * bind `v-model` to a value identifying the selected tab, and use the
 * scoped slot's `active`/`select` to wire highlighting and click handling
 * into whatever's slotted in:
 *
 * ```html
 * <GnTabNavigationBar v-model="activeTab" v-slot="{ active, select }">
 *   <GnTabNavigationItem
 *     label="Home"
 *     :selected="active === 'home'"
 *     @gn-click="select('home')"
 *   ><font-awesome-icon icon="fa-solid fa-house" /></GnTabNavigationItem>
 * </GnTabNavigationBar>
 * <section v-show="activeTab === 'home'">…subpage content…</section>
 * ```
 *
 * Rendering the subpage content for whichever tab is active is the
 * consumer's job, not this component's — keep a `v-if`/`v-show` block (or
 * router-view) below the bar driven by the same `activeTab` value.
 */
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /** Identifier of the currently active tab; bind with `v-model`. */
    modelValue?: string;
    /** Overrides the accent color used for icons/indicators (any valid CSS color). */
    color?: string;
    /** Overrides the bar's background color (any valid CSS color). */
    backgroundColor?: string;
    /** Overrides the bar's border color (any valid CSS color). Use "transparent" to remove the border. */
    borderColor?: string;
    /** Overrides the label text color (any valid CSS color). */
    textColor?: string;
    /** Overrides the icon width/height for any icon slotted into a tab item (any valid CSS size, e.g. "1.5rem", "32px"). */
    iconSize?: string;
  }>(),
  {
    modelValue: undefined,
    color: undefined,
    backgroundColor: undefined,
    borderColor: undefined,
    textColor: undefined,
    iconSize: undefined
  }
);

const emit = defineEmits<{
  /** Standard v-model event. */
  "update:modelValue": [value: string];
  /** Fires when the scoped slot's `select` is called. Carries the newly active tab's identifier. */
  "gn-update": [payload: string];
}>();

/** Passed to the default slot as `select` — call it with a tab's identifier to make it active. */
function select(value: string) {
  emit("update:modelValue", value);
  emit("gn-update", value);
}

const style = computed(() => {
  const overrides: Record<string, string> = {};
  if (props.color) overrides["--gn-tab-nav-bar-accent"] = props.color;
  if (props.backgroundColor) overrides["--gn-tab-nav-bar-background"] = props.backgroundColor;
  if (props.borderColor) overrides["--gn-tab-nav-bar-border"] = props.borderColor;
  if (props.textColor) overrides["--gn-tab-nav-bar-text-color"] = props.textColor;
  if (props.iconSize) overrides["--gn-tab-nav-bar-icon-size"] = props.iconSize;
  return Object.keys(overrides).length ? overrides : undefined;
});
</script>

<template>
  <nav class="gn-tab-nav-bar" role="tablist" :style="style">
    <slot :active="modelValue" :select="select" />
  </nav>
</template>

<style scoped>
.gn-tab-nav-bar {
  --gn-tab-nav-bar-accent: #f97316;
  --gn-tab-nav-bar-background: transparent;
  --gn-tab-nav-bar-text-color: #b5b3b3;
  --gn-tab-nav-bar-border: transparent;
  --gn-tab-nav-bar-icon-size: 1.125rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  background-color: var(--gn-tab-nav-bar-background);
  border-bottom: 1px solid var(--gn-tab-nav-bar-border);
  color: var(--gn-tab-nav-bar-text-color);
  font-family: inherit;
}

.gn-tab-nav-bar :deep(svg) {
  width: var(--gn-tab-nav-bar-icon-size);
  height: var(--gn-tab-nav-bar-icon-size);
  fill: currentColor;
}
</style>

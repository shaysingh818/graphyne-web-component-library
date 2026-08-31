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
    title?: string;
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
    /** Overrides the icon's width/height (any valid CSS size, e.g. "1.5rem", "32px"). */
    iconSize?: string;
    /** Overrides the title's font-size (any valid CSS size, e.g. "1.25rem", "20px"). */
    titleSize?: string;
    /** Overrides the title's max-width in column layout (any valid CSS size, e.g. "6rem", "120px"). Independent of iconSize, so the title can wrap onto multiple lines and stay fully readable regardless of how small the icon is. */
    titleMaxWidth?: string;
  }>(),
  {
    title: "Graphyne",
    direction: "row",
    color: undefined,
    backgroundColor: undefined,
    textColor: undefined,
    borderColor: undefined,
    iconSize: undefined,
    titleSize: undefined,
    titleMaxWidth: undefined
  }
);

const style = computed(() => {
  const overrides: Record<string, string> = {};
  if (props.color) overrides["--gn-nav-header-accent"] = props.color;
  if (props.backgroundColor) overrides["--gn-nav-header-background"] = props.backgroundColor;
  if (props.textColor) overrides["--gn-nav-header-text-color"] = props.textColor;
  if (props.borderColor) overrides["--gn-nav-header-border"] = props.borderColor;
  if (props.iconSize) overrides["--gn-nav-header-icon-size"] = props.iconSize;
  if (props.titleSize) overrides["--gn-nav-header-title-size"] = props.titleSize;
  if (props.titleMaxWidth) overrides["--gn-nav-header-title-max-width"] = props.titleMaxWidth;
  return Object.keys(overrides).length ? overrides : undefined;
});
</script>


<template>
  <div
    class="gn-navigation-header"
    :class="direction === 'row' ? 'gn-navigation-header--row' : 'gn-navigation-header--col'"
    :style="style"
  >
    <span v-if="$slots.default" class="gn-navigation-header__icon"><slot /></span>
    <h1 v-if="title" class="gn-navigation-header__title">{{ title }}</h1>
  </div>
</template>

<style scoped>

.gn-navigation-header {
  --gn-nav-header-accent: #f97316;
  --gn-nav-header-background: transparent;
  --gn-nav-header-text-color: #b5b3b3;
  --gn-nav-header-border: transparent;
  --gn-nav-header-icon-size: 1.125rem;
  --gn-nav-header-title-size: 20px;
  --gn-nav-header-title-max-width: 8rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: var(--gn-nav-header-background);
  border: 1px solid var(--gn-nav-header-border);
  font-family: inherit;
}

.gn-navigation-header--col {
  flex-direction: column;
}

.gn-navigation-header--row {
  flex-direction: row;
}

.gn-navigation-header__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--gn-nav-header-accent);
}

.gn-navigation-header__icon :deep(svg) {
  width: var(--gn-nav-header-icon-size);
  height: var(--gn-nav-header-icon-size);
  fill: currentColor;
  flex: none;
}

.gn-navigation-header__title {
  margin: 0;
  color: var(--gn-nav-header-text-color);
  font-size: var(--gn-nav-header-title-size);
}

.gn-navigation-header--col .gn-navigation-header__title {
  max-width: var(--gn-nav-header-title-max-width);
  overflow-wrap: break-word;
  text-align: center;
}

</style>



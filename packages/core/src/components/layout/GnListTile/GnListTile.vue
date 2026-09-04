<script setup lang="ts">
/**
 * GnListTile
 *
 * A generic list-row layout primitive: a leading region, a title/
 * description/tags content region, and a trailing region. Extracted from
 * an app-specific "deck list item" for a flashcard app — not a straight
 * port of it, since almost everything that component did was app business
 * logic, not a reusable layout concern. Dropped entirely, not carried
 * forward in any form:
 * - vue-router (`useRouter`/`router.push`) — replaced by a single
 *   `gn-click` emit on the clickable region; the consumer wires their own
 *   navigation, same principle as GnBackBar's `gn-back`.
 * - Calls into an app-specific data store (delete/reload a "deck").
 * - A built-in dropdown menu, a delete-confirmation dialog, and an
 *   `actionType` prop that swapped between view/add/remove icons — all of
 *   that becomes the consumer's job now, composed into the `trailing` slot
 *   using this library's own `GnIconButton`/`GnConfirmDialog`, the same
 *   compositional pattern the SettingsDashboard page already demonstrates
 *   for GnBackBar's `actions` slot.
 * - Hardcoded FontAwesome icons and a `dateUpdated` field — as
 *   domain-specific as each other; both just become freeform slot content
 *   now (`leading`/`trailing`).
 * - An unused, never-referenced FontAwesome import — dead code, not
 *   carried forward.
 *
 * Two things are slots rather than props for the same reason GnBackBar's
 * `actions` is a slot instead of an `{icon, handler}[]` array: `leading`
 * (an icon OR an avatar image — both get sane default sizing via `:deep`
 * below) and `tags` (lets the consumer compose this library's own GnTag,
 * or anything else, instead of GnListTile hardcoding one specific tag
 * component's API).
 *
 * The clickable region only wraps `leading` + title/description/tags — as
 * a real `<button>`, for free keyboard support the original's clickable
 * `<div>` never had. `trailing` is a plain sibling, not nested inside that
 * button, so nothing placed there (icon buttons, a dropdown, whatever) can
 * ever accidentally trigger `gn-click`. The original required every single
 * trailing icon to remember `@click.stop`; this makes that unnecessary by
 * construction.
 */
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /** Primary text for the tile. */
    title: string;
    /** Optional secondary text under the title. */
    description?: string;
    /** Disables the tile: no hover state, no gn-click, native disabled semantics. */
    disabled?: boolean;
    /** Overrides the hover-highlight accent color and the default leading icon color (any valid CSS color). */
    color?: string;
    /** Overrides the tile's background color (any valid CSS color). */
    backgroundColor?: string;
    /** Overrides the title's text color (any valid CSS color). */
    textColor?: string;
    /** Overrides the description's text color (any valid CSS color). */
    descriptionColor?: string;
    /** Overrides the default color of bare icons (or any other content) placed directly in the trailing slot — icons wrapped in their own component, e.g. GnIconButton, control their own color instead (any valid CSS color). */
    trailingColor?: string;
    /** Overrides the bottom divider color (any valid CSS color). Use "transparent" to remove it. */
    borderColor?: string;
  }>(),
  {
    description: undefined,
    disabled: false,
    color: undefined,
    backgroundColor: undefined,
    textColor: undefined,
    descriptionColor: undefined,
    trailingColor: undefined,
    borderColor: undefined
  }
);

defineEmits<{
  /** Fires on click of the leading/title/description/tags region, unless disabled. Never fires from the trailing slot. */
  "gn-click": [payload: MouseEvent];
}>();

const style = computed(() => {
  const overrides: Record<string, string> = {};
  if (props.color) overrides["--gn-list-tile-accent"] = props.color;
  if (props.backgroundColor) overrides["--gn-list-tile-background"] = props.backgroundColor;
  if (props.textColor) overrides["--gn-list-tile-text-color"] = props.textColor;
  if (props.descriptionColor) overrides["--gn-list-tile-description-color"] = props.descriptionColor;
  if (props.trailingColor) overrides["--gn-list-tile-trailing-color"] = props.trailingColor;
  if (props.borderColor) overrides["--gn-list-tile-border"] = props.borderColor;
  return Object.keys(overrides).length ? overrides : undefined;
});
</script>

<template>
  <div class="gn-list-tile" :class="{ 'gn-list-tile--disabled': disabled }" :style="style">
    <button
      type="button"
      class="gn-list-tile__main"
      :disabled="disabled"
      @click="(event: MouseEvent) => !disabled && $emit('gn-click', event)"
    >
      <span v-if="$slots.leading" class="gn-list-tile__leading"><slot name="leading" /></span>
      <span class="gn-list-tile__content">
        <span class="gn-list-tile__title">{{ title }}</span>
        <span v-if="description" class="gn-list-tile__description">{{ description }}</span>
        <span v-if="$slots.tags" class="gn-list-tile__tags"><slot name="tags" /></span>
      </span>
    </button>

    <span v-if="$slots.trailing" class="gn-list-tile__trailing"><slot name="trailing" /></span>
  </div>
</template>

<style scoped>
.gn-list-tile {
  display: flex;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid var(--gn-list-tile-border, #e5e7eb);
  font-family: inherit;
}

.gn-list-tile--disabled {
  opacity: 0.5;
}

.gn-list-tile__main {
  display: flex;
  flex: 1;
  min-width: 0;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: none;
  background-color: var(--gn-list-tile-background, transparent);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: background-color 120ms ease;
}

.gn-list-tile__main:not(:disabled):hover {
  background-color: color-mix(in srgb, var(--gn-list-tile-accent, #f97316) 8%, var(--gn-list-tile-background, transparent));
}

.gn-list-tile__main:disabled {
  cursor: not-allowed;
}

.gn-list-tile__leading {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  color: var(--gn-list-tile-accent, #f97316);
}

.gn-list-tile__leading :deep(svg) {
  width: 1.5rem;
  height: 1.5rem;
  fill: currentColor;
}

.gn-list-tile__leading :deep(img) {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  object-fit: cover;
  flex: none;
}

.gn-list-tile__content {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
}

.gn-list-tile__title {
  color: var(--gn-list-tile-text-color, #111827);
  font-size: 0.9375rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gn-list-tile__description {
  color: var(--gn-list-tile-description-color, #6b7280);
  font-size: 0.8125rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gn-list-tile__tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.125rem;
}

.gn-list-tile__trailing {
  display: flex;
  flex: none;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  color: var(--gn-list-tile-trailing-color, #9ca3af);
  font-size: 0.8125rem;
}

/*
 * Sizing for a BARE icon dropped directly into trailing (e.g. a plain
 * status indicator) — something wrapped in its own component instead
 * (GnIconButton, etc.) already controls its own icon's size via that
 * component's own rule. :where() makes this whole selector's specificity
 * equivalent to a bare class selector (":where(svg)" contributes zero),
 * so any real component-owned rule like GnIconButton's ".gn-icon-button
 * svg" always wins the cascade regardless of stylesheet/bundle order —
 * this is only ever a fallback default, not something a nested component
 * has to fight. A depth-based selector (e.g. a direct-child combinator)
 * doesn't work here: the common `<span v-html="icon" />` pattern used
 * throughout this library's own stories puts the actual <svg> one level
 * deeper than the slotted element itself.
 */
.gn-list-tile__trailing :deep(:where(svg)) {
  width: 1.25rem;
  height: 1.25rem;
  fill: currentColor;
}
</style>

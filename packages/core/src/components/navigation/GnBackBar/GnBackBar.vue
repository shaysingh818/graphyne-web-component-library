<script setup lang="ts">
/**
 * GnBackBar
 *
 * A compact header bar for a "back to previous screen" pattern: a leading
 * back button, a title (with an optional subtitle underneath), and a
 * trailing row of actions. Ported from an app-specific `BackBar` that
 * hardcoded `<font-awesome-icon>` and called `this.$router.go(-1)` directly
 * — neither survives compiling to a framework-agnostic custom element, so
 * both are gone here. The back icon comes through the default slot (same
 * convention as GnIconButton/GnNavigationItem: inline SVG, an icon-font
 * `<i>`, a `<font-awesome-icon>`, whatever the consumer already has), and
 * clicking it just emits `gn-back` — the consumer decides what "back" means
 * (`router.go(-1)`, closing a modal, popping a stack). The back button only
 * renders when the default slot is used, so this doubles as a plain title
 * bar when omitted. Likewise `actions` is a named slot rather than an
 * `actions: {icon, handler}[]` prop — a function can't cross the custom
 * element boundary, and an icon-name string would reintroduce the same
 * hardcoded-icon-library problem. Compose it with one or more
 * `<GnIconButton>`s (or anything else) instead, each wired to its own
 * `@gn-click`. Layout is a fixed three-column grid (back / title / actions,
 * each an equal fraction of the width) rather than flexbox, so the title
 * stays centered on the full bar regardless of whether the back button or
 * actions are present or how wide they are — not just centered in the
 * leftover space between them.
 */
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /** Main heading rendered in the center of the bar. */
    title: string;
    /** Optional secondary line rendered under the title (e.g. "Last updated 04/02/2026"). Omitted entirely when unset. */
    subtitle?: string;
    /** Accessible name for the back button; only relevant when the default slot is used. */
    backLabel?: string;
    /** Overrides the accent color used by the back icon (any valid CSS color). */
    color?: string;
    /** Overrides the bar's background color (any valid CSS color). */
    backgroundColor?: string;
    /** Overrides the title's text color (any valid CSS color). */
    textColor?: string;
    /** Overrides the subtitle's text color (any valid CSS color). */
    subtitleColor?: string;
    /** Overrides the bar's border color (any valid CSS color). Use "transparent" to remove the border. */
    borderColor?: string;
  }>(),
  {
    subtitle: undefined,
    backLabel: "Go back",
    color: undefined,
    backgroundColor: undefined,
    textColor: undefined,
    subtitleColor: undefined,
    borderColor: undefined
  }
);

const emit = defineEmits<{
  /** Fires when the back button is clicked. Carries the native click event; the consumer decides what "back" does. */
  "gn-back": [payload: MouseEvent];
}>();

const style = computed(() => {
  const overrides: Record<string, string> = {};
  if (props.color) overrides["--gn-back-bar-accent"] = props.color;
  if (props.backgroundColor) overrides["--gn-back-bar-background"] = props.backgroundColor;
  if (props.textColor) overrides["--gn-back-bar-text-color"] = props.textColor;
  if (props.subtitleColor) overrides["--gn-back-bar-subtitle-color"] = props.subtitleColor;
  if (props.borderColor) overrides["--gn-back-bar-border"] = props.borderColor;
  return Object.keys(overrides).length ? overrides : undefined;
});

function handleBack(event: MouseEvent) {
  emit("gn-back", event);
}
</script>

<template>
  <div
    class="gn-back-bar grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-2 rounded-lg px-3"
    :style="style"
  >
    <button
      v-if="$slots.default"
      type="button"
      class="gn-back-bar__back col-start-1 justify-self-start"
      :aria-label="backLabel"
      @click="handleBack"
    >
      <slot />
    </button>

    <div class="gn-back-bar__content col-start-2 min-w-0 text-center">
      <h1 class="gn-back-bar__title">{{ title }}</h1>
      <p v-if="subtitle" class="gn-back-bar__subtitle">{{ subtitle }}</p>
    </div>

    <div v-if="$slots.actions" class="gn-back-bar__actions col-start-3 flex items-center justify-self-end gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.gn-back-bar {
  --gn-back-bar-accent: #f97316;
  --gn-back-bar-background: #ffffff;
  --gn-back-bar-text-color: #111827;
  --gn-back-bar-subtitle-color: #6b7280;
  --gn-back-bar-border: #e5e7eb;
  min-height: 60px;
  background-color: var(--gn-back-bar-background);
  border: 1px solid var(--gn-back-bar-border);
  font-family: inherit;
}

.gn-back-bar__back {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--gn-back-bar-accent);
  cursor: pointer;
  line-height: 1;
}

.gn-back-bar__back :deep(svg) {
  width: 1.125rem;
  height: 1.125rem;
  fill: currentColor;
}

.gn-back-bar__title {
  margin: 0;
  overflow: hidden;
  color: var(--gn-back-bar-text-color);
  font-size: 15px;
  font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gn-back-bar__subtitle {
  margin: 0;
  overflow: hidden;
  color: var(--gn-back-bar-subtitle-color);
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

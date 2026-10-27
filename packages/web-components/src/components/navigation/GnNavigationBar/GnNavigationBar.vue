<script lang="ts">
// Module-scope so the generated id stays unique across separate Vue app
// instances on the same page (e.g. Storybook's docs view), where each app's
// own useId() would otherwise restart at v-0 — see packages/web-components/CLAUDE.md.
let instanceCount = 0;
</script>

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
 *
 * In row layout, once the bar's own width drops below `collapseAt` (px) it
 * collapses for mobile: the header stays visible, a menu toggle appears at
 * the far end, and the items + trailing content move into a stacked panel
 * below the bar that the toggle opens and closes. The bar measures itself
 * (not the viewport), so it collapses correctly inside any container. The
 * toggle's icon defaults to a hamburger glyph and can be replaced via the
 * `menu-icon` slot.
 */
import { computed, onBeforeUnmount, onMounted, ref, useId, watch } from "vue";

const props = withDefaults(
  defineProps<{
    /** Lays the bar out as a vertical side nav (col) or a horizontal top/bottom bar (row). */
    direction?: "row" | "col";
    /** Overrides the bar's background color (any valid CSS color). */
    backgroundColor?: string;
    /** Overrides the bar's border color (any valid CSS color). Use "transparent" to remove the border. */
    borderColor?: string;
    /** Width in px below which a row bar collapses its items and trailing content behind a menu toggle. Set to 0 to never collapse. Ignored in col layout. */
    collapseAt?: number;
    /** Accessible name for the mobile menu toggle button. */
    menuLabel?: string;
  }>(),
  {
    direction: "col",
    backgroundColor: undefined,
    borderColor: undefined,
    collapseAt: 640,
    menuLabel: "Toggle navigation menu"
  }
);

const emit = defineEmits<{
  /** Fires when the collapsed (mobile) menu opens or closes, with the new open state. */
  "gn-menu-toggle": [open: boolean];
}>();

const generatedId = `${useId()}-${instanceCount++}`;
const itemsId = `${generatedId}-items`;
const trailingId = `${generatedId}-trailing`;

const root = ref<HTMLElement | null>(null);
const width = ref<number | null>(null);
const menuOpen = ref(false);

const collapsed = computed(
  () => props.direction === "row" && width.value !== null && width.value < props.collapseAt
);

const style = computed(() => {
  const overrides: Record<string, string> = {};
  if (props.backgroundColor) overrides["--gn-nav-bar-background"] = props.backgroundColor;
  if (props.borderColor) overrides["--gn-nav-bar-border"] = props.borderColor;
  return Object.keys(overrides).length ? overrides : undefined;
});

function setMenuOpen(open: boolean) {
  if (menuOpen.value === open) return;
  menuOpen.value = open;
  emit("gn-menu-toggle", open);
}

// Expanding back past the breakpoint (e.g. rotating a phone to landscape)
// shouldn't leave a stale "open" state behind for the next collapse.
watch(collapsed, (isCollapsed) => {
  if (!isCollapsed) setMenuOpen(false);
});

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && menuOpen.value) setMenuOpen(false);
}

// Picking a nav item in the mobile panel is a navigation, so close the
// panel behind it. Trailing content (e.g. a search field) stays open.
function handleItemsClick() {
  if (collapsed.value) setMenuOpen(false);
}

let observer: ResizeObserver | undefined;

onMounted(() => {
  if (!root.value) return;
  // Measure once synchronously so a narrow screen never flashes the
  // desktop layout before the first ResizeObserver callback.
  width.value = root.value.getBoundingClientRect().width;
  if (typeof ResizeObserver === "undefined") return;
  observer = new ResizeObserver((entries) => {
    width.value = entries[0].contentRect.width;
  });
  observer.observe(root.value);
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <div
    ref="root"
    class="gn-navigation-bar"
    :class="[
      direction === 'row' ? 'gn-navigation-bar--row' : 'gn-navigation-bar--col',
      { 'gn-navigation-bar--collapsed': collapsed, 'gn-navigation-bar--open': collapsed && menuOpen }
    ]"
    :style="style"
    @keydown="handleKeydown"
  >
    <div v-if="$slots.header" class="gn-navigation-bar__header">
      <slot name="header" />
    </div>

    <button
      v-if="collapsed && ($slots.items || $slots.trailing)"
      class="gn-navigation-bar__toggle"
      type="button"
      :aria-label="menuLabel"
      :aria-expanded="menuOpen"
      :aria-controls="[$slots.items && itemsId, $slots.trailing && trailingId].filter(Boolean).join(' ')"
      @click="setMenuOpen(!menuOpen)"
    >
      <slot name="menu-icon">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path
            :d="menuOpen ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </slot>
    </button>

    <nav v-if="$slots.items" :id="itemsId" class="gn-navigation-bar__items" @click="handleItemsClick">
      <slot name="items" />
    </nav>

    <div v-if="$slots.trailing" :id="trailingId" class="gn-navigation-bar__trailing">
      <slot name="trailing" />
    </div>
  </div>
</template>

<style scoped>
.gn-navigation-bar {
  --gn-nav-bar-background: transparent;
  --gn-nav-bar-border: transparent;
  display: flex;
  gap: 2.0rem;
  background-color: var(--gn-nav-bar-background);
  border: 1px solid var(--gn-nav-bar-border);
  font-family: inherit;
}

.gn-navigation-bar--col {
  flex-direction: column;
  align-items: stretch;
  width: fit-content;
  height: 100%;
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
  gap: 1.0rem;
}

.gn-navigation-bar--col .gn-navigation-bar__items {
  flex-direction: column;
}

.gn-navigation-bar--row .gn-navigation-bar__items {
  flex-direction: row;
}

.gn-navigation-bar__trailing {
  display: flex;
  align-items: center;
  gap: 1.0rem;
}

.gn-navigation-bar--col .gn-navigation-bar__trailing {
  flex-direction: column;
  margin-top: auto;
}

.gn-navigation-bar--row .gn-navigation-bar__trailing {
  flex-direction: row;
  margin-left: auto;
}

/* Collapsed (mobile) row layout: header + toggle on the first line, items
   and trailing content wrap onto full-width stacked rows below it, hidden
   until the toggle opens them. */
.gn-navigation-bar--collapsed {
  flex-wrap: wrap;
  row-gap: 0.75rem;
}

.gn-navigation-bar__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  margin-left: auto;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 9999px;
  background: transparent;
  color: var(--gn-nav-bar-toggle-color, #b5b3b3);
  cursor: pointer;
  flex: none;
}

.gn-navigation-bar__toggle:hover {
  background-color: rgba(127, 127, 127, 0.15);
}

.gn-navigation-bar__toggle:focus-visible {
  outline: 2px solid var(--gn-nav-bar-toggle-focus, #f97316);
  outline-offset: 2px;
}

.gn-navigation-bar__toggle :deep(svg) {
  width: 1.25rem;
  height: 1.25rem;
}

.gn-navigation-bar--collapsed .gn-navigation-bar__items,
.gn-navigation-bar--collapsed .gn-navigation-bar__trailing {
  display: none;
  flex-basis: 100%;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 0;
}

.gn-navigation-bar--open .gn-navigation-bar__items,
.gn-navigation-bar--open .gn-navigation-bar__trailing {
  display: flex;
}

.gn-navigation-bar--open .gn-navigation-bar__trailing {
  align-items: stretch;
}
</style>

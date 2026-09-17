<script setup lang="ts">
/**
 * GnDropDownMenu
 *
 * A popover menu that opens when its `trigger` slot is clicked — pass any
 * clickable element (a GnIconButton, a plain button, an avatar, whatever)
 * into `trigger`, and one or more GnDropDownMenuItems (or your own markup)
 * into `items`. Ported from an app-specific `DropDownMenu`/`DropDownItem`
 * pair that had no popover behavior at all — it just rendered its two rows
 * unconditionally, so "closing" it was entirely the consumer's problem
 * (wrapping it in their own `v-if` and wiring their own outside-click
 * listener). This component owns that state itself instead, the same
 * "compose, don't invent" principle as GnConfirmDialog owning its own
 * Escape/outside-click handling rather than leaving it to every consumer to
 * reimplement:
 *
 * ```html
 * <GnDropDownMenu>
 *   <template #trigger>
 *     <GnIconButton label="Options"><font-awesome-icon icon="fa-solid fa-ellipsis-vertical" /></GnIconButton>
 *   </template>
 *   <template #items>
 *     <GnDropDownMenuItem label="Edit Subject" @gn-click="editSubject">
 *       <font-awesome-icon icon="fa-solid fa-pen-to-square" />
 *     </GnDropDownMenuItem>
 *     <GnDropDownMenuItem label="Delete Subject" @gn-click="deleteSubject">
 *       <font-awesome-icon icon="fa-solid fa-x" />
 *     </GnDropDownMenuItem>
 *   </template>
 * </GnDropDownMenu>
 * ```
 *
 * Open/closed state is internal (a plain `ref`, not a `v-model`) — unlike
 * GnTabNavigationBar's "which tab is active" state, which the *consumer*
 * needs to read to drive a subpage, nothing outside this component cares
 * whether the popover happens to be open, so there's no value in forcing
 * every consumer to maintain that boolean themselves. `gn-open`/`gn-close`
 * are still emitted (no payload) for a consumer that wants a side effect
 * (e.g. closing some other panel) without needing to own the state.
 *
 * Closes on: an outside click (`closeOnOutsideClick`), Escape
 * (`closeOnEscape`), or a click bubbling up from inside `items`
 * (`closeOnSelect`) — the last one is a native `click` listener on the
 * items panel itself, not a scoped-slot callback, so it works no matter
 * what's slotted in (GnDropDownMenuItem, a plain `<button>`, anything that
 * dispatches a real click).
 *
 * The `trigger` wrapper deliberately carries no role/ARIA of its own — an
 * earlier version set `role="button"` plus `aria-haspopup`/`aria-expanded`
 * on it directly, which put a real interactive element (GnIconButton's own
 * `<button>`) *inside* another element already marked interactive, an a11y
 * violation this repo's `@storybook/addon-a11y` flagged as "Nested
 * interactive controls". The wrapper only forwards a bubbled click to
 * `toggleMenu`, the same way GnListTile's non-interactive `leading`/
 * `trailing` spans forward slotted content without claiming their own
 * role — actual interactive semantics belong to whatever real element the
 * consumer slots in. `open` is passed through the `trigger` slot's scope
 * so a consumer who wants `aria-expanded` on their own trigger element can
 * wire it up themselves: `<template #trigger="{ open }">`.
 */
import { computed, onMounted, onUnmounted, ref } from "vue";

const props = withDefaults(
  defineProps<{
    /** Disables the trigger and prevents the menu from opening. */
    disabled?: boolean;
    /** Aligns the popover panel to the left or right edge of the trigger. */
    align?: "left" | "right";
    /** Whether clicking outside the trigger/panel closes the menu. */
    closeOnOutsideClick?: boolean;
    /** Whether pressing Escape closes the menu. */
    closeOnEscape?: boolean;
    /** Whether a click inside the `items` slot closes the menu. */
    closeOnSelect?: boolean;
    /** Overrides the panel's background color (any valid CSS color). */
    backgroundColor?: string;
    /** Overrides the panel's border color (any valid CSS color). Use "transparent" to remove the border. */
    borderColor?: string;
  }>(),
  {
    disabled: false,
    align: "left",
    closeOnOutsideClick: true,
    closeOnEscape: true,
    closeOnSelect: true,
    backgroundColor: undefined,
    borderColor: undefined
  }
);

const emit = defineEmits<{
  /** Fires when the menu opens. */
  "gn-open": [];
  /** Fires when the menu closes, regardless of what caused it. */
  "gn-close": [];
}>();

const open = ref(false);
const rootRef = ref<HTMLDivElement | null>(null);

function openMenu() {
  if (props.disabled || open.value) return;
  open.value = true;
  emit("gn-open");
}

function closeMenu() {
  if (!open.value) return;
  open.value = false;
  emit("gn-close");
}

function toggleMenu() {
  if (open.value) closeMenu();
  else openMenu();
}

function handleItemsClick() {
  if (props.closeOnSelect) closeMenu();
}

function handleDocumentClick(event: MouseEvent) {
  if (!props.closeOnOutsideClick || !open.value) return;
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) closeMenu();
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && props.closeOnEscape) closeMenu();
}

onMounted(() => {
  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("click", handleDocumentClick);
  document.removeEventListener("keydown", handleKeydown);
});

const style = computed(() => {
  const overrides: Record<string, string> = {};
  if (props.backgroundColor) overrides["--gn-dropdown-menu-background"] = props.backgroundColor;
  if (props.borderColor) overrides["--gn-dropdown-menu-border"] = props.borderColor;
  return Object.keys(overrides).length ? overrides : undefined;
});
</script>

<template>
  <div ref="rootRef" class="gn-dropdown-menu">
    <div
      class="gn-dropdown-menu__trigger"
      :class="{ 'gn-dropdown-menu__trigger--disabled': disabled }"
      @click="toggleMenu"
    >
      <slot name="trigger" :open="open" />
    </div>

    <div
      v-if="open"
      class="gn-dropdown-menu__panel"
      :class="[`gn-dropdown-menu__panel--${align}`]"
      :style="style"
      role="menu"
      @click="handleItemsClick"
    >
      <slot name="items" />
    </div>
  </div>
</template>

<style scoped>
.gn-dropdown-menu {
  position: relative;
  display: inline-flex;
  font-family: inherit;
}

.gn-dropdown-menu__trigger {
  display: inline-flex;
  cursor: pointer;
}

.gn-dropdown-menu__trigger--disabled {
  cursor: not-allowed;
  opacity: 0.5;
  pointer-events: none;
}

.gn-dropdown-menu__panel {
  --gn-dropdown-menu-background: #ffffff;
  --gn-dropdown-menu-border: #e5e7eb;
  position: absolute;
  top: calc(100% + 0.25rem);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  min-width: 10rem;
  padding: 0.25rem;
  background-color: var(--gn-dropdown-menu-background);
  border: 1px solid var(--gn-dropdown-menu-border);
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.gn-dropdown-menu__panel--left {
  left: 0;
}

.gn-dropdown-menu__panel--right {
  right: 0;
}
</style>

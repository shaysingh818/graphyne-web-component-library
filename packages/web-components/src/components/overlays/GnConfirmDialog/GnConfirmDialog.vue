<script lang="ts">
// Module scope (runs once per module load, NOT per component instance —
// see the identical pattern/reasoning in GnFormDropDownField.vue) so this
// counter stays unique even when multiple separate Vue apps mount the
// component on the same page (e.g. Storybook's docs view).
let instanceCount = 0;
</script>

<script setup lang="ts">
/**
 * GnConfirmDialog
 *
 * A yes/no confirmation modal. Ported from an app-specific `ConfirmDialog`
 * that imported bespoke `PrimaryButton`/`SecondaryButton` components from a
 * local `shared/buttons` folder that doesn't exist in this library — those
 * are replaced with this library's own `GnButton` (`variant="secondary"`
 * for cancel, `variant="primary"` for confirm), the same "compose, don't
 * invent" principle GnNavigationBar/the SettingsDashboard page already use
 * for GnIconButton rather than reinventing button markup.
 *
 * Several other things changed from the original, all deliberate:
 * - `text` → `message`; hardcoded "Yes"/"No" labels → `confirmLabel`/
 *   `cancelLabel` props; native `close`/`confirm` emits → namespaced
 *   `gn-cancel`/`gn-confirm` (a plain `close`/`confirm` event name risks
 *   colliding with real DOM events once this compiles to a custom element).
 * - The original was a plain absolutely-positioned `<div>` with none of the
 *   behavior a modal is expected to have. Added: `closeOnEscape` (Escape
 *   key fires `gn-cancel`), `closeOnOverlayClick` (clicking the backdrop,
 *   not the box itself, fires `gn-cancel`), initial focus moved to the
 *   confirm button on mount, and `role="dialog"` / `aria-modal` /
 *   `aria-describedby` — this repo runs `@storybook/addon-a11y`, which
 *   would otherwise flag a modal with zero ARIA semantics.
 * - Default theme flipped dark → white/light, same as GnBackBar and the
 *   chart components earlier — `backgroundColor`/`borderColor`/`textColor`
 *   override the box, `overlayColor` independently overrides the backdrop
 *   (a real, separate visual element here), and `color` forwards straight
 *   through to both `GnButton`s' own `color` prop for the accent.
 * - `width: 50%` on the original box would be enormous on a wide desktop
 *   screen; replaced with `width: min(90%, 28rem)`.
 */
import { computed, onMounted, onUnmounted, ref, useId } from "vue";
import { GnButton } from "../../buttons";

const props = withDefaults(
  defineProps<{
    /** Message shown in the dialog body. */
    message: string;
    /** Label for the confirm button. */
    confirmLabel?: string;
    /** Label for the cancel button. */
    cancelLabel?: string;
    /** Whether pressing Escape fires `gn-cancel`. */
    closeOnEscape?: boolean;
    /** Whether clicking the backdrop (outside the dialog box) fires `gn-cancel`. */
    closeOnOverlayClick?: boolean;
    /** Overrides the accent color used by both buttons (any valid CSS color). Forwarded directly to GnButton's own `color` prop. */
    color?: string;
    /** Overrides the dialog box's background color (any valid CSS color). */
    backgroundColor?: string;
    /** Overrides the dialog box's border color (any valid CSS color). Use "transparent" to remove the border. */
    borderColor?: string;
    /** Overrides the message text color (any valid CSS color). */
    textColor?: string;
    /** Overrides the backdrop color behind the dialog box (any valid CSS color, typically translucent). */
    overlayColor?: string;
  }>(),
  {
    confirmLabel: "Yes",
    cancelLabel: "No",
    closeOnEscape: true,
    closeOnOverlayClick: true,
    color: undefined,
    backgroundColor: undefined,
    borderColor: undefined,
    textColor: undefined,
    overlayColor: undefined
  }
);

const emit = defineEmits<{
  /** Fires on Cancel click, Escape (if `closeOnEscape`), or a backdrop click (if `closeOnOverlayClick`). */
  "gn-cancel": [];
  /** Fires when the Confirm button is clicked. */
  "gn-confirm": [];
}>();

const generatedId = `gn-confirm-dialog-message-${useId()}-${instanceCount++}`;
const dialogRef = ref<HTMLDivElement | null>(null);

const style = computed(() => {
  const overrides: Record<string, string> = {};
  if (props.backgroundColor) overrides["--gn-confirm-dialog-background"] = props.backgroundColor;
  if (props.borderColor) overrides["--gn-confirm-dialog-border"] = props.borderColor;
  if (props.textColor) overrides["--gn-confirm-dialog-text-color"] = props.textColor;
  if (props.overlayColor) overrides["--gn-confirm-dialog-overlay"] = props.overlayColor;
  return Object.keys(overrides).length ? overrides : undefined;
});

function handleCancel() {
  emit("gn-cancel");
}

function handleConfirm() {
  emit("gn-confirm");
}

function handleOverlayClick() {
  // Only reachable when the click didn't originate inside the box, since
  // the box's own click handler stops propagation.
  if (props.closeOnOverlayClick) handleCancel();
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && props.closeOnEscape) handleCancel();
}

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
  dialogRef.value?.querySelector<HTMLButtonElement>(".gn-confirm-dialog__actions button:last-child")?.focus();
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <div class="gn-confirm-dialog-overlay" :style="style" @click="handleOverlayClick">
    <div
      ref="dialogRef"
      class="gn-confirm-dialog"
      role="dialog"
      aria-modal="true"
      :aria-describedby="generatedId"
      @click.stop
    >
      <p :id="generatedId" class="gn-confirm-dialog__message">{{ message }}</p>
      <div class="gn-confirm-dialog__actions">
        <GnButton variant="secondary" :color="color" @gn-click="handleCancel">{{ cancelLabel }}</GnButton>
        <GnButton variant="primary" :color="color" @gn-click="handleConfirm">{{ confirmLabel }}</GnButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gn-confirm-dialog-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--gn-confirm-dialog-overlay, rgba(0, 0, 0, 0.5));
  z-index: 1000;
}

.gn-confirm-dialog {
  /*
   * No flat --gn-confirm-dialog-* redeclarations here on purpose — the
   * overrides land via :style on the ancestor .gn-confirm-dialog-overlay
   * element (see the style computed in <script setup>), and custom
   * properties are inherited down to this box. Redeclaring a flat default
   * value on THIS element (rather than only as the second var() argument)
   * would win over that inherited value regardless of what the consumer
   * passed in — the exact bug documented in packages/web-components/CLAUDE.md's
   * "four-variable color override" section.
   */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  width: min(90%, 28rem);
  padding: 1.25rem;
  background-color: var(--gn-confirm-dialog-background, #ffffff);
  border: 1px solid var(--gn-confirm-dialog-border, #e5e7eb);
  border-radius: 0.5rem;
  font-family: inherit;
  box-sizing: border-box;
}

.gn-confirm-dialog__message {
  margin: 0;
  color: var(--gn-confirm-dialog-text-color, #111827);
  font-size: 0.875rem;
  text-align: center;
}

.gn-confirm-dialog__actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
</style>

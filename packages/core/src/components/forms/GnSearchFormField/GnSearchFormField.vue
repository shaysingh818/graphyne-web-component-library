<script setup lang="ts">
/**
 * GnSearchFormField
 *
 * A labeled text input with `v-model` support and an optional inline error
 * message. Colors are split into independent overrides rather than a
 * single accent (unlike GnButton / GnIconButton, where one color drives
 * every variant): `color` only affects the focus ring, while
 * `backgroundColor`, `textColor`, and `borderColor` restyle the field
 * itself — e.g. a dark, borderless search field can be reproduced with
 * `backgroundColor="rgb(28 25 23)"` and `textColor="#f97316"`. The search
 * button shares `backgroundColor`/`borderColor`/`color` with the input by
 * default; pass `buttonBackgroundColor` to give it a distinct background
 * (e.g. a solid accent-colored button next to a plain input). Emits both
 * `update:modelValue` (so `v-model` works in Vue) and a namespaced
 * `gn-update` event carrying the raw string value, since `v-model` doesn't
 * cross the custom-element boundary on its own once this compiles to a
 * native element.
 */
import { computed, useId } from "vue";

const props = withDefaults(
  defineProps<{
    /** Current value; bind with `v-model`. */
    modelValue?: string;
    /** Visible label rendered above the field. */
    label?: string;
    /** Placeholder shown when the field is empty. */
    placeholder?: string;
    /** Disables the field and prevents input/change events from firing. */
    disabled?: boolean;
    /** Overrides the accent color used for the focus ring (any valid CSS color). */
    color?: string;
    /** Overrides the input field's background color (any valid CSS color). */
    backgroundColor?: string;
    /** Overrides the color of the text typed into the field (any valid CSS color). */
    textColor?: string;
    /** Overrides the field's border color (any valid CSS color). Use "transparent" to remove the border. */
    borderColor?: string;
    /** Overrides the search button's background color independently of the input's `backgroundColor` (any valid CSS color). Falls back to `backgroundColor` when unset. */
    buttonBackgroundColor?: string;
    /** Validation message; when set, renders below the field and marks it invalid. */
    error?: string;
    /** Overrides the auto-generated id (useful if an external <label> needs to target it). */
    id?: string;
  }>(),
  {
    modelValue: "",
    label: undefined,
    placeholder: undefined,
    type: "text",
    disabled: false,
    color: undefined,
    backgroundColor: undefined,
    textColor: undefined,
    borderColor: undefined,
    buttonBackgroundColor: undefined,
    error: undefined,
    id: undefined
  }
);

const emit = defineEmits<{
  /** Standard v-model event. */
  "update:modelValue": [value: string];
  /** Fires on input, unless the field is disabled. Carries the new value. */
  "gn-update": [payload: string];
  /** Fires when the search button is clicked or Enter is pressed, unless the field is disabled. Carries the current value. */
  "gn-search": [payload: string];
}>();

const generatedId = useId();
const inputId = computed(() => props.id ?? generatedId);
const errorId = computed(() => `${inputId.value}-error`);

const style = computed(() => {
  const overrides: Record<string, string> = {};
  if (props.color) overrides["--gn-input-accent"] = props.color;
  if (props.backgroundColor) overrides["--gn-input-background"] = props.backgroundColor;
  if (props.textColor) overrides["--gn-input-text-color"] = props.textColor;
  if (props.borderColor) overrides["--gn-input-border"] = props.borderColor;
  if (props.buttonBackgroundColor) overrides["--gn-search-button-background"] = props.buttonBackgroundColor;
  return Object.keys(overrides).length ? overrides : undefined;
});

function handleInput(event: Event) {
  if (props.disabled) return;
  const value = (event.target as HTMLInputElement).value;
  emit("update:modelValue", value);
  emit("gn-update", value);
}

function handleSearch() {
  if (props.disabled) return;
  emit("gn-search", props.modelValue);
}
</script>


<template>
<div class="gn-search-form-field" :style="style">
    <div class="gn-search-form-field__row">
      <div class="gn-search-form-input-field">
        <input
          :id="inputId"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :aria-invalid="error ? 'true' : undefined"
          :aria-describedby="error ? errorId : undefined"
          class="gn-form-input-field__input"
          @input="handleInput"
          @keyup.enter="handleSearch"
        />
      </div>
      <button
        type="button"
        class="gn-search-form-field__button"
        :disabled="disabled"
        aria-label="Search"
        @click="handleSearch"
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2" />
          <line x1="16.65" y1="16.65" x2="21" y2="21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
    </div>
    <p v-if="error" :id="errorId" class="gn-form-input-field__error">{{ error }}</p>
</div>
</template>

<style scoped>

.gn-search-form-field {
  --gn-input-accent: #f97316;
  --gn-input-background: #ffffff;
  --gn-input-text-color: #111827;
  --gn-input-border: #d1d5db;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  font-family: inherit;
}

.gn-search-form-field__row {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 0.5rem;
}

.gn-search-form-input-field {
  flex: 1;
  display: flex;
}

.gn-form-input-field__input {
  width: 100%;
  font-family: inherit;
  font-size: 0.9375rem;
  line-height: 1.2;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid var(--gn-input-border);
  background-color: var(--gn-input-background);
  color: var(--gn-input-text-color);
  transition: border-color 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
}

.gn-form-input-field__input::placeholder {
  color: #9ca3af;
}

.gn-form-input-field__input:focus-visible {
  outline: none;
  border-color: var(--gn-input-accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--gn-input-accent) 25%, transparent);
}

.gn-form-input-field__input:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.gn-form-input-field__input[aria-invalid="true"] {
  border-color: #dc2626;
}

.gn-form-input-field__input[aria-invalid="true"]:focus-visible {
  box-shadow: 0 0 0 3px color-mix(in srgb, #dc2626 25%, transparent);
}

.gn-search-form-field__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 2.375rem;
  padding: 0;
  border-radius: 0.375rem;
  border: 1px solid var(--gn-input-border);
  background-color: var(--gn-search-button-background, var(--gn-input-background));
  color: var(--gn-input-accent);
  cursor: pointer;
  transition: background-color 120ms ease, border-color 120ms ease, opacity 120ms ease;
}

.gn-search-form-field__button svg {
  width: 1.125rem;
  height: 1.125rem;
}

.gn-search-form-field__button:not(:disabled):hover {
  background-color: color-mix(in srgb, var(--gn-search-button-background, var(--gn-input-background)) 88%, var(--gn-input-accent));
}

.gn-search-form-field__button:focus-visible {
  outline: none;
  border-color: var(--gn-input-accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--gn-input-accent) 25%, transparent);
}

.gn-search-form-field__button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.gn-form-input-field__error {
  font-size: 0.8125rem;
  line-height: 1.2;
  color: #dc2626;
  margin: 0;
}
</style>

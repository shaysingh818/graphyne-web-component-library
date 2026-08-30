<script setup lang="ts">
/**
 * GnFormTextField
 *
 * A labeled multi-line textarea with `v-model` support and an optional
 * inline error message. Mirrors GnFormInputField's API and color-override
 * conventions rather than a single accent (unlike GnButton / GnIconButton,
 * where one color drives every variant): `color` only affects the focus
 * ring, while `backgroundColor`, `textColor`, and `borderColor` restyle the
 * field itself — e.g. a dark, borderless text field can be reproduced with
 * `backgroundColor="rgb(28 25 23)"` and `textColor="#f97316"`. Emits both
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
    /** Number of visible text rows. */
    rows?: number;
    /** Disables the field and prevents input/change events from firing. */
    disabled?: boolean;
    /** Overrides the accent color used for the focus ring (any valid CSS color). */
    color?: string;
    /** Overrides the field's background color (any valid CSS color). */
    backgroundColor?: string;
    /** Overrides the color of the text typed into the field (any valid CSS color). */
    textColor?: string;
    /** Overrides the field's border color (any valid CSS color). Use "transparent" to remove the border. */
    borderColor?: string;
    /** Validation message; when set, renders below the field and marks it invalid. */
    error?: string;
    /** Overrides the auto-generated id (useful if an external <label> needs to target it). */
    id?: string;
  }>(),
  {
    modelValue: "",
    label: undefined,
    placeholder: undefined,
    rows: 4,
    disabled: false,
    color: undefined,
    backgroundColor: undefined,
    textColor: undefined,
    borderColor: undefined,
    error: undefined,
    id: undefined
  }
);

const emit = defineEmits<{
  /** Standard v-model event. */
  "update:modelValue": [value: string];
  /** Fires on input, unless the field is disabled. Carries the new value. */
  "gn-update": [payload: string];
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
  return Object.keys(overrides).length ? overrides : undefined;
});

function handleInput(event: Event) {
  if (props.disabled) return;
  const value = (event.target as HTMLTextAreaElement).value;
  emit("update:modelValue", value);
  emit("gn-update", value);
}
</script>

<template>
  <div class="gn-form-text-field" :style="style">
    <label v-if="label" :for="inputId" class="gn-form-text-field__label">{{ label }}</label>
    <textarea
      :id="inputId"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error ? errorId : undefined"
      class="gn-form-text-field__textarea"
      @input="handleInput"
    ></textarea>
    <p v-if="error" :id="errorId" class="gn-form-text-field__error">{{ error }}</p>
  </div>
</template>

<style scoped>

.gn-form-text-field {
  --gn-input-accent: #f97316;
  --gn-input-background: #ffffff;
  --gn-input-text-color: #111827;
  --gn-input-border: #d1d5db;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  font-family: inherit;
}

.gn-form-text-field__label {
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.2;
  color: #374151;
}

.gn-form-text-field__textarea {
  font-family: inherit;
  font-size: 0.9375rem;
  line-height: 1.4;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid var(--gn-input-border);
  background-color: var(--gn-input-background);
  color: var(--gn-input-text-color);
  resize: vertical;
  transition: border-color 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
}

.gn-form-text-field__textarea::placeholder {
  color: #9ca3af;
}

.gn-form-text-field__textarea:focus-visible {
  outline: none;
  border-color: var(--gn-input-accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--gn-input-accent) 25%, transparent);
}

.gn-form-text-field__textarea:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.gn-form-text-field__textarea[aria-invalid="true"] {
  border-color: #dc2626;
}

.gn-form-text-field__textarea[aria-invalid="true"]:focus-visible {
  box-shadow: 0 0 0 3px color-mix(in srgb, #dc2626 25%, transparent);
}

.gn-form-text-field__error {
  font-size: 0.8125rem;
  line-height: 1.2;
  color: #dc2626;
  margin: 0;
}
</style>

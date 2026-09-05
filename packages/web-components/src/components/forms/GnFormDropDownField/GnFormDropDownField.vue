<script lang="ts">
// Module scope (runs once per module load, NOT per component instance) so this
// counter stays unique even when multiple separate Vue apps mount the component
// on the same page (e.g. Storybook's docs view), where each app's own useId()
// counter independently restarts at "v-0".
let instanceCount = 0;
</script>

<script setup lang="ts">
import { computed, useId } from "vue";

const props = withDefaults(
  defineProps<{    
    /** Overrides the auto-generated id (useful if an external <label> needs to target it). */
    id?: string;
    /** Current value; bind with `v-model`. */
    modelValue?: string;
    /** Visible label rendered above the field. */
    label?: string;
    /** Options to select from for field  */
    options?: Array<{ label: string; value: string; }>;
    /** Background color for the focus ring of the field  */
    color?: string;    
    /** Overrides the input field's background color (any valid CSS color). */
    backgroundColor?: string;
    /** Overrides the color of the text typed into the field (any valid CSS color). */
    textColor?: string;
    /** Overrides the field's border color (any valid CSS color). Use "transparent" to remove the border. */
    borderColor?: string;
  }>(),
  {
    modelValue: "",
    label: undefined,
    options: () => [
      { label: "Option A", value: "a" },
      { label: "Option B", value: "b" },
      { label: "Option C", value: "c" },
    ],
    backgroundColor: "#ffffff"
  }
);

const emit = defineEmits<{
  /** Standard v-model event. */
  "update:modelValue": [value: string];
  /** Fires on input, unless the field is disabled. Carries the new value. */
  "gn-update": [payload: string];
}>();

const generatedId = `${useId()}-${instanceCount++}`;
const inputId = computed(() => props.id ?? generatedId);

const style = computed(() => {
  // Unique per instance so multiple dropdowns on the same page don't fight
  // over which button a popover is anchored to (anchor-name is a page-wide
  // identifier, not scoped by Vue's `scoped` styles).
  const overrides: Record<string, string> = {
    "--gn-dropdown-anchor-name": `--gn-dropdown-trigger-${inputId.value}`,
  };
  if (props.color) overrides["--gn-dropdown-accent"] = props.color;
  if (props.backgroundColor) overrides["--gn-dropdown-background"] = props.backgroundColor;
  if (props.textColor) overrides["--gn-dropdown-text-color"] = props.textColor;
  if (props.borderColor) overrides["--gn-dropdown-border"] = props.borderColor;
  return overrides;
});

const selectedLabel = computed(() =>
  props.options.find(o => o.value === props.modelValue)?.label ?? "Choose an option"
);

function selectItem(value: string) {
  emit("update:modelValue", value);
  emit("gn-update", value);
}
</script>

<template>
    <div class="flex flex-col gap-2" :style="style">
        <label v-if="label" :for="inputId">{{ label }}</label>
        <button :id="inputId" :popovertarget="`gn-dropdown-list-${inputId}`">{{ selectedLabel }} </button>
        <div class="gap-6" :id="`gn-dropdown-list-${inputId}`" popover role="listbox" style="padding: 15px;">
            <p
              v-for="option in options"
              :key="option.value"
              role="option"
              @click="selectItem(option.value)"
            >
              {{ option.label }}
            </p>
        </div>
    </div>
</template>

<style scoped>

label {
    font-size: 0.8125rem;
    font-weight: 600;
    line-height: 1.2;
    color: #374151;
}

button {
    anchor-name: var(--gn-dropdown-anchor-name);
    padding: 10px;
    color: var(--gn-dropdown-text-color, var(--gn-dropdown-accent, #f97316));
    font-size: 15px;
    border-radius: 10px;
    background-color: var(--gn-dropdown-background, #ffffff);
    border: 1px solid var(--gn-dropdown-border, #d1d5db);
}

[popover] {
    width: anchor-size(width);
    position-anchor: var(--gn-dropdown-anchor-name);
    position-area: bottom;      /* sits directly below the anchor, matching its width alignment */
    margin-top: 0.25rem;        /* small gap between button and list */
    border-radius: 0.5rem;
    border: 1px solid var(--gn-dropdown-border, #d1d5db);
    box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
    padding: 0.25rem;
    margin: 0;
    background-color: var(--gn-dropdown-background);
    color: var(--gn-dropdown-text-color)
}

[popover]:popover-open {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

[role="option"][aria-selected="true"] {
    background-color: color-mix(in srgb, var(--gn-dropdown-accent, #f97316) 20%, white);
    font-weight: 600;
}
[role="option"]:hover {
    background-color: color-mix(in srgb, var(--gn-dropdown-accent, #f97316) 12%, white);
}

</style>
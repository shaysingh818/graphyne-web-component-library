<script setup lang="ts">
/**
 * GnFileUploadField
 *
 * A framework-agnostic file upload dropzone with `v-model` support. Selection
 * happens through a visually-hidden native `<input type="file">` (click-to-browse)
 * plus native HTML5 drag-and-drop onto the zone — deliberately not a
 * platform-specific file dialog (e.g. Tauri's `@tauri-apps/plugin-dialog`), so
 * the same component works in a plain browser app, an Electron/Tauri webview,
 * or anywhere else a DOM exists. `modelValue` is a plain `File[]`; image files
 * get a live thumbnail via `URL.createObjectURL` (revoked on removal/unmount
 * to avoid leaking blob URLs), non-image files fall back to a generic file
 * glyph. Files are de-duplicated by name+size+lastModified so re-selecting or
 * re-dropping the same file is a no-op. Colors follow the four-variable
 * override pattern used across the library, in their own `--gn-file-upload-*`
 * namespace since this is visually distinct from `GnFormInputField`. Emits
 * `update:modelValue` (so `v-model` works in Vue) and a namespaced `gn-update`
 * carrying the full new `File[]`, since `v-model` doesn't cross the
 * custom-element boundary once this compiles to a native element; a single
 * removal additionally emits `gn-remove` with just the removed `File`.
 */
import { computed, onBeforeUnmount, ref, useId, watch } from "vue";

const props = withDefaults(
  defineProps<{
    /** Currently selected files; bind with `v-model`. */
    modelValue?: File[];
    /** Visible label rendered above the dropzone. */
    label?: string;
    /** Forwarded to the native file input's `accept` attribute. */
    accept?: string;
    /** Allows selecting/dropping more than one file at a time. */
    multiple?: boolean;
    /** Disables the dropzone and prevents selection/removal from firing. */
    disabled?: boolean;
    /** Overrides the accent color used for the dropzone border/icon on hover and drag-over (any valid CSS color). */
    color?: string;
    /** Overrides the dropzone's background color (any valid CSS color). */
    backgroundColor?: string;
    /** Overrides the color of the prompt text and file names (any valid CSS color). */
    textColor?: string;
    /** Overrides the dropzone's border color (any valid CSS color). Use "transparent" to remove the border. */
    borderColor?: string;
    /** Validation message; when set, renders below the field and marks it invalid. */
    error?: string;
    /** Overrides the auto-generated id (useful if an external <label> needs to target it). */
    id?: string;
  }>(),
  {
    modelValue: () => [],
    label: undefined,
    accept: "image/*",
    multiple: true,
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
  /** Standard v-model event. Carries the full new list of files. */
  "update:modelValue": [value: File[]];
  /** Fires on any add or remove, unless the field is disabled. Carries the full new list of files. */
  "gn-update": [payload: File[]];
  /** Fires when a single file is removed, unless the field is disabled. Carries just that file. */
  "gn-remove": [payload: File];
}>();

const generatedId = useId();
const inputId = computed(() => props.id ?? generatedId);
const errorId = computed(() => `${inputId.value}-error`);

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);

const style = computed(() => {
  const overrides: Record<string, string> = {};
  if (props.color) overrides["--gn-file-upload-accent"] = props.color;
  if (props.backgroundColor) overrides["--gn-file-upload-background"] = props.backgroundColor;
  if (props.textColor) overrides["--gn-file-upload-text-color"] = props.textColor;
  if (props.borderColor) overrides["--gn-file-upload-border"] = props.borderColor;
  return Object.keys(overrides).length ? overrides : undefined;
});

function fileKey(file: File): string {
  return `${file.name}::${file.size}::${file.lastModified}`;
}

function dedupe(files: File[]): File[] {
  const seen = new Map<string, File>();
  for (const file of files) {
    const key = fileKey(file);
    if (!seen.has(key)) seen.set(key, file);
  }
  return [...seen.values()];
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  return `${value % 1 === 0 ? value : value.toFixed(1)} ${units[unitIndex]}`;
}

function isImage(file: File): boolean {
  return file.type.startsWith("image/");
}

// Object URLs for image previews, keyed by fileKey(), reconciled whenever
// modelValue changes so we only ever hold URLs for files that are still selected.
const previewUrls = ref(new Map<string, string>());

watch(
  () => props.modelValue,
  (files) => {
    const nextKeys = new Set(files.map(fileKey));

    for (const [key, url] of previewUrls.value) {
      if (!nextKeys.has(key)) {
        URL.revokeObjectURL(url);
        previewUrls.value.delete(key);
      }
    }

    for (const file of files) {
      const key = fileKey(file);
      if (!previewUrls.value.has(key) && isImage(file)) {
        previewUrls.value.set(key, URL.createObjectURL(file));
      }
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  for (const url of previewUrls.value.values()) URL.revokeObjectURL(url);
  previewUrls.value.clear();
});

function previewSrc(file: File): string | undefined {
  return previewUrls.value.get(fileKey(file));
}

function emitUpdate(files: File[]) {
  emit("update:modelValue", files);
  emit("gn-update", files);
}

function addFiles(newFiles: File[]) {
  if (props.disabled || newFiles.length === 0) return;
  const merged = props.multiple ? dedupe([...props.modelValue, ...newFiles]) : dedupe(newFiles).slice(0, 1);
  emitUpdate(merged);
}

function openPicker() {
  if (props.disabled) return;
  fileInput.value?.click();
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  openPicker();
}

function handleChange(event: Event) {
  const input = event.target as HTMLInputElement;
  addFiles(Array.from(input.files ?? []));
  // Reset so selecting the exact same file(s) again still fires `change`.
  input.value = "";
}

function handleDragOver(event: DragEvent) {
  if (props.disabled) return;
  event.preventDefault();
  isDragging.value = true;
}

function handleDragLeave() {
  isDragging.value = false;
}

function handleDrop(event: DragEvent) {
  event.preventDefault();
  isDragging.value = false;
  if (props.disabled) return;
  addFiles(Array.from(event.dataTransfer?.files ?? []));
}

function removeFile(file: File) {
  if (props.disabled) return;
  const filtered = props.modelValue.filter((f) => fileKey(f) !== fileKey(file));
  emit("gn-remove", file);
  emitUpdate(filtered);
}
</script>

<template>
  <div class="gn-file-upload-field" :style="style">
    <label v-if="label" :for="inputId" class="gn-file-upload-field__label">{{ label }}</label>

    <div
      class="gn-file-upload-field__dropzone"
      :class="{
        'gn-file-upload-field__dropzone--dragging': isDragging,
        'gn-file-upload-field__dropzone--disabled': disabled,
        'gn-file-upload-field__dropzone--invalid': error
      }"
      role="button"
      :tabindex="disabled ? -1 : 0"
      :aria-disabled="disabled ? 'true' : undefined"
      @click="openPicker"
      @keydown="handleKeydown"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <svg class="gn-file-upload-field__icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M12 16V4m0 0-4 4m4-4 4 4"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span class="gn-file-upload-field__prompt">Click to upload or drag and drop</span>

      <input
        :id="inputId"
        ref="fileInput"
        type="file"
        class="gn-file-upload-field__input"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="error ? errorId : undefined"
        tabindex="-1"
        @click.stop
        @change="handleChange"
      />
    </div>

    <ul v-if="modelValue.length" class="gn-file-upload-field__list">
      <li v-for="file in modelValue" :key="fileKey(file)" class="gn-file-upload-field__row">
        <img
          v-if="previewSrc(file)"
          :src="previewSrc(file)"
          alt=""
          class="gn-file-upload-field__thumb"
        />
        <svg
          v-else
          class="gn-file-upload-field__thumb gn-file-upload-field__thumb--generic"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M6 2h9l5 5v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
          <path d="M15 2v5h5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
        </svg>
        <span class="gn-file-upload-field__name">{{ file.name }}</span>
        <span class="gn-file-upload-field__size">{{ formatSize(file.size) }}</span>
        <button
          type="button"
          class="gn-file-upload-field__remove"
          :disabled="disabled"
          :aria-label="`Remove ${file.name}`"
          @click="removeFile(file)"
        >
          ✕
        </button>
      </li>
    </ul>

    <p v-if="error" :id="errorId" class="gn-file-upload-field__error">{{ error }}</p>
  </div>
</template>

<style scoped>

.gn-file-upload-field {
  --gn-file-upload-accent: #f97316;
  --gn-file-upload-background: #ffffff;
  --gn-file-upload-text-color: #111827;
  --gn-file-upload-border: #d1d5db;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-family: inherit;
}

.gn-file-upload-field__label {
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.2;
  color: var(--gn-file-upload-accent);
}

.gn-file-upload-field__dropzone {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
  border: 1.5px dashed var(--gn-file-upload-border);
  border-radius: 0.5rem;
  background-color: var(--gn-file-upload-background);
  color: var(--gn-file-upload-text-color);
  cursor: pointer;
  transition: border-color 120ms ease, background-color 120ms ease, opacity 120ms ease;
}

.gn-file-upload-field__dropzone:hover,
.gn-file-upload-field__dropzone:focus-visible {
  border-color: var(--gn-file-upload-accent);
}

.gn-file-upload-field__dropzone:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--gn-file-upload-accent) 25%, transparent);
}

.gn-file-upload-field__dropzone--dragging {
  border-color: var(--gn-file-upload-accent);
  background-color: color-mix(in srgb, var(--gn-file-upload-background) 88%, var(--gn-file-upload-accent));
}

.gn-file-upload-field__dropzone--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.gn-file-upload-field__dropzone--invalid {
  border-color: #dc2626;
}

.gn-file-upload-field__icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--gn-file-upload-accent);
}

.gn-file-upload-field__prompt {
  font-size: 0.8125rem;
  color: var(--gn-file-upload-text-color);
  text-align: center;
}

.gn-file-upload-field__input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.gn-file-upload-field__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.gn-file-upload-field__row {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.375rem 0.5rem;
  border-radius: 0.375rem;
}

.gn-file-upload-field__thumb {
  flex-shrink: 0;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.25rem;
  object-fit: cover;
}

.gn-file-upload-field__thumb--generic {
  padding: 0.375rem;
  color: var(--gn-file-upload-accent);
  background-color: color-mix(in srgb, var(--gn-file-upload-background) 88%, var(--gn-file-upload-accent));
}

.gn-file-upload-field__name {
  flex-grow: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.8125rem;
  color: var(--gn-file-upload-text-color);
}

.gn-file-upload-field__size {
  flex-shrink: 0;
  font-size: 0.75rem;
  color: color-mix(in srgb, var(--gn-file-upload-text-color) 60%, transparent);
}

.gn-file-upload-field__remove {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.375rem;
  height: 1.375rem;
  padding: 0;
  border: none;
  border-radius: 0.25rem;
  background-color: transparent;
  color: var(--gn-file-upload-text-color);
  font-size: 0.6875rem;
  cursor: pointer;
  transition: background-color 120ms ease, opacity 120ms ease;
}

.gn-file-upload-field__remove:hover:not(:disabled) {
  background-color: color-mix(in srgb, var(--gn-file-upload-background) 85%, var(--gn-file-upload-accent));
}

.gn-file-upload-field__remove:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.gn-file-upload-field__error {
  font-size: 0.8125rem;
  line-height: 1.2;
  color: #dc2626;
  margin: 0;
}
</style>

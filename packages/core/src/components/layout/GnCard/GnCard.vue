<script setup lang="ts">
/**
 * GnCard
 *
 * A second example component showing composition via slots: a default
 * slot for body content and a named `footer` slot, alongside a simple
 * typed prop.
 */
defineProps<{
  /** Optional heading rendered at the top of the card. */
  title?: string;
}>();
</script>

<template>
  <div class="gn-card">
    <header v-if="title" class="gn-card__header">{{ title }}</header>
    <div class="gn-card__body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="gn-card__footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<style scoped>
.gn-card {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: #ffffff;
  font-family: inherit;
}

.gn-card__header {
  padding: 0.75rem 1rem;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.gn-card__body {
  padding: 1rem;
}

.gn-card__footer {
  padding: 0.75rem 1rem;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
}
</style>

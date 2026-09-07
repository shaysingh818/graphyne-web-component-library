<script setup lang="ts">
/**
 * GnMetricCard
 *
 * A compact stat tile for dashboards: a short label above a prominent
 * numeric value, centered in a rounded card. Colors are split into
 * independent overrides — `backgroundColor`, `labelColor`, `valueColor`,
 * and `borderColor` — rather than a single accent, since the label and
 * value are typically styled very differently (e.g. a dark card with a
 * white label and an orange value). The label and value are rendered as
 * `<p>` elements rather than headings, since a dashboard typically shows
 * many of these side by side and they shouldn't compete with the page's
 * actual heading structure.
 */
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /** Label describing the metric, e.g. "Active Users". */
    metric: string;
    /** The numeric value to display prominently. */
    numeric: number;
    /** Overrides the card's background color (any valid CSS color). */
    backgroundColor?: string;
    /** Overrides the metric label's text color (any valid CSS color). */
    labelColor?: string;
    /** Overrides the numeric value's text color (any valid CSS color). */
    valueColor?: string;
    /** Overrides the card's border color (any valid CSS color). Defaults to no visible border. */
    borderColor?: string;
  }>(),
  {
    backgroundColor: undefined,
    labelColor: undefined,
    valueColor: undefined,
    borderColor: undefined
  }
);

const style = computed(() => {
  const overrides: Record<string, string> = {};
  if (props.backgroundColor) overrides["--gn-metric-card-background"] = props.backgroundColor;
  if (props.labelColor) overrides["--gn-metric-card-label-color"] = props.labelColor;
  if (props.valueColor) overrides["--gn-metric-card-value-color"] = props.valueColor;
  if (props.borderColor) overrides["--gn-metric-card-border"] = props.borderColor;
  return Object.keys(overrides).length ? overrides : undefined;
});
</script>

<template>
  <div class="gn-metric-card" :style="style">
    <p class="gn-metric-card__label">{{ metric }}</p>
    <p class="gn-metric-card__value">{{ numeric }}</p>
  </div>
</template>

<style scoped>
.gn-metric-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  text-align: center;
  gap: 0.25rem;
  width: 100%;
  height: 100%;
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid var(--gn-metric-card-border, transparent);
  background-color: var(--gn-metric-card-background, rgb(28 25 23));
  font-family: inherit;
}

.gn-metric-card__label {
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--gn-metric-card-label-color, #ffffff);
}

.gn-metric-card__value {
  margin: 0;
  font-size: 1.5625rem;
  font-weight: 700;
  color: var(--gn-metric-card-value-color, #f97316);
}
</style>

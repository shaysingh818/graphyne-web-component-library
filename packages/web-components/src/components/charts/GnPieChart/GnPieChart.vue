<script lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

// Module scope (runs once per module load, NOT per component instance —
// see the identical comment in GnBarChart.vue) so registering these
// chart.js elements happens exactly once per page.
ChartJS.register(ArcElement, Tooltip, Legend, Title);
</script>

<script setup lang="ts">
/**
 * GnPieChart
 *
 * A pie chart wrapping vue-chartjs/chart.js. Near-identical to
 * GnDoughnutChart (same `ArcElement`, same shape of chart.js data/options,
 * chart.js's own `cutout` default is what actually tells pie vs doughnut
 * apart visually) — the same deviations from the rest of the library
 * apply here for the same reasons (see GnBarChart.vue's JSDoc for the
 * full reasoning): chart.js/vue-chartjs are real `dependencies`, not
 * devDependencies; `labels` and `data` are required with no baked-in
 * sample data; `colors` is a palette array (one color per slice, recycled
 * via modulo) rather than a single accent; `textColor` renders the
 * title/legend text chart.js draws to the `<canvas>` and so can't be a CSS
 * custom property like the rest of the library's color props.
 *
 * Two things were changed from the app-specific `PieChart` this was
 * ported from, not carried forward as-is:
 * - It had separate `titleColor`/`legendColor` props that always defaulted
 *   to the same value. Consolidated into the single `textColor` prop
 *   GnBarChart/GnDoughnutChart/GnLineChart already use, for consistency
 *   across the chart components — nothing in the original ever set them
 *   independently.
 * - Its dataset set `border: 'none'`, which isn't a real chart.js
 *   ArcElement option (`borderWidth`/`borderColor`/`borderAlign` are) —
 *   dead, silently ignored code. The actual no-border behavior it wanted
 *   is expressed here as `borderWidth: 0`, same as GnDoughnutChart.
 */
import { computed } from "vue";
import { Pie } from "vue-chartjs";

const props = withDefaults(
  defineProps<{
    /** Chart title rendered above the plot. Omit (empty string) to hide it entirely. */
    title?: string;
    /** Segment labels, one per slice. Must be the same length as `data`. */
    labels: string[];
    /** Segment values, one per label. Must be the same length as `labels`. */
    data: number[];
    /** Legend/tooltip label for the dataset. */
    datasetLabel?: string;
    /** Segment fill colors (any valid CSS colors), one per slice; recycled via modulo if there are more segments than colors. */
    colors?: string[];
    /** Overrides the card's background color (any valid CSS color). */
    backgroundColor?: string;
    /** Overrides the card's border color (any valid CSS color). Use "transparent" to remove the border. */
    borderColor?: string;
    /** Overrides the title/legend text color drawn on the chart canvas (any valid CSS color). */
    textColor?: string;
    /** Overrides the chart's height (any valid CSS size, e.g. "20rem", "400px"). chart.js needs an explicit height on its container to size the canvas correctly. */
    height?: string;
  }>(),
  {
    title: "Chart title",
    datasetLabel: "Dataset",
    colors: () => ["#f97316", "#fb923c", "#fdba74"],
    backgroundColor: undefined,
    borderColor: undefined,
    textColor: "#111827",
    height: undefined
  }
);

const emit = defineEmits<{
  /** Fires when a segment is clicked. Carries the clicked segment's label, value, and index. */
  "gn-segment-click": [payload: { label: string; value: number; index: number }];
}>();

const style = computed(() => {
  const overrides: Record<string, string> = {};
  if (props.backgroundColor) overrides["--gn-pie-chart-background"] = props.backgroundColor;
  if (props.borderColor) overrides["--gn-pie-chart-border"] = props.borderColor;
  if (props.height) overrides["--gn-pie-chart-height"] = props.height;
  return Object.keys(overrides).length ? overrides : undefined;
});

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.datasetLabel,
      data: props.data,
      backgroundColor: props.data.map((_, index) => props.colors[index % props.colors.length]),
      borderWidth: 0
    }
  ]
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: !!props.title,
      text: props.title,
      color: props.textColor,
      font: { size: 16, weight: "bold" as const },
      padding: { bottom: 10 }
    },
    legend: {
      position: "bottom" as const,
      labels: { color: props.textColor }
    }
  },
  onClick(_event: unknown, elements: Array<{ index: number }>) {
    if (!elements.length) return;
    const index = elements[0].index;
    emit("gn-segment-click", { label: props.labels[index], value: props.data[index], index });
  }
}));
</script>

<template>
  <div class="gn-pie-chart flex items-center justify-center rounded-lg p-6" :style="style">
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.gn-pie-chart {
  --gn-pie-chart-background: #ffffff;
  --gn-pie-chart-border: #e5e7eb;
  --gn-pie-chart-height: 320px;
  position: relative;
  width: 100%;
  height: var(--gn-pie-chart-height);
  background-color: var(--gn-pie-chart-background);
  border: 1px solid var(--gn-pie-chart-border);
  font-family: inherit;
  box-sizing: border-box;
}
</style>

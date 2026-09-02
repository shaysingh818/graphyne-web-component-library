<script lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

// Module scope (runs once per module load, NOT per component instance —
// see the identical comment in GnBarChart.vue) so registering these
// chart.js elements happens exactly once per page.
ChartJS.register(ArcElement, Tooltip, Legend, Title);
</script>

<script setup lang="ts">
/**
 * GnDoughnutChart
 *
 * A doughnut chart wrapping vue-chartjs/chart.js. Sibling to GnBarChart —
 * same deviations from the rest of the library apply here for the same
 * reasons (see GnBarChart.vue's JSDoc for the full reasoning): chart.js /
 * vue-chartjs are real `dependencies`, not devDependencies; `labels` and
 * `data` are required with no baked-in sample data; `colors` is a palette
 * array (one color per segment, recycled via modulo) rather than a single
 * accent; `textColor` renders the title/legend text chart.js draws to the
 * `<canvas>` and so can't be a CSS custom property like the rest of the
 * library's color props.
 *
 * Two bugs in the app-specific `DoughnutChart` this was ported from were
 * fixed rather than carried forward: `reponsive: true` (missing "s") was a
 * silent no-op typo — chart.js ignores unrecognized option keys, so the
 * chart never actually got `responsive: true`; and `chartData.label`
 * (chart.js data objects have `labels` + `datasets`, not a top-level
 * `label`) was dead — chart.js does not read it — so it's dropped here.
 */
import { computed } from "vue";
import { Doughnut } from "vue-chartjs";

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
    colors: () => ["#f97316", "#3d3d3d"],
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
  if (props.backgroundColor) overrides["--gn-doughnut-chart-background"] = props.backgroundColor;
  if (props.borderColor) overrides["--gn-doughnut-chart-border"] = props.borderColor;
  if (props.height) overrides["--gn-doughnut-chart-height"] = props.height;
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
  <div class="gn-doughnut-chart flex items-center justify-center rounded-lg p-6" :style="style">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.gn-doughnut-chart {
  --gn-doughnut-chart-background: #ffffff;
  --gn-doughnut-chart-border: #e5e7eb;
  --gn-doughnut-chart-height: 320px;
  position: relative;
  width: 100%;
  height: var(--gn-doughnut-chart-height);
  background-color: var(--gn-doughnut-chart-background);
  border: 1px solid var(--gn-doughnut-chart-border);
  font-family: inherit;
  box-sizing: border-box;
}
</style>

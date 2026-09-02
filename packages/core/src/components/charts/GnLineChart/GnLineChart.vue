<script lang="ts">
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title, Filler } from "chart.js";

// Module scope (runs once per module load, NOT per component instance —
// see the identical comment in GnBarChart.vue) so registering these
// chart.js elements happens exactly once per page.
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title, Filler);
</script>

<script setup lang="ts">
/**
 * GnLineChart
 *
 * A multi-series line chart wrapping vue-chartjs/chart.js. Sibling to
 * GnBarChart/GnDoughnutChart — the same deviations from the rest of the
 * library apply here for the same reasons (see GnBarChart.vue's JSDoc for
 * the full reasoning): chart.js/vue-chartjs are real `dependencies`, not
 * devDependencies; `labels` and `datasets` are required with no baked-in
 * sample data; `textColor`/`gridColor` render text/gridlines chart.js
 * draws to the `<canvas>` and so can't be CSS custom properties like the
 * rest of the library's color props.
 *
 * Color works differently here than in GnBarChart/GnDoughnutChart, because
 * a line chart's "one color per item" is per-*dataset*, not per-point:
 * each entry in `datasets` may carry its own `color`; entries that omit it
 * fall back to the `colors` palette (recycled via modulo across datasets),
 * matching the original app-specific component's per-dataset `color`
 * field while still giving every chart a sensible default palette.
 *
 * One bug in the app-specific `LineChart` this was ported from was fixed
 * rather than carried forward: it set `fill: true` on every dataset but
 * never gave any of them a `backgroundColor`, so chart.js filled every
 * line with its generic default translucent-black regardless of that
 * line's own color, instead of a tint of it. Each dataset's fill color is
 * now derived from its own `color` at low opacity via chart.js's `color()`
 * helper (which — unlike a plain CSS `color-mix()`/rgba string — can
 * derive a translucent variant of *any* valid CSS color the consumer
 * passes in, not just hex).
 */
import { computed } from "vue";
import { Line } from "vue-chartjs";
import { color as chartColor } from "chart.js/helpers";

const props = withDefaults(
  defineProps<{
    /** Chart title rendered above the plot. Omit (empty string) to hide it entirely. */
    title?: string;
    /** X-axis category labels, shared by every dataset. Each dataset's `data` must be the same length as this. */
    labels: string[];
    /** One or more series to plot. A dataset that omits `color` falls back to the `colors` palette, recycled via modulo. */
    datasets: Array<{ label: string; data: number[]; color?: string }>;
    /** Fallback line-color palette for datasets that don't specify their own `color`; recycled via modulo. */
    colors?: string[];
    /** Curve tension applied to every line (0 = straight segments, chart.js default is 0.4-style easing at higher values). */
    tension?: number;
    /** Point marker radius, in pixels, applied to every line. */
    pointRadius?: number;
    /** Whether to fill the area under every line (tinted from that line's own color). */
    fill?: boolean;
    /** Overrides the card's background color (any valid CSS color). */
    backgroundColor?: string;
    /** Overrides the card's border color (any valid CSS color). Use "transparent" to remove the border. */
    borderColor?: string;
    /** Overrides the title/legend/tick text color drawn on the chart canvas (any valid CSS color). */
    textColor?: string;
    /** Overrides the gridline color drawn on the chart canvas (any valid CSS color, e.g. "rgba(0,0,0,0.1)"). */
    gridColor?: string;
    /** Overrides the chart's height (any valid CSS size, e.g. "20rem", "400px"). chart.js needs an explicit height on its container to size the canvas correctly. */
    height?: string;
  }>(),
  {
    title: "Chart title",
    colors: () => ["#f97316", "#38bdf8", "#34d399"],
    tension: 0.4,
    pointRadius: 4,
    fill: true,
    backgroundColor: undefined,
    borderColor: undefined,
    textColor: "#111827",
    gridColor: "rgba(17, 24, 39, 0.08)",
    height: undefined
  }
);

const emit = defineEmits<{
  /** Fires when a point is clicked. Carries the clicked point's dataset label, x-axis label, value, and both indexes. */
  "gn-point-click": [
    payload: { datasetLabel: string; label: string; value: number; datasetIndex: number; index: number }
  ];
}>();

const style = computed(() => {
  const overrides: Record<string, string> = {};
  if (props.backgroundColor) overrides["--gn-line-chart-background"] = props.backgroundColor;
  if (props.borderColor) overrides["--gn-line-chart-border"] = props.borderColor;
  if (props.height) overrides["--gn-line-chart-height"] = props.height;
  return Object.keys(overrides).length ? overrides : undefined;
});

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets.map((dataset, index) => {
    const lineColor = dataset.color ?? props.colors[index % props.colors.length];
    return {
      label: dataset.label,
      data: dataset.data,
      borderColor: lineColor,
      backgroundColor: chartColor(lineColor).alpha(0.15).rgbString(),
      pointRadius: props.pointRadius,
      tension: props.tension,
      fill: props.fill
    };
  })
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
  scales: {
    x: {
      ticks: { color: props.textColor },
      grid: { color: props.gridColor }
    },
    y: {
      ticks: { color: props.textColor },
      grid: { color: props.gridColor }
    }
  },
  onClick(_event: unknown, elements: Array<{ datasetIndex: number; index: number }>) {
    if (!elements.length) return;
    const { datasetIndex, index } = elements[0];
    const dataset = props.datasets[datasetIndex];
    emit("gn-point-click", {
      datasetLabel: dataset.label,
      label: props.labels[index],
      value: dataset.data[index],
      datasetIndex,
      index
    });
  }
}));
</script>

<template>
  <div class="gn-line-chart flex items-center justify-center rounded-lg p-6" :style="style">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.gn-line-chart {
  --gn-line-chart-background: #ffffff;
  --gn-line-chart-border: #e5e7eb;
  --gn-line-chart-height: 320px;
  position: relative;
  width: 100%;
  height: var(--gn-line-chart-height);
  background-color: var(--gn-line-chart-background);
  border: 1px solid var(--gn-line-chart-border);
  font-family: inherit;
  box-sizing: border-box;
}
</style>

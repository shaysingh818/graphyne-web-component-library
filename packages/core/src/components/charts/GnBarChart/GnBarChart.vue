<script lang="ts">
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title } from "chart.js";

// Module scope (runs once per module load, NOT per component instance —
// unlike `<script setup>`, whose top-level statements re-run every time a
// new instance mounts) so registering these chart.js elements happens
// exactly once per page, no matter how many GnBarChart instances exist.
// Same reasoning as the useId() + module-scope counter pattern documented
// in packages/core/CLAUDE.md.
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);
</script>

<script setup lang="ts">
/**
 * GnBarChart
 *
 * A bar chart wrapping vue-chartjs/chart.js. This component breaks from a
 * few conventions the rest of the library follows, deliberately:
 *
 * - Every other component here treats a third-party rendering library
 *   (FontAwesome) as swappable decoration — banned from real component
 *   code, only ever a devDependency used in stories, with the actual icon
 *   supplied through a slot. A chart's rendering engine isn't swappable
 *   decoration, it IS the component's function, and there's no slot
 *   equivalent for "render a bar chart." So chart.js and vue-chartjs are
 *   real `dependencies` of @graphyne/core (its first runtime dependency
 *   beyond the `vue` peerDependency), not devDependencies.
 * - `labels` and `data` are both required, with no sample defaults. A
 *   placeholder array of fake numbers baked into the component (as the
 *   original app-specific version did) is the same mistake as a hardcoded
 *   fake date — see GnBackBar's `subtitle` prop.
 * - Color doesn't fit the usual four-variable accent pattern: a bar chart
 *   needs a *palette*, one color per bar, not one accent. `colors` is an
 *   array (default: the original three-shade orange palette), recycled
 *   via modulo when there are more data points than colors. The card
 *   wrapper itself still gets the standard `backgroundColor`/`borderColor`
 *   overrides. `textColor` and `gridColor`, unlike every other color prop
 *   in this library, are NOT applied as CSS custom properties — chart.js
 *   draws its title/legend/tick text and gridlines to a `<canvas>`, which
 *   can't read CSS variables, so these flow into the `chartOptions`
 *   computed as literal values instead.
 */
import { computed } from "vue";
import { Bar } from "vue-chartjs";

const props = withDefaults(
  defineProps<{
    /** Chart title rendered above the plot. Omit (empty string) to hide it entirely. */
    title?: string;
    /** Category labels, one per bar. Must be the same length as `data`. */
    labels: string[];
    /** Bar values, one per label. Must be the same length as `labels`. */
    data: number[];
    /** Legend/tooltip label for the dataset. */
    datasetLabel?: string;
    /** Bar fill colors (any valid CSS colors), one per bar; recycled via modulo if there are more bars than colors. */
    colors?: string[];
    /** Overrides the card's background color (any valid CSS color). */
    backgroundColor?: string;
    /** Overrides the card's border color (any valid CSS color). Use "transparent" to remove the border. */
    borderColor?: string;
    /** Overrides the title/legend/tick text color drawn on the chart canvas (any valid CSS color). */
    textColor?: string;
    /** Overrides the x-axis gridline color drawn on the chart canvas (any valid CSS color, e.g. "rgba(0,0,0,0.1)"). */
    gridColor?: string;
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
    gridColor: "rgba(17, 24, 39, 0.08)",
    height: undefined
  }
);

const emit = defineEmits<{
  /** Fires when a bar is clicked. Carries the clicked bar's label, value, and index. */
  "gn-bar-click": [payload: { label: string; value: number; index: number }];
}>();

const style = computed(() => {
  const overrides: Record<string, string> = {};
  if (props.backgroundColor) overrides["--gn-bar-chart-background"] = props.backgroundColor;
  if (props.borderColor) overrides["--gn-bar-chart-border"] = props.borderColor;
  if (props.height) overrides["--gn-bar-chart-height"] = props.height;
  return Object.keys(overrides).length ? overrides : undefined;
});

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.datasetLabel,
      data: props.data,
      backgroundColor: props.data.map((_, index) => props.colors[index % props.colors.length]),
      borderRadius: 4,
      borderSkipped: false
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
  scales: {
    x: {
      ticks: { color: props.textColor },
      grid: { color: props.gridColor }
    },
    y: {
      ticks: { color: props.textColor },
      grid: { display: false }
    }
  },
  onClick(_event: unknown, elements: Array<{ index: number }>) {
    if (!elements.length) return;
    const index = elements[0].index;
    emit("gn-bar-click", { label: props.labels[index], value: props.data[index], index });
  }
}));
</script>

<template>
  <div class="gn-bar-chart flex items-center justify-center rounded-lg p-6" :style="style">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.gn-bar-chart {
  --gn-bar-chart-background: #ffffff;
  --gn-bar-chart-border: #e5e7eb;
  --gn-bar-chart-height: 320px;
  position: relative;
  width: 100%;
  height: var(--gn-bar-chart-height);
  background-color: var(--gn-bar-chart-background);
  border: 1px solid var(--gn-bar-chart-border);
  font-family: inherit;
  box-sizing: border-box;
}
</style>

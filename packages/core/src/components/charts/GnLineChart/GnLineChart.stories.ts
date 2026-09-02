import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { GnLineChart } from "./index";

const meta = {
  title: "Charts/GnLineChart",
  component: GnLineChart,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A multi-series line chart wrapping vue-chartjs/chart.js — sibling to GnBarChart/GnDoughnutChart, sharing the same runtime-dependency and canvas-text-color conventions (see GnBarChart's docs and GnLineChart.vue's JSDoc). `labels` and `datasets` are both required with no baked-in sample data. Each dataset may carry its own `color`; datasets that omit it fall back to the `colors` palette. The original app-specific version also filled every line with the same generic translucent-black regardless of its own color (since it set `fill: true` without a matching `backgroundColor`) — fixed here so each line's fill is tinted from its own color."
      }
    }
  },
  argTypes: {
    title: { control: "text" },
    labels: { control: "object" },
    datasets: { control: "object" },
    colors: { control: "object" },
    tension: { control: { type: "range", min: 0, max: 0.6, step: 0.1 } },
    pointRadius: { control: { type: "range", min: 0, max: 8, step: 1 } },
    fill: { control: "boolean" }
  },
  args: {
    title: "Performance Over Time",
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      { label: "Accuracy", data: [40, 55, 30, 70, 60, 85] },
      { label: "Completion Rate", data: [60, 50, 75, 65, 80, 70] },
      { label: "Avg Score", data: [30, 45, 55, 40, 65, 60] }
    ]
  },
  render: (args) => ({
    components: { GnLineChart },
    setup() {
      return { args };
    },
    template: `<div style="width: 36rem;"><GnLineChart v-bind="args" /></div>`
  })
} satisfies Meta<typeof GnLineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "White card, three-series default palette — none of the datasets specify their own `color`, so each falls back to the `colors` palette by index. A light default background matches the rest of the library (see CustomColors for the original's dark look)."
      }
    }
  }
};

export const PerDatasetColor: Story = {
  args: {
    datasets: [
      { label: "Accuracy", data: [40, 55, 30, 70, 60, 85], color: "#dc2626" },
      { label: "Completion Rate", data: [60, 50, 75, 65, 80, 70] },
      { label: "Avg Score", data: [30, 45, 55, 40, 65, 60] }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: "\"Accuracy\" specifies its own `color`; the other two datasets omit it and fall back to the `colors` palette by index (index 1, since index 0 is now taken by the explicit color) — matching the original component's per-dataset `color` field while keeping the default palette as a fallback."
      }
    }
  }
};

export const StraightLinesNoFill: Story = {
  args: { tension: 0, fill: false, pointRadius: 3 },
  parameters: {
    docs: {
      description: {
        story: "`tension`, `fill`, and `pointRadius` apply uniformly to every line — set `tension` to 0 for straight segments and `fill` to false to drop the area shading entirely."
      }
    }
  }
};

export const CustomColors: Story = {
  args: {
    backgroundColor: "#1c1917",
    borderColor: "transparent",
    textColor: "#ffffff",
    gridColor: "rgba(255, 255, 255, 0.1)"
  },
  parameters: {
    docs: {
      description: {
        story:
          "`backgroundColor`/`borderColor` restyle the card like every other component's overrides, but `textColor`/`gridColor` restyle the chart.js canvas itself (title, legend, ticks, gridlines) — necessary since canvas can't read the CSS custom properties the rest of the library relies on. This particular combination reproduces the original app-specific `LineChart`'s dark look."
      }
    }
  }
};

export const NoTitle: Story = {
  args: { title: "" },
  parameters: {
    docs: {
      description: {
        story: "An empty `title` hides the chart.js title plugin entirely rather than rendering an empty heading."
      }
    }
  }
};

export const CustomHeight: Story = {
  args: { height: "16rem" },
  parameters: {
    docs: {
      description: {
        story: "`height` overrides the card's fixed height — chart.js needs an explicit container height (rather than min-height) to size its canvas correctly with `maintainAspectRatio: false`."
      }
    }
  }
};

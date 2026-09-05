import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { GnDoughnutChart } from "./index";

const meta = {
  title: "Charts/GnDoughnutChart",
  component: GnDoughnutChart,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A doughnut chart wrapping vue-chartjs/chart.js — sibling to GnBarChart, sharing the same runtime-dependency and canvas-text-color conventions (see GnBarChart's docs and GnDoughnutChart.vue's JSDoc). `labels` and `data` are both required and must be the same length; there's no baked-in sample data, unlike the app-specific version this was ported from. That original also had two silent bugs — a `reponsive` typo and a dead `chartData.label` field — fixed here rather than carried forward."
      }
    }
  },
  argTypes: {
    title: { control: "text" },
    datasetLabel: { control: "text" },
    labels: { control: "object" },
    data: { control: "object" },
    colors: { control: "object" }
  },
  args: {
    title: "Accuracy of Questions",
    datasetLabel: "Accuracy",
    labels: ["Correct", "Incorrect"],
    data: [45, 55]
  },
  render: (args) => ({
    components: { GnDoughnutChart },
    setup() {
      return { args };
    },
    template: `<div style="width: 24rem;"><GnDoughnutChart v-bind="args" /></div>`
  })
} satisfies Meta<typeof GnDoughnutChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "White card, orange/gray two-segment palette — the same data-driven behavior as the original app-specific `DoughnutChart`, now driven entirely by props instead of hardcoded values, with a light default background matching the rest of the library (see CustomColors for the original's dark look)."
      }
    }
  }
};

export const MoreSegmentsThanColors: Story = {
  args: {
    title: "Question Difficulty",
    datasetLabel: "Questions",
    labels: ["Easy", "Medium", "Hard", "Expert"],
    data: [30, 40, 20, 10]
  },
  parameters: {
    docs: {
      description: {
        story: "`colors` is recycled via modulo when there are more segments than colors in the palette — with the default 2-color palette and 4 segments, the pattern repeats."
      }
    }
  }
};

export const CustomColors: Story = {
  args: {
    backgroundColor: "#1c1917",
    borderColor: "transparent",
    textColor: "#ffffff",
    colors: ["#0ea5e9", "#6366f1", "#a855f7"]
  },
  parameters: {
    docs: {
      description: {
        story:
          "`backgroundColor`/`borderColor` restyle the card like every other component's overrides, but `textColor` restyles the chart.js canvas itself (title, legend) — necessary since canvas can't read the CSS custom properties the rest of the library relies on. `colors` independently sets the segment palette. This particular combination reproduces the original app-specific `DoughnutChart`'s dark look."
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

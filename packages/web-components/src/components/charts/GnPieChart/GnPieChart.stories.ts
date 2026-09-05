import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { GnPieChart } from "./index";

const meta = {
  title: "Charts/GnPieChart",
  component: GnPieChart,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A pie chart wrapping vue-chartjs/chart.js — near-identical to GnDoughnutChart (same conventions, see GnBarChart's docs and GnPieChart.vue's JSDoc). `labels` and `data` are both required and must be the same length; there's no baked-in sample data, unlike the app-specific version this was ported from. That original's separate `titleColor`/`legendColor` props (which always defaulted to the same value) were consolidated into the single `textColor` prop the other chart components already use, and its dead `border: 'none'` (not a real chart.js option) became `borderWidth: 0`."
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
    title: "Question Types",
    datasetLabel: "Question Types",
    labels: ["Open Ended", "Multiple Choice", "Ordered Sequence"],
    data: [40, 20, 35]
  },
  render: (args) => ({
    components: { GnPieChart },
    setup() {
      return { args };
    },
    template: `<div style="width: 24rem;"><GnPieChart v-bind="args" /></div>`
  })
} satisfies Meta<typeof GnPieChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "White card, orange three-shade palette — the same data-driven behavior as the original app-specific `PieChart`, now driven entirely by props instead of hardcoded values, with a light default background matching the rest of the library (see CustomColors for the original's dark look)."
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
        story: "`colors` is recycled via modulo when there are more segments than colors in the palette — with the default 3-color palette and 4 segments, the pattern repeats."
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
          "`backgroundColor`/`borderColor` restyle the card like every other component's overrides, but `textColor` restyles the chart.js canvas itself (title, legend) — necessary since canvas can't read the CSS custom properties the rest of the library relies on. `colors` independently sets the segment palette. This particular combination reproduces the original app-specific `PieChart`'s dark look."
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

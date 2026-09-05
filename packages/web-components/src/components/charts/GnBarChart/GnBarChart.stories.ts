import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { GnBarChart } from "./index";

const meta = {
  title: "Charts/GnBarChart",
  component: GnBarChart,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A bar chart wrapping vue-chartjs/chart.js — the library's first component built on a real runtime dependency rather than pure DOM/CSS (see the JSDoc in GnBarChart.vue for how that changes a few of the usual color/dependency conventions). `labels` and `data` are both required and must be the same length; there's no baked-in sample data, unlike the app-specific version this was ported from."
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
    datasetLabel: "Responses",
    labels: ["Open Ended", "Multiple Choice", "Ordered Sequence"],
    data: [60, 100, 35]
  },
  render: (args) => ({
    components: { GnBarChart },
    setup() {
      return { args };
    },
    template: `<div style="width: 32rem;"><GnBarChart v-bind="args" /></div>`
  })
} satisfies Meta<typeof GnBarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "White card, orange three-shade palette — the same data-driven behavior as the original app-specific `BarChart` (now via props instead of hardcoded data), but with a light default background to match the rest of the library — see the CustomColors story for the original's dark look, now available as an override rather than the default."
      }
    }
  }
};

export const MoreBarsThanColors: Story = {
  args: {
    title: "Monthly Signups",
    datasetLabel: "Signups",
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    data: [42, 58, 51, 74, 66, 89, 95]
  },
  parameters: {
    docs: {
      description: {
        story: "`colors` is recycled via modulo when there are more bars than colors in the palette — with the default 3-color palette and 7 bars, the pattern repeats."
      }
    }
  }
};

export const CustomColors: Story = {
  args: {
    backgroundColor: "#1c1917",
    borderColor: "transparent",
    textColor: "#ffffff",
    gridColor: "rgba(255, 255, 255, 0.1)",
    colors: ["#0ea5e9", "#6366f1", "#a855f7"]
  },
  parameters: {
    docs: {
      description: {
        story:
          "`backgroundColor`/`borderColor` restyle the card like every other component's overrides, but `textColor`/`gridColor` restyle the chart.js canvas itself (title, legend, ticks, gridlines) — necessary since canvas can't read the CSS custom properties the rest of the library relies on. `colors` independently sets the bar palette. This particular combination reproduces the original app-specific `BarChart`'s dark look."
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

import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { GnMetricCard } from "./index";

const meta = {
  title: "Layout/GnMetricCard",
  component: GnMetricCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A compact stat tile for dashboards — a short label above a prominent numeric value. Colors split into independent `backgroundColor`, `labelColor`, `valueColor`, and `borderColor` overrides so the tile can be restyled without losing the label/value contrast."
      }
    }
  },
  argTypes: {
    metric: { control: "text" },
    numeric: { control: "number" },
    backgroundColor: { control: "color" },
    labelColor: { control: "color" },
    valueColor: { control: "color" },
    borderColor: { control: "color" }
  },
  args: {
    metric: "Active Users",
    numeric: 1240
  }
} satisfies Meta<typeof GnMetricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "The default dark tile with a white label and an orange value — no color props set."
      }
    }
  }
};

export const CustomColors: Story = {
  args: {
    metric: "Revenue",
    numeric: 84200,
    backgroundColor: "#ffffff",
    labelColor: "#374151",
    valueColor: "#16a34a"
  },
  parameters: {
    docs: {
      description: {
        story: "`backgroundColor`, `labelColor`, and `valueColor` restyle the tile independently, e.g. a light card with a green value for a revenue metric."
      }
    }
  }
};

export const Bordered: Story = {
  args: {
    metric: "Open Tickets",
    numeric: 12,
    backgroundColor: "#ffffff",
    labelColor: "#374151",
    valueColor: "#dc2626",
    borderColor: "#e5e7eb"
  },
  parameters: {
    docs: {
      description: {
        story: "`borderColor` adds a visible border; it's transparent by default so the tile has no border at all."
      }
    }
  }
};

export const Dashboard: Story = {
  render: () => ({
    components: { GnMetricCard },
    template: `
      <div style="display: grid; grid-template-columns: repeat(3, minmax(140px, 1fr)); gap: 1rem; max-width: 640px;">
        <GnMetricCard metric="Active Users" :numeric="1240" />
        <GnMetricCard metric="Sign-ups" :numeric="86" background-color="#ffffff" label-color="#374151" value-color="#16a34a" />
        <GnMetricCard metric="Errors" :numeric="3" background-color="#ffffff" label-color="#374151" value-color="#dc2626" border-color="#e5e7eb" />
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: "Several tiles composed in a grid, as they'd typically appear at the top of a dashboard."
      }
    }
  }
};

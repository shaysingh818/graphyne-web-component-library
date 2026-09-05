import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { GnTag } from "./index";

const meta = {
  title: "Display/GnTag",
  component: GnTag,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A small label/badge for showing metadata associated with content (a category, a status, a count). Sizes itself to fit its label — there's no width/height prop, the same way GnButton has none."
      }
    }
  },
  argTypes: {
    label: { control: "text" },
    variant: {
      control: "select",
      options: ["primary", "secondary"]
    }
  },
  args: {
    label: "Biology"
  },
  render: (args) => ({
    components: { GnTag },
    setup() {
      return { args };
    },
    template: `<GnTag v-bind="args" />`
  })
} satisfies Meta<typeof GnTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: "primary" },
  parameters: {
    docs: {
      description: {
        story: "The default, high-emphasis variant — solid accent background."
      }
    }
  }
};

export const Secondary: Story = {
  args: { variant: "secondary" },
  parameters: {
    docs: {
      description: {
        story: "A lower-emphasis variant — a tinted background instead of a solid one."
      }
    }
  }
};

export const LongLabel: Story = {
  args: { label: "Ordered Sequence" },
  parameters: {
    docs: {
      description: {
        story: "The tag grows to fit its label rather than clipping or overflowing it — there's no fixed width/height to fight against."
      }
    }
  }
};

export const CustomColor: Story = {
  args: { label: "Exam", color: "#0ea5e9" },
  parameters: {
    docs: {
      description: {
        story: "color overrides the accent used by both variants (any valid CSS color)."
      }
    }
  }
};

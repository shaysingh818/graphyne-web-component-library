import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { fn } from "storybook/test";
import { GnTag } from "./index";

const meta = {
  title: "Display/GnTag",
  component: GnTag,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A standard tag component for showing badges/tags associated with content. Includes styling for pinrary, secondary or ghost styling."
      }
    }
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost"]
    },
    disabled: { control: "boolean" }
  },
  args: {
    variant: "primary",
    disabled: false
  },
  render: (args) => ({
    components: { GnTag },
    setup() {
      return { args };
    },
    template: `<GnTag v-bind="args">Save changes</GnTag>`
  })
} satisfies Meta<typeof GnTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary"
  },
  parameters: {
    docs: {
      description: {
        story: "The default, high-emphasis variant — solid accent background. Use for the main action in a view or form."
      }
    }
  }
};

import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { fn } from "storybook/test";
import { GnButton } from "./index";

const meta = {
  title: "Buttons/GnButton",
  component: GnButton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost"]
    },
    disabled: { control: "boolean" }
  },
  args: {
    variant: "primary",
    disabled: false,
    "onGn-click": fn()
  },
  render: (args) => ({
    components: { GnButton },
    setup() {
      return { args };
    },
    template: `<GnButton v-bind="args">Save changes</GnButton>`
  })
} satisfies Meta<typeof GnButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: "primary" }
};

export const Secondary: Story = {
  args: { variant: "secondary" }
};

export const Ghost: Story = {
  args: { variant: "ghost" }
};

export const Disabled: Story = {
  args: { disabled: true }
};

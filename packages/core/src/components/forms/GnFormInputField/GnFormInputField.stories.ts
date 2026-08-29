import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { fn } from "storybook/test";
import { GnFormInputField } from "./index";

const meta = {
  title: "Forms/GnFormInputField",
  component: GnFormInputField,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search", "tel", "url"]
    },
    disabled: { control: "boolean" },
    label: { control: "text" },
    placeholder: { control: "text" },
    error: { control: "text" }
  },
  args: {
    type: "text",
    disabled: false,
    label: "Email address",
    placeholder: "you@example.com",
    "onUpdate:modelValue": fn(),
    "onGn-update": fn()
  },
  render: (args) => ({
    components: { GnFormInputField },
    setup() {
      return { args };
    },
    template: `<GnFormInputField v-bind="args" />`
  })
} satisfies Meta<typeof GnFormInputField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { modelValue: "jane@example.com" }
};

export const Disabled: Story = {
  args: { disabled: true, modelValue: "jane@example.com" }
};

export const WithError: Story = {
  args: { modelValue: "not-an-email", error: "Enter a valid email address." }
};

export const CustomAccent: Story = {
  args: { color: "#059669" }
};

export const DarkSearchField: Story = {
  args: {
    label: undefined,
    placeholder: "Search…",
    backgroundColor: "rgb(28, 25, 23)",
    textColor: "#f97316",
    borderColor: "transparent"
  }
};

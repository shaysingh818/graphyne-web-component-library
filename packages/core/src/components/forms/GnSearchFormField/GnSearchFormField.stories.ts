import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { fn } from "storybook/test";
import { ref } from "vue";
import { GnSearchFormField } from "./index";

const meta = {
  title: "Forms/GnSearchFormField",
  component: GnSearchFormField,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    error: { control: "text" }
  },
  args: {
    label: "Search",
    placeholder: "Search…",
    "onUpdate:modelValue": fn(),
    "gn-update": fn(),
    "gn-search": fn()
  },
  render: (args) => ({
    components: { GnSearchFormField },
    setup() {
      const modelValue = ref(args.modelValue ?? "");
      return { args, modelValue };
    },
    template: `<GnSearchFormField v-bind="args" v-model="modelValue" />`
  })
} satisfies Meta<typeof GnSearchFormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true }
};

export const WithError: Story = {
  args: { error: "Please enter a search term." }
};

export const WithStyles: Story = {
  args: {
    color: "#0A9CF2",
    backgroundColor: "white",
    textColor: "#0A9CF2",
    borderColor: "#0A9CF2"
  }
};

export const WithButtonBackgroundColor: Story = {
  args: {
    color: "white",
    borderColor: "#0A9CF2",
    buttonBackgroundColor: "#0A9CF2"
  }
};

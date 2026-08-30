import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { fn } from "storybook/test";
import { ref } from "vue";
import { GnFormDropDownField } from "./index";

const meta = {
  title: "Forms/GnFormDropDownField",
  component: GnFormDropDownField,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
  },
  args: {
    label: "Dropdown field",
    options: [      
      { label: "Option A", value: "a" },
      { label: "Option B", value: "b" },
      { label: "Option C", value: "c" },
    ],
    "onUpdate:modelValue": fn(),
    "gn-update": fn()
  },
  render: (args) => ({
    components: { GnFormDropDownField },
    setup() {
      const modelValue = ref(args.modelValue ?? "");
      return { args, modelValue };
    },
    template: `<GnFormDropDownField v-bind="args" v-model="modelValue" />`
  })
} satisfies Meta<typeof GnFormDropDownField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithStyles: Story = {
  args: {
    label: "Custom Styled Dropdown Field",
    options: [      
      { label: "Option A", value: "a" },
      { label: "Option B", value: "b" },
      { label: "Option C", value: "c" },
      { label: "Option D", value: "d" },
      { label: "Option E", value: "e" },
    ],
    color: "#0A9CF2",
    backgroundColor: "white",
    textColor: "#0A9CF2",
    borderColor: "#0A9CF2"
  }
}
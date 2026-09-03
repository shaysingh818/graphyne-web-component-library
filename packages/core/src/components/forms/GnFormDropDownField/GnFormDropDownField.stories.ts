import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { fn } from "storybook/test";
import { ref } from "vue";
import { GnFormDropDownField } from "./index";

const meta = {
  title: "Forms/GnFormDropDownField",
  component: GnFormDropDownField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A labeled dropdown built on the native Popover API and CSS anchor positioning, with `v-model` support. Like the other form fields, `color`, `backgroundColor`, `textColor`, and `borderColor` restyle the trigger button and its popover independently."
      }
    }
  },
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

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "The default field with its default color scheme and options."
      }
    }
  }
};

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
  },
  parameters: {
    docs: {
      description: {
        story: "`color`, `backgroundColor`, `textColor`, and `borderColor` restyle both the trigger button and the popover consistently, since each rendered instance gets its own unique CSS custom properties and anchor name."
      }
    }
  }
}

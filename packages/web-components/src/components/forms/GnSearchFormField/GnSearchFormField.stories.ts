import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { fn } from "storybook/test";
import { ref } from "vue";
import { GnSearchFormField } from "./index";

const meta = {
  title: "Forms/GnSearchFormField",
  component: GnSearchFormField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A text input paired with a search button, emitting `gn-search` with the current value on button click or Enter. `color`, `backgroundColor`, `textColor`, and `borderColor` style the input and are shared by the button by default; `buttonBackgroundColor` overrides just the button's background independently."
      }
    }
  },
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

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "An empty field with a label, placeholder, and search button."
      }
    }
  }
};

export const Disabled: Story = {
  args: { disabled: true },
  parameters: {
    docs: {
      description: {
        story: "Dims both the input and the search button, and prevents `gn-search` from firing."
      }
    }
  }
};

export const WithError: Story = {
  args: { error: "Please enter a search term." },
  parameters: {
    docs: {
      description: {
        story: "The `error` prop renders a message below the field and marks the input invalid via `aria-invalid`/`aria-describedby`."
      }
    }
  }
};

export const WithStyles: Story = {
  args: {
    color: "#0A9CF2",
    backgroundColor: "white",
    textColor: "#0A9CF2",
    borderColor: "#0A9CF2"
  },
  parameters: {
    docs: {
      description: {
        story: "`color`, `backgroundColor`, `textColor`, and `borderColor` restyle the input and the search button together, since the button shares the same CSS custom properties by default."
      }
    }
  }
};

export const WithButtonBackgroundColor: Story = {
  args: {
    color: "white",
    borderColor: "#0A9CF2",
    buttonBackgroundColor: "#0A9CF2"
  },
  parameters: {
    docs: {
      description: {
        story: "`buttonBackgroundColor` overrides just the search button's background, independently of the input's own background — useful for a solid accent-colored button next to a plain input."
      }
    }
  }
};

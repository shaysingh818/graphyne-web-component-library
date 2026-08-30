import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { fn } from "storybook/test";
import { GnFormTextField } from "./index";

const meta = {
  title: "Forms/GnFormTextField",
  component: GnFormTextField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A labeled multi-line textarea with `v-model` support and an optional inline error message. Mirrors GnFormInputField's API and color-override conventions, plus a `rows` prop for its default visible height."
      }
    }
  },
  argTypes: {
    rows: { control: "number" },
    disabled: { control: "boolean" },
    label: { control: "text" },
    placeholder: { control: "text" },
    error: { control: "text" }
  },
  args: {
    rows: 4,
    disabled: false,
    label: "Bio",
    placeholder: "Tell us about yourself…",
    "onUpdate:modelValue": fn(),
    "onGn-update": fn()
  },
  render: (args) => ({
    components: { GnFormTextField },
    setup() {
      return { args };
    },
    template: `<GnFormTextField v-bind="args" />`
  })
} satisfies Meta<typeof GnFormTextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "An empty field with a label, placeholder, and the default 4 rows."
      }
    }
  }
};

export const WithValue: Story = {
  args: { modelValue: "Long-time fan of well-typed component libraries." },
  parameters: {
    docs: {
      description: {
        story: "Pre-filled via `modelValue`, as when editing an existing record."
      }
    }
  }
};

export const Disabled: Story = {
  args: { disabled: true, modelValue: "Long-time fan of well-typed component libraries." },
  parameters: {
    docs: {
      description: {
        story: "Dims the field and prevents `update:modelValue`/`gn-update` from firing."
      }
    }
  }
};

export const WithError: Story = {
  args: { modelValue: "", error: "This field is required." },
  parameters: {
    docs: {
      description: {
        story: "The `error` prop renders a message below the field and marks it invalid via `aria-invalid`/`aria-describedby`."
      }
    }
  }
};

export const CustomAccent: Story = {
  args: { color: "#059669" },
  parameters: {
    docs: {
      description: {
        story: "The `color` prop overrides only the focus-ring accent, independently of `backgroundColor`/`textColor`/`borderColor`."
      }
    }
  }
};

export const DarkTextField: Story = {
  args: {
    label: undefined,
    placeholder: "Write something…",
    backgroundColor: "rgb(28, 25, 23)",
    textColor: "#f97316",
    borderColor: "transparent"
  },
  parameters: {
    docs: {
      description: {
        story: "A dark, borderless field reproduced with `backgroundColor`, `textColor`, and `borderColor=\"transparent\"`, and no label."
      }
    }
  }
};

export const MoreRows: Story = {
  args: { rows: 8 },
  parameters: {
    docs: {
      description: {
        story: "`rows` sets the textarea's default visible height; it can still be resized vertically by the user."
      }
    }
  }
};

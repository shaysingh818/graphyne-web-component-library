import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { fn } from "storybook/test";
import { GnFormInputField } from "./index";

const meta = {
  title: "Forms/GnFormInputField",
  component: GnFormInputField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A labeled text input with `v-model` support and an optional inline error message. Colors are split into independent overrides rather than a single accent: `color` only affects the focus ring, while `backgroundColor`, `textColor`, and `borderColor` restyle the field itself."
      }
    }
  },
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

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "An empty field with a label and placeholder."
      }
    }
  }
};

export const WithValue: Story = {
  args: { modelValue: "jane@example.com" },
  parameters: {
    docs: {
      description: {
        story: "Pre-filled via `modelValue`, as when editing an existing record."
      }
    }
  }
};

export const Disabled: Story = {
  args: { disabled: true, modelValue: "jane@example.com" },
  parameters: {
    docs: {
      description: {
        story: "Dims the field and prevents `update:modelValue`/`gn-update` from firing."
      }
    }
  }
};

export const WithError: Story = {
  args: { modelValue: "not-an-email", error: "Enter a valid email address." },
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

export const DarkSearchField: Story = {
  args: {
    label: undefined,
    placeholder: "Search…",
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

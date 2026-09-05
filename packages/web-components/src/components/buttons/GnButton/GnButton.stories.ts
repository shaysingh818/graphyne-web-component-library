import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { fn } from "storybook/test";
import { GnButton } from "./index";

const meta = {
  title: "Buttons/GnButton",
  component: GnButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A standard text button with three visual variants and a disabled state. Fires a namespaced `gn-click` event (rather than relying on the native `click` event) so it behaves consistently once compiled to a custom element."
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
  args: { variant: "primary" },
  parameters: {
    docs: {
      description: {
        story: "The default, high-emphasis variant — solid accent background. Use for the main action in a view or form."
      }
    }
  }
};

export const Secondary: Story = {
  args: { variant: "secondary" },
  parameters: {
    docs: {
      description: {
        story: "A lower-emphasis variant — tinted background, no solid fill. Use alongside a Primary button for the less important action."
      }
    }
  }
};

export const Ghost: Story = {
  args: { variant: "ghost" },
  parameters: {
    docs: {
      description: {
        story: "The lowest-emphasis variant — no background or border until hovered. Use for tertiary actions that shouldn't compete visually."
      }
    }
  }
};

export const Disabled: Story = {
  args: { disabled: true },
  parameters: {
    docs: {
      description: {
        story: "Dims the button and prevents `gn-click` from firing, regardless of variant."
      }
    }
  }
};

import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { fn } from "storybook/test";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { GnIconButton } from "./index";

library.add(faTrash);

// Any inline SVG (or icon-font markup) works — GnIconButton just renders
// whatever is passed into its default slot.
const trashIcon = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

const meta = {
  title: "Buttons/GnIconButton",
  component: GnIconButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A circular, icon-only button. The icon is provided via the default slot — an inline SVG, an icon-font `<i>`, a `<font-awesome-icon>`, whatever the consumer already uses — rather than a hardcoded icon prop, so the component stays framework- and library-agnostic once compiled to a custom element. Since there's no visible text, `label` is required and applied as `aria-label`."
      }
    }
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost"]
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"]
    },
    disabled: { control: "boolean" },
    label: { control: "text" }
  },
  args: {
    variant: "primary",
    size: "md",
    disabled: false,
    label: "Delete",
    "onGn-click": fn()
  },
  render: (args) => ({
    components: { GnIconButton },
    setup() {
      return { args, trashIcon };
    },
    template: `<GnIconButton v-bind="args"><span v-html="trashIcon" /></GnIconButton>`
  })
} satisfies Meta<typeof GnIconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: "primary" },
  parameters: {
    docs: {
      description: {
        story: "The default, high-emphasis variant — solid accent background."
      }
    }
  }
};

export const Secondary: Story = {
  args: { variant: "secondary" },
  parameters: {
    docs: {
      description: {
        story: "A lower-emphasis variant — tinted background, no solid fill."
      }
    }
  }
};

export const Ghost: Story = {
  args: { variant: "ghost" },
  parameters: {
    docs: {
      description: {
        story: "The lowest-emphasis variant — no background or border until hovered."
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

export const Small: Story = {
  args: { size: "sm" },
  parameters: {
    docs: {
      description: {
        story: "Scales both the button diameter and the slotted icon down together."
      }
    }
  }
};

export const Medium: Story = {
  args: { size: "md" },
  parameters: {
    docs: {
      description: {
        story: "The default size."
      }
    }
  }
};

export const Large: Story = {
  args: { size: "lg" },
  parameters: {
    docs: {
      description: {
        story: "Scales both the button diameter and the slotted icon up together."
      }
    }
  }
};

export const WithFontAwesome: Story = {
  render: (args) => ({
    components: { GnIconButton, FontAwesomeIcon },
    setup() {
      return { args };
    },
    template: `<GnIconButton v-bind="args"><font-awesome-icon icon="trash" /></GnIconButton>`
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Since the icon is just the default slot, any icon library works — here a `<font-awesome-icon>` is passed in instead of an inline SVG."
      }
    }
  }
};

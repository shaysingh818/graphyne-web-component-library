import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { GnConfirmDialog } from "./index";

const meta = {
  title: "Overlays/GnConfirmDialog",
  component: GnConfirmDialog,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A yes/no confirmation modal: a backdrop, a message, and Cancel/Confirm buttons composed from GnButton. Escape and clicking the backdrop both cancel by default (toggle off via closeOnEscape/closeOnOverlayClick), focus moves to the Confirm button on mount, and the box carries role=\"dialog\"/aria-modal/aria-describedby. Ported from an app-specific ConfirmDialog that had none of that — see the component's own JSDoc for the full list of what changed."
      }
    }
  },
  argTypes: {
    message: { control: "text" },
    confirmLabel: { control: "text" },
    cancelLabel: { control: "text" },
    closeOnEscape: { control: "boolean" },
    closeOnOverlayClick: { control: "boolean" }
  },
  args: {
    message: "Are you sure you want to delete this item?"
  },
  render: (args) => ({
    components: { GnConfirmDialog },
    setup() {
      return { args };
    },
    template: `<GnConfirmDialog v-bind="args" />`
  })
} satisfies Meta<typeof GnConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Click Cancel/Confirm, press Escape, or click the backdrop — check the Actions panel for gn-cancel/gn-confirm firing. The Confirm button is focused automatically on mount, so pressing Enter immediately after the dialog appears confirms it."
      }
    }
  }
};

export const CustomLabels: Story = {
  args: {
    message: "Discard unsaved changes?",
    confirmLabel: "Discard",
    cancelLabel: "Keep editing"
  },
  parameters: {
    docs: {
      description: {
        story: "confirmLabel/cancelLabel override the button text — useful when \"Yes\"/\"No\" doesn't read naturally for the action being confirmed."
      }
    }
  }
};

export const NoDismissAffordances: Story = {
  args: {
    message: "You must explicitly choose Confirm or Cancel to close this dialog.",
    closeOnEscape: false,
    closeOnOverlayClick: false
  },
  parameters: {
    docs: {
      description: {
        story: "With closeOnEscape and closeOnOverlayClick both off, neither the Escape key nor a backdrop click fires gn-cancel — only the two buttons can dismiss the dialog. Useful for a genuinely destructive confirmation you don't want dismissed accidentally."
      }
    }
  }
};

export const CustomColors: Story = {
  args: {
    color: "#0ea5e9",
    backgroundColor: "#1c1917",
    borderColor: "transparent",
    textColor: "#f9fafb",
    overlayColor: "rgba(0, 0, 0, 0.75)"
  },
  parameters: {
    docs: {
      description: {
        story: "backgroundColor/borderColor/textColor restyle the box, overlayColor independently restyles the backdrop, and color forwards straight through to both GnButtons' own color prop."
      }
    }
  }
};

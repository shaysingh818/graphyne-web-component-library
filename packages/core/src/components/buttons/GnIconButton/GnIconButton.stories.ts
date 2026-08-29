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
  args: { variant: "primary" }
};

export const Secondary: Story = {
  args: { variant: "secondary" }
};

export const Ghost: Story = {
  args: { variant: "ghost" }
};

export const Disabled: Story = {
  args: { disabled: true }
};

export const Small: Story = {
  args: { size: "sm" }
};

export const Medium: Story = {
  args: { size: "md" }
};

export const Large: Story = {
  args: { size: "lg" }
};

export const WithFontAwesome: Story = {
  render: (args) => ({
    components: { GnIconButton, FontAwesomeIcon },
    setup() {
      return { args };
    },
    template: `<GnIconButton v-bind="args"><font-awesome-icon icon="trash" /></GnIconButton>`
  })
};

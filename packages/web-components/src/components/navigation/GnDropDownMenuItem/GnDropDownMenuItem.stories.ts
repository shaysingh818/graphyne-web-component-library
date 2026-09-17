import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { fn } from "storybook/test";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPenToSquare, faX } from "@fortawesome/free-solid-svg-icons";
import { GnDropDownMenuItem } from "./index";

library.add(faPenToSquare, faX);

const meta = {
  title: "Navigation/GnDropDownMenuItem",
  component: GnDropDownMenuItem,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A single selectable row meant to be repeated inside a GnDropDownMenu's `items` slot. Renders as a real `<button>` for keyboard support. The icon is provided via the default slot — an inline SVG, an icon-font `<i>`, a `<font-awesome-icon>`, whatever the consumer already uses — rather than a hardcoded icon-name prop, so it stays framework- and library-agnostic once compiled to a custom element. Omit the slot for a text-only item."
      }
    }
  },
  argTypes: {
    label: { control: "text" },
    disabled: { control: "boolean" }
  },
  args: {
    label: "Edit Subject",
    disabled: false,
    "onGn-click": fn()
  },
  render: (args) => ({
    components: { GnDropDownMenuItem, FontAwesomeIcon },
    setup() {
      return { args };
    },
    template: `
      <div style="width: 12rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 0.25rem; box-sizing: border-box;">
        <GnDropDownMenuItem v-bind="args"><font-awesome-icon icon="fa-solid fa-pen-to-square" /></GnDropDownMenuItem>
      </div>
    `
  })
} satisfies Meta<typeof GnDropDownMenuItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TextOnly: Story = {
  render: (args) => ({
    components: { GnDropDownMenuItem },
    setup() {
      return { args };
    },
    template: `
      <div style="width: 12rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 0.25rem; box-sizing: border-box;">
        <GnDropDownMenuItem v-bind="args" />
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: "Without a slotted icon, the icon wrapper (and its gap) doesn't render at all."
      }
    }
  }
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => ({
    components: { GnDropDownMenuItem, FontAwesomeIcon },
    setup() {
      return { args };
    },
    template: `
      <div style="width: 12rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 0.25rem; box-sizing: border-box;">
        <GnDropDownMenuItem v-bind="args"><font-awesome-icon icon="fa-solid fa-x" /></GnDropDownMenuItem>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: "Dims the item and prevents `gn-click` from firing."
      }
    }
  }
};

export const CustomColors: Story = {
  args: {
    label: "Delete Subject",
    color: "#dc2626",
    textColor: "#dc2626",
    backgroundColor: "#fee2e2"
  },
  render: (args) => ({
    components: { GnDropDownMenuItem, FontAwesomeIcon },
    setup() {
      return { args };
    },
    template: `
      <div style="width: 12rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 0.25rem; box-sizing: border-box;">
        <GnDropDownMenuItem v-bind="args"><font-awesome-icon icon="fa-solid fa-x" /></GnDropDownMenuItem>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: "color, textColor, and backgroundColor applied as independent overrides — useful for a destructive action like a delete item."
      }
    }
  }
};

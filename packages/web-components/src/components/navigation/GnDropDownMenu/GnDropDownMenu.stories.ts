import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { fn } from "storybook/test";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEllipsisVertical, faPenToSquare, faX } from "@fortawesome/free-solid-svg-icons";
import { GnDropDownMenu } from "./index";
import { GnDropDownMenuItem } from "../GnDropDownMenuItem";
import { GnIconButton } from "../../buttons";

library.add(faEllipsisVertical, faPenToSquare, faX);

// GnDropDownMenu is a slot-composed shell, same idea as GnNavigationBar and
// GnTabNavigationBar — it doesn't render a trigger or menu items itself.
const meta = {
  title: "Navigation/GnDropDownMenu",
  component: GnDropDownMenu,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A popover menu that opens on a click of its `trigger` slot and closes on an outside click, Escape, or a click inside its `items` slot — each independently toggleable via `closeOnOutsideClick`/`closeOnEscape`/`closeOnSelect`. Compose it from GnDropDownMenuItem (or any clickable content) the same way GnNavigationBar composes GnNavigationItem; GnDropDownMenu only owns the open/closed state and popover positioning."
      }
    }
  },
  argTypes: {
    align: {
      control: "select",
      options: ["left", "right"]
    },
    disabled: { control: "boolean" },
    closeOnOutsideClick: { control: "boolean" },
    closeOnEscape: { control: "boolean" },
    closeOnSelect: { control: "boolean" }
  },
  args: {
    align: "left",
    disabled: false,
    closeOnOutsideClick: true,
    closeOnEscape: true,
    closeOnSelect: true,
    "onGn-open": fn(),
    "onGn-close": fn()
  },
  render: (args) => ({
    components: { GnDropDownMenu, GnDropDownMenuItem, GnIconButton, FontAwesomeIcon },
    setup() {
      return { args };
    },
    template: `
      <div style="padding: 3rem;">
        <GnDropDownMenu v-bind="args">
          <template #trigger>
            <GnIconButton label="Options" variant="ghost"><font-awesome-icon icon="fa-solid fa-ellipsis-vertical" /></GnIconButton>
          </template>
          <template #items>
            <GnDropDownMenuItem label="Edit Subject"><font-awesome-icon icon="fa-solid fa-pen-to-square" /></GnDropDownMenuItem>
            <GnDropDownMenuItem label="Delete Subject" color="#dc2626" text-color="#dc2626"><font-awesome-icon icon="fa-solid fa-x" /></GnDropDownMenuItem>
          </template>
        </GnDropDownMenu>
      </div>
    `
  })
} satisfies Meta<typeof GnDropDownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Click the trigger to open the menu; click an item, click outside, or press Escape to close it again."
      }
    }
  }
};

export const AlignedRight: Story = {
  args: { align: "right" },
  render: (args) => ({
    components: { GnDropDownMenu, GnDropDownMenuItem, GnIconButton, FontAwesomeIcon },
    setup() {
      return { args };
    },
    template: `
      <div style="display: flex; justify-content: flex-end; padding: 3rem;">
        <GnDropDownMenu v-bind="args">
          <template #trigger>
            <GnIconButton label="Options" variant="ghost"><font-awesome-icon icon="fa-solid fa-ellipsis-vertical" /></GnIconButton>
          </template>
          <template #items>
            <GnDropDownMenuItem label="Edit Subject"><font-awesome-icon icon="fa-solid fa-pen-to-square" /></GnDropDownMenuItem>
            <GnDropDownMenuItem label="Delete Subject" color="#dc2626" text-color="#dc2626"><font-awesome-icon icon="fa-solid fa-x" /></GnDropDownMenuItem>
          </template>
        </GnDropDownMenu>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: "`align=\"right\"` anchors the panel to the trigger's right edge instead of its left — useful when the trigger sits near the right side of the viewport, like this one."
      }
    }
  }
};

export const Disabled: Story = {
  args: { disabled: true },
  parameters: {
    docs: {
      description: {
        story: "The trigger no longer responds to clicks and the menu can't be opened."
      }
    }
  }
};

export const StaysOpenOnSelect: Story = {
  args: { closeOnSelect: false },
  parameters: {
    docs: {
      description: {
        story: "With `closeOnSelect` off, clicking an item no longer auto-closes the menu — useful for a menu of toggles/checkboxes where the consumer wants multiple selections in one open session."
      }
    }
  }
};

export const CustomColors: Story = {
  args: {
    backgroundColor: "#1c1917",
    borderColor: "#44403c"
  },
  render: (args) => ({
    components: { GnDropDownMenu, GnDropDownMenuItem, GnIconButton, FontAwesomeIcon },
    setup() {
      return { args };
    },
    template: `
      <div style="padding: 3rem;">
        <GnDropDownMenu v-bind="args">
          <template #trigger>
            <GnIconButton label="Options" variant="ghost"><font-awesome-icon icon="fa-solid fa-ellipsis-vertical" /></GnIconButton>
          </template>
          <template #items>
            <GnDropDownMenuItem label="Edit Subject" text-color="#e7e5e4"><font-awesome-icon icon="fa-solid fa-pen-to-square" /></GnDropDownMenuItem>
            <GnDropDownMenuItem label="Delete Subject" color="#f87171" text-color="#f87171"><font-awesome-icon icon="fa-solid fa-x" /></GnDropDownMenuItem>
          </template>
        </GnDropDownMenu>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: "backgroundColor and borderColor applied to the panel as independent overrides, same pattern as GnConfirmDialog's box."
      }
    }
  }
};

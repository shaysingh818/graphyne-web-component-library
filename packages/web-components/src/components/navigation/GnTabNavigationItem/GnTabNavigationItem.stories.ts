import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { fn } from "storybook/test";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { GnTabNavigationItem } from "./index";

library.add(faCalendar);

const meta = {
  title: "Navigation/GnTabNavigationItem",
  component: GnTabNavigationItem,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A single tab within a GnTabNavigationBar — an icon+label button showing a bottom accent-colored indicator when `selected`. The icon comes from the default slot (inline SVG, an icon-font `<i>`, a `<font-awesome-icon>`) rather than a hardcoded icon-name prop. It doesn't track its own selected state — pair `selected` and the `gn-click` emit with GnTabNavigationBar's `v-model`/scoped-slot `active`/`select`."
      }
    }
  },
  argTypes: {
    label: { control: "text" },
    selected: { control: "boolean" }
  },
  args: {
    label: "Decks",
    selected: false,
    "onGn-click": fn()
  },
  render: (args) => ({
    components: { GnTabNavigationItem, FontAwesomeIcon },
    setup() {
      return { args };
    },
    template: `<GnTabNavigationItem v-bind="args"><font-awesome-icon icon="fa-solid fa-calendar" /></GnTabNavigationItem>`
  })
} satisfies Meta<typeof GnTabNavigationItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { selected: false },
  parameters: {
    docs: {
      description: {
        story: "Unselected — no bottom indicator."
      }
    }
  }
};

export const Selected: Story = {
  args: { selected: true },
  parameters: {
    docs: {
      description: {
        story: "Selected — the bottom accent indicator appears. In real use this is driven by GnTabNavigationBar's `active` value, not set directly."
      }
    }
  }
};

export const CustomColors: Story = {
  args: {
    selected: true,
    color: "#22d3ee",
    backgroundColor: "#0f172a",
    textColor: "#e2e8f0"
  },
  parameters: {
    docs: {
      description: {
        story: "color (icon + indicator accent), backgroundColor, and textColor applied as independent overrides."
      }
    }
  }
};

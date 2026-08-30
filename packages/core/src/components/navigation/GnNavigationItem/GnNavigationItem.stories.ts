import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { GnNavigationItem } from "./index";

library.add(faHouse);

// Any inline SVG (or icon-font markup, or a <font-awesome-icon>) works —
// GnNavigationItem just renders whatever is passed into its default slot,
// the same convention as GnIconButton.
const homeIcon = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

const meta = {
  title: "Navigation/GnNavigationItem",
  component: GnNavigationItem,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A single navigation entry pairing an optional icon with a label. Meant to be repeated inside a nav container you build yourself — the outer container's layout (row vs column) is independent of each item's own `direction`, so the same component covers a vertical side nav, a horizontal top/bottom bar, and compact variants that mix the two."
      }
    }
  },
  argTypes: {
    direction: {
      control: "select",
      options: ["col", "row"]
    },
    label: { control: "text" }
  },
  args: {
    direction: "col",
    label: "Home"
  },
  render: (args) => ({
    components: { GnNavigationItem },
    setup() {
      return { args, homeIcon };
    },
    template: `<GnNavigationItem v-bind="args"><span v-html="homeIcon" /></GnNavigationItem>`
  })
} satisfies Meta<typeof GnNavigationItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Column: Story = {
  args: { direction: "col" },
  parameters: {
    docs: {
      description: {
        story: "Default layout: icon stacked above the label. Use this for a vertical side nav."
      }
    }
  }
};

export const LabelOnly: Story = {
  render: (args) => ({
    components: { GnNavigationItem },
    setup() {
      return { args };
    },
    template: `<GnNavigationItem v-bind="args" />`
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Omitting the default slot renders a text-only item — the icon wrapper (and its gap) is skipped entirely rather than leaving an empty space."
      }
    }
  }
};

export const Row: Story = {
  args: { direction: "row" },
  parameters: {
    docs: {
      description: {
        story: "Icon and label laid out side by side. Use this for a horizontal top/bottom bar."
      }
    }
  }
};

export const CustomAccent: Story = {
  args: { color: "#0A9CF2" },
  parameters: {
    docs: {
      description: {
        story: "The `color` prop overrides the icon's accent color independently of `backgroundColor`/`textColor`/`borderColor`."
      }
    }
  }
};

// A vertical side nav: several items stacked in a column, each laid out
// internally as "col" (icon above label).
export const SideNav: Story = {
  render: (args) => ({
    components: { GnNavigationItem },
    setup() {
      return { args, homeIcon };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem; width: 4rem;">
        <GnNavigationItem direction="col" label="Home"><span v-html="homeIcon" /></GnNavigationItem>
        <GnNavigationItem direction="col" label="Search"><span v-html="homeIcon" /></GnNavigationItem>
        <GnNavigationItem direction="col" label="Settings"><span v-html="homeIcon" /></GnNavigationItem>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          "A full vertical side nav: the consumer wraps several items in their own `flex-direction: column` container, with each item internally using `direction=\"col\"` too."
      }
    }
  }
};

// A horizontal top/bottom bar: several items laid out in a row, each
// internally as "row" (icon beside label).
export const TopBar: Story = {
  render: (args) => ({
    components: { GnNavigationItem },
    setup() {
      return { args, homeIcon };
    },
    template: `
      <div style="display: flex; flex-direction: row; gap: 1.5rem;">
        <GnNavigationItem direction="row" label="Home"><span v-html="homeIcon" /></GnNavigationItem>
        <GnNavigationItem direction="row" label="Search"><span v-html="homeIcon" /></GnNavigationItem>
        <GnNavigationItem direction="row" label="Settings"><span v-html="homeIcon" /></GnNavigationItem>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          "A full horizontal top/bottom bar: the outer container is `flex-direction: row`, and each item internally uses `direction=\"row\"` to sit icon-beside-label."
      }
    }
  }
};

// The outer container's layout (row vs column) and each item's internal
// `direction` are independent — mix them for a space-saving top/bottom bar
// where the icon sits above a small label, like a mobile tab bar.
export const CompactTopBar: Story = {
  render: (args) => ({
    components: { GnNavigationItem },
    setup() {
      return { args, homeIcon };
    },
    template: `
      <div style="display: flex; flex-direction: row; gap: 1.5rem;">
        <GnNavigationItem direction="col" label="Home"><span v-html="homeIcon" /></GnNavigationItem>
        <GnNavigationItem direction="col" label="Search"><span v-html="homeIcon" /></GnNavigationItem>
        <GnNavigationItem direction="col" label="Settings"><span v-html="homeIcon" /></GnNavigationItem>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The outer container's layout and each item's `direction` are independent, so they can be mixed: a row container (top/bottom bar) with `direction=\"col\"` items saves vertical space, similar to a mobile app's tab bar."
      }
    }
  }
};

export const WithFontAwesome: Story = {
  render: (args) => ({
    components: { GnNavigationItem, FontAwesomeIcon },
    setup() {
      return { args };
    },
    template: `<GnNavigationItem v-bind="args"><font-awesome-icon icon="house" /></GnNavigationItem>`
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Since the icon is just the default slot, any icon library works — here a `<font-awesome-icon>` is passed in instead of an inline SVG, the same way GnIconButton supports it."
      }
    }
  }
};

import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { GnNavigationBar } from "./index";
import { GnNavigationHeader } from "../GnNavigationHeader";
import { GnNavigationItem } from "../GnNavigationItem";

// GnNavigationBar doesn't hardcode a header or any items — it's a layout
// shell with `header`/`items`/`trailing` slots. Compose it from the other
// nav components, each configured with its own props/icon exactly as it
// would be used on its own.
const logoIcon = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <polygon points="12,3 19.8,7.5 19.8,16.5 12,21 4.2,16.5 4.2,7.5"
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M12 12L12 3M12 12L19.8 16.5M12 12L4.2 16.5"
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

const homeIcon = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

const searchIcon = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2" />
    <path d="M21 21l-4.3-4.3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  </svg>
`;

const meta = {
  title: "Navigation/GnNavigationBar",
  component: GnNavigationBar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A layout shell that arranges a GnNavigationHeader, a list of GnNavigationItems, and optional trailing content into one bar — a vertical side nav or a horizontal top/bottom bar, depending on `direction`. Each slotted component keeps its own independent props; GnNavigationBar only owns the outer layout."
      }
    }
  },
  argTypes: {
    direction: {
      control: "select",
      options: ["col", "row"]
    }
  },
  args: {
    direction: "col"
  }
} satisfies Meta<typeof GnNavigationBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SideNav: Story = {
  args: { direction: "col" },
  render: (args) => ({
    components: { GnNavigationBar, GnNavigationHeader, GnNavigationItem },
    setup() {
      return { args, logoIcon, homeIcon, searchIcon };
    },
    template: `
      <GnNavigationBar v-bind="args">
        <template #header>
          <GnNavigationHeader title="Graphyne" direction="col"><span v-html="logoIcon" /></GnNavigationHeader>
        </template>
        <template #items>
          <GnNavigationItem label="Home" direction="col"><span v-html="homeIcon" /></GnNavigationItem>
          <GnNavigationItem label="Search" direction="col"><span v-html="searchIcon" /></GnNavigationItem>
        </template>
      </GnNavigationBar>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: "Vertical side nav: header on top, items stacked below. Use this for a collapsible app sidebar."
      }
    }
  }
};

export const TopBar: Story = {
  args: { direction: "row" },
  render: (args) => ({
    components: { GnNavigationBar, GnNavigationHeader, GnNavigationItem },
    setup() {
      return { args, logoIcon, homeIcon, searchIcon };
    },
    template: `
      <GnNavigationBar v-bind="args">
        <template #header>
          <GnNavigationHeader title="Graphyne" direction="row"><span v-html="logoIcon" /></GnNavigationHeader>
        </template>
        <template #items>
          <GnNavigationItem label="Home" direction="row"><span v-html="homeIcon" /></GnNavigationItem>
          <GnNavigationItem label="Search" direction="row"><span v-html="searchIcon" /></GnNavigationItem>
        </template>
      </GnNavigationBar>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: "Horizontal top bar: header on the left, items laid out beside it. Use this for a page header nav."
      }
    }
  }
};

export const WithTrailingContent: Story = {
  args: { direction: "row" },
  render: (args) => ({
    components: { GnNavigationBar, GnNavigationHeader, GnNavigationItem },
    setup() {
      return { args, logoIcon, homeIcon, searchIcon };
    },
    template: `
      <GnNavigationBar v-bind="args">
        <template #header>
          <GnNavigationHeader title="Graphyne" direction="row"><span v-html="logoIcon" /></GnNavigationHeader>
        </template>
        <template #items>
          <GnNavigationItem label="Home" direction="row"><span v-html="homeIcon" /></GnNavigationItem>
          <GnNavigationItem label="Search" direction="row"><span v-html="searchIcon" /></GnNavigationItem>
        </template>
        <template #trailing>
          <GnNavigationItem label="Account" direction="row" />
        </template>
      </GnNavigationBar>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The `trailing` slot is pushed to the far end of the bar (right in a row, bottom in a column) — useful for account/settings actions."
      }
    }
  }
};

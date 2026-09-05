import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { GnNavigationBar } from "./index";
import { GnNavigationHeader } from "../GnNavigationHeader";
import { GnNavigationItem } from "../GnNavigationItem";
import GnSearchFormField from "../../forms/GnSearchFormField/GnSearchFormField.vue";
import GnIconButton from "../../buttons/GnIconButton/GnIconButton.vue";
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

const settingsIcon = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
      fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

const userIcon = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2" />
    <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7"
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
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
  decorators: [
    () => ({
      // GnNavigationBar (col) fills 100% of its parent's height and shrinks
      // to fit its content's width — it doesn't stretch across the screen
      // like the row/top bar does. Pinning it to a screen edge is a
      // page-layout decision, so that's left to the consuming app too (a
      // `position: fixed` wrapper, as here — swap `left: 0` for `right: 0`
      // to dock it on the other side) rather than baked into the component.
      template: `<div style="position: fixed; top: 0; left: 0; height: 100vh;"><story /></div>`
    })
  ],
  render: (args) => ({
    components: { GnNavigationBar, GnNavigationHeader, GnNavigationItem, GnIconButton },
    setup() {
      return { args, logoIcon, homeIcon, searchIcon, settingsIcon, userIcon };
    },
    template: `
      <GnNavigationBar v-bind="args">
        <template #header>
          <GnNavigationHeader title="Graphyne" titleSize="15px" direction="col"><span v-html="logoIcon" /></GnNavigationHeader>
        </template>
        <template #items>
          <GnNavigationItem label="Home" direction="col"><span v-html="homeIcon" /></GnNavigationItem>
          <GnNavigationItem label="Search" direction="col"><span v-html="searchIcon" /></GnNavigationItem>
        </template>
        <template #trailing>
          <GnIconButton label="Settings" variant="ghost" size="md"><span v-html="settingsIcon" /></GnIconButton>
          <GnIconButton label="Account" variant="ghost" size="md"><span v-html="userIcon" /></GnIconButton>
        </template>
      </GnNavigationBar>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Vertical side nav: header on top, items stacked below. Use this for a collapsible app sidebar. Unlike the row/top bar, it doesn't stretch to fill the available width — it shrinks to fit its widest child (here, the header title; keep items/trailing icon-only with no `label` for a slim icon rail sized to just the icon width) and fills the full height of its parent. Give that parent an explicit height for the height to take effect (e.g. `html, body, #app { height: 100% }`), and position it (e.g. `position: fixed; left: 0` or `right: 0`) to dock it to a screen edge, as this story's decorator does."
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

export const WithTrailingSearchBar: Story = {
  args: { direction: "row" },
  render: (args) => ({
    components: { GnNavigationBar, GnNavigationHeader, GnNavigationItem, GnSearchFormField },
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
          <GnSearchFormField label="Search" placeholder="Search"/>
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


export const WithTrailingIcons: Story = {
  args: { direction: "row" },
  render: (args) => ({
    components: { GnNavigationBar, GnNavigationHeader, GnNavigationItem, GnIconButton },
    setup() {
      return { args, logoIcon, homeIcon, searchIcon, settingsIcon, userIcon };
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
          <div style="display: flex; gap: 0.5rem;">
            <GnIconButton label="Settings" variant="ghost" size="md"><span v-html="settingsIcon" /></GnIconButton>
            <GnIconButton label="Account" variant="ghost" size="md"><span v-html="userIcon" /></GnIconButton>
          </div>
        </template>
      </GnNavigationBar>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The `trailing` slot is pushed to the far end of the bar (right in a row, bottom in a column) — useful for a row of account/settings icon buttons. Each `GnIconButton` needs its own `label` (used as `aria-label`, since it has no visible text) and an icon passed into its default slot."
      }
    }
  }
};
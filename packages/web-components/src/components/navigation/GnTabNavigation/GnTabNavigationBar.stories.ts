import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCalendar, faListCheck, faChartBar } from "@fortawesome/free-solid-svg-icons";
import { GnTabNavigationBar } from "./index";
import { GnTabNavigationItem } from "../GnTabNavigationItem";

library.add(faCalendar, faListCheck, faChartBar);

// GnTabNavigationBar is a slot-composed shell, same idea as GnNavigationBar
// — it doesn't render tabs itself. Compose it from GnTabNavigationItem.
const meta = {
  title: "Navigation/GnTabNavigationBar",
  component: GnTabNavigationBar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A horizontal tab bar shell for a sub-nav beneath a page's main navigation. Like GnNavigationBar, it only owns the row layout, background/border, and a shared accent/text-color/icon-size that cascades to slotted icons — place tab items (GnTabNavigationItem) in the default slot. It tracks which tab is active via `v-model`, exposing `active`/`select` through the default slot's scope so you can wire highlighting and click handling into whatever's slotted in. Rendering the subpage content for the active tab is left to the consumer, driven by the same `v-model`."
      }
    }
  }
} satisfies Meta<typeof GnTabNavigationBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { GnTabNavigationBar, GnTabNavigationItem, FontAwesomeIcon },
    setup() {
      return { args };
    },
    template: `
      <GnTabNavigationBar v-bind="args">
        <GnTabNavigationItem label="Session Review"><font-awesome-icon icon="fa-solid fa-calendar" /></GnTabNavigationItem>
        <GnTabNavigationItem label="Decks"><font-awesome-icon icon="fa-solid fa-list-check" /></GnTabNavigationItem>
        <GnTabNavigationItem label="Statistics"><font-awesome-icon icon="fa-solid fa-chart-bar" /></GnTabNavigationItem>
      </GnTabNavigationBar>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: "Basic composition with no `v-model` bound — every tab item is unselected. See WithActiveTabAndSubpage for the selected-indicator behavior."
      }
    }
  }
};

export const WithActiveTabAndSubpage: Story = {
  render: (args) => ({
    components: { GnTabNavigationBar, GnTabNavigationItem, FontAwesomeIcon },
    setup() {
      const activeTab = ref("Decks");
      return { args, activeTab };
    },
    template: `
      <div>
        <GnTabNavigationBar v-bind="args" v-model="activeTab" v-slot="{ active, select }">
          <GnTabNavigationItem
            label="Session Review"
            :selected="active === 'Session Review'"
            @gn-click="select('Session Review')"
          ><font-awesome-icon icon="fa-solid fa-calendar" /></GnTabNavigationItem>
          <GnTabNavigationItem
            label="Decks"
            :selected="active === 'Decks'"
            @gn-click="select('Decks')"
          ><font-awesome-icon icon="fa-solid fa-list-check" /></GnTabNavigationItem>
          <GnTabNavigationItem
            label="Statistics"
            :selected="active === 'Statistics'"
            @gn-click="select('Statistics')"
          ><font-awesome-icon icon="fa-solid fa-chart-bar" /></GnTabNavigationItem>
        </GnTabNavigationBar>
        <p style="text-align: center; padding: 1rem;">
          Subpage for "{{ activeTab }}" — rendered by the consumer, not GnTabNavigationBar itself.
        </p>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          "`v-model` tracks the active tab; the default slot's `active`/`select` scope wires each GnTabNavigationItem's `selected` state and `gn-click` handler. The paragraph below stands in for a real subpage — swap it for a `v-if`/`v-show` block per tab, or a router-view, driven by the same `activeTab` value."
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
    components: { GnTabNavigationBar, GnTabNavigationItem, FontAwesomeIcon },
    setup() {
      const activeTab = ref("Decks");
      return { args, activeTab };
    },
    template: `
      <GnTabNavigationBar v-bind="args" v-model="activeTab" v-slot="{ active, select }">
        <GnTabNavigationItem
          label="Session Review"
          :selected="active === 'Session Review'"
          @gn-click="select('Session Review')"
        ><font-awesome-icon icon="fa-solid fa-calendar" /></GnTabNavigationItem>
        <GnTabNavigationItem
          label="Decks"
          :selected="active === 'Decks'"
          @gn-click="select('Decks')"
        ><font-awesome-icon icon="fa-solid fa-list-check" /></GnTabNavigationItem>
        <GnTabNavigationItem
          label="Statistics"
          :selected="active === 'Statistics'"
          @gn-click="select('Statistics')"
        ><font-awesome-icon icon="fa-solid fa-chart-bar" /></GnTabNavigationItem>
      </GnTabNavigationBar>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: "backgroundColor and borderColor applied as independent overrides, same pattern as GnNavigationBar."
      }
    }
  }
};

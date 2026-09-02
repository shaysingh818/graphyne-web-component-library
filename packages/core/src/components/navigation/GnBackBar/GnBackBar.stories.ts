import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeft, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { GnBackBar } from "./index";
import GnIconButton from "../../buttons/GnIconButton/GnIconButton.vue";

library.add(faArrowLeft, faPenToSquare, faTrash);

// Any inline SVG (or icon-font markup, or a <font-awesome-icon>) works —
// GnBackBar just renders whatever is passed into its default slot, the
// same convention as GnIconButton/GnNavigationItem.
const backIcon = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 12H5M12 19l-7-7 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

const editIcon = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

const meta = {
  title: "Navigation/GnBackBar",
  component: GnBackBar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A compact header for a \"back to previous screen\" pattern: a leading back button, a centered title with an optional subtitle, and a trailing row of actions. The back icon comes through the default slot and clicking it only emits `gn-back` — it never navigates on its own, so it works the same whether the consumer wraps a Vue Router, a plain history API call, or a modal close. `actions` is a named slot rather than an `{icon, handler}[]` prop, since a function prop can't cross the custom-element boundary; compose it with `<GnIconButton>` (or anything else), each wired to its own click handler."
      }
    }
  },
  argTypes: {
    title: { control: "text" },
    subtitle: { control: "text" },
    backLabel: { control: "text" }
  },
  args: {
    title: "Settings",
    subtitle: "Last updated 04/02/2026"
  },
  render: (args) => ({
    components: { GnBackBar },
    setup() {
      return { args, backIcon };
    },
    template: `<GnBackBar v-bind="args"><span v-html="backIcon" /></GnBackBar>`
  })
} satisfies Meta<typeof GnBackBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Back button, title, and subtitle. Clicking the back icon emits `gn-back` — check the Actions panel."
      }
    }
  }
};

export const TitleOnly: Story = {
  args: { subtitle: undefined },
  parameters: {
    docs: {
      description: {
        story: "`subtitle` is omitted entirely (not just empty) when unset, so the title sits alone without leftover spacing."
      }
    }
  }
};

export const WithoutBackButton: Story = {
  render: (args) => ({
    components: { GnBackBar },
    setup() {
      return { args };
    },
    template: `<GnBackBar v-bind="args" />`
  }),
  parameters: {
    docs: {
      description: {
        story: "Leaving the default slot empty drops the back button entirely, so the same component doubles as a plain title bar."
      }
    }
  }
};

export const WithActions: Story = {
  render: (args) => ({
    components: { GnBackBar, GnIconButton },
    setup() {
      return { args, backIcon, editIcon };
    },
    template: `
      <GnBackBar v-bind="args">
        <span v-html="backIcon" />
        <template #actions>
          <GnIconButton label="Edit" variant="ghost" size="sm"><span v-html="editIcon" /></GnIconButton>
        </template>
      </GnBackBar>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: "Trailing actions are composed in the `actions` slot, each with its own click handler — no `{icon, handler}` array prop is needed."
      }
    }
  }
};

export const WithFontAwesome: Story = {
  render: (args) => ({
    components: { GnBackBar, GnIconButton, FontAwesomeIcon },
    setup() {
      return { args };
    },
    template: `
      <GnBackBar v-bind="args">
        <font-awesome-icon icon="fa-solid fa-arrow-left" />
        <template #actions>
          <GnIconButton label="Edit" variant="ghost" size="sm">
            <font-awesome-icon icon="fa-solid fa-pen-to-square" />
          </GnIconButton>
          <GnIconButton label="Delete" variant="ghost" size="sm">
            <font-awesome-icon icon="fa-solid fa-trash" />
          </GnIconButton>
        </template>
      </GnBackBar>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: "The original component this was ported from hardcoded `<font-awesome-icon>` directly in its template. That import breaks for any consumer without FontAwesome installed, so it's used here only as one example of what can be passed into the slot — any icon source works identically."
      }
    }
  }
};

export const CustomColors: Story = {
  args: {
    color: "#38bdf8",
    backgroundColor: "#0f172a",
    textColor: "#f8fafc",
    subtitleColor: "#94a3b8"
  },
  parameters: {
    docs: {
      description: {
        story: "`color`, `backgroundColor`, `textColor`, `subtitleColor`, and `borderColor` are independent overrides, each falling back to the default white background with an orange accent when unset."
      }
    }
  }
};

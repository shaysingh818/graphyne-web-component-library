import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { GnCard } from "./index";
import { GnButton } from "../../buttons/GnButton";

const meta = {
  title: "Layout/GnCard",
  component: GnCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A simple bordered container with an optional title and an optional named `footer` slot, for grouping related content — settings sections, form panels, list items, etc."
      }
    }
  },
  argTypes: {
    title: { control: "text" }
  },
  args: {
    title: "Project settings"
  }
} satisfies Meta<typeof GnCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { GnCard },
    setup() {
      return { args };
    },
    template: `
      <GnCard v-bind="args">
        <p>Body content goes here. Any markup or nested components can go in the default slot.</p>
      </GnCard>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: "A titled card with only body content — no footer."
      }
    }
  }
};

export const WithFooter: Story = {
  render: (args) => ({
    components: { GnCard, GnButton },
    setup() {
      return { args };
    },
    template: `
      <GnCard v-bind="args">
        <p>Cards can render arbitrary content, including other Graphyne components.</p>
        <template #footer>
          <GnButton variant="secondary">Cancel</GnButton>
          <GnButton>Save</GnButton>
        </template>
      </GnCard>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: "The named `footer` slot renders below the body, separated by a divider — typically used for action buttons."
      }
    }
  }
};

export const Untitled: Story = {
  args: { title: undefined },
  render: (args) => ({
    components: { GnCard },
    setup() {
      return { args };
    },
    template: `<GnCard v-bind="args">A card without a header.</GnCard>`
  }),
  parameters: {
    docs: {
      description: {
        story: "Omitting `title` skips the header entirely rather than rendering an empty one."
      }
    }
  }
};

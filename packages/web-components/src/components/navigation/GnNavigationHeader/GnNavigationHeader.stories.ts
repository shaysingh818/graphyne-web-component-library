import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { GnNavigationHeader } from "./index";

library.add(faHouse);

// Any inline SVG (or icon-font markup, or a <font-awesome-icon>) works —
// GnNavigationItem just renders whatever is passed into its default slot,
// the same convention as GnIconButton.
const logoIcon = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <polygon points="12,3 19.8,7.5 19.8,16.5 12,21 4.2,16.5 4.2,7.5"
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M12 12L12 3M12 12L19.8 16.5M12 12L4.2 16.5"
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

const meta = {
  title: "Navigation/GnNavigationHeader",
  component: GnNavigationHeader,
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
    title: { control: "text" },
    iconSize: { control: "text" },
    titleSize: { control: "text" },
    titleMaxWidth: { control: "text" }
  },
  args: {
    direction: "row",
    title: "Graphyne"
  },
  render: (args) => ({
    components: { GnNavigationHeader },
    setup() {
      return { args, logoIcon };
    },
    template: `<GnNavigationHeader v-bind="args"><span v-html="logoIcon" /></GnNavigationHeader>`
  })
} satisfies Meta<typeof GnNavigationHeader>;

export default meta;
type Story = StoryObj<typeof meta>;


export const Row: Story = {
  args: { direction: "row", iconSize: "1.75rem" },
  parameters: {
    docs: {
      description: {
        story: "Default layout: icon stacked above the label. Use this for a vertical side nav."
      }
    }
  }
};

export const Column: Story = {
  args: { direction: "col" },
  parameters: {
    docs: {
      description: {
        story: "Vertical layout: icon stacked above the label. Use this for a compact side nav or app logo mark."
      }
    }
  }
};

export const ColumnWithLongTitle: Story = {
  args: { direction: "col", title: "Graphyne Component Library" },
  parameters: {
    docs: {
      description: {
        story:
          "In column layout the title's width is capped by `titleMaxWidth` (independent of `iconSize`), so a title longer than that width wraps onto additional lines instead of stretching the header — the full title always stays readable, even next to a small icon."
      }
    }
  }
};

export const CustomSizes: Story = {
  args: { direction: "col", iconSize: "3rem", titleSize: "0.75rem" },
  parameters: {
    docs: {
      description: {
        story: "`iconSize` and `titleSize` independently override the icon's width/height and the title's font-size."
      }
    }
  }
};

export const CustomTitleMaxWidth: Story = {
  args: { direction: "col", title: "Graphyne Component Library", titleMaxWidth: "5rem" },
  parameters: {
    docs: {
      description: {
        story:
          "`titleMaxWidth` controls how wide the title is allowed to get in column layout before wrapping, independently of `iconSize` — useful for a small icon with a longer name underneath."
      }
    }
  }
};
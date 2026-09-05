import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faListCheck, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { GnListTile } from "./index";
import GnTag from "../../display/GnTag/GnTag.vue";
import GnIconButton from "../../buttons/GnIconButton/GnIconButton.vue";

library.add(faListCheck, faEllipsisVertical);

// Any inline SVG (or icon-font markup, or a <font-awesome-icon>) works in
// `leading` — same convention as every other icon-slot component here.
const listIcon = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 11l3 3L22 4M3 12l3 3L16 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

const moreIcon = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="5" r="1.5" fill="currentColor" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <circle cx="12" cy="19" r="1.5" fill="currentColor" />
  </svg>
`;

const starIcon = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <polygon points="12,2 15,9 22,9.5 16.5,14 18,21 12,17.5 6,21 7.5,14 2,9.5 9,9" fill="currentColor" />
  </svg>
`;

// A small solid-color placeholder — any real <img src="..."> works
// identically, this just avoids depending on an external image URL.
const avatarDataUri =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="#0ea5e9"/><text x="20" y="26" font-size="16" fill="white" text-anchor="middle" font-family="sans-serif">JR</text></svg>`
  );

const meta = {
  title: "Layout/GnListTile",
  component: GnListTile,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A generic list-row layout primitive: leading / title+description+tags / trailing. `leading` and `trailing` are slots (an icon, an avatar image, whatever), `tags` is a slot too (compose GnTag or anything else) rather than a hardcoded array prop. Only leading+content sit inside the clickable region (a real `<button>`, emitting `gn-click`) — `trailing` is a plain sibling, so nothing placed there can ever accidentally trigger `gn-click`. Extracted from an app-specific \"deck list item\" that hardcoded routing, a data-store delete flow, a dropdown menu, and FontAwesome icons — see the component's own JSDoc for the full list of what was intentionally dropped rather than ported."
      }
    }
  },
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    disabled: { control: "boolean" }
  },
  args: {
    title: "Chapter 3: Cell Biology",
    description: "42 cards · Updated 3 days ago"
  },
  render: (args) => ({
    components: { GnListTile },
    setup() {
      return { args, listIcon };
    },
    template: `
      <GnListTile v-bind="args">
        <template #leading><span v-html="listIcon" /></template>
      </GnListTile>
    `
  })
} satisfies Meta<typeof GnListTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Click the leading/title/description region — check the Actions panel for gn-click. Keyboard-focus it and press Enter/Space too; it's a real <button> under the hood."
      }
    }
  }
};

export const WithImage: Story = {
  render: (args) => ({
    components: { GnListTile },
    setup() {
      return { args, avatarDataUri };
    },
    template: `
      <GnListTile v-bind="args" title="Jordan Rivera" description="jordan@graphyne.dev">
        <template #leading><img :src="avatarDataUri" alt="" /></template>
      </GnListTile>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: "An <img> in the leading slot gets its own default sizing/circular crop (40×40, object-fit: cover, fully rounded) so an avatar photo looks right without any extra styling from the consumer — the specific \"images as leading content\" case this component was built for."
      }
    }
  }
};

export const WithTags: Story = {
  render: (args) => ({
    components: { GnListTile, GnTag, GnIconButton },
    setup() {
      return { args, listIcon, moreIcon };
    },
    template: `
      <GnListTile v-bind="args">
        <template #leading><span v-html="listIcon" /></template>
        <template #tags>
          <GnTag label="Biology" />
          <GnTag label="Exam" variant="secondary" />
        </template>
        <template #trailing>
          <GnIconButton label="More options" variant="ghost" size="sm"><span v-html="moreIcon" /></GnIconButton>
        </template>
      </GnListTile>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: "The tags row is a slot, not a `tags: string[]` prop with a hardcoded tag component inside — compose GnTag (or anything else) with whatever variant/color each tag needs."
      }
    }
  }
};

export const WithTrailingActions: Story = {
  render: (args) => ({
    components: { GnListTile, GnIconButton },
    setup() {
      return { args, listIcon, moreIcon };
    },
    template: `
      <GnListTile v-bind="args">
        <template #leading><span v-html="listIcon" /></template>
        <template #trailing>
          <GnIconButton label="More options" variant="ghost" size="sm"><span v-html="moreIcon" /></GnIconButton>
        </template>
      </GnListTile>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: "Trailing actions are composed with GnIconButton, same as GnBackBar's actions slot. Click the trailing button and check the Actions panel — only its own gn-click fires; the tile's gn-click never does, since trailing sits outside the clickable button entirely rather than needing @click.stop like the original required on every trailing icon."
      }
    }
  }
};

export const WithTrailingIcons: Story = {
  render: (args) => ({
    components: { GnListTile, GnIconButton },
    setup() {
      return { args, listIcon, starIcon, moreIcon };
    },
    template: `
      <GnListTile v-bind="args">
        <template #leading><span v-html="listIcon" /></template>
        <template #trailing>
          <span v-html="starIcon" />
          <GnIconButton label="More options" variant="ghost" size="sm"><span v-html="moreIcon" /></GnIconButton>
        </template>
      </GnListTile>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: "Two different ways to put an icon in trailing, side by side: a bare, non-interactive icon (the star — just `<span v-html=\"...\">`, no wrapper) and an interactive one inside GnIconButton (the ellipsis). A bare icon gets its own default size/color from `trailingColor` (falls back to a neutral gray) so it looks right without extra styling; a wrapped icon like GnIconButton's keeps controlling its own size/color instead, so the two don't fight over sizing."
      }
    }
  }
};

export const WithFontAwesome: Story = {
  render: (args) => ({
    components: { GnListTile, GnIconButton, FontAwesomeIcon },
    setup() {
      return { args };
    },
    template: `
      <GnListTile v-bind="args">
        <template #leading><font-awesome-icon icon="fa-solid fa-list-check" /></template>
        <template #trailing>
          <GnIconButton label="More options" variant="ghost" size="sm">
            <font-awesome-icon icon="fa-solid fa-ellipsis-vertical" />
          </GnIconButton>
        </template>
      </GnListTile>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: "The original component this was extracted from hardcoded `<font-awesome-icon>` directly. That import breaks for any consumer without FontAwesome installed, so it's used here only as one example of what can be passed into the leading/trailing slots — any icon source works identically."
      }
    }
  }
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => ({
    components: { GnListTile },
    setup() {
      return { args, listIcon };
    },
    template: `
      <GnListTile v-bind="args">
        <template #leading><span v-html="listIcon" /></template>
      </GnListTile>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: "Disabled drops the hover highlight, dims the tile, and the clickable region becomes a real disabled <button> — clicking it does not emit gn-click."
      }
    }
  }
};

export const CustomColors: Story = {
  args: {
    color: "#0ea5e9",
    backgroundColor: "#1c1917",
    textColor: "#f9fafb",
    descriptionColor: "#9ca3af",
    borderColor: "#292524"
  },
  render: (args) => ({
    components: { GnListTile },
    setup() {
      return { args, listIcon };
    },
    template: `
      <GnListTile v-bind="args">
        <template #leading><span v-html="listIcon" /></template>
      </GnListTile>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: "color, backgroundColor, textColor, descriptionColor, and borderColor are independent overrides, each falling back to the default light look when unset. The hover highlight is a color-mix() tint of `color` over the tile's own background, so it stays sensible against both light and dark backgroundColor values instead of hardcoding one specific hover color like the original did."
      }
    }
  }
};

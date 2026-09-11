import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { fn } from "storybook/test";
import { GnFileUploadField } from "./index";

// A minimal 1x1 transparent PNG, used so preview stories can show a real
// decodable image thumbnail instead of a broken-image icon.
const ONE_PIXEL_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

function sampleFile(name: string, type: string, base64?: string): File {
  if (base64) {
    const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
    return new File([bytes], name, { type });
  }
  return new File(["sample content"], name, { type });
}

const meta = {
  title: "Forms/GnFileUploadField",
  component: GnFileUploadField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A drag-and-drop file upload dropzone with `v-model` support, built entirely on the native `<input type=\"file\">` and HTML5 drag-and-drop — no platform-specific file dialog, so it works the same in a plain browser app or inside an Electron/Tauri webview. `modelValue` is a `File[]`; image files get a live thumbnail, other files fall back to a generic file glyph."
      }
    }
  },
  argTypes: {
    accept: { control: "text" },
    multiple: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
    error: { control: "text" }
  },
  args: {
    accept: "image/*",
    multiple: true,
    disabled: false,
    label: "Upload images",
    "onUpdate:modelValue": fn(),
    "onGn-update": fn(),
    "onGn-remove": fn()
  },
  render: (args) => ({
    components: { GnFileUploadField },
    setup() {
      return { args };
    },
    template: `<GnFileUploadField v-bind="args" />`
  })
} satisfies Meta<typeof GnFileUploadField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "An empty dropzone. Click to browse, or drag and drop files onto it."
      }
    }
  }
};

export const WithSelectedFiles: Story = {
  args: {
    modelValue: [
      sampleFile("cover-photo.png", "image/png", ONE_PIXEL_PNG_BASE64),
      sampleFile("floor-plan.pdf", "application/pdf")
    ]
  },
  parameters: {
    docs: {
      description: {
        story:
          "With files already selected. Image files render a live thumbnail via `URL.createObjectURL`; other file types fall back to a generic file glyph."
      }
    }
  }
};

export const SingleFile: Story = {
  args: { multiple: false, label: "Upload a profile photo" },
  parameters: {
    docs: {
      description: {
        story: "With `multiple: false`, a new selection replaces the current file instead of appending to it."
      }
    }
  }
};

export const Disabled: Story = {
  args: {
    disabled: true,
    modelValue: [sampleFile("cover-photo.png", "image/png", ONE_PIXEL_PNG_BASE64)]
  },
  parameters: {
    docs: {
      description: {
        story: "Dims the dropzone and prevents selection, drop, and removal from firing."
      }
    }
  }
};

export const WithError: Story = {
  args: { error: "At least one image is required." },
  parameters: {
    docs: {
      description: {
        story: "The `error` prop renders a message below the field and marks the input invalid via `aria-invalid`/`aria-describedby`."
      }
    }
  }
};

export const CustomAccent: Story = {
  args: { color: "#059669" },
  parameters: {
    docs: {
      description: {
        story: "The `color` prop overrides the dropzone's accent (icon, label, hover/drag-over border), independently of `backgroundColor`/`textColor`/`borderColor`."
      }
    }
  }
};

export const DarkDropzone: Story = {
  args: {
    label: undefined,
    backgroundColor: "rgb(28, 25, 23)",
    textColor: "#f97316",
    borderColor: "#f97316",
    color: "#f97316"
  },
  parameters: {
    docs: {
      description: {
        story: "A dark dropzone reproduced with `backgroundColor`, `textColor`, `borderColor`, and `color`, and no label."
      }
    }
  }
};

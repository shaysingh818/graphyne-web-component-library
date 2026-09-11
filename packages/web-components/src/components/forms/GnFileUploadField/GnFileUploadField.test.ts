import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { GnFileUploadField } from "./index";

// jsdom doesn't implement the Blob URL APIs; stub them so the component's
// image-preview watcher (URL.createObjectURL/revokeObjectURL) has something to call.
let objectUrlCount = 0;
beforeAll(() => {
  URL.createObjectURL = vi.fn(() => `blob:mock-${objectUrlCount++}`);
  URL.revokeObjectURL = vi.fn();
});
afterAll(() => {
  vi.restoreAllMocks();
});

function makeFile(name: string, type = "image/png", lastModified = 1700000000000): File {
  return new File(["content"], name, { type, lastModified });
}

async function drop(wrapper: ReturnType<typeof mount>, files: File[]) {
  await wrapper.find(".gn-file-upload-field__dropzone").trigger("drop", {
    dataTransfer: { files }
  });
}

describe("GnFileUploadField", () => {
  it("renders no file list when modelValue is empty", () => {
    const wrapper = mount(GnFileUploadField);
    expect(wrapper.find(".gn-file-upload-field__list").exists()).toBe(false);
  });

  it("renders the label and associates it with the input", () => {
    const wrapper = mount(GnFileUploadField, { props: { label: "Upload images" } });
    const label = wrapper.find("label");
    const input = wrapper.find("input");
    expect(label.text()).toBe("Upload images");
    expect(label.attributes("for")).toBe(input.attributes("id"));
  });

  it("adds a dropped file and emits update:modelValue and gn-update", async () => {
    const wrapper = mount(GnFileUploadField);
    const file = makeFile("photo.png");
    await drop(wrapper, [file]);

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([[file]]);
    expect(wrapper.emitted("gn-update")?.[0]).toEqual([[file]]);
  });

  it("de-duplicates files by name, size, and lastModified", async () => {
    const wrapper = mount(GnFileUploadField);
    const file = makeFile("photo.png");
    const sameFileAgain = makeFile("photo.png");
    await drop(wrapper, [file, sameFileAgain]);

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([[file]]);
  });

  it("replaces rather than appends when multiple is false", async () => {
    const first = makeFile("a.png");
    const second = makeFile("b.png");
    const wrapper = mount(GnFileUploadField, { props: { multiple: false, modelValue: [first] } });
    await drop(wrapper, [second]);

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([[second]]);
  });

  it("does not add dropped files when disabled", async () => {
    const wrapper = mount(GnFileUploadField, { props: { disabled: true } });
    await drop(wrapper, [makeFile("photo.png")]);

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("removes a file and emits gn-remove with just that file", async () => {
    const keep = makeFile("keep.png");
    const remove = makeFile("remove.png");
    const wrapper = mount(GnFileUploadField, { props: { modelValue: [keep, remove] } });

    const removeButtons = wrapper.findAll(".gn-file-upload-field__remove");
    await removeButtons[1].trigger("click");

    expect(wrapper.emitted("gn-remove")?.[0]).toEqual([remove]);
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([[keep]]);
  });

  it("does not remove files when disabled", async () => {
    const file = makeFile("photo.png");
    const wrapper = mount(GnFileUploadField, { props: { disabled: true, modelValue: [file] } });
    await wrapper.find(".gn-file-upload-field__remove").trigger("click");

    expect(wrapper.emitted("gn-remove")).toBeUndefined();
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("shows an image thumbnail for image files and a generic icon for others", () => {
    const wrapper = mount(GnFileUploadField, {
      props: { modelValue: [makeFile("photo.png", "image/png"), makeFile("notes.txt", "text/plain")] }
    });
    const rows = wrapper.findAll(".gn-file-upload-field__row");
    expect(rows[0].find("img.gn-file-upload-field__thumb").exists()).toBe(true);
    expect(rows[1].find("svg.gn-file-upload-field__thumb--generic").exists()).toBe(true);
  });

  it("renders no error message by default", () => {
    const wrapper = mount(GnFileUploadField);
    expect(wrapper.find(".gn-file-upload-field__error").exists()).toBe(false);
    expect(wrapper.find("input").attributes("aria-invalid")).toBeUndefined();
  });

  it("renders the error message and marks the input invalid", () => {
    const wrapper = mount(GnFileUploadField, { props: { error: "At least one file is required." } });
    const input = wrapper.find("input");
    const error = wrapper.find(".gn-file-upload-field__error");
    expect(error.text()).toBe("At least one file is required.");
    expect(input.attributes("aria-invalid")).toBe("true");
    expect(input.attributes("aria-describedby")).toBe(error.attributes("id"));
    expect(wrapper.find(".gn-file-upload-field__dropzone").classes()).toContain(
      "gn-file-upload-field__dropzone--invalid"
    );
  });

  it("does not set inline color overrides by default", () => {
    const wrapper = mount(GnFileUploadField);
    expect(wrapper.attributes("style")).toBeUndefined();
  });

  it("applies backgroundColor, textColor, and borderColor as independent overrides", () => {
    const wrapper = mount(GnFileUploadField, {
      props: {
        backgroundColor: "rgb(28, 25, 23)",
        textColor: "#f97316",
        borderColor: "transparent"
      }
    });
    const style = wrapper.attributes("style");
    expect(style).toContain("--gn-file-upload-background: rgb(28, 25, 23)");
    expect(style).toContain("--gn-file-upload-text-color: #f97316");
    expect(style).toContain("--gn-file-upload-border: transparent");
    expect(style).not.toContain("--gn-file-upload-accent");
  });

  it("applies the color override as the accent independently of the other colors", () => {
    const wrapper = mount(GnFileUploadField, { props: { color: "#059669" } });
    expect(wrapper.attributes("style")).toBe("--gn-file-upload-accent: #059669;");
  });

  describe("filePicker", () => {
    it("calls filePicker instead of opening the native input when clicked", async () => {
      const descriptor = { name: "photo.png", path: "/Users/demo/photo.png" };
      const filePicker = vi.fn().mockResolvedValue([descriptor]);
      const wrapper = mount(GnFileUploadField, { props: { filePicker } });

      await wrapper.find(".gn-file-upload-field__dropzone").trigger("click");
      await Promise.resolve();

      expect(filePicker).toHaveBeenCalledTimes(1);
      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([[descriptor]]);
    });

    it("does not call filePicker or add anything when disabled", async () => {
      const filePicker = vi.fn().mockResolvedValue([{ name: "photo.png" }]);
      const wrapper = mount(GnFileUploadField, { props: { filePicker, disabled: true } });

      await wrapper.find(".gn-file-upload-field__dropzone").trigger("click");

      expect(filePicker).not.toHaveBeenCalled();
      expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    });
  });

  describe("descriptor items (e.g. from a Tauri filePicker)", () => {
    it("identifies descriptors by path and de-duplicates re-added ones", async () => {
      const descriptor = { name: "photo.png", path: "/Users/demo/photo.png" };
      const filePicker = vi.fn().mockResolvedValue([descriptor]);
      const wrapper = mount(GnFileUploadField, {
        props: { filePicker, modelValue: [{ name: "photo.png", path: "/Users/demo/photo.png" }] }
      });

      await wrapper.find(".gn-file-upload-field__dropzone").trigger("click");
      await Promise.resolve();

      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([[descriptor]]);
    });

    it("renders previewUrl directly instead of creating an object URL", () => {
      const wrapper = mount(GnFileUploadField, {
        props: { modelValue: [{ name: "photo.png", previewUrl: "https://example.com/thumb.png" }] }
      });
      const img = wrapper.find("img.gn-file-upload-field__thumb");
      expect(img.attributes("src")).toBe("https://example.com/thumb.png");
    });

    it("omits the size when a descriptor doesn't provide one", () => {
      const wrapper = mount(GnFileUploadField, {
        props: { modelValue: [{ name: "photo.png", path: "/Users/demo/photo.png" }] }
      });
      expect(wrapper.find(".gn-file-upload-field__size").exists()).toBe(false);
    });

    it("removes a descriptor by path and emits gn-remove with it", async () => {
      const descriptor = { name: "photo.png", path: "/Users/demo/photo.png" };
      const wrapper = mount(GnFileUploadField, { props: { modelValue: [descriptor] } });

      await wrapper.find(".gn-file-upload-field__remove").trigger("click");

      expect(wrapper.emitted("gn-remove")?.[0]).toEqual([descriptor]);
      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([[]]);
    });
  });
});

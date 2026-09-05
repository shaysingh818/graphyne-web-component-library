import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { GnFormTextField } from "./index";

describe("GnFormTextField", () => {
  it("renders the label and associates it with the textarea", () => {
    const wrapper = mount(GnFormTextField, { props: { label: "Bio" } });
    const label = wrapper.find("label");
    const textarea = wrapper.find("textarea");
    expect(label.text()).toBe("Bio");
    expect(label.attributes("for")).toBe(textarea.attributes("id"));
  });

  it("renders no label when none is provided", () => {
    const wrapper = mount(GnFormTextField);
    expect(wrapper.find("label").exists()).toBe(false);
  });

  it("renders the modelValue as the textarea's value", () => {
    const wrapper = mount(GnFormTextField, {
      props: { modelValue: "hello" }
    });
    expect((wrapper.find("textarea").element as HTMLTextAreaElement).value).toBe("hello");
  });

  it("defaults to 4 rows", () => {
    const wrapper = mount(GnFormTextField);
    expect(wrapper.find("textarea").attributes("rows")).toBe("4");
  });

  it("applies the requested rows", () => {
    const wrapper = mount(GnFormTextField, { props: { rows: 8 } });
    expect(wrapper.find("textarea").attributes("rows")).toBe("8");
  });

  it("emits update:modelValue and gn-update on input", async () => {
    const wrapper = mount(GnFormTextField);
    const textarea = wrapper.find("textarea");
    await textarea.setValue("new value");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["new value"]);
    expect(wrapper.emitted("gn-update")?.[0]).toEqual(["new value"]);
  });

  it("does not emit when disabled", async () => {
    const wrapper = mount(GnFormTextField, { props: { disabled: true } });
    await wrapper.find("textarea").trigger("input");
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    expect(wrapper.emitted("gn-update")).toBeUndefined();
  });

  it("renders no error message by default", () => {
    const wrapper = mount(GnFormTextField);
    expect(wrapper.find(".gn-form-text-field__error").exists()).toBe(false);
    expect(wrapper.find("textarea").attributes("aria-invalid")).toBeUndefined();
  });

  it("renders the error message and marks the textarea invalid", () => {
    const wrapper = mount(GnFormTextField, {
      props: { error: "This field is required." }
    });
    const textarea = wrapper.find("textarea");
    const error = wrapper.find(".gn-form-text-field__error");
    expect(error.text()).toBe("This field is required.");
    expect(textarea.attributes("aria-invalid")).toBe("true");
    expect(textarea.attributes("aria-describedby")).toBe(error.attributes("id"));
  });

  it("does not set inline color overrides by default", () => {
    const wrapper = mount(GnFormTextField);
    expect(wrapper.attributes("style")).toBeUndefined();
  });

  it("applies backgroundColor, textColor, and borderColor as independent overrides", () => {
    const wrapper = mount(GnFormTextField, {
      props: {
        backgroundColor: "rgb(28, 25, 23)",
        textColor: "#f97316",
        borderColor: "transparent"
      }
    });
    const style = wrapper.attributes("style");
    expect(style).toContain("--gn-input-background: rgb(28, 25, 23)");
    expect(style).toContain("--gn-input-text-color: #f97316");
    expect(style).toContain("--gn-input-border: transparent");
    expect(style).not.toContain("--gn-input-accent");
  });

  it("applies the color override as the accent independently of the other colors", () => {
    const wrapper = mount(GnFormTextField, { props: { color: "#059669" } });
    expect(wrapper.attributes("style")).toBe("--gn-input-accent: #059669;");
  });
});

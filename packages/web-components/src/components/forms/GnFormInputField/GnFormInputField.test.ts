import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { GnFormInputField } from "./index";

describe("GnFormInputField", () => {
  it("renders the label and associates it with the input", () => {
    const wrapper = mount(GnFormInputField, { props: { label: "Email" } });
    const label = wrapper.find("label");
    const input = wrapper.find("input");
    expect(label.text()).toBe("Email");
    expect(label.attributes("for")).toBe(input.attributes("id"));
  });

  it("renders the modelValue as the input's value", () => {
    const wrapper = mount(GnFormInputField, {
      props: { modelValue: "hello" }
    });
    expect((wrapper.find("input").element as HTMLInputElement).value).toBe("hello");
  });

  it("defaults to type text", () => {
    const wrapper = mount(GnFormInputField);
    expect(wrapper.find("input").attributes("type")).toBe("text");
  });

  it("applies the requested type", () => {
    const wrapper = mount(GnFormInputField, { props: { type: "email" } });
    expect(wrapper.find("input").attributes("type")).toBe("email");
  });

  it("emits update:modelValue and gn-update on input", async () => {
    const wrapper = mount(GnFormInputField);
    const input = wrapper.find("input");
    await input.setValue("new value");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["new value"]);
    expect(wrapper.emitted("gn-update")?.[0]).toEqual(["new value"]);
  });

  it("does not emit when disabled", async () => {
    const wrapper = mount(GnFormInputField, { props: { disabled: true } });
    await wrapper.find("input").trigger("input");
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    expect(wrapper.emitted("gn-update")).toBeUndefined();
  });

  it("renders no error message by default", () => {
    const wrapper = mount(GnFormInputField);
    expect(wrapper.find(".gn-form-input-field__error").exists()).toBe(false);
    expect(wrapper.find("input").attributes("aria-invalid")).toBeUndefined();
  });

  it("renders the error message and marks the input invalid", () => {
    const wrapper = mount(GnFormInputField, {
      props: { error: "This field is required." }
    });
    const input = wrapper.find("input");
    const error = wrapper.find(".gn-form-input-field__error");
    expect(error.text()).toBe("This field is required.");
    expect(input.attributes("aria-invalid")).toBe("true");
    expect(input.attributes("aria-describedby")).toBe(error.attributes("id"));
  });

  it("does not set inline color overrides by default", () => {
    const wrapper = mount(GnFormInputField);
    expect(wrapper.attributes("style")).toBeUndefined();
  });

  it("applies backgroundColor, textColor, and borderColor as independent overrides", () => {
    const wrapper = mount(GnFormInputField, {
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
    const wrapper = mount(GnFormInputField, { props: { color: "#059669" } });
    expect(wrapper.attributes("style")).toBe("--gn-input-accent: #059669;");
  });
});

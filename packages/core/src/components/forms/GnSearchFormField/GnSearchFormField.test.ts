import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { GnSearchFormField } from "./index";

describe("GnSearchFormField", () => {
  it("renders the modelValue as the input's value", () => {
    const wrapper = mount(GnSearchFormField, {
      props: { modelValue: "hello" }
    });
    expect((wrapper.find("input").element as HTMLInputElement).value).toBe("hello");
  });

  it("emits update:modelValue and gn-update on input", async () => {
    const wrapper = mount(GnSearchFormField);
    const input = wrapper.find("input");
    await input.setValue("new value");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["new value"]);
    expect(wrapper.emitted("gn-update")?.[0]).toEqual(["new value"]);
  });

  it("does not emit when disabled", async () => {
    const wrapper = mount(GnSearchFormField, { props: { disabled: true } });
    await wrapper.find("input").trigger("input");
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    expect(wrapper.emitted("gn-update")).toBeUndefined();
  });

  it("renders a search button with an accessible label", () => {
    const wrapper = mount(GnSearchFormField);
    const button = wrapper.find("button");
    expect(button.exists()).toBe(true);
    expect(button.attributes("aria-label")).toBe("Search");
  });

  it("renders a search icon inside the button", () => {
    const wrapper = mount(GnSearchFormField);
    expect(wrapper.find("button svg").exists()).toBe(true);
  });

  it("emits gn-search with the current value when the button is clicked", async () => {
    const wrapper = mount(GnSearchFormField, { props: { modelValue: "cats" } });
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("gn-search")?.[0]).toEqual(["cats"]);
  });

  it("emits gn-search when Enter is pressed in the input", async () => {
    const wrapper = mount(GnSearchFormField, { props: { modelValue: "dogs" } });
    await wrapper.find("input").trigger("keyup.enter");
    expect(wrapper.emitted("gn-search")?.[0]).toEqual(["dogs"]);
  });

  it("disables the search button and does not emit gn-search when disabled", async () => {
    const wrapper = mount(GnSearchFormField, { props: { disabled: true } });
    const button = wrapper.find("button");
    expect(button.attributes("disabled")).toBeDefined();
    await button.trigger("click");
    expect(wrapper.emitted("gn-search")).toBeUndefined();
  });

  it("renders no error message by default", () => {
    const wrapper = mount(GnSearchFormField);
    expect(wrapper.find(".gn-form-input-field__error").exists()).toBe(false);
    expect(wrapper.find("input").attributes("aria-invalid")).toBeUndefined();
  });

  it("renders the error message and marks the input invalid", () => {
    const wrapper = mount(GnSearchFormField, {
      props: { error: "This field is required." }
    });
    const input = wrapper.find("input");
    const error = wrapper.find(".gn-form-input-field__error");
    expect(error.text()).toBe("This field is required.");
    expect(input.attributes("aria-invalid")).toBe("true");
    expect(input.attributes("aria-describedby")).toBe(error.attributes("id"));
  });

  it("applies backgroundColor, textColor, and borderColor as independent overrides", () => {
    const wrapper = mount(GnSearchFormField, {
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

  it("does not set a button background override by default", () => {
    const wrapper = mount(GnSearchFormField);
    expect(wrapper.attributes("style")).toBeUndefined();
  });

  it("applies buttonBackgroundColor as an override independent of backgroundColor", () => {
    const wrapper = mount(GnSearchFormField, {
      props: {
        backgroundColor: "white",
        buttonBackgroundColor: "#0A9CF2"
      }
    });
    const style = wrapper.attributes("style");
    expect(style).toContain("--gn-input-background: white");
    expect(style).toContain("--gn-search-button-background: #0A9CF2");
  });
});

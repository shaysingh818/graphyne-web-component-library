import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { GnButton } from "./index";

describe("GnButton", () => {
  it("renders slot content", () => {
    const wrapper = mount(GnButton, {
      slots: { default: "Save changes" }
    });
    expect(wrapper.text()).toBe("Save changes");
  });

  it("defaults to the primary variant", () => {
    const wrapper = mount(GnButton);
    expect(wrapper.classes()).toContain("gn-button--primary");
  });

  it("applies the requested variant", () => {
    const wrapper = mount(GnButton, { props: { variant: "ghost" } });
    expect(wrapper.classes()).toContain("gn-button--ghost");
  });

  it("emits gn-click on click", async () => {
    const wrapper = mount(GnButton);
    await wrapper.trigger("click");
    expect(wrapper.emitted("gn-click")).toHaveLength(1);
  });

  it("does not emit gn-click when disabled", async () => {
    const wrapper = mount(GnButton, { props: { disabled: true } });
    await wrapper.trigger("click");
    expect(wrapper.emitted("gn-click")).toBeUndefined();
  });
});

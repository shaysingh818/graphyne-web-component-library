import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { GnDropDownMenuItem } from "./index";

describe("GnDropDownMenuItem", () => {
  it("renders the label", () => {
    const wrapper = mount(GnDropDownMenuItem, { props: { label: "Edit Subject" } });
    expect(wrapper.text()).toContain("Edit Subject");
  });

  it("does not render an icon wrapper when no icon is slotted", () => {
    const wrapper = mount(GnDropDownMenuItem, { props: { label: "Edit Subject" } });
    expect(wrapper.find(".gn-dropdown-menu-item__icon").exists()).toBe(false);
  });

  it("renders slotted icon content", () => {
    const wrapper = mount(GnDropDownMenuItem, {
      props: { label: "Edit Subject" },
      slots: { default: "<svg data-testid='icon' />" }
    });
    expect(wrapper.find("[data-testid='icon']").exists()).toBe(true);
  });

  it("does not set inline color overrides by default", () => {
    const wrapper = mount(GnDropDownMenuItem, { props: { label: "Edit Subject" } });
    expect(wrapper.attributes("style")).toBeUndefined();
  });

  it("applies color, backgroundColor, and textColor as independent overrides", () => {
    const wrapper = mount(GnDropDownMenuItem, {
      props: { label: "Edit Subject", color: "#2563eb", backgroundColor: "#111827", textColor: "#ffffff" }
    });
    const style = wrapper.attributes("style");
    expect(style).toContain("--gn-dropdown-menu-item-accent: #2563eb");
    expect(style).toContain("--gn-dropdown-menu-item-hover-background: #111827");
    expect(style).toContain("--gn-dropdown-menu-item-text-color: #ffffff");
  });

  it("emits gn-click on click", async () => {
    const wrapper = mount(GnDropDownMenuItem, { props: { label: "Edit Subject" } });
    await wrapper.trigger("click");
    expect(wrapper.emitted("gn-click")).toHaveLength(1);
  });

  it("does not emit gn-click when disabled", async () => {
    const wrapper = mount(GnDropDownMenuItem, { props: { label: "Edit Subject", disabled: true } });
    await wrapper.trigger("click");
    expect(wrapper.emitted("gn-click")).toBeUndefined();
  });
});

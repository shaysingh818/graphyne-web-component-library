import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import GnTabNavigationItem from "./GnTabNavigationItem.vue";

describe("GnTabNavigationItem", () => {
  it("does not set inline style overrides by default", () => {
    const wrapper = mount(GnTabNavigationItem, { props: { label: "Home" } });
    expect(wrapper.attributes("style")).toBeUndefined();
  });

  it("renders the label and only renders the icon wrapper when the slot is used", () => {
    const noIcon = mount(GnTabNavigationItem, { props: { label: "Home" } });
    expect(noIcon.text()).toBe("Home");
    expect(noIcon.find(".gn-tab-nav-item__icon").exists()).toBe(false);

    const withIcon = mount(GnTabNavigationItem, {
      props: { label: "Home" },
      slots: { default: "<svg></svg>" }
    });
    expect(withIcon.find(".gn-tab-nav-item__icon").exists()).toBe(true);
  });

  it("is not selected and has no aria-selected indicator by default", () => {
    const wrapper = mount(GnTabNavigationItem, { props: { label: "Home" } });
    expect(wrapper.classes()).not.toContain("gn-tab-nav-item--selected");
    expect(wrapper.attributes("aria-selected")).toBe("false");
    expect(wrapper.attributes("role")).toBe("tab");
  });

  it("applies the selected class and aria-selected when selected", () => {
    const wrapper = mount(GnTabNavigationItem, { props: { label: "Home", selected: true } });
    expect(wrapper.classes()).toContain("gn-tab-nav-item--selected");
    expect(wrapper.attributes("aria-selected")).toBe("true");
  });

  it("applies color, backgroundColor, and textColor as independent overrides", () => {
    const wrapper = mount(GnTabNavigationItem, {
      props: {
        label: "Home",
        color: "#f97316",
        backgroundColor: "#1c1917",
        textColor: "#ffffff"
      }
    });
    const style = wrapper.attributes("style");
    expect(style).toContain("--gn-tab-nav-item-accent: #f97316");
    expect(style).toContain("--gn-tab-nav-item-background: #1c1917");
    expect(style).toContain("--gn-tab-nav-item-text-color: #ffffff");
  });

  it("emits gn-click on click", async () => {
    const wrapper = mount(GnTabNavigationItem, { props: { label: "Home" } });
    await wrapper.trigger("click");
    expect(wrapper.emitted("gn-click")).toHaveLength(1);
  });
});

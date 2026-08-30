import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { GnNavigationItem } from "./index";

describe("GnNavigationItem", () => {
  it("renders slot content as the icon", () => {
    const wrapper = mount(GnNavigationItem, {
      props: { label: "Home" },
      slots: { default: "<svg data-testid='icon' />" }
    });
    expect(wrapper.find("[data-testid='icon']").exists()).toBe(true);
  });

  it("renders the label", () => {
    const wrapper = mount(GnNavigationItem, { props: { label: "Home" } });
    expect(wrapper.find(".gn-navigation-item__label").text()).toBe("Home");
  });

  it("renders no label when none is provided", () => {
    const wrapper = mount(GnNavigationItem);
    expect(wrapper.find(".gn-navigation-item__label").exists()).toBe(false);
  });

  it("renders no icon wrapper when no icon slot content is provided", () => {
    const wrapper = mount(GnNavigationItem, { props: { label: "Home" } });
    expect(wrapper.find(".gn-navigation-item__icon").exists()).toBe(false);
  });

  it("renders the icon wrapper when icon slot content is provided", () => {
    const wrapper = mount(GnNavigationItem, {
      props: { label: "Home" },
      slots: { default: "<svg data-testid='icon' />" }
    });
    expect(wrapper.find(".gn-navigation-item__icon").exists()).toBe(true);
  });

  it("defaults to the col direction", () => {
    const wrapper = mount(GnNavigationItem, { props: { label: "Home" } });
    expect(wrapper.classes()).toContain("gn-navigation-item--col");
    expect(wrapper.classes()).not.toContain("gn-navigation-item--row");
  });

  it("applies the row direction", () => {
    const wrapper = mount(GnNavigationItem, {
      props: { label: "Home", direction: "row" }
    });
    expect(wrapper.classes()).toContain("gn-navigation-item--row");
    expect(wrapper.classes()).not.toContain("gn-navigation-item--col");
  });

  it("does not set inline color overrides by default", () => {
    const wrapper = mount(GnNavigationItem, { props: { label: "Home" } });
    expect(wrapper.attributes("style")).toBeUndefined();
  });

  it("applies backgroundColor, textColor, and borderColor as independent overrides", () => {
    const wrapper = mount(GnNavigationItem, {
      props: {
        label: "Home",
        backgroundColor: "rgb(28, 25, 23)",
        textColor: "#f97316",
        borderColor: "transparent"
      }
    });
    const style = wrapper.attributes("style");
    expect(style).toContain("--gn-nav-item-background: rgb(28, 25, 23)");
    expect(style).toContain("--gn-nav-item-text-color: #f97316");
    expect(style).toContain("--gn-nav-item-border: transparent");
    expect(style).not.toContain("--gn-nav-item-accent");
  });

  it("applies the color override as the accent independently of the other colors", () => {
    const wrapper = mount(GnNavigationItem, {
      props: { label: "Home", color: "#0A9CF2" }
    });
    expect(wrapper.attributes("style")).toBe("--gn-nav-item-accent: #0A9CF2;");
  });
});

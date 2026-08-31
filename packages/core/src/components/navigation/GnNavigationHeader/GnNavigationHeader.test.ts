import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import GnNavigationHeader from "./GnNavigationHeader.vue";

describe("GnNavigationHeader", () => {
  it("does not set inline style overrides by default", () => {
    const wrapper = mount(GnNavigationHeader);
    expect(wrapper.attributes("style")).toBeUndefined();
  });

  it("renders the title by default and omits it when title is empty", () => {
    const wrapper = mount(GnNavigationHeader);
    expect(wrapper.find(".gn-navigation-header__title").text()).toBe("Graphyne");

    const noTitle = mount(GnNavigationHeader, { props: { title: "" } });
    expect(noTitle.find(".gn-navigation-header__title").exists()).toBe(false);
  });

  it("only renders the icon wrapper when the default slot is used", () => {
    const withoutIcon = mount(GnNavigationHeader);
    expect(withoutIcon.find(".gn-navigation-header__icon").exists()).toBe(false);

    const withIcon = mount(GnNavigationHeader, {
      slots: { default: "<svg></svg>" }
    });
    expect(withIcon.find(".gn-navigation-header__icon").exists()).toBe(true);
  });

  it("applies color, backgroundColor, textColor, and borderColor as independent overrides", () => {
    const wrapper = mount(GnNavigationHeader, {
      props: {
        color: "rgb(28, 25, 23)",
        backgroundColor: "#000000",
        textColor: "#f97316",
        borderColor: "transparent"
      }
    });
    const style = wrapper.attributes("style");
    expect(style).toContain("--gn-nav-header-accent: rgb(28, 25, 23)");
    expect(style).toContain("--gn-nav-header-background: #000000");
    expect(style).toContain("--gn-nav-header-text-color: #f97316");
    expect(style).toContain("--gn-nav-header-border: transparent");
  });

  it("applies iconSize, titleSize, and titleMaxWidth as independent overrides", () => {
    const wrapper = mount(GnNavigationHeader, {
      props: { iconSize: "3rem", titleSize: "0.75rem", titleMaxWidth: "5rem" }
    });
    const style = wrapper.attributes("style");
    expect(style).toContain("--gn-nav-header-icon-size: 3rem");
    expect(style).toContain("--gn-nav-header-title-size: 0.75rem");
    expect(style).toContain("--gn-nav-header-title-max-width: 5rem");
  });

  it("does not set --gn-nav-header-icon-size, --gn-nav-header-title-size, or --gn-nav-header-title-max-width when unset", () => {
    const wrapper = mount(GnNavigationHeader, { props: { color: "red" } });
    const style = wrapper.attributes("style");
    expect(style).not.toContain("--gn-nav-header-icon-size");
    expect(style).not.toContain("--gn-nav-header-title-size");
    expect(style).not.toContain("--gn-nav-header-title-max-width");
  });

  it("switches between row and column layout classes based on direction", () => {
    const row = mount(GnNavigationHeader, { props: { direction: "row" } });
    expect(row.classes()).toContain("gn-navigation-header--row");

    const col = mount(GnNavigationHeader, { props: { direction: "col" } });
    expect(col.classes()).toContain("gn-navigation-header--col");
  });
});

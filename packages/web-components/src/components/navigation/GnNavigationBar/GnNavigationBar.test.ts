import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import GnNavigationBar from "./GnNavigationBar.vue";

describe("GnNavigationBar", () => {
  it("does not set inline style overrides by default", () => {
    const wrapper = mount(GnNavigationBar);
    expect(wrapper.attributes("style")).toBeUndefined();
  });

  it("only renders each section when its slot is used", () => {
    const empty = mount(GnNavigationBar);
    expect(empty.find(".gn-navigation-bar__header").exists()).toBe(false);
    expect(empty.find(".gn-navigation-bar__items").exists()).toBe(false);
    expect(empty.find(".gn-navigation-bar__trailing").exists()).toBe(false);

    const full = mount(GnNavigationBar, {
      slots: {
        header: "<h1>Graphyne</h1>",
        items: "<a>Home</a><a>Search</a>",
        trailing: "<a>Account</a>"
      }
    });
    expect(full.find(".gn-navigation-bar__header").exists()).toBe(true);
    expect(full.find(".gn-navigation-bar__items").exists()).toBe(true);
    expect(full.find(".gn-navigation-bar__trailing").exists()).toBe(true);
    expect(full.find(".gn-navigation-bar__header").text()).toBe("Graphyne");
    expect(full.findAll(".gn-navigation-bar__items a")).toHaveLength(2);
  });

  it("applies backgroundColor and borderColor as independent overrides", () => {
    const wrapper = mount(GnNavigationBar, {
      props: { backgroundColor: "#000000", borderColor: "transparent" }
    });
    const style = wrapper.attributes("style");
    expect(style).toContain("--gn-nav-bar-background: #000000");
    expect(style).toContain("--gn-nav-bar-border: transparent");
  });

  it("switches between row and column layout classes based on direction", () => {
    const col = mount(GnNavigationBar, { props: { direction: "col" } });
    expect(col.classes()).toContain("gn-navigation-bar--col");

    const row = mount(GnNavigationBar, { props: { direction: "row" } });
    expect(row.classes()).toContain("gn-navigation-bar--row");
  });
});

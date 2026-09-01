import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import GnTabNavigationBar from "./GnTabNavigationBar.vue";

describe("GnTabNavigationBar", () => {
  it("does not set inline style overrides by default", () => {
    const wrapper = mount(GnTabNavigationBar);
    expect(wrapper.attributes("style")).toBeUndefined();
  });

  it("renders slotted tab items", () => {
    const wrapper = mount(GnTabNavigationBar, {
      slots: { default: "<a>Home</a><a>Search</a>" }
    });
    expect(wrapper.findAll("a")).toHaveLength(2);
  });

  it("applies color, backgroundColor, borderColor, textColor, and iconSize as independent overrides", () => {
    const wrapper = mount(GnTabNavigationBar, {
      props: {
        color: "#f97316",
        backgroundColor: "#1c1917",
        borderColor: "transparent",
        textColor: "#ffffff",
        iconSize: "1.5rem"
      }
    });
    const style = wrapper.attributes("style");
    expect(style).toContain("--gn-tab-nav-bar-accent: #f97316");
    expect(style).toContain("--gn-tab-nav-bar-background: #1c1917");
    expect(style).toContain("--gn-tab-nav-bar-border: transparent");
    expect(style).toContain("--gn-tab-nav-bar-text-color: #ffffff");
    expect(style).toContain("--gn-tab-nav-bar-icon-size: 1.5rem");
  });

  it("passes modelValue through the default slot as `active`", () => {
    const wrapper = mount(GnTabNavigationBar, {
      props: { modelValue: "home" },
      slots: { default: `<template #default="{ active }"><a>{{ active }}</a></template>` }
    });
    expect(wrapper.find("a").text()).toBe("home");
  });

  it("emits update:modelValue and gn-update when the slot's `select` is called", async () => {
    const wrapper = mount(GnTabNavigationBar, {
      props: { modelValue: "home" },
      slots: {
        default: `<template #default="{ select }"><button @click="select('search')">Search</button></template>`
      }
    });
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("update:modelValue")).toEqual([["search"]]);
    expect(wrapper.emitted("gn-update")).toEqual([["search"]]);
  });
});

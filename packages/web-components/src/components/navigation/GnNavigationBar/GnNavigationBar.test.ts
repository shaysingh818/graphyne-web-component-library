import { afterEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
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

  describe("mobile collapse (row layout)", () => {
    const slots = {
      header: "<h1>Graphyne</h1>",
      items: "<a>Home</a><a>Search</a>",
      trailing: "<a>Account</a>"
    };

    // The bar measures itself in onMounted, so the collapsed layout lands
    // one tick after mount.
    async function mountAtWidth(width: number, props: Record<string, unknown> = {}) {
      vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ width } as DOMRect);
      const wrapper = mount(GnNavigationBar, { props: { direction: "row", ...props }, slots, attachTo: document.body });
      await nextTick();
      return wrapper;
    }

    afterEach(() => {
      vi.restoreAllMocks();
      document.body.innerHTML = "";
    });

    it("stays expanded with no menu toggle when wider than collapseAt", async () => {
      const wrapper = await mountAtWidth(1024);
      expect(wrapper.classes()).not.toContain("gn-navigation-bar--collapsed");
      expect(wrapper.find(".gn-navigation-bar__toggle").exists()).toBe(false);
    });

    it("collapses behind a menu toggle when narrower than collapseAt", async () => {
      const wrapper = await mountAtWidth(375);
      expect(wrapper.classes()).toContain("gn-navigation-bar--collapsed");
      const toggle = wrapper.find(".gn-navigation-bar__toggle");
      expect(toggle.exists()).toBe(true);
      expect(toggle.attributes("aria-label")).toBe("Toggle navigation menu");
      expect(toggle.attributes("aria-expanded")).toBe("false");
      const controls = toggle.attributes("aria-controls")!.split(" ");
      expect(controls).toEqual([
        wrapper.find(".gn-navigation-bar__items").attributes("id"),
        wrapper.find(".gn-navigation-bar__trailing").attributes("id")
      ]);
    });

    it("respects a custom collapseAt, and never collapses at 0", async () => {
      expect((await mountAtWidth(700, { collapseAt: 800 })).classes()).toContain("gn-navigation-bar--collapsed");
      expect((await mountAtWidth(375, { collapseAt: 0 })).classes()).not.toContain("gn-navigation-bar--collapsed");
    });

    it("never collapses in col layout", async () => {
      const wrapper = await mountAtWidth(100, { direction: "col" });
      expect(wrapper.classes()).not.toContain("gn-navigation-bar--collapsed");
      expect(wrapper.find(".gn-navigation-bar__toggle").exists()).toBe(false);
    });

    it("opens and closes the menu via the toggle, emitting gn-menu-toggle", async () => {
      const wrapper = await mountAtWidth(375);
      const toggle = wrapper.find(".gn-navigation-bar__toggle");

      await toggle.trigger("click");
      expect(wrapper.classes()).toContain("gn-navigation-bar--open");
      expect(toggle.attributes("aria-expanded")).toBe("true");

      await toggle.trigger("click");
      expect(wrapper.classes()).not.toContain("gn-navigation-bar--open");
      expect(wrapper.emitted("gn-menu-toggle")).toEqual([[true], [false]]);
    });

    it("closes the menu on Escape and when a nav item is clicked", async () => {
      const wrapper = await mountAtWidth(375);
      const toggle = wrapper.find(".gn-navigation-bar__toggle");

      await toggle.trigger("click");
      await wrapper.trigger("keydown", { key: "Escape" });
      expect(wrapper.classes()).not.toContain("gn-navigation-bar--open");

      await toggle.trigger("click");
      await wrapper.find(".gn-navigation-bar__items a").trigger("click");
      expect(wrapper.classes()).not.toContain("gn-navigation-bar--open");
    });

    it("keeps the menu open when trailing content is clicked", async () => {
      const wrapper = await mountAtWidth(375);
      await wrapper.find(".gn-navigation-bar__toggle").trigger("click");
      await wrapper.find(".gn-navigation-bar__trailing a").trigger("click");
      expect(wrapper.classes()).toContain("gn-navigation-bar--open");
    });

    it("uses a custom menuLabel and menu-icon slot", async () => {
      vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ width: 375 } as DOMRect);
      const wrapper = mount(GnNavigationBar, {
        props: { direction: "row", menuLabel: "Open menu" },
        slots: { ...slots, "menu-icon": "<i class='custom-icon'></i>" }
      });
      await nextTick();
      const toggle = wrapper.find(".gn-navigation-bar__toggle");
      expect(toggle.attributes("aria-label")).toBe("Open menu");
      expect(toggle.find(".custom-icon").exists()).toBe(true);
      expect(toggle.find("svg").exists()).toBe(false);
    });
  });
});

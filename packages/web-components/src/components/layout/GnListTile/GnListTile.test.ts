import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import GnListTile from "./GnListTile.vue";

describe("GnListTile", () => {
  it("does not set inline style overrides by default", () => {
    const wrapper = mount(GnListTile, { props: { title: "Chapter 3" } });
    expect(wrapper.attributes("style")).toBeUndefined();
  });

  it("renders the title", () => {
    const wrapper = mount(GnListTile, { props: { title: "Chapter 3" } });
    expect(wrapper.find(".gn-list-tile__title").text()).toBe("Chapter 3");
  });

  it("renders the description when set and omits it when unset", () => {
    const withDescription = mount(GnListTile, {
      props: { title: "Chapter 3", description: "42 cards" }
    });
    expect(withDescription.find(".gn-list-tile__description").text()).toBe("42 cards");

    const withoutDescription = mount(GnListTile, { props: { title: "Chapter 3" } });
    expect(withoutDescription.find(".gn-list-tile__description").exists()).toBe(false);
  });

  it("only renders the leading wrapper when the leading slot is used", () => {
    const withoutLeading = mount(GnListTile, { props: { title: "Chapter 3" } });
    expect(withoutLeading.find(".gn-list-tile__leading").exists()).toBe(false);

    const withLeading = mount(GnListTile, {
      props: { title: "Chapter 3" },
      slots: { leading: "<svg></svg>" }
    });
    expect(withLeading.find(".gn-list-tile__leading").exists()).toBe(true);
  });

  it("only renders the tags wrapper when the tags slot is used", () => {
    const withoutTags = mount(GnListTile, { props: { title: "Chapter 3" } });
    expect(withoutTags.find(".gn-list-tile__tags").exists()).toBe(false);

    const withTags = mount(GnListTile, {
      props: { title: "Chapter 3" },
      slots: { tags: "<span>Biology</span>" }
    });
    expect(withTags.find(".gn-list-tile__tags").exists()).toBe(true);
  });

  it("only renders the trailing wrapper when the trailing slot is used", () => {
    const withoutTrailing = mount(GnListTile, { props: { title: "Chapter 3" } });
    expect(withoutTrailing.find(".gn-list-tile__trailing").exists()).toBe(false);

    const withTrailing = mount(GnListTile, {
      props: { title: "Chapter 3" },
      slots: { trailing: "<button>More</button>" }
    });
    expect(withTrailing.find(".gn-list-tile__trailing").exists()).toBe(true);
  });

  it("emits gn-click when the main region is clicked", async () => {
    const wrapper = mount(GnListTile, { props: { title: "Chapter 3" } });
    await wrapper.find(".gn-list-tile__main").trigger("click");
    expect(wrapper.emitted("gn-click")).toHaveLength(1);
  });

  it("does not emit gn-click when disabled", async () => {
    const wrapper = mount(GnListTile, { props: { title: "Chapter 3", disabled: true } });
    expect(wrapper.find(".gn-list-tile__main").attributes("disabled")).toBeDefined();
    await wrapper.find(".gn-list-tile__main").trigger("click");
    expect(wrapper.emitted("gn-click")).toBeUndefined();
  });

  it("does not emit gn-click when clicking something in the trailing slot", async () => {
    const wrapper = mount(GnListTile, {
      props: { title: "Chapter 3" },
      slots: { trailing: '<button class="trailing-btn">More</button>' }
    });
    await wrapper.find(".trailing-btn").trigger("click");
    expect(wrapper.emitted("gn-click")).toBeUndefined();
  });

  it("applies color, backgroundColor, textColor, descriptionColor, trailingColor, and borderColor as independent overrides", () => {
    const wrapper = mount(GnListTile, {
      props: {
        title: "Chapter 3",
        color: "#0ea5e9",
        backgroundColor: "#1c1917",
        textColor: "#f9fafb",
        descriptionColor: "#9ca3af",
        trailingColor: "#f97316",
        borderColor: "#292524"
      }
    });
    const style = wrapper.attributes("style");
    expect(style).toContain("--gn-list-tile-accent: #0ea5e9");
    expect(style).toContain("--gn-list-tile-background: #1c1917");
    expect(style).toContain("--gn-list-tile-text-color: #f9fafb");
    expect(style).toContain("--gn-list-tile-description-color: #9ca3af");
    expect(style).toContain("--gn-list-tile-trailing-color: #f97316");
    expect(style).toContain("--gn-list-tile-border: #292524");
  });

  it("finds a bare icon in trailing even when wrapped in an extra element (the <span v-html=\"icon\" /> pattern used throughout this library's stories)", () => {
    const wrapper = mount(GnListTile, {
      props: { title: "Chapter 3" },
      slots: { trailing: "<span><svg data-testid='bare-icon'></svg></span>" }
    });
    expect(wrapper.find(".gn-list-tile__trailing [data-testid='bare-icon']").exists()).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { GnIconButton } from "./index";

describe("GnIconButton", () => {
  it("renders slot content", () => {
    const wrapper = mount(GnIconButton, {
      props: { label: "Delete" },
      slots: { default: "<svg data-testid='icon' />" }
    });
    expect(wrapper.find("[data-testid='icon']").exists()).toBe(true);
  });

  it("applies the label as an aria-label", () => {
    const wrapper = mount(GnIconButton, { props: { label: "Delete" } });
    expect(wrapper.attributes("aria-label")).toBe("Delete");
  });

  it("defaults to the primary variant", () => {
    const wrapper = mount(GnIconButton, { props: { label: "Delete" } });
    expect(wrapper.classes()).toContain("gn-icon-button--primary");
  });

  it("applies the requested variant", () => {
    const wrapper = mount(GnIconButton, {
      props: { label: "Delete", variant: "ghost" }
    });
    expect(wrapper.classes()).toContain("gn-icon-button--ghost");
  });

  it("defaults to the md size", () => {
    const wrapper = mount(GnIconButton, { props: { label: "Delete" } });
    expect(wrapper.classes()).toContain("gn-icon-button--md");
  });

  it("applies the requested size", () => {
    const wrapper = mount(GnIconButton, {
      props: { label: "Delete", size: "lg" }
    });
    expect(wrapper.classes()).toContain("gn-icon-button--lg");
  });

  it("emits gn-click on click", async () => {
    const wrapper = mount(GnIconButton, { props: { label: "Delete" } });
    await wrapper.trigger("click");
    expect(wrapper.emitted("gn-click")).toHaveLength(1);
  });

  it("does not emit gn-click when disabled", async () => {
    const wrapper = mount(GnIconButton, {
      props: { label: "Delete", disabled: true }
    });
    await wrapper.trigger("click");
    expect(wrapper.emitted("gn-click")).toBeUndefined();
  });
});

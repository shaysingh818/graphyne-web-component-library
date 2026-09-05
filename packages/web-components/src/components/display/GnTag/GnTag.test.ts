import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { GnTag } from "./index";

describe("GnTag", () => {
  it("does not set inline style overrides by default", () => {
    const wrapper = mount(GnTag);
    expect(wrapper.attributes("style")).toBeUndefined();
  });

  it("renders the label, defaulting to 'tag'", () => {
    const defaultLabel = mount(GnTag);
    expect(defaultLabel.find("p").text()).toBe("tag");

    const customLabel = mount(GnTag, { props: { label: "Biology" } });
    expect(customLabel.find("p").text()).toBe("Biology");
  });

  it("defaults to the primary variant", () => {
    const wrapper = mount(GnTag);
    expect(wrapper.classes()).toContain("gn-tag--primary");
  });

  it("applies the requested variant", () => {
    const wrapper = mount(GnTag, { props: { variant: "secondary" } });
    expect(wrapper.classes()).toContain("gn-tag--secondary");
  });

  it("applies color as an override, unlike the earlier version where it was silently dead", () => {
    const wrapper = mount(GnTag, { props: { color: "#0ea5e9" } });
    expect(wrapper.attributes("style")).toContain("--gn-tag-accent: #0ea5e9");
  });

  it("does not force a fixed width/height (that prop pair no longer exists)", () => {
    const wrapper = mount(GnTag, { props: { label: "Ordered Sequence" } });
    const style = wrapper.attributes("style");
    expect(style === undefined || !style.includes("width")).toBe(true);
  });
});

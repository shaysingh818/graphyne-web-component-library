import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { GnCard } from "./index";

describe("GnCard", () => {
  it("renders the title when provided", () => {
    const wrapper = mount(GnCard, { props: { title: "Account" } });
    expect(wrapper.find(".gn-card__header").text()).toBe("Account");
  });

  it("omits the header when no title is provided", () => {
    const wrapper = mount(GnCard);
    expect(wrapper.find(".gn-card__header").exists()).toBe(false);
  });

  it("renders default slot content in the body", () => {
    const wrapper = mount(GnCard, { slots: { default: "<p>Body copy</p>" } });
    expect(wrapper.find(".gn-card__body").html()).toContain("Body copy");
  });

  it("only renders the footer when the footer slot is used", () => {
    const withoutFooter = mount(GnCard);
    expect(withoutFooter.find(".gn-card__footer").exists()).toBe(false);

    const withFooter = mount(GnCard, { slots: { footer: "Actions" } });
    expect(withFooter.find(".gn-card__footer").text()).toBe("Actions");
  });
});

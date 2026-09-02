import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import GnBackBar from "./GnBackBar.vue";

describe("GnBackBar", () => {
  it("does not set inline style overrides by default", () => {
    const wrapper = mount(GnBackBar, { props: { title: "Settings" } });
    expect(wrapper.attributes("style")).toBeUndefined();
  });

  it("renders the title", () => {
    const wrapper = mount(GnBackBar, { props: { title: "Settings" } });
    expect(wrapper.find(".gn-back-bar__title").text()).toBe("Settings");
  });

  it("renders the subtitle when set and omits it when unset", () => {
    const withSubtitle = mount(GnBackBar, {
      props: { title: "Settings", subtitle: "Last updated 04/02/2026" }
    });
    expect(withSubtitle.find(".gn-back-bar__subtitle").text()).toBe("Last updated 04/02/2026");

    const withoutSubtitle = mount(GnBackBar, { props: { title: "Settings" } });
    expect(withoutSubtitle.find(".gn-back-bar__subtitle").exists()).toBe(false);
  });

  it("only renders the back button when the default slot is used", () => {
    const withoutIcon = mount(GnBackBar, { props: { title: "Settings" } });
    expect(withoutIcon.find(".gn-back-bar__back").exists()).toBe(false);

    const withIcon = mount(GnBackBar, {
      props: { title: "Settings" },
      slots: { default: "<svg></svg>" }
    });
    expect(withIcon.find(".gn-back-bar__back").exists()).toBe(true);
  });

  it("applies backLabel as the back button's aria-label, defaulting to 'Go back'", () => {
    const defaultLabel = mount(GnBackBar, {
      props: { title: "Settings" },
      slots: { default: "<svg></svg>" }
    });
    expect(defaultLabel.find(".gn-back-bar__back").attributes("aria-label")).toBe("Go back");

    const customLabel = mount(GnBackBar, {
      props: { title: "Settings", backLabel: "Close" },
      slots: { default: "<svg></svg>" }
    });
    expect(customLabel.find(".gn-back-bar__back").attributes("aria-label")).toBe("Close");
  });

  it("emits gn-back with the click event when the back button is clicked", async () => {
    const wrapper = mount(GnBackBar, {
      props: { title: "Settings" },
      slots: { default: "<svg></svg>" }
    });
    await wrapper.find(".gn-back-bar__back").trigger("click");
    expect(wrapper.emitted("gn-back")).toHaveLength(1);
    expect(wrapper.emitted("gn-back")![0][0]).toBeInstanceOf(MouseEvent);
  });

  it("only renders the actions wrapper when the actions slot is used", () => {
    const withoutActions = mount(GnBackBar, { props: { title: "Settings" } });
    expect(withoutActions.find(".gn-back-bar__actions").exists()).toBe(false);

    const withActions = mount(GnBackBar, {
      props: { title: "Settings" },
      slots: { actions: "<button>Edit</button>" }
    });
    expect(withActions.find(".gn-back-bar__actions").exists()).toBe(true);
  });

  it("applies color, backgroundColor, textColor, subtitleColor, and borderColor as independent overrides", () => {
    const wrapper = mount(GnBackBar, {
      props: {
        title: "Settings",
        color: "#38bdf8",
        backgroundColor: "#0f172a",
        textColor: "#f8fafc",
        subtitleColor: "#94a3b8",
        borderColor: "transparent"
      }
    });
    const style = wrapper.attributes("style");
    expect(style).toContain("--gn-back-bar-accent: #38bdf8");
    expect(style).toContain("--gn-back-bar-background: #0f172a");
    expect(style).toContain("--gn-back-bar-text-color: #f8fafc");
    expect(style).toContain("--gn-back-bar-subtitle-color: #94a3b8");
    expect(style).toContain("--gn-back-bar-border: transparent");
  });
});

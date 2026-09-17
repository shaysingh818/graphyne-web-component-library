import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { GnDropDownMenu } from "./index";

describe("GnDropDownMenu", () => {
  it("does not render the items panel until the trigger is clicked", () => {
    const wrapper = mount(GnDropDownMenu, {
      slots: {
        trigger: "<button>Options</button>",
        items: "<div data-testid='item'>Edit</div>"
      }
    });
    expect(wrapper.find(".gn-dropdown-menu__panel").exists()).toBe(false);
  });

  it("opens the panel on trigger click and emits gn-open", async () => {
    const wrapper = mount(GnDropDownMenu, {
      slots: {
        trigger: "<button>Options</button>",
        items: "<div data-testid='item'>Edit</div>"
      }
    });
    await wrapper.find(".gn-dropdown-menu__trigger").trigger("click");
    expect(wrapper.find(".gn-dropdown-menu__panel").exists()).toBe(true);
    expect(wrapper.emitted("gn-open")).toHaveLength(1);
  });

  it("closes the panel on a second trigger click and emits gn-close", async () => {
    const wrapper = mount(GnDropDownMenu, {
      slots: {
        trigger: "<button>Options</button>",
        items: "<div data-testid='item'>Edit</div>"
      }
    });
    const trigger = wrapper.find(".gn-dropdown-menu__trigger");
    await trigger.trigger("click");
    await trigger.trigger("click");
    expect(wrapper.find(".gn-dropdown-menu__panel").exists()).toBe(false);
    expect(wrapper.emitted("gn-close")).toHaveLength(1);
  });

  it("does not open when disabled", async () => {
    const wrapper = mount(GnDropDownMenu, {
      props: { disabled: true },
      slots: {
        trigger: "<button>Options</button>",
        items: "<div data-testid='item'>Edit</div>"
      }
    });
    await wrapper.find(".gn-dropdown-menu__trigger").trigger("click");
    expect(wrapper.find(".gn-dropdown-menu__panel").exists()).toBe(false);
  });

  it("closes when a click bubbles up from inside the items slot (closeOnSelect default true)", async () => {
    const wrapper = mount(GnDropDownMenu, {
      slots: {
        trigger: "<button>Options</button>",
        items: "<button data-testid='item'>Edit</button>"
      }
    });
    await wrapper.find(".gn-dropdown-menu__trigger").trigger("click");
    await wrapper.find("[data-testid='item']").trigger("click");
    expect(wrapper.find(".gn-dropdown-menu__panel").exists()).toBe(false);
    expect(wrapper.emitted("gn-close")).toHaveLength(1);
  });

  it("stays open on item click when closeOnSelect is false", async () => {
    const wrapper = mount(GnDropDownMenu, {
      props: { closeOnSelect: false },
      slots: {
        trigger: "<button>Options</button>",
        items: "<button data-testid='item'>Edit</button>"
      }
    });
    await wrapper.find(".gn-dropdown-menu__trigger").trigger("click");
    await wrapper.find("[data-testid='item']").trigger("click");
    expect(wrapper.find(".gn-dropdown-menu__panel").exists()).toBe(true);
  });

  it("closes on outside click when closeOnOutsideClick is true (default)", async () => {
    const wrapper = mount(GnDropDownMenu, {
      attachTo: document.body,
      slots: {
        trigger: "<button>Options</button>",
        items: "<div data-testid='item'>Edit</div>"
      }
    });
    await wrapper.find(".gn-dropdown-menu__trigger").trigger("click");
    expect(wrapper.find(".gn-dropdown-menu__panel").exists()).toBe(true);

    document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".gn-dropdown-menu__panel").exists()).toBe(false);
    wrapper.unmount();
  });

  it("closes on Escape when closeOnEscape is true (default)", async () => {
    const wrapper = mount(GnDropDownMenu, {
      attachTo: document.body,
      slots: {
        trigger: "<button>Options</button>",
        items: "<div data-testid='item'>Edit</div>"
      }
    });
    await wrapper.find(".gn-dropdown-menu__trigger").trigger("click");
    expect(wrapper.find(".gn-dropdown-menu__panel").exists()).toBe(true);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".gn-dropdown-menu__panel").exists()).toBe(false);
    wrapper.unmount();
  });

  it("defaults to left alignment", async () => {
    const wrapper = mount(GnDropDownMenu, {
      slots: {
        trigger: "<button>Options</button>",
        items: "<div data-testid='item'>Edit</div>"
      }
    });
    await wrapper.find(".gn-dropdown-menu__trigger").trigger("click");
    expect(wrapper.find(".gn-dropdown-menu__panel").classes()).toContain("gn-dropdown-menu__panel--left");
  });

  it("applies right alignment", async () => {
    const wrapper = mount(GnDropDownMenu, {
      props: { align: "right" },
      slots: {
        trigger: "<button>Options</button>",
        items: "<div data-testid='item'>Edit</div>"
      }
    });
    await wrapper.find(".gn-dropdown-menu__trigger").trigger("click");
    expect(wrapper.find(".gn-dropdown-menu__panel").classes()).toContain("gn-dropdown-menu__panel--right");
  });

  it("applies backgroundColor and borderColor as independent overrides", async () => {
    const wrapper = mount(GnDropDownMenu, {
      props: { backgroundColor: "#1c1917", borderColor: "#44403c" },
      slots: {
        trigger: "<button>Options</button>",
        items: "<div data-testid='item'>Edit</div>"
      }
    });
    await wrapper.find(".gn-dropdown-menu__trigger").trigger("click");
    const style = wrapper.find(".gn-dropdown-menu__panel").attributes("style");
    expect(style).toContain("--gn-dropdown-menu-background: #1c1917");
    expect(style).toContain("--gn-dropdown-menu-border: #44403c");
  });
});

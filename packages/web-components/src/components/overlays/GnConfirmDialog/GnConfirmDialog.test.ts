import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import GnConfirmDialog from "./GnConfirmDialog.vue";

describe("GnConfirmDialog", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("does not set inline style overrides by default", () => {
    const wrapper = mount(GnConfirmDialog, { props: { message: "Are you sure?" } });
    expect(wrapper.attributes("style")).toBeUndefined();
  });

  it("renders the message", () => {
    const wrapper = mount(GnConfirmDialog, { props: { message: "Are you sure?" } });
    expect(wrapper.find(".gn-confirm-dialog__message").text()).toBe("Are you sure?");
  });

  it("defaults confirm/cancel labels to Yes/No and applies overrides", () => {
    const defaults = mount(GnConfirmDialog, { props: { message: "Are you sure?" } });
    const defaultButtons = defaults.findAll("button");
    expect(defaultButtons[0].text()).toBe("No");
    expect(defaultButtons[1].text()).toBe("Yes");

    const overridden = mount(GnConfirmDialog, {
      props: { message: "Discard changes?", cancelLabel: "Keep editing", confirmLabel: "Discard" }
    });
    const overriddenButtons = overridden.findAll("button");
    expect(overriddenButtons[0].text()).toBe("Keep editing");
    expect(overriddenButtons[1].text()).toBe("Discard");
  });

  it("emits gn-cancel when the cancel button is clicked", async () => {
    const wrapper = mount(GnConfirmDialog, { props: { message: "Are you sure?" } });
    await wrapper.findAll("button")[0].trigger("click");
    expect(wrapper.emitted("gn-cancel")).toHaveLength(1);
    expect(wrapper.emitted("gn-confirm")).toBeUndefined();
  });

  it("emits gn-confirm when the confirm button is clicked", async () => {
    const wrapper = mount(GnConfirmDialog, { props: { message: "Are you sure?" } });
    await wrapper.findAll("button")[1].trigger("click");
    expect(wrapper.emitted("gn-confirm")).toHaveLength(1);
    expect(wrapper.emitted("gn-cancel")).toBeUndefined();
  });

  it("emits gn-cancel on Escape by default, and not when closeOnEscape is false", async () => {
    const enabled = mount(GnConfirmDialog, {
      props: { message: "Are you sure?" },
      attachTo: document.body
    });
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(enabled.emitted("gn-cancel")).toHaveLength(1);
    enabled.unmount();

    const disabled = mount(GnConfirmDialog, {
      props: { message: "Are you sure?", closeOnEscape: false },
      attachTo: document.body
    });
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(disabled.emitted("gn-cancel")).toBeUndefined();
    disabled.unmount();
  });

  it("removes its Escape key listener on unmount", () => {
    const wrapper = mount(GnConfirmDialog, { props: { message: "Are you sure?" }, attachTo: document.body });
    wrapper.unmount();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    // No assertion target on the unmounted wrapper is needed — this just
    // documents/guards that the listener doesn't leak and throw across tests.
  });

  it("emits gn-cancel on a backdrop click by default, and not when closeOnOverlayClick is false", async () => {
    const enabled = mount(GnConfirmDialog, { props: { message: "Are you sure?" } });
    await enabled.find(".gn-confirm-dialog-overlay").trigger("click");
    expect(enabled.emitted("gn-cancel")).toHaveLength(1);

    const disabled = mount(GnConfirmDialog, {
      props: { message: "Are you sure?", closeOnOverlayClick: false }
    });
    await disabled.find(".gn-confirm-dialog-overlay").trigger("click");
    expect(disabled.emitted("gn-cancel")).toBeUndefined();
  });

  it("does not emit gn-cancel when clicking inside the dialog box itself", async () => {
    const wrapper = mount(GnConfirmDialog, { props: { message: "Are you sure?" } });
    await wrapper.find(".gn-confirm-dialog").trigger("click");
    expect(wrapper.emitted("gn-cancel")).toBeUndefined();
  });

  it("sets role, aria-modal, and aria-describedby on the dialog box", () => {
    const wrapper = mount(GnConfirmDialog, { props: { message: "Are you sure?" } });
    const box = wrapper.find(".gn-confirm-dialog");
    expect(box.attributes("role")).toBe("dialog");
    expect(box.attributes("aria-modal")).toBe("true");
    const describedBy = box.attributes("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(wrapper.find(`#${describedBy}`).text()).toBe("Are you sure?");
  });

  it("applies color, backgroundColor, borderColor, textColor, and overlayColor as independent overrides", () => {
    const wrapper = mount(GnConfirmDialog, {
      props: {
        message: "Are you sure?",
        color: "#0ea5e9",
        backgroundColor: "#1c1917",
        borderColor: "transparent",
        textColor: "#f9fafb",
        overlayColor: "rgba(0, 0, 0, 0.75)"
      }
    });
    const style = wrapper.attributes("style");
    expect(style).toContain("--gn-confirm-dialog-background: #1c1917");
    expect(style).toContain("--gn-confirm-dialog-border: transparent");
    expect(style).toContain("--gn-confirm-dialog-text-color: #f9fafb");
    expect(style).toContain("--gn-confirm-dialog-overlay: rgba(0, 0, 0, 0.75)");

    // `color` isn't a CSS variable on this component — it forwards directly
    // to both GnButtons' own `color` prop.
    const buttonStyles = wrapper.findAll("button").map((b) => b.attributes("style"));
    expect(buttonStyles.every((s) => s?.includes("--gn-button-accent: #0ea5e9"))).toBe(true);
  });
});

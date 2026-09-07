import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { GnMetricCard } from "./index";

describe("GnMetricCard", () => {
  it("renders the metric label and numeric value", () => {
    const wrapper = mount(GnMetricCard, { props: { metric: "Active Users", numeric: 1240 } });
    expect(wrapper.find(".gn-metric-card__label").text()).toBe("Active Users");
    expect(wrapper.find(".gn-metric-card__value").text()).toBe("1240");
  });

  it("does not set inline color overrides by default", () => {
    const wrapper = mount(GnMetricCard, { props: { metric: "Active Users", numeric: 1240 } });
    expect(wrapper.attributes("style")).toBeUndefined();
  });

  it("applies backgroundColor, labelColor, valueColor, and borderColor as independent overrides", () => {
    const wrapper = mount(GnMetricCard, {
      props: {
        metric: "Revenue",
        numeric: 84200,
        backgroundColor: "#ffffff",
        labelColor: "#374151",
        valueColor: "#16a34a",
        borderColor: "#e5e7eb"
      }
    });
    const style = wrapper.attributes("style");
    expect(style).toContain("--gn-metric-card-background: #ffffff");
    expect(style).toContain("--gn-metric-card-label-color: #374151");
    expect(style).toContain("--gn-metric-card-value-color: #16a34a");
    expect(style).toContain("--gn-metric-card-border: #e5e7eb");
  });

  it("renders decimal and zero values as given", () => {
    const wrapper = mount(GnMetricCard, { props: { metric: "Conversion", numeric: 0 } });
    expect(wrapper.find(".gn-metric-card__value").text()).toBe("0");
  });
});

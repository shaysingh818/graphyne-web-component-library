import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";

// chart.js needs a real <canvas> 2D rendering context, which jsdom doesn't
// implement — mounting the real vue-chartjs `Bar` component would throw.
// Stub it out and assert on the `data`/`options` props GnBarChart computes
// and passes down instead of on actual canvas rendering.
vi.mock("vue-chartjs", () => ({
  Bar: {
    name: "Bar",
    props: ["data", "options"],
    template: "<canvas></canvas>"
  }
}));

import GnBarChart from "./GnBarChart.vue";
import { Bar } from "vue-chartjs";

describe("GnBarChart", () => {
  const labels = ["A", "B", "C"];
  const data = [1, 2, 3];

  it("does not set inline style overrides by default", () => {
    const wrapper = mount(GnBarChart, { props: { labels, data } });
    expect(wrapper.attributes("style")).toBeUndefined();
  });

  it("passes labels, data, and datasetLabel through to the underlying chart data", () => {
    const wrapper = mount(GnBarChart, {
      props: { labels, data, datasetLabel: "Widgets" }
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chartData = wrapper.findComponent(Bar).props("data") as any;
    expect(chartData.labels).toEqual(labels);
    expect(chartData.datasets[0].label).toBe("Widgets");
    expect(chartData.datasets[0].data).toEqual(data);
  });

  it("recycles colors via modulo when there are more bars than colors", () => {
    const wrapper = mount(GnBarChart, {
      props: { labels: ["A", "B", "C", "D"], data: [1, 2, 3, 4], colors: ["#111111", "#222222"] }
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chartData = wrapper.findComponent(Bar).props("data") as any;
    expect(chartData.datasets[0].backgroundColor).toEqual(["#111111", "#222222", "#111111", "#222222"]);
  });

  it("shows the title plugin by default and hides it when title is empty", () => {
    const withTitle = mount(GnBarChart, { props: { labels, data, title: "Sales" } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const optionsWithTitle = withTitle.findComponent(Bar).props("options") as any;
    expect(optionsWithTitle.plugins.title.display).toBe(true);
    expect(optionsWithTitle.plugins.title.text).toBe("Sales");

    const withoutTitle = mount(GnBarChart, { props: { labels, data, title: "" } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const optionsWithoutTitle = withoutTitle.findComponent(Bar).props("options") as any;
    expect(optionsWithoutTitle.plugins.title.display).toBe(false);
  });

  it("applies backgroundColor, borderColor, and height as independent overrides", () => {
    const wrapper = mount(GnBarChart, {
      props: { labels, data, backgroundColor: "#000000", borderColor: "#ff0000", height: "10rem" }
    });
    const style = wrapper.attributes("style");
    expect(style).toContain("--gn-bar-chart-background: #000000");
    expect(style).toContain("--gn-bar-chart-border: #ff0000");
    expect(style).toContain("--gn-bar-chart-height: 10rem");
  });

  it("applies textColor and gridColor to the chart options rather than as CSS variables", () => {
    const wrapper = mount(GnBarChart, {
      props: { labels, data, textColor: "#111827", gridColor: "rgba(0,0,0,0.2)" }
    });
    // textColor/gridColor are drawn on the canvas by chart.js, which can't
    // read CSS custom properties — so unlike every other color prop in this
    // library, they must NOT show up in the wrapper's inline style.
    expect(wrapper.attributes("style")).toBeUndefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options = wrapper.findComponent(Bar).props("options") as any;
    expect(options.plugins.title.color).toBe("#111827");
    expect(options.plugins.legend.labels.color).toBe("#111827");
    expect(options.scales.x.ticks.color).toBe("#111827");
    expect(options.scales.x.grid.color).toBe("rgba(0,0,0,0.2)");
  });

  it("emits gn-bar-click with the clicked bar's label, value, and index", () => {
    const wrapper = mount(GnBarChart, { props: { labels, data } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options = wrapper.findComponent(Bar).props("options") as any;
    options.onClick(new MouseEvent("click"), [{ index: 1 }]);
    expect(wrapper.emitted("gn-bar-click")).toHaveLength(1);
    expect(wrapper.emitted("gn-bar-click")![0][0]).toEqual({ label: "B", value: 2, index: 1 });
  });

  it("does not emit gn-bar-click when no bar was clicked", () => {
    const wrapper = mount(GnBarChart, { props: { labels, data } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options = wrapper.findComponent(Bar).props("options") as any;
    options.onClick(new MouseEvent("click"), []);
    expect(wrapper.emitted("gn-bar-click")).toBeUndefined();
  });
});

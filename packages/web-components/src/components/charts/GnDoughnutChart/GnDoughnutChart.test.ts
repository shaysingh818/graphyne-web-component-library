import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";

// chart.js needs a real <canvas> 2D rendering context, which jsdom doesn't
// implement — mounting the real vue-chartjs `Doughnut` component would
// throw. Stub it out and assert on the `data`/`options` props
// GnDoughnutChart computes and passes down instead of on actual canvas
// rendering. Same approach as GnBarChart.test.ts.
vi.mock("vue-chartjs", () => ({
  Doughnut: {
    name: "Doughnut",
    props: ["data", "options"],
    template: "<canvas></canvas>"
  }
}));

import GnDoughnutChart from "./GnDoughnutChart.vue";
import { Doughnut } from "vue-chartjs";

describe("GnDoughnutChart", () => {
  const labels = ["Correct", "Incorrect"];
  const data = [45, 55];

  it("does not set inline style overrides by default", () => {
    const wrapper = mount(GnDoughnutChart, { props: { labels, data } });
    expect(wrapper.attributes("style")).toBeUndefined();
  });

  it("passes labels, data, and datasetLabel through to the underlying chart data", () => {
    const wrapper = mount(GnDoughnutChart, {
      props: { labels, data, datasetLabel: "Accuracy" }
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chartData = wrapper.findComponent(Doughnut).props("data") as any;
    expect(chartData.labels).toEqual(labels);
    expect(chartData.datasets[0].label).toBe("Accuracy");
    expect(chartData.datasets[0].data).toEqual(data);
  });

  it("does not set a top-level chartData.label (dead field in the original component)", () => {
    const wrapper = mount(GnDoughnutChart, { props: { labels, data } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chartData = wrapper.findComponent(Doughnut).props("data") as any;
    expect(chartData.label).toBeUndefined();
  });

  it("recycles colors via modulo when there are more segments than colors", () => {
    const wrapper = mount(GnDoughnutChart, {
      props: { labels: ["A", "B", "C", "D"], data: [1, 2, 3, 4], colors: ["#111111", "#222222"] }
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chartData = wrapper.findComponent(Doughnut).props("data") as any;
    expect(chartData.datasets[0].backgroundColor).toEqual(["#111111", "#222222", "#111111", "#222222"]);
  });

  it("sets responsive: true (fixing the original's `reponsive` typo)", () => {
    const wrapper = mount(GnDoughnutChart, { props: { labels, data } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options = wrapper.findComponent(Doughnut).props("options") as any;
    expect(options.responsive).toBe(true);
  });

  it("shows the title plugin by default and hides it when title is empty", () => {
    const withTitle = mount(GnDoughnutChart, { props: { labels, data, title: "Accuracy" } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const optionsWithTitle = withTitle.findComponent(Doughnut).props("options") as any;
    expect(optionsWithTitle.plugins.title.display).toBe(true);
    expect(optionsWithTitle.plugins.title.text).toBe("Accuracy");

    const withoutTitle = mount(GnDoughnutChart, { props: { labels, data, title: "" } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const optionsWithoutTitle = withoutTitle.findComponent(Doughnut).props("options") as any;
    expect(optionsWithoutTitle.plugins.title.display).toBe(false);
  });

  it("applies backgroundColor, borderColor, and height as independent overrides", () => {
    const wrapper = mount(GnDoughnutChart, {
      props: { labels, data, backgroundColor: "#000000", borderColor: "#ff0000", height: "10rem" }
    });
    const style = wrapper.attributes("style");
    expect(style).toContain("--gn-doughnut-chart-background: #000000");
    expect(style).toContain("--gn-doughnut-chart-border: #ff0000");
    expect(style).toContain("--gn-doughnut-chart-height: 10rem");
  });

  it("applies textColor to the chart options rather than as a CSS variable", () => {
    const wrapper = mount(GnDoughnutChart, { props: { labels, data, textColor: "#111827" } });
    expect(wrapper.attributes("style")).toBeUndefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options = wrapper.findComponent(Doughnut).props("options") as any;
    expect(options.plugins.title.color).toBe("#111827");
    expect(options.plugins.legend.labels.color).toBe("#111827");
  });

  it("emits gn-segment-click with the clicked segment's label, value, and index", () => {
    const wrapper = mount(GnDoughnutChart, { props: { labels, data } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options = wrapper.findComponent(Doughnut).props("options") as any;
    options.onClick(new MouseEvent("click"), [{ index: 1 }]);
    expect(wrapper.emitted("gn-segment-click")).toHaveLength(1);
    expect(wrapper.emitted("gn-segment-click")![0][0]).toEqual({ label: "Incorrect", value: 55, index: 1 });
  });

  it("does not emit gn-segment-click when no segment was clicked", () => {
    const wrapper = mount(GnDoughnutChart, { props: { labels, data } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options = wrapper.findComponent(Doughnut).props("options") as any;
    options.onClick(new MouseEvent("click"), []);
    expect(wrapper.emitted("gn-segment-click")).toBeUndefined();
  });
});

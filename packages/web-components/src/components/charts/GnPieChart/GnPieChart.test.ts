import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";

// chart.js needs a real <canvas> 2D rendering context, which jsdom doesn't
// implement — mounting the real vue-chartjs `Pie` component would throw.
// Stub it out and assert on the `data`/`options` props GnPieChart computes
// and passes down instead of on actual canvas rendering. Same approach as
// GnBarChart.test.ts / GnDoughnutChart.test.ts / GnLineChart.test.ts.
vi.mock("vue-chartjs", () => ({
  Pie: {
    name: "Pie",
    props: ["data", "options"],
    template: "<canvas></canvas>"
  }
}));

import GnPieChart from "./GnPieChart.vue";
import { Pie } from "vue-chartjs";

describe("GnPieChart", () => {
  const labels = ["Open Ended", "Multiple Choice", "Ordered Sequence"];
  const data = [40, 20, 35];

  it("does not set inline style overrides by default", () => {
    const wrapper = mount(GnPieChart, { props: { labels, data } });
    expect(wrapper.attributes("style")).toBeUndefined();
  });

  it("passes labels, data, and datasetLabel through to the underlying chart data", () => {
    const wrapper = mount(GnPieChart, {
      props: { labels, data, datasetLabel: "Question Types" }
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chartData = wrapper.findComponent(Pie).props("data") as any;
    expect(chartData.labels).toEqual(labels);
    expect(chartData.datasets[0].label).toBe("Question Types");
    expect(chartData.datasets[0].data).toEqual(data);
  });

  it("sets borderWidth: 0 instead of the original's dead `border: 'none'` field", () => {
    const wrapper = mount(GnPieChart, { props: { labels, data } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chartData = wrapper.findComponent(Pie).props("data") as any;
    expect(chartData.datasets[0].borderWidth).toBe(0);
    expect(chartData.datasets[0].border).toBeUndefined();
  });

  it("recycles colors via modulo when there are more segments than colors", () => {
    const wrapper = mount(GnPieChart, {
      props: { labels: ["A", "B", "C", "D"], data: [1, 2, 3, 4], colors: ["#111111", "#222222"] }
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chartData = wrapper.findComponent(Pie).props("data") as any;
    expect(chartData.datasets[0].backgroundColor).toEqual(["#111111", "#222222", "#111111", "#222222"]);
  });

  it("shows the title plugin by default and hides it when title is empty", () => {
    const withTitle = mount(GnPieChart, { props: { labels, data, title: "Question Types" } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const optionsWithTitle = withTitle.findComponent(Pie).props("options") as any;
    expect(optionsWithTitle.plugins.title.display).toBe(true);
    expect(optionsWithTitle.plugins.title.text).toBe("Question Types");

    const withoutTitle = mount(GnPieChart, { props: { labels, data, title: "" } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const optionsWithoutTitle = withoutTitle.findComponent(Pie).props("options") as any;
    expect(optionsWithoutTitle.plugins.title.display).toBe(false);
  });

  it("applies backgroundColor, borderColor, and height as independent overrides", () => {
    const wrapper = mount(GnPieChart, {
      props: { labels, data, backgroundColor: "#000000", borderColor: "#ff0000", height: "10rem" }
    });
    const style = wrapper.attributes("style");
    expect(style).toContain("--gn-pie-chart-background: #000000");
    expect(style).toContain("--gn-pie-chart-border: #ff0000");
    expect(style).toContain("--gn-pie-chart-height: 10rem");
  });

  it("applies textColor to both the title and legend chart options rather than as a CSS variable", () => {
    const wrapper = mount(GnPieChart, { props: { labels, data, textColor: "#111827" } });
    expect(wrapper.attributes("style")).toBeUndefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options = wrapper.findComponent(Pie).props("options") as any;
    expect(options.plugins.title.color).toBe("#111827");
    expect(options.plugins.legend.labels.color).toBe("#111827");
  });

  it("emits gn-segment-click with the clicked segment's label, value, and index", () => {
    const wrapper = mount(GnPieChart, { props: { labels, data } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options = wrapper.findComponent(Pie).props("options") as any;
    options.onClick(new MouseEvent("click"), [{ index: 2 }]);
    expect(wrapper.emitted("gn-segment-click")).toHaveLength(1);
    expect(wrapper.emitted("gn-segment-click")![0][0]).toEqual({
      label: "Ordered Sequence",
      value: 35,
      index: 2
    });
  });

  it("does not emit gn-segment-click when no segment was clicked", () => {
    const wrapper = mount(GnPieChart, { props: { labels, data } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options = wrapper.findComponent(Pie).props("options") as any;
    options.onClick(new MouseEvent("click"), []);
    expect(wrapper.emitted("gn-segment-click")).toBeUndefined();
  });
});

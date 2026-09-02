import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";

// chart.js needs a real <canvas> 2D rendering context, which jsdom doesn't
// implement — mounting the real vue-chartjs `Line` component would throw.
// Stub it out and assert on the `data`/`options` props GnLineChart computes
// and passes down instead of on actual canvas rendering. Same approach as
// GnBarChart.test.ts / GnDoughnutChart.test.ts.
vi.mock("vue-chartjs", () => ({
  Line: {
    name: "Line",
    props: ["data", "options"],
    template: "<canvas></canvas>"
  }
}));

import GnLineChart from "./GnLineChart.vue";
import { Line } from "vue-chartjs";

describe("GnLineChart", () => {
  const labels = ["Jan", "Feb", "Mar"];
  const datasets = [
    { label: "Accuracy", data: [40, 55, 30] },
    { label: "Completion Rate", data: [60, 50, 75] }
  ];

  it("does not set inline style overrides by default", () => {
    const wrapper = mount(GnLineChart, { props: { labels, datasets } });
    expect(wrapper.attributes("style")).toBeUndefined();
  });

  it("passes labels and each dataset's label/data through to the underlying chart data", () => {
    const wrapper = mount(GnLineChart, { props: { labels, datasets } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chartData = wrapper.findComponent(Line).props("data") as any;
    expect(chartData.labels).toEqual(labels);
    expect(chartData.datasets).toHaveLength(2);
    expect(chartData.datasets[0].label).toBe("Accuracy");
    expect(chartData.datasets[0].data).toEqual([40, 55, 30]);
    expect(chartData.datasets[1].label).toBe("Completion Rate");
  });

  it("uses each dataset's own color when provided, falling back to the colors palette by index otherwise", () => {
    const wrapper = mount(GnLineChart, {
      props: {
        labels,
        datasets: [
          { label: "A", data: [1, 2, 3], color: "#dc2626" },
          { label: "B", data: [4, 5, 6] }
        ],
        colors: ["#111111", "#222222"]
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chartData = wrapper.findComponent(Line).props("data") as any;
    expect(chartData.datasets[0].borderColor).toBe("#dc2626");
    expect(chartData.datasets[1].borderColor).toBe("#222222");
  });

  it("derives each dataset's fill backgroundColor from its own line color", () => {
    const wrapper = mount(GnLineChart, {
      props: { labels, datasets: [{ label: "A", data: [1, 2, 3], color: "#ff0000" }] }
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chartData = wrapper.findComponent(Line).props("data") as any;
    // A translucent tint of red, not chart.js's generic default fill color.
    expect(chartData.datasets[0].backgroundColor).toMatch(/rgba?\(255, ?0, ?0/);
  });

  it("applies tension, pointRadius, and fill uniformly across every dataset", () => {
    const wrapper = mount(GnLineChart, {
      props: { labels, datasets, tension: 0, pointRadius: 2, fill: false }
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chartData = wrapper.findComponent(Line).props("data") as any;
    for (const ds of chartData.datasets) {
      expect(ds.tension).toBe(0);
      expect(ds.pointRadius).toBe(2);
      expect(ds.fill).toBe(false);
    }
  });

  it("shows the title plugin by default and hides it when title is empty", () => {
    const withTitle = mount(GnLineChart, { props: { labels, datasets, title: "Trends" } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const optionsWithTitle = withTitle.findComponent(Line).props("options") as any;
    expect(optionsWithTitle.plugins.title.display).toBe(true);
    expect(optionsWithTitle.plugins.title.text).toBe("Trends");

    const withoutTitle = mount(GnLineChart, { props: { labels, datasets, title: "" } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const optionsWithoutTitle = withoutTitle.findComponent(Line).props("options") as any;
    expect(optionsWithoutTitle.plugins.title.display).toBe(false);
  });

  it("applies backgroundColor, borderColor, and height as independent overrides", () => {
    const wrapper = mount(GnLineChart, {
      props: { labels, datasets, backgroundColor: "#000000", borderColor: "#ff0000", height: "10rem" }
    });
    const style = wrapper.attributes("style");
    expect(style).toContain("--gn-line-chart-background: #000000");
    expect(style).toContain("--gn-line-chart-border: #ff0000");
    expect(style).toContain("--gn-line-chart-height: 10rem");
  });

  it("applies textColor and gridColor to the chart options rather than as CSS variables", () => {
    const wrapper = mount(GnLineChart, {
      props: { labels, datasets, textColor: "#111827", gridColor: "rgba(0,0,0,0.2)" }
    });
    expect(wrapper.attributes("style")).toBeUndefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options = wrapper.findComponent(Line).props("options") as any;
    expect(options.plugins.title.color).toBe("#111827");
    expect(options.plugins.legend.labels.color).toBe("#111827");
    expect(options.scales.x.ticks.color).toBe("#111827");
    expect(options.scales.x.grid.color).toBe("rgba(0,0,0,0.2)");
    expect(options.scales.y.grid.color).toBe("rgba(0,0,0,0.2)");
  });

  it("emits gn-point-click with the clicked point's dataset label, x-axis label, value, and indexes", () => {
    const wrapper = mount(GnLineChart, { props: { labels, datasets } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options = wrapper.findComponent(Line).props("options") as any;
    options.onClick(new MouseEvent("click"), [{ datasetIndex: 1, index: 2 }]);
    expect(wrapper.emitted("gn-point-click")).toHaveLength(1);
    expect(wrapper.emitted("gn-point-click")![0][0]).toEqual({
      datasetLabel: "Completion Rate",
      label: "Mar",
      value: 75,
      datasetIndex: 1,
      index: 2
    });
  });

  it("does not emit gn-point-click when no point was clicked", () => {
    const wrapper = mount(GnLineChart, { props: { labels, datasets } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options = wrapper.findComponent(Line).props("options") as any;
    options.onClick(new MouseEvent("click"), []);
    expect(wrapper.emitted("gn-point-click")).toBeUndefined();
  });
});

import { formatModelLabel } from "../utils/modelFormatters.js";

function pointDatalabels({ color, weight, display, font }) {
  return {
    anchor: "center",
    offset: 6,
    clamp: true,
    clip: true,
    align: (ctx) => {
      const xScale = ctx.chart.scales.x;
      const px = xScale.getPixelForValue(ctx.dataset.data[ctx.dataIndex].x);
      return px > xScale.left + xScale.width * 0.62 ? "left" : "right";
    },
    display,
    color,
    font: { size: 10, weight, family: font },
    formatter: (_val, ctx) => {
      const model = ctx.dataset.data[ctx.dataIndex].model;
      const label = formatModelLabel(model);
      return model.taskCostUsd === 0 ? `${label} ($0)` : label;
    }
  };
}

export function buildDatasets(seriesMap, theme) {
  return [
    {
      seriesKey: "frontier",
      label: "Pareto Line",
      data: seriesMap.frontier,
      order: 10,
      showLine: true,
      borderColor: theme.paretoLine,
      borderWidth: 1.8,
      pointRadius: 0,
      pointHitRadius: 0,
      pointHoverRadius: 0,
      tension: 0,
      datalabels: { display: false }
    },
    {
      seriesKey: "paretoFlex",
      label: "Pareto Layer 1 (Flex tier)",
      data: seriesMap.paretoFlex,
      order: 1,
      backgroundColor: theme.flexSolid,
      borderColor: theme.green,
      borderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8.5,
      datalabels: pointDatalabels({ color: theme.green, weight: "500", display: "auto", font: theme.font })
    },
    {
      seriesKey: "paretoStd",
      label: "Pareto Layer 1 (Standard tier)",
      data: seriesMap.paretoStd,
      order: 1,
      backgroundColor: theme.stdSolid,
      borderColor: theme.green,
      borderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8.5,
      datalabels: pointDatalabels({ color: theme.green, weight: "500", display: "auto", font: theme.font })
    },
    {
      seriesKey: "threshold",
      label: "Baseline",
      data: seriesMap.threshold,
      order: 0,
      backgroundColor: theme.amber,
      borderColor: theme.bg,
      borderWidth: 1.5,
      pointRadius: 6,
      pointHoverRadius: 8.5,
      datalabels: pointDatalabels({ color: theme.amber, weight: "600", display: true, font: theme.font })
    },
    {
      seriesKey: "flex",
      label: "Pareto Layer 2 and below (Flex tier)",
      data: seriesMap.flex,
      order: 5,
      backgroundColor: theme.flexMutedBg,
      borderColor: theme.flexMutedBorder,
      borderWidth: 0.8,
      pointRadius: 3.5,
      pointHoverRadius: 6,
      datalabels: { display: false }
    },
    {
      seriesKey: "standard",
      label: "Pareto Layer 2 and below (Standard tier)",
      data: seriesMap.standard,
      order: 5,
      backgroundColor: theme.stdMutedBg,
      borderColor: theme.stdMutedBorder,
      borderWidth: 0.8,
      pointRadius: 3.5,
      pointHoverRadius: 6,
      datalabels: { display: false }
    }
  ];
}

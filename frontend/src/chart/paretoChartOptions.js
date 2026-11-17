import { fmtUsd } from "../utils/formatters.js";
import { buildTooltipConfig } from "./paretoTooltip.js";

function formatXTick(val, _index, ticks) {
  if (ticks.length > 9 && !["1", "2", "5"].includes(val.toExponential(0)[0])) {
    return null;
  }
  return fmtUsd(val, { compact: true });
}

export function buildChartOptions({ annotations, xAxisTitle, theme, getTaskTitle, onZoomChange }) {
  const markZoomed = ({ chart }) => onZoomChange(chart.isZoomedOrPanned());

  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    interaction: { mode: "nearest", intersect: true },
    layout: { padding: { top: 14, right: 16 } },
    plugins: {
      annotation: { annotations },
      zoom: {
        pan: {
          enabled: true,
          mode: "xy",
          onPanComplete: markZoomed
        },
        zoom: {
          wheel: { enabled: true, modifierKey: "ctrl" },
          drag: {
            enabled: true,
            modifierKey: "shift",
            backgroundColor: theme.zoomBg,
            borderColor: theme.zoomBorder,
            borderWidth: 1
          },
          pinch: { enabled: true },
          mode: "xy",
          onZoomComplete: markZoomed
        }
      },
      legend: {
        labels: {
          color: theme.muted,
          padding: 10,
          boxWidth: 10,
          font: { size: 11, family: theme.font },
          filter: (item, data) => {
            const ds = data.datasets[item.datasetIndex];
            return ds.seriesKey !== "frontier" && ds.data.length > 0;
          }
        }
      },
      tooltip: buildTooltipConfig({ theme, getTaskTitle })
    },
    scales: {
      x: {
        type: "logarithmic",
        grace: "6%",
        grid: { color: theme.grid },
        title: { display: true, text: xAxisTitle, color: theme.muted },
        ticks: {
          color: theme.muted,
          autoSkip: true,
          maxTicksLimit: 8,
          autoSkipPadding: 28,
          maxRotation: 0,
          minRotation: 0,
          callback: formatXTick
        }
      },
      y: {
        type: "linear",
        min: 0,
        grace: "12%",
        grid: { color: theme.grid },
        title: { display: true, text: "AAI Index", color: theme.muted },
        ticks: {
          color: theme.muted,
          autoSkip: true,
          maxTicksLimit: 8,
          autoSkipPadding: 14
        }
      }
    }
  };
}

import { Chart } from "chart.js";
import { TASK_PROFILES } from "../constants/taskProfiles.js";
import "./chartSetup.js";
import { getChartTheme } from "./chartTheme.js";
import { buildAnnotations } from "./paretoAnnotations.js";
import { buildChartOptions } from "./paretoChartOptions.js";
import { buildDatasets } from "./paretoDatasets.js";
import { classifyPoints, computeFreeX } from "./paretoSeries.js";

function prepareChartState({ models, thresholdModel, costProfile, theme }) {
  const { title: taskTitle, lower: taskLower } = TASK_PROFILES[costProfile];
  const freeX = computeFreeX(models);
  return {
    taskTitle,
    xAxisTitle: `${taskTitle} ($)`,
    seriesMap: classifyPoints(models, freeX),
    annotations: buildAnnotations(thresholdModel, freeX, taskLower, theme)
  };
}

export function createParetoChart(canvas, { models, thresholdModel, costProfile, onZoomChange }) {
  const theme = getChartTheme();
  const initial = prepareChartState({ models, thresholdModel, costProfile, theme });
  let currentTaskTitle = initial.taskTitle;

  const chart = new Chart(canvas, {
    type: "scatter",
    data: {
      datasets: buildDatasets(initial.seriesMap, theme)
    },
    options: buildChartOptions({
      annotations: initial.annotations,
      xAxisTitle: initial.xAxisTitle,
      theme,
      getTaskTitle: () => currentTaskTitle,
      onZoomChange
    })
  });

  return {
    update({ models: nextModels, thresholdModel: nextThreshold, costProfile: nextProfile, resetZoom = false }) {
      const next = prepareChartState({
        models: nextModels,
        thresholdModel: nextThreshold,
        costProfile: nextProfile,
        theme
      });
      currentTaskTitle = next.taskTitle;
      for (const ds of chart.data.datasets) {
        ds.data = next.seriesMap[ds.seriesKey];
      }
      chart.options.plugins.annotation.annotations = next.annotations;
      chart.options.scales.x.title.text = next.xAxisTitle;

      if (resetZoom && chart.isZoomedOrPanned()) {
        chart.resetZoom("none");
      }
      chart.update("none");
    },
    resetZoom() {
      chart.resetZoom();
    },
    destroy() {
      chart.destroy();
    }
  };
}

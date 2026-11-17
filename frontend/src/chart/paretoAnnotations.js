export function buildAnnotations(thresholdModel, freeX, taskLower, theme) {
  const annotations = {
    cornerHint: {
      type: "label",
      xValue: (ctx) => ctx.chart.scales.x.min,
      yValue: (ctx) => ctx.chart.scales.y.max,
      position: { x: "start", y: "start" },
      textAlign: "left",
      xAdjust: 8,
      yAdjust: 6,
      color: theme.hint,
      font: { size: 10.5, weight: "600", family: theme.font },
      content: (ctx) => {
        const narrow = ctx.chart.width < 540;
        if (thresholdModel) {
          return narrow
            ? ["Higher AAI,", "lower cost vs base"]
            : `Higher AAI Index and lower ${taskLower} than baseline`;
        }
        return narrow
          ? ["Ideal: higher AAI,", "lower cost"]
          : `Ideal: higher AAI Index and lower ${taskLower}`;
      }
    }
  };

  if (thresholdModel) {
    const thrX = thresholdModel.taskCostUsd > 0 ? thresholdModel.taskCostUsd : freeX;
    if (thrX > 0) {
      const thrLineStyle = {
        type: "line",
        borderColor: theme.thrLine,
        borderWidth: 1.2,
        borderDash: [5, 5]
      };
      annotations.betterZone = {
        type: "box",
        xMax: thrX,
        yMin: thresholdModel.aaIntelligenceIndex,
        backgroundColor: theme.betterZone,
        borderWidth: 0
      };
      annotations.thrLineX = { ...thrLineStyle, xMin: thrX, xMax: thrX };
      annotations.thrLineY = {
        ...thrLineStyle,
        yMin: thresholdModel.aaIntelligenceIndex,
        yMax: thresholdModel.aaIntelligenceIndex
      };
    }
  }

  return annotations;
}

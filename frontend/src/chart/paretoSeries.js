export function computeFreeX(models) {
  const positiveCosts = models.map((m) => m.taskCostUsd).filter((c) => c > 0);
  const minPositive = positiveCosts.length ? Math.min(...positiveCosts) : 0.001;
  // Place $0 models slightly left of the cheapest paid model on the logarithmic X axis
  return minPositive * 0.45;
}

export function classifyPoints(models, freeX) {
  const seriesMap = {
    frontier: [],
    paretoFlex: [],
    paretoStd: [],
    threshold: [],
    flex: [],
    standard: []
  };

  for (const m of models) {
    const pt = { x: m.taskCostUsd > 0 ? m.taskCostUsd : freeX, y: m.aaIntelligenceIndex, model: m };
    if (m.isPareto) seriesMap.frontier.push(pt);
    if (m.vsThreshold?.isThreshold) seriesMap.threshold.push(pt);
    else if (m.isPareto) (m.selectedEndpoint.isFlex ? seriesMap.paretoFlex : seriesMap.paretoStd).push(pt);
    else (m.selectedEndpoint.isFlex ? seriesMap.flex : seriesMap.standard).push(pt);
  }

  seriesMap.frontier.sort((a, b) => a.model.taskCostUsd - b.model.taskCostUsd);

  return seriesMap;
}

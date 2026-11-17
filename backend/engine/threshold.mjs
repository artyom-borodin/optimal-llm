import { SCORE_EPS } from "./pareto.mjs";

export function filterByThreshold(entries, thresholdEntry, includeBelowThreshold) {
  if (!thresholdEntry || includeBelowThreshold) return entries;
  return entries.filter(
    (entry) => entry.aaIntelligenceIndex >= thresholdEntry.aaIntelligenceIndex - SCORE_EPS
  );
}

export function buildVsThreshold(item, thresholdEntry) {
  if (!thresholdEntry) return null;
  return {
    isThreshold: item.slug === thresholdEntry.slug,
    deltaAaIndex: item.aaIntelligenceIndex - thresholdEntry.aaIntelligenceIndex,
    costRatio: thresholdEntry.taskCostUsd > 0
      ? item.taskCostUsd / thresholdEntry.taskCostUsd
      : (item.taskCostUsd > 0 ? null : 1)
  };
}

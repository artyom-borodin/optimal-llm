import { fmtIndex, fmtUsd } from "./formatters.js";
import { evaluateThresholdComparison } from "./thresholdEvaluation.js";

function fmtRatio(r) {
  return r < 2 ? r.toFixed(2) : r.toFixed(1);
}

function formatIndexDiff(deltaIndex, indexTrend) {
  if (indexTrend === "higher") return `+${fmtIndex(deltaIndex)}`;
  if (indexTrend === "lower") return `-${fmtIndex(Math.abs(deltaIndex))}`;
  return "0.0";
}

function formatCostDiff(evaluation) {
  switch (evaluation.costRelation) {
    case "paid_vs_free":
      return `more expensive by ${fmtUsd(evaluation.taskCostUsd)}`;
    case "free":
      return "free";
    case "cheaper":
      return `${fmtRatio(evaluation.costFactor)} times cheaper`;
    case "more_expensive":
      return `${fmtRatio(evaluation.costFactor)} times more expensive`;
    default:
      return "same cost";
  }
}

export function formatThresholdComparison(model) {
  const evaluation = evaluateThresholdComparison(model);
  if (!evaluation) return null;
  if (evaluation.isThreshold) return { isThreshold: true };

  return {
    isThreshold: false,
    indexText: formatIndexDiff(evaluation.deltaIndex, evaluation.indexTrend),
    indexBetter: evaluation.indexBetter,
    costText: formatCostDiff(evaluation),
    costBetter: evaluation.costBetter
  };
}

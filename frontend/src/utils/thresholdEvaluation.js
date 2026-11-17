const INDEX_EPSILON = 0.05;
const COST_RATIO_CHEAPER = 0.995;
const COST_RATIO_EXPENSIVE = 1.005;

export function evaluateThresholdComparison(model) {
  const vs = model.vsThreshold;
  if (!vs) return null;
  if (vs.isThreshold) return { isThreshold: true };

  const deltaIndex = vs.deltaAaIndex;
  const indexTrend = deltaIndex > INDEX_EPSILON ? "higher" : deltaIndex < -INDEX_EPSILON ? "lower" : "equal";
  const indexBetter = deltaIndex >= -INDEX_EPSILON;

  const cr = vs.costRatio;
  let costRelation = "same";
  let costFactor = 1;
  let costBetter = cr != null && cr <= COST_RATIO_EXPENSIVE;

  if (cr == null) {
    costRelation = "paid_vs_free";
    costBetter = false;
  } else if (cr === 0) {
    costRelation = "free";
    costBetter = true;
  } else if (cr < COST_RATIO_CHEAPER) {
    costRelation = "cheaper";
    costFactor = 1 / cr;
  } else if (cr > COST_RATIO_EXPENSIVE) {
    costRelation = "more_expensive";
    costFactor = cr;
  }

  return {
    isThreshold: false,
    deltaIndex,
    indexTrend,
    indexBetter,
    costRelation,
    costFactor,
    costBetter,
    taskCostUsd: model.taskCostUsd
  };
}

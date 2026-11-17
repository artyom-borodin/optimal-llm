import { SORT_BY } from "../constants.mjs";

const valueRatio = (m) => (m.taskCostUsd > 0 ? m.aaIntelligenceIndex / m.taskCostUsd : Infinity);

function compareByRatio(a, b) {
  const ra = valueRatio(a);
  const rb = valueRatio(b);
  if (ra !== rb) return rb - ra;
  return b.aaIntelligenceIndex - a.aaIntelligenceIndex;
}

export function sortRankedModels(ranked, sortBy) {
  return [...ranked].sort((a, b) => {
    if (sortBy === SORT_BY.SCORE) return b.aaIntelligenceIndex - a.aaIntelligenceIndex;
    if (sortBy === SORT_BY.COST) return a.taskCostUsd - b.taskCostUsd;
    if (sortBy === SORT_BY.VALUE_RATIO) return compareByRatio(a, b);
    if (a.paretoLayer !== b.paretoLayer) return a.paretoLayer - b.paretoLayer;
    return compareByRatio(a, b);
  });
}

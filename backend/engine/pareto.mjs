import { COST_EPS } from "./cost.mjs";

export const SCORE_EPS = 1e-9;

const sameScore = (a, b) => Math.abs(a.aaIntelligenceIndex - b.aaIntelligenceIndex) <= SCORE_EPS;
const sameCost = (a, b) => Math.abs(a.taskCostUsd - b.taskCostUsd) <= COST_EPS;

function dominates(b, a) {
  return (
    b.aaIntelligenceIndex >= a.aaIntelligenceIndex - SCORE_EPS &&
    b.taskCostUsd <= a.taskCostUsd + COST_EPS &&
    (!sameScore(b, a) || !sameCost(b, a))
  );
}

export function computeParetoLayers(items) {
  const dominators = new Map(items.map((item) => [item.slug, []]));

  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < items.length; j++) {
      if (i !== j && dominates(items[j], items[i])) {
        dominators.get(items[i].slug).push(items[j].slug);
      }
    }
  }

  const layers = new Map();
  const remaining = new Set(items.map((item) => item.slug));
  let currentLayer = 1;

  while (remaining.size > 0) {
    const frontier = [];
    for (const slug of remaining) {
      if (!dominators.get(slug).some((d) => remaining.has(d))) frontier.push(slug);
    }

    if (frontier.length === 0) {
      for (const slug of remaining) layers.set(slug, currentLayer);
      break;
    }

    for (const slug of frontier) {
      layers.set(slug, currentLayer);
      remaining.delete(slug);
    }
    currentLayer++;
  }

  return { layers, dominators };
}

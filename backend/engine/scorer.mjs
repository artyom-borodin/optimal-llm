import { normalizeRankOptions } from "./rankOptions.mjs";
import { selectBestEndpoint } from "./endpointSelector.mjs";
import { computeParetoLayers } from "./pareto.mjs";
import { buildVsThreshold, filterByThreshold } from "./threshold.mjs";
import { sortRankedModels } from "./sorter.mjs";

function buildScoredEntry(model, endpoint) {
  return {
    slug: model.slug,
    aaIntelligenceIndex: model.intelligenceIndex,
    taskCostUsd: endpoint.taskCostUsd,
    model,
    endpoint
  };
}

export function rankModels(models, options = {}) {
  const opts = normalizeRankOptions(options);
  const scored = [];
  let thresholdEntry = null;

  for (const m of models || []) {
    if (m.intelligenceIndex == null) continue;
    const ep = selectBestEndpoint(m, opts);
    if (!ep) continue;

    const entry = buildScoredEntry(m, ep);
    scored.push(entry);

    if (opts.thresholdSlug && entry.slug === opts.thresholdSlug) thresholdEntry = entry;
  }

  const pool = filterByThreshold(scored, thresholdEntry, opts.includeBelowThreshold);
  const { layers, dominators } = computeParetoLayers(pool);

  const ranked = pool.map((entry) => {
    const paretoLayer = layers.get(entry.slug);
    return {
      ...entry,
      paretoLayer,
      isPareto: paretoLayer === 1,
      dominatedByCount: dominators.get(entry.slug).length,
      vsThreshold: buildVsThreshold(entry, thresholdEntry)
    };
  });

  return {
    thresholdEntry,
    entries: sortRankedModels(ranked, opts.sortBy)
  };
}

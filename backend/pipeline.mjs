import { fetchArtificialAnalysis } from "./fetchers/artificialAnalysis.mjs";
import { fetchOpenRouterCatalog, fetchOpenRouterEndpoints } from "./fetchers/openRouter.mjs";
import { enrichModelsWithTaskMetrics } from "./engine/aaTaskMetrics.mjs";
import { applyEndpointDataPolicies } from "./engine/dataPolicy.mjs";
import { matchAaWithOpenRouter } from "./engine/matcher.mjs";

function collectUniqueOpenRouterModels(matchedModels) {
  const unique = new Map();
  for (const m of matchedModels) {
    for (const orm of m.openRouterAll || []) {
      unique.set(orm.id, orm);
    }
  }
  return [...unique.values()];
}

function attachEndpoints(matchedModels, hydratedById) {
  return matchedModels.map((m) => ({
    ...m,
    openRouterAll: (m.openRouterAll || []).map((orm) => hydratedById.get(orm.id)).filter(Boolean)
  }));
}

export async function buildDataset() {
  const [rawAaModels, openRouterCatalog] = await Promise.all([
    fetchArtificialAnalysis(),
    fetchOpenRouterCatalog()
  ]);

  const aaModels = enrichModelsWithTaskMetrics(rawAaModels);
  const prelimMatched = matchAaWithOpenRouter({
    aaModels,
    openRouterModels: openRouterCatalog.models
  });

  const uniqueOrModels = collectUniqueOpenRouterModels(prelimMatched);
  const rawHydrated = await fetchOpenRouterEndpoints(uniqueOrModels, openRouterCatalog.zdrMap);
  const hydratedById = applyEndpointDataPolicies(rawHydrated);
  return attachEndpoints(prelimMatched, hydratedById);
}

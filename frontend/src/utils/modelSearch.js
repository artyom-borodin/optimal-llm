import { getEffortSlug } from "./modelFormatters.js";

export function matchesModelQuery(model, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  return [
    model.releaseName,
    model.name,
    model.creatorName,
    model.selectedEndpoint?.providerName,
    model.selectedEndpoint?.openRouterModelId,
    getEffortSlug(model)
  ]
    .filter(Boolean)
    .some((field) => field.toLowerCase().includes(q));
}

export function filterModelsByQuery(models, query) {
  if (!query.trim()) return models;
  return models.filter((m) => matchesModelQuery(m, query));
}

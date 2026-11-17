import { fetchJson } from "../http.mjs";
import { buildZdrMap } from "./openRouterZdr.mjs";
import { normalizeCatalogModels } from "./openRouterCatalogNormalizer.mjs";
import { normalizeEndpoints } from "./openRouterEndpointNormalizer.mjs";

const MODELS_API = "https://openrouter.ai/api/v1/models";
const ZDR_API = "https://openrouter.ai/api/v1/endpoints/zdr";

export async function fetchOpenRouterCatalog() {
  const [catalog, zdrData] = await Promise.all([
    fetchJson(MODELS_API),
    fetchJson(ZDR_API).catch(() => ({ data: [] }))
  ]);

  return {
    models: normalizeCatalogModels(catalog),
    zdrMap: buildZdrMap(zdrData)
  };
}

export async function fetchOpenRouterEndpoints(orModels, zdrMap) {
  const entries = await Promise.all(
    orModels.map(async (orm) => {
      const detail = await fetchJson(`${MODELS_API}/${orm.id}/endpoints`)
        .then((payload) => payload?.data || null)
        .catch(() => null);
      return [
        orm.id,
        { id: orm.id, endpoints: normalizeEndpoints(orm, detail, zdrMap) }
      ];
    })
  );

  return new Map(entries);
}

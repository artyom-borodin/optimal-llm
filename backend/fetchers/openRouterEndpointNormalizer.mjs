import { zdrKey } from "./openRouterZdr.mjs";

function toPer1M(val) {
  if (val == null || val === "") return null;
  const n = Number(val);
  return Number.isFinite(n) ? n * 1e6 : null;
}

function isActiveEndpoint(ep) {
  return ep.status == null || ep.status === 0;
}

export function normalizeEndpoints(model, detail, zdrMap) {
  const endpoints = [];

  for (const ep of detail?.endpoints || []) {
    if (!isActiveEndpoint(ep)) continue;

    const p = ep.pricing || {};
    const safetyRetention = zdrMap.get(zdrKey(model.id, ep));

    endpoints.push({
      providerName: ep.provider_name || "Unknown",
      serviceTier: ep.service_tier || "standard",
      isFlex: ep.service_tier === "flex",
      safetyRetention,
      quantization: ep.quantization || null,
      contextLength: ep.context_length || model.contextLength || null,
      uptime1d: ep.uptime_last_1d ?? null,
      throughput30m: ep.throughput_last_30m?.p50 ?? null,
      latency30m: ep.latency_last_30m?.p50 ?? null,
      pricing1m: {
        prompt: toPer1M(p.prompt),
        completion: toPer1M(p.completion),
        cacheRead: toPer1M(p.input_cache_read),
        cacheWrite: toPer1M(p.input_cache_write)
      }
    });
  }

  return endpoints;
}

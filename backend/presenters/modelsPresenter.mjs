import { resolveOutputSpeed, resolveOutputSpeedSource } from "../engine/speed.mjs";
import { isFourBitQuant } from "../engine/quantization.mjs";

export function buildMetaModelsList(models) {
  return models.map((m) => ({
    slug: m.slug,
    releaseName: m.releaseName,
    name: m.name,
    effort: m.effort,
    isReasoning: m.isReasoning,
    intelligenceIndex: m.intelligenceIndex
  }));
}

function buildScoredModelDto(entry) {
  const { model, endpoint: ep } = entry;
  return {
    slug: model.slug,
    releaseName: model.releaseName,
    name: model.name,
    creatorName: model.creatorName,
    isReasoning: model.isReasoning,
    effort: model.effort,
    contextWindowTokens: ep.contextLength || null,
    outputSpeed: resolveOutputSpeed(ep, model),
    outputSpeedSource: resolveOutputSpeedSource(ep, model),
    latency30m: ep.latency30m ?? null,
    aaIntelligenceIndex: model.intelligenceIndex,
    taskCostUsd: ep.taskCostUsd,
    selectedEndpoint: {
      openRouterModelId: ep.openRouterModelId,
      providerName: ep.providerName,
      serviceTier: ep.serviceTier,
      isFlex: ep.isFlex,
      dataPolicy: ep.dataPolicy,
      quantization: ep.quantization || "unknown",
      isFourBit: isFourBitQuant(ep.quantization),
      uptime1d: ep.uptime1d,
      pricing1m: {
        prompt: ep.pricing1m.prompt,
        completion: ep.pricing1m.completion,
        cacheRead: ep.pricing1m.cacheRead
      }
    }
  };
}

export function buildRankResponseDto({ thresholdEntry, entries }) {
  return {
    thresholdModel: thresholdEntry ? buildScoredModelDto(thresholdEntry) : null,
    models: entries.map((entry) => ({
      ...buildScoredModelDto(entry),
      paretoLayer: entry.paretoLayer,
      isPareto: entry.isPareto,
      dominatedByCount: entry.dominatedByCount,
      vsThreshold: entry.vsThreshold
    }))
  };
}

import { DATA_POLICY, QUANTIZATION_MODE } from "../constants.mjs";
import { COST_EPS, computeEndpointCost } from "./cost.mjs";
import { passesEndpointFilters } from "./endpointFilter.mjs";
import { isFourBitQuant } from "./quantization.mjs";

const POLICY_RANK = {
  [DATA_POLICY.NO_RETENTION]: 0,
  [DATA_POLICY.SAFETY_RETENTION]: 1,
  [DATA_POLICY.RETENTION_AND_TRAINING]: 2
};

function isBetterEndpoint(cand, best) {
  if (!best) return true;
  const costDiff = cand.taskCostUsd - best.taskCostUsd;
  if (Math.abs(costDiff) > COST_EPS) return costDiff < 0;
  const polDiff = (POLICY_RANK[cand.dataPolicy] ?? 2) - (POLICY_RANK[best.dataPolicy] ?? 2);
  if (polDiff !== 0) return polDiff < 0;
  return (cand.throughput30m ?? -1) > (best.throughput30m ?? -1);
}

function buildEndpointCandidate(ep, openRouterModelId, model, costProfile) {
  const taskCostUsd = computeEndpointCost(ep.pricing1m, model, costProfile);
  if (taskCostUsd == null || !Number.isFinite(taskCostUsd)) return null;
  return { ...ep, openRouterModelId, taskCostUsd };
}

export function selectBestEndpoint(model, { costProfile, quantizationMode, filters }) {
  let bestNon4Bit = null;
  let bestAny = null;

  for (const orm of model.openRouterAll || []) {
    for (const ep of orm.endpoints || []) {
      if (!passesEndpointFilters(ep, model, filters)) continue;

      const cand = buildEndpointCandidate(ep, orm.id, model, costProfile);
      if (!cand) continue;

      if (isBetterEndpoint(cand, bestAny)) bestAny = cand;
      if (!isFourBitQuant(ep.quantization) && isBetterEndpoint(cand, bestNon4Bit)) bestNon4Bit = cand;
    }
  }

  return quantizationMode === QUANTIZATION_MODE.PREFER_NON_4BIT ? (bestNon4Bit || bestAny) : bestAny;
}

import { COST_PROFILE } from "../constants.mjs";

export const COST_EPS = 1e-12;

const DIRECT_PROMPT_TOKENS_M = 0.02;
const DIRECT_COMPLETION_TOKENS_M = 0.0015;

function computeDirectCost(pPrompt, pComp, model) {
  const rRatio = Math.max(model.reasoningRatio || 0, 0);
  return DIRECT_PROMPT_TOKENS_M * pPrompt + DIRECT_COMPLETION_TOKENS_M * (1 + rRatio) * pComp;
}

function computeAgentCost(endpointPricing, pPrompt, pComp, model) {
  const t = model.taskTokens;
  if (!t) return null;

  const pCacheRead = typeof endpointPricing.cacheRead === "number" ? endpointPricing.cacheRead : pPrompt;
  const pCacheWrite = typeof endpointPricing.cacheWrite === "number" ? endpointPricing.cacheWrite : pPrompt;

  return (
    t.nonCacheInputM * pPrompt +
    t.cacheReadM * pCacheRead +
    t.cacheWriteM * pCacheWrite +
    t.outputM * pComp
  );
}

export function computeEndpointCost(endpointPricing, model, costProfile) {
  const pPrompt = endpointPricing?.prompt;
  const pComp = endpointPricing?.completion;
  if (typeof pPrompt !== "number" || typeof pComp !== "number" || pPrompt < 0 || pComp < 0) {
    return null;
  }

  return costProfile === COST_PROFILE.DIRECT
    ? computeDirectCost(pPrompt, pComp, model)
    : computeAgentCost(endpointPricing, pPrompt, pComp, model);
}

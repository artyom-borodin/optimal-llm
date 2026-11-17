import {
  COST_PROFILE,
  DATA_POLICY_FILTER,
  QUANTIZATION_MODE,
  SORT_BY
} from "../constants.mjs";

export function normalizeRankOptions(options = {}) {
  const opts = options || {};
  const quantizationMode = opts.quantizationMode ?? QUANTIZATION_MODE.PREFER_NON_4BIT;

  return {
    thresholdSlug: opts.thresholdSlug ?? null,
    includeBelowThreshold: Boolean(opts.includeBelowThreshold),
    sortBy: opts.sortBy ?? SORT_BY.PARETO_VALUE,
    costProfile: opts.costProfile ?? COST_PROFILE.AGENT,
    quantizationMode,
    filters: {
      allowFlex: Boolean(opts.includeFlex ?? true),
      dataPolicy: opts.dataPolicy ?? DATA_POLICY_FILTER.ANY,
      excludeFourBit: quantizationMode === QUANTIZATION_MODE.EXCLUDE_4BIT,
      minContext: Number(opts.minContext) || 0,
      minUptime: Number(opts.minUptime) || 0,
      minSpeed: Number(opts.minSpeed) || 0
    }
  };
}

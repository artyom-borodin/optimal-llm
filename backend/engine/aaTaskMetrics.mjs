// AA Intelligence Index v5.0.1 component weights and task counts
const AA_V5_EVALS = [
  { key: "briefcase", taskCount: 91, weight: 0.15 },
  { key: "automationBench", taskCount: 657, weight: 0.05 },
  { key: "terminalBench40", taskCount: 66, weight: 0.10 },
  { key: "frontierCode20", taskCount: 132, weight: 0.15 },
  { key: "omniscience", taskCount: 3000, weight: 0.15 },
  { key: "gdpPdf", taskCount: 100, weight: 0.05 },
  { key: "hleDiamond", taskCount: 1000, weight: 0.10 },
  { key: "critptAgenticHard", taskCount: 40, weight: 0.10 },
  { key: "terminalBenchScience", taskCount: 70, weight: 0.15 }
];

export function computeTaskMetrics(evalModel) {
  const counts = evalModel?.canonicalEvalTokenCounts;
  if (!counts) return { taskTokens: null, reasoningRatio: 0 };

  let nonCacheInputM = 0;
  let cacheReadM = 0;
  let cacheWriteM = 0;
  let reasoningM = 0;
  let answerM = 0;
  let weightSum = 0;

  const hitRate = evalModel.cacheHitRate;
  const hasHitRate = typeof hitRate === "number" && Number.isFinite(hitRate);

  for (const { key, taskCount, weight } of AA_V5_EVALS) {
    const c = counts[key];
    if (!c) continue;
    const factor = weight / (taskCount * 1e6);
    weightSum += weight;

    const input = Number(c.input) || 0;
    if (c.cacheableInput == null || !hasHitRate) {
      nonCacheInputM += input * factor;
    } else {
      const cr = (Number(c.cacheableInput) || 0) * hitRate;
      cacheReadM += cr * factor;
      cacheWriteM += (input - cr) * factor;
    }
    reasoningM += (Number(c.reasoning) || 0) * factor;
    answerM += (Number(c.answer) || 0) * factor;
  }

  if (weightSum <= 0) return { taskTokens: null, reasoningRatio: 0 };
  const norm = 1 / weightSum;
  nonCacheInputM *= norm;
  cacheReadM *= norm;
  cacheWriteM *= norm;
  reasoningM *= norm;
  answerM *= norm;

  return {
    taskTokens: {
      nonCacheInputM,
      cacheReadM,
      cacheWriteM,
      outputM: reasoningM + answerM
    },
    reasoningRatio: answerM > 0 ? reasoningM / answerM : 0
  };
}

export function enrichModelsWithTaskMetrics(aaModels) {
  return (aaModels || []).map(({ canonicalEvalTokenCounts, cacheHitRate, ...model }) => ({
    ...model,
    ...computeTaskMetrics({ canonicalEvalTokenCounts, cacheHitRate })
  }));
}

import { getDataPolicyMeta } from "./dataPolicyMetadata.js";
import { fmt1m, fmtContext, fmtIndex, fmtSpeed, fmtUptime, fmtUsd } from "./formatters.js";
import { formatParetoLayer, splitModelName } from "./modelFormatters.js";
import { getTierMeta } from "./serviceTierMetadata.js";
import { getSpeedMeta } from "./speedMetadata.js";
import { formatThresholdComparison } from "./thresholdComparison.js";

const TIER_BADGE_CLASSES = {
  flex: "b-flex",
  priority: "b-priority",
  ultrafast: "b-ultrafast",
  standard: "b-std"
};

export function mapModelToTableRow(model) {
  const ep = model.selectedEndpoint;
  const { baseName, thinking } = splitModelName(model);
  const tier = getTierMeta(ep);

  return {
    model,
    ep,
    baseName,
    thinking,
    paretoLabel: formatParetoLayer(model),
    contextLabel: fmtContext(model.contextWindowTokens),
    indexLabel: fmtIndex(model.aaIntelligenceIndex),
    costLabel: fmtUsd(model.taskCostUsd),
    dp: getDataPolicyMeta(ep),
    tierKey: tier.key,
    tierLabel: tier.label,
    tierBadgeClass: TIER_BADGE_CLASSES[tier.key] || "b-std",
    cmp: formatThresholdComparison(model),
    quantLabel: ep.quantization && ep.quantization !== "unknown" ? ep.quantization : null,
    uptimeLabel: fmtUptime(ep.uptime1d),
    promptPriceLabel: fmt1m(ep.pricing1m.prompt),
    completionPriceLabel: fmt1m(ep.pricing1m.completion),
    cacheReadPriceLabel: fmt1m(ep.pricing1m.cacheRead),
    hasCacheReadPrice: ep.pricing1m.cacheRead != null,
    speedLabel: fmtSpeed(model.outputSpeed),
    speedTooltip: getSpeedMeta(model)
  };
}

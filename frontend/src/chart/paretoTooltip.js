import { getDataPolicyMeta } from "../utils/dataPolicyMetadata.js";
import { fmtIndex, fmtUsd } from "../utils/formatters.js";
import { formatParetoLayer, splitModelName } from "../utils/modelFormatters.js";
import { getTierMeta } from "../utils/serviceTierMetadata.js";

export function buildTooltipConfig({ theme, getTaskTitle }) {
  return {
    backgroundColor: theme.popoverBg,
    borderColor: theme.border,
    borderWidth: 1,
    displayColors: false,
    filter: (item) => item.dataset.seriesKey !== "frontier",
    callbacks: {
      title: (items) => splitModelName(items[0].raw.model).baseName,
      label: (ctx) => {
        const m = ctx.raw.model;
        const ep = m.selectedEndpoint;
        const { thinking } = splitModelName(m);
        const dp = getDataPolicyMeta(ep);
        const tier = getTierMeta(ep);
        return [
          `Reasoning Effort: ${thinking}`,
          `AAI Index: ${fmtIndex(m.aaIntelligenceIndex)}`,
          `${getTaskTitle()}: ${m.taskCostUsd === 0 ? "$0 (free)" : fmtUsd(m.taskCostUsd)}`,
          `Pareto Layer: ${formatParetoLayer(m)}`,
          `Provider: ${ep.providerName}`,
          `Service Tier: ${tier.label}`,
          `Prompt and Response Retention & Usage: ${dp.label}`
        ];
      }
    }
  };
}

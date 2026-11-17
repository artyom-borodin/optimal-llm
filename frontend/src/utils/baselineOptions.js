import { fmtIndex } from "./formatters.js";
import { formatModelLabel, getEffortSlug, splitModelName } from "./modelFormatters.js";

const NO_BASELINE_OPTION = {
  key: "__none__",
  value: "",
  label: "No baseline",
  selectedLabel: "No baseline",
  thinking: "",
  score: "",
  searchText: "no baseline"
};

function getEffortSearchToken(model) {
  const effortSlug = getEffortSlug(model);
  if (effortSlug) return effortSlug;
  return model.isReasoning === false ? "reasoning disabled" : "";
}

function buildBaselineSearchText(model) {
  return [model.releaseName, getEffortSearchToken(model), model.name, model.slug]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function buildBaselineOptions(modelsList) {
  return [
    NO_BASELINE_OPTION,
    ...modelsList.map((m) => {
      const { baseName, thinking } = splitModelName(m);
      return {
        key: m.slug,
        value: m.slug,
        label: baseName,
        selectedLabel: formatModelLabel(m),
        thinking,
        score: fmtIndex(m.intelligenceIndex),
        searchText: buildBaselineSearchText(m)
      };
    })
  ];
}

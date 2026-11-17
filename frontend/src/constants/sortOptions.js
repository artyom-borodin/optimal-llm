import { TASK_PROFILES } from "./taskProfiles.js";

export function getSortOptions(costProfile) {
  const { lower } = TASK_PROFILES[costProfile];
  return [
    { value: "pareto_value", label: `By Pareto layer and ratio of AAI Index to ${lower}` },
    { value: "score", label: "By descending AAI Index" },
    { value: "cost", label: `By ascending ${lower}` },
    { value: "value_ratio", label: `By descending ratio of AAI Index to ${lower}` }
  ];
}

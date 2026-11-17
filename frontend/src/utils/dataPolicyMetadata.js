const DATA_POLICY_META = {
  no_retention: {
    label: "Does not retain or use",
    title: "The provider does not retain prompts or responses after processing and does not use them for training"
  },
  safety_retention: {
    label: "Retains for safety, does not use",
    title: "The provider or OpenRouter may temporarily retain prompts and responses solely to detect and prevent abuse, and does not use them for training"
  },
  retention_and_training: {
    label: "May retain and use",
    title: "The provider may retain prompts and responses and use them for training under its policy"
  }
};

export function getDataPolicyMeta(ep) {
  return DATA_POLICY_META[ep.dataPolicy] || { label: ep.dataPolicy || "-", title: "" };
}

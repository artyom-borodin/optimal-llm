export const DATA_POLICY = {
  NO_RETENTION: "no_retention",
  SAFETY_RETENTION: "safety_retention",
  RETENTION_AND_TRAINING: "retention_and_training"
};

export const DATA_POLICY_FILTER = {
  ANY: "any",
  NO_RETENTION: DATA_POLICY.NO_RETENTION,
  NO_TRAINING: "no_training"
};

export const QUANTIZATION_MODE = {
  PREFER_NON_4BIT: "prefer_non_4bit",
  EXCLUDE_4BIT: "exclude_4bit"
};

export const COST_PROFILE = {
  AGENT: "agent",
  DIRECT: "direct"
};

export const SORT_BY = {
  PARETO_VALUE: "pareto_value",
  SCORE: "score",
  COST: "cost",
  VALUE_RATIO: "value_ratio"
};

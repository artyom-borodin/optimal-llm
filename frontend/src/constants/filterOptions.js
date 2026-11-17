export const DATA_POLICY_OPTIONS = [
  { value: "any", label: "Any policy" },
  { value: "no_training", label: "No training (ZDR)" },
  { value: "no_retention", label: "Does not retain or use" }
];

export const QUANTIZATION_OPTIONS = [
  { value: "prefer_non_4bit", label: "Exclude if non-4-bit exists" },
  { value: "allow_all", label: "Allow 4-bit (cheapest)" },
  { value: "exclude_4bit", label: "Exclude all 4-bit" }
];

export const MIN_CONTEXT_OPTIONS = [
  { value: 0, label: "Any" },
  { value: 128000, label: "128k+ tokens" },
  { value: 256000, label: "256k+ tokens" },
  { value: 1000000, label: "1M+ tokens" }
];

export const MIN_UPTIME_OPTIONS = [
  { value: 0, label: "Any" },
  { value: 95, label: ">= 95%" },
  { value: 99, label: ">= 99%" }
];

export const MIN_SPEED_OPTIONS = [
  { value: 0, label: "Any" },
  { value: 50, label: ">= 50 tok/s" },
  { value: 100, label: ">= 100 tok/s" },
  { value: 200, label: ">= 200 tok/s" }
];

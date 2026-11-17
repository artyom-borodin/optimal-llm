export const TASK_PROFILES = {
  agent: {
    value: "agent",
    shortLabel: "Complex Task",
    title: "Complex Task Execution Cost",
    lower: "complex task execution cost",
    description:
      "Calculated from the benchmark-weighted average token usage per task in the AAI Index suite (uncached input, cache write and read using Artificial Analysis cache hit rates, plus reasoning and answer output) priced by the OpenRouter provider."
  },
  direct: {
    value: "direct",
    shortLabel: "Simple Task",
    title: "Simple Task Execution Cost",
    lower: "simple task execution cost",
    description:
      "Single request with 20 thousand uncached input tokens and 1.5 thousand answer tokens plus proportional reasoning tokens using the reasoning-to-answer token ratio from Artificial Analysis."
  }
};

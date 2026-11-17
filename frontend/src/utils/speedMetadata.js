import { fmtLatency } from "./formatters.js";

export function getSpeedMeta(model) {
  if (model.outputSpeedSource === "openrouter_30m") {
    const latency = fmtLatency(model.latency30m);
    return latency ? `OpenRouter 30m median throughput | latency: ${latency}` : "OpenRouter 30m median throughput";
  }
  if (model.outputSpeedSource === "aa") {
    return "Artificial Analysis benchmark speed";
  }
  return "";
}

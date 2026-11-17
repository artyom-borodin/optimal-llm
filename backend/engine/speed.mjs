export function resolveOutputSpeed(ep, model) {
  return ep.throughput30m ?? model.outputSpeed;
}

export function resolveOutputSpeedSource(ep, model) {
  if (ep.throughput30m != null) return "openrouter_30m";
  return model.outputSpeed != null ? "aa" : null;
}

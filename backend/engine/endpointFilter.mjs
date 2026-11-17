import { DATA_POLICY, DATA_POLICY_FILTER } from "../constants.mjs";
import { resolveOutputSpeed } from "./speed.mjs";
import { isFourBitQuant } from "./quantization.mjs";

export function passesEndpointFilters(ep, model, filters) {
  if (!filters.allowFlex && ep.isFlex) return false;
  if (filters.dataPolicy === DATA_POLICY_FILTER.NO_RETENTION && ep.dataPolicy !== DATA_POLICY.NO_RETENTION) {
    return false;
  }
  if (filters.dataPolicy === DATA_POLICY_FILTER.NO_TRAINING && ep.dataPolicy === DATA_POLICY.RETENTION_AND_TRAINING) {
    return false;
  }
  if (filters.excludeFourBit && isFourBitQuant(ep.quantization)) return false;

  if (filters.minContext > 0 && (ep.contextLength || 0) < filters.minContext) return false;
  if (filters.minUptime > 0 && (ep.uptime1d == null || ep.uptime1d < filters.minUptime)) return false;

  if (filters.minSpeed > 0) {
    const speed = resolveOutputSpeed(ep, model);
    if (speed == null || speed < filters.minSpeed) return false;
  }

  return true;
}

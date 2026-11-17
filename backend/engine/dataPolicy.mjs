import { DATA_POLICY } from "../constants.mjs";

export function resolveDataPolicy(safetyRetention) {
  if (safetyRetention === undefined) return DATA_POLICY.RETENTION_AND_TRAINING;
  return safetyRetention ? DATA_POLICY.SAFETY_RETENTION : DATA_POLICY.NO_RETENTION;
}

export function applyEndpointDataPolicies(hydratedById) {
  const resolved = new Map();
  for (const [id, model] of hydratedById) {
    resolved.set(id, {
      ...model,
      endpoints: model.endpoints.map(({ safetyRetention, ...ep }) => ({
        ...ep,
        dataPolicy: resolveDataPolicy(safetyRetention)
      }))
    });
  }
  return resolved;
}

export function zdrKey(modelId, entry) {
  return `${modelId}::${entry.tag || entry.provider_name}`;
}

export function buildZdrMap(zdrData) {
  return new Map(
    (zdrData?.data || []).map((z) => [
      zdrKey(z.model_id, z),
      Boolean(z.safety_retention)
    ])
  );
}

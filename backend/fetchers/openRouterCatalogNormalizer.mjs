function isEligibleCatalogModel(model) {
  return !model.id.startsWith("~") && !model.id.endsWith(":batch");
}

export function normalizeCatalogModels(catalog) {
  const models = [];
  for (const m of catalog?.data || []) {
    if (!isEligibleCatalogModel(m)) continue;
    models.push({
      id: m.id,
      huggingFaceId: m.hugging_face_id ? String(m.hugging_face_id).toLowerCase() : null,
      contextLength: m.context_length || null
    });
  }
  return models;
}

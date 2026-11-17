function extractHuggingFaceId(url) {
  if (typeof url !== "string" || !url) return null;
  try {
    const u = new URL(url);
    if (u.hostname !== "huggingface.co" && !u.hostname.endsWith(".huggingface.co")) return null;
    const parts = u.pathname.split("/").filter(Boolean);
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}`.toLowerCase() : null;
  } catch {
    return null;
  }
}

function buildHuggingFaceIndex(modelsData) {
  const hfById = new Map();
  for (const m of modelsData?.models || []) {
    const hf = extractHuggingFaceId(m.modelWeightsSourceUrl);
    if (hf) hfById.set(m.id, hf);
  }
  return hfById;
}

export function normalizeAaModels(evalData, modelsData) {
  const hfById = buildHuggingFaceIndex(modelsData);

  return (evalData?.models || [])
    .filter((m) => m.intelligenceIndex != null)
    .map((m) => ({
      slug: m.slug,
      releaseSlug: m.release?.slug || m.slug,
      releaseName: m.release?.name || m.name,
      name: m.name,
      creatorName: m.creator?.name || null,
      huggingFaceId: hfById.get(m.id) || null,
      isReasoning: Boolean(m.isReasoning),
      effort: m.effort?.slug || null,
      outputSpeed: m.outputSpeed ?? null,
      intelligenceIndex: m.intelligenceIndex,
      canonicalEvalTokenCounts: m.canonicalEvalTokenCounts ?? null,
      cacheHitRate: m.cacheHitRate ?? null
    }));
}

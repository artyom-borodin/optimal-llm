export function listAvailableModels(models) {
  return (models || [])
    .filter((m) => m.openRouterAll.length > 0)
    .sort((a, b) => b.intelligenceIndex - a.intelligenceIndex);
}

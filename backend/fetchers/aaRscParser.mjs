export function extractModelManifestRef(rscText) {
  let found = null;

  const walk = (node) => {
    if (found || !node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      for (const item of node) walk(item);
      return;
    }
    const m = node.manifest;
    if (
      Array.isArray(node.initialModels) &&
      m &&
      typeof m.path === "string" &&
      m.path.startsWith("/data/") &&
      typeof m.key === "string" &&
      m.key.length > 0
    ) {
      found = { path: m.path, key: m.key };
      return;
    }
    for (const val of Object.values(node)) walk(val);
  };

  for (const line of rscText.split("\n")) {
    const colon = line.indexOf(":");
    if (colon <= 0) continue;
    const payload = line.slice(colon + 1);
    if (payload[0] !== "{" && payload[0] !== "[") continue;
    try {
      walk(JSON.parse(payload));
      if (found) break;
    } catch {
      // Non-JSON RSC chunk
    }
  }

  return found;
}

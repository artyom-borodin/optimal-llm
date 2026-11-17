const alnum = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

// Preserves dotted versions (4.5 != 5.4) while normalizing word order (claude-4.5-haiku <-> claude-haiku-4.5)
const wordKey = (s) =>
  String(s || "").toLowerCase().split(/[\s/()_-]+/).filter(Boolean).sort().join(" ");

function addToIndex(map, key, model) {
  if (!key) return;
  let list = map.get(key);
  if (!list) {
    list = [];
    map.set(key, list);
  }
  list.push(model);
}

function buildOpenRouterIndex(orModels) {
  const byHf = new Map();
  const byAlnum = new Map();
  const byWords = new Map();

  for (const m of orModels || []) {
    if (m.huggingFaceId) addToIndex(byHf, m.huggingFaceId, m);

    const idNoTag = m.id.split(":")[0];
    const slashIdx = idNoTag.indexOf("/");
    const slug = slashIdx >= 0 ? idNoTag.slice(slashIdx + 1) : idNoTag;

    addToIndex(byAlnum, alnum(slug), m);
    addToIndex(byWords, wordKey(slug), m);
  }

  return { byHf, byAlnum, byWords };
}

function findOpenRouterMatches(aaModel, orIndex) {
  let hits = (aaModel.huggingFaceId && orIndex.byHf.get(aaModel.huggingFaceId)) || [];

  if (!hits.length) {
    for (const cand of [aaModel.releaseSlug, aaModel.releaseName]) {
      hits = orIndex.byAlnum.get(alnum(cand)) || [];
      if (hits.length) break;
    }
  }

  if (!hits.length) {
    hits = orIndex.byWords.get(wordKey(aaModel.releaseName)) || [];
  }

  return hits;
}

export function matchAaWithOpenRouter({ aaModels, openRouterModels }) {
  const orIndex = buildOpenRouterIndex(openRouterModels || []);
  return (aaModels || []).map((aaModel) => ({
    ...aaModel,
    openRouterAll: findOpenRouterMatches(aaModel, orIndex)
  }));
}

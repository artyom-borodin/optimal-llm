import { fetchModelManifest } from "./aaManifest.mjs";
import { normalizeAaModels } from "./aaNormalizer.mjs";

const EVAL_URL = "https://artificialanalysis.ai/evaluations/artificial-analysis-intelligence-index";
const MODELS_URL = "https://artificialanalysis.ai/models";

export async function fetchArtificialAnalysis() {
  const [evalData, modelsData] = await Promise.all([
    fetchModelManifest(EVAL_URL),
    fetchModelManifest(MODELS_URL)
  ]);

  return normalizeAaModels(evalData, modelsData);
}

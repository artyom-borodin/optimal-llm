import { computed, ref, shallowRef, watch } from "vue";
import { fetchRanking } from "../api/rankingApi.js";

export function useRankingData(rankingParams) {
  const result = shallowRef(null);
  const rankingError = ref("");

  watch(
    rankingParams,
    (params, _prev, onCleanup) => {
      const controller = new AbortController();
      onCleanup(() => controller.abort());

      fetchRanking(params, controller.signal)
        .then((data) => {
          result.value = data;
          rankingError.value = "";
        })
        .catch((err) => {
          if (err.name === "AbortError") return;
          console.error("Failed to load ranking:", err);
          rankingError.value = "Failed to load ranking data. Please try again later.";
        });
    },
    { immediate: true }
  );

  const thresholdModel = computed(() => result.value?.thresholdModel || null);
  const models = computed(() => result.value?.models || []);

  return {
    thresholdModel,
    models,
    rankingError
  };
}

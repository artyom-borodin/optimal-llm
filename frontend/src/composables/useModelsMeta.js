import { onMounted, ref, shallowRef } from "vue";
import { fetchMeta } from "../api/rankingApi.js";

export function useModelsMeta() {
  const modelsList = shallowRef([]);
  const metaError = ref("");

  onMounted(() => {
    fetchMeta()
      .then((data) => {
        modelsList.value = data.modelsList || [];
        metaError.value = "";
      })
      .catch((err) => {
        console.error("Failed to load metadata:", err);
        metaError.value = "Failed to load models metadata. Please try again later.";
      });
  });

  return {
    modelsList,
    metaError
  };
}

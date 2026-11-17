import { computed, ref } from "vue";
import { filterModelsByQuery } from "../utils/modelSearch.js";

export function useModelSearch(models) {
  const searchQuery = ref("");
  const hasSearchQuery = computed(() => searchQuery.value !== "");
  const filteredModels = computed(() => filterModelsByQuery(models.value, searchQuery.value));

  function resetSearch() {
    searchQuery.value = "";
  }

  return {
    searchQuery,
    hasSearchQuery,
    filteredModels,
    resetSearch
  };
}

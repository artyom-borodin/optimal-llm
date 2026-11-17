<script setup>
import { computed } from "vue";
import ControlsPanel from "./components/ControlsPanel.vue";
import ModelsTable from "./components/ModelsTable.vue";
import ParetoChart from "./components/ParetoChart.vue";
import { useModelSearch } from "./composables/useModelSearch.js";
import { useModelsMeta } from "./composables/useModelsMeta.js";
import { useRankingControls } from "./composables/useRankingControls.js";
import { useRankingData } from "./composables/useRankingData.js";

const {
  controls,
  filters,
  hasActiveFilters,
  resetFilters,
  updateControl,
  updateFilter,
  rankingParams
} = useRankingControls();

const { modelsList, metaError } = useModelsMeta();
const { thresholdModel, models, rankingError } = useRankingData(rankingParams);
const { searchQuery, hasSearchQuery, filteredModels, resetSearch } = useModelSearch(models);

const hasAnyActiveFilter = computed(() => hasActiveFilters.value || hasSearchQuery.value);
const errorMessages = computed(() => [metaError.value, rankingError.value].filter(Boolean));

function resetAllFilters() {
  resetFilters();
  resetSearch();
}
</script>

<template>
  <div class="container">
    <ControlsPanel
      :models-list="modelsList"
      :controls="controls"
      :filters="filters"
      :search-query="searchQuery"
      :has-active-filters="hasAnyActiveFilter"
      @update:control="updateControl"
      @update:filter="updateFilter"
      @update:search-query="searchQuery = $event"
      @reset-filters="resetAllFilters"
    />

    <div v-for="err in errorMessages" :key="err" role="alert" class="alert-error">
      {{ err }}
    </div>

    <ParetoChart
      :models="filteredModels"
      :threshold-model="thresholdModel"
      :cost-profile="controls.costProfile"
    />

    <ModelsTable
      :models="filteredModels"
      :threshold-model="thresholdModel"
      :cost-profile="controls.costProfile"
    />
  </div>
</template>

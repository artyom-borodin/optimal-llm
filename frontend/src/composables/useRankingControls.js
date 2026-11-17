import { computed, reactive } from "vue";

const DEFAULT_FILTERS = {
  includeFlex: true,
  dataPolicy: "any",
  quantizationMode: "prefer_non_4bit",
  minContext: 0,
  minUptime: 0,
  minSpeed: 0
};

export function useRankingControls() {
  const controls = reactive({
    thresholdSlug: "",
    costProfile: "agent",
    sortBy: "pareto_value",
    includeBelowThreshold: false
  });

  const filters = reactive({ ...DEFAULT_FILTERS });

  const hasActiveFilters = computed(() =>
    Object.keys(DEFAULT_FILTERS).some((k) => filters[k] !== DEFAULT_FILTERS[k])
  );

  function resetFilters() {
    Object.assign(filters, DEFAULT_FILTERS);
  }

  function updateControl(key, value) {
    controls[key] = value;
  }

  function updateFilter(key, value) {
    filters[key] = value;
  }

  const rankingParams = computed(() => ({
    ...controls,
    thresholdSlug: controls.thresholdSlug || null,
    ...filters
  }));

  return {
    controls,
    filters,
    hasActiveFilters,
    resetFilters,
    updateControl,
    updateFilter,
    rankingParams
  };
}

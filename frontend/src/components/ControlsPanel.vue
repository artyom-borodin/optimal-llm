<script setup>
import { computed } from "vue";
import { getSortOptions } from "../constants/sortOptions.js";
import { TASK_PROFILES } from "../constants/taskProfiles.js";
import BaselineCombobox from "./BaselineCombobox.vue";
import EndpointFilters from "./EndpointFilters.vue";

const props = defineProps({
  modelsList: { type: Array, required: true },
  controls: { type: Object, required: true },
  filters: { type: Object, required: true },
  searchQuery: { type: String, required: true },
  hasActiveFilters: { type: Boolean, required: true }
});

const emit = defineEmits([
  "update:control",
  "update:filter",
  "update:searchQuery",
  "resetFilters"
]);

const taskProfileOptions = Object.values(TASK_PROFILES);
const sortOptions = computed(() => getSortOptions(props.controls.costProfile));
</script>

<template>
  <section class="panel panel-spaced controls-panel">
    <div class="controls-grid">
      <BaselineCombobox
        :model-value="controls.thresholdSlug"
        :models-list="modelsList"
        @update:model-value="emit('update:control', 'thresholdSlug', $event)"
      />

      <label class="field">
        <span>Task Profile</span>
        <select
          :value="controls.costProfile"
          :title="TASK_PROFILES[controls.costProfile].description"
          @change="emit('update:control', 'costProfile', $event.target.value)"
        >
          <option
            v-for="opt in taskProfileOptions"
            :key="opt.value"
            :value="opt.value"
            :title="opt.description"
          >
            {{ opt.shortLabel }}
          </option>
        </select>
      </label>

      <label class="field">
        <span>Sort Order</span>
        <select
          :value="controls.sortBy"
          @change="emit('update:control', 'sortBy', $event.target.value)"
        >
          <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </label>

      <label class="field">
        <span>Search</span>
        <input
          :value="searchQuery"
          type="search"
          placeholder="LLM, creator, provider..."
          @input="emit('update:searchQuery', $event.target.value)"
          @keydown.esc="emit('update:searchQuery', '')"
        />
      </label>
    </div>

    <EndpointFilters
      :filters="filters"
      @update:filter="(key, value) => emit('update:filter', key, value)"
    >
      <template #checks-start>
        <label :class="['check-item', { disabled: !controls.thresholdSlug }]">
          <input
            :checked="controls.includeBelowThreshold"
            type="checkbox"
            :disabled="!controls.thresholdSlug"
            @change="emit('update:control', 'includeBelowThreshold', $event.target.checked)"
          />
          <span>Show LLMs with AAI Index below baseline</span>
        </label>
      </template>

      <template #checks-end>
        <button
          v-if="hasActiveFilters"
          type="button"
          class="btn-secondary filters-reset"
          @click="emit('resetFilters')"
        >
          Reset filters
        </button>
      </template>
    </EndpointFilters>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { buildBaselineOptions } from "../utils/baselineOptions.js";
import BaseCombobox from "./BaseCombobox.vue";

const props = defineProps({
  modelsList: { type: Array, required: true }
});

const modelValue = defineModel({ type: String, required: true });

const options = computed(() => buildBaselineOptions(props.modelsList));
</script>

<template>
  <BaseCombobox
    v-model="modelValue"
    class="baseline-combo"
    label="Baseline"
    :options="options"
    fallback-label="No baseline"
    placeholder="Select baseline..."
    clear-title="Clear baseline"
    open-aria-label="Open list"
  >
    <template #header>
      <div class="combo-head">
        <span>LLM</span>
        <span>Reasoning Effort</span>
        <span>AAI Index</span>
      </div>
    </template>
    <template #option="{ option }">
      <span class="combo-name">{{ option.label }}</span>
      <span class="combo-col">{{ option.thinking }}</span>
      <span class="combo-col">{{ option.score }}</span>
    </template>
  </BaseCombobox>
</template>

<style scoped>
.combo-head,
.baseline-combo :deep(.combo-item) {
  display: grid;
  grid-template-columns: minmax(0, 1fr) clamp(4.5rem, 15vw, 6.25rem) clamp(3.25rem, 10vw, 4.25rem);
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) var(--space-sm);
}

.combo-head {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--panel);
  border-bottom: 1px solid var(--border);
  margin-bottom: var(--space-2xs);
  padding-top: var(--space-xs);
  padding-bottom: var(--space-xs);
  font-size: var(--text-2xs);
  line-height: 1.2;
  font-weight: 600;
  color: var(--muted);
}

.combo-head > span:not(:first-child) {
  text-align: right;
}

.combo-col {
  font-size: var(--text-xs);
  color: var(--muted);
  text-align: right;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
</style>

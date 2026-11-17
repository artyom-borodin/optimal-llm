<script setup>
import {
  DATA_POLICY_OPTIONS,
  MIN_CONTEXT_OPTIONS,
  MIN_SPEED_OPTIONS,
  MIN_UPTIME_OPTIONS,
  QUANTIZATION_OPTIONS
} from "../constants/filterOptions.js";

defineProps({
  filters: { type: Object, required: true }
});

const emit = defineEmits(["update:filter"]);
</script>

<template>
  <div class="controls-filters">
    <label class="field">
      <span>Prompt & Response Retention</span>
      <select
        :value="filters.dataPolicy"
        @change="emit('update:filter', 'dataPolicy', $event.target.value)"
      >
        <option v-for="opt in DATA_POLICY_OPTIONS" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </label>

    <label class="field">
      <span>4-bit Quantization</span>
      <select
        :value="filters.quantizationMode"
        @change="emit('update:filter', 'quantizationMode', $event.target.value)"
      >
        <option v-for="opt in QUANTIZATION_OPTIONS" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </label>

    <label class="field">
      <span>Min Context Window</span>
      <select
        :value="filters.minContext"
        @change="emit('update:filter', 'minContext', Number($event.target.value))"
      >
        <option v-for="opt in MIN_CONTEXT_OPTIONS" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </label>

    <label class="field">
      <span>Min Availability (24h)</span>
      <select
        :value="filters.minUptime"
        @change="emit('update:filter', 'minUptime', Number($event.target.value))"
      >
        <option v-for="opt in MIN_UPTIME_OPTIONS" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </label>

    <label class="field">
      <span>Min Output Speed</span>
      <select
        :value="filters.minSpeed"
        @change="emit('update:filter', 'minSpeed', Number($event.target.value))"
      >
        <option v-for="opt in MIN_SPEED_OPTIONS" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </label>
  </div>

  <div class="checks-row">
    <slot name="checks-start" />

    <label class="check-item">
      <input
        :checked="filters.includeFlex"
        type="checkbox"
        @change="emit('update:filter', 'includeFlex', $event.target.checked)"
      />
      <span>Include Flex tier</span>
    </label>

    <slot name="checks-end" />
  </div>
</template>

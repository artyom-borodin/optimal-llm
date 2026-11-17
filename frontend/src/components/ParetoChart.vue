<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { createParetoChart } from "../chart/paretoChartController.js";

const props = defineProps({
  models: { type: Array, required: true },
  thresholdModel: { type: Object, default: null },
  costProfile: { type: String, required: true }
});

const canvasRef = ref(null);
const isZoomed = ref(false);
// Keep Chart.js instance unproxied outside Vue reactivity
let chartController = null;

function resetZoom() {
  chartController?.resetZoom();
  isZoomed.value = false;
}

onMounted(() => {
  if (!canvasRef.value) return;
  chartController = createParetoChart(canvasRef.value, {
    models: props.models,
    thresholdModel: props.thresholdModel,
    costProfile: props.costProfile,
    onZoomChange: (zoomed) => {
      isZoomed.value = zoomed;
    }
  });
});

watch(
  () => [props.models, props.thresholdModel, props.costProfile],
  ([models, thresholdModel, costProfile], [_prevModels, _prevThr, prevProfile]) => {
    if (!chartController) return;
    const profileChanged = costProfile !== prevProfile;
    chartController.update({
      models,
      thresholdModel,
      costProfile,
      resetZoom: profileChanged
    });
    if (profileChanged) isZoomed.value = false;
  }
);

onBeforeUnmount(() => {
  chartController?.destroy();
  chartController = null;
});
</script>

<template>
  <section class="panel panel-spaced chart-panel">
    <button
      v-if="isZoomed"
      type="button"
      class="btn-secondary chart-reset"
      title="Double-clicking the chart also resets the scale"
      @click="resetZoom"
    >
      Reset Scale
    </button>
    <div class="chart-wrap">
      <canvas ref="canvasRef" @dblclick="resetZoom" />
    </div>
  </section>
</template>

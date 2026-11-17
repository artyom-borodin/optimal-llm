<script setup>
import { computed } from "vue";
import { TASK_PROFILES } from "../constants/taskProfiles.js";
import { mapModelToTableRow } from "../utils/tableRows.js";

const props = defineProps({
  models: { type: Array, required: true },
  thresholdModel: { type: Object, default: null },
  costProfile: { type: String, required: true }
});

const taskProfile = computed(() => TASK_PROFILES[props.costProfile]);
const hasThreshold = computed(() => Boolean(props.thresholdModel));
const rows = computed(() => props.models.map(mapModelToTableRow));
</script>

<template>
  <section class="panel table-wrap">
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Pareto Layer</th>
          <th>LLM</th>
          <th>Reasoning Effort</th>
          <th>Context Window<br />(tokens)</th>
          <th>AAI Index</th>
          <th v-if="hasThreshold">Difference from Baseline in<br />AAI Index</th>
          <th>{{ taskProfile.shortLabel }}<br />Execution Cost</th>
          <th v-if="hasThreshold">Difference from Baseline in<br />{{ taskProfile.shortLabel }} Execution Cost</th>
          <th>Provider</th>
          <th>Service Tier</th>
          <th>Quantization</th>
          <th>Prompt and Response<br />Retention & Usage</th>
          <th>Availability<br />(24h)</th>
          <th>Input / Output Price<br />($ / 1M tokens)</th>
          <th>Cache Read Price<br />($ / 1M tokens)</th>
          <th>Output Speed<br />(tok/s)</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="rows.length">
          <tr
            v-for="(row, idx) in rows"
            :key="row.model.slug"
            :class="{ 'is-threshold': row.cmp?.isThreshold }"
          >
            <td class="sub">{{ idx + 1 }}</td>
            <td class="nowrap">
              <span v-if="row.model.isPareto" class="badge b-pareto">1</span>
              <span
                v-else
                class="sub"
                :title="`Pareto Layer ${row.model.paretoLayer}: outperformed by ${row.model.dominatedByCount} configurations in both AAI Index and ${taskProfile.lower}`"
              >
                {{ row.paretoLabel }}
              </span>
            </td>
            <td class="nowrap">
              <div><strong>{{ row.baseName }}</strong></div>
              <div class="sub">{{ row.ep.openRouterModelId }}</div>
            </td>
            <td :class="['nowrap', { sub: row.thinking === 'Not specified' || row.thinking === 'Disabled' }]">
              {{ row.thinking }}
            </td>
            <td class="nowrap">{{ row.contextLabel }}</td>
            <td class="nowrap"><strong>{{ row.indexLabel }}</strong></td>
            <td v-if="hasThreshold" class="nowrap">
              <template v-if="row.cmp">
                <span v-if="row.cmp.isThreshold" class="badge b-baseline">Baseline</span>
                <span v-else :class="row.cmp.indexBetter ? 'b-better' : 'b-worse'">{{ row.cmp.indexText }}</span>
              </template>
            </td>
            <td class="nowrap"><strong>{{ row.costLabel }}</strong></td>
            <td v-if="hasThreshold" class="nowrap">
              <template v-if="row.cmp">
                <span v-if="row.cmp.isThreshold" class="badge b-baseline">Baseline</span>
                <span v-else :class="row.cmp.costBetter ? 'b-better' : 'sub'">{{ row.cmp.costText }}</span>
              </template>
            </td>
            <td class="nowrap"><strong>{{ row.ep.providerName }}</strong></td>
            <td class="nowrap">
              <span :class="['badge', row.tierBadgeClass]">{{ row.tierLabel }}</span>
            </td>
            <td :class="['nowrap', row.ep.isFourBit ? 'b-worse' : !row.quantLabel ? 'sub' : '']">
              {{ row.quantLabel || "-" }}
            </td>
            <td class="nowrap" :title="row.dp.title">{{ row.dp.label }}</td>
            <td class="nowrap sub">{{ row.uptimeLabel }}</td>
            <td class="nowrap">
              {{ row.promptPriceLabel }} / {{ row.completionPriceLabel }}
            </td>
            <td :class="['nowrap', { sub: !row.hasCacheReadPrice }]">
              {{ row.cacheReadPriceLabel }}
            </td>
            <td class="nowrap" :title="row.speedTooltip">
              {{ row.speedLabel }}
            </td>
          </tr>
        </template>
        <tr v-else>
          <td class="sub" :colspan="hasThreshold ? 17 : 15">
            No LLMs match the selected filters
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

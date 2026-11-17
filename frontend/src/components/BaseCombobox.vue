<script setup>
import { computed, ref, useId } from "vue";
import { useComboboxNavigation } from "../composables/useComboboxNavigation.js";
import { useDismissible } from "../composables/useDismissible.js";
import { filterComboboxOptions, getComboboxOptionKey } from "../utils/comboboxOptions.js";

const props = defineProps({
  label: { type: String, required: true },
  options: { type: Array, required: true },
  placeholder: { type: String, default: "Select..." },
  fallbackLabel: { type: String, default: "" },
  clearTitle: { type: String, default: "Clear selection" },
  clearValue: { type: String, default: "" },
  openAriaLabel: { type: String, default: "Open list" },
  emptyText: { type: String, default: "No matches found" }
});

const modelValue = defineModel({ type: String, required: true });

const open = ref(false);
const query = ref("");
const wrapRef = ref(null);
const inputRef = ref(null);
const listboxId = useId();

const selectedOption = computed(
  () => props.options.find((opt) => opt.value === modelValue.value) || null
);

const selectedLabel = computed(
  () => selectedOption.value?.selectedLabel || selectedOption.value?.label || props.fallbackLabel
);

const filteredOptions = computed(() => filterComboboxOptions(props.options, query.value));

const { activeIdx, setOptionRef, resetActiveIndex, onKeyDown } = useComboboxNavigation({
  open,
  options: filteredOptions,
  query,
  onOpen: openMenu,
  onSelect: selectValue,
  onBlurInput: () => inputRef.value?.blur()
});

const optionId = (idx) => `${listboxId}-opt-${idx}`;
const activeOptionId = computed(() =>
  open.value && filteredOptions.value[activeIdx.value] ? optionId(activeIdx.value) : undefined
);

function openMenu() {
  if (open.value) return;
  query.value = "";
  resetActiveIndex();
  open.value = true;
}

function closeMenu() {
  if (!open.value) return;
  open.value = false;
  query.value = "";
}

function toggleMenu() {
  if (open.value) {
    closeMenu();
  } else {
    openMenu();
    inputRef.value?.focus();
  }
}

function selectValue(value) {
  modelValue.value = value;
  closeMenu();
}

function onInput(e) {
  query.value = e.target.value;
  openMenu();
}

function handleDismiss(reason) {
  closeMenu();
  if (reason === "escape") inputRef.value?.blur();
}

useDismissible(open, wrapRef, handleDismiss);
</script>

<template>
  <div ref="wrapRef" class="field">
    <span>{{ label }}</span>
    <div class="dropdown combo">
      <input
        ref="inputRef"
        type="text"
        role="combobox"
        aria-autocomplete="list"
        :aria-expanded="open"
        :aria-controls="listboxId"
        :aria-activedescendant="activeOptionId"
        :value="open ? query : selectedLabel"
        :placeholder="open ? selectedLabel : placeholder"
        @focus="openMenu"
        @input="onInput"
        @keydown="onKeyDown"
      />
      <div class="combo-actions">
        <button
          v-if="modelValue"
          type="button"
          tabindex="-1"
          class="icon-btn"
          :title="clearTitle"
          @click="selectValue(clearValue)"
        >
          &times;
        </button>
        <button
          type="button"
          tabindex="-1"
          class="icon-btn combo-caret"
          :aria-label="openAriaLabel"
          @click="toggleMenu"
        ></button>
      </div>

      <div v-if="open" :id="listboxId" role="listbox" class="dropdown-menu combo-menu">
        <slot name="header" />
        <template v-if="filteredOptions.length">
          <div
            v-for="(opt, idx) in filteredOptions"
            :id="optionId(idx)"
            :key="getComboboxOptionKey(opt)"
            :ref="(el) => setOptionRef(getComboboxOptionKey(opt), el)"
            role="option"
            :aria-selected="opt.value === modelValue"
            :class="['dropdown-item', 'combo-item', { active: idx === activeIdx, selected: opt.value === modelValue }]"
            @mouseenter="activeIdx = idx"
            @click="selectValue(opt.value)"
          >
            <slot name="option" :option="opt">
              <span class="combo-name">{{ opt.label }}</span>
            </slot>
          </div>
        </template>
        <div v-else class="combo-empty">{{ emptyText }}</div>
      </div>
    </div>
  </div>
</template>

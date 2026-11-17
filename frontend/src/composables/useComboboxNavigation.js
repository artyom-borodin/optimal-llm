import { nextTick, ref, watch } from "vue";
import { getComboboxOptionKey } from "../utils/comboboxOptions.js";

export function useComboboxNavigation({ open, options, query, onOpen, onSelect, onBlurInput }) {
  const activeIdx = ref(0);
  const optionRefs = new Map();

  function setOptionRef(key, el) {
    if (el) optionRefs.set(key, el);
    else optionRefs.delete(key);
  }

  async function scrollActiveIntoView() {
    await nextTick();
    const activeOpt = options.value[activeIdx.value];
    if (activeOpt) {
      optionRefs.get(getComboboxOptionKey(activeOpt))?.scrollIntoView({ block: "nearest" });
    }
  }

  function resetActiveIndex() {
    activeIdx.value = 0;
  }

  function onKeyDown(e) {
    const list = options.value;
    if (!open.value) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        e.preventDefault();
        onOpen();
      }
      return;
    }

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!list.length) return;
      const step = e.key === "ArrowDown" ? 1 : -1;
      activeIdx.value = Math.min(Math.max(activeIdx.value + step, 0), list.length - 1);
      scrollActiveIntoView();
    } else if (e.key === "Home") {
      e.preventDefault();
      activeIdx.value = 0;
      scrollActiveIntoView();
    } else if (e.key === "End") {
      e.preventDefault();
      activeIdx.value = Math.max(0, list.length - 1);
      scrollActiveIntoView();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = list[activeIdx.value];
      if (pick) {
        onSelect(pick.value);
        onBlurInput();
      }
    }
  }

  watch(query, resetActiveIndex);

  return {
    activeIdx,
    setOptionRef,
    resetActiveIndex,
    onKeyDown
  };
}

import { watch } from "vue";

export function useDismissible(isOpen, containerRef, onDismiss) {
  watch(isOpen, (open, _prev, onCleanup) => {
    if (!open) return;

    const onOutside = (e) => {
      if (!containerRef.value?.contains(e.target)) onDismiss("outside");
    };
    const onEscape = (e) => {
      if (e.key === "Escape") onDismiss("escape");
    };

    document.addEventListener("pointerdown", onOutside);
    document.addEventListener("focusin", onOutside);
    document.addEventListener("keydown", onEscape);
    onCleanup(() => {
      document.removeEventListener("pointerdown", onOutside);
      document.removeEventListener("focusin", onOutside);
      document.removeEventListener("keydown", onEscape);
    });
  });
}

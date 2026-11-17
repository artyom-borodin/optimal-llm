export function getEffortSlug(m) {
  return m.effort || null;
}

export function splitModelName(m) {
  const baseName = m.releaseName;
  const effortSlug = getEffortSlug(m);
  let thinking = "Not specified";

  if (effortSlug) {
    thinking = effortSlug;
  } else if (m.isReasoning === false) {
    thinking = "Disabled";
  }

  return { baseName, thinking };
}

export function formatModelLabel(m) {
  const baseName = m.releaseName;
  const effortSlug = getEffortSlug(m);
  if (effortSlug) return `${baseName} (${effortSlug})`;
  if (m.isReasoning === false) return `${baseName} (reasoning disabled)`;
  return baseName;
}

export function formatParetoLayer(m) {
  return m.isPareto ? "1" : `${m.paretoLayer} (dominated by ${m.dominatedByCount})`;
}

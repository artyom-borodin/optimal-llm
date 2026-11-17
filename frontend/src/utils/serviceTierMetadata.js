const TIER_LABELS = {
  flex: "Flex",
  priority: "Priority",
  ultrafast: "Ultrafast",
  standard: "Standard"
};

export function getTierMeta(ep) {
  const raw = ep.serviceTier;
  const key = raw.toLowerCase();
  const label = TIER_LABELS[key] || raw.charAt(0).toUpperCase() + raw.slice(1);
  return { key, label };
}

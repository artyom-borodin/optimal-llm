export function getComboboxOptionKey(opt) {
  return opt.key ?? opt.value;
}

export function filterComboboxOptions(options, query) {
  const q = query.trim().toLowerCase();
  if (!q) return options;
  return options.filter((opt) => (opt.searchText ?? opt.label.toLowerCase()).includes(q));
}

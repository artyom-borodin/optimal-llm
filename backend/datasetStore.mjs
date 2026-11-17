let dataset = [];

export function getDataset() {
  return dataset;
}

export function setDataset(next) {
  dataset = Array.isArray(next) ? next : [];
}

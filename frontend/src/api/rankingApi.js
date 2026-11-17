async function requestJson(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export function fetchMeta() {
  return requestJson("api/meta");
}

export function fetchRanking(params, signal) {
  return requestJson("api/rank", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
    signal
  });
}

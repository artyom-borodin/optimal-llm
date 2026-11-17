async function fetchOk(url, headers) {
  const res = await fetch(url, headers ? { headers } : undefined);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res;
}

export async function fetchText(url, headers) {
  return (await fetchOk(url, headers)).text();
}

export async function fetchJson(url, headers) {
  return (await fetchOk(url, headers)).json();
}

export async function fetchBuffer(url, headers) {
  return Buffer.from(await (await fetchOk(url, headers)).arrayBuffer());
}

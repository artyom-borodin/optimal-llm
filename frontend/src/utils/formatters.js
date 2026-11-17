function fmtTrimmed(value, maxDecimals) {
  return String(Number(value.toFixed(maxDecimals)));
}

export function fmtIndex(v) {
  return v.toFixed(1);
}

export function fmtUsd(v, { compact = false } = {}) {
  if (v === 0) return "$0";
  if (compact) {
    const d = v >= 10 ? 0 : v >= 1 ? 1 : v >= 0.01 ? 2 : 4;
    return `$${fmtTrimmed(v, d)}`;
  }
  const d = v < 0.001 ? 5 : v < 0.01 ? 4 : v < 1 ? 3 : 2;
  return `$${v.toFixed(d)}`;
}

export function fmt1m(v) {
  if (v == null) return "-";
  if (v === 0) return "0";
  if (v < 0.1) return v.toFixed(3);
  if (v < 10) return v.toFixed(2);
  return v.toFixed(1);
}

export function fmtContext(tokens) {
  if (!tokens) return "-";
  if (tokens >= 1_000_000) return `${fmtTrimmed(tokens / 1e6, 1)}M`;
  return `${Math.round(tokens / 1000)}k`;
}

export function fmtUptime(uptime1d) {
  return uptime1d != null ? `${fmtTrimmed(uptime1d, 1)}%` : "-";
}

export function fmtSpeed(speed) {
  return speed ? speed.toFixed(0) : "-";
}

export function fmtLatency(ms) {
  return ms != null ? `${Math.round(ms)} ms` : null;
}

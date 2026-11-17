const FALLBACK_TOKENS = {
  font: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  bg: "#0b0e14",
  popoverBg: "#1b2434",
  border: "#263042",
  grid: "#1f293a",
  muted: "#8b9bb4",
  green: "#2dd4bf",
  amber: "#f59e0b",
  flex: "#e879f9",
  std: "#3b82f6",
  stdText: "#60a5fa",
  accent: "#5b8cff"
};

function readToken(styles, name, fallback) {
  return styles?.getPropertyValue(name).trim() || fallback;
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return hex;
  const r = Number.parseInt(clean.slice(0, 2), 16);
  const g = Number.parseInt(clean.slice(2, 4), 16);
  const b = Number.parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getChartTheme() {
  const styles = typeof document !== "undefined" ? getComputedStyle(document.documentElement) : null;
  const green = readToken(styles, "--green", FALLBACK_TOKENS.green);
  const amber = readToken(styles, "--amber", FALLBACK_TOKENS.amber);
  const flex = readToken(styles, "--flex", FALLBACK_TOKENS.flex);
  const std = readToken(styles, "--std", FALLBACK_TOKENS.std);
  const stdText = readToken(styles, "--std-text", FALLBACK_TOKENS.stdText);
  const accent = readToken(styles, "--accent", FALLBACK_TOKENS.accent);

  return {
    font: readToken(styles, "--font-sans", FALLBACK_TOKENS.font),
    bg: readToken(styles, "--bg", FALLBACK_TOKENS.bg),
    popoverBg: readToken(styles, "--chart-popover-bg", FALLBACK_TOKENS.popoverBg),
    border: readToken(styles, "--border", FALLBACK_TOKENS.border),
    grid: readToken(styles, "--chart-grid", FALLBACK_TOKENS.grid),
    muted: readToken(styles, "--muted", FALLBACK_TOKENS.muted),
    green,
    amber,
    flexSolid: flex,
    flexMutedBg: hexToRgba(flex, 0.68),
    flexMutedBorder: hexToRgba(flex, 0.9),
    stdSolid: std,
    stdMutedBg: hexToRgba(std, 0.68),
    stdMutedBorder: hexToRgba(stdText, 0.9),
    hint: hexToRgba(green, 0.75),
    paretoLine: hexToRgba(green, 0.78),
    betterZone: hexToRgba(green, 0.055),
    thrLine: hexToRgba(amber, 0.7),
    zoomBg: hexToRgba(accent, 0.16),
    zoomBorder: hexToRgba(accent, 0.65)
  };
}

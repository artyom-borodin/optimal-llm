const FOUR_BIT_QUANTS = new Set(["int4", "fp4", "mxfp4", "nvfp4"]);

export function isFourBitQuant(quantization) {
  return FOUR_BIT_QUANTS.has(String(quantization || "").trim().toLowerCase());
}

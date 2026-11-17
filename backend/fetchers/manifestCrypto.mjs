import zlib from "node:zlib";

export async function decryptManifest(buf, hexKey) {
  const keyBytes = Buffer.from(hexKey, "hex");
  const iv = Buffer.from(await crypto.subtle.digest("SHA-256", keyBytes)).subarray(0, 12);
  const cryptoKey = await crypto.subtle.importKey("raw", keyBytes, { name: "AES-GCM" }, false, ["decrypt"]);
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv, tagLength: 128 }, cryptoKey, buf);
  return JSON.parse(zlib.gunzipSync(Buffer.from(decrypted)).toString("utf8"));
}

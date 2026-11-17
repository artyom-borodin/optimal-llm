import { fetchBuffer, fetchText } from "../http.mjs";
import { extractModelManifestRef } from "./aaRscParser.mjs";
import { decryptManifest } from "./manifestCrypto.mjs";

export async function fetchModelManifest(pageUrl) {
  const rsc = await fetchText(pageUrl, { RSC: "1" });
  const ref = extractModelManifestRef(rsc);
  if (!ref) throw new Error(`AA model manifest not found on ${pageUrl}`);

  const buf = await fetchBuffer(`https://artificialanalysis.ai${ref.path}`);
  return decryptManifest(buf, ref.key);
}

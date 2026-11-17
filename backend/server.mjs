import { fileURLToPath } from "node:url";
import { serve } from "@hono/node-server";
import { buildDataset } from "./pipeline.mjs";
import { getDataset, setDataset } from "./datasetStore.mjs";
import { createApp } from "./app.mjs";
import { startDatasetRefresh } from "./refreshScheduler.mjs";

const PUBLIC_ROOT = fileURLToPath(new URL("../public", import.meta.url));
const PORT = Number(process.env.PORT || 8787);
const REFRESH_INTERVAL_MS = 10 * 60 * 1000;

await startDatasetRefresh({
  load: buildDataset,
  onData: setDataset,
  intervalMs: REFRESH_INTERVAL_MS,
  onError: (e) => console.error("Refresh error:", e.message)
});

const app = createApp({ publicRoot: PUBLIC_ROOT, getDataset });

serve({ fetch: app.fetch, port: PORT, hostname: "0.0.0.0" }, () => {
  console.log(`Optimal LLM running at http://localhost:${PORT}`);
});

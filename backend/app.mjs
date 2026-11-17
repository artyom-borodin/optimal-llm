import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { listAvailableModels } from "./engine/catalog.mjs";
import { rankModels } from "./engine/scorer.mjs";
import { buildMetaModelsList, buildRankResponseDto } from "./presenters/modelsPresenter.mjs";

export function createApp({ publicRoot, getDataset }) {
  const app = new Hono();

  app.get("/api/meta", (c) => {
    c.header("Cache-Control", "no-store");
    const available = listAvailableModels(getDataset());
    return c.json({ modelsList: buildMetaModelsList(available) });
  });

  app.post("/api/rank", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const ranked = rankModels(getDataset(), body);
    return c.json(buildRankResponseDto(ranked));
  });

  app.use("/*", serveStatic({ root: publicRoot }));

  return app;
}

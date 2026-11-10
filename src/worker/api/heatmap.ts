import { z } from "zod";
import { cnDate } from "../../shared/heatmap";
import { PROVIDERS, ProviderError } from "../heatmap/providers";
import { bindSource, listBindings, loadSeries, syncUser, unbindSource } from "../heatmap/store";
import { HttpError, type Router, json } from "../http";
import { requireSecret } from "../session";
import { memberId } from "./common";

const publicProviders = () =>
  PROVIDERS.map((p) => ({
    id: p.id,
    label: p.label,
    unit: p.unit,
    category: p.category,
    status: p.status,
    coverage: p.coverage,
    handleHint: p.handleHint,
    needsUserSecret: p.needsUserSecret ?? null,
  }));

export function heatmapRoutes(api: Router) {
  api.get("/api/heatmap", async (c) => {
    const uid = memberId(c);
    const [series, bindings] = await Promise.all([loadSeries(c.env.DB, uid), listBindings(c.env.DB, uid)]);
    return json({ today: cnDate(Date.now()), series, bindings, providers: publicProviders() });
  });

  api.post("/api/heatmap/bindings", async (c) => {
    const uid = memberId(c);
    const input = z
      .object({ source: z.string().max(32), handle: z.string().trim().min(1).max(64), secret: z.string().trim().max(400).optional() })
      .parse(await c.body());
    try {
      await bindSource(c.env.DB, requireSecret(c.env), { userId: uid, ...input });
    } catch (err) {
      if (err instanceof ProviderError) throw new HttpError(400, err.message);
      throw err;
    }
    const synced = await syncUser(c.env.DB, { ...c.env, SESSION_SECRET: requireSecret(c.env) }, uid, (u, i) => fetch(u, i));
    const mine = synced.find((s) => s.source === input.source);
    return json({ ok: true, error: mine?.error ?? null, days: mine ? Object.keys(mine.days).length : 0 });
  });

  api.delete("/api/heatmap/bindings/:source", async (c) => {
    await unbindSource(c.env.DB, memberId(c), c.params.source);
    return json({ ok: true });
  });
}

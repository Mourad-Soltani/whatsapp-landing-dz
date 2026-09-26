// Vercel Serverless — Clarity Data Export proxy (rate-limit friendly)
const CLARITY_URL = "https://www.clarity.ms/export-data/api/v1/project-live-insights";

// In-memory cache per warm lambda instance (best-effort)
const mem = globalThis.__clarityCache || (globalThis.__clarityCache = new Map());
const TTL_MS = 10 * 60 * 1000; // 10 minutes

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // CDN cache 10 min — critical to avoid Clarity daily rate limits
  res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=600");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const token = process.env.CLARITY_API_TOKEN;
  if (!token) {
    return res.status(500).json({
      error: "CLARITY_API_TOKEN not configured",
      hint: "Vercel → Settings → Environment Variables",
    });
  }

  const days = Math.min(3, Math.max(1, parseInt(req.query.days || "3", 10) || 3));
  const dimension = (req.query.dimension || "").trim();
  const cacheKey = `${days}:${dimension || "_"}`;

  const hit = mem.get(cacheKey);
  if (hit && Date.now() - hit.at < TTL_MS) {
    res.setHeader("X-Cache", "MEM");
    return res.status(200).json(hit.body);
  }

  const params = new URLSearchParams({ numOfDays: String(days) });
  if (dimension) params.set("dimension1", dimension);

  try {
    const r = await fetch(`${CLARITY_URL}?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const text = await r.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(502).json({
        error: "Invalid response from Clarity",
        status: r.status,
        raw: text.slice(0, 200),
      });
    }

    if (r.status === 429) {
      // Serve stale cache if any
      if (hit) {
        res.setHeader("X-Cache", "STALE");
        return res.status(200).json({ ...hit.body, stale: true, rateLimited: true });
      }
      return res.status(429).json({
        error: "Clarity daily API limit reached",
        hint: "Detailed breakdowns resume after the limit resets (usually within 24h). Total visits still work via the public counter.",
        status: 429,
      });
    }

    if (!r.ok) {
      return res.status(r.status).json({ error: "Clarity API error", status: r.status, data });
    }

    const body = {
      ok: true,
      days,
      dimension: dimension || null,
      fetchedAt: new Date().toISOString(),
      metrics: data,
    };
    mem.set(cacheKey, { at: Date.now(), body });
    res.setHeader("X-Cache", "MISS");
    return res.status(200).json(body);
  } catch (e) {
    if (hit) {
      res.setHeader("X-Cache", "STALE");
      return res.status(200).json({ ...hit.body, stale: true });
    }
    return res.status(502).json({ error: "Failed to reach Clarity", message: String(e.message || e) });
  }
};

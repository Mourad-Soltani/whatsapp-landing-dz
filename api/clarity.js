// Vercel Serverless Function — Microsoft Clarity Data Export proxy
// Token lives in env: CLARITY_API_TOKEN (never expose to the browser)

const CLARITY_URL = "https://www.clarity.ms/export-data/api/v1/project-live-insights";

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.CLARITY_API_TOKEN;
  if (!token) {
    return res.status(500).json({
      error: "CLARITY_API_TOKEN not configured",
      hint: "Add it in Vercel → Project → Settings → Environment Variables",
    });
  }

  const days = Math.min(3, Math.max(1, parseInt(req.query.days || "3", 10) || 3));
  const dimension = (req.query.dimension || "").trim();

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
      return res.status(502).json({ error: "Invalid response from Clarity", status: r.status });
    }

    if (!r.ok) {
      return res.status(r.status).json({ error: "Clarity API error", status: r.status, data });
    }

    return res.status(200).json({
      ok: true,
      days,
      dimension: dimension || null,
      fetchedAt: new Date().toISOString(),
      metrics: data,
    });
  } catch (e) {
    return res.status(502).json({ error: "Failed to reach Clarity", message: String(e.message || e) });
  }
};

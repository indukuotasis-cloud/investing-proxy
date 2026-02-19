export default async function handler(req, res) {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    res.statusCode = 400;
    return res.end("Missing ?url=");
  }

  try {
    // Labai svarbu: kai kurie hostai blokuoja be Accept-Language/Referer
    const resp = await fetch(targetUrl, {
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.google.com/"
      }
    });

    const text = await resp.text();

    // Grąžinam originalų statusą (padeda debuginti)
    res.statusCode = resp.status;

    // Content-Type: jei gaunam HTML - text/html; jei ne - text/plain
    const ct = resp.headers.get("content-type") || "text/plain; charset=utf-8";
    res.setHeader("Content-Type", ct);

    // Leisti Sheets / naršyklei skaityti
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "no-store");

    return res.end(text);
  } catch (err) {
    res.statusCode = 500;
    return res.end("Proxy error: " + (err && err.stack ? err.stack : String(err)));
  }
}

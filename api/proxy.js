// Priverčiame naudoti Node.js serverless runtime (ne Edge)
export const config = {
  runtime: "nodejs"
};

export default async function handler(req, res) {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    res.statusCode = 400;
    return res.end("Missing ?url=");
  }

  try {
    const response = await fetch(targetUrl, {
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.google.com/"
      }
    });

    const text = await response.text();

    res.statusCode = response.status;

    const contentType =
      response.headers.get("content-type") ||
      "text/plain; charset=utf-8";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "no-store");

    return res.end(text);

  } catch (err) {
    res.statusCode = 500;
    return res.end("Proxy error: " + (err?.stack || String(err)));
  }
}

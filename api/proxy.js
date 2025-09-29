export default async function handler(req, res) {
  try {
    const targetDomain = "https://emailsignatures2.my.canva.site/dag0t-l7lu8"; // your real Canva link
    const url = targetDomain + req.url; // preserve path/query

    const response = await fetch(url, {
      headers: {
        ...req.headers,
        host: "emailsignatures2.my.canva.site", // force Canva host
      },
    });

    // copy response headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // stream the response
    const body = await response.text();
    res.status(response.status).send(body);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy failed");
  }
}

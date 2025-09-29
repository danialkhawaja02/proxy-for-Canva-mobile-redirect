export default async function handler(req, res) {
  try {
    const targetDomain = "https://emailsignatures2.my.canva.site";
    const rootPath = "/dag0t-l7lu8";

    const url = targetDomain + rootPath + (req.url === "/" ? "" : req.url);

    const response = await fetch(url, {
      headers: {
        ...req.headers,
        host: "emailsignatures2.my.canva.site",
      },
    });

    let body = await response.text();

    // Only rewrite HTML, not assets
    if (response.headers.get("content-type")?.includes("text/html")) {
      body = body.replace(/emailsignatures2\.my\.canva\.site/g, "iservicy.com");
    }

    // Copy headers
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "content-encoding") {
        res.setHeader(key, value);
      }
    });

    res.status(response.status).send(body);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy failed");
  }
}

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

    // Copy headers except encoding
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "content-encoding") {
        res.setHeader(key, value);
      }
    });

    // Detect HTML → rewrite
    if (response.headers.get("content-type")?.includes("text/html")) {
      let body = await response.text();
      body = body.replace(/emailsignatures2\.my\.canva\.site/g, "iservicy.com");
      res.status(response.status).send(body);
    } else {
      // For assets (css, js, images) → stream raw bytes
      const arrayBuffer = await response.arrayBuffer();
      res.status(response.status).send(Buffer.from(arrayBuffer));
    }
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy failed");
  }
}

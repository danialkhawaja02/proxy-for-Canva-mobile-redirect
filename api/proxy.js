export default async function handler(req, res) {
  try {
    const targetDomain = "https://emailsignatures2.my.canva.site";
    const rootPath = "/dag0t-l7lu8";

    // If request is for assets, redirect directly to Canva
    if (
      req.url.startsWith("/_assets") ||
      req.url.startsWith(rootPath + "/_assets")
    ) {
      const assetUrl = targetDomain + rootPath + req.url.replace(rootPath, "");
      return res.redirect(302, assetUrl);
    }

    const url = targetDomain + rootPath + (req.url === "/" ? "" : req.url);

    const response = await fetch(url, {
      headers: {
        ...req.headers,
        host: "emailsignatures2.my.canva.site",
      },
    });

    let body = await response.text();

    // Replace domain references in HTML so links point to iservicy.com
    if (response.headers.get("content-type")?.includes("text/html")) {
      body = body.replace(/emailsignatures2\.my\.canva\.site/g, "iservicy.com");
    }

    // Copy headers except encoding
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

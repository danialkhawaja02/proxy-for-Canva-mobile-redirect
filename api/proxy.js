export default async function handler(req, res) {
  const targetRoot =
    "https://preview.canva.site/093fb566-9784-4ded-a932-31bdbecb1496/iservicy.com";

  // handle query forwarding for /_api or /_online requests
  const path = req.query.path ? `/${req.query.path}` : req.url;
  const url = `${targetRoot}${path}`;

  try {
    const response = await fetch(url, {
      headers: { "user-agent": req.headers["user-agent"] || "" },
    });

    const contentType = response.headers.get("content-type") || "";

    // Binary data (images, fonts, etc.)
    if (!contentType.includes("text/") && !contentType.includes("json")) {
      const buffer = await response.arrayBuffer();
      res.setHeader("Content-Type", contentType);
      res.status(response.status).send(Buffer.from(buffer));
      return;
    }

    // For text or HTML
    let body = await response.text();

    if (contentType.includes("text/html")) {
      // Clean internal URLs (like About Us → /about-us)
      body = body
        .replace(
          /href="\/093fb566-9784-4ded-a932-31bdbecb1496\/iservicy\.com\/([^"]*)"/g,
          (match, page) => `href="/${page}"`
        )
        // Fix asset URLs
        .replace(
          /(src|href)="\/_assets\/([^"]+)"/g,
          (match, attr, file) => `${attr}="/_assets/${file}"`
        )
        // Handle internal API & ping requests
        .replace(
          /(src|href)="\/_api\/([^"]+)"/g,
          (match, attr, file) => `${attr}="/_api/${file}"`
        )
        .replace(/"\/_online"/g, '"/_online"');
    }

    res.setHeader("Content-Type", contentType);
    res.status(response.status).send(body);
  } catch (err) {
    console.error("Proxy Error:", err);
    res.status(500).send("Internal Server Error");
  }
}

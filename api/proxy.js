export default async function handler(req, res) {
  const targetRoot = "https://iservicy.my.canva.site";

  const path = req.query.path ? `/${req.query.path}` : req.url;
  const url = `${targetRoot}${path}`;

  try {
    const response = await fetch(url, {
      headers: { "user-agent": req.headers["user-agent"] || "" },
    });

    const contentType = response.headers.get("content-type") || "";

    // Handle binary data (images, fonts, etc.)
    if (!contentType.includes("text/") && !contentType.includes("json")) {
      const buffer = await response.arrayBuffer();
      res.setHeader("Content-Type", contentType);
      res.status(response.status).send(Buffer.from(buffer));
      return;
    }

    // Handle HTML and text
    let body = await response.text();

    if (contentType.includes("text/html")) {
      body = body
        // Fix internal links like /about-us or /
        .replace(/href="\/([^"]*)"/g, (match, page) => `href="/${page}"`)
        // Fix asset references
        .replace(
          /(src|href)="\/_assets\/([^"]+)"/g,
          (match, attr, file) => `${attr}="/_assets/${file}"`
        )
        // Handle internal API and ping requests
        .replace(/"\/_online"/g, '"/_online"');
    }

    res.setHeader("Content-Type", contentType);
    res.status(response.status).send(body);
  } catch (err) {
    console.error("Proxy Error:", err);
    res.status(500).send("Internal Server Error");
  }
}

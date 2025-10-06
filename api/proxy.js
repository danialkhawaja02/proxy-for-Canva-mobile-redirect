export default async function handler(req, res) {
  const canvaHost = "https://preview.canva.site";
  const canvaPath = "/093fb566-9784-4ded-a932-31bdbecb1496/iservicy.com";
  const targetRoot = `${canvaHost}${canvaPath}`;

  // Ensure req.url starts with a slash
  const requestPath = req.url.startsWith("/") ? req.url : `/${req.url}`;
  const url = `${targetRoot}${requestPath}`;

  try {
    const response = await fetch(url, {
      headers: { "user-agent": req.headers["user-agent"] || "" },
    });

    let body = await response.text();
    const contentType = response.headers.get("content-type") || "";

    // If it's HTML, rewrite all links to be root-relative to your domain
    if (contentType.includes("text/html")) {
      const canvaFullPathRegex = new RegExp(canvaPath, "g");

      // This single replace handles everything:
      // - href="/<canva_path>/about" becomes href="/about"
      // - src="/<canva_path>/_assets/image.png" becomes src="/_assets/image.png"
      body = body.replace(canvaFullPathRegex, "");
    }

    res.setHeader("Content-Type", contentType);
    res.status(response.status).send(body);
  } catch (err) {
    console.error("Proxy Error:", err);
    res.status(500).send("Internal Server Error");
  }
}

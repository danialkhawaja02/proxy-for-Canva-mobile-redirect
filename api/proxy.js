export default async function handler(req, res) {
  const host = req.headers.host || "";
  const isMobile = host.startsWith("m.");

  const targetRoot = isMobile
    ? "https://iservicy.my.canva.site/mobile"
    : "https://iservicy.my.canva.site";

  const path = req.query.path ? `/${req.query.path}` : req.url;
  const url = `${targetRoot}${path}`;

  try {
    const response = await fetch(url, {
      headers: { "user-agent": req.headers["user-agent"] || "" },
    });

    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("text/") && !contentType.includes("json")) {
      const buffer = await response.arrayBuffer();
      res.setHeader("Content-Type", contentType);
      res.status(response.status).send(Buffer.from(buffer));
      return;
    }

    let body = await response.text();
    res.setHeader("Content-Type", contentType);
    res.status(response.status).send(body);
  } catch (err) {
    console.error("Proxy Error:", err);
    res.status(500).send("Internal Server Error");
  }
}

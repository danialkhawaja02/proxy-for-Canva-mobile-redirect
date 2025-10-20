export default async function handler(req, res) {
  try {
    const { path } = req.query;
    const target = `https://iservicy.my.canva.site/_assets/${path}`;

    const response = await fetch(target, {
      headers: { "user-agent": req.headers["user-agent"] || "" },
    });

    if (!response.ok) {
      res
        .status(response.status)
        .send(`Error fetching asset: ${response.statusText}`);
      return;
    }

    const buffer = await response.arrayBuffer();
    const contentType =
      response.headers.get("content-type") || "application/octet-stream";

    res.setHeader("Cache-Control", "public, max-age=86400");
    res.setHeader("Content-Type", contentType);
    res.status(200).send(Buffer.from(buffer));
  } catch (err) {
    console.error("Asset Proxy Error:", err);
    res.status(500).send("Internal Server Error");
  }
}

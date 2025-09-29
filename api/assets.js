export default async function handler(req, res) {
  try {
    const { path } = req.query;
    const target = `https://emailsignatures2.my.canva.site/dag0t-l7lu8/_assets/${path}`;

    const response = await fetch(target, {
      headers: { "user-agent": req.headers["user-agent"] || "" },
    });

    if (!response.ok) {
      res
        .status(response.status)
        .send(`Error fetching asset: ${response.statusText}`);
      return;
    }

    const buffer = await response.arrayBuffer(); // read as raw bytes
    const contentType =
      response.headers.get("content-type") || "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    res.status(200).send(Buffer.from(buffer));
  } catch (err) {
    console.error("Asset Proxy Error:", err);
    res.status(500).send("Internal Server Error");
  }
}

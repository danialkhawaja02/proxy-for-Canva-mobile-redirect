export default async function handler(req, res) {
  const { path } = req.query;
  const target = `https://emailsignatures2.my.canva.site/dag0t-l7lu8/_assets/${path}`;

  const response = await fetch(target, {
    headers: { "user-agent": req.headers["user-agent"] || "" },
  });

  res.setHeader(
    "Content-Type",
    response.headers.get("content-type") || "application/octet-stream"
  );
  res.status(response.status);
  response.body.pipe(res); // stream directly
}

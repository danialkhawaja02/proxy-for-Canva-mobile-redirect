export default async function handler(req, res) {
  const target = "https://emailsignatures2.my.canva.site/dag0t-l7lu8";
  const url = `${target}${req.url}`;

  const response = await fetch(url, {
    headers: { "user-agent": req.headers["user-agent"] || "" },
  });

  let body = await response.text();
  let contentType = response.headers.get("content-type") || "";

  if (contentType.includes("text/html")) {
    // rewrite links to use your own domain (so assets go through assets.js)
    body = body.replace(
      /(src|href)="\/dag0t-l7lu8\/_assets\/([^"]+)"/g,
      (match, attr, file) => `${attr}="/dag0t-l7lu8/_assets/${file}"`
    );
  }

  res.setHeader("Content-Type", contentType);
  res.status(response.status).send(body);
}

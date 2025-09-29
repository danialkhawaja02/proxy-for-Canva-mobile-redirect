export default async function handler(req, res) {
  const target = "https://emailsignatures2.my.canva.site/dag0t-l7lu8";
  const url = `${target}${req.url}`;

  const response = await fetch(url, {
    headers: { "user-agent": req.headers["user-agent"] || "" },
  });

  let body = await response.text();
  let contentType = response.headers.get("content-type") || "";

  if (contentType.includes("text/html")) {
    // rewrite relative assets to your own domain
    body = body.replace(
      /(src|href)="\/(dag0t-l7lu8\/_assets\/[^"]+)"/g,
      (match, p1, p2) => {
        return `${p1}="/${p2}"`; // keeps them local, will be handled by assets.js
      }
    );
  }

  res.setHeader("Content-Type", contentType);
  res.status(response.status).send(body);
}

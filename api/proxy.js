export default async function handler(req, res) {
  const target = "https://emailsignatures2.my.canva.site/dag0t-l7lu8";
  const url = `${target}${req.url}`;

  const response = await fetch(url, {
    headers: {
      "user-agent": req.headers["user-agent"] || "",
    },
  });

  let body = await response.text();
  let contentType = response.headers.get("content-type") || "";

  // If it's HTML, fix asset links
  if (contentType.includes("text/html")) {
    body = body.replace(/(src|href)="\/(.*?)"/g, (match, p1, p2) => {
      return `${p1}="${target}/${p2}"`;
    });
  }

  res.setHeader("Content-Type", contentType);
  res.status(response.status).send(body);
}

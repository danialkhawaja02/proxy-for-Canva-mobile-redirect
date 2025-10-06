export default async function handler(req, res) {
  const target =
    "https://preview.canva.site/093fb566-9784-4ded-a932-31bdbecb1496/iservicy.com";
  const url = `${target}${req.url}`;

  try {
    const response = await fetch(url, {
      headers: { "user-agent": req.headers["user-agent"] || "" },
    });

    let body = await response.text();
    let contentType = response.headers.get("content-type") || "";

    // If it's HTML, rewrite the asset URLs to use your proxy
    if (contentType.includes("text/html")) {
      body = body.replace(
        /(src|href)="\/093fb566-9784-4ded-a932-31bdbecb1496\/iservicy\.com\/_assets\/([^"]+)"/g,
        (match, attr, file) =>
          `${attr}="/093fb566-9784-4ded-a932-31bdbecb1496/iservicy.com/_assets/${file}"`
      );
    }

    res.setHeader("Content-Type", contentType);
    res.status(response.status).send(body);
  } catch (err) {
    console.error("Proxy Error:", err);
    res.status(500).send("Internal Server Error");
  }
}

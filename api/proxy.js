export default async function handler(req, res) {
  const targetRoot =
    "https://preview.canva.site/093fb566-9784-4ded-a932-31bdbecb1496/iservicy.com";
  const url = `${targetRoot}${req.url}`;

  try {
    const response = await fetch(url, {
      headers: { "user-agent": req.headers["user-agent"] || "" },
    });

    let body = await response.text();
    const contentType = response.headers.get("content-type") || "";

    // If it's HTML, rewrite links
    if (contentType.includes("text/html")) {
      // Fix links for internal pages like About Us, Contact, etc.
      body = body
        // turn internal full paths into clean root-relative URLs
        .replace(
          /href="\/093fb566-9784-4ded-a932-31bdbecb1496\/iservicy\.com\/([^"]*)"/g,
          (match, page) => `href="/${page}"`
        )
        // fix asset URLs to still load correctly from Canva or proxy
        .replace(
          /(src|href)="\/_assets\/([^"]+)"/g,
          (match, attr, file) =>
            `${attr}="/093fb566-9784-4ded-a932-31bdbecb1496/iservicy.com/_assets/${file}"`
        )
        // catch nested asset paths too
        .replace(
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

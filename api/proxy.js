export default async function handler(req, res) {
  try {
    const targetDomain = "https://emailsignatures2.my.canva.site";
    const rootPath = "/dag0t-l7lu8"; // Canva site root

    // Prepend Canva's rootPath to every request
    const url = targetDomain + rootPath + (req.url === "/" ? "" : req.url);

    const response = await fetch(url, {
      headers: {
        ...req.headers,
        host: "emailsignatures2.my.canva.site",
      },
    });

    // Copy headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Stream the response
    const body = await response.text();
    res.status(response.status).send(body);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy failed");
  }
}

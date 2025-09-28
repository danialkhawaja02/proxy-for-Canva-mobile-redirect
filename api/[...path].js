// api/[...path].js
export const config = { runtime: "edge" };

// PREFER THIS: set CANVA_ORIGIN to the Canva hostname they gave you (e.g. https://your-canva-site.my.canva.site)
const CANVA_ORIGIN = "https://emailsignatures2.my.canva.site/dag0t-l7lu8"; // <-- CHANGE THIS
// If you *must* use the IP, see TLS note below (less reliable)
const CANVA_HOST_HEADER = "iservicy.com"; // keep Host header so Canva serves your site

export default async function handler(req) {
  try {
    const url = new URL(req.url);
    const pathAndQuery = url.pathname + url.search; // preserves /about-us and ?qs

    const fetchUrl = CANVA_ORIGIN + pathAndQuery;

    // forward request headers but replace Host with the Canva host your site expects
    const headers = new Headers(req.headers);
    headers.set("Host", CANVA_HOST_HEADER);
    headers.delete("connection");

    // forward body if present
    const body = await req.arrayBuffer();

    const fetched = await fetch(fetchUrl, {
      method: req.method,
      headers,
      body: body.byteLength ? body : undefined,
      redirect: "follow",
    });

    // copy response headers (remove hop-by-hop)
    const resHeaders = new Headers(fetched.headers);
    resHeaders.delete("connection");
    resHeaders.delete("transfer-encoding");

    const fetchedBody = await fetched.arrayBuffer();
    return new Response(fetchedBody, {
      status: fetched.status,
      headers: resHeaders,
    });
  } catch (err) {
    console.error("Proxy error:", err);
    return new Response("Proxy error", { status: 502 });
  }
}
s;

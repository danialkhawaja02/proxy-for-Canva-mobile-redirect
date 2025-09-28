// api/[...path].js
export const config = { runtime: "edge" }; // run at edge (fast)

const MOBILE_REGEX =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i;

// --- CHANGE THESE to your actual targets ---
const CANVA_ORIGIN = "https://iservicy.com"; // ← replace with your Canva public URL
const MOBILE_SITE = "https://m.iservicy.com"; // ← replace if different
// ------------------------------------------------

export default async function handler(req) {
  const ua = req.headers.get("user-agent") || "";
  const url = new URL(req.url);
  // remove the leading slash that Vercel routes may add when rewriting
  const path = url.pathname.replace(/^\/+/, "/");
  const qs = url.search;

  // If mobile, redirect to mobile subdomain (change 302 -> 301 for permanent)
  if (MOBILE_REGEX.test(ua)) {
    return Response.redirect(MOBILE_SITE + path + qs, 302);
  }

  // Otherwise: proxy the request to Canva and return the response.
  // (This preserves iservicy.com in the browser while serving Canva's content.)
  const fetchUrl = CANVA_ORIGIN + path + qs;
  const headers = {
    "User-Agent": ua,
    Accept: req.headers.get("accept") || "*/*",
  };

  const fetched = await fetch(fetchUrl, {
    method: req.method,
    headers,
    redirect: "follow",
  });

  // Copy response headers but remove hop-by-hop headers
  const resHeaders = new Headers(fetched.headers);
  resHeaders.delete("connection");
  resHeaders.delete("transfer-encoding");
  // Note: content-encoding may be present (gzip). Vercel edge handles it.

  const body = await fetched.arrayBuffer();
  return new Response(body, { status: fetched.status, headers: resHeaders });
}

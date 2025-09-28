// api/[...path].js
export const config = { runtime: "edge" };

const CANVA_IP = "http://103.169.142.0"; // Canva origin IP you provided
const CANVA_HOST = "iservicy.com"; // keep Host header as your domain

export default async function handler(req) {
  const url = new URL(req.url);
  const path = url.pathname; // includes leading "/"
  const qs = url.search || "";

  const fetchUrl = CANVA_IP + path + qs;

  // clone request headers then set Host
  const headers = new Headers(req.headers);
  headers.set("Host", CANVA_HOST);
  // optionally remove hop-by-hop headers if present
  headers.delete("connection");

  const fetched = await fetch(fetchUrl, {
    method: req.method,
    headers,
    body: req.body ?? undefined,
    redirect: "follow",
  });

  // copy response headers (remove hop-by-hop)
  const resHeaders = new Headers(fetched.headers);
  resHeaders.delete("connection");
  resHeaders.delete("transfer-encoding");

  const body = await fetched.arrayBuffer();
  return new Response(body, { status: fetched.status, headers: resHeaders });
}

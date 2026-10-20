import type { RequestHandler } from "express";

function normalizedHost(host: string): string {
  const url = new URL(`http://${host}`);
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  return `${local ? "loopback" : url.hostname}:${url.port || "80"}`;
}

export const sameOrigin: RequestHandler = (request, response, next) => {
  response.setHeader("Cache-Control", "no-store");
  if (["GET", "HEAD", "OPTIONS"].includes(request.method) || !request.headers.origin) { next(); return; }
  try {
    const origin = new URL(request.headers.origin);
    const allowed = (process.env.ALLOWED_ORIGINS ?? "").split(",").map(value => value.trim()).filter(Boolean);
    if (normalizedHost(origin.host) === normalizedHost(request.headers.host ?? "") || allowed.includes(origin.origin)) { next(); return; }
  } catch { /* Reject malformed origins below. */ }
  response.status(403).json({ error: "This website address is not allowed to save changes. Open the dashboard using the server's address, or configure ALLOWED_ORIGINS for your hosting domain.", code: "ORIGIN_NOT_ALLOWED" });
};

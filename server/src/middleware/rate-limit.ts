import type { RequestHandler } from "express";
export function rateLimit(limit: number, windowMs: number): RequestHandler {
  const attempts = new Map<string, { count: number; until: number }>();
  return (request, response, next) => {
    const now = Date.now();
    for (const [key, entry] of attempts) if (entry.until <= now) attempts.delete(key);
    const key = request.ip ?? "unknown";
    const entry = attempts.get(key) ?? { count: 0, until: now + windowMs };
    entry.count++; attempts.set(key, entry);
    if (entry.count > limit) { response.setHeader("Retry-After", Math.ceil((entry.until - now) / 1000)); response.status(429).json({ error: "Too many requests. Please try again shortly." }); return; }
    next();
  };
}

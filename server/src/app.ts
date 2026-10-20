import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import path from "node:path";
import { prisma } from "./lib/prisma.js";
import { createAuthRouter } from "./routes/auth.js";
import { adminRouter } from "./routes/admin.js";
import { sportsRouter } from "./routes/sports.js";
import { homepageRouter } from "./routes/homepage.js";

import { rateLimit } from "./middleware/rate-limit.js";
import { sameOrigin } from "./middleware/same-origin.js";
export function configureApp(app: express.Express): express.Express {
if (process.env.VERCEL === "1") app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use((_request, response, next) => { response.setHeader("X-Content-Type-Options", "nosniff"); response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin"); response.setHeader("X-Frame-Options", "SAMEORIGIN"); next(); });
app.use("/api", sameOrigin);
const frontendDirectory = path.resolve(process.cwd(), "aul sports");

app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (_request: Request, response: Response) => {
  response.status(200).json({ status: "ok" });
});

app.use("/api/auth/login", rateLimit(30, 15 * 60 * 1000));
app.use("/api/auth/register", rateLimit(10, 60 * 60 * 1000));
app.use("/api/auth", createAuthRouter({ prisma }));
app.use("/api/admin", adminRouter);
app.use("/api", sportsRouter);
app.use("/api/homepage", homepageRouter);

app.get("/api/items", async (_request: Request, response: Response) => {
  try {
    const items = await prisma.item.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, title: true, content: true, createdAt: true, updatedAt: true } });
    response.status(200).json(items);
  } catch (error) {
    console.error("Failed to fetch items", error);
    response.status(500).json({ error: "Unable to fetch items" });
  }
});

app.post("/api/items", rateLimit(10, 60 * 1000), async (request: Request, response: Response) => {
  const body = (request.body ?? {}) as { title?: unknown; content?: unknown };
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (!title || title.length > 120) { response.status(400).json({ error: "Title is required and must be 120 characters or fewer" }); return; }
  if (content.length > 2000) { response.status(400).json({ error: "Content must be 2,000 characters or fewer" }); return; }
  try {
    const item = await prisma.item.create({ data: { title, content: content || null }, select: { id: true, title: true, content: true, createdAt: true, updatedAt: true } });
    response.status(201).json(item);
  } catch (error) {
    console.error("Failed to create item", error);
    response.status(500).json({ error: "Unable to create item" });
  }
});

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  const prismaCode = error && typeof error === "object" && "code" in error ? String(error.code) : "";
  console.error("API request failed", error);
  const status = error && typeof error === "object" && "status" in error ? Number(error.status) : 500;
  if (status === 400 || status === 413) { response.status(status).json({ error: status === 413 ? "Request body is too large" : "Invalid JSON request body" }); return; }
  if (prismaCode === "P2003") { response.status(400).json({ error: "The selected related record does not exist" }); return; }
  if (prismaCode === "P2025") { response.status(404).json({ error: "Record not found" }); return; }
  if (prismaCode === "P2002") { response.status(409).json({ error: "A record with one of these unique values already exists. Check the name or slug." }); return; }
  response.status(500).json({ error: "The server could not complete that request. Check the server terminal for details." });
});

app.use("/api", (_request, response) => { response.status(404).json({ error: "API route not found" }); });
app.use(express.static(frontendDirectory));
app.use((_request: Request, response: Response) => { response.status(404).type("html").send('<main style="font-family:system-ui;max-width:600px;margin:15vh auto;padding:24px"><h1>Page not found</h1><p>Let’s get you back to the game.</p><a href="/">Return to Sports Hub →</a></main>'); });


return app;
}

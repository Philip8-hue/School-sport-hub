import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { defaultHomepageContent, parseHomepageContent, homepageCopyFields } from "../lib/homepage.js";
import { isExecutiveSport } from '../lib/executive-access.js';

export const adminRouter = Router();
const adminOnly = [requireAuth, requireRole("ADMIN")];
const itemSchema = z.object({
  title: z.string().trim().min(1).max(120),
  content: z.string().trim().max(2000).optional(),
});

adminRouter.get("/ping", ...adminOnly, (request, response) => {
  response.status(200).json({ ok: true, message: "Admin authentication is working", user: request.user });
});

adminRouter.get("/summary", ...adminOnly, async (_request, response, next) => {
  try {
    const [userCount, itemCount, recentItems] = await Promise.all([
      prisma.user.count(),
      prisma.item.count(),
      prisma.item.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, title: true, content: true, createdAt: true },
      }),
    ]);
    response.status(200).json({ userCount, itemCount, recentItems });
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/items", ...adminOnly, async (request, response, next) => {
  const parsed = itemSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: "Invalid item details", details: parsed.error.flatten() });
    return;
  }

  try {
    const item = await prisma.item.create({
      data: { title: parsed.data.title, content: parsed.data.content || null, authorId: request.user?.id },
      select: { id: true, title: true, content: true, createdAt: true },
    });
    response.status(201).json({ item });
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/items/:id", ...adminOnly, async (request, response, next) => {
  const id = Number(request.params.id);
  if (!Number.isInteger(id) || id < 1) {
    response.status(400).json({ error: "Invalid item id" });
    return;
  }

  try {
    await prisma.item.delete({ where: { id } });
    response.status(204).send();
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      response.status(404).json({ error: "Item not found" });
      return;
    }
    next(error);
  }
});

adminRouter.get("/users", ...adminOnly, async (_request, response, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, executiveSport: true, isActive: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    response.json(users);
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/users/:id", ...adminOnly, async (request, response, next) => {
  const userId = Number(request.params.id);
  const role = ['ADMIN','USER','EXECUTIVE'].includes(request.body?.role) ? request.body.role as string : undefined;
  const executiveSport = request.body?.executiveSport;
  const isActive = typeof request.body?.isActive === "boolean" ? request.body.isActive : undefined;
  if (!Number.isInteger(userId) || userId < 1 || (!role && isActive === undefined)) {
    response.status(400).json({ error: "Invalid user update" });
    return;
  }
  if (userId === request.user?.id && (role === "USER" || isActive === false)) { response.status(400).json({ error: "You cannot remove your own administrator access" }); return; }
  try {
    if (role === 'EXECUTIVE') {
      if (!isExecutiveSport(executiveSport)) { response.status(400).json({ error: 'Choose football, basketball or volleyball for this executive.' }); return; }
      const changed = await prisma.$transaction(async tx => {
        const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
        if (user.role === 'ADMIN') return null;
        return tx.user.update({ where: { id: userId }, data: { role: 'EXECUTIVE', executiveSport, sessionVersion: { increment: 1 }, legacySessionsUntil: null, mfaRequiredAfter: user.mfaRequiredAfter ?? new Date(Date.now()+14*86400000), ...(isActive !== undefined ? { isActive } : {}) }, select: { id:true,email:true,name:true,role:true,executiveSport:true,isActive:true } });
      });
      if (!changed) { response.status(400).json({ error: 'Overall administrators keep their existing access. Choose a regular user or executive.' }); return; }
      response.json(changed); return;
    }
    response.json(await prisma.user.update({ where: { id: userId }, data: { ...(role ? { role, executiveSport: null, sessionVersion: { increment: 1 }, legacySessionsUntil: null, ...(role === "ADMIN" ? { mfaRequiredAfter: new Date(Date.now()+14*86400000) } : {}) } : {}), ...(isActive !== undefined ? { isActive, ...(role ? {} : { sessionVersion: { increment: 1 }, legacySessionsUntil: null }) } : {}) }, select: { id: true, email: true, name: true, role: true, isActive: true } }));
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/homepage", ...adminOnly, async (_request, response, next) => {
  try {
    const record = await prisma.homepageContent.findUnique({ where: { id: 1 } });
    response.json({ content: record ? parseHomepageContent(record.content) : defaultHomepageContent });
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/homepage", ...adminOnly, async (request, response, next) => {
  try {
    for (const field of homepageCopyFields) {
      const value = request.body?.copy?.[field.key];
      if (value !== undefined && (typeof value !== "string" || value.length > 2000)) { response.status(400).json({ error: "Homepage text must be 2,000 characters or fewer" }); return; }
      if (field.attribute === "href" && typeof value === "string") { try { if (!['http:', 'https:'].includes(new URL(value, 'http://localhost').protocol)) throw new Error(); } catch { response.status(400).json({ error: "Homepage links must be valid page paths or HTTP/HTTPS links" }); return; } }
    }
    const content = parseHomepageContent(JSON.stringify(request.body));
    const record = await prisma.homepageContent.upsert({ where: { id: 1 }, update: { content: JSON.stringify(content) }, create: { id: 1, content: JSON.stringify(content) } });
    response.json({ content: parseHomepageContent(record.content) });
  } catch (error) {
    next(error);
  }
});

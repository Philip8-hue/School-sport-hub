import { Router, type RequestHandler } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { updatePlayerWithHistory } from "../lib/player-history.js";

export const sportsRouter = Router();
export { clubSchema, playerSchema, fixtureSchema, resultSchema, tableSchema, newsSchema };
const adminOnly: RequestHandler[] = [requireAuth, requireRole("ADMIN")];
const id = (value: string | string[]): number | null => {
  if (Array.isArray(value)) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};
const handleNotFound = (error: unknown): boolean => Boolean(error && typeof error === "object" && "code" in error && error.code === "P2025");
const clubSchema = z.object({ name: z.string().trim().min(1).max(100), slug: z.string().trim().min(1).max(120), sport: z.enum(["Male Football", "Female Football", "Male Basketball", "Female Basketball", "Volleyball"]), logoUrl: z.string().max(300).refine(value => /^(https?:\/\/|\/?images\/)/i.test(value), "Use an HTTP URL or an images path").optional().nullable() });
const playerSchema = z.object({ name: z.string().trim().min(1).max(100), fullName: z.string().trim().max(160).optional().nullable(), sport: z.string().trim().min(1).max(40), position: z.string().trim().max(160).optional().nullable(), jerseyNumber: z.number().int().min(0).max(999).optional().nullable(), photoUrl: z.string().trim().max(300).optional().nullable(), price: z.number().min(0).max(999).optional().nullable(), rating: z.number().min(0).max(10).optional().nullable(), matches: z.number().int().min(0).optional(), minutes: z.number().int().min(0).optional(), goals: z.number().int().min(0).optional(), assists: z.number().int().min(0).optional(), aces: z.number().int().min(0).optional(), points: z.number().int().min(0).max(1000000).optional(), rebounds: z.number().int().min(0).max(1000000).optional(), steals: z.number().int().min(0).max(1000000).optional(), turnovers: z.number().int().min(0).max(1000000).optional(), fouls: z.number().int().min(0).max(1000000).optional(), fieldGoalsMade: z.number().int().min(0).max(1000000).optional(), threePointersMade: z.number().int().min(0).max(1000000).optional(), freeThrowsMade: z.number().int().min(0).max(1000000).optional(), kills: z.number().int().min(0).max(1000000).optional(), digs: z.number().int().min(0).max(1000000).optional(), receives: z.number().int().min(0).max(1000000).optional(), setsPlayed: z.number().int().min(0).max(1000000).optional(), serveErrors: z.number().int().min(0).max(1000000).optional(), cleanSheets: z.number().int().min(0).max(1000000).optional(), saves: z.number().int().min(0).max(1000000).optional(), yellowCards: z.number().int().min(0).max(1000000).optional(), redCards: z.number().int().min(0).max(1000000).optional(), captain: z.boolean().optional(), blocks: z.number().int().min(0).optional(), clubId: z.number().int().positive().optional().nullable() });
const fixtureSchema = z.object({ sport: z.string().trim().min(1).max(40), startsAt: z.string().datetime(), venue: z.string().trim().max(160).optional().nullable(), status: z.enum(["SCHEDULED", "LIVE", "COMPLETED", "CANCELLED"]).optional(), homeClubId: z.number().int().positive().optional().nullable(), awayClubId: z.number().int().positive().optional().nullable() });
const resultSchema = z.object({ homeScore: z.number().int().min(0).max(999), awayScore: z.number().int().min(0).max(999), playedAt: z.string().datetime().optional().nullable() });
const tableSchema = z.object({ sport: z.string().trim().min(1).max(40), clubId: z.number().int().positive(), played: z.number().int().min(0), won: z.number().int().min(0), drawn: z.number().int().min(0), lost: z.number().int().min(0), points: z.number().int().min(0) });
const newsSchema = z.object({ sport: z.enum(["Male Football","Female Football","Male Basketball","Female Basketball","Volleyball"]).optional().nullable(), title: z.string().trim().min(1).max(180), slug: z.string().trim().min(1).max(200), excerpt: z.string().trim().max(300).optional().nullable(), content: z.string().trim().min(1), published: z.boolean().optional() });

sportsRouter.get("/clubs", async (request, response, next) => {
  try { response.json(await prisma.club.findMany({ where: request.query.sport ? { sport: String(request.query.sport) } : undefined, orderBy: { name: "asc" } })); } catch (error) { next(error); }
});
sportsRouter.post("/clubs", ...adminOnly, async (request, response, next) => {
  const parsed = clubSchema.safeParse(request.body); if (!parsed.success) { response.status(400).json({ error: "Invalid club details", details: parsed.error.flatten() }); return; }
  try { response.status(201).json(await prisma.club.create({ data: parsed.data })); } catch (error) { next(error); }
});
sportsRouter.patch("/clubs/:id", ...adminOnly, async (request, response, next) => {
  const clubId = id(request.params.id); const parsed = clubSchema.partial().safeParse(request.body); if (!clubId || !parsed.success) { response.status(400).json({ error: "Invalid club update" }); return; }
  try { response.json(await prisma.club.update({ where: { id: clubId }, data: parsed.data })); } catch (error) { if (handleNotFound(error)) { response.status(404).json({ error: "Club not found" }); return; } next(error); }
});
sportsRouter.delete("/clubs/:id", ...adminOnly, async (request, response, next) => {
  const clubId = id(request.params.id); if (!clubId) { response.status(400).json({ error: "Invalid club id" }); return; }
  try { await prisma.club.delete({ where: { id: clubId } }); response.status(204).send(); } catch (error) { if (handleNotFound(error)) { response.status(404).json({ error: "Club not found" }); return; } next(error); }
});

sportsRouter.get("/players", async (request, response, next) => {
  try { response.json(await prisma.player.findMany({ where: { ...(request.query.sport ? { sport: String(request.query.sport) } : {}), ...(request.query.clubId && Number.isInteger(Number(request.query.clubId)) && Number(request.query.clubId) > 0 ? { clubId: Number(request.query.clubId) } : {}) }, include: { club: true }, orderBy: { name: "asc" } })); } catch (error) { next(error); }
});
sportsRouter.post("/players", ...adminOnly, async (request, response, next) => {
  const parsed = playerSchema.safeParse(request.body); if (!parsed.success) { response.status(400).json({ error: "Invalid player details", details: parsed.error.flatten() }); return; }
  try { response.status(201).json(await prisma.player.create({ data: parsed.data, include: { club: true } })); } catch (error) { next(error); }
});
sportsRouter.patch("/players/:id", ...adminOnly, async (request, response, next) => {
  const playerId = id(request.params.id); const parsed = playerSchema.partial().safeParse(request.body); if (!playerId || !parsed.success) { response.status(400).json({ error: "Invalid player update" }); return; }
  try { response.json(await prisma.$transaction(tx => updatePlayerWithHistory(tx, playerId, parsed.data))); } catch (error) { if (handleNotFound(error)) { response.status(404).json({ error: "Player not found" }); return; } next(error); }
});
sportsRouter.delete("/players/:id", ...adminOnly, async (request, response, next) => {
  const playerId = id(request.params.id); if (!playerId) { response.status(400).json({ error: "Invalid player id" }); return; }
  try { await prisma.player.delete({ where: { id: playerId } }); response.status(204).send(); } catch (error) { if (handleNotFound(error)) { response.status(404).json({ error: "Player not found" }); return; } next(error); }
});

sportsRouter.get("/fixtures", async (request, response, next) => {
  try { response.json(await prisma.fixture.findMany({ where: request.query.sport ? { sport: String(request.query.sport) } : undefined, include: { homeClub: true, awayClub: true, result: true }, orderBy: { startsAt: "asc" } })); } catch (error) { next(error); }
});
sportsRouter.post("/fixtures", ...adminOnly, async (request, response, next) => {
  const parsed = fixtureSchema.safeParse(request.body); if (!parsed.success) { response.status(400).json({ error: "Invalid fixture details", details: parsed.error.flatten() }); return; }
  if (parsed.data.homeClubId && parsed.data.homeClubId === parsed.data.awayClubId) { response.status(400).json({ error: "Choose two different clubs" }); return; }
  try { response.status(201).json(await prisma.fixture.create({ data: { ...parsed.data, startsAt: new Date(parsed.data.startsAt) }, include: { homeClub: true, awayClub: true } })); } catch (error) { next(error); }
});
sportsRouter.patch("/fixtures/:id", ...adminOnly, async (request, response, next) => {
  const fixtureId = id(request.params.id); const parsed = fixtureSchema.partial().safeParse(request.body); if (!fixtureId || !parsed.success) { response.status(400).json({ error: "Invalid fixture update" }); return; }
  const data = { ...parsed.data, ...(parsed.data.startsAt ? { startsAt: new Date(parsed.data.startsAt) } : {}) };
  try { const existing = await prisma.fixture.findUnique({ where: { id: fixtureId } }); if (!existing) { response.status(404).json({ error: "Fixture not found" }); return; } const home = parsed.data.homeClubId === undefined ? existing.homeClubId : parsed.data.homeClubId; const away = parsed.data.awayClubId === undefined ? existing.awayClubId : parsed.data.awayClubId; if (home && home === away) { response.status(400).json({ error: "Choose two different clubs" }); return; } response.json(await prisma.fixture.update({ where: { id: fixtureId }, data, include: { homeClub: true, awayClub: true, result: true } })); } catch (error) { if (handleNotFound(error)) { response.status(404).json({ error: "Fixture not found" }); return; } next(error); }
});
sportsRouter.delete("/fixtures/:id", ...adminOnly, async (request, response, next) => {
  const fixtureId = id(request.params.id); if (!fixtureId) { response.status(400).json({ error: "Invalid fixture id" }); return; }
  try { await prisma.fixture.delete({ where: { id: fixtureId } }); response.status(204).send(); } catch (error) { if (handleNotFound(error)) { response.status(404).json({ error: "Fixture not found" }); return; } next(error); }
});

sportsRouter.get("/results", async (_request, response, next) => { try { response.json(await prisma.result.findMany({ include: { fixture: { include: { homeClub: true, awayClub: true } } }, orderBy: { playedAt: "desc" } })); } catch (error) { next(error); } });
sportsRouter.put("/fixtures/:fixtureId/result", ...adminOnly, async (request, response, next) => {
  const fixtureId = id(request.params.fixtureId); const parsed = resultSchema.safeParse(request.body); if (!fixtureId || !parsed.success) { response.status(400).json({ error: "Invalid result details" }); return; }
  try { const result = await prisma.$transaction(async tx => { const result = await tx.result.upsert({ where: { fixtureId }, update: { ...parsed.data, playedAt: parsed.data.playedAt ? new Date(parsed.data.playedAt) : null }, create: { fixtureId, homeScore: parsed.data.homeScore, awayScore: parsed.data.awayScore, playedAt: parsed.data.playedAt ? new Date(parsed.data.playedAt) : null }, include: { fixture: true } }); await tx.fixture.update({ where: { id: fixtureId }, data: { status: "COMPLETED" } }); return result; }); response.json(result); } catch (error) { next(error); }
});

sportsRouter.get("/tables", async (request, response, next) => { try { response.json(await prisma.leagueTable.findMany({ where: request.query.sport ? { sport: String(request.query.sport) } : undefined, include: { club: true }, orderBy: [{ points: "desc" }, { won: "desc" }] })); } catch (error) { next(error); } });
sportsRouter.put("/tables", ...adminOnly, async (request, response, next) => {
  const parsed = tableSchema.safeParse(request.body); if (!parsed.success) { response.status(400).json({ error: "Invalid table entry", details: parsed.error.flatten() }); return; }
  if (parsed.data.played !== parsed.data.won + parsed.data.drawn + parsed.data.lost) { response.status(400).json({ error: "Played must equal won + drawn + lost" }); return; }
  try { response.json(await prisma.leagueTable.upsert({ where: { sport_clubId: { sport: parsed.data.sport, clubId: parsed.data.clubId } }, update: parsed.data, create: parsed.data, include: { club: true } })); } catch (error) { next(error); }
});

sportsRouter.get("/news", (request, response, next) => { if (request.query.all === "true") { requireAuth(request, response, () => requireRole("ADMIN")(request, response, next)); } else next(); }, async (request, response, next) => { try { response.json(await prisma.newsArticle.findMany({ where: request.query.all === "true" ? undefined : { published: true }, orderBy: { publishedAt: "desc" } })); } catch (error) { next(error); } });
sportsRouter.post("/news", ...adminOnly, async (request, response, next) => {
  const parsed = newsSchema.safeParse(request.body); if (!parsed.success) { response.status(400).json({ error: "Invalid news article", details: parsed.error.flatten() }); return; }
  try { response.status(201).json(await prisma.newsArticle.create({ data: { ...parsed.data, publishedAt: parsed.data.published ? new Date() : null } })); } catch (error) { next(error); }
});
sportsRouter.patch("/news/:id", ...adminOnly, async (request, response, next) => {
  const articleId = id(request.params.id); const parsed = newsSchema.partial().safeParse(request.body); if (!articleId || !parsed.success) { response.status(400).json({ error: "Invalid news update" }); return; }
  const data = { ...parsed.data, ...(parsed.data.published !== undefined ? { publishedAt: parsed.data.published ? new Date() : null } : {}) };
  try { response.json(await prisma.newsArticle.update({ where: { id: articleId }, data })); } catch (error) { if (handleNotFound(error)) { response.status(404).json({ error: "News article not found" }); return; } next(error); }
});
sportsRouter.delete("/news/:id", ...adminOnly, async (request, response, next) => {
  const articleId = id(request.params.id); if (!articleId) { response.status(400).json({ error: "Invalid news id" }); return; }
  try { await prisma.newsArticle.delete({ where: { id: articleId } }); response.status(204).send(); } catch (error) { if (handleNotFound(error)) { response.status(404).json({ error: "News article not found" }); return; } next(error); }
});

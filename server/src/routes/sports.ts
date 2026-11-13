import { Router, type RequestHandler } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { updatePlayerWithHistory } from "../lib/player-history.js";

import { atomic, AuthError, limited } from "../lib/auth-security.js";
import { isPushEndpoint, matchPushConfig, notifyMatchFollowers } from "../lib/match-push.js";

import { matchStages, scoreSport } from "../lib/match-stages.js";

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
  try {
    const players = await prisma.player.findMany({ where: { ...(request.query.sport ? { sport: String(request.query.sport) } : {}), ...(request.query.clubId && Number.isInteger(Number(request.query.clubId)) && Number(request.query.clubId) > 0 ? { clubId: Number(request.query.clubId) } : {}) }, include: { club: true }, orderBy: { name: "asc" } });
    const counts = await prisma.matchGoal.groupBy({by: ["playerId"], where: {playerId: {in: players.map(player => player.id)}, result: {fixture: {status: "COMPLETED"}}}, _sum: {goals: true}});
    const goals = new Map(counts.map(row => [row.playerId, row._sum.goals ?? 0]));
    const assistCounts = await prisma.matchAssist.groupBy({by: ["playerId"], where: {playerId: {in: players.map(player => player.id)}, goal: {result: {fixture: {status: "COMPLETED"}}}}, _count: {_all: true}});
    const assists = new Map(assistCounts.map(row => [row.playerId, row._count._all]));
    response.json(players.map(player => ({...player, manualAssists: player.assists, assists: player.assists + (assists.get(player.id) ?? 0), manualGoals: player.goals, matchGoals: goals.get(player.id) ?? 0, goals: player.goals + (goals.get(player.id) ?? 0)})));
  } catch (error) { next(error); }
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
  try { response.json(await prisma.fixture.findMany({ where: request.query.sport ? { sport: String(request.query.sport) } : undefined, include: { homeClub: true, awayClub: true, result: {include: {scorers: {include: {assists: true}}}} }, orderBy: { startsAt: "asc" } })); } catch (error) { next(error); }
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

const pushEndpoint = z.string().max(2048).refine(isPushEndpoint);
const pushAuth = z.string().regex(/^[A-Za-z0-9_-]{22}$/);
sportsRouter.get("/match-push/config", (_request, response) => {
  response.set("Cache-Control", "no-store").json({ publicKey: matchPushConfig()?.publicKey ?? null });
});
sportsRouter.put("/fixtures/:id/push", async (request, response, next) => {
  const fixtureId = id(request.params.id);
  const body = z.object({endpoint: pushEndpoint, auth: pushAuth, p256dh: z.string().regex(/^B[A-Za-z0-9_-]{86}$/)}).safeParse(request.body);
  if (!fixtureId || !body.success) { response.status(400).json({error: "Invalid push subscription."}); return; }
  if (!matchPushConfig()) { response.status(503).json({error: "Phone alerts are not configured yet."}); return; }
  try {
    await limited(request, "match-push", body.data.endpoint, 30, 100);
    const { endpoint, auth, p256dh } = body.data;
    const result = await atomic(async tx => {
      const fixture = await tx.fixture.findUnique({ where: {id: fixtureId}, select: {status: true} });
      if (fixture?.status !== "LIVE") return false;
      await tx.matchPushSubscription.upsert({ where: {fixtureId_endpoint: {fixtureId, endpoint}},
        create: {fixtureId, endpoint, auth, p256dh}, update: {auth, p256dh, createdAt: new Date()} });
      await tx.matchPushSubscription.deleteMany({ where: {createdAt: {lt: new Date(Date.now() - 30 * 86400000)}} });
      return true;
    });
    if (!result) { response.status(409).json({error: "This match is no longer live."}); return; }
    response.status(204).end();
  } catch (error) { if (error instanceof AuthError) { response.status(error.status).json({error: error.message}); return; } next(error); }
});
sportsRouter.delete("/fixtures/:id/push", async (request, response, next) => {
  const fixtureId = id(request.params.id);
  const body = z.object({endpoint: pushEndpoint, auth: pushAuth}).safeParse(request.body);
  if (!fixtureId || !body.success) { response.status(400).json({error: "Invalid push subscription."}); return; }
  try {
    await prisma.matchPushSubscription.deleteMany({where: {fixtureId, ...body.data}});
    response.status(204).end();
  } catch (error) { next(error); }
});

const publicScorers = { orderBy: { playerId: "asc" as const }, select: { side: true, goals: true, player: { select: { name: true } }, assists: { orderBy: { goalNumber: "asc" as const }, select: { goalNumber: true, player: { select: { name: true } } } } } };

sportsRouter.get("/live-scores", async (_request, response, next) => {
  try {
    response.set("Cache-Control", "public, max-age=0, s-maxage=5");
    response.json(await prisma.fixture.findMany({
      where: { OR: [{ status: "LIVE" }, { status: "COMPLETED", result: { playedAt: { gte: new Date(Date.now() - 7200000) } } }] },
      include: { homeClub: true, awayClub: true, result: { include: { scorers: publicScorers } } },
      orderBy: [{ updatedAt: "desc" }, { id: "desc" }]
    }));
  } catch (error) { next(error); }
});

sportsRouter.get("/results", async (_request, response, next) => {
  try { response.json(await prisma.result.findMany({ where: { fixture: { status: "COMPLETED" } }, include: { scorers: publicScorers, fixture: { include: { homeClub: true, awayClub: true } } }, orderBy: { playedAt: "desc" } })); } catch (error) { next(error); }
});
sportsRouter.put("/fixtures/:fixtureId/result", ...adminOnly, async (request, response, next) => {
  const fixtureId = id(request.params.fixtureId);
  const parsed = resultSchema.extend({ status: z.enum(["LIVE", "COMPLETED"]).default("COMPLETED"), stage: z.string().trim().max(30).nullable().optional(), scorers: z.array(z.object({playerId: z.number().int().positive(), goals: z.number().int().min(1).max(999), assists: z.array(z.number().int().positive().nullable()).max(999).optional()})).max(80).optional() }).safeParse(request.body);
  if (!fixtureId || !parsed.success) { response.status(400).json({ error: "Invalid score details" }); return; }
  try {
    const { status, homeScore, awayScore, playedAt, stage, scorers } = parsed.data;
    const update = await atomic(async tx => {
      const previous = await tx.fixture.findUnique({ where: {id: fixtureId}, include: {result: {include: {scorers: {include: {assists: true}}}}} });
      const sport = previous && scoreSport(previous.sport);
      if (previous?.status === "COMPLETED" && previous.result && (previous.result.homeScore !== homeScore || previous.result.awayScore !== awayScore)) {
        const rounds = await tx.fantasyRound.findMany({where: {status: "PUBLISHED", sport: previous.sport}, select: {fixtureIds: true}});
        if (rounds.some(round => (JSON.parse(round.fixtureIds) as number[]).includes(fixtureId))) throw new AuthError(409, "This score is used in a published fantasy round and cannot be changed.");
      }
      if (stage && (status !== "LIVE" || !sport || !(matchStages[sport] as readonly string[]).includes(stage))) throw new AuthError(400, "Choose a score stage for this sport.");
      const existing = previous?.result?.scorers ?? [];
      const entered = scorers ?? existing;
      if (entered.length && sport !== "Football") throw new AuthError(400, "Goal scorers are only available for football fixtures.");
      if (new Set(entered.map(row => row.playerId)).size !== entered.length) throw new AuthError(400, "List each scorer once and enter their total goals.");
      const players = scorers?.length ? await tx.player.findMany({where: {id: {in: scorers.flatMap(row => [row.playerId, ...(row.assists ?? []).filter((id): id is number => id !== null)])}}}) : [];
      const attributed = entered.map(row => {
        const saved = existing.find(item => item.playerId === row.playerId);
        const player = players.find(item => item.id === row.playerId);
        const side = saved?.side ?? (player?.sport === previous?.sport && player?.clubId != null
          ? player.clubId === previous?.homeClubId ? "HOME" : player.clubId === previous?.awayClubId ? "AWAY" : null
          : null);
        if (!side) throw new AuthError(400, "Choose players from the two clubs in this fixture.");
        return {playerId: row.playerId, goals: row.goals, side};
      });
      for (const [side, maximum] of [["HOME", homeScore], ["AWAY", awayScore]] as const) {
        if (attributed.filter(row => row.side === side).reduce((total, row) => total + row.goals, 0) > maximum) {
          throw new AuthError(400, "The listed goal scorers exceed one club's score.");
        }
      }
      const assists = (scorers ?? []).flatMap(row => {
        const side = attributed.find(item => item.playerId === row.playerId)!.side;
        const clubId = side === "HOME" ? previous?.homeClubId : previous?.awayClubId;
        const saved = existing.find(item => item.playerId === row.playerId)?.assists ?? [];
        if (row.assists && row.assists.length !== row.goals) throw new AuthError(400, "Choose one assist option for each goal.");
        const selections = row.assists ?? Array.from({length: row.goals}, (_, index) => saved.find(item => item.goalNumber === index + 1)?.playerId ?? null);
        return selections.flatMap((playerId, index) => {
          if (playerId === null) return [];
          const player = players.find(item => item.id === playerId);
          const sameAssignment = saved.some(item => item.playerId === playerId && item.goalNumber === index + 1);
          if (playerId === row.playerId || (!sameAssignment && (!clubId || player?.clubId !== clubId || player.sport !== previous?.sport))) {
            throw new AuthError(400, "An assist must come from a different player on the scorer's team.");
          }
          return [{scorerId: row.playerId, goalNumber: index + 1, playerId}];
        });
      });
      const fixture = await tx.fixture.updateMany({
        where: { id: fixtureId, status: { in: status === "LIVE" ? ["SCHEDULED", "LIVE"] : ["SCHEDULED", "LIVE", "COMPLETED"] } },
        data: { status }
      });
      if (!fixture.count) return null;
      const score = { homeScore, awayScore, stage: status === "LIVE" ? stage ?? null : null, playedAt: status === "LIVE" ? null : playedAt ? new Date(playedAt) : previous?.result?.playedAt ?? new Date() };
      const result = await tx.result.upsert({ where: { fixtureId }, update: score, create: { fixtureId, ...score }, include: { fixture: { include: { homeClub: true, awayClub: true } } } });
      if (scorers !== undefined) {
        await tx.matchGoal.deleteMany({where: {resultId: result.id}});
        if (attributed.length) await tx.matchGoal.createMany({data: attributed.map(row => ({...row, resultId: result.id}))});
        if (assists.length) await tx.matchAssist.createMany({data: assists.map(row => ({...row, resultId: result.id}))});
      }
      const changed = previous?.status === "LIVE" && (status !== previous.status || previous.result?.homeScore !== homeScore || previous.result?.awayScore !== awayScore || (previous.result?.stage ?? null) !== score.stage);
      return { result, changed };
    });
    if (!update) { response.status(409).json({ error: "That match is unavailable for this score update." }); return; }
    if (update.changed) notifyMatchFollowers(update.result);
    response.json(update.result);
  } catch (error) { if (error instanceof AuthError) { response.status(error.status).json({error: error.message}); return; } next(error); }
});

sportsRouter.delete("/fixtures/:fixtureId/result", ...adminOnly, async (request, response, next) => {
  const fixtureId = id(request.params.fixtureId);
  if (!fixtureId) { response.status(400).json({ error: "Invalid fixture ID." }); return; }
  try {
    await atomic(async tx => {
      const fixture = await tx.fixture.findUnique({ where: { id: fixtureId }, include: { result: true } });
      if (!fixture?.result) throw new AuthError(404, "This fixture has no published score.");
      const rounds = await tx.fantasyRound.findMany({where: {status: "PUBLISHED", sport: fixture.sport}, select: {fixtureIds: true}});
      if (rounds.some(round => (JSON.parse(round.fixtureIds) as number[]).includes(fixtureId))) {
        throw new AuthError(409, "This score is used in a published fantasy round and cannot be deleted.");
      }
      if (fixture.status === "LIVE" || fixture.status === "COMPLETED") {
        await tx.fixture.update({ where: { id: fixtureId }, data: { status: "SCHEDULED" } });
      }
      await tx.result.delete({ where: { fixtureId } });
    });
    response.status(204).end();
  } catch (error) {
    if (error instanceof AuthError) { response.status(error.status).json({error: error.message}); return; }
    next(error);
  }
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

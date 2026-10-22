import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const memberRouter = Router();
export const approvalRouter = Router();
memberRouter.use(requireAuth);
approvalRouter.use(requireAuth, requireRole("ADMIN"));
const positive = z.number().int().positive();
const text = z.string().trim().min(1).max(3000);
const safeUser = { id: true, name: true, email: true } as const;
class MemberError extends Error { constructor(public status: number, message: string) { super(message); } }
const fail = (status: number, message: string): never => { throw new MemberError(status, message); };
const endpoint = (handler: (r: Request, s: Response) => Promise<unknown>) => async (r: Request, s: Response, next: NextFunction) => {
  try { await handler(r, s); } catch (e) {
    if (e instanceof MemberError) { s.status(e.status).json({ error: e.message }); return; }
    if (e instanceof z.ZodError) { s.status(400).json({ error: "Please check the form fields.", details: e.flatten() }); return; }
    const code = (e as { code?: string })?.code;
    if (code === 'P2002' || code === 'P2034') { s.status(409).json({ error: "This record changed or this player is already linked. Refresh and try again." }); return; }
    next(e);
  }
};
const fixtureIncludes = (fixture: { homeClubId: number | null; awayClubId: number | null }, clubId: number) => fixture.homeClubId === clubId || fixture.awayClubId === clubId;
const coach = async (userId: number, clubId: number) => {
  if (!await prisma.coachAssignment.findUnique({ where: { userId_clubId: { userId, clubId } } })) fail(403, "An approved coaching assignment for this team is required.");
};
const owner = async (userId: number, playerId: number) => {
  const link = await prisma.playerOwnership.findUnique({ where: { playerId }, include: { player: true } });
  if (!link || link.userId !== userId) fail(403, "An approved link to this player profile is required.");
  return link!;
};

memberRouter.get('/dashboard', endpoint(async (r, s) => {
  const userId = r.user!.id;
  const [playerLinks, coachLinks, requests, favorites, submissions, user] = await Promise.all([
    prisma.playerOwnership.findMany({ where: { userId }, include: { player: { include: { club: true, snapshots: { orderBy: { capturedAt: 'desc' }, take: 12 } } } } }),
    prisma.coachAssignment.findMany({ where: { userId }, include: { club: { include: { players: { orderBy: { name: 'asc' } }, tableEntries: true } } } }),
    prisma.accessRequest.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' } }),
    prisma.favorite.findMany({ where: { userId } }),
    prisma.reviewSubmission.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 50 }),
    prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { id: true, name: true, role: true, accountType: true } })
  ]);
  const privateClubIds = [...new Set([...playerLinks.map(l => l.player.clubId).filter((id): id is number => id !== null), ...coachLinks.map(l => l.clubId)])];
  const followedPlayers = await prisma.player.findMany({ where: { id: { in: favorites.filter(f => f.kind === 'PLAYER').map(f => f.targetId) } }, include: { club: true } });
  const followedClubs = await prisma.club.findMany({ where: { id: { in: favorites.filter(f => f.kind === 'CLUB').map(f => f.targetId) } } });
  const clubIds = [...new Set([...privateClubIds, ...followedClubs.map(c => c.id), ...followedPlayers.map(p => p.clubId).filter((id): id is number => id !== null)])];
  const [fixtures, announcements, lineups, availability, news] = await Promise.all([
    prisma.fixture.findMany({ where: clubIds.length ? { OR: [{ homeClubId: { in: clubIds } }, { awayClubId: { in: clubIds } }] } : undefined, include: { homeClub: true, awayClub: true, result: true }, orderBy: { startsAt: 'desc' } }),
    prisma.teamAnnouncement.findMany({ where: { clubId: { in: privateClubIds } }, include: { club: true }, orderBy: { createdAt: 'desc' }, take: 50 }),
    prisma.teamLineup.findMany({ where: { clubId: { in: privateClubIds } }, include: { fixture: { include: { homeClub: true, awayClub: true } }, club: true }, orderBy: { updatedAt: 'desc' }, take: 50 }),
    prisma.matchAvailability.findMany({ where: { OR: [ { playerId: { in: playerLinks.map(l => l.playerId) } }, ...coachLinks.map(l => ({ player: { clubId: l.clubId }, fixture: { OR: [{ homeClubId: l.clubId }, { awayClubId: l.clubId }] } })) ] }, include: { player: { select: { id: true, name: true, clubId: true } } } }),
    prisma.newsArticle.findMany({ where: { published: true }, orderBy: { publishedAt: 'desc' }, take: 6 })
  ]);
  const [players, clubs, standings] = await Promise.all([prisma.player.findMany({ select: { id: true, name: true, sport: true, clubId: true }, orderBy: { name: 'asc' } }), prisma.club.findMany({ orderBy: { name: 'asc' } }), prisma.leagueTable.findMany({ orderBy: [{ points: 'desc' }, { won: 'desc' }, { clubId: 'asc' }] })]);
  s.json({ user, playerLinks, coachLinks, requests, favorites, followedPlayers, followedClubs, submissions, fixtures, announcements, lineups, availability, news, standings, directory: { players, clubs } });
}));

memberRouter.put('/view', endpoint(async (r, s) => {
  const { accountType } = z.object({ accountType: z.enum(['PLAYER', 'COACH', 'FAN']) }).parse(r.body);
  await prisma.user.update({ where: { id: r.user!.id }, data: { accountType } });
  s.json({ accountType });
}));

memberRouter.get('/following', endpoint(async (r, s) => {
  const favorites = await prisma.favorite.findMany({ where: { userId: r.user!.id }, orderBy: { createdAt: 'desc' } });
  const [players, clubs] = await Promise.all([
    prisma.player.findMany({ where: { id: { in: favorites.filter(f => f.kind === 'PLAYER').map(f => f.targetId) } }, include: { club: true } }),
    prisma.club.findMany({ where: { id: { in: favorites.filter(f => f.kind === 'CLUB').map(f => f.targetId) } } })
  ]);
  s.json({ favorites, players, clubs });
}));

memberRouter.post('/requests', endpoint(async (r, s) => {
  const data = z.object({ kind: z.enum(['PLAYER', 'COACH']), targetId: positive, message: z.string().trim().min(10).max(1000) }).parse(r.body);
  if (data.kind === 'PLAYER') {
    if (!await prisma.player.findUnique({ where: { id: data.targetId } })) fail(404, 'Player not found.');
    if (await prisma.playerOwnership.findUnique({ where: { playerId: data.targetId } })) fail(409, 'This player profile is already linked to an account. Contact the admin if this is incorrect.');
  } else {
    if (!await prisma.club.findUnique({ where: { id: data.targetId } })) fail(404, 'Team not found.');
    if (await prisma.coachAssignment.findUnique({ where: { userId_clubId: { userId: r.user!.id, clubId: data.targetId } } })) fail(409, 'You already have access to this team.');
  }
  const key = { userId: r.user!.id, kind: data.kind, targetId: data.targetId };
  const previous = await prisma.accessRequest.findUnique({ where: { userId_kind_targetId: key } });
  if (previous?.status === 'PENDING') fail(409, 'This request is already awaiting admin review.');
  const request = await prisma.accessRequest.upsert({ where: { userId_kind_targetId: key }, create: { ...key, message: data.message }, update: { message: data.message, status: 'PENDING', reviewNote: '', reviewerId: null, reviewedAt: null } });
  s.status(201).json(request);
}));

memberRouter.patch('/players/:id/bio', endpoint(async (r, s) => {
  const playerId = positive.parse(Number(r.params.id));
  const { bio } = z.object({ bio: z.string().trim().max(1000) }).strict().parse(r.body);
  await owner(r.user!.id, playerId);
  const changed = await prisma.playerOwnership.updateMany({ where: { playerId, userId: r.user!.id }, data: { bio } });
  if (!changed.count) fail(403, 'Your player link was removed. Refresh the dashboard.');
  s.json({ bio });
}));

memberRouter.put('/availability', endpoint(async (r, s) => {
  const data = z.object({ playerId: positive, fixtureId: positive, status: z.enum(['AVAILABLE', 'UNAVAILABLE', 'UNSURE']), note: z.string().trim().max(500).default('') }).parse(r.body);
  const link = await owner(r.user!.id, data.playerId);
  const fixture = await prisma.fixture.findUnique({ where: { id: data.fixtureId } });
  if (!fixture || !link.player.clubId || !fixtureIncludes(fixture, link.player.clubId) || !['SCHEDULED','LIVE'].includes(fixture.status)) fail(400, 'Choose an upcoming fixture for your current team.');
  s.json(await prisma.matchAvailability.upsert({ where: { playerId_fixtureId: { playerId: data.playerId, fixtureId: data.fixtureId } }, create: data, update: { status: data.status, note: data.note } }));
}));

memberRouter.post('/announcements', endpoint(async (r, s) => {
  const data = z.object({ clubId: positive, title: z.string().trim().min(1).max(120), body: text }).parse(r.body);
  await coach(r.user!.id, data.clubId);
  s.status(201).json(await prisma.teamAnnouncement.create({ data: { ...data, authorId: r.user!.id } }));
}));

memberRouter.put('/lineups', endpoint(async (r, s) => {
  const data = z.object({ clubId: positive, fixtureId: positive, playerIds: z.array(positive).min(1).max(30), note: z.string().trim().max(1000).default('') }).parse(r.body);
  await coach(r.user!.id, data.clubId);
  const fixture = await prisma.fixture.findUnique({ where: { id: data.fixtureId } });
  if (!fixture || !fixtureIncludes(fixture, data.clubId) || !['SCHEDULED','LIVE'].includes(fixture.status)) fail(400, 'Choose an upcoming fixture for your assigned team.');
  const ids = [...new Set(data.playerIds)];
  if (await prisma.player.count({ where: { id: { in: ids }, clubId: data.clubId } }) !== ids.length) fail(400, 'Every selected player must belong to this team.');
  const entry = { playerIds: JSON.stringify(ids), note: data.note, authorId: r.user!.id };
  s.json(await prisma.teamLineup.upsert({ where: { clubId_fixtureId: { clubId: data.clubId, fixtureId: data.fixtureId } }, create: { clubId: data.clubId, fixtureId: data.fixtureId, ...entry }, update: entry }));
}));

memberRouter.post('/submissions', endpoint(async (r, s) => {
  const data = z.object({ kind: z.enum(['PROFILE_CORRECTION','ROSTER_CHANGE','MATCH_STATS']), playerId: positive.optional(), clubId: positive.optional(), fixtureId: positive.optional(), details: text }).parse(r.body);
  if (data.kind === 'PROFILE_CORRECTION') {
    if (!data.playerId || data.clubId || data.fixtureId) fail(400, 'Select your linked player profile.');
    await owner(r.user!.id, data.playerId!);
  } else {
    if (!data.clubId) fail(400, 'Select an assigned team.');
    await coach(r.user!.id, data.clubId!);
    if (data.playerId && !await prisma.player.findFirst({ where: { id: data.playerId, clubId: data.clubId } })) fail(400, 'Player must belong to the assigned team.');
    if (data.kind === 'MATCH_STATS' && !data.fixtureId) fail(400, 'Select the match these statistics belong to.');
    if (data.fixtureId) { const f = await prisma.fixture.findUnique({ where: { id: data.fixtureId } }); if (!f || !fixtureIncludes(f, data.clubId!)) fail(400, 'Fixture must involve this team.'); }
  }
  s.status(201).json(await prisma.reviewSubmission.create({ data: { ...data, userId: r.user!.id } }));
}));

memberRouter.put('/favorites', endpoint(async (r, s) => {
  const data = z.object({ kind: z.enum(['PLAYER','CLUB']), targetId: positive, following: z.boolean() }).parse(r.body);
  if (data.following) {
    const exists = data.kind === 'PLAYER' ? await prisma.player.findUnique({ where: { id: data.targetId } }) : await prisma.club.findUnique({ where: { id: data.targetId } });
    if (!exists) fail(404, 'This player or club is no longer available.');
  }
  const key = { userId: r.user!.id, kind: data.kind, targetId: data.targetId };
  if (data.following) await prisma.favorite.upsert({ where: { userId_kind_targetId: key }, create: key, update: {} });
  else await prisma.favorite.deleteMany({ where: key });
  s.json({ following: data.following });
}));

approvalRouter.get('/queue', endpoint(async (_r, s) => {
  const [requests, submissions, players, clubs] = await Promise.all([
    prisma.accessRequest.findMany({ include: { user: { select: safeUser } }, orderBy: { updatedAt: 'desc' } }),
    prisma.reviewSubmission.findMany({ include: { user: { select: safeUser } }, orderBy: { createdAt: 'desc' } }),
    prisma.player.findMany({ select: { id: true, name: true, sport: true, clubId: true } }), prisma.club.findMany()
  ]);
  s.json({ requests, submissions, players, clubs });
}));

approvalRouter.patch('/requests/:id', endpoint(async (r, s) => {
  const id = positive.parse(Number(r.params.id));
  const { status, reviewNote } = z.object({ status: z.enum(['APPROVED','REJECTED','REVOKED']), reviewNote: z.string().trim().max(1000).default('') }).parse(r.body);
  const result = await prisma.$transaction(async tx => {
    const request = await tx.accessRequest.findUnique({ where: { id }, include: { user: { select: { isActive: true } } } });
    if (!request) fail(404, 'Request not found.');
    if (status === 'REVOKED' ? request!.status !== 'APPROVED' : request!.status !== 'PENDING') fail(409, 'This request has already been reviewed. Refresh the queue.');
    if (status === 'APPROVED') {
      if (!request!.user.isActive) fail(400, 'Activate this account before approving access.');
      if (request!.kind === 'PLAYER') {
        if (!await tx.player.findUnique({ where: { id: request!.targetId } })) fail(404, 'Player no longer exists.');
        await tx.playerOwnership.create({ data: { userId: request!.userId, playerId: request!.targetId } });
      } else {
        if (!await tx.club.findUnique({ where: { id: request!.targetId } })) fail(404, 'Team no longer exists.');
        await tx.coachAssignment.create({ data: { userId: request!.userId, clubId: request!.targetId } });
      }
    }
    if (status === 'REVOKED') {
      if (request!.kind === 'PLAYER') await tx.playerOwnership.deleteMany({ where: { userId: request!.userId, playerId: request!.targetId } });
      else await tx.coachAssignment.deleteMany({ where: { userId: request!.userId, clubId: request!.targetId } });
    }
    const updated = await tx.accessRequest.updateMany({ where: { id, status: request!.status }, data: { status, reviewNote, reviewerId: r.user!.id, reviewedAt: new Date() } });
    if (!updated.count) fail(409, 'The request changed. Refresh and try again.');
    return { id, status };
  }, { isolationLevel: 'Serializable', timeout: 15000 });
  s.json(result);
}));

approvalRouter.patch('/submissions/:id', endpoint(async (r, s) => {
  const id = positive.parse(Number(r.params.id));
  const data = z.object({ status: z.enum(['APPROVED','REJECTED']), reviewNote: z.string().trim().min(1).max(1000) }).parse(r.body);
  const result = await prisma.reviewSubmission.updateMany({ where: { id, status: 'PENDING' }, data: { ...data, reviewerId: r.user!.id, reviewedAt: new Date() } });
  if (!result.count) fail(409, 'This submission has already been reviewed or was removed.');
  s.json({ id, ...data });
}));

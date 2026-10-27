import { Router, type Request, type Response, type NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth, requireRole, issueSession } from '../middleware/auth.js';
import { limited, audit, atomic, tokenRecord, AuthError } from '../lib/auth-security.js';
import { executiveCategories, executiveSports, isExecutiveSport } from '../lib/executive-access.js';
import { clubSchema, playerSchema, fixtureSchema, resultSchema, tableSchema, newsSchema } from './sports.js';
import { fantasyManagementRouter } from './fantasy.js';
import { updatePlayerWithHistory } from '../lib/player-history.js';

export const executiveRouter = Router();
class ScopeError extends Error { constructor(public status: number, message: string) { super(message); } }
const endpoint = (fn: (r: Request, s: Response) => Promise<unknown>) => async (r: Request, s: Response, n: NextFunction) => {
  try { await fn(r, s); } catch (e) { if (e instanceof ScopeError || e instanceof AuthError) { if (e.status === 429) s.setHeader('Retry-After','900'); s.status(e.status).json({ error: e.message }); return; } if (e instanceof z.ZodError) { s.status(400).json({ error: 'Check the form fields.', details: e.flatten() }); return; } n(e); }
};
const number = (value: unknown) => z.coerce.number().int().positive().max(2147483647).parse(value);
const fail = (message: string): never => { throw new ScopeError(403, message); };
const dummyHash = bcrypt.hashSync('unused-executive-login-password', 12);
// This dedicated sign-in grants no ADMIN access. Existing admin login is unchanged.
executiveRouter.post('/login', endpoint(async (r, s) => {
  const body = z.object({ email: z.string().trim().toLowerCase().email().max(254), password: z.string().min(1).max(128), sport: z.enum(executiveSports) }).parse(r.body);
  await limited(r, 'login', body.email);
  const user = await prisma.user.findUnique({ where: { email: body.email } });
  const valid = await bcrypt.compare(body.password, user?.passwordHash || dummyHash);
  if (!user?.isActive || !valid) { await audit(r, 'LOGIN_FAILED', user?.id); throw new ScopeError(401, 'Invalid email or password.'); }
  if (user.role !== 'EXECUTIVE' || user.executiveSport !== body.sport) { await audit(r, 'EXECUTIVE_LOGIN_DENIED', user.id); fail('This account has not been assigned executive access for the selected sport.'); }
  if (user.mfaEnabledAt) { const challenge = await atomic(tx => tokenRecord(tx, user.id, 'MFA_LOGIN', user.sessionVersion, 5)); s.json({ mfaRequired: true, challenge }); return; }
  await issueSession(s, user); await audit(r, 'LOGIN_SUCCEEDED', user.id);
  s.json({ user: { id: user.id, name: user.name, role: user.role }, mfaSetupRequired: !!user.mfaRequiredAfter && user.mfaRequiredAfter <= new Date() });
}));
executiveRouter.use(requireAuth, requireRole('EXECUTIVE'));
executiveRouter.use(async (r, s, next) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: r.user!.id } });
    if (!isExecutiveSport(user.executiveSport)) { s.status(403).json({ error: 'An overall admin must assign your sport.' }); return; }
    if ((user.mfaEnabledAt && !r.user!.mfaVerified) || (!user.mfaEnabledAt && user.mfaRequiredAfter && user.mfaRequiredAfter <= new Date())) { s.status(403).json({ error: 'Set up or complete two-step verification in Account security.', code: 'MFA_SETUP_REQUIRED' }); return; }
    s.locals.sport = user.executiveSport;
    if (!['GET','HEAD','OPTIONS'].includes(r.method)) await audit(r, 'EXECUTIVE_' + r.method + '_ATTEMPT', user.id, r.originalUrl.split('?')[0].slice(0,160));
    next();
  } catch (error) { next(error); }
});
async function scope(tx: any, r: Request, s: Response) {
  // Lock the account while saving so revocation or sport reassignment cannot race a write.
  const locked = await tx.user.updateMany({ where: { id: r.user!.id, role: 'EXECUTIVE', isActive: true, executiveSport: s.locals.sport, sessionVersion: r.user!.sessionVersion }, data: { executiveSport: s.locals.sport } });
  if (!locked.count) fail('Your executive access changed. Sign in again.');
  const sports = executiveCategories[s.locals.sport as keyof typeof executiveCategories];
  const check = (sport: string) => { if (!sports.includes(sport)) fail('You can only manage your assigned sport.'); };
  const club = async (clubId: number | null | undefined, sport: string) => { if (!clubId) return; const c = await tx.club.findUnique({ where: { id: clubId } }); if (!c || c.sport !== sport) fail('Choose a club from this sport and category.'); };
  return { sports, check, club };
}
executiveRouter.get('/dashboard', endpoint(async (_r, s) => {
  const sports = executiveCategories[s.locals.sport as keyof typeof executiveCategories];
  const where = { sport: { in: sports } };
  const [clubs, players, fixtures, tables, news] = await Promise.all([
    prisma.club.findMany({ where, orderBy: { name: 'asc' } }),
    prisma.player.findMany({ where, include: { club: true }, orderBy: { name: 'asc' } }),
    prisma.fixture.findMany({ where, include: { homeClub: true, awayClub: true, result: true }, orderBy: { startsAt: 'desc' } }),
    prisma.leagueTable.findMany({ where, include: { club: true }, orderBy: { points: 'desc' } }),
    prisma.newsArticle.findMany({ where, orderBy: { createdAt: 'desc' } })
  ]);
  s.json({ sport: s.locals.sport, sports, clubs, players, fixtures, tables, news });
}));
for (const method of ['post','patch'] as const) {
  executiveRouter[method]('/clubs' + (method === 'patch' ? '/:id' : ''), endpoint(async (r, s) => {
    const data = (method === 'post' ? clubSchema : clubSchema.partial()).parse(r.body);
    const result = await prisma.$transaction(async tx => {
      const access = await scope(tx, r, s);
      const existing = method === 'patch' ? await tx.club.findUniqueOrThrow({ where: { id: number(r.params.id) } }) : null;
      if (existing) access.check(existing.sport);
      const sport = data.sport ?? existing!.sport; access.check(sport);
      if (existing && sport !== existing.sport) fail('Create a separate club for another category; existing clubs cannot be moved.');
      return existing ? tx.club.update({ where: { id: existing.id }, data }) : tx.club.create({ data: data as z.infer<typeof clubSchema> });
    }); s.status(method === 'post' ? 201 : 200).json(result);
  }));
  executiveRouter[method]('/players' + (method === 'patch' ? '/:id' : ''), endpoint(async (r, s) => {
    const data = (method === 'post' ? playerSchema : playerSchema.partial()).parse(r.body);
    const result = await prisma.$transaction(async tx => {
      const access = await scope(tx, r, s);
      const existing = method === 'patch' ? await tx.player.findUniqueOrThrow({ where: { id: number(r.params.id) } }) : null;
      if (existing) access.check(existing.sport);
      const sport = data.sport ?? existing!.sport; access.check(sport);
      if (existing && sport !== existing.sport) fail('Ask an overall admin to move a player between categories.');
      await access.club(data.clubId === undefined ? existing?.clubId : data.clubId, sport);
      return existing ? updatePlayerWithHistory(tx, existing.id, data) : tx.player.create({ data: data as z.infer<typeof playerSchema> });
    }); s.status(method === 'post' ? 201 : 200).json(result);
  }));
  executiveRouter[method]('/fixtures' + (method === 'patch' ? '/:id' : ''), endpoint(async (r, s) => {
    const parsed = (method === 'post' ? fixtureSchema : fixtureSchema.partial()).parse(r.body);
    const result = await prisma.$transaction(async tx => {
      const access = await scope(tx, r, s);
      const existing = method === 'patch' ? await tx.fixture.findUniqueOrThrow({ where: { id: number(r.params.id) } }) : null;
      if (existing) access.check(existing.sport);
      const sport = parsed.sport ?? existing!.sport; access.check(sport);
      if (existing && sport !== existing.sport) fail('Fixtures cannot be moved between sport categories.');
      const home = parsed.homeClubId === undefined ? existing?.homeClubId : parsed.homeClubId;
      const away = parsed.awayClubId === undefined ? existing?.awayClubId : parsed.awayClubId;
      if (home && home === away) throw new ScopeError(400, 'Choose two different clubs.');
      await access.club(home, sport); await access.club(away, sport);
      const data = { ...parsed, ...(parsed.startsAt ? { startsAt: new Date(parsed.startsAt) } : {}) };
      return existing ? tx.fixture.update({ where: { id: existing.id }, data }) : tx.fixture.create({ data: { ...data, sport, startsAt: new Date(parsed.startsAt!) } });
    }); s.status(method === 'post' ? 201 : 200).json(result);
  }));
}
executiveRouter.put('/fixtures/:id/result', endpoint(async (r, s) => {
  const data = resultSchema.parse(r.body), fixtureId = number(r.params.id);
  const result = await prisma.$transaction(async tx => {
    const access = await scope(tx, r, s); const fixture = await tx.fixture.findUniqueOrThrow({ where: { id: fixtureId } }); access.check(fixture.sport);
    await access.club(fixture.homeClubId, fixture.sport); await access.club(fixture.awayClubId, fixture.sport);
    const values = { ...data, playedAt: data.playedAt ? new Date(data.playedAt) : null };
    const result = await tx.result.upsert({ where: { fixtureId }, create: { fixtureId, ...values }, update: values });
    await tx.fixture.update({ where: { id: fixtureId }, data: { status: 'COMPLETED' } }); return result;
  }); s.json(result);
}));
executiveRouter.put('/tables', endpoint(async (r, s) => {
  const data = tableSchema.parse(r.body);
  if (data.played !== data.won + data.drawn + data.lost) throw new ScopeError(400, 'Played must equal won + drawn + lost.');
  const result = await prisma.$transaction(async tx => { const access = await scope(tx, r, s); access.check(data.sport); await access.club(data.clubId, data.sport); return tx.leagueTable.upsert({ where: { sport_clubId: { sport: data.sport, clubId: data.clubId } }, create: data, update: data }); }); s.json(result);
}));
for (const method of ['post','patch'] as const) executiveRouter[method]('/news' + (method === 'patch' ? '/:id' : ''), endpoint(async (r,s) => {
  const data = (method === 'post' ? newsSchema : newsSchema.partial()).parse(r.body);
  const result = await prisma.$transaction(async tx => {
    const access = await scope(tx,r,s);
    const existing = method === 'patch' ? await tx.newsArticle.findUniqueOrThrow({ where: { id: number(r.params.id) } }) : null;
    if (existing) access.check(existing.sport || 'Unassigned');
    const sport = data.sport ?? existing?.sport;
    if (!sport) fail('Choose your sport category for this article.');
    access.check(sport!);
    const values = { ...data, sport, ...(data.published === undefined ? {} : { publishedAt: data.published ? existing?.publishedAt ?? new Date() : null }) };
    return existing ? tx.newsArticle.update({ where: { id: existing.id }, data: values }) : tx.newsArticle.create({ data: values as z.infer<typeof newsSchema> });
  }); s.status(method === 'post' ? 201 : 200).json(result);
}));
executiveRouter.use('/fantasy', fantasyManagementRouter);
// Intentionally no approval, user, homepage or destructive-delete endpoints.

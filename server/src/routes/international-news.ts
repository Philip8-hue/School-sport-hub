import { Router } from 'express';
import { createHash, timingSafeEqual } from 'node:crypto';
import { prisma } from '../lib/prisma.js';
import { fetchInternationalNews, isNewsSport } from '../lib/international-news.js';

const retention = 30 * 86400000;
export function createInternationalNewsRouter(db = prisma) {
  const router = Router();
  async function cleanup() { await db.internationalNews.deleteMany({ where: { publishedAt: { lt: new Date(Date.now() - retention) } } }); }
  async function refresh() {
    const key = process.env.THENEWSAPI_API_KEY;
    if (!key) return;
    const now = new Date();
    // This claim is shared across Vercel instances, rather than a process-local timer.
    await db.newsRefresh.upsert({ where: { id: 'international' }, create: { id: 'international', nextAt: new Date(0) }, update: {} });
    const claim = await db.newsRefresh.updateMany({ where: { id: 'international', nextAt: { lte: now } }, data: { nextAt: new Date(now.getTime() + 3600000) } });
    if (!claim.count) return;
    let success = false;
    for (const sport of ['football', 'basketball', 'volleyball'] as const) {
      try {
        const articles = await fetchInternationalNews(sport, key);
        for (const article of articles) {
          if (Date.parse(article.publishedAt) < Date.now() - retention) continue;
          const linkHash = createHash('sha256').update(article.url).digest('hex');
          // Repeat sightings must not extend the retention period.
          await db.internationalNews.upsert({ where: { sport_linkHash: { sport, linkHash } }, create: { ...article, publishedAt: new Date(article.publishedAt), sport, linkHash }, update: { title: article.title, source: article.source } });
        }
        await db.newsRefresh.upsert({ where: { id: sport }, create: { id: sport, nextAt: now, fetchedAt: new Date() }, update: { fetchedAt: new Date() } });
        success = true;
      } catch { /* Never expose provider URLs, credentials or response bodies. */ }
    }
    if (success) await db.newsRefresh.update({ where: { id: 'international' }, data: { fetchedAt: new Date() } });
  }
  router.get('/cleanup', async (request, response, next) => {
    const expected = process.env.CRON_SECRET ? `Bearer ${process.env.CRON_SECRET}` : '';
    const actual = request.get('authorization') || '';
    if (!expected || Buffer.byteLength(actual) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(actual), Buffer.from(expected))) { response.status(401).json({ error: 'Unauthorized' }); return; }
    try { await cleanup(); response.json({ ok: true }); } catch (error) { next(error); }
  });
  router.get('/', async (request, response, next) => {
    const sport = request.query.sport ?? 'football';
    const before = request.query.before;
    if (!isNewsSport(sport) || (before !== undefined && (typeof before !== 'string' || !/^\d+$/.test(before) || !Number.isSafeInteger(Number(before)) || Number(before) < 1 || Number(before) > 2147483647))) { response.status(400).json({ error: 'Invalid sport or page cursor.' }); return; }
    try {
      await cleanup();
      if (!before) await refresh();
      const cursor = before ? await db.internationalNews.findFirst({ where: { id: Number(before), sport } }) : null;
      if (before && !cursor) { response.json({ status: 'ready', articles: [], nextCursor: null, notice: 'Older headlines have expired. Refresh to see recent coverage.' }); return; }
      const rows = await db.internationalNews.findMany({ where: { sport, publishedAt: { gte: new Date(Date.now() - retention) }, ...(cursor ? { OR: [{ publishedAt: { lt: cursor.publishedAt } }, { publishedAt: cursor.publishedAt, id: { lt: cursor.id } }] } : {}) }, orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }], take: 13 });
      const state = await db.newsRefresh.findUnique({ where: { id: sport } });
      const articles = rows.slice(0, 12).map(({ title, url, source, publishedAt }) => ({ title, url, source, publishedAt }));
      const configured = Boolean(process.env.THENEWSAPI_API_KEY);
      if (configured && !articles.length && !state?.fetchedAt) { response.status(503).json({ status: 'unavailable', articles: [], message: 'International news is temporarily unavailable. Please try again later.' }); return; }
      response.json({ status: articles.length || configured ? 'ready' : 'not_configured', sport, articles, nextCursor: rows.length > 12 ? rows[11].id : null, updatedAt: state?.fetchedAt ?? null, stale: !state?.fetchedAt || state.fetchedAt.getTime() < Date.now() - 7200000, message: 'International news is coming soon. School coverage is available in the School news section.', notice: 'International headlines from The News API. Saved for 30 days. News coverage, not live scores; feeds are checked at most once an hour.' });
    } catch (error) { next(error); }
  });
  return router;
}
export const internationalNewsRouter = createInternationalNewsRouter();

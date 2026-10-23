const queries = { football: '(soccer | "Premier League" | "Champions League" | FIFA) -"American football"', basketball: 'basketball', volleyball: 'volleyball' };
export type NewsSport = keyof typeof queries;
export const isNewsSport = (value: unknown): value is NewsSport => typeof value === 'string' && Object.hasOwn(queries, value);
export function safeNewsUrl(value: unknown): string | null {
  try { const url = new URL(String(value)); return url.protocol === 'https:' && !url.username && !url.password ? url.href : null; } catch { return null; }
}
export async function fetchInternationalNews(sport: NewsSport, key: string, fetcher: typeof fetch = fetch) {
  const url = new URL('https://api.thenewsapi.com/v1/news/all');
  url.search = new URLSearchParams({ search: queries[sport], categories: 'sports', language: 'en', limit: '3', sort: 'published_at', api_token: key }).toString();
  const response = await fetcher(url, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error('News provider unavailable');
  const body = await response.json() as { data?: unknown[] };
  if (!Array.isArray(body.data)) throw new Error('Invalid news response');
  const seen = new Set<string>();
  return body.data.slice(0, 3).flatMap(raw => {
    if (!raw || typeof raw !== 'object') return [];
    const article = raw as Record<string, unknown>;
    const link = safeNewsUrl(article.url);
    if (!link || seen.has(link) || typeof article.title !== 'string' || !article.title.trim()) return [];
    seen.add(link);
    const date = typeof article.published_at === 'string' ? Date.parse(article.published_at) : NaN;
    if (!Number.isFinite(date) || date > Date.now() + 300000) return [];
    return [{ title: article.title.slice(0, 240), url: link, source: typeof article.source === 'string' ? article.source.slice(0, 100) : 'News publisher', publishedAt: new Date(date).toISOString() }];
  });
}

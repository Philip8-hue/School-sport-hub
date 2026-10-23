# School and international news

School news continues to use the existing admin News editor. School matches use your fixtures and results. International coverage has football (association football), basketball and volleyball filters and uses The News API's `/v1/news/all` endpoint, available on its free plan.

Only title, publisher/domain, publication date and original HTTPS link are saved. Technical fields provide sport classification, deduplication and pagination. Full articles, descriptions and images are not stored. Repeated links within a sport update the headline without changing its original publication date. The archive builds from future fetches; it does not import a month's history automatically.

## Configure your own provider account

1. Sign up at https://www.thenewsapi.com/. Its free plan currently advertises real-time availability, 100 requests/day and 3 articles/request. Coverage and ingestion speed depend on publishers, so it is not guaranteed instant reporting or live scores. Test all three sports, particularly volleyball. Review its terms and confirm permission for your public headline/link display and 30-day storage before enabling production delivery.
2. Copy your token directly into the original project's private `.env` as `THENEWSAPI_API_KEY="your-token"`. Restart the server. Never paste the token into chat, browser code or a committed file. `GNEWS_API_KEY` is no longer used.
3. Set `CRON_SECRET` to a random private value of at least 32 characters. Keep the same value in your local `.env` and Vercel if you need to test the protected cleanup endpoint. A local secret has been generated if absent.
4. In Vercel → Project → Settings → Environment Variables, add `THENEWSAPI_API_KEY` and `CRON_SECRET` for Production. Add the provider token to Preview only if you want previews to consume the same provider quota. Use a separate database for previews to avoid affecting production archives.
5. Before deploying, apply `npm run supabase:deploy` from the publish checkout with the correct private `SUPABASE_DATABASE_URL` provided securely in that shell or an ignored `.env`. Do not commit `.env`. The new migration only creates `InternationalNews` and `NewsRefresh`, with RLS enabled and browser roles denied direct access. Do not reset or re-import the database. The connected development Supabase and SQLite databases have already received this migration; rerunning deploy safely skips it.
6. Push your prepared publish checkout and deploy. Vercel's daily cron calls `/api/news/international/cleanup` at 03:00 UTC using `CRON_SECRET`. Check the cron is enabled in the project dashboard. Deployment and real provider delivery remain unverified until configured and deployed.

## Refreshes, retention and storage

The first visitor after the shared hourly deadline triggers three provider requests (one per sport); other visitors read saved headlines. A database claim coordinates this across Vercel instances, including cold starts. Typical continuous operation consumes 72 requests/day; shared use of the provider key by other apps can still exhaust its quota. Failed batches also wait until the next hourly deadline. An outage preserves saved headlines. Empty results are handled without inventing stories. Fetches are demand-driven, so without visitors there are no new articles collected. The cron only prunes; it does not fetch news.

The public API is `/api/news/international?sport=football` (or basketball / volleyball). It returns 12 archived headlines at a time, newest first. `nextCursor` enables `&before=...`. “Load older news” appends earlier headlines without replacing the current list.

Headlines older than 30 days **from publication** are excluded from every response and deleted during news requests or daily cleanup. On an idle deployed site, physical deletion can lag up to the next daily cron run (and longer if cron configuration fails); expired stories remain hidden. Locally, cleanup runs on news requests unless you schedule an authenticated cleanup call yourself. This never deletes school articles or other website data.

With three unique articles per sport per hour, the usual maximum is about 6,480 saved headline rows over 30 days, often fewer due to duplicates or idle periods. Storage includes database/index overhead and variable link lengths; it is small compared with saving images or article bodies, but is not zero. Monitor Supabase database usage.

Without a token, school coverage and any existing international archive still work; an empty international archive shows a coming-soon message. Real API delivery has now been verified locally for football, basketball and volleyball (three headlines each), and the first batch was saved to the configured Supabase database. The private token remains only in the original local .env; Vercel configuration and deployment are still required.

## Verification

`npm run test:news` tests provider mapping, all three sports, safe links, deduplication, concurrent refresh claims, expiry, pagination, fallback and protected cleanup using a disposable SQLite database and synthetic provider responses. These fixtures are not inserted into your website database.

`node scripts/deploy-news-archive.mjs` applies migrations to the configured original SQLite and Supabase databases after a SQLite backup, comparing hashes of all existing rows before and after. It prints no credentials or private row contents.

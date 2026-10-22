# Deploy to Vercel

The root `app.ts` exports the Express app without starting a local listener.
`vercel.json` selects Vercel's Express framework. `npm run vercel-build`
generates both Prisma clients, compiles the backend, and copies frontend assets
from `aul sports` into the generated `public` directory. Local development and
`npm start` still use the usual local server.

Admin workspace HTML is deliberately excluded from `public`. The Express
function serves it only after checking administrator access. The function's
`includeFiles` setting packages these protected HTML files for that purpose.

## Import the project

1. Push the prepared repository changes to `Philip8-hue/School-sport-hub`.
2. In Vercel choose **Add New → Project**, then **Import** that repository.
3. Keep the **Root Directory** at the repository root (`./`), not `aul sports`
   or `server`. Select **Express** if the framework is not detected.
4. The build command is `npm run vercel-build` (already set in `vercel.json`).
   The configured install command includes the Prisma and TypeScript build tools.
   Keep the output-directory override disabled; Express handles `public`.
   Use Node.js **22.x**, matching `package.json`.
5. Before deployment, expand **Environment Variables** and add the following
   for the **Production** environment. Do not paste surrounding quote marks.

   | Name | Value |
   | --- | --- |
   | `DATABASE_PROVIDER` | `supabase` |
   | `SUPABASE_DATABASE_URL` | Supabase Transaction pooler URL, port `6543`, with your database password |
   | `ALLOW_PUBLIC_REGISTRATION` | `true` |
   | `JWT_SECRET` | The existing private secret from your local `.env` (at least 32 characters) |
   | `NODE_ENV` | `production` |

   Do not use `VITE_` or `NEXT_PUBLIC_` prefixes for these secrets. The SQLite
   `DATABASE_URL`, a `PORT`, and Supabase API keys are not required. Vercel
   deployments refuse to use SQLite to prevent accidental local-only storage.
   For Preview deployments, use a separate test database and separate secret
   before enabling their environment values; Production-only settings are
   sufficient for the public deployment.
   Vercel's serverless instances should use transaction pooling. Session pooling
   on port `5432` can exhaust Supabase's session connection limit. Select
   **Transaction pooler** in Supabase's Connect dialog and use its complete URL
   for Vercel; keep a session/direct connection for Prisma migration commands.
6. Click **Deploy**. No migration or data import runs during the build:
   the existing Supabase database already contains the migrated records.

## Check the deployment

Open the production URL Vercel assigns:

- `/` — homepage, styling and images should load.
- `/api/health` — should return `{"status":"ok"}`.
- `/register.html` — create a regular account, then verify login.
- `/admin-login.html` — use your existing admin account to check players and
  homepage settings. Public registration always creates `USER`, never `ADMIN`.

If your site uses a different sign-up link, follow the registration link from
the login screen. API routes and pages share one domain, so the app accepts
same-origin requests without adding an allowed origin manually.

For future environment changes, open **Project → Settings → Environment
Variables**, save the values, then redeploy; existing deployments do not pick
up changes automatically. Pushes to the production branch deploy automatically
when Git integration is enabled. Never commit `.env`, database files, or backups.

The app's in-memory rate limits apply per server instance. Configure Vercel's
Firewall or a shared rate-limit store when you need limits across instances.

Reference: https://vercel.com/docs/frameworks/backend/express

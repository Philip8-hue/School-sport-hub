# School Sports Hub

School Sports Hub is a static sports website served by a small Node.js/Express API. The API uses Prisma ORM with SQLite for local development or Supabase PostgreSQL for hosted data. See [SUPABASE.md](SUPABASE.md) for migration and deployment instructions.

## Requirements

- Node.js 22 or newer
- npm

## Local setup

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

Open <http://localhost:5000> after the server starts. The `dev` command serves both the existing frontend and the API from the same Express process.

The SQLite database is created at `prisma/dev.db` and is intentionally ignored by Git. Back up this file before making database changes. Run `npm run db:generate` if the generated Prisma client is missing. Configure a random `JWT_SECRET` of at least 32 characters before signing in; see `AUTHENTICATION.md` for administrator setup.

## Production-style start

```bash
npm run build
npm start
```

The server reads `PORT` and `DATABASE_URL` from the environment. Defaults are shown in `.env.example`:

```dotenv
DATABASE_URL="file:./prisma/dev.db"
PORT=5000
```

## API

- `GET /api/health` returns `{ "status": "ok" }`.
- `GET /api/items` returns items ordered newest first.
- `POST /api/items` accepts JSON with a required `title` (up to 120 characters) and optional `content` (up to 2,000 characters), returning `201 Created` for a valid item.

The homepage includes a Community Posts form that uses these endpoints. New posts are stored in SQLite and are loaded again when the page is refreshed.

## Validation

```bash
npm test
```

Tests compile the server and run HTTP integration checks against an isolated temporary SQLite database. They do not change your local sports records or users. On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`.

## Website and admin workspace

The public website uses a shared responsive design in `aul sports/design.css`, with mobile navigation, sport filters, database-backed fixtures/results, player search, and accessible loading/error states. Open `/admin-login.html` for administrator sign-in and `/admin.html` for the workspace. The admin design is in `aul sports/admin-design.css`. The shared university sports theme in `aul sports/varsity.css` loads after each page's structural styles and defines the forest/brass palette, typography, pitch illustration layout, responsive cards and admin form spacing. Its design was reviewed using Anthropic's `frontend-design` skill.

Draft news requires an administrator. Public registration is controlled by `ALLOW_PUBLIC_REGISTRATION`; the registration form reports when it is closed. Sessions renew on authenticated activity, and the admin workspace keeps an active session alive while you edit. If a session expires, an in-place login preserves your form and retries the save. Permission or origin errors are displayed without logging you out. Localhost and loopback addresses on the same port are accepted; configure comma-separated `ALLOWED_ORIGINS` for additional hosting domains. Login and public posting have basic in-memory rate limits. For deployment behind a proxy, configure trusted proxies and shared rate-limit storage for your hosting environment.

The Homepage editor controls all homepage copy, navigation labels, links, placeholders, and data messages through `aul sports/homepage-copy.json`. Live records (club/player names, statistics, fixtures, results, standings and articles) are edited in their respective admin sections. “The ones to watch” selects the three highest rated players, with appearances and then name breaking ties; ratings are entered by the administrator. Its heading and explanation are editable.

The sun/moon control switches between light and dark themes on public and admin pages. It starts with the device preference and saves manual choices in browser storage. `theme.js` applies the selected theme before rendering; `theme.css` defines the muted dark palette and the larger, centered homepage illustration.

Player forms and public statistics use sport-specific season totals. Football includes goals, assists, minutes, saves, clean sheets and cards. Basketball includes points, rebounds, assists, steals, blocks, turnovers, fouls and shooting totals. Volleyball includes aces, blocks, kills, digs, receives, assists, sets played and service errors.

Live matches come from fixtures with `LIVE` status. Standings are maintained explicitly in the admin workspace; saving a result marks the fixture completed but does not calculate league points automatically. Fantasy squads remain stored locally in each browser.

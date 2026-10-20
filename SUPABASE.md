# Supabase database

The Express API can use either the original SQLite database or Supabase PostgreSQL.
Supabase stores the data; the Express server still needs to be hosted separately.
Existing logins remain app accounts, not Supabase Auth accounts.

## Configure and migrate

1. Save the **Session pooler** PostgreSQL URL from Supabase's Connect dialog in
   `SUPABASE_DATABASE_URL` in the root `.env`. Replace the password placeholder
   with the database password, URL-encoding special characters. Keep secrets out
   of Git. Keep `DATABASE_URL="file:./prisma/dev.db"` for the local source.
2. Stop the local server before the final import so no new edits are left behind
   in SQLite. Leave `DATABASE_PROVIDER=sqlite` until verification succeeds.
3. Run:

   ```sh
   npm install
   npm run db:generate
   node scripts/check-supabase.mjs
   npm run supabase:deploy
   npm run supabase:import
   ```

   The import creates a consistent, ignored backup under `prisma/backups/`,
   checks source integrity and foreign keys, and copies all nine model tables
   in one transaction. IDs, timestamps, password hashes and relations are
   preserved. Every field is compared before commit; serial sequences are reset
   so future inserts receive new IDs. If any target table already has records,
   import stops without overwriting them. Never reset a Supabase database to
   make this script run. To verify an earlier import use
   `npm run supabase:verify` (compares against current local SQLite data).
4. After successful verification, add `DATABASE_PROVIDER="supabase"` to `.env`,
   then run `npm run build` and restart the server.
5. Set `DATABASE_PROVIDER=supabase`, `SUPABASE_DATABASE_URL`, your existing
   `JWT_SECRET`, and other server environment settings on your hosting service.
   Generate both clients during deployment (`npm run db:generate`), build the
   backend, and start it with `npm start`. Use `npm run supabase:deploy` for
   PostgreSQL migrations; `npm run db:migrate` remains SQLite-only.

PostgreSQL has a separate migration history in `prisma/supabase/migrations`.
Do not run the SQLite migrations against Supabase. When updating model fields,
edit `prisma/schema.prisma` and run `npm run db:generate`; it derives the
PostgreSQL schema and generates both clients. Create a PostgreSQL migration for
any subsequent schema changes before deploying them.

The migration enables RLS and revokes table access from `anon` and
`authenticated` on the app tables. Browser requests use the Express API, whose
database role must have permission to access these tables. Never expose the
database connection string in frontend JavaScript. Supabase's service keys are
not needed by this app.

## Local development and recovery

Set `DATABASE_PROVIDER=sqlite` to use the untouched local database. After the
switch, SQLite and Supabase are separate databases: edits do not synchronize.
Returning to the old local database will not include subsequent Supabase edits.
Tests explicitly select an isolated SQLite database and never write to Supabase.
Keep the pre-migration backup private; it contains account password hashes.

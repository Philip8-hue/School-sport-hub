# Authentication and admin foundation

The API now supports password authentication with role-based access control.

## Setup

1. Copy `.env.example` to `.env`.
2. Set `JWT_SECRET` to a random value of at least 32 characters. Never commit `.env`.
3. Install dependencies and generate the Prisma client:

```powershell
npm.cmd install
npm.cmd run db:generate
npm.cmd run db:migrate
```

Public registration is disabled by default. To enable it temporarily, set:

```env
ALLOW_PUBLIC_REGISTRATION="true"
```

For production, keep public registration disabled unless the product requires it.

## Create the first administrator

After the migration, create or promote an administrator with:

```powershell
npm.cmd run admin:create -- admin@example.com "use-a-strong-password-at-least-12-chars" "Site Admin"
```

The command hashes the password and sets the account role to `ADMIN`.

## Routes

- `POST /api/auth/register` — creates a `USER` only when public registration is enabled.
- `POST /api/auth/login` — validates credentials and sets an HTTP-only auth cookie.
- `GET /api/auth/me` — returns the current authenticated user.
- `POST /api/auth/logout` — clears the auth cookie.
- `GET /api/admin/ping` — protected example route requiring the `ADMIN` role.

Example login body:

```json
{
  "email": "admin@example.com",
  "password": "use-a-strong-password-at-least-12-chars"
}
```

The cookie is HTTP-only, uses `SameSite=Lax`, and is marked `Secure` in production. The API verifies the token and checks the current database account on every protected request, so deactivated users are rejected even if their token has not expired.

## Adding protected routes

Use the middleware on any future route:

```ts
router.get("/players", requireAuth, handler);
router.post("/players", requireAuth, requireRole("ADMIN", "EDITOR"), handler);
```

Do not trust a role sent by the browser. The role comes from the signed token and is rechecked against the database by `requireAuth`.

## Production requirements still to add

The admin dashboard and CRUD routes are implemented. Login/public posting rate limits, same-origin checks, and isolated HTTP integration tests are included. Rate limits are stored in memory and reset when the process restarts. The cookie expires with its JWT and is renewed after authenticated requests. Active editing triggers a keepalive; expired sessions can be restored with an in-place sign-in that preserves unsaved forms and retries the original request. A 403 permission/origin error does not trigger logout. Before a production launch, configure backups, deployment-appropriate rate-limit storage and proxy settings, and any required password recovery, email verification, and audit logging.

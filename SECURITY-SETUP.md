# Account security setup and deployment

## What has changed

Existing account IDs, emails, password hashes, roles, approvals, profiles, favorites, fantasy entries and all sports data remain in place. Existing users do not register again. Existing accounts retain their access while they verify their email; email verification is currently optional for all accounts. Registration, approvals, following and fantasy work without verification. Public information and their account/security screens remain available.

All new sign-ins create revocable database sessions. Signing out revokes the current session. Account security also supports signing out one session or every device. A password change or password reset revokes every session and pending authentication link/challenge. Session cookies are HttpOnly, SameSite=Lax, and Secure on Vercel/production. The access cookie renews while active; the database imposes a maximum 7-day session lifetime.

An additive migration accepts existing signed cookies for 7 days from migration, upgrading each to a database session on use. Logging out revokes that upgraded session and blocks its original cookie too. Password changes and log-out-all immediately end this compatibility path. Existing administrators receive a fixed 14-day enrollment grace period from migration. Their deadline is shown in Account security. After it passes, the admin can still sign in and set up MFA, but admin tools require completion. Enrollment immediately revokes old sessions and issues a new verified session. New/promoted administrators also get a dated 14-day setup window.

Authenticator setup requires the existing password, a private QR code/manual key, and a valid 6-digit code. TOTP secrets are encrypted using AES-256-GCM; setup expires in 10 minutes. A used TOTP time step cannot be replayed. Ten single-use 96-bit recovery codes are shown once and stored as keyed hashes. Replacement codes invalidate the old set. An administrator who loses their phone can sign in with the password plus one recovery code, remove the old authenticator using another code and their password, and enroll a replacement. There is no email-only MFA bypass. Keep at least two codes available for this process; codes can also be regenerated after signing in with a remaining factor.

If an administrator loses both the authenticator and all recovery codes, there is deliberately no public bypass. The site owner must verify identity and use a controlled database recovery procedure with an audit trail. Do not clear MFA just because someone requests it by email.

Forgot password is linked from both login pages. Reset links contain 256-bit random tokens, expire in 15 minutes, and are single-use. Only SHA-256 hashes are stored. A successful reset does not disable MFA or replace recovery codes. The reset screen receives the token in the URL fragment and removes it from the address bar; it is never sent as a URL query to the server. Opening the email link does not consume it until the new password is submitted. A verification link lasts 24 hours and is also single-use and hashed. Requesting a new link invalidates previous unused links for that purpose. Email verification and reset confirmations do not disclose whether an account exists.

Login limits are shared database counters: 10 attempts/account/15 minutes and 100/IP/15 minutes across both login routes. MFA has separate account and IP limits. Reset and verification requests allow 3/address/hour and 20/IP/hour while retaining the same confirmation on rate limiting. Password changes, MFA enrollment and token submission have additional limits. Account/IP keys use HMAC rather than storing raw addresses. No Redis service is needed; the configured Supabase database shares limits across Vercel instances. Transactions use serializable isolation with bounded, jittered conflict retries, including PostgreSQL adapter write-conflict responses.

Security events cover failed and successful sign-ins, MFA, recovery-code replacement, password changes/resets, revocation, mail failures, and admin write attempts. Admin attempts are recorded before a protected write; an attempt is not a success receipt. Event data contains time, event type, account ID when known, hashed IP, and a constrained resource path, without request bodies, passwords, email-link tokens, OTPs, recovery codes, cookies or encryption keys. View the latest 100 events in Account security as an admin. Email-provider logs necessarily have access to the email content for delivery; keep access to that provider restricted and disable link/open tracking for these transactional messages.

## Email service: Resend

Use https://resend.com. This implementation calls its server-side API directly; no public API key is exposed to the browser. Official domain setup: https://resend.com/docs/dashboard/domains/introduction. A domain or sending subdomain you control is required to send to your users; a free vercel.app subdomain is not a domain you control for email DNS.

1. Sign into your own Resend account.
2. Add a sending domain/subdomain you own, for example `mail.your-domain.com`.
3. Add the DNS records that Resend displays at your domain's DNS provider and wait for Resend to show Verified. Do not replace unrelated website or mailbox DNS records.
4. Create a sending-only API key scoped to the verified domain where the service supports it.
5. Choose a sender on that domain, for example `Sports Hub <noreply@mail.your-domain.com>`. Disable email open/click tracking for reset and verification messages.
6. Put the key into `.env` locally and Vercel environment settings directly. Never send it in chat or commit `.env`.

## Environment variables

Keep all existing database settings and JWT_SECRET unchanged. These additional settings are required:

| Variable | Local value | Vercel Production value |
| --- | --- | --- |
| APP_BASE_URL | `http://localhost:5000` | `https://school-sport-hub.vercel.app` (or your actual canonical HTTPS domain) |
| AUTH_ENCRYPTION_KEY | Generated privately in the project's `.env` | Copy the same existing 64-character hex value directly from `.env` into Vercel |
| RESEND_API_KEY | Your Resend sending key | Your Resend sending key |
| EMAIL_FROM | Your verified sender | Your verified sender |

The local AUTH_ENCRYPTION_KEY and APP_BASE_URL have been added without displaying any secret. Resend key/sender have not been configured, and real email delivery is not yet working. Do not casually rotate AUTH_ENCRYPTION_KEY after enrollment: previous authenticator secrets become unreadable. Back it up securely. If changing it is unavoidable, plan recovery and re-enrollment first. JWT_SECRET also protects recovery-code and rate-limit hashes and must remain stable across instances. Use distinct secrets and databases for unrelated staging environments. Do not configure AUTH_TEST_EMAIL_DIR or NODE_ENV=test on Vercel.

## Local setup

1. Open the original project `.env` in VS Code (not a screenshot or chat).
2. Add RESEND_API_KEY and EMAIL_FROM; keep the generated AUTH_ENCRYPTION_KEY and local APP_BASE_URL.
3. Restart the local server. Visit `/security.html` after signing in. Its status should show email delivery configured; this checks presence/URL validity, not domain deliverability.
4. Send yourself a verification message. Follow its link and click Verify my email.
5. As admin, set up an authenticator and save recovery codes offline. Test a separate private-window login with a code.
6. Test Forgot password using your own email, submit a new password, then verify old sessions have ended and MFA is still requested.

## Vercel rollout

The correct Git checkout is `.publish-checkout`, pointing to `Philip8-hue/School-sport-hub`. Source and generated clients are prepared there. No GitHub account is switched and nothing is pushed automatically.

1. In Vercel, select the project, then Settings → Environment Variables. Add the four variables above for Production. Copy private values directly from your local file/provider; do not paste them into chat. Keep DATABASE_PROVIDER=supabase, SUPABASE_DATABASE_URL and the existing JWT_SECRET.
2. Apply the additive Supabase migration `20261022200000_auth_security` using `npm run supabase:deploy` from the original project with its existing database URL. This migration has already been applied and verified in this workspace’s SQLite and configured Supabase databases; do not import sports data again.
3. Commit/push the prepared publish checkout using your own GitHub credentials. Let Vercel build the new commit, or redeploy after updating environment variables. A redeploy of an older commit does not contain the new code.
4. Confirm the deployment is Ready. Test verification, reset email delivery, MFA, recovery codes and log-out-all with accounts you own. Check Security activity for EMAIL_DELIVERY_FAILED if messages do not arrive.
5. Tell existing administrators to enroll before the displayed deadline. Existing regular users can verify through Account security without creating a new account.

## Validation and maintenance

`npm run test:security` uses a completely separate SQLite database and a local captured-email folder. It tests migration preservation, verification, hashed tokens, reset expiry/reuse, password changes, session revocation, admin MFA and recovery, TOTP replay rejection, reset without MFA bypass, persistent limits across a server restart and secret-free security logs. Tests do not send actual emails. Other regression fixtures are explicitly verified by their test drivers so membership and fantasy tests continue to exercise normal verified-user behavior.

Expired session/link/counter rows do not grant access. Schedule periodic removal of old expired auth rows and an appropriate security-log retention policy through your database maintenance process; do not delete active rows or recovery codes. Keep server/dependency updates and backups current. This is authentication hardening, not a guarantee that the entire application is free of vulnerabilities.

## Current rollout: optional email verification

`REQUIRE_EMAIL_VERIFICATION` defaults to false when absent. It is false in the local `.env` and `.env.example`. No existing account verification flags are erased: the runtime switch also bypasses verification restrictions for accounts that registered earlier. Unverified users are not shown email reminders during normal use. Registration opens their account dashboard directly and skips automatic verification emails while verification is optional. Optional verification tools remain in Account security, with sending disabled in that screen until email delivery is configured.

For the current Vercel deployment, set `ALLOW_PUBLIC_REGISTRATION=true` and `REQUIRE_EMAIL_VERIFICATION=false`. Keep all database/JWT settings unchanged, retain the existing `AUTH_ENCRYPTION_KEY`, and use the production `APP_BASE_URL`. Password-reset emails still cannot be delivered until an email provider is configured. Admin MFA, approvals and all other authorization/session protections remain in place.

After email sending has been configured and tested, set `REQUIRE_EMAIL_VERIFICATION=true` and redeploy. This will require verification for accounts created under the newer registration flow (including accounts registered during optional mode); original legacy accounts retain their existing access. Announce that change before enabling it. No schema migration or data import is needed for this rollout switch.

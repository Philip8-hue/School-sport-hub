# Sport executive access

Overall administrators retain their existing ADMIN role and all permissions. Executives use a separate EXECUTIVE role and one admin-assigned scope: football, basketball or volleyball. Football includes Male Football and Female Football; basketball includes both male and female competitions. Volleyball has its own category. Choosing a sport at sign-in does not grant access.

## Give someone executive access

1. Ask the executive to create a normal Sports Hub account with their own email and password. The fan/player/coach preference does not give them staff access.
2. Sign in as an existing overall admin and open **Users**.
3. Find that account. Choose **Executive sport**, then **Make sport executive**. The overall admins are not eligible for conversion through this control.
4. The executive opens **Sport executive sign in** from the admin login page, chooses their assigned sport and signs in using their own account.
5. To change their sport, select the new sport on Users and choose **Update executive access**. To remove access, choose **Make user** or **Disable**. All previous sessions immediately become invalid after these permission changes.

No actual executive accounts are created automatically. Existing overall admin roles, passwords, two-step settings, profile links and other data are unchanged.

## What executives can manage

The workspace has Players, Clubs, Fixtures, Results, League tables, News and Fantasy tabs. Executives can add and edit their own sport's records, enter official results and standings, publish/unpublish school articles, create fantasy rounds, adjust deadlines before locking, save official player match statistics, and publish final fantasy points. Existing fantasy validation, scoring, deadlines and publication locks still apply. Publication remains final.

Executives cannot approve player/coach requests, manage users or permissions, edit the homepage, access the overall admin workspace, or change another sport's records. There are no executive destructive-delete endpoints. Existing overall admins keep those tools. General school news without a sport assignment stays with overall admins. Overall admins can assign older school articles to a sport using the new News form category field; executives can then edit the relevant articles. Automated international headlines are handled by the existing provider integration, not the school news editor.

Club and fixture categories cannot be moved through executive edits. Player transfers between categories must be made by an overall admin. Club selectors and server checks prevent assigning players or fixtures to clubs from another category. Both existing and proposed sport values and referenced IDs are checked. The executive account row is locked during writes to prevent racing sport reassignment or revocation.

## Sign-in and security

Executive sign-in is `/executive-login.html`; workspace is `/executive.html`; scoped API is `/api/executive`. Existing overall admin sign-in and `/api/admin` permissions remain ADMIN-only. Regular registration cannot create executives or choose permissions. HTML is excluded from public CDN files and protected by server authorization.

Executives receive the same authenticator setup and recovery-code tools as admins. A newly assigned executive has a 14-day setup window. Set up two-step verification in Account security. After the deadline, the workspace requires enrollment. Once enabled, sign-in requires an authenticator code or unused recovery code, including when signing in through the regular page. Password recovery retains this protection. Permission changes invalidate existing sessions and pending authentication challenges. Important executive writes are recorded in security logs without bodies, passwords, tokens or authenticator secrets. Only overall admins can read the site security logs.

## Deployment and checks

The two additive migrations add nullable `User.executiveSport` and `NewsArticle.sport`. Existing users remain unchanged and old articles remain general school news. `scripts/deploy-executives.mjs` backs up SQLite and compares all pre-existing column values in every table before/after applying both SQLite and Supabase migrations. No reset or data import is needed. No new environment variables are required; the existing AUTH_ENCRYPTION_KEY supports staff two-step setup.

Run `npm run test:executives` for isolated permission checks covering all sport scopes, forged grants, tampered IDs, cross-sport references, news and fantasy editing, approval denial, session revocation and authenticator/recovery login. The tests verify that two pre-existing overall admin rows remain unchanged. The full `npm test` suite also covers the original admin, membership, fantasy, photo and security behavior.

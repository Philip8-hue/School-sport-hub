# Verified profiles, teams and dashboards

`accountType` selects a dashboard; it never grants access. Public registration
continues to create `USER` accounts. Actual permissions come from approved
`PlayerOwnership` and `CoachAssignment` records. A user can hold both types of
assignment and several profiles/teams without creating another login.

## Admin workflow

Open **Admin → Approvals**. The default queue contains pending profile claims,
coaching requests, profile corrections, roster proposals and match submissions.
Verify the person through university/team records before approving an account
link. A profile can belong to only one account, enforced by the database.

Use **Approved access** to revoke an assignment. Subsequent API requests check
the database again; changing a dashboard tab or forging a role never restores
access. The review stores the admin ID, decision time and response. Rejected
or revoked applicants can resubmit with new information.

Roster/statistics submissions are proposals, not automatic official edits.
Check the evidence, update the appropriate official record using the existing
admin tools, then mark the proposal reviewed/applied with a response. Reject
unverified proposals with an explanation. Applicants see the decision in their
own dashboards.

## Player dashboard

Request a link to an existing player record and explain the connection. While
pending, only public information is available. An approved owner gets their
statistics, bio editor, fixtures/results, performance history, match availability,
private team announcements and proposed lineups. Only the bio is directly
editable; jersey number, captaincy, official stats and club membership require
admin changes. Photo areas intentionally remain blank.

History records actual administrative changes to season statistics from this
release onward. It is not invented historical match data. Availability is
restricted to the player's own current team's fixtures and visible to approved
coaches of that team. It is never included in public player API responses.

## Coach dashboard

Request one or more team assignments. Approved coaches see each assigned
team's squad/performance, standings, fixtures/results and player availability.
They can save proposed match squads, post private announcements and submit
roster or statistics proposals. Every chosen lineup player must belong to that
team, and the fixture must involve that team. Coach access does not grant
access to unrelated teams or the admin workspace.

## Fan dashboard

Fans need no approval. Clubs and players can be followed/unfollowed, and
favourites persist on the account. The feed shows matches/results involving
those clubs or players' clubs, published news, and links to tables and fantasy
pages. Following a team never grants its private announcements, lineups or
availability. With no favourites the fan sees the general public match feed.

The public navigation includes **Following**, a dedicated list of saved clubs
and players with profile links and Unfollow controls. The homepage includes a
signed-in following summary. Directories and player cards show a muted
Following state for saved items while keeping profile links usable. A short
user guide is available through **Quick guide (PDF)** in the public footer.

## Deployment and verification

Both SQLite and PostgreSQL migrations are additive. Supabase tables enable
RLS and deny `anon`/`authenticated` direct table access; the authenticated
Express API is the access boundary. Apply PostgreSQL migrations before
deploying code. The local Supabase migration has already been applied for this
release. Keep the deployment's private connection settings unchanged.

`npm run test:memberships` uses an isolated temporary SQLite database and tests
claims, approvals, unique ownership, cross-account/team denial, private data,
multi-role accounts, submissions, favourites and immediate revocation. The
optional `--preview` argument to `scripts/check-memberships.mjs` keeps a
disposable test server open for browser review on a separate loopback host.
`npm run supabase:check-models` verifies the real PostgreSQL adapter in one
rolled-back transaction; no test users or team data are persisted.

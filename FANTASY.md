# Fantasy sports

Open `aupl fantasy-football.html` after signing in with any active Sports Hub account. Teams are stored in the database, independently for each user and round. Basketball uses `aupl fantasy-basketball.html`; volleyball uses `aupl fantasy-volleyball.html`. Each sport has separate rounds, squads and rankings, saved to the same account.

## Admin workflow

1. Create the real clubs, football players and future fixtures in their existing admin sections.
2. Open **Fantasy sports** in the admin sidebar. Create a named round for Male Football, Female Football, Male Basketball, Female Basketball or Volleyball. Select fixtures, set a deadline before all kickoffs, and check eligible players, fantasy positions, credit prices, budget and scoring. Creation opens the round; prices and scoring are fixed for that round so all participants use the same rules.
3. Users save a full 15-player squad (2 GK, 5 DEF, 5 MID, 3 FWD), choose 11 starters and a starting captain. Maximum three players per club. Starting formation requires 1 GK, 3–5 DEF, 2–5 MID and 1–3 FWD. Only complete valid teams can be saved. Each round is entered separately. No paid credits, transfers between rounds, automatic substitutions or vice-captain.
4. The server locks submissions at the deadline, without requiring a cron job or admin action. An open round's deadline can be changed before it locks; a locked round cannot be reopened.
5. Save official match results in **Results**. After the deadline, use Fantasy sports to record each eligible player's match statistics for each applicable fixture. Include zero-minute records for unused players; do not assume a missing record means the player did not play. These records are specific to fantasy match scoring and do not overwrite season totals in Players.
6. Check all records and **Publish checked points**. Every fixture must be completed with a result and all eligible players must have records. Goals conceded must match the official result. Publication calculates each team's points and freezes the round. Published rankings show fantasy team names and scores, never email addresses or account IDs. Team selections remain private.

## Default scoring

Played: +1; 60+ minutes: +1 extra. Goals: GK/DEF +6, MID +5, FWD +4. Assist +3. Clean sheet after 60 minutes: GK/DEF +4, MID +1. Every three GK saves +1. Yellow -1, red -3, missed penalty -2, own goal -2. Every two goals conceded by GK/DEF -1. Starting captain ×2. Bench ×0. No minutes means zero points. Statistics and each match's score are visible in the user's published points breakdown.

Published rounds are final in this version: review before publishing. Later official result edits do not rewrite frozen fantasy scores. If a fixture is cancelled, do not publish the affected round; cancellation/void-round tools are not included.

## Deployment

Both SQLite and Supabase migrations are additive: `20261022160000_fantasy_football`. They have already been applied to this workspace's configured databases. Generated clients include the new models. Push the prepared `.publish-checkout` changes to the connected repository and deploy on Vercel; no data import or new environment variable is required. Existing databases in other environments must run their corresponding migration first.

Run `npm run test:fantasy` for isolated temporary-database checks. `npm test` also includes fantasy checks. Tests never use existing accounts or sports data.

## Basketball

8-player squad, 5 starters: one PG, SG, SF, PF and C. Maximum 3 players from a club. Defaults: appearance +1, each point +1, rebound +1, assist +2, steal +3, block +3, turnover -1, personal foul -1. Starting captain ×2; bench ×0. Zero minutes means zero points. Admin enters minutes, points, rebounds, assists, steals, blocks, turnovers and personal fouls for each match. Player points and combined player points cannot exceed the official team score.

## Volleyball

Save 10 players and choose exactly 6 starters: 1 setter (S), 2 outside hitters (OH), 1 opposite (OPP), and 2 defensive slots. Use 2 middle blockers (MB), or 1 middle blocker and 1 libero (L). The libero replaces a middle blocker; there is no seventh starter. Maximum 4 players from one club. Defaults: appearance +1, kill +2, ace +3, block +3, dig +1, successful receive +1, assist +1, service error -1, attack error -1. Starting captain ×2; bench ×0. Zero sets played means zero points. Admin enters sets played, kills, aces, blocks, digs, receives, assists, service errors and attack errors. Sets played cannot exceed the official match length. Official result scores represent sets won.

Basketball and volleyball share the existing fantasy tables; no additional database migration is needed. Existing football rounds and published scores are preserved. Scoring and fantasy positions are fixed on creation, and sport-specific instructions and scoring are displayed before selection.

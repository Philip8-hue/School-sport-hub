CREATE TABLE "MatchGoal" (
  "resultId" INTEGER NOT NULL REFERENCES "Result"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "playerId" INTEGER NOT NULL REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "side" TEXT NOT NULL CHECK ("side" IN ('HOME', 'AWAY')),
  "goals" INTEGER NOT NULL CHECK ("goals" BETWEEN 1 AND 999),
  PRIMARY KEY ("resultId", "playerId")
);
CREATE INDEX "MatchGoal_playerId_idx" ON "MatchGoal"("playerId");
ALTER TABLE public."MatchGoal" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public."MatchGoal" FROM PUBLIC, anon, authenticated;

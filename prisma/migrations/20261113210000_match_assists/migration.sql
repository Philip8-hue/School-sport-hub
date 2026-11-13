CREATE TABLE "MatchAssist" (
  "resultId" INTEGER NOT NULL,
  "scorerId" INTEGER NOT NULL,
  "goalNumber" INTEGER NOT NULL CHECK ("goalNumber" BETWEEN 1 AND 999),
  "playerId" INTEGER NOT NULL REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CHECK ("playerId" <> "scorerId"),
  FOREIGN KEY ("resultId", "scorerId") REFERENCES "MatchGoal"("resultId", "playerId") ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY ("resultId", "scorerId", "goalNumber")
);
CREATE INDEX "MatchAssist_playerId_idx" ON "MatchAssist"("playerId");

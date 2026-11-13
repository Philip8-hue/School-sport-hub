CREATE TABLE "MatchPushSubscription" (
  "fixtureId" INTEGER NOT NULL,
  "endpoint" TEXT NOT NULL,
  "p256dh" TEXT NOT NULL,
  "auth" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("fixtureId", "endpoint"),
  FOREIGN KEY ("fixtureId") REFERENCES "Fixture"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "MatchPushSubscription_createdAt_idx" ON "MatchPushSubscription"("createdAt");
ALTER TABLE public."MatchPushSubscription" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public."MatchPushSubscription" FROM PUBLIC, anon, authenticated;

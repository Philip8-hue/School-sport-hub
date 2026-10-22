-- CreateTable
CREATE TABLE "FantasyRound" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sport" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "budget" INTEGER NOT NULL DEFAULT 100,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "rules" TEXT NOT NULL,
    "catalog" TEXT NOT NULL,
    "fixtureIds" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "FantasyEntry" (
    "id" SERIAL PRIMARY KEY,
    "roundId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "squad" TEXT NOT NULL,
    "starters" TEXT NOT NULL,
    "captainId" INTEGER NOT NULL,
    "total" INTEGER NOT NULL DEFAULT 0,
    "breakdown" TEXT NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "FantasyEntry_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "FantasyRound" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FantasyEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FantasyMatchStat" (
    "id" SERIAL PRIMARY KEY,
    "roundId" INTEGER NOT NULL,
    "fixtureId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "stats" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "FantasyMatchStat_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "FantasyRound" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "FantasyEntry_roundId_userId_key" ON "FantasyEntry"("roundId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "FantasyMatchStat_roundId_fixtureId_playerId_key" ON "FantasyMatchStat"("roundId", "fixtureId", "playerId");


ALTER TABLE "FantasyRound" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "FantasyRound" FROM anon, authenticated;

ALTER TABLE "FantasyEntry" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "FantasyEntry" FROM anon, authenticated;

ALTER TABLE "FantasyMatchStat" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "FantasyMatchStat" FROM anon, authenticated;

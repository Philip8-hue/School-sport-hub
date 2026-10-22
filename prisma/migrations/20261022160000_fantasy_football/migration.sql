-- CreateTable
CREATE TABLE "FantasyRound" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "sport" TEXT NOT NULL,
    "deadline" DATETIME NOT NULL,
    "budget" INTEGER NOT NULL DEFAULT 100,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "rules" TEXT NOT NULL,
    "catalog" TEXT NOT NULL,
    "fixtureIds" TEXT NOT NULL,
    "publishedAt" DATETIME,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FantasyEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roundId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "squad" TEXT NOT NULL,
    "starters" TEXT NOT NULL,
    "captainId" INTEGER NOT NULL,
    "total" INTEGER NOT NULL DEFAULT 0,
    "breakdown" TEXT NOT NULL DEFAULT '[]',
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FantasyEntry_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "FantasyRound" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FantasyEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FantasyMatchStat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roundId" INTEGER NOT NULL,
    "fixtureId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "stats" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FantasyMatchStat_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "FantasyRound" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "FantasyEntry_roundId_userId_key" ON "FantasyEntry"("roundId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "FantasyMatchStat_roundId_fixtureId_playerId_key" ON "FantasyMatchStat"("roundId", "fixtureId", "playerId");


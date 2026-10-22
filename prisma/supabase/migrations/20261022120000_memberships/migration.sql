BEGIN;
-- CreateTable
CREATE TABLE "AccessRequest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "targetId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reviewNote" TEXT NOT NULL DEFAULT '',
    "reviewerId" INTEGER,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerOwnership" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "bio" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerOwnership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoachAssignment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "clubId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoachAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "targetId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewSubmission" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "playerId" INTEGER,
    "clubId" INTEGER,
    "fixtureId" INTEGER,
    "details" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reviewNote" TEXT NOT NULL DEFAULT '',
    "reviewerId" INTEGER,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamAnnouncement" (
    "id" SERIAL NOT NULL,
    "clubId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamAnnouncement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchAvailability" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "fixtureId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MatchAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamLineup" (
    "id" SERIAL NOT NULL,
    "clubId" INTEGER NOT NULL,
    "fixtureId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "playerIds" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamLineup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerSnapshot" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "stats" TEXT NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AccessRequest_status_idx" ON "AccessRequest"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AccessRequest_userId_kind_targetId_key" ON "AccessRequest"("userId", "kind", "targetId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerOwnership_playerId_key" ON "PlayerOwnership"("playerId");

-- CreateIndex
CREATE INDEX "PlayerOwnership_userId_idx" ON "PlayerOwnership"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CoachAssignment_userId_clubId_key" ON "CoachAssignment"("userId", "clubId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_kind_targetId_key" ON "Favorite"("userId", "kind", "targetId");

-- CreateIndex
CREATE INDEX "ReviewSubmission_status_idx" ON "ReviewSubmission"("status");

-- CreateIndex
CREATE INDEX "TeamAnnouncement_clubId_createdAt_idx" ON "TeamAnnouncement"("clubId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "MatchAvailability_playerId_fixtureId_key" ON "MatchAvailability"("playerId", "fixtureId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamLineup_clubId_fixtureId_key" ON "TeamLineup"("clubId", "fixtureId");

-- CreateIndex
CREATE INDEX "PlayerSnapshot_playerId_capturedAt_idx" ON "PlayerSnapshot"("playerId", "capturedAt");

-- AddForeignKey
ALTER TABLE "AccessRequest" ADD CONSTRAINT "AccessRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerOwnership" ADD CONSTRAINT "PlayerOwnership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerOwnership" ADD CONSTRAINT "PlayerOwnership_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachAssignment" ADD CONSTRAINT "CoachAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachAssignment" ADD CONSTRAINT "CoachAssignment_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewSubmission" ADD CONSTRAINT "ReviewSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamAnnouncement" ADD CONSTRAINT "TeamAnnouncement_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamAnnouncement" ADD CONSTRAINT "TeamAnnouncement_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchAvailability" ADD CONSTRAINT "MatchAvailability_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchAvailability" ADD CONSTRAINT "MatchAvailability_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "Fixture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamLineup" ADD CONSTRAINT "TeamLineup_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamLineup" ADD CONSTRAINT "TeamLineup_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "Fixture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamLineup" ADD CONSTRAINT "TeamLineup_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerSnapshot" ADD CONSTRAINT "PlayerSnapshot_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE public."AccessRequest" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public."AccessRequest" FROM anon, authenticated;
ALTER TABLE public."PlayerOwnership" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public."PlayerOwnership" FROM anon, authenticated;
ALTER TABLE public."CoachAssignment" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public."CoachAssignment" FROM anon, authenticated;
ALTER TABLE public."Favorite" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public."Favorite" FROM anon, authenticated;
ALTER TABLE public."ReviewSubmission" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public."ReviewSubmission" FROM anon, authenticated;
ALTER TABLE public."TeamAnnouncement" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public."TeamAnnouncement" FROM anon, authenticated;
ALTER TABLE public."MatchAvailability" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public."MatchAvailability" FROM anon, authenticated;
ALTER TABLE public."TeamLineup" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public."TeamLineup" FROM anon, authenticated;
ALTER TABLE public."PlayerSnapshot" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public."PlayerSnapshot" FROM anon, authenticated;
COMMIT;

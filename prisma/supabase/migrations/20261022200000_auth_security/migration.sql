-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerificationRequired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "legacySessionsUntil" TIMESTAMP(3),
ADD COLUMN     "mfaEnabledAt" TIMESTAMP(3),
ADD COLUMN     "mfaLastStep" INTEGER NOT NULL DEFAULT -1,
ADD COLUMN     "mfaRequiredAfter" TIMESTAMP(3),
ADD COLUMN     "mfaSecret" TEXT,
ADD COLUMN     "sessionVersion" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "AuthSession" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "mfaVerified" BOOLEAN NOT NULL DEFAULT false,
    "legacyTokenHash" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthToken" (
    "hash" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "purpose" TEXT NOT NULL,
    "payload" TEXT,
    "version" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthToken_pkey" PRIMARY KEY ("hash")
);

-- CreateTable
CREATE TABLE "RecoveryCode" (
    "hash" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "usedAt" TIMESTAMP(3),

    CONSTRAINT "RecoveryCode_pkey" PRIMARY KEY ("hash")
);

-- CreateTable
CREATE TABLE "AuthLimit" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "resetsAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthLimit_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "SecurityEvent" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "event" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "resource" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SecurityEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthSession_legacyTokenHash_key" ON "AuthSession"("legacyTokenHash");

-- CreateIndex
CREATE INDEX "AuthSession_userId_expiresAt_idx" ON "AuthSession"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "AuthToken_userId_purpose_idx" ON "AuthToken"("userId", "purpose");

-- CreateIndex
CREATE INDEX "RecoveryCode_userId_idx" ON "RecoveryCode"("userId");

-- CreateIndex
CREATE INDEX "SecurityEvent_createdAt_idx" ON "SecurityEvent"("createdAt");

-- CreateIndex
CREATE INDEX "SecurityEvent_userId_createdAt_idx" ON "SecurityEvent"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "AuthSession" ADD CONSTRAINT "AuthSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthToken" ADD CONSTRAINT "AuthToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecoveryCode" ADD CONSTRAINT "RecoveryCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;


UPDATE "User" SET "legacySessionsUntil"=CURRENT_TIMESTAMP + INTERVAL '7 days';
UPDATE "User" SET "mfaRequiredAfter"=CURRENT_TIMESTAMP + INTERVAL '14 days' WHERE "role"='ADMIN';
ALTER TABLE "AuthSession" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "AuthSession" FROM anon, authenticated;
ALTER TABLE "AuthToken" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "AuthToken" FROM anon, authenticated;
ALTER TABLE "RecoveryCode" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "RecoveryCode" FROM anon, authenticated;
ALTER TABLE "AuthLimit" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "AuthLimit" FROM anon, authenticated;
ALTER TABLE "SecurityEvent" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "SecurityEvent" FROM anon, authenticated;

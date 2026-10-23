-- CreateTable
CREATE TABLE "AuthSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "mfaVerified" BOOLEAN NOT NULL DEFAULT false,
    "legacyTokenHash" TEXT,
    "expiresAt" DATETIME NOT NULL,
    "revokedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuthSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuthToken" (
    "hash" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "purpose" TEXT NOT NULL,
    "payload" TEXT,
    "version" INTEGER NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "usedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuthToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RecoveryCode" (
    "hash" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "usedAt" DATETIME,
    CONSTRAINT "RecoveryCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuthLimit" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "count" INTEGER NOT NULL DEFAULT 0,
    "resetsAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SecurityEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER,
    "event" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "resource" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add fields without rebuilding or replacing existing accounts.
ALTER TABLE "User" ADD COLUMN "emailVerificationRequired" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "emailVerifiedAt" DATETIME;
ALTER TABLE "User" ADD COLUMN "legacySessionsUntil" DATETIME;
ALTER TABLE "User" ADD COLUMN "mfaEnabledAt" DATETIME;
ALTER TABLE "User" ADD COLUMN "mfaLastStep" INTEGER NOT NULL DEFAULT -1;
ALTER TABLE "User" ADD COLUMN "mfaRequiredAfter" DATETIME;
ALTER TABLE "User" ADD COLUMN "mfaSecret" TEXT;
ALTER TABLE "User" ADD COLUMN "sessionVersion" INTEGER NOT NULL DEFAULT 0;

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


UPDATE "User" SET "legacySessionsUntil"=datetime('now','+7 days');
UPDATE "User" SET "mfaRequiredAfter"=datetime('now','+14 days') WHERE "role"='ADMIN';

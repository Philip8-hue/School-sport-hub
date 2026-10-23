CREATE TABLE "InternationalNews" (
 "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
 "sport" TEXT NOT NULL, "linkHash" TEXT NOT NULL, "title" TEXT NOT NULL,
 "url" TEXT NOT NULL, "source" TEXT NOT NULL, "publishedAt" DATETIME NOT NULL
);
CREATE UNIQUE INDEX "InternationalNews_sport_linkHash_key" ON "InternationalNews"("sport", "linkHash");
CREATE INDEX "InternationalNews_sport_publishedAt_id_idx" ON "InternationalNews"("sport", "publishedAt", "id");
CREATE TABLE "NewsRefresh" ("id" TEXT NOT NULL PRIMARY KEY, "nextAt" DATETIME NOT NULL, "fetchedAt" DATETIME);

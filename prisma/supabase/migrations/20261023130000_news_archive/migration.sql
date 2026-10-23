CREATE TABLE "InternationalNews" (
 "id" SERIAL PRIMARY KEY,
 "sport" TEXT NOT NULL, "linkHash" TEXT NOT NULL, "title" TEXT NOT NULL,
 "url" TEXT NOT NULL, "source" TEXT NOT NULL, "publishedAt" TIMESTAMP(3) NOT NULL
);
CREATE UNIQUE INDEX "InternationalNews_sport_linkHash_key" ON "InternationalNews"("sport", "linkHash");
CREATE INDEX "InternationalNews_sport_publishedAt_id_idx" ON "InternationalNews"("sport", "publishedAt", "id");
CREATE TABLE "NewsRefresh" ("id" TEXT PRIMARY KEY, "nextAt" TIMESTAMP(3) NOT NULL, "fetchedAt" TIMESTAMP(3));
ALTER TABLE "InternationalNews" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "InternationalNews" FROM anon, authenticated;
ALTER TABLE "NewsRefresh" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "NewsRefresh" FROM anon, authenticated;

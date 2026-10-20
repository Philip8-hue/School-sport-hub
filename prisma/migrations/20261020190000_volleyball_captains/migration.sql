ALTER TABLE "Player" ADD COLUMN "captain" BOOLEAN NOT NULL DEFAULT false;

UPDATE "Player" SET "captain" = true
WHERE "sport" = 'Volleyball' AND (
  ("name" = 'Philip' AND "clubId" IN (SELECT "id" FROM "Club" WHERE "name" = 'Leo' AND "sport" = 'Volleyball')) OR
  ("name" = 'CJ' AND "clubId" IN (SELECT "id" FROM "Club" WHERE "name" = 'Pegasus' AND "sport" = 'Volleyball')) OR
  ("fullName" = 'Oduh David' AND "clubId" IN (SELECT "id" FROM "Club" WHERE "name" = 'Orion' AND "sport" = 'Volleyball')) OR
  ("name" = 'Courage' AND "clubId" IN (SELECT "id" FROM "Club" WHERE "name" = 'Trojans' AND "sport" = 'Volleyball'))
);

import 'dotenv/config';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

process.env.DATABASE_PROVIDER = 'supabase';
const { prisma } = await import('../dist/server/src/lib/prisma.js');
const rollback = new Error('Successful check: roll back test records');
try {
  await prisma.$transaction(async tx => {
    const suffix = randomUUID();
    const home = await tx.club.create({ data: { name: 'Migration check home ' + suffix, slug: 'migration-home-' + suffix, sport: 'Volleyball' } });
    const away = await tx.club.create({ data: { name: 'Migration check away ' + suffix, slug: 'migration-away-' + suffix, sport: 'Volleyball' } });
    const player = await tx.player.create({ data: { name: 'Migration check', sport: 'Volleyball', clubId: home.id, captain: true, aces: 3, receives: 12, rating: 8.5 } });
    assert.equal(player.captain, true);
    assert.equal(player.receives, 12);
    assert.equal(player.rating, 8.5);
    const startsAt = new Date('2027-01-01T15:00:00.123Z');
    const fixture = await tx.fixture.create({ data: { sport: 'Volleyball', startsAt, homeClubId: home.id, awayClubId: away.id } });
    assert.equal(fixture.startsAt.toISOString(), startsAt.toISOString());
    await tx.result.create({ data: { fixtureId: fixture.id, homeScore: 3, awayScore: 1 } });
    const related = await tx.fixture.findUniqueOrThrow({ where: { id: fixture.id }, include: { homeClub: true, awayClub: true, result: true } });
    assert.equal(related.result.homeScore, 3);
    assert.equal(related.homeClub.id, home.id);
    await tx.leagueTable.create({ data: { sport: 'Volleyball', clubId: home.id, played: 1, won: 1, points: 3 } });
    await tx.item.create({ data: { title: 'Migration check' } });
    await tx.newsArticle.create({ data: { title: 'Migration check', slug: 'migration-check-' + suffix, content: 'Temporary test', published: false } });
    await tx.user.count();
    await tx.homepageContent.findMany();
    throw rollback;
  }, { timeout: 30000 });
} catch (error) {
  if (error !== rollback) {
    console.error('Supabase model check failed. Code: ' + (error.code ?? 'unknown'));
    process.exitCode = 1;
  } else {
    console.log('Supabase Prisma CRUD, relationships, booleans, statistics and UTC timestamps verified. All test records rolled back.');
  }
} finally {
  await prisma.$disconnect();
}

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
    const user = await tx.user.create({ data: { name: 'Temporary membership check', email: suffix + '@example.invalid', role: 'USER', accountType: 'PLAYER' } });
    await tx.accessRequest.create({ data: { userId: user.id, kind: 'PLAYER', targetId: player.id, message: 'Transaction-only verification', status: 'APPROVED', reviewerId: user.id, reviewedAt: new Date() } });
    await tx.playerOwnership.create({ data: { userId: user.id, playerId: player.id, bio: 'Temporary bio' } });
    await tx.coachAssignment.create({ data: { userId: user.id, clubId: home.id } });
    await tx.favorite.create({ data: { userId: user.id, kind: 'CLUB', targetId: home.id } });
    await tx.reviewSubmission.create({ data: { userId: user.id, kind: 'PROFILE_CORRECTION', playerId: player.id, details: 'Temporary submission' } });
    await tx.teamAnnouncement.create({ data: { clubId: home.id, authorId: user.id, title: 'Temporary announcement', body: 'Not persisted' } });
    await tx.matchAvailability.create({ data: { playerId: player.id, fixtureId: fixture.id, status: 'AVAILABLE' } });
    await tx.teamLineup.create({ data: { clubId: home.id, fixtureId: fixture.id, authorId: user.id, playerIds: JSON.stringify([player.id]) } });
    await tx.playerSnapshot.create({ data: { playerId: player.id, stats: JSON.stringify({ aces: 3 }) } });
    const linked = await tx.user.findUniqueOrThrow({ where: { id: user.id }, include: { playerLinks: true, coachLinks: true, favorites: true } });
    assert.equal(linked.playerLinks[0].playerId, player.id);
    assert.equal(linked.coachLinks[0].clubId, home.id);
    assert.equal(linked.favorites.length, 1);
    await tx.homepageContent.findMany();
    throw rollback;
  }, { timeout: 30000 });
} catch (error) {
  if (error !== rollback) {
    console.error('Supabase model check failed. Code: ' + (error.code ?? 'unknown'));
    process.exitCode = 1;
  } else {
    console.log('Supabase Prisma CRUD, memberships, team data, relationships, statistics and UTC timestamps verified. All test records rolled back.');
  }
} finally {
  await prisma.$disconnect();
}

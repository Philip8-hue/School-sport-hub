import 'dotenv/config';
import assert from 'node:assert/strict';
import { prisma } from '../dist/server/src/lib/prisma.js';
import { createAccessToken } from '../dist/server/src/middleware/auth.js';

const base = process.env.CHECK_BASE_URL ?? 'http://127.0.0.1:5000';
try {
  assert.equal(process.env.DATABASE_PROVIDER, 'supabase');
  let checks = 0;
  for (const route of ['/', '/admin.html', '/api/health', '/api/clubs', '/api/players', '/api/fixtures', '/api/tables', '/api/news', '/api/homepage']) {
    const response = await fetch(base + route, { signal: AbortSignal.timeout(20000) });
    assert.equal(response.status, 200, route);
    if (route === '/api/players') assert.equal((await response.json()).length, await prisma.player.count());
    if (route === '/api/clubs') assert.equal((await response.json()).length, await prisma.club.count());
    checks++;
  }
  const admin = await prisma.user.findFirstOrThrow({ where: { role: 'ADMIN', isActive: true }, select: { id: true, name: true, email: true, role: true } });
  const token = createAccessToken(admin);
  for (const route of ['/api/auth/me', '/api/admin/summary', '/api/admin/homepage']) {
    const response = await fetch(base + route, { headers: { Cookie: 'school_sport_hub_auth=' + token }, signal: AbortSignal.timeout(20000) });
    assert.equal(response.status, 200, route);
    checks++;
  }
  console.log(`Passed ${checks} read-only Supabase HTTP checks, including authenticated admin access.`);
} catch (error) {
  console.error('Supabase HTTP check failed: ' + error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}

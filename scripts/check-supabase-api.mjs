import {randomUUID} from 'node:crypto';
import 'dotenv/config';
import assert from 'node:assert/strict';
import { prisma } from '../dist/server/src/lib/prisma.js';
import { createAccessToken } from '../dist/server/src/middleware/auth.js';

const base = process.env.CHECK_BASE_URL ?? 'http://127.0.0.1:5000';
let temporarySession;
try {
  assert.equal(process.env.DATABASE_PROVIDER, 'supabase');
  let checks = 0;
  for (const route of ['/', '/admin-login.html', '/following.html', '/sports-hub-user-guide.pdf', '/api/health', '/api/clubs', '/api/players', '/api/fixtures', '/api/tables', '/api/news', '/api/homepage']) {
    const response = await fetch(base + route, { signal: AbortSignal.timeout(20000) });
    assert.equal(response.status, 200, route);
    if (route === '/api/players') assert.equal((await response.json()).length, await prisma.player.count());
    if (route === '/api/clubs') assert.equal((await response.json()).length, await prisma.club.count());
    checks++;
  }
  const admin = await prisma.user.findFirstOrThrow({ where: { role: 'ADMIN', isActive: true, mfaEnabledAt:null, OR:[{mfaRequiredAfter:null},{mfaRequiredAfter:{gt:new Date()}}] }, select: { id: true, name: true, email: true, role: true, sessionVersion:true } });
  temporarySession=await prisma.authSession.create({data:{id:randomUUID(),userId:admin.id,version:admin.sessionVersion,expiresAt:new Date(Date.now()+60000)}});
  const token = createAccessToken(admin,temporarySession.id);
  for (const route of ['/admin.html', '/api/auth/me', '/api/admin/summary', '/api/admin/homepage', '/api/admin/approvals/queue', '/api/member/dashboard', '/api/member/following']) {
    const response = await fetch(base + route, { headers: { Cookie: 'school_sport_hub_auth=' + token }, signal: AbortSignal.timeout(20000) });
    assert.equal(response.status, 200, route);
    checks++;
  }
  console.log(`Passed ${checks} Supabase HTTP checks with an isolated short-lived session, including authenticated admin access.`);
} catch (error) {
  console.error('Supabase HTTP check failed: ' + error.message);
  process.exitCode = 1;
} finally {
  if(temporarySession)await prisma.authSession.deleteMany({where:{id:temporarySession.id}});
  await prisma.$disconnect();
}

import webPush from "web-push";
import { waitUntil } from "@vercel/functions";
import { prisma } from "./prisma.js";
import { scoreSport, scoreStageLabel } from "./match-stages.js";

export function matchPushConfig() {
  const { MATCH_PUSH_PUBLIC_KEY: publicKey, MATCH_PUSH_PRIVATE_KEY: privateKey, MATCH_PUSH_SUBJECT: subject } = process.env;
  if (!publicKey || !privateKey || !subject) return null;
  try { webPush.setVapidDetails(subject, publicKey, privateKey); }
  catch { return null; }
  return { subject, publicKey, privateKey };
}

// Never send a server request to an arbitrary endpoint submitted by a visitor.
export function isPushEndpoint(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.port && !url.username && !url.password && !url.hash
      && (["fcm.googleapis.com", "updates.push.services.mozilla.com", "web.push.apple.com"].includes(url.hostname)
        || url.hostname.endsWith(".push.apple.com")
        || url.hostname.endsWith(".notify.windows.com"));
  } catch { return false; }
}

type MatchScoreUpdate = {
  fixtureId: number;
  homeScore: number;
  awayScore: number;
  stage: string | null;
  fixture: { sport: string; status: string; homeClub: { name: string } | null; awayClub: { name: string } | null };
};

export function notifyMatchFollowers(score: MatchScoreUpdate) {
  const vapidDetails = matchPushConfig();
  if (!vapidDetails) return;
  const task = (async () => {
    const final = score.fixture.status === "COMPLETED";
    const data = JSON.stringify({
      fixtureId: score.fixtureId,
      title: (scoreSport(score.fixture.sport) ?? score.fixture.sport) + " · " + scoreStageLabel(score.fixture.sport, score.fixture.status, score.stage) + (score.stage || final ? "" : " score update"),
      body: (score.fixture.homeClub?.name ?? "Home") + " " + score.homeScore + " – " + score.awayScore + " " + (score.fixture.awayClub?.name ?? "Away") + (scoreSport(score.fixture.sport) === "Volleyball" ? " (sets won)" : "")
    });
    let cursor: string | undefined;
    const cutoff = new Date(Date.now() - 30 * 86400000);
    for (;;) {
      const batch = await prisma.matchPushSubscription.findMany({
        where: { fixtureId: score.fixtureId, createdAt: { gte: cutoff }, ...(cursor ? { endpoint: { gt: cursor } } : {}) },
        orderBy: { endpoint: "asc" }, take: 25
      });
      if (!batch.length) break;
      await Promise.allSettled(batch.map(async sub => {
        if (!isPushEndpoint(sub.endpoint)) return;
        try {
          await webPush.sendNotification({endpoint: sub.endpoint, keys: {p256dh: sub.p256dh, auth: sub.auth}}, data,
            {vapidDetails, TTL: final ? 3600 : 180, timeout: 4500, urgency: "high"});
        } catch (error) {
          const status = (error as {statusCode?: number}).statusCode;
          if (status === 404 || status === 410) await prisma.matchPushSubscription.deleteMany({where: {fixtureId: sub.fixtureId, endpoint: sub.endpoint, auth: sub.auth}});
          else console.warn("Match push rejected", status ?? "network error");
        }
      }));
      cursor = batch.at(-1)!.endpoint;
    }
  })().catch(() => console.warn("Match push delivery failed"));
  if (process.env.VERCEL === "1") waitUntil(task);
}

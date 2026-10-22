import type { Prisma } from "../../../generated/prisma/client.js";

export function snapshotStats(player: Record<string, unknown>): string {
  return JSON.stringify(Object.fromEntries(Object.entries(player).filter(([key, value]) =>
    !['id','clubId','jerseyNumber','price'].includes(key) && (typeof value === 'number' || key === 'rating'))));
}

export async function updatePlayerWithHistory(tx: Prisma.TransactionClient, id: number, data: Prisma.PlayerUpdateInput) {
  const previous = await tx.player.findUniqueOrThrow({ where: { id } });
  const updated = await tx.player.update({ where: { id }, data, include: { club: true } });
  const before = snapshotStats(previous);
  const after = snapshotStats(updated);
  if (before !== after) {
    if (!await tx.playerSnapshot.count({ where: { playerId: id } })) await tx.playerSnapshot.create({ data: { playerId: id, stats: before, capturedAt: previous.updatedAt } });
    await tx.playerSnapshot.create({ data: { playerId: id, stats: after } });
  }
  return updated;
}

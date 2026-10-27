import { Router, raw, type RequestHandler } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { rateLimit } from '../middleware/rate-limit.js';
import { preparePlayerPhoto } from '../lib/player-photo.js';

export const playerPhotosRouter = Router();
const playerId = (value: unknown) => typeof value === 'string' && /^\d+$/.test(value) && Number(value) > 0 && Number(value) <= 2147483647 ? Number(value) : null;
const owned: RequestHandler = async (request, response, next) => {
  const id = playerId(request.params.id);
  if (!id) { response.status(400).json({ error: 'Invalid player.' }); return; }
  try {
    const link = await prisma.playerOwnership.findUnique({ where: { playerId: id } });
    if (!link || link.userId !== request.user!.id) { response.status(403).json({ error: 'An admin-approved link to this player profile is required.' }); return; }
    next();
  } catch (error) { next(error); }
};
playerPhotosRouter.get('/:id', async (request, response, next) => {
  const id = playerId(request.params.id);
  if (!id) { response.status(404).end(); return; }
  try {
    const photo = await prisma.playerPhoto.findUnique({ where: { playerId: id } });
    if (!photo) { response.status(404).end(); return; }
    response.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    response.type('image/webp').send(Buffer.from(photo.image));
  } catch (error) { next(error); }
});
playerPhotosRouter.put('/:id', requireAuth, owned, rateLimit(10, 60000), raw({ type: 'application/octet-stream', limit: '3mb' }), async (request, response, next) => {
  if (!Buffer.isBuffer(request.body) || !request.body.length) { response.status(400).json({ error: 'Choose a JPG, PNG or WebP photo, up to 3 MB.' }); return; }
  let image: Buffer;
  try { image = await preparePlayerPhoto(request.body); }
  catch { response.status(400).json({ error: 'Unable to read this photo. Choose a JPG, PNG or non-animated WebP under 3 MB and 16 megapixels.' }); return; }
  try {
    const photoUrl = await prisma.$transaction(async tx => {
      // Lock the approval row against a concurrent revocation while changing the photo.
      const link = await tx.playerOwnership.updateMany({ where: { playerId: Number(request.params.id), userId: request.user!.id }, data: { userId: request.user!.id } });
      if (!link.count) return null;
      const bytes = new Uint8Array(image);
      const photo = await tx.playerPhoto.upsert({ where: { playerId: Number(request.params.id) }, create: { playerId: Number(request.params.id), image: bytes }, update: { image: bytes } });
      const url = `/api/player-photos/${photo.playerId}?v=${photo.updatedAt.getTime()}`;
      await tx.player.update({ where: { id: photo.playerId }, data: { photoUrl: url } });
      return url;
    });
    if (!photoUrl) { response.status(403).json({ error: 'Your profile link is no longer approved.' }); return; }
    response.json({ photoUrl });
  } catch (error) { next(error); }
});
playerPhotosRouter.delete('/:id', requireAuth, owned, async (request, response, next) => {
  try {
    const changed = await prisma.$transaction(async tx => {
      const link = await tx.playerOwnership.updateMany({ where: { playerId: Number(request.params.id), userId: request.user!.id }, data: { userId: request.user!.id } });
      if (!link.count) return false;
      await tx.playerPhoto.deleteMany({ where: { playerId: Number(request.params.id) } });
      await tx.player.update({ where: { id: Number(request.params.id) }, data: { photoUrl: null } });
      return true;
    });
    if (!changed) { response.status(403).json({ error: 'Your profile link is no longer approved.' }); return; }
    response.json({ photoUrl: null });
  } catch (error) { next(error); }
});

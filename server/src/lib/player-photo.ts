export async function preparePlayerPhoto(input: Buffer): Promise<Buffer> {
  // Load native image processing only for uploads, not every login/server cold start.
  const { default: sharp } = await import('sharp');
  const image = sharp(input, { limitInputPixels: 16000000, failOn: 'warning' });
  const metadata = await image.metadata();
  if (!['jpeg', 'png', 'webp'].includes(metadata.format || '') || (metadata.pages ?? 1) > 1) throw new Error('Choose a JPG, PNG or non-animated WebP photo.');
  // Re-encoding strips EXIF (including GPS) and never serves the original upload.
  for (const [size, quality] of [[1024, 78], [1024, 55], [768, 55], [512, 55], [384, 40]]) {
    // Keep every edge of the photo; only thumbnail CSS is allowed to crop it.
    const output = await image.clone().rotate().resize(size, size, { fit: 'inside', withoutEnlargement: true }).webp({ quality }).toBuffer();
    if (output.length <= 48 * 1024) return output;
  }
  throw new Error('Choose a simpler or smaller photo.');
}

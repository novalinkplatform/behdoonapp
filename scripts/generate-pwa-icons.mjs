import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const publicDir = path.resolve(process.cwd(), 'public');
const logoPath = path.resolve(publicDir, 'behdoon_logo.png');
const svgPath = path.resolve(publicDir, 'favicon.svg');

async function generateIcons() {
  console.log('[PWA Icons] Starting icon generation...');

  if (!fs.existsSync(logoPath) && !fs.existsSync(svgPath)) {
    console.error('Source icon file not found!');
    process.exit(1);
  }

  // Use SVG if available for vector crispness, fallback to high-res PNG
  const sourceInput = fs.existsSync(svgPath) ? svgPath : logoPath;
  console.log(`[PWA Icons] Using source: ${sourceInput}`);

  const standardSizes = [48, 72, 96, 128, 144, 152, 180, 192, 384, 512];

  for (const size of standardSizes) {
    const filename = size === 180 ? 'apple-touch-icon.png' : `icon-${size}.png`;
    const dest = path.resolve(publicDir, filename);

    await sharp(sourceInput)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({ compressionLevel: 9, quality: 100 })
      .toFile(dest);

    console.log(`[PWA Icons] Generated ${filename} (${size}x${size})`);
  }

  // Generate Maskable Icons (Android Adaptive Icons require safe zone padding of ~18-20% and solid background)
  // Brand navy background: #133458
  const maskableSizes = [192, 512];
  for (const size of maskableSizes) {
    const filename = `icon-maskable-${size}.png`;
    const dest = path.resolve(publicDir, filename);

    // Inner icon size is 76% of total canvas to fit safely in any mask (circle/squircle/teardrop)
    const innerSize = Math.round(size * 0.76);
    const innerBuffer = await sharp(sourceInput)
      .resize(innerSize, innerSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toBuffer();

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 19, g: 52, b: 88, alpha: 1 } // #133458 Behdoon brand navy
      }
    })
      .composite([{ input: innerBuffer, gravity: 'center' }])
      .png({ compressionLevel: 9, quality: 100 })
      .toFile(dest);

    console.log(`[PWA Icons] Generated ${filename} (${size}x${size} maskable with safe-zone)`);
  }

  // Monochrome / notification badge icon (72x72)
  const badgeDest = path.resolve(publicDir, 'badge-72.png');
  await sharp(sourceInput)
    .resize(72, 72, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(badgeDest);
  console.log(`[PWA Icons] Generated badge-72.png (72x72)`);

  console.log('[PWA Icons] All PWA icons generated successfully!');
}

generateIcons().catch(err => {
  console.error('[PWA Icons] Error:', err);
  process.exit(1);
});

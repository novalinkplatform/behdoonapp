import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function generateAssets() {
  console.log('Generating brand icons and og-image for Behdoon...');

  const faviconSvgPath = path.resolve('public/favicon.svg');
  const faviconSvg = fs.readFileSync(faviconSvgPath);

  // 1. Generate icon-512.png
  await sharp(faviconSvg)
    .resize(512, 512)
    .png({ quality: 95 })
    .toFile('public/icon-512.png');
  console.log('✅ Generated public/icon-512.png');

  // 2. Generate icon-192.png
  await sharp(faviconSvg)
    .resize(192, 192)
    .png({ quality: 95 })
    .toFile('public/icon-192.png');
  console.log('✅ Generated public/icon-192.png');

  // 3. Generate apple-touch-icon.png
  await sharp(faviconSvg)
    .resize(180, 180)
    .png({ quality: 95 })
    .toFile('public/apple-touch-icon.png');
  console.log('✅ Generated public/apple-touch-icon.png');

  // 4. Generate favicon.png
  await sharp(faviconSvg)
    .resize(64, 64)
    .png({ quality: 95 })
    .toFile('public/favicon.png');
  console.log('✅ Generated public/favicon.png');

  // 5. Generate high-resolution 1200x630 og-image.png
  const ogSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <!-- Background Gradient -->
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#090a12" />
        <stop offset="40%" stop-color="#160e29" />
        <stop offset="100%" stop-color="#0a192f" />
      </linearGradient>

      <!-- Glow Orbs -->
      <radialGradient id="purpleGlow" cx="25%" cy="35%" r="60%">
        <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.35" />
        <stop offset="60%" stop-color="#7c3aed" stop-opacity="0.05" />
        <stop offset="100%" stop-color="#7c3aed" stop-opacity="0" />
      </radialGradient>

      <radialGradient id="emeraldGlow" cx="80%" cy="75%" r="50%">
        <stop offset="0%" stop-color="#059669" stop-opacity="0.25" />
        <stop offset="60%" stop-color="#059669" stop-opacity="0.03" />
        <stop offset="100%" stop-color="#059669" stop-opacity="0" />
      </radialGradient>

      <!-- Logo Gradient -->
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#a855f7" />
        <stop offset="50%" stop-color="#8b5cf6" />
        <stop offset="100%" stop-color="#6d28d9" />
      </linearGradient>

      <!-- Card Border Gradient -->
      <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#a855f7" stop-opacity="0.6" />
        <stop offset="100%" stop-color="#10b981" stop-opacity="0.3" />
      </linearGradient>

      <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.6" />
      </filter>
    </defs>

    <!-- Deep Tech Background -->
    <rect width="1200" height="630" fill="url(#bgGrad)" />
    <rect width="1200" height="630" fill="url(#purpleGlow)" />
    <rect width="1200" height="630" fill="url(#emeraldGlow)" />

    <!-- Grid Accent Lines (Subtle) -->
    <g opacity="0.06" stroke="#ffffff" stroke-width="1">
      <line x1="0" y1="105" x2="1200" y2="105" />
      <line x1="0" y1="210" x2="1200" y2="210" />
      <line x1="0" y1="315" x2="1200" y2="315" />
      <line x1="0" y1="420" x2="1200" y2="420" />
      <line x1="0" y1="525" x2="1200" y2="525" />
      <line x1="200" y1="0" x2="200" y2="630" />
      <line x1="400" y1="0" x2="400" y2="630" />
      <line x1="600" y1="0" x2="600" y2="630" />
      <line x1="800" y1="0" x2="800" y2="630" />
      <line x1="1000" y1="0" x2="1000" y2="630" />
    </g>

    <!-- Decorative Top Edge Light -->
    <rect x="0" y="0" width="1200" height="4" fill="url(#logoGrad)" />

    <!-- Central Card Frame -->
    <rect x="70" y="55" width="1060" height="520" rx="32" fill="#131124" fill-opacity="0.75" stroke="url(#borderGrad)" stroke-width="1.5" filter="url(#shadowFilter)" />

    <!-- Logo Squircle (Left/Center area in LTR coord system) -->
    <g transform="translate(140, 150)">
      <rect width="210" height="210" rx="52" fill="url(#logoGrad)" />
      <!-- Rim highlight -->
      <rect width="210" height="210" rx="52" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="3" />
      <!-- Letter "ب" in white -->
      <path d="M 160 76 C 160 120, 138 140, 105 140 C 72 140, 50 120, 50 76" fill="none" stroke="#ffffff" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" />
      <rect x="94" y="162" width="22" height="22" rx="5" fill="#ffffff" transform="rotate(45 105 173)" />
    </g>

    <!-- Persian Typography & Content (Right aligned RTL) -->
    <g font-family="Vazirmatn, IRANSans, Tahoma, Arial, sans-serif" direction="rtl">
      <!-- Brand Name -->
      <text x="1050" y="165" font-size="64" font-weight="900" fill="#ffffff" text-anchor="start">بِـهدون</text>
      <text x="790" y="152" font-size="28" font-weight="700" fill="#a78bfa" text-anchor="start">| Behdoon.ir</text>

      <!-- Category Slogan / Tagline -->
      <text x="1050" y="235" font-size="36" font-weight="800" fill="#f8fafc" text-anchor="start">سامانه هوشمند خدمات فنی و تأسیسات ساختمان</text>
      <text x="1050" y="285" font-size="23" font-weight="600" fill="#94a3b8" text-anchor="start">سرمایش و گرمایش • لوله‌کشی و نشت‌یابی • برقکاری • تعمیرات و بازسازی</text>

      <!-- Trust Badges Container -->
      <g transform="translate(420, 335)">
        <!-- Badge 1: Instant Dispatch -->
        <rect x="420" y="0" width="210" height="52" rx="14" fill="#ede9fe" fill-opacity="0.12" stroke="#a78bfa" stroke-opacity="0.35" stroke-width="1" />
        <text x="600" y="34" font-size="18" font-weight="700" fill="#c4b5fd" text-anchor="start">⚡ اعزام فوری در تهران</text>

        <!-- Badge 2: Written Warranty -->
        <rect x="200" y="0" width="205" height="52" rx="14" fill="#d1fae5" fill-opacity="0.12" stroke="#10b981" stroke-opacity="0.4" stroke-width="1" />
        <text x="375" y="34" font-size="18" font-weight="700" fill="#6ee7b7" text-anchor="start">🛡️ ضمانت کتبی کیفیت</text>

        <!-- Badge 3: Official Rates -->
        <rect x="-10" y="0" width="195" height="52" rx="14" fill="#e0f2fe" fill-opacity="0.12" stroke="#38bdf8" stroke-opacity="0.35" stroke-width="1" />
        <text x="155" y="34" font-size="18" font-weight="700" fill="#7dd3fc" text-anchor="start">🧾 فاکتور رسمی و معتبر</text>
      </g>

      <!-- Footer Info Row -->
      <g transform="translate(420, 440)">
        <text x="630" y="45" font-size="20" font-weight="600" fill="#e2e8f0" text-anchor="start">پشتیبانی ۲۴ ساعته:</text>
        <text x="470" y="45" font-size="22" font-weight="800" fill="#fbbf24" text-anchor="start" direction="ltr">۰۲۱-۲۲۳۴۵۶۷۸</text>
        <text x="220" y="45" font-size="20" font-weight="600" fill="#94a3b8" text-anchor="start">| کلیه مناطق ۲۲‌گانه شهر تهران</text>
      </g>
    </g>

    <!-- Bottom URL Pill -->
    <g transform="translate(140, 420)">
      <rect width="210" height="50" rx="14" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-opacity="0.2" stroke-width="1" />
      <text x="245" y="452" font-family="Arial, sans-serif" font-size="22" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="1">behdoon.ir</text>
    </g>
  </svg>
  `;

  await sharp(Buffer.from(ogSvg))
    .png({ quality: 95 })
    .toFile('public/og-image.png');
  console.log('✅ Generated public/og-image.png (1200x630 Behdoon Social Card)');
}

generateAssets().catch(console.error);

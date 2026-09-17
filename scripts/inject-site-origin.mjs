// این ایمیج بین همه‌ی خریدارهای self-host مشترک است، پس دامنه‌ی واقعی هر خریدار نمی‌تواند در زمان
// build ثابت شود؛ برای آن‌ها __SITE_ORIGIN__ به‌عنوان جای‌گیر در dist باقی می‌ماند و
// docker-entrypoint.d/10-inject-site-origin.sh در لحظه‌ی بالا آمدن کانتینر جایگزینش می‌کند.
// این اسکریپت فقط وقتی SITE_ORIGIN صراحتاً ست شده باشد جایگزینی را انجام می‌دهد — یعنی برای دیپلوی
// مستقیم روی دامنه‌ی مشخص (مثل بیلد و دیپلوی خود behbarapp.ir روی Cloudflare Pages).
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const distDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

// functions/_middleware.ts (تزریق سمت‌سرور تگ تأیید Search Console) در زمان اجرا روی Cloudflare Pages
// این فایل استاتیک را می‌خواند تا آدرس API را بداند — هیچ دامنه‌ای در کد کامپایل‌شده هاردکد نمی‌شود؛
// اگر خریدار VITE_API_BASE_URL را ست نکند، این فایل خالی می‌ماند و آن میان‌افزار بی‌اثر باقی می‌ماند.
import { mkdirSync, copyFileSync, existsSync } from 'node:fs';

// Guarantee /management and /admin directory routes exist for clean URL serving
if (existsSync(join(distDir, 'management.html'))) {
  mkdirSync(join(distDir, 'management'), { recursive: true });
  copyFileSync(join(distDir, 'management.html'), join(distDir, 'management', 'index.html'));
  mkdirSync(join(distDir, 'admin'), { recursive: true });
  copyFileSync(join(distDir, 'management.html'), join(distDir, 'admin', 'index.html'));
}

writeFileSync(join(distDir, 'api-base.txt'), process.env.VITE_API_BASE_URL ?? '', 'utf-8');

const siteOrigin = process.env.SITE_ORIGIN ?? 'https://behdoon.ir';

const targets = readdirSync(distDir, { recursive: true }).filter(
  (f) => typeof f === 'string' && (f.endsWith('.html') || f.endsWith('robots.txt') || f.endsWith('sitemap.xml'))
);

for (const file of targets) {
  const path = join(distDir, file);
  try {
    const content = readFileSync(path, 'utf-8');
    if (!content.includes('__SITE_ORIGIN__')) continue;
    writeFileSync(path, content.replaceAll('__SITE_ORIGIN__', siteOrigin.replace(/\/$/, '')), 'utf-8');
  } catch {}
}

console.log(`[inject-site-origin] replaced __SITE_ORIGIN__ with ${siteOrigin} in dist.`);

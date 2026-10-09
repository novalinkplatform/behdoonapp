import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(rootDir, 'public');
const distDir = join(rootDir, 'dist');

const siteOrigin = (process.env.SITE_ORIGIN || 'https://behdoon.ir').replace(/\/$/, '');
const lastmod = new Date().toISOString().split('T')[0];

const allServicesPath = join(rootDir, 'src', 'data', 'all_services_data.json');
const allServices = JSON.parse(readFileSync(allServicesPath, 'utf-8'));

const urls = [
  { loc: `${siteOrigin}/`, priority: '1.0', changefreq: 'daily' },
  { loc: `${siteOrigin}/services`, priority: '0.9', changefreq: 'weekly' },
];

// Add 8 Categories and 53 SubServices
for (const [catKey, cat] of Object.entries(allServices)) {
  const catSlug = cat.slug || catKey;
  urls.push({
    loc: `${siteOrigin}/services/${catSlug}`,
    priority: '0.85',
    changefreq: 'weekly',
  });

  if (Array.isArray(cat.subServices)) {
    for (const sub of cat.subServices) {
      if (sub.slug) {
        urls.push({
          loc: `${siteOrigin}/services/${catSlug}/${sub.slug}`,
          priority: '0.80',
          changefreq: 'weekly',
        });
      }
    }
  }
}

// Add Magazine & Articles
urls.push({ loc: `${siteOrigin}/magazine`, priority: '0.85', changefreq: 'daily' });

const articleSlugs = [
  'hvac', 'water-cooler', 'package', 'radiator', 'water-heater',
  'plumbing', 'leak-detection', 'moisture-repair', 'faucets', 'water-tank', 'toilet', 'piping',
  'electrical', 'short-circuit', 'wiring', 'chandelier', 'switches', 'intercom',
  'renovation', 'painting', 'tiling', 'masonry', 'plastering', 'roof-insulation'
];

for (const slug of articleSlugs) {
  urls.push({
    loc: `${siteOrigin}/magazine/${slug}`,
    priority: '0.75',
    changefreq: 'monthly',
  });
}

// Static Pages
urls.push({ loc: `${siteOrigin}/about`, priority: '0.70', changefreq: 'monthly' });
urls.push({ loc: `${siteOrigin}/careers`, priority: '0.70', changefreq: 'monthly' });
urls.push({ loc: `${siteOrigin}/terms`, priority: '0.50', changefreq: 'monthly' });
urls.push({ loc: `${siteOrigin}/privacy`, priority: '0.50', changefreq: 'monthly' });

const xmlLines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`),
  '</urlset>',
];

const sitemapContent = xmlLines.join('\n');

writeFileSync(join(publicDir, 'sitemap.xml'), sitemapContent, 'utf-8');
console.log(`[generate-sitemap] Generated public/sitemap.xml with ${urls.length} verified URLs.`);

if (existsSync(distDir)) {
  writeFileSync(join(distDir, 'sitemap.xml'), sitemapContent, 'utf-8');
  console.log(`[generate-sitemap] Mirrored to dist/sitemap.xml.`);
}

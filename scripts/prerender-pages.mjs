import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(rootDir, 'dist');

const siteOrigin = (process.env.SITE_ORIGIN || 'https://behdoon.ir').replace(/\/$/, '');

if (!existsSync(distDir)) {
  console.error('[prerender-pages] dist directory does not exist. Run vite build first.');
  process.exit(1);
}

// 1. Load articles
const articlesRaw = readFileSync(join(rootDir, 'src', 'data', 'defaultArticles.ts'), 'utf8');
const articlesJson = articlesRaw
  .replace(/^import\s+type[^\n]+\n/m, '')
  .replace(/^export\s+const\s+DEFAULT_ARTICLES[^\=]+\=\s*/m, '')
  .replace(/;\s*$/, '');
const articles = JSON.parse(articlesJson);

// 2. Load services
const services = JSON.parse(readFileSync(join(rootDir, 'src', 'data', 'all_services_data.json'), 'utf8'));

// 3. Load templates
const articleTemplate = readFileSync(join(distDir, 'article-template.html'), 'utf8');
const servicesTemplate = readFileSync(join(distDir, 'services.html'), 'utf8');

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function writeHtmlWithDir(filePath, html) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, html, 'utf8');
}

const ssrFooterHtml = `
  <footer style="margin-top:3.5rem;padding:2.5rem 1.5rem;border-top:1px dashed #cbd5e1;background:#f8fafc;border-radius:16px;">
    <div style="max-width:960px;margin:0 auto;text-align:right;">
      <h3 style="font-size:1.15rem;font-weight:900;color:#133458;margin-bottom:0.75rem;">بهدون؛ سامانه هوشمند خدمات فنی و تأسیسات ساختمان در شهر تهران</h3>
      <p style="font-size:0.88rem;color:#475569;line-height:1.85;margin-bottom:0.75rem;text-align:justify;">
        بهدون (Behdoon) پلتفرم تخصصی ثبت آنلاین درخواست و اعزام سریع تکنسین‌های احراز صلاحیت‌شده در تمامی مناطق ۲۲‌گانه شهر تهران است. هدف بهدون ایجاد دسترسی آسان، شفافیت کامل قیمت‌ها، امنیت خاطر خانواده‌ها و ارتقای استاندارد خدمات فنی ساختمان است. کلیه خدمات بر اساس نرخ مصوب اتحادیه، صدور فاکتور رسمی معتبر و نظارت مستمر واحد کنترل کیفیت پشتیبانی می‌شوند.
      </p>
      <p style="font-size:0.88rem;color:#475569;line-height:1.85;margin-bottom:1.25rem;text-align:justify;">
        گستره خدمات فعال بهدون شامل عیب‌یابی و تعمیر تخصصی پکیج و رادیاتور، سرویس و راه‌اندازی کولر آبی و گازی، تشخیص دقیق ترکیدگی و نشت‌یابی لوله با دستگاه بدون تخریب، لوله‌کشی و لوله‌بازکنی شبانه‌روزی، برق‌کاری و رفع اتصالی فوری ساختمان، نقاشی و بازسازی دکوراسیون، نجاری و کابینت تا کلیدسازی سیار است. با استقرار شبکه‌ای متخصصین در سراسر پایتخت، نزدیک‌ترین کارشناس در کوتاه‌ترین زمان در محل شما حاضر خواهد شد.
      </p>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;font-size:0.8rem;font-weight:700;">
        <a href="/services/hvac/package" style="color:#8B1C31;text-decoration:none;background:#ffffff;padding:4px 12px;border-radius:20px;border:1px solid #e2e8f0;">تعمیر پکیج دیواری تهران</a>
        <a href="/services/hvac/water-cooler" style="color:#133458;text-decoration:none;background:#ffffff;padding:4px 12px;border-radius:20px;border:1px solid #e2e8f0;">سرویس کولر آبی</a>
        <a href="/services/plumbing/leak-detection" style="color:#133458;text-decoration:none;background:#ffffff;padding:4px 12px;border-radius:20px;border:1px solid #e2e8f0;">نشت‌یابی لوله با دستگاه</a>
        <a href="/services/electrical" style="color:#133458;text-decoration:none;background:#ffffff;padding:4px 12px;border-radius:20px;border:1px solid #e2e8f0;">برقکاری فوری ساختمان</a>
        <a href="/services/renovation" style="color:#133458;text-decoration:none;background:#ffffff;padding:4px 12px;border-radius:20px;border:1px solid #e2e8f0;">نقاشی و بازسازی ساختمان</a>
        <a href="/services/locksmith" style="color:#133458;text-decoration:none;background:#ffffff;padding:4px 12px;border-radius:20px;border:1px solid #e2e8f0;">کلیدسازی شبانه‌روزی</a>
        <a href="/magazine" style="color:#133458;text-decoration:none;background:#ffffff;padding:4px 12px;border-radius:20px;border:1px solid #e2e8f0;">مجله دانستنی‌های تأسیسات</a>
      </div>
      <div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid #e2e8f0;font-size:0.8rem;color:#64748b;display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;">
        <span>© تمامی حقوق برای بهدون محفوظ است. سامانه هوشمند خدمات فنی و تأسیسات ساختمان تهران.</span>
        <span>پشتیبانی شبانه‌روزی: ۰۹۳۳۳۲۵۶۸۸۵</span>
      </div>
    </div>
  </footer>
`;

console.log(`[prerender-pages] Starting pre-rendering for ${articles.length} articles and ${Object.keys(services).length} service categories...`);

// ----------------------------------------------------
// A. PRE-RENDER ARTICLES (24 TECHNICAL GUIDES)
// ----------------------------------------------------
let articleCount = 0;
for (const article of articles) {
  const slug = article.slug;
  const title = escapeHtml(article.title);
  const metaTitle = escapeHtml(article.metaTitle || `${article.title} | مجله تخصصی بهدون تهران`);
  const excerpt = escapeHtml(article.excerpt || '');
  const metaDesc = escapeHtml(article.metaDescription || article.excerpt || '');
  const canonicalUrl = `${siteOrigin}/magazine/${slug}`;
  const category = escapeHtml(article.category || 'تأسیسات ساختمان');

  const articleBodyHtml = Array.isArray(article.content)
    ? article.content.map((c) => c.html || '').join('\n')
    : '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'صفحه اصلی بهدون', 'item': `${siteOrigin}/` },
          { '@type': 'ListItem', 'position': 2, 'name': 'مجله تخصصی تأسیسات ساختمان', 'item': `${siteOrigin}/magazine` },
          { '@type': 'ListItem', 'position': 3, 'name': article.title, 'item': canonicalUrl }
        ]
      },
      {
        '@type': 'Article',
        '@id': `${canonicalUrl}#article`,
        'headline': article.title,
        'description': metaDesc,
        'image': article.coverImageUrl ? (article.coverImageUrl.startsWith('http') ? article.coverImageUrl : `${siteOrigin}${article.coverImageUrl}`) : `${siteOrigin}/og-image.jpg`,
        'datePublished': article.publishedAt || '2026-09-01T08:00:00.000Z',
        'dateModified': new Date().toISOString(),
        'inLanguage': 'fa-IR',
        'mainEntityOfPage': canonicalUrl,
        'author': {
          '@type': 'Organization',
          'name': 'بهدون',
          'url': `${siteOrigin}/`
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'بهدون',
          'logo': {
            '@type': 'ImageObject',
            'url': `${siteOrigin}/icon-512.png`
          }
        }
      }
    ]
  };

  const ssrAppContent = `
    <header class="semantic-ssr-header" style="padding:1rem 1.5rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e2e8f0;background:#ffffff;">
      <div style="display:flex;align-items:center;gap:0.75rem;">
        <a href="/" style="display:flex;align-items:center;gap:0.75rem;text-decoration:none;"><img src="/favicon.svg" alt="بهدون" width="36" height="36" /><strong style="font-size:1.25rem;color:#133458;">بهدون</strong></a>
      </div>
      <nav style="display:flex;gap:1rem;font-size:0.9rem;">
        <a href="/services" style="color:#334155;text-decoration:none;">خدمات تخصصی</a>
        <a href="/magazine" style="color:#334155;text-decoration:none;">مجله ساختمان</a>
        <a href="/orders" style="color:#334155;text-decoration:none;">پیگیری درخواست</a>
        <a href="tel:09333256885" style="color:#8B1C31;text-decoration:none;font-weight:700;">پشتیبانی: ۰۹۳۳۳۲۵۶۸۸۵</a>
      </nav>
    </header>

    <main class="semantic-ssr-main" style="max-width:960px;margin:2.5rem auto;padding:0 1.25rem;direction:rtl;text-align:right;">
      <nav aria-label="breadcrumb" style="font-size:0.85rem;color:#64748b;margin-bottom:1.5rem;">
        <a href="/" style="color:#64748b;text-decoration:none;">خانه</a> /
        <a href="/magazine" style="color:#64748b;text-decoration:none;">مجله تخصصی تأسیسات</a> /
        <span style="color:#133458;font-weight:700;">${title}</span>
      </nav>

      <article class="ssr-article-wrapper">
        <header style="margin-bottom:2rem;">
          <span style="display:inline-block;background:#ede9fe;color:#6d28d9;padding:4px 14px;border-radius:20px;font-size:0.82rem;font-weight:700;margin-bottom:0.75rem;">${category}</span>
          <h1 style="font-size:2rem;font-weight:900;color:#133458;margin:0.5rem 0 1rem;line-height:1.4;">${title}</h1>
          ${excerpt ? `<p style="font-size:1.05rem;color:#475569;line-height:1.8;background:#f8fafc;padding:1.25rem;border-radius:12px;border-right:4px solid #8B1C31;margin:0 0 1.5rem;">${excerpt}</p>` : ''}
          <div style="display:flex;align-items:center;gap:1.5rem;font-size:0.85rem;color:#64748b;border-bottom:1px solid #e2e8f0;padding-bottom:1rem;">
            <span>سامانه خدمات مهندسی بهدون تهران</span>
            <span>ضمانت کتبی ۳۰ روزه کیفیت</span>
            <span>اعزام شبانه‌روزی متخصصین</span>
          </div>
        </header>

        <div class="ssr-article-body" style="line-height:1.9;color:#334155;font-size:1.02rem;">
          ${articleBodyHtml}
        </div>

        <section style="margin-top:3rem;background:#f1f5f9;border-radius:16px;padding:2rem;text-align:center;">
          <h3 style="font-size:1.35rem;font-weight:800;color:#133458;margin-bottom:0.75rem;">نیاز به متخصص تأسیسات در تهران دارید؟</h3>
          <p style="font-size:0.95rem;color:#475569;max-width:650px;margin:0 auto 1.5rem;line-height:1.7;">
            تکنسین‌های بهدون در کلیه مناطق ۲۲‌گانه شهر تهران آماده اعزام، عیب‌یابی و انجام خدمات با نرخ مصوب اتحادیه و گارانتی کتبی هستند.
          </p>
          <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
            <a href="/#request" style="background:#8B1C31;color:#ffffff;padding:0.75rem 1.75rem;border-radius:10px;text-decoration:none;font-weight:800;">ثبت آنلاین درخواست تکنسین</a>
            <a href="tel:09333256885" style="background:#133458;color:#ffffff;padding:0.75rem 1.75rem;border-radius:10px;text-decoration:none;font-weight:800;">تماس فوری: ۰۹۳۳۳۲۵۶۸۸۵</a>
          </div>
        </section>
      </article>
    </main>
    ${ssrFooterHtml}
  `;

  let html = articleTemplate;
  html = html.replace(/<title>.*?<\/title>/i, `<title>${metaTitle}</title>`);
  html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, `<meta name="description" content="${metaDesc}" />`);
  html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i, `<meta property="og:title" content="${metaTitle}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i, `<meta property="og:description" content="${metaDesc}" />`);
  html = html.replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:title" content="${metaTitle}" />`);
  html = html.replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:description" content="${metaDesc}" />`);
  html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
  html = html.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}" />`);
  if (!html.includes(`<link rel="canonical"`)) {
    html = html.replace('</head>', `  <link rel="canonical" href="${canonicalUrl}" />\n</head>`);
  }
  
  // Inject JSON-LD before </head>
  const headInject = `
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  `;
  html = html.replace('</head>', `${headInject}\n</head>`);

  // Inject SSR app content inside <div id="app"></div>
  html = html.replace('<div id="app"></div>', `<div id="app">${ssrAppContent}</div>`);

  writeHtmlWithDir(join(distDir, 'magazine', `${slug}.html`), html);
  writeHtmlWithDir(join(distDir, 'magazine', slug, 'index.html'), html);
  articleCount++;
}

console.log(`[prerender-pages] Successfully pre-rendered ${articleCount} magazine articles.`);

// ----------------------------------------------------
// B. PRE-RENDER SERVICES (8 CATEGORIES & 53 SUBSERVICES)
// ----------------------------------------------------
let catCount = 0;
let subCount = 0;

for (const [catKey, cat] of Object.entries(services)) {
  const catSlug = cat.slug || catKey;
  const catTitle = escapeHtml(cat.title || `${catKey} در تهران`);
  const metaTitle = escapeHtml(`${cat.title || catKey} در تهران | خدمات تخصصی بهدون`);
  const metaDesc = escapeHtml(cat.metaDesc || `ثبت آنلاین و اعزام فوری متخصصین ${catTitle} در سراسر تهران با ضمانت کتبی ۳۰ روزه کیفیت و نرخ مصوب اتحادیه.`);
  const canonicalUrl = `${siteOrigin}/services/${catSlug}`;

  const subServices = Array.isArray(cat.subServices) ? cat.subServices : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'صفحه اصلی', 'item': `${siteOrigin}/` },
          { '@type': 'ListItem', 'position': 2, 'name': 'خدمات تخصصی ساختمان', 'item': `${siteOrigin}/services` },
          { '@type': 'ListItem', 'position': 3, 'name': cat.title, 'item': canonicalUrl }
        ]
      },
      {
        '@type': 'CollectionPage',
        'name': metaTitle,
        'url': canonicalUrl,
        'description': metaDesc,
        'mainEntity': {
          '@type': 'ItemList',
          'itemListElement': subServices.map((sub, idx) => ({
            '@type': 'ListItem',
            'position': idx + 1,
            'name': sub.title,
            'url': `${canonicalUrl}/${sub.slug || sub.id}`
          }))
        }
      }
    ]
  };

  const subCardsHtml = subServices.map((sub) => `
    <article style="background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;padding:1.5rem;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
      <div>
        <h3 style="font-size:1.15rem;font-weight:800;color:#133458;margin:0 0 0.5rem;"><a href="${canonicalUrl}/${sub.slug || sub.id}" style="color:inherit;text-decoration:none;">${escapeHtml(sub.title)}</a></h3>
        <p style="font-size:0.88rem;color:#64748b;line-height:1.7;margin:0 0 1rem;">${escapeHtml(sub.description || '')}</p>
        <div style="font-size:0.8rem;color:#133458;background:#f1f5f9;padding:6px 12px;border-radius:8px;display:inline-block;margin-bottom:1rem;">
          ضمانت حسن انجام: ${sub.guaranteeDays || 30} روزه | زمان تخمینی: ${sub.estimatedTime || '۳۰ الی ۶۰ دقیقه'}
        </div>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;border-top:1px solid #f1f5f9;padding-top:1rem;margin-top:0.5rem;">
        <span style="font-size:0.85rem;color:#475569;">پایه اجرت: <strong style="color:#059669;">${sub.basePrice ? (sub.basePrice).toLocaleString('fa-IR') + ' تومان' : 'طبق نرخنامه مصوب'}</strong></span>
        <a href="/#request" style="background:#8B1C31;color:#ffffff;padding:0.4rem 1rem;border-radius:8px;font-size:0.82rem;font-weight:700;text-decoration:none;">ثبت درخواست</a>
      </div>
    </article>
  `).join('\n');

  const ssrAppContent = `
    <header class="semantic-ssr-header" style="padding:1rem 1.5rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e2e8f0;background:#ffffff;">
      <div style="display:flex;align-items:center;gap:0.75rem;">
        <a href="/" style="display:flex;align-items:center;gap:0.75rem;text-decoration:none;"><img src="/favicon.svg" alt="بهدون" width="36" height="36" /><strong style="font-size:1.25rem;color:#133458;">بهدون</strong></a>
      </div>
      <nav style="display:flex;gap:1rem;font-size:0.9rem;">
        <a href="/services" style="color:#334155;text-decoration:none;">خدمات تخصصی</a>
        <a href="/magazine" style="color:#334155;text-decoration:none;">مجله ساختمان</a>
        <a href="/orders" style="color:#334155;text-decoration:none;">پیگیری درخواست</a>
        <a href="tel:09333256885" style="color:#8B1C31;text-decoration:none;font-weight:700;">پشتیبانی: ۰۹۳۳۳۲۵۶۸۸۵</a>
      </nav>
    </header>

    <main class="semantic-ssr-main" style="max-width:1100px;margin:2.5rem auto;padding:0 1.25rem;direction:rtl;text-align:right;">
      <nav aria-label="breadcrumb" style="font-size:0.85rem;color:#64748b;margin-bottom:1.5rem;">
        <a href="/" style="color:#64748b;text-decoration:none;">خانه</a> /
        <a href="/services" style="color:#64748b;text-decoration:none;">خدمات تخصصی</a> /
        <span style="color:#133458;font-weight:700;">${catTitle}</span>
      </nav>

      <section style="margin-bottom:3rem;">
        <span style="display:inline-block;background:#ede9fe;color:#6d28d9;padding:4px 14px;border-radius:20px;font-size:0.82rem;font-weight:700;margin-bottom:0.75rem;">سامانه تخصصی خدمات تهران</span>
        <h1 style="font-size:2rem;font-weight:900;color:#133458;margin:0.5rem 0 1rem;line-height:1.4;">${catTitle}</h1>
        <p style="font-size:1.05rem;color:#475569;line-height:1.8;max-width:850px;margin:0 0 1.5rem;">${metaDesc}</p>
        <div style="display:flex;gap:1rem;flex-wrap:wrap;">
          <a href="/#request" style="background:#8B1C31;color:#ffffff;padding:0.75rem 1.75rem;border-radius:10px;text-decoration:none;font-weight:800;">ثبت آنلاین درخواست تکنسین</a>
          <a href="tel:09333256885" style="background:#133458;color:#ffffff;padding:0.75rem 1.75rem;border-radius:10px;text-decoration:none;font-weight:800;">اعزام فوری: ۰۹۳۳۳۲۵۶۸۸۵</a>
        </div>
      </section>

      <section style="margin-bottom:3.5rem;">
        <h2 style="font-size:1.35rem;font-weight:800;color:#133458;margin-bottom:1.5rem;border-bottom:2px solid #e2e8f0;padding-bottom:0.5rem;">
          زیرخدمات تخصصی ${catTitle}
        </h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1.5rem;">
          ${subCardsHtml}
        </div>
      </section>
    </main>
    ${ssrFooterHtml}
  `;

  let html = servicesTemplate;
  html = html.replace(/<title>.*?<\/title>/i, `<title>${metaTitle}</title>`);
  html = html.replace(/<meta\s+name="title"\s+content=".*?"\s*\/?>/i, `<meta name="title" content="${metaTitle}" />`);
  html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, `<meta name="description" content="${metaDesc}" />`);
  html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i, `<meta property="og:title" content="${metaTitle}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i, `<meta property="og:description" content="${metaDesc}" />`);
  html = html.replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:title" content="${metaTitle}" />`);
  html = html.replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:description" content="${metaDesc}" />`);
  html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
  html = html.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}" />`);

  const headInject = `
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  `;
  html = html.replace('</head>', `${headInject}\n</head>`);

  // Replace content of <div id="app">...</div>
  html = html.replace(/<div id="app">[\s\S]*?<\/div>\s*<div class="app-loading-overlay"/i, `<div id="app">${ssrAppContent}</div>\n    <div class="app-loading-overlay"`);

  writeHtmlWithDir(join(distDir, 'services', `${catSlug}.html`), html);
  writeHtmlWithDir(join(distDir, 'services', catSlug, 'index.html'), html);
  catCount++;

  // Sub-services individual pre-render
  for (const sub of subServices) {
    const subSlug = sub.slug || sub.id;
    const subCanonical = `${canonicalUrl}/${subSlug}`;
    const subMetaTitle = `${escapeHtml(sub.title)} در تهران | بهدون`;
    const subMetaDesc = escapeHtml(sub.description || metaDesc);

    const subJsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'صفحه اصلی', 'item': `${siteOrigin}/` },
            { '@type': 'ListItem', 'position': 2, 'name': cat.title, 'item': canonicalUrl },
            { '@type': 'ListItem', 'position': 3, 'name': sub.title, 'item': subCanonical }
          ]
        },
        {
          '@type': 'Service',
          'name': sub.title,
          'description': subMetaDesc,
          'serviceType': cat.title,
          'provider': {
            '@type': 'Organization',
            'name': 'بهدون',
            'url': `${siteOrigin}/`
          },
          'areaServed': {
            '@type': 'City',
            'name': 'تهران'
          }
        }
      ]
    };

    let subHtml = servicesTemplate;
    subHtml = subHtml.replace(/<title>.*?<\/title>/i, `<title>${subMetaTitle}</title>`);
    subHtml = subHtml.replace(/<meta\s+name="title"\s+content=".*?"\s*\/?>/i, `<meta name="title" content="${subMetaTitle}" />`);
    subHtml = subHtml.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, `<meta name="description" content="${subMetaDesc}" />`);
    subHtml = subHtml.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i, `<meta property="og:title" content="${subMetaTitle}" />`);
    subHtml = subHtml.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i, `<meta property="og:description" content="${subMetaDesc}" />`);
    subHtml = subHtml.replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:title" content="${subMetaTitle}" />`);
    subHtml = subHtml.replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:description" content="${subMetaDesc}" />`);
    subHtml = subHtml.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i, `<link rel="canonical" href="${subCanonical}" />`);
    subHtml = subHtml.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i, `<meta property="og:url" content="${subCanonical}" />`);
    const subHeadInject = `
      <script type="application/ld+json">${JSON.stringify(subJsonLd)}</script>
    `;
    subHtml = subHtml.replace('</head>', `${subHeadInject}\n</head>`);

    const subSsrApp = `
      <header class="semantic-ssr-header" style="padding:1rem 1.5rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e2e8f0;background:#ffffff;">
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <a href="/" style="display:flex;align-items:center;gap:0.75rem;text-decoration:none;"><img src="/favicon.svg" alt="بهدون" width="36" height="36" /><strong style="font-size:1.25rem;color:#133458;">بهدون</strong></a>
        </div>
        <nav style="display:flex;gap:1rem;font-size:0.9rem;">
          <a href="/services" style="color:#334155;text-decoration:none;">خدمات تخصصی</a>
          <a href="/magazine" style="color:#334155;text-decoration:none;">مجله ساختمان</a>
          <a href="/orders" style="color:#334155;text-decoration:none;">پیگیری درخواست</a>
          <a href="tel:09333256885" style="color:#8B1C31;text-decoration:none;font-weight:700;">پشتیبانی: ۰۹۳۳۳۲۵۶۸۸۵</a>
        </nav>
      </header>
      <main class="semantic-ssr-main" style="max-width:960px;margin:2.5rem auto;padding:0 1.25rem;direction:rtl;text-align:right;">
        <nav aria-label="breadcrumb" style="font-size:0.85rem;color:#64748b;margin-bottom:1.5rem;">
          <a href="/" style="color:#64748b;text-decoration:none;">خانه</a> /
          <a href="/services" style="color:#64748b;text-decoration:none;">خدمات تخصصی</a> /
          <a href="${canonicalUrl}" style="color:#64748b;text-decoration:none;">${catTitle}</a> /
          <span style="color:#133458;font-weight:700;">${escapeHtml(sub.title)}</span>
        </nav>
        <article style="background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;padding:2rem;box-shadow:0 2px 8px rgba(0,0,0,0.03);">
          <span style="background:#ede9fe;color:#6d28d9;padding:4px 12px;border-radius:20px;font-size:0.8rem;font-weight:700;">${catTitle}</span>
          <h1 style="font-size:1.85rem;font-weight:900;color:#133458;margin:0.75rem 0 1rem;">${escapeHtml(sub.title)} در تهران</h1>
          <p style="font-size:1.02rem;color:#475569;line-height:1.8;margin-bottom:1.5rem;">${subMetaDesc}</p>
          <div style="background:#f8fafc;border-radius:12px;padding:1.25rem;margin-bottom:2rem;display:flex;gap:2rem;flex-wrap:wrap;">
            <div><span style="color:#64748b;font-size:0.85rem;">پایه اجرت:</span> <strong style="color:#059669;font-size:1.1rem;">${sub.basePrice ? sub.basePrice.toLocaleString('fa-IR') + ' تومان' : 'طبق نرخنامه مصوب'}</strong></div>
            <div><span style="color:#64748b;font-size:0.85rem;">ضمانت کیفیت:</span> <strong style="color:#133458;">${sub.guaranteeDays || 30} روز ضمانت کتبی</strong></div>
            <div><span style="color:#64748b;font-size:0.85rem;">زمان اعزام و انجام:</span> <strong style="color:#133458;">${sub.estimatedTime || '۳۰ الی ۶۰ دقیقه'}</strong></div>
          </div>
          <div style="display:flex;gap:1rem;flex-wrap:wrap;">
            <a href="/#request" style="background:#8B1C31;color:#ffffff;padding:0.75rem 1.75rem;border-radius:10px;text-decoration:none;font-weight:800;">ثبت آنلاین درخواست این خدمت</a>
            <a href="tel:09333256885" style="background:#133458;color:#ffffff;padding:0.75rem 1.75rem;border-radius:10px;text-decoration:none;font-weight:800;">اعزام فوری شبانه‌روزی: ۰۹۳۳۳۲۵۶۸۸۵</a>
          </div>
        </article>
      </main>
      ${ssrFooterHtml}
    `;
    subHtml = subHtml.replace(/<div id="app">[\s\S]*?<\/div>\s*<div class="app-loading-overlay"/i, `<div id="app">${subSsrApp}</div>\n    <div class="app-loading-overlay"`);

    writeHtmlWithDir(join(distDir, 'services', catSlug, `${subSlug}.html`), subHtml);
    writeHtmlWithDir(join(distDir, 'services', catSlug, subSlug, 'index.html'), subHtml);
    subCount++;
  }
}

console.log(`[prerender-pages] Successfully pre-rendered ${catCount} categories and ${subCount} sub-services.`);

// ----------------------------------------------------
// C. GENERATE _redirects FOR CLOUDFLARE (MAX 100 RULES)
// ----------------------------------------------------
const redirectLines = [
  '# Static 301 Redirects',
  '/demo  /  301',
  '/demo/  /  301',
  '/preview  /  301',
  '/track  /orders  301',
  '/hvac  /services/hvac  301',
  '/hvac/*  /services/hvac  301',
  '/admin  /management  301',
  '/admin/*  /management  301',
  '',
  '# Clean Static Pages (200 Rewrites)',
  '/management  /management.html  200',
  '/orders  /orders.html  200',
  '/profile  /profile.html  200',
  '/careers  /careers.html  200',
  '/about  /about.html  200',
  '/privacy  /privacy.html  200',
  '/terms  /terms.html  200',
  '/magazine  /magazine.html  200',
  '/services  /services.html  200',
  '/offline  /offline.html  200',
];

writeFileSync(join(distDir, '_redirects'), redirectLines.join('\n'), 'utf8');
if (existsSync(join(rootDir, 'public'))) {
  writeFileSync(join(rootDir, 'public', '_redirects'), redirectLines.join('\n'), 'utf8');
}
console.log(`[prerender-pages] Generated _redirects with ${redirectLines.length} rules.`);
console.log(`[prerender-pages] All static SEO pages generated successfully!`);

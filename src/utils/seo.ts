import type { DynamicArticle, DynamicCustomPage, SeoSettings, HeroSloganSetting } from './dynamicContent.ts';

function ensureMeta(name: string, attr: 'name' | 'property' = 'name'): HTMLMetaElement {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  return el;
}

// روی هر صفحه فراخوانی می‌شود: کد تأیید Search Console، اسکریپت Google Analytics و تصویر پیش‌فرض
// اشتراک‌گذاری — هرکدام فقط اگر خریدار در «مدیریت سئو» مقداردهی کرده باشد.
export function applySiteSeoSettings(seo?: SeoSettings): void {
  if (!seo) return;

  if (seo.googleSiteVerification) {
    ensureMeta('google-site-verification').setAttribute('content', seo.googleSiteVerification);
  }

  if (seo.googleAnalyticsId && !document.getElementById('ga4-loader')) {
    const loader = document.createElement('script');
    loader.id = 'ga4-loader';
    loader.async = true;
    loader.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(seo.googleAnalyticsId)}`;
    document.head.appendChild(loader);

    const inline = document.createElement('script');
    inline.id = 'ga4-inline';
    inline.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${seo.googleAnalyticsId}');`;
    document.head.appendChild(inline);
  }

  if (seo.defaultOgImage) {
    ensureMeta('og:image', 'property').setAttribute('content', seo.defaultOgImage);
    ensureMeta('twitter:image').setAttribute('content', seo.defaultOgImage);
  }
}

// به‌روزرسانی متاتگ‌های سئو و اسکیمای ساختاریافته گوگل بر اساس شعار سایت و نام برند
export function applyHeroSloganSeo(
  heroSlogan?: HeroSloganSetting,
  siteName?: { fa?: string; en?: string },
): void {
  const brandFa = siteName?.fa?.trim() || 'بهدون';
  const headline = heroSlogan?.headline?.fa?.trim() || 'خدمات حرفه‌ای و تخصصی ساختمان در تهران';
  const subtitle = heroSlogan?.subtitle?.fa?.trim() || 'ثبت آنلاین درخواست اعزام فوری تکنسین و استادکار تأسیسات، لوله‌کشی، برقکاری و بازسازی ساختمان با ضمانت کتبی کیفیت.';

  const fullDescription = `${brandFa} | ${headline} - ${subtitle}`;

  // Standard Meta Description
  ensureMeta('description').setAttribute('content', fullDescription);

  // Open Graph
  ensureMeta('og:description', 'property').setAttribute('content', fullDescription);
  ensureMeta('og:title', 'property').setAttribute('content', `${brandFa} | ${headline}`);
  ensureMeta('og:site_name', 'property').setAttribute('content', brandFa);

  // Twitter Cards
  ensureMeta('twitter:description').setAttribute('content', fullDescription);
  ensureMeta('twitter:title').setAttribute('content', `${brandFa} | ${headline}`);

  // Schema.org JSON-LD Structured Data for Google Rich Snippets
  document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]').forEach((script) => {
    try {
      const data = JSON.parse(script.textContent ?? '') as Record<string, unknown>;
      let changed = false;
      if (data['@type'] === 'WebSite' || data['@type'] === 'LocalBusiness' || data['@type'] === 'Organization') {
        data.description = fullDescription;
        if (data.name) data.name = brandFa;
        changed = true;
      }
      if (changed) script.textContent = JSON.stringify(data);
    } catch {
      /* ignore invalid JSON-LD */
    }
  });
}

// فقط در صفحه‌ی مقاله، بعد از دریافت مقاله‌ی واقعی فراخوانی می‌شود — تگ‌های ثابت و عمومی
// article-template.html را با مقادیر مخصوص همان مقاله جایگزین می‌کند.
export function applyArticleSeo(article: DynamicArticle): void {
  const title = article.metaTitle || article.title;
  const description = article.metaDescription || article.excerpt;
  const canonicalUrl = `${location.origin}/magazine/${article.slug}`;

  document.title = title;
  ensureMeta('description').setAttribute('content', description);
  ensureMeta('og:title', 'property').setAttribute('content', title);
  ensureMeta('og:description', 'property').setAttribute('content', description);
  ensureMeta('og:url', 'property').setAttribute('content', canonicalUrl);
  ensureMeta('twitter:title').setAttribute('content', title);

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = canonicalUrl;

  if (article.coverImageUrl) {
    ensureMeta('og:image', 'property').setAttribute('content', article.coverImageUrl);
    ensureMeta('twitter:image').setAttribute('content', article.coverImageUrl);
  }

  const jsonLd = document.createElement('script');
  jsonLd.type = 'application/ld+json';
  jsonLd.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    ...(article.coverImageUrl ? { image: article.coverImageUrl } : {}),
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
    mainEntityOfPage: canonicalUrl,
  });
  document.head.appendChild(jsonLd);
}

export function applyPageSeo(page: DynamicCustomPage): void {
  const title = page.metaTitle || page.title;
  const description = page.metaDescription || page.excerpt;
  const canonicalUrl = `${location.origin}/p/${page.slug}`;

  document.title = title;
  ensureMeta('description').setAttribute('content', description);
  ensureMeta('og:title', 'property').setAttribute('content', title);
  ensureMeta('og:description', 'property').setAttribute('content', description);
  ensureMeta('og:url', 'property').setAttribute('content', canonicalUrl);
  ensureMeta('twitter:title').setAttribute('content', title);

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = canonicalUrl;

  if (page.coverImageUrl) {
    ensureMeta('og:image', 'property').setAttribute('content', page.coverImageUrl);
    ensureMeta('twitter:image').setAttribute('content', page.coverImageUrl);
  }

  const jsonLd = document.createElement('script');
  jsonLd.type = 'application/ld+json';
  jsonLd.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    headline: title,
    description,
    ...(page.coverImageUrl ? { image: page.coverImageUrl } : {}),
    mainEntityOfPage: canonicalUrl,
  });
  document.head.appendChild(jsonLd);
}


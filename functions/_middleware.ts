// @ts-nocheck — این فایل با runtime مخصوص Cloudflare Pages Functions اجرا می‌شود (نه Vite/tsc پروژه)،
// پس بیرون از tsconfig.json (که فقط src را می‌بیند) قرار دارد. به همین دلیل هم عمداً از src/ چیزی
// import نمی‌کند — ماژول‌های src برای مرورگر نوشته شده‌اند (مثلاً src/i18n/lang.ts در همان بار اول
// module-level به localStorage دست می‌زند)، و اجرای مستقیم‌شان زیر این runtime می‌تواند بی‌سروصدا خطا
// بدهد؛ به‌جایش این‌جا نسخه‌ی ساده و مستقل (فقط فارسی، بدون وابستگی به i18n سمت‌کلاینت) نوشته شده.

// روش «برچسب HTML» گوگل Search Console، صفحه را بدون اجرای جاوااسکریپت واکشی می‌کند — پس تزریق
// سمت‌کلاینت (applySiteSeoSettings در seo.ts) هرگز توسط ربات تأیید گوگل دیده نمی‌شود. این میان‌افزار
// همان تگ را سمت‌سرور، پیش از رسیدن HTML به مرورگر/ربات، اضافه می‌کند. اگر خریدار VITE_API_BASE_URL
// را در بیلد ست نکرده باشد (فایل استاتیک api-base.txt خالی خواهد بود)، این میان‌افزار کاملاً بی‌اثر
// می‌ماند — هیچ دامنه‌ای این‌جا هاردکد نیست.

const CACHE_TTL_SECONDS = 300;

async function readApiBase(env, url) {
  const res = await env.ASSETS.fetch(new URL('/api-base.txt', url));
  if (!res.ok) return '';
  return (await res.text()).trim();
}

async function cachedFetch(apiBase, cacheSuffix, loader) {
  const cache = caches.default;
  const cacheKey = new Request(`${apiBase}/__prerender_cache__${cacheSuffix}`);
  const cached = await cache.match(cacheKey);
  if (cached) return await cached.json();

  const value = await loader();
  await cache.put(cacheKey, new Response(JSON.stringify(value), { headers: { 'Cache-Control': `max-age=${CACHE_TTL_SECONDS}` } }));
  return value;
}

async function fetchVerificationCode(apiBase) {
  const data = await cachedFetch(apiBase, '/verification', async () => {
    const res = await fetch(`${apiBase}/api/settings`);
    if (!res.ok) return { code: '' };
    const body = await res.json().catch(() => null);
    return { code: body?.settings?.seo?.googleSiteVerification ?? '' };
  });
  return data.code;
}

// ===== پیش‌رندر متن صفحات برای خزنده‌ها/ابزارهای هوش مصنوعی که جاوااسکریپت اجرا نمی‌کنند =====
// همه‌ی محتوای واقعی هر صفحه (متن هیرو، مقاله‌ها، صفحات حقوقی...) فقط بعد از اجرای جاوااسکریپت با
// innerHTML ساخته می‌شود؛ یعنی HTML خام همیشه <div id="app"></div> خالی بوده — یک خزنده‌ی بدون‌
// جاوااسکریپت (یا ابزاری مثل خواندن سایت توسط ChatGPT) عملاً هیچ متنی نمی‌بیند. توابع زیر همان
// داده‌هایی که هر صفحه از API می‌خواند را می‌گیرند و یک نسخه‌ی متنی و معنایی (h1/h2/p/ul) می‌سازند
// که در پاسخ سرور تزریق می‌شود؛ کاربر واقعی با مرورگر، بلافاصله بعد از لود جاوااسکریپت همان صفحه‌ی
// تعاملی همیشگی را می‌بیند (بدون هیچ تغییری) — این نسخه فقط برای زمانی است که آن جاوااسکریپت اصلاً
// اجرا نمی‌شود.
function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ----- صفحه اصلی -----

function renderHomeSnapshot(settings, testimonials) {
  const sections = settings?.homepage_layout?.sections?.length ? settings.homepage_layout.sections : [];
  const hasHero = sections.some((s) => s.type === 'hero');
  const allSections = hasHero ? sections : [{ id: 'hero', type: 'hero', visible: true }, ...sections];

  let html = '';
  for (const section of allSections) {
    if (section.type !== 'hero' && section.visible === false) continue;

    if (section.type === 'hero') {
      const heading = escapeHtml(section.heading || 'حمل و جابه‌جایی، ساده‌تر از همیشه');
      const body = section.body ? escapeHtml(section.body) : '';
      html += `<h1>${heading}</h1>${body ? `<p>${body}</p>` : ''}`;
      continue;
    }

    const layout = section.layout || 'text';

    if (layout === 'testimonials') {
      if (!testimonials.length) continue;
      const heading = escapeHtml(section.heading || 'نظرات مشتریان ما');
      html += `<h2>${heading}</h2><ul>`;
      for (const t of testimonials) {
        if (!t?.text) continue;
        html += `<li>${escapeHtml(t.text)}${t.customerName ? ` — ${escapeHtml(t.customerName)}` : ''}</li>`;
      }
      html += '</ul>';
      continue;
    }

    const heading = section.heading ? escapeHtml(section.heading) : '';
    const subheading = section.subheading ? escapeHtml(section.subheading) : '';
    if (heading) html += `<h2>${heading}</h2>`;
    if (subheading) html += `<p>${subheading}</p>`;

    if (layout === 'text') {
      const body = section.body || '';
      html += body
        .split('\n')
        .filter(Boolean)
        .map((p) => `<p>${escapeHtml(p)}</p>`)
        .join('');
      continue;
    }

    const items = Array.isArray(section.items) ? section.items : [];
    if (items.length) {
      html += '<ul>';
      for (const item of items) {
        const title = item?.title ? escapeHtml(item.title) : '';
        const text = item?.text ? escapeHtml(item.text) : '';
        if (!title && !text) continue;
        html += `<li>${title ? `<strong>${title}</strong> ` : ''}${text}</li>`;
      }
      html += '</ul>';
    }
  }

  return html;
}

async function fetchHomeSnapshot(apiBase) {
  return cachedFetch(apiBase, '/home', async () => {
    const [settingsRes, testimonialsRes] = await Promise.all([fetch(`${apiBase}/api/settings`), fetch(`${apiBase}/api/testimonials`)]);
    const settingsData = settingsRes.ok ? await settingsRes.json().catch(() => null) : null;
    const testimonialsData = testimonialsRes.ok ? await testimonialsRes.json().catch(() => null) : null;
    return { html: renderHomeSnapshot(settingsData?.settings ?? {}, testimonialsData?.testimonials ?? []) };
  }).then((r) => r.html);
}

// ----- فهرست مجله -----

function renderMagazineListSnapshot(articles) {
  if (!articles.length) return '<h1>مجله بهدون</h1>';
  let html = '<h1>مجله بهدون</h1><ul>';
  for (const a of articles) {
    if (!a?.slug || !a?.title) continue;
    html += `<li><a href="/magazine/${encodeURIComponent(a.slug)}">${escapeHtml(a.title)}</a>${a.excerpt ? ` — ${escapeHtml(a.excerpt)}` : ''}</li>`;
  }
  html += '</ul>';
  return html;
}

async function fetchMagazineListSnapshot(apiBase) {
  return cachedFetch(apiBase, '/magazine-list', async () => {
    const res = await fetch(`${apiBase}/api/magazine/articles`);
    const data = res.ok ? await res.json().catch(() => null) : null;
    return { html: renderMagazineListSnapshot(data?.articles ?? []) };
  }).then((r) => r.html);
}

// ----- جزئیات یک مقاله -----
// این تنها صفحه‌ای است که علاوه بر #app، متادیتای سئو (title/og/twitter/canonical/JSON-LD) هم سمت
// سرور جایگزین می‌شود: article-template.html همیشه با همان عنوان و توضیح عمومی «مجله بهدون» شروع
// می‌شود (applyArticleSeo در src/utils/seo.ts فقط سمت‌کلاینت آن را با مقاله‌ی واقعی جایگزین می‌کند)
// — یعنی بدون این کار، پیش‌نمایش لینک در شبکه‌های اجتماعی و اسنیپت گوگل برای هر مقاله یکسان و
// نامرتبط بود.

function renderArticleBlock(block) {
  if (!block || typeof block !== 'object') return '';
  switch (block.type) {
    case 'heading':
      return block.text ? `<h2>${escapeHtml(block.text)}</h2>` : '';
    case 'paragraph':
      return block.text ? `<p>${escapeHtml(block.text)}</p>` : '';
    case 'list':
      return Array.isArray(block.items) && block.items.length
        ? `<ul>${block.items.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>`
        : '';
    case 'image':
      return block.caption ? `<figure><figcaption>${escapeHtml(block.caption)}</figcaption></figure>` : '';
    default:
      return '';
  }
}

function renderArticleSnapshot(article) {
  const title = escapeHtml(article.title);
  const excerpt = article.excerpt ? `<p>${escapeHtml(article.excerpt)}</p>` : '';
  const body = Array.isArray(article.content) ? article.content.map(renderArticleBlock).join('') : '';
  return `<h1>${title}</h1>${excerpt}${body}`;
}

async function fetchArticle(apiBase, slug) {
  return cachedFetch(apiBase, `/article/${encodeURIComponent(slug)}`, async () => {
    const res = await fetch(`${apiBase}/api/magazine/articles/${encodeURIComponent(slug)}`);
    if (!res.ok) return { article: null };
    const data = await res.json().catch(() => null);
    return { article: data?.article ?? null };
  }).then((r) => r.article);
}

// ----- صفحات حقوقی/درباره‌ما (about/terms/privacy، هر سه از یک الگو) -----

function renderLegalSnapshot(page) {
  if (!page) return '';
  let html = `<h1>${escapeHtml(page.title)}</h1>`;
  if (page.intro) html += `<p>${escapeHtml(page.intro)}</p>`;
  for (const section of Array.isArray(page.sections) ? page.sections : []) {
    if (section.heading) html += `<h2>${escapeHtml(section.heading)}</h2>`;
    for (const p of Array.isArray(section.paragraphs) ? section.paragraphs : []) {
      html += `<p>${escapeHtml(p)}</p>`;
    }
    if (Array.isArray(section.list) && section.list.length) {
      html += `<ul>${section.list.map((li) => `<li>${escapeHtml(li)}</li>`).join('')}</ul>`;
    }
  }
  return html;
}

async function fetchLegalSnapshot(apiBase, slug) {
  return cachedFetch(apiBase, `/legal/${slug}`, async () => {
    const res = await fetch(`${apiBase}/api/settings`);
    const data = res.ok ? await res.json().catch(() => null) : null;
    const page = data?.settings?.legal_pages?.[slug] ?? null;
    return { html: renderLegalSnapshot(page) };
  }).then((r) => r.html);
}

// ----- فرصت‌های شغلی -----
// این صفحه محتوایی که از دیتابیس بیاید ندارد (فقط فرم درخواست همکاری) — متن ثابت src/sections/CareersView.ts
// را همین‌جا هم عیناً تکرار می‌کنیم، بدون نیاز به فراخوانی API.

function renderCareersSnapshot() {
  return (
    '<h1>فرصت‌های شغلی بهدون</h1>' +
    '<p>به تیم متخصصان بهدون بپیوندید؛ به تکنسین‌ها و استادکاران فنی تأسیسات، سرمایش و گرمایش، برق و بازسازی نیاز داریم. فرم زیر را پر کنید تا همکاران ما با شما تماس بگیرند.</p>' +
    '<ul><li>تکنسین و استادکار فنی</li><li>سرویس‌کار پکیج و کولر</li><li>لوله‌کش و نشت‌یاب</li><li>برقکار ساختمان</li><li>تعمیرات و بازسازی</li></ul>'
  );
}

export const onRequest = async (context) => {
  const response = await context.next();

  try {
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return response;

    const url = context.request.url;
    const pathname = new URL(url).pathname;
    const apiBase = await readApiBase(context.env, url);
    if (!apiBase) return response;

    const rewriter = new HTMLRewriter();
    let didRewrite = false;

    const code = await fetchVerificationCode(apiBase);
    if (code) {
      didRewrite = true;
      rewriter.on('head', {
        element(el) {
          el.append(`<meta name="google-site-verification" content="${code.replace(/"/g, '&quot;')}">`, { html: true });
        },
      });
    }

    const articleMatch = pathname.match(/^\/magazine\/([a-z0-9-]+)\/?$/);

    if (pathname === '/') {
      const snapshotHtml = await fetchHomeSnapshot(apiBase);
      if (snapshotHtml) {
        didRewrite = true;
        rewriter.on('#app', { element(el) { el.setInnerContent(snapshotHtml, { html: true }); } });
      }
    } else if (pathname === '/magazine') {
      const snapshotHtml = await fetchMagazineListSnapshot(apiBase);
      if (snapshotHtml) {
        didRewrite = true;
        rewriter.on('#app', { element(el) { el.setInnerContent(snapshotHtml, { html: true }); } });
      }
    } else if (articleMatch) {
      const article = await fetchArticle(apiBase, articleMatch[1]);
      if (article) {
        didRewrite = true;
        const title = article.metaTitle || article.title;
        const description = article.metaDescription || article.excerpt || '';
        const canonicalUrl = `${new URL(url).origin}/magazine/${article.slug}`;

        rewriter.on('#app', { element(el) { el.setInnerContent(renderArticleSnapshot(article), { html: true }); } });
        rewriter.on('title', { element(el) { el.setInnerContent(title); } });
        rewriter.on('meta[name="description"]', { element(el) { el.setAttribute('content', description); } });
        rewriter.on('meta[property="og:title"]', { element(el) { el.setAttribute('content', title); } });
        rewriter.on('meta[property="og:description"]', { element(el) { el.setAttribute('content', description); } });
        rewriter.on('meta[name="twitter:title"]', { element(el) { el.setAttribute('content', title); } });
        if (article.coverImageUrl) {
          rewriter.on('meta[property="og:image"]', { element(el) { el.setAttribute('content', article.coverImageUrl); } });
          rewriter.on('meta[name="twitter:image"]', { element(el) { el.setAttribute('content', article.coverImageUrl); } });
        }
        rewriter.on('head', {
          element(el) {
            el.append(`<link rel="canonical" href="${canonicalUrl}">`, { html: true });
            el.append(`<meta property="og:url" content="${canonicalUrl}">`, { html: true });
            const jsonLd = {
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: title,
              description,
              ...(article.coverImageUrl ? { image: article.coverImageUrl } : {}),
              ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
              mainEntityOfPage: canonicalUrl,
            };
            el.append(`<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`, { html: true });
          },
        });
      }
    } else if (pathname === '/about' || pathname === '/terms' || pathname === '/privacy') {
      const slug = pathname.slice(1);
      const snapshotHtml = await fetchLegalSnapshot(apiBase, slug);
      if (snapshotHtml) {
        didRewrite = true;
        rewriter.on('#app', { element(el) { el.setInnerContent(snapshotHtml, { html: true }); } });
      }
    } else if (pathname === '/careers') {
      didRewrite = true;
      rewriter.on('#app', { element(el) { el.setInnerContent(renderCareersSnapshot(), { html: true }); } });
    }

    return didRewrite ? rewriter.transform(response) : response;
  } catch {
    return response;
  }
};

import { icons } from '../components/icons.ts';
import { pick } from '../i18n/lang.ts';
import { toPersianDigits, gregorianToJalaali, formatJalaaliDate } from '../utils/jalali.ts';
import type { ArticleBlock, DynamicArticle } from '../utils/dynamicContent.ts';
import { findSubServiceByAnySlug, findCategory } from '../data/allServicesData.ts';

function videoEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v');
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
    if (u.hostname.includes('aparat.com')) {
      return url.replace('/v/', '/video/embed/videohash/').includes('embed') ? url : null;
    }
    return null;
  } catch {
    return null;
  }
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function extractTocAndProcessBlocks(blocks: ArticleBlock[]): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  let headingCounter = 0;

  const html = blocks
    .map((block) => {
      if (block.type === 'heading') {
        headingCounter++;
        const id = `article-sec-${headingCounter}`;
        const titleText = pick(block.text, block.textEn);
        toc.push({ id, text: titleText, level: 2 });
        return `<h2 id="${id}" class="article-heading-anchor">${titleText}</h2>`;
      }
      if (block.type === 'paragraph') {
        return `<p>${pick(block.text, block.textEn)}</p>`;
      }
      if (block.type === 'list') {
        const items = pick(block.items, block.itemsEn);
        return `<ul class="article-list">${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
      }
      if (block.type === 'richtext') {
        let htmlContent = pick(block.html, block.htmlEn);
        if (!htmlContent) return '';

        // Inject IDs into h2 and h3 tags in rich text for TOC linking if they don't have IDs
        htmlContent = htmlContent.replace(/<(h[23])([^>]*)>(.*?)<\/\1>/gi, (_match, tag, attrs, text) => {
          headingCounter++;
          const id = `article-sec-${headingCounter}`;
          const cleanText = text.replace(/<[^>]+>/g, '').trim();
          if (cleanText) {
            toc.push({ id, text: cleanText, level: tag.toLowerCase() === 'h2' ? 2 : 3 });
          }
          return `<${tag}${attrs} id="${id}" class="article-heading-anchor">${text}</${tag}>`;
        });

        return `<div class="article-richtext">${htmlContent}</div>`;
      }
      if (block.type === 'image') {
        const caption = pick(block.caption, block.captionEn);
        return `
          <figure class="article-image">
            <img src="${block.url}" alt="${caption || 'تصویر راهنمای بهدون'}" loading="lazy" />
            ${caption ? `<figcaption>${caption}</figcaption>` : ''}
          </figure>
        `;
      }
      if (block.type === 'video') {
        const embed = videoEmbedUrl(block.url);
        return embed
          ? `<div class="article-video"><iframe src="${embed}" title="video" allowfullscreen loading="lazy"></iframe></div>`
          : `<p class="article-video-link"><a href="${block.url}" target="_blank" rel="noopener">${pick('مشاهده ویدئو', 'Watch video')}</a></p>`;
      }
      return '';
    })
    .join('');

  return { html, toc };
}

export function renderArticleView(article: DynamicArticle): string {
  const publishedLabel = article.publishedAt
    ? formatJalaaliDate(gregorianToJalaali(new Date(article.publishedAt)))
    : 'شهریور ۱۴۰۳';

  const { html: processedContentHtml, toc } = extractTocAndProcessBlocks(article.content);

  // Attempt to match article to a service category or subservice for contextual CTA
  const matchedSub = findSubServiceByAnySlug(article.slug) || findSubServiceByAnySlug(article.category);
  const matchedCat = findCategory(article.category) || findCategory(article.slug) || matchedSub?.category;
  const bookingCategoryName = matchedCat?.title || article.category || 'خدمات فنی ساختمان';
  const bookingCategoryId = matchedCat?.id || 'plumbing';
  const bookingSubId = matchedSub?.subService?.id;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://behdoon.ir/magazine/${article.slug}`;

  return `
    <article class="article-page" itemscope itemtype="https://schema.org/TechArticle">
      <div class="container article-container">
        <!-- Breadcrumbs -->
        <nav class="article-breadcrumb" aria-label="${pick('مسیر صفحه', 'Breadcrumb')}">
          <a href="/">${pick('خانه', 'Home')}</a>
          <span aria-hidden="true" class="breadcrumb-sep">/</span>
          <a href="/magazine">${pick('مجله و دانشنامه بهدون', 'Magazine')}</a>
          <span aria-hidden="true" class="breadcrumb-sep">/</span>
          <span class="breadcrumb-category">${pick(article.category, article.categoryEn)}</span>
          <span aria-hidden="true" class="breadcrumb-sep">/</span>
          <span aria-current="page" class="breadcrumb-current">${pick(article.title, article.titleEn)}</span>
        </nav>

        <!-- Article Top Hero Header -->
        <header class="article-header-banner">
          <div class="article-header-top">
            <span class="article-category-badge">
              <span class="icon">${icons.layers || icons.shield}</span>
              <span>${pick(article.category, article.categoryEn)}</span>
            </span>
            <span class="article-expert-verified-pill" title="${pick('محتوا بازبینی شده توسط مهندسین ارشد بهدون', 'Verified by Behdoon Engineers')}">
              <span class="icon icon-check">${icons.checkCircle || '✓'}</span>
              <span>${pick('بررسی‌شده توسط کارشناس تأسیسات بهدون', 'Expert Reviewed')}</span>
            </span>
          </div>

          <h1 class="article-main-title" itemprop="headline">${pick(article.title, article.titleEn)}</h1>
          <p class="article-main-excerpt" itemprop="description">${pick(article.excerpt, article.excerptEn)}</p>

          <div class="article-meta-row">
            <div class="article-meta-items">
              <span class="meta-item">
                <span class="icon">${icons.calendar}</span>
                <time datetime="${article.publishedAt || ''}" itemprop="datePublished">${publishedLabel}</time>
              </span>
              <span class="meta-item">
                <span class="icon">${icons.clock}</span>
                <span>${toPersianDigits(article.readingTime || 7)} ${pick('دقیقه زمان مطالعه', 'min read')}</span>
              </span>
              <span class="meta-item meta-author" itemprop="author" itemscope itemtype="https://schema.org/Organization">
                <span class="icon">${icons.user}</span>
                <span itemprop="name">${pick('تیم فنی و مهندسی بهدون', 'Behdoon Technical Team')}</span>
              </span>
            </div>

            <div class="article-share-group">
              <span class="share-label">${pick('اشتراک‌گذاری:', 'Share:')}</span>
              <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + ' ' + currentUrl)}" target="_blank" rel="noopener noreferrer" class="share-pill share-whatsapp" title="ارسال در واتساپ">
                واتساپ
              </a>
              <a href="https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(article.title)}" target="_blank" rel="noopener noreferrer" class="share-pill share-telegram" title="ارسال در تلگرام">
                تلگرام
              </a>
              <button type="button" class="share-pill share-copy" onclick="navigator.clipboard.writeText(window.location.href); alert('لینک مقاله در حافظه کپی شد.');" title="کپی لینک مقاله">
                کپی لینک
              </button>
            </div>
          </div>

          ${
            article.coverImageUrl
              ? `
            <figure class="article-cover-figure">
              <img class="article-main-cover" src="${article.coverImageUrl}" alt="${pick(article.title, article.titleEn)}" itemprop="image" />
            </figure>
          `
              : ''
          }
        </header>

        <!-- Main Grid: Content + Sticky Sidebar -->
        <div class="article-layout-grid">
          <!-- Main Content Column -->
          <div class="article-content-column">
            <!-- Article Body -->
            <div class="article-body-wrapper" itemprop="articleBody">
              ${processedContentHtml}
            </div>

            <!-- In-Article Direct Booking Box -->
            <div class="article-inline-booking-box">
              <div class="booking-box-header">
                <div class="booking-box-badge">
                  <span class="icon">${icons.bolt}</span>
                  <span>${pick('اعزام فوری تکنسین متخصص بهدون', 'Immediate Dispatch')}</span>
                </div>
                <h3 class="booking-box-title">
                  ${pick(`نیاز به خدمات ${bookingCategoryName} در تهران دارید؟`, `Need ${bookingCategoryName} in Tehran?`)}
                </h3>
                <p class="booking-box-desc">
                  ${pick(
                    'استادکاران احراز هویت‌شده بهدون در تمامی مناطق ۲۲‌گانه تهران ظرف کمتر از ۴۵ دقیقه در محل شما حاضر شده و خدمات را با نرخ مصوب اتحادیه و ضمانت کتبی انجام می‌دهند.',
                    'Certified technicians dispatch across all 22 Tehran districts with written warranty and official rates.',
                  )}
                </p>
              </div>

              <div class="booking-box-actions">
                <button
                  type="button"
                  class="btn btn-primary booking-box-btn"
                  onclick="if(window.openRequestModal){ window.openRequestModal('${bookingCategoryId}'${bookingSubId ? `, '${bookingSubId}'` : ''}); } else { location.href='/#request'; }"
                >
                  <span class="icon">${icons.plusCircle}</span>
                  <span>${pick('ثبت آنلاین درخواست این خدمت', 'Book This Service Online')}</span>
                </button>
                <a href="tel:09333256885" class="btn btn-outline booking-box-call">
                  <span class="icon">${icons.phone}</span>
                  <span>${pick('تماس مستقیم: ۰۹۳۳۳۲۵۶۸۸۵', 'Direct Call: 09333256885')}</span>
                </a>
              </div>
            </div>

            <!-- Author & Assurance Bio Box -->
            <footer class="article-author-card">
              <div class="author-avatar">
                <span class="icon">${icons.shield || icons.user}</span>
              </div>
              <div class="author-info">
                <h4 class="author-name">${pick('تیم فنی و مهندسی بهدون (تهران)', 'Behdoon Engineering Team')}</h4>
                <p class="author-bio">
                  ${pick(
                    'تمامی راهنماها و مقالات دانشنامه بهدون توسط مهندسان تأسیسات مکانیکی و کارشناسان ارشد ساختمانی تهیه و بر مبنای آخرین ضوابط و تعرفه‌های اتحادیه‌های صنفی تهران به‌روزرسانی می‌شوند.',
                    'Articles are verified by certified mechanical facility specialists and updated according to official union standards in Tehran.',
                  )}
                </p>
                <div class="author-badges">
                  <span class="author-badge">✓ ${pick('مجوز رسمی تأسیسات', 'Certified Facilities')}</span>
                  <span class="author-badge">✓ ${pick('پشتیبانی ۲۴ ساعته', '24/7 Support')}</span>
                  <span class="author-badge">✓ ${pick('پوشش کلیه مناطق تهران', 'Tehran Coverage')}</span>
                </div>
              </div>
            </footer>
          </div>

          <!-- Sticky Sidebar Column -->
          <aside class="article-sidebar-column">
            <div class="article-sidebar-sticky">
              <!-- Table of Contents (TOC) -->
              ${
                toc.length > 1
                  ? `
                <div class="sidebar-widget article-toc-widget">
                  <div class="widget-title-row">
                    <span class="icon">${icons.fileText || icons.layers}</span>
                    <h3 class="widget-title">${pick('فهرست مطالب مقاله', 'Table of Contents')}</h3>
                  </div>
                  <nav class="article-toc-nav" aria-label="${pick('فهرست عناوین', 'Article Headings')}">
                    <ul class="article-toc-list">
                      ${toc
                        .map(
                          (item) => `
                        <li class="toc-item toc-level-${item.level}">
                          <a href="#${item.id}" class="toc-link" onclick="event.preventDefault(); document.getElementById('${item.id}')?.scrollIntoView({ behavior: 'smooth', block: 'start' });">
                            <span class="toc-bullet"></span>
                            <span class="toc-text">${item.text}</span>
                          </a>
                        </li>
                      `,
                        )
                        .join('')}
                    </ul>
                  </nav>
                </div>
              `
                  : ''
              }

              <!-- Direct Booking Widget -->
              <div class="sidebar-widget article-booking-widget">
                <div class="widget-highlight-badge">
                  <span class="icon">${icons.shield || icons.checkCircle}</span>
                  <span>${pick('ضمانت کتبی کیفیت', 'Written Guarantee')}</span>
                </div>
                <h3 class="booking-widget-title">${pick(`سفارش فوری ${bookingCategoryName}`, `Request ${bookingCategoryName}`)}</h3>
                <p class="booking-widget-desc">
                  ${pick(
                    'اعزام نزدیک‌ترین تکنسین متخصص با دستگاه و قطعات شرکتی به محل شما در تهران.',
                    'Certified technician with original parts dispatched quickly in Tehran.',
                  )}
                </p>
                <div class="booking-widget-features">
                  <div class="booking-feature-row">
                    <span class="feature-icon">⏱</span>
                    <span>${pick('اعزام سریع در کمتر از ۴۵ دقیقه', 'Under 45 mins dispatch')}</span>
                  </div>
                  <div class="booking-feature-row">
                    <span class="feature-icon">⚖</span>
                    <span>${pick('نرخ شفاف و مصوب اتحادیه تهران', 'Transparent union rates')}</span>
                  </div>
                  <div class="booking-feature-row">
                    <span class="feature-icon">🛡</span>
                    <span>${pick('ضمانت کتبی کیفیت و فاکتور رسمی', 'Written quality warranty')}</span>
                  </div>
                </div>

                <div class="booking-widget-buttons">
                  <button
                    type="button"
                    class="btn btn-primary w-full booking-widget-submit"
                    onclick="if(window.openRequestModal){ window.openRequestModal('${bookingCategoryId}'${bookingSubId ? `, '${bookingSubId}'` : ''}); } else { location.href='/#request'; }"
                  >
                    <span class="icon">${icons.plusCircle}</span>
                    <span>${pick('ثبت آنلاین درخواست', 'Request Service Online')}</span>
                  </button>
                  <a href="tel:09333256885" class="btn btn-outline w-full booking-widget-phone">
                    <span class="icon">${icons.phone}</span>
                    <span>${pick('۰۹۳۳۳۲۵۶۸۸۵', '09333256885')}</span>
                  </a>
                </div>
              </div>

              <!-- Quick Links to Directory -->
              <div class="sidebar-widget article-quick-links-widget">
                <h4 class="widget-mini-title">${pick('سایر دسته‌بندی‌های بهدون', 'Other Categories')}</h4>
                <div class="article-cat-tags">
                  <a href="/services/hvac" class="cat-tag-pill">${pick('سرمایش و گرمایش', 'HVAC')}</a>
                  <a href="/services/plumbing" class="cat-tag-pill">${pick('لوله‌کشی و تأسیسات', 'Plumbing')}</a>
                  <a href="/services/electrical" class="cat-tag-pill">${pick('برقکاری ساختمان', 'Electrical')}</a>
                  <a href="/services/renovation" class="cat-tag-pill">${pick('تعمیرات و بازسازی', 'Renovation')}</a>
                  <a href="/services/locksmith" class="cat-tag-pill">${pick('کلیدسازی و قفل', 'Locksmith')}</a>
                  <a href="/services/carpentry" class="cat-tag-pill">${pick('کابینت و نجاری', 'Carpentry')}</a>
                  <a href="/services/doors_windows" class="cat-tag-pill">${pick('در و پنجره', 'Windows')}</a>
                  <a href="/services/cleaning" class="cat-tag-pill">${pick('نظافت ساختمان', 'Cleaning')}</a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  `;
}

export function renderArticleNotFound(): string {
  return `
    <div class="container article-not-found">
      <div class="not-found-card">
        <span class="icon not-found-icon">${icons.article || icons.close}</span>
        <h1>${pick('مقاله مورد نظر یافت نشد', 'Article Not Found')}</h1>
        <p>${pick('ممکن است آدرس مقاله تغییر کرده یا به بخش دیگری منتقل شده باشد.', 'The article may have been moved or removed.')}</p>
        <div class="not-found-actions">
          <a class="btn btn-primary" href="/magazine">${pick('مشاهده سایر مقالات مجله', 'View All Articles')}</a>
          <a class="btn btn-outline" href="/">${pick('بازگشت به صفحه اصلی', 'Home Page')}</a>
        </div>
      </div>
    </div>
  `;
}

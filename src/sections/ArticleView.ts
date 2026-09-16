import { icons } from '../components/icons.ts';
import { pick } from '../i18n/lang.ts';
import { toPersianDigits, gregorianToJalaali, formatJalaaliDate } from '../utils/jalali.ts';
import type { ArticleBlock, DynamicArticle } from '../utils/dynamicContent.ts';

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

function renderBlock(block: ArticleBlock): string {
  if (block.type === 'heading') {
    return `<h2>${pick(block.text, block.textEn)}</h2>`;
  }
  if (block.type === 'paragraph') {
    return `<p>${pick(block.text, block.textEn)}</p>`;
  }
  if (block.type === 'list') {
    const items = pick(block.items, block.itemsEn);
    return `<ul class="article-list">${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
  }
  if (block.type === 'richtext') {
    const html = pick(block.html, block.htmlEn);
    return html ? `<div class="article-richtext">${html}</div>` : '';
  }
  if (block.type === 'image') {
    const caption = pick(block.caption, block.captionEn);
    return `
      <figure class="article-image">
        <img src="${block.url}" alt="${caption}" loading="lazy" />
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
}

export function renderArticleView(article: DynamicArticle): string {
  const publishedLabel = article.publishedAt ? formatJalaaliDate(gregorianToJalaali(new Date(article.publishedAt))) : '';
  return `
    <article class="article-page">
      <div class="container article-container">
        <nav class="article-breadcrumb" aria-label="${pick('مسیر صفحه', 'Breadcrumb')}">
          <a href="/">${pick('خانه', 'Home')}</a>
          <span aria-hidden="true">/</span>
          <a href="/magazine">${pick('مجله', 'Magazine')}</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">${pick(article.title, article.titleEn)}</span>
        </nav>

        <div class="article-card">
          <span class="article-category">${pick(article.category, article.categoryEn)}</span>
          <h1 class="article-title">${pick(article.title, article.titleEn)}</h1>
          <p class="article-excerpt">${pick(article.excerpt, article.excerptEn)}</p>

          ${article.coverImageUrl ? `<img class="article-cover" src="${article.coverImageUrl}" alt="" />` : ''}

          <div class="article-meta">
            <span><span class="icon">${icons.calendar}</span>${publishedLabel}</span>
            <span><span class="icon">${icons.clock}</span>${toPersianDigits(article.readingTime)} ${pick('دقیقه مطالعه', 'min read')}</span>
          </div>

          <div class="article-body">
            ${article.content.map(renderBlock).join('')}
          </div>

          <div class="article-cta">
            <h3>${pick('نیاز به خدمات یا تعمیرات ساختمان دارید؟', 'Need building repair services?')}</h3>
            <p>${pick(
              'موقعیت خود را روی نقشه تهران مشخص کنید و در کمتر از ۴۵ دقیقه تکنسین متخصص بهدون را دریافت نمایید.',
              'Pinpoint your location on the map and receive a certified Behdoon technician in under 45 minutes.',
            )}</p>
            <a class="btn btn-primary" href="/#request">
              <span class="icon">${icons.plusCircle}</span>
              ${pick('ثبت درخواست در بهدون', 'Submit a request on Behdoon')}
            </a>
          </div>
        </div>
      </div>
    </article>
  `;
}

export function renderArticleNotFound(): string {
  return `
    <div class="container article-not-found">
      <h1>${pick('مقاله پیدا نشد', 'Article not found')}</h1>
      <p>${pick('این مقاله حذف شده یا هرگز منتشر نشده است.', 'This article was removed or never published.')}</p>
      <a class="btn btn-primary" href="/magazine">${pick('بازگشت به مجله', 'Back to magazine')}</a>
    </div>
  `;
}

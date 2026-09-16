import { icons } from '../components/icons.ts';
import { pick } from '../i18n/lang.ts';
import type { CustomPageBlock, DynamicCustomPage } from '../utils/dynamicContent.ts';

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

function renderBlock(block: CustomPageBlock): string {
  if (block.type === 'heading') {
    return `<h2>${pick(block.text, block.textEn || block.text)}</h2>`;
  }
  if (block.type === 'paragraph') {
    return `<p>${pick(block.text, block.textEn || block.text)}</p>`;
  }
  if (block.type === 'list') {
    const items = pick(block.items, (block.itemsEn && block.itemsEn.length) ? block.itemsEn : block.items);
    return `<ul class="article-list">${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
  }
  if (block.type === 'richtext') {
    const html = pick(block.html, block.htmlEn || block.html);
    return html ? `<div class="article-richtext">${html}</div>` : '';
  }
  if (block.type === 'image') {
    const caption = pick(block.caption, block.captionEn || block.caption);
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

export function renderPageView(page: DynamicCustomPage): string {
  return `
    <article class="article-page custom-page-view">
      <div class="container article-container">
        <nav class="article-breadcrumb" aria-label="${pick('مسیر صفحه', 'Breadcrumb')}">
          <a href="/">${pick('خانه', 'Home')}</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">${pick(page.title, page.titleEn || page.title)}</span>
        </nav>

        <div class="article-card">
          <h1 class="article-title">${pick(page.title, page.titleEn || page.title)}</h1>
          ${page.excerpt ? `<p class="article-excerpt">${pick(page.excerpt, page.excerptEn || page.excerpt)}</p>` : ''}

          ${page.coverImageUrl ? `<img class="article-cover" src="${page.coverImageUrl}" alt="${pick(page.title, page.titleEn || page.title)}" />` : ''}

          <div class="article-body">
            ${page.content.map(renderBlock).join('')}
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

export function renderPageNotFound(): string {
  return `
    <div class="container article-not-found">
      <h1>${pick('برگه پیدا نشد', 'Page not found')}</h1>
      <p>${pick('این برگه وجود ندارد یا هنوز منتشر نشده است.', 'This page does not exist or has not been published yet.')}</p>
      <a class="btn btn-primary" href="/">${pick('بازگشت به صفحه اصلی', 'Back to homepage')}</a>
    </div>
  `;
}

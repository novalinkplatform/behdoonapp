import { icons } from '../components/icons.ts';
import { pick } from '../i18n/lang.ts';
import { toPersianDigits, gregorianToJalaali, formatJalaaliDate } from '../utils/jalali.ts';
import type { DynamicArticle } from '../utils/dynamicContent.ts';

function readingTimeLabel(article: DynamicArticle): string {
  return `${toPersianDigits(article.readingTime)} ${pick('دقیقه', 'min')}`;
}

function publishedDateLabel(article: DynamicArticle): string {
  if (!article.publishedAt) return '';
  return formatJalaaliDate(gregorianToJalaali(new Date(article.publishedAt)));
}

function renderArticleCard(article: DynamicArticle, index: number, featured: boolean): string {
  return `
    <a class="magazine-card${featured ? ' magazine-card-featured' : ''}" href="/magazine/${article.slug}" style="animation-delay: ${index * 90}ms">
      <div class="magazine-card-cover">
        ${article.coverImageUrl ? `<img src="${article.coverImageUrl}" alt="" loading="lazy" />` : `<span class="icon">${icons.article}</span>`}
      </div>
      <div class="magazine-card-content">
        <span class="magazine-card-category">${pick(article.category, article.categoryEn)}</span>
        <h2 class="magazine-card-title">${pick(article.title, article.titleEn)}</h2>
        <p class="magazine-card-excerpt">${pick(article.excerpt, article.excerptEn)}</p>
        <div class="magazine-card-meta">
          <span><span class="icon">${icons.calendar}</span>${publishedDateLabel(article)}</span>
          <span><span class="icon">${icons.clock}</span>${readingTimeLabel(article)}</span>
        </div>
        <span class="magazine-card-more">
          ${pick('بیشتر بخوانید', 'Read more')}
          <span class="icon">${icons.chevronLeft}</span>
        </span>
      </div>
    </a>
  `;
}

export function renderMagazineIndex(articles: DynamicArticle[]): string {
  return `
    <section class="magazine-page">
      <div class="container">
        <h1 class="visually-hidden">${pick('مجله بهدون', 'Behdoon Magazine')}</h1>
        <nav class="article-breadcrumb" aria-label="${pick('مسیر صفحه', 'Breadcrumb')}">
          <a href="/">${pick('خانه', 'Home')}</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">${pick('مجله', 'Magazine')}</span>
        </nav>
        <div class="magazine-grid magazine-puzzle">
          ${
            articles.length
              ? articles.map((article, index) => renderArticleCard(article, index, articles.length > 1 && index === 0)).join('')
              : `<p class="magazine-empty">${pick('هنوز مقاله‌ای منتشر نشده است.', 'No articles have been published yet.')}</p>`
          }
        </div>
      </div>
    </section>
  `;
}

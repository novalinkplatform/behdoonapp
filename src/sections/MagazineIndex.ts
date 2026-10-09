import { icons } from '../components/icons.ts';
import { pick } from '../i18n/lang.ts';
import { toPersianDigits, gregorianToJalaali, formatJalaaliDate } from '../utils/jalali.ts';
import type { DynamicArticle } from '../utils/dynamicContent.ts';

const MAGAZINE_CATEGORIES = [
  { id: 'all', label: 'همه مقالات', labelEn: 'All Articles' },
  { id: 'سرمایش و گرمایش', label: 'سرمایش و گرمایش', labelEn: 'HVAC' },
  { id: 'لوله‌کشی و تأسیسات', label: 'لوله‌کشی و تأسیسات', labelEn: 'Plumbing' },
  { id: 'برقکاری ساختمان', label: 'برقکاری ساختمان', labelEn: 'Electrical' },
  { id: 'تعمیرات و بازسازی', label: 'تعمیرات و بازسازی', labelEn: 'Renovation' },
  { id: 'کلیدسازی، قفل و امنیت', label: 'کلیدسازی و قفل', labelEn: 'Locksmith' },
  { id: 'کابینت، نجاری و MDF', label: 'کابینت و نجاری', labelEn: 'Carpentry' },
  { id: 'در، پنجره و شیشه UPVC', label: 'در و پنجره UPVC', labelEn: 'Windows & Doors' },
  { id: 'نظافت و پاکسازی مشاعات', label: 'نظافت و مشاعات', labelEn: 'Cleaning' },
];

function readingTimeLabel(article: DynamicArticle): string {
  return `${toPersianDigits(article.readingTime || 7)} ${pick('دقیقه مطالعه', 'min read')}`;
}

function publishedDateLabel(article: DynamicArticle): string {
  if (!article.publishedAt) return 'شهریور ۱۴۰۳';
  return formatJalaaliDate(gregorianToJalaali(new Date(article.publishedAt)));
}

function renderArticleCard(article: DynamicArticle, index: number, isFeatured: boolean): string {
  const searchText = `${article.title} ${article.excerpt} ${article.category}`.toLowerCase();

  return `
    <article
      class="magazine-card ${isFeatured ? 'magazine-card-featured' : ''}"
      data-article-cat="${article.category}"
      data-search-text="${searchText}"
      style="animation-delay: ${index * 60}ms"
      itemscope
      itemtype="https://schema.org/Article"
    >
      <a class="magazine-card-link" href="/magazine/${article.slug}">
        <div class="magazine-card-cover">
          ${
            article.coverImageUrl
              ? `<img src="${article.coverImageUrl}" alt="${pick(article.title, article.titleEn)}" loading="lazy" itemprop="image" />`
              : `<span class="icon">${icons.article}</span>`
          }
          <span class="magazine-card-category-badge">${pick(article.category, article.categoryEn)}</span>
        </div>

        <div class="magazine-card-content">
          <div class="magazine-card-meta-top">
            <span class="meta-date">
              <span class="icon">${icons.calendar}</span>
              <time datetime="${article.publishedAt || ''}" itemprop="datePublished">${publishedDateLabel(article)}</time>
            </span>
            <span class="meta-read-time">
              <span class="icon">${icons.clock}</span>
              <span>${readingTimeLabel(article)}</span>
            </span>
          </div>

          <h2 class="magazine-card-title" itemprop="headline">
            ${pick(article.title, article.titleEn)}
          </h2>

          <p class="magazine-card-excerpt" itemprop="description">
            ${pick(article.excerpt, article.excerptEn)}
          </p>

          <div class="magazine-card-footer">
            <div class="magazine-expert-badge">
              <span class="expert-dot"></span>
              <span>${pick('تأییدشده فنی بهدون', 'Behdoon Verified')}</span>
            </div>
            <span class="magazine-card-more">
              <span>${pick('مطالعه کامل', 'Read Guide')}</span>
              <span class="icon">${icons.chevronLeft}</span>
            </span>
          </div>
        </div>
      </a>
    </article>
  `;
}

export function renderMagazineIndex(articles: DynamicArticle[]): string {
  return `
    <section class="magazine-page">
      <div class="container">
        <!-- Breadcrumb -->
        <nav class="article-breadcrumb" aria-label="${pick('مسیر صفحه', 'Breadcrumb')}">
          <a href="/">${pick('خانه', 'Home')}</a>
          <span aria-hidden="true" class="breadcrumb-sep">/</span>
          <span aria-current="page" class="breadcrumb-current">${pick('مجله و دانشنامه تخصصی ساختمان', 'Behdoon Magazine')}</span>
        </nav>

        <!-- Magazine Hero Section -->
        <header class="magazine-hero-banner">
          <div class="magazine-hero-badge">
            <span class="icon">${icons.bolt}</span>
            <span>${pick('دانشنامه و مرجع تخصصی تأسیسات ساختمانی در تهران', 'Tehran Facilities Engineering Encyclopedia')}</span>
          </div>
          <h1 class="magazine-hero-title">
            ${pick('مجله تخصصی و راهنماهای فنی بهدون', 'Behdoon Technical Magazine & Guides')}
          </h1>
          <p class="magazine-hero-subtitle">
            ${pick(
              'مجموعه جامع راهنماهای عیب‌یابی، روش‌های بهینه‌سازی تأسیسات، تعرفه‌های مصوب و نکات کلیدی نگهداری ساختمان در تهران با بازبینی مهندسان مجرب بهدون.',
              'Comprehensive troubleshooting guides, facility optimization methods, and maintenance tips verified by certified engineers in Tehran.',
            )}
          </p>

          <!-- Search and Filter Bar -->
          <div class="magazine-search-bar-wrap">
            <div class="magazine-search-input-box">
              <span class="icon search-icon">${icons.search}</span>
              <input
                type="search"
                id="magazine-live-search"
                placeholder="${pick('جستجو در مقالات (مثلاً: نشت‌یابی، پکیج، کولر آبی، نقاشی، اتصالی برق...)', 'Search articles (e.g. leak detection, package, cooler, electrical...)')}"
                aria-label="${pick('جستجو در مقالات', 'Search articles')}"
              />
              <button type="button" id="magazine-search-clear" class="search-clear-btn" hidden title="${pick('پاک کردن جستجو', 'Clear')}">
                <span class="icon">${icons.close}</span>
              </button>
            </div>
          </div>

          <!-- Category Filter Pills -->
          <div class="magazine-category-pills" role="tablist">
            ${MAGAZINE_CATEGORIES.map(
              (cat, idx) => `
              <button
                type="button"
                class="magazine-cat-pill ${idx === 0 ? 'is-active' : ''}"
                data-filter-cat="${cat.id}"
                role="tab"
                aria-selected="${idx === 0 ? 'true' : 'false'}"
              >
                ${pick(cat.label, cat.labelEn)}
              </button>
            `,
            ).join('')}
          </div>
        </header>

        <!-- Emergency Booking CTA Card -->
        <div class="magazine-urgent-cta-strip">
          <div class="urgent-cta-info">
            <div class="urgent-cta-tag">
              <span class="urgent-pulse"></span>
              <span>${pick('نیاز فوری به متخصص در محل دارید؟', 'Need emergency technician on-site?')}</span>
            </div>
            <p class="urgent-cta-text">
              ${pick(
                'نیازی به مطالعه مقالات ندارید! نزدیک‌ترین تکنسین متخصص بهدون در کمتر از ۴۵ دقیقه در محل شما حاضر می‌شود.',
                'Skip the reading! Our nearest certified technician dispatches in under 45 minutes across Tehran.',
              )}
            </p>
          </div>
          <div class="urgent-cta-actions">
            <button
              type="button"
              class="btn btn-primary urgent-cta-btn"
              onclick="if(window.openRequestModal){ window.openRequestModal(); } else { location.href='/#request'; }"
            >
              <span class="icon">${icons.plusCircle}</span>
              <span>${pick('ثبت فوری درخواست آنلاین', 'Order Online Now')}</span>
            </button>
            <a href="tel:09333256885" class="btn btn-outline urgent-cta-call">
              <span class="icon">${icons.phone}</span>
              <span>۰۹۳۳۳۲۵۶۸۸۵</span>
            </a>
          </div>
        </div>

        <!-- Empty Search State -->
        <div class="magazine-empty-state" id="magazine-empty-state" hidden>
          <div class="empty-state-icon"><span class="icon">${icons.search}</span></div>
          <h3 class="empty-state-title">${pick('مقاله‌ای با این مشخصات یافت نشد', 'No matching articles found')}</h3>
          <p class="empty-state-desc">${pick('لطفاً عبارت دیگری را جستجو فرمایید یا فیلتر دسته‌بندی را تغییر دهید.', 'Try another keyword or select a different category.')}</p>
          <button type="button" class="btn btn-secondary btn-sm" id="magazine-reset-filters-btn">
            ${pick('مشاهده همه مقالات', 'View All Articles')}
          </button>
        </div>

        <!-- Articles Grid -->
        <div class="magazine-grid magazine-puzzle" id="magazine-articles-grid">
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

export function initMagazineIndex(): void {
  const searchInput = document.getElementById('magazine-live-search') as HTMLInputElement | null;
  const searchClearBtn = document.getElementById('magazine-search-clear') as HTMLButtonElement | null;
  const pills = document.querySelectorAll<HTMLButtonElement>('.magazine-cat-pill');
  const cards = document.querySelectorAll<HTMLElement>('.magazine-card');
  const emptyState = document.getElementById('magazine-empty-state');
  const resetBtn = document.getElementById('magazine-reset-filters-btn');

  let activeCategory = 'all';

  function applyFilters(): void {
    const q = (searchInput?.value || '').trim().toLowerCase();
    if (searchClearBtn) searchClearBtn.hidden = !q;

    let visibleCount = 0;

    cards.forEach((card) => {
      const cardCat = card.getAttribute('data-article-cat') || '';
      const cardText = card.getAttribute('data-search-text') || '';

      const matchesCat = activeCategory === 'all' || cardCat.includes(activeCategory) || activeCategory.includes(cardCat);
      const matchesSearch = !q || cardText.includes(q);

      if (matchesCat && matchesSearch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (emptyState) {
      emptyState.hidden = visibleCount > 0;
    }
  }

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => {
        p.classList.remove('is-active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('is-active');
      pill.setAttribute('aria-selected', 'true');
      activeCategory = pill.getAttribute('data-filter-cat') || 'all';
      applyFilters();
    });
  });

  searchInput?.addEventListener('input', applyFilters);

  searchClearBtn?.addEventListener('click', () => {
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }
    applyFilters();
  });

  resetBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    activeCategory = 'all';
    pills.forEach((p, idx) => {
      p.classList.toggle('is-active', idx === 0);
      p.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
    });
    applyFilters();
  });
}

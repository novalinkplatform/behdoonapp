import type { LegalPage, LegalSection, LegalHighlight } from '../utils/dynamicContent.ts';
import { toPersianDigits } from '../utils/jalali.ts';
import { pick } from '../i18n/lang.ts';
import { icons } from '../components/icons.ts';

function getHighlightIcon(iconName: string): string {
  switch (iconName) {
    case 'lock':
      return icons.lock || icons.shield;
    case 'shieldCheck':
    case 'shield':
      return icons.shield;
    case 'priceTag':
    case 'fileText':
      return icons.fileText;
    case 'mapPin':
      return icons.pin;
    case 'userCheck':
    case 'worker':
      return icons.worker || icons.checkCircle;
    case 'headphones':
    case 'phone':
      return icons.phone;
    case 'clock':
      return icons.clock;
    default:
      return icons.checkCircle;
  }
}

function renderHighlightCard(h: LegalHighlight): string {
  const iconSvg = getHighlightIcon(h.icon);
  return `
    <div class="legal-highlight-card">
      <div class="legal-highlight-icon">
        <span class="icon">${iconSvg}</span>
      </div>
      <div class="legal-highlight-content">
        <h3 class="legal-highlight-title">${pick(h.title, h.titleEn)}</h3>
        <p class="legal-highlight-desc">${pick(h.desc, h.descEn)}</p>
      </div>
    </div>
  `;
}

function renderSection(section: LegalSection, index: number): string {
  const sectionId = `legal-sec-${index + 1}`;
  const paragraphs = pick(section.paragraphs, section.paragraphsEn)
    .map((p) => `<p class="legal-paragraph">${p}</p>`)
    .join('');

  const listItems = pick(section.list, section.listEn ?? section.list);
  const list = listItems && listItems.length > 0
    ? `
      <ul class="legal-list">
        ${listItems
          .map(
            (item) => `
              <li class="legal-list-item">
                <span class="legal-list-bullet" aria-hidden="true">${icons.check || '✓'}</span>
                <span>${item}</span>
              </li>
            `
          )
          .join('')}
      </ul>
    `
    : '';

  const calloutText = pick(section.callout, section.calloutEn);
  const callout = calloutText
    ? `
      <div class="legal-callout">
        <div class="legal-callout-icon">
          <span class="icon">${icons.shield}</span>
        </div>
        <div class="legal-callout-text">
          <strong>${pick('نکته حقوقی مهم:', 'Important Legal Notice:')}</strong>
          <span>${calloutText}</span>
        </div>
      </div>
    `
    : '';

  const tagText = pick(section.tag, section.tagEn);
  const tagBadge = tagText ? `<span class="legal-section-tag">${tagText}</span>` : '';

  return `
    <section class="legal-section" id="${sectionId}">
      <div class="legal-section-head">
        <div class="legal-section-badge-wrap">
          <span class="legal-section-index">${toPersianDigits(index + 1)}</span>
          <h2>${pick(section.heading, section.headingEn)}</h2>
        </div>
        ${tagBadge}
      </div>
      <div class="legal-section-body">
        ${paragraphs}
        ${list}
        ${callout}
      </div>
    </section>
  `;
}

export function renderLegalPageView(page: LegalPage): string {
  const highlightsHtml =
    page.highlights && page.highlights.length > 0
      ? `
        <div class="legal-highlights-grid" aria-label="${pick('شاخص‌ها و تعهدات کلیدی', 'Key Highlights')}">
          ${page.highlights.map(renderHighlightCard).join('')}
        </div>
      `
      : '';

  const tocHtml =
    page.sections && page.sections.length > 1
      ? `
        <nav class="legal-toc-bar" aria-label="${pick('فهرست دسترسی سریع به بندها', 'Table of Contents')}">
          <div class="legal-toc-title">
            <span class="icon">${icons.layers}</span>
            <span>${pick('دسترسی سریع به بندها:', 'Quick Navigation:')}</span>
          </div>
          <div class="legal-toc-pills">
            ${page.sections
              .map(
                (sec, idx) => `
                  <a href="#legal-sec-${idx + 1}" class="legal-toc-pill">
                    <span class="legal-toc-num">${toPersianDigits(idx + 1)}</span>
                    <span class="legal-toc-text">${pick(sec.tag || sec.heading, sec.tagEn || sec.headingEn)}</span>
                  </a>
                `
              )
              .join('')}
          </div>
        </nav>
      `
      : '';

  return `
    <article class="legal-page">
      <div class="container legal-container">
        <!-- Breadcrumb Navigation -->
        <nav class="article-breadcrumb" aria-label="${pick('مسیر صفحه', 'Breadcrumb')}">
          <a href="/">${pick('صفحه اصلی', 'Home')}</a>
          <span class="breadcrumb-separator" aria-hidden="true">/</span>
          <span aria-current="page">${pick(page.title, page.titleEn)}</span>
        </nav>

        <!-- Hero Header -->
        <header class="legal-hero-header">
          <div class="legal-meta-badge">
            <span class="icon">${icons.shield}</span>
            <span>${pick('سند رسمی شفافیت و تعهدات سامانه بهدون', 'Official Transparency & Policy Document')}</span>
          </div>
          <h1 class="legal-hero-title">${pick(page.title, page.titleEn)}</h1>
          <p class="legal-hero-excerpt">${pick(page.intro, page.introEn)}</p>

          <!-- Regulatory & Region Trust Meta -->
          <div class="legal-trust-strip">
            <div class="legal-trust-item">
              <span class="icon">${icons.pin}</span>
              <span>${pick('پوشش انحصاری: کلیه مناطق ۲۲‌گانه شهر تهران', 'Coverage: All 22 Tehran Districts')}</span>
            </div>
            <div class="legal-trust-item">
              <span class="icon">${icons.fileText}</span>
              <span>${pick('مطابق با قانون تجارت الکترونیکی و جرایم رایانه‌ای', 'Compliant with Electronic Commerce Law')}</span>
            </div>
            <div class="legal-trust-item">
              <span class="icon">${icons.clock}</span>
              <span>${pick('آخرین به‌روزرسانی حقوقی: پاییز ۱۴۰۵', 'Last Updated: Autumn 2026')}</span>
            </div>
          </div>
        </header>

        <!-- Highlights Grid -->
        ${highlightsHtml}

        <!-- Quick Jump TOC -->
        ${tocHtml}

        <!-- Section Cards -->
        <div class="legal-body">
          ${page.sections.map(renderSection).join('')}
        </div>

        <!-- Support & Inquiries Box -->
        <aside class="legal-support-card" aria-label="${pick('پشتیبانی و سوالات حقوقی', 'Support and Legal Questions')}">
          <div class="legal-support-content">
            <div class="legal-support-icon">
              <span class="icon">${icons.phone}</span>
            </div>
            <div class="legal-support-text">
              <h3>${pick('پرسشی درباره حریم خصوصی یا قوانین بهدون دارید؟', 'Questions about Behdoon Privacy or Terms?')}</h3>
              <p>${pick(
                'واحد پشتیبانی و بازرسی بهدون به صورت همه‌روزه آماده پاسخگویی به سوالات، پیگیری سفارشات و رفع ابهامات شما شهروندان گرامی است.',
                'Behdoon support and compliance team is available every day to assist with your questions and order tracking.'
              )}</p>
            </div>
          </div>
          <div class="legal-support-actions">
            <a href="tel:09333256885" class="btn btn-primary legal-support-btn">
              <span class="icon">${icons.phone}</span>
              <span>${pick('تماس مستقیم با پشتیبانی: ۰۹۳۳۳۲۵۶۸۸۵', 'Call Support: 09333256885')}</span>
            </a>
            <a href="/" class="btn btn-secondary legal-support-btn">
              <span class="icon">${icons.home}</span>
              <span>${pick('بازگشت به صفحه اصلی', 'Back to Home')}</span>
            </a>
          </div>
        </aside>
      </div>
    </article>
  `;
}

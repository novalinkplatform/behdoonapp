import type { LegalPage, LegalSection } from '../utils/dynamicContent.ts';
import { toPersianDigits } from '../utils/jalali.ts';
import { pick } from '../i18n/lang.ts';

function renderSection(section: LegalSection, index: number): string {
  const paragraphs = pick(section.paragraphs, section.paragraphsEn)
    .map((p) => `<p>${p}</p>`)
    .join('');
  const list = section.list
    ? `<ul class="legal-list">${pick(section.list, section.listEn ?? section.list)
        .map((item) => `<li>${item}</li>`)
        .join('')}</ul>`
    : '';
  return `
    <section class="legal-section">
      <div class="legal-section-head">
        <span class="legal-section-index">${toPersianDigits(index + 1)}</span>
        <h2>${pick(section.heading, section.headingEn)}</h2>
      </div>
      <div class="legal-section-body">
        ${paragraphs}
        ${list}
      </div>
    </section>
  `;
}

export function renderLegalPageView(page: LegalPage): string {
  return `
    <article class="legal-page">
      <div class="container legal-container">
        <nav class="article-breadcrumb" aria-label="${pick('مسیر صفحه', 'Breadcrumb')}">
          <a href="/">${pick('خانه', 'Home')}</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">${pick(page.title, page.titleEn)}</span>
        </nav>

        <h1 class="article-title">${pick(page.title, page.titleEn)}</h1>
        <p class="article-excerpt">${pick(page.intro, page.introEn)}</p>

        <div class="legal-body">
          ${page.sections.map(renderSection).join('')}
        </div>
      </div>
    </article>
  `;
}

import { icons } from '../components/icons.ts';
import {
  fetchAdminPages,
  deleteCustomPage,
  fetchSettings,
  updateSetting,
} from '../utils/api.ts';
import type { CustomPageRecord } from '../utils/api.ts';
import { ensureLanguageMode, applyLanguageVisibility } from '../utils/languageMode.ts';
import { handleSaveButton } from '../utils/save-button.ts';

// ===== Types for Homepage Layout =====
type HomepageSectionType = 'hero' | 'block';
type BlockLayout = 'text' | 'steps' | 'accordion' | 'grid' | 'slider' | 'quote' | 'testimonials' | 'stats';

interface BlockItem {
  id: string;
  title?: string;
  titleEn?: string;
  text?: string;
  textEn?: string;
  imageUrl?: string;
  videoUrl?: string;
  linkUrl?: string;
}

interface HomepageSection {
  id: string;
  type: HomepageSectionType;
  visible: boolean;
  heading?: string;
  headingEn?: string;
  body?: string;
  bodyEn?: string;
  backgroundImageUrl?: string;
  layout?: BlockLayout;
  subheading?: string;
  subheadingEn?: string;
  items?: BlockItem[];
}

const BLOCK_LAYOUT_LABELS: Record<BlockLayout, string> = {
  text: 'متن ساده',
  steps: 'مراحل شماره‌دار',
  accordion: 'آکاردئونی (پرسش و پاسخ)',
  grid: 'شبکه‌ی آیکون/عنوان',
  slider: 'اسلایدر',
  quote: 'نقل‌قول',
  testimonials: 'نظرات مشتریان (خودکار)',
  stats: 'آمار و ارقام',
};

const BLOCK_LAYOUTS = Object.keys(BLOCK_LAYOUT_LABELS) as BlockLayout[];
const DEFAULT_HOMEPAGE_SECTIONS: HomepageSection[] = [
  { id: 'hero', type: 'hero', visible: true },
];

// ===== Types for Legal / Static Pages =====
interface LegalSection {
  heading: string;
  headingEn: string;
  paragraphs: string[];
  paragraphsEn: string[];
  list?: string[];
  listEn?: string[];
}

interface LegalPage {
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  intro: string;
  introEn: string;
  sections: LegalSection[];
  showInHeader?: boolean;
  showInFooter?: boolean;
}

type LegalSlug = 'about' | 'terms' | 'privacy';

const LEGAL_CONFIG: Record<LegalSlug, { label: string; livePath: string; hint: string }> = {
  about: {
    label: 'صفحه درباره ما',
    livePath: '/about',
    hint: 'ویرایش مشخصات، تاریخچه، اهداف و بخش‌های معرفی بهدون در نشانی /about',
  },
  terms: {
    label: 'صفحه قوانین و مقررات',
    livePath: '/terms',
    hint: 'مدیریت شرایط، ضوابط، تعهدات و مقررات استفاده از سامانه بهدون در نشانی /terms',
  },
  privacy: {
    label: 'صفحه حریم خصوصی',
    livePath: '/privacy',
    hint: 'تنظیم سیاست‌های حفاظت از داده‌ها و امنیت حریم خصوصی کاربران بهدون در نشانی /privacy',
  },
};

function sectionBodyToText(paragraphs: string[], list?: string[]): string {
  const lines = [...paragraphs];
  if (list?.length) lines.push(...list.map((l) => `- ${l}`));
  return lines.join('\n');
}

function textToSectionBody(text: string): { paragraphs: string[]; list?: string[] } {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const paragraphs = lines.filter((l) => !l.startsWith('- '));
  const list = lines.filter((l) => l.startsWith('- ')).map((l) => l.slice(2).trim());
  return { paragraphs, list: list.length ? list : undefined };
}

function renderCustomRow(page: CustomPageRecord): string {
  const publicUrl = `/p/${encodeURIComponent(page.slug)}`;
  return `
    <tr data-page-row="${page.id}">
      <td>
        <div style="font-weight: 600; color: var(--color-text);">${page.title || '(بدون عنوان)'}</div>
        ${page.excerpt ? `<div style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 2px;">${page.excerpt.slice(0, 70)}...</div>` : ''}
      </td>
      <td>
        <code style="font-family: monospace; font-size: 0.85rem; background: var(--color-bg-subtle, rgba(0,0,0,0.05)); padding: 2px 6px; border-radius: 4px;" dir="ltr">/p/${page.slug}</code>
      </td>
      <td>
        <div style="display: flex; gap: 4px; flex-wrap: wrap;">
          ${page.showInHeader ? '<span style="background: rgba(37,99,235,0.1); color: var(--color-primary); font-size: 0.75rem; padding: 2px 6px; border-radius: 4px; font-weight: 600;">هدر</span>' : ''}
          ${page.showInFooter ? '<span style="background: rgba(16,185,129,0.1); color: #059669; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px; font-weight: 600;">فوتر</span>' : ''}
          ${!page.showInHeader && !page.showInFooter ? '<span style="color: var(--color-text-muted); font-size: 0.8rem;">—</span>' : ''}
        </div>
      </td>
      <td>
        <span class="article-status-badge article-status-${page.status}">
          ${page.status === 'published' ? 'منتشرشده' : 'پیش‌نویس'}
        </span>
      </td>
      <td>
        <div class="staff-table-actions">
          ${page.status === 'published' ? `<a href="${publicUrl}" target="_blank" class="btn btn-ghost btn-sm" title="مشاهده برگه">مشاهده</a>` : ''}
          <button type="button" class="btn btn-secondary btn-sm" data-edit-page="${page.id}">ویرایش</button>
          <button type="button" class="btn btn-ghost btn-sm" data-delete-page="${page.id}">حذف</button>
        </div>
      </td>
    </tr>
  `;
}

export function renderPagesListView(hideHeader = false): string {
  return `
    ${
      hideHeader
        ? ''
        : `
    <div class="view-header" style="margin-bottom: var(--space-3);">
      <div>
        <h1>مدیریت صفحات</h1>
        <p style="color: var(--color-text-muted); font-size: 0.9rem; margin-top: 4px;">طراحی صفحه اصلی، صفحات درباره ما، قوانین و مقررات، حریم خصوصی و برگه‌های سفارشی</p>
      </div>
    </div>
    `
    }
    <p class="error-text" id="pages-global-error" hidden></p>
    <p class="settings-saved-note" id="pages-global-saved" hidden>تغییرات با موفقیت ذخیره شد.</p>

    <!-- نوار تب‌های بالای صفحه -->
    <div class="page-nav-tabs settings-tabs" style="display: flex; align-items: center; justify-content: flex-start; gap: 8px; flex-wrap: wrap; margin-bottom: var(--space-4);">
      <button type="button" class="page-nav-tab settings-tab is-active" data-page-nav-tab="home">صفحه اصلی</button>
      <button type="button" class="page-nav-tab settings-tab" data-page-nav-tab="about">صفحه درباره ما</button>
      <button type="button" class="page-nav-tab settings-tab" data-page-nav-tab="terms">صفحه قوانین و مقررات</button>
      <button type="button" class="page-nav-tab settings-tab" data-page-nav-tab="privacy">صفحه حریم خصوصی</button>
      <button type="button" class="page-nav-tab settings-tab" data-page-nav-tab="custom">برگه‌های سفارشی</button>
      <button type="button" class="page-nav-tab settings-tab" id="pages-top-add-btn" style="margin-inline-start: auto; background-color: var(--primary); color: #fff; border-color: var(--primary); display: inline-flex; align-items: center; gap: 6px; font-weight: 700;">
        <span class="icon" style="width: 16px; height: 16px; display: inline-flex;">${icons.plusCircle}</span>
        <span>افزودن صفحه تازه</span>
      </button>
    </div>

    <!-- پنل صفحه اصلی -->
    <div class="settings-panel" data-page-panel="home">
      <div class="editor-sidebar-card" style="margin-bottom: var(--space-3);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
          <div>
            <h3 style="margin: 0; font-size: 1rem;">طراحی و چیدمان صفحه اصلی</h3>
            <p class="settings-panel-hint" style="margin: 4px 0 0 0;">
              صفحه اصلی از بلوک‌های متنوع ساخته می‌شود. ترتیب، متن‌ها و نحوه نمایش هر بخش را به دلخواه تغییر دهید.
            </p>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <button type="button" class="btn btn-primary btn-sm" id="homepage-save-btn-top">ذخیره</button>
            <a href="/" target="_blank" class="btn btn-ghost btn-sm" style="display: inline-flex; align-items: center; gap: 4px;">
              <span>مشاهده صفحه اصلی</span>
              <span class="icon" style="width: 14px; height: 14px;">${icons.externalLink || ''}</span>
            </a>
          </div>
        </div>
        <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--border);">
          <label class="settings-inline-toggle"><input type="checkbox" id="homepage-stories-enabled" /> نمایش نوار استوری در بالای صفحه اصلی</label>
        </div>
      </div>

      <div id="homepage-sections-list"></div>

      <div class="settings-panel-footer" style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
        <select id="homepage-section-add-type" style="height: 40px; padding: 0 12px; border-radius: var(--radius-md); border: 1px solid var(--border); background: var(--background);">
          ${BLOCK_LAYOUTS.map((l) => `<option value="${l}">${BLOCK_LAYOUT_LABELS[l]}</option>`).join('')}
        </select>
        <button type="button" class="btn btn-secondary btn-sm" id="homepage-section-add-btn">
          <span class="icon">${icons.plusCircle}</span>
          افزودن بلوک
        </button>
        <button type="button" class="btn btn-primary btn-sm" id="homepage-save-btn" style="margin-inline-start: auto;">
          ذخیره چیدمان صفحه اصلی
        </button>
      </div>
    </div>

    <!-- پنل صفحه درباره ما -->
    <div class="settings-panel" data-page-panel="about" hidden>
      <div class="editor-sidebar-card" style="margin-bottom: var(--space-3);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
          <div>
            <h3 style="margin: 0; font-size: 1rem;">صفحه درباره ما</h3>
            <p class="settings-panel-hint" style="margin: 4px 0 0 0;">${LEGAL_CONFIG.about.hint}</p>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <button type="button" class="btn btn-primary btn-sm" id="legal-about-save-btn-top">ذخیره</button>
            <a href="/about" target="_blank" class="btn btn-ghost btn-sm" style="display: inline-flex; align-items: center; gap: 4px;">
              <span>مشاهده صفحه درباره ما</span>
              <span class="icon" style="width: 14px; height: 14px;">${icons.externalLink || ''}</span>
            </a>
          </div>
        </div>
      </div>
      <div id="legal-editor-about"></div>
    </div>

    <!-- پنل صفحه قوانین و مقررات -->
    <div class="settings-panel" data-page-panel="terms" hidden>
      <div class="editor-sidebar-card" style="margin-bottom: var(--space-3);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
          <div>
            <h3 style="margin: 0; font-size: 1rem;">صفحه قوانین و مقررات</h3>
            <p class="settings-panel-hint" style="margin: 4px 0 0 0;">${LEGAL_CONFIG.terms.hint}</p>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <button type="button" class="btn btn-primary btn-sm" id="legal-terms-save-btn-top">ذخیره</button>
            <a href="/terms" target="_blank" class="btn btn-ghost btn-sm" style="display: inline-flex; align-items: center; gap: 4px;">
              <span>مشاهده صفحه قوانین</span>
              <span class="icon" style="width: 14px; height: 14px;">${icons.externalLink || ''}</span>
            </a>
          </div>
        </div>
      </div>
      <div id="legal-editor-terms"></div>
    </div>

    <!-- پنل صفحه حریم خصوصی -->
    <div class="settings-panel" data-page-panel="privacy" hidden>
      <div class="editor-sidebar-card" style="margin-bottom: var(--space-3);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
          <div>
            <h3 style="margin: 0; font-size: 1rem;">صفحه حریم خصوصی</h3>
            <p class="settings-panel-hint" style="margin: 4px 0 0 0;">${LEGAL_CONFIG.privacy.hint}</p>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <button type="button" class="btn btn-primary btn-sm" id="legal-privacy-save-btn-top">ذخیره</button>
            <a href="/privacy" target="_blank" class="btn btn-ghost btn-sm" style="display: inline-flex; align-items: center; gap: 4px;">
              <span>مشاهده صفحه حریم خصوصی</span>
              <span class="icon" style="width: 14px; height: 14px;">${icons.externalLink || ''}</span>
            </a>
          </div>
        </div>
      </div>
      <div id="legal-editor-privacy"></div>
    </div>

    <!-- پنل برگه‌های سفارشی -->
    <div class="settings-panel" data-page-panel="custom" hidden>
      <div class="view-header" style="margin-bottom: var(--space-3);">
        <div>
          <h3 style="margin: 0; font-size: 1rem;">برگه‌های سفارشی سایت</h3>
          <p class="settings-panel-hint" style="margin: 4px 0 0 0;">مدیریت، طراحی و انتشار برگه‌ها با پیوند اختصاصی (/p/slug) و بلوک‌های چندرسانه‌ای</p>
        </div>
        <button type="button" class="btn btn-primary btn-sm" id="page-custom-new-btn">
          <span class="icon">${icons.plusCircle}</span>
          برگه جدید
        </button>
      </div>
      <div class="staff-table-wrapper">
        <table class="staff-table">
          <thead>
            <tr>
              <th>عنوان برگه</th>
              <th>پیوند یکتا (Slug)</th>
              <th>موقعیت نمایش</th>
              <th>وضعیت</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody id="page-custom-table-body"></tbody>
        </table>
      </div>
    </div>
  `;
}

export function initPagesListView(onEdit: (id: number | null) => void): void {
  const globalErrorEl = document.getElementById('pages-global-error');
  const globalSavedEl = document.getElementById('pages-global-saved');

  function showSaved(): void {
    if (globalSavedEl) {
      globalSavedEl.hidden = false;
      window.setTimeout(() => (globalSavedEl.hidden = true), 2500);
    }
  }

  function showError(err: unknown): void {
    if (globalErrorEl) {
      globalErrorEl.hidden = false;
      globalErrorEl.textContent = err instanceof Error ? err.message : 'خطایی رخ داد.';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  void ensureLanguageMode().then(() => applyLanguageVisibility(document.body));

  // ===== Tab Switching =====
  const navTabs = document.querySelectorAll<HTMLButtonElement>('[data-page-nav-tab]');
  const panels = document.querySelectorAll<HTMLElement>('[data-page-panel]');

  navTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      navTabs.forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      const target = tab.dataset.pageNavTab;
      panels.forEach((p) => {
        p.hidden = p.dataset.pagePanel !== target;
      });
    });
  });

  // Top + Button triggers new page editor directly
  document.getElementById('pages-top-add-btn')?.addEventListener('click', () => onEdit(null));
  document.getElementById('page-custom-new-btn')?.addEventListener('click', () => onEdit(null));

  // ===== State =====
  let siteSettings: Record<string, unknown> = {};
  let homepageSections: HomepageSection[] = [];
  let storiesEnabled = true;
  let legalPages: Record<string, LegalPage> = {};

  // ===== 1. Homepage Logic =====
  function itemEditorHtml(item: BlockItem, sectionIndex: number, itemIndex: number): string {
    return `
      <div class="settings-form-grid block-item-editor" data-section-index="${sectionIndex}" data-item-index="${itemIndex}">
        <div class="form-field" data-i18n="fa"><label>عنوان (فارسی)</label><input type="text" data-field="title" value="${item.title ?? ''}" /></div>
        <div class="form-field" data-i18n="en"><label>Title (English)</label><input type="text" dir="ltr" data-field="titleEn" value="${item.titleEn ?? ''}" /></div>
        <div class="form-field" data-i18n="fa"><label>متن (فارسی)</label><textarea rows="2" data-field="text">${item.text ?? ''}</textarea></div>
        <div class="form-field" data-i18n="en"><label>Text (English)</label><textarea rows="2" dir="ltr" data-field="textEn">${item.textEn ?? ''}</textarea></div>
        <div class="form-field"><label>لینک تصویر</label><input type="text" dir="ltr" data-field="imageUrl" value="${item.imageUrl ?? ''}" /></div>
        <div class="form-field"><label>لینک ویدئو (آپارات یا mp4)</label><input type="text" dir="ltr" data-field="videoUrl" value="${item.videoUrl ?? ''}" /></div>
        <div class="form-field"><label>لینک دکمه/مقصد (اختیاری)</label><input type="text" dir="ltr" data-field="linkUrl" value="${item.linkUrl ?? ''}" /></div>
        <button type="button" class="btn btn-ghost btn-sm" data-item-action="remove">حذف مورد</button>
      </div>
    `;
  }

  function renderHomepageSection(section: HomepageSection, index: number, total: number): string {
    const isHero = section.type === 'hero';
    const layout = section.layout ?? 'text';
    const label = isHero ? 'هدر و بنر اصلی' : BLOCK_LAYOUT_LABELS[layout];
    const hasItems = !isHero && layout !== 'text' && layout !== 'testimonials';

    return `
      <div class="block-editor" data-homepage-section-index="${index}">
        <div class="block-editor-head">
          <span class="block-editor-type">${label}${isHero ? ' (بخش ثابت)' : ''}</span>
          <div class="block-editor-actions">
            ${
              isHero
                ? ''
                : `
              <label class="settings-inline-toggle"><input type="checkbox" data-field="visible" ${section.visible !== false ? 'checked' : ''} /> نمایش</label>
              <button type="button" class="btn btn-secondary btn-sm block-move-btn" data-homepage-action="up" data-index="${index}" ${index <= 1 ? 'disabled' : ''}>▲</button>
              <button type="button" class="btn btn-secondary btn-sm block-move-btn" data-homepage-action="down" data-index="${index}" ${index >= total - 1 ? 'disabled' : ''}>▼</button>
              <button type="button" class="btn btn-ghost btn-sm" data-homepage-action="remove" data-index="${index}">حذف</button>
            `
            }
          </div>
        </div>
        ${
          isHero
            ? `
          <div class="block-editor-body">
            <input type="text" data-field="heading" data-i18n="fa" placeholder="عنوان اصلی (فارسی)" value="${section.heading ?? ''}" />
            <input type="text" data-field="headingEn" data-i18n="en" dir="ltr" placeholder="Headline (English)" value="${section.headingEn ?? ''}" />
            <textarea data-field="body" data-i18n="fa" rows="2" placeholder="توضیح زیر عنوان (فارسی)">${section.body ?? ''}</textarea>
            <textarea data-field="bodyEn" data-i18n="en" dir="ltr" rows="2" placeholder="Subtext (English)">${section.bodyEn ?? ''}</textarea>
            <input type="text" data-field="backgroundImageUrl" dir="ltr" placeholder="لینک تصویر پس‌زمینه هدر (اختیاری)" value="${section.backgroundImageUrl ?? ''}" />
          </div>
        `
            : `
          <div class="block-editor-body">
            <div class="form-field">
              <label>شیوه‌ی نمایش</label>
              <select data-field="layout">
                ${BLOCK_LAYOUTS.map((l) => `<option value="${l}" ${l === layout ? 'selected' : ''}>${BLOCK_LAYOUT_LABELS[l]}</option>`).join('')}
              </select>
            </div>
            <input type="text" data-field="heading" data-i18n="fa" placeholder="عنوان بخش (فارسی)" value="${section.heading ?? ''}" />
            <input type="text" data-field="headingEn" data-i18n="en" dir="ltr" placeholder="Section heading (English)" value="${section.headingEn ?? ''}" />
            <input type="text" data-field="subheading" data-i18n="fa" placeholder="زیرعنوان (فارسی، اختیاری)" value="${section.subheading ?? ''}" />
            <input type="text" data-field="subheadingEn" data-i18n="en" dir="ltr" placeholder="Subheading (English, optional)" value="${section.subheadingEn ?? ''}" />
            ${
              layout === 'text'
                ? `
              <textarea data-field="body" data-i18n="fa" rows="3" placeholder="متن بخش (فارسی)">${section.body ?? ''}</textarea>
              <textarea data-field="bodyEn" data-i18n="en" dir="ltr" rows="3" placeholder="Section text (English)">${section.bodyEn ?? ''}</textarea>
            `
                : ''
            }
            ${
              layout === 'testimonials'
                ? `<p class="settings-panel-hint">این بلوک به‌صورت خودکار از «نظرات مشتریان» تأییدشده پر می‌شود.</p>`
                : ''
            }
          </div>
          ${
            hasItems
              ? `
            <div class="block-items-list" data-section-items="${index}">
              ${(section.items ?? []).map((item, i) => itemEditorHtml(item, index, i)).join('')}
            </div>
            <button type="button" class="btn btn-secondary btn-sm" data-item-action="add" data-section-index="${index}">
              <span class="icon">${icons.plusCircle}</span>
              افزودن مورد
            </button>
          `
              : ''
          }
        `
        }
      </div>
    `;
  }

  function renderHomepageList(): void {
    const list = document.getElementById('homepage-sections-list');
    if (!list) return;
    list.innerHTML = homepageSections.map((s, i) => renderHomepageSection(s, i, homepageSections.length)).join('');
    applyLanguageVisibility(list);
  }

  function readHomepageSectionsFromDom(): void {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-homepage-section-index]'));
    homepageSections = els.map((el, i) => {
      const existing = homepageSections[i] ?? { id: `section-${crypto.randomUUID().slice(0, 8)}`, type: 'block', visible: true };
      const visibleInput = el.querySelector<HTMLInputElement>('[data-field="visible"]');
      const visible = existing.type === 'hero' ? true : visibleInput ? visibleInput.checked : true;
      const layout = (el.querySelector<HTMLSelectElement>('[data-field="layout"]')?.value as BlockLayout | undefined) ?? existing.layout;
      const hasItems = existing.type === 'block' && layout && layout !== 'text' && layout !== 'testimonials';
      const items = hasItems
        ? Array.from(el.querySelectorAll<HTMLElement>('[data-item-index]')).map((itemEl, j) => ({
            id: existing.items?.[j]?.id ?? `item-${crypto.randomUUID().slice(0, 8)}`,
            title: itemEl.querySelector<HTMLInputElement>('[data-field="title"]')?.value ?? '',
            titleEn: itemEl.querySelector<HTMLInputElement>('[data-field="titleEn"]')?.value ?? '',
            text: itemEl.querySelector<HTMLTextAreaElement>('[data-field="text"]')?.value ?? '',
            textEn: itemEl.querySelector<HTMLTextAreaElement>('[data-field="textEn"]')?.value ?? '',
            imageUrl: itemEl.querySelector<HTMLInputElement>('[data-field="imageUrl"]')?.value ?? '',
            videoUrl: itemEl.querySelector<HTMLInputElement>('[data-field="videoUrl"]')?.value ?? '',
            linkUrl: itemEl.querySelector<HTMLInputElement>('[data-field="linkUrl"]')?.value ?? '',
          }))
        : existing.items;
      return {
        ...existing,
        visible,
        layout,
        heading: el.querySelector<HTMLInputElement>('[data-field="heading"]')?.value ?? '',
        headingEn: el.querySelector<HTMLInputElement>('[data-field="headingEn"]')?.value ?? '',
        subheading: el.querySelector<HTMLInputElement>('[data-field="subheading"]')?.value ?? existing.subheading ?? '',
        subheadingEn: el.querySelector<HTMLInputElement>('[data-field="subheadingEn"]')?.value ?? existing.subheadingEn ?? '',
        body: el.querySelector<HTMLTextAreaElement>('[data-field="body"]')?.value ?? existing.body ?? '',
        bodyEn: el.querySelector<HTMLTextAreaElement>('[data-field="bodyEn"]')?.value ?? existing.bodyEn ?? '',
        backgroundImageUrl: el.querySelector<HTMLInputElement>('[data-field="backgroundImageUrl"]')?.value ?? existing.backgroundImageUrl ?? '',
        items,
      };
    });
  }

  // Wire homepage item and section actions
  document.getElementById('homepage-sections-list')?.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const actionBtn = target.closest<HTMLButtonElement>('[data-homepage-action]');
    if (actionBtn) {
      readHomepageSectionsFromDom();
      const index = Number(actionBtn.dataset.index);
      const action = actionBtn.dataset.homepageAction;
      if (action === 'remove') homepageSections.splice(index, 1);
      else if (action === 'up' && index > 1) [homepageSections[index - 1], homepageSections[index]] = [homepageSections[index], homepageSections[index - 1]];
      else if (action === 'down' && index < homepageSections.length - 1) [homepageSections[index + 1], homepageSections[index]] = [homepageSections[index], homepageSections[index + 1]];
      renderHomepageList();
      return;
    }

    const itemBtn = target.closest<HTMLButtonElement>('[data-item-action]');
    if (itemBtn) {
      readHomepageSectionsFromDom();
      const sectionIndex = Number(itemBtn.dataset.sectionIndex ?? itemBtn.closest('[data-section-index]')?.getAttribute('data-section-index'));
      const action = itemBtn.dataset.itemAction;
      const section = homepageSections[sectionIndex];
      if (!section) return;
      if (!section.items) section.items = [];

      if (action === 'add') {
        section.items.push({ id: `item-${crypto.randomUUID().slice(0, 8)}` });
      } else if (action === 'remove') {
        const itemEditor = itemBtn.closest<HTMLElement>('[data-item-index]');
        const itemIndex = Number(itemEditor?.dataset.itemIndex);
        if (!isNaN(itemIndex)) section.items.splice(itemIndex, 1);
      }
      renderHomepageList();
    }
  });

  document.getElementById('homepage-section-add-btn')?.addEventListener('click', () => {
    readHomepageSectionsFromDom();
    const select = document.getElementById('homepage-section-add-type') as HTMLSelectElement | null;
    const layout = (select?.value || 'text') as BlockLayout;
    homepageSections.push({ id: `section-${crypto.randomUUID().slice(0, 8)}`, type: 'block', visible: true, layout, items: [] });
    renderHomepageList();
  });

  const saveHomepage = async (btn: HTMLButtonElement) => {
    readHomepageSectionsFromDom();
    storiesEnabled = (document.getElementById('homepage-stories-enabled') as HTMLInputElement)?.checked ?? true;
    try {
      await handleSaveButton(btn, async () => {
        await updateSetting('homepage_layout', { sections: homepageSections, storiesEnabled });
      });
      showSaved();
    } catch (err) {
      showError(err);
    }
  };

  document.getElementById('homepage-save-btn')?.addEventListener('click', (e) => saveHomepage(e.currentTarget as HTMLButtonElement));
  document.getElementById('homepage-save-btn-top')?.addEventListener('click', (e) => saveHomepage(e.currentTarget as HTMLButtonElement));

  // ===== 2. Legal Pages Logic (About, Terms, Privacy) =====
  function renderLegalEditor(slug: LegalSlug): void {
    const container = document.getElementById(`legal-editor-${slug}`);
    if (!container) return;
    const page = legalPages[slug] ?? {
      slug,
      title: LEGAL_CONFIG[slug].label,
      titleEn: '',
      description: '',
      descriptionEn: '',
      intro: '',
      introEn: '',
      sections: [],
    };
    legalPages[slug] = page;

    container.innerHTML = `
      <div style="background: var(--color-surface-sunken, rgba(0,0,0,0.02)); border: 1px solid var(--color-border); padding: 12px 16px; border-radius: var(--radius-md); margin-bottom: var(--space-3); display: flex; align-items: center; gap: 24px; flex-wrap: wrap;">
        <span style="font-weight: 600; font-size: 0.9rem; color: var(--color-text);">موقعیت نمایش:</span>
        <label style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer; font-size: 0.9rem;">
          <input type="checkbox" id="legal-${slug}-show-header" ${page.showInHeader ? 'checked' : ''} />
          <span>نمایش در هدر سایت</span>
        </label>
        <label style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer; font-size: 0.9rem;">
          <input type="checkbox" id="legal-${slug}-show-footer" ${page.showInFooter !== false ? 'checked' : ''} />
          <span>نمایش در فوتر سایت</span>
        </label>
      </div>

      <div class="settings-form-grid">
        <div class="form-field" data-i18n="fa"><label>عنوان (فارسی)</label><input type="text" id="legal-${slug}-title-fa" value="${page.title}" /></div>
        <div class="form-field" data-i18n="en"><label>عنوان (انگلیسی)</label><input type="text" dir="ltr" id="legal-${slug}-title-en" value="${page.titleEn}" /></div>
        <div class="form-field" data-i18n="fa"><label>توضیح متا (فارسی)</label><input type="text" id="legal-${slug}-desc-fa" value="${page.description}" /></div>
        <div class="form-field" data-i18n="en"><label>توضیح متا (انگلیسی)</label><input type="text" dir="ltr" id="legal-${slug}-desc-en" value="${page.descriptionEn}" /></div>
      </div>
      <div class="form-field" data-i18n="fa"><label>مقدمه (فارسی)</label><textarea id="legal-${slug}-intro-fa" rows="2">${page.intro}</textarea></div>
      <div class="form-field" data-i18n="en"><label>مقدمه (انگلیسی)</label><textarea id="legal-${slug}-intro-en" dir="ltr" rows="2">${page.introEn}</textarea></div>

      <h3 class="editor-section-title">بخش‌های صفحه</h3>
      <div id="legal-${slug}-sections">
        ${page.sections
          .map(
            (s, i) => `
          <div class="block-editor" data-legal-section="${i}">
            <div class="block-editor-head">
              <span class="block-editor-type">بخش ${i + 1}</span>
              <div class="block-editor-actions">
                <button type="button" class="btn btn-secondary btn-sm block-move-btn" data-legal-action="up" data-slug="${slug}" data-index="${i}">▲</button>
                <button type="button" class="btn btn-secondary btn-sm block-move-btn" data-legal-action="down" data-slug="${slug}" data-index="${i}">▼</button>
                <button type="button" class="btn btn-ghost btn-sm" data-legal-action="remove" data-slug="${slug}" data-index="${i}">حذف</button>
              </div>
            </div>
            <div class="block-editor-body">
              <input type="text" data-field="heading" data-i18n="fa" placeholder="سرتیتر بخش (فارسی)" value="${s.heading}" />
              <input type="text" data-field="headingEn" data-i18n="en" dir="ltr" placeholder="Section heading (English)" value="${s.headingEn}" />
              <textarea data-field="body" data-i18n="fa" rows="4" placeholder="هر پاراگراف در یک خط؛ برای مورد لیستی خط را با «- » شروع کنید">${sectionBodyToText(s.paragraphs, s.list)}</textarea>
              <textarea data-field="bodyEn" data-i18n="en" dir="ltr" rows="4" placeholder="One paragraph per line; prefix list items with '- '">${sectionBodyToText(s.paragraphsEn, s.listEn)}</textarea>
            </div>
          </div>
        `,
          )
          .join('')}
      </div>

      <div style="display: flex; gap: 10px; margin-top: 10px; align-items: center; flex-wrap: wrap;">
        <button type="button" class="btn btn-secondary btn-sm" id="legal-${slug}-add-section-btn">
          <span class="icon">${icons.plusCircle}</span>
          افزودن بخش به این صفحه
        </button>
        <button type="button" class="btn btn-primary btn-sm" id="legal-${slug}-save-btn" style="margin-inline-start: auto;">
          ذخیره ${LEGAL_CONFIG[slug].label}
        </button>
      </div>
    `;

    applyLanguageVisibility(container);

    // Wire section actions
    document.getElementById(`legal-${slug}-sections`)?.addEventListener('click', (event) => {
      const btn = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-legal-action]');
      if (!btn) return;
      readLegalFromDom(slug);
      const index = Number(btn.dataset.index);
      const action = btn.dataset.legalAction;
      const sections = legalPages[slug].sections;
      if (action === 'remove') sections.splice(index, 1);
      else if (action === 'up' && index > 0) [sections[index - 1], sections[index]] = [sections[index], sections[index - 1]];
      else if (action === 'down' && index < sections.length - 1) [sections[index + 1], sections[index]] = [sections[index], sections[index + 1]];
      renderLegalEditor(slug);
    });

    document.getElementById(`legal-${slug}-add-section-btn`)?.addEventListener('click', () => {
      readLegalFromDom(slug);
      legalPages[slug].sections.push({ heading: '', headingEn: '', paragraphs: [], paragraphsEn: [] });
      renderLegalEditor(slug);
    });

    const saveLegal = async (btn: HTMLButtonElement) => {
      readLegalFromDom(slug);
      try {
        await handleSaveButton(btn, async () => {
          await updateSetting('legal_pages', legalPages);
        });
        showSaved();
      } catch (err) {
        showError(err);
      }
    };

    document.getElementById(`legal-${slug}-save-btn`)?.addEventListener('click', (e) => saveLegal(e.currentTarget as HTMLButtonElement));
    document.getElementById(`legal-${slug}-save-btn-top`)?.addEventListener('click', (e) => saveLegal(e.currentTarget as HTMLButtonElement));
  }

  function readLegalFromDom(slug: LegalSlug): void {
    const page = legalPages[slug];
    if (!page) return;
    page.showInHeader = (document.getElementById(`legal-${slug}-show-header`) as HTMLInputElement)?.checked ?? false;
    page.showInFooter = (document.getElementById(`legal-${slug}-show-footer`) as HTMLInputElement)?.checked ?? false;
    page.title = (document.getElementById(`legal-${slug}-title-fa`) as HTMLInputElement)?.value ?? '';
    page.titleEn = (document.getElementById(`legal-${slug}-title-en`) as HTMLInputElement)?.value ?? '';
    page.description = (document.getElementById(`legal-${slug}-desc-fa`) as HTMLInputElement)?.value ?? '';
    page.descriptionEn = (document.getElementById(`legal-${slug}-desc-en`) as HTMLInputElement)?.value ?? '';
    page.intro = (document.getElementById(`legal-${slug}-intro-fa`) as HTMLTextAreaElement)?.value ?? '';
    page.introEn = (document.getElementById(`legal-${slug}-intro-en`) as HTMLTextAreaElement)?.value ?? '';

    const container = document.getElementById(`legal-${slug}-sections`);
    if (!container) return;
    const sectionEls = Array.from(container.querySelectorAll<HTMLElement>('[data-legal-section]'));
    page.sections = sectionEls.map((el) => {
      const { paragraphs, list } = textToSectionBody(el.querySelector<HTMLTextAreaElement>('[data-field="body"]')?.value ?? '');
      const { paragraphs: paragraphsEn, list: listEn } = textToSectionBody(el.querySelector<HTMLTextAreaElement>('[data-field="bodyEn"]')?.value ?? '');
      return {
        heading: el.querySelector<HTMLInputElement>('[data-field="heading"]')?.value ?? '',
        headingEn: el.querySelector<HTMLInputElement>('[data-field="headingEn"]')?.value ?? '',
        paragraphs,
        paragraphsEn,
        list,
        listEn,
      };
    });
  }

  // ===== 3. Custom Pages Logic =====
  const customTableBody = document.getElementById('page-custom-table-body');

  async function loadCustomPages(): Promise<void> {
    if (!customTableBody) return;
    try {
      const pages = await fetchAdminPages();
      customTableBody.innerHTML = pages.length
        ? pages.map(renderCustomRow).join('')
        : '<tr><td colspan="5" class="staff-table-empty">هنوز برگه‌ای ساخته نشده است. روی «افزودن صفحه تازه» کلیک کنید.</td></tr>';
      wireCustomRowActions();
    } catch (err) {
      showError(err);
    }
  }

  function wireCustomRowActions(): void {
    if (!customTableBody) return;
    customTableBody.querySelectorAll<HTMLButtonElement>('[data-edit-page]').forEach((btn) => {
      btn.addEventListener('click', () => onEdit(Number(btn.dataset.editPage)));
    });
    customTableBody.querySelectorAll<HTMLButtonElement>('[data-delete-page]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!window.confirm('این برگه برای همیشه حذف شود؟')) return;
        btn.disabled = true;
        try {
          await deleteCustomPage(Number(btn.dataset.deletePage));
          await loadCustomPages();
        } catch (err) {
          showError(err);
          btn.disabled = false;
        }
      });
    });
  }

  // ===== Initial Load =====
  async function loadAll(): Promise<void> {
    try {
      siteSettings = await fetchSettings();
      // Load homepage
      const data = siteSettings.homepage_layout as { sections?: HomepageSection[]; storiesEnabled?: boolean } | undefined;
      const rawSections = data?.sections && data.sections.length > 0 ? data.sections : DEFAULT_HOMEPAGE_SECTIONS;
      homepageSections = rawSections.filter(
        (s) =>
          s.id !== 'starter-faq' &&
          s.id !== 'starter-grid' &&
          s.id !== 'starter-steps' &&
          s.id !== 'starter-testimonials' &&
          s.heading !== 'چرا مهسان؟' &&
          s.heading !== 'چرا بهبار؟' &&
          s.heading !== 'چرا بهدون؟',
      );
      if (!homepageSections.some((s) => s.type === 'hero')) {
        homepageSections = [{ id: 'hero', type: 'hero', visible: true }, ...homepageSections];
      }
      storiesEnabled = data?.storiesEnabled !== false;
      const storiesCheckbox = document.getElementById('homepage-stories-enabled') as HTMLInputElement | null;
      if (storiesCheckbox) storiesCheckbox.checked = storiesEnabled;
      renderHomepageList();

      // Load legal pages
      legalPages = (siteSettings.legal_pages as Record<string, LegalPage> | undefined) ?? {};
      renderLegalEditor('about');
      renderLegalEditor('terms');
      renderLegalEditor('privacy');

      // Load custom pages
      await loadCustomPages();
    } catch (err) {
      showError(err);
    }
  }

  void loadAll();
}


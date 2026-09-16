import { icons } from '../components/icons.ts';
import { fetchSettings, updateSetting, fetchAdminArticles } from '../utils/api.ts';
import type { ArticleRecord } from '../utils/api.ts';
import { showToast } from '../utils/toast.ts';
import { handleSaveButton } from '../utils/save-button.ts';

interface SeoSettings {
  googleSiteVerification: string;
  googleAnalyticsId: string;
  defaultOgImage: string;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderAuditRow(article: ArticleRecord): string {
  const missing: string[] = [];
  if (!article.metaTitle) missing.push('عنوان سئو');
  if (!article.metaDescription) missing.push('توضیحات سئو');
  return `
    <div class="testimonial-row" data-audit-edit="${article.id}" role="button" tabindex="0">
      <div class="testimonial-row-avatar"><span class="icon">${icons.article}</span></div>
      <div class="testimonial-row-body">
        <div class="testimonial-row-head">
          <strong>${escapeHtml(article.title)}</strong>
          <span class="article-status-badge article-status-draft">فاقد ${missing.join(' و ')}</span>
        </div>
        <div class="job-application-meta"><span dir="ltr">/magazine/${escapeHtml(article.slug)}</span></div>
      </div>
    </div>
  `;
}

export function renderSeoManagementView(): string {
  return `
    <div class="view-header">
      <h1>مدیریت سئو</h1>
    </div>
    <p class="error-text" id="seo-error" hidden></p>

    <div class="editor-sidebar-card">
      <div class="card-header-action">
        <h3 style="margin: 0;">Google Search Console</h3>
        <button type="button" class="btn btn-primary btn-sm" id="seo-search-console-save-btn">ذخیره</button>
      </div>
      <div class="settings-form-grid">
        <div class="form-field">
          <label for="seo-search-console">کد تأیید Search Console</label>
          <input type="text" id="seo-search-console" dir="ltr" placeholder="مثلاً abcdEFGH12345..." />
        </div>
      </div>
    </div>

    <div class="editor-sidebar-card">
      <div class="card-header-action">
        <h3 style="margin: 0;">Google Analytics</h3>
        <button type="button" class="btn btn-primary btn-sm" id="seo-ga-save-btn">ذخیره</button>
      </div>
      <div class="settings-form-grid">
        <div class="form-field">
          <label for="seo-ga-id">شناسه Google Analytics (GA4)</label>
          <input type="text" id="seo-ga-id" dir="ltr" placeholder="G-XXXXXXXXXX" />
        </div>
      </div>
    </div>

    <div class="editor-sidebar-card">
      <h3>بازبینی سئوی مقاله‌ها</h3>
      <p class="settings-panel-hint">مقاله‌هایی که عنوان یا توضیحات سئو ندارند، اینجا فهرست می‌شوند — با کلیک روی هرکدام مستقیم به ویرایشگرش می‌روید.</p>
      <div id="seo-audit-list"></div>
    </div>
  `;
}

export function initSeoManagementView(onEditArticle: (id: number) => void = () => {}): void {
  const errorEl = document.getElementById('seo-error');
  const auditList = document.getElementById('seo-audit-list');
  if (!errorEl || !auditList) return;

  // تصویر پیش‌فرض اشتراک‌گذاری دیگر در این صفحه ویرایش نمی‌شود، اما اگر قبلاً مقداری داشته باشد
  // باید هنگام ذخیره‌ی کارت‌های دیگر دست‌نخورده بماند — پس فقط این‌جا نگه‌داری می‌شود، نه در یک اینپوت.
  let defaultOgImage = '';



  function showError(err: unknown): void {
    errorEl!.hidden = false;
    errorEl!.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
    showToast(err instanceof Error ? err.message : 'ذخیره ناموفق بود.', 'error');
  }

  async function loadSettings(): Promise<void> {
    const settings = await fetchSettings();
    const seo = (settings.seo as Partial<SeoSettings> | undefined) ?? {};
    (document.getElementById('seo-search-console') as HTMLInputElement).value = seo.googleSiteVerification ?? '';
    (document.getElementById('seo-ga-id') as HTMLInputElement).value = seo.googleAnalyticsId ?? '';
    defaultOgImage = seo.defaultOgImage ?? '';
  }

  async function loadAudit(): Promise<void> {
    const articles = await fetchAdminArticles();
    const missing = articles.filter((a) => !a.metaTitle || !a.metaDescription);
    auditList!.innerHTML = missing.length
      ? missing.map(renderAuditRow).join('')
      : '<p class="pipeline-empty">همه‌ی مقاله‌ها عنوان و توضیحات سئو دارند.</p>';
    auditList!.querySelectorAll<HTMLElement>('[data-audit-edit]').forEach((row) => {
      row.addEventListener('click', () => onEditArticle(Number(row.dataset.auditEdit)));
    });
  }

  function readSeoFromDom(): SeoSettings {
    return {
      googleSiteVerification: (document.getElementById('seo-search-console') as HTMLInputElement).value.trim(),
      googleAnalyticsId: (document.getElementById('seo-ga-id') as HTMLInputElement).value.trim(),
      defaultOgImage,
    };
  }

  // هر کارت جدا ذخیره می‌شود، اما همیشه مقدار فعلیِ هر دو فیلد را می‌فرستد تا ذخیره‌ی یکی، مقدار دیگری را پاک نکند.
  function wireSeoSaveButton(id: string): void {
    document.getElementById(id)?.addEventListener('click', async (e) => {
      const btn = e.currentTarget as HTMLButtonElement;
      errorEl!.hidden = true;
      try {
        await handleSaveButton(btn, async () => {
          await updateSetting('seo', readSeoFromDom());
        });
        showToast('تنظیمات سئو ذخیره شد.');
      } catch (err) {
        showError(err);
      }
    });
  }

  wireSeoSaveButton('seo-search-console-save-btn');
  wireSeoSaveButton('seo-ga-save-btn');

  Promise.all([loadSettings(), loadAudit()]).catch(showError);
}

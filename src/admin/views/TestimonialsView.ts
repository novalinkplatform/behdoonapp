import { icons } from '../components/icons.ts';
import { fetchTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../utils/api.ts';
import type { Testimonial } from '../utils/api.ts';
import { ensureLanguageMode, applyLanguageVisibility } from '../utils/languageMode.ts';

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function starRow(rating: number): string {
  return Array.from({ length: 5 }, (_, i) => (i < rating ? '★' : '☆')).join('');
}

function renderRow(t: Testimonial): string {
  return `
    <div class="testimonial-row" data-testimonial-row="${t.id}">
      <div class="testimonial-row-avatar">
        ${t.avatarUrl ? `<img src="${escapeHtml(t.avatarUrl)}" alt="" />` : `<span class="icon">${icons.user}</span>`}
      </div>
      <div class="testimonial-row-body">
        <div class="testimonial-row-head">
          <strong>${escapeHtml(t.customerName) || '(بدون نام)'}</strong>
          <span class="testimonial-row-stars">${starRow(t.rating)}</span>
          <span class="article-status-badge article-status-${t.status}">${t.status === 'published' ? 'منتشرشده' : 'پیش‌نویس'}</span>
        </div>
        <p class="testimonial-row-text">${escapeHtml(t.text)}</p>
      </div>
      <div class="staff-table-actions">
        <button type="button" class="btn btn-secondary btn-sm" data-edit-testimonial="${t.id}">ویرایش</button>
        <button type="button" class="btn btn-ghost btn-sm" data-delete-testimonial="${t.id}">حذف</button>
      </div>
    </div>
  `;
}

function renderForm(): string {
  return `
    <div class="editor-sidebar-card" id="testimonial-form-card" hidden>
      <h3 id="testimonial-form-title">نظر جدید</h3>
      <input type="hidden" id="testimonial-form-id" />
      <div class="settings-form-grid">
        <div class="form-field" data-i18n="fa"><label for="testimonial-name">نام مشتری (فارسی)</label><input type="text" id="testimonial-name" /></div>
        <div class="form-field" data-i18n="en"><label for="testimonial-name-en">نام مشتری (انگلیسی)</label><input type="text" id="testimonial-name-en" dir="ltr" /></div>
      </div>
      <div class="form-field" data-i18n="fa"><label for="testimonial-text">متن نظر (فارسی)</label><textarea id="testimonial-text" rows="3"></textarea></div>
      <div class="form-field" data-i18n="en"><label for="testimonial-text-en">متن نظر (انگلیسی)</label><textarea id="testimonial-text-en" dir="ltr" rows="3"></textarea></div>
      <div class="settings-form-grid">
        <div class="form-field">
          <label for="testimonial-rating">امتیاز</label>
          <select id="testimonial-rating">
            <option value="5">۵ ستاره</option>
            <option value="4">۴ ستاره</option>
            <option value="3">۳ ستاره</option>
            <option value="2">۲ ستاره</option>
            <option value="1">۱ ستاره</option>
          </select>
        </div>
        <div class="form-field"><label for="testimonial-avatar">لینک تصویر (اختیاری)</label><input type="text" id="testimonial-avatar" dir="ltr" /></div>
        <div class="form-field"><label for="testimonial-sort">ترتیب نمایش</label><input type="number" id="testimonial-sort" value="0" /></div>
        <div class="form-field">
          <label for="testimonial-status">وضعیت</label>
          <select id="testimonial-status">
            <option value="published">منتشرشده</option>
            <option value="draft">پیش‌نویس</option>
          </select>
        </div>
      </div>
      <p class="error-text" id="testimonial-form-error" hidden></p>
      <div class="settings-panel-footer">
        <button type="button" class="btn btn-secondary" id="testimonial-cancel-btn">انصراف</button>
        <button type="button" class="btn btn-primary" id="testimonial-save-btn">ذخیره</button>
      </div>
    </div>
  `;
}

export function renderTestimonialsView(): string {
  return `
    <div class="view-header">
      <h1>نظرات مشتریان</h1>
      <button type="button" class="btn btn-primary" id="testimonial-new-btn">
        <span class="icon">${icons.plusCircle}</span>
        نظر جدید
      </button>
    </div>
    <p class="error-text" id="testimonials-list-error" hidden></p>
    ${renderForm()}
    <div class="testimonial-list" id="testimonials-list"></div>
  `;
}

export function initTestimonialsView(): void {
  void ensureLanguageMode().then(() => applyLanguageVisibility(document.getElementById('view-container') ?? document.body));

  const errorEl = document.getElementById('testimonials-list-error');
  const list = document.getElementById('testimonials-list');
  const newBtn = document.getElementById('testimonial-new-btn');
  const formCard = document.getElementById('testimonial-form-card');
  const formTitle = document.getElementById('testimonial-form-title');
  const formError = document.getElementById('testimonial-form-error');
  const cancelBtn = document.getElementById('testimonial-cancel-btn');
  const saveBtn = document.getElementById('testimonial-save-btn') as HTMLButtonElement | null;
  if (!errorEl || !list || !newBtn || !formCard || !formTitle || !formError || !cancelBtn || !saveBtn) return;

  let items: Testimonial[] = [];

  function openForm(t: Testimonial | null): void {
    formError!.hidden = true;
    formTitle!.textContent = t ? 'ویرایش نظر' : 'نظر جدید';
    (document.getElementById('testimonial-form-id') as HTMLInputElement).value = t ? String(t.id) : '';
    (document.getElementById('testimonial-name') as HTMLInputElement).value = t?.customerName ?? '';
    (document.getElementById('testimonial-name-en') as HTMLInputElement).value = t?.customerNameEn ?? '';
    (document.getElementById('testimonial-text') as HTMLTextAreaElement).value = t?.text ?? '';
    (document.getElementById('testimonial-text-en') as HTMLTextAreaElement).value = t?.textEn ?? '';
    (document.getElementById('testimonial-rating') as HTMLSelectElement).value = String(t?.rating ?? 5);
    (document.getElementById('testimonial-avatar') as HTMLInputElement).value = t?.avatarUrl ?? '';
    (document.getElementById('testimonial-sort') as HTMLInputElement).value = String(t?.sortOrder ?? 0);
    (document.getElementById('testimonial-status') as HTMLSelectElement).value = t?.status ?? 'published';
    formCard!.hidden = false;
    formCard!.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function closeForm(): void {
    formCard!.hidden = true;
  }

  async function load(): Promise<void> {
    errorEl!.hidden = true;
    try {
      items = await fetchTestimonials();
      list!.innerHTML = items.length ? items.map(renderRow).join('') : '<p class="pipeline-empty">هنوز نظری ثبت نشده است.</p>';
      wireRowActions();
    } catch (err) {
      errorEl!.hidden = false;
      errorEl!.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
    }
  }

  function wireRowActions(): void {
    list!.querySelectorAll<HTMLButtonElement>('[data-edit-testimonial]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const t = items.find((i) => i.id === Number(btn.dataset.editTestimonial));
        if (t) openForm(t);
      });
    });
    list!.querySelectorAll<HTMLButtonElement>('[data-delete-testimonial]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!window.confirm('این نظر برای همیشه حذف شود؟')) return;
        btn.disabled = true;
        try {
          await deleteTestimonial(Number(btn.dataset.deleteTestimonial));
          await load();
        } catch (err) {
          errorEl!.hidden = false;
          errorEl!.textContent = err instanceof Error ? err.message : 'حذف ناموفق بود.';
          btn.disabled = false;
        }
      });
    });
  }

  newBtn.addEventListener('click', () => openForm(null));
  cancelBtn.addEventListener('click', closeForm);

  saveBtn.addEventListener('click', async () => {
    formError!.hidden = true;
    const idRaw = (document.getElementById('testimonial-form-id') as HTMLInputElement).value;
    const payload = {
      customerName: (document.getElementById('testimonial-name') as HTMLInputElement).value.trim(),
      customerNameEn: (document.getElementById('testimonial-name-en') as HTMLInputElement).value.trim(),
      text: (document.getElementById('testimonial-text') as HTMLTextAreaElement).value.trim(),
      textEn: (document.getElementById('testimonial-text-en') as HTMLTextAreaElement).value.trim(),
      rating: Number((document.getElementById('testimonial-rating') as HTMLSelectElement).value),
      avatarUrl: (document.getElementById('testimonial-avatar') as HTMLInputElement).value.trim() || null,
      sortOrder: Number((document.getElementById('testimonial-sort') as HTMLInputElement).value) || 0,
      status: (document.getElementById('testimonial-status') as HTMLSelectElement).value as 'draft' | 'published',
    };

    if (!payload.customerName || !payload.text) {
      formError!.hidden = false;
      formError!.textContent = 'نام مشتری و متن نظر الزامی است.';
      return;
    }

    saveBtn.disabled = true;
    try {
      if (idRaw) await updateTestimonial(Number(idRaw), payload);
      else await createTestimonial(payload);
      closeForm();
      await load();
    } catch (err) {
      formError!.hidden = false;
      formError!.textContent = err instanceof Error ? err.message : 'ذخیره ناموفق بود.';
    } finally {
      saveBtn.disabled = false;
    }
  });

  void load();
}

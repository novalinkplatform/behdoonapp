import { icons } from '../components/icons.ts';
import { fetchStories, createStory, updateStory, deleteStory } from '../utils/api.ts';
import type { Story } from '../utils/api.ts';
import { ensureLanguageMode, applyLanguageVisibility } from '../utils/languageMode.ts';

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderRow(s: Story): string {
  return `
    <div class="testimonial-row" data-story-row="${s.id}">
      <div class="testimonial-row-avatar"><img src="${escapeHtml(s.imageUrl)}" alt="" /></div>
      <div class="testimonial-row-body">
        <div class="testimonial-row-head"><strong>${escapeHtml(s.caption) || '(بدون متن)'}</strong></div>
        <p class="testimonial-row-text">${escapeHtml(s.linkUrl ?? '')}</p>
      </div>
      <div class="staff-table-actions">
        <button type="button" class="btn btn-secondary btn-sm" data-edit-story="${s.id}">ویرایش</button>
        <button type="button" class="btn btn-ghost btn-sm" data-delete-story="${s.id}">حذف</button>
      </div>
    </div>
  `;
}

function renderForm(): string {
  return `
    <div class="editor-sidebar-card" id="story-form-card" hidden>
      <h3 id="story-form-title">استوری جدید</h3>
      <input type="hidden" id="story-form-id" />
      <div class="form-field"><label for="story-image">لینک تصویر</label><input type="text" id="story-image" dir="ltr" placeholder="https://..." /></div>
      <div class="settings-form-grid">
        <div class="form-field" data-i18n="fa"><label for="story-caption">متن (فارسی)</label><input type="text" id="story-caption" /></div>
        <div class="form-field" data-i18n="en"><label for="story-caption-en">متن (انگلیسی)</label><input type="text" id="story-caption-en" dir="ltr" /></div>
        <div class="form-field"><label for="story-link">لینک مقصد (اختیاری)</label><input type="text" id="story-link" dir="ltr" /></div>
        <div class="form-field"><label for="story-sort">ترتیب نمایش</label><input type="number" id="story-sort" value="0" /></div>
      </div>
      <p class="error-text" id="story-form-error" hidden></p>
      <div class="settings-panel-footer">
        <button type="button" class="btn btn-secondary" id="story-cancel-btn">انصراف</button>
        <button type="button" class="btn btn-primary" id="story-save-btn">ذخیره</button>
      </div>
    </div>
  `;
}

export function renderStoriesView(): string {
  return `
    <div class="view-header">
      <h1>استوری‌ها</h1>
      <button type="button" class="btn btn-primary" id="story-new-btn">
        <span class="icon">${icons.plusCircle}</span>
        استوری جدید
      </button>
    </div>
    <p class="error-text" id="stories-list-error" hidden></p>
    ${renderForm()}
    <div class="testimonial-list" id="stories-list"></div>
  `;
}

export function initStoriesView(): void {
  void ensureLanguageMode().then(() => applyLanguageVisibility(document.getElementById('view-container') ?? document.body));

  const errorEl = document.getElementById('stories-list-error');
  const list = document.getElementById('stories-list');
  const newBtn = document.getElementById('story-new-btn');
  const formCard = document.getElementById('story-form-card');
  const formTitle = document.getElementById('story-form-title');
  const formError = document.getElementById('story-form-error');
  const cancelBtn = document.getElementById('story-cancel-btn');
  const saveBtn = document.getElementById('story-save-btn') as HTMLButtonElement | null;
  if (!errorEl || !list || !newBtn || !formCard || !formTitle || !formError || !cancelBtn || !saveBtn) return;

  let items: Story[] = [];

  function openForm(s: Story | null): void {
    formError!.hidden = true;
    formTitle!.textContent = s ? 'ویرایش استوری' : 'استوری جدید';
    (document.getElementById('story-form-id') as HTMLInputElement).value = s ? String(s.id) : '';
    (document.getElementById('story-image') as HTMLInputElement).value = s?.imageUrl ?? '';
    (document.getElementById('story-caption') as HTMLInputElement).value = s?.caption ?? '';
    (document.getElementById('story-caption-en') as HTMLInputElement).value = s?.captionEn ?? '';
    (document.getElementById('story-link') as HTMLInputElement).value = s?.linkUrl ?? '';
    (document.getElementById('story-sort') as HTMLInputElement).value = String(s?.sortOrder ?? 0);
    formCard!.hidden = false;
    formCard!.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function closeForm(): void {
    formCard!.hidden = true;
  }

  async function load(): Promise<void> {
    errorEl!.hidden = true;
    try {
      items = await fetchStories();
      list!.innerHTML = items.length ? items.map(renderRow).join('') : '<p class="pipeline-empty">هنوز استوری‌ای ثبت نشده است.</p>';
      wireRowActions();
    } catch (err) {
      errorEl!.hidden = false;
      errorEl!.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
    }
  }

  function wireRowActions(): void {
    list!.querySelectorAll<HTMLButtonElement>('[data-edit-story]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const s = items.find((i) => i.id === Number(btn.dataset.editStory));
        if (s) openForm(s);
      });
    });
    list!.querySelectorAll<HTMLButtonElement>('[data-delete-story]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!window.confirm('این استوری برای همیشه حذف شود؟')) return;
        btn.disabled = true;
        try {
          await deleteStory(Number(btn.dataset.deleteStory));
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
    const idRaw = (document.getElementById('story-form-id') as HTMLInputElement).value;
    const payload = {
      imageUrl: (document.getElementById('story-image') as HTMLInputElement).value.trim(),
      caption: (document.getElementById('story-caption') as HTMLInputElement).value.trim(),
      captionEn: (document.getElementById('story-caption-en') as HTMLInputElement).value.trim(),
      linkUrl: (document.getElementById('story-link') as HTMLInputElement).value.trim() || null,
      sortOrder: Number((document.getElementById('story-sort') as HTMLInputElement).value) || 0,
    };

    if (!payload.imageUrl) {
      formError!.hidden = false;
      formError!.textContent = 'لینک تصویر الزامی است.';
      return;
    }

    saveBtn.disabled = true;
    try {
      if (idRaw) await updateStory(Number(idRaw), payload);
      else await createStory(payload);
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

import { icons } from '../components/icons.ts';
import {
  fetchAdminPage,
  createCustomPage,
  updateCustomPage,
  setCustomPageStatus,
  uploadImage,
} from '../utils/api.ts';
import type { CustomPageBlock, CustomPageRecord } from '../utils/api.ts';
import { ensureLanguageMode, applyLanguageVisibility } from '../utils/languageMode.ts';
import { renderRichTextEditor, wireRichTextEditors } from '../components/RichTextEditor.ts';

const BLOCK_LABELS: Record<CustomPageBlock['type'], string> = {
  richtext: 'متن پیشرفته',
  heading: 'سرتیتر',
  paragraph: 'پاراگراف',
  list: 'لیست',
  image: 'تصویر',
  video: 'ویدئو',
};

function emptyBlock(type: CustomPageBlock['type']): CustomPageBlock {
  if (type === 'richtext') return { type: 'richtext', html: '', htmlEn: '' };
  if (type === 'heading') return { type: 'heading', text: '', textEn: '' };
  if (type === 'paragraph') return { type: 'paragraph', text: '', textEn: '' };
  if (type === 'list') return { type: 'list', items: [], itemsEn: [] };
  if (type === 'image') return { type: 'image', url: '', caption: '', captionEn: '' };
  return { type: 'video', url: '' };
}

function renderBlock(block: CustomPageBlock, index: number): string {
  const header = `
    <div class="block-editor-head">
      <span class="block-editor-type">${BLOCK_LABELS[block.type] || block.type}</span>
      <div class="block-editor-actions">
        <button type="button" class="btn btn-secondary btn-sm block-move-btn" data-block-action="up" data-index="${index}" title="بالا">▲</button>
        <button type="button" class="btn btn-secondary btn-sm block-move-btn" data-block-action="down" data-index="${index}" title="پایین">▼</button>
        <button type="button" class="btn btn-ghost btn-sm" data-block-action="remove" data-index="${index}">حذف</button>
      </div>
    </div>
  `;

  let body = '';
  if (block.type === 'richtext') {
    body = `
      <div data-i18n="fa">${renderRichTextEditor('html', block.html, 'rtl')}</div>
      <div data-i18n="en">${renderRichTextEditor('htmlEn', block.htmlEn, 'ltr')}</div>
    `;
  } else if (block.type === 'heading') {
    body = `
      <input type="text" data-field="text" data-i18n="fa" placeholder="متن سرتیتر (فارسی)" value="${escapeAttr(block.text)}" />
      <input type="text" data-field="textEn" data-i18n="en" dir="ltr" placeholder="Heading text (English)" value="${escapeAttr(block.textEn)}" />
    `;
  } else if (block.type === 'paragraph') {
    body = `
      <textarea data-field="text" data-i18n="fa" placeholder="متن پاراگراف (فارسی)" rows="3">${escapeHtml(block.text)}</textarea>
      <textarea data-field="textEn" data-i18n="en" dir="ltr" placeholder="Paragraph text (English)" rows="3">${escapeHtml(block.textEn)}</textarea>
    `;
  } else if (block.type === 'list') {
    body = `
      <textarea data-field="items" data-i18n="fa" placeholder="هر مورد در یک خط (فارسی)" rows="4">${escapeHtml(block.items.join('\n'))}</textarea>
      <textarea data-field="itemsEn" data-i18n="en" dir="ltr" placeholder="One item per line (English)" rows="4">${escapeHtml(block.itemsEn.join('\n'))}</textarea>
    `;
  } else if (block.type === 'image') {
    body = `
      <div class="block-image-upload">
        ${block.url ? `<img src="${escapeAttr(block.url)}" alt="" class="block-image-preview" />` : '<span class="block-image-placeholder">تصویری انتخاب نشده</span>'}
        <input type="file" accept="image/*" data-image-upload hidden />
        <button type="button" class="btn btn-secondary btn-sm" data-image-upload-btn>انتخاب تصویر</button>
      </div>
      <input type="hidden" data-field="url" value="${escapeAttr(block.url)}" />
      <input type="text" data-field="caption" data-i18n="fa" placeholder="زیرنویس تصویر (فارسی)" value="${escapeAttr(block.caption)}" />
      <input type="text" data-field="captionEn" data-i18n="en" dir="ltr" placeholder="Image caption (English)" value="${escapeAttr(block.captionEn)}" />
    `;
  } else if (block.type === 'video') {
    body = `
      <input type="url" data-field="url" dir="ltr" placeholder="https://www.aparat.com/v/... یا https://www.youtube.com/watch?v=..." value="${escapeAttr(block.url)}" />
    `;
  }

  return `<div class="block-editor" data-block-index="${index}" data-block-type="${block.type}">${header}<div class="block-editor-body">${body}</div></div>`;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(str: string): string {
  return escapeHtml(str).replace(/"/g, '&quot;');
}

export function renderPageEditorView(): string {
  return `
    <div class="view-header">
      <div>
        <h1 id="page-editor-title-label">برگه جدید</h1>
        <p style="color: var(--color-text-muted); font-size: 0.85rem; margin-top: 4px;">طراحی برگه دلخواه برای سایت بهدون</p>
      </div>
      <div class="editor-header-actions">
        <span class="article-status-badge" id="page-editor-status-badge" hidden></span>
        <button type="button" class="btn btn-secondary" id="page-editor-back-btn">بازگشت به صفحات سایت</button>
      </div>
    </div>
    <p class="error-text" id="page-editor-error" hidden></p>

    <div class="editor-grid">
      <div class="editor-main">
        <div class="form-field" data-i18n="fa">
          <label for="page-editor-title">عنوان برگه (فارسی) *</label>
          <input type="text" id="page-editor-title" placeholder="مثلاً: خدمات ویژه اسباب‌کشی VIP یا قوانین استرداد" />
        </div>
        <div class="form-field" data-i18n="en">
          <label for="page-editor-title-en">عنوان برگه (انگلیسی)</label>
          <input type="text" id="page-editor-title-en" dir="ltr" placeholder="e.g. VIP Moving Services" />
        </div>
        <div class="form-field" data-i18n="fa">
          <label for="page-editor-excerpt">توضیح کوتاه / خلاصه (فارسی)</label>
          <textarea id="page-editor-excerpt" rows="2" placeholder="توضیح مختصر درباره این صفحه"></textarea>
        </div>
        <div class="form-field" data-i18n="en">
          <label for="page-editor-excerpt-en">توضیح کوتاه (انگلیسی)</label>
          <textarea id="page-editor-excerpt-en" dir="ltr" rows="2"></textarea>
        </div>

        <h2 class="editor-section-title" style="margin-top: 2rem;">بخش‌های محتوایی برگه</h2>
        <div id="page-editor-blocks"></div>
        <div class="block-add-row">
          <select id="page-editor-add-block-type">
            <option value="richtext">متن با ویرایشگر پیشرفته (RichText)</option>
            <option value="heading">سرتیتر (Heading)</option>
            <option value="paragraph">پاراگراف متنی</option>
            <option value="list">لیست آیتم‌ها</option>
            <option value="image">تصویر با زیرنویس</option>
            <option value="video">ویدئو (آپارات یا یوتیوب)</option>
          </select>
          <button type="button" class="btn btn-secondary" id="page-editor-add-block-btn">
            <span class="icon">${icons.plusCircle}</span>
            افزودن بلوک
          </button>
        </div>
      </div>

      <aside class="editor-sidebar">
        <div class="editor-sidebar-card">
          <h3>وضعیت و انتشار</h3>
          <button type="button" class="btn btn-secondary btn-block" id="page-editor-save-draft-btn">ذخیره پیش‌نویس</button>
          <button type="button" class="btn btn-primary btn-block" id="page-editor-publish-btn">انتشار برگه</button>
          <button type="button" class="btn btn-ghost btn-block" id="page-editor-unpublish-btn" hidden>بازگرداندن به پیش‌نویس</button>
          <div id="page-live-link-container" style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--color-border); font-size: 0.85rem;" hidden>
            <span style="color: var(--color-text-muted); display: block; margin-bottom: 4px;">پیوند برگه:</span>
            <a id="page-live-link" href="#" target="_blank" style="color: var(--color-primary); word-break: break-all; font-weight: 500;"></a>
          </div>
        </div>

        <div class="editor-sidebar-card">
          <h3>موقعیت نمایش در سایت</h3>
          <p class="settings-panel-hint" style="margin: 0 0 12px 0;">
            مشخص کنید لینک این برگه در کدام بخش‌های عمومی نمایش یابد:
          </p>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 0.9rem;">
              <input type="checkbox" id="page-editor-show-header" />
              <span>نمایش در هدر سایت</span>
            </label>
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 0.9rem;">
              <input type="checkbox" id="page-editor-show-footer" />
              <span>نمایش در فوتر سایت</span>
            </label>
          </div>
        </div>

        <div class="editor-sidebar-card">
          <h3>پیوند یکتا (Slug / URL)</h3>
          <div class="form-field">
            <label for="page-editor-slug">پیوند صفحه (انگلیسی یا فارسی)</label>
            <input type="text" id="page-editor-slug" dir="ltr" placeholder="مثال: vip-moving یا privacy" />
            <span style="font-size: 0.75rem; color: var(--color-text-muted); display: block; margin-top: 4px;">
              آدرس صفحه به شکل <code>behbarapp.ir/p/slug</code> خواهد بود.
            </span>
          </div>
        </div>

        <div class="editor-sidebar-card">
          <h3>تصویر شاخص برگه</h3>
          <div class="block-image-upload">
            <img id="page-editor-cover-preview" alt="" class="block-image-preview" hidden />
            <span id="page-editor-cover-placeholder" class="block-image-placeholder">تصویری انتخاب نشده</span>
            <input type="file" accept="image/*" id="page-editor-cover-upload" hidden />
            <button type="button" class="btn btn-secondary btn-sm" id="page-editor-cover-upload-btn">انتخاب تصویر</button>
            <button type="button" class="btn btn-ghost btn-sm" id="page-editor-cover-remove-btn" hidden>حذف تصویر</button>
          </div>
        </div>

        <div class="editor-sidebar-card">
          <h3>بهینه‌سازی سئو (SEO)</h3>
          <div class="form-field">
            <label for="page-editor-meta-title">عنوان متا (Meta Title)</label>
            <input type="text" id="page-editor-meta-title" placeholder="پیش‌فرض: عنوان برگه" />
          </div>
          <div class="form-field">
            <label for="page-editor-meta-description">توضیحات متا (Meta Description)</label>
            <textarea id="page-editor-meta-description" rows="3" placeholder="توضیحات برای موتورهای جستجو"></textarea>
          </div>
        </div>
      </aside>
    </div>
  `;
}

export function initPageEditorView(pageId: number | null, onBack: () => void): void {
  const errorEl = document.getElementById('page-editor-error');
  const titleLabel = document.getElementById('page-editor-title-label');
  const statusBadge = document.getElementById('page-editor-status-badge');
  const backBtn = document.getElementById('page-editor-back-btn');
  const titleInput = document.getElementById('page-editor-title') as HTMLInputElement | null;
  const titleEnInput = document.getElementById('page-editor-title-en') as HTMLInputElement | null;
  const excerptInput = document.getElementById('page-editor-excerpt') as HTMLTextAreaElement | null;
  const excerptEnInput = document.getElementById('page-editor-excerpt-en') as HTMLTextAreaElement | null;
  const slugInput = document.getElementById('page-editor-slug') as HTMLInputElement | null;
  const metaTitleInput = document.getElementById('page-editor-meta-title') as HTMLInputElement | null;
  const metaDescInput = document.getElementById('page-editor-meta-description') as HTMLTextAreaElement | null;
  const blocksContainer = document.getElementById('page-editor-blocks');
  const addBlockType = document.getElementById('page-editor-add-block-type') as HTMLSelectElement | null;
  const addBlockBtn = document.getElementById('page-editor-add-block-btn');
  const saveDraftBtn = document.getElementById('page-editor-save-draft-btn') as HTMLButtonElement | null;
  const publishBtn = document.getElementById('page-editor-publish-btn') as HTMLButtonElement | null;
  const unpublishBtn = document.getElementById('page-editor-unpublish-btn') as HTMLButtonElement | null;
  const liveLinkContainer = document.getElementById('page-live-link-container');
  const liveLink = document.getElementById('page-live-link') as HTMLAnchorElement | null;
  const coverPreview = document.getElementById('page-editor-cover-preview') as HTMLImageElement | null;
  const coverPlaceholder = document.getElementById('page-editor-cover-placeholder');
  const coverUploadInput = document.getElementById('page-editor-cover-upload') as HTMLInputElement | null;
  const coverUploadBtn = document.getElementById('page-editor-cover-upload-btn');
  const coverRemoveBtn = document.getElementById('page-editor-cover-remove-btn');
  const showHeaderInput = document.getElementById('page-editor-show-header') as HTMLInputElement | null;
  const showFooterInput = document.getElementById('page-editor-show-footer') as HTMLInputElement | null;

  if (
    !errorEl || !titleLabel || !statusBadge || !backBtn || !titleInput || !titleEnInput || !excerptInput ||
    !excerptEnInput || !slugInput || !metaTitleInput || !metaDescInput ||
    !blocksContainer || !addBlockType || !addBlockBtn || !saveDraftBtn || !publishBtn || !unpublishBtn ||
    !coverPreview || !coverPlaceholder || !coverUploadInput || !coverUploadBtn
  ) {
    return;
  }

  let blocks: CustomPageBlock[] = [];
  let coverImageUrl: string | null = null;
  let existing: CustomPageRecord | null = null;

  void ensureLanguageMode().then(() => {
    const root = document.getElementById('view-container') ?? document.body;
    applyLanguageVisibility(root);
  });

  wireRichTextEditors(blocksContainer);

  function renderBlocks(): void {
    blocksContainer!.innerHTML = blocks.map(renderBlock).join('') || '<p class="editor-empty-blocks">هنوز بلوکی اضافه نشده است. یک نوع بلوک را انتخاب و دکمه افزودن را بزنید.</p>';
    applyLanguageVisibility(blocksContainer!);
  }

  function readBlocksFromDom(): CustomPageBlock[] {
    const els = Array.from(blocksContainer!.querySelectorAll<HTMLElement>('[data-block-index]'));
    return els.map((el) => {
      const type = el.dataset.blockType as CustomPageBlock['type'];
      const field = (name: string) => el.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[data-field="${name}"]`)?.value ?? '';
      if (type === 'richtext') return { type, html: field('html'), htmlEn: field('htmlEn') };
      if (type === 'heading') return { type, text: field('text'), textEn: field('textEn') };
      if (type === 'paragraph') return { type, text: field('text'), textEn: field('textEn') };
      if (type === 'list') {
        return {
          type,
          items: field('items').split('\n').map((s) => s.trim()).filter(Boolean),
          itemsEn: field('itemsEn').split('\n').map((s) => s.trim()).filter(Boolean),
        };
      }
      if (type === 'image') return { type, url: field('url'), caption: field('caption'), captionEn: field('captionEn') };
      return { type: 'video', url: field('url') };
    });
  }

  function setCover(url: string | null): void {
    coverImageUrl = url;
    if (url) {
      coverPreview!.src = url;
      coverPreview!.hidden = false;
      coverPlaceholder!.hidden = true;
      if (coverRemoveBtn) coverRemoveBtn.hidden = false;
    } else {
      coverPreview!.hidden = true;
      coverPlaceholder!.hidden = false;
      if (coverRemoveBtn) coverRemoveBtn.hidden = true;
    }
  }

  function updateStatusUI(status: 'draft' | 'published' | null, slug?: string): void {
    if (!status) {
      statusBadge!.hidden = true;
      unpublishBtn!.hidden = true;
      if (liveLinkContainer) liveLinkContainer.hidden = true;
      return;
    }
    statusBadge!.hidden = false;
    statusBadge!.textContent = status === 'published' ? 'منتشرشده' : 'پیش‌نویس';
    statusBadge!.className = `article-status-badge article-status-${status}`;
    unpublishBtn!.hidden = status !== 'published';

    if (liveLinkContainer && liveLink) {
      const pageSlug = slug || slugInput!.value.trim();
      if (pageSlug) {
        liveLinkContainer.hidden = false;
        const fullUrl = `https://behbarapp.ir/p/${encodeURIComponent(pageSlug)}`;
        liveLink.href = fullUrl;
        liveLink.textContent = `/p/${pageSlug}`;
      } else {
        liveLinkContainer.hidden = true;
      }
    }
  }

  async function loadExisting(): Promise<void> {
    if (pageId === null) {
      titleLabel!.textContent = 'برگه جدید';
      blocks = [emptyBlock('richtext')];
      renderBlocks();
      updateStatusUI(null);
      if (showHeaderInput) showHeaderInput.checked = false;
      if (showFooterInput) showFooterInput.checked = false;
      return;
    }
    try {
      const found = await fetchAdminPage(pageId);
      if (!found) {
        errorEl!.hidden = false;
        errorEl!.textContent = 'برگه پیدا نشد.';
        return;
      }
      existing = found;
      titleLabel!.textContent = found.title || 'ویرایش برگه';
      titleInput!.value = found.title;
      titleEnInput!.value = found.titleEn || '';
      excerptInput!.value = found.excerpt || '';
      excerptEnInput!.value = found.excerptEn || '';
      slugInput!.value = found.slug;
      metaTitleInput!.value = found.metaTitle ?? '';
      metaDescInput!.value = found.metaDescription ?? '';
      if (showHeaderInput) showHeaderInput.checked = Boolean(found.showInHeader);
      if (showFooterInput) showFooterInput.checked = Boolean(found.showInFooter);
      setCover(found.coverImageUrl);
      blocks = found.content && found.content.length ? found.content : [emptyBlock('richtext')];
      renderBlocks();
      updateStatusUI(found.status, found.slug);
    } catch (err) {
      errorEl!.hidden = false;
      errorEl!.textContent = err instanceof Error ? err.message : 'خطایی در بارگذاری برگه پیش آمد.';
    }
  }

  function buildPayload() {
    return {
      title: titleInput!.value.trim(),
      titleEn: titleEnInput!.value.trim(),
      excerpt: excerptInput!.value.trim(),
      excerptEn: excerptEnInput!.value.trim(),
      coverImageUrl,
      content: readBlocksFromDom(),
      metaTitle: metaTitleInput!.value.trim() || undefined,
      metaDescription: metaDescInput!.value.trim() || undefined,
      slug: slugInput!.value.trim() || undefined,
      showInHeader: showHeaderInput?.checked ?? false,
      showInFooter: showFooterInput?.checked ?? false,
    };
  }

  async function save(): Promise<CustomPageRecord | null> {
    errorEl!.hidden = true;
    if (!titleInput!.value.trim()) {
      errorEl!.hidden = false;
      errorEl!.textContent = 'عنوان برگه الزامی است.';
      return null;
    }
    const payload = buildPayload();
    try {
      const saved = existing ? await updateCustomPage(existing.id, payload) : await createCustomPage(payload);
      existing = saved;
      pageId = saved.id;
      slugInput!.value = saved.slug;
      titleLabel!.textContent = saved.title;
      updateStatusUI(saved.status, saved.slug);
      return saved;
    } catch (err) {
      errorEl!.hidden = false;
      errorEl!.textContent = err instanceof Error ? err.message : 'ذخیره برگه ناموفق بود.';
      return null;
    }
  }

  blocksContainer.addEventListener('click', (event) => {
    const btn = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-block-action]');
    if (!btn) return;
    blocks = readBlocksFromDom();
    const index = Number(btn.dataset.index);
    const action = btn.dataset.blockAction;
    if (action === 'remove') {
      blocks.splice(index, 1);
    } else if (action === 'up' && index > 0) {
      [blocks[index - 1], blocks[index]] = [blocks[index], blocks[index - 1]];
    } else if (action === 'down' && index < blocks.length - 1) {
      [blocks[index + 1], blocks[index]] = [blocks[index], blocks[index + 1]];
    }
    renderBlocks();
  });

  blocksContainer.addEventListener('click', (event) => {
    const btn = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-image-upload-btn]');
    if (!btn) return;
    const wrapper = btn.closest('.block-editor');
    wrapper?.querySelector<HTMLInputElement>('[data-image-upload]')?.click();
  });

  blocksContainer.addEventListener('change', async (event) => {
    const input = event.target as HTMLInputElement;
    if (!input.matches('[data-image-upload]')) return;
    const file = input.files?.[0];
    if (!file) return;
    const wrapper = input.closest('.block-editor') as HTMLElement | null;
    if (!wrapper) return;
    try {
      const url = await uploadImage(file);
      const urlField = wrapper.querySelector<HTMLInputElement>('[data-field="url"]');
      if (urlField) urlField.value = url;
      const preview = wrapper.querySelector<HTMLImageElement>('.block-image-preview');
      const placeholder = wrapper.querySelector<HTMLElement>('.block-image-placeholder');
      if (preview) {
        preview.src = url;
        preview.hidden = false;
      } else {
        wrapper.querySelector('.block-image-upload')?.insertAdjacentHTML('afterbegin', `<img src="${url}" alt="" class="block-image-preview" />`);
      }
      if (placeholder) placeholder.hidden = true;
    } catch (err) {
      errorEl!.hidden = false;
      errorEl!.textContent = err instanceof Error ? err.message : 'آپلود تصویر ناموفق بود.';
    }
  });

  addBlockBtn.addEventListener('click', () => {
    blocks = readBlocksFromDom();
    blocks.push(emptyBlock(addBlockType!.value as CustomPageBlock['type']));
    renderBlocks();
  });

  coverUploadBtn.addEventListener('click', () => coverUploadInput!.click());
  if (coverRemoveBtn) {
    coverRemoveBtn.addEventListener('click', () => setCover(null));
  }

  coverUploadInput.addEventListener('change', async () => {
    const file = coverUploadInput!.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setCover(url);
    } catch (err) {
      errorEl!.hidden = false;
      errorEl!.textContent = err instanceof Error ? err.message : 'آپلود تصویر شاخص ناموفق بود.';
    }
  });

  saveDraftBtn.addEventListener('click', async () => {
    saveDraftBtn.disabled = true;
    saveDraftBtn.textContent = 'در حال ذخیره...';
    await save();
    saveDraftBtn.disabled = false;
    saveDraftBtn.textContent = 'ذخیره پیش‌نویس';
  });

  publishBtn.addEventListener('click', async () => {
    publishBtn.disabled = true;
    const saved = await save();
    if (saved) {
      try {
        const published = await setCustomPageStatus(saved.id, true);
        updateStatusUI(published.status, published.slug);
      } catch (err) {
        errorEl!.hidden = false;
        errorEl!.textContent = err instanceof Error ? err.message : 'انتشار برگه ناموفق بود.';
      }
    }
    publishBtn.disabled = false;
  });

  unpublishBtn.addEventListener('click', async () => {
    if (!existing) return;
    unpublishBtn.disabled = true;
    try {
      const updated = await setCustomPageStatus(existing.id, false);
      updateStatusUI(updated.status, updated.slug);
    } catch (err) {
      errorEl!.hidden = false;
      errorEl!.textContent = err instanceof Error ? err.message : 'تغییر به پیش‌نویس ناموفق بود.';
    }
    unpublishBtn.disabled = false;
  });

  backBtn.addEventListener('click', onBack);

  void loadExisting();
}

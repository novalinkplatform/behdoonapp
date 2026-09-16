import { icons } from '../components/icons.ts';
import {
  fetchAdminArticles,
  createArticle,
  updateArticle,
  setArticleStatus,
  uploadImage,
} from '../utils/api.ts';
import type { ArticleBlock, ArticleRecord } from '../utils/api.ts';
import { ensureLanguageMode, applyLanguageVisibility } from '../utils/languageMode.ts';
import { renderRichTextEditor, wireRichTextEditors } from '../components/RichTextEditor.ts';

const BLOCK_LABELS: Record<ArticleBlock['type'], string> = {
  richtext: 'متن',
  heading: 'سرتیتر',
  paragraph: 'پاراگراف',
  list: 'لیست',
  image: 'تصویر',
  video: 'ویدئو',
};

function emptyBlock(type: ArticleBlock['type']): ArticleBlock {
  if (type === 'richtext') return { type: 'richtext', html: '', htmlEn: '' };
  if (type === 'heading') return { type: 'heading', text: '', textEn: '' };
  if (type === 'paragraph') return { type: 'paragraph', text: '', textEn: '' };
  if (type === 'list') return { type: 'list', items: [], itemsEn: [] };
  if (type === 'image') return { type: 'image', url: '', caption: '', captionEn: '' };
  return { type: 'video', url: '' };
}

function renderBlock(block: ArticleBlock, index: number): string {
  const header = `
    <div class="block-editor-head">
      <span class="block-editor-type">${BLOCK_LABELS[block.type]}</span>
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
      <input type="url" data-field="url" dir="ltr" placeholder="https://www.youtube.com/watch?v=..." value="${escapeAttr(block.url)}" />
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

export function renderArticleEditorView(): string {
  return `
    <div class="view-header">
      <h1 id="editor-title-label">مقاله جدید</h1>
      <div class="editor-header-actions">
        <span class="article-status-badge" id="editor-status-badge" hidden></span>
        <button type="button" class="btn btn-secondary" id="editor-back-btn">بازگشت به لیست</button>
      </div>
    </div>
    <p class="error-text" id="editor-error" hidden></p>

    <div class="editor-grid">
      <div class="editor-main">
        <div class="form-field" data-i18n="fa">
          <label for="editor-title">عنوان (فارسی)</label>
          <input type="text" id="editor-title" />
        </div>
        <div class="form-field" data-i18n="en">
          <label for="editor-title-en">عنوان (انگلیسی)</label>
          <input type="text" id="editor-title-en" dir="ltr" />
        </div>
        <div class="form-field" data-i18n="fa">
          <label for="editor-excerpt">خلاصه (فارسی)</label>
          <textarea id="editor-excerpt" rows="2"></textarea>
        </div>
        <div class="form-field" data-i18n="en">
          <label for="editor-excerpt-en">خلاصه (انگلیسی)</label>
          <textarea id="editor-excerpt-en" dir="ltr" rows="2"></textarea>
        </div>

        <h2 class="editor-section-title">محتوا</h2>
        <div id="editor-blocks"></div>
        <div class="block-add-row">
          <select id="editor-add-block-type">
            <option value="richtext">متن</option>
            <option value="image">تصویر</option>
            <option value="video">ویدئو</option>
          </select>
          <button type="button" class="btn btn-secondary" id="editor-add-block-btn">
            <span class="icon">${icons.plusCircle}</span>
            افزودن بلوک
          </button>
        </div>
      </div>

      <aside class="editor-sidebar">
        <div class="editor-sidebar-card">
          <h3>انتشار</h3>
          <button type="button" class="btn btn-secondary btn-block" id="editor-save-draft-btn">ذخیره پیش‌نویس</button>
          <button type="button" class="btn btn-primary btn-block" id="editor-publish-btn">انتشار</button>
          <button type="button" class="btn btn-ghost btn-block" id="editor-unpublish-btn" hidden>بازگرداندن به پیش‌نویس</button>
        </div>

        <div class="editor-sidebar-card">
          <h3>دسته‌بندی</h3>
          <div class="form-field" data-i18n="fa">
            <label for="editor-category">دسته (فارسی)</label>
            <input type="text" id="editor-category" />
          </div>
          <div class="form-field" data-i18n="en">
            <label for="editor-category-en">دسته (انگلیسی)</label>
            <input type="text" id="editor-category-en" dir="ltr" />
          </div>
        </div>

        <div class="editor-sidebar-card">
          <h3>تصویر کاور</h3>
          <div class="block-image-upload">
            <img id="editor-cover-preview" alt="" class="block-image-preview" hidden />
            <span id="editor-cover-placeholder" class="block-image-placeholder">تصویری انتخاب نشده</span>
            <input type="file" accept="image/*" id="editor-cover-upload" hidden />
            <button type="button" class="btn btn-secondary btn-sm" id="editor-cover-upload-btn">انتخاب تصویر</button>
          </div>
        </div>

        <div class="editor-sidebar-card">
          <h3>سئو</h3>
          <div class="form-field">
            <label for="editor-slug">نامک (Slug)</label>
            <input type="text" id="editor-slug" dir="ltr" placeholder="auto" />
          </div>
          <div class="form-field">
            <label for="editor-meta-title">عنوان متا</label>
            <input type="text" id="editor-meta-title" />
          </div>
          <div class="form-field">
            <label for="editor-meta-description">توضیحات متا</label>
            <textarea id="editor-meta-description" rows="3"></textarea>
          </div>
        </div>
      </aside>
    </div>
  `;
}

export function initArticleEditorView(articleId: number | null, onBack: () => void): void {
  const errorEl = document.getElementById('editor-error');
  const titleLabel = document.getElementById('editor-title-label');
  const statusBadge = document.getElementById('editor-status-badge');
  const backBtn = document.getElementById('editor-back-btn');
  const titleInput = document.getElementById('editor-title') as HTMLInputElement | null;
  const titleEnInput = document.getElementById('editor-title-en') as HTMLInputElement | null;
  const excerptInput = document.getElementById('editor-excerpt') as HTMLTextAreaElement | null;
  const excerptEnInput = document.getElementById('editor-excerpt-en') as HTMLTextAreaElement | null;
  const categoryInput = document.getElementById('editor-category') as HTMLInputElement | null;
  const categoryEnInput = document.getElementById('editor-category-en') as HTMLInputElement | null;
  const slugInput = document.getElementById('editor-slug') as HTMLInputElement | null;
  const metaTitleInput = document.getElementById('editor-meta-title') as HTMLInputElement | null;
  const metaDescInput = document.getElementById('editor-meta-description') as HTMLTextAreaElement | null;
  const blocksContainer = document.getElementById('editor-blocks');
  const addBlockType = document.getElementById('editor-add-block-type') as HTMLSelectElement | null;
  const addBlockBtn = document.getElementById('editor-add-block-btn');
  const saveDraftBtn = document.getElementById('editor-save-draft-btn') as HTMLButtonElement | null;
  const publishBtn = document.getElementById('editor-publish-btn') as HTMLButtonElement | null;
  const unpublishBtn = document.getElementById('editor-unpublish-btn') as HTMLButtonElement | null;
  const coverPreview = document.getElementById('editor-cover-preview') as HTMLImageElement | null;
  const coverPlaceholder = document.getElementById('editor-cover-placeholder');
  const coverUploadInput = document.getElementById('editor-cover-upload') as HTMLInputElement | null;
  const coverUploadBtn = document.getElementById('editor-cover-upload-btn');

  if (
    !errorEl || !titleLabel || !statusBadge || !backBtn || !titleInput || !titleEnInput || !excerptInput ||
    !excerptEnInput || !categoryInput || !categoryEnInput || !slugInput || !metaTitleInput || !metaDescInput ||
    !blocksContainer || !addBlockType || !addBlockBtn || !saveDraftBtn || !publishBtn || !unpublishBtn ||
    !coverPreview || !coverPlaceholder || !coverUploadInput || !coverUploadBtn
  ) {
    return;
  }

  let blocks: ArticleBlock[] = [];
  let coverImageUrl: string | null = null;
  let existing: ArticleRecord | null = null;

  void ensureLanguageMode().then(() => {
    const root = document.getElementById('view-container') ?? document.body;
    applyLanguageVisibility(root);
  });

  wireRichTextEditors(blocksContainer);

  function renderBlocks(): void {
    blocksContainer!.innerHTML = blocks.map(renderBlock).join('') || '<p class="editor-empty-blocks">هنوز بلوکی اضافه نشده است.</p>';
    applyLanguageVisibility(blocksContainer!);
  }

  function readBlocksFromDom(): ArticleBlock[] {
    const els = Array.from(blocksContainer!.querySelectorAll<HTMLElement>('[data-block-index]'));
    return els.map((el) => {
      const type = el.dataset.blockType as ArticleBlock['type'];
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
    } else {
      coverPreview!.hidden = true;
      coverPlaceholder!.hidden = false;
    }
  }

  function updateStatusUI(status: 'draft' | 'published' | null): void {
    if (!status) {
      statusBadge!.hidden = true;
      unpublishBtn!.hidden = true;
      return;
    }
    statusBadge!.hidden = false;
    statusBadge!.textContent = status === 'published' ? 'منتشرشده' : 'پیش‌نویس';
    statusBadge!.className = `article-status-badge article-status-${status}`;
    unpublishBtn!.hidden = status !== 'published';
  }

  async function loadExisting(): Promise<void> {
    if (articleId === null) {
      titleLabel!.textContent = 'مقاله جدید';
      blocks = [emptyBlock('richtext')];
      renderBlocks();
      updateStatusUI(null);
      return;
    }
    try {
      const all = await fetchAdminArticles();
      const found = all.find((a) => a.id === articleId);
      if (!found) {
        errorEl!.hidden = false;
        errorEl!.textContent = 'مقاله پیدا نشد.';
        return;
      }
      existing = found;
      titleLabel!.textContent = found.title || 'ویرایش مقاله';
      titleInput!.value = found.title;
      titleEnInput!.value = found.titleEn;
      excerptInput!.value = found.excerpt;
      excerptEnInput!.value = found.excerptEn;
      categoryInput!.value = found.category;
      categoryEnInput!.value = found.categoryEn;
      slugInput!.value = found.slug;
      metaTitleInput!.value = found.metaTitle ?? '';
      metaDescInput!.value = found.metaDescription ?? '';
      setCover(found.coverImageUrl);
      blocks = found.content.length ? found.content : [emptyBlock('richtext')];
      renderBlocks();
      updateStatusUI(found.status);
    } catch (err) {
      errorEl!.hidden = false;
      errorEl!.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
    }
  }

  function buildPayload() {
    return {
      title: titleInput!.value.trim(),
      titleEn: titleEnInput!.value.trim(),
      excerpt: excerptInput!.value.trim(),
      excerptEn: excerptEnInput!.value.trim(),
      category: categoryInput!.value.trim(),
      categoryEn: categoryEnInput!.value.trim(),
      coverImageUrl,
      content: readBlocksFromDom(),
      metaTitle: metaTitleInput!.value.trim(),
      metaDescription: metaDescInput!.value.trim(),
      slug: slugInput!.value.trim() || undefined,
    };
  }

  async function save(): Promise<ArticleRecord | null> {
    errorEl!.hidden = true;
    if (!titleInput!.value.trim()) {
      errorEl!.hidden = false;
      errorEl!.textContent = 'عنوان مقاله الزامی است.';
      return null;
    }
    const payload = buildPayload();
    try {
      const saved = existing ? await updateArticle(existing.id, payload) : await createArticle(payload);
      existing = saved;
      articleId = saved.id;
      slugInput!.value = saved.slug;
      titleLabel!.textContent = saved.title;
      updateStatusUI(saved.status);
      return saved;
    } catch (err) {
      errorEl!.hidden = false;
      errorEl!.textContent = err instanceof Error ? err.message : 'ذخیره ناموفق بود.';
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
      errorEl!.textContent = err instanceof Error ? err.message : 'آپلود ناموفق بود.';
    }
  });

  addBlockBtn.addEventListener('click', () => {
    blocks = readBlocksFromDom();
    blocks.push(emptyBlock(addBlockType!.value as ArticleBlock['type']));
    renderBlocks();
  });

  coverUploadBtn.addEventListener('click', () => coverUploadInput!.click());
  coverUploadInput.addEventListener('change', async () => {
    const file = coverUploadInput!.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setCover(url);
    } catch (err) {
      errorEl!.hidden = false;
      errorEl!.textContent = err instanceof Error ? err.message : 'آپلود ناموفق بود.';
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
        const published = await setArticleStatus(saved.id, true);
        updateStatusUI(published.status);
      } catch (err) {
        errorEl!.hidden = false;
        errorEl!.textContent = err instanceof Error ? err.message : 'انتشار ناموفق بود.';
      }
    }
    publishBtn.disabled = false;
  });

  unpublishBtn.addEventListener('click', async () => {
    if (!existing) return;
    unpublishBtn.disabled = true;
    try {
      const updated = await setArticleStatus(existing.id, false);
      updateStatusUI(updated.status);
    } catch (err) {
      errorEl!.hidden = false;
      errorEl!.textContent = err instanceof Error ? err.message : 'به‌روزرسانی ناموفق بود.';
    }
    unpublishBtn.disabled = false;
  });

  backBtn.addEventListener('click', onBack);

  void loadExisting();
}

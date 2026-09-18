import { icons } from '../components/icons.ts';
import {
  fetchSliderConfig,
  updateSliderConfig,
  type SliderConfig,
  type SlideItem,
  DEFAULT_SLIDER_CONFIG,
  uploadImage,
} from '../utils/api.ts';
import { ensureLanguageMode, applyLanguageVisibility } from '../utils/languageMode.ts';

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function renderSlidersManagerView(_isEmbeddedInSettings = false): string {
  return `
    <div class="view-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
      <div>
        <h1 style="font-size: 1.4rem; font-weight: 800; margin: 0 0 0.35rem 0;">مدیریت اسلایدر موبایل و وب‌سایت</h1>
        <p style="color: var(--muted, #64748b); margin: 0; font-size: 0.88rem;">
          مدیریت بنرهای اسلایدری تصویری متحرک در صفحه اصلی وب و اپلیکیشن موبایل بهدون (مستقل و علاوه بر استوری‌ها)
        </p>
      </div>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button type="button" class="btn btn-secondary btn-sm" id="slider-reset-btn" title="بازنشانی به بنرهای پیش‌فرض بهدون">
          <span class="icon">${icons.refresh}</span>
          بازنشانی پیش‌فرض‌ها
        </button>
        <button type="button" class="btn btn-primary btn-sm" id="slider-new-btn">
          <span class="icon">${icons.plusCircle}</span>
          افزودن اسلاید جدید
        </button>
      </div>
    </div>

    <p class="error-text" id="sliders-error" hidden></p>
    <p class="settings-saved-note" id="sliders-success" hidden>تغییرات اسلایدر با موفقیت ذخیره شد.</p>

    <!-- Global Slider Settings Card -->
    <div class="editor-sidebar-card" style="margin-bottom: 1.5rem; border: 1px solid var(--border, #e2e8f0); border-radius: 14px; padding: 1.25rem; background: var(--surface, #ffffff);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--border, #f1f5f9); padding-bottom: 0.75rem;">
        <h3 style="margin: 0; font-size: 1.05rem; font-weight: 800;">تنظیمات عمومی اسلایدر</h3>
        <button type="button" class="btn btn-primary btn-sm" id="slider-global-save-btn">ذخیره تنظیمات</button>
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center;">
        <label style="display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer; font-weight: 700; font-size: 0.9rem;">
          <input type="checkbox" id="slider-enabled" style="width: 18px; height: 18px; accent-color: var(--primary, #7c3aed);" />
          <span>فعال بودن اسلایدر در سایت و موبایل</span>
        </label>

        <label style="display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.88rem;">
          <input type="checkbox" id="slider-autoplay" style="width: 18px; height: 18px; accent-color: var(--primary, #7c3aed);" />
          <span>چرخش خودکار اسلایدها (Autoplay)</span>
        </label>

        <div class="form-field" style="display: inline-flex; align-items: center; gap: 0.5rem; margin: 0;">
          <label for="slider-interval" style="font-size: 0.85rem; margin: 0;">زمان مکث بین اسلایدها:</label>
          <select id="slider-interval" style="padding: 0.35rem 0.6rem; border-radius: 8px; font-size: 0.85rem;">
            <option value="3000">۳ ثانیه</option>
            <option value="5000" selected>۵ ثانیه (استاندارد)</option>
            <option value="7000">۷ ثانیه</option>
            <option value="10000">۱۰ ثانیه</option>
          </select>
        </div>

        <label style="display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.88rem;">
          <input type="checkbox" id="slider-indicators" style="width: 18px; height: 18px; accent-color: var(--primary, #7c3aed);" />
          <span>نمایش نشانگرهای نقطه‌ای (Dots)</span>
        </label>
      </div>
    </div>

    <!-- Add/Edit Slide Modal / Drawer -->
    <div class="editor-sidebar-card" id="slide-form-card" hidden style="margin-bottom: 1.5rem; border: 1.5px solid var(--primary, #7c3aed); border-radius: 16px; padding: 1.5rem; background: var(--surface, #ffffff); box-shadow: 0 10px 25px rgba(0,0,0,0.06);">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border, #e2e8f0); padding-bottom: 0.75rem; margin-bottom: 1.25rem;">
        <h3 id="slide-form-title" style="margin: 0; font-size: 1.15rem; font-weight: 800; color: var(--primary, #7c3aed);">اسلاید جدید</h3>
        <button type="button" class="btn btn-ghost btn-sm" id="slide-form-close" style="font-size: 1.2rem;">✕</button>
      </div>

      <input type="hidden" id="slide-edit-id" />

      <div class="settings-form-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
        <div class="form-field" style="grid-column: 1 / -1;">
          <label for="slide-image-url"><strong>آدرس تصویر اسلاید *</strong></label>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <input type="text" id="slide-image-url" dir="ltr" placeholder="https://... یا /assets/..." style="flex: 1;" required />
            <button type="button" class="btn btn-secondary btn-sm" id="slide-upload-btn">
              <span class="icon">${icons.image}</span>
              آپلود تصویر
            </button>
            <input type="file" id="slide-file-input" accept="image/*" hidden />
          </div>
          <div id="slide-image-preview-wrap" style="margin-top: 0.75rem; max-width: 480px; height: 160px; border-radius: 12px; overflow: hidden; border: 1px solid var(--border, #e2e8f0); background: #f8fafc; display: flex; align-items: center; justify-content: center;">
            <img id="slide-image-preview" src="" alt="پیش‌نمایش تصویر" style="width: 100%; height: 100%; object-fit: cover; display: none;" />
            <span id="slide-preview-placeholder" style="color: var(--muted, #64748b); font-size: 0.8rem;">پیش‌نمایش تصویر اسلاید</span>
          </div>
        </div>

        <div class="form-field">
          <label for="slide-title-fa"><strong>عنوان اصلی اسلاید (فارسی) *</strong></label>
          <input type="text" id="slide-title-fa" placeholder="مثلاً: اعزام فوری تعمیرکار پکیج و کولر" required />
        </div>

        <div class="form-field">
          <label for="slide-title-en">عنوان اسلاید (انگلیسی)</label>
          <input type="text" id="slide-title-en" dir="ltr" placeholder="HVAC Specialist Dispatch" />
        </div>

        <div class="form-field">
          <label for="slide-subtitle-fa">توضیحات تکمیلی / زیرعنوان</label>
          <input type="text" id="slide-subtitle-fa" placeholder="حضور تکنسین در کمتر از ۴۵ دقیقه با ضمانت کتبی" />
        </div>

        <div class="form-field">
          <label for="slide-target"><strong>پلتفرم هدف نمایش *</strong></label>
          <select id="slide-target" style="padding: 0.5rem; border-radius: 8px;">
            <option value="both">موبایل و وب‌سایت (مشترک)</option>
            <option value="mobile">فقط اپلیکیشن موبایل</option>
            <option value="web">فقط وب‌سایت</option>
          </select>
        </div>

        <div class="form-field">
          <label for="slide-link-url">لینک یا اکشن مقصد</label>
          <input type="text" id="slide-link-url" dir="ltr" placeholder="/services/hvac یا #request یا tel:09333256885" />
        </div>

        <div class="form-field">
          <label for="slide-btn-text">متن دکمه روی اسلاید</label>
          <input type="text" id="slide-btn-text" placeholder="ثبت درخواست آنلاین" />
        </div>

        <div class="form-field">
          <label for="slide-sort">ترتیب نمایش</label>
          <input type="number" id="slide-sort" value="1" min="1" max="99" />
        </div>

        <div class="form-field" style="display: flex; align-items: center; margin-top: 1.5rem;">
          <label style="display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer; font-weight: 700;">
            <input type="checkbox" id="slide-active" checked style="width: 18px; height: 18px; accent-color: var(--primary, #7c3aed);" />
            <span>اسلاید فعال است و نمایش داده شود</span>
          </label>
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.75rem; border-top: 1px solid var(--border, #e2e8f0); padding-top: 1rem;">
        <button type="button" class="btn btn-secondary" id="slide-form-cancel">انصراف</button>
        <button type="button" class="btn btn-primary" id="slide-form-save">ذخیره اسلاید</button>
      </div>
    </div>

    <!-- Slides List Grid -->
    <div id="slides-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.25rem;">
      <p style="color: var(--muted, #64748b);">در حال بارگذاری اسلایدها...</p>
    </div>
  `;
}

export function initSlidersManagerView(): void {
  void ensureLanguageMode().then(() => applyLanguageVisibility(document.getElementById('view-container') ?? document.body));

  const errorEl = document.getElementById('sliders-error');
  const successEl = document.getElementById('sliders-success');
  const cardsGrid = document.getElementById('slides-cards-grid');
  const newBtn = document.getElementById('slider-new-btn');
  const resetBtn = document.getElementById('slider-reset-btn');
  const globalSaveBtn = document.getElementById('slider-global-save-btn');

  // Form Elements
  const formCard = document.getElementById('slide-form-card');
  const formTitle = document.getElementById('slide-form-title');
  const formClose = document.getElementById('slide-form-close');
  const formCancel = document.getElementById('slide-form-cancel');
  const formSave = document.getElementById('slide-form-save') as HTMLButtonElement | null;
  const imageInput = document.getElementById('slide-image-url') as HTMLInputElement | null;
  const imagePreview = document.getElementById('slide-image-preview') as HTMLImageElement | null;
  const previewPlaceholder = document.getElementById('slide-preview-placeholder');
  const uploadBtn = document.getElementById('slide-upload-btn') as HTMLButtonElement | null;
  const fileInput = document.getElementById('slide-file-input') as HTMLInputElement | null;

  if (!cardsGrid || !newBtn || !formCard || !formSave) return;

  let currentConfig: SliderConfig = { ...DEFAULT_SLIDER_CONFIG };

  function showMessage(msg: string, isError = false): void {
    if (isError) {
      if (errorEl) {
        errorEl.textContent = msg;
        errorEl.hidden = false;
      }
    } else {
      if (successEl) {
        successEl.textContent = msg;
        successEl.hidden = false;
        setTimeout(() => {
          if (successEl) successEl.hidden = true;
        }, 4000);
      }
    }
  }

  function clearMessages(): void {
    if (errorEl) errorEl.hidden = true;
    if (successEl) successEl.hidden = true;
  }

  function updateImagePreview(url: string): void {
    if (!imagePreview || !previewPlaceholder) return;
    if (url.trim()) {
      imagePreview.src = url.trim();
      imagePreview.style.display = 'block';
      previewPlaceholder.style.display = 'none';
      imagePreview.onerror = () => {
        imagePreview.style.display = 'none';
        previewPlaceholder.style.display = 'block';
        previewPlaceholder.textContent = 'خطا در بارگذاری تصویر';
      };
    } else {
      imagePreview.style.display = 'none';
      previewPlaceholder.style.display = 'block';
      previewPlaceholder.textContent = 'پیش‌نمایش تصویر اسلاید';
    }
  }

  imageInput?.addEventListener('input', () => updateImagePreview(imageInput.value));

  uploadBtn?.addEventListener('click', () => fileInput?.click());
  fileInput?.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file || !imageInput || !uploadBtn) return;
    try {
      uploadBtn.disabled = true;
      uploadBtn.textContent = 'در حال آپلود...';
      const uploadedUrl = await uploadImage(file);
      imageInput.value = uploadedUrl;
      updateImagePreview(uploadedUrl);
      showMessage('تصویر با موفقیت آپلود شد.');
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'آپلود ناموفق بود.', true);
    } finally {
      uploadBtn.disabled = false;
      uploadBtn.innerHTML = `<span class="icon">${icons.image}</span> آپلود تصویر`;
    }
  });

  async function load(): Promise<void> {
    clearMessages();
    try {
      currentConfig = await fetchSliderConfig();
      syncGlobalSettingsUI();
      renderSlidesList();
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'خطا در بارگذاری اسلایدر.', true);
    }
  }

  function syncGlobalSettingsUI(): void {
    (document.getElementById('slider-enabled') as HTMLInputElement).checked = currentConfig.enabled !== false;
    (document.getElementById('slider-autoplay') as HTMLInputElement).checked = currentConfig.autoplay !== false;
    (document.getElementById('slider-interval') as HTMLSelectElement).value = String(currentConfig.intervalMs || 5000);
    (document.getElementById('slider-indicators') as HTMLInputElement).checked = currentConfig.showIndicators !== false;
  }

  function renderSlidesList(): void {
    if (!cardsGrid) return;
    const slides = currentConfig.slides || [];

    if (slides.length === 0) {
      cardsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--surface, #f8fafc); border-radius: 16px; border: 1px dashed var(--border, #cbd5e1);">
          <p style="color: var(--muted, #64748b); margin-bottom: 1rem;">هیچ اسلایدی تعریف نشده است.</p>
          <button type="button" class="btn btn-primary" id="empty-slider-reset-btn">بارگذاری بنرهای پیش‌فرض بهدون</button>
        </div>
      `;
      document.getElementById('empty-slider-reset-btn')?.addEventListener('click', async () => {
        currentConfig = { ...DEFAULT_SLIDER_CONFIG };
        await updateSliderConfig(currentConfig);
        renderSlidesList();
      });
      return;
    }

    cardsGrid.innerHTML = slides
      .map((slide, idx) => {
        const targetBadge =
          slide.target === 'both'
            ? `<span style="background: rgba(124, 58, 237, 0.12); color: var(--primary, #7c3aed); padding: 2px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 700;">موبایل و وب</span>`
            : slide.target === 'mobile'
            ? `<span style="background: rgba(2, 132, 199, 0.12); color: #0284c7; padding: 2px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 700;">فقط موبایل</span>`
            : `<span style="background: rgba(16, 185, 129, 0.12); color: #059669; padding: 2px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 700;">فقط وب‌سایت</span>`;

        const activeBadge = slide.isActive
          ? `<span style="background: rgba(16, 185, 129, 0.15); color: #059669; padding: 2px 6px; border-radius: 6px; font-size: 0.72rem; font-weight: 700;">فعال</span>`
          : `<span style="background: rgba(239, 68, 68, 0.12); color: #ef4444; padding: 2px 6px; border-radius: 6px; font-size: 0.72rem;">غیرفعال</span>`;

        return `
          <div class="slide-card" style="background: var(--surface, #ffffff); border: 1px solid var(--border, #e2e8f0); border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
            <div>
              <div style="height: 150px; background: #0f172a; position: relative; overflow: hidden;">
                <img src="${escapeHtml(slide.imageUrl)}" alt="${escapeHtml(slide.title)}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.85;" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100%\\' height=\\'100%\\'><rect fill=\\'%23334155\\' width=\\'100%\\' height=\\'100%\\'/><text fill=\\'%2394a3b8\\' x=\\'50%\\' y=\\'50%\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\'>تصویر یافت نشد</text></svg>'">
                <div style="position: absolute; top: 10px; right: 10px; display: flex; gap: 6px;">
                  ${targetBadge}
                  ${activeBadge}
                </div>
                <div style="position: absolute; bottom: 8px; left: 10px; background: rgba(0,0,0,0.65); color: #ffffff; padding: 2px 8px; border-radius: 6px; font-size: 0.72rem;">
                  ترتیب: ${slide.sortOrder || idx + 1}
                </div>
              </div>

              <div style="padding: 1.25rem 1.25rem 0.75rem 1.25rem;">
                <h3 style="margin: 0 0 0.35rem 0; font-size: 1rem; font-weight: 800; color: var(--text, #1e293b);">${escapeHtml(slide.title)}</h3>
                <p style="margin: 0 0 0.5rem 0; font-size: 0.82rem; color: var(--muted, #64748b); line-height: 1.6;">${escapeHtml(slide.subtitle || '-')}</p>
                <div style="font-size: 0.78rem; color: #0284c7; font-family: monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  ${escapeHtml(slide.linkUrl || '#')}
                </div>
              </div>
            </div>

            <div style="display: flex; gap: 0.5rem; padding: 0.75rem 1.25rem 1.25rem 1.25rem; border-top: 1px solid var(--border, #f1f5f9);">
              <button type="button" class="btn btn-secondary btn-sm" data-edit-slide="${slide.id}" style="flex: 1;">ویرایش</button>
              <button type="button" class="btn btn-ghost btn-sm" data-toggle-slide="${slide.id}" title="${slide.isActive ? 'غیرفعال کردن' : 'فعال کردن'}">
                ${slide.isActive ? 'غیرفعال' : 'فعال'}
              </button>
              <button type="button" class="btn btn-ghost btn-sm" data-delete-slide="${slide.id}" style="color: #ef4444;" title="حذف اسلاید">
                <span class="icon">${icons.trash}</span>
              </button>
            </div>
          </div>
        `;
      })
      .join('');

    wireSlideActions();
  }

  function wireSlideActions(): void {
    if (!cardsGrid) return;

    cardsGrid.querySelectorAll<HTMLButtonElement>('[data-edit-slide]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.editSlide;
        const slide = currentConfig.slides.find((s) => s.id === id);
        if (slide) openSlideForm(slide);
      });
    });

    cardsGrid.querySelectorAll<HTMLButtonElement>('[data-toggle-slide]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.toggleSlide;
        const slide = currentConfig.slides.find((s) => s.id === id);
        if (slide) {
          slide.isActive = !slide.isActive;
          await updateSliderConfig(currentConfig);
          renderSlidesList();
          showMessage(`وضعیت اسلاید تغییر کرد.`);
        }
      });
    });

    cardsGrid.querySelectorAll<HTMLButtonElement>('[data-delete-slide]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.deleteSlide;
        const slide = currentConfig.slides.find((s) => s.id === id);
        if (!slide) return;
        if (!window.confirm(`آیا اسلاید «${slide.title}» برای همیشه حذف شود؟`)) return;

        currentConfig.slides = currentConfig.slides.filter((s) => s.id !== id);
        try {
          await updateSliderConfig(currentConfig);
          renderSlidesList();
          showMessage('اسلاید حذف شد.');
        } catch (err) {
          showMessage(err instanceof Error ? err.message : 'حذف ناموفق بود.', true);
        }
      });
    });
  }

  function openSlideForm(slide: SlideItem | null): void {
    clearMessages();
    const isNew = !slide;
    (document.getElementById('slide-edit-id') as HTMLInputElement).value = slide ? slide.id : '';
    if (formTitle) formTitle.textContent = isNew ? 'اسلاید جدید' : `ویرایش اسلاید: ${slide!.title}`;

    if (imageInput) {
      imageInput.value = slide?.imageUrl || '';
      updateImagePreview(slide?.imageUrl || '');
    }

    (document.getElementById('slide-title-fa') as HTMLInputElement).value = slide?.title || '';
    (document.getElementById('slide-title-en') as HTMLInputElement).value = slide?.titleEn || '';
    (document.getElementById('slide-subtitle-fa') as HTMLInputElement).value = slide?.subtitle || '';
    (document.getElementById('slide-target') as HTMLSelectElement).value = slide?.target || 'both';
    (document.getElementById('slide-link-url') as HTMLInputElement).value = slide?.linkUrl || '/services/hvac';
    (document.getElementById('slide-btn-text') as HTMLInputElement).value = slide?.buttonText || 'ثبت درخواست آنلاین';
    (document.getElementById('slide-sort') as HTMLInputElement).value = String(slide?.sortOrder || currentConfig.slides.length + 1);
    (document.getElementById('slide-active') as HTMLInputElement).checked = slide ? slide.isActive : true;

    if (formCard) {
      formCard.hidden = false;
      formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function closeSlideForm(): void {
    if (formCard) formCard.hidden = true;
  }

  formSave.addEventListener('click', async () => {
    clearMessages();
    const editId = (document.getElementById('slide-edit-id') as HTMLInputElement).value;
    const imageUrl = (document.getElementById('slide-image-url') as HTMLInputElement).value.trim();
    const titleFa = (document.getElementById('slide-title-fa') as HTMLInputElement).value.trim();
    const titleEn = (document.getElementById('slide-title-en') as HTMLInputElement).value.trim();
    const subtitleFa = (document.getElementById('slide-subtitle-fa') as HTMLInputElement).value.trim();
    const target = (document.getElementById('slide-target') as HTMLSelectElement).value as 'both' | 'mobile' | 'web';
    const linkUrl = (document.getElementById('slide-link-url') as HTMLInputElement).value.trim();
    const btnText = (document.getElementById('slide-btn-text') as HTMLInputElement).value.trim();
    const sort = parseInt((document.getElementById('slide-sort') as HTMLInputElement).value, 10) || 1;
    const isActive = (document.getElementById('slide-active') as HTMLInputElement).checked;

    if (!imageUrl) {
      showMessage('آدرس تصویر اسلاید الزامی است.', true);
      return;
    }
    if (!titleFa) {
      showMessage('عنوان اسلاید الزامی است.', true);
      return;
    }

    formSave.disabled = true;
    try {
      if (editId) {
        const slide = currentConfig.slides.find((s) => s.id === editId);
        if (slide) {
          slide.imageUrl = imageUrl;
          slide.title = titleFa;
          slide.titleEn = titleEn;
          slide.subtitle = subtitleFa;
          slide.target = target;
          slide.linkUrl = linkUrl;
          slide.buttonText = btnText;
          slide.sortOrder = sort;
          slide.isActive = isActive;
        }
      } else {
        const newSlide: SlideItem = {
          id: `slide-${Date.now()}`,
          imageUrl,
          title: titleFa,
          titleEn,
          subtitle: subtitleFa,
          target,
          linkUrl,
          buttonText: btnText,
          sortOrder: sort,
          isActive,
          createdAt: new Date().toISOString(),
        };
        currentConfig.slides.push(newSlide);
      }

      await updateSliderConfig(currentConfig);
      closeSlideForm();
      renderSlidesList();
      showMessage('اسلاید با موفقیت ذخیره شد.');
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'ذخیره ناموفق بود.', true);
    } finally {
      formSave.disabled = false;
    }
  });

  globalSaveBtn?.addEventListener('click', async () => {
    clearMessages();
    currentConfig.enabled = (document.getElementById('slider-enabled') as HTMLInputElement).checked;
    currentConfig.autoplay = (document.getElementById('slider-autoplay') as HTMLInputElement).checked;
    currentConfig.intervalMs = parseInt((document.getElementById('slider-interval') as HTMLSelectElement).value, 10) || 5000;
    currentConfig.showIndicators = (document.getElementById('slider-indicators') as HTMLInputElement).checked;

    try {
      await updateSliderConfig(currentConfig);
      showMessage('تنظیمات عمومی اسلایدر با موفقیت ذخیره شد.');
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'ذخیره ناموفق بود.', true);
    }
  });

  newBtn.addEventListener('click', () => openSlideForm(null));
  formClose?.addEventListener('click', closeSlideForm);
  formCancel?.addEventListener('click', closeSlideForm);

  resetBtn?.addEventListener('click', async () => {
    if (!window.confirm('آیا مایلید تمام اسلایدها بازنشانی شده و بنرهای رسمی بهدون بازیابی شوند؟')) return;
    currentConfig = { ...DEFAULT_SLIDER_CONFIG };
    try {
      await updateSliderConfig(currentConfig);
      syncGlobalSettingsUI();
      renderSlidesList();
      closeSlideForm();
      showMessage('اسلایدر با موفقیت به بنرهای پیش‌فرض بازنشانی شد.');
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'بازنشانی ناموفق بود.', true);
    }
  });

  void load();
}

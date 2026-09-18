import { icons } from '../components/icons.ts';
import {
  fetchManagedCategories,
  updateManagedCategories,
  type ManagedServiceCategory,
  type ManagedSubService,
} from '../utils/api.ts';
import { serviceCategories } from '../../data/services.ts';
import { ALL_SERVICES_CATALOG } from '../../data/allServicesData.ts';
import { ensureLanguageMode, applyLanguageVisibility } from '../utils/languageMode.ts';
import { formatToman } from '../../utils/format.ts';

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function getDefaultCategories(): ManagedServiceCategory[] {
  return serviceCategories.map((cat, index) => {
    const catalogItem = ALL_SERVICES_CATALOG[cat.id];
    const subServices: ManagedSubService[] = (catalogItem?.subServices || []).map((s) => ({
      id: s.id,
      title: s.name,
      titleEn: s.nameEn || '',
      basePrice: s.basePrice || 0,
      description: s.shortDesc || '',
      descriptionEn: s.shortDescEn || '',
      guaranteeDays: 30,
      estimatedTime: '۳۰ الی ۶۰ دقیقه',
    }));

    return {
      id: cat.id,
      label: cat.label,
      labelEn: cat.labelEn,
      icon: cat.icon || '',
      subtitle: cat.subtitle || '',
      subtitleEn: cat.subtitleEn || '',
      showInHeader: index < 4, // 4 primary categories shown in header by default
      headerOrder: index + 1,
      headerUrl: `/services/${cat.id}`,
      article: {
        title: catalogItem?.title ? `راهنمای تخصصی و جامع ${catalogItem.title}` : `راهنمای جامع ${cat.label}`,
        excerpt: catalogItem?.metaDesc || cat.subtitle || '',
        contentHtml: catalogItem?.comprehensiveGuide || `<p>تکنسین‌های مجرب و دارای تاییدیه صلاحیت بهدون، خدمات تخصصی <strong>${cat.label}</strong> را با ابزارهای کالیبره، نرخ مصوب اتحادیه و ضمانت ۳۰ روزه انجام می‌دهند.</p>`,
        metaTitle: `${cat.label} در تهران | خدمات فوری و تضمینی بهدون`,
        metaDescription: catalogItem?.metaDesc || `خدمات فوری و تخصصی ${cat.label} در تهران با ضمانت کتبی ۳۰ روزه و اعزام کمتر از ۴۵ دقیقه.`,
        readingTimeMinutes: 5,
      },
      subServices,
      isCustom: false,
    };
  });
}

export function renderServicesManagerView(): string {
  return `
    <div class="view-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
      <div>
        <h1 style="font-size: 1.5rem; font-weight: 800; margin: 0 0 0.4rem 0;">مدیریت خدمات و مقالات تخصصی</h1>
        <p style="color: var(--muted, #64748b); margin: 0; font-size: 0.9rem;">
          مدیریت دسته‌بندی‌ها، زیردسته‌ها، آیکون و لوگو، پیوند منوی هدر سایت و نگارش مقالات سئو برای هر دسته
        </p>
      </div>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button type="button" class="btn btn-secondary btn-sm" id="services-reset-btn" title="بازگردانی به ۸ دسته و ۵۳ خدمت رسمی بهدون">
          <span class="icon">${icons.refresh}</span>
          بازنشانی پیش‌فرض‌ها
        </button>
        <button type="button" class="btn btn-primary btn-sm" id="services-new-btn">
          <span class="icon">${icons.plusCircle}</span>
          افزودن دسته‌بندی جدید
        </button>
      </div>
    </div>

    <p class="error-text" id="services-mgr-error" hidden></p>
    <p class="settings-saved-note" id="services-mgr-success" hidden>تغییرات با موفقیت ذخیره شد.</p>

    <!-- Category Edit & Article Editor Drawer / Card -->
    <div class="editor-sidebar-card" id="category-edit-card" hidden style="margin-bottom: 2rem; border: 1.5px solid var(--primary, #7c3aed); border-radius: 16px; padding: 1.5rem; background: var(--surface, #ffffff); box-shadow: 0 10px 30px rgba(0,0,0,0.06);">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border, #e2e8f0); padding-bottom: 1rem; margin-bottom: 1.25rem;">
        <h3 id="category-modal-title" style="margin: 0; font-weight: 800; font-size: 1.2rem; color: var(--primary, #7c3aed);">ویرایش دسته‌بندی و مقاله</h3>
        <button type="button" class="btn btn-ghost btn-sm" id="category-modal-close" style="font-size: 1.2rem;">✕</button>
      </div>

      <form id="category-edit-form" onsubmit="return false;">
        <input type="hidden" id="category-edit-id" />
        <input type="hidden" id="category-edit-is-new" value="0" />

        <div class="settings-form-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
          <div class="form-field">
            <label for="cat-title-fa"><strong>نام دسته‌بندی (فارسی) *</strong></label>
            <input type="text" id="cat-title-fa" placeholder="مثلاً: هوشمندسازی ساختمان" required />
          </div>

          <div class="form-field">
            <label for="cat-title-en"><strong>نام دسته‌بندی (انگلیسی)</strong></label>
            <input type="text" id="cat-title-en" dir="ltr" placeholder="Smart Home" />
          </div>

          <div class="form-field">
            <label for="cat-slug"><strong>شناسه / اسلاگ آدرس (URL) *</strong></label>
            <input type="text" id="cat-slug" dir="ltr" placeholder="smart-home" required />
            <small style="color: var(--muted, #64748b); font-size: 0.75rem;">آدرس صفحه اختصاصی: /services/[شناسه]</small>
          </div>

          <div class="form-field">
            <label for="cat-subtitle-fa">توضیحات کوتاه زیر عنوان</label>
            <input type="text" id="cat-subtitle-fa" placeholder="نصب و راه‌اندازی تجهیزات هوشمند، روشنایی و سنسورها" />
          </div>
        </div>

        <!-- Header Navigation Settings -->
        <div style="background: rgba(124, 58, 237, 0.04); border: 1px dashed rgba(124, 58, 237, 0.3); border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem;">
          <div style="font-weight: 800; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem; color: var(--primary, #7c3aed);">
            <span class="icon">${icons.route || icons.link}</span>
            <span>تنظیمات پیوند در هدر و منوی اصلی سایت</span>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 1.25rem; align-items: center;">
            <label style="display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer; font-weight: 600;">
              <input type="checkbox" id="cat-show-in-header" style="width: 18px; height: 18px; accent-color: var(--primary, #7c3aed);" />
              <span>نمایش در منوی هدر سایت</span>
            </label>

            <div class="form-field" style="flex: 1; min-width: 200px; margin: 0;">
              <label for="cat-header-url" style="font-size: 0.8rem;">آدرس سفارشی هدر (خالی = پیش‌فرض دسته‌بندی)</label>
              <input type="text" id="cat-header-url" dir="ltr" placeholder="/services/smart-home" style="padding: 0.4rem 0.6rem; font-size: 0.85rem;" />
            </div>

            <div class="form-field" style="width: 100px; margin: 0;">
              <label for="cat-header-order" style="font-size: 0.8rem;">ترتیب در هدر</label>
              <input type="number" id="cat-header-order" value="1" min="1" max="99" style="padding: 0.4rem 0.6rem; font-size: 0.85rem;" />
            </div>
          </div>
        </div>

        <!-- Article & Educational Content Section (SEO Article Editor) -->
        <div style="border-top: 1px solid var(--border, #e2e8f0); padding-top: 1.25rem; margin-bottom: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <h4 style="margin: 0; font-weight: 800; font-size: 1.05rem; display: flex; align-items: center; gap: 0.4rem;">
              <span class="icon">${icons.article}</span>
              <span>محتوا و مقاله سئو اختصاصی این دسته‌بندی</span>
            </h4>
            <span style="font-size: 0.8rem; color: var(--muted, #64748b);">این مقاله در صفحه اختصاصی دسته رندر می‌شود.</span>
          </div>

          <div class="settings-form-grid" style="grid-template-columns: 2fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div class="form-field">
              <label for="cat-article-title">تیتر اصلی مقاله</label>
              <input type="text" id="cat-article-title" placeholder="راهنمای جامع خدمات هوشمندسازی و عیب‌یابی" />
            </div>
            <div class="form-field">
              <label for="cat-meta-title">تایتل سئو (Meta Title)</label>
              <input type="text" id="cat-meta-title" placeholder="هوشمندسازی ساختمان در تهران | بهدون" />
            </div>
          </div>

          <div class="form-field" style="margin-bottom: 1rem;">
            <label for="cat-meta-desc">توضیحات متای سئو (Meta Description)</label>
            <input type="text" id="cat-meta-desc" placeholder="توضیحات ۱۶۰ کاراکتری برای موتورهای جستجو..." />
          </div>

          <div class="form-field">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
              <label for="cat-article-content"><strong>متن کامل مقاله و راهنمای فنی (HTML/Markdown)</strong></label>
              <div style="display: flex; gap: 4px;">
                <button type="button" class="btn btn-secondary btn-sm" data-format="h2" title="تیتر بزرگ">H2</button>
                <button type="button" class="btn btn-secondary btn-sm" data-format="h3" title="تیتر متوسط">H3</button>
                <button type="button" class="btn btn-secondary btn-sm" data-format="bold" title="پررنگ"><strong>B</strong></button>
                <button type="button" class="btn btn-secondary btn-sm" data-format="ul" title="فهرست">لیست</button>
                <button type="button" class="btn btn-secondary btn-sm" data-format="tip" title="باکس نکته">کادر نکته</button>
              </div>
            </div>
            <textarea id="cat-article-content" rows="8" style="width: 100%; font-family: inherit; font-size: 0.9rem; line-height: 1.7; padding: 0.75rem; border: 1px solid var(--border, #cbd5e1); border-radius: 10px;" placeholder="متن کامل راهنما، استانداردهای ایمنی، علائم نیاز به خدمات و مراحل انجام کار..."></textarea>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; border-top: 1px solid var(--border, #e2e8f0); padding-top: 1rem;">
          <button type="button" class="btn btn-secondary" id="category-modal-cancel">انصراف</button>
          <button type="button" class="btn btn-primary" id="category-modal-save">ذخیره دسته‌بندی و مقاله</button>
        </div>
      </form>
    </div>

    <!-- Subservices Management Modal / Card -->
    <div class="editor-sidebar-card" id="subservices-mgr-card" hidden style="margin-bottom: 2rem; border: 1.5px solid #0284c7; border-radius: 16px; padding: 1.5rem; background: var(--surface, #ffffff); box-shadow: 0 10px 30px rgba(0,0,0,0.06);">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border, #e2e8f0); padding-bottom: 1rem; margin-bottom: 1.25rem;">
        <div>
          <h3 id="subservices-mgr-title" style="margin: 0; font-weight: 800; font-size: 1.2rem; color: #0284c7;">مدیریت زیردسته‌ها</h3>
          <span id="subservices-mgr-cat-name" style="color: var(--muted, #64748b); font-size: 0.85rem;"></span>
        </div>
        <button type="button" class="btn btn-ghost btn-sm" id="subservices-mgr-close" style="font-size: 1.2rem;">✕</button>
      </div>

      <!-- Add Subservice Mini Form -->
      <div style="background: rgba(2, 132, 199, 0.05); border: 1px solid rgba(2, 132, 199, 0.2); border-radius: 12px; padding: 1rem; margin-bottom: 1.25rem;">
        <h4 style="margin: 0 0 0.75rem 0; font-size: 0.95rem; font-weight: 800; color: #0369a1;">افزودن / ویرایش زیرخدمت</h4>
        <input type="hidden" id="sub-edit-id" />
        <div class="settings-form-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; margin-bottom: 0.75rem;">
          <div class="form-field" style="margin: 0;">
            <label for="sub-title-fa" style="font-size: 0.8rem;">عنوان زیرخدمت (فارسی) *</label>
            <input type="text" id="sub-title-fa" placeholder="مثلاً: نصب سنسور حرکتی" style="padding: 0.45rem 0.65rem; font-size: 0.85rem;" />
          </div>
          <div class="form-field" style="margin: 0;">
            <label for="sub-slug" style="font-size: 0.8rem;">شناسه / اسلاگ انگلیسی *</label>
            <input type="text" id="sub-slug" dir="ltr" placeholder="motion-sensor" style="padding: 0.45rem 0.65rem; font-size: 0.85rem;" />
          </div>
          <div class="form-field" style="margin: 0;">
            <label for="sub-price" style="font-size: 0.8rem;">شروع قیمت پایه (تومان) *</label>
            <input type="number" id="sub-price" value="350000" step="50000" style="padding: 0.45rem 0.65rem; font-size: 0.85rem;" />
          </div>
        </div>
        <div class="form-field" style="margin-bottom: 0.75rem;">
          <label for="sub-desc" style="font-size: 0.8rem;">توضیحات تخصصی خدمت</label>
          <input type="text" id="sub-desc" placeholder="توضیحات فنی، اقدامات تکنسین و موارد ضمانت..." style="padding: 0.45rem 0.65rem; font-size: 0.85rem;" />
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
          <button type="button" class="btn btn-secondary btn-sm" id="sub-cancel-btn">انصراف</button>
          <button type="button" class="btn btn-primary btn-sm" id="sub-save-btn">ذخیره زیرخدمت</button>
        </div>
      </div>

      <!-- Subservices List Table -->
      <div class="table-responsive" style="overflow-x: auto;">
        <table class="table" style="width: 100%; border-collapse: collapse; font-size: 0.88rem;">
          <thead>
            <tr style="border-bottom: 2px solid var(--border, #e2e8f0); text-align: right;">
              <th style="padding: 0.75rem;">ردیف</th>
              <th style="padding: 0.75rem;">عنوان خدمت</th>
              <th style="padding: 0.75rem;">شناسه آدرس</th>
              <th style="padding: 0.75rem;">شروع تعرفه</th>
              <th style="padding: 0.75rem;">توضیحات</th>
              <th style="padding: 0.75rem; text-align: left;">عملیات</th>
            </tr>
          </thead>
          <tbody id="subservices-table-body"></tbody>
        </table>
      </div>
    </div>

    <!-- Category Cards List Grid -->
    <div id="categories-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.25rem;">
      <p style="color: var(--muted, #64748b);">در حال بارگذاری اطلاعات دسته‌بندی‌های خدمات...</p>
    </div>
  `;
}

export function initServicesManagerView(): void {
  void ensureLanguageMode().then(() => applyLanguageVisibility(document.getElementById('view-container') ?? document.body));

  const errorEl = document.getElementById('services-mgr-error');
  const successEl = document.getElementById('services-mgr-success');
  const cardsGrid = document.getElementById('categories-cards-grid');
  const newCatBtn = document.getElementById('services-new-btn');
  const resetBtn = document.getElementById('services-reset-btn');

  // Category Edit Card Elements
  const catCard = document.getElementById('category-edit-card');
  const catModalTitle = document.getElementById('category-modal-title');
  const catModalClose = document.getElementById('category-modal-close');
  const catModalCancel = document.getElementById('category-modal-cancel');
  const catModalSave = document.getElementById('category-modal-save') as HTMLButtonElement | null;

  // Subservices Mgr Card Elements
  const subCard = document.getElementById('subservices-mgr-card');
  const subCatName = document.getElementById('subservices-mgr-cat-name');
  const subModalClose = document.getElementById('subservices-mgr-close');
  const subTableBody = document.getElementById('subservices-table-body');
  const subSaveBtn = document.getElementById('sub-save-btn') as HTMLButtonElement | null;
  const subCancelBtn = document.getElementById('sub-cancel-btn');

  if (!cardsGrid || !newCatBtn || !resetBtn || !catCard || !catModalSave || !subCard) return;

  let categories: ManagedServiceCategory[] = [];
  let currentManagingCatId: string | null = null;

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

  async function load(): Promise<void> {
    clearMessages();
    try {
      const fetched = await fetchManagedCategories();
      if (fetched.length > 0) {
        categories = fetched;
      } else {
        categories = getDefaultCategories();
        // Persist initial categories so custom changes can build on them
        await updateManagedCategories(categories);
      }
      renderCategoriesList();
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'بارگذاری خدمات با خطا مواجه شد.', true);
    }
  }

  function renderCategoriesList(): void {
    if (!cardsGrid) return;

    if (categories.length === 0) {
      cardsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--surface, #f8fafc); border-radius: 16px; border: 1px dashed var(--border, #cbd5e1);">
          <p style="color: var(--muted, #64748b); margin-bottom: 1rem;">هیچ دسته‌بندی خدماتی تعریف نشده است.</p>
          <button type="button" class="btn btn-primary" id="empty-reset-btn">بارگذاری ۸ دسته‌بندی پیش‌فرض بهدون</button>
        </div>
      `;
      document.getElementById('empty-reset-btn')?.addEventListener('click', async () => {
        categories = getDefaultCategories();
        await updateManagedCategories(categories);
        renderCategoriesList();
      });
      return;
    }

    cardsGrid.innerHTML = categories
      .map((cat, idx) => {
        const subCount = cat.subServices?.length || 0;
        const headerBadge = cat.showInHeader
          ? `<span style="background: rgba(16, 185, 129, 0.12); color: #059669; padding: 2px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 700;">نمایش در هدر (رتبه ${cat.headerOrder || idx + 1})</span>`
          : `<span style="background: rgba(100, 116, 139, 0.12); color: #64748b; padding: 2px 8px; border-radius: 6px; font-size: 0.75rem;">عدم نمایش در هدر</span>`;

        return `
          <div class="category-manager-card" style="background: var(--surface, #ffffff); border: 1px solid var(--border, #e2e8f0); border-radius: 16px; padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 16px rgba(0,0,0,0.03); transition: all 0.2s ease;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(124, 58, 237, 0.1); color: var(--primary, #7c3aed); display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
                    ${cat.icon || icons.wrench}
                  </div>
                  <div>
                    <h3 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: var(--text, #1e293b);">${escapeHtml(cat.label)}</h3>
                    <span style="font-size: 0.78rem; color: var(--muted, #64748b); font-family: monospace;">/services/${escapeHtml(cat.id)}</span>
                  </div>
                </div>
                ${headerBadge}
              </div>

              <p style="font-size: 0.85rem; color: var(--muted, #64748b); line-height: 1.6; margin: 0 0 0.75rem 0;">
                ${escapeHtml(cat.subtitle || 'بدون توضیحات')}
              </p>

              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; font-size: 0.8rem; color: #475569;">
                <span style="background: var(--surface-alt, #f1f5f9); padding: 3px 8px; border-radius: 6px;">
                  📋 <strong>${subCount}</strong> زیرخدمت
                </span>
                <span style="background: var(--surface-alt, #f1f5f9); padding: 3px 8px; border-radius: 6px;">
                  📝 دارای مقاله سئو
                </span>
              </div>
            </div>

            <div style="display: flex; gap: 0.5rem; border-top: 1px solid var(--border, #f1f5f9); padding-top: 0.75rem; flex-wrap: wrap;">
              <button type="button" class="btn btn-secondary btn-sm" data-manage-subs="${cat.id}" style="flex: 1; font-size: 0.8rem;">
                زیردسته‌ها (${subCount})
              </button>
              <button type="button" class="btn btn-primary btn-sm" data-edit-cat="${cat.id}" style="flex: 1; font-size: 0.8rem;">
                ویرایش و مقاله
              </button>
              <button type="button" class="btn btn-ghost btn-sm" data-delete-cat="${cat.id}" title="حذف دسته" style="color: #ef4444; padding: 0 0.5rem;">
                <span class="icon">${icons.trash}</span>
              </button>
            </div>
          </div>
        `;
      })
      .join('');

    wireCategoryActions();
  }

  function wireCategoryActions(): void {
    if (!cardsGrid) return;

    cardsGrid.querySelectorAll<HTMLButtonElement>('[data-edit-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const catId = btn.dataset.editCat;
        const cat = categories.find((c) => c.id === catId);
        if (cat) openCategoryEdit(cat);
      });
    });

    cardsGrid.querySelectorAll<HTMLButtonElement>('[data-manage-subs]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const catId = btn.dataset.manageSubs;
        const cat = categories.find((c) => c.id === catId);
        if (cat) openSubservicesManager(cat);
      });
    });

    cardsGrid.querySelectorAll<HTMLButtonElement>('[data-delete-cat]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const catId = btn.dataset.deleteCat;
        const cat = categories.find((c) => c.id === catId);
        if (!cat) return;
        if (!window.confirm(`آیا دسته‌بندی «${cat.label}» و تمامی زیردسته‌های آن برای همیشه حذف شوند؟`)) return;

        categories = categories.filter((c) => c.id !== catId);
        try {
          await updateManagedCategories(categories);
          renderCategoriesList();
          showMessage(`دسته‌بندی «${cat.label}» حذف شد.`);
        } catch (err) {
          showMessage(err instanceof Error ? err.message : 'حذف ناموفق بود.', true);
        }
      });
    });
  }

  function openCategoryEdit(cat: ManagedServiceCategory | null): void {
    clearMessages();
    const isNew = !cat;
    (document.getElementById('category-edit-is-new') as HTMLInputElement).value = isNew ? '1' : '0';
    (document.getElementById('category-edit-id') as HTMLInputElement).value = cat ? cat.id : '';

    if (catModalTitle) {
      catModalTitle.textContent = isNew ? 'افزودن دسته‌بندی جدید' : `ویرایش دسته‌بندی: ${cat!.label}`;
    }

    (document.getElementById('cat-title-fa') as HTMLInputElement).value = cat?.label || '';
    (document.getElementById('cat-title-en') as HTMLInputElement).value = cat?.labelEn || '';
    (document.getElementById('cat-slug') as HTMLInputElement).value = cat?.id || '';
    (document.getElementById('cat-slug') as HTMLInputElement).disabled = !isNew && !cat?.isCustom;
    (document.getElementById('cat-subtitle-fa') as HTMLInputElement).value = cat?.subtitle || '';

    (document.getElementById('cat-show-in-header') as HTMLInputElement).checked = cat?.showInHeader ?? false;
    (document.getElementById('cat-header-url') as HTMLInputElement).value = cat?.headerUrl || (cat ? `/services/${cat.id}` : '');
    (document.getElementById('cat-header-order') as HTMLInputElement).value = String(cat?.headerOrder || categories.length + 1);

    (document.getElementById('cat-article-title') as HTMLInputElement).value = cat?.article?.title || '';
    (document.getElementById('cat-meta-title') as HTMLInputElement).value = cat?.article?.metaTitle || '';
    (document.getElementById('cat-meta-desc') as HTMLInputElement).value = cat?.article?.metaDescription || '';
    (document.getElementById('cat-article-content') as HTMLTextAreaElement).value = cat?.article?.contentHtml || '';

    if (catCard) {
      catCard.hidden = false;
      catCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function closeCategoryEdit(): void {
    if (catCard) catCard.hidden = true;
  }

  // Format buttons helper for article editor
  document.querySelectorAll<HTMLButtonElement>('[data-format]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const textarea = document.getElementById('cat-article-content') as HTMLTextAreaElement | null;
      if (!textarea) return;
      const format = btn.dataset.format;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = textarea.value.substring(start, end) || 'متن نمونه';

      let replacement = '';
      if (format === 'h2') replacement = `\n<h2>${selected}</h2>\n`;
      else if (format === 'h3') replacement = `\n<h3>${selected}</h3>\n`;
      else if (format === 'bold') replacement = `<strong>${selected}</strong>`;
      else if (format === 'ul') replacement = `\n<ul>\n  <li>${selected}</li>\n  <li>مورد دوم</li>\n</ul>\n`;
      else if (format === 'tip') replacement = `\n<div class="service-tip-box">💡 <strong>نکته تخصصی:</strong> ${selected}</div>\n`;

      textarea.setRangeText(replacement, start, end, 'end');
      textarea.focus();
    });
  });

  catModalSave.addEventListener('click', async () => {
    clearMessages();
    const isNew = (document.getElementById('category-edit-is-new') as HTMLInputElement).value === '1';
    const oldId = (document.getElementById('category-edit-id') as HTMLInputElement).value;
    const titleFa = (document.getElementById('cat-title-fa') as HTMLInputElement).value.trim();
    const titleEn = (document.getElementById('cat-title-en') as HTMLInputElement).value.trim();
    const slug = (document.getElementById('cat-slug') as HTMLInputElement).value.trim().toLowerCase();
    const subtitleFa = (document.getElementById('cat-subtitle-fa') as HTMLInputElement).value.trim();
    const showInHeader = (document.getElementById('cat-show-in-header') as HTMLInputElement).checked;
    const headerUrl = (document.getElementById('cat-header-url') as HTMLInputElement).value.trim();
    const headerOrder = parseInt((document.getElementById('cat-header-order') as HTMLInputElement).value, 10) || 1;

    const articleTitle = (document.getElementById('cat-article-title') as HTMLInputElement).value.trim();
    const metaTitle = (document.getElementById('cat-meta-title') as HTMLInputElement).value.trim();
    const metaDesc = (document.getElementById('cat-meta-desc') as HTMLInputElement).value.trim();
    const articleHtml = (document.getElementById('cat-article-content') as HTMLTextAreaElement).value.trim();

    if (!titleFa) {
      showMessage('نام فارسی دسته‌بندی الزامی است.', true);
      return;
    }
    if (!slug) {
      showMessage('شناسه/اسلاگ دسته‌بندی الزامی است.', true);
      return;
    }

    if (isNew && categories.some((c) => c.id === slug)) {
      showMessage('دسته‌بندی با این شناسه/اسلاگ قبلاً ثبت شده است.', true);
      return;
    }

    catModalSave.disabled = true;
    try {
      if (isNew) {
        const newCategory: ManagedServiceCategory = {
          id: slug,
          label: titleFa,
          labelEn: titleEn || slug,
          icon: icons.wrench,
          subtitle: subtitleFa,
          subtitleEn: '',
          showInHeader,
          headerOrder,
          headerUrl: headerUrl || `/services/${slug}`,
          article: {
            title: articleTitle || `راهنمای جامع ${titleFa}`,
            excerpt: metaDesc || subtitleFa,
            contentHtml: articleHtml || `<p>خدمات تخصصی ${titleFa} توسط تکنسین‌های مجرب بهدون ارائه می‌گردد.</p>`,
            metaTitle: metaTitle || `${titleFa} در تهران | بهدون`,
            metaDescription: metaDesc,
            readingTimeMinutes: 5,
          },
          subServices: [],
          isCustom: true,
        };
        categories.push(newCategory);
      } else {
        const existing = categories.find((c) => c.id === oldId);
        if (existing) {
          existing.label = titleFa;
          existing.labelEn = titleEn || existing.labelEn;
          existing.subtitle = subtitleFa;
          existing.showInHeader = showInHeader;
          existing.headerOrder = headerOrder;
          existing.headerUrl = headerUrl || `/services/${existing.id}`;
          existing.article = {
            ...existing.article,
            title: articleTitle || existing.article?.title || '',
            metaTitle: metaTitle || existing.article?.metaTitle,
            metaDescription: metaDesc || existing.article?.metaDescription,
            contentHtml: articleHtml || existing.article?.contentHtml || '',
          };
        }
      }

      await updateManagedCategories(categories);
      closeCategoryEdit();
      renderCategoriesList();
      showMessage('دسته‌بندی و مقاله با موفقیت ذخیره شد.');
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'ذخیره ناموفق بود.', true);
    } finally {
      catModalSave.disabled = false;
    }
  });

  // ===== Subservices Management Logic =====
  function openSubservicesManager(cat: ManagedServiceCategory): void {
    currentManagingCatId = cat.id;
    if (subCatName) subCatName.textContent = `دسته‌بندی: ${cat.label} (/services/${cat.id})`;
    resetSubserviceForm();
    renderSubservicesTable(cat);
    if (subCard) {
      subCard.hidden = false;
      subCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function closeSubservicesManager(): void {
    currentManagingCatId = null;
    if (subCard) subCard.hidden = true;
  }

  function resetSubserviceForm(): void {
    (document.getElementById('sub-edit-id') as HTMLInputElement).value = '';
    (document.getElementById('sub-title-fa') as HTMLInputElement).value = '';
    (document.getElementById('sub-slug') as HTMLInputElement).value = '';
    (document.getElementById('sub-price') as HTMLInputElement).value = '350000';
    (document.getElementById('sub-desc') as HTMLInputElement).value = '';
  }

  function renderSubservicesTable(cat: ManagedServiceCategory): void {
    if (!subTableBody) return;
    const subs = cat.subServices || [];

    if (subs.length === 0) {
      subTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 1.5rem; color: var(--muted, #64748b);">
            هنوز زیرخدمتی برای این دسته‌بندی تعریف نشده است. فرم بالا را برای افزودن پر کنید.
          </td>
        </tr>
      `;
      return;
    }

    subTableBody.innerHTML = subs
      .map((sub, i) => `
        <tr style="border-bottom: 1px solid var(--border, #f1f5f9);">
          <td style="padding: 0.65rem;">${i + 1}</td>
          <td style="padding: 0.65rem; font-weight: 700;">${escapeHtml(sub.title)}</td>
          <td style="padding: 0.65rem; font-family: monospace; color: #0369a1;">${escapeHtml(sub.id)}</td>
          <td style="padding: 0.65rem; font-weight: 700; color: var(--primary, #7c3aed);">${formatToman(sub.basePrice)}</td>
          <td style="padding: 0.65rem; max-width: 250px; font-size: 0.8rem; color: #475569; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHtml(sub.description)}">${escapeHtml(sub.description || '-')}</td>
          <td style="padding: 0.65rem; text-align: left;">
            <button type="button" class="btn btn-ghost btn-sm" data-edit-sub="${sub.id}">ویرایش</button>
            <button type="button" class="btn btn-ghost btn-sm" data-delete-sub="${sub.id}" style="color: #ef4444;">حذف</button>
          </td>
        </tr>
      `)
      .join('');

    subTableBody.querySelectorAll<HTMLButtonElement>('[data-edit-sub]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const subId = btn.dataset.editSub;
        const sub = subs.find((s) => s.id === subId);
        if (sub) {
          (document.getElementById('sub-edit-id') as HTMLInputElement).value = sub.id;
          (document.getElementById('sub-title-fa') as HTMLInputElement).value = sub.title;
          (document.getElementById('sub-slug') as HTMLInputElement).value = sub.id;
          (document.getElementById('sub-price') as HTMLInputElement).value = String(sub.basePrice);
          (document.getElementById('sub-desc') as HTMLInputElement).value = sub.description;
        }
      });
    });

    subTableBody.querySelectorAll<HTMLButtonElement>('[data-delete-sub]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const subId = btn.dataset.deleteSub;
        if (!window.confirm('این زیرخدمت حذف شود؟')) return;
        cat.subServices = cat.subServices.filter((s) => s.id !== subId);
        await updateManagedCategories(categories);
        renderSubservicesTable(cat);
        renderCategoriesList();
        showMessage('زیرخدمت حذف شد.');
      });
    });
  }

  subSaveBtn?.addEventListener('click', async () => {
    if (!currentManagingCatId) return;
    const cat = categories.find((c) => c.id === currentManagingCatId);
    if (!cat) return;

    const editId = (document.getElementById('sub-edit-id') as HTMLInputElement).value;
    const title = (document.getElementById('sub-title-fa') as HTMLInputElement).value.trim();
    const slug = (document.getElementById('sub-slug') as HTMLInputElement).value.trim().toLowerCase();
    const price = parseInt((document.getElementById('sub-price') as HTMLInputElement).value, 10) || 0;
    const desc = (document.getElementById('sub-desc') as HTMLInputElement).value.trim();

    if (!title || !slug) {
      alert('عنوان و شناسه زیرخدمت الزامی است.');
      return;
    }

    if (editId) {
      const target = cat.subServices.find((s) => s.id === editId);
      if (target) {
        target.title = title;
        target.basePrice = price;
        target.description = desc;
      }
    } else {
      if (cat.subServices.some((s) => s.id === slug)) {
        alert('این شناسه زیرخدمت قبلاً در این دسته وجود دارد.');
        return;
      }
      cat.subServices.push({
        id: slug,
        title,
        titleEn: slug,
        basePrice: price,
        description: desc,
        guaranteeDays: 30,
      });
    }

    await updateManagedCategories(categories);
    resetSubserviceForm();
    renderSubservicesTable(cat);
    renderCategoriesList();
    showMessage('زیرخدمت با موفقیت ثبت شد.');
  });

  subCancelBtn?.addEventListener('click', resetSubserviceForm);
  subModalClose?.addEventListener('click', closeSubservicesManager);

  newCatBtn.addEventListener('click', () => openCategoryEdit(null));
  catModalClose?.addEventListener('click', closeCategoryEdit);
  catModalCancel?.addEventListener('click', closeCategoryEdit);

  resetBtn.addEventListener('click', async () => {
    if (!window.confirm('آیا مایلید تمام تغییرات پاک شده و کاتالوگ جامع ۸ دسته و ۵۳ خدمت رسمی بهدون بازیابی گردد؟')) return;
    categories = getDefaultCategories();
    try {
      await updateManagedCategories(categories);
      renderCategoriesList();
      closeCategoryEdit();
      closeSubservicesManager();
      showMessage('کاتالوگ خدمات با موفقیت به پیش‌فرض‌های بهدون بازنشانی شد.');
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'بازنشانی ناموفق بود.', true);
    }
  });

  void load();
}

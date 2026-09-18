import { serviceCategories, DEFAULT_VEHICLE_TYPES, CATEGORY_VEHICLE_IDS } from '../data/services.ts';
import { ALL_SERVICES_CATALOG } from '../data/allServicesData.ts';
import { icons } from './icons.ts';
import { pick } from '../i18n/lang.ts';
import { toPersianDigits } from '../utils/jalali.ts';
import { formatToman } from '../utils/format.ts';

export interface SubcategoryDetails {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  basePrice: number;
  icon: string;
}

export const SUBCATEGORY_DETAILS_MAP: Record<string, { desc: string; descEn: string }> = {
  'water-cooler': {
    desc: 'سرویس کامل دوره‌ای، تعویض پوشال، تست و تعویض پمپ و دینام و روغن‌کاری یاتاقان‌ها',
    descEn: 'Full seasonal maintenance, pad replacement, pump and motor testing, bearing lubrication',
  },
  'package': {
    desc: 'رسوب‌زدایی مبدل، رفع افت فشار، عیب‌یابی کدهای خطا، تعمیر برد الکترونیک و سرویس رادیاتور',
    descEn: 'Heat exchanger descaling, pressure fix, error code diagnostics, circuit board repair',
  },
  'split-ac': {
    desc: 'شارژ گاز استاندارد R22 و R410، شستشوی پنل داخلی و کندانسور خارجی، نشت‌یابی و نصب',
    descEn: 'R22/R410 gas recharge, deep indoor/outdoor coil wash, leak detection & mounting',
  },
  'radiator': {
    desc: 'نصب و افزایش پره، رفع آب‌بندی و نشتی رادیاتور، تعویض شیر رفت‌وبرگشت و شیر ترموستاتیک',
    descEn: 'Adding elements, leak sealing, valve replacement and thermostatic balance',
  },
  'leak-detection': {
    desc: 'نشت‌یابی نقطه زن با دستگاه آکوستیک و تصویری حرارتی پیشرفته بدون کمترین تخریب در ساختمان',
    descEn: 'Point-accurate acoustic and thermal imaging leak detection without destruction',
  },
  'unclogging': {
    desc: 'لوله بازکنی فوری توالت، آشپزخانه و حمام با فنر فولادی تمیز، بهداشتی و دستگاه ژنراتور',
    descEn: 'Urgent drain unclogging for toilets, sinks, and bathrooms with sanitary motorized snake',
  },
  'faucet-repair': {
    desc: 'نصب و تعمیر انواع شیرآلات اهرمی، توکار، چشمی، دوش حمام، سیفون، فلاش‌تانک و روشویی',
    descEn: 'Installation and repair of lever, concealed, sensory faucets, showers and flush valves',
  },
  'water-pump': {
    desc: 'نصب و سرویس پمپ تحت فشار آب ساختمان، تنظیم کلید اتوماتیک مکانیکی/دیجیتال و تعویض تیوپ منبع',
    descEn: 'Water pressure booster pump installation, automatic switch tuning, expansion tank repair',
  },
  'short-circuit': {
    desc: 'اعزام فوری برقکار برای عیب‌یابی اتصالی سیم‌کشی، رفع پریدن کنتور، فیوز مینیاتوری و برق‌دار بودن بدنه',
    descEn: 'Immediate electrician dispatch for short circuits, tripped breakers, and earth fault troubleshooting',
  },
  'wiring': {
    desc: 'سیم‌کشی و کابل‌کشی کلی و جزئی مسکونی و تجاری، داکت‌کشی، خطوط تلفن و کابل شبکه',
    descEn: 'Residential & commercial wiring, trunking, dedicated appliance circuits and data cabling',
  },
  'chandelier': {
    desc: 'نصب مطمئن و مهار سنگین انواع لوسترهای سقفی، کریستالی، مدرن، چراغ‌های خطی و هالوژن',
    descEn: 'Secure heavy ceiling chandelier mounting, crystal, modern fixtures, spotlights & linear LED',
  },
  'intercom': {
    desc: 'تعمیر و نصب آیفون‌های صوتی و تصویری، عیب‌یابی قفل‌بازکن، رفع پارازیت تصویر و صدا و سیم‌کشی',
    descEn: 'Video intercom installation, lock mechanism repair, audio/video static troubleshooting',
  },
  'painting': {
    desc: 'نقاشی ساختمان با رنگ‌های روغنی، پلاستیک، اکرلیک بی‌بو، بتونه‌کاری کناف و اجرای پتینه‌کاری مدرن',
    descEn: 'Interior wall painting with oil, emulsion, odorless acrylic, drywall plastering and patina',
  },
  'tiling': {
    desc: 'کاشی و سرامیک‌کاری کف و بدنه، اسلب و پرسلان چسبی و ملاتی برای سرویس بهداشتی و آشپزخانه',
    descEn: 'Floor and wall tiling, porcelain and slab installation for bathrooms and kitchens',
  },
  'waterproofing': {
    desc: 'عایق‌کاری رطوبتی، قیرگونی و نصب استاندارد ایزوگام مرغوب با ضمانت کتبی ۱۰ ساله برای بام و استخر',
    descEn: 'Waterproofing, tar coating and certified roofing felt with 10-year warranty for roofs & pools',
  },
  'knauf': {
    desc: 'اجرای سقف کاذب کناف، باکس نور مخفی دکوراتیو، لاین نوری، تایل ۶۰×۶۰ و دیوار جداکننده ضد رطوبت',
    descEn: 'Knauf false ceiling, concealed ambient lighting coves, linear lights and drywall partitions',
  },
};

// Only the 4 primary categories on the homepage (in 1 row)
export const PRIMARY_CATEGORY_IDS = ['hvac', 'plumbing', 'electrical', 'renovation'];

export function renderServiceCategoriesAccordion(): string {
  const primaryCategories = serviceCategories.filter((cat) => PRIMARY_CATEGORY_IDS.includes(cat.id));

  // 1. Horizontal row tabs for the 4 primary categories
  const tabsHtml = primaryCategories
    .map((cat, idx) => {
      const vehicleIds = CATEGORY_VEHICLE_IDS[cat.id] || [];
      const isSelected = idx === 0;

      return `
        <button
          type="button"
          class="category-row-tab ${isSelected ? 'is-active' : ''}"
          data-category-select="${cat.id}"
          role="tab"
          aria-selected="${isSelected}"
          aria-controls="category-panel-${cat.id}"
          id="cat-tab-${cat.id}"
        >
          <div class="cat-tab-icon-box">
            <span class="icon">${cat.icon}</span>
          </div>
          <div class="cat-tab-info">
            <h3 class="cat-tab-title">${pick(cat.label, cat.labelEn)}</h3>
            <span class="cat-tab-badge">${toPersianDigits(vehicleIds.length)} ${pick('خدمت', 'services')}</span>
          </div>
        </button>
      `;
    })
    .join('');

  // 2. Underneath panels for each category
  const panelsHtml = primaryCategories
    .map((cat, idx) => {
      const vehicleIds = CATEGORY_VEHICLE_IDS[cat.id] || [];
      const subcategories = vehicleIds
        .map((vid) => {
          const v = DEFAULT_VEHICLE_TYPES.find((item) => item.id === vid);
          if (!v) return null;
          const catCatalog = ALL_SERVICES_CATALOG[cat.id];
          const subCatalog = catCatalog?.subServices?.find((s) => s.id === vid);
          const extra = SUBCATEGORY_DETAILS_MAP[vid];
          const desc = subCatalog?.shortDesc || extra?.desc || pick(cat.subtitle || '', cat.subtitleEn || '');
          const descEn = subCatalog?.shortDescEn || extra?.descEn || cat.subtitleEn || '';

          return {
            id: v.id,
            label: pick(v.label, v.labelEn),
            basePrice: v.basePrice,
            desc: pick(desc, descEn),
          };
        })
        .filter(Boolean);

      const isSelected = idx === 0;

      return `
        <div
          class="category-display-panel ${isSelected ? 'is-active' : ''}"
          id="category-panel-${cat.id}"
          role="tabpanel"
          aria-labelledby="cat-tab-${cat.id}"
          ${isSelected ? '' : 'hidden'}
        >
          <!-- Category Header Info Underneath the 4 Cards -->
          <div class="category-panel-intro">
            <div class="category-panel-intro-text">
              <h4 class="category-panel-title">${pick(cat.label, cat.labelEn)}</h4>
              <p class="category-panel-desc">${pick(cat.subtitle || '', cat.subtitleEn || '')}</p>
            </div>
            <a href="/services/${cat.id}" class="category-panel-guide-link">
              <span>${pick(`مشاهده صفحه جامع و دانشنامه تخصصی ${cat.label}`, `Full ${cat.labelEn} Guide & Page`)}</span>
              <span class="icon" style="width: 14px; height: 14px;">${icons.chevronLeft}</span>
            </a>
          </div>

          <!-- Subcategories Grid with Accordion expansion -->
          <div class="subcategories-grid">
            ${subcategories
              .map(
                (sub) => `
              <div class="subcategory-item" data-subcategory-id="${sub!.id}">
                <button
                  type="button"
                  class="subcategory-item-header"
                  data-sub-toggle="${sub!.id}"
                  aria-expanded="false"
                  title="${pick('مشاهده توضیحات و ثبت درخواست', 'View details & request')}"
                >
                  <div class="subcategory-item-title-wrap">
                    <span class="subcategory-bullet"></span>
                    <h5 class="subcategory-title">${sub!.label}</h5>
                  </div>
                  <div class="subcategory-header-meta">
                    <div class="subcategory-price-tag">
                      <span class="price-label">${pick('شروع از:', 'From:')}</span>
                      <span class="price-value">${formatToman(sub!.basePrice)}</span>
                    </div>
                    <span class="sub-chevron-icon">${icons.chevronDown}</span>
                  </div>
                </button>

                <div class="subcategory-item-body" hidden>
                  <p class="subcategory-desc">${sub!.desc}</p>
                  <div class="subcategory-item-footer">
                    <button
                      type="button"
                      class="btn btn-primary btn-sm service-order-trigger"
                      data-service-id="${cat.id}"
                      data-vehicle-id="${sub!.id}"
                    >
                      <span class="icon">${icons.plusCircle}</span>
                      <span>${pick('ثبت درخواست آنلاین', 'Request Service')}</span>
                    </button>
                    <a
                      href="/services/${cat.id}/${sub!.id}"
                      class="btn btn-outline btn-sm subcategory-page-btn"
                    >
                      <span>${pick('صفحه اختصاصی و تعرفه', 'Dedicated Page')}</span>
                      <span>←</span>
                    </a>
                  </div>
                </div>
              </div>
            `,
              )
              .join('')}
          </div>
        </div>
      `;
    })
    .join('');

  return `
    <div class="services-explorer" id="services-explorer">
      <!-- 4 Categories Strictly in 1 Horizontal Row -->
      <div class="categories-row-nav" role="tablist" aria-label="دسته‌بندی‌های اصلی خدمات بهدون">
        ${tabsHtml}
      </div>

      <!-- Selected Category Subservices & Details Panel Underneath -->
      <div class="categories-panels-container">
        ${panelsHtml}
      </div>

      <!-- Quick Action & Trust Bar -->
      <div class="services-quick-bar">
        <div class="quick-bar-content">
          <div class="quick-bar-text">
            <strong>${pick('نیاز به اعزام فوری تکنسین دارید؟', 'Need immediate technician dispatch?')}</strong>
            <span>${pick('ثبت درخواست آنلاین کمتر از ۲ دقیقه زمان می‌برد و برآورد دقیق هزینه نمایش داده می‌شود.', 'Online request takes less than 2 minutes with instant price estimate.')}</span>
          </div>
          <div class="quick-bar-actions">
            <button type="button" class="btn btn-primary btn-cta-wave hero-quick-order-btn" id="hero-quick-request-btn">
              <span class="icon">${icons.plusCircle}</span>
              <span>${pick('ثبت سریع درخواست آنلاین', 'Quick Online Request')}</span>
            </button>
            <a href="tel:09333256885" class="btn btn-secondary hero-quick-call-btn">
              <span class="icon">${icons.phone}</span>
              <span>${pick('تماس مستقیم: ۰۹۳۳۳۲۵۶۸۸۵', 'Call: 09333256885')}</span>
            </a>
            <a href="/services" class="btn btn-outline" style="border: 1.5px solid #cbd5e1; border-radius: 0.75rem; padding: 0.65rem 1.25rem; font-weight: 800; text-decoration: none; color: #334155; display: inline-flex; align-items: center; gap: 0.4rem;">
              <span class="icon">${icons.layers || icons.bolt}</span>
              <span>${pick('کاتالوگ تمام ۵۳ خدمت', 'All 53 Services')}</span>
            </a>
          </div>
        </div>

        <div class="services-trust-pills">
          <div class="trust-pill">
            <span class="icon">${icons.shield}</span>
            <span>${pick('ضمانت کتبی ۳۰ روزه کیفیت کار', '30-Day Written Quality Guarantee')}</span>
          </div>
          <div class="trust-pill">
            <span class="icon">${icons.clock}</span>
            <span>${pick('اعزام تکنسین در کمتر از ۴۵ دقیقه', 'Technician Dispatch Under 45 Mins')}</span>
          </div>
          <div class="trust-pill">
            <span class="icon">${icons.fileText}</span>
            <span>${pick('صدور فاکتور رسمی تفکیکی معتبر', 'Official Detailed Itemized Invoice')}</span>
          </div>
          <div class="trust-pill">
            <span class="icon">${icons.checkCircle}</span>
            <span>${pick('قیمت مصوب اتحادیه و بدون هزینه مخفی', 'Union Approved Rates & No Hidden Fees')}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initServiceCategoriesAccordion(
  onSelectService: (categoryId: string, vehicleId?: string) => void,
): void {
  const container = document.getElementById('services-explorer');
  if (!container) return;

  const tabs = container.querySelectorAll<HTMLButtonElement>('[data-category-select]');
  const panels = container.querySelectorAll<HTMLElement>('.category-display-panel');

  // Category Tab switching (selecting category in row shows its subcategories underneath)
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const selectedId = tab.dataset.categorySelect;
      if (!selectedId) return;

      tabs.forEach((t) => {
        const isMatch = t.dataset.categorySelect === selectedId;
        t.classList.toggle('is-active', isMatch);
        t.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });

      panels.forEach((p) => {
        const isMatch = p.id === `category-panel-${selectedId}`;
        p.classList.toggle('is-active', isMatch);
        p.hidden = !isMatch;
      });
    });
  });

  // Wire subcategory item accordion toggles
  container.querySelectorAll<HTMLElement>('.subcategory-item').forEach((subItem) => {
    const subToggle = subItem.querySelector<HTMLButtonElement>('[data-sub-toggle]');
    const subBody = subItem.querySelector<HTMLElement>('.subcategory-item-body');

    subToggle?.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = subItem.classList.contains('sub-is-open');

      if (isOpen) {
        subItem.classList.remove('sub-is-open');
        subToggle.setAttribute('aria-expanded', 'false');
        if (subBody) subBody.hidden = true;
      } else {
        subItem.classList.add('sub-is-open');
        subToggle.setAttribute('aria-expanded', 'true');
        if (subBody) subBody.hidden = false;
      }
    });
  });

  // Wire subcategory order buttons
  container.querySelectorAll<HTMLButtonElement>('.service-order-trigger').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const catId = btn.dataset.serviceId || '';
      const vehicleId = btn.dataset.vehicleId;
      onSelectService(catId, vehicleId);
    });
  });

  // Wire hero quick request button
  document.getElementById('hero-quick-request-btn')?.addEventListener('click', () => {
    onSelectService(PRIMARY_CATEGORY_IDS[0]);
  });
}

import { serviceCategories, DEFAULT_VEHICLE_TYPES, CATEGORY_VEHICLE_IDS } from '../data/services.ts';
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

const SUBCATEGORY_DETAILS_MAP: Record<string, { desc: string; descEn: string }> = {
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

export function renderServiceCategoriesAccordion(): string {
  const categoriesHtml = serviceCategories
    .map((cat) => {
      const vehicleIds = CATEGORY_VEHICLE_IDS[cat.id] || [];
      const subcategories = vehicleIds
        .map((vid) => {
          const v = DEFAULT_VEHICLE_TYPES.find((item) => item.id === vid);
          if (!v) return null;
          const extra = SUBCATEGORY_DETAILS_MAP[vid] || {
            desc: pick(cat.subtitle || '', cat.subtitleEn || ''),
            descEn: cat.subtitleEn || '',
          };
          return {
            id: v.id,
            label: pick(v.label, v.labelEn),
            basePrice: v.basePrice,
            desc: pick(extra.desc, extra.descEn),
          };
        })
        .filter(Boolean);

      // In normal state, categories start collapsed and open upon user click
      const isOpen = false;

      return `
        <div class="category-accordion-card ${isOpen ? 'is-open' : ''}" data-category-card="${cat.id}">
          <button
            type="button"
            class="category-accordion-header"
            data-category-toggle="${cat.id}"
            aria-expanded="${isOpen}"
            aria-controls="category-panel-${cat.id}"
          >
            <div class="category-header-main">
              <div class="category-icon-box">
                <span class="icon">${cat.icon}</span>
              </div>
              <div class="category-header-info">
                <div class="category-title-row">
                  <h3 class="category-title">${pick(cat.label, cat.labelEn)}</h3>
                  <span class="category-badge">${toPersianDigits(subcategories.length)} ${pick('خدمت تخصصی', 'Specialties')}</span>
                </div>
                <p class="category-subtitle">${pick(cat.subtitle || '', cat.subtitleEn || '')}</p>
              </div>
            </div>
            <div class="category-toggle-indicator">
              <span class="category-toggle-text">${pick(isOpen ? 'بستن' : 'مشاهده خدمات', isOpen ? 'Close' : 'View services')}</span>
              <span class="icon chevron-icon">${icons.chevronDown}</span>
            </div>
          </button>

          <div
            class="category-accordion-panel"
            id="category-panel-${cat.id}"
            ${isOpen ? '' : 'hidden'}
          >
            <div class="subcategories-grid">
              ${subcategories
                .map(
                  (sub) => `
                <div class="subcategory-item" data-subcategory-id="${sub!.id}">
                  <div class="subcategory-item-top">
                    <div class="subcategory-item-title-wrap">
                      <span class="subcategory-bullet"></span>
                      <h4 class="subcategory-title">${sub!.label}</h4>
                    </div>
                    <div class="subcategory-price-tag">
                      <span class="price-label">${pick('شروع از:', 'From:')}</span>
                      <span class="price-value">${formatToman(sub!.basePrice)}</span>
                    </div>
                  </div>
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
                  </div>
                </div>
              `,
                )
                .join('')}
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  return `
    <div class="services-explorer" id="services-explorer">
      <div class="services-explorer-header">
        <div class="services-explorer-badge">
          <span class="icon">${icons.bolt}</span>
          <span>${pick('خدمات سریع و تضمینی ساختمان در تهران', 'Fast & Guaranteed Building Services in Tehran')}</span>
        </div>
        <h2 class="services-explorer-title">${pick('دسته‌بندی خدمات فنی بهدون', 'Behdoon Technical Service Categories')}</h2>
        <p class="services-explorer-desc">
          ${pick(
            'روی هر دسته‌بندی کلیک کنید تا خدمات زیرمجموعه، نرخ شروع قیمت و جزئیات تخصصی نمایش داده شود:',
            'Click on any category to view its sub-services, starting rates, and technician details:',
          )}
        </p>
      </div>

      <div class="category-accordion-list">
        ${categoriesHtml}
      </div>

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
            <a href="tel:02122345678" class="btn btn-secondary hero-quick-call-btn">
              <span class="icon">${icons.phone}</span>
              <span>${pick('تماس تلفنی: ۰۲۱-۲۲۳۴۵۶۷۸', 'Call: 021-22345678')}</span>
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

  const cards = container.querySelectorAll<HTMLElement>('.category-accordion-card');

  cards.forEach((card) => {
    const toggleBtn = card.querySelector<HTMLButtonElement>('[data-category-toggle]');
    const panel = card.querySelector<HTMLElement>('.category-accordion-panel');
    const toggleText = card.querySelector<HTMLElement>('.category-toggle-text');

    toggleBtn?.addEventListener('click', () => {
      const isCurrentlyOpen = card.classList.contains('is-open');

      if (isCurrentlyOpen) {
        card.classList.remove('is-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        if (panel) panel.hidden = true;
        if (toggleText) toggleText.textContent = pick('مشاهده خدمات', 'View services');
      } else {
        card.classList.add('is-open');
        toggleBtn.setAttribute('aria-expanded', 'true');
        if (panel) panel.hidden = false;
        if (toggleText) toggleText.textContent = pick('بستن', 'Close');
      }
    });
  });

  // Wire subcategory buttons
  container.querySelectorAll<HTMLButtonElement>('.service-order-trigger').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const catId = btn.dataset.serviceId || '';
      const vId = btn.dataset.vehicleId || '';
      onSelectService(catId, vId);
    });
  });

  // Wire hero quick request button
  document.getElementById('hero-quick-request-btn')?.addEventListener('click', () => {
    onSelectService('');
  });
}

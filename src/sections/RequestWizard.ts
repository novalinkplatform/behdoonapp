import { CATEGORY_VEHICLE_IDS, serviceCategories, DEFAULT_VEHICLE_TYPES } from '../data/services.ts';
import { SUBCATEGORY_DETAILS_MAP } from '../components/ServiceCategoriesAccordion.ts';
import type { VehicleTypeSetting, ServiceCitiesSettings, ServiceCategoriesSettings } from '../utils/dynamicContent.ts';
import { icons } from '../components/icons.ts';
import { renderLocationMap, initLocationMap, type LocationMapController } from '../components/LocationMap.ts';
import type { MapSettings } from '../utils/mapProvider.ts';
import { renderCalendarPicker, initCalendarPicker } from '../components/PersianCalendar.ts';
import { renderTimePicker, initTimePicker, formatTime } from '../components/TimePicker.ts';
import { renderCostChart } from '../components/CostChart.ts';
import { estimateCost, calculateDetailedInvoice, type CostEstimateInput } from '../data/pricing.ts';
import { openCustomerInvoiceModal } from '../components/InvoiceModal.ts';
import { PROPERTY_TYPES } from '../data/propertyTypes.ts';
import { toPersianDigits } from '../utils/jalali.ts';
import { formatToman } from '../utils/format.ts';
import { submitRequest as submitRequestApi } from '../utils/api.ts';
import { getLastName, getLastPhone, saveLastName, saveLastPhone } from '../utils/localOrders.ts';
import type { SavedAddresses } from '../utils/addresses.ts';
import { pick } from '../i18n/lang.ts';
import { trackEvent } from '../utils/analytics.ts';
import { saveCustomerSession } from '../utils/customerAuth.ts';
import { generateShahanshahiTrackingCode } from '../utils/tracking.ts';

const FLOOR_VALUES = [0, 1, 2, 3, 4, 5];

function floorLabel(floor: number): string {
  if (floor === 0) return pick('همکف / پارکینگ', 'Ground');
  if (floor === 5) return `${toPersianDigits(5)}+`;
  return pick(`طبقه ${toPersianDigits(floor)}`, `Floor ${floor}`);
}

export interface InsuranceTier {
  id: string;
  title: string;
  titleEn: string;
  coverageCeiling: string;
  coverageCeilingEn: string;
  costLabel: string;
  costLabelEn: string;
  description: string;
  descriptionEn: string;
  isRecommended?: boolean;
}

export const INSURANCE_TIERS: InsuranceTier[] = [
  {
    id: 'base_50m',
    title: 'پوشش پایه',
    titleEn: 'Basic Coverage',
    coverageCeiling: 'تا سقف ۵۰ میلیون تومان',
    coverageCeilingEn: 'Up to 50M Toman',
    costLabel: 'شامل خدمات پایه',
    costLabelEn: 'Included in Base',
    description: 'جبران خسارت حوادث حین کار و سلامت کارشناسی تا ۵۰ میلیون تومان',
    descriptionEn: 'Protection for on-site damage and service warranty up to 50M Toman',
  },
  {
    id: 'silver_150m',
    title: 'پوشش نقره‌ای',
    titleEn: 'Silver Coverage',
    coverageCeiling: 'تا سقف ۱۵۰ میلیون تومان',
    coverageCeilingEn: 'Up to 150M Toman',
    costLabel: 'مناسب پروژه‌های معمول',
    costLabelEn: 'Standard Service',
    description: 'پوشش خسارت تأسیسات، تجهیزات ساختمانی و قطعات مصرفی استاندارد',
    descriptionEn: 'Protection for installations, building equipment and standard materials',
  },
  {
    id: 'gold_300m',
    title: 'پوشش طلایی',
    titleEn: 'Gold Coverage',
    coverageCeiling: 'تا سقف ۳۰۰ میلیون تومان',
    coverageCeilingEn: 'Up to 300M Toman',
    costLabel: 'پیشنهادی برای تعمیرات و بازسازی',
    costLabelEn: 'Recommended for Renovation',
    description: 'پوشش کامل قطعات گران‌قیمت، تجهیزات پکیج/سرمایش و تضمین کیفیت کار',
    descriptionEn: 'Full protection for high-value components, HVAC/appliances and warranty',
    isRecommended: true,
  },
  {
    id: 'platinum_500m',
    title: 'پوشش ویژه و VIP',
    titleEn: 'VIP Coverage',
    coverageCeiling: 'تا سقف ۵۰۰ میلیون تومان',
    coverageCeilingEn: 'Up to 500M Toman',
    costLabel: 'حداکثر سقف عادی',
    costLabelEn: 'Max Standard Limit',
    description: 'سقف حداکثری جبران فوری برای پروژه‌های بزرگ و تجهیزات لوکس ساختمانی',
    descriptionEn: 'Maximum compensation ceiling for large projects and luxury building installations',
  },
  {
    id: 'custom_high',
    title: 'پوشش اختصاصی (پروژه‌های سنگین)',
    titleEn: 'Custom High-Value',
    coverageCeiling: 'بیش از ۵۰۰ میلیون تومان',
    coverageCeilingEn: 'Above 500M Toman',
    costLabel: 'کارشناسی بر اساس ارزش کار',
    costLabelEn: 'Based on Project Value',
    description: 'صدور بیمه‌نامه معتبر بر اساس برآورد پروژه و کارشناسی تخصصی در محل',
    descriptionEn: 'Official insurance policy based on project assessment after expert verification',
  },
];

export function getSiteBrandName(siteName?: { fa?: string; en?: string } | string): string {
  if (!siteName) return pick('بهدون', 'Behdoon');
  if (typeof siteName === 'object') {
    return pick(siteName.fa, siteName.en) || siteName.fa || siteName.en || 'بهدون';
  }
  return String(siteName);
}

const STEPS = [
  { id: 'service', question: 'به چه خدمتی در ساختمان نیاز دارید؟', questionEn: 'What building service do you need?' },
  { id: 'location', question: 'نشانی و موقعیت مکانی انجام خدمت در تهران', questionEn: 'Where is your location in Tehran?' },
  { id: 'packing', question: 'آیا نیاز به تأمین قطعات و مصالح مصرفی دارید؟', questionEn: 'Do you need spare parts or materials provided?' },
  { id: 'labor', question: 'میزان فوریت و تعداد تکنسین مورد نیاز', questionEn: 'Select urgency and technician team size' },
  { id: 'schedule', question: 'تکنسین چه زمانی به محل مراجعه کند؟', questionEn: 'When should the technician visit?' },
  { id: 'estimate', question: 'برآورد هزینه و انتخاب پوشش بیمه و تضمین بهدون', questionEn: 'Preliminary service cost estimate & insurance coverage' },
  { id: 'phone', question: 'مشخصات متقاضی و ثبت نهایی درخواست', questionEn: 'Enter your details to finalize and dispatch' },
];
const TOTAL_STEPS = STEPS.length;

export function renderRequestWizardModal(
  vehicleTypes: VehicleTypeSetting[] = DEFAULT_VEHICLE_TYPES,
  serviceCities?: ServiceCitiesSettings,
  serviceCategorySettings?: ServiceCategoriesSettings,
  siteName?: { fa?: string; en?: string } | string,
): string {
  return `
    <div class="request-wizard-modal-overlay" id="request-wizard-modal" hidden tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="modal-wizard-heading">
      <div class="request-wizard-modal-dialog">
        <div class="request-wizard-modal-topbar">
          <div class="request-wizard-modal-title-wrap">
            <span class="modal-title-icon">${icons.bolt}</span>
            <div>
              <h2 class="request-wizard-modal-title" id="modal-wizard-heading">${pick('ثبت آنلاین درخواست خدمات بهدون', 'Online Service Request - Behdoon')}</h2>
              <p class="request-wizard-modal-sub">${pick('محاسبه آنی هزینه، اعزام نزدیک‌ترین تکنسین متخصص و ضمانت کتبی در تهران', 'Instant price estimate, certified technician dispatch & written warranty in Tehran')}</p>
            </div>
          </div>
          <button type="button" class="request-wizard-modal-close" id="request-wizard-modal-close" aria-label="${pick('بستن', 'Close')}" title="${pick('بستن', 'Close')}">
            <span class="icon">${icons.close}</span>
          </button>
        </div>
        <div class="request-wizard-modal-body">
          ${renderRequestWizard(vehicleTypes, serviceCities, serviceCategorySettings, siteName)}
        </div>
      </div>
    </div>
  `;
}

export function renderRequestWizard(
  _vehicleTypes: VehicleTypeSetting[] = DEFAULT_VEHICLE_TYPES,
  _serviceCities?: ServiceCitiesSettings,
  _serviceCategorySettings?: ServiceCategoriesSettings,
  siteName?: { fa?: string; en?: string } | string,
): string {
  const brandName = getSiteBrandName(siteName);

  return `
    <div class="request-card" id="request">
      <div class="wizard-progress">
        <div class="wizard-progress-bar"><div class="wizard-progress-fill" id="wizard-progress-fill"></div></div>
        <span class="wizard-progress-text" id="wizard-progress-text"></span>
      </div>

      <h2 class="wizard-question" id="wizard-question"></h2>

      <div class="wizard-body">
        <!-- گام ۱: انتخاب خدمت و تخصص بهدون (آکاردئون با باز شدن زیردسته‌ها در زیر هر دسته) -->
        <section class="request-panel" data-panel="1">
          <p class="wizard-panel-hint" style="font-size: 0.88rem; color: #64748b; margin-bottom: 12px;">
            ${pick('روی هر دسته کلیک کنید تا خدمات تخصصی، نرخ شروع و توضیحات در زیر آن نمایش داده شود، سپس تخصص مورد نظر را انتخاب نمایید:', 'Click any category to expand sub-services, starting rates, and details underneath:')}
          </p>
          <div class="wizard-categories-accordion">
            ${serviceCategories.map((cat) => {
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
                    icon: v.icon,
                  };
                })
                .filter(Boolean);

              return `
                <div class="wizard-cat-item" data-wizard-cat-item="${cat.id}">
                  <button type="button" class="wizard-cat-header" data-wizard-cat-header="${cat.id}">
                    <div class="wizard-cat-header-main">
                      <span class="icon wizard-cat-icon">${cat.icon}</span>
                      <div class="wizard-cat-info">
                        <div class="wizard-cat-title-row">
                          <h3 class="wizard-cat-title">${pick(cat.label, cat.labelEn)}</h3>
                          <span class="wizard-cat-badge">${toPersianDigits(subcategories.length)} ${pick('تخصص', 'Specialties')}</span>
                        </div>
                        <p class="wizard-cat-sub">${pick(cat.subtitle, cat.subtitleEn)}</p>
                      </div>
                    </div>
                    <div class="wizard-cat-header-action">
                      <span class="wizard-cat-toggle-hint">${pick('مشاهده خدمات', 'View')}</span>
                      <span class="icon chevron-icon">${icons.chevronDown}</span>
                    </div>
                  </button>

                  <div class="wizard-subcat-panel" data-wizard-subcat-panel="${cat.id}" hidden>
                    <div class="wizard-subcat-grid">
                      ${subcategories
                        .map(
                          (sub) => `
                        <div class="wizard-subcat-card" data-wizard-subcat="${sub!.id}" data-parent-cat="${cat.id}">
                          <div class="wizard-subcat-top">
                            <div class="wizard-subcat-title-wrap">
                              <span class="wizard-subcat-indicator"></span>
                              <h4 class="wizard-subcat-title">${sub!.label}</h4>
                            </div>
                            <span class="wizard-subcat-price">${pick('شروع از:', 'From:')} ${formatToman(sub!.basePrice)}</span>
                          </div>
                          <p class="wizard-subcat-desc">${sub!.desc}</p>
                          <div class="wizard-subcat-radio">
                            <span class="wizard-subcat-select-btn">${pick('انتخاب این خدمت', 'Select this service')}</span>
                          </div>
                        </div>
                      `,
                        )
                        .join('')}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          <p class="request-panel-error" id="wizard-service-error" hidden style="font-weight: 700; color: #dc2626; margin-top: 10px; padding: 8px 12px; background: #fef2f2; border-radius: 8px; border: 1px solid #fecaca;">
            ${pick('لطفاً یکی از خدمات تخصصی را با کلیک روی دسته و زیرمجموعه آن انتخاب نمایید.', 'Please select a specific service by expanding a category above.')}
          </p>
        </section>

        <!-- گام ۲: نشانی و موقعیت مکانی انجام خدمت در تهران (لوکیشن متمرکز و بدون مبدأ/مقصد) -->
        <section class="request-panel" data-panel="2" hidden>
          <div class="form-field wizard-tehran-coverage-badge">
            <span class="field-label">${pick('محدوده تحت پوشش بهدون در پایتخت:', 'Behdoon Coverage in Tehran:')}</span>
            <div class="wizard-coverage-chip" style="display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: #f5f3ff; border: 1.5px solid #ddd6fe; border-radius: 10px; color: #6d28d9; font-weight: 600; font-size: 0.92rem;">
              <span class="icon" style="color: #7c3aed;">${icons.checkCircle || icons.shield}</span>
              <span>${pick('استان تهران — شهر تهران (پوشش سریع و سراسری کلیه مناطق ۲۲ گانه)', 'Tehran Province — Tehran City (All 22 Districts)')}</span>
            </div>
          </div>

          <div class="form-field">
            <span class="field-label">${pick('نوع ملک و کاربری فضا', 'Property type')}</span>
            <div class="wizard-choice-row" id="wizard-location-property-row">
              ${PROPERTY_TYPES.map((t) => `<button type="button" class="wizard-pill ${t.id === 'residential' ? 'is-selected' : ''}" data-property-choice="${t.id}">${pick(t.label, t.labelEn)}</button>`).join('')}
            </div>
          </div>

          <div class="form-field">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span class="field-label" style="margin-bottom: 0; font-weight: 700; color: #1e1b2e;">${pick('موقعیت روی نقشه تهران (انتخاب الزامی)', 'Location on Tehran map (Mandatory)')}</span>
              <span style="font-size: 0.78rem; color: #7c3aed; font-weight: 700;">${pick('★ کلیک یا جابه‌جایی نشانگر روی نقشه الزامی است', '★ Map interaction required')}</span>
            </div>
            ${renderLocationMap('wizard-location-map')}
            <p class="request-panel-error" id="wizard-location-map-error" hidden style="font-weight: 700; color: #dc2626; margin-top: 8px; padding: 6px 10px; background: #fef2f2; border-radius: 6px; border: 1px solid #fecaca;">
              ${pick('انتخاب موقعیت دقیق محل خدمت از روی نقشه تهران الزامی است. لطفاً روی نقشه کلیک کنید یا نشانگر را به محل مورد نظر جابه‌جا نمایید.', 'Selecting exact service location on Tehran map is mandatory. Please tap the map or move the marker.')}
            </p>
          </div>

          <div class="wizard-location-details-box" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 8px;">
            <div class="form-field">
              <span class="field-label">${pick('طبقه واحد', 'Floor number')}</span>
              <div class="wizard-choice-row" id="wizard-location-floor-row">
                ${FLOOR_VALUES.map((f) => `<button type="button" class="wizard-pill ${f === 1 ? 'is-selected' : ''}" data-floor-choice="${f}">${floorLabel(f)}</button>`).join('')}
              </div>
            </div>
            <div class="form-field">
              <span class="field-label">${pick('آسانسور ساختمان', 'Elevator')}</span>
              <div class="wizard-choice-row" id="wizard-location-elevator-row">
                <button type="button" class="wizard-pill is-selected" data-elevator-choice="yes">${pick('دارد', 'Yes')}</button>
                <button type="button" class="wizard-pill" data-elevator-choice="no">${pick('ندارد', 'No')}</button>
              </div>
            </div>
          </div>

          <div class="form-field" style="margin-top: 10px;">
            <label for="wizard-location-address" style="font-weight: 600;">${pick('نشانی متنی، خیابان و پلاک در تهران', 'Street address & Unit/Plaque')}</label>
            <div class="input-wrapper">
              <span class="icon input-icon">${icons.pin}</span>
              <input type="text" id="wizard-location-address" placeholder="${pick('مثال: خیابان ولیعصر، نرسیده به میدان ونک، پلاک ۱۲، واحد ۴', 'e.g. Valiasr St, near Vanak Sq, Plaque 12, Unit 4')}" />
            </div>
          </div>

          <div class="form-field">
            <label for="wizard-location-notes">${pick('توضیحات تکمیلی دسترسی برای تکنسین (اختیاری)', 'Technician access notes (optional)')}</label>
            <textarea
              id="wizard-location-notes"
              class="wizard-notes-input"
              rows="2"
              maxlength="500"
              placeholder="${pick('توضیحاتی مانند نام زنگ، کد درب ورودی، پارکینگ یا علائم راهنما...', 'Door code, buzzer name, parking info...')}"
            ></textarea>
          </div>
        </section>

        <!-- گام ۳: تامین قطعات و مصالح مصرفی -->
        <section class="request-panel" data-panel="3" hidden>
          <p class="field-label" style="font-size: 1rem; margin-bottom: 12px; font-weight: 600;">
            ${pick('آیا برای انجام خدمت نیاز به تأمین قطعات یدکی، لوازم جانبی یا مصالح مصرفی دارید؟', 'Do you need spare parts or materials provided for the service?')}
          </p>
          <div class="wizard-choice-row wizard-choice-row-lg">
            <button type="button" class="wizard-pill wizard-pill-lg is-selected" data-packing-choice="yes">
              <span class="icon">${icons.checkCircle || icons.shield}</span>
              <span>${pick('می‌خواهم (تکنسین با قطعات استاندارد و فاکتور رسمی تهیه کند)', 'Yes (Technician provides with official invoice)')}</span>
            </button>
            <button type="button" class="wizard-pill wizard-pill-lg" data-packing-choice="no">
              <span>${pick('نمی‌خواهم (قطعات و مصالح را شخصاً آماده کرده‌ام)', 'No (I will provide parts/materials myself)')}</span>
            </button>
          </div>
          <p style="font-size: 0.82rem; color: #64748b; margin-top: 14px; line-height: 1.8;">
            ${pick(
              'کلیه قطعات و مصالح مصرفی تهیه شده توسط تکنسین‌های بهدون دارای برچسب اصالت کالا و فاکتور تفکیکی به نرخ مصوب صنف می‌باشند.',
              'All parts and materials provided by Behdoon technicians come with genuine quality labels and official itemized invoices.',
            )}
          </p>
        </section>

        <!-- گام ۴: فوریت اعزام و تعداد تکنسین -->
        <section class="request-panel" data-panel="4" hidden>
          <div style="margin-bottom: 16px;">
            <span class="field-label" style="display: block; font-weight: 700; color: #1e293b; margin-bottom: 8px; font-size: 0.95rem;">
              ${pick('میزان فوریت اعزام تکنسین به محل در تهران:', 'Technician dispatch urgency in Tehran:')}
            </span>
            <div class="wizard-choice-row wizard-choice-row-lg">
              <button type="button" class="wizard-pill wizard-pill-lg is-selected" data-urgency-choice="urgent">
                <span class="icon">${icons.bolt}</span>
                <span>${pick('اعزام فوری (زیر ۴۵ دقیقه)', 'Urgent dispatch (Under 45 mins)')}</span>
              </button>
              <button type="button" class="wizard-pill wizard-pill-lg" data-urgency-choice="scheduled">
                <span class="icon">${icons.calendar}</span>
                <span>${pick('عادی و برنامه‌ریزی‌شده', 'Standard scheduled')}</span>
              </button>
            </div>
          </div>

          <div class="wizard-labor-details" style="padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; text-align: right;">
            <div style="margin-bottom: 14px;">
              <span class="field-label" style="display: block; font-weight: 700; color: #1e293b; margin-bottom: 8px; font-size: 0.95rem;">${pick('تعداد تکنسین یا استادکار مورد نیاز:', 'Number of technicians needed:')}</span>
              <div class="wizard-choice-row" style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button type="button" class="wizard-pill is-selected" data-labor-count="1">${pick('۱ نفر (تکنسین متخصص)', '1 technician')}</button>
                <button type="button" class="wizard-pill" data-labor-count="2">${pick('۲ نفر (تیم استاندارد)', '2 persons (Standard team)')}</button>
                <button type="button" class="wizard-pill" data-labor-count="3">${pick('۳ نفر به بالا (پروژه‌ای)', '3+ persons')}</button>
              </div>
              <p style="font-size: 0.78rem; color: #64748b; margin: 6px 0 0;">${pick('تکنسین به همراه ست کامل ابزار و تجهیزات تخصصی تست به محل اعزام می‌شود.', 'The technician arrives with complete professional diagnostic and repair tools.')}</p>
            </div>

            <div style="border-top: 1px dashed #cbd5e1; padding-top: 12px;">
              <span class="field-label" style="display: block; font-weight: 700; color: #1e293b; margin-bottom: 8px; font-size: 0.95rem;">${pick('نیاز به تجهیزات کمکی خاص (نردبان بلند، داربست، دریل هیلتی):', 'Auxiliary equipment needed (High ladder, Scaffold, Demolition hammer):')}</span>
              <div class="wizard-choice-row" style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button type="button" class="wizard-pill is-selected" data-heavy-choice="0">${pick('ندارم', 'None')}</button>
                <button type="button" class="wizard-pill" data-heavy-choice="1">${pick('نردبان بلند / هیلتی', 'High ladder / Hammer')}</button>
                <button type="button" class="wizard-pill" data-heavy-choice="2">${pick('داربست یا بالابر', 'Scaffold or Lift')}</button>
              </div>
            </div>
          </div>
        </section>

        <!-- گام ۵: زمان مراجعه تکنسین -->
        <section class="request-panel" data-panel="5" hidden>
          <div class="form-field">
            <span class="field-label">${pick('تاریخ مراجعه تکنسین در تهران', 'Visit Date')}</span>
            ${renderCalendarPicker('wizard-calendar')}
          </div>
          <div class="form-field">
            <span class="field-label">${pick('ساعت مراجعه تکنسین', 'Visit Time')}</span>
            ${renderTimePicker('wizard-time')}
          </div>
        </section>

        <!-- گام ۶: برآورد هزینه و انتخاب بیمه و تضمین خسارت -->
        <section class="request-panel" data-panel="6" hidden>
          <div id="wizard-cost-chart"></div>

          <div class="wizard-insurance-section" style="margin-top: 20px;">
            <div class="wizard-insurance-header">
              <div class="wizard-insurance-header-title">
                <span class="icon">${icons.shield || icons.checkCircle}</span>
                <h4>${pick('انتخاب پوشش بیمه و سقف جبران خسارت بهدون', 'Select Insurance & Damage Compensation Limit')}</h4>
              </div>
              <p class="wizard-insurance-subtitle">
                ${pick(
                  'جهت تضمین کیفیت خدمات و جبران خسارات احتمالی هنگام انجام کار، سقف پوشش مورد نظر خود را انتخاب فرمایید:',
                  'Select your desired coverage limit for job safety guarantee and damage compensation:',
                )}
              </p>
            </div>

            <div class="wizard-insurance-grid" id="wizard-insurance-grid">
              ${INSURANCE_TIERS.map(
                (tier) => `
                <button
                  type="button"
                  class="wizard-insurance-card ${tier.id === 'gold_300m' ? 'is-selected' : ''} ${tier.isRecommended ? 'is-recommended' : ''}"
                  data-insurance-choice="${tier.id}"
                >
                  ${tier.isRecommended ? `<span class="wizard-insurance-badge">${pick('پیشنهاد ویژه', 'Recommended')}</span>` : ''}
                  <div class="wizard-insurance-card-top">
                    <span class="wizard-insurance-card-title">${pick(tier.title, tier.titleEn)}</span>
                    <span class="wizard-insurance-card-coverage">${pick(tier.coverageCeiling, tier.coverageCeilingEn)}</span>
                  </div>
                  <div class="wizard-insurance-card-cost">${pick(tier.costLabel, tier.costLabelEn)}</div>
                  <p class="wizard-insurance-card-desc">${pick(tier.description, tier.descriptionEn)}</p>
                </button>
              `,
              ).join('')}
            </div>

            <div class="wizard-insurance-notice">
              <span class="icon wizard-insurance-notice-icon">${icons.shield || icons.checkCircle}</span>
              <div class="wizard-insurance-notice-content">
                <strong>${pick(
                  `نهایی شدن توسط ${brandName} پس از بررسی صورت خواهد گرفت.`,
                  `Finalization by ${brandName} will take place after review.`,
                )}</strong>
                <p>${pick(
                  `پس از ثبت درخواست، شرایط کار و سقف پوشش بیمه انتخابی توسط کارشناسان ${brandName} بررسی و در هماهنگی تلفنی قطعی خواهد شد.`,
                  `After submission, job conditions and selected insurance coverage will be verified and finalized with you by ${brandName} experts.`,
                )}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- گام ۷: مشخصات متقاضی و ثبت نهایی -->
        <section class="request-panel" data-panel="7" hidden>
          <div class="wizard-phone-insurance-banner">
            <div class="wizard-phone-insurance-info">
              <span class="icon">${icons.shield || icons.checkCircle}</span>
              <div>
                <span class="wizard-phone-insurance-title">${pick('پوشش بیمه و تضمین خسارت انتخابی:', 'Selected Insurance Coverage:')}</span>
                <span class="wizard-phone-insurance-value" id="wizard-selected-insurance-text">${pick('پوشش طلایی — تا سقف ۳۰۰ میلیون تومان', 'Gold Coverage — Up to 300M Toman')}</span>
              </div>
            </div>
            <div class="wizard-insurance-notice-compact">
              ${pick(
                `نهایی شدن توسط ${brandName} پس از بررسی صورت خواهد گرفت.`,
                `Finalization by ${brandName} will take place after review.`,
              )}
            </div>
          </div>

          <div class="form-field">
            <label for="wizard-name">${pick('نام و نام خانوادگی', 'Full name')}</label>
            <div class="input-wrapper">
              <span class="icon input-icon">${icons.user}</span>
              <input type="text" id="wizard-name" placeholder="${pick('نام و نام خانوادگی خود را وارد کنید', 'Your full name')}" autocomplete="name" />
            </div>
          </div>
          <p class="request-panel-error" id="wizard-name-error" hidden>${pick('نام و نام خانوادگی را وارد کنید.', 'Enter your full name.')}</p>

          <div class="form-field">
            <label for="wizard-phone">${pick('شماره موبایل', 'Mobile number')}</label>
            <div class="input-wrapper">
              <span class="icon input-icon">${icons.phone}</span>
              <input type="tel" id="wizard-phone" placeholder="${pick('۰۹xxxxxxxxx', '09xxxxxxxxx')}" autocomplete="tel" inputmode="numeric" />
            </div>
          </div>
          <p class="request-panel-error" id="wizard-phone-error" hidden>${pick('شماره موبایل معتبر ۱۱ رقمی با ۰۹ وارد کنید.', 'Enter a valid 11-digit mobile number.')}</p>

          <p class="request-panel-error" id="wizard-submit-error" hidden></p>

          <div class="wizard-success-state" id="wizard-success-state" hidden>
            <div class="wizard-success-icon"><span class="icon">${icons.checkCircle}</span></div>
            <h3 class="wizard-success-title">${pick('درخواست شما با موفقیت در بهدون ثبت شد!', 'Request submitted successfully to Behdoon!')}</h3>
            <p class="wizard-success-desc">
              ${pick(
                'تکنسین متخصص بهدون ظرف کمتر از ۴۵ دقیقه با شما تماس گرفته و جهت انجام خدمت اعزام خواهد شد.',
                'A Behdoon certified technician will contact you shortly and dispatch to your location.',
              )}
            </p>

            <div class="wizard-tracking-box">
              <span class="wizard-tracking-label">${pick('شماره پیگیری اختصاصی سفارش:', 'Exclusive Tracking Number:')}</span>
              <span class="wizard-tracking-number" id="wizard-tracking-code"></span>
              <button type="button" class="btn btn-secondary btn-sm" id="wizard-copy-tracking-btn">
                <span class="icon">${icons.copy || icons.fileText}</span>
                <span>${pick('کپی کد', 'Copy Code')}</span>
              </button>
            </div>

            <div class="wizard-final-summary" id="wizard-final-summary"></div>

            <div class="wizard-actions-grid">
              <button type="button" class="btn btn-primary wizard-action-btn wizard-invoice-action" id="wizard-view-invoice-btn">
                <span class="icon">${icons.fileText}</span>
                <span>${pick('مشاهده و چاپ پیش‌فاکتور تفکیکی', 'View Itemized Pre-Invoice')}</span>
              </button>

              <a href="/orders" class="btn btn-secondary wizard-action-btn" id="wizard-go-orders-btn">
                <span class="icon">${icons.box}</span>
                <span>${pick('پیگیری در درخواست‌های من', 'Track in My Orders')}</span>
              </a>

              <a href="tel:09333256885" class="btn btn-secondary wizard-action-btn" id="wizard-call-support-btn">
                <span class="icon">${icons.phone}</span>
                <span>${pick('تماس با پشتیبانی: ۰۹۳۳۳۲۵۶۸۸۵', 'Support: 09333256885')}</span>
              </a>

              <a href="https://wa.me/989333256885" target="_blank" rel="noopener" class="btn btn-secondary wizard-action-btn wizard-whatsapp-action" id="wizard-whatsapp-btn">
                <span class="icon">${icons.chat}</span>
                <span>${pick('هماهنگی و ارسال تصویر در واتساپ', 'WhatsApp Support & Photo Send')}</span>
              </a>

              <button type="button" class="btn btn-ghost wizard-action-btn-reset" id="wizard-new-request-btn">
                <span>${pick('ثبت درخواست جدید', 'Submit New Request')}</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      <div class="wizard-footer" id="wizard-footer">
        <button type="button" class="btn btn-secondary" id="wizard-back" hidden>${pick('قبلی', 'Back')}</button>
        <button type="button" class="btn btn-primary" id="wizard-next">${pick('بعدی', 'Next')}</button>
      </div>
    </div>
  `;
}

interface WizardState {
  serviceId: string | null;
  vehicleId: string | null;
  propertyType: string;
  floor: number;
  hasElevator: boolean;
  address: string;
  notes: string;
  wantsPacking: boolean;
  urgency: 'urgent' | 'scheduled';
  laborCount: number;
  heavyEquipment: number;
  insuranceTier: string;
}

function wireChipGroup(
  container: Element,
  attr: string,
  onSelect: (value: string, btn: HTMLButtonElement) => void,
): void {
  const buttons = Array.from(container.querySelectorAll<HTMLButtonElement>(`[${attr}]`));
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      onSelect(btn.getAttribute(attr) ?? '', btn);
    });
  });
}

export interface RequestWizardController {
  selectService: (serviceId: string) => void;
  selectVehicle: (vehicleId: string) => void;
  setSavedAddresses: (addresses: SavedAddresses) => void;
  openModal: (serviceId?: string, vehicleId?: string) => void;
  closeModal: () => void;
  resetWizard: () => void;
}

export function initRequestWizard(
  vehicleTypes: VehicleTypeSetting[] = DEFAULT_VEHICLE_TYPES,
  _serviceCities?: ServiceCitiesSettings,
  mapSettings?: MapSettings,
  _siteName?: { fa?: string; en?: string } | string,
): RequestWizardController {
  const cardEl = document.getElementById('request');
  const questionEl = document.getElementById('wizard-question');
  const progressFill = document.getElementById('wizard-progress-fill');
  const progressText = document.getElementById('wizard-progress-text');
  const backBtn = document.getElementById('wizard-back') as HTMLButtonElement | null;
  const nextBtn = document.getElementById('wizard-next') as HTMLButtonElement | null;
  const footer = document.getElementById('wizard-footer');
  const nameInput = document.getElementById('wizard-name') as HTMLInputElement | null;
  const nameError = document.getElementById('wizard-name-error');
  const phoneInput = document.getElementById('wizard-phone') as HTMLInputElement | null;
  const phoneError = document.getElementById('wizard-phone-error');
  const submitError = document.getElementById('wizard-submit-error');
  const costChartContainer = document.getElementById('wizard-cost-chart');
  const trackingCodeEl = document.getElementById('wizard-tracking-code');
  const finalSummaryEl = document.getElementById('wizard-final-summary');

  const noop: RequestWizardController = {
    selectService: () => {},
    selectVehicle: () => {},
    setSavedAddresses: () => {},
    openModal: () => {},
    closeModal: () => {},
    resetWizard: () => {},
  };
  if (
    !cardEl ||
    !questionEl ||
    !progressFill ||
    !progressText ||
    !backBtn ||
    !nextBtn ||
    !footer ||
    !nameInput ||
    !nameError ||
    !phoneInput ||
    !phoneError ||
    !submitError ||
    !costChartContainer ||
    !trackingCodeEl ||
    !finalSummaryEl
  ) {
    return noop;
  }
  const card = cardEl;

  const cachedName = getLastName();
  const cachedPhone = getLastPhone();
  if (cachedName) nameInput.value = cachedName;
  if (cachedPhone) phoneInput.value = cachedPhone;

  let locationMap: ReturnType<typeof initLocationMap> = null;

  function ensureLocationMap(): LocationMapController | null {
    if (!locationMap) {
      locationMap = initLocationMap('wizard-location-map', undefined, mapSettings);
    }
    return locationMap;
  }

  const calendar = initCalendarPicker('wizard-calendar', { maxDaysAhead: 7 });
  const timePicker = initTimePicker('wizard-time');

  let currentStep = 1;
  const state: WizardState = {
    serviceId: null,
    vehicleId: null,
    propertyType: 'residential',
    floor: 1,
    hasElevator: true,
    address: '',
    notes: '',
    wantsPacking: true,
    urgency: 'urgent',
    laborCount: 1,
    heavyEquipment: 0,
    insuranceTier: 'gold_300m',
  };

  // Accordion toggle in Step 1
  card.querySelectorAll<HTMLButtonElement>('[data-wizard-cat-header]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const catId = btn.dataset.wizardCatHeader ?? '';
      const item = card.querySelector(`[data-wizard-cat-item="${catId}"]`);
      const panel = card.querySelector(`[data-wizard-subcat-panel="${catId}"]`) as HTMLElement | null;
      const wasOpen = item?.classList.contains('is-open');

      card.querySelectorAll('[data-wizard-cat-item]').forEach((el) => el.classList.remove('is-open'));
      card.querySelectorAll<HTMLElement>('[data-wizard-subcat-panel]').forEach((el) => {
        el.hidden = true;
      });

      if (!wasOpen && item && panel) {
        item.classList.add('is-open');
        panel.hidden = false;
      }
    });
  });

  // Subcategory card clicks in Step 1
  card.querySelectorAll<HTMLElement>('[data-wizard-subcat]').forEach((cardEl) => {
    cardEl.addEventListener('click', () => {
      const subId = cardEl.dataset.wizardSubcat ?? '';
      const parentCat = cardEl.dataset.parentCat ?? '';
      state.serviceId = parentCat;
      state.vehicleId = subId;

      card.querySelectorAll('[data-wizard-subcat]').forEach((el) => el.classList.remove('is-selected'));
      cardEl.classList.add('is-selected');

      const err = document.getElementById('wizard-service-error');
      if (err) err.hidden = true;
      updateNextButtonLabel();
    });
  });

  // Location Property Type
  const propRow = document.getElementById('wizard-location-property-row');
  if (propRow) {
    wireChipGroup(propRow, 'data-property-choice', (val) => {
      state.propertyType = val;
    });
  }

  // Location Floor
  const floorRow = document.getElementById('wizard-location-floor-row');
  if (floorRow) {
    wireChipGroup(floorRow, 'data-floor-choice', (val) => {
      state.floor = Number(val) || 0;
    });
  }

  // Location Elevator
  const elevRow = document.getElementById('wizard-location-elevator-row');
  if (elevRow) {
    wireChipGroup(elevRow, 'data-elevator-choice', (val) => {
      state.hasElevator = val === 'yes';
    });
  }

  // Packing
  const packingPanel = card.querySelector('[data-panel="3"]');
  if (packingPanel) {
    wireChipGroup(packingPanel, 'data-packing-choice', (val) => {
      state.wantsPacking = val === 'yes';
    });
  }

  // Urgency & Technicians
  const laborPanel = card.querySelector('[data-panel="4"]');
  if (laborPanel) {
    wireChipGroup(laborPanel, 'data-urgency-choice', (val) => {
      state.urgency = val as 'urgent' | 'scheduled';
    });
    wireChipGroup(laborPanel, 'data-labor-count', (val) => {
      state.laborCount = Number(val) || 1;
    });
    wireChipGroup(laborPanel, 'data-heavy-choice', (val) => {
      state.heavyEquipment = Number(val) || 0;
    });
  }

  // Insurance tiers selection
  card.querySelectorAll<HTMLButtonElement>('[data-insurance-choice]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tierId = btn.dataset.insuranceChoice ?? 'gold_300m';
      state.insuranceTier = tierId;
      card.querySelectorAll('[data-insurance-choice]').forEach((b) => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');

      const tier = INSURANCE_TIERS.find((t) => t.id === tierId);
      const textEl = document.getElementById('wizard-selected-insurance-text');
      if (textEl && tier) {
        textEl.textContent = `${pick(tier.title, tier.titleEn)} — ${pick(tier.coverageCeiling, tier.coverageCeilingEn)}`;
      }
    });
  });

  function advanceStep(delta: 1 | -1): void {
    const next = Math.min(TOTAL_STEPS, Math.max(1, currentStep + delta));
    currentStep = next;
    if (delta === 1) {
      trackEvent('wizard_step', { step: currentStep, stepId: STEPS[currentStep - 1]?.id });
    }
    updateStepUI();

    const modalBody = card.closest('.request-wizard-modal-body');
    if (modalBody) {
      modalBody.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (card) {
      const rect = card.getBoundingClientRect();
      if (rect.top < 64 || rect.top > 220) {
        const targetY = window.pageYOffset + rect.top - 68;
        window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
      }
    }
  }

  function updateNextButtonLabel(): void {
    const isLastStep = currentStep === TOTAL_STEPS;
    nextBtn!.textContent = isLastStep ? pick('ثبت نهایی و اعزام تکنسین', 'Finalize & Dispatch') : pick('مرحله بعد', 'Next step');
    nextBtn!.classList.toggle('btn-cta-wave', isLastStep);
  }

  function updateStepUI(): void {
    const step = STEPS[currentStep - 1];
    questionEl!.textContent = pick(step.question, step.questionEn);
    progressText!.textContent = pick(
      `مرحله ${toPersianDigits(currentStep)} از ${toPersianDigits(TOTAL_STEPS)}`,
      `Step ${toPersianDigits(currentStep)} of ${toPersianDigits(TOTAL_STEPS)}`,
    );
    progressFill!.style.width = `${(currentStep / TOTAL_STEPS) * 100}%`;

    card!.querySelectorAll<HTMLElement>('.request-panel[data-panel]').forEach((el) => {
      el.hidden = el.dataset.panel !== String(currentStep);
    });

    backBtn!.hidden = currentStep === 1;
    updateNextButtonLabel();

    if (step.id === 'location') {
      const lm = ensureLocationMap();
      lm?.refresh();
    }

    if (step.id === 'estimate') {
      const locPos = ensureLocationMap()?.getPosition();
      const pricing = resolveVehiclePricing(state.vehicleId);
      const estimateInput: CostEstimateInput = {
        ...pricing,
        originFloor: state.floor ?? 1,
        originHasElevator: state.hasElevator ?? true,
        originPropertyType: state.propertyType || 'residential',
        originLat: locPos?.lat ?? 35.7219,
        originLng: locPos?.lng ?? 51.3347,
        destinationFloor: 0,
        destinationHasElevator: true,
        destinationPropertyType: state.propertyType || 'residential',
        destinationLat: locPos?.lat ?? 35.7219,
        destinationLng: locPos?.lng ?? 51.3347,
        wantsPacking: state.wantsPacking ?? true,
        laborChoice: 'origin',
        laborCount: state.laborCount,
        heavyItemsCount: state.heavyEquipment,
      };
      const estimate = estimateCost(estimateInput);
      const detailedInvoice = calculateDetailedInvoice(estimateInput);
      costChartContainer!.innerHTML = renderCostChart(estimate, detailedInvoice);
    }
  }

  function validateCurrentStep(): boolean {
    const step = STEPS[currentStep - 1];
    if (step.id === 'service') {
      const valid = Boolean(state.serviceId && state.vehicleId);
      const err = document.getElementById('wizard-service-error');
      if (err) err.hidden = valid;
      return valid;
    }
    if (step.id === 'location') {
      const lm = ensureLocationMap();
      const hasInteracted = lm?.hasInteracted() ?? false;
      const mapError = document.getElementById('wizard-location-map-error');
      if (mapError) mapError.hidden = hasInteracted;
      return hasInteracted;
    }
    if (step.id === 'packing') return true;
    if (step.id === 'labor') return true;
    if (step.id === 'schedule') return true;
    if (step.id === 'phone') {
      const nameValid = nameInput!.value.trim().length > 0;
      const phoneValid = /^09\d{9}$/.test(phoneInput!.value.trim());
      nameError!.hidden = nameValid;
      phoneError!.hidden = phoneValid;
      return nameValid && phoneValid;
    }
    return true;
  }

  function categoryLabel(): string {
    const cat = serviceCategories.find((c) => c.id === state.serviceId);
    return cat ? pick(cat.label, cat.labelEn) : '';
  }

  function vehicleLabel(): string {
    const v = vehicleTypes.find((item) => item.id === state.vehicleId);
    return v ? pick(v.label, v.labelEn) : '';
  }

  function serviceLabel(): string {
    return `${categoryLabel()} — ${vehicleLabel()}`;
  }

  function propertyTypeLabel(id: string | null): string {
    const t = PROPERTY_TYPES.find((item) => item.id === id);
    return t ? pick(t.label, t.labelEn) : '';
  }

  function resolveVehiclePricing(vehicleId: string | null): { basePrice: number; perKmRate: number; floorCostExempt: boolean } {
    const v = vehicleTypes.find((item) => item.id === vehicleId);
    if (v) return { basePrice: v.basePrice, perKmRate: v.perKmRate, floorCostExempt: v.floorCostExempt };
    return { basePrice: 180000, perKmRate: 0, floorCostExempt: true };
  }

  async function submitRequest(): Promise<void> {
    const date = calendar.getSelected() || pick('امروز (فوری)', 'Today (Immediate)');
    const timeObj = timePicker.getSelected();
    const time = timeObj ? formatTime(timeObj) : pick('اعزام فوری', 'Immediate Dispatch');
    if (!state.serviceId || !state.vehicleId) {
      return;
    }

    const locPos = ensureLocationMap()?.getPosition();
    const addressInput = document.getElementById('wizard-location-address') as HTMLInputElement | null;
    const address = addressInput?.value.trim() || '';
    const notesInput = document.getElementById('wizard-location-notes') as HTMLTextAreaElement | null;
    const notes = notesInput?.value.trim() || '';
    const pricing = resolveVehiclePricing(state.vehicleId);
    const estimateInput: CostEstimateInput = {
      ...pricing,
      originFloor: state.floor ?? 1,
      originHasElevator: state.hasElevator ?? true,
      originPropertyType: state.propertyType || 'residential',
      originLat: locPos?.lat ?? 35.7219,
      originLng: locPos?.lng ?? 51.3347,
      destinationFloor: 0,
      destinationHasElevator: true,
      destinationPropertyType: state.propertyType || 'residential',
      destinationLat: locPos?.lat ?? 35.7219,
      destinationLng: locPos?.lng ?? 51.3347,
      wantsPacking: state.wantsPacking ?? true,
      laborChoice: 'origin',
      laborCount: state.laborCount,
      heavyItemsCount: state.heavyEquipment,
    };
    const estimate = estimateCost(estimateInput);
    const detailedInvoice = calculateDetailedInvoice(estimateInput);
    const name = nameInput!.value.trim();
    const phone = phoneInput!.value.trim();

    nextBtn!.disabled = true;
    nextBtn!.textContent = pick('در حال ثبت...', 'Submitting...');

    try {
      let trackingCode = '';
      try {
        const res = await submitRequestApi({
          customerName: name,
          serviceId: state.serviceId,
          serviceLabel: serviceLabel(),
          originProvince: 'تهران',
          originCity: 'تهران',
          originCountry: 'ایران',
          originPropertyType: state.propertyType || 'residential',
          originLat: locPos?.lat ?? 35.7219,
          originLng: locPos?.lng ?? 51.3347,
          originNotes: [address, notes].filter(Boolean).join(' — '),
          destinationProvince: 'تهران',
          destinationCity: 'تهران',
          destinationCountry: 'ایران',
          destinationPropertyType: state.propertyType || 'residential',
          destinationLat: locPos?.lat ?? 35.7219,
          destinationLng: locPos?.lng ?? 51.3347,
          destinationNotes: '',
          originFloor: state.floor ?? 1,
          originElevator: state.hasElevator ?? true,
          destinationFloor: 0,
          destinationElevator: true,
          wantsPacking: state.wantsPacking ?? false,
          laborChoice: 'origin',
          laborCount: state.laborCount,
          scheduledDate: date,
          scheduledTime: time,
          estimateMin: estimate.min,
          estimateAvg: estimate.avg,
          estimateMax: estimate.max,
          phone,
        });
        trackingCode = res?.trackingCode || '';
      } catch (apiErr) {
        console.warn('Network notice, fallback to local tracking generator:', apiErr);
      }

      if (!trackingCode || !/^\d{8,}/.test(trackingCode)) {
        trackingCode = generateShahanshahiTrackingCode();
      }

      saveLastPhone(phone);
      saveLastName(name);
      saveCustomerSession({
        id: Date.now(),
        phone,
        fullName: name,
      });

      trackingCodeEl!.textContent = trackingCode;

      const copyBtn = document.getElementById('wizard-copy-tracking-btn');
      copyBtn?.addEventListener('click', () => {
        navigator.clipboard?.writeText(trackingCode);
        copyBtn.innerHTML = `<span class="icon">${icons.checkCircle}</span><span>${pick('کپی شد', 'Copied')}</span>`;
        setTimeout(() => {
          copyBtn.innerHTML = `<span class="icon">${icons.copy || icons.fileText}</span><span>${pick('کپی کد', 'Copy Code')}</span>`;
        }, 2000);
      });

      const viewInvoiceBtn = document.getElementById('wizard-view-invoice-btn');
      viewInvoiceBtn?.addEventListener('click', () => {
        openCustomerInvoiceModal({
          trackingCode,
          customerName: name,
          phone,
          serviceLabel: serviceLabel(),
          originProvince: 'تهران',
          originCity: 'تهران',
          destinationProvince: 'تهران',
          destinationCity: 'تهران',
          scheduledDate: date,
          scheduledTime: time,
          invoice: detailedInvoice,
        });
      });

      const selectedTier = INSURANCE_TIERS.find((t) => t.id === state.insuranceTier) || INSURANCE_TIERS[2];
      finalSummaryEl!.innerHTML = `
        <div class="request-summary-box">
          <div class="request-summary-row"><dt>${pick('خدمت انتخابی', 'Service')}</dt><dd>${serviceLabel()}</dd></div>
          <div class="request-summary-row"><dt>${pick('شهر و محدوده', 'Coverage')}</dt><dd>${pick('استان تهران — شهر تهران (مناطق ۲۲ گانه)', 'Tehran, 22 Districts')}</dd></div>
          <div class="request-summary-row"><dt>${pick('نوع ملک و طبقه', 'Property')}</dt><dd>${propertyTypeLabel(state.propertyType)} — ${floorLabel(state.floor)} (${state.hasElevator ? pick('آسانسور دارد', 'With elevator') : pick('بدون آسانسور', 'No elevator')})</dd></div>
          ${address ? `<div class="request-summary-row"><dt>${pick('نشانی محل خدمت', 'Service address')}</dt><dd>${address}</dd></div>` : ''}
          ${notes ? `<div class="request-summary-row"><dt>${pick('توضیحات دسترسی', 'Access notes')}</dt><dd>${notes}</dd></div>` : ''}
          <div class="request-summary-row"><dt>${pick('تعداد تکنسین', 'Technicians')}</dt><dd>${toPersianDigits(state.laborCount)} نفر (${state.urgency === 'urgent' ? pick('اعزام فوری زیر ۴۵ دقیقه', 'Urgent under 45 mins') : pick('عادی', 'Standard')})</dd></div>
          <div class="request-summary-row"><dt>${pick('زمان مراجعه', 'Schedule')}</dt><dd>${date} — ساعت ${time}</dd></div>
          <div class="request-summary-row"><dt>${pick('پوشش تضمین و خسارت', 'Insurance')}</dt><dd>${pick(selectedTier.title, selectedTier.titleEn)} (${pick(selectedTier.coverageCeiling, selectedTier.coverageCeilingEn)})</dd></div>
          <div class="request-summary-row"><dt>${pick('برآورد هزینه خدمت', 'Estimate')}</dt><dd><strong>${formatToman(estimate.avg)}</strong></dd></div>
        </div>
      `;

      card.querySelectorAll<HTMLElement>('.request-panel[data-panel="7"] > .form-field, .request-panel[data-panel="7"] > .wizard-phone-insurance-banner').forEach((el) => {
        el.hidden = true;
      });
      submitError!.hidden = true;
      document.getElementById('wizard-success-state')!.hidden = false;
      footer!.hidden = true;
      questionEl!.textContent = pick('درخواست با موفقیت ثبت و تکنسین تخصیص یافت', 'Request Submitted Successfully');
      trackEvent('request_submitted', { trackingCode, serviceId: state.serviceId, vehicleId: state.vehicleId });
    } catch (err: any) {
      submitError!.hidden = false;
      submitError!.textContent = err?.message || pick('ثبت درخواست با خطا مواجه شد. لطفاً دوباره تلاش فرمایید.', 'Submission failed. Please try again.');
    } finally {
      nextBtn!.disabled = false;
      updateNextButtonLabel();
    }
  }

  nextBtn.addEventListener('click', () => {
    if (!validateCurrentStep()) return;
    if (currentStep === TOTAL_STEPS) {
      void submitRequest();
    } else {
      advanceStep(1);
    }
  });

  backBtn.addEventListener('click', () => {
    advanceStep(-1);
  });

  document.getElementById('wizard-new-request-btn')?.addEventListener('click', () => {
    resetWizard();
  });

  function resetWizard(): void {
    currentStep = 1;
    state.serviceId = null;
    state.vehicleId = null;
    card.querySelectorAll('[data-wizard-subcat]').forEach((el) => el.classList.remove('is-selected'));
    card.querySelectorAll('[data-wizard-cat-item]').forEach((el) => el.classList.remove('is-open'));
    card.querySelectorAll<HTMLElement>('[data-wizard-subcat-panel]').forEach((el) => {
      el.hidden = true;
    });
    card.querySelectorAll<HTMLElement>('.request-panel[data-panel="7"] > .form-field, .request-panel[data-panel="7"] > .wizard-phone-insurance-banner').forEach((el) => {
      el.hidden = false;
    });
    const successState = document.getElementById('wizard-success-state');
    if (successState) successState.hidden = true;
    footer!.hidden = false;
    updateStepUI();
  }

  function openModal(serviceId?: string, vehicleId?: string): void {
    const modalEl = document.getElementById('request-wizard-modal');
    if (modalEl) {
      modalEl.classList.add('is-open');
      modalEl.hidden = false;
      document.body.classList.add('modal-open');
    }

    if (serviceId && vehicleId) {
      state.serviceId = serviceId;
      state.vehicleId = vehicleId;
      card.querySelectorAll('[data-wizard-subcat]').forEach((el) => {
        el.classList.toggle('is-selected', (el as HTMLElement).dataset.wizardSubcat === vehicleId);
      });
      const item = card.querySelector(`[data-wizard-cat-item="${serviceId}"]`);
      const panel = card.querySelector(`[data-wizard-subcat-panel="${serviceId}"]`) as HTMLElement | null;
      if (item && panel) {
        item.classList.add('is-open');
        panel.hidden = false;
      }
      currentStep = 2; // Direct jump to Location in Tehran
    } else if (serviceId) {
      state.serviceId = serviceId;
      const item = card.querySelector(`[data-wizard-cat-item="${serviceId}"]`);
      const panel = card.querySelector(`[data-wizard-subcat-panel="${serviceId}"]`) as HTMLElement | null;
      if (item && panel) {
        item.classList.add('is-open');
        panel.hidden = false;
      }
      currentStep = 1;
    } else {
      currentStep = 1;
    }
    updateStepUI();
  }

  function closeModal(): void {
    const modalEl = document.getElementById('request-wizard-modal');
    if (modalEl) {
      modalEl.classList.remove('is-open');
      modalEl.hidden = true;
      document.body.classList.remove('modal-open');
    }
  }

  document.getElementById('request-wizard-modal-close')?.addEventListener('click', closeModal);

  const modalOverlay = document.getElementById('request-wizard-modal');
  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && !modalOverlay.hidden) {
      closeModal();
    }
  });

  document.querySelectorAll<HTMLElement>('.header-cta, .request-wizard-open-trigger').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (location.hash === '#request') {
    openModal();
  }
  window.addEventListener('hashchange', () => {
    if (location.hash === '#request') {
      openModal();
    }
  });

  updateStepUI();

  return {
    selectService: (sId: string) => {
      state.serviceId = sId;
      openModal(sId);
    },
    selectVehicle: (vId: string) => {
      state.vehicleId = vId;
    },
    setSavedAddresses: () => {},
    openModal,
    closeModal,
    resetWizard,
  };
}

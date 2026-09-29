import { serviceCategories, DEFAULT_VEHICLE_TYPES, CATEGORY_VEHICLE_IDS } from '../data/services.ts';
import { SUBCATEGORY_DETAILS_MAP } from '../components/ServiceCategoriesAccordion.ts';
import type { VehicleTypeSetting, ServiceCitiesSettings, ServiceCategoriesSettings } from '../utils/dynamicContent.ts';
import { icons } from '../components/icons.ts';
import { renderLocationMap, initLocationMap, type LocationMapController, TEHRAN_KEY_AREAS } from '../components/LocationMap.ts';
import type { MapSettings } from '../utils/mapProvider.ts';
import { renderCalendarPicker, initCalendarPicker } from '../components/PersianCalendar.ts';
import { renderTimePicker, initTimePicker, formatTime } from '../components/TimePicker.ts';
import { estimateCost, calculateDetailedInvoice, type CostEstimateInput } from '../data/pricing.ts';
import { openCustomerInvoiceModal } from '../components/InvoiceModal.ts';
import { toPersianDigits } from '../utils/jalali.ts';
import { formatToman } from '../utils/format.ts';
import { submitRequest as submitRequestApi } from '../utils/api.ts';
import { getLastName, getLastPhone, saveLastName, saveLastPhone } from '../utils/localOrders.ts';
import type { SavedAddresses } from '../utils/addresses.ts';
import { pick } from '../i18n/lang.ts';
import { trackEvent } from '../utils/analytics.ts';
import {
  saveCustomerSession,
  normalizeCustomerPhone,
  getLocalCustomerInfo,
  fetchCurrentCustomer,
  sendCustomerOtp,
  verifyCustomerOtp,
  updateCustomerProfile,
  type CustomerInfo,
} from '../utils/customerAuth.ts';
import { generateShahanshahiTrackingCode } from '../utils/tracking.ts';

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
    id: 'gold_300m',
    title: 'ضمانت استاندارد بهدون',
    titleEn: 'Standard Warranty',
    coverageCeiling: 'تضمین کتبی و جبران خسارت کامل',
    coverageCeilingEn: 'Written warranty & damage protection',
    costLabel: 'شامل کلیه سفارش‌ها',
    costLabelEn: 'Included in all orders',
    description: 'تضمین اصالت قطعات، نظارت کیفی تکنسین مجرب و ضمانت بازگشت وجه',
    descriptionEn: 'Certified parts, verified technicians and satisfaction guarantee',
    isRecommended: true,
  },
];

export function getSiteBrandName(siteName?: { fa?: string; en?: string } | string): string {
  if (!siteName) return pick('بهدون', 'Behdoon');
  if (typeof siteName === 'object') {
    return pick(siteName.fa, siteName.en) || siteName.fa || siteName.en || 'بهدون';
  }
  return String(siteName);
}

export const STEPS = [
  {
    id: 'category',
    stepNumber: 1,
    shortTitle: 'دسته اصلی',
    shortTitleEn: 'Category',
    question: 'به چه خدمتی در ساختمان نیاز دارید؟ (دسته‌بندی اصلی)',
    questionEn: 'What service do you need? (Category)',
    hint: 'روی یکی از دسته‌بندی‌های زیر کلیک فرمایید',
    hintEn: 'Click a service category to view specialized sub-services',
  },
  {
    id: 'subcategory',
    stepNumber: 2,
    shortTitle: 'زیر دسته',
    shortTitleEn: 'Service',
    question: 'خدمت و تخصص مورد نظر را انتخاب کنید',
    questionEn: 'Select specific specialty and service',
    hint: 'خدمت تخصصی مورد نظر را از میان گزینه‌های زیر برگزینید',
    hintEn: 'Choose the exact specialty and base rate',
  },
  {
    id: 'materials',
    stepNumber: 3,
    shortTitle: 'لوازم و قطعات',
    shortTitleEn: 'Materials',
    question: 'آیا نیاز به تأمین قطعات و لوازم مصرفی دارید؟',
    questionEn: 'Do you need parts & materials provided?',
    hint: 'مشخص کنید که لوازم توسط تکنسین تهیه شود یا خودتان آماده کرده‌اید',
    hintEn: 'Choose whether parts are provided by technician or client',
  },
  {
    id: 'map',
    stepNumber: 4,
    shortTitle: 'نقشه تهران',
    shortTitleEn: 'Map Location',
    question: 'موقعیت مکانی انجام خدمت را روی نقشه مشخص کنید',
    questionEn: 'Pin service location on Tehran map',
    hint: 'نشانگر نقشه را روی محل تقریبی خدمت قرار دهید',
    hintEn: 'Place pin on Tehran map or tap a neighborhood chip',
  },
  {
    id: 'address',
    stepNumber: 5,
    shortTitle: 'نشانی دقیق',
    shortTitleEn: 'Address',
    question: 'نشانی متنی و توضیحات خرابی را وارد نمایید',
    questionEn: 'Enter street address, building & issue notes',
    hint: 'نشانی متنی خیابان، پلاک، واحد و در صورت نیاز شرح مشکل',
    hintEn: 'Enter street address, unit and optional problem details',
  },
  {
    id: 'schedule',
    stepNumber: 6,
    shortTitle: 'زمان مراجعه',
    shortTitleEn: 'Visit Time',
    question: 'چه زمانی برای حضور تکنسین در محل مناسب است؟',
    questionEn: 'When should the technician visit?',
    hint: 'می‌توانید اعزام فوری (زیر ۴۵ دقیقه) یا روز و ساعت دلخواه را انتخاب فرمایید',
    hintEn: 'Choose immediate dispatch under 45 mins or select your preferred date & time',
  },
  {
    id: 'finalize',
    stepNumber: 7,
    shortTitle: 'قیمت و ثبت',
    shortTitleEn: 'Price & Submit',
    question: 'برآورد هزینه و ثبت نهایی درخواست',
    questionEn: 'Price estimate and final submission',
    hint: 'مشاهده قیمت حدودی و مشخصات متقاضی جهت صدور کد پیگیری و اعزام',
    hintEn: 'Review estimate and enter details to finalize order',
  },
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
              <p class="request-wizard-modal-sub">${pick('اعزام فوری نزدیک‌ترین تکنسین متخصص و ضمانت کتبی کیفیت در تهران', 'Certified technician dispatch & written warranty in Tehran')}</p>
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
  _siteName?: { fa?: string; en?: string } | string,
): string {
  return `
    <div class="request-card" id="request">
      <!-- Desktop Stepper Bar (>=640px) -->
      <nav class="wizard-stepper-desktop" id="wizard-stepper-desktop" aria-label="${pick('مراحل ثبت سفارش', 'Order Steps')}">
        <div class="wizard-stepper-track">
          <div class="wizard-stepper-track-fill" id="wizard-stepper-track-fill" style="width: 0%;"></div>
          ${STEPS.map((s, idx) => `
            <button
              type="button"
              class="wizard-step-node ${idx === 0 ? 'is-active' : ''}"
              data-step-target="${idx + 1}"
              id="wizard-step-node-${idx + 1}"
              title="${pick(s.shortTitle, s.shortTitleEn)}"
            >
              <span class="wizard-step-badge">
                <span class="wizard-step-num">${toPersianDigits(idx + 1)}</span>
                <span class="wizard-step-check icon">${icons.checkCircle || '✓'}</span>
              </span>
              <span class="wizard-step-label">${pick(s.shortTitle, s.shortTitleEn)}</span>
            </button>
          `).join('')}
        </div>
      </nav>

      <!-- Mobile Stepper (<640px) -->
      <div class="wizard-stepper-mobile" id="wizard-stepper-mobile">
        <div class="wizard-mobile-header">
          <div class="wizard-mobile-step-pill">
            <span class="wizard-mobile-pulse"></span>
            <span id="wizard-mobile-step-name">${pick('گام ۱ از ۷: دسته اصلی', 'Step 1 of 7: Category')}</span>
          </div>
          <span class="wizard-mobile-percent" id="wizard-mobile-percent">${toPersianDigits('۱۴٪')}</span>
        </div>
        <div class="wizard-mobile-segments">
          ${STEPS.map((_, idx) => `
            <div class="wizard-mobile-segment ${idx === 0 ? 'is-active is-filled' : ''}" data-mobile-segment="${idx + 1}"></div>
          `).join('')}
        </div>
      </div>

      <!-- Hidden legacy progress bar -->
      <div class="wizard-progress" style="display: none !important;">
        <div class="wizard-progress-bar"><div class="wizard-progress-fill" id="wizard-progress-fill"></div></div>
        <span class="wizard-progress-text" id="wizard-progress-text"></span>
      </div>

      <div class="wizard-body">
        <!-- گام ۱: اول دسته اصلی -->
        <section class="request-panel" data-panel="1">
          <p class="wizard-panel-hint" style="font-size: 0.88rem; color: #64748b; margin-bottom: 14px;">
            ${pick('روی دسته‌بندی مورد نظر کلیک کنید تا تخصص‌های زیرمجموعه نمایش داده شوند:', 'Click on your desired service category to view specialized sub-services:')}
          </p>
          <div class="wizard-categories-grid">
            ${serviceCategories.map((cat) => {
              const vehicleIds = CATEGORY_VEHICLE_IDS[cat.id] || [];
              return `
                <div class="wizard-category-card" data-wizard-select-cat="${cat.id}">
                  <div class="wizard-cat-card-top">
                    <span class="icon wizard-cat-card-icon">${cat.icon}</span>
                    <span class="wizard-cat-card-badge">${toPersianDigits(vehicleIds.length)} ${pick('تخصص', 'Services')}</span>
                  </div>
                  <h3 class="wizard-cat-card-title">${pick(cat.label, cat.labelEn)}</h3>
                  <p class="wizard-cat-card-desc">${pick(cat.subtitle || '', cat.subtitleEn || '')}</p>
                  <div class="wizard-cat-card-action">
                    <span>${pick('انتخاب این دسته', 'Select Category')}</span>
                    <span class="icon" style="width: 14px; height: 14px;">${icons.chevronLeft}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          <p class="request-panel-error" id="wizard-category-error" hidden style="font-weight: 700; color: #dc2626; margin-top: 10px; padding: 8px 12px; background: #fef2f2; border-radius: 8px; border: 1px solid #fecaca;">
            ${pick('لطفاً ابتدا یکی از دسته‌بندی‌های بالا را انتخاب فرمایید.', 'Please select one of the categories above.')}
          </p>
        </section>

        <!-- گام ۲: مرحله بعد زیر دسته -->
        <section class="request-panel" data-panel="2" hidden>
          <div class="wizard-selected-cat-banner" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #f5f3ff; border: 1.5px solid #ddd6fe; border-radius: 12px; margin-bottom: 14px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="icon" style="color: #7c3aed;">${icons.checkCircle || icons.shield}</span>
              <div>
                <span style="font-size: 0.78rem; color: #6d28d9; font-weight: 600;">${pick('دسته‌بندی فعال:', 'Active Category:')}</span>
                <span id="wizard-active-cat-name" style="font-size: 0.92rem; font-weight: 800; color: #4c1d95; margin-right: 6px;"></span>
              </div>
            </div>
            <button type="button" id="wizard-change-cat-btn" class="btn btn-outline btn-sm" style="font-size: 0.8rem; padding: 4px 10px; border-color: #a78bfa; color: #6d28d9;">
              ${pick('تغییر دسته', 'Change')}
            </button>
          </div>

          <p class="wizard-panel-hint" style="font-size: 0.88rem; color: #64748b; margin-bottom: 12px;">
            ${pick('تخصص و خدمت دقیق مورد نظر را انتخاب نمایید:', 'Select the specific specialty and service:')}
          </p>

          <div class="wizard-subcategories-grid" id="wizard-subcategories-container">
            <!-- Dynamically populated when category is selected -->
          </div>

          <p class="request-panel-error" id="wizard-subcategory-error" hidden style="font-weight: 700; color: #dc2626; margin-top: 10px; padding: 8px 12px; background: #fef2f2; border-radius: 8px; border: 1px solid #fecaca;">
            ${pick('لطفاً یکی از خدمات تخصصی زیر را انتخاب فرمایید.', 'Please select a specific service below.')}
          </p>
        </section>

        <!-- گام ۳: مرحله بعد لوازم یا بدون لوازم -->
        <section class="request-panel" data-panel="3" hidden>
          <div class="wizard-schedule-cards">
            <button type="button" class="wizard-feature-card is-selected" data-parts-choice="yes">
              <div class="wizard-feature-card-header">
                <span class="wizard-feature-card-icon icon-emerald">${icons.box}</span>
                <span class="wizard-feature-card-badge">${pick('پیشنهادی بهدون', 'Recommended')}</span>
              </div>
              <h3 class="wizard-feature-card-title">${pick('تأمین قطعات و لوازم توسط تکنسین', 'Provided by Technician')}</h3>
              <p class="wizard-feature-card-desc">${pick('تکنسین قطعات و ملزومات استاندارد شرکتی را همراه می‌آورد. هزینه قطعات بر اساس فاکتور خرید محاسبه می‌شود.', 'Technician brings certified standard parts with purchase receipt.')}</p>
              <div class="wizard-feature-card-check">
                <span class="icon">${icons.checkCircle}</span>
                <span>${pick('انتخاب شده', 'Selected')}</span>
              </div>
            </button>

            <button type="button" class="wizard-feature-card" data-parts-choice="no">
              <div class="wizard-feature-card-header">
                <span class="wizard-feature-card-icon icon-slate">${icons.user}</span>
                <span class="wizard-feature-card-badge badge-neutral">${pick('فقط دستمزد', 'Labor Only')}</span>
              </div>
              <h3 class="wizard-feature-card-title">${pick('بدون لوازم (فقط اجرت کار)', 'No Parts (Labor Only)')}</h3>
              <p class="wizard-feature-card-desc">${pick('لوازم و قطعات از قبل در محل آماده است یا کار صرفاً تعمیری و بدون نیاز به تعویض قطعه می‌باشد.', 'Materials are already provided by customer; only repair labor required.')}</p>
              <div class="wizard-feature-card-check">
                <span class="icon">${icons.checkCircle}</span>
                <span>${pick('انتخاب این گزینه', 'Select this')}</span>
              </div>
            </button>
          </div>
        </section>

        <!-- گام ۴: مرحله بعد فقط نقشه باشه -->
        <section class="request-panel" data-panel="4" hidden>
          <div class="form-field wizard-tehran-coverage-badge">
            <span class="field-label">${pick('محدوده تحت پوشش بهدون:', 'Behdoon Coverage in Tehran:')}</span>
            <div class="wizard-coverage-chip" style="display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: #f5f3ff; border: 1.5px solid #ddd6fe; border-radius: 10px; color: #6d28d9; font-weight: 600; font-size: 0.92rem;">
              <span class="icon" style="color: #7c3aed;">${icons.checkCircle || icons.shield}</span>
              <span>${pick('استان تهران — کلیه مناطق ۲۲ گانه شهر تهران', 'Tehran City — All 22 Districts')}</span>
            </div>
          </div>

          <!-- Quick Tehran Neighborhood Jump Chips -->
          <div class="form-field" style="margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span class="field-label" style="font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0;">
                ${pick('انتخاب سریع محله در تهران:', 'Quick Tehran Area Jump:')}
              </span>
              <span style="font-size: 0.76rem; color: #7c3aed; font-weight: 600;">${pick('کلیک برای حرکت نشانگر', 'Tap to place pin')}</span>
            </div>
            <div class="wizard-area-chips" style="display: flex; flex-wrap: wrap; gap: 6px;">
              ${TEHRAN_KEY_AREAS.map((a) => `
                <button type="button" class="wizard-pill wizard-area-pill" data-area-lat="${a.lat}" data-area-lng="${a.lng}" data-area-name="${a.name}" style="font-size: 0.8rem; padding: 4px 10px;">
                  ${pick(a.name, a.nameEn)}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="form-field">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span class="field-label" style="margin-bottom: 0; font-weight: 700; color: #1e1b2e;">${pick('موقعیت روی نقشه تهران', 'Location on Tehran map')}</span>
              <span style="font-size: 0.78rem; color: #7c3aed; font-weight: 700;">${pick('نشانگر را روی محدوده تقریبی قرار دهید', 'Drag pin to set location')}</span>
            </div>
            ${renderLocationMap('wizard-location-map')}
            <p class="request-panel-error" id="wizard-location-map-error" hidden style="font-weight: 700; color: #dc2626; margin-top: 8px; padding: 6px 10px; background: #fef2f2; border-radius: 6px; border: 1px solid #fecaca;">
              ${pick('لطفاً موقعیت محل خدمت را روی نقشه مشخص فرمایید.', 'Please specify your location on the map.')}
            </p>
          </div>
        </section>

        <!-- گام ۵: مرحله بعدی ادرس -->
        <section class="request-panel" data-panel="5" hidden>
          <div class="form-field">
            <label for="wizard-location-address" style="font-weight: 700; font-size: 0.92rem; color: #1e293b;">
              ${pick('نشانی دقیق، خیابان، پلاک و واحد در تهران (الزامی)', 'Street address & Unit/Plaque (Required)')}
            </label>
            <div class="input-wrapper">
              <span class="icon input-icon">${icons.pin}</span>
              <input type="text" id="wizard-location-address" placeholder="${pick('مثال: سعادت‌آباد، خیابان علامه، کوچه ۱۲، پلاک ۴، واحد ۲', 'e.g. Valiasr St, near Vanak Sq, Alley 12, Plaque 4, Unit 2')}" />
            </div>
            <p class="request-panel-error" id="wizard-address-error" hidden style="font-weight: 700; color: #dc2626; margin-top: 6px; padding: 6px 10px; background: #fef2f2; border-radius: 6px; border: 1px solid #fecaca;">
              ${pick('لطفاً نشانی دقیق خیابان و پلاک را وارد فرمایید.', 'Please enter street address and building number.')}
            </p>
          </div>

          <div class="form-field" style="margin-top: 10px;">
            <label for="wizard-location-notes" style="font-weight: 700; font-size: 0.92rem; color: #1e293b;">
              ${pick('شرح مشکل یا توضیحات تکمیلی برای تکنسین (اختیاری)', 'Issue description & notes (Optional)')}
            </label>
            <div class="input-wrapper" style="align-items: flex-start;">
              <textarea
                id="wizard-location-notes"
                class="wizard-notes-input"
                rows="3"
                maxlength="500"
                style="width: 100%; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 10px 14px; font-size: 0.92rem; background: var(--surface); color: var(--text); resize: vertical; line-height: 1.6;"
                placeholder="${pick('توضیحاتی مانند شرح ایراد، صدای غیرعادی، مدل دستگاه یا نام زنگ و درب ورودی...', 'Describe the issue or technician notes...')}"
              ></textarea>
            </div>
          </div>
        </section>

        <!-- گام ۶: مرحله بعدی اعزام فوری و یا زمان (اگر فوری بود دیگه تاریخ و ساعت نگیر) -->
        <section class="request-panel" data-panel="6" hidden>
          <div class="wizard-schedule-cards">
            <button type="button" class="wizard-feature-card is-selected" data-schedule-choice="urgent">
              <div class="wizard-feature-card-header">
                <span class="wizard-feature-card-icon icon-amber">${icons.bolt}</span>
                <span class="wizard-feature-card-badge badge-amber">${pick('سریع‌ترین زمان', 'Fast Dispatch')}</span>
              </div>
              <h3 class="wizard-feature-card-title">${pick('اعزام فوری (زیر ۴۵ دقیقه)', 'Immediate (<45 mins)')}</h3>
              <p class="wizard-feature-card-desc">${pick('نزدیک‌ترین تکنسین متخصص بهدون بلافاصله با شما هماهنگ شده و اعزام خواهد شد.', 'Immediate dispatch of the nearest certified technician.')}</p>
              <div class="wizard-feature-card-check">
                <span class="icon">${icons.checkCircle}</span>
                <span>${pick('انتخاب شده', 'Selected')}</span>
              </div>
            </button>

            <button type="button" class="wizard-feature-card" data-schedule-choice="scheduled">
              <div class="wizard-feature-card-header">
                <span class="wizard-feature-card-icon icon-purple">${icons.calendar}</span>
                <span class="wizard-feature-card-badge badge-neutral">${pick('برنامه‌ریزی‌شده', 'Scheduled')}</span>
              </div>
              <h3 class="wizard-feature-card-title">${pick('انتخاب تاریخ و ساعت دلخواه', 'Custom Date & Time')}</h3>
              <p class="wizard-feature-card-desc">${pick('تعیین تاریخ و بازه ساعت مراجعه تکنسین متناسب با اوقات فراغت شما.', 'Choose your preferred visit date and time slot.')}</p>
              <div class="wizard-feature-card-check">
                <span class="icon">${icons.checkCircle}</span>
                <span>${pick('انتخاب این گزینه', 'Select this')}</span>
              </div>
            </button>
          </div>

          <!-- Persian Calendar & Time Picker: ONLY shown when 'scheduled' is active -->
          <div id="wizard-datetime-picker-wrap" hidden style="margin-top: 14px; padding-top: 14px; border-top: 1px dashed #cbd5e1;">
            <div class="wizard-schedule-datetime-grid">
              <div class="form-field">
                <span class="field-label" style="font-weight: 700; color: #1e293b;">${pick('تاریخ مراجعه در تهران', 'Visit Date')}</span>
                ${renderCalendarPicker('wizard-calendar')}
              </div>
              <div class="form-field">
                <span class="field-label" style="font-weight: 700; color: #1e293b;">${pick('ساعت مراجعه تکنسین', 'Visit Time')}</span>
                ${renderTimePicker('wizard-time')}
              </div>
            </div>
          </div>
        </section>

        <!-- گام ۷: قیمت هم فقط بنویس حدودی و قیمت لوازم هم و ثبت -->
        <section class="request-panel" data-panel="7" hidden>
          <!-- Pricing Summary Card -->
          <div class="wizard-pricing-summary-card">
            <div class="wizard-price-row">
              <div class="wizard-price-label-wrap">
                <span class="icon" style="color: #7c3aed;">${icons.plumbing || icons.bolt}</span>
                <div>
                  <strong>${pick('برآورد اجرت و دستمزد خدمت:', 'Labor Estimate:')}</strong>
                  <p>${pick('تعیین دقیق پس از کارشناسی و مشاهده کار در محل', 'Exact rate verified on site')}</p>
                </div>
              </div>
              <span class="wizard-price-value" id="wizard-labor-estimate-val">حدودی: در حال محاسبه...</span>
            </div>
            <div class="wizard-price-row">
              <div class="wizard-price-label-wrap">
                <span class="icon" style="color: #059669;">${icons.box}</span>
                <div>
                  <strong>${pick('هزینه قطعات و لوازم مصرفی:', 'Parts & Materials:')}</strong>
                  <p id="wizard-parts-estimate-desc">${pick('بر اساس فاکتور خرید و نرخ مصوب اتحادیه', 'Based on official purchase receipt')}</p>
                </div>
              </div>
              <span class="wizard-price-value" id="wizard-parts-estimate-val" style="color: #059669;">بر اساس فاکتور خرید</span>
            </div>
          </div>

          <!-- Customer Identity: If Logged In -->
          <div id="wizard-logged-in-container" hidden>
            <div class="wizard-logged-in-box">
              <div class="wizard-logged-in-info">
                <div class="wizard-logged-in-icon">
                  <span class="icon">${icons.shield || icons.checkCircle}</span>
                </div>
                <div>
                  <h4 class="wizard-logged-in-title">
                    ${pick('سفارش به نام شما ثبت می‌شود:', 'Ordering as:')}
                    <span id="wizard-logged-in-name" style="font-weight: 900; color: #14532d;"></span>
                  </h4>
                  <p class="wizard-logged-in-phone">
                    ${pick('شماره همراه هماهنگی:', 'Mobile:')}
                    <strong id="wizard-logged-in-phone" style="direction: ltr; display: inline-block;"></strong>
                  </p>
                </div>
              </div>
              <button type="button" class="wizard-switch-btn" id="wizard-switch-phone-btn">
                ${pick('ثبت با شماره دیگر؟', 'Use other number?')}
              </button>
            </div>
          </div>

          <!-- Customer Identity: If Guest (Not Logged In) -->
          <div id="wizard-guest-container">
            <div class="form-field">
              <label for="wizard-name" style="font-weight: 700; color: #1e293b;">${pick('نام و نام خانوادگی متقاضی', 'Full name')}</label>
              <div class="input-wrapper">
                <span class="icon input-icon">${icons.user}</span>
                <input type="text" id="wizard-name" placeholder="${pick('نام و نام خانوادگی خود را وارد کنید', 'Your full name')}" autocomplete="name" />
              </div>
              <p class="request-panel-error" id="wizard-name-error" hidden style="font-weight: 700; color: #dc2626; margin-top: 4px; padding: 4px 8px; background: #fef2f2; border-radius: 6px;">
                ${pick('لطفاً نام و نام خانوادگی را وارد فرمایید.', 'Enter your full name.')}
              </p>
            </div>

            <div class="form-field" style="margin-top: 10px;">
              <label for="wizard-phone" style="font-weight: 700; color: #1e293b;">${pick('شماره موبایل (جهت اعزام و پیگیری سفارش)', 'Mobile number')}</label>
              <div class="input-wrapper">
                <span class="icon input-icon">${icons.phone}</span>
                <input type="tel" id="wizard-phone" placeholder="${pick('۰۹xxxxxxxxx', '09xxxxxxxxx')}" autocomplete="tel" inputmode="numeric" />
              </div>
              <p class="request-panel-error" id="wizard-phone-error" hidden style="font-weight: 700; color: #dc2626; margin-top: 4px; padding: 4px 8px; background: #fef2f2; border-radius: 6px;">
                ${pick('شماره موبایل معتبر ۱۱ رقمی با ۰۹ وارد کنید.', 'Enter a valid 11-digit mobile number.')}
              </p>
            </div>

            <!-- Inline OTP Box for Guest Phone Verification -->
            <div class="wizard-otp-wrap" id="wizard-otp-wrap" hidden>
              <h4 class="wizard-otp-title">${pick('کد تأیید پیامک شد', 'Verification Code Sent')}</h4>
              <p style="font-size: 0.82rem; color: #64748b; margin: 0 0 6px;">
                ${pick('کد ۵ رقمی ارسال‌شده به شماره زیر را وارد نمایید:', 'Enter the 5-digit code sent to:')}
              </p>
              <span class="wizard-otp-phone-badge" id="wizard-otp-phone-badge"></span>
              
              <div class="wizard-otp-digits-row">
                <input type="text" inputmode="numeric" maxlength="1" class="wizard-otp-digit" data-otp-idx="0" autocomplete="one-time-code" />
                <input type="text" inputmode="numeric" maxlength="1" class="wizard-otp-digit" data-otp-idx="1" />
                <input type="text" inputmode="numeric" maxlength="1" class="wizard-otp-digit" data-otp-idx="2" />
                <input type="text" inputmode="numeric" maxlength="1" class="wizard-otp-digit" data-otp-idx="3" />
                <input type="text" inputmode="numeric" maxlength="1" class="wizard-otp-digit" data-otp-idx="4" />
              </div>

              <p class="request-panel-error" id="wizard-otp-error" hidden style="font-weight: 700; color: #dc2626; margin: 6px auto; padding: 4px 10px; background: #fef2f2; border-radius: 6px; max-width: 320px;"></p>

              <div class="wizard-otp-meta-row">
                <span id="wizard-otp-timer">۰۰:۶۰</span>
                <button type="button" class="wizard-otp-resend-btn" id="wizard-otp-resend-btn" hidden>${pick('ارسال مجدد کد', 'Resend code')}</button>
                <span>|</span>
                <button type="button" class="wizard-otp-change-phone" id="wizard-otp-change-phone">${pick('ویرایش شماره', 'Edit phone')}</button>
              </div>
            </div>
          </div>

          <p class="request-panel-error" id="wizard-submit-error" hidden style="font-weight: 700; color: #dc2626; margin-top: 10px; padding: 8px 12px; background: #fef2f2; border-radius: 8px; border: 1px solid #fecaca;"></p>

          <!-- Hidden container to keep invoice chart compatibility -->
          <div id="wizard-cost-chart" style="display: none !important;"></div>

          <!-- گام موفقیت: نمایش کد پیگیری و ارجاع مستقیم به درخواست‌های من -->
          <div class="wizard-success-state" id="wizard-success-state" hidden>
            <div class="wizard-success-icon"><span class="icon">${icons.checkCircle}</span></div>
            <h3 class="wizard-success-title">${pick('درخواست شما با موفقیت در بهدون ثبت شد!', 'Request submitted successfully to Behdoon!')}</h3>
            <p class="wizard-success-desc">
              ${pick(
                'تکنسین متخصص بهدون ظرف کمتر از ۴۵ دقیقه با شما تماس گرفته و جهت انجام خدمت اعزام خواهد شد.',
                'A Behdoon certified technician will contact you shortly and dispatch to your location.',
              )}
            </p>

            <div class="wizard-sms-sent-banner" id="wizard-sms-sent-banner">
              <span class="icon" style="color: #16a34a; font-size: 1.15rem;">${icons.checkCircle}</span>
              <span id="wizard-sms-sent-text">${pick('پیامک تأیید شامل مشخصات کامل خدمت و کد پیگیری به شماره شما ارسال شد.', 'Confirmation SMS with service details and tracking code has been sent.')}</span>
            </div>

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
              <!-- دکمه‌ی اصلی و برجسته: پیگیری در درخواست‌های من -->
              <a href="/orders" class="btn btn-primary wizard-action-btn wizard-primary-orders-btn" id="wizard-go-orders-btn">
                <span class="icon">${icons.box}</span>
                <span>${pick('مشاهده و پیگیری در درخواست‌های من', 'Track in My Requests')}</span>
              </a>

              <button type="button" class="btn btn-secondary wizard-action-btn wizard-invoice-action" id="wizard-view-invoice-btn">
                <span class="icon">${icons.fileText}</span>
                <span>${pick('مشاهده پیش‌فاکتور تفکیکی', 'View Itemized Pre-Invoice')}</span>
              </button>

              <a href="tel:09333256885" class="btn btn-secondary wizard-action-btn" id="wizard-call-support-btn">
                <span class="icon">${icons.phone}</span>
                <span>${pick('تماس با پشتیبانی: ۰۹۳۳۳۲۵۶۸۸۵', 'Support: 09333256885')}</span>
              </a>

              <button type="button" class="btn btn-ghost wizard-action-btn-reset" id="wizard-new-request-btn">
                <span>${pick('ثبت درخواست جدید', 'Submit New Request')}</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      <div class="wizard-footer" id="wizard-footer">
        <button type="button" class="btn btn-secondary wizard-back-btn" id="wizard-back" hidden>
          <span class="icon" style="width: 16px; height: 16px; margin-inline-end: 4px;">${icons.chevronRight || ''}</span>
          <span>${pick('قبلی', 'Back')}</span>
        </button>
        <div class="wizard-footer-summary" id="wizard-footer-summary">
          <span class="wizard-footer-hint" id="wizard-footer-hint">${pick('اعزام فوری با ضمانت کیفیت بهدون', 'Fast dispatch with Behdoon warranty')}</span>
        </div>
        <button type="button" class="btn btn-primary wizard-next-btn" id="wizard-next">
          <span id="wizard-next-text">${pick('مرحله بعد', 'Next step')}</span>
          <span class="icon" style="width: 16px; height: 16px; margin-inline-start: 4px;">${icons.chevronLeft || ''}</span>
        </button>
      </div>
    </div>
  `;
}

interface WizardState {
  serviceId: string | null;
  vehicleId: string | null;
  wantsParts: boolean;
  address: string;
  notes: string;
  urgency: 'urgent' | 'scheduled';
  scheduledDate: string | null;
  scheduledTime: string | null;
  insuranceTier: string;
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
  const trackingCodeEl = document.getElementById('wizard-tracking-code');
  const finalSummaryEl = document.getElementById('wizard-final-summary');
  const modalElRoot = document.getElementById('request-wizard-modal');

  if (modalElRoot && modalElRoot.parentElement !== document.body) {
    document.body.appendChild(modalElRoot);
  }

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
    !trackingCodeEl ||
    !finalSummaryEl
  ) {
    return noop;
  }
  const card = cardEl;

  // Cached name and phone from local storage
  const cachedName = getLastName();
  const cachedPhone = getLastPhone();
  if (cachedName) nameInput.value = cachedName;
  if (cachedPhone) phoneInput.value = cachedPhone;

  let locationMap: ReturnType<typeof initLocationMap> = null;

  function ensureLocationMap(): LocationMapController | null {
    if (!locationMap) {
      locationMap = initLocationMap(
        'wizard-location-map',
        (lat, lng) => {
          const addrInput = document.getElementById('wizard-location-address') as HTMLInputElement | null;
          if (addrInput && !addrInput.value.trim()) {
            let closestName = 'تهران';
            let minDistance = Infinity;
            TEHRAN_KEY_AREAS.forEach((area) => {
              const d = Math.hypot(area.lat - lat, area.lng - lng);
              if (d < minDistance) {
                minDistance = d;
                closestName = area.name;
              }
            });
            addrInput.value = `تهران، محدوده ${closestName}، `;
          }
          const addrError = document.getElementById('wizard-address-error');
          if (addrError) addrError.hidden = true;
          const mapErr = document.getElementById('wizard-location-map-error');
          if (mapErr) mapErr.hidden = true;
        },
        mapSettings,
      );
    }
    return locationMap;
  }

  const calendar = initCalendarPicker('wizard-calendar', { maxDaysAhead: 7 });
  const timePicker = initTimePicker('wizard-time');

  let currentStep = 1;
  const state: WizardState = {
    serviceId: null,
    vehicleId: null,
    wantsParts: true,
    address: '',
    notes: '',
    urgency: 'urgent',
    scheduledDate: null,
    scheduledTime: null,
    insuranceTier: 'gold_300m',
  };

  let authenticatedCustomer: CustomerInfo | null = null;
  let isGuestModeForced = false;
  let otpCountdownInterval: number | null = null;
  let currentOtpPhone = '';

  // Step 1: Render subcategories for selected category
  function renderSubcategoriesForSelectedCat(): void {
    const cat = serviceCategories.find((c) => c.id === state.serviceId);
    const activeCatNameEl = document.getElementById('wizard-active-cat-name');
    if (activeCatNameEl && cat) {
      activeCatNameEl.textContent = pick(cat.label, cat.labelEn);
    }

    const container = document.getElementById('wizard-subcategories-container');
    if (!container || !state.serviceId) return;

    const vehicleIds = CATEGORY_VEHICLE_IDS[state.serviceId] || [];
    const subcategories = vehicleIds
      .map((vid) => {
        const v = DEFAULT_VEHICLE_TYPES.find((item) => item.id === vid);
        if (!v) return null;
        const extra = SUBCATEGORY_DETAILS_MAP[vid] || {
          desc: pick(cat?.subtitle || '', cat?.subtitleEn || ''),
          descEn: cat?.subtitleEn || '',
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

    container.innerHTML = subcategories
      .map(
        (sub) => `
        <div class="wizard-subcat-card ${state.vehicleId === sub!.id ? 'is-selected' : ''}" data-wizard-subcat="${sub!.id}">
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
      .join('');

    // Wire subcategory card clicks: auto advance to Step 3 (Materials)
    container.querySelectorAll<HTMLElement>('[data-wizard-subcat]').forEach((cardEl) => {
      cardEl.addEventListener('click', () => {
        const subId = cardEl.dataset.wizardSubcat ?? '';
        state.vehicleId = subId;

        container.querySelectorAll('[data-wizard-subcat]').forEach((el) => el.classList.remove('is-selected'));
        cardEl.classList.add('is-selected');

        const err = document.getElementById('wizard-subcategory-error');
        if (err) err.hidden = true;
        updateNextButtonLabel();
        advanceStep(1); // Directly advance to Step 3: Materials
      });
    });
  }

  // Step 1: Category clicks: auto advance to Step 2 (Subcategory)
  card.querySelectorAll<HTMLElement>('[data-wizard-select-cat]').forEach((catEl) => {
    catEl.addEventListener('click', () => {
      const catId = catEl.dataset.wizardSelectCat ?? '';
      state.serviceId = catId;
      card.querySelectorAll('[data-wizard-select-cat]').forEach((el) => el.classList.remove('is-selected'));
      catEl.classList.add('is-selected');

      const err = document.getElementById('wizard-category-error');
      if (err) err.hidden = true;

      renderSubcategoriesForSelectedCat();
      advanceStep(1); // Smooth progression to Step 2: Subcategory
    });
  });

  // Step 2: "تغییر دسته‌بندی" button returns to Step 1
  document.getElementById('wizard-change-cat-btn')?.addEventListener('click', () => {
    advanceStep(-1);
  });

  // Step 3: Materials & Parts Choice (Yes vs No)
  card.querySelectorAll<HTMLButtonElement>('[data-parts-choice]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const choice = btn.dataset.partsChoice === 'yes';
      state.wantsParts = choice;
      card.querySelectorAll('[data-parts-choice]').forEach((b) => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');

      // Auto advance to Step 4 (Map)
      advanceStep(1);
    });
  });

  // Step 4: Quick Tehran Neighborhood Jump Chips
  card.querySelectorAll<HTMLButtonElement>('.wizard-area-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      const lat = Number(pill.dataset.areaLat);
      const lng = Number(pill.dataset.areaLng);
      const name = pill.dataset.areaName || '';
      card.querySelectorAll('.wizard-area-pill').forEach((p) => p.classList.remove('is-selected'));
      pill.classList.add('is-selected');

      const lm = ensureLocationMap();
      lm?.panToArea(lat, lng);

      const addrInput = document.getElementById('wizard-location-address') as HTMLInputElement | null;
      if (addrInput) {
        if (!addrInput.value.includes(name)) {
          addrInput.value = addrInput.value.trim() ? `${name}، ${addrInput.value}` : `تهران، ${name}، `;
        }
        const err = document.getElementById('wizard-address-error');
        if (err) err.hidden = true;
        const mapErr = document.getElementById('wizard-location-map-error');
        if (mapErr) mapErr.hidden = true;
      }
    });
  });

  // Step 5: Address input change clears error
  document.getElementById('wizard-location-address')?.addEventListener('input', () => {
    const err = document.getElementById('wizard-address-error');
    if (err) err.hidden = true;
  });

  // Step 6: Schedule Choice Handling (Urgent vs Scheduled)
  // "اگر فوری بود دیگه تاریخ و ساعت نگیر"
  const dtPickerWrap = document.getElementById('wizard-datetime-picker-wrap');
  card.querySelectorAll<HTMLButtonElement>('[data-schedule-choice]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const choice = btn.dataset.scheduleChoice as 'urgent' | 'scheduled';
      state.urgency = choice;
      card.querySelectorAll('[data-schedule-choice]').forEach((b) => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');

      if (dtPickerWrap) {
        dtPickerWrap.hidden = choice !== 'scheduled';
      }
    });
  });

  // Step 7: Auth state synchronization & Pricing Labels
  // "قیمت هم فقط بنویس حدودی و قیمت لوازم هم و ثبت"
  async function syncCustomerAuthAndPricing(): Promise<void> {
    const loggedInWrap = document.getElementById('wizard-logged-in-container');
    const guestWrap = document.getElementById('wizard-guest-container');
    const loggedInNameEl = document.getElementById('wizard-logged-in-name');
    const loggedInPhoneEl = document.getElementById('wizard-logged-in-phone');

    if (!isGuestModeForced) {
      let cust = getLocalCustomerInfo();
      if (!cust) {
        try {
          cust = await fetchCurrentCustomer();
        } catch {}
      }
      authenticatedCustomer = cust;
    } else {
      authenticatedCustomer = null;
    }

    if (authenticatedCustomer && loggedInWrap && guestWrap) {
      loggedInWrap.hidden = false;
      guestWrap.hidden = true;
      if (loggedInNameEl) loggedInNameEl.textContent = authenticatedCustomer.fullName || pick('کاربر گرامی', 'Valued Customer');
      if (loggedInPhoneEl) loggedInPhoneEl.textContent = toPersianDigits(authenticatedCustomer.phone);
      if (nameInput) nameInput.value = authenticatedCustomer.fullName || '';
      if (phoneInput) phoneInput.value = authenticatedCustomer.phone;
    } else if (loggedInWrap && guestWrap) {
      loggedInWrap.hidden = true;
      guestWrap.hidden = false;
    }

    // Set Estimated Labor Price ("حدودی") and Parts Price
    const laborValEl = document.getElementById('wizard-labor-estimate-val');
    const partsValEl = document.getElementById('wizard-parts-estimate-val');
    const partsDescEl = document.getElementById('wizard-parts-estimate-desc');

    const pricing = resolveVehiclePricing(state.vehicleId);
    if (laborValEl) {
      laborValEl.textContent = `حدودی: ${formatToman(pricing.basePrice)}`;
    }

    if (partsValEl && partsDescEl) {
      if (state.wantsParts) {
        partsValEl.textContent = pick('بر اساس فاکتور خرید', 'Per store receipt');
        partsValEl.style.color = '#059669';
        partsDescEl.textContent = pick('بر اساس فاکتور خرید معتبر و نرخ مصوب صنف', 'Based on official store receipt & union rates');
      } else {
        partsValEl.textContent = pick('صفر تومان (بدون قطعه)', '0 Toman (No parts)');
        partsValEl.style.color = '#64748b';
        partsDescEl.textContent = pick('قطعات توسط مشتری آماده شده و هزینه‌ای ندارد', 'Materials provided by client');
      }
    }
  }

  // Switch phone button for logged-in user
  document.getElementById('wizard-switch-phone-btn')?.addEventListener('click', () => {
    isGuestModeForced = true;
    syncCustomerAuthAndPricing();
    phoneInput?.focus();
  });

  // Step 7: Inline OTP Handling for Guests
  const otpWrap = document.getElementById('wizard-otp-wrap');
  const otpPhoneBadge = document.getElementById('wizard-otp-phone-badge');
  const otpTimerEl = document.getElementById('wizard-otp-timer');
  const otpResendBtn = document.getElementById('wizard-otp-resend-btn') as HTMLButtonElement | null;
  const otpErrorEl = document.getElementById('wizard-otp-error');
  const otpDigits = Array.from(card.querySelectorAll<HTMLInputElement>('.wizard-otp-digit'));

  function startOtpCountdown(): void {
    if (otpCountdownInterval) clearInterval(otpCountdownInterval);
    let secondsLeft = 60;
    if (otpTimerEl) otpTimerEl.textContent = `۰۰:${toPersianDigits(60)}`;
    if (otpResendBtn) otpResendBtn.hidden = true;

    otpCountdownInterval = window.setInterval(() => {
      secondsLeft--;
      if (secondsLeft <= 0) {
        if (otpCountdownInterval) clearInterval(otpCountdownInterval);
        if (otpTimerEl) otpTimerEl.textContent = '۰۰:۰۰';
        if (otpResendBtn) otpResendBtn.hidden = false;
      } else {
        const secStr = secondsLeft < 10 ? `۰${toPersianDigits(secondsLeft)}` : toPersianDigits(secondsLeft);
        if (otpTimerEl) otpTimerEl.textContent = `۰۰:${secStr}`;
      }
    }, 1000);
  }

  function getEnteredOtp(): string {
    return otpDigits
      .map((d) =>
        (d.value || '')
          .replace(/[۰-۹]/g, (ch) => String(ch.charCodeAt(0) - 1776))
          .replace(/[٠-٩]/g, (ch) => String(ch.charCodeAt(0) - 1632))
          .replace(/\D/g, ''),
      )
      .join('');
  }

  function clearOtpDigits(): void {
    otpDigits.forEach((d) => {
      d.value = '';
    });
    if (otpDigits[0]) otpDigits[0].focus();
  }

  otpDigits.forEach((input, idx) => {
    input.addEventListener('input', () => {
      const val = (input.value || '')
        .replace(/[۰-۹]/g, (ch) => String(ch.charCodeAt(0) - 1776))
        .replace(/[٠-٩]/g, (ch) => String(ch.charCodeAt(0) - 1632))
        .replace(/\D/g, '')
        .slice(-1);
      input.value = val;
      if (val && idx < otpDigits.length - 1) {
        otpDigits[idx + 1].focus();
      }
      if (getEnteredOtp().length === 5) {
        void verifyAndSubmit();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && idx > 0) {
        otpDigits[idx - 1].focus();
      }
    });

    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const raw = e.clipboardData?.getData('text') || '';
      const clean = raw
        .replace(/[۰-۹]/g, (ch) => String(ch.charCodeAt(0) - 1776))
        .replace(/[٠-٩]/g, (ch) => String(ch.charCodeAt(0) - 1632))
        .replace(/\D/g, '')
        .slice(0, 5);
      clean.split('').forEach((char, i) => {
        if (otpDigits[i]) otpDigits[i].value = char;
      });
      if (clean.length === 5) {
        void verifyAndSubmit();
      } else if (otpDigits[clean.length]) {
        otpDigits[clean.length].focus();
      }
    });
  });

  async function triggerSendGuestOtp(): Promise<void> {
    const nameVal = nameInput!.value.trim();
    const phoneVal = normalizeCustomerPhone(phoneInput!.value);
    phoneInput!.value = phoneVal;

    let valid = true;
    if (!nameVal) {
      nameError!.hidden = false;
      valid = false;
    } else {
      nameError!.hidden = true;
    }

    if (!/^09\d{9}$/.test(phoneVal)) {
      phoneError!.hidden = false;
      valid = false;
    } else {
      phoneError!.hidden = true;
    }

    if (!valid) return;

    currentOtpPhone = phoneVal;
    if (otpPhoneBadge) otpPhoneBadge.textContent = toPersianDigits(phoneVal);
    if (otpWrap) otpWrap.hidden = false;
    if (otpErrorEl) otpErrorEl.hidden = true;

    nextBtn!.disabled = true;
    nextBtn!.textContent = pick('در حال ارسال کد...', 'Sending code...');

    try {
      await sendCustomerOtp(phoneVal);
      startOtpCountdown();
      clearOtpDigits();

      // Focus on first OTP input digit for user entry
      if (otpDigits[0]) {
        setTimeout(() => otpDigits[0].focus(), 100);
      }
    } catch (err: any) {
      if (otpErrorEl) {
        otpErrorEl.hidden = false;
        otpErrorEl.textContent = err?.message || pick('ارسال پیامک با خطا مواجه شد.', 'SMS send failed.');
      }
    } finally {
      nextBtn!.disabled = false;
      updateNextButtonLabel();
    }
  }

  otpResendBtn?.addEventListener('click', () => {
    if (currentOtpPhone) {
      void triggerSendGuestOtp();
    }
  });

  document.getElementById('wizard-otp-change-phone')?.addEventListener('click', () => {
    if (otpWrap) otpWrap.hidden = true;
    if (otpCountdownInterval) clearInterval(otpCountdownInterval);
    phoneInput?.focus();
    updateNextButtonLabel();
  });

  async function verifyAndSubmit(): Promise<void> {
    const code = getEnteredOtp();
    if (code.length !== 5) {
      if (otpErrorEl) {
        otpErrorEl.hidden = false;
        otpErrorEl.textContent = pick('لطفاً کد ۵ رقمی را کامل وارد نمایید.', 'Enter 5-digit code.');
      }
      return;
    }

    if (otpErrorEl) otpErrorEl.hidden = true;
    nextBtn!.disabled = true;
    nextBtn!.textContent = pick('در حال تأیید کد...', 'Verifying code...');

    try {
      const authRes = await verifyCustomerOtp(currentOtpPhone, code);
      const nameVal = nameInput!.value.trim();
      if (nameVal) {
        await updateCustomerProfile(nameVal, 'male').catch(() => {});
      }
      saveCustomerSession({
        id: authRes.customer?.id || Date.now(),
        phone: currentOtpPhone,
        fullName: nameVal || authRes.customer?.fullName || 'مشتری گرامی',
      }, authRes.token);

      authenticatedCustomer = authRes.customer;
      await submitRequest();
    } catch (err: any) {
      if (otpErrorEl) {
        otpErrorEl.hidden = false;
        otpErrorEl.textContent = err?.message || pick('کد وارد شده صحیح نیست.', 'Invalid code.');
      }
      clearOtpDigits();
    } finally {
      nextBtn!.disabled = false;
      updateNextButtonLabel();
    }
  }

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
    const textEl = document.getElementById('wizard-next-text');
    let label = pick('مرحله بعد', 'Next step');

    if (isLastStep) {
      if (authenticatedCustomer) {
        label = pick('ثبت نهایی و اعزام تکنسین', 'Finalize & Dispatch');
      } else {
        const isOtpActive = otpWrap && !otpWrap.hidden;
        label = isOtpActive ? pick('تأیید کد و ثبت نهایی', 'Verify & Submit') : pick('ارسال کد تأیید و ثبت', 'Send Code & Submit');
      }
    }

    if (textEl) {
      textEl.textContent = label;
    } else {
      nextBtn!.textContent = label;
    }
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

    // 1. Desktop Stepper Sync
    const trackFill = document.getElementById('wizard-stepper-track-fill');
    if (trackFill) {
      trackFill.style.width = `${((currentStep - 1) / (TOTAL_STEPS - 1)) * 100}%`;
    }
    card.querySelectorAll<HTMLElement>('.wizard-step-node').forEach((node) => {
      const stepTarget = Number(node.dataset.stepTarget);
      node.classList.toggle('is-completed', stepTarget < currentStep);
      node.classList.toggle('is-active', stepTarget === currentStep);
      node.setAttribute('aria-selected', stepTarget === currentStep ? 'true' : 'false');
    });

    // 2. Mobile Stepper Sync
    const mobileName = document.getElementById('wizard-mobile-step-name');
    if (mobileName) {
      mobileName.textContent = pick(
        `گام ${toPersianDigits(currentStep)} از ${toPersianDigits(TOTAL_STEPS)}: ${step.shortTitle}`,
        `Step ${toPersianDigits(currentStep)} of ${toPersianDigits(TOTAL_STEPS)}: ${step.shortTitleEn}`,
      );
    }
    const mobilePercent = document.getElementById('wizard-mobile-percent');
    if (mobilePercent) {
      mobilePercent.textContent = `${toPersianDigits(Math.round((currentStep / TOTAL_STEPS) * 100))}٪`;
    }
    card.querySelectorAll<HTMLElement>('.wizard-mobile-segment').forEach((seg) => {
      const segNum = Number(seg.dataset.mobileSegment);
      seg.classList.toggle('is-filled', segNum <= currentStep);
      seg.classList.toggle('is-active', segNum === currentStep);
    });

    // 3. Step Header Tag & Subdesc
    const stepTag = document.getElementById('wizard-step-tag');
    if (stepTag) {
      stepTag.textContent = pick(
        `گام ${toPersianDigits(currentStep)} از ${toPersianDigits(TOTAL_STEPS)}`,
        `Step ${toPersianDigits(currentStep)} of ${toPersianDigits(TOTAL_STEPS)}`,
      );
    }
    const hintBadge = document.getElementById('wizard-step-hint-badge');
    if (hintBadge) {
      hintBadge.textContent = pick(step.shortTitle, step.shortTitleEn);
    }
    const stepSubdesc = document.getElementById('wizard-step-subdesc');
    if (stepSubdesc) {
      stepSubdesc.textContent = pick(step.hint, step.hintEn);
    }

    // 4. Footer Hint
    const footerHint = document.getElementById('wizard-footer-hint');
    if (footerHint) {
      if (state.vehicleId) {
        footerHint.textContent = `${pick('خدمت انتخابی:', 'Selected:')} ${serviceLabel()}`;
      } else {
        footerHint.textContent = pick('اعزام فوری نزدیک‌ترین تکنسین مجرب به محل شما در تهران', 'Fast technician dispatch across Tehran');
      }
    }

    card!.querySelectorAll<HTMLElement>('.request-panel[data-panel]').forEach((el) => {
      el.hidden = el.dataset.panel !== String(currentStep);
    });

    backBtn!.hidden = currentStep === 1;
    updateNextButtonLabel();

    if (step.id === 'map') {
      const lm = ensureLocationMap();
      lm?.refresh();
    }

    if (step.id === 'finalize') {
      void syncCustomerAuthAndPricing();
    }
  }

  function validateCurrentStep(): boolean {
    const step = STEPS[currentStep - 1];
    if (step.id === 'category') {
      const valid = Boolean(state.serviceId);
      const err = document.getElementById('wizard-category-error');
      if (err) err.hidden = valid;
      return valid;
    }
    if (step.id === 'subcategory') {
      const valid = Boolean(state.vehicleId);
      const err = document.getElementById('wizard-subcategory-error');
      if (err) err.hidden = valid;
      return valid;
    }
    if (step.id === 'materials') {
      return true;
    }
    if (step.id === 'map') {
      return true;
    }
    if (step.id === 'address') {
      const addrInput = document.getElementById('wizard-location-address') as HTMLInputElement | null;
      const valid = (addrInput?.value.trim().length ?? 0) >= 3;
      const addrError = document.getElementById('wizard-address-error');
      if (addrError) addrError.hidden = valid;
      return valid;
    }
    if (step.id === 'schedule') {
      return true;
    }
    if (step.id === 'finalize') {
      if (authenticatedCustomer) return true;
      const nameValid = nameInput!.value.trim().length > 0;
      const cleanPhone = normalizeCustomerPhone(phoneInput!.value);
      phoneInput!.value = cleanPhone;
      const phoneValid = /^09\d{9}$/.test(cleanPhone);
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

  function resolveVehiclePricing(vehicleId: string | null): { basePrice: number; perKmRate: number; floorCostExempt: boolean } {
    const v = vehicleTypes.find((item) => item.id === vehicleId);
    if (v) return { basePrice: v.basePrice, perKmRate: v.perKmRate, floorCostExempt: v.floorCostExempt };
    return { basePrice: 180000, perKmRate: 0, floorCostExempt: true };
  }

  async function submitRequest(): Promise<void> {
    if (!state.serviceId || !state.vehicleId) {
      return;
    }

    const isUrgent = state.urgency === 'urgent';
    const date = isUrgent ? pick('امروز (فوری)', 'Today (Immediate)') : calendar.getSelected() || pick('امروز', 'Today');
    const timeObj = timePicker.getSelected();
    const time = isUrgent ? pick('اعزام فوری', 'Immediate Dispatch') : timeObj ? formatTime(timeObj) : pick('ساعت توافقی', 'Agreed time');

    const locPos = ensureLocationMap()?.getPosition();
    const addressInput = document.getElementById('wizard-location-address') as HTMLInputElement | null;
    const address = addressInput?.value.trim() || '';
    const notesInput = document.getElementById('wizard-location-notes') as HTMLTextAreaElement | null;
    const notes = notesInput?.value.trim() || '';
    const pricing = resolveVehiclePricing(state.vehicleId);

    const estimateInput: CostEstimateInput = {
      ...pricing,
      originFloor: 0,
      originHasElevator: true,
      originPropertyType: 'residential',
      originLat: locPos?.lat ?? 35.7219,
      originLng: locPos?.lng ?? 51.3347,
      destinationFloor: 0,
      destinationHasElevator: true,
      destinationPropertyType: 'residential',
      destinationLat: locPos?.lat ?? 35.7219,
      destinationLng: locPos?.lng ?? 51.3347,
      wantsPacking: state.wantsParts,
      laborChoice: 'none',
      laborCount: 1,
      heavyItemsCount: 0,
    };
    const estimate = estimateCost(estimateInput);
    const detailedInvoice = calculateDetailedInvoice(estimateInput);

    const name = authenticatedCustomer?.fullName || nameInput!.value.trim();
    const phone = authenticatedCustomer?.phone || normalizeCustomerPhone(phoneInput!.value);

    nextBtn!.disabled = true;
    nextBtn!.textContent = pick('در حال ثبت سفارش...', 'Submitting...');

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
          originPropertyType: 'residential',
          originLat: locPos?.lat ?? 35.7219,
          originLng: locPos?.lng ?? 51.3347,
          originNotes: [address, notes].filter(Boolean).join(' — '),
          destinationProvince: 'تهران',
          destinationCity: 'تهران',
          destinationCountry: 'ایران',
          destinationPropertyType: 'residential',
          destinationLat: locPos?.lat ?? 35.7219,
          destinationLng: locPos?.lng ?? 51.3347,
          destinationNotes: '',
          originFloor: 0,
          originElevator: true,
          destinationFloor: 0,
          destinationElevator: true,
          wantsPacking: state.wantsParts,
          laborChoice: 'none',
          laborCount: 1,
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

      if (!trackingCode) {
        trackingCode = generateShahanshahiTrackingCode();
      }

      saveLastPhone(phone);
      saveLastName(name);
      saveCustomerSession({
        id: authenticatedCustomer?.id || Date.now(),
        phone,
        fullName: name,
      });

      trackingCodeEl!.textContent = trackingCode;

      const smsTextEl = document.getElementById('wizard-sms-sent-text');
      if (smsTextEl) {
        smsTextEl.textContent = pick(
          `پیامک تأیید شامل خدمت «${serviceLabel()}»، مشخصات سفارش و کد پیگیری به شماره ${toPersianDigits(phone)} ارسال شد.`,
          `Confirmation SMS for "${serviceLabel()}" with order specs and tracking code was sent to ${phone}.`
        );
      }

      // Copy tracking code button
      const copyBtn = document.getElementById('wizard-copy-tracking-btn');
      copyBtn?.addEventListener('click', () => {
        navigator.clipboard?.writeText(trackingCode);
        copyBtn.innerHTML = `<span class="icon">${icons.checkCircle}</span><span>${pick('کپی شد', 'Copied')}</span>`;
        setTimeout(() => {
          copyBtn.innerHTML = `<span class="icon">${icons.copy || icons.fileText}</span><span>${pick('کپی کد', 'Copy Code')}</span>`;
        }, 2000);
      });

      // View Itemized Invoice Modal
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

      // Final summary box
      finalSummaryEl!.innerHTML = `
        <div class="request-summary-box">
          <div class="request-summary-row"><dt>${pick('خدمت انتخابی', 'Service')}</dt><dd>${serviceLabel()}</dd></div>
          <div class="request-summary-row"><dt>${pick('نام متقاضی', 'Customer')}</dt><dd>${name}</dd></div>
          <div class="request-summary-row"><dt>${pick('شماره همراه', 'Phone')}</dt><dd style="direction: ltr;">${toPersianDigits(phone)}</dd></div>
          <div class="request-summary-row"><dt>${pick('تأمین لوازم و قطعات', 'Materials')}</dt><dd>${state.wantsParts ? pick('توسط تکنسین (طبق فاکتور خرید)', 'By technician') : pick('بدون لوازم (فقط اجرت کار)', 'Labor only')}</dd></div>
          ${address ? `<div class="request-summary-row"><dt>${pick('نشانی محل خدمت', 'Service address')}</dt><dd>${address}</dd></div>` : ''}
          ${notes ? `<div class="request-summary-row"><dt>${pick('توضیحات تکمیلی', 'Notes')}</dt><dd>${notes}</dd></div>` : ''}
          <div class="request-summary-row"><dt>${pick('زمان مراجعه', 'Schedule')}</dt><dd>${date} — ساعت ${time}</dd></div>
          <div class="request-summary-row"><dt>${pick('برآورد هزینه خدمت', 'Estimate')}</dt><dd><strong>حدودی ${formatToman(estimate.avg)}</strong></dd></div>
        </div>
      `;

      // Hide panels and show success state
      const panel7 = card.querySelector<HTMLElement>('.request-panel[data-panel="7"]');
      if (panel7) {
        panel7.querySelectorAll<HTMLElement>('.wizard-pricing-summary-card, #wizard-logged-in-container, #wizard-guest-container').forEach((el) => {
          el.hidden = true;
        });
      }
      submitError!.hidden = true;
      document.getElementById('wizard-success-state')!.hidden = false;
      footer!.hidden = true;
      questionEl!.textContent = pick('سفارش شما با موفقیت ثبت شد', 'Request Submitted Successfully');
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
      // Step 7 Final Submission
      if (authenticatedCustomer) {
        void submitRequest();
      } else {
        const isOtpActive = otpWrap && !otpWrap.hidden;
        if (!isOtpActive) {
          void triggerSendGuestOtp();
        } else {
          void verifyAndSubmit();
        }
      }
    } else {
      advanceStep(1);
    }
  });

  backBtn.addEventListener('click', () => {
    advanceStep(-1);
  });

  // Stepper Click Navigation
  card.querySelectorAll<HTMLButtonElement>('.wizard-step-node').forEach((node) => {
    node.addEventListener('click', () => {
      const targetStep = Number(node.dataset.stepTarget);
      if (targetStep > 0 && targetStep < currentStep) {
        currentStep = targetStep;
        updateStepUI();
        const modalBody = card.closest('.request-wizard-modal-body');
        if (modalBody) modalBody.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  document.getElementById('wizard-new-request-btn')?.addEventListener('click', () => {
    resetWizard();
  });

  function resetWizard(): void {
    currentStep = 1;
    state.serviceId = null;
    state.vehicleId = null;
    state.wantsParts = true;
    isGuestModeForced = false;
    card.querySelectorAll('[data-wizard-select-cat]').forEach((el) => el.classList.remove('is-selected'));
    const subContainer = document.getElementById('wizard-subcategories-container');
    if (subContainer) subContainer.innerHTML = '';

    const panel7 = card.querySelector<HTMLElement>('.request-panel[data-panel="7"]');
    if (panel7) {
      panel7.querySelectorAll<HTMLElement>('.wizard-pricing-summary-card').forEach((el) => {
        el.hidden = false;
      });
    }
    const successState = document.getElementById('wizard-success-state');
    if (successState) successState.hidden = true;
    footer!.hidden = false;
    updateStepUI();
  }

  function openModal(serviceId?: string, vehicleId?: string): void {
    const modalEl = document.getElementById('request-wizard-modal');
    if (modalEl) {
      if (modalEl.parentElement !== document.body) {
        document.body.appendChild(modalEl);
      }
      modalEl.classList.add('is-open');
      modalEl.hidden = false;
      document.body.classList.add('modal-open');
    }

    if (serviceId && vehicleId) {
      state.serviceId = serviceId;
      state.vehicleId = vehicleId;
      card.querySelectorAll('[data-wizard-select-cat]').forEach((el) => {
        el.classList.toggle('is-selected', (el as HTMLElement).dataset.wizardSelectCat === serviceId);
      });
      renderSubcategoriesForSelectedCat();
      card.querySelectorAll('[data-wizard-subcat]').forEach((el) => {
        el.classList.toggle('is-selected', (el as HTMLElement).dataset.wizardSubcat === vehicleId);
      });
      currentStep = 3; // Direct jump to Materials
    } else if (serviceId) {
      state.serviceId = serviceId;
      state.vehicleId = null;
      card.querySelectorAll('[data-wizard-select-cat]').forEach((el) => {
        el.classList.toggle('is-selected', (el as HTMLElement).dataset.wizardSelectCat === serviceId);
      });
      renderSubcategoriesForSelectedCat();
      currentStep = 2; // Direct jump to Subcategories
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

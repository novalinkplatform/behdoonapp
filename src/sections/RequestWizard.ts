import { CATEGORY_VEHICLE_IDS, MOTORCYCLE_VEHICLE_ID, serviceCategories, vehicleIcon, DEFAULT_VEHICLE_TYPES } from '../data/services.ts';
import type { VehicleTypeSetting, ServiceCitiesSettings, ServiceCategoriesSettings } from '../utils/dynamicContent.ts';
import { icons } from '../components/icons.ts';
import { renderLocationSelect, initLocationSelect } from '../components/LocationSelect.ts';
import { renderLocationMap, initLocationMap } from '../components/LocationMap.ts';
import type { MapSettings } from '../utils/mapProvider.ts';
import { renderCalendarPicker, initCalendarPicker } from '../components/PersianCalendar.ts';
import { renderTimePicker, initTimePicker, formatTime } from '../components/TimePicker.ts';
import { renderCostChart } from '../components/CostChart.ts';
import { estimateCost, calculateDetailedInvoice } from '../data/pricing.ts';
import { openCustomerInvoiceModal } from '../components/InvoiceModal.ts';
import { provinces, displayCityName, displayProvinceName, matchProvinceAndCity } from '../data/provinces.ts';
import { PROPERTY_TYPES } from '../data/propertyTypes.ts';
import { toPersianDigits } from '../utils/jalali.ts';
import { submitRequest as submitRequestApi } from '../utils/api.ts';
import { getLastName, getLastPhone, saveLastName, saveLastPhone } from '../utils/localOrders.ts';
import { geocodeCity, reverseGeocode } from '../utils/geocode.ts';
import { formatAddressLabel } from '../utils/addresses.ts';
import type { SavedAddress, SavedAddresses } from '../utils/addresses.ts';
import { pick } from '../i18n/lang.ts';
import { trackEvent } from '../utils/analytics.ts';

const FLOOR_VALUES = [0, 1, 2, 3, 4, 5];

function floorLabel(floor: number): string {
  if (floor === 0) return pick('همکف', 'Ground');
  if (floor === 5) return `${toPersianDigits(5)}+`;
  return toPersianDigits(floor);
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
  { id: 'vehicle', question: 'کدام خدمت تخصصی مدنظرتان است؟', questionEn: 'Which specific service do you need?' },
  { id: 'origin', question: 'نشانی و موقعیت مکانی شما در تهران کجاست؟', questionEn: 'Where is your location in Tehran?' },
  { id: 'destination', question: 'موقعیت تکمیلی یا منطقه محل خدمت', questionEn: 'District or secondary location' },
  { id: 'origin-floor', question: 'طبقه و وضعیت دسترسی به واحد چندم است؟', questionEn: 'What floor is the unit on?' },
  { id: 'destination-floor', question: 'نوع ملک و کاربری فضا چیست؟', questionEn: 'What is the property type?' },
  { id: 'packing', question: 'آیا نیاز به تامین قطعات یا مصالح مصرفی دارید؟', questionEn: 'Do you need materials or spare parts provided?' },
  { id: 'labor', question: 'میزان فوریت خدمت را تعیین کنید', questionEn: 'Select service urgency' },
  { id: 'schedule', question: 'تکنسین چه زمانی به محل مراجعه کند؟', questionEn: 'When should the technician visit?' },
  { id: 'estimate', question: 'برآورد اولیه هزینه و انتخاب پوشش بیمه و خسارت', questionEn: 'Preliminary service cost estimate & insurance coverage' },
  { id: 'phone', question: 'برای ثبت نهایی و اعزام تکنسین، مشخصات خود را وارد کنید', questionEn: 'Enter your details to finalize and dispatch' },
];
const TOTAL_STEPS = STEPS.length;

function renderFloorStep(prefix: string): string {
  return `
    <div class="wizard-choice-row" id="${prefix}-floor-row">
      ${FLOOR_VALUES.map((f) => `<button type="button" class="wizard-pill" data-floor-choice="${f}">${floorLabel(f)}</button>`).join('')}
    </div>
    <div class="wizard-elevator" id="${prefix}-elevator" hidden>
      <span class="field-label">${pick('آسانسور دارد؟', 'Has an elevator?')}</span>
      <div class="wizard-choice-row">
        <button type="button" class="wizard-pill" data-elevator-choice="yes">${pick('دارد', 'Yes')}</button>
        <button type="button" class="wizard-pill" data-elevator-choice="no">${pick('ندارد', 'No')}</button>
      </div>
    </div>
  `;
}

const IRAN: [string, string] = ['ایران', 'Iran'];
const OTHER_COUNTRY: [string, string] = ['سایر', 'Other'];

// کشورهای آسیا (بدون ایران که جداگانه و اول فهرست می‌آید)
const ASIAN_COUNTRIES: [string, string][] = [
  ['ترکیه', 'Turkey'],
  ['عراق', 'Iraq'],
  ['سوریه', 'Syria'],
  ['لبنان', 'Lebanon'],
  ['اردن', 'Jordan'],
  ['فلسطین', 'Palestine'],
  ['اسرائیل', 'Israel'],
  ['عربستان سعودی', 'Saudi Arabia'],
  ['یمن', 'Yemen'],
  ['عمان', 'Oman'],
  ['امارات متحده عربی', 'United Arab Emirates'],
  ['قطر', 'Qatar'],
  ['بحرین', 'Bahrain'],
  ['کویت', 'Kuwait'],
  ['گرجستان', 'Georgia'],
  ['ارمنستان', 'Armenia'],
  ['آذربایجان', 'Azerbaijan'],
  ['قزاقستان', 'Kazakhstan'],
  ['ازبکستان', 'Uzbekistan'],
  ['ترکمنستان', 'Turkmenistan'],
  ['تاجیکستان', 'Tajikistan'],
  ['قرقیزستان', 'Kyrgyzstan'],
  ['افغانستان', 'Afghanistan'],
  ['پاکستان', 'Pakistan'],
  ['هند', 'India'],
  ['نپال', 'Nepal'],
  ['بوتان', 'Bhutan'],
  ['بنگلادش', 'Bangladesh'],
  ['سریلانکا', 'Sri Lanka'],
  ['مالدیو', 'Maldives'],
  ['چین', 'China'],
  ['مغولستان', 'Mongolia'],
  ['کره شمالی', 'North Korea'],
  ['کره جنوبی', 'South Korea'],
  ['ژاپن', 'Japan'],
  ['تایوان', 'Taiwan'],
  ['میانمار', 'Myanmar'],
  ['تایلند', 'Thailand'],
  ['لائوس', 'Laos'],
  ['کامبوج', 'Cambodia'],
  ['ویتنام', 'Vietnam'],
  ['مالزی', 'Malaysia'],
  ['سنگاپور', 'Singapore'],
  ['اندونزی', 'Indonesia'],
  ['برونئی', 'Brunei'],
  ['فیلیپین', 'Philippines'],
  ['تیمور شرقی', 'Timor-Leste'],
];

const EUROPEAN_COUNTRIES: [string, string][] = [
  ['آلمان', 'Germany'],
  ['فرانسه', 'France'],
  ['ایتالیا', 'Italy'],
  ['اسپانیا', 'Spain'],
  ['پرتغال', 'Portugal'],
  ['انگلستان', 'United Kingdom'],
  ['ایرلند', 'Ireland'],
  ['هلند', 'Netherlands'],
  ['بلژیک', 'Belgium'],
  ['لوکزامبورگ', 'Luxembourg'],
  ['سوئیس', 'Switzerland'],
  ['اتریش', 'Austria'],
  ['یونان', 'Greece'],
  ['سوئد', 'Sweden'],
  ['نروژ', 'Norway'],
  ['دانمارک', 'Denmark'],
  ['فنلاند', 'Finland'],
  ['ایسلند', 'Iceland'],
  ['لهستان', 'Poland'],
  ['جمهوری چک', 'Czech Republic'],
  ['اسلواکی', 'Slovakia'],
  ['مجارستان', 'Hungary'],
  ['رومانی', 'Romania'],
  ['بلغارستان', 'Bulgaria'],
  ['اوکراین', 'Ukraine'],
  ['بلاروس', 'Belarus'],
  ['مولداوی', 'Moldova'],
  ['روسیه', 'Russia'],
  ['استونی', 'Estonia'],
  ['لتونی', 'Latvia'],
  ['لیتوانی', 'Lithuania'],
  ['اسلوونی', 'Slovenia'],
  ['کرواسی', 'Croatia'],
  ['بوسنی و هرزگوین', 'Bosnia and Herzegovina'],
  ['صربستان', 'Serbia'],
  ['مونته‌نگرو', 'Montenegro'],
  ['مقدونیه شمالی', 'North Macedonia'],
  ['آلبانی', 'Albania'],
  ['کوزوو', 'Kosovo'],
  ['قبرس', 'Cyprus'],
  ['مالت', 'Malta'],
  ['سان مارینو', 'San Marino'],
  ['موناکو', 'Monaco'],
  ['لیختن‌اشتاین', 'Liechtenstein'],
  ['آندورا', 'Andorra'],
  ['واتیکان', 'Vatican City'],
];

function renderCountrySelect(prefix: string, label: string): string {
  const option = ([fa, en]: [string, string]) => `<option value="${fa}">${pick(fa, en)}</option>`;
  return `
    <div class="form-field wizard-country-wrap" id="${prefix}-country-wrap" hidden>
      <label for="${prefix}-country">${pick(`کشور ${label}`, `${label} country`)}</label>
      <div class="select-wrapper">
        <select id="${prefix}-country">
          ${option(IRAN)}
          <optgroup label="${pick('آسیا', 'Asia')}">
            ${ASIAN_COUNTRIES.map(option).join('')}
          </optgroup>
          <optgroup label="${pick('اروپا', 'Europe')}">
            ${EUROPEAN_COUNTRIES.map(option).join('')}
          </optgroup>
          ${option(OTHER_COUNTRY)}
        </select>
        <span class="icon select-chevron">${icons.chevronDown}</span>
      </div>
    </div>
  `;
}

function renderLocationStep(prefix: string, label: string, note?: string): string {
  return `
    ${note ? `<p class="wizard-vehicle-note">${note}</p>` : ''}
    <div class="wizard-saved-addresses" id="${prefix}-saved-addresses" hidden>
      <span class="field-label">${pick('انتخاب سریع از آدرس‌های قبلی', 'Quick-pick from previous addresses')}</span>
      <div class="wizard-saved-address-list" id="${prefix}-saved-address-list"></div>
    </div>
    ${renderLocationSelect(prefix, label)}
    ${renderCountrySelect(prefix, label)}
    <div class="form-field">
      <span class="field-label">${pick('نوع مکان', 'Property type')}</span>
      <div class="wizard-choice-row" id="${prefix}-property-row">
        ${PROPERTY_TYPES.map((t) => `<button type="button" class="wizard-pill" data-property-choice="${t.id}">${pick(t.label, t.labelEn)}</button>`).join('')}
      </div>
    </div>
    <div class="form-field">
      <span class="field-label">${pick('موقعیت روی نقشه', 'Location on the map')}</span>
      ${renderLocationMap(`${prefix}-map`)}
      <p class="request-panel-error" id="${prefix}-map-error" hidden>${pick(
        'برای تعیین دقیق نشانی در تهران، روی نقشه بزنید یا نشانگر را جابه‌جا کنید.',
        'Tap the map or move the marker to specify your address in Tehran.',
      )}</p>
      <p class="request-panel-error" id="${prefix}-coverage-error" hidden style="font-weight: 600; color: #dc2626; margin-top: 8px;"></p>
    </div>
    <div class="form-field">
      <label for="${prefix}-notes">${pick('توضیحات بیشتر (اختیاری)', 'Additional notes (optional)')}</label>
      <textarea
        id="${prefix}-notes"
        class="wizard-notes-input"
        rows="2"
        maxlength="500"
        placeholder="${pick('مثلاً کد درب، نشانی دقیق‌تر یا هر نکته‌ای که لازم است بدانیم', 'e.g. door code, a more precise address, or anything else we should know')}"
      ></textarea>
    </div>
  `;
}

export function renderRequestWizard(
  vehicleTypes: VehicleTypeSetting[] = DEFAULT_VEHICLE_TYPES,
  serviceCities?: ServiceCitiesSettings,
  serviceCategorySettings?: ServiceCategoriesSettings,
  siteName?: { fa?: string; en?: string } | string,
): string {
  const brandName = getSiteBrandName(siteName);
  const activeVehicles = vehicleTypes.filter((v) => v.active).sort((a, b) => a.sortOrder - b.sortOrder);
  const activeVehicleIds = new Set(activeVehicles.map((v) => v.id));
  const showCountry = Boolean(serviceCities?.internationalShippingEnabled);

  // یک دسته فقط وقتی نشان داده می‌شود که هم دستی فعال باشد (پیش‌فرض فعال، تا نصب‌های قدیمی‌تر که
  // این تنظیم را هنوز لمس نکرده‌اند رفتارشان عوض نشود) و هم دست‌کم یک وسیله‌ی فعال از فهرست
  // وسایل مجازش موجود باشد — وگرنه کاربر وارد دسته‌ای می‌شود که هیچ وسیله‌ای برای انتخاب در
  // مرحله‌ی بعد ندارد (بن‌بست منطقی).
  const categoryManuallyEnabled = (id: string): boolean => {
    if (id === 'transit') return showCountry;
    if (id === 'domestic') return serviceCategorySettings?.domestic ?? true;
    if (id === 'moving') return serviceCategorySettings?.moving ?? true;
    return true;
  };
  const categoryHasActiveVehicle = (id: string): boolean => (CATEGORY_VEHICLE_IDS[id] ?? []).some((v) => activeVehicleIds.has(v));
  const visibleCategories = serviceCategories.filter((cat) => categoryManuallyEnabled(cat.id) && categoryHasActiveVehicle(cat.id));

  // اگر هیچ دسته‌ای قابل نمایش نباشد (مثلاً همه‌ی دسته‌ها دستی غیرفعال شده‌اند یا هیچ وسیله‌ی
  // فعالی تنظیم نشده)، به‌جای یک فرم چندمرحله‌ای خالی/بن‌بست، فقط یک پیام ساده نشان می‌دهیم.
  if (!visibleCategories.length) {
    return `
      <div class="request-card request-card-empty" id="request">
        <p>${pick(
          'در حال حاضر امکان ثبت درخواست وجود ندارد. لطفاً بعداً دوباره سر بزنید یا مستقیم با ما تماس بگیرید.',
          'Submitting a request is not available right now. Please check back later or contact us directly.',
        )}</p>
      </div>
    `;
  }

  const originCity = serviceCities?.originCity;
  const originNote = originCity
    ? pick(`خدمات ما از ${originCity.city} آغاز می‌شود.`, `Our service starts from ${originCity.cityEn || originCity.city}.`)
    : undefined;
  return `
    <div class="request-card" id="request">
      <div class="wizard-progress">
        <div class="wizard-progress-bar"><div class="wizard-progress-fill" id="wizard-progress-fill"></div></div>
        <span class="wizard-progress-text" id="wizard-progress-text"></span>
      </div>

      <h2 class="wizard-question" id="wizard-question"></h2>

      <div class="wizard-body">
        <section class="request-panel" data-panel="1">
          <div class="wizard-service-grid">
            ${visibleCategories
              .map(
                (cat) => `
                  <button type="button" class="wizard-service-card" data-service-choice="${cat.id}">
                    <span class="icon wizard-service-card-icon">${cat.icon}</span>
                    <span class="wizard-service-card-title">${pick(cat.label, cat.labelEn)}</span>
                    <span class="wizard-service-card-subtitle">${pick(cat.subtitle, cat.subtitleEn)}</span>
                  </button>
                `,
              )
              .join('')}
          </div>
        </section>

        <section class="request-panel" data-panel="2" hidden>
          <div class="wizard-choice-grid">
            ${activeVehicles
              .map(
                (v) => `
                  <button type="button" class="wizard-choice-chip" data-vehicle-choice="${v.id}">
                    <span class="icon">${vehicleIcon(v.icon)}</span>
                    <span>${pick(v.label, v.labelEn)}</span>
                  </button>
                `,
              )
              .join('')}
          </div>
          <p class="wizard-vehicle-note" id="wizard-vehicle-note" hidden></p>
        </section>

        <section class="request-panel" data-panel="3" hidden>
          ${renderLocationStep('wizard-origin', pick('مبدأ', 'Origin'), originNote)}
        </section>

        <section class="request-panel" data-panel="4" hidden>
          ${renderLocationStep('wizard-destination', pick('مقصد', 'Destination'))}
        </section>

        <section class="request-panel" data-panel="5" hidden>
          ${renderFloorStep('wizard-origin')}
        </section>

        <section class="request-panel" data-panel="6" hidden>
          ${renderFloorStep('wizard-destination')}
        </section>

        <section class="request-panel" data-panel="7" hidden>
          <div class="wizard-choice-row wizard-choice-row-lg">
            <button type="button" class="wizard-pill wizard-pill-lg" data-packing-choice="yes">${pick('می‌خواهم', 'I want it')}</button>
            <button type="button" class="wizard-pill wizard-pill-lg" data-packing-choice="no">${pick('نمی‌خواهم', "I don't want it")}</button>
          </div>
        </section>

        <section class="request-panel" data-panel="8" hidden>
          <div class="wizard-choice-row wizard-choice-row-lg">
            <button type="button" class="wizard-pill wizard-pill-lg" data-labor-choice="none">${pick('نیازی ندارم', "I don't need it")}</button>
            <button type="button" class="wizard-pill wizard-pill-lg" data-labor-choice="origin">${pick('فقط مبدأ', 'Origin only')}</button>
            <button type="button" class="wizard-pill wizard-pill-lg" data-labor-choice="destination">${pick('فقط مقصد', 'Destination only')}</button>
            <button type="button" class="wizard-pill wizard-pill-lg" data-labor-choice="both">${pick('مبدأ و مقصد', 'Both')}</button>
          </div>

          <div class="wizard-labor-details" id="wizard-labor-details" hidden style="margin-top: 18px; padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; text-align: right;">
            <div style="margin-bottom: 14px;">
              <span class="field-label" style="display: block; font-weight: 700; color: #1e293b; margin-bottom: 8px; font-size: 0.95rem;">${pick('تعداد تکنسین یا استادکار مورد نیاز:', 'Number of technicians needed:')}</span>
              <div class="wizard-choice-row" style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button type="button" class="wizard-pill" data-labor-count="1">${pick('۱ نفر', '1 person')}</button>
                <button type="button" class="wizard-pill is-selected" data-labor-count="2">${pick('۲ نفر (تیم استاندارد)', '2 persons (Standard team)')}</button>
                <button type="button" class="wizard-pill" data-labor-count="3">${pick('۳ نفر', '3 persons')}</button>
                <button type="button" class="wizard-pill" data-labor-count="4">${pick('۴ نفر به بالا', '4+ persons')}</button>
              </div>
              <p style="font-size: 0.78rem; color: #64748b; margin: 6px 0 0;">${pick('تکنسین به همراه ست کامل ابزار و تجهیزات تخصصی تست به محل اعزام می‌شود.', 'The technician arrives with complete professional diagnostic and repair tools.')}</p>
            </div>

            <div style="border-top: 1px dashed #cbd5e1; padding-top: 12px;">
              <span class="field-label" style="display: block; font-weight: 700; color: #1e293b; margin-bottom: 8px; font-size: 0.95rem;">${pick('نیاز به تجهیزات کمکی (نردبان بلند، داربست، دریل هیلتی):', 'Auxiliary equipment needed (High ladder, Scaffold, Demolition hammer):')}</span>
              <div class="wizard-choice-row" style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button type="button" class="wizard-pill is-selected" data-heavy-choice="0">${pick('ندارم', 'None')}</button>
                <button type="button" class="wizard-pill" data-heavy-choice="1">${pick('نردبان بلند / هیلتی', 'High ladder / Hammer')}</button>
                <button type="button" class="wizard-pill" data-heavy-choice="2">${pick('داربست یا بالابر', 'Scaffold or Lift')}</button>
              </div>
            </div>
          </div>
        </section>

        <section class="request-panel" data-panel="9" hidden>
          <div class="form-field">
            <span class="field-label">${pick('تاریخ', 'Date')}</span>
            ${renderCalendarPicker('wizard-calendar')}
          </div>
          <div class="form-field">
            <span class="field-label">${pick('ساعت', 'Time')}</span>
            ${renderTimePicker('wizard-time')}
          </div>
        </section>

        <section class="request-panel" data-panel="10" hidden>
          <div id="wizard-cost-chart"></div>

          <div class="wizard-insurance-section">
            <div class="wizard-insurance-header">
              <div class="wizard-insurance-header-title">
                <span class="icon">${icons.shield || icons.checkCircle}</span>
                <h4>${pick('انتخاب پوشش بیمه و میزان جبران خسارت', 'Select Insurance & Damage Compensation Limit')}</h4>
              </div>
              <p class="wizard-insurance-subtitle">
                ${pick(
                  'جهت تضمین ایمنی خدمات و جبران خسارات احتمالی هنگام انجام کار، سقف پوشش مورد نظر خود را انتخاب فرمایید:',
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

        <section class="request-panel" data-panel="11" hidden>
          <div class="wizard-phone-insurance-banner">
            <div class="wizard-phone-insurance-info">
              <span class="icon">${icons.shield || icons.checkCircle}</span>
              <div>
                <span class="wizard-phone-insurance-title">${pick('پوشش بیمه و خسارت انتخابی:', 'Selected Insurance Coverage:')}</span>
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
              <input type="text" id="wizard-name" placeholder="${pick('نام و نام خانوادگی', 'Full name')}" autocomplete="name" />
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
          <p class="request-panel-error" id="wizard-phone-error" hidden>${pick('شماره موبایل معتبر وارد کنید.', 'Enter a valid mobile number.')}</p>
          <p class="request-panel-error" id="wizard-submit-error" hidden></p>
        </section>

        <section class="request-panel wizard-success" data-panel="success" hidden>
          <span class="request-success-icon">${icons.checkCircle}</span>
          <h3>${pick('درخواست شما ثبت شد', 'Your request has been submitted')}</h3>
          <p>${pick(
            'کد رهگیری زیر را نزد خود نگه دارید؛ به‌زودی با شماره شما هماهنگ می‌کنیم.',
            "Keep the tracking code below; we'll contact you at your number shortly.",
          )}</p>
          <div class="tracking-code" id="wizard-tracking-code"></div>

          <div class="wizard-success-notice-box">
            <span class="icon">${icons.shield || icons.checkCircle}</span>
            <span>${pick(
              `نهایی شدن توسط ${brandName} پس از بررسی صورت خواهد گرفت.`,
              `Finalization by ${brandName} will take place after review.`,
            )}</span>
          </div>

          <dl class="request-summary" id="wizard-final-summary"></dl>
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
  originPropertyType: string | null;
  destinationPropertyType: string | null;
  originFloor: number | null;
  originElevator: boolean | null;
  destinationFloor: number | null;
  destinationElevator: boolean | null;
  wantsPacking: boolean | null;
  laborChoice: 'none' | 'origin' | 'destination' | 'both' | null;
  laborCount: number;
  heavyItemsCount: number;
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
  setSavedAddresses: (addresses: SavedAddresses) => void;
}

export function initRequestWizard(
  vehicleTypes: VehicleTypeSetting[] = DEFAULT_VEHICLE_TYPES,
  serviceCities?: ServiceCitiesSettings,
  mapSettings?: MapSettings,
  siteName?: { fa?: string; en?: string } | string,
): RequestWizardController {
  const card = document.getElementById('request');
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

  const noop: RequestWizardController = { selectService: () => {}, setSavedAddresses: () => {} };
  if (
    !card ||
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

  const cachedName = getLastName();
  const cachedPhone = getLastPhone();
  if (cachedName) nameInput.value = cachedName;
  if (cachedPhone) phoneInput.value = cachedPhone;

  // وقتی مقدار استان/شهر به‌خاطر جابه‌جایی نشانگر روی نقشه (reverse geocode) به‌صورت برنامه‌ای
  // ست می‌شود، نباید بازخورد بدهد و نقشه را دوباره به مرکز استان/شهر برگرداند — نقشه همین حالا هم
  // دقیقاً روی همان نقطه‌ای است که کاربر انتخاب کرده.
  let syncingLocationFromMap = false;
  let originMap: ReturnType<typeof initLocationMap> = null;
  let destinationMap: ReturnType<typeof initLocationMap> = null;

  const origin = initLocationSelect('wizard-origin', (provinceId) => {
    if (syncingLocationFromMap) return;
    const province = provinces.find((p) => p.id === provinceId);
    if (province) originMap?.setCenter(province.lat, province.lng);
  });
  const destination = initLocationSelect(
    'wizard-destination',
    (provinceId) => {
      if (syncingLocationFromMap) return;
      const province = provinces.find((p) => p.id === provinceId);
      if (province) destinationMap?.setCenter(province.lat, province.lng);
    },
    serviceCities?.coverageMode === 'selected' ? { allowedCities: serviceCities.destinationCities } : undefined,
  );

  // با انتخاب نقطه‌ی دقیق روی نقشه (کلیک یا جابه‌جایی نشانگر)، استان/شهر هم به‌صورت خودکار با
  // همان نقطه هماهنگ می‌شود (reverse geocode)، تا کاربر مجبور نباشد جداگانه از لیست انتخاب کند.
  function syncLocationFromMap(controller: ReturnType<typeof initLocationSelect>, lat: number, lng: number): void {
    void reverseGeocode(lat, lng).then((result) => {
      if (!result) return;
      const matched = matchProvinceAndCity(result.province, result.city);
      if (!matched) return;
      syncingLocationFromMap = true;
      controller.setValue({ province: matched.province, city: matched.city });
      syncingLocationFromMap = false;
    });
  }

  originMap = initLocationMap(
    'wizard-origin-map',
    // اگر مبدأ ثابت و قفل‌شده باشد، نباید با جابه‌جایی نشانگر روی نقشه عوض شود.
    serviceCities?.originCity ? undefined : (lat, lng) => syncLocationFromMap(origin, lat, lng),
    mapSettings,
  );
  destinationMap = initLocationMap('wizard-destination-map', (lat, lng) => syncLocationFromMap(destination, lat, lng), mapSettings);

  // اگر مبدأ ثابت تنظیم شده، همان‌جا از قبل انتخاب و قفل می‌شود — مشتری فقط روی نقشه نقطه‌ی دقیق را مشخص می‌کند.
  const fixedOriginCity = serviceCities?.originCity;
  if (fixedOriginCity) {
    const fixedProvince = provinces.find((p) => p.name === fixedOriginCity.province);
    if (fixedProvince) {
      origin.setProvince(fixedProvince.id);
      const originCitySelect = document.getElementById('wizard-origin-city') as HTMLSelectElement | null;
      if (originCitySelect) originCitySelect.value = fixedOriginCity.city;
      const originProvinceSelect = document.getElementById('wizard-origin-province') as HTMLSelectElement | null;
      if (originProvinceSelect) originProvinceSelect.disabled = true;
      if (originCitySelect) originCitySelect.disabled = true;
      originMap?.setCenter(fixedProvince.lat, fixedProvince.lng);
    }
  }
  function wireSavedAddressPicker(
    prefix: string,
    controller: ReturnType<typeof initLocationSelect>,
    addresses: SavedAddress[],
  ): void {
    const wrap = document.getElementById(`${prefix}-saved-addresses`);
    const list = document.getElementById(`${prefix}-saved-address-list`);
    if (!wrap || !list || !addresses.length) return;

    list.innerHTML = addresses
      .map(
        (a, i) =>
          `<button type="button" class="wizard-saved-address-chip" data-saved-address="${i}">${formatAddressLabel(a)}</button>`,
      )
      .join('');

    list.querySelectorAll<HTMLButtonElement>('[data-saved-address]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const address = addresses[Number(btn.dataset.savedAddress)];
        if (!address) return;
        controller.setValue(address);
        list.querySelectorAll('.wizard-saved-address-chip').forEach((el) => el.classList.remove('is-selected'));
        btn.classList.add('is-selected');
      });
    });

    wrap.hidden = false;
  }

  const calendar = initCalendarPicker('wizard-calendar', { maxDaysAhead: 7 });
  const timePicker = initTimePicker('wizard-time');

  // با انتخاب دقیق‌تر شهر، نقشه هم به مرکز همان شهر (نه فقط مرکز استان) نزدیک‌تر می‌شود.
  function wireCityGeocode(
    citySelectId: string,
    getValue: () => { province: string; city: string } | null,
    map: ReturnType<typeof initLocationMap>,
  ): void {
    const citySelect = document.getElementById(citySelectId) as HTMLSelectElement | null;
    if (!citySelect || !map) return;
    citySelect.addEventListener('change', () => {
      // اگر همین تغییر خودش نتیجه‌ی reverse geocode نقشه بود، نقشه از قبل دقیقاً روی نقطه‌ی
      // درست است — نباید دوباره به مرکز عمومی شهر پرت شود.
      if (syncingLocationFromMap) return;
      const value = getValue();
      if (!value) return;
      geocodeCity(value.city, value.province).then((result) => {
        if (result) map.setCenter(result.lat, result.lng, 13);
      });
    });
  }
  wireCityGeocode('wizard-origin-city', origin.getValue, originMap);
  wireCityGeocode('wizard-destination-city', destination.getValue, destinationMap);

  const COUNTRY_COORDINATES: Record<string, [number, number]> = {
    'ایران': [35.6892, 51.3890],
    'ترکیه': [39.9334, 32.8597],
    'عراق': [33.3152, 44.3661],
    'امارات': [25.2048, 55.2708],
    'امارات متحده عربی': [25.2048, 55.2708],
    'آلمان': [52.5200, 13.4050],
    'روسیه': [55.7558, 37.6173],
    'چین': [39.9042, 116.4074],
    'ارمنستان': [40.1792, 44.4991],
    'آذربایجان': [40.4093, 49.8671],
    'گرجستان': [41.7151, 44.8271],
    'افغانستان': [34.5553, 69.2075],
    'پاکستان': [33.6844, 73.0479],
    'عمان': [23.5880, 58.3829],
    'قطر': [25.2854, 51.5310],
    'کویت': [29.3759, 47.9774],
    'ترکمنستان': [37.9601, 58.3261],
    'قزاقستان': [51.1694, 71.4491],
    'ازبکستان': [41.2995, 69.2401],
    'تاجیکستان': [38.5598, 68.7870],
    'فرانسه': [48.8566, 2.3522],
    'ایتالیا': [41.9028, 12.4964],
    'هلند': [52.3676, 4.9041],
    'انگلستان': [51.5074, -0.1278],
  };

  function wireCountryMapFly(selectId: string, map: ReturnType<typeof initLocationMap>): void {
    const select = document.getElementById(selectId) as HTMLSelectElement | null;
    if (!select || !map) return;
    select.addEventListener('change', () => {
      const country = select.value.trim();
      if (country === 'ایران') {
        map.resetToIran();
      } else if (COUNTRY_COORDINATES[country]) {
        const [lat, lng] = COUNTRY_COORDINATES[country];
        map.setBoundsMode('global');
        map.setCenter(lat, lng, 6);
      }
    });
  }
  wireCountryMapFly('wizard-origin-country', originMap);
  wireCountryMapFly('wizard-destination-country', destinationMap);

  // در ابتدا نقشه روی ایران مقید است
  originMap?.setBoundsMode('iran');
  destinationMap?.setBoundsMode('iran');

  const brandName = getSiteBrandName(siteName);

  const state: WizardState = {
    serviceId: null,
    vehicleId: null,
    originPropertyType: null,
    destinationPropertyType: null,
    originFloor: null,
    originElevator: null,
    destinationFloor: null,
    destinationElevator: null,
    wantsPacking: null,
    laborChoice: null,
    laborCount: 2,
    heavyItemsCount: 0,
    insuranceTier: 'gold_300m',
  };

  const selectedInsuranceTextEl = document.getElementById('wizard-selected-insurance-text');
  function updateSelectedInsuranceDisplay(tierId: string): void {
    const tier = INSURANCE_TIERS.find((t) => t.id === tierId) || INSURANCE_TIERS[2];
    if (selectedInsuranceTextEl) {
      selectedInsuranceTextEl.textContent = `${pick(tier.title, tier.titleEn)} — ${pick(tier.coverageCeiling, tier.coverageCeilingEn)}`;
    }
  }

  const insuranceButtons = Array.from(card.querySelectorAll<HTMLButtonElement>('[data-insurance-choice]'));
  insuranceButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      insuranceButtons.forEach((b) => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      const choice = btn.getAttribute('data-insurance-choice') || 'gold_300m';
      state.insuranceTier = choice;
      updateSelectedInsuranceDisplay(choice);
    });
  });

  let currentStep = 1;

  // موتور فقط برای مسیرهای درون‌شهری منطقی است؛ برای مسیر بین‌شهری کارایی و ایمنی لازم را ندارد.
  function isRouteIntercity(): boolean {
    const o = origin.getValue();
    const d = destination.getValue();
    if (!o || !d) return false;
    return o.province !== d.province || o.city !== d.city;
  }

  function refreshVehicleAvailability(showIntercityWarning = false): void {
    const allowedIds = CATEGORY_VEHICLE_IDS[state.serviceId ?? ''] ?? [];
    const intercity = isRouteIntercity();
    const note = document.getElementById('wizard-vehicle-note');

    card?.querySelectorAll<HTMLButtonElement>('[data-vehicle-choice]').forEach((chip) => {
      const vehicleId = chip.dataset.vehicleChoice ?? '';
      const isMotorcycle = vehicleId === MOTORCYCLE_VEHICLE_ID;
      const allowed = allowedIds.includes(vehicleId) && (!isMotorcycle || !intercity);
      chip.hidden = !allowed;
      if (!allowed && state.vehicleId === vehicleId) {
        state.vehicleId = null;
        chip.classList.remove('is-selected');
      }
    });

    if (note) {
      const relevant = allowedIds.includes(MOTORCYCLE_VEHICLE_ID);
      note.hidden = !relevant;
      note.classList.toggle('is-warning', showIntercityWarning);
      note.textContent = showIntercityWarning
        ? pick(
            'مسیر انتخابی شما بین‌شهری است؛ موتور فقط برای جابه‌جایی درون‌شهری در دسترس است. لطفاً وسیله دیگری انتخاب کنید.',
            'Your selected route is intercity; motorcycles are only available for intracity moves. Please choose a different vehicle.',
          )
        : pick('موتور فقط برای جابه‌جایی درون‌شهری در دسترس است.', 'Motorcycles are only available for intracity moves.');
    }
  }

  let hasTrackedStart = false;
  function setServiceSelection(serviceId: string): void {
    if (!hasTrackedStart) {
      hasTrackedStart = true;
      trackEvent('wizard_start', { serviceId });
    }
    state.serviceId = serviceId;
    card?.querySelectorAll<HTMLButtonElement>('[data-service-choice]').forEach((btn) => {
      btn.classList.toggle('is-selected', btn.dataset.serviceChoice === serviceId);
    });

    const isTransit = serviceId === 'transit';
    const showCountry = Boolean(serviceCities?.internationalShippingEnabled) && isTransit;

    const originCountryWrap = document.getElementById('wizard-origin-country-wrap');
    const destCountryWrap = document.getElementById('wizard-destination-country-wrap');
    if (originCountryWrap) originCountryWrap.hidden = !showCountry;
    if (destCountryWrap) destCountryWrap.hidden = !showCountry;

    if (isTransit) {
      originMap?.setBoundsMode('global');
      destinationMap?.setBoundsMode('global');
    } else {
      // اگر ترابری جهانی انتخاب نکرده، نقشه فقط روی ایران بمونه
      originMap?.setBoundsMode('iran');
      destinationMap?.setBoundsMode('iran');
      const originCountrySelect = document.getElementById('wizard-origin-country') as HTMLSelectElement | null;
      const destCountrySelect = document.getElementById('wizard-destination-country') as HTMLSelectElement | null;
      if (originCountrySelect) originCountrySelect.value = IRAN[0];
      if (destCountrySelect) destCountrySelect.value = IRAN[0];
    }

    refreshVehicleAvailability();
    updateNextButtonLabel();
  }

  function setVehicleSelection(vehicleId: string): void {
    state.vehicleId = vehicleId;
    card?.querySelectorAll<HTMLButtonElement>('[data-vehicle-choice]').forEach((btn) => {
      btn.classList.toggle('is-selected', btn.dataset.vehicleChoice === vehicleId);
    });
  }

  const originLocationPanel = card.querySelector('[data-panel="3"]');
  const destinationLocationPanel = card.querySelector('[data-panel="4"]');
  const originFloorPanel = card.querySelector('[data-panel="5"]');
  const destinationFloorPanel = card.querySelector('[data-panel="6"]');

  function wireFloorPanel(
    panel: Element | null,
    prefix: string,
    floorKey: 'originFloor' | 'destinationFloor',
    elevatorKey: 'originElevator' | 'destinationElevator',
  ): void {
    if (!panel) return;
    const elevatorWrapper = document.getElementById(`${prefix}-elevator`);
    wireChipGroup(panel, 'data-floor-choice', (value) => {
      const floor = Number(value);
      state[floorKey] = floor;
      if (floor === 0) {
        state[elevatorKey] = null;
        if (elevatorWrapper) {
          elevatorWrapper.hidden = true;
          elevatorWrapper.querySelectorAll('[data-elevator-choice]').forEach((b) => b.classList.remove('is-selected'));
        }
      } else if (elevatorWrapper) {
        elevatorWrapper.hidden = false;
      }
    });
    if (elevatorWrapper) {
      wireChipGroup(elevatorWrapper, 'data-elevator-choice', (value) => {
        state[elevatorKey] = value === 'yes';
      });
    }
  }

  wireChipGroup(card.querySelector('[data-panel="1"]') as Element, 'data-service-choice', (value) => {
    setServiceSelection(value);
  });
  wireChipGroup(card.querySelector('[data-panel="2"]') as Element, 'data-vehicle-choice', (value) => {
    setVehicleSelection(value);
  });
  if (originLocationPanel) {
    wireChipGroup(originLocationPanel, 'data-property-choice', (value) => {
      state.originPropertyType = value;
    });
  }
  if (destinationLocationPanel) {
    wireChipGroup(destinationLocationPanel, 'data-property-choice', (value) => {
      state.destinationPropertyType = value;
    });
  }
  wireFloorPanel(originFloorPanel, 'wizard-origin', 'originFloor', 'originElevator');
  wireFloorPanel(destinationFloorPanel, 'wizard-destination', 'destinationFloor', 'destinationElevator');
  wireChipGroup(card.querySelector('[data-panel="7"]') as Element, 'data-packing-choice', (value) => {
    state.wantsPacking = value === 'yes';
  });
  const laborPanel = card.querySelector('[data-panel="8"]') as Element | null;
  const laborDetails = document.getElementById('wizard-labor-details');
  if (laborPanel) {
    wireChipGroup(laborPanel, 'data-labor-choice', (value) => {
      state.laborChoice = value as WizardState['laborChoice'];
      if (laborDetails) {
        laborDetails.hidden = value === 'none';
      }
    });
    wireChipGroup(laborPanel, 'data-labor-count', (value) => {
      state.laborCount = Number(value) || 2;
    });
    wireChipGroup(laborPanel, 'data-heavy-choice', (value) => {
      state.heavyItemsCount = Number(value) || 0;
    });
  }

  function isStepSkipped(stepIndex: number): boolean {
    const step = STEPS[stepIndex - 1];
    // موتور نیازی به نیروی کارگر برای جابه‌جایی بار سبک ندارد.
    return step.id === 'labor' && state.vehicleId === 'motorcycle';
  }

  function advanceStep(delta: 1 | -1): void {
    let next = currentStep + delta;
    while (next >= 1 && next <= TOTAL_STEPS && isStepSkipped(next)) {
      if (STEPS[next - 1].id === 'labor') state.laborChoice = 'none';
      next += delta;
    }
    currentStep = Math.min(TOTAL_STEPS, Math.max(1, next));
    if (delta === 1) {
      trackEvent('wizard_step', { step: currentStep, stepId: STEPS[currentStep - 1]?.id });
    }
    updateStepUI();

    // روی صفحه‌های کوچک و موبایل، اسکرول نرم به بالای کارت تا مرحله جدید بریده نشود
    if (card) {
      const rect = card.getBoundingClientRect();
      if (rect.top < 64 || rect.top > 220) {
        const targetY = window.pageYOffset + rect.top - 68;
        window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
      }
    }
  }

  function updateNextButtonLabel(): void {
    const isLastStep = currentStep === TOTAL_STEPS;
    const isFirstStepUnselected = currentStep === 1 && state.serviceId === null;
    const showSubmitLabel = isLastStep || isFirstStepUnselected;
    nextBtn!.textContent = showSubmitLabel ? pick('ثبت درخواست', 'Submit request') : pick('بعدی', 'Next');
    nextBtn!.classList.toggle('btn-cta-wave', showSubmitLabel);
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

    if (step.id === 'origin') originMap?.refresh();
    if (step.id === 'destination') {
      destinationMap?.refresh();
      // موتور فقط درون‌شهری است؛ نقشه مقصد همان نقطه مبدأ را نشان می‌دهد تا کاربر نزدیک همان محدوده را دقیق‌تر انتخاب کند.
      if (state.vehicleId === 'motorcycle') {
        const originPos = originMap?.getPosition();
        if (originPos) destinationMap?.setCenter(originPos.lat, originPos.lng);
      }
    }

    if (step.id === 'estimate') {
      const originPos = originMap?.getPosition();
      const destinationPos = destinationMap?.getPosition();
      const pricing = resolveVehiclePricing(state.vehicleId);
      const estimateInput = {
        ...pricing,
        originFloor: state.originFloor ?? 0,
        originHasElevator: state.originElevator ?? true,
        originPropertyType: state.originPropertyType ?? 'residential',
        originLat: originPos?.lat ?? null,
        originLng: originPos?.lng ?? null,
        destinationFloor: state.destinationFloor ?? 0,
        destinationHasElevator: state.destinationElevator ?? true,
        destinationPropertyType: state.destinationPropertyType ?? 'residential',
        destinationLat: destinationPos?.lat ?? null,
        destinationLng: destinationPos?.lng ?? null,
        wantsPacking: state.wantsPacking ?? false,
        laborChoice: state.laborChoice ?? 'none',
        laborCount: state.laborCount,
        heavyItemsCount: state.heavyItemsCount,
      };
      const estimate = estimateCost(estimateInput);
      const detailedInvoice = calculateDetailedInvoice(estimateInput);
      costChartContainer!.innerHTML = renderCostChart(estimate, detailedInvoice);
    }
  }

  function validateCurrentStep(): boolean {
    const step = STEPS[currentStep - 1];
    if (step.id === 'service') return state.serviceId !== null;
    if (step.id === 'vehicle') return state.vehicleId !== null;
    if (step.id === 'origin') {
      const originVal = origin.getValue();
      const coverageError = document.getElementById('wizard-origin-coverage-error');
      if (coverageError) coverageError.hidden = true;

      if (serviceCities?.coverageMode === 'selected' && serviceCities.originCity?.city) {
        const allowedOriginCity = serviceCities.originCity.city;
        if (originVal && originVal.city && originVal.city !== allowedOriginCity) {
          if (coverageError) {
            coverageError.textContent = pick(
              `متأسفانه در حال حاضر ثبت درخواست فقط از مبدأ «${allowedOriginCity}» امکان‌پذیر است.`,
              `Currently, requests can only be placed from "${serviceCities.originCity.cityEn || allowedOriginCity}".`,
            );
            coverageError.hidden = false;
          }
          return false;
        }
      }

      const valid = originVal !== null && state.originPropertyType !== null && (originMap?.hasInteracted() ?? false);
      const mapError = document.getElementById('wizard-origin-map-error');
      if (mapError) mapError.hidden = originVal === null || (originMap?.hasInteracted() ?? false);
      return valid;
    }
    if (step.id === 'destination') {
      const destVal = destination.getValue();
      const coverageError = document.getElementById('wizard-destination-coverage-error');
      if (coverageError) coverageError.hidden = true;

      if (serviceCities?.coverageMode === 'selected') {
        const allowedCities: string[] = [];
        if (serviceCities.originCity?.city) {
          allowedCities.push(serviceCities.originCity.city);
        }
        if (Array.isArray(serviceCities.destinationCities)) {
          for (const d of serviceCities.destinationCities) {
            if (d.city && !allowedCities.includes(d.city)) {
              allowedCities.push(d.city);
            }
          }
        }

        if (allowedCities.length > 0 && destVal && destVal.city) {
          const isAllowed = allowedCities.includes(destVal.city);
          if (!isAllowed) {
            if (coverageError) {
              const allowedNamesStr = allowedCities.join('، ');
              coverageError.textContent = pick(
                `متأسفانه در حال حاضر به مقصد «${destVal.city}» خدمات ارائه نمی‌شود. مقصدهای مجاز: ${allowedNamesStr}`,
                `Service to "${destVal.city}" is not available. Allowed destinations: ${allowedCities.join(', ')}`,
              );
              coverageError.hidden = false;
            }
            return false;
          }
        }
      }

      const valid =
        destVal !== null && state.destinationPropertyType !== null && (destinationMap?.hasInteracted() ?? false);
      const mapError = document.getElementById('wizard-destination-map-error');
      if (mapError) mapError.hidden = destVal === null || (destinationMap?.hasInteracted() ?? false);
      return valid;
    }
    if (step.id === 'origin-floor') return state.originFloor !== null && (state.originFloor === 0 || state.originElevator !== null);
    if (step.id === 'destination-floor') {
      return state.destinationFloor !== null && (state.destinationFloor === 0 || state.destinationElevator !== null);
    }
    if (step.id === 'packing') return state.wantsPacking !== null;
    if (step.id === 'labor') return state.laborChoice !== null;
    if (step.id === 'schedule') return calendar.getSelected() !== null && timePicker.getSelected() !== null;
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

  function resolveVehiclePricing(vehicleId: string | null): { basePrice: number; perKmRate: number; floorCostExempt: boolean } {
    const v = vehicleTypes.find((item) => item.id === vehicleId);
    if (v) return { basePrice: v.basePrice, perKmRate: v.perKmRate, floorCostExempt: v.floorCostExempt };
    return { basePrice: 1300000, perKmRate: 32000, floorCostExempt: false };
  }

  function serviceLabel(): string {
    return `${categoryLabel()} — ${vehicleLabel()}`;
  }

  function propertyTypeLabel(id: string | null): string {
    const t = PROPERTY_TYPES.find((item) => item.id === id);
    return t ? pick(t.label, t.labelEn) : '';
  }

  async function submitRequest(): Promise<void> {
    const date = calendar.getSelected();
    const time = timePicker.getSelected();
    const originValue = origin.getValue();
    const destinationValue = destination.getValue();
    if (
      !date ||
      !time ||
      !originValue ||
      !destinationValue ||
      !state.serviceId ||
      !state.vehicleId ||
      !state.laborChoice ||
      !state.originPropertyType ||
      !state.destinationPropertyType
    ) {
      return;
    }

    const originPosition = originMap?.getPosition();
    const destinationPosition = destinationMap?.getPosition();

      const estimateInput = {
        ...resolveVehiclePricing(state.vehicleId),
        originFloor: state.originFloor ?? 0,
        originHasElevator: state.originElevator ?? true,
        originPropertyType: state.originPropertyType,
        originLat: originPosition?.lat ?? null,
        originLng: originPosition?.lng ?? null,
        destinationFloor: state.destinationFloor ?? 0,
        destinationHasElevator: state.destinationElevator ?? true,
        destinationPropertyType: state.destinationPropertyType,
        destinationLat: destinationPosition?.lat ?? null,
        destinationLng: destinationPosition?.lng ?? null,
        wantsPacking: state.wantsPacking ?? false,
        laborChoice: state.laborChoice,
        laborCount: state.laborCount,
        heavyItemsCount: state.heavyItemsCount,
      };
      const estimate = estimateCost(estimateInput);
      const detailedInvoice = calculateDetailedInvoice(estimateInput);

      const name = nameInput!.value.trim();
      const phone = phoneInput!.value.trim();
      submitError!.hidden = true;
      nextBtn!.disabled = true;
      nextBtn!.textContent = pick('در حال ثبت...', 'Submitting...');

      try {
        const { trackingCode } = await submitRequestApi({
          customerName: name,
          serviceId: state.serviceId,
          serviceLabel: serviceLabel(),
          originProvince: originValue.province,
          originCity: originValue.city,
          originCountry: (document.getElementById('wizard-origin-country') as HTMLSelectElement | null)?.value,
          originPropertyType: state.originPropertyType,
          originLat: originPosition?.lat ?? null,
          originLng: originPosition?.lng ?? null,
          originNotes: (document.getElementById('wizard-origin-notes') as HTMLTextAreaElement | null)?.value.trim() || undefined,
          destinationProvince: destinationValue.province,
          destinationCity: destinationValue.city,
          destinationCountry: (document.getElementById('wizard-destination-country') as HTMLSelectElement | null)?.value,
          destinationPropertyType: state.destinationPropertyType,
          destinationLat: destinationPosition?.lat ?? null,
          destinationLng: destinationPosition?.lng ?? null,
          destinationNotes: (document.getElementById('wizard-destination-notes') as HTMLTextAreaElement | null)?.value.trim() || undefined,
          originFloor: state.originFloor ?? 0,
          originElevator: state.originElevator ?? true,
          destinationFloor: state.destinationFloor ?? 0,
          destinationElevator: state.destinationElevator ?? true,
          wantsPacking: state.wantsPacking ?? false,
          laborChoice: state.laborChoice,
          laborCount: state.laborCount,
          scheduledDate: date,
          scheduledTime: formatTime(time),
          estimateMin: estimate.min,
          estimateAvg: estimate.avg,
          estimateMax: estimate.max,
          phone,
        });

        saveLastPhone(phone);
        saveLastName(name);
        const originNotes = (document.getElementById('wizard-origin-notes') as HTMLTextAreaElement | null)?.value.trim();
        const destinationNotes = (document.getElementById('wizard-destination-notes') as HTMLTextAreaElement | null)?.value.trim();
        trackingCodeEl!.textContent = toPersianDigits(trackingCode);
        trackEvent('order_submitted', { trackingCode, serviceId: state.serviceId, vehicleId: state.vehicleId });

        const selectedTier = INSURANCE_TIERS.find((t) => t.id === state.insuranceTier) || INSURANCE_TIERS[2];
        const insuranceTitle = pick(selectedTier.title, selectedTier.titleEn);
        const insuranceCoverage = pick(selectedTier.coverageCeiling, selectedTier.coverageCeilingEn);

        finalSummaryEl!.innerHTML = `
          <div class="request-summary-row"><dt>${pick('نام', 'Name')}</dt><dd>${name}</dd></div>
          <div class="request-summary-row"><dt>${pick('نوع خدمت', 'Service type')}</dt><dd>${categoryLabel()}</dd></div>
          <div class="request-summary-row"><dt>${pick('وسیله نقلیه', 'Vehicle')}</dt><dd>${vehicleLabel()}</dd></div>
          <div class="request-summary-row"><dt>${pick('مسیر', 'Route')}</dt><dd>${displayCityName(originValue.province, originValue.city)}${pick('،', ',')} ${displayProvinceName(originValue.province)} ← ${displayCityName(destinationValue.province, destinationValue.city)}${pick('،', ',')} ${displayProvinceName(destinationValue.province)}</dd></div>
          <div class="request-summary-row"><dt>${pick('نوع مکان', 'Property type')}</dt><dd>${propertyTypeLabel(state.originPropertyType)} ← ${propertyTypeLabel(state.destinationPropertyType)}</dd></div>
          <div class="request-summary-row"><dt>${pick('زمان', 'Time')}</dt><dd>${date} — ${pick('ساعت', 'at')} ${formatTime(time)}</dd></div>
          <div class="request-summary-row"><dt>${pick('پوشش بیمه و خسارت', 'Insurance Coverage')}</dt><dd>${insuranceTitle} (${insuranceCoverage})</dd></div>
          <div class="request-summary-row" style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 8px 12px; margin: 6px 0;"><dt style="color: #166534; font-weight: bold;">${pick('تاییدیه نهایی', 'Final Confirmation')}</dt><dd style="color: #15803d; font-weight: 600;">${pick(`نهایی شدن توسط ${brandName} پس از بررسی صورت خواهد گرفت.`, `Finalization by ${brandName} will take place after review.`)}</dd></div>
          <div class="request-summary-row"><dt>${pick('موبایل', 'Mobile')}</dt><dd>${toPersianDigits(phone)}</dd></div>
          ${originNotes ? `<div class="request-summary-row"><dt>${pick('توضیحات مبدأ', 'Origin notes')}</dt><dd>${originNotes}</dd></div>` : ''}
          ${destinationNotes ? `<div class="request-summary-row"><dt>${pick('توضیحات مقصد', 'Destination notes')}</dt><dd>${destinationNotes}</dd></div>` : ''}
          <div class="wizard-success-invoice-cta" style="margin-top: 18px; text-align: center; width: 100%;">
            <button type="button" class="btn btn-primary" id="wizard-view-invoice-btn" style="width: 100%; max-width: 320px; margin: 0 auto; gap: 8px;">
              <span class="icon">${icons.fileText}</span>
              <span>${pick('مشاهده و دریافت فاکتور رسمی', 'View & Print Official Invoice')}</span>
            </button>
          </div>
        `;

        const viewInvoiceBtn = document.getElementById('wizard-view-invoice-btn');
        viewInvoiceBtn?.addEventListener('click', () => {
          openCustomerInvoiceModal({
            trackingCode,
            customerName: name,
            phone,
            serviceLabel: serviceLabel(),
            originProvince: originValue.province,
            originCity: originValue.city,
            destinationProvince: destinationValue.province,
            destinationCity: destinationValue.city,
            scheduledDate: date,
            scheduledTime: formatTime(time),
            statusLabel: pick('ثبت شده — در انتظار بررسی', 'Submitted — Pending'),
            invoice: detailedInvoice,
          });
        });

        card!.querySelectorAll<HTMLElement>('.request-panel[data-panel]').forEach((el) => {
          el.hidden = el.dataset.panel !== 'success';
        });
      document.querySelector('.wizard-progress')?.setAttribute('hidden', '');
      questionEl!.hidden = true;
      footer!.hidden = true;
    } catch (err) {
      submitError!.hidden = false;
      submitError!.textContent = err instanceof Error ? err.message : pick('ثبت درخواست ناموفق بود. دوباره تلاش کنید.', 'Failed to submit the request. Please try again.');
      nextBtn!.disabled = false;
      nextBtn!.textContent = pick('ثبت درخواست', 'Submit request');
    }
  }

  nextBtn.addEventListener('click', () => {
    if (!validateCurrentStep()) return;

    if (STEPS[currentStep - 1].id === 'destination' && state.vehicleId === 'motorcycle' && isRouteIntercity()) {
      refreshVehicleAvailability(true);
      currentStep = 2;
      updateStepUI();
      return;
    }

    if (currentStep === TOTAL_STEPS) {
      void submitRequest();
      return;
    }
    advanceStep(1);
  });

  backBtn.addEventListener('click', () => {
    advanceStep(-1);
  });

  updateStepUI();

  return {
    selectService: (serviceId: string) => {
      setServiceSelection(serviceId);
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    setSavedAddresses: (addresses: SavedAddresses) => {
      // اگر مبدأ ثابت تنظیم شده، انتخاب مبدأ از قبل قفل است — نمایش لیست آدرس‌های قبلی برای آن معنی ندارد.
      if (!fixedOriginCity) wireSavedAddressPicker('wizard-origin', origin, addresses.origins);
      wireSavedAddressPicker('wizard-destination', destination, addresses.destinations);
    },
  };
}

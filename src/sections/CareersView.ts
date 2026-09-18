import { icons } from '../components/icons.ts';
import { pick } from '../i18n/lang.ts';
import { API_BASE_URL } from '../data/config.ts';
import type { VehicleTypeSetting, CareerPositionSetting } from '../utils/dynamicContent.ts';
import { DEFAULT_VEHICLE_TYPES } from '../data/services.ts';

const FALLBACK_POSITIONS: { id: string; label: string; labelEn: string; requiresVehicle?: boolean }[] = [
  { id: 'technician', label: 'تکنسین و استادکار فنی', labelEn: 'Technical Specialist', requiresVehicle: false },
  { id: 'hvac_specialist', label: 'سرویس‌کار پکیج و کولر', labelEn: 'HVAC Specialist', requiresVehicle: false },
  { id: 'plumber', label: 'متخصص لوله‌کشی و نشت‌یاب', labelEn: 'Plumbing Expert', requiresVehicle: false },
  { id: 'electrician', label: 'برقکار ساختمان', labelEn: 'Electrician', requiresVehicle: false },
  { id: 'other', label: 'سایر تخصص‌های ساختمانی', labelEn: 'Other Building Trades', requiresVehicle: false },
];

const TECH_VEHICLE_OPTIONS = [
  { id: 'motorcycle', label: 'موتورسیکلت (اعزام سریع شهری)', labelEn: 'Motorcycle (Fast City Dispatch)' },
  { id: 'car', label: 'خودرو سواری شخصی (جابه‌جایی ابزار)', labelEn: 'Car (Personal Toolkit)' },
  { id: 'pickup', label: 'وانت بار سبک / پراید وانت', labelEn: 'Small Pickup' },
  { id: 'public_transit', label: 'فاقد وسیله (حمل‌ونقل عمومی)', labelEn: 'Public Transit' },
];

export function renderCareersView(
  _vehicleTypes: VehicleTypeSetting[] = DEFAULT_VEHICLE_TYPES,
  careerPositions?: CareerPositionSetting[],
  siteName?: { fa?: string; en?: string },
): string {
  const activePositions = Array.isArray(careerPositions) && careerPositions.length
    ? careerPositions.filter((p) => p.active !== false).map((p) => ({
        id: p.id,
        label: p.title,
        labelEn: p.titleEn || p.title,
        requiresVehicle: Boolean(p.requiresVehicle),
      }))
    : FALLBACK_POSITIONS;

  const positionsToUse = activePositions.length ? activePositions : FALLBACK_POSITIONS;
  const brandFa = siteName?.fa || 'بهدون';
  const brandEn = siteName?.en || 'Behdoon';

  return `
    <article class="orders-page careers-page">
      <div class="orders-header">
        <nav class="article-breadcrumb" aria-label="${pick('مسیر صفحه', 'Breadcrumb')}">
          <a href="/">${pick('خانه', 'Home')}</a>
          <span class="icon breadcrumb-separator">${icons.chevronLeft}</span>
          <span aria-current="page">${pick('فرصت‌های شغلی', 'Careers')}</span>
        </nav>
        <h1 class="article-title">${pick(`فرصت‌های شغلی ${brandFa}`, `Careers at ${brandEn}`)}</h1>
        <p class="article-meta">${pick('پیوستن به شبکه متخصصین، تکنسین‌ها و استادکاران مجرب بهدون در تهران', 'Join Behdoon network of certified technicians and master craftspeople in Tehran')}</p>
      </div>

      <div class="article-body">
        <div class="careers-form-card" id="careers-form-card">
          <form id="careers-form">
            <div class="careers-form-grid">
              <div class="form-field">
                <label for="careers-name">${pick('نام و نام خانوادگی', 'Full name')}</label>
                <div class="input-wrapper">
                  <input type="text" id="careers-name" autocomplete="name" required />
                  <span class="icon input-icon">${icons.user}</span>
                </div>
              </div>
              <div class="form-field">
                <label for="careers-phone">${pick('شماره موبایل', 'Mobile number')}</label>
                <div class="input-wrapper">
                  <input type="tel" id="careers-phone" placeholder="${pick('۰۹xxxxxxxxx', '09xxxxxxxxx')}" inputmode="numeric" autocomplete="tel" required />
                  <span class="icon input-icon">${icons.phone}</span>
                </div>
              </div>
            </div>

            <div class="careers-form-grid">
              <div class="form-field">
                <label for="careers-position">${pick('موقعیت شغلی مورد نظر', 'Position of interest')}</label>
                <div class="select-wrapper">
                  <select id="careers-position">
                    ${positionsToUse.map((p) => `<option value="${p.id}" ${p.requiresVehicle ? 'data-requires-vehicle="true"' : ''}>${pick(p.label, p.labelEn)}</option>`).join('')}
                    <option value="other">${pick('سایر تخصص‌های فنی', 'Other technical trades')}</option>
                  </select>
                  <span class="icon select-chevron">${icons.chevronDown}</span>
                </div>
              </div>
              <div class="form-field">
                <label for="careers-city">${pick('منطقه / محله سکونت در تهران', 'District / Neighborhood in Tehran')}</label>
                <div class="input-wrapper">
                  <input type="text" id="careers-city" placeholder="${pick('مثال: منطقه ۲، ستارخان', 'e.g. District 2')}" autocomplete="address-level2" />
                  <span class="icon input-icon">${icons.pin}</span>
                </div>
              </div>
            </div>

            <div class="form-field" id="careers-custom-position-field" hidden>
              <label for="careers-custom-position">${pick('عنوان شغلی مورد نظر', 'Desired position title')}</label>
              <div class="input-wrapper">
                <input type="text" id="careers-custom-position" />
              </div>
            </div>

            <div class="careers-form-grid" id="careers-vehicle-field" hidden>
              <div class="form-field">
                <label for="careers-has-vehicle">${pick('آیا وسیله نقلیه دارید؟', 'Do you have your own vehicle?')}</label>
                <div class="select-wrapper">
                  <select id="careers-has-vehicle">
                    <option value="yes">${pick('بله', 'Yes')}</option>
                    <option value="no">${pick('خیر', 'No')}</option>
                  </select>
                  <span class="icon select-chevron">${icons.chevronDown}</span>
                </div>
              </div>
              <div class="form-field" id="careers-vehicle-type-field">
                <label for="careers-vehicle-type">${pick('نوع وسیله رفت‌وآمد', 'Transportation type')}</label>
                <div class="select-wrapper">
                  <select id="careers-vehicle-type">
                    ${TECH_VEHICLE_OPTIONS.map((v) => `<option value="${v.id}">${pick(v.label, v.labelEn)}</option>`).join('')}
                  </select>
                  <span class="icon select-chevron">${icons.chevronDown}</span>
                </div>
              </div>
            </div>

            <div class="form-field">
              <label for="careers-message">${pick('توضیحات و سابقه کاری (اختیاری)', 'Notes and work experience (optional)')}</label>
              <textarea id="careers-message" class="careers-textarea" rows="4"></textarea>
            </div>

            <p class="request-panel-error" id="careers-form-error" hidden></p>
            <button type="submit" class="btn btn-primary btn-block" id="careers-submit-btn">${pick('ارسال درخواست همکاری', 'Submit application')}</button>
          </form>
        </div>

        <div class="request-panel wizard-success careers-success" id="careers-success" hidden>
          <span class="request-success-icon">${icons.checkCircle}</span>
          <h3>${pick('درخواست شما ثبت شد', 'Your application has been submitted')}</h3>
          <p>${pick('همکاران ما پس از بررسی با شما تماس می‌گیرند.', 'Our team will review it and get in touch with you.')}</p>
        </div>
      </div>
    </article>
  `;
}

export function initCareersView(): void {
  const form = document.getElementById('careers-form') as HTMLFormElement | null;
  const formCard = document.getElementById('careers-form-card');
  const successEl = document.getElementById('careers-success');
  const errorEl = document.getElementById('careers-form-error');
  const positionSelect = document.getElementById('careers-position') as HTMLSelectElement | null;
  const customField = document.getElementById('careers-custom-position-field');
  const vehicleField = document.getElementById('careers-vehicle-field');
  const hasVehicleSelect = document.getElementById('careers-has-vehicle') as HTMLSelectElement | null;
  const vehicleTypeField = document.getElementById('careers-vehicle-type-field');
  const submitBtn = document.getElementById('careers-submit-btn') as HTMLButtonElement | null;
  if (!form || !formCard || !successEl || !errorEl || !positionSelect || !customField || !vehicleField || !hasVehicleSelect || !vehicleTypeField || !submitBtn)
    return;

  function syncVisibility(): void {
    const opt = positionSelect!.selectedOptions?.[0];
    const isOther = positionSelect!.value === 'other' || positionSelect!.value.startsWith('pos_other');
    const isVehicleRequired = opt?.getAttribute('data-requires-vehicle') === 'true' || positionSelect!.value === 'driver';

    customField!.hidden = !isOther;
    vehicleField!.hidden = !isVehicleRequired;
    vehicleTypeField!.hidden = hasVehicleSelect!.value !== 'yes';
  }

  positionSelect.addEventListener('change', syncVisibility);
  hasVehicleSelect.addEventListener('change', syncVisibility);
  syncVisibility();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorEl!.hidden = true;

    const fullName = (document.getElementById('careers-name') as HTMLInputElement).value.trim();
    const phone = (document.getElementById('careers-phone') as HTMLInputElement).value.trim();
    const opt = positionSelect!.selectedOptions?.[0];
    const isOther = positionSelect!.value === 'other' || positionSelect!.value.startsWith('pos_other');
    const isVehicleRequired = opt?.getAttribute('data-requires-vehicle') === 'true' || positionSelect!.value === 'driver';
    const position = positionSelect!.value;
    const customLabel = (document.getElementById('careers-custom-position') as HTMLInputElement).value.trim();
    const positionLabel = isOther ? customLabel : (opt?.textContent?.trim() || position);
    const city = (document.getElementById('careers-city') as HTMLInputElement).value.trim();
    const message = (document.getElementById('careers-message') as HTMLTextAreaElement).value.trim();
    const hasVehicle = isVehicleRequired ? hasVehicleSelect!.value === 'yes' : undefined;
    const vehicleType = hasVehicle ? (document.getElementById('careers-vehicle-type') as HTMLSelectElement).value : undefined;

    if (!fullName || !phone) {
      errorEl!.hidden = false;
      errorEl!.textContent = pick('نام و شماره موبایل الزامی است.', 'Full name and mobile number are required.');
      return;
    }
    if (isOther && !positionLabel) {
      errorEl!.hidden = false;
      errorEl!.textContent = pick('عنوان شغلی مورد نظر را وارد کنید.', 'Please enter the desired position title.');
      return;
    }

    submitBtn!.disabled = true;
    try {
      const res = await fetch(`${API_BASE_URL}/api/job-applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phone, position, positionLabel, city: city || undefined, message: message || undefined, hasVehicle, vehicleType }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : pick('ارسال درخواست ناموفق بود.', 'Failed to submit the application.'));

      formCard!.hidden = true;
      successEl!.hidden = false;
    } catch (err) {
      errorEl!.hidden = false;
      errorEl!.textContent = err instanceof Error ? err.message : pick('ارسال درخواست ناموفق بود.', 'Failed to submit the application.');
    } finally {
      submitBtn!.disabled = false;
    }
  });
}

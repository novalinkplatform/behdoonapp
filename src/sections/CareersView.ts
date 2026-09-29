import { icons } from '../components/icons.ts';
import { pick } from '../i18n/lang.ts';
import { API_BASE_URL } from '../data/config.ts';
import type { VehicleTypeSetting, CareerPositionSetting } from '../utils/dynamicContent.ts';
import { DEFAULT_VEHICLE_TYPES } from '../data/services.ts';

const SPECIALTY_OPTIONS: { id: string; label: string; labelEn: string }[] = [
  { id: 'hvac_package', label: 'سرمایش و گرمایش (پکیج، رادیاتور، موتورخانه)', labelEn: 'HVAC, Boilers & Heating' },
  { id: 'hvac_ac', label: 'کولر گازی، اسپلیت و کولر آبی', labelEn: 'Air Conditioning & Evaporative Coolers' },
  { id: 'plumbing_leak', label: 'لوله‌کشی، نشت‌یابی با دستگاه و تخلیه چاه', labelEn: 'Plumbing, Leak Detection & Drainage' },
  { id: 'electrical', label: 'برقکاری ساختمان، رفع اتصالی و تابلو برق', labelEn: 'Electrical Wiring & Circuit Breakers' },
  { id: 'renovation', label: 'بنایی، نقاشی، کاشی‌کاری و بازسازی کامل', labelEn: 'Renovation, Painting & Tiling' },
  { id: 'locksmith', label: 'کلیدسازی شبانه‌روزی و قفل‌های هوشمند و ضدسرقت', labelEn: '24/7 Locksmith & Smart Locks' },
  { id: 'carpentry', label: 'کابینت، کمد دیواری، نجاری و ام‌دی‌اف', labelEn: 'Cabinetry, Carpentry & MDF' },
  { id: 'doors_windows', label: 'نصب و تعمیر در و پنجره دوجداره و شیشه', labelEn: 'Doors, Windows & Glazing' },
  { id: 'cleaning', label: 'نظافت مشاعات، نماشویی و خدمات شرکتی', labelEn: 'Facility & Building Cleaning' },
  { id: 'other', label: 'سایر تخصص‌های فنی و ساختمانی', labelEn: 'Other Technical & Building Trades' },
];

const EXPERIENCE_OPTIONS = [
  { id: '1-3', label: '۱ تا ۳ سال سابقه کار', labelEn: '1 - 3 years' },
  { id: '3-5', label: '۳ تا ۵ سال سابقه کار', labelEn: '3 - 5 years' },
  { id: '5-10', label: '۵ تا ۱۰ سال سابقه کار (حرفه‌ای)', labelEn: '5 - 10 years (Pro)' },
  { id: '10+', label: 'بیش از ۱۰ سال سابقه کار (استادکار ارشد)', labelEn: '10+ years (Master)' },
];

const TEHRAN_DISTRICT_OPTIONS = [
  { id: 'all', label: 'تمامی مناطق ۲۲‌گانه شهر تهران (پوشش سراسری)', labelEn: 'All 22 Tehran Districts' },
  { id: 'north', label: 'شمال تهران (مناطق ۱، ۲، ۳)', labelEn: 'North Tehran (Districts 1, 2, 3)' },
  { id: 'west', label: 'غرب تهران (مناطق ۲، ۵، ۲۱، ۲۲)', labelEn: 'West Tehran (Districts 2, 5, 21, 22)' },
  { id: 'east', label: 'شرق تهران (مناطق ۴، ۸، ۱۳، ۱۴)', labelEn: 'East Tehran (Districts 4, 8, 13, 14)' },
  { id: 'center', label: 'مرکز تهران (مناطق ۶، ۷، ۱۰، ۱۱، ۱۲)', labelEn: 'Central Tehran (Districts 6, 7, 10, 11, 12)' },
  { id: 'south', label: 'جنوب تهران (مناطق ۱۵ تا ۲۰)', labelEn: 'South Tehran (Districts 15 to 20)' },
];

const TOOLS_OPTIONS = [
  { id: 'full', label: 'ابزارآلات کامل، تخصصی و پیشرفته دارم', labelEn: 'I have full professional toolkit' },
  { id: 'basic', label: 'ابزارآلات اولیه و ضروری دارم', labelEn: 'I have basic necessary tools' },
  { id: 'need_help', label: 'تمایل به دریافت تسهیلات خرید ابزار از بهدون دارم', labelEn: 'Interested in tool financing assistance' },
];

const TRANSPORT_OPTIONS = [
  { id: 'motorcycle', label: 'موتورسیکلت (اعزام سریع شهری)', labelEn: 'Motorcycle (Swift City Dispatch)' },
  { id: 'car', label: 'خودرو سواری شخصی (جابه‌جایی ابزار و تجهیزات)', labelEn: 'Personal Passenger Car' },
  { id: 'pickup', label: 'وانت بار سبک یا پراید وانت', labelEn: 'Light Pickup Truck' },
  { id: 'public', label: 'فاقد وسیله نقلیه (حمل‌ونقل عمومی / مترو)', labelEn: 'Public Transit' },
];

export function renderCareersView(
  _vehicleTypes: VehicleTypeSetting[] = DEFAULT_VEHICLE_TYPES,
  careerPositions?: CareerPositionSetting[],
  siteName?: { fa?: string; en?: string },
): string {
  const brandFa = siteName?.fa || 'بهدون';
  const brandEn = siteName?.en || 'Behdoon';

  const positionsToUse = Array.isArray(careerPositions) && careerPositions.length
    ? careerPositions.filter((p) => p.active !== false).map((p) => ({
        id: p.id,
        label: p.title,
        labelEn: p.titleEn || p.title,
      }))
    : SPECIALTY_OPTIONS;

  return `
    <article class="orders-page careers-page">
      <div class="careers-hero-banner">
        <div class="container">
          <nav class="article-breadcrumb" aria-label="${pick('مسیر صفحه', 'Breadcrumb')}">
            <a href="/">${pick('خانه', 'Home')}</a>
            <span class="icon breadcrumb-separator">${icons.chevronLeft}</span>
            <span aria-current="page">${pick('فرصت‌های شغلی و جذب متخصص', 'Careers & Hiring')}</span>
          </nav>

          <div class="careers-hero-content">
            <span class="careers-badge">
              <span class="icon">${icons.badge || icons.briefcase}</span>
              <span>${pick('فرصت طلایی جذب استادکاران و متخصصین تهران', 'Tehran Master Technicians Network')}</span>
            </span>
            <h1 class="careers-main-title">
              ${pick(`اگر تخصص فنی یا ساختمانی دارید، به جمع متخصصین ${brandFa} بپیوندید`, `Join the ${brandEn} Network of Master Technicians`)}
            </h1>
            <p class="careers-main-subtitle">
              ${pick(
                'کسب درآمد ماهیانه تا بیش از ۵۰ میلیون تومان، بدون واسطه، با تسویه حساب منظم روزانه، ساعات کاری منعطف و سفارشات پرتعداد در کلیه مناطق ۲۲‌گانه تهران.',
                'Earn up to 50M+ Tomans monthly with zero middleman fees, instant daily settlements, flexible working hours, and steady bookings across Tehran.'
              )}
            </p>
          </div>
        </div>
      </div>

      <div class="container careers-layout-container">
        <!-- Perks Grid -->
        <section class="careers-perks-section" aria-label="${pick('مزایای همکاری با بهدون', 'Why join Behdoon')}">
          <h2 class="careers-section-heading">
            ${pick(`چرا تکنسین‌ها و استادکاران ${brandFa} را انتخاب می‌کنند؟`, `Why Specialists Choose ${brandEn}`)}
          </h2>
          <div class="careers-perks-grid">
            <div class="careers-perk-card">
              <div class="perk-icon-wrap perk-icon-money">
                <span class="icon">${icons.fileText}</span>
              </div>
              <h3>${pick('تسویه حساب روزانه و منظم', 'Daily Payouts')}</h3>
              <p>${pick('بالاترین درصد کمیسیون به سود متخصص؛ واریز مستقیم درآمد و اجرت به شماره شبای شما پس از اتمام هر خدمت بدون تاخیر.', 'Highest revenue share for specialists; daily direct deposits to your bank account with zero delays.')}</p>
            </div>

            <div class="careers-perk-card">
              <div class="perk-icon-wrap perk-icon-shield">
                <span class="icon">${icons.shield}</span>
              </div>
              <h3>${pick('پوشش بیمه حوادث و مسئولیت', 'Liability Insurance')}</h3>
              <p>${pick('آرامش خاطر کامل حین کار؛ کلیه خدمات و پروژه‌ها تحت پوشش بیمه حوادث و مسئولیت مدنی معتبر بهدون قرار دارند.', 'Full peace of mind on site; every project is backed by comprehensive accidental and liability coverage.')}</p>
            </div>

            <div class="careers-perk-card">
              <div class="perk-icon-wrap perk-icon-clock">
                <span class="icon">${icons.clock}</span>
              </div>
              <h3>${pick('ساعات کاری دلخواه و انتخاب محله', 'Flexible Schedule & Zones')}</h3>
              <p>${pick('رئیس زمان خود باشید؛ تعیین شیفت‌های کاری به دلخواه شما و انتخاب محله‌ها و مناطق فعالیت در محدوده سکونت خودتان.', 'Be your own boss; set your work hours freely and choose service zones closest to your neighborhood.')}</p>
            </div>

            <div class="careers-perk-card">
              <div class="perk-icon-wrap perk-icon-phone">
                <span class="icon">${icons.phone}</span>
              </div>
              <h3>${pick('سفارشات مداوم و پشتیبانی ۲۴/۷', 'Steady Requests & 24/7 Support')}</h3>
              <p>${pick('بدون نیاز به بازاریابی شخصی؛ دریافت پیوسته و هوشمند سفارشات ساختمانی فعال همراه با پشتیبانی شبانه‌روزی تیم بهدون.', 'No need for personal advertising; receive nonstop matched orders with 24/7 dispatcher backup.')}</p>
            </div>
          </div>
        </section>

        <!-- 3 Steps Process -->
        <section class="careers-steps-section">
          <h2 class="careers-section-heading">
            ${pick('مراحل ساده ۳ گانه پیوستن به بهدون', '3 Simple Steps to Start')}
          </h2>
          <div class="careers-steps-grid">
            <div class="careers-step-card">
              <div class="step-number">۱</div>
              <h4>${pick('ثبت‌نام و تکمیل فرم زیر', '1. Submit the Form')}</h4>
              <p>${pick('اطلاعات هویتی، حوزه تخصص فنی و سال‌های سابقه خود را در فرم زیر وارد نمایید.', 'Fill in your name, trade specialty, and experience in under 2 minutes.')}</p>
            </div>
            <div class="careers-step-card">
              <div class="step-number">۲</div>
              <h4>${pick('تماس کارشناسان و تایید مدارک', '2. Quick Verification')}</h4>
              <p>${pick('کارشناسان امور متخصصین ظرف ۲۴ ساعت با شما تماس گرفته و مدارک مهارتی را استعلام می‌کنند.', 'Our recruitment team contacts you within 24h to verify your technical credentials.')}</p>
            </div>
            <div class="careers-step-card">
              <div class="step-number">۳</div>
              <h4>${pick('دریافت لباس کار و شروع درآمد', '3. Receive Orders')}</h4>
              <p>${pick('پس از تایید نهایی، نشان شناسایی و کارت پرسنلی صادر شده و بلافاصله دریافت سفارش آغاز می‌شود.', 'Receive your official ID and start taking high-paying jobs immediately.')}</p>
            </div>
          </div>
        </section>

        <!-- Application Form -->
        <div class="careers-form-container">
          <div class="careers-form-card" id="careers-form-card">
            <div class="careers-form-header">
              <span class="icon form-head-icon">${icons.briefcase}</span>
              <div>
                <h2>${pick('فرم درخواست همکاری و استخدام تکنسین', 'Specialist Application Form')}</h2>
                <p>${pick('اطلاعات خود را با دقت وارد فرمایید تا کارشناسان جذب بهدون در سریع‌ترین زمان با شما تماس بگیرند.', 'Please provide accurate details; our recruitment team will reach out promptly.')}</p>
              </div>
            </div>

            <form id="careers-form" class="careers-form-inner">
              <div class="careers-form-grid-2">
                <div class="form-field">
                  <label for="careers-name">
                    ${pick('نام و نام خانوادگی کامل', 'Full Name')} <span class="required-star">*</span>
                  </label>
                  <div class="input-wrapper">
                    <input type="text" id="careers-name" placeholder="${pick('مثال: محمد رضایی', 'e.g. Mohammad Rezaei')}" autocomplete="name" required />
                    <span class="icon input-icon">${icons.user}</span>
                  </div>
                </div>

                <div class="form-field">
                  <label for="careers-phone">
                    ${pick('شماره تلفن همراه فعال', 'Mobile Number')} <span class="required-star">*</span>
                  </label>
                  <div class="input-wrapper">
                    <input type="tel" id="careers-phone" placeholder="${pick('۰۹xxxxxxxxx', '09xxxxxxxxx')}" inputmode="numeric" autocomplete="tel" required />
                    <span class="icon input-icon">${icons.phone}</span>
                  </div>
                </div>
              </div>

              <div class="careers-form-grid-2">
                <div class="form-field">
                  <label for="careers-national-id">
                    ${pick('کد ملی (۱۰ رقم)', 'National ID (10 digits)')}
                  </label>
                  <div class="input-wrapper">
                    <input type="text" id="careers-national-id" maxlength="10" placeholder="${pick('جهت صدور بیمه و استعلام سوابق', 'For insurance registration')}" dir="ltr" inputmode="numeric" />
                    <span class="icon input-icon">${icons.shield}</span>
                  </div>
                </div>

                <div class="form-field">
                  <label for="careers-position">
                    ${pick('حوزه تخصص اصلی شما', 'Primary Technical Specialty')} <span class="required-star">*</span>
                  </label>
                  <div class="select-wrapper">
                    <select id="careers-position" required>
                      ${positionsToUse.map((p) => `<option value="${p.id}">${pick(p.label, p.labelEn)}</option>`).join('')}
                    </select>
                    <span class="icon select-chevron">${icons.chevronDown}</span>
                  </div>
                </div>
              </div>

              <div class="form-field" id="careers-custom-position-field" hidden>
                <label for="careers-custom-position">${pick('عنوان تخصص ساختمانی مورد نظر', 'Custom Specialty Title')}</label>
                <div class="input-wrapper">
                  <input type="text" id="careers-custom-position" placeholder="${pick('مثال: نصاب سقف کاذب و عایق‌کاری', 'e.g. Insulation installer')}" />
                </div>
              </div>

              <div class="careers-form-grid-2">
                <div class="form-field">
                  <label for="careers-experience">
                    ${pick('میزان سابقه کار فنی شما', 'Years of Experience')} <span class="required-star">*</span>
                  </label>
                  <div class="select-wrapper">
                    <select id="careers-experience">
                      ${EXPERIENCE_OPTIONS.map((e) => `<option value="${e.id}">${pick(e.label, e.labelEn)}</option>`).join('')}
                    </select>
                    <span class="icon select-chevron">${icons.chevronDown}</span>
                  </div>
                </div>

                <div class="form-field">
                  <label for="careers-districts">
                    ${pick('محدوده و مناطق مورد تمایل برای کار در تهران', 'Preferred Tehran Districts')}
                  </label>
                  <div class="select-wrapper">
                    <select id="careers-districts">
                      ${TEHRAN_DISTRICT_OPTIONS.map((d) => `<option value="${d.id}">${pick(d.label, d.labelEn)}</option>`).join('')}
                    </select>
                    <span class="icon select-chevron">${icons.chevronDown}</span>
                  </div>
                </div>
              </div>

              <div class="careers-form-grid-2">
                <div class="form-field">
                  <label for="careers-tools">
                    ${pick('وضعیت ابزارآلات و تجهیزات فنی', 'Tool & Equipment Status')}
                  </label>
                  <div class="select-wrapper">
                    <select id="careers-tools">
                      ${TOOLS_OPTIONS.map((t) => `<option value="${t.id}">${pick(t.label, t.labelEn)}</option>`).join('')}
                    </select>
                    <span class="icon select-chevron">${icons.chevronDown}</span>
                  </div>
                </div>

                <div class="form-field">
                  <label for="careers-vehicle">
                    ${pick('نوع وسیله نقلیه برای تردد', 'Transportation Mode')}
                  </label>
                  <div class="select-wrapper">
                    <select id="careers-vehicle">
                      ${TRANSPORT_OPTIONS.map((tr) => `<option value="${tr.id}">${pick(tr.label, tr.labelEn)}</option>`).join('')}
                    </select>
                    <span class="icon select-chevron">${icons.chevronDown}</span>
                  </div>
                </div>
              </div>

              <div class="form-field">
                <label for="careers-message">
                  ${pick('سوابق کاری، مدارک فنی‌وحرفه‌ای یا توضیحات تکمیلی (اختیاری)', 'Work Experience, Vocational Certs & Notes')}
                </label>
                <textarea
                  id="careers-message"
                  class="careers-textarea"
                  rows="3"
                  placeholder="${pick('مثال: دارای مدرک درجه ۱ تأسیسات از سازمان فنی‌وحرفه‌ای، سابقه کار در برج‌های نیاوران، مسلط به پکیج‌های ایران‌رادیاتور و بوتان...', 'e.g. Certified technician, experienced in commercial and residential repairs...')}"
                ></textarea>
              </div>

              <p class="request-panel-error" id="careers-form-error" hidden></p>

              <button type="submit" class="btn btn-primary btn-block careers-submit-btn" id="careers-submit-btn">
                <span class="icon">${icons.checkCircle || icons.check}</span>
                <span>${pick('ارسال مدارک و ثبت درخواست همکاری تکنسین', 'Submit Technician Application')}</span>
              </button>
            </form>
          </div>

          <div class="careers-success-card" id="careers-success" hidden>
            <div class="success-icon-badge">
              <span class="icon">${icons.checkCircle}</span>
            </div>
            <h3>${pick('درخواست همکاری شما با موفقیت ثبت شد!', 'Your Application Has Been Registered!')}</h3>
            <p class="success-lead">
              ${pick(
                'اطلاعات فنی و سوابق شما با کد رهگیری اختصاصی در سامانه بهدون ثبت گردید.',
                'Your application has been received and queued in Behdoon system.'
              )}
            </p>
            <div class="success-steps-hint">
              <div class="hint-item">
                <span class="icon hint-icon">${icons.clock}</span>
                <span>${pick('تماس کارشناسان امور متخصصین ظرف حداکثر ۲۴ ساعت کاری', 'Our recruiter will call you within 24 working hours')}</span>
              </div>
              <div class="hint-item">
                <span class="icon hint-icon">${icons.phone}</span>
                <span>${pick('پشتیبانی مستقیم واحد جذب: ۰۹۳۳۳۲۵۶۸۸۵', 'Direct Careers Hotline: 09333256885')}</span>
              </div>
            </div>
            <div class="success-actions">
              <a href="/" class="btn btn-secondary">${pick('بازگشت به صفحه اصلی', 'Back to Home')}</a>
            </div>
          </div>
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
  const submitBtn = document.getElementById('careers-submit-btn') as HTMLButtonElement | null;

  if (!form || !formCard || !successEl || !errorEl || !positionSelect || !customField || !submitBtn) return;

  function syncVisibility(): void {
    const isOther = positionSelect!.value === 'other';
    customField!.hidden = !isOther;
  }

  positionSelect.addEventListener('change', syncVisibility);
  syncVisibility();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorEl!.hidden = true;

    const fullName = (document.getElementById('careers-name') as HTMLInputElement).value.trim();
    const phone = (document.getElementById('careers-phone') as HTMLInputElement).value.trim();
    const nationalId = (document.getElementById('careers-national-id') as HTMLInputElement)?.value.trim() || '';
    const opt = positionSelect!.selectedOptions?.[0];
    const isOther = positionSelect!.value === 'other';
    const position = positionSelect!.value;
    const customLabel = (document.getElementById('careers-custom-position') as HTMLInputElement)?.value.trim() || '';
    const positionLabel = isOther ? customLabel : (opt?.textContent?.trim() || position);

    const experienceSelect = document.getElementById('careers-experience') as HTMLSelectElement | null;
    const experienceLabel = experienceSelect?.selectedOptions?.[0]?.textContent?.trim() || '۱ تا ۳ سال سابقه';

    const districtsSelect = document.getElementById('careers-districts') as HTMLSelectElement | null;
    const districtsLabel = districtsSelect?.selectedOptions?.[0]?.textContent?.trim() || 'تمام مناطق تهران';

    const toolsSelect = document.getElementById('careers-tools') as HTMLSelectElement | null;
    const toolsLabel = toolsSelect?.selectedOptions?.[0]?.textContent?.trim() || 'ابزار کامل';

    const vehicleSelect = document.getElementById('careers-vehicle') as HTMLSelectElement | null;
    const vehicleVal = vehicleSelect?.value || 'motorcycle';
    const vehicleLabel = vehicleSelect?.selectedOptions?.[0]?.textContent?.trim() || 'موتورسیکلت';
    const hasVehicle = vehicleVal !== 'public';

    const rawMessage = (document.getElementById('careers-message') as HTMLTextAreaElement)?.value.trim() || '';

    if (!fullName || !phone) {
      errorEl!.hidden = false;
      errorEl!.textContent = pick('نام و شماره موبایل الزامی است.', 'Full name and mobile number are required.');
      return;
    }

    if (isOther && !positionLabel) {
      errorEl!.hidden = false;
      errorEl!.textContent = pick('عنوان تخصص مورد نظر را وارد نمایید.', 'Please specify your technical trade.');
      return;
    }

    // Build structured informative summary for admin review
    const metaSummary = [
      `کد ملی: ${nationalId || 'ثبت‌نشده'}`,
      `سابقه: ${experienceLabel}`,
      `تجهیزات: ${toolsLabel}`,
      `وسیله نقلیه: ${vehicleLabel}`,
      `محدوده ترجیحی: ${districtsLabel}`,
      rawMessage ? `\nتوضیحات متقاضی:\n${rawMessage}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    submitBtn!.disabled = true;
    submitBtn!.innerHTML = `<span>${pick('در حال ارسال درخواست...', 'Submitting application...')}</span>`;

    try {
      const res = await fetch(`${API_BASE_URL}/api/job-applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          position,
          positionLabel: `${positionLabel} (${experienceLabel})`,
          city: districtsLabel,
          message: metaSummary,
          hasVehicle,
          vehicleType: vehicleLabel,
        }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof body?.error === 'string' ? body.error : pick('ارسال درخواست ناموفق بود.', 'Failed to submit the application.'));
      }

      formCard!.hidden = true;
      successEl!.hidden = false;
      successEl!.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      errorEl!.hidden = false;
      errorEl!.textContent = err instanceof Error ? err.message : pick('ارسال درخواست ناموفق بود.', 'Failed to submit the application.');
    } finally {
      submitBtn!.disabled = false;
      submitBtn!.innerHTML = `
        <span class="icon">${icons.checkCircle || icons.check}</span>
        <span>${pick('ارسال مدارک و ثبت درخواست همکاری تکنسین', 'Submit Technician Application')}</span>
      `;
    }
  });
}

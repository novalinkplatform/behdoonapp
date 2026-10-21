import { icons } from '../components/icons.ts';
import { pick } from '../i18n/lang.ts';
import { API_BASE_URL } from '../data/config.ts';
import type { VehicleTypeSetting, CareerPositionSetting } from '../utils/dynamicContent.ts';
import { DEFAULT_VEHICLE_TYPES } from '../data/services.ts';

const SPECIALTY_OPTIONS: { id: string; label: string; labelEn: string }[] = [
  { id: 'hvac_package', label: 'تعمیر و سرویس پکیج دیواری، رادیاتور و آبگرمکن', labelEn: 'Wall Boilers & Radiators' },
  { id: 'hvac_ac', label: 'سرویس، نصب و تعمیر کولر آبی، گازی و اسپلیت', labelEn: 'AC & Evaporative Coolers' },
  { id: 'plumbing_pipe', label: 'لوله‌کشی آب، فاضلاب، پمپ آب و نصب شیرآلات', labelEn: 'Plumbing, Piping & Water Pumps' },
  { id: 'plumbing_leak', label: 'تشخیص ترکیدگی و نشت‌یابی با دستگاه بدون تخریب', labelEn: 'Acoustic Pipe Leak Detection' },
  { id: 'plumbing_drain', label: 'لوله‌بازکنی، رفع گرفتگی و فنرزنی شبانه‌روزی', labelEn: 'Emergency Drain Unclogging' },
  { id: 'electrical', label: 'برقکاری ساختمان، رفع اتصالی فوری و تابلو برق', labelEn: 'Electrical Wiring & Breakers' },
  { id: 'renovation_paint', label: 'نقاشی ساختمان، رنگ روغن، پلاستیک، اکرلیک و کناف', labelEn: 'Interior Painting & Drywall' },
  { id: 'renovation_masonry', label: 'بنایی، کاشی‌کاری، سرامیک، سنگ و گچ‌کاری', labelEn: 'Tiling, Masonry & Plastering' },
  { id: 'locksmith', label: 'کلیدسازی سیار شبانه‌روزی و نصب قفل‌های ایمنی/ضدسرقت', labelEn: '24/7 Locksmith & Smart Locks' },
  { id: 'carpentry', label: 'کابینت آشپزخانه، کمد دیواری، نجاری و ام‌دی‌اف', labelEn: 'Cabinetry, Carpentry & MDF' },
  { id: 'doors_windows', label: 'نصب و رگلاژ درب و پنجره دوجداره UPVC و شیشه سکوریت', labelEn: 'UPVC Windows, Doors & Glass' },
  { id: 'cleaning_facade', label: 'نظافت مشاعات، نماشویی با طناب بدون داربست و سم‌پاشی', labelEn: 'Rope Access Facade & Cleaning' },
  { id: 'other', label: 'سایر تخصص‌های فنی و مهندسی ساختمان', labelEn: 'Other Building Technical Trades' },
];

const SECONDARY_SKILLS = [
  'تعمیر پکیج و آبگرمکن',
  'سرویس کولر آبی',
  'تعمیر و شارژ گاز کولر گازی',
  'لوله‌کشی آب و فاضلاب',
  'نشت‌یابی با دستگاه',
  'لوله‌بازکنی و فنرزنی',
  'برق‌کاری و رفع اتصالی',
  'سیم‌کشی و روشنایی لوستر',
  'جوشکاری و خرده‌کاری آهن',
  'نقاشی و بتونه‌کاری',
  'کاشی، سرامیک و سنگ‌کاری',
  'گچ‌کاری و بنایی جزئی',
  'نصب شیرآلات و توالت فرنگی',
  'کلیدسازی و تعویض قفل',
  'تعمیر کابینت و درب چوبی',
  'رگلاژ پنجره دوجداره UPVC',
];

const EXPERIENCE_OPTIONS = [
  { id: 'under_1', label: 'کمتر از ۱ سال (کارآموز یا دستیار فنی)', labelEn: 'Under 1 year (Apprentice)' },
  { id: '1-3', label: '۱ تا ۳ سال سابقه کار اجرایی', labelEn: '1 - 3 years' },
  { id: '3-5', label: '۳ تا ۵ سال سابقه کار تخصصی (تکنسین ماهر)', labelEn: '3 - 5 years (Skilled)' },
  { id: '5-10', label: '۵ تا ۱۰ سال سابقه کار (تکنسین حرفه‌ای)', labelEn: '5 - 10 years (Professional)' },
  { id: '10+', label: 'بیش از ۱۰ سال سابقه کار (استادکار ارشد و کارشناس)', labelEn: '10+ years (Master Craftsman)' },
];

const CERTIFICATION_OPTIONS = [
  { id: 'vocational', label: 'دارای مدرک رسمی و معتبر سازمان آموزش فنی‌وحرفه‌ای کشور', labelEn: 'Official Technical & Vocational Org Certificate' },
  { id: 'union', label: 'دارای پروانه کسب یا کارت مهارت معتبر اتحادیه صنفی', labelEn: 'Official Trade Union License/Card' },
  { id: 'academic', label: 'مدرک تحصیلی مرتبط (هنرستان فنی / کاردانی / کارشناسی)', labelEn: 'Related Technical Degree or Diploma' },
  { id: 'experience', label: 'استادکار تجربی با سابقه کاری معتبر (فاقد مدرک کتبی)', labelEn: 'Practical Master Experience (No written cert)' },
  { id: 'studying', label: 'در حال گذراندن دوره‌های تخصصی آموزش مهارت', labelEn: 'Currently studying / trainee' },
];

const MILITARY_OPTIONS = [
  { id: 'no_card', label: 'بدون کارت پایان خدمت / عدم نیاز', labelEn: 'Without Military Card / Not Required' },
  { id: 'completed', label: 'دارای کارت پایان خدمت', labelEn: 'Military Service Completed' },
  { id: 'permanent_exemption', label: 'معافیت دائم (پزشکی / کفالت / ایثارگری)', labelEn: 'Permanent Exemption' },
  { id: 'educational_exemption', label: 'معافیت تحصیلی فعال', labelEn: 'Educational Exemption' },
  { id: 'not_applicable', label: 'عدم شمول / بانوان گرامی', labelEn: 'Not Applicable' },
];

const AGE_OPTIONS = [
  { id: '18-25', label: '۱۸ تا ۲۵ سال', labelEn: '18 - 25 years' },
  { id: '26-35', label: '۲۶ تا ۳۵ سال', labelEn: '26 - 35 years' },
  { id: '36-45', label: '۳۶ تا ۴۵ سال', labelEn: '36 - 45 years' },
  { id: '46-55', label: '۴۶ تا ۵۵ سال', labelEn: '46 - 55 years' },
  { id: '55+', label: 'بیش از ۵۵ سال (پیشکسوت)', labelEn: '55+ years' },
];

const TOOLS_OPTIONS = [
  { id: 'full', label: 'ابزارآلات کامل، تخصصی و صنعتی دارم (آماده اعزام فوری)', labelEn: 'Full professional toolkit (Ready for dispatch)' },
  { id: 'basic', label: 'ابزارآلات عمومی و اولیه دارم', labelEn: 'Basic essential tools' },
  { id: 'need_help', label: 'تمایل به دریافت تسهیلات خرید ابزار از بهدون دارم', labelEn: 'Need tool financing assistance' },
];

const TRANSPORT_OPTIONS = [
  { id: 'motorcycle', label: 'موتورسیکلت (اعزام سریع شهری بدون ماندن در ترافیک)', labelEn: 'Motorcycle (Swift Dispatch)' },
  { id: 'car', label: 'خودرو سواری شخصی (جابه‌جایی ابزار و تجهیزات)', labelEn: 'Personal Passenger Car' },
  { id: 'pickup', label: 'وانت بار سبک یا پراید وانت (مناسب کارهای بازسازی و پروژه‌ای)', labelEn: 'Light Pickup Truck' },
  { id: 'public', label: 'فاقد وسیله نقلیه (حمل‌ونقل عمومی / مترو)', labelEn: 'Public Transit' },
];

const AVAILABILITY_OPTIONS = [
  { id: 'fulltime', label: 'تمام‌وقت (آماده دریافت روزانه سفارشات در طول هفته)', labelEn: 'Full-time (Everyday jobs)' },
  { id: 'parttime', label: 'پاره‌وقت (شیفت عصر و ساعات مشخص)', labelEn: 'Part-time (Evenings/Flexible)' },
  { id: 'weekends', label: 'فقط روزهای پنج‌شنبه و جمعه و تعطیلات رسمی', labelEn: 'Weekends & Holidays only' },
];

const TEHRAN_DISTRICT_OPTIONS = [
  { id: 'all', label: 'تمامی مناطق ۲۲‌گانه شهر تهران (پوشش سراسری پایتخت)', labelEn: 'All 22 Tehran Districts' },
  { id: 'north', label: 'شمال تهران (مناطق ۱، ۲، ۳ - تجریش، نیاوران، زعفرانیه و...)', labelEn: 'North Tehran (Districts 1, 2, 3)' },
  { id: 'west', label: 'غرب تهران (مناطق ۲، ۵، ۲۱، ۲۲ - صادقیه، پونک، چیتگر و...)', labelEn: 'West Tehran (Districts 2, 5, 21, 22)' },
  { id: 'east', label: 'شرق تهران (مناطق ۴، ۸، ۱۳، ۱۴ - تهرانپارس، نارمک، پیروزی و...)', labelEn: 'East Tehran (Districts 4, 8, 13, 14)' },
  { id: 'center', label: 'مرکز تهران (مناطق ۶، ۷، ۱۰، ۱۱، ۱۲ - یوسف‌آباد، ولیعصر، بازار و...)', labelEn: 'Central Tehran (Districts 6, 7, 10, 11, 12)' },
  { id: 'south', label: 'جنوب تهران (مناطق ۱۵ تا ۲۰ - نازی‌آباد، شهرری و...)', labelEn: 'South Tehran (Districts 15 to 20)' },
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
            <span aria-current="page">${pick('همکاری و جذب متخصصین', 'Specialist Recruitment')}</span>
          </nav>

          <div class="careers-hero-content">
            <span class="careers-badge">
              <span class="icon">${icons.badge || icons.shield}</span>
              <span>${pick('فرصت همکاری ویژه تکنسین‌ها و استادکاران فنی تهران', 'Tehran Master Technicians Network')}</span>
            </span>
            <h1 class="careers-main-title">
              ${pick(`متخصص فنی یا استادکار ساختمانی هستید؟ به جمع متخصصین ${brandFa} بپیوندید`, `Are You a Master Technician? Join ${brandEn}`)}
            </h1>
            <p class="careers-main-subtitle">
              ${pick(
                'کسب درآمد منصفانه و پایدار بر مبنای مهارت و فعالیت، با تسویه حساب منظم روزانه، ساعات کاری منعطف، پوشش بیمه حوادث و دسترسی پیوسته به سفارشات فعال در کلیه مناطق ۲۲‌گانه تهران.',
                'Earn fair and sustainable income matching your skill and effort, with daily payouts, flexible schedule, and active bookings across Tehran.'
              )}
            </p>
          </div>
        </div>
      </div>

      <div class="container careers-layout-container">
        <!-- ۴ مزیت کلیدی همکاری با بهدون -->
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
              <p>${pick('بالاترین درصد سهم متخصص؛ واریز مستقیم درآمد و اجرت به شماره شبای بانکی شما بلافاصله پس از اتمام هر خدمت با فاکتور رسمی بدون تأخیر.', 'Highest revenue share; daily direct deposits to your bank account with zero delays.')}</p>
            </div>

            <div class="careers-perk-card">
              <div class="perk-icon-wrap perk-icon-shield">
                <span class="icon">${icons.shield}</span>
              </div>
              <h3>${pick('پوشش بیمه حوادث و مسئولیت', 'Liability Insurance')}</h3>
              <p>${pick('آرامش خاطر کامل حین کار؛ کلیه خدمات و پروژه‌ها تحت پوشش کامل بیمه حوادث کار و بیمه مسئولیت مدنی معتبر بهدون قرار دارند.', 'Full peace of mind on site; every project is backed by comprehensive accidental and liability coverage.')}</p>
            </div>

            <div class="careers-perk-card">
              <div class="perk-icon-wrap perk-icon-clock">
                <span class="icon">${icons.clock}</span>
              </div>
              <h3>${pick('ساعات کاری دلخواه و انتخاب محله', 'Flexible Schedule & Zones')}</h3>
              <p>${pick('رئیس زمان خود باشید؛ تعیین شیفت‌های کاری به دلخواه شما و انتخاب محله‌ها و مناطق فعالیت در محدوده سکونت خودتان در تهران.', 'Be your own boss; set your work hours freely and choose service zones closest to your neighborhood.')}</p>
            </div>

            <div class="careers-perk-card">
              <div class="perk-icon-wrap perk-icon-phone">
                <span class="icon">${icons.phone}</span>
              </div>
              <h3>${pick('سفارشات مداوم بدون نیاز به تبلیغات', 'Steady Requests & 24/7 Support')}</h3>
              <p>${pick('بدون نیاز به پرداخت هزینه تبلیغات و بازاریابی؛ دریافت پیوسته و هوشمند سفارشات فعال ساختمانی همراه با پشتیبانی شبانه‌روزی تیم اعزام.', 'No need for personal advertising; receive nonstop matched orders with 24/7 dispatcher backup.')}</p>
            </div>
          </div>
        </section>

        <!-- مراحل ۳ گانه ساده پیوستن -->
        <section class="careers-steps-section">
          <h2 class="careers-section-heading">
            ${pick('مراحل ساده ۳ گانه شروع همکاری با بهدون', '3 Simple Steps to Start')}
          </h2>
          <div class="careers-steps-grid">
            <div class="careers-step-card">
              <div class="step-number">۱</div>
              <h4>${pick('ثبت‌نام و تکمیل فرم جامع زیر', '1. Submit the Application')}</h4>
              <p>${pick('اطلاعات فردی، تخصص فنی، وضعیت تجهیزات و مناطق مورد تمایل خود را در فرم ۵ بخشی زیر ثبت کنید.', 'Fill in your credentials, trade specialties, and availability in our comprehensive form.')}</p>
            </div>
            <div class="careers-step-card">
              <div class="step-number">۲</div>
              <h4>${pick('تماس کارشناسان و ارزیابی مدارک', '2. Quick Verification')}</h4>
              <p>${pick('کارشناسان امور متخصصین بهدون ظرف حداکثر ۲۴ ساعت کاری با شما تماس گرفته و مدارک مهارتی را استعلام می‌کنند.', 'Our recruitment team contacts you within 24h to verify your technical credentials.')}</p>
            </div>
            <div class="careers-step-card">
              <div class="step-number">۳</div>
              <h4>${pick('دریافت لباس کار و شروع کسب درآمد', '3. Start Receiving Jobs')}</h4>
              <p>${pick('پس از تایید نهایی، نشان شناسایی و کارت هوشمند صادر شده و بلافاصله دریافت سفارشات پردرآمد آغاز می‌شود.', 'Receive your official ID and start taking high-paying jobs immediately.')}</p>
            </div>
          </div>
        </section>

        <!-- فرم درخواست جامع و حرفه‌ای استخدام متخصصین -->
        <div class="careers-form-container">
          <div class="careers-form-card" id="careers-form-card">
            <div class="careers-form-header">
              <span class="icon form-head-icon">${icons.worker || icons.briefcase}</span>
              <div>
                <h2>${pick('فرم جامع درخواست همکاری و عضویت متخصصین', 'Specialist Application Form')}</h2>
                <p>${pick('لطفاً کلیه بخش‌های ۵ گانه زیر را با دقت تکمیل فرمایید تا پرونده مهارتی شما مستقیماً به واحد ارزیابی ارجاع شود.', 'Please fill out all 5 sections carefully; our specialist team will review your profile.')}</p>
              </div>
            </div>

            <form id="careers-form" class="careers-form-inner" novalidate>
              <!-- بخش ۱: مشخصات فردی و هویتی -->
              <div class="careers-form-section">
                <h3 class="form-section-title">
                  <span class="form-section-badge">۱</span>
                  <span>${pick('مشخصات فردی، هویتی و تماس', 'Personal & Identity Details')}</span>
                </h3>

                <div class="careers-form-grid-2">
                  <div class="form-field">
                    <label for="careers-name">
                      ${pick('نام و نام خانوادگی کامل', 'Full Name')} <span class="required-star">*</span>
                    </label>
                    <div class="input-wrapper">
                      <input type="text" id="careers-name" placeholder="${pick('مثال: علی محمدی', 'e.g. Ali Mohammadi')}" autocomplete="name" required />
                      <span class="icon input-icon">${icons.user}</span>
                    </div>
                  </div>

                  <div class="form-field">
                    <label for="careers-phone">
                      ${pick('شماره تلفن همراه فعال (جهت تماس و پیامک)', 'Mobile Number')} <span class="required-star">*</span>
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
                      ${pick('کد ملی (۱۰ رقم)', 'National ID (10 digits)')} <span class="required-star">*</span>
                    </label>
                    <div class="input-wrapper">
                      <input type="text" id="careers-national-id" maxlength="10" placeholder="${pick('جهت احراز هویت، صدور بیمه و استعلام سوابق', 'For insurance registration')}" dir="ltr" inputmode="numeric" required />
                      <span class="icon input-icon">${icons.shield}</span>
                    </div>
                  </div>

                  <div class="form-field">
                    <label for="careers-emergency-phone">
                      ${pick('شماره تلفن ثابت یا تماس اضطراری (اختیاری)', 'Emergency/Landline Phone')}
                    </label>
                    <div class="input-wrapper">
                      <input type="tel" id="careers-emergency-phone" placeholder="${pick('۰۲۱xxxxxxxx یا شماره پشتیبان', 'Landline or backup phone')}" dir="ltr" inputmode="numeric" />
                      <span class="icon input-icon">${icons.phone}</span>
                    </div>
                  </div>
                </div>

                <div class="careers-form-grid-2">
                  <div class="form-field">
                    <label for="careers-age">
                      ${pick('رده سنی شما', 'Age Group')}
                    </label>
                    <div class="select-wrapper">
                      <select id="careers-age">
                        ${AGE_OPTIONS.map((a) => `<option value="${a.id}">${pick(a.label, a.labelEn)}</option>`).join('')}
                      </select>
                      <span class="icon select-chevron">${icons.chevronDown}</span>
                    </div>
                  </div>

                  <div class="form-field">
                    <label for="careers-military">
                      ${pick('وضعیت نظام وظیفه', 'Military Service Status')}
                    </label>
                    <div class="select-wrapper">
                      <select id="careers-military">
                        ${MILITARY_OPTIONS.map((m, idx) => `<option value="${m.id}" ${idx === 0 ? 'selected' : ''}>${pick(m.label, m.labelEn)}</option>`).join('')}
                      </select>
                      <span class="icon select-chevron">${icons.chevronDown}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- بخش ۲: تخصص فنی و مدارک مهارت -->
              <div class="careers-form-section">
                <h3 class="form-section-title">
                  <span class="form-section-badge">۲</span>
                  <span>${pick('تخصص فنی، سوابق و مدارک مهارتی', 'Technical Specialty & Credentials')}</span>
                </h3>

                <div class="careers-form-grid-2">
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

                  <div class="form-field">
                    <label for="careers-experience">
                      ${pick('میزان سابقه کار فنی شما', 'Years of Experience')} <span class="required-star">*</span>
                    </label>
                    <div class="select-wrapper">
                      <select id="careers-experience" required>
                        ${EXPERIENCE_OPTIONS.map((e) => `<option value="${e.id}">${pick(e.label, e.labelEn)}</option>`).join('')}
                      </select>
                      <span class="icon select-chevron">${icons.chevronDown}</span>
                    </div>
                  </div>
                </div>

                <div class="form-field" id="careers-custom-position-field" hidden>
                  <label for="careers-custom-position">${pick('عنوان دقیق تخصص فنی شما', 'Custom Specialty Title')}</label>
                  <div class="input-wrapper">
                    <input type="text" id="careers-custom-position" placeholder="${pick('مثال: نصاب سقف کاذب، درب اتوماتیک، عایق‌کاری استخر...', 'e.g. Pool insulation, automatic doors...')}" />
                  </div>
                </div>

                <div class="form-field">
                  <label for="careers-certification">
                    ${pick('وضعیت گواهینامه مهارت یا پروانه کسب', 'Technical Certification / License')}
                  </label>
                  <div class="select-wrapper">
                    <select id="careers-certification">
                      ${CERTIFICATION_OPTIONS.map((c) => `<option value="${c.id}">${pick(c.label, c.labelEn)}</option>`).join('')}
                    </select>
                    <span class="icon select-chevron">${icons.chevronDown}</span>
                  </div>
                </div>

                <div class="form-field">
                  <label class="form-label-with-hint">
                    <strong>${pick('مهارت‌های تکمیلی و فرعی (چند انتخابی):', 'Secondary Skills (Select all that apply):')}</strong>
                    <span class="form-sub-hint">${pick('تیک زدن مهارت‌های بیشتر باعث دریافت سفارشات کاری متنوع‌تر می‌شود.', 'Selecting more skills increases your booking volume.')}</span>
                  </label>
                  <div class="skill-chips-grid">
                    ${SECONDARY_SKILLS.map((skill, idx) => `
                      <label class="skill-chip-item" for="sec-skill-${idx}">
                        <input type="checkbox" id="sec-skill-${idx}" class="sec-skill-checkbox" value="${skill}" />
                        <span>${skill}</span>
                      </label>
                    `).join('')}
                  </div>
                </div>
              </div>

              <!-- بخش ۳: تجهیزات، وسیله نقلیه و نوع همکاری -->
              <div class="careers-form-section">
                <h3 class="form-section-title">
                  <span class="form-section-badge">۳</span>
                  <span>${pick('امکانات اجرایی، نقلیه و زمان همکاری', 'Logistics, Tools & Availability')}</span>
                </h3>

                <div class="careers-form-grid-2">
                  <div class="form-field">
                    <label for="careers-tools">
                      ${pick('وضعیت ابزارآلات و تجهیزات فنی', 'Tool & Equipment Status')} <span class="required-star">*</span>
                    </label>
                    <div class="select-wrapper">
                      <select id="careers-tools" required>
                        ${TOOLS_OPTIONS.map((t) => `<option value="${t.id}">${pick(t.label, t.labelEn)}</option>`).join('')}
                      </select>
                      <span class="icon select-chevron">${icons.chevronDown}</span>
                    </div>
                  </div>

                  <div class="form-field">
                    <label for="careers-vehicle">
                      ${pick('نوع وسیله نقلیه برای تردد و حمل ابزار', 'Transportation Mode')} <span class="required-star">*</span>
                    </label>
                    <div class="select-wrapper">
                      <select id="careers-vehicle" required>
                        ${TRANSPORT_OPTIONS.map((tr) => `<option value="${tr.id}">${pick(tr.label, tr.labelEn)}</option>`).join('')}
                      </select>
                      <span class="icon select-chevron">${icons.chevronDown}</span>
                    </div>
                  </div>
                </div>

                <div class="form-field">
                  <label for="careers-availability">
                    ${pick('میزان زمان آزاد و نحوه همکاری در طول هفته', 'Availability')}
                  </label>
                  <div class="select-wrapper">
                    <select id="careers-availability">
                      ${AVAILABILITY_OPTIONS.map((av) => `<option value="${av.id}">${pick(av.label, av.labelEn)}</option>`).join('')}
                    </select>
                    <span class="icon select-chevron">${icons.chevronDown}</span>
                  </div>
                </div>
              </div>

              <!-- بخش ۴: محدوده کاری در تهران و سوابق -->
              <div class="careers-form-section">
                <h3 class="form-section-title">
                  <span class="form-section-badge">۴</span>
                  <span>${pick('محدوده فعالیت در تهران و سوابق متقاضی', 'Tehran Work Zones & Portfolio')}</span>
                </h3>

                <div class="careers-form-grid-2">
                  <div class="form-field">
                    <label for="careers-districts">
                      ${pick('مناطق مورد تمایل برای اعزام در تهران', 'Preferred Tehran Districts')} <span class="required-star">*</span>
                    </label>
                    <div class="select-wrapper">
                      <select id="careers-districts">
                        ${TEHRAN_DISTRICT_OPTIONS.map((d) => `<option value="${d.id}">${pick(d.label, d.labelEn)}</option>`).join('')}
                      </select>
                      <span class="icon select-chevron">${icons.chevronDown}</span>
                    </div>
                  </div>

                  <div class="form-field">
                    <label for="careers-neighborhood">
                      ${pick('محله یا منطقه محل سکونت شما در تهران', 'Your Neighborhood in Tehran')}
                    </label>
                    <div class="input-wrapper">
                      <input type="text" id="careers-neighborhood" placeholder="${pick('مثال: تهرانپارس، صادقیه، نازی‌آباد...', 'e.g. Tehranpars, Sadeghiyeh...')}" />
                      <span class="icon input-icon">${icons.pin}</span>
                    </div>
                  </div>
                </div>

                <div class="form-field">
                  <label for="careers-message">
                    ${pick('شرح سوابق کاری، برندهای مسلط، پروژه‌های شاخص یا توضیحات (اختیاری)', 'Work Experience & Detailed Bio')}
                  </label>
                  <textarea
                    id="careers-message"
                    class="careers-textarea"
                    rows="3"
                    placeholder="${pick('مثال: مسلط به تعمیر بردهای الکترونیکی پکیج بوتان و ایران‌رادیاتور، سابقه اجرای لوله‌کشی ۵ مجتمع مسکونی در منطقه ۵، دارای ۵ سال سابقه کار تخصصی...', 'e.g. Mastered boiler PCB diagnostics, commercial HVAC projects...')}"
                  ></textarea>
                </div>
              </div>

              <!-- بخش ۵: تعهدنامه و ثبت نهایی -->
              <div class="careers-form-section careers-form-commitment">
                <label class="form-checkbox-label" for="careers-commitment">
                  <input type="checkbox" id="careers-commitment" required checked />
                  <span>
                    ${pick(
                      'متعهد به رعایت شئونات اخلاقی، پوشش فرم رسمی بهدون، حضور به‌موقع در آدرس مشتری، دریافت دستمزد منصفانه طبق فاکتور معتبر و ارائه خدمات با کیفیت هستم.',
                      'I commit to professional ethics, on-time arrival, fair transparent pricing, and quality workmanship.'
                    )}
                  </span>
                </label>
              </div>

              <p class="request-panel-error" id="careers-form-error" hidden></p>

              <button type="submit" class="btn btn-primary btn-block careers-submit-btn" id="careers-submit-btn">
                <span class="icon">${icons.checkCircle || icons.check}</span>
                <span>${pick('ثبت نهایی درخواست و ارسال پرونده همکاری متخصص', 'Submit Specialist Application')}</span>
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
                'اطلاعات و پرونده مهارتی شما با کد رهگیری اختصاصی در سامانه بهدون ثبت گردید.',
                'Your application has been received and queued in Behdoon specialist system.'
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

  // Toggle selection highlight on skill chips
  document.querySelectorAll<HTMLInputElement>('.sec-skill-checkbox').forEach((cb) => {
    cb.addEventListener('change', () => {
      const parent = cb.closest('.skill-chip-item');
      if (parent) {
        parent.classList.toggle('is-selected', cb.checked);
      }
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorEl!.hidden = true;

    const fullName = (document.getElementById('careers-name') as HTMLInputElement).value.trim();
    const phone = (document.getElementById('careers-phone') as HTMLInputElement).value.trim();
    const nationalId = (document.getElementById('careers-national-id') as HTMLInputElement)?.value.trim() || '';
    const emergencyPhone = (document.getElementById('careers-emergency-phone') as HTMLInputElement)?.value.trim() || '';
    
    const ageSelect = document.getElementById('careers-age') as HTMLSelectElement | null;
    const ageLabel = ageSelect?.selectedOptions?.[0]?.textContent?.trim() || '۲۶ تا ۳۵ سال';

    const militarySelect = document.getElementById('careers-military') as HTMLSelectElement | null;
    const militaryLabel = militarySelect?.selectedOptions?.[0]?.textContent?.trim() || 'بدون کارت پایان خدمت';

    const opt = positionSelect!.selectedOptions?.[0];
    const isOther = positionSelect!.value === 'other';
    const position = positionSelect!.value;
    const customLabel = (document.getElementById('careers-custom-position') as HTMLInputElement)?.value.trim() || '';
    const positionLabel = isOther ? customLabel : (opt?.textContent?.trim() || position);

    const experienceSelect = document.getElementById('careers-experience') as HTMLSelectElement | null;
    const experienceLabel = experienceSelect?.selectedOptions?.[0]?.textContent?.trim() || '۳ تا ۵ سال سابقه';

    const certSelect = document.getElementById('careers-certification') as HTMLSelectElement | null;
    const certLabel = certSelect?.selectedOptions?.[0]?.textContent?.trim() || 'مدرک فنی‌وحرفه‌ای';

    // Collect checked secondary skills
    const checkedSkills: string[] = [];
    document.querySelectorAll<HTMLInputElement>('.sec-skill-checkbox:checked').forEach((cb) => {
      checkedSkills.push(cb.value);
    });

    const toolsSelect = document.getElementById('careers-tools') as HTMLSelectElement | null;
    const toolsLabel = toolsSelect?.selectedOptions?.[0]?.textContent?.trim() || 'ابزار کامل و پیشرفته';

    const vehicleSelect = document.getElementById('careers-vehicle') as HTMLSelectElement | null;
    const vehicleVal = vehicleSelect?.value || 'motorcycle';
    const vehicleLabel = vehicleSelect?.selectedOptions?.[0]?.textContent?.trim() || 'موتورسیکلت';
    const hasVehicle = vehicleVal !== 'public';

    const availabilitySelect = document.getElementById('careers-availability') as HTMLSelectElement | null;
    const availabilityLabel = availabilitySelect?.selectedOptions?.[0]?.textContent?.trim() || 'تمام‌وقت';

    const districtsSelect = document.getElementById('careers-districts') as HTMLSelectElement | null;
    const districtsLabel = districtsSelect?.selectedOptions?.[0]?.textContent?.trim() || 'تمام مناطق ۲۲‌گانه تهران';

    const neighborhood = (document.getElementById('careers-neighborhood') as HTMLInputElement)?.value.trim() || '';

    const commitmentCb = document.getElementById('careers-commitment') as HTMLInputElement | null;
    if (commitmentCb && !commitmentCb.checked) {
      errorEl!.hidden = false;
      errorEl!.textContent = pick('تایید تعهدنامه استانداردهای اخلاقی و فنی بهدون الزامی است.', 'Please agree to Behdoon professional code of conduct.');
      return;
    }

    const rawMessage = (document.getElementById('careers-message') as HTMLTextAreaElement)?.value.trim() || '';

    if (!fullName || !phone) {
      errorEl!.hidden = false;
      errorEl!.textContent = pick('نام و شماره موبایل الزامی است.', 'Full name and mobile number are required.');
      return;
    }

    if (!nationalId || nationalId.length < 10) {
      errorEl!.hidden = false;
      errorEl!.textContent = pick('کد ملی ۱۰ رقمی معتبر جهت احراز هویت الزامی است.', 'A valid 10-digit National ID is required.');
      return;
    }

    if (isOther && !positionLabel) {
      errorEl!.hidden = false;
      errorEl!.textContent = pick('عنوان دقیق تخصص مورد نظر را وارد نمایید.', 'Please specify your technical trade.');
      return;
    }

    // Build comprehensive, well-structured administrative dossier
    const metaSummary = [
      `کد ملی: ${nationalId} | سن: ${ageLabel} | نظام وظیفه: ${militaryLabel}`,
      emergencyPhone ? `تلفن ثابت/اضطراری: ${emergencyPhone}` : '',
      `تخصص اصلی: ${positionLabel} | سابقه: ${experienceLabel}`,
      `مدرک مهارت فنی: ${certLabel}`,
      checkedSkills.length ? `مهارت‌های مکمل: ${checkedSkills.join('، ')}` : '',
      `وضعیت ابزار: ${toolsLabel} | وسیله نقلیه: ${vehicleLabel}`,
      `نوع همکاری: ${availabilityLabel}`,
      `مناطق فعالیت: ${districtsLabel}${neighborhood ? ` (محله: ${neighborhood})` : ''}`,
      rawMessage ? `\nتوضیحات و سوابق متقاضی:\n${rawMessage}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    submitBtn!.disabled = true;
    submitBtn!.innerHTML = `<span>${pick('در حال ثبت پرونده متخصص...', 'Submitting application...')}</span>`;

    try {
      const res = await fetch(`${API_BASE_URL}/api/job-applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          position,
          positionLabel: `${positionLabel} (${experienceLabel})`,
          city: `${districtsLabel}${neighborhood ? ` - ${neighborhood}` : ''}`,
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
        <span>${pick('ثبت نهایی درخواست و ارسال پرونده همکاری متخصص', 'Submit Specialist Application')}</span>
      `;
    }
  });
}

import fs from 'fs';
import path from 'path';

// Read existing all_services_data.json
const raw = JSON.parse(fs.readFileSync('all_services_data.json', 'utf8'));

// Update raw text replacing old phone numbers with 09333256885
function cleanHtml(str) {
  if (!str) return '';
  return str
    .replace(/02122345678/g, '09333256885')
    .replace(/۰۲۱-۲۲۳۴۵۶۷۸/g, '۰۹۳۳۳۲۵۶۸۸۵')
    .replace(/021-22345678/g, '09333256885')
    .replace(/۰۲۱۲۲۳۴۵۶۷۸/g, '۰۹۳۳۳۲۵۶۸۸۵');
}

// 1. HVAC additions (split-ac)
const splitAcSub = {
  id: 'split-ac',
  name: 'نصب و سرویس کولر گازی و اسپلیت',
  nameEn: 'Split AC & Air Conditioner',
  slug: 'split-ac',
  persianSlug: 'کولر-گازی-و-اسپلیت',
  aliases: ['split-ac', 'ac-repair', 'کولر-گازی', 'اسپلیت'],
  basePrice: 850000,
  shortDesc: 'شارژ گاز استاندارد R22 و R410، شستشوی پنل داخلی و کندانسور خارجی، نشت‌یابی و نصب',
  shortDescEn: 'R22/R410 gas recharge, deep indoor/outdoor coil wash, leak detection & mounting',
  features: [
    'شارژ گاز استاندارد R22 و R410a با گیج دیجیتال و ترازوی حساس',
    'شستشوی پرفشار پنل داخلی و کندانسور با کارواش پرتابل و مواد نانو',
    'نشت‌یابی لوله‌کشی مسی با کف صابون و نشت‌یاب الکترونیکی گاز',
    'تست خازن راه‌انداز، تست آمپراژ و عیب‌یابی برد اینورتر',
    'لوله‌کشی مسی رفت و برگشت با عایق الاستومری و داکت‌کشی تمیز'
  ],
  detailHtml: `
    <div class="space-y-6 text-slate-700 leading-relaxed text-justify">
      <div class="bg-gradient-to-l from-sky-50/70 to-white p-5 rounded-2xl border border-sky-100 mb-6">
        <h3 class="text-lg font-black text-brand-700 mb-2">نصب، جابجایی، شارژ گاز و سرویس دوره‌ای انواع اسپلیت در تهران</h3>
        <p class="text-sm text-slate-600">کولرهای گازی و داکت اسپلیت‌ها برای کارکرد بدون افت راندمان، نیازمند شستشوی سالانه کوئل‌ها، سنجش دقیق فشار گاز مبرد و تست خازن و فن هستند. انباشت خاک و رسوب روی کندانسور بیرونی موجب افزایش مصرف برق تا ۴۰ درصد و آسیب به کمپرسور می‌گردد.</p>
      </div>

      <h4 class="text-base font-bold text-slate-800 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-[#8B1C31]"></span>
        اقدامات تخصصی تکنسین‌های کولر گازی بهدون:
      </h4>
      <ul class="list-disc list-inside space-y-2 text-sm text-slate-600 pr-2">
        <li><strong>شستشوی تخصصی با کاور شستشو:</strong> شستشوی اواپراتور بدون باز کردن پنل و بدون کثیف‌کاری دیوار و فرش با مواد نانوشوینده ضدقارچ.</li>
        <li><strong>شارژ گاز تکمیلی یا کامل:</strong> وکیوم کامل مدار با پمپ وکیوم قوی و تزریق گاز مبرد خالص هندی با وزنگیج استاندارد.</li>
        <li><strong>رفع نشتی اتصالات و لوله‌ها:</strong> پرچ مجدد لوله‌های مسی، رفع شکستگی و عایق‌بندی کامل جهت جلوگیری از اتلاف سرما.</li>
        <li><strong>رفع آب‌ریزش پنل داخلی:</strong> باز کردن مسیر درین، رفع شیب نامناسب و شستشوی تشتک تخلیه آب مقطر.</li>
        <li><strong>نصب و جابجایی اصولی:</strong> بستن پایه دیواری یا زمینی تراز با جذب لرزش، سوراخ‌کاری تمیز دیوار و اتصال کابل شیلددار فرمان.</li>
      </ul>

      <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 my-6">
        <h5 class="font-bold text-slate-800 text-sm mb-2">چه موقع کولر گازی نیاز به بررسی فوری دارد؟</h5>
        <p class="text-xs text-slate-600 mb-3">اگر از پنل باد گرم خارج می‌شود، لوله‌های باریک مسی برفک یا یخ زده‌اند، یا آب از گوشه پنل به درون اتاق می‌چکد، فوراً دستگاه را خاموش کرده و با متخصصان بهدون تماس بگیرید.</p>
        <div class="flex flex-wrap items-center gap-3">
          <button type="button" data-order-service="split-ac" class="bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all">
            ثبت درخواست سرویس کولر گازی
          </button>
          <a href="tel:09333256885" class="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors">
            تماس مستقیم: ۰۹۳۳۳۲۵۶۸۸۵
          </a>
        </div>
      </div>
    </div>
  `
};

// 2. Locksmith category & subservices
const locksmithCategory = {
  id: 'locksmith',
  slug: 'locksmith',
  persianSlug: 'کلیدسازی-قفل-امنیت',
  aliases: ['locksmith', 'locks', 'security', 'کلیدسازی'],
  title: 'خدمات کلیدسازی شبانه‌روزی، قفل هوشمند و امنیت ساختمان در تهران | بهدون',
  titleEn: '24/7 Locksmith, Smart Locks & Building Security in Tehran | Behdoon',
  metaDesc: 'خدمات فوری کلیدسازی شبانه‌روزی در کلیه مناطق ۲۲ گانه تهران در کمتر از ۳۰ دقیقه. باز کردن انواع قفل ضدسرقت و اتومبیل بدون آسیب، نصب قفل دیجیتال رمزی و کارتی، تعمیر جک پارکینگ و دزدگیر با ضمانت رسمی بهدون.',
  subtitle: 'اعزام فوری کلیدساز سیار در کمتر از ۳۰ دقیقه در سراسر تهران؛ باز کردن ایمن درب‌های ضدسرقت بدون تخریب، نصب دستگیره هوشمند و جک پارکینگ.',
  subtitleEn: 'Emergency locksmith dispatch under 30 minutes across Tehran; damage-free lock picking, smart door lock installations, and automatic gates.',
  icon: `<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="8" cy="15" r="4" stroke-width="1.5"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m10.85 12.15 7.65-7.65a1.5 1.5 0 0 1 2.12 0l1.38 1.38-2.5 2.5 1.5 1.5-2 2-1.5-1.5-1.5 1.5"/></svg>`,
  subServices: [
    {
      id: 'emergency-lockout',
      name: 'باز کردن فوری قفل درب (ضدسرقت و اتاقی)',
      nameEn: 'Emergency Lockout Service',
      slug: 'emergency-lockout',
      persianSlug: 'باز-کردن-قفل-درب',
      aliases: ['emergency-lockout', 'lockout', 'کلیدساز-سیار', 'باز-کردن-درب'],
      basePrice: 400000,
      shortDesc: 'اعزام فوری کلیدساز سیار، باز کردن انواع درب ضدسرقت، اتاقی و اتومبیل بدون کمترین آسیب به قفل و چهارچوب',
      shortDescEn: 'Emergency mobile locksmith, damage-free unlocking of anti-theft, interior, and car doors',
      features: [
        'اعزام سریع کلیدساز مجهز به موتور در کمتر از ۳۰ دقیقه در تهران',
        'باز کردن انواع قفل کالی، داف، یال و مولتی لاک با ابزار هوازنی تخصصی',
        'بازگشایی بدون شکستن قفل، بدون سوراخ‌کاری و بدون آسیب به روکش درب',
        'تعویض سیلندر (توپی) در محل با توپی‌های ضدبرش و ضداسید',
        'ساخت کلید کامپیوتری یدک در محل با دستگاه پرتابل'
      ],
      detailHtml: `
        <div class="space-y-6 text-slate-700 leading-relaxed text-justify">
          <div class="bg-gradient-to-l from-rose-50/70 to-white p-5 rounded-2xl border border-rose-100 mb-6">
            <h3 class="text-lg font-black text-brand-700 mb-2">باز کردن شبانه‌روزی قفل‌های ضدسرقت و معمولی در کلیه محلات تهران</h3>
            <p class="text-sm text-slate-600">پشت در ماندن یا گم کردن کلید می‌تواند بسیار اضطراب‌آور باشد. تکنسین‌های کلیدسازی سیار بهدون با داشتن ابزارآلات پیکینگ پیشرفته و مهارت فنی بالا، درب ساختمان را بدون نیاز به تخریب قفل یا آسیب به چهارچوب چوبی/فلزی باز می‌نمایند.</p>
          </div>
          <h4 class="text-base font-bold text-slate-800 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-[#8B1C31]"></span>
            مراحل ارائه خدمات کلیدسازی بهدون:
          </h4>
          <ul class="list-disc list-inside space-y-2 text-sm text-slate-600 pr-2">
            <li><strong>احراز هویت مالکیت:</strong> جهت رعایت کامل امنیت و ضوابط قانونی، پیش از بازگشایی درب، مدارک هویتی یا سکونت بررسی می‌گردد.</li>
            <li><strong>بازگشایی با هوازنی و شاه‌کلیدهای مدرن:</strong> باز کردن ساچمه‌های قفل بدون نیاز به سوراخ‌کاری توپی.</li>
            <li><strong>تعویض یا ارتقای سیلندر:</strong> در صورت مفقودی کلید قبلی، تعویض آنی مغزی با سیلندرهای ضد دریل با بسته‌بندی پلمپ شرکتی.</li>
          </ul>
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 my-6">
            <div class="flex flex-wrap items-center gap-3">
              <button type="button" data-order-service="emergency-lockout" class="bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all">
                درخواست فوری کلیدساز سیار
              </button>
              <a href="tel:09333256885" class="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors">
                تماس شبانه‌روزی: ۰۹۳۳۳۲۵۶۸۸۵
              </a>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'smart-locks',
      name: 'نصب و راه‌اندازی قفل هوشمند دیجیتال',
      nameEn: 'Smart Digital Lock Installation',
      slug: 'smart-locks',
      persianSlug: 'نصب-قفل-هوشمند-دیجیتال',
      aliases: ['smart-locks', 'digital-lock', 'قفل-رمزی', 'دستگیره-هوشمند'],
      basePrice: 850000,
      shortDesc: 'نصب و راه‌اندازی دستگیره‌های هوشمند رمزی، کارتی، اثرانگشتی و تشخیص چهره با گارانتی شرکتی',
      shortDescEn: 'Installation and setup of biometric, card, PIN, and facial recognition smart door locks',
      features: [
        'نصب انواع برندهای سامسونگ، شیائومی، یال، کاداس و فیلیپس',
        'برش دقیق جای زبانه و شابلون‌زنی روی درب‌های چوبی و ضدسرقت',
        'اتصال قفل به وای‌فای و اپلیکیشن موبایل جهت کنترل تردد از راه دور',
        'تنظیم سناریوهای رمز موقت، کارت ضدکپی و اسکن اثر انگشت',
        'آموزش کامل کاربری و تنظیمات امنیتی به خریدار'
      ],
      detailHtml: `
        <div class="space-y-6 text-slate-700 leading-relaxed text-justify">
          <div class="bg-gradient-to-l from-indigo-50/70 to-white p-5 rounded-2xl border border-indigo-100 mb-6">
            <h3 class="text-lg font-black text-brand-700 mb-2">ارتقای امنیت منزل و دفتر کار با قفل‌های هوشمند بیومتریک</h3>
            <p class="text-sm text-slate-600">دستگیره‌ها و قفل‌های دیجیتال آسایش بی‌نظیری را با حذف کلیدهای سنتی فراهم می‌آورند. نصب غیرتخصصی این قفل‌ها می‌تواند باعث گیر کردن زبانه‌ها یا آسیب به سیم‌کشی باتری گردد. کارشناسان بهدون نصب دقیق و استاندارد آن را تضمین می‌کنند.</p>
          </div>
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 my-6">
            <div class="flex flex-wrap items-center gap-3">
              <button type="button" data-order-service="smart-locks" class="bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all">
                ثبت درخواست نصب قفل دیجیتال
              </button>
              <a href="tel:09333256885" class="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors">
                مشاوره تلفنی: ۰۹۳۳۳۲۵۶۸۸۵
              </a>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'parking-gate',
      name: 'نصب و تعمیر جک پارکینگ و آرام‌بند',
      nameEn: 'Parking Gate Motor & Door Closer',
      slug: 'parking-gate',
      persianSlug: 'جک-پارکینگ-و-آرام-بند',
      aliases: ['parking-gate', 'gate-motor', 'آرام-بند', 'جک-برقی'],
      basePrice: 750000,
      shortDesc: 'نصب، عیب‌یابی و تعمیر جک‌های بازویی، ریلی، هیدرولیک و کددهی ریموت کنترل پارکینگ',
      shortDescEn: 'Installation and repair of hydraulic/electromechanical gate motors and remote coding',
      features: [
        'تعمیر تخصصی بردهای الکترونیکی جک پارکینگ (سیماران، بی اف تی، پروتکو، وی تو)',
        'تعویض چرخ‌دنده‌ها، میل ماردون، بلبرینگ و روغن هیدرولیک جک',
        'تنظیم فتوسل چشمی ضدبرخورد و فلاشر چشمک‌زن',
        'نصب آرام‌بندهای دو زمانه و سه زمانه برای درب ورودی ضدحریق و لابی',
        'کددهی و ست کردن انواع ریموت کنترل‌های ضدکپی هاپینگ کد'
      ],
      detailHtml: `
        <div class="space-y-6 text-slate-700 leading-relaxed text-justify">
          <div class="bg-gradient-to-l from-amber-50/70 to-white p-5 rounded-2xl border border-amber-100 mb-6">
            <h3 class="text-lg font-black text-brand-700 mb-2">تعمیرات فوری جک برقی پارکینگ ساختمان در تهران</h3>
            <p class="text-sm text-slate-600">باز نشدن درب پارکینگ یا کوبیده شدن شدید آن موجب سلب آسایش ساکنین و ایجاد خطر سرقت می‌شود. سرویس دوره‌ای مدار خلاص‌کن و بالانس بازوها از هزینه‌های سنگین تعویض موتور جلوگیری می‌کند.</p>
          </div>
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 my-6">
            <div class="flex flex-wrap items-center gap-3">
              <button type="button" data-order-service="parking-gate" class="bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all">
                ثبت درخواست تعمیر جک پارکینگ
              </button>
              <a href="tel:09333256885" class="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors">
                تماس فوری: ۰۹۳۳۳۲۵۶۸۸۵
              </a>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'cctv-alarm',
      name: 'دوربین مداربسته و دزدگیر اماکن',
      nameEn: 'CCTV & Security Alarm Systems',
      slug: 'cctv-alarm',
      persianSlug: 'دوربین-مداربسته-و-دزدگیر',
      aliases: ['cctv-alarm', 'cctv', 'alarm', 'دزدگیر', 'دوربین'],
      basePrice: 1100000,
      shortDesc: 'سیم‌کشی و نصب دوربین‌های مداربسته تحت شبکه IP، انتقال تصویر روی موبایل و سیستم دزدگیر سیم‌کارتی',
      shortDescEn: 'CCTV IP camera installation, smartphone remote live feed, and GSM burglar alarms',
      features: [
        'نصب دوربین‌های دید در شب رنگی (ColorVu) و با کیفیت 4K',
        'انتقال تصویر بدون قطعی روی تلفن همراه با سرورهای پرسرعت',
        'نصب دزدگیرهای سیم‌کارتی با قابلیت تماس خودکار و ارسال پیامک هشدار',
        'نصب چشمی‌های حرکتی ضدحیوان (پت)، مگنت درب و سنسور ضربه',
        'عیب‌یابی خرابی هارددیسک، آداپتور، قطعی تصویر و تعویض BNC'
      ],
      detailHtml: `
        <div class="space-y-6 text-slate-700 leading-relaxed text-justify">
          <div class="bg-gradient-to-l from-emerald-50/70 to-white p-5 rounded-2xl border border-emerald-100 mb-6">
            <h3 class="text-lg font-black text-brand-700 mb-2">سیستم‌های حفاظتی و نظارت تصویری ساختمان با بهدون</h3>
            <p class="text-sm text-slate-600">پوشش کامل نقاط کور پارکینگ، لابی، پشت‌بام و حیاط با دوربین‌های دید در شب و دزدگیرهای ضدسرقت هوشمند، امنیت کامل ساختمان و دارایی‌های ساکنین را تضمین می‌نماید.</p>
          </div>
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 my-6">
            <div class="flex flex-wrap items-center gap-3">
              <button type="button" data-order-service="cctv-alarm" class="bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all">
                درخواست نصب و تعمیر دوربین و دزدگیر
              </button>
              <a href="tel:09333256885" class="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors">
                مشاوره فنی: ۰۹۳۳۳۲۵۶۸۸۵
              </a>
            </div>
          </div>
        </div>
      `
    }
  ],
  comprehensiveGuide: `
    <article class="mt-12 pt-10 border-t border-slate-200 text-slate-700 leading-relaxed text-justify space-y-8" dir="rtl">
      <header class="text-center max-w-3xl mx-auto space-y-4 mb-10">
        <span class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
          دانشنامه و راهنمای قفل، کلیدسازی و امنیت ساختمان در تهران
        </span>
        <h2 class="text-2xl md:text-3xl font-black text-slate-800 leading-tight">
          راهنمای جامع خدمات کلیدسازی شبانه‌روزی، دستگیره‌های هوشمند و جک پارکینگ در پایتخت
        </h2>
        <p class="text-sm text-slate-500 leading-relaxed">
          نکات ضروری در زمان گم شدن کلید، روش‌های ایمن باز کردن درب ضدسرقت بدون تخریب و استانداردهای نصب تجهیزات حفاظتی در تهران.
        </p>
      </header>
      <div class="bg-gradient-to-r from-[#133458] to-[#1c4b7d] rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="space-y-2 text-center md:text-right">
          <h3 class="text-xl font-bold">پشت در مانده‌اید یا نیاز به کلیدساز سیار فوری دارید؟</h3>
          <p class="text-xs md:text-sm text-blue-100 max-w-xl leading-relaxed">
            کلیدسازان بهدون با موتورسیکلت مجهز در کمتر از ۳۰ دقیقه در سراسر تهران به محل شما می‌رسند.
          </p>
        </div>
        <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
          <button type="button" data-order-service="emergency-lockout" class="w-full sm:w-auto px-6 py-3 bg-[#8B1C31] hover:bg-[#701627] text-white text-xs md:text-sm font-black rounded-xl shadow-lg transition-all text-center">
            اعزام فوری کلیدساز سیار
          </button>
          <a href="tel:09333256885" class="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs md:text-sm font-bold rounded-xl border border-white/20 transition-all text-center">
            تماس: ۰۹۳۳۳۲۵۶۸۸۵
          </a>
        </div>
      </div>
    </article>
  `,
  faq: [
    {
      q: 'آیا باز کردن درب ضدسرقت باعث آسیب به قفل یا روکش درب می‌شود؟',
      a: 'خیر، کارشناسان بهدون با استفاده از ابزارهای هوازنی و ابزارهای تخصصی ساچمه، درب را بدون شکستن قفل، تخریب سیلندر یا خط انداختن روی روکش چوب باز می‌کنند.'
    },
    {
      q: 'سرعت اعزام کلیدساز سیار در مناطق مختلف تهران چقدر است؟',
      a: 'با توجه به استقرار کارشناسان در سراسر شمال، شرق، غرب، مرکز و جنوب تهران، میانگین زمان حضور کمتر از ۳۰ دقیقه است.'
    },
    {
      q: 'آیا برای باز کردن درب منزل احراز هویت لازم است؟',
      a: 'بله، جهت امنیت ساکنین و قوانین پلیس آگاهی، رویت کارت شناسایی معتبر یا تاییدیه همسایگان و مدیر ساختمان الزامی است.'
    }
  ]
};

// 3. Carpentry category & subservices
const carpentryCategory = {
  id: 'carpentry',
  slug: 'carpentry',
  persianSlug: 'کابینت-نجاری-mdf',
  aliases: ['carpentry', 'cabinet', 'نجاری', 'کابینت'],
  title: 'خدمات نجاری، تعمیر کابینت، کمد دیواری و دکوراسیون چوبی در تهران | بهدون',
  titleEn: 'Carpentry, Cabinet Repairs, Custom Closets & Woodwork in Tehran | Behdoon',
  metaDesc: 'تعمیر و رگلاژ تخصصی انواع کابینت MDF، هایگلاس و ممبران، ساخت کمد دیواری ریلی، تعمیر و کوتاه‌کردن درب چوبی و نصب پارکت در تهران با استادکاران مجرب بهدون با فاکتور معتبر.',
  subtitle: 'طراحی، ساخت و رگلاژ انواع مصنوعات چوبی، کابینت آشپزخانه و کمد دیواری با قطعات درجه یک و برش دقیق نجاری.',
  subtitleEn: 'Design, repair, and alignment of kitchen cabinets, closets, interior wooden doors, and parquet flooring in Tehran.',
  icon: `<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  subServices: [
    {
      id: 'cabinet-repair',
      name: 'تعمیر و رگلاژ کابینت آشپزخانه',
      nameEn: 'Cabinet Repair & Alignment',
      slug: 'cabinet-repair',
      persianSlug: 'تعمیر-کابینت-آشپزخانه',
      aliases: ['cabinet-repair', 'کابینت', 'رگلاژ-کابینت'],
      basePrice: 600000,
      shortDesc: 'تعویض لولای آرام‌بند، ریل‌های ساچمه‌ای کشو، صفحه کورین، ام‌دی‌اف، جک پمپی و رگلاژ کامل درب کابینت',
      shortDescEn: 'Hinge replacement, drawer slides repair, countertop repairs, pneumatic lift cylinder replacement',
      features: [
        'تعویض لولاهای مستهلک با لولاهای آرام‌بند استیل ضدزنگ پمپ برنجی',
        'تعویض ریل‌های خراب کشو با ریل‌های سه‌تکه ساچمه‌ای سنگین',
        'ترمیم بادکردگی و آب‌خوردگی یونیت زیر سینک با ورق ضدآب PVC',
        'رگلاژ و هم‌سطح‌سازی دقیق درهای هایگلاس، ممبران و چوب طبیعی',
        'تعویض صفحه روی کابینت، قرنیز آب‌بند و دستگیره‌ها'
      ],
      detailHtml: `
        <div class="space-y-6 text-slate-700 leading-relaxed text-justify">
          <div class="bg-gradient-to-l from-amber-50/70 to-white p-5 rounded-2xl border border-amber-100 mb-6">
            <h3 class="text-lg font-black text-brand-700 mb-2">تعمیرات تخصصی انواع کابینت‌های مدرن و کلاسیک در تهران</h3>
            <p class="text-sm text-slate-600">افتادگی درب‌های کابینت، صدای ناهنجار ریل کشوها یا بادکردگی چوب یونیت زیر سینک، علاوه بر ظاهر ناخوشایند، ارگونومی آشپزخانه را برهم می‌زند. تکنسین‌های بهدون در کوتاه‌ترین زمان کابینت‌های شما را مانند روز اول نو و منظم می‌سازند.</p>
          </div>
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 my-6">
            <div class="flex flex-wrap items-center gap-3">
              <button type="button" data-order-service="cabinet-repair" class="bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all">
                ثبت درخواست تعمیر و رگلاژ کابینت
              </button>
              <a href="tel:09333256885" class="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors">
                تماس با استادکار: ۰۹۳۳۳۲۵۶۸۸۵
              </a>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'closet-design',
      name: 'کمد دیواری و جاکفشی سفارشی',
      nameEn: 'Custom Closets & Wardrobes',
      slug: 'closet-design',
      persianSlug: 'کمد-دیواری-و-جاکفشی',
      aliases: ['closet-design', 'کمد-دیواری', 'جاکفشی'],
      basePrice: 1800000,
      shortDesc: 'طراحی، ساخت و نصب کمد دیواری‌های ریلی و لولایی، شلف، باکس و جاکفشی با متریال ضدخش استاندارد',
      shortDescEn: 'Sliding and hinged custom closet design, shelving, shoe organizers with scratch-proof materials',
      features: [
        'ساخت کمد دیواری ریلی با ریل‌های ترک و قرقره‌های بلبرینگی آرام',
        'طراحی داخلی بهینه شامل رگال، طبقات لباس، کشوهای مخفی و باکس چمدان',
        'تبدیل کمدهای قدیمی لولایی به ریلی مدرن بدون تخریب',
        'استفاده از MDF استاندارد دانسیته بالا با روکش ملامینه ضدخش',
        'نصب اکسسوری‌های جا شلواری، آینه قدی کشویی و نورپردازی لاین نوری'
      ],
      detailHtml: `
        <div class="space-y-6 text-slate-700 leading-relaxed text-justify">
          <div class="bg-gradient-to-l from-emerald-50/70 to-white p-5 rounded-2xl border border-emerald-100 mb-6">
            <h3 class="text-lg font-black text-brand-700 mb-2">طراحی و اجرای مدرن‌ترین کمدهای دیواری و کلوزت روم در تهران</h3>
            <p class="text-sm text-slate-600">کمدهای دیواری فضاسازی هوشمندانه خانه هستند. اجرای استاندارد ریل‌ها و اتصالات الیت استحکام فوق‌العاده‌ای به سازه بخشیده و حرکت درب‌ها را بی‌صدا و نرم می‌سازد.</p>
          </div>
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 my-6">
            <div class="flex flex-wrap items-center gap-3">
              <button type="button" data-order-service="closet-design" class="bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all">
                ثبت سفارش کمد دیواری
              </button>
              <a href="tel:09333256885" class="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors">
                مشاوره و اندازه‌گیری: ۰۹۳۳۳۲۵۶۸۸۵
              </a>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'door-repair',
      name: 'تعمیر و رگلاژ درب چوبی',
      nameEn: 'Wooden Door Adjustment & Repair',
      slug: 'door-repair',
      persianSlug: 'تعمیر-درب-چوبی',
      aliases: ['door-repair', 'درب-چوبی', 'رگلاژ-درب'],
      basePrice: 450000,
      shortDesc: 'کوتاه کردن و رنده‌کاری درب‌ها پس از سرامیک، رفع گیر و اصطکاک، تعویض قفل و لولا و صداگیری',
      shortDescEn: 'Wooden door bottom trimming after flooring, friction removal, squeak silencing, hinge fix',
      features: [
        'رنده‌کاری و کوتاه کردن لبه پایین درب با اره فارسی‌بر و رنده برقی بدون لب‌پریدگی',
        'رفع گیر کردن درب به چهارچوب ناشی از نشست ساختمان یا بادکردگی چوب',
        'تعویض لولاهای مستهلک و مقاوم‌سازی جای پیچ‌های هرز شده',
        'تعویض قفل کلیدی، قفل سرویسی و دستگیره‌های اتاقی',
        'روغن‌کاری و صداگیری تخصصی لولاها'
      ],
      detailHtml: `
        <div class="space-y-6 text-slate-700 leading-relaxed text-justify">
          <div class="bg-gradient-to-l from-sky-50/70 to-white p-5 rounded-2xl border border-sky-100 mb-6">
            <h3 class="text-lg font-black text-brand-700 mb-2">رگلاژ، صداگیری و کوتاه کردن درب‌های چوبی در محل</h3>
            <p class="text-sm text-slate-600">پس از نصب پارکت، لمینت یا سرامیک جدید، کف واحد بالا آمده و درب‌ها به کف کشیده می‌شوند. نجاران بهدون در محل با ابزار برقی لبه درب را تراز و کوتاه نموده و رنگ‌آمیزی لبه را انجام می‌دهند.</p>
          </div>
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 my-6">
            <div class="flex flex-wrap items-center gap-3">
              <button type="button" data-order-service="door-repair" class="bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all">
                ثبت درخواست تعمیر درب چوبی
              </button>
              <a href="tel:09333256885" class="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors">
                تماس: ۰۹۳۳۳۲۵۶۸۸۵
              </a>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'parquet-flooring',
      name: 'نصب پارکت و لمینت',
      nameEn: 'Parquet & Laminate Flooring',
      slug: 'parquet-flooring',
      persianSlug: 'نصب-پارکت-و-لمینت',
      aliases: ['parquet-flooring', 'پارکت', 'لمینت'],
      basePrice: 1400000,
      shortDesc: 'زیرسازی با فوم سایلنت، نصب کلیکی لمینت و پارکت چوبی و قرنیز دور سالن با تضمین دوام',
      shortDescEn: 'Silent foam underlayment, click-lock laminate/parquet installation, baseboard mounting',
      features: [
        'پهن کردن فوم سایلنت ۲ میلی‌متری متالایز جهت عایق صوت و حرارت',
        'نصب دقیق کلیک‌های لمینت ضدآب AC4 و AC5 بدون درز و لغزش',
        'رعایت ژوئن و درز انبساط دور تا دور دیوارها جهت جلوگیری از بادکردن در گرما',
        'برش فارسی‌بر و نصب قرنیزهای PVC و MDF به همراه گرده و نبشی تودلی',
        'ساب و لاک پارکت‌های چوب طبیعی با سنباده ماشینی و پلی‌اورتان ضدخش'
      ],
      detailHtml: `
        <div class="space-y-6 text-slate-700 leading-relaxed text-justify">
          <div class="bg-gradient-to-l from-rose-50/70 to-white p-5 rounded-2xl border border-rose-100 mb-6">
            <h3 class="text-lg font-black text-brand-700 mb-2">نصب حرفه‌ای انواع کفپوش، پارکت چوبی و لمینت در تهران</h3>
            <p class="text-sm text-slate-600">کفپوش چوبی گرمابخش دکوراسیون است. زیرسازی دقیق و رعایت درزهای حرارتی از ایجاد صدای جیرجیر هنگام راه رفتن یا بالا آمدن لمینت جلوگیری به عمل می‌آورد.</p>
          </div>
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 my-6">
            <div class="flex flex-wrap items-center gap-3">
              <button type="button" data-order-service="parquet-flooring" class="bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all">
                درخواست نصب پارکت و لمینت
              </button>
              <a href="tel:09333256885" class="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors">
                تماس: ۰۹۳۳۳۲۵۶۸۸۵
              </a>
            </div>
          </div>
        </div>
      `
    }
  ],
  comprehensiveGuide: `
    <article class="mt-12 pt-10 border-t border-slate-200 text-slate-700 leading-relaxed text-justify space-y-8" dir="rtl">
      <header class="text-center max-w-3xl mx-auto space-y-4 mb-10">
        <span class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
          دانشنامه نجاری و دکوراسیون داخلی در تهران
        </span>
        <h2 class="text-2xl md:text-3xl font-black text-slate-800 leading-tight">
          راهنمای کاربردی نگهداری کابینت، کمد دیواری و مصنوعات چوبی ساختمان
        </h2>
      </header>
    </article>
  `,
  faq: [
    {
      q: 'آیا رگلاژ درب‌های کابینت و تعویض لولاها در همان روز انجام می‌شود؟',
      a: 'بله، استادکاران بهدون با داشتن قطعات مصرفی استاندارد، در همان جلسه اول کلیه لولاها و ریل‌ها را تعویض و تنظیم می‌نمایند.'
    },
    {
      q: 'علت گیر کردن درب‌های چوبی پس از بازسازی چیست؟',
      a: 'کف‌سازی مجدد با سرامیک یا لمینت ارتفاع کف را افزایش می‌دهد. نجار با رنده برقی دقیقاً به میزان لازم لبه پایین درب را رنده‌کاری می‌کند.'
    }
  ]
};

// 4. Doors & Windows category & subservices
const doorsWindowsCategory = {
  id: 'doors_windows',
  slug: 'doors_windows',
  persianSlug: 'در-پنجره-upvc',
  aliases: ['doors_windows', 'doors-windows', 'upvc', 'پنجره-دوجداره'],
  title: 'تعمیرات پنجره دوجداره UPVC، توری پلیسه و شیشه سکوریت در تهران | بهدون',
  titleEn: 'UPVC Window Repairs, Pleated Mesh & Glass Replacement in Tehran | Behdoon',
  metaDesc: 'رگلاژ تخصصی در و پنجره دوجداره UPVC و آلومینیومی، تعویض لاستیک درزبندی، ساخت انواع توری پلیسه کشویی و تعویض شیشه سکوریت و دوجداره با اعزام فوری در تهران.',
  subtitle: 'عایق‌بندی کامل صوتی و حرارتی، تعویض یراق‌آلات اسپانیولت و ممانعت از ورود گرد و غبار به محیط زندگی شما.',
  subtitleEn: '100% sound and thermal insulation, UPVC espagnolette hardware repair, pleated mesh, and glass replacement.',
  icon: `<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 21h18M4 18V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13M9 3v15m6-15v15M3 11h18"/></svg>`,
  subServices: [
    {
      id: 'upvc-repair',
      name: 'رگلاژ و تعمیر پنجره UPVC',
      nameEn: 'UPVC Window Adjustment & Repair',
      slug: 'upvc-repair',
      persianSlug: 'رگلاژ-پنجره-upvc',
      aliases: ['upvc-repair', 'رگلاژ-پنجره', 'تعمیر-پنجره-دوجداره'],
      basePrice: 500000,
      shortDesc: 'رگلاژ، عایق‌بندی صوتی و حرارتی، تعویض اسپانیولت، زاماک و لاستیک‌های درزبندی EPDM پنجره دوجداره',
      shortDescEn: 'UPVC window calibration, soundproofing, espagnolette, striker, and EPDM gasket replacement',
      features: [
        'رگلاژ تخصصی بازشو با آچار آلن مخصوص و زیرشیشه‌ای‌های استاندارد',
        'تعویض یراق‌آلات اسپانیولت تک‌حالته و دوحالته ترک و آلمانی (روتو، کاله)',
        'تعویض لاستیک‌های پوسیده درزبندی با گسکت‌های منعطف EPDM مقاوم در برابر آفتاب',
        'رفع زوزه باد، صدای خیابان و جلوگیری از نفوذ آب باران از درزهای پنجره',
        'تعویض دستگیره‌های شکسته و زاماک‌های قفل‌کننده'
      ],
      detailHtml: `
        <div class="space-y-6 text-slate-700 leading-relaxed text-justify">
          <div class="bg-gradient-to-l from-cyan-50/70 to-white p-5 rounded-2xl border border-cyan-100 mb-6">
            <h3 class="text-lg font-black text-brand-700 mb-2">رگلاژ و آب‌بندی پنجره‌های دوجداره در کلیه مناطق تهران</h3>
            <p class="text-sm text-slate-600">پنجره‌های UPVC با گذشت زمان و وزن شیشه‌های دوجداره سنگین دچار افتادگی لنگه شده و به سختی باز و بسته می‌شوند یا صدای ترافیک را از خود عبور می‌دهند. رگلاژ تخصصی با زیرشیشه‌ای‌های مهندسی، پنجره را به حالت کاملاً عایق بازمی‌گرداند.</p>
          </div>
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 my-6">
            <div class="flex flex-wrap items-center gap-3">
              <button type="button" data-order-service="upvc-repair" class="bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all">
                ثبت درخواست رگلاژ پنجره UPVC
              </button>
              <a href="tel:09333256885" class="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors">
                تماس فوری: ۰۹۳۳۳۲۵۶۸۸۵
              </a>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'pleated-mesh',
      name: 'نصب توری پلیسه کشویی',
      nameEn: 'Pleated Insect Mesh Screen',
      slug: 'pleated-mesh',
      persianSlug: 'نصب-توری-پلیسه',
      aliases: ['pleated-mesh', 'توری-پلیسه', 'توری-پنجره'],
      basePrice: 650000,
      shortDesc: 'ساخت و نصب توری‌های ضدحشرات متحرک و پلیسه جمع‌شونده برای انواع پنجره و تراس با آلومینیوم مقاوم',
      shortDescEn: 'Custom retractable insect mesh screens for double-glazed windows, doors, and balconies',
      features: [
        'توری فایبرگلاس درجه یک با بافت ریز ضدپوسیدگی و ضدگردوغبار',
        'پروفیل آلومینیومی سنگین با رنگ کوره‌ای الکترواستاتیک هماهنگ با نمای پنجره',
        'مگنتی محکم با نخ‌های کورد مقاوم کره‌ای بدون پارگی در باد شدید',
        'قابلیت شستشوی آسان با آب و جمع‌شدن روان درون قاب',
        'اندازه‌گیری دقیق و ساخت فوری ظرف ۲۴ الی ۴۸ ساعت در تهران'
      ],
      detailHtml: `
        <div class="space-y-6 text-slate-700 leading-relaxed text-justify">
          <div class="bg-gradient-to-l from-teal-50/70 to-white p-5 rounded-2xl border border-teal-100 mb-6">
            <h3 class="text-lg font-black text-brand-700 mb-2">ساخت و نصب انواع توری‌های پلیسه ضدحشرات کشویی در تهران</h3>
            <p class="text-sm text-slate-600">توری‌های پلیسه مدرن بدون اشغال فضا در زمان عدم نیاز درون محفظه کناری جمع می‌شوند و دید منظره را مسدود نمی‌کنند. این توری‌ها مانع ورود پشه، مگس و حشرات موذی به داخل منزل می‌شوند.</p>
          </div>
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 my-6">
            <div class="flex flex-wrap items-center gap-3">
              <button type="button" data-order-service="pleated-mesh" class="bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all">
                ثبت سفارش توری پلیسه
              </button>
              <a href="tel:09333256885" class="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors">
                تماس: ۰۹۳۳۳۲۵۶۸۸۵
              </a>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'glass-replacement',
      name: 'تعویض شیشه دوجداره و سکوریت',
      nameEn: 'Double-Glazed & Tempered Glass Replacement',
      slug: 'glass-replacement',
      persianSlug: 'تعویض-شیشه-دوجداره',
      aliases: ['glass-replacement', 'شیشه-دوجداره', 'شیشه-سکوریت'],
      basePrice: 800000,
      shortDesc: 'برش و تعویض شیشه‌های شکسته، دوجداره صنعتی با گاز آرگون، لمینت و شیشه‌های سکوریت نشکن',
      shortDescEn: 'Argon double-glazing, laminated, tempered, and reflective glass cutting and replacement',
      features: [
        'تولید شیشه دوجداره با تزریق گاز آرگون و چسب پلی‌سولفاید صنعتی ضدبخار',
        'تعویض شیشه‌های بخارگرفته، مات‌شده یا شکسته در و پنجره ساختمان',
        'نصب و برش انواع شیشه‌های سکوریت ۶، ۸ و ۱۰ میل دوراستخر، بالکن و مغازه',
        'تزریق سیلیکون ماستیک آب‌بندی در دور قاب',
        'نصب شیشه‌های رفلکس، برفی، سندبلاست و ضدگلوله'
      ],
      detailHtml: `
        <div class="space-y-6 text-slate-700 leading-relaxed text-justify">
          <div class="bg-gradient-to-l from-blue-50/70 to-white p-5 rounded-2xl border border-blue-100 mb-6">
            <h3 class="text-lg font-black text-brand-700 mb-2">تعویض سریع شیشه‌های شکسته و بخارگرفته دوجداره در تهران</h3>
            <p class="text-sm text-slate-600">بخارگرفتگی بین دو جداره شیشه نشان‌دهنده از بین رفتن چسب عایق و خروج گاز آرگون است که زیبایی پنجره را مخدوش می‌کند. تعویض جام شیشه در محل با دقت بالا انجام می‌گردد.</p>
          </div>
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 my-6">
            <div class="flex flex-wrap items-center gap-3">
              <button type="button" data-order-service="glass-replacement" class="bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all">
                درخواست تعویض شیشه
              </button>
              <a href="tel:09333256885" class="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors">
                تماس: ۰۹۳۳۳۲۵۶۸۸۵
              </a>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'electric-shutter',
      name: 'کرکره برقی و رول‌آپ',
      nameEn: 'Electric Roll-up Shutter',
      slug: 'electric-shutter',
      persianSlug: 'کرکره-برقی',
      aliases: ['electric-shutter', 'کرکره-برقی', 'رول-آپ'],
      basePrice: 950000,
      shortDesc: 'تعمیر موتور توبولار و ساید، تعویض تیغه‌های آسیب‌دیده آلومینیومی و تنظیم خلاص‌کن دستی کرکره',
      shortDescEn: 'Electric roller shutter repair, tubular/side motors, blade replacement, manual release tuning',
      features: [
        'تعمیر و تعویض موتورهای ساید صنعتی، توبلار و سانترال',
        'تعویض تیغه‌های آلومینیومی دوجداره، تیغه فولادی و پلی‌کربنات شفاف',
        'تنظیم میکروسوئیچ حد بالا و پایین جهت جلوگیری از گیر کردن کرکره در ریل',
        'کددهی ریموت و نصب یوپی‌اس (UPS) برق اضطراری برای مواقع قطعی برق',
        'روان‌کاری ریل‌ها، صداگیری تیغه‌ها و تعویض لاستیک انتهایی'
      ],
      detailHtml: `
        <div class="space-y-6 text-slate-700 leading-relaxed text-justify">
          <div class="bg-gradient-to-l from-violet-50/70 to-white p-5 rounded-2xl border border-violet-100 mb-6">
            <h3 class="text-lg font-black text-brand-700 mb-2">تعمیرات تخصصی انواع کرکره‌های برقی پارکینگ و فروشگاه در تهران</h3>
            <p class="text-sm text-slate-600">بالا نرفتن کرکره برقی یا خارج شدن تیغه‌ها از ریل، تردد وسایل نقلیه را فلج می‌کند. تکنسین‌های بهدون با تجهیزات کامل در کمترین زمان مشکل برقی و مکانیکی کرکره را مرتفع می‌سازند.</p>
          </div>
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 my-6">
            <div class="flex flex-wrap items-center gap-3">
              <button type="button" data-order-service="electric-shutter" class="bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all">
                درخواست تعمیر کرکره برقی
              </button>
              <a href="tel:09333256885" class="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors">
                تماس: ۰۹۳۳۳۲۵۶۸۸۵
              </a>
            </div>
          </div>
        </div>
      `
    }
  ],
  comprehensiveGuide: `
    <article class="mt-12 pt-10 border-t border-slate-200 text-slate-700 leading-relaxed text-justify space-y-8" dir="rtl">
      <header class="text-center max-w-3xl mx-auto space-y-4 mb-10">
        <span class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
          دانشنامه در، پنجره و شیشه در تهران
        </span>
        <h2 class="text-2xl md:text-3xl font-black text-slate-800 leading-tight">
          روش‌های رگلاژ، کاهش آلودگی صوتی و بهینه‌سازی انرژی با پنجره‌های دوجداره
        </h2>
      </header>
    </article>
  `,
  faq: [
    {
      q: 'آیا رگلاژ پنجره UPVC مانع عبور صدای سرسام‌آور خیابان می‌شود؟',
      a: 'بله، در صورت رگلاژ اصولی و تعویض گسکت‌های لاستیکی، فشار لنگه روی چهارچوب یکنواخت شده و عبور صدا تا ۸۰٪ کاهش می‌یابد.'
    }
  ]
};

// 5. Cleaning category & subservices
const cleaningCategory = {
  id: 'cleaning',
  slug: 'cleaning',
  persianSlug: 'نظافت-مشاعات-ساختمان',
  aliases: ['cleaning', 'wash', 'نظافت', 'نماشویی', 'سمپاشی'],
  title: 'خدمات نظافت ساختمان، نماشویی و سم‌پاشی تخصصی در تهران | بهدون',
  titleEn: 'Building Cleaning, Facade Washing & Pest Control in Tehran | Behdoon',
  metaDesc: 'نظافت حرفه‌ای راه‌پله، پارکینگ، لابی و مشاعات، شستشوی نما با طناب بدون داربست (راپ‌اکسس)، مبل‌شویی و قالیشویی در محل، و سم‌پاشی سوسک و ساس با مواد استاندارد وزارت بهداشت.',
  subtitle: 'نیروهای متعهد و آموزش‌دیده، مجهز به تجهیزات پیشرفته شستشو، شوینده‌های نانو و سموم بی‌خطر با گارانتی نتیجه.',
  subtitleEn: 'Professional cleaning crews, rope-access facade washing, sofa/carpet shampooing, and certified pest extermination.',
  icon: `<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10"/></svg>`,
  subServices: [
    {
      id: 'staircase-cleaning',
      name: 'نظافت راه‌پله و مشاعات',
      nameEn: 'Staircase & Common Area Cleaning',
      slug: 'staircase-cleaning',
      persianSlug: 'نظافت-راه-پله-و-مشاعات',
      aliases: ['staircase-cleaning', 'نظافت-پله', 'نظافت-مشاعات'],
      basePrice: 450000,
      shortDesc: 'شستشوی پله‌ها، نرده، لابی، آسانسور و پارکینگ با مواد شوینده صنعتی استاندارد و ضدعفونی کامل',
      shortDescEn: 'Staircase, railing, lobby, elevator, and parking deep wash with professional cleaning agents',
      features: [
        'نظافت کامل پله‌ها و پاگردها از بالا به پایین با تی مپ مرغوب و کف‌سابی ملایم',
        'دستمال‌کشی و جلادهی نرده‌های استیل، درهای ورودی و کابین آسانسور',
        'شستشوی کف پارکینگ با مواد چربی‌زدا جهت رفع لکه‌های روغن موتور اتومبیل',
        'شستشوی درب پارکینگ، آیفون، حیاط و تخلیه سطل‌های زباله مشاعات',
        'اعزام نیروهای منظم، متعهد و دارای گواهی عدم سوء‌پیشینه'
      ],
      detailHtml: `
        <div class="space-y-6 text-slate-700 leading-relaxed text-justify">
          <div class="bg-gradient-to-l from-emerald-50/70 to-white p-5 rounded-2xl border border-emerald-100 mb-6">
            <h3 class="text-lg font-black text-brand-700 mb-2">نظافت دوره‌ای و اصولی مشاعات مجتمع‌های مسکونی و اداری تهران</h3>
            <p class="text-sm text-slate-600">مشاعات ساختمان نخستین جلوه بصری خانه شماست. پرسنل خدماتی بهدون طبق چک‌لیست مدون، تمیزی و درخشش سنگ پله‌ها و لابی را تضمین می‌کنند.</p>
          </div>
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 my-6">
            <div class="flex flex-wrap items-center gap-3">
              <button type="button" data-order-service="staircase-cleaning" class="bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all">
                ثبت درخواست نظافت مشاعات
              </button>
              <a href="tel:09333256885" class="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors">
                تماس: ۰۹۳۳۳۲۵۶۸۸۵
              </a>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'facade-cleaning',
      name: 'نماشویی ساختمان',
      nameEn: 'Building Facade Washing',
      slug: 'facade-cleaning',
      persianSlug: 'نماشویی-ساختمان',
      aliases: ['facade-cleaning', 'نماشویی', 'شستشوی-نما'],
      basePrice: 2200000,
      shortDesc: 'واترجت و سندبلاست نمای سنگی، آجری و کامپوزیت با طناب کاربری (راپ‌اکسس) بدون نیاز به داربست',
      shortDescEn: 'High-pressure waterjet & sandblasting facade cleaning via industrial rope access (no scaffolding)',
      features: [
        'شستشوی تخصصی نما با واترجت صنعتی ۳۰۰ بار بدون آسیب به بندکشی سنگ',
        'اجرای سندبلاست تر با سیلیس مرغوب برای رفع دوده، جرم و شوره آجر و سنگ',
        'شستشوی شیشه‌ها و کامپوزیت با ابر و تی نانو و مواد ضدجرم گریزی',
        'پیچ و رولپلاک سنگ‌های نما با پیچ گالوانیزه ۶ سانتی و بتونه همرنگ',
        'استفاده از کارشناسان راپ‌اکسس دارای مدرک بین‌المللی IRATA و بیمه حوادث'
      ],
      detailHtml: `
        <div class="space-y-6 text-slate-700 leading-relaxed text-justify">
          <div class="bg-gradient-to-l from-sky-50/70 to-white p-5 rounded-2xl border border-sky-100 mb-6">
            <h3 class="text-lg font-black text-brand-700 mb-2">نماشویی بدون داربست و پیچ و رولپلاک سنگ نما در تهران</h3>
            <p class="text-sm text-slate-600">آلودگی هوا و دوده در تهران به مرور زمان نمای ساختمان‌ها را کدر و تیره می‌کند. شستشو با سیستم طناب و واترجت، بدون ایجاد سدمعبر پیاده‌رو، درخشندگی اولیه سنگ و آجر را احیا می‌نماید.</p>
          </div>
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 my-6">
            <div class="flex flex-wrap items-center gap-3">
              <button type="button" data-order-service="facade-cleaning" class="bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all">
                درخواست بازدید و نماشویی
              </button>
              <a href="tel:09333256885" class="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors">
                مشاوره فنی: ۰۹۳۳۳۲۵۶۸۸۵
              </a>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'carpet-sofa-wash',
      name: 'مبل‌شویی و قالیشویی در محل',
      nameEn: 'On-site Sofa & Carpet Wash',
      slug: 'carpet-sofa-wash',
      persianSlug: 'مبل-شویی-در-محل',
      aliases: ['carpet-sofa-wash', 'مبل-شویی', 'قالیشویی-در-محل'],
      basePrice: 700000,
      shortDesc: 'شستشوی تخصصی مبلمان، تشک خوشخواب و فرش با دستگاه‌های مکنده قوی سه‌موتوره و خشک‌کن در محل',
      shortDescEn: 'On-site sofa, mattress, and carpet extraction wash with powerful 3-motor vacuum equipment',
      features: [
        'شستشوی انواع مبلمان راحتی، سلطنتی، چرم و مخمل با شامپو نانو آلمانی',
        'مکش چرک‌آب با موتورهای مکنده وکیوم قوی و خشک شدن ظرف ۳ الی ۴ ساعت',
        'لکه‌بری قوی چربی، جوهر، قهوه و لکه‌های کهنه بدون تغییر رنگ پارچه',
        'شستشوی تشک دونفره و تک‌نفره خوشخواب و ضدعفونی با بخارشوی',
        'شستشوی موکت‌های چسبیده و فرش‌های دستباف و ماشینی بدون جابجایی'
      ],
      detailHtml: `
        <div class="space-y-6 text-slate-700 leading-relaxed text-justify">
          <div class="bg-gradient-to-l from-rose-50/70 to-white p-5 rounded-2xl border border-rose-100 mb-6">
            <h3 class="text-lg font-black text-brand-700 mb-2">مبل‌شویی حرفه‌ای در منزل با دستگاه وکیوم در تهران</h3>
            <p class="text-sm text-slate-600">شستشوی مبلمان با دستگاه دریل فرچه‌ای و مکنده آب و خاک، آلودگی‌ها و مایت‌های نفوذ کرده در عمق اسفنج را به طور کامل تخلیه کرده و لطافت و بوی مطبوع را به خانه شما بازمی‌گرداند.</p>
          </div>
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 my-6">
            <div class="flex flex-wrap items-center gap-3">
              <button type="button" data-order-service="carpet-sofa-wash" class="bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all">
                ثبت سفارش مبل‌شویی در محل
              </button>
              <a href="tel:09333256885" class="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors">
                تماس: ۰۹۳۳۳۲۵۶۸۸۵
              </a>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'pest-control',
      name: 'سم‌پاشی و ضدعفونی تخصصی',
      nameEn: 'Professional Pest Control',
      slug: 'pest-control',
      persianSlug: 'سم-پاشی-ساختمان',
      aliases: ['pest-control', 'سمپاشی', 'ریشه-کنی-ساس'],
      basePrice: 850000,
      shortDesc: 'طعمه‌گذاری و ریشه‌کنی قطعی ساس، سوسک ریز کابینت و موش با سموم ترکیبی بدون بو و دارای تاییدیه بهداشت',
      shortDescEn: 'Guaranteed pest control, odorless extermination of bedbugs, cockroaches, and rodents with certified formulas',
      features: [
        'ریشه‌کنی قطعی سوسک ریز آشپزخانه (آلمانی) با ژل‌های طعمه‌گذاری بدون بو و بدون نیاز به ترک منزل',
        'سم‌پاشی گازسوز و مایع تخصصی برای نابودی کامل ساس در تشک‌ها و درزهای تختخواب',
        'طعمه‌گذاری و انسداد منافذ جهت ریشه‌کنی موش‌های فاضلاب شهری',
        'استفاده از سموم پیرتروئید ارگانیک دارای تاییدیه وزارت بهداشت بدون خطر برای کودکان و حیوانات خانگی',
        'ارائه ضمانت‌نامه کتبی تکرار رایگان در صورت مشاهده مجدد حشرات'
      ],
      detailHtml: `
        <div class="space-y-6 text-slate-700 leading-relaxed text-justify">
          <div class="bg-gradient-to-l from-amber-50/70 to-white p-5 rounded-2xl border border-amber-100 mb-6">
            <h3 class="text-lg font-black text-brand-700 mb-2">سم‌پاشی بهداشتی و ریشه‌کنی تضمینی حشرات موذی در تهران</h3>
            <p class="text-sm text-slate-600">وجود ساس یا سوسک در خانه آرامش خانواده را مختل می‌کند. کارشناسان بهداشت بهدون با شناخت چرخه تخم‌گذاری حشرات، سم‌پاشی را به گونه‌ای انجام می‌دهند که تا آخرین نسل آفات ریشه‌کن گردند.</p>
          </div>
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 my-6">
            <div class="flex flex-wrap items-center gap-3">
              <button type="button" data-order-service="pest-control" class="bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all">
                ثبت درخواست سم‌پاشی تضمینی
              </button>
              <a href="tel:09333256885" class="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors">
                تماس فوری: ۰۹۳۳۳۲۵۶۸۸۵
              </a>
            </div>
          </div>
        </div>
      `
    }
  ],
  comprehensiveGuide: `
    <article class="mt-12 pt-10 border-t border-slate-200 text-slate-700 leading-relaxed text-justify space-y-8" dir="rtl">
      <header class="text-center max-w-3xl mx-auto space-y-4 mb-10">
        <span class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
          دانشنامه نظافت، نماشویی و بهداشت محیط در تهران
        </span>
        <h2 class="text-2xl md:text-3xl font-black text-slate-800 leading-tight">
          استانداردهای بهداشتی نظافت مشاعات، نماشویی با طناب و مبارزه با آفات خانگی
        </h2>
      </header>
    </article>
  `,
  faq: [
    {
      q: 'آیا سم‌پاشی سوسک ریز کابینت نیازمند جمع‌آوری ظروف آشپزخانه است؟',
      a: 'خیر، با روش طعمه‌گذاری ژله‌ای نوین بهدون، هیچ نیازی به خالی کردن کابینت‌ها، شستشوی ظروف یا ترک منزل نیست.'
    }
  ]
};

// Base price map for plumbing, electrical, renovation, hvac
const PRICE_MAP = {
  'water-cooler': 450000,
  'package': 650000,
  'radiator': 400000,
  'water-heater': 450000,
  'split-ac': 850000,
  
  'leak-detection': 950000,
  'moisture-repair': 850000,
  'faucets': 350000,
  'water-tank': 800000,
  'toilet': 550000,
  'piping': 900000,
  'sink': 400000,
  'water-purifier': 450000,
  'flush-tank': 350000,
  'washbasin': 450000,
  'wall-hung': 750000,
  'sewage-connection': 1200000,
  'unclogging': 500000,

  'short-circuit': 550000,
  'wiring': 700000,
  'chandelier': 450000,
  'switches': 300000,
  'intercom': 500000,
  'electrical-panel': 900000,
  'earthing': 850000,
  'fire-alarm': 1100000,
  'stabilizer': 650000,
  'cctv': 950000,

  'painting': 1200000,
  'tiling': 1500000,
  'masonry': 1100000,
  'plastering': 850000,
  'roof-insulation': 900000,
  'knauf': 1800000,
  'wallpaper': 950000,
  'parquet': 1400000,
  'stone-work': 1600000,
  'facade-repair': 1750000
};

const EN_NAMES = {
  'water-cooler': 'Water Cooler Service',
  'package': 'Heating Package & Boiler',
  'radiator': 'Radiator & Heating Valve',
  'water-heater': 'Water Heater Service',
  'split-ac': 'Split AC & Air Conditioning',

  'leak-detection': 'Acoustic Pipe Leak Detection',
  'moisture-repair': 'Damp & Moisture Repair',
  'faucets': 'Faucet & Tap Repair',
  'water-tank': 'Water Storage Tank & Pump',
  'toilet': 'Toilet Installation & Repair',
  'piping': 'Plumbing & Drainage Piping',
  'sink': 'Kitchen Sink & Trap',
  'water-purifier': 'Water Purifier Filter & Service',
  'flush-tank': 'Flush Tank & Valve Repair',
  'washbasin': 'Washbasin & Vanity Mounting',
  'wall-hung': 'Wall-Hung Concealed Toilet',
  'sewage-connection': 'City Sewage Network Connection',

  'short-circuit': 'Urgent Short-Circuit Troubleshooting',
  'wiring': 'Building Electrical Wiring',
  'chandelier': 'Chandelier & Lighting Installation',
  'switches': 'Switches & Sockets Replacement',
  'intercom': 'Video & Audio Intercom Repair',
  'electrical-panel': 'Electrical Breaker Panel Assembly',
  'earthing': 'Earthing & Grounding System',
  'fire-alarm': 'Fire Alarm & Detection Systems',
  'stabilizer': 'Voltage Stabilizer & Surge Protector',
  'cctv': 'CCTV Security Camera Installation',

  'painting': 'Building Wall & Ceiling Painting',
  'tiling': 'Floor & Wall Ceramic Tiling',
  'masonry': 'Masonry, Brickwork & Demolition',
  'plastering': 'Plastering & Drywall Patching',
  'roof-insulation': 'Roof Waterproofing & Tar Coating',
  'knauf': 'Knauf False Ceilings & Lighting Boxes',
  'wallpaper': 'Wallpaper & Wall Decal Mounting',
  'parquet': 'Parquet & Laminate Flooring',
  'stone-work': 'Building Stonework & Stairs',
  'facade-repair': 'Building Facade Anchoring & Restoration'
};

const SHORT_DESC_MAP = {
  'water-cooler': 'سرویس کامل دوره‌ای، تعویض پوشال، تست و تعویض پمپ و دینام و روغن‌کاری یاتاقان‌ها',
  'package': 'رسوب‌زدایی مبدل، رفع افت فشار، عیب‌یابی کدهای خطا، تعمیر برد الکترونیک و سرویس رادیاتور',
  'radiator': 'نصب و افزایش پره، رفع آب‌بندی و نشتی رادیاتور، تعویض شیر رفت‌وبرگشت و شیر ترموستاتیک',
  'water-heater': 'جرم‌گیری کوئل مسی، تعویض دیافراگم، سرویس پیلوت، شمعک و کاربراتور آبگرمکن دیواری',
  'split-ac': 'شارژ گاز استاندارد R22 و R410، شستشوی پنل داخلی و کندانسور خارجی، نشت‌یابی و نصب',

  'leak-detection': 'نشت‌یابی نقطه زن با دستگاه آکوستیک و تصویری حرارتی پیشرفته بدون کمترین تخریب در ساختمان',
  'moisture-repair': 'رفع نم و رطوبت دیوارها و سقف، عایق‌کاری پلیمری نانو بدون نیاز به تخریب کاشی و سرامیک',
  'faucets': 'نصب و تعمیر انواع شیرآلات اهرمی، توکار، چشمی، دوش حمام، سیفون، فلاش‌تانک و روشویی',
  'water-tank': 'نصب مخازن پلی‌اتیلن سه‌لایه ضدجلبک، شناور برنجی، لوله‌کشی ورودی و خروجی و منبع ذخیره آب',
  'toilet': 'نصب توالت فرنگی، تبدیل توالت ایرانی به فرنگی بدون کثیف‌کاری و رفع گرفتگی و بوگیری کاسه',
  'piping': 'لوله‌کشی آب سرد و گرم پنج‌لایه، نیوپایپ، پلی‌پروپیلن (سبز) و لوله‌کشی فاضلاب پوش‌فیت و پلیکا',
  'sink': 'نصب انواع سینک توکار و روکار استیل و گرانیتی، آب‌بندی با چسب سیلیکون ضدقارچ و نصب سیفون',
  'water-purifier': 'نصب و جابجایی دستگاه‌های تصفیه آب خانگی، تعویض دوره‌ای فیلترهای ۱ تا ۶ و تنظیم باد مخزن',
  'flush-tank': 'تعمیر و تنظیم مکانیزم تخلیه فلاش‌تانک، تعویض فلوتر، پمپ تخلیه و آب‌بندی لوله‌های رابط',
  'washbasin': 'نصب انواع روشویی سنگی، کابینتی، پایه‌دار، آینه باکس، شیر مخلوط و آب‌بندی اتصالات',
  'wall-hung': 'نصب و سرویس استراکچر وال‌هنگ توکار، کلید تخلیه دو زمانه و رفع نشتی کاسه معلق',
  'sewage-connection': 'حفر کانال، لوله‌گذاری اصولی شیب‌دار و اتصال استاندارد به شبکه اگو شهری با مجوز',

  'short-circuit': 'اعزام فوری برقکار برای عیب‌یابی اتصالی سیم‌کشی، رفع پریدن کنتور، فیوز مینیاتوری و برق‌دار بودن بدنه',
  'wiring': 'سیم‌کشی و کابل‌کشی کلی و جزئی مسکونی و تجاری، داکت‌کشی، خطوط تلفن و کابل شبکه',
  'chandelier': 'نصب مطمئن و مهار سنگین انواع لوسترهای سقفی، کریستالی، مدرن، چراغ‌های خطی و هالوژن',
  'switches': 'تعویض کلید و پریزهای قدیمی با مدل‌های مدرن لمسی و ارت‌دار، رفع قطعی و نصب جعبه تقسیم',
  'intercom': 'تعمیر و نصب آیفون‌های صوتی و تصویری، عیب‌یابی قفل‌بازکن، رفع پارازیت تصویر و صدا و سیم‌کشی',
  'electrical-panel': 'طراحی، اسمبل و مرتب‌سازی تابلوهای برق مینیاتوری، کلیدهای محافظ جان (RCD) و کنتاکتور',
  'earthing': 'اجرای سیستم هم‌بندی و چاه ارت با بنتونیت و صاعقه‌گیر جهت حفاظت در برابر برق‌گرفتگی',
  'fire-alarm': 'نصب دتکتورهای دود، حرارت و گاز، پنل مرکزی اعلام حریق ساختمانی طبق تاییدیه آتش‌نشانی',
  'stabilizer': 'نصب استابلایزر و محافظ ولتاژ پای کنتور جهت حفاظت از لوازم برقی گران‌قیمت در نوسانات برق',
  'cctv': 'سیم‌کشی و نصب دوربین‌های مداربسته تحت شبکه IP، انتقال تصویر روی موبایل و سیستم دزدگیر اماکن',

  'painting': 'نقاشی ساختمان با رنگ‌های روغنی، پلاستیک، اکرلیک بی‌بو، بتونه‌کاری کناف و اجرای پتینه‌کاری مدرن',
  'tiling': 'کاشی و سرامیک‌کاری کف و بدنه، اسلب و پرسلان چسبی و ملاتی برای سرویس بهداشتی و آشپزخانه',
  'masonry': 'تخریب دیوارهای مزاحم، تیغه‌چینی، سیمان‌کاری سیاه و سفید، نصب نعل درگاه و حمل نخاله',
  'plastering': 'گچ‌کاری روی بلوک، سفیدکاری صیقلی، لکه‌گیری جای نم و رطوبت و اجرای ابزارهای گچی',
  'roof-insulation': 'عایق‌کاری رطوبتی، قیرگونی و نصب استاندارد ایزوگام مرغوب با ضمانت کتبی ۱۰ ساله برای بام و استخر',
  'knauf': 'اجرای سقف کاذب کناف، باکس نور مخفی دکوراتیو، لاین نوری، تایل ۶۰×۶۰ و دیوار جداکننده ضد رطوبت',
  'wallpaper': 'نصب انواع کاغذ دیواری خارجی، پوستر سه‌بعدی و پارچه دیواری با چسب متیلان ضدکپک بدون درز',
  'parquet': 'زیرسازی با فوم سایلنت، نصب کلیکی لمینت و پارکت چوبی و قرنیز دور سالن با تضمین دوام',
  'stone-work': 'سنگ‌کاری پله، راهرو، لابی، کف سالن و صیقل‌کاری با دستگاه‌های کفسابی صنعتی',
  'facade-repair': 'پیچ و رولپلاک سنگ‌های نمای ساختمان با پیچ گالوانیزه، ترمیم سنگ‌های افتاده و درزبندی نما'
};

// Process HVAC in raw
const hvacRaw = raw.hvac;
hvacRaw.subServices.push(splitAcSub);

const processedCategories = {};

// 1. HVAC
processedCategories.hvac = {
  id: 'hvac',
  slug: 'hvac',
  persianSlug: 'سرمایش-و-گرمایش',
  aliases: ['hvac', 'سرمایش-گرمایش', 'cooling-heating', 'تهویه-مطبوع'],
  title: 'سرمایش و گرمایش ساختمان در تهران | نصب، تعمیر و سرویس تخصصی بهدون',
  titleEn: 'HVAC & Climate Systems in Tehran | Repair, Service & Installation | Behdoon',
  metaDesc: 'خدمات تخصصی سرمایش و گرمایش در کلیه مناطق تهران با ضمانت کتبی. تعمیر و سرویس پکیج، کولر آبی، رادیاتور شوفاژ، آبگرمکن و کولر گازی توسط تکنسین‌های مجرب بهدون با نرخ مصوب اتحادیه.',
  subtitle: 'آسایش دمایی و تهویه استاندارد ساختمان شما با تیم فنی بهدون؛ اعزام فوری تکنسین‌های متخصص در کمتر از ۴۵ دقیقه در سراسر تهران همراه با گارانتی معتبر قطعات و خدمات.',
  subtitleEn: 'Full climate control & heating services across all 22 districts of Tehran; emergency technician dispatch in under 45 minutes.',
  icon: `<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v18m-4-14h8m-8 10h8M6 8a6 6 0 1112 0 6 6 0 01-12 0z"/></svg>`,
  comprehensiveGuide: cleanHtml(hvacRaw.comprehensiveGuide),
  faq: hvacRaw.faq || [],
  subServices: hvacRaw.subServices.map(s => ({
    id: s.slug,
    name: s.name,
    nameEn: EN_NAMES[s.slug] || s.name,
    slug: s.slug,
    persianSlug: s.persianSlug || s.slug,
    aliases: [s.slug, s.persianSlug].filter(Boolean),
    basePrice: PRICE_MAP[s.slug] || 500000,
    shortDesc: SHORT_DESC_MAP[s.slug] || 'خدمات تخصصی با گارانتی کتبی ۳۰ روزه بهدون',
    shortDescEn: 'Professional service with 30-day warranty in Tehran',
    features: s.features || [
      'اعزام فوری تکنسین متخصص زیر ۴۵ دقیقه در تهران',
      'تجهیزات مدرن و عیب‌یابی دقیق در محل',
      'شفافیت هزینه بر اساس نرخنامه اتحادیه',
      'ضمانت کتبی کیفیت خدمات بهدون'
    ],
    detailHtml: cleanHtml(s.detail || s.detailHtml)
  }))
};

// 2. Plumbing
const plumbingRaw = raw.plumbing;
processedCategories.plumbing = {
  id: 'plumbing',
  slug: 'plumbing',
  persianSlug: 'لوله‌کشی-و-تأسیسات',
  aliases: ['plumbing', 'تاسیسات', 'لوله-کشی', 'pipes'],
  title: 'خدمات لوله‌کشی، نشت‌یابی و تأسیسات ساختمان در تهران | بهدون',
  titleEn: 'Plumbing, Leak Detection & Water Infrastructure in Tehran | Behdoon',
  metaDesc: 'خدمات تخصصی لوله‌کشی آب و فاضلاب، نشت‌یابی نقطه زن با دستگاه آکوستیک، رفع نم بدون تخریب، نصب شیرآلات، توالت فرنگی و منبع آب در تهران با ضمانت کتبی بهدون.',
  subtitle: 'تشخیص ترکیدگی لوله با پیشرفته‌ترین دستگاه‌های آلمانی، رفع نم و نشتی بدون تخریب و اجرای اصولی لوله‌کشی آب و فاضلاب با تکنسین‌های دارای گواهینامه معتبر.',
  subtitleEn: 'High-precision acoustic leak detection, no-demolition moisture repairs, sanitary fixture installations across Tehran.',
  icon: `<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>`,
  comprehensiveGuide: cleanHtml(plumbingRaw.comprehensiveGuide),
  faq: plumbingRaw.faq || [],
  subServices: plumbingRaw.subServices.map(s => ({
    id: s.slug,
    name: s.name,
    nameEn: EN_NAMES[s.slug] || s.name,
    slug: s.slug,
    persianSlug: s.persianSlug || s.slug,
    aliases: [s.slug, s.persianSlug, s.slug === 'leak-detection' ? 'unclogging' : null].filter(Boolean),
    basePrice: PRICE_MAP[s.slug] || 600000,
    shortDesc: SHORT_DESC_MAP[s.slug] || 'خدمات تخصصی تأسیسات و لوله‌کشی با ضمانت کتبی ۳۰ روزه',
    shortDescEn: 'Professional plumbing services with 30-day warranty in Tehran',
    features: [
      'نشت‌یابی نقطه زن با دستگاه آکوستیک و ترموویژن بدون تخریب',
      'استفاده از اتصالات پنج‌لایه و متریال استاندارد برندهای معتبر',
      'رفع نم و نشتی همراه با بازسازی کامل بنایی در صورت لزوم',
      'تست فشار مدار پس از اتمام کار و ارائه فاکتور رسمی'
    ],
    detailHtml: cleanHtml(s.detail || s.detailHtml)
  }))
};

// 3. Electrical
const electricalRaw = raw.electrical;
processedCategories.electrical = {
  id: 'electrical',
  slug: 'electrical',
  persianSlug: 'برقکاری-ساختمان',
  aliases: ['electrical', 'برق-ساختمان', 'الکتریکی', 'سیم-کشی'],
  title: 'خدمات برقکاری ساختمان در تهران | رفع اتصالی، سیم‌کشی و روشنایی فوری بهدون',
  titleEn: 'Building Electrical Services in Tehran | Short-Circuit Fix & Wiring | Behdoon',
  metaDesc: 'خدمات تخصصی برق‌کاری ساختمان، عیب‌یابی و رفع فوری اتصالی شبانه‌روزی، سیم‌کشی کلی و جزئی، نصب لوستر، کلید و پریز، آیفون و تابلو برق در کلیه مناطق تهران.',
  subtitle: 'روشنایی و ایمنی کامل مدار الکتریکی ساختمان شما با مهندسان و برقکاران مجرب بهدون؛ اعزام فوری کمتر از ۴۰ دقیقه برای موارد اتصالی اورژانسی.',
  subtitleEn: 'Urgent short-circuit troubleshooting, complete architectural rewiring, and lighting fixtures across Tehran.',
  icon: `<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
  comprehensiveGuide: cleanHtml(electricalRaw.comprehensiveGuide),
  faq: electricalRaw.faq || [],
  subServices: electricalRaw.subServices.map(s => ({
    id: s.slug,
    name: s.name,
    nameEn: EN_NAMES[s.slug] || s.name,
    slug: s.slug,
    persianSlug: s.persianSlug || s.slug,
    aliases: [s.slug, s.persianSlug].filter(Boolean),
    basePrice: PRICE_MAP[s.slug] || 550000,
    shortDesc: SHORT_DESC_MAP[s.slug] || 'خدمات تخصصی برق ساختمان با ضمانت کتبی ۳۰ روزه',
    shortDescEn: 'Professional electrical services with 30-day warranty in Tehran',
    features: [
      'اعزام فوری برقکار مجهز به تستر دیجیتال و ابزار عایق ۱۰۰۰ ولت',
      'تست مقاومت عایقی کابل‌ها و رفع خطر نشتی جریان برق',
      'استفاده از سیم‌ها و کابل‌های استاندارد مسی با روکش نسوز',
      'نصب تمیز و ایمن همراه با گارانتی اتصالات'
    ],
    detailHtml: cleanHtml(s.detail || s.detailHtml)
  }))
};

// 4. Renovation
const renovationRaw = raw.renovation;
processedCategories.renovation = {
  id: 'renovation',
  slug: 'renovation',
  persianSlug: 'تعمیرات-و-بازسازی',
  aliases: ['renovation', 'بازسازی', 'نقاشی-ساختمان', 'دکوراسیون'],
  title: 'تعمیرات و بازسازی ساختمان در تهران | نقاشی، کاشی، کناف و بنایی بهدون',
  titleEn: 'Home Renovation, Painting & Remodeling in Tehran | Behdoon',
  metaDesc: 'خدمات بازسازی صفر تا صد و خرده‌کاری ساختمان در تهران. نقاشی، کاشی و سرامیک اسلب، ایزوگام، کناف، کاغذ دیواری، پارکت و بنایی با بهترین استادکاران و قیمت مصوب.',
  subtitle: 'نوسازی و بازآفرینی فضای زندگی شما با اکیپ‌های حرفه‌ای بازسازی، مصالح مرغوب، قرارداد شفاف و نظارت مهندسی بر کلیه مراحل اجرا.',
  subtitleEn: 'Interior remodeling, painting, tiling, gypsum board ceilings, and waterproofing across Tehran.',
  icon: `<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"/></svg>`,
  comprehensiveGuide: cleanHtml(renovationRaw.comprehensiveGuide),
  faq: renovationRaw.faq || [],
  subServices: renovationRaw.subServices.map(s => ({
    id: s.slug,
    name: s.name,
    nameEn: EN_NAMES[s.slug] || s.name,
    slug: s.slug,
    persianSlug: s.persianSlug || s.slug,
    aliases: [s.slug, s.persianSlug, s.slug === 'roof-insulation' ? 'waterproofing' : null].filter(Boolean),
    basePrice: PRICE_MAP[s.slug] || 1000000,
    shortDesc: SHORT_DESC_MAP[s.slug] || 'خدمات تخصصی بازسازی ساختمان با ضمانت کتبی ۳۰ روزه',
    shortDescEn: 'Professional renovation services with 30-day warranty in Tehran',
    features: [
      'اجرا توسط استادکاران نام‌آشنا با سابقه درخشان در تهران',
      'تضمین کیفیت رنگ، چسب و مصالح مصرفی درجه یک',
      'تحویل تمیز و بدون گردوغبار طبق برنامه زمان‌بندی دقیق',
      'ضمانت کتبی ۱۰ ساله برای عایق‌کاری‌ها و ضمانت ۳۰ روزه خدمات'
    ],
    detailHtml: cleanHtml(s.detail || s.detailHtml)
  }))
};

// Add newer categories
processedCategories.locksmith = locksmithCategory;
processedCategories.carpentry = carpentryCategory;
processedCategories.doors_windows = doorsWindowsCategory;
processedCategories.cleaning = cleaningCategory;

// Output JSON file for easy reading
fs.writeFileSync('src/data/all_services_data.json', JSON.stringify(processedCategories, null, 2), 'utf8');

// Generate allServicesData.ts
const tsContent = `// ============================================================================
// مخزن جامع تمامی خدمات تخصصی و دسته‌بندی‌های بهدون (۵۳ خدمت در ۸ دسته)
// ============================================================================

export interface SubServiceDetail {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  persianSlug: string;
  aliases?: string[];
  basePrice: number;
  shortDesc: string;
  shortDescEn: string;
  features: string[];
  detailHtml: string;
}

export interface ServiceCategoryDetail {
  id: string;
  slug: string;
  persianSlug: string;
  aliases?: string[];
  title: string;
  titleEn: string;
  metaDesc: string;
  subtitle: string;
  subtitleEn: string;
  icon: string;
  subServices: SubServiceDetail[];
  comprehensiveGuide: string;
  faq: Array<{ q: string; a: string }>;
}

import allServicesJson from './all_services_data.json';

export const ALL_SERVICES_CATALOG: Record<string, ServiceCategoryDetail> = allServicesJson as unknown as Record<string, ServiceCategoryDetail>;

export function getAllCategories(): ServiceCategoryDetail[] {
  return Object.values(ALL_SERVICES_CATALOG);
}

export function findCategory(slugOrId: string): ServiceCategoryDetail | null {
  if (!slugOrId) return null;
  const decoded = decodeURIComponent(slugOrId).trim().toLowerCase();
  
  for (const cat of Object.values(ALL_SERVICES_CATALOG)) {
    if (
      cat.id.toLowerCase() === decoded ||
      cat.slug.toLowerCase() === decoded ||
      cat.persianSlug.toLowerCase() === decoded ||
      cat.aliases?.some(a => a.toLowerCase() === decoded)
    ) {
      return cat;
    }
  }
  return null;
}

export function findSubService(
  categorySlugOrId: string,
  subSlug: string
): { category: ServiceCategoryDetail; subService: SubServiceDetail } | null {
  const category = findCategory(categorySlugOrId);
  if (!category) return null;

  const decodedSub = decodeURIComponent(subSlug).trim().toLowerCase();
  for (const sub of category.subServices) {
    if (
      sub.id.toLowerCase() === decodedSub ||
      sub.slug.toLowerCase() === decodedSub ||
      sub.persianSlug.toLowerCase() === decodedSub ||
      sub.name.toLowerCase() === decodedSub ||
      sub.aliases?.some(a => a.toLowerCase() === decodedSub)
    ) {
      return { category, subService: sub };
    }
  }
  return null;
}

export function findSubServiceByAnySlug(
  subSlug: string
): { category: ServiceCategoryDetail; subService: SubServiceDetail } | null {
  if (!subSlug) return null;
  const decodedSub = decodeURIComponent(subSlug).trim().toLowerCase();

  for (const category of Object.values(ALL_SERVICES_CATALOG)) {
    for (const sub of category.subServices) {
      if (
        sub.id.toLowerCase() === decodedSub ||
        sub.slug.toLowerCase() === decodedSub ||
        sub.persianSlug.toLowerCase() === decodedSub ||
        sub.name.toLowerCase() === decodedSub ||
        sub.aliases?.some(a => a.toLowerCase() === decodedSub)
      ) {
        return { category, subService: sub };
      }
    }
  }
  return null;
}

export function getAllSubServices(): Array<{ category: ServiceCategoryDetail; subService: SubServiceDetail }> {
  const list: Array<{ category: ServiceCategoryDetail; subService: SubServiceDetail }> = [];
  for (const cat of Object.values(ALL_SERVICES_CATALOG)) {
    for (const sub of cat.subServices) {
      list.push({ category: cat, subService: sub });
    }
  }
  return list;
}
`;

fs.writeFileSync('src/data/allServicesData.ts', tsContent, 'utf8');

console.log('Generated src/data/all_services_data.json and src/data/allServicesData.ts successfully!');
console.log('Total Categories:', Object.keys(processedCategories).length);
let totalSub = 0;
for (const k in processedCategories) {
  totalSub += processedCategories[k].subServices.length;
  console.log(k, ':', processedCategories[k].subServices.length, 'subservices');
}
console.log('Total SubServices:', totalSub);

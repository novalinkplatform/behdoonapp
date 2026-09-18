import type { LegalPage } from '../utils/dynamicContent.ts';

export const DEFAULT_LEGAL_PAGES: Record<string, LegalPage> = {
  terms: {
    slug: 'terms',
    title: 'قوانین و مقررات رسمی سامانه خدمات ساختمان بهدون',
    titleEn: 'Terms and Conditions - Behdoon Home Services',
    description: 'قوانین و مقررات رسمی و شرایط ضمانت کتبی خدمات ساختمان بهدون',
    descriptionEn: 'Official terms of service and written warranty conditions for Behdoon services',
    intro: 'این توافق‌نامه به‌منظور شفاف‌سازی تعهدات متقابل مشتریان گرامی و تکنسین‌های اعزامی پلتفرم بهدون در کلیه مناطق ۲۲‌گانه شهر تهران تنظیم شده است.',
    introEn: 'This agreement governs the terms of service between customers and technicians of Behdoon across all 22 districts of Tehran.',
    showInHeader: true,
    showInFooter: true,
    sections: [
      {
        heading: 'ماده ۱: تعریف خدمات و تعهدات عمومی بهدون',
        headingEn: 'Article 1: Scope of Services & General Commitments',
        paragraphs: [
          'سامانه خدمات ساختمانی بهدون بستری هوشمند جهت اعزام فوری کارشناسان و تکنسین‌های احراز صلاحیت‌شده در حوزه‌های تأسیسات، سرمایش و گرمایش، لوله‌کشی، برقکاری، بازسازی، کلیدسازی، کابینت، پنجره و نظافت در شهر تهران است.',
          'کلیه تکنسین‌های همکار در بهدون دارای گواهی عدم سوءپیشینه، تاییدیه صلاحیت فنی از اتحادیه‌های صنفی مربوطه و کارت شناسایی معتبر عکس‌دار بهدون هستند.',
        ],
        paragraphsEn: [
          'Behdoon provides verified, certified technicians for plumbing, HVAC, electrical, remodeling, locksmith, carpentry, and cleaning services across Tehran.',
          'All technicians have undergone background checks and possess official technical certificates.',
        ],
      },
      {
        heading: 'ماده ۲: شفافیت تعرفه‌ها و صدور فاکتور رسمی تفکیکی',
        headingEn: 'Article 2: Transparent Pricing & Official Invoices',
        paragraphs: [
          'تمامی هزینه‌ها بر اساس نرخنامه مصوب اتحادیه‌های تأسیسات مکانیکی و الکتریکی تهران محاسبه شده و پیش از شروع به کار، برآورد هزینه به‌صورت پیش‌فاکتور شفاف به مشتری ارائه می‌گردد.',
          'پس از اتمام کار، فاکتور رسمی تفکیکی شامل اجرت پایه، هزینه قطعات مصرفی استاندارد و پوشش گارانتی کتبی صادر می‌گردد.',
        ],
        paragraphsEn: [
          'All pricing strictly adheres to union-approved rates with an itemized official invoice provided upon completion.',
        ],
        list: [
          'ارائه پیش‌فاکتور شفاف پیش از انجام خدمت',
          'ثبت و تفکیک اجرت دستمزد و هزینه مصالح خریداری‌شده',
          'ممنوعیت دریافت هرگونه انعام یا هزینه پیش‌بینی‌نشده خارج از فاکتور رسمی',
        ],
        listEn: [
          'Itemized estimate before work begins',
          'Breakdown of labor versus purchased materials',
          'Strict prohibition of unapproved extra fees or tipping',
        ],
      },
      {
        heading: 'ماده ۳: ضمانت کتبی ۳۰ روزه خدمات و جبران خسارت',
        headingEn: 'Article 3: 30-Day Written Warranty & Liability',
        paragraphs: [
          'تمامی خدمات اجرایی دارای ۳۰ روز گارانتی کتبی بی‌قیدوشرط بهدون هستند. در صورت بروز مجدد مشکل، اعزام مجدد کارشناس ارشد و رفع عیب کاملاً رایگان خواهد بود.',
          'پروژه‌ها تا سقف بیمه و تعهد انتخابی در مرحله ثبت درخواست تحت پوشش بیمه مسئولیت مدنی و تضمین کیفیت کار قرار دارند.',
        ],
        paragraphsEn: [
          'All completed works come with a 30-day unconditional written warranty with zero-cost re-inspection.',
        ],
      },
      {
        heading: 'ماده ۴: زمان‌بندی، لغو و تغییر نوبت اعزام',
        headingEn: 'Article 4: Scheduling & Cancellation Policy',
        paragraphs: [
          'در سرویس اعزام فوری، تکنسین در کمتر از ۴۵ دقیقه در محل حاضر می‌شود. برای اعزام‌های زمان‌بندی‌شده، امکان تغییر ساعت یا لغو سفارش تا ۱ ساعت قبل از بازه مقرر بدون جریمه امکان‌پذیر است.',
        ],
        paragraphsEn: [
          'Urgent dispatch arrives within 45 minutes. Scheduled bookings can be rescheduled up to 1 hour prior without penalty.',
        ],
      },
    ],
  },
  privacy: {
    slug: 'privacy',
    title: 'سیاست حفظ حریم خصوصی و امنیت اطلاعات کاربران',
    titleEn: 'Privacy Policy & Data Security',
    description: 'سیاست‌های جامع حفظ حریم خصوصی، عدم افشای اطلاعات و امنیت کاربران بهدون',
    descriptionEn: 'Comprehensive privacy policy, confidentiality, and data protection rules of Behdoon',
    intro: 'حفظ امنیت و محرمانگی شماره تماس، نشانی محل سکونت و سوابق سفارشات مشتریان گرامی از بالاترین اولویت‌های امنیتی سامانه بهدون است.',
    introEn: 'Protecting your personal data, phone numbers, and home addresses is a foundational commitment of Behdoon.',
    showInHeader: true,
    showInFooter: true,
    sections: [
      {
        heading: 'بخش ۱: اطلاعات جمع‌آوری‌شده و هدف آن',
        headingEn: 'Section 1: Information Collected and Purpose',
        paragraphs: [
          'سامانه بهدون تنها اطلاعات ضروری برای هماهنگی و اعزام تکنسین (شماره تلفن همراه، موقعیت مکانی بر روی نقشه تهران و نشانی دقیق واحد) را دریافت می‌نماید.',
          'این اطلاعات صرفاً برای اعزام نزدیک‌ترین تکنسین و صدور پیش‌فاکتور و کد رهگیری یکتا مورد استفاده قرار می‌گیرد.',
        ],
        paragraphsEn: [
          'We only collect necessary dispatch data: phone number, selected map coordinates, and property address.',
        ],
      },
      {
        heading: 'بخش ۲: عدم افشا و اشتراک اطلاعات با اشخاص ثالث',
        headingEn: 'Section 2: Non-Disclosure to Third Parties',
        paragraphs: [
          'بهدون متعهد می‌شود که هیچ‌گونه اطلاعات هویتی یا تماسی مشتریان را به شرکت‌های تبلیغاتی، بازاریابی یا نهادهای متفرقه منتقل نکرده و به فروش نرساند.',
          'تکنسین اعزامی تنها در بازه زمانی انجام کار به نشانی و شماره تماس دسترسی دارد و پس از تسویه سفارش، دسترسی وی خاتمه می‌یابد.',
        ],
        paragraphsEn: [
          'Customer details are never sold or shared with external advertising or marketing entities.',
        ],
      },
      {
        heading: 'بخش ۳: امنیت ذخیره‌سازی داده‌ها و پروتکل‌های رمزنگاری',
        headingEn: 'Section 3: Data Encryption & Infrastructure Security',
        paragraphs: [
          'کلیه ارتباطات وب‌سایت و اپلیکیشن از طریق پروتکل رمزنگاری پیشرفته SSL/TLS (HTTPS) محافظت شده و داده‌ها روی سرورهای امن ذخیره می‌گردند.',
        ],
        paragraphsEn: [
          'All communication is secured via end-to-end SSL/TLS encryption.',
        ],
      },
    ],
  },
  about: {
    slug: 'about',
    title: 'درباره مرکز خدمات ساختمانی بهدون در تهران',
    titleEn: 'About Behdoon Building Services Platform',
    description: 'آشنایی با تاریخچه، رسالت، مجوزها و شبکه تکنسین‌های مجرب بهدون در تهران',
    descriptionEn: 'About Behdoon, mission, licenses, and certified technician network in Tehran',
    intro: 'بهدون سامانه‌ای نوآورانه و پیشرو در ارائه خدمات مهندسی، تعمیراتی و نگهداری ساختمان در کلیه مناطق ۲۲‌گانه شهر تهران است.',
    introEn: 'Behdoon is Tehran’s premier on-demand platform for certified home maintenance and building engineering.',
    showInHeader: true,
    showInFooter: true,
    sections: [
      {
        heading: 'داستان بهدون: استانداردی نوین در خدمات فنی ساختمان',
        headingEn: 'Our Story: Setting New Standards in Building Repairs',
        paragraphs: [
          'پلتفرم بهدون با هدف رفع چالش‌های سنتی دسترسی به استادکاران کاربلد، شفافیت قیمت‌ها و تضمین کیفیت خدمات آغاز به کار نمود.',
          'ما معتقدیم هر شهروند تهرانی شایسته دریافت خدمات ساختمانی با نرخ مصوب اتحادیه، بدون اتلاف وقت و با ضمانت کتبی معتبر است.',
        ],
        paragraphsEn: [
          'Behdoon was founded to bring transparent pricing, swift dispatch, and certified craftsmanship to Tehran households.',
        ],
      },
      {
        heading: 'ارزش‌ها و تعهدات بنیادین بهدون',
        headingEn: 'Core Values & Commitments',
        paragraphs: [
          'تعهد به کیفیت کارهای انجام‌شده، مسئولیت‌پذیری در قبال قطعات مصرفی استاندارد و اعزام سریع زیر ۴۵ دقیقه از ارکان بنیادین فعالیت ماست.',
        ],
        paragraphsEn: [
          'Speed of response under 45 minutes, certified technicians, and full written warranty define our promise.',
        ],
        list: [
          'اعزام فوری در کمتر از ۴۵ دقیقه در تمامی ۲۲ منطقه تهران',
          'تکنسین‌های تایید صلاحیت‌شده با گواهی عدم سوءپیشینه',
          'گارانتی کتبی ۳۰ روزه بی‌قیدوشرط کیفیت خدمات',
          'شفافیت مالی و صدور پیش‌فاکتور و فاکتور تفکیکی اتحادیه',
          'پشتیبانی تلفنی و واتساپی شبانه‌روزی (۲۴/۷) با شماره ۰۹۳۳۳۲۵۶۸۸۵',
        ],
        listEn: [
          'Fast dispatch within 45 minutes across 22 Tehran districts',
          'Certified technicians with background checks',
          '30-day unconditional written quality guarantee',
          'Union-approved itemized invoicing',
          '24/7 dedicated customer support: 09333256885',
        ],
      },
    ],
  },
};

import type { LegalPage } from '../utils/dynamicContent.ts';

export const DEFAULT_LEGAL_PAGES: Record<string, LegalPage> = {
  terms: {
    slug: 'terms',
    title: 'قوانین، مقررات و ضمانت‌نامه رسمی سامانه خدمات ساختمان بهدون',
    titleEn: 'Terms and Conditions & Official Warranty - Behdoon Home Services',
    description: 'قوانین و مقررات رسمی، ضوابط ثبت سفارش، حقوق مشتری، تعهدات تکنسین‌ها و شرایط ضمانت کتبی بهدون منطبق با قوانین تجارت الکترونیکی و نظام صنفی کشور',
    descriptionEn: 'Official terms of service, customer rights, technician obligations, and written warranty terms of Behdoon under Iranian e-commerce and consumer laws',
    intro: 'این سند حقوقی بر اساس قانون تجارت الکترونیکی (مصوب ۱۳۸۲)، قانون حمایت از حقوق مصرف‌کنندگان (مصوب ۱۳۸۸)، قانون نظام صنفی کشور و آیین‌نامه‌های اجرایی کسب‌وکارهای مجازی تدوین شده و حاکم بر کلیه خدمات ارائه شده در پلتفرم بهدون در تمامی مناطق ۲۲‌گانه شهر تهران است. ثبت درخواست در سامانه به منزله مطالعه دقیق و پذیرش کامل مفاد این توافق‌نامه می‌باشد.',
    introEn: 'This legal agreement is drafted under the Iranian Electronic Commerce Law (2004), Consumer Protection Law (2010), and Trade Union Regulations. Submitting a service request on Behdoon signifies full acceptance of these terms.',
    showInHeader: true,
    showInFooter: true,
    sections: [
      {
        heading: 'ماده ۱: تعاریف و اصطلاحات حقوقی',
        headingEn: 'Article 1: Legal Definitions',
        paragraphs: [
          'سامانه بهدون: پلتفرم هوشمند نرم‌افزاری (وب‌سایت به نشانی behdoon.ir و اپلیکیشن اختصاصی) که بستر ارتباط، ارزیابی، اعزام فوری و تضمین خدمات استادکاران و تکنسین‌های فنی ساختمان را در شهر تهران فراهم می‌سازد.',
          'کاربر سفارش‌دهنده (کارفرما / مشتری): شخص حقیقی یا حقوقی که از طریق سامانه، نسبت به ثبت درخواست اعزام تکنسین، کارشناسی یا اجرای خدمات ساختمانی و تأسیساتی اقدام می‌نماید.',
          'متخصص / تکنسین همکار: استادکار یا تکنسین احراز صلاحیت‌شده فنی که پس از استعلام‌های مراجع قانونی، دریافت مدارک فنی‌وحرفه‌ای و تاییدیه اخلاق حرفه‌ای، جهت انجام خدمت به محل مشتری اعزام می‌شود.',
          'پیش‌فاکتور و فاکتور نهایی: صورتحساب رسمی الکترونیکی صادره از سوی بهدون با تفکیک دقیق دستمزد پایه، اجرت مراحل کار و هزینه قطعات استاندارد به همراه کد رهگیری هوشمند یکتا.',
          'کد رهگیری: شناسه رقمی منحصر‌به‌فردی که پس از ثبت درخواست تولید شده و مبنای پیگیری مالی، بازرسی کیفی و استناد به ضمانت‌نامه کتبی می‌باشد.',
        ],
        paragraphsEn: [
          'Behdoon Platform: The smart software platform (behdoon.ir) connecting clients with vetted home repair specialists across Tehran.',
          'Customer (Employer): Any individual or entity booking maintenance or engineering services through Behdoon.',
          'Certified Technician: Background-checked specialist holding verified technical certificates authorized to perform services on site.',
          'Official Invoice: Itemized electronic billing detailing labor and parts costs with an unalterable tracking number.',
          'Tracking Code: Unique identifier for tracking order progression, financial reconciliation, and warranty enforcement.',
        ],
      },
      {
        heading: 'ماده ۲: شرایط عمومی عضویت و احراز هویت کاربران',
        headingEn: 'Article 2: User Account & Authentication',
        paragraphs: [
          'کلیه کاربران جهت ثبت سفارش باید دارای اهلیت قانونی مدنی بوده و با شماره تلفن همراه معتبر متعلق به خود ثبت نام نمایند.',
          'کاربر متعهد است نشانی دقیق، مشخصات تماس و شرایط خاص محل خدمت (نظیر قطعی آب، دسترسی به کنتور، ارتفاع و محدودیت‌های تردد) را به صورت صحیح و شفاف ثبت نماید. مسئولیت هرگونه تاخیر یا عدم امکان اجرای خدمت ناشی از اطلاعات نادرست بر عهده ثبت‌کننده خواهد بود.',
        ],
        paragraphsEn: [
          'Users must possess full legal capacity and register with a valid mobile phone number registered under their national ID.',
          'Clients must provide accurate property addresses and disclose any structural or site access constraints.',
        ],
      },
      {
        heading: 'ماده ۳: مراحل ارزیابی فنی، کارشناسی در محل و صدور پیش‌فاکتور',
        headingEn: 'Article 3: Diagnostic Assessment & Binding Estimates',
        paragraphs: [
          'پس از ثبت درخواست، تکنسین مربوطه در زمان توافق‌شده در محل حاضر می‌گردد. تکنسین موظف است قبل از هرگونه بازگشایی یا اقدام اجرایی، عیب‌یابی دقیق انجام داده و برآورد کامل هزینه (اجرت و قطعات احتمالی) را به صورت پیش‌فاکتور شفاف به تایید کتبی یا شفاهی مشتری برساند.',
          'شروع عملیات تعمیراتی بدون اعلام هزینه و بدون اخذ تاییدیه از کارفرما اکیداً ممنوع بوده و هرگونه ادعای مالی خارج از پیش‌فاکتور تاییدشده فاقد اعتبار است.',
        ],
        paragraphsEn: [
          'Upon arrival, the technician conducts a thorough diagnostic and provides an itemized estimate before commencing any work.',
          'Starting repairs without the customer explicit consent regarding projected costs is strictly prohibited.',
        ],
        list: [
          'اعلام تعرفه شفاف و مطابقت کامل با نرخ‌نامه‌های مصوب اتحادیه‌های تأسیسات و ساختمان تهران',
          'الزام به اخذ تاییدیه مشتری پیش از آغاز هرگونه تغییرات هزینه‌بر',
          'حق انصراف مشتری در صورت عدم توافق بر سر برآورد قیمت پیش از شروع عملیات اجرایی',
        ],
        listEn: [
          'Full adherence to union-approved price guides for Tehran building mechanics and electrical trades',
          'Mandatory client consent before initiating chargeable tasks',
          'Right to cancel without execution charges if initial estimate is not accepted before work begins',
        ],
      },
      {
        heading: 'ماده ۴: تعهدات کاربر و رعایت ضوابط ایمنی در محل',
        headingEn: 'Article 4: Customer Obligations & Site Safety',
        paragraphs: [
          'حضور شخص سفارش‌دهنده یا نماینده قانونی و مطلع وی در محل پروژه از زمان ورود تکنسین تا تحویل نهایی و تسویه کار الزامی است.',
          'کارفرما موظف است کلیه اسناد مهم، مسکوکات، طلا و اشیاء قیمتی را پیش از حضور تکنسین از محل کار جمع‌آوری نموده و در محلی امن نگهداری کند.',
          'کارفرما متعهد است هرگونه نقص یا ریسک پنهان در تأسیسات ساختمانی (نظیر فرسودگی سیم‌کشی، خطرات نشت گاز یا انشعابات مخفی آب) را به تکنسین گوشزد نماید.',
        ],
        paragraphsEn: [
          'The customer or an authorized adult representative must be present on site throughout the service.',
          'Valuable items, jewelry, and documents must be securely stowed prior to technician entry.',
          'The client is obligated to warn the technician of known hidden infrastructural hazards such as degraded wiring or gas leaks.',
        ],
      },
      {
        heading: 'ماده ۵: استانداردهای احراز صلاحیت و تعهدات تکنسین‌های بهدون',
        headingEn: 'Article 5: Technician Vetting, Safety & Professional Standards',
        paragraphs: [
          'کلیه متخصصین شاغل در ناوگان بهدون دارای گواهی رسمی عدم سوءپیشینه کیفری، گواهی عدم اعتیاد و کارت بهداشت و مهارت معتبر از سازمان آموزش فنی و حرفه‌ای کشور می‌باشند.',
          'تکنسین‌ها موظف به رعایت کامل اصول ایمنی کارگاهی (HSE)، استفاده از تجهیزات حفاظت فردی، همراه داشتن ابزارآلات حرفه‌ای و استاندارد و برخورد با بالاترین استانداردهای اخلاق حرفه‌ای هستند.',
          'در صورت نیاز به خرید قطعات یا مصالح جدید، تکنسین موظف است قطعات اصلی و استاندارد دارای گارانتی معتبر تهیه نموده و فاکتور خرید مهرشده فروشگاه را ضمیمه فاکتور بهدون نماید.',
        ],
        paragraphsEn: [
          'All Behdoon specialists possess official police clearances, clean drug tests, and vocational credentials.',
          'Specialists must strictly follow occupational health and safety (HSE) standards and possess standard professional toolkits.',
          'Any spare parts replaced must be OEM-standard with original store purchase receipts presented to the customer.',
        ],
        list: [
          'ارائه کارت شناسایی عکس‌دار رسمی سامانه بهدون در بدو ورود به ساختمان',
          'رعایت نظافت کامل محل کار پس از پایان عملیات فنی و ساختمانی',
          'تحویل کلیه داغی‌ها و قطعات تعویض‌شده مستعمل به کارفرما',
        ],
        listEn: [
          'Presenting official photo ID badge of Behdoon upon entry',
          'Cleaning and restoring the work area upon project completion',
          'Handing over all replaced old components and materials to the property owner',
        ],
      },
      {
        heading: 'ماده ۶: شفافیت مالی، نحوه پرداخت و ممنوعیت انعام',
        headingEn: 'Article 6: Financial Transparency, Payment & Zero-Tip Policy',
        paragraphs: [
          'پرداخت هزینه خدمات منحصراً از طریق درگاه‌های امن الکترونیکی بهدون، دستگاه پوز متصل به سامانه یا واریز به حساب‌های بانکی رسمی اعلام‌شده بهدون صورت می‌پذیرد.',
          'دریافت هرگونه انعام، پاداش نقدی، دستمزد مازاد بر فاکتور یا هرگونه پرداخت خارج از ارقام مندرج در فاکتور رسمی بهدون اکیداً ممنوع بوده و تخلف انضباطی محسوب می‌شود.',
          'پرداخت مستقیم به تکنسین بدون ثبت در فاکتور رسمی بهدون، موجب ابطال ضمانت‌نامه کتبی خدمات و سلب کلیه مسئولیت‌های پلتفرم خواهد شد.',
        ],
        paragraphsEn: [
          'All payments must be processed via Behdoon secure online gateways or verified official merchant accounts.',
          'Tipping, cash gifts, and unbilled side payments to technicians are strictly prohibited.',
          'Making unauthorized off-invoice payments automatically voids the written warranty and indemnifies Behdoon.',
        ],
      },
      {
        heading: 'ماده ۷: ضمانت کتبی ۳۰ روزه کیفیت خدمات و پوشش بیمه مسئولیت',
        headingEn: 'Article 7: 30-Day Written Warranty & Liability Insurance',
        paragraphs: [
          'کلیه خدمات اجرایی ثبت‌شده در سامانه بهدون مشمول ضمانت کتبی ۳۰ روزه بی‌قیدوشرط کیفیت کار هستند. در صورت بروز هرگونه نقص مرتبط با خدمات ارائه‌شده ظرف ۳۰ روز از تاریخ انجام کار، تکنسین ارشد بازرسی بدون دریافت هرگونه هزینه اعزام شده و ایراد را رفع می‌نماید.',
          'کلیه پروژه‌های تحت پوشش بهدون دارای بیمه مسئولیت مدنی معتبر بوده و در صورت اثبات هرگونه قصور فنی یا آسیب تصادفی به تأسیسات و اموال ساختمان، خسارت وارده طبق نظریه کارشناسی واحد رسیدگی به شکایات و بیمه‌گر جبران می‌گردد.',
        ],
        paragraphsEn: [
          'All completed jobs carry an unconditional 30-day quality warranty with zero-cost re-inspection and repair.',
          'Services are protected by third-party liability insurance covering unintentional structural damages arising from certified work.',
        ],
        list: [
          'اعزام کارشناس نظارت کیفی بدون دریافت هزینه ایاب‌وذهاب در دوره ضمانت',
          'استثنائات گارانتی: دستکاری قطعات توسط افراد متفرقه، نوسانات شدید برق شبکه، حوادث غیرمترقبه و فورس‌ماژور',
          'ارائه برگ ضمانت کتبی دیجیتال با قابلیت استعلام آنی از سامانه',
        ],
        listEn: [
          'Free re-dispatch of supervisory inspectors during the 30-day warranty window',
          'Warranty exclusions: unauthorized tampering by third parties, external grid power surges, or natural force majeure events',
          'Digital warranty certification verifiable online at any time',
        ],
      },
      {
        heading: 'ماده ۸: ضوابط لغو سفارش، تغییر زمان‌بندی و هزینه کارشناسی',
        headingEn: 'Article 8: Cancellation, Rescheduling & Diagnostic Fees',
        paragraphs: [
          'کاربر می‌تواند تا ۱ ساعت پیش از بازه زمانی مقرر اعزام، نسبت به لغو یا تغییر ساعت سفارش بدون پرداخت هیچ‌گونه جریمه اقدام نماید.',
          'در صورتی که تکنسین در محل حاضر شده و کارشناسی و عیب‌یابی را انجام دهد، اما کارفرما به دلایلی غیر از عدم انطباق قیمت با تعرفه رسمی از انجام کار منصرف شود، صرفاً هزینه ایاب‌وذهاب و کارشناسی مصوب اتحادیه به تکنسین تعلق خواهد گرفت.',
        ],
        paragraphsEn: [
          'Bookings may be rescheduled or cancelled free of charge up to 1 hour prior to the scheduled arrival window.',
          'If the specialist arrives on site and completes diagnostics but the client declines work without reasonable cause, union-approved diagnostic fees apply.',
        ],
      },
      {
        heading: 'ماده ۹: ممنوعیت توافق مستقیم خارج از سامانه بهدون',
        headingEn: 'Article 9: Prohibition of Direct Side-Deals Outside Platform',
        paragraphs: [
          'هرگونه توافق مستقیم، دریافت شماره تماس شخصی و سفارش‌دهی خارج از بستر سامانه هوشمند بهدون به جهت تضمین امنیت شهروندان و حفظ مسئولیت‌های حرفه‌ای اکیداً ممنوع است.',
          'در صورت توافق خصوصی میان مشتری و تکنسین خارج از سامانه، بهدون هیچ‌گونه تعهدی در قبال کیفیت، قیمت، حوادث، سرقت، خسارات مالی و جانی و ضمانت کار نخواهد داشت و حساب کاربری متخلفین مسدود خواهد شد.',
        ],
        paragraphsEn: [
          'Soliciting direct off-platform agreements with dispatched technicians is strictly forbidden.',
          'Off-platform deals immediately void all Behdoon safety guarantees, warranties, and insurance coverage.',
        ],
      },
      {
        heading: 'ماده ۱۰: سازوکار رسیدگی به شکایات و مرجع حل اختلاف',
        headingEn: 'Article 10: Complaints Resolution & Legal Jurisdiction',
        paragraphs: [
          'سامانه بهدون دارای واحد اختصاصی رسیدگی به شکایات و داوری فنی است. کاربران گرامی می‌توانند در صورت هرگونه نارضایتی، ظرف ۲۴ ساعت از طریق شماره پشتیبانی ۰۹۳۳۳۲۵۶۸۸۵ یا پنل ثبت شکایت موضوع را گزارش نمایند.',
          'تیم بازرسی فنی بهدون موظف است ظرف حداکثر ۴۸ ساعت کاری به موضوع رسیدگی و اقدام لازم جهت جلب رضایت کارفرما را به عمل آورد. در صورت عدم حصول توافق، مراجع حل اختلاف اتحادیه مربوطه و مراجع صالحه قضایی شهر تهران صالح به رسیدگی خواهند بود.',
        ],
        paragraphsEn: [
          'Behdoon operates a dedicated dispute mediation unit with 24/7 hotline 09333256885 and guaranteed 48-hour resolution.',
          'Unresolved claims are subject to Tehran competent trade union councils and judicial authorities.',
        ],
      },
    ],
  },
  privacy: {
    slug: 'privacy',
    title: 'سیاست حفظ حریم خصوصی، محرمانگی و امنیت اطلاعات کاربران',
    titleEn: 'Privacy Policy, Confidentiality & Data Security',
    description: 'شرح جامع سیاست‌های بهدون در راستای حفظ حریم شخصی، عدم افشای اطلاعات، امنیت داده‌ها و استانداردهای رمزنگاری منطبق با قانون جرایم رایانه‌ای',
    descriptionEn: 'Comprehensive policy on personal privacy, data encryption, confidentiality, and data protection under Iranian cyber laws',
    intro: 'سامانه خدمات ساختمان بهدون خود را به بالاترین استانداردهای امنیت داده و صیانت از حریم خصوصی شهروندان متعهد می‌داند. این منشور بر مبنای قانون جرایم رایانه‌ای (مصوب ۱۳۸۸)، قانون تجارت الکترونیکی و دستورالعمل‌های مرکز توسعه تجارت الکترونیکی تدوین گردیده و شفاف‌کننده کلیه فرآیندهای گردآوری، پردازش و حفاظت از داده‌ها در بهدون است.',
    introEn: 'Behdoon is committed to the highest data protection protocols under the Iranian Cyber Crimes Law (2009) and Electronic Commerce Law.',
    showInHeader: true,
    showInFooter: true,
    sections: [
      {
        heading: 'بخش ۱: اطلاعات جمع‌آوری‌شده و مبنای قانونی پردازش',
        headingEn: 'Section 1: Information Collected and Legal Basis',
        paragraphs: [
          'اطلاعات هویتی و تماسی: شامل نام و نام خانوادگی و شماره تلفن همراه معتبر جهت ایجاد حساب کاربری، هماهنگی اعزام تکنسین و ارسال اعلان‌های پیامکی وضعیت سفارش.',
          'داده‌های موقعیت مکانی و نشانی: شامل مختصات جغرافیایی انتخابی روی نقشه تهران و نشانی دقیق محل پروژه جهت مسیریابی و ارجاع سفارش به نزدیک‌ترین تکنسین واجد صلاحیت در همان منطقه.',
          'سوابق مالی و تراکنش‌ها: اطلاعات فاکتورها، مبالغ پرداختی و رسیدهای بانکی جهت تسویه قانونی و صدور اسناد حسابداری معتبر.',
          'داده‌های فنی و گزارش‌های دسترسی: شامل آدرس IP، نوع دستگاه، نگارش مرورگر و کوکی‌های عملکردی جهت ارتقای امنیت سامانه، شناسایی حملات سایبری و پیشگیری از رفتارهای سوءاستفاده‌گرایانه.',
        ],
        paragraphsEn: [
          'Personal details: Full name and registered mobile phone for authentication, dispatch coordination, and automated SMS alerts.',
          'Location and address: Geographic coordinates on Tehran map and building address to dispatch the closest qualified specialist.',
          'Financial records: Transaction timestamps and billing amounts for accounting and legal compliance.',
          'Technical diagnostics: IP address, device fingerprints, and operational cookies to ensure platform cybersecurity.',
        ],
      },
      {
        heading: 'بخش ۲: اهداف استفاده از اطلاعات کاربران',
        headingEn: 'Section 2: Purpose of Data Utilization',
        paragraphs: [
          'اطلاعات گردآوری‌شده منحصراً برای اهداف زیر پردازش و بهره‌برداری می‌گردند:',
        ],
        paragraphsEn: [
          'All collected data is processed strictly for the following operational objectives:',
        ],
        list: [
          'تخصیص هوشمند سفارش به نزدیک‌ترین استادکار و اعزام در کمتر از سریع‌ترین زمان',
          'صدور فاکتور رسمی تفکیکی، ثبت کد رهگیری یکتا و اعمال پوشش ضمانت‌نامه ۳۰ روزه',
          'ارسال پیامک‌های لحظه‌ای وضعیت سفارش (اعزام، رسیدن تکنسین، اتمام کار، فاکتور)',
          'پایش کیفیت خدمات و نظرسنجی رضایت‌سنجی پس از تحویل هر پروژه',
          'پاسخگویی به درخواست‌های پشتیبانی و پیگیری شکایات احتمالی از طریق سامانه',
        ],
        listEn: [
          'Smart matching with the nearest verified technician under 45 minutes',
          'Generating itemized invoices, unique tracking codes, and 30-day warranty dossiers',
          'Real-time automated SMS status updates throughout service lifecycle',
          'Quality control evaluations and post-service customer satisfaction surveys',
          '24/7 client support assistance and dispute mediation',
        ],
      },
      {
        heading: 'بخش ۳: اصل محرمانگی و عدم اشتراک‌گذاری داده‌ها با اشخاص ثالث',
        headingEn: 'Section 3: Confidentiality & Non-Disclosure Guarantee',
        paragraphs: [
          'بهدون با قاطعیت متعهد می‌گردد که اطلاعات شخصی، شماره‌های تماس و نشانی‌های سکونت کاربران را تحت هیچ شرایطی به شرکت‌های تبلیغاتی، بازاریابان یا اشخاص ثالث واگذار نکرده و به فروش نرساند.',
          'اشتراک‌گذاری اطلاعات تنها در حد نیاز عملیاتی و صرفاً با تکنسین منتخب و در بازه زمانی انجام کار صورت می‌پذیرد. دسترسی تکنسین به نشانی و اطلاعات تماس پس از تسویه سفارش به طور خودکار مسدود می‌گردد.',
          'افشای هرگونه اطلاعات تنها در صورت ارائه دستور صریح قضایی از مراجع صالح قانونی جمهوری اسلامی ایران و مطابق ضوابط آمره صورت خواهد گرفت.',
        ],
        paragraphsEn: [
          'Behdoon guarantees that customer personal data, phone numbers, and addresses will NEVER be leased, sold, or shared for third-party marketing.',
          'Technicians are granted temporary address access strictly during service execution, revoked automatically upon project completion.',
          'Data disclosure occurs only when compelled by official judicial warrants from competent Iranian courts.',
        ],
      },
      {
        heading: 'بخش ۴: امنیت ذخیره‌سازی، رمزنگاری و زیرساخت فنی',
        headingEn: 'Section 4: Data Encryption & Infrastructure Security',
        paragraphs: [
          'کلیه ارتباطات کاربران با سامانه بهدون تحت پروتکل امن و رمزنگاری‌شده SSL/TLS (HTTPS) با کلیدهای قدرتمند ۲۵۶ بیتی تبادل می‌شود تا از استراق‌سمع داده‌ها جلوگیری به عمل آید.',
          'اطلاعات حساس کاربران در پایگاه داده‌های ابری محافظت‌شده، با فایروال‌های پیشرفته چندلایه و سیاست‌های دسترسی فوق‌العاده محدود ذخیره شده و به طور منظم پشتیبان‌گیری رمزنگاری‌شده انجام می‌گیرد.',
        ],
        paragraphsEn: [
          'All web and mobile app interactions are encrypted using high-grade 256-bit SSL/TLS protocols.',
          'Customer databases reside in fortified cloud infrastructures with multi-tier firewalls and automated encrypted backups.',
        ],
      },
      {
        heading: 'بخش ۵: حقوق قانونی کاربران در خصوص داده‌های خود',
        headingEn: 'Section 5: User Rights & Data Privacy Controls',
        paragraphs: [
          'کاربران گرامی در هر زمان دارای حقوق مصرح قانونی زیر در سامانه بهدون هستند:',
        ],
        paragraphsEn: [
          'Users hold the following guaranteed rights regarding their stored data:',
        ],
        list: [
          'حق دسترسی کامل و مشاهده کلیه سوابق درخواست‌ها، فاکتورها و اطلاعات ثبت‌شده در پنل کاربری',
          'حق ویرایش و به‌روزرسانی اطلاعات تماس و آدرس‌های ذخیره‌شده',
          'حق درخواست غیرفعال‌سازی یا حذف حساب کاربری و سوابق غیرمالی با تماس با پشتیبانی',
          'حق عدم دریافت پیامک‌های اطلاع‌رسانی غیرضروری با ارسال عدد لغو به سرشماره پیامکی',
        ],
        listEn: [
          'Right to access all order histories, itemized invoices, and profile records',
          'Right to update personal contact details and saved addresses',
          'Right to request account deactivation or deletion of non-accounting data',
          'Right to opt out of promotional SMS broadcasts at any time',
        ],
      },
      {
        heading: 'بخش ۶: خط‌مشی کوکی‌ها و لاگ‌های سامانه',
        headingEn: 'Section 6: Cookie Policy & Session Logs',
        paragraphs: [
          'سامانه بهدون از کوکی‌های عملکردی و امنیتی جهت حفظ نشست ورود، شخصی‌سازی زبان، بهینه‌سازی سرعت بارگذاری و حفظ امنیت احراز هویت استفاده می‌کند.',
          'کاربران می‌توانند تنظیمات کوکی‌ها را در مرورگر خود مدیریت نمایند، هرچند غیرفعال کردن کامل برخی کوکی‌ها ممکن است عملکرد بخش‌هایی از سامانه را محدود سازد.',
        ],
        paragraphsEn: [
          'Behdoon uses essential and security cookies to maintain active sessions, language choices, and fraud prevention.',
          'Users may adjust browser cookie settings at will, though disabling core cookies may impact specific platform features.',
        ],
      },
      {
        heading: 'بخش ۷: ارتباط با واحد امنیت و حفاظت از حریم خصوصی',
        headingEn: 'Section 7: Contacting the Privacy & Security Officer',
        paragraphs: [
          'در صورت داشتن هرگونه سوال، ابهام، پیشنهاد یا گزارش نقض احتمالی حریم خصوصی، می‌توانید به صورت ۲۴ ساعته با واحد امنیت داده و پشتیبانی حقوقی بهدون در ارتباط باشید:',
        ],
        paragraphsEn: [
          'For inquiries, concerns, or privacy reports, contact Behdoon Security Officer 24/7:',
        ],
        list: [
          'شماره تماس پشتیبانی و حریم خصوصی: ۰۹۳۳۳۲۵۶۸۸۵',
          'پست الکترونیکی رسمی: privacy@behdoon.ir',
          'نشانی: تهران، دفتر مرکزی سامانه خدمات ساختمان بهدون',
        ],
        listEn: [
          'Dedicated Privacy Hotline: 09333256885',
          'Official Email: privacy@behdoon.ir',
          'Address: Behdoon Central Building Services Headquarters, Tehran',
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
          'ما معتقدیم هر شهروند تهرانی شایسته دریافت خدمات ساختمانی با قیمت منصفانه، بدون اتلاف وقت و با ضمانت کتبی معتبر است.',
        ],
        paragraphsEn: [
          'Behdoon was founded to bring transparent pricing, swift dispatch, and certified craftsmanship to Tehran households.',
        ],
      },
      {
        heading: 'ارزش‌ها و تعهدات بنیادین بهدون',
        headingEn: 'Core Values & Commitments',
        paragraphs: [
          'تعهد به کیفیت کارهای انجام‌شده، مسئولیت‌پذیری در قبال قطعات مصرفی استاندارد و اعزام سریع زیر سریع‌ترین زمان از ارکان بنیادین فعالیت ماست.',
        ],
        paragraphsEn: [
          'Speed of response under 45 minutes, certified technicians, and full written warranty define our promise.',
        ],
        list: [
          'اعزام فوری در کمتر از سریع‌ترین زمان در تمامی ۲۲ منطقه تهران',
          'تکنسین‌های تایید صلاحیت‌شده با گواهی عدم سوءپیشینه',
          'گارانتی کتبی ۳۰ روزه بی‌قیدوشرط کیفیت خدمات',
          'شفافیت مالی و صدور پیش‌فاکتور و فاکتور تفکیکی',
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

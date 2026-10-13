import { phoneNumberDisplay, resolveContact } from '../data/contact.ts';
import { icons } from './icons.ts';
import { pick } from '../i18n/lang.ts';
import { toPersianDigits } from '../utils/jalali.ts';
import type { SiteSettings, SocialLinkSetting } from '../utils/dynamicContent.ts';

export function buildFooterLinks(settings?: SiteSettings): Array<{ href: string; label: string }> {
  const links: Array<{ href: string; label: string }> = [];
  links.push({ href: '/', label: pick('خانه', 'Home') });
  links.push({ href: '/services', label: pick('خدمات تخصصی ساختمان', 'Specialized Services') });
  links.push({ href: '/orders', label: pick('پیگیری درخواست‌ها', 'Track Orders') });
  links.push({ href: '/magazine', label: pick('مجله دانستنی‌های ساختمان', 'Building Magazine') });
  links.push({ href: '/careers', label: pick('جذب متخصص و استخدام', 'Careers') });

  const legal = settings?.legal_pages;
  const aboutShow = legal?.about ? legal.about.showInFooter !== false : true;
  if (aboutShow) {
    links.push({
      href: '/about',
      label: pick(legal?.about?.title, legal?.about?.titleEn) || pick('درباره ما', 'About Us'),
    });
  }

  const termsShow = legal?.terms ? legal.terms.showInFooter !== false : true;
  if (termsShow) {
    links.push({
      href: '/terms',
      label: pick(legal?.terms?.title, legal?.terms?.titleEn) || pick('قوانین و ضمانت خدمات', 'Terms & Warranty'),
    });
  }

  const privacyShow = legal?.privacy ? legal.privacy.showInFooter !== false : true;
  if (privacyShow) {
    links.push({
      href: '/privacy',
      label: pick(legal?.privacy?.title, legal?.privacy?.titleEn) || pick('حریم خصوصی', 'Privacy Policy'),
    });
  }

  if (Array.isArray(settings?.nav_pages)) {
    for (const p of settings.nav_pages) {
      if (p.showInFooter) {
        links.push({
          href: `/page/${encodeURIComponent(p.slug)}`,
          label: pick(p.title, p.titleEn) || p.title,
        });
      }
    }
  }

  return links;
}

const FALLBACK_SITE_NAME = { fa: 'بهدون', en: 'Behdoon' };

const SOCIAL_ICON_MAP: Record<string, keyof typeof icons> = {
  telegram: 'telegramFilled',
  whatsapp: 'whatsappFilled',
  instagram: 'instagramFilled',
  bale: 'baleFilled',
  eitaa: 'eitaaFilled',
  rubika: 'rubikaFilled',
  aparat: 'aparatFilled',
  linkedin: 'linkedinFilled',
  youtube: 'youtubeFilled',
  twitterX: 'twitterXFilled',
  facebook: 'facebookFilled',
  mail: 'mailFilled',
  globe: 'globeFilled',
};

const DEFAULT_SOCIALS: SocialLinkSetting[] = [
  { id: 'whatsapp', platform: 'whatsapp', url: 'https://wa.me/989333256885', label: 'واتساپ پشتیبانی بهدون' },
  { id: 'telegram', platform: 'telegram', url: 'https://t.me/behdoon_ir', label: 'کانال تلگرام بهدون' },
  { id: 'instagram', platform: 'instagram', url: 'https://instagram.com/behdoon.ir', label: 'اینستاگرام بهدون' },
  { id: 'linkedin', platform: 'linkedin', url: 'https://linkedin.com/company/behdoon', label: 'لینکدین بهدون' },
];

function renderSocialLinks(links: SocialLinkSetting[], colorStyle: string): string {
  const activeLinks = links.length ? links : DEFAULT_SOCIALS;
  return `
    <div class="footer-social" ${colorStyle}>
      ${activeLinks
        .map((link) => {
          const icon = link.customIconUrl
            ? `<img src="${link.customIconUrl}" alt="${link.label}" style="width:20px;height:20px;object-fit:contain;border-radius:4px;" />`
            : icons[SOCIAL_ICON_MAP[link.platform] ?? 'globe'];
          const isMail = link.platform === 'mail';
          return `
            <a href="${link.url}" ${isMail ? '' : 'target="_blank" rel="noopener"'} aria-label="${link.label}" title="${link.label}">
              <span class="icon">${icon}</span>
            </a>
          `;
        })
        .join('')}
    </div>
  `;
}

function renderAppLinks(appLinks?: SiteSettings['app_links']): string {
  const defaultBadges = [
    { label: 'کافه‌بازار', platform: 'bazaar', sub: 'دانلود مستقیم', url: 'https://cafebazaar.ir' },
    { label: 'مایکت', platform: 'custom', sub: 'نسخه اندروید', url: 'https://myket.ir' },
    { label: 'نسخه وب PWA', platform: 'custom', sub: 'بدون نیاز به فیلترشکن', url: '/#request' },
  ];
  const badges = appLinks?.enabled && appLinks.links.length
    ? appLinks.links.map((l) => ({
        label: l.label || l.platform,
        platform: l.platform,
        sub: pick('دانلود مستقیم', 'Direct Download'),
        url: l.url,
      }))
    : defaultBadges;

  return `
    <div class="footer-app-badges">
      ${badges
        .map(
          (b) => `
        <a class="footer-app-chip" href="${b.url}" target="${b.url.startsWith('http') ? '_blank' : '_self'}" rel="noopener">
          <span class="icon app-chip-icon">${icons.download}</span>
          <div class="app-chip-text">
            <span class="app-chip-sub">${b.sub}</span>
            <span class="app-chip-title">${b.label}</span>
          </div>
        </a>
      `,
        )
        .join('')}
    </div>
  `;
}

const DEFAULT_BEHDOON_SEO_PARAGRAPHS = [
  {
    fa: 'سامانه خدمات هوشمند ساختمان بهدون (Behdoon) جامع‌ترین و مطمئن‌ترین پلتفرم آنلاین ارائه خدمات فنی، تأسیساتی و ساختمانی در کلیه مناطق ۲۲ گانه شهر تهران و استان البرز است. رسالت اصلی بهدون رفع دغدغه‌های همیشگی شهروندان در زمینه یافتن استادکاران قابل اعتماد، تعیین نرخ‌های شفاف بر مبنای مصوبات منصفانه اتحادیه، اعزام فوق‌سریع در زمان‌های اضطراری (کمتر از ۴۵ دقیقه) و ارائه ضمانت کتبی ۳۰ روزه برای کلیه سفارش‌های انجام‌شده می‌باشد.',
    en: 'Behdoon Smart Building Services Platform is Tehran and Karaj leading online destination for specialized building maintenance, HVAC servicing, sanitary plumbing, professional electrical contracting, and turn-key interior renovation. Backed by certified technicians and written warranties.',
  },
  {
    fa: 'تخصص‌های مکانیکی و هیدرولیکی بهدون شامل تعمیر و سرویس دوره‌ای پکیج دیواری و زمینی تمامی برندها (ایران رادیاتور، بوتان، تاچی و...)، سرویس و راه‌اندازی کولر آبی، نصب و شارژ گاز کولر گازی و داکت اسپلیت، لوله‌کشی سرد و گرم پنج‌لایه، تشخیص ترکیدگی و نشت‌یابی لوله با پیشرفته‌ترین دستگاه‌های آکوستیک و تصویری بدون تخریب، رفع نم و رطوبت و لوله‌بازکنی شبانه‌روزی با فنر فولادی می‌باشد.',
    en: 'Behdoon mechanical services encompass water heater & boiler repair, evaporative and AC split servicing, sanitary multi-layer piping, acoustic water leak detection without demolition, and 24/7 drain unblocking.',
  },
  {
    fa: 'در حوزه برق و ابنیه، خدمات بهدون دربرگیرنده رفع اتصالی فوری شبانه‌روزی، تعویض فیوز و سیم‌کشی توکار، نصب لوستر و هالوژن، کابل‌کشی تابلو برق، نقاشی ساختمان با رنگ‌های روغنی و اکریلیک درجه یک، سرامیک‌کاری و بنایی، ایزوگام و عایق‌کاری رطوبتی پشت‌بام، کلیدسازی فوری شبانه‌روزی، تعمیر کابینت و کمد دیواری و نظافت تخصصی مشاعات و راه‌پله است.',
    en: 'Our electrical and structural solutions include emergency short-circuit resolution, indoor rewiring, chandelier mounting, interior painting, masonry, waterproofing, 24/7 locksmith services, and facility maintenance.',
  },
  {
    fa: 'تکنسین‌ها و استادکاران فعال در شبکه بهدون پس از طی مراحل گزینش چندمرحله‌ای شامل آزمون مهارت فنی‌وحرفه‌ای، سنجش اخلاق حرفه‌ای و استعلام سوءپیشینه کیفری تایید می‌شوند. فرآیند ثبت درخواست کاملاً آنلاین و کمتر از ۲ دقیقه زمان می‌برد؛ مشتریان پیش از شروع کار برآورد هزینه شفاف دریافت کرده و در پایان فاکتور رسمی معتبر به همراه کد رهگیری هوشمند دریافت می‌کنند.',
    en: 'All service providers undergo strict background checks and skill verification. Customers receive upfront price estimates, smart tracking codes, and written 30-day workmanship warranties on all jobs.',
  },
];

export function renderFooter(settings?: SiteSettings): string {
  const year = new Date().getFullYear();
  const siteName = settings?.site_name ?? FALLBACK_SITE_NAME;
  const brandFa = typeof siteName === 'object' ? siteName.fa || 'بهدون' : String(siteName);
  const brandEn = typeof siteName === 'object' ? siteName.en || 'Behdoon' : String(siteName);

  const footerData = settings?.footer;
  let copyrightFa = footerData?.copyright?.fa;
  if (!copyrightFa) {
    copyrightFa = `تمامی حقوق مادی و معنوی برای ${brandFa} محفوظ است. سامانه هوشمند خدمات فنی و تأسیسات ساختمان در تهران و کرج.`;
  } else if (brandFa && brandFa !== 'بهدون' && (copyrightFa.includes('بهدون') || copyrightFa.includes('بهبار'))) {
    copyrightFa = copyrightFa.replace(/به[بد]ون?|به‌بار|به بار|بهبار/g, brandFa);
  }

  let copyrightEn = footerData?.copyright?.en;
  if (!copyrightEn) {
    copyrightEn = `All rights reserved for ${brandEn}. Smart Building & Technical Services Platform.`;
  } else if (brandEn && brandEn.toLowerCase() !== 'behdoon' && /behdoon|behbar/i.test(copyrightEn)) {
    copyrightEn = copyrightEn.replace(/behdoon|behbar/gi, brandEn);
  }

  const copyright = {
    fa: copyrightFa,
    en: copyrightEn,
  };

  const rawSeo = footerData?.seoParagraphs;
  const sourceSeo: Array<{ fa: string; en?: string }> = Array.isArray(rawSeo) && rawSeo.length
    ? rawSeo
    : DEFAULT_BEHDOON_SEO_PARAGRAPHS;

  const seoParagraphs = sourceSeo.map((p) => ({
    fa: p.fa.replace(/به‌بار|به بار/g, brandFa),
    en: p.en,
  }));

  const contact = resolveContact(settings?.contact);
  const colorStyle = contact.socialIconColor ? `style="--footer-social-color:${contact.socialIconColor}"` : '';

  return `
    <footer class="site-footer" id="footer" itemscope itemtype="https://schema.org/WPFooter">
      <!-- ۱. نوار تمایزها و ارزش‌های افزوده بهدون بالای فوتر -->
      <div class="footer-promises-strip">
        <div class="container promises-strip-inner">
          <div class="promise-item">
            <span class="icon promise-icon">${icons.clock}</span>
            <div class="promise-text">
              <strong>${pick('اعزام فوری در کمتر از ۴۵ دقیقه', 'Fast Dispatch Under 45 Mins')}</strong>
              <span>${pick('پوشش سراسری کلیه مناطق ۲۲ گانه تهران و کرج', 'Full coverage across all Tehran & Karaj districts')}</span>
            </div>
          </div>
          <div class="promise-item">
            <span class="icon promise-icon">${icons.shield}</span>
            <div class="promise-text">
              <strong>${pick('ضمانت کتبی ۳۰ روزه کیفیت کار', '30-Day Written Quality Warranty')}</strong>
              <span>${pick('پیگیری رضایت تا اتمام کار و بازرسی رایگان', 'Full customer support & free re-inspection')}</span>
            </div>
          </div>
          <div class="promise-item">
            <span class="icon promise-icon">${icons.badge}</span>
            <div class="promise-text">
              <strong>${pick('تکنسین‌های احراز هویت شده', 'Certified & Background-Checked')}</strong>
              <span>${pick('دارای مدرک فنی‌وحرفه‌ای و عدم سوءپیشینه', 'Verified vocational certification & clear record')}</span>
            </div>
          </div>
          <div class="promise-item">
            <span class="icon promise-icon">${icons.fileText}</span>
            <div class="promise-text">
              <strong>${pick('قیمت‌گذاری شفاف و منصفانه', 'Union Approved Transparent Rates')}</strong>
              <span>${pick('صدور آنی فاکتور رسمی تفکیکی بدون هزینه مخفی', 'Instant itemized official invoice with zero hidden fee')}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- بنر ویژه جذب تکنسین و متخصصان: اگر تخصص دارید به بهدون بپیوندید -->
      <div class="container footer-recruitment-container">
        <div class="footer-recruitment-card">
          <div class="recruitment-badge-row">
            <span class="recruitment-chip">
              <span class="icon">${icons.briefcase}</span>
              <span>${pick('فرصت ویژه همکاری و اشتغال تکنسین‌ها', 'Technician Career Opportunity')}</span>
            </span>
            <span class="recruitment-perk-pill">${pick('تسویه روزانه + درآمد بالا تا ۵۰ میلیون تومان', 'Daily Payout + Up to 50M Tomans Monthly')}</span>
          </div>
          <div class="recruitment-body-row">
            <div class="recruitment-text-col">
              <h3 class="recruitment-title">
                ${pick('اگر تخصص فنی یا تأسیساتی دارید، به جمع متخصصین بهدون بپیوندید', 'Join Behdoon Network of Certified Home Technicians')}
              </h3>
              <p class="recruitment-desc">
                ${pick(
                  'کسب درآمد پایدار و بالا، تسویه حساب منظم و روزانه، ساعات کاری منعطف و دریافت سفارشات مستمر در محله و مناطق انتخابی شما در تهران و کرج بدون کمیسیون‌های نامتعارف.',
                  'High monthly earnings up to 50M+ Tomans, flexible working hours, zero unfair fees, and steady client requests across your preferred districts.'
                )}
              </p>
            </div>
            <div class="recruitment-btn-col">
              <a href="/careers" class="btn btn-primary recruitment-cta-btn">
                <span>${pick('ثبت‌نام و تکمیل فرم همکاری تکنسین', 'Apply as a Specialist')}</span>
                <span class="icon">${icons.chevronLeft}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- ۲. شبکه اصلی ۴ ستونه منظم، خوانا و تفکیک‌شده فوتر -->
      <div class="container footer-main-wrapper">
        <div class="footer-grid">
          <!-- ستون ۱: برند، ارتباط و هویت بهدون -->
          <div class="footer-col footer-col-brand" itemscope itemtype="https://schema.org/LocalBusiness">
            <div class="footer-brand-header">
              <a href="/" class="footer-logo-link" aria-label="${brandFa}">
                <img src="/favicon.svg" alt="${brandFa}" class="footer-brand-logo" width="38" height="38" itemprop="image" />
                <span class="footer-brand-title" itemprop="name">${brandFa}</span>
              </a>
              <span class="footer-brand-badge">${pick('سامانه خدمات فنی تهران و کرج', 'Tehran & Karaj Building Services')}</span>
            </div>

            <p class="footer-brand-mission" itemprop="description">
              ${pick(
                `سامانه جامع و تخصصی ثبت آنلاین درخواست و اعزام فوری تکنسین‌های مجرب تأسیسات، سرمایش و گرمایش، لوله‌کشی، برقکاری و بازسازی ساختمان با ضمانت کتبی ۳۰ روزه و فاکتور رسمی معتبر در کلیه مناطق تهران و کرج.`,
                `Tehran and Karaj specialized platform for reliable home and building maintenance, certified plumbing, HVAC diagnostics, and professional renovation with written warranties.`,
              )}
            </p>

            <div class="footer-contact-actions">
              <a href="${contact.phoneTelHref}" class="footer-contact-card footer-phone-card" itemprop="telephone">
                <span class="icon contact-card-icon">${icons.phone}</span>
                <div class="contact-card-text">
                  <span class="contact-card-sub">${pick('پشتیبانی تلفنی و اعزام ۲۴ ساعته:', '24/7 Telephone Support:')}</span>
                  <strong class="contact-card-val" dir="ltr">${toPersianDigits(phoneNumberDisplay(contact))}</strong>
                </div>
              </a>

              <a href="https://wa.me/989333256885" target="_blank" rel="noopener" class="footer-contact-card footer-wa-card">
                <span class="icon contact-card-icon">${icons.whatsappFilled || icons.whatsapp}</span>
                <div class="contact-card-text">
                  <span class="contact-card-sub">${pick('مشاوره و ارسال عکس در واتساپ:', 'WhatsApp Dispatch & Photo Send:')}</span>
                  <strong class="contact-card-val" dir="ltr">۰۹۳۳۳۲۵۶۸۸۵</strong>
                </div>
              </a>
            </div>

            <div class="footer-social-wrapper">
              <span class="footer-social-heading">${pick('شبکه‌های اجتماعی رسمی بهدون:', 'Connect on social media:')}</span>
              ${renderSocialLinks(contact.socialLinks, colorStyle)}
            </div>
          </div>

          <!-- ستون ۲: خدمات پرتقاضای تأسیساتی و سرمایش/گرمایش (کلمات کلیدی سئو) -->
          <div class="footer-col">
            <h4 class="footer-col-title">
              <span class="icon col-title-icon">${icons.hvac}</span>
              <span>${pick('سرمایش، گرمایش و لوله‌کشی', 'HVAC & Plumbing Services')}</span>
            </h4>
            <ul class="footer-nav-list">
              <li><a href="/services/hvac/package">${pick('تعمیر و سرویس پکیج دیواری', 'Wall Boiler & Heating Repair')}</a></li>
              <li><a href="/services/hvac/water-cooler">${pick('نصب و سرویس دوره‌ای کولر آبی', 'Evaporative Cooler Service')}</a></li>
              <li><a href="/services/hvac">${pick('نصب و تعمیر کولر گازی و اسپلیت', 'AC Split Repair & Gas Refill')}</a></li>
              <li><a href="/services/hvac/radiator">${pick('هواگیری و نصب شوفاژ و رادیاتور', 'Radiator Bleeding & Installation')}</a></li>
              <li><a href="/services/plumbing/leak-detection">${pick('تشخیص ترکیدگی و نشت‌یابی لوله با دستگاه', 'Acoustic Pipe Leak Detection')}</a></li>
              <li><a href="/services/plumbing/moisture-repair">${pick('رفع نم و رطوبت دیوار و سقف بدون تخریب', 'Moisture & Damp Wall Treatment')}</a></li>
              <li><a href="/services/plumbing">${pick('لوله‌بازکنی و رفع گرفتگی لوله فاضلاب', 'Drain Cleaning & Unclogging')}</a></li>
              <li><a href="/services/plumbing/faucets">${pick('نصب و تعمیر شیرآلات ساختمانی و توالت فرنگی', 'Faucet & Sanitary Ware Installation')}</a></li>
              <li><a href="/services/plumbing/water-tank">${pick('نصب و تعمیر پمپ آب خانگی و منبع', 'Home Water Pump & Tank Setup')}</a></li>
            </ul>
          </div>

          <!-- ستون ۳: برق‌کاری، بازسازی و خدمات فنی ساختمان -->
          <div class="footer-col">
            <h4 class="footer-col-title">
              <span class="icon col-title-icon">${icons.electrical}</span>
              <span>${pick('برقکاری، بازسازی و خدمات فنی', 'Electrical & Construction')}</span>
            </h4>
            <ul class="footer-nav-list">
              <li><a href="/services/electrical/short-circuit">${pick('رفع اتصالی برق و تعویض فیوز شبانه‌روزی', 'Emergency Short Circuit Fix')}</a></li>
              <li><a href="/services/electrical/wiring">${pick('سیم‌کشی ساختمان و کابل‌کشی تابلو برق', 'Building Rewiring & Panels')}</a></li>
              <li><a href="/services/electrical/chandelier">${pick('نصب لوستر، هالوژن، نور مخفی و کلید پریز', 'Chandelier & Lighting Installation')}</a></li>
              <li><a href="/services/electrical/intercom">${pick('نصب و تعمیر آیفون تصویری و صوتی', 'Video Intercom Repair')}</a></li>
              <li><a href="/services/renovation/painting">${pick('نقاشی ساختمان و رنگ‌آمیزی دیوار و سقف', 'Interior Painting & Wall Coating')}</a></li>
              <li><a href="/services/renovation/tiling">${pick('کاشی‌کاری، سرامیک و بنایی کلی و جزئی', 'Tiling, Masonry & Plastering')}</a></li>
              <li><a href="/services/renovation/roof-insulation">${pick('ایزوگام و عایق‌کاری رطوبتی پشت‌بام', 'Roof Waterproofing & Insulation')}</a></li>
              <li><a href="/services/locksmith">${pick('کلیدسازی شبانه‌روزی و باز کردن درب ضدسرقت', '24/7 Locksmith & Lock Picking')}</a></li>
              <li><a href="/services/carpentry">${pick('تعمیر کابینت آشپزخانه و کمد دیواری', 'Kitchen Cabinet & Carpentry')}</a></li>
              <li><a href="/services/cleaning">${pick('نظافت راه‌پله، مشاعات و نماشویی با طناب', 'Common Area & Facade Cleaning')}</a></li>
            </ul>
          </div>

          <!-- ستون ۴: دسترسی سریع، پرتال‌ها و دریافت اپلیکیشن -->
          <div class="footer-col footer-col-trust">
            <h4 class="footer-col-title">
              <span class="icon col-title-icon">${icons.layers}</span>
              <span>${pick('پرتال‌ها و اپلیکیشن', 'Portals & Behdoon App')}</span>
            </h4>
            <ul class="footer-nav-list">
              <li>
                <a href="/#request" class="request-wizard-open-trigger footer-highlight-cta">
                  <span class="icon">${icons.plusCircle}</span>
                  <span>${pick('ثبت آنلاین درخواست تکنسین', 'Book a Technician Online')}</span>
                  <span class="badge-tag">${pick('فوری', 'Fast')}</span>
                </a>
              </li>
              <li><a href="/orders">${pick('پیگیری درخواست و فاکتور آنلاین', 'Track Orders & Invoices')}</a></li>
              <li><a href="/services">${pick('کاتالوگ کامل ۵۳ خدمت تخصصی بهدون', 'Catalog of All 53 Services')}</a></li>
              <li><a href="/magazine">${pick('مجله و دانشنامه تخصصی ساختمان', 'Building & Tech Magazine')}</a></li>
              <li><a href="/careers">${pick('فرصت‌های شغلی و استخدام تکنسین', 'Careers & Hiring')}</a></li>
              <li><a href="/terms">${pick('قوانین، مقررات و ضمانت ۳۰ روزه', 'Terms & 30-Day Warranty')}</a></li>
              <li><a href="/about">${pick('درباره مرکز خدمات ساختمانی بهدون', 'About Behdoon Services')}</a></li>
              <li><a href="/privacy">${pick('حریم خصوصی و امنیت کاربران', 'Privacy Policy')}</a></li>
              <li class="footer-mgmt-li">
                <a href="/management" class="footer-management-link">${pick('ورود پرسنل و پنل مدیریت', 'Staff & Management Login')}</a>
              </li>
            </ul>

            <!-- دانلود اپلیکیشن موبایل بهدون -->
            <div class="footer-app-download-section">
              <span class="footer-section-mini-heading">${pick('دریافت مستقیم اپلیکیشن بهدون:', 'Download Behdoon App:')}</span>
              ${renderAppLinks(settings?.app_links)}
            </div>
          </div>
        </div>

        <!-- ۳. بلوک ویژه سئو محلی: مناطق تحت پوشش در تهران و کرج -->
        <div class="footer-regions-card">
          <div class="regions-header">
            <span class="icon regions-icon">${icons.pin}</span>
            <div class="regions-header-text">
              <h4 class="regions-title">${pick('مناطق تحت پوشش خدمات فنی و تأسیساتی بهدون (اعزام فوری زیر ۴۵ دقیقه)', 'Service Areas in Tehran & Alborz (Fast Dispatch Under 45 Mins)')}</h4>
              <p class="regions-desc">${pick('استقرار تیم‌های سیار متخصصین تأسیسات، لوله‌کشی، پکیج، کولر و برقکاری در کلیه مناطق و محلات:', 'Mobile teams of certified HVAC, plumbing & electrical specialists ready across all districts:')}</p>
            </div>
          </div>
          <div class="regions-grid">
            <div class="region-box">
              <strong class="region-box-title">${pick('شمال تهران:', 'North Tehran:')}</strong>
              <span class="region-box-list">${pick('تجریش، نیاوران، الهیه، ولنجک، زعفرانیه، قلهک، پاسداران، قیطریه، اندرزگو، دارآباد، فرمانیه، کامرانیه، ازگل', 'Tajrish, Niavaran, Elahiye, Velenjak, Zafaraniye, Pasdaran, Qeytariye')}</span>
            </div>
            <div class="region-box">
              <strong class="region-box-title">${pick('غرب تهران:', 'West Tehran:')}</strong>
              <span class="region-box-list">${pick('سعادت‌آباد، شهرک غرب، پونک، صادقیه، مرزداران، جنت‌آباد، گیشا، چیتگر، طرشت، ستارخان، دهکده المپیک', 'Saadat Abad, Shahrak Gharb, Punak, Sadeghiye, Marzdaran, Jannat Abad, Chitgar')}</span>
            </div>
            <div class="region-box">
              <strong class="region-box-title">${pick('شرق تهران:', 'East Tehran:')}</strong>
              <span class="region-box-list">${pick('تهرانپارس، نارمک، پیروزی، رسالت، افسریه، هنگام، تهران‌نو، نیروی هوایی، حکیمیه، مجیدیه، سرسبز', 'Tehranpars, Narmak, Piroozi, Resalat, Afsariye, Hengam, Tehran No')}</span>
            </div>
            <div class="region-box">
              <strong class="region-box-title">${pick('مرکز و جنوب تهران:', 'Central & South Tehran:')}</strong>
              <span class="region-box-list">${pick('یوسف‌آباد، امیرآباد، سهروردی، عباس‌آباد، فاطمی، میدان انقلاب، بازار، نازی‌آباد، شوش، خانی‌آباد، راه‌آهن، شهرری', 'Yousef Abad, Amir Abad, Sohrevardi, Fatemi, Enqelab, Nazi Abad, Rey')}</span>
            </div>
            <div class="region-box">
              <strong class="region-box-title">${pick('کرج و استان البرز:', 'Karaj & Alborz:')}</strong>
              <span class="region-box-list">${pick('عظیمیه، گوهردشت، جهانشهر، مهرشهر، فردیس، مهرویلا، باغستان، گلشهر، شاهین‌ویلا، گرمدره، محمدشهر', 'Azimiyeh, Gohardasht, Jahanshar, Mehrshahr, Fardis, Golshahr')}</span>
            </div>
          </div>
        </div>

        <!-- ۴. بخش عمیق و کارشناسی سئو با قابلیت باز/بسته شدن آکاردئونی -->
        <div class="footer-seo-container">
          <div class="footer-seo-card" id="footer-seo-box">
            <div class="footer-seo-header">
              <span class="icon footer-seo-icon">${icons.building}</span>
              <h3 class="footer-seo-title">${pick(`مرکز جامع و تخصصی خدمات فنی، تأسیسات و ساختمان ${brandFa} در تهران و البرز`, `Comprehensive Technical Building Services by ${brandEn}`)}</h3>
            </div>
            <div class="footer-seo-content" id="footer-seo-text">
              ${seoParagraphs.map((p) => `<p>${pick(p.fa, p.en)}</p>`).join('')}
            </div>
            <button type="button" class="footer-seo-btn" id="footer-seo-toggle" aria-expanded="false">
              <span class="footer-seo-toggle-label">${pick('مطالعه بیشتر درباره استانداردهای خدمات و تضمین کیفیت بهدون', 'Read more about Behdoon service standards and warranties')}</span>
              <span class="icon chevron-icon">${icons.chevronDown}</span>
            </button>
          </div>
        </div>

        <!-- ۵. نوار کپی‌رایت، پشتیبانی و بازگشت به بالا -->
        <div class="footer-subbar">
          <div class="footer-subbar-text">
            <p>© ${toPersianDigits(year)} ${pick(copyright.fa, copyright.en)}</p>
          </div>

          <div class="footer-subbar-actions">
            <div class="footer-quick-links">
              <a href="/terms">${pick('قوانین و ضمانت', 'Terms')}</a>
              <span class="sep">·</span>
              <a href="/privacy">${pick('حریم خصوصی', 'Privacy')}</a>
              <span class="sep">·</span>
              <a href="/about">${pick('درباره ما', 'About')}</a>
              <span class="sep">·</span>
              <a href="tel:09333256885" class="footer-urgent-call">${pick('اعزام فوری شبانه‌روزی: ۰۹۳۳۳۲۵۶۸۸۵', 'Call: 09333256885')}</a>
            </div>

            <button type="button" class="footer-back-to-top" id="footer-back-to-top" title="${pick('بازگشت به بالای صفحه', 'Back to top')}" aria-label="${pick('بازگشت به بالای صفحه', 'Back to top')}">
              <span>${pick('بازگشت به بالا', 'Back to top')}</span>
              <span class="icon">${icons.chevronDown}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  `;
}

export function initFooter(_settings?: SiteSettings): void {
  const backToTopBtn = document.getElementById('footer-back-to-top');
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const box = document.getElementById('footer-seo-box');
  const toggle = document.getElementById('footer-seo-toggle') as HTMLButtonElement | null;
  const label = toggle?.querySelector('.footer-seo-toggle-label');
  if (box && toggle && label) {
    toggle.addEventListener('click', () => {
      const expanded = box.classList.toggle('is-expanded');
      toggle.setAttribute('aria-expanded', String(expanded));
      label.textContent = expanded
        ? pick('بستن متن توضیحات', 'Close description')
        : pick('مطالعه بیشتر درباره استانداردهای خدمات و تضمین کیفیت بهدون', 'Read more about Behdoon service standards and warranties');
    });
  }

  document.querySelectorAll<HTMLElement>('.site-footer .request-wizard-open-trigger').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href');
      if (href && (href === '/#request' || href === '#request' || href.startsWith('/#services-explorer'))) {
        e.preventDefault();
        const modal = document.getElementById('request-wizard-modal');
        if (modal) {
          if (modal.parentElement !== document.body) {
            document.body.appendChild(modal);
          }
          modal.hidden = false;
          modal.classList.add('is-open');
          document.body.classList.add('modal-open');
        } else {
          location.href = '/#request';
        }
      }
    });
  });
}

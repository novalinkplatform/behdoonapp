import { phoneNumberDisplay, resolveContact } from '../data/contact.ts';
import { icons } from './icons.ts';
import { pick } from '../i18n/lang.ts';
import { toPersianDigits } from '../utils/jalali.ts';
import type { CertificationBadge, SiteSettings, SocialLinkSetting } from '../utils/dynamicContent.ts';

export function buildFooterLinks(settings?: SiteSettings): Array<{ href: string; label: string }> {
  const links: Array<{ href: string; label: string }> = [];
  links.push({ href: '/', label: pick('خانه', 'Home') });
  links.push({ href: '/orders', label: pick('پیگیری درخواست‌ها', 'Track Orders') });
  links.push({ href: '/magazine', label: pick('مجله تخصصی ساختمان', 'Building Magazine') });
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
    { label: 'نسخه وب PWA', platform: 'custom', sub: 'بدون نیاز به نصب', url: '/#request' },
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

function renderTrustBadges(certifications?: SiteSettings['certifications']): string {
  if (certifications?.enabled && certifications.badges.length) {
    return `
      <div class="footer-certifications-grid">
        ${certifications.badges
          .map(
            (b: CertificationBadge) => `
          <a class="footer-cert-card" href="${b.linkUrl || '#'}" target="_blank" rel="noopener" aria-label="${b.label}">
            <img src="${b.imageUrl}" alt="${b.label}" loading="lazy" />
          </a>
        `,
          )
          .join('')}
      </div>
    `;
  }
  return `
    <div class="footer-trust-seals">
      <div class="trust-seal-item" title="${pick('ضمانت ۳۰ روزه کیفیت خدمات', '30-Day Quality Guarantee')}">
        <span class="icon seal-icon">${icons.shield}</span>
        <div class="seal-meta">
          <strong>${pick('ضمانت کتبی ۳۰ روزه', '30-Day Warranty')}</strong>
          <span>${pick('کیفیت کار و قطعات', 'Quality & Parts')}</span>
        </div>
      </div>
      <div class="trust-seal-item" title="${pick('تکنسین‌های احراز صلاحیت شده', 'Verified Master Technicians')}">
        <span class="icon seal-icon">${icons.badge}</span>
        <div class="seal-meta">
          <strong>${pick('تأیید صلاحیت فنی', 'Certified Pros')}</strong>
          <span>${pick('عدم سوءپیشینه و مهارت', 'Skill & Record Cleared')}</span>
        </div>
      </div>
      <div class="trust-seal-item" title="${pick('نرخ مصوب و بدون هزینه مخفی', 'Union Approved Transparent Rates')}">
        <span class="icon seal-icon">${icons.fileText}</span>
        <div class="seal-meta">
          <strong>${pick('فاکتور رسمی تفکیکی', 'Official Invoice')}</strong>
          <span>${pick('شفافیت ۱۰۰٪ نرخ‌ها', '100% Fair Pricing')}</span>
        </div>
      </div>
      <div class="trust-seal-item" title="${pick('پوشش بیمه جبران خسارت', 'Insurance & Compensation')}">
        <span class="icon seal-icon">${icons.checkCircle}</span>
        <div class="seal-meta">
          <strong>${pick('بیمه مسئولیت مدنی', 'Liability Insurance')}</strong>
          <span>${pick('تا ۵۰۰ میلیون تومان', 'Up to 500M Toman')}</span>
        </div>
      </div>
    </div>
  `;
}

const DEFAULT_BEHDOON_SEO_PARAGRAPHS = [
  {
    fa: 'سامانه خدمات هوشمند ساختمان بهدون (Behdoon) جامع‌ترین و مطمئن‌ترین پلتفرم آنلاین ارائه خدمات فنی، تأسیساتی و ساختمانی در کلیه مناطق ۲۲ گانه شهر تهران است. رسالت اصلی بهدون رفع دغدغه‌های همیشگی شهروندان در زمینه یافتن استادکاران قابل اعتماد، تعیین نرخ‌های شفاف بر مبنای مصوبات اتحادیه، اعزام فوق‌سریع در زمان‌های اضطراری و ارائه ضمانت کتبی ۳۰ روزه برای کلیه سفارش‌های انجام‌شده می‌باشد.',
    en: 'Behdoon Smart Building Services Platform is Tehran leading online destination for specialized building maintenance, HVAC servicing, sanitary plumbing, professional electrical contracting, and turn-key interior renovation. Backed by certified technicians and written warranties.',
  },
  {
    fa: 'تکنسین‌ها و استادکاران فعال در شبکه بهدون پس از طی مراحل گزینش چندمرحله‌ای شامل بررسی گواهی مهارت فنی‌وحرفه‌ای، آزمون‌های صلاحیت عملی، سنجش اخلاق حرفه‌ای و استعلام تاییدیه عدم سوءپیشینه کیفری به جمع متخصصین بهدون می‌پیوندند. کلیه فرآیندهای کاری تحت نظارت سامانه مانیتورینگ کیفی قرار داشته و تیم پشتیبانی ۲۴ ساعته بهدون تا جلب رضایت کامل مشتریان پاسخگو خواهد بود.',
    en: 'Every technician on the Behdoon platform undergoes multi-tiered vetting, criminal record clearance, skill evaluations, and professional background checks. All services are tracked end-to-end with 24/7 client support.',
  },
  {
    fa: 'فرآیند ثبت درخواست در بهدون کاملاً برخط و سریع طراحی شده است. کاربران گرامی می‌توانند در کمتر از ۲ دقیقه نوع خدمت مورد نیاز خود را در ۴ حوزه تخصصی «سرمایش و گرمایش»، «لوله‌کشی و تأسیسات»، «برقکاری ساختمان» و «تعمیرات و بازسازی» انتخاب نموده، برآورد شفاف قیمت و زمان حضور تکنسین را مشاهده کنند و بلافاصله پس از ثبت، کد رهگیری هوشمند و فاکتور رسمی دریافت نمایند.',
    en: 'Booking a technician takes under 2 minutes with instant itemized quotes, point-accurate geolocation dispatch in under 45 minutes, and official itemized invoices with smart tracking codes.',
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
    copyrightFa = `تمامی حقوق مادی و معنوی برای ${brandFa} محفوظ است. مرکز خدمات هوشمند ساختمان در تهران.`;
  } else if (brandFa && brandFa !== 'بهدون' && copyrightFa.includes('بهدون')) {
    copyrightFa = copyrightFa.replace(/به‌بار|به بار|بهبار/g, brandFa);
  }

  let copyrightEn = footerData?.copyright?.en;
  if (!copyrightEn) {
    copyrightEn = `All rights reserved for ${brandEn}. Smart Building & Technical Services Platform.`;
  } else if (brandEn && brandEn.toLowerCase() !== 'behbar' && /behbar/i.test(copyrightEn)) {
    copyrightEn = copyrightEn.replace(/behbar/gi, brandEn);
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
    <footer class="site-footer" id="footer">
      <!-- ۱. نوار تمایزها و ارزش‌های افزوده بهدون بالای فوتر -->
      <div class="footer-promises-strip">
        <div class="container promises-strip-inner">
          <div class="promise-item">
            <span class="icon promise-icon">${icons.clock}</span>
            <div class="promise-text">
              <strong>${pick('اعزام سریع در کمتر از ۴۵ دقیقه', 'Fast Dispatch Under 45 Mins')}</strong>
              <span>${pick('پوشش سراسری کلیه مناطق ۲۲ گانه تهران', 'Full coverage across all 22 Tehran districts')}</span>
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
              <strong>${pick('قیمت‌گذاری شفاف و مصوب اتحادیه', 'Union Approved Transparent Rates')}</strong>
              <span>${pick('صدور آنی فاکتور رسمی تفکیکی بدون هزینه مخفی', 'Instant itemized official invoice with zero hidden fee')}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ۲. شبکه اصلی ۴ ستونه منظم، خوانا و تفکیک‌شده فوتر -->
      <div class="container footer-main-wrapper">
        <div class="footer-grid">
          <!-- ستون ۱: برند، ارتباط و هویت بهدون -->
          <div class="footer-col footer-col-brand">
            <div class="footer-brand-header">
              <a href="/" class="footer-logo-link" aria-label="${brandFa}">
                <img src="/favicon.svg" alt="${brandFa}" class="footer-brand-logo" width="38" height="38" />
                <span class="footer-brand-title">${brandFa}</span>
              </a>
              <span class="footer-brand-badge">${pick('خدمات ساختمان تهران', 'Tehran Building Services')}</span>
            </div>

            <p class="footer-brand-mission">
              ${pick(
                `سامانه تخصصی اعزام فوری تکنسین و استادکاران مجرب در تمامی مناطق ۲۲ گانه تهران؛ تضمین کتبی کیفیت، اعزام زیر ۴۵ دقیقه و تعرفه‌های مصوب و شفاف.`,
                `Tehran specialized platform for reliable home and building maintenance, certified plumbing, HVAC diagnostics, and professional renovation with written warranties.`,
              )}
            </p>

            <div class="footer-contact-actions">
              <a href="${contact.phoneTelHref}" class="footer-contact-card footer-phone-card">
                <span class="icon contact-card-icon">${icons.phone}</span>
                <div class="contact-card-text">
                  <span class="contact-card-sub">${pick('پشتیبانی تلفنی و اعزام شبانه‌روزی:', '24/7 Telephone Support:')}</span>
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

          <!-- ستون ۲: خدمات تخصصی ساختمانی -->
          <div class="footer-col">
            <h4 class="footer-col-title">
              <span class="icon col-title-icon">${icons.hvac}</span>
              <span>${pick('خدمات تخصصی بهدون', 'Specialized Services')}</span>
            </h4>
            <ul class="footer-nav-list">
              <li><a href="/services/hvac">${pick('سرمایش و گرمایش (پکیج، کولر، شوفاژ)', 'HVAC & Heating Systems')}</a></li>
              <li><a href="/services/plumbing">${pick('لوله‌کشی، نشت‌یابی و رفع نم با دستگاه', 'Plumbing & Leak Detection')}</a></li>
              <li><a href="/services/electrical">${pick('برقکاری ساختمان و رفع اتصالی فوری', 'Building Electrical & Wiring')}</a></li>
              <li><a href="/services/renovation">${pick('تعمیرات، نقاشی و بازسازی ساختمان', 'Remodeling & Interior Painting')}</a></li>
              <li><a href="/services/locksmith">${pick('کلیدسازی شبانه‌روزی و باز کردن قفل', '24/7 Locksmith & Lockout')}</a></li>
              <li><a href="/services/cleaning">${pick('نظافت مشاعات، نماشویی و تأسیسات', 'Facility & Common Areas Cleaning')}</a></li>
              <li class="footer-all-services-li">
                <a href="/services" class="footer-all-services-link">
                  <span>${pick('مشاهده تمام ۵۳ خدمت تخصصی بهدون ←', 'View All 53 Specialized Services ←')}</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- ستون ۳: پرتال مشتریان و دسترسی سریع -->
          <div class="footer-col">
            <h4 class="footer-col-title">
              <span class="icon col-title-icon">${icons.layers}</span>
              <span>${pick('پرتال‌ها و دسترسی سریع', 'Quick Access & Portals')}</span>
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
              <li><a href="/services">${pick('تعرفه مصوب خدمات و برآورد هزینه', 'Approved Pricing & Rates')}</a></li>
              <li><a href="/magazine">${pick('مجله و دانشنامه تخصصی ساختمان', 'Building & Tech Magazine')}</a></li>
              <li><a href="/careers">${pick('فرصت‌های شغلی و همکاری متخصصین', 'Careers & Hiring')}</a></li>
              <li><a href="/terms">${pick('قوانین، مقررات و ضمانت‌نامه کتبی', 'Terms & Written Warranty')}</a></li>
              <li><a href="/about">${pick('درباره مرکز خدمات ساختمانی بهدون', 'About Behdoon Services')}</a></li>
              <li class="footer-mgmt-li">
                <a href="/management" class="footer-management-link">${pick('ورود پرسنل و پنل مدیریت', 'Staff & Management Login')}</a>
              </li>
            </ul>
          </div>

          <!-- ستون ۴: ضمانت اعتبار، پوشش تهران و دانلود اپ -->
          <div class="footer-col footer-col-trust">
            <h4 class="footer-col-title">
              <span class="icon col-title-icon">${icons.shield}</span>
              <span>${pick('ضمانت اعتبار و اپلیکیشن', 'Guarantees & Mobile App')}</span>
            </h4>

            <!-- نمادهای اعتماد و ضمانت کیفیت کتبی -->
            <div class="footer-trust-seals-section">
              ${renderTrustBadges(settings?.certifications)}
            </div>

            <!-- دانلود اپلیکیشن موبایل بهدون -->
            <div class="footer-app-download-section">
              <span class="footer-section-mini-heading">${pick('دریافت مستقیم اپلیکیشن بهدون:', 'Download Behdoon App:')}</span>
              ${renderAppLinks(settings?.app_links)}
            </div>

            <!-- تگ پوشش سراسری مناطق ۲۲ گانه تهران -->
            <div class="footer-tehran-coverage-badge">
              <span class="icon">${icons.pin}</span>
              <span>${pick('پوشش سراسری در کلیه مناطق ۲۲ گانه تهران', 'Full coverage across all 22 Tehran districts')}</span>
            </div>
          </div>
        </div>

        <!-- ۳. بخش عمیق و کارشناسی سئو با قابلیت باز/بسته شدن آکاردئونی -->
        <div class="footer-seo-container">
          <div class="footer-seo-card" id="footer-seo-box">
            <div class="footer-seo-header">
              <span class="icon footer-seo-icon">${icons.building}</span>
              <h3 class="footer-seo-title">${pick(`مرکز جامع و تخصصی خدمات فنی و ساختمانی ${brandFa} در تهران`, `Comprehensive Technical Building Services by ${brandEn}`)}</h3>
            </div>
            <div class="footer-seo-content" id="footer-seo-text">
              ${seoParagraphs.map((p) => `<p>${pick(p.fa, p.en)}</p>`).join('')}
            </div>
            <button type="button" class="footer-seo-btn" id="footer-seo-toggle" aria-expanded="false">
              <span class="footer-seo-toggle-label">${pick('مطالعه بیشتر درباره استانداردهای خدمات بهدون', 'Read more about Behdoon service standards')}</span>
              <span class="icon chevron-icon">${icons.chevronDown}</span>
            </button>
          </div>
        </div>

        <!-- ۴. نوار کپی‌رایت، پشتیبانی و بازگشت به بالا -->
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
              <a href="tel:09333256885" class="footer-urgent-call">${pick('اعزام فوری: ۰۹۳۳۳۲۵۶۸۸۵', 'Call: 09333256885')}</a>
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
        : pick('مطالعه بیشتر درباره استانداردهای خدمات بهدون', 'Read more about Behdoon service standards');
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

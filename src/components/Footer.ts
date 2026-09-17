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

      <!-- ۲. شبکه اصلی ۵ ستونه عمیق و جامع فوتر -->
      <div class="container footer-main-wrapper">
        <div class="footer-grid">
          <!-- ستون ۱: برند و شناسنامه بهدون -->
          <div class="footer-col footer-col-brand">
            <div class="footer-brand-header">
              <a href="/" class="footer-logo-link" aria-label="${brandFa}">
                <img src="/favicon.svg" alt="${brandFa}" class="footer-brand-logo" width="36" height="36" />
                <span class="footer-brand-title">${brandFa}</span>
              </a>
              <span class="footer-brand-badge">${pick('خدمات هوشمند ساختمان', 'Smart Building Services')}</span>
            </div>
            <p class="footer-brand-mission">
              ${pick(
                `${brandFa} سامانه تخصصی ارائه خدمات فنی، تأسیساتی و بازسازی ساختمان در استان تهران است. ما کیفیت کار، اعزام فوری تکنسین‌های مطمئن و شفافیت هزینه‌ها را به صورت کتبی تضمین می‌کنیم.`,
                `${brandEn} is Tehran leading platform for reliable home and building maintenance, specialized plumbing, HVAC diagnostics, and professional interior renovation.`,
              )}
            </p>

            <div class="footer-contact-list">
              <a href="${contact.phoneTelHref}" class="footer-contact-link footer-phone-cta">
                <span class="icon contact-icon-pulse">${icons.phone}</span>
                <div class="contact-info-block">
                  <span class="contact-label">${pick('پشتیبانی تلفنی و ثبت سفارش ۲۴ ساعته:', '24/7 Telephone Support:')}</span>
                  <span class="contact-value" dir="ltr">${toPersianDigits(phoneNumberDisplay(contact))}</span>
                </div>
              </a>

              <a href="https://wa.me/989333256885" target="_blank" rel="noopener" class="footer-contact-link">
                <span class="icon">${icons.whatsappFilled || icons.whatsapp}</span>
                <div class="contact-info-block">
                  <span class="contact-label">${pick('ارسال پیام و تصویر در واتساپ:', 'WhatsApp Dispatch & Photo Send:')}</span>
                  <span class="contact-value" dir="ltr">۰۹۳۳۳۲۵۶۸۸۵</span>
                </div>
              </a>

              <div class="footer-contact-item">
                <span class="icon">${icons.pin}</span>
                <span class="contact-text">${pick('تهران، سعادت‌آباد، بلوار پاک‌نژاد، برج بهدون، طبقه ۳', 'Paknejad Blvd, Saadat Abad, Behdoon Tower, Tehran')}</span>
              </div>
            </div>
          </div>

          <!-- ستون ۲: خدمات تخصصی ساختمانی بهدون -->
          <div class="footer-col">
            <h4 class="footer-col-title">
              <span class="icon col-title-icon">${icons.hvac}</span>
              <span>${pick('خدمات تخصصی بهدون', 'Specialized Services')}</span>
            </h4>
            <ul class="footer-nav-list">
              <li><a href="/#services-explorer" class="request-wizard-open-trigger" data-cat-trigger="hvac">${pick('سرویس و تعمیر انواع پکیج و شوفاژ', 'Gas Wall Boiler & Radiator Repair')}</a></li>
              <li><a href="/#services-explorer" class="request-wizard-open-trigger" data-cat-trigger="hvac">${pick('نصب، شستشو و شارژ گاز اسپلیت و کولر گازی', 'Split AC Gas Recharge & Service')}</a></li>
              <li><a href="/#services-explorer" class="request-wizard-open-trigger" data-cat-trigger="hvac">${pick('راه‌اندازی، تعویض موتور و سرویس کولر آبی', 'Evaporative Cooler Motor & Maintenance')}</a></li>
              <li><a href="/#services-explorer" class="request-wizard-open-trigger" data-cat-trigger="plumbing">${pick('نشت‌یابی نقطه زن با دستگاه تصویری و آکوستیک', 'Acoustic Thermal Leak Detection')}</a></li>
              <li><a href="/#services-explorer" class="request-wizard-open-trigger" data-cat-trigger="plumbing">${pick('لوله بازکنی فوری و بهداشتی با فنر فولادی', 'Urgent Sanitary Drain Unclogging')}</a></li>
              <li><a href="/#services-explorer" class="request-wizard-open-trigger" data-cat-trigger="plumbing">${pick('نصب و تعمیر پمپ آب ساختمان و تنظیم کلید اتوماتیک', 'Water Booster Pump Repair & Tuning')}</a></li>
              <li><a href="/#services-explorer" class="request-wizard-open-trigger" data-cat-trigger="electrical">${pick('رفع فوری اتصالی سیم‌کشی و پریدن فیوز برق', 'Emergency Electrical Short Circuit Fix')}</a></li>
              <li><a href="/#services-explorer" class="request-wizard-open-trigger" data-cat-trigger="renovation">${pick('نقاشی ساختمان، کاشی‌کاری، ایزوگام و کناف مدرن', 'Wall Painting, Tiling, Waterproofing')}</a></li>
            </ul>
          </div>

          <!-- ستون ۳: دسترسی سریع و پرتال مشتریان -->
          <div class="footer-col">
            <h4 class="footer-col-title">
              <span class="icon col-title-icon">${icons.layers}</span>
              <span>${pick('دسترسی سریع و پرتال‌ها', 'Quick Access & Portals')}</span>
            </h4>
            <ul class="footer-nav-list">
              <li><a href="/#request" class="request-wizard-open-trigger footer-highlight-link">
                <span class="icon">${icons.plusCircle}</span>
                <span>${pick('ثبت سریع درخواست آنلاین تکنسین', 'Book a Technician Online')}</span>
              </a></li>
              <li><a href="/orders">${pick('پیگیری در درخواست‌های من و فاکتورها', 'Track Orders & Itemized Invoices')}</a></li>
              <li><a href="/magazine">${pick('مجله و دانشنامه تخصصی ساختمان', 'Building & Technical Magazine')}</a></li>
              <li><a href="/careers">${pick('فرصت‌های شغلی و همکاری متخصصین', 'Technician Recruitment & Jobs')}</a></li>
              <li><a href="/about">${pick('درباره مرکز خدمات بهدون', 'About Behdoon Services')}</a></li>
              <li><a href="/terms">${pick('قوانین، مقررات و ضمانت‌نامه کتبی', 'Terms of Service & Written Warranty')}</a></li>
              <li><a href="/privacy">${pick('سیاست حفظ حریم خصوصی کاربران', 'Privacy Policy')}</a></li>
              <li><a href="/management" class="footer-management-link">${pick('ورود پرسنل و پنل مدیریت', 'Staff & Management Login')}</a></li>
            </ul>
          </div>

          <!-- ستون ۴: مناطق ۲۲ گانه تحت پوشش تهران (سئو و جلب اعتماد محلی) -->
          <div class="footer-col">
            <h4 class="footer-col-title">
              <span class="icon col-title-icon">${icons.pin}</span>
              <span>${pick('مناطق تحت پوشش تهران', 'Tehran Service Areas')}</span>
            </h4>
            <div class="footer-coverage-districts">
              <div class="district-group">
                <strong class="district-title">${pick('شمال تهران:', 'North Tehran:')}</strong>
                <p class="district-tags">${pick('نیاوران، تجریش، ولنجک، زعفرانیه، فرمانیه، الهیه، قیطریه، کامرانیه، سعادت‌آباد', 'Niavaran, Tajrish, Velenjak, Zafaraniyeh, Saadat Abad')}</p>
              </div>
              <div class="district-group">
                <strong class="district-title">${pick('غرب و مرکز:', 'West & Center:')}</strong>
                <p class="district-tags">${pick('شهرک غرب، صادقیه، پونک، مرزداران، گیشا، جنت‌آباد، ستارخان، یوسف‌آباد', 'Shahrak Gharb, Sadeghiyeh, Poonak, Gisha, Yousef Abad')}</p>
              </div>
              <div class="district-group">
                <strong class="district-title">${pick('شرق تهران:', 'East Tehran:')}</strong>
                <p class="district-tags">${pick('تهرانپارس، پاسداران، هروی، نارمک، رسالت، پیروزی، نیروی هوایی، تهران‌نو', 'Tehranpars, Pasdaran, Heravi, Narmak, Resalat, Piroozi')}</p>
              </div>
              <div class="district-group">
                <strong class="district-title">${pick('مرکز و جنوب:', 'Central & South:')}</strong>
                <p class="district-tags">${pick('میدان ولیعصر، امیرآباد، فاطمی، انقلاب، جمهوری، نازی‌آباد، راه‌آهن، شهرری', 'Valiasr, Fatemi, Enqelab, Jomhouri, Nazi Abad, Rey')}</p>
              </div>
            </div>
          </div>

          <!-- ستون ۵: دانلود اپلیکیشن، شبکه‌ها و نمادهای اعتبار -->
          <div class="footer-col footer-col-trust">
            <h4 class="footer-col-title">
              <span class="icon col-title-icon">${icons.download}</span>
              <span>${pick('اپلیکیشن و شبکه‌های بهدون', 'App & Social Media')}</span>
            </h4>

            ${renderAppLinks(settings?.app_links)}

            <div class="footer-social-wrapper">
              <span class="footer-social-heading">${pick('ما را در شبکه‌های اجتماعی دنبال کنید:', 'Connect with us on social media:')}</span>
              ${renderSocialLinks(contact.socialLinks, colorStyle)}
            </div>

            <div class="footer-trust-seals-section">
              <span class="footer-trust-heading">${pick('مجوزها و تاییده‌های معتبر:', 'Certified & Verified Licenses:')}</span>
              ${renderTrustBadges(settings?.certifications)}
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
              <a href="tel:02122345678" class="footer-urgent-call">${pick('اعزام فوری: ۰۲۱-۲۲۳۴۵۶۷۸', 'Call: 021-22345678')}</a>
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

import { phoneNumberDisplay, resolveContact } from '../data/contact.ts';
import { icons } from './icons.ts';
import { pick } from '../i18n/lang.ts';
import { toPersianDigits } from '../utils/jalali.ts';
import type { SiteSettings, SocialLinkSetting } from '../utils/dynamicContent.ts';

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
  const activeLinks = links && links.length ? links : DEFAULT_SOCIALS;
  return `
    <div class="footer-social" ${colorStyle} aria-label="${pick('شبکه‌های اجتماعی بهدون', 'Social media')}">
      ${activeLinks
        .map((link) => {
          const icon = link.customIconUrl
            ? `<img src="${link.customIconUrl}" alt="${link.label}" style="width:18px;height:18px;object-fit:contain;border-radius:4px;" />`
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
    { label: 'کافه‌بازار', sub: pick('دانلود مستقیم', 'Direct Download'), url: 'https://cafebazaar.ir' },
    { label: 'مایکت', sub: pick('نسخه اندروید', 'Android App'), url: 'https://myket.ir' },
    { label: 'وب‌اپلیکیشن PWA', sub: pick('دسترسی فوری', 'Web App'), url: '/#request' },
  ];
  const badges = appLinks?.enabled && appLinks.links.length
    ? appLinks.links.map((l) => ({
        label: l.label || l.platform,
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

export function renderFooter(settings?: SiteSettings): string {
  const year = new Date().getFullYear();
  const siteName = settings?.site_name ?? FALLBACK_SITE_NAME;
  const brandFa = typeof siteName === 'object' ? siteName.fa || 'بهدون' : String(siteName);
  const brandEn = typeof siteName === 'object' ? siteName.en || 'Behdoon' : String(siteName);

  const contact = resolveContact(settings?.contact);
  const colorStyle = contact.socialIconColor ? `style="--footer-social-color:${contact.socialIconColor}"` : '';

  return `
    <footer class="site-footer" id="footer" itemscope itemtype="https://schema.org/WPFooter">
      <div class="container footer-main-wrapper">
        <div class="footer-grid">
          <!-- ستون ۱: هویت برند، معرفی کوتاه و پشتیبانی مستقیم -->
          <div class="footer-col footer-col-brand" itemscope itemtype="https://schema.org/LocalBusiness">
            <div class="footer-brand-header">
              <a href="/" class="footer-logo-link" aria-label="${brandFa}">
                <img src="/favicon.svg" alt="${brandFa}" class="footer-brand-logo" width="36" height="36" itemprop="image" />
                <span class="footer-brand-title" itemprop="name">${brandFa}</span>
              </a>
              <span class="footer-brand-badge">${pick('سامانه خدمات فنی پایتخت', 'Tehran Building Services')}</span>
            </div>

            <p class="footer-brand-desc" itemprop="description">
              ${pick(
                `سامانه آنلاین ثبت درخواست و اعزام متخصصین تأسیسات، سرمایش، گرمایش، لوله‌کشی و برقکاری در کلیه مناطق ۲۲‌گانه شهر تهران با ضمانت ۳۰ روزه حسن انجام خدمات و فاکتور رسمی معتبر.`,
                `Tehran online platform for certified HVAC, plumbing, electrical, and repair specialists with 30-day workmanship warranties across all 22 districts.`
              )}
            </p>

            <div class="footer-contact-actions">
              <a href="${contact.phoneTelHref}" class="footer-contact-pill footer-phone-pill" itemprop="telephone">
                <span class="icon contact-pill-icon">${icons.phone}</span>
                <div class="contact-pill-text">
                  <span class="contact-pill-sub">${pick('پشتیبانی تلفنی و اعزام:', 'Direct Telephone:')}</span>
                  <strong class="contact-pill-val" dir="ltr">${toPersianDigits(phoneNumberDisplay(contact))}</strong>
                </div>
              </a>

              <a href="https://wa.me/989333256885" target="_blank" rel="noopener" class="footer-contact-pill footer-wa-pill">
                <span class="icon contact-pill-icon">${icons.whatsappFilled || icons.whatsapp}</span>
                <div class="contact-pill-text">
                  <span class="contact-pill-sub">${pick('مشاوره و پشتیبانی واتساپ:', 'WhatsApp Support:')}</span>
                  <strong class="contact-pill-val" dir="ltr">۰۹۳۳۳۲۵۶۸۸۵</strong>
                </div>
              </a>
            </div>

            <div class="footer-social-wrapper">
              <span class="footer-social-title">${pick('شبکه‌های اجتماعی بهدون:', 'Follow Behdoon:')}</span>
              ${renderSocialLinks(contact.socialLinks, colorStyle)}
            </div>
          </div>

          <!-- ستون ۲: خدمات تخصصی منتخب (بدون شلوغی و تکرار) -->
          <div class="footer-col footer-col-services">
            <h4 class="footer-col-title">
              <span class="icon col-title-icon">${icons.tool || icons.hvac}</span>
              <span>${pick('خدمات تخصصی', 'Core Services')}</span>
            </h4>
            <ul class="footer-nav-list">
              <li><a href="/services/hvac/package">${pick('تعمیر و سرویس پکیج دیواری', 'Wall Boiler & Heating Repair')}</a></li>
              <li><a href="/services/hvac">${pick('سرویس کولر آبی و گازی', 'AC & Evaporative Cooler Service')}</a></li>
              <li><a href="/services/plumbing/leak-detection">${pick('نشت‌یابی با دستگاه و لوله‌کشی', 'Acoustic Pipe Leak Detection')}</a></li>
              <li><a href="/services/electrical">${pick('برقکاری ساختمان و رفع اتصالی فوری', 'Building Rewiring & Short Circuit Fix')}</a></li>
              <li><a href="/services/renovation">${pick('نقاشی و بازسازی ساختمان', 'Painting & Interior Renovation')}</a></li>
              <li><a href="/services/locksmith">${pick('کلیدسازی و باز کردن قفل درب', 'Locksmith & Emergency Lock Repair')}</a></li>
              <li class="footer-view-all-li">
                <a href="/services" class="footer-all-services-link">
                  <span>${pick('مشاهده کاتالوگ ۵۳ خدمت بهدون', 'View all 53 services')}</span>
                  <span class="icon">${icons.chevronLeft}</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- ستون ۳: راهنمای مشتریان و دسترسی سریع -->
          <div class="footer-col footer-col-nav">
            <h4 class="footer-col-title">
              <span class="icon col-title-icon">${icons.layers}</span>
              <span>${pick('راهنمای مشتریان', 'Customer Guide')}</span>
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
              <li><a href="/terms">${pick('قوانین، مقررات و شرایط ضمانت', 'Terms & 30-Day Warranty')}</a></li>
              <li><a href="/privacy">${pick('سیاست حفظ حریم خصوصی', 'Privacy Policy')}</a></li>
              <li><a href="/about">${pick('درباره سامانه بهدون', 'About Behdoon')}</a></li>
              <li><a href="/careers">${pick('همکاری و اشتغال متخصصین', 'Careers & Specialist Join')}</a></li>
              <li><a href="/magazine">${pick('مجله و دانستنی‌های ساختمان', 'Home Tech Magazine')}</a></li>
            </ul>
          </div>

          <!-- ستون ۴: پوشش خدمات پایتخت و دریافت اپلیکیشن -->
          <div class="footer-col footer-col-app">
            <h4 class="footer-col-title">
              <span class="icon col-title-icon">${icons.pin}</span>
              <span>${pick('پوشش تهران و اپلیکیشن', 'Coverage & App')}</span>
            </h4>

            <div class="footer-coverage-card">
              <div class="coverage-badge">
                <span class="coverage-dot"></span>
                <span>${pick('فعال در کلیه مناطق ۲۲‌گانه شهر تهران', 'Active Across All 22 Tehran Districts')}</span>
              </div>
              <p class="coverage-desc">
                ${pick(
                  'اعزام هماهنگ تکنسین به تمامی محله‌های شمال، غرب، شرق، مرکز و جنوب تهران با تعرفه مصوب و نظارت کیفی.',
                  'Dispatching certified specialists to all neighborhoods of Tehran with fair pricing.'
                )}
              </p>
            </div>

            <div class="footer-app-box">
              <span class="footer-app-heading">${pick('دریافت اپلیکیشن و دسترسی آسان:', 'Download App:')}</span>
              ${renderAppLinks(settings?.app_links)}
            </div>
          </div>
        </div>

        <!-- نوار کپی‌رایت پایین: خلاصه، تمیز و بدون تکرار -->
        <div class="footer-subbar">
          <div class="footer-subbar-text">
            <p>© ${toPersianDigits(year)} ${pick(`تمامی حقوق برای ${brandFa} محفوظ است. سامانه هوشمند خدمات فنی و تأسیسات ساختمان در شهر تهران.`, `All rights reserved for ${brandEn}. Building Services Platform, Tehran.`)}</p>
          </div>

          <button type="button" class="footer-back-to-top" id="footer-back-to-top" title="${pick('بازگشت به بالای صفحه', 'Back to top')}" aria-label="${pick('بازگشت به بالای صفحه', 'Back to top')}">
            <span>${pick('بازگشت به بالا', 'Back to top')}</span>
            <span class="icon">${icons.chevronDown}</span>
          </button>
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

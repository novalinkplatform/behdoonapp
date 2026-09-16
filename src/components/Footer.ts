import { phoneNumberDisplay, resolveContact } from '../data/contact.ts';
import { icons } from './icons.ts';
import { pick } from '../i18n/lang.ts';
import type { AppLinkSetting, CertificationBadge, SiteSettings, SocialLinkSetting } from '../utils/dynamicContent.ts';

export function buildFooterLinks(settings?: SiteSettings): Array<{ href: string; label: string }> {
  const links: Array<{ href: string; label: string }> = [];

  // همیشه خانه در ابتدا قرار می‌گیرد
  links.push({ href: '/', label: pick('خانه', 'Home') });

  const legal = settings?.legal_pages;

  // قوانین و مقررات (پیش‌فرض روشن مگر اینکه خاموش شده باشد)
  const termsShow = legal?.terms ? legal.terms.showInFooter !== false : true;
  if (termsShow) {
    links.push({
      href: '/terms',
      label: pick(legal?.terms?.title, legal?.terms?.titleEn) || pick('قوانین و مقررات', 'Terms & Conditions'),
    });
  }

  // حریم خصوصی (پیش‌فرض روشن مگر اینکه خاموش شده باشد)
  const privacyShow = legal?.privacy ? legal.privacy.showInFooter !== false : true;
  if (privacyShow) {
    links.push({
      href: '/privacy',
      label: pick(legal?.privacy?.title, legal?.privacy?.titleEn) || pick('حریم خصوصی', 'Privacy Policy'),
    });
  }

  // درباره ما (پیش‌فرض روشن مگر اینکه خاموش شده باشد)
  const aboutShow = legal?.about ? legal.about.showInFooter !== false : true;
  if (aboutShow) {
    links.push({
      href: '/about',
      label: pick(legal?.about?.title, legal?.about?.titleEn) || pick('درباره ما', 'About Us'),
    });
  }

  // صفحات اختصاصی جدید با تیک نمایش در فوتر
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

function renderFooterLinks(settings?: SiteSettings): string {
  return buildFooterLinks(settings)
    .map((link) => `<li><a href="${link.href}">${link.label}</a></li>`)
    .join('');
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

const APP_STORE_LABELS: Record<AppLinkSetting['platform'], string> = {
  googlePlay: 'Google Play',
  appStore: 'App Store',
  bazaar: 'کافه‌بازار',
  custom: '',
};

function renderSocialLinks(links: SocialLinkSetting[], colorStyle: string): string {
  if (!links.length) return '';
  return `
    <div class="footer-social" ${colorStyle}>
      ${links
        .map((link) => {
          const icon = link.customIconUrl
            ? `<img src="${link.customIconUrl}" alt="${link.label}" style="width:20px;height:20px;object-fit:contain;border-radius:4px;" />`
            : icons[SOCIAL_ICON_MAP[link.platform] ?? 'globe'];
          const isMail = link.platform === 'mail';
          return `<a href="${link.url}" ${isMail ? '' : 'target="_blank" rel="noopener"'} aria-label="${link.label}"><span class="icon">${icon}</span></a>`;
        })
        .join('')}
    </div>
  `;
}

function renderAppLinksColumn(appLinks: SiteSettings['app_links']): string {
  if (!appLinks?.enabled || !appLinks.links.length) return '';
  return `
    <div class="footer-extras-column">
      <span class="footer-extras-label">${pick('دانلود اپلیکیشن', 'Get the app')}</span>
      <div class="footer-app-links">
        ${appLinks.links
          .map(
            (l) => `
          <a class="footer-app-badge" href="${l.url}" target="_blank" rel="noopener">
            <span class="icon">${icons.download}</span>
            <span>${l.label || APP_STORE_LABELS[l.platform]}</span>
          </a>
        `,
          )
          .join('')}
      </div>
    </div>
  `;
}

function renderCertificationsColumn(certifications: SiteSettings['certifications']): string {
  if (!certifications?.enabled || !certifications.badges.length) return '';
  return `
    <div class="footer-extras-column">
      <span class="footer-extras-label">${pick('مجوزها و نمادها', 'Licenses & trust seals')}</span>
      <div class="footer-certifications">
        ${certifications.badges
          .map(
            (b: CertificationBadge) => `
          <a class="footer-cert-badge" href="${b.linkUrl || '#'}" target="_blank" rel="noopener" aria-label="${b.label}">
            <img src="${b.imageUrl}" alt="${b.label}" loading="lazy" />
          </a>
        `,
          )
          .join('')}
      </div>
    </div>
  `;
}

function renderFooterExtras(settings?: SiteSettings): string {
  const appColumn = renderAppLinksColumn(settings?.app_links);
  const certColumn = renderCertificationsColumn(settings?.certifications);
  if (!appColumn && !certColumn) return '';
  return `<div class="footer-extras">${appColumn}${certColumn}</div>`;
}

export function renderFooter(settings?: SiteSettings): string {
  const year = new Date().getFullYear();
  const siteName = settings?.site_name ?? FALLBACK_SITE_NAME;
  const footerData = settings?.footer;
  let copyrightFa = footerData?.copyright?.fa;
  if (!copyrightFa) {
    copyrightFa = siteName.fa ? `همه حقوق برای ${siteName.fa} محفوظ است.` : 'همه حقوق محفوظ است.';
  } else if (siteName.fa && siteName.fa !== 'بهدون' && copyrightFa.includes('بهدون')) {
    copyrightFa = copyrightFa.replace(/به‌بار|به بار|بهبار/g, siteName.fa);
  }

  let copyrightEn = footerData?.copyright?.en;
  if (!copyrightEn) {
    copyrightEn = siteName.en ? `All rights reserved for ${siteName.en}.` : 'All rights reserved.';
  } else if (siteName.en && siteName.en.toLowerCase() !== 'behbar' && /behbar/i.test(copyrightEn)) {
    copyrightEn = copyrightEn.replace(/behbar/gi, siteName.en);
  }

  const copyright = {
    fa: copyrightFa,
    en: copyrightEn,
  };

  const rawSeo = footerData?.seoParagraphs;
  const sourceSeo: Array<{ fa: string; en?: string }> = Array.isArray(rawSeo) ? rawSeo : [];

  const seoParagraphs = sourceSeo.map((p) => ({
    fa: p.fa.replace(/به‌بار|به بار/g, 'بهدون'),
    en: p.en,
  }));

  const contact = resolveContact(settings?.contact);
  const colorStyle = contact.socialIconColor ? `style="--footer-social-color:${contact.socialIconColor}"` : '';

  return `
    <footer class="site-footer" id="footer">
      <div class="container footer-islands">
        <div class="footer-island footer-island-main">
          <div class="footer-menu-row">
            <nav class="footer-nav" aria-label="${pick('ناوبری فوتر', 'Footer navigation')}">
              <ul>
                ${renderFooterLinks(settings)}
              </ul>
            </nav>
          </div>

          <div class="footer-contact-row">
            ${renderSocialLinks(contact.socialLinks, colorStyle)}
            <a class="footer-phone" href="${contact.phoneTelHref}">
              <span class="icon">${icons.phone}</span>
              <span dir="ltr">${phoneNumberDisplay(contact)}</span>
            </a>
          </div>

          ${renderFooterExtras(settings)}

          <div class="footer-bottom">
            <p>© ${year} ${pick(copyright.fa, copyright.en)}</p>
          </div>
        </div>

        ${
          seoParagraphs.length
            ? `
        <div class="footer-island footer-island-seo">
          <div class="footer-seo-box" id="footer-seo-box">
            <h2 class="visually-hidden">${pick(`درباره اسکریپت ${siteName.fa}`, `About ${siteName.en} Script`)}</h2>
            <div class="footer-seo-text" id="footer-seo-text">
              ${seoParagraphs.map((p) => `<p>${pick(p.fa, p.en)}</p>`).join('')}
            </div>
            <button type="button" class="footer-seo-toggle" id="footer-seo-toggle" aria-expanded="false">
              <span class="footer-seo-toggle-label">${pick('ادامه مطلب', 'Read more')}</span>
              <span class="icon">${icons.chevronDown}</span>
            </button>
          </div>
        </div>
        `
            : ''
        }
      </div>
    </footer>
  `;
}

export function initFooter(settings?: SiteSettings): void {
  if (settings) {
    const navUl = document.querySelector<HTMLUListElement>('.site-footer .footer-nav ul');
    if (navUl) {
      navUl.innerHTML = renderFooterLinks(settings);
    }
  }

  const box = document.getElementById('footer-seo-box');
  const toggle = document.getElementById('footer-seo-toggle') as HTMLButtonElement | null;
  const label = toggle?.querySelector('.footer-seo-toggle-label');
  if (!box || !toggle || !label) return;

  toggle.addEventListener('click', () => {
    const expanded = box.classList.toggle('is-expanded');
    toggle.setAttribute('aria-expanded', String(expanded));
    label.textContent = expanded ? pick('بستن', 'Close') : pick('ادامه مطلب', 'Read more');
  });
}

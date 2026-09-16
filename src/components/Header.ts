import { icons } from './icons.ts';
import { renderLangToggle } from './LangToggle.ts';
import { renderThemeToggle, initThemeToggle } from './ThemeToggle.ts';
import { pick } from '../i18n/lang.ts';
import type { SiteSettings } from '../utils/dynamicContent.ts';

export interface HeaderExtraLink {
  href: string;
  label: string;
  icon: string;
}

export function getHeaderExtraLinks(settings?: SiteSettings): HeaderExtraLink[] {
  const extraLinks: HeaderExtraLink[] = [];

  const legal = settings?.legal_pages;
  if (legal?.about?.showInHeader) {
    extraLinks.push({
      href: '/about',
      label: pick(legal.about.title, legal.about.titleEn) || pick('درباره ما', 'About Us'),
      icon: icons.user,
    });
  }
  if (legal?.terms?.showInHeader) {
    extraLinks.push({
      href: '/terms',
      label: pick(legal.terms.title, legal.terms.titleEn) || pick('قوانین و مقررات', 'Terms & Conditions'),
      icon: icons.shield,
    });
  }
  if (legal?.privacy?.showInHeader) {
    extraLinks.push({
      href: '/privacy',
      label: pick(legal.privacy.title, legal.privacy.titleEn) || pick('حریم خصوصی', 'Privacy Policy'),
      icon: icons.lock,
    });
  }

  if (Array.isArray(settings?.nav_pages)) {
    for (const p of settings.nav_pages) {
      if (p.showInHeader) {
        extraLinks.push({
          href: `/page/${encodeURIComponent(p.slug)}`,
          label: pick(p.title, p.titleEn) || p.title,
          icon: icons.article,
        });
      }
    }
  }

  return extraLinks;
}

function getSiteName(settings?: SiteSettings): string {
  if (!settings?.site_name) return 'بهدون';
  const name = settings.site_name;
  if (typeof name === 'object') {
    return pick(name.fa, name.en) || name.fa || 'بهدون';
  }
  return String(name);
}

export function renderHeader(settings?: SiteSettings): string {
  const extraLinks = getHeaderExtraLinks(settings);
  const extraHtml = extraLinks
    .map(
      (l) => `
        <a class="header-item header-extra-item" href="${l.href}">
          <span class="icon">${l.icon}</span>
          <span class="header-label">${l.label}</span>
        </a>
      `,
    )
    .join('');

  const brandName = getSiteName(settings);

  return `
    <header class="site-header">
      <div class="header-group">
        <a class="header-brand" href="/" aria-label="${pick('خانه', 'Home')}">
          <span class="header-logo">
            <img src="/favicon.svg" alt="" />
          </span>
          <span class="header-brand-title">${brandName}</span>
        </a>

        <div class="header-pill">
          <a class="header-item header-home" href="/" aria-label="${pick('خانه', 'Home')}">
            <span class="icon">${icons.home}</span>
            <span class="header-label">${pick('خانه', 'Home')}</span>
          </a>

          <a class="header-item" href="/magazine">
            <span class="icon">${icons.article}</span>
            <span class="header-label">${pick('مجله', 'Magazine')}</span>
          </a>

          ${extraHtml}
        </div>

        <a class="header-cta" href="/#request">
          <span class="icon">${icons.plusCircle}</span>
          <span class="header-label">${pick('ثبت درخواست', 'Submit request')}</span>
        </a>

        ${renderThemeToggle()}
        ${renderLangToggle()}

        <a class="header-profile" href="/profile">
          <span class="icon">${icons.user}</span>
          <span class="header-label">${pick('ورود', 'Log in')}</span>
        </a>
      </div>
    </header>
  `;
}

let scrollHandler: (() => void) | null = null;

export function initHeader(settings?: SiteSettings): void {
  initThemeToggle();
  const header = document.querySelector<HTMLElement>('.site-header');
  if (!header) return;

  if (settings) {
    const pill = header.querySelector<HTMLElement>('.header-pill');
    if (pill && !pill.querySelector('.header-extra-item')) {
      const extraLinks = getHeaderExtraLinks(settings);
      if (extraLinks.length) {
        const extraHtml = extraLinks
          .map(
            (l) => `
              <a class="header-item header-extra-item" href="${l.href}">
                <span class="icon">${l.icon}</span>
                <span class="header-label">${l.label}</span>
              </a>
            `,
          )
          .join('');
        pill.insertAdjacentHTML('beforeend', extraHtml);
      }
    }
  }

  if (scrollHandler) window.removeEventListener('scroll', scrollHandler);

  scrollHandler = (): void => {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
    document.body.classList.toggle('page-scrolled', window.scrollY > 200);
  };

  scrollHandler();
  window.addEventListener('scroll', scrollHandler, { passive: true });
}

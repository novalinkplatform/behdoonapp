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
        <button
          type="button"
          class="header-mobile-menu-btn"
          id="header-mobile-menu-btn"
          aria-label="${pick('منوی ناوبری', 'Navigation menu')}"
          title="${pick('منوی ناوبری', 'Navigation menu')}"
        >
          <span class="icon">${icons.menu}</span>
        </button>

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

          <a class="header-item" href="/services">
            <span class="icon">${icons.layers || icons.bolt}</span>
            <span class="header-label">${pick('خدمات', 'Services')}</span>
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

    <div class="mobile-nav-backdrop" id="mobile-nav-backdrop" hidden></div>
    <nav class="mobile-nav-drawer" id="mobile-nav-drawer" hidden aria-label="${pick('منوی ناوبری موبایل', 'Mobile Navigation')}">
      <div class="mobile-nav-header">
        <div class="mobile-nav-brand">
          <span class="mobile-nav-logo">
            <img src="/favicon.svg" alt="" />
          </span>
          <div class="mobile-nav-brand-text">
            <strong>${brandName}</strong>
            <span>${pick('خدمات فنی و ساختمانی در تهران', 'Building services in Tehran')}</span>
          </div>
        </div>
        <button type="button" class="mobile-nav-close-btn" id="mobile-nav-close-btn" aria-label="${pick('بستن منو', 'Close menu')}">
          <span class="icon">${icons.close}</span>
        </button>
      </div>

      <div class="mobile-nav-cta-box">
        <a class="btn btn-primary mobile-nav-request-btn header-cta" href="/#request">
          <span class="icon">${icons.plusCircle}</span>
          <span>${pick('ثبت آنلاین درخواست خدمت', 'Online Service Request')}</span>
        </a>
        <a class="btn btn-secondary mobile-nav-call-btn" href="tel:09333256885">
          <span class="icon">${icons.phone}</span>
          <span>${pick('تماس مستقیم: ۰۹۳۳۳۲۵۶۸۸۵', 'Direct Call: 09333256885')}</span>
        </a>
      </div>

      <div class="mobile-nav-list">
        <a class="mobile-nav-link" href="/">
          <span class="icon">${icons.home}</span>
          <span class="link-text">${pick('صفحه اصلی بهدون', 'Home')}</span>
        </a>
        <a class="mobile-nav-link" href="/services">
          <span class="icon">${icons.layers || icons.bolt}</span>
          <span class="link-text">${pick('کاتالوگ خدمات ساختمانی', 'Services Catalog')}</span>
        </a>
        <a class="mobile-nav-link" href="/orders">
          <span class="icon">${icons.box}</span>
          <span class="link-text">${pick('پیگیری درخواست‌ها و سفارشات', 'My Orders')}</span>
        </a>
        <a class="mobile-nav-link" href="/magazine">
          <span class="icon">${icons.article}</span>
          <span class="link-text">${pick('مجله و دانشنامه تخصصی', 'Magazine')}</span>
        </a>
        <a class="mobile-nav-link" href="/terms">
          <span class="icon">${icons.shield}</span>
          <span class="link-text">${pick('قوانین، مقررات و ضمانت‌نامه', 'Terms & Warranty')}</span>
        </a>
        <a class="mobile-nav-link" href="/privacy">
          <span class="icon">${icons.lock}</span>
          <span class="link-text">${pick('حریم خصوصی و امنیت داده‌ها', 'Privacy Policy')}</span>
        </a>
        <a class="mobile-nav-link" href="/about">
          <span class="icon">${icons.user}</span>
          <span class="link-text">${pick('درباره ما، گواهینامه‌ها و تماس', 'About Us & Contact')}</span>
        </a>
        <a class="mobile-nav-link mobile-nav-profile-link" href="/profile">
          <span class="icon">${icons.user}</span>
          <span class="link-text">${pick('ورود به حساب کاربری من', 'Log in / My Profile')}</span>
        </a>
      </div>

      <div class="mobile-nav-footer">
        <div class="mobile-nav-preferences">
          <div class="mobile-nav-pref-item">
            <span>${pick('حالت پوسته:', 'Theme:')}</span>
            ${renderThemeToggle('mobile-theme-toggle')}
          </div>
          <div class="mobile-nav-pref-item">
            <span>${pick('زبان سامانه:', 'Language:')}</span>
            ${renderLangToggle('mobile-lang-toggle')}
          </div>
        </div>
        <div class="mobile-nav-support-note">
          <span class="icon">${icons.clock}</span>
          <span>${pick('پشتیبانی ۲۴ ساعته در تمامی مناطق ۲۲ گانه تهران', '24/7 Support in All 22 Tehran Districts')}</span>
        </div>
      </div>
    </nav>
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

  // Mobile Drawer toggling
  const menuBtn = document.getElementById('header-mobile-menu-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  const backdrop = document.getElementById('mobile-nav-backdrop');
  const closeBtn = document.getElementById('mobile-nav-close-btn');

  function openDrawer(): void {
    if (!drawer || !backdrop) return;
    backdrop.hidden = false;
    drawer.hidden = false;
    requestAnimationFrame(() => {
      drawer.classList.add('is-open');
      backdrop.classList.add('is-open');
      document.body.classList.add('mobile-drawer-open');
    });
  }

  function closeDrawer(): void {
    if (!drawer || !backdrop) return;
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    document.body.classList.remove('mobile-drawer-open');
    setTimeout(() => {
      if (!drawer.classList.contains('is-open')) {
        drawer.hidden = true;
        backdrop.hidden = true;
      }
    }, 300);
  }

  menuBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    openDrawer();
  });
  closeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeDrawer();
  });
  backdrop?.addEventListener('click', closeDrawer);

  drawer?.querySelectorAll<HTMLAnchorElement>('a').forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  if (scrollHandler) window.removeEventListener('scroll', scrollHandler);

  scrollHandler = (): void => {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
    document.body.classList.toggle('page-scrolled', window.scrollY > 200);
  };

  scrollHandler();
  window.addEventListener('scroll', scrollHandler, { passive: true });
}

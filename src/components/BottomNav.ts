import { icons } from './icons.ts';
import { renderLangToggle } from './LangToggle.ts';
import { renderThemeToggle } from './ThemeToggle.ts';
import { pick } from '../i18n/lang.ts';

export function renderBottomNav(): string {
  return `
    ${renderThemeToggle('theme-toggle-floating')}
    ${renderLangToggle('lang-toggle-floating')}
    <nav class="bottom-nav" aria-label="${pick('ناوبری پایین صفحه', 'Bottom navigation')}">
      <a class="bottom-nav-item" href="/">
        <span class="icon">${icons.home}</span>
        <span>${pick('خانه', 'Home')}</span>
      </a>
      <a class="bottom-nav-item" href="/magazine">
        <span class="icon">${icons.layers}</span>
        <span>${pick('مجله', 'Magazine')}</span>
      </a>
      <a class="bottom-nav-item" href="/orders">
        <span class="icon">${icons.box}</span>
        <span>${pick('درخواست‌ها', 'Orders')}</span>
      </a>
      <button type="button" class="bottom-nav-item" id="bottom-nav-chat-btn">
        <span class="icon">${icons.chat}</span>
        <span>${pick('پیام', 'Message')}</span>
      </button>
      <a class="bottom-nav-item" href="/profile">
        <span class="icon">${icons.user}</span>
        <span>${pick('پروفایل', 'Profile')}</span>
      </a>
    </nav>
  `;
}

export function initBottomNav(): void {
  const items = document.querySelectorAll<HTMLAnchorElement>('.bottom-nav-item[href]');
  const path = location.pathname;

  // Only one icon should ever become the active bubble, so the first
  // matching item wins and the rest stay plain.
  for (const item of items) {
    const hrefPath = (item.getAttribute('href') ?? '/').split('#')[0] || '/';
    const isActive = hrefPath === '/' ? path === '/' : path.startsWith(hrefPath);
    if (isActive) {
      item.classList.add('is-active');
      break;
    }
  }

  document.getElementById('bottom-nav-chat-btn')?.addEventListener('click', () => {
    document.getElementById('chat-widget-toggle')?.click();
  });
}

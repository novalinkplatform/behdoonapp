import { icons } from './icons.ts';
import { pick } from '../i18n/lang.ts';

export function renderThemeToggle(extraClass = ''): string {
  return `
    <button type="button" class="theme-toggle ${extraClass}" data-theme-toggle aria-label="${pick('تغییر تم شب/روز', 'Toggle theme')}" title="${pick('تغییر حالت شب/روز (تم سبز تیره شیشه‌ای)', 'Toggle Dark/Light theme')}">
      <span class="icon icon-theme-sun" data-theme-sun hidden>${icons.sun}</span>
      <span class="icon icon-theme-moon" data-theme-moon>${icons.moon}</span>
    </button>
  `;
}

export function syncThemeToggleUI(): void {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.querySelectorAll<HTMLElement>('[data-theme-sun]').forEach((el) => {
    el.hidden = !isDark;
  });
  document.querySelectorAll<HTMLElement>('[data-theme-moon]').forEach((el) => {
    el.hidden = isDark;
  });
}

export function initThemeToggle(): void {
  syncThemeToggleUI();

  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('behbar_theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('behbar_theme', 'dark');
      }
      syncThemeToggleUI();
    });
  });
}

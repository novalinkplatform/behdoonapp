import { getLang, setLang } from '../i18n/lang.ts';

export function renderLangToggle(extraClass = ''): string {
  const lang = getLang();
  return `
    <button type="button" class="lang-toggle ${extraClass}" data-lang-toggle aria-label="Switch language / تغییر زبان">
      <span data-lang-option="fa" class="${lang === 'fa' ? 'is-active' : ''}">فا</span>
      <span data-lang-option="en" class="${lang === 'en' ? 'is-active' : ''}">EN</span>
    </button>
  `;
}

export function initLangToggle(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-lang-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setLang(getLang() === 'fa' ? 'en' : 'fa');
    });
  });
}

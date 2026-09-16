import { forceLang, getLang } from './lang.ts';
import type { Lang } from './lang.ts';

export type LanguageMode = 'both' | 'fa' | 'en';

// باید قبل از renderApp صدا زده شود — چون pick(fa,en) در همان لحظه‌ی رندر ارزیابی می‌شود؛ اگر بعد از
// renderApp صدا زده شود، محتوا از قبل با زبان اشتباه رندر شده و فقط جهت سند عوض می‌شود، نه متن.
export function forceSiteLanguageIfSingleMode(mode?: LanguageMode): void {
  if (!mode || mode === 'both') return;
  if (getLang() !== (mode as Lang)) forceLang(mode as Lang);
}

// باید بعد از renderApp صدا زده شود — چون دکمه‌ی تعویض زبان داخل هدر/ناوبری پایین است که renderApp می‌سازد.
export function hideLanguageToggleIfSingleMode(mode?: LanguageMode): void {
  if (!mode || mode === 'both') return;
  document.querySelectorAll<HTMLElement>('[data-lang-toggle]').forEach((el) => {
    el.style.display = 'none';
  });
}

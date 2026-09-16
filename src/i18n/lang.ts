export type Lang = 'fa' | 'en';

const STORAGE_KEY = 'behbar_lang';

// در بیلد خوداستقرار (Docker)، VITE_DEFAULT_LANG روی 'en' ست می‌شود — چون خریدارهای این نسخه لزوماً مخاطب
// فارسی‌زبان ندارند. نسخه‌ی خود فروشنده روی کلادفلر بدون این متغیر ساخته می‌شود و مثل همیشه فارسی می‌ماند.
function detectInitialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'fa' || stored === 'en') return stored;
  } catch {
    /* localStorage unavailable — از env fallback بگیر */
  }
  return import.meta.env.VITE_DEFAULT_LANG === 'en' ? 'en' : 'fa';
}

let currentLang: Lang = detectInitialLang();
const listeners = new Set<(lang: Lang) => void>();

export function getLang(): Lang {
  return currentLang;
}

export function applyDocumentDirection(): void {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'fa' ? 'rtl' : 'ltr';
}

export function setLang(lang: Lang): void {
  if (lang === currentLang) return;
  currentLang = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* non-critical */
  }
  applyDocumentDirection();
  listeners.forEach((cb) => cb(lang));
}

// مثل setLang ولی به listenerها (که init صفحه هم یکی از آن‌هاست) خبر نمی‌دهد — برای اعمال زبان تک‌زبانه‌ی
// سایت درست قبل از renderApp داخل همان init فراخوانی می‌شود؛ اگر از setLang استفاده می‌شد، init دوباره از
// طریق listener خودش فراخوانی می‌شد (رندر دوباره‌ی کل صفحه و بایند دوباره‌ی event listenerها).
export function forceLang(lang: Lang): void {
  if (lang === currentLang) return;
  currentLang = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* non-critical */
  }
  applyDocumentDirection();
}

export function onLangChange(cb: (lang: Lang) => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Pick the Persian or English value based on the current language. */
export function pick<T>(fa: T, en: T): T {
  return currentLang === 'fa' ? fa : en;
}

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/** Language-aware digit formatting: Persian digits in fa mode, plain digits in en mode. */
export function localeDigits(value: number | string): string {
  const str = String(value);
  if (currentLang !== 'fa') return str;
  return str.replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

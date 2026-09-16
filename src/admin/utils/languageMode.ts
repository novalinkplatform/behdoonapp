import { fetchSettings } from './api.ts';

export type LanguageMode = 'both' | 'fa' | 'en';

let cached: LanguageMode | null = null;
let inflight: Promise<LanguageMode> | null = null;

// اولین باری که هرکدام از ویوهای دارای فیلد فارسی/انگلیسی صدا می‌زنند واقعاً fetch می‌کند؛ باقی ویوها
// (و همان ویو در رندرهای بعدی) همان مقدار کش‌شده را می‌گیرند — مثل الگوی loadSettings در سایت مشتری.
export async function ensureLanguageMode(): Promise<LanguageMode> {
  if (cached) return cached;
  if (inflight) return inflight;
  inflight = fetchSettings()
    .then((s) => {
      cached = (s.language_mode as LanguageMode | undefined) ?? 'both';
      return cached;
    })
    .catch(() => 'both' as LanguageMode);
  return inflight;
}

export function getLanguageMode(): LanguageMode {
  return cached ?? 'both';
}

// روی هر فیلد فارسی/انگلیسی (یا wrapper آن) گذاشته می‌شود: data-i18n="fa" یا data-i18n="en".
// اگر سایت تک‌زبانه باشد، فیلد زبان دیگر مخفی می‌شود؛ برای سایت دوزبانه هیچ تغییری اعمال نمی‌شود.
// همیشه بعد از ensureLanguageMode() و بعد از رندرشدن آن markup صدا زده شود.
export function applyLanguageVisibility(root: ParentNode): void {
  const mode = getLanguageMode();
  if (mode === 'both') return;
  root.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    el.hidden = el.dataset.i18n !== mode;
  });
}

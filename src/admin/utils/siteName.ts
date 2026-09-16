import { fetchSettings } from './api.ts';

// روی صفحه‌ی ورود (پیش از احراز هویت)، سایدبار پنل و پرتال کارمندان صدا زده می‌شود — هرجا که «بهدون»
// به‌صورت ثابت در کد نوشته شده، با نام واقعی سایتِ خریدار جایگزین می‌شود (اگر تنظیم شده باشد).
export async function applySiteNameToAdminChrome(): Promise<void> {
  try {
    const settings = await fetchSettings();
    const siteName = settings.site_name as { fa?: string; en?: string } | undefined;
    const name = siteName?.fa?.trim();
    if (!name || name === 'بهدون' || name === 'بهبار') return;

    document.querySelectorAll<HTMLElement>('#login-brand-text, .admin-logo-title, #staff-portal-brand-text').forEach((el) => {
      if (el.textContent?.includes('بهدون')) {
        el.textContent = el.textContent.replace(/بهدون/g, name);
      } else if (el.textContent?.includes('بهبار')) {
        el.textContent = el.textContent.replace(/بهبار/g, name);
      }
    });
  } catch {
    /* بی‌اهمیت — نام پیش‌فرض می‌ماند */
  }
}

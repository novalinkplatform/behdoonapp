import { API_BASE_URL } from '../data/config.ts';

// اگر اپ اندرویدی سایت را در وب‌ویو باز کرده باشد، یک شیء «Android» با این متدها در window تزریق
// می‌کند تا اپ بومی بتواند سرویس اتصال زنده‌ی اعلان را بر اساس نشست واقعی مشتری برقرار/قطع کند —
// در مرورگر معمولی window.Android وجود ندارد و این توابع کاملاً بی‌اثرند.
interface AndroidBridge {
  setApiBase?(url: string): void;
  setAuthToken?(token: string): void;
  clearAuthToken?(): void;
}

declare global {
  interface Window {
    Android?: AndroidBridge;
  }
}

export function notifyNativeApiBase(): void {
  try {
    window.Android?.setApiBase?.(API_BASE_URL || window.location.origin);
  } catch {
    /* بدون اپ بومی، بی‌اهمیت */
  }
}

export function notifyNativeSession(token: string | null): void {
  try {
    if (token) window.Android?.setAuthToken?.(token);
    else window.Android?.clearAuthToken?.();
  } catch {
    /* بدون اپ بومی، بی‌اهمیت */
  }
}

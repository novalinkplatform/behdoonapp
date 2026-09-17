import { icons } from './icons.ts';

// فقط وقتی staff.licenseLocked واقعاً true باشد رندر می‌شود (Shell.ts/StaffPortalView.ts) — یعنی فقط
// روی نصب خوداستقرارِ بدون لایسنس معتبر (آزمایشی تمام‌شده یا هیچ‌کدام). عمداً بستنی ندارد: این یک
// وضعیت واقعی و در حال اعمال است (سرور هم واقعاً نوشتن را رد می‌کند)، نه یک اعلان قابل نادیده‌گرفتن.
export function renderLicenseLockBanner(): string {
  return `
    <div class="license-lock-banner">
      <span class="icon">${icons.lock}</span>
      <span>دسترسی به برخی امکانات محدود شده است — لطفاً با مدیریت سامانه بهدون تماس بگیرید.</span>
    </div>
  `;
}

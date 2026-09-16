import { icons } from './icons.ts';

// فقط وقتی staff.licenseLocked واقعاً true باشد رندر می‌شود (Shell.ts/StaffPortalView.ts) — یعنی فقط
// روی نصب خوداستقرارِ بدون لایسنس معتبر (آزمایشی تمام‌شده یا هیچ‌کدام). عمداً بستنی ندارد: این یک
// وضعیت واقعی و در حال اعمال است (سرور هم واقعاً نوشتن را رد می‌کند)، نه یک اعلان قابل نادیده‌گرفتن.
export function renderLicenseLockBanner(): string {
  return `
    <div class="license-lock-banner">
      <span class="icon">${icons.lock}</span>
      <span>دوره‌ی آزمایشی این نصب به پایان رسیده — تا خرید لایسنس، فقط امکان مشاهده دارید.</span>
      <a class="btn btn-primary btn-sm" href="https://behbarapp.ir/sale" target="_blank" rel="noopener noreferrer">خرید لایسنس</a>
    </div>
  `;
}

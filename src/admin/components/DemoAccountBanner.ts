import { icons } from './icons.ts';

// فقط برای همان یک حساب عمومی «test» که از صفحه‌ی فروش (behbarapp.ir/sale) لینک داده شده — عمداً به
// شرط username==='test' وابسته است، نه به is_read_only به‌تنهایی، چون is_read_only ممکن است بعداً
// برای یک نقش واقعی و غیرآزمایشی هم استفاده شود (مثلاً یک حسابدار)؛ آن حساب‌ها «آزمایشی» نیستند.
export function renderDemoAccountBanner(): string {
  return `
    <div class="demo-account-banner">
      <span class="icon">${icons.eye}</span>
      <span>حساب کاربری آزمایشی بهدون با دسترسی مدیریتی کامل برای بررسی و آزمایش تمامی امکانات سامانه.</span>
    </div>
  `;
}

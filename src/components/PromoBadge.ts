import { icons } from './icons.ts';

// این نشان فقط تبلیغ فروش خودِ قالب در بازارچه‌ی «ژاکت» است — مخصوص دمو/سایت خودمان، نه بخشی از
// محصولی که خریدار تحویل می‌گیرد. بدون ست‌کردن VITE_DEMO_PROMO_URL (که فقط در build:demo ست می‌شود،
// نگاه کنید: package.json) این تابع رشته‌ی خالی برمی‌گرداند و هیچ نشانی رندر نمی‌شود — و چون CSS آن
// هم (برخلاف بقیه‌ی کامپوننت‌ها) این‌جا به‌جای main.css به‌صورت رشته تزریق می‌شود، در بیلد عادی
// (npm run build، بدون این متغیر) نه HTML آن نه حتی یک بایت از استایلش وارد کد خریدار نمی‌شود.
const STYLE_ID = 'demo-promo-badge-style';

const CSS = `
.demo-promo-badge {
  position: fixed;
  top: 96px;
  left: 16px;
  z-index: 140;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px;
  border-radius: var(--radius-full);
  background: linear-gradient(120deg, #ff7a30, #ffab4d, #ff5a2e, #ffab4d);
  background-size: 300% 300%;
  animation: demo-promo-wave 6s ease infinite, demo-promo-heartbeat 2.4s ease-in-out infinite;
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  text-decoration: none;
  box-shadow: 0 8px 22px rgba(255, 90, 30, 0.35);
  transition: transform var(--transition-fast);
}
.demo-promo-badge:hover {
  transform: translateY(-2px);
}
.demo-promo-badge-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 21px;
  height: 21px;
  flex-shrink: 0;
}
.demo-promo-badge-icon svg {
  width: 100%;
  height: 100%;
}
.demo-promo-badge-text {
  display: none;
}
@keyframes demo-promo-wave {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes demo-promo-heartbeat {
  0%, 100% { box-shadow: 0 8px 22px rgba(255, 90, 30, 0.35), 0 0 0 0 rgba(255, 90, 30, 0.45); }
  50% { box-shadow: 0 8px 22px rgba(255, 90, 30, 0.35), 0 0 0 9px rgba(255, 90, 30, 0); }
}
@media (min-width: 1280px) {
  .demo-promo-badge { padding: 0.65rem 1rem; }
  .demo-promo-badge-text { display: inline; }
}
@media (max-width: 768px) {
  .demo-promo-badge { top: 14px; }
}
@media (prefers-reduced-motion: reduce) {
  .demo-promo-badge { animation: none; }
}
`;

export function renderPromoBadge(): string {
  const link = import.meta.env.VITE_DEMO_PROMO_URL as string | undefined;
  if (!link) return '';

  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  return `
    <a class="demo-promo-badge" href="${link}" target="_blank" rel="noopener noreferrer" aria-label="خرید از ژاکت">
      <span class="demo-promo-badge-icon">${icons.box}</span>
      <span class="demo-promo-badge-text">خرید از ژاکت</span>
    </a>
  `;
}

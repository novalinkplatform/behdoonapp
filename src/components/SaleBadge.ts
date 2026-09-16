import { icons } from './icons.ts';

// نشان دوم، سبز، درست زیر نشان نارنجی («خرید از ژاکت» در PromoBadge.ts) — این یکی مستقیم به صفحه‌ی
// فروش خودمان (sale.html) لینک می‌شود. همان قاعده‌ی «فقط دمو»: بدون VITE_DEMO_SALE_URL نه رندر
// می‌شود نه حتی یک بایت از CSSاش وارد کد خریدار می‌شود (چون CSS هم این‌جا به‌جای main.css به‌صورت
// رشته تزریق می‌شود). همین متغیر در vite.config.ts هم تعیین می‌کند که آیا خود sale.html اصلاً بیلد شود.
const STYLE_ID = 'demo-sale-badge-style';

const CSS = `
.demo-sale-badge {
  position: fixed;
  top: 150px;
  left: 16px;
  z-index: 140;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px;
  border-radius: var(--radius-full);
  background: linear-gradient(120deg, #16a34a, #4ade80, #15803d, #4ade80);
  background-size: 300% 300%;
  animation: demo-sale-wave 6s ease infinite, demo-sale-heartbeat 2.4s ease-in-out infinite;
  animation-delay: 0s, 1.2s;
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  text-decoration: none;
  box-shadow: 0 8px 22px rgba(21, 128, 61, 0.35);
  transition: transform var(--transition-fast);
}
.demo-sale-badge:hover {
  transform: translateY(-2px);
}
.demo-sale-badge-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 21px;
  height: 21px;
  flex-shrink: 0;
}
.demo-sale-badge-icon svg {
  width: 100%;
  height: 100%;
}
.demo-sale-badge-text {
  display: none;
}
@keyframes demo-sale-wave {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes demo-sale-heartbeat {
  0%, 100% { box-shadow: 0 8px 22px rgba(21, 128, 61, 0.35), 0 0 0 0 rgba(21, 128, 61, 0.45); }
  50% { box-shadow: 0 8px 22px rgba(21, 128, 61, 0.35), 0 0 0 9px rgba(21, 128, 61, 0); }
}
@media (min-width: 1280px) {
  .demo-sale-badge { padding: 0.65rem 1rem; }
  .demo-sale-badge-text { display: inline; }
}
@media (max-width: 768px) {
  .demo-sale-badge { top: 68px; }
}
@media (prefers-reduced-motion: reduce) {
  .demo-sale-badge { animation: none; }
}
`;

export function renderSaleBadge(): string {
  const link = import.meta.env.VITE_DEMO_SALE_URL as string | undefined;
  if (!link) return '';

  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  return `
    <a class="demo-sale-badge" href="${link}" aria-label="معرفی بهدون">
      <span class="demo-sale-badge-icon">${icons.badge}</span>
      <span class="demo-sale-badge-text">معرفی بهدون</span>
    </a>
  `;
}

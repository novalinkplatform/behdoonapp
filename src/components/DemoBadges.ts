import { icons } from './icons.ts';

const STYLE_ID = 'demo-badges-style';

const CSS = `
.demo-badges-wrapper {
  position: fixed;
  top: 14px;
  left: 16px;
  z-index: 170;
  display: flex;
  align-items: center;
  gap: 8px;
  pointer-events: auto;
  direction: rtl;
}

.demo-sale-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 42px;
  padding: 0 14px;
  border-radius: var(--radius-header, 9999px);
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
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.demo-sale-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 26px rgba(21, 128, 61, 0.45);
}

.demo-sale-badge-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 19px;
  height: 19px;
  flex-shrink: 0;
}

.demo-sale-badge-icon svg {
  width: 100%;
  height: 100%;
}

.demo-sale-badge-text {
  display: inline;
}

.demo-promo-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 42px;
  padding: 0 14px;
  border-radius: var(--radius-header, 9999px);
  background: linear-gradient(120deg, #ff7a30, #ffab4d, #ff5a2e, #ffab4d);
  background-size: 300% 300%;
  animation: demo-promo-wave 6s ease infinite, demo-promo-heartbeat 2.4s ease-in-out infinite;
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  text-decoration: none;
  box-shadow: 0 8px 22px rgba(255, 90, 30, 0.35);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.demo-promo-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 26px rgba(255, 90, 30, 0.45);
}

.demo-promo-badge-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 19px;
  height: 19px;
  flex-shrink: 0;
}

.demo-promo-badge-icon svg {
  width: 100%;
  height: 100%;
}

.demo-promo-badge-text {
  display: inline;
}

@keyframes demo-sale-wave {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes demo-sale-heartbeat {
  0%, 100% { box-shadow: 0 8px 22px rgba(21, 128, 61, 0.35), 0 0 0 0 rgba(21, 128, 61, 0.45); }
  50% { box-shadow: 0 8px 22px rgba(21, 128, 61, 0.35), 0 0 0 8px rgba(21, 128, 61, 0); }
}

@keyframes demo-promo-wave {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes demo-promo-heartbeat {
  0%, 100% { box-shadow: 0 8px 22px rgba(255, 90, 30, 0.35), 0 0 0 0 rgba(255, 90, 30, 0.45); }
  50% { box-shadow: 0 8px 22px rgba(255, 90, 30, 0.35), 0 0 0 8px rgba(255, 90, 30, 0); }
}

@media (max-width: 1100px) and (min-width: 769px) {
  .demo-sale-badge, .demo-promo-badge {
    padding: 0 10px;
    font-size: 0.8rem;
    gap: 5px;
  }
}

@media (max-width: 768px) {
  .demo-badges-wrapper {
    position: relative;
    top: auto;
    left: auto;
    margin: 64px auto 12px;
    justify-content: center;
    gap: 8px;
    z-index: 10;
    padding-inline: 16px;
  }
  .demo-sale-badge, .demo-promo-badge {
    height: 32px;
    padding: 0 10px;
    font-size: 0.76rem;
    gap: 5px;
  }
  .demo-sale-badge-icon, .demo-promo-badge-icon {
    width: 15px;
    height: 15px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .demo-sale-badge, .demo-promo-badge {
    animation: none;
  }
}
`;

export function renderDemoBadges(): string {
  const saleLink = import.meta.env.VITE_DEMO_SALE_URL as string | undefined;
  const promoLink = import.meta.env.VITE_DEMO_PROMO_URL as string | undefined;
  if (!saleLink && !promoLink) return '';

  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  return `
    <div class="demo-badges-wrapper">
      ${saleLink ? `
        <a class="demo-sale-badge" href="${saleLink}" aria-label="معرفی بهدون">
          <span class="demo-sale-badge-icon">${icons.badge}</span>
          <span class="demo-sale-badge-text">معرفی بهدون</span>
        </a>
      ` : ''}
      ${promoLink ? `
        <a class="demo-promo-badge" href="${promoLink}" target="_blank" rel="noopener noreferrer" aria-label="خرید از ژاکت">
          <span class="demo-promo-badge-icon">${icons.box}</span>
          <span class="demo-promo-badge-text">خرید از ژاکت</span>
        </a>
      ` : ''}
    </div>
  `;
}

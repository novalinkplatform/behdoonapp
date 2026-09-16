import { icons } from './icons.ts';
import { renderFloatingCallButton } from './FloatingCallButton.ts';
import { renderFloatingWhatsAppButton } from './FloatingWhatsAppButton.ts';
import { renderChatWidget, initChatWidget } from './ChatWidget.ts';
import { pick } from '../i18n/lang.ts';
import type { SiteSettings } from '../utils/dynamicContent.ts';

const SIDE_STORAGE_KEY = 'behbar_quick_actions_side';

export function getQuickActionsSide(defaultSide: 'left' | 'right' = 'right'): 'left' | 'right' {
  const saved = localStorage.getItem(SIDE_STORAGE_KEY);
  if (saved === 'left' || saved === 'right') return saved;
  return defaultSide;
}

export function setQuickActionsSide(side: 'left' | 'right'): void {
  if (side === 'left') {
    document.documentElement.classList.add('quick-actions-left');
    document.documentElement.classList.remove('quick-actions-right');
  } else {
    document.documentElement.classList.add('quick-actions-right');
    document.documentElement.classList.remove('quick-actions-left');
  }
}

export function renderQuickActions(settings?: SiteSettings): string {
  return `
    <div class="header-quick-actions" id="header-quick-actions">
      <button
        type="button"
        class="quick-actions-side-toggle"
        id="quick-actions-side-toggle"
        aria-label="${pick('تغییر سمت دکمه‌ها (چپ / راست)', 'Switch button position (left / right)')}"
        title="${pick('تغییر سمت دکمه‌ها (چپ / راست)', 'Switch button position (left / right)')}"
      >
        <span class="icon">${icons.arrowLeftRight}</span>
      </button>
      ${renderFloatingCallButton(settings)}
      ${renderFloatingWhatsAppButton(settings)}
      ${renderChatWidget()}
    </div>
  `;
}

export function initQuickActions(_settings?: SiteSettings): void {
  initChatWidget();

  const toggleBtn = document.getElementById('quick-actions-side-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentIsLeft = document.documentElement.classList.contains('quick-actions-left');
      const nextSide = currentIsLeft ? 'right' : 'left';
      setQuickActionsSide(nextSide);
      localStorage.setItem(SIDE_STORAGE_KEY, nextSide);
    });
  }
}

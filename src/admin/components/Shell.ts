import { icons } from './icons.ts';
import type { StaffInfo } from '../utils/auth.ts';
import { hasPermission } from '../utils/auth.ts';
import { renderAiWidget } from './AiWidget.ts';
import { renderLicenseLockBanner } from './LicenseLockBanner.ts';
import { renderDemoAccountBanner } from './DemoAccountBanner.ts';

export function renderShell(staff: StaffInfo): string {
  return `
    <div class="admin-shell">
      <header class="admin-topbar">
        <div class="admin-topbar-start">
          <button type="button" class="admin-back-btn" id="admin-back-btn" hidden>
            <span class="icon">${icons.arrowRight}</span>
            <span>بازگشت</span>
          </button>
          <div class="admin-logo" id="admin-logo-btn" role="button" tabindex="0" title="صفحه اصلی">
            <img class="admin-logo-mark" src="/favicon.svg" alt="" />
            <span class="admin-logo-title">بهدون</span>
          </div>
        </div>
        <div class="admin-topbar-end">
          <span class="admin-topbar-version" id="admin-sidebar-version" hidden></span>
          <button type="button" class="admin-topbar-icon-btn admin-theme-toggle" id="admin-theme-toggle-btn" title="تغییر حالت تم (روشن بنفش شیشه‌ای / بنفش تیره شیشه‌ای)" aria-label="تغییر حالت تم">
            <span class="icon icon-theme-sun" id="admin-theme-sun" hidden>${icons.sun}</span>
            <span class="icon icon-theme-moon" id="admin-theme-moon">${icons.moon}</span>
          </button>
          <button type="button" class="admin-topbar-user" id="admin-account-btn" title="امنیت حساب">${staff.fullName} · ${staff.roleLabel}</button>
          <button type="button" class="admin-nav-item admin-logout" id="logout-btn">
            <span class="icon">${icons.logout}</span>
            <span>خروج</span>
          </button>
        </div>
      </header>
      ${staff.licenseLocked ? renderLicenseLockBanner() : ''}
      ${staff.username === 'test' ? renderDemoAccountBanner() : ''}
      <main class="admin-main">
        <div id="view-container"></div>
      </main>
      ${hasPermission(staff, 'ai') ? renderAiWidget() : ''}
    </div>
  `;
}

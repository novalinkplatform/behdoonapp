import { icons } from './icons.ts';
import type { StaffInfo, Permission } from '../utils/auth.ts';
import { hasPermission } from '../utils/auth.ts';
import { renderLicenseLockBanner } from './LicenseLockBanner.ts';
import { renderDemoAccountBanner } from './DemoAccountBanner.ts';

interface NavItem {
  screen: string;
  label: string;
  icon: string;
  permission?: Permission;
  badge?: string;
  badgeClass?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export function renderShell(staff: StaffInfo): string {
  const groups: NavGroup[] = [
    {
      title: 'پیشخوان و عملیات',
      items: [
        { screen: 'home', label: 'مرکز مدیریت', icon: icons.home },
        { screen: 'pipeline', label: 'پایپ‌لاین سفارش‌ها', icon: icons.columns, permission: 'pipeline' },
        { screen: 'map', label: 'نقشه درخواست‌ها', icon: icons.map, permission: 'map' },
        { screen: 'dashboard', label: 'داشبورد تحلیلی', icon: icons.chart, permission: 'dashboard' },
      ],
    },
    {
      title: 'خدمات و ارتباطات',
      items: [
        { screen: 'services', label: 'مدیریت خدمات و قیمت‌ها', icon: icons.wrench, permission: 'settings' },
        { screen: 'chat', label: 'چت و پشتیبانی برخط', icon: icons.chat, permission: 'chat' },
        { screen: 'contact-manager', label: 'اطلاعات تماس و شبکه‌ها', icon: icons.phone, permission: 'settings' },
      ],
    },
    {
      title: 'محتوا و وب‌سایت',
      items: [
        { screen: 'magazine', label: 'مجله و مقالات تخصصی', icon: icons.article, permission: 'content' },
        { screen: 'stories', label: 'استوری‌های تصویری', icon: icons.story, permission: 'stories' },
        { screen: 'testimonials', label: 'نظرات مشتریان', icon: icons.message, permission: 'content' },
        { screen: 'sliders', label: 'اسلایدر و بنرها', icon: icons.image, permission: 'content' },
        { screen: 'seo', label: 'بهینه‌سازی سئو', icon: icons.seo, permission: 'seo' },
        { screen: 'media', label: 'مدیریت فایل و رسانه', icon: icons.image, permission: 'content' },
      ],
    },
    {
      title: 'پرسنل، مالی و سامانه',
      items: [
        { screen: 'staff', label: 'تکنسین‌ها و همکاران', icon: icons.users, permission: 'staff' },
        { screen: 'jobApplications', label: 'فرصت‌های شغلی و استخدام', icon: icons.briefcase, permission: 'recruitment' },
        { screen: 'finance', label: 'مدیریت مالی و تراکنش‌ها', icon: icons.finance, permission: 'dashboard' },
        { screen: 'payroll', label: 'حقوق و تسویه‌حساب', icon: icons.wallet, permission: 'wallet' },
        { screen: 'roles', label: 'سطوح دسترسی و اختیارات', icon: icons.lock, permission: 'roles' },
        { screen: 'ai', label: 'هوشواره هوشمند بهدون', icon: icons.ai },
        { screen: 'settings', label: 'تنظیمات کلی سامانه', icon: icons.settings, permission: 'settings' },
        { screen: 'plugins', label: 'افزونه‌ها و اتصالات', icon: icons.plugin, permission: 'plugins' },
        { screen: 'activityLog', label: 'گزارش رویدادها و لاگ', icon: icons.history, permission: 'staff' },
      ],
    },
  ];

  // فیلتر کردن آیتم‌ها بر اساس دسترسی
  const visibleGroups = groups
    .map((group) => {
      const filtered = group.items.filter((item) => {
        if (!item.permission) return true;
        return hasPermission(staff, item.permission);
      });
      return { ...group, items: filtered };
    })
    .filter((group) => group.items.length > 0);

  const initials = staff.fullName.trim().split(' ').map((s) => s[0]).filter(Boolean).slice(0, 2).join('') || 'مدیر';

  return `
    <div class="admin-layout" id="admin-layout">
      <!-- لایه پس‌زمینه برای سایدبار در موبایل -->
      <div class="admin-sidebar-overlay" id="admin-sidebar-overlay"></div>

      <!-- نوار ناوبری جانبی Tidewell (Slate / Deep Petrol) -->
      <aside class="admin-sidebar" id="admin-sidebar">
        <div class="admin-sidebar-header">
          <div class="admin-brand" id="admin-logo-btn" role="button" tabindex="0" title="پیشخوان مدیریت بهدون">
            <div class="admin-brand-icon">
              <svg viewBox="0 0 26 26" fill="none" class="admin-brand-mark-svg">
                <path d="M4 15.5c2.6-2.2 5.2-2.2 7.8 0s5.2 2.2 7.8 0" stroke="#eef8fa" stroke-width="2.4" stroke-linecap="round"/>
                <path d="M4 20.5c2.6-2.2 5.2-2.2 7.8 0s5.2 2.2 7.8 0" stroke="#eef8fa" stroke-opacity=".55" stroke-width="2.4" stroke-linecap="round"/>
                <path d="M13 4.5l4.2 6.2H8.8z" fill="#eef8fa"/>
              </svg>
            </div>
            <div class="admin-brand-info">
              <span class="admin-brand-name">بهدون</span>
            </div>
          </div>
          <button type="button" class="admin-sidebar-toggle-btn" id="admin-sidebar-collapse-btn" title="تغییر اندازه سایدبار" aria-label="بستن یا باز کردن سایدبار">
            <span class="icon">${icons.sidebarToggle}</span>
          </button>
        </div>

        <div class="admin-sidebar-search">
          <div class="admin-search-wrapper">
            <span class="icon">${icons.search}</span>
            <input type="text" id="admin-nav-filter" placeholder="جستجوی سریع..." autocomplete="off" />
            <span class="kbd"><kbd>Ctrl</kbd><kbd>K</kbd></span>
          </div>
        </div>

        <nav class="admin-sidebar-nav" id="admin-sidebar-nav">
          ${visibleGroups
            .map(
              (group) => `
            <div class="admin-nav-group">
              <span class="admin-nav-group-title">${group.title}</span>
              <div class="admin-nav-group-items">
                ${group.items
                  .map(
                    (item) => `
                  <button type="button" class="admin-nav-item" data-nav-screen="${item.screen}" title="${item.label}">
                    <span class="admin-nav-icon">${item.icon}</span>
                    <span class="admin-nav-text">${item.label}</span>
                    ${item.badge ? `<span class="admin-nav-badge ${item.badgeClass || ''}">${item.badge}</span>` : ''}
                  </button>
                `
                  )
                  .join('')}
              </div>
            </div>
          `
            )
            .join('')}

        </nav>

        <div class="admin-sidebar-footer">
          <div class="admin-user-card" id="admin-account-btn" role="button" tabindex="0" title="تنظیمات و امنیت حساب">
            <div class="admin-user-avatar">${initials}</div>
            <div class="admin-user-meta">
              <span class="admin-user-name">${staff.fullName}</span>
              <span class="admin-user-role">${staff.roleLabel}</span>
            </div>
          </div>
          <div class="admin-sidebar-quick-actions">
            <button type="button" class="admin-sidebar-icon-btn admin-theme-toggle" id="admin-theme-toggle-btn" title="تغییر تم" aria-label="تغییر تم">
              <span class="icon icon-theme-sun" id="admin-theme-sun" hidden>${icons.sun}</span>
              <span class="icon icon-theme-moon" id="admin-theme-moon">${icons.moon}</span>
            </button>
            <button type="button" class="admin-sidebar-icon-btn admin-logout-btn" id="logout-btn" title="خروج از حساب کاربری" aria-label="خروج">
              <span class="icon">${icons.logout}</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- بخش اصلی محتوا (Main Canvas) -->
      <div class="admin-main-wrapper">
        <!-- تاپ‌بار استاندارد Tidewell -->
        <header class="admin-topbar">
          <div class="admin-topbar-start">
            <button type="button" class="admin-mobile-menu-btn" id="admin-menu-toggle" aria-label="منوی گزینه‌ها">
              <span class="icon">${icons.menu}</span>
            </button>

            <button type="button" class="admin-back-btn" id="admin-back-btn" hidden title="بازگشت به بخش قبلی">
              <span class="icon">${icons.arrowRight}</span>
              <span>بازگشت</span>
            </button>

            <nav class="admin-breadcrumbs" id="admin-breadcrumbs" aria-label="مسیر جاری">
              <span class="breadcrumb-item" data-nav-screen="home" role="button" tabindex="0" title="بازگشت به پیشخوان">
                <span class="icon">${icons.home}</span>
                <span>بهدون</span>
              </span>
              <span class="breadcrumb-separator">/</span>
              <span class="breadcrumb-current" id="admin-crumb-current">پیشخوان مدیریت</span>
            </nav>
          </div>

          <div class="admin-topbar-end">
            <div class="admin-topbar-clock" id="admin-topbar-clock" title="زمان محلی سرور">
              <span class="topbar-live-dot"></span>
              <span id="admin-clock-text">--:--</span>
            </div>

            <a href="/" target="_blank" rel="noopener" class="admin-topbar-action-link" title="مشاهده وب‌سایت بهدون">
              <span class="icon">${icons.externalLink}</span>
              <span class="action-text">مشاهده وب‌سایت</span>
            </a>

            <button type="button" class="admin-topbar-icon-btn admin-topbar-theme-btn" id="admin-topbar-theme-toggle" title="تغییر تم">
              <span class="icon icon-theme-sun" id="admin-topbar-theme-sun" hidden>${icons.sun}</span>
              <span class="icon icon-theme-moon" id="admin-topbar-theme-moon">${icons.moon}</span>
            </button>
          </div>
        </header>

        ${staff.licenseLocked ? renderLicenseLockBanner() : ''}
        ${staff.username === 'test' ? renderDemoAccountBanner() : ''}

        <!-- کانتینر پویا برای نمایش ویوها با بوم اسلیت Tidewell -->
        <main class="admin-main-content">
          <div id="view-container" class="admin-view-container"></div>
        </main>
      </div>
    </div>
  `;
}

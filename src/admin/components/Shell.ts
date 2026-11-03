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
      title: 'پیشخوان و تحلیل',
      items: [
        { screen: 'home', label: 'مرکز فرماندهی', icon: icons.home },
        { screen: 'dashboard', label: 'داشبورد تحلیلی', icon: icons.chart, permission: 'dashboard' },
        { screen: 'dashboardOrders', label: 'آمار سفارش‌ها', icon: icons.chart, permission: 'dashboard' },
        { screen: 'dashboardVisitors', label: 'بازدیدکنندگان', icon: icons.eye, permission: 'dashboard' },
        { screen: 'dashboardStaff', label: 'عملکرد تکنسین‌ها', icon: icons.users, permission: 'dashboard' },
      ],
    },
    {
      title: 'عملیات و سفارش‌ها',
      items: [
        { screen: 'pipeline', label: 'پیگیری مراحل سفارش', icon: icons.columns, permission: 'pipeline', badge: 'زنده', badgeClass: 'badge-live' },
        { screen: 'map', label: 'نقشه هوشمند درخواست‌ها', icon: icons.map, permission: 'map' },
      ],
    },
    {
      title: 'خدمات و ارتباطات',
      items: [
        { screen: 'services', label: 'مدیریت خدمات و قیمت‌ها', icon: icons.wrench, permission: 'settings' },
        { screen: 'chat', label: 'گفتگوی آنلاین پشتیبانی', icon: icons.chat, permission: 'chat', badge: 'فعال', badgeClass: 'badge-info' },
        { screen: 'contact-manager', label: 'اطلاعات تماس و شبکه‌ها', icon: icons.phone, permission: 'settings' },
      ],
    },
    {
      title: 'محتوا و وب‌سایت',
      items: [
        { screen: 'magazine', label: 'مجله و مقالات تخصصی', icon: icons.article, permission: 'content' },
        { screen: 'stories', label: 'استوری‌های تصویری', icon: icons.story, permission: 'stories' },
        { screen: 'testimonials', label: 'نظرات و رضایت مشتریان', icon: icons.message, permission: 'content' },
        { screen: 'sliders', label: 'اسلایدر و بنرهای تبلیغاتی', icon: icons.image, permission: 'content' },
        { screen: 'seo', label: 'بهینه‌سازی سئو و متادیتا', icon: icons.seo, permission: 'seo' },
        { screen: 'media', label: 'مدیریت فایل و چندرسانه‌ای', icon: icons.image, permission: 'content' },
      ],
    },
    {
      title: 'پرسنل و مالی',
      items: [
        { screen: 'staff', label: 'تکنسین‌ها و کارمندان', icon: icons.users, permission: 'staff' },
        { screen: 'jobApplications', label: 'درخواست‌های استخدام و جذب', icon: icons.briefcase, permission: 'recruitment' },
        { screen: 'roles', label: 'سطوح دسترسی و اختیارات', icon: icons.lock, permission: 'roles' },
        { screen: 'finance', label: 'مدیریت مالی و تراکنش‌ها', icon: icons.finance, permission: 'dashboard' },
        { screen: 'payroll', label: 'حقوق و تسویه‌حساب', icon: icons.wallet, permission: 'wallet' },
      ],
    },
    {
      title: 'سامانه و هوش مصنوعی',
      items: [
        { screen: 'ai', label: 'هوشواره هوشمند بهدون', icon: icons.ai, badge: 'AI', badgeClass: 'badge-ai' },
        { screen: 'plugins', label: 'افزونه‌ها و اتصالات', icon: icons.plugin, permission: 'plugins' },
        { screen: 'settings', label: 'تنظیمات کلی سامانه', icon: icons.settings, permission: 'settings' },
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

      <!-- نوار ناوبری جانبی فوق حرفه‌ای (OpenDesign Sidebar) -->
      <aside class="admin-sidebar" id="admin-sidebar">
        <div class="admin-sidebar-header">
          <div class="admin-brand" id="admin-logo-btn" role="button" tabindex="0" title="صفحه اصلی مدیریت">
            <div class="admin-brand-icon">
              <img class="admin-logo-mark" src="/favicon.svg" alt="بهدون" />
            </div>
            <div class="admin-brand-info">
              <span class="admin-brand-name">بهدون</span>
              <span class="admin-brand-badge">نسخه ۱.۰ · فعال</span>
            </div>
          </div>
          <button type="button" class="admin-sidebar-toggle-btn" id="admin-sidebar-collapse-btn" title="تغییر حالت سایدبار" aria-label="بستن یا باز کردن سایدبار">
            <span class="icon">${icons.sidebarToggle}</span>
          </button>
        </div>

        <div class="admin-sidebar-search">
          <div class="admin-search-wrapper">
            <span class="icon">${icons.search}</span>
            <input type="text" id="admin-nav-filter" placeholder="جستجوی سریع بخش‌ها..." autocomplete="off" />
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
            <button type="button" class="admin-sidebar-icon-btn admin-theme-toggle" id="admin-theme-toggle-btn" title="تغییر تم (روشن بنفش شیشه‌ای / بنفش تیره لوکس)" aria-label="تغییر تم">
              <span class="icon icon-theme-sun" id="admin-theme-sun" hidden>${icons.sun}</span>
              <span class="icon icon-theme-moon" id="admin-theme-moon">${icons.moon}</span>
            </button>
            <button type="button" class="admin-sidebar-icon-btn admin-logout-btn" id="logout-btn" title="خروج از حساب کاربری" aria-label="خروج">
              <span class="icon">${icons.logout}</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- بخش اصلی محتوا (Main Wrapper) -->
      <div class="admin-main-wrapper">
        <!-- تاپ‌بار مدرن و واکنش‌گرا -->
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
              <span class="breadcrumb-item" data-nav-screen="home" role="button" tabindex="0" title="بازگشت به مرکز فرماندهی">
                <span class="icon">${icons.home}</span>
                <span>پیشخوان</span>
              </span>
              <span class="breadcrumb-separator">/</span>
              <span class="breadcrumb-current" id="admin-crumb-current">مرکز فرماندهی</span>
            </nav>
          </div>

          <div class="admin-topbar-end">
            <div class="admin-topbar-clock" id="admin-topbar-clock" title="زمان محلی سرور">
              <span class="icon">${icons.clock}</span>
              <span id="admin-clock-text">--:--</span>
            </div>

            <a href="/" target="_blank" rel="noopener" class="admin-topbar-action-link" title="مشاهده صفحه اصلی وب‌سایت در تب جدید">
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

        <!-- کانتینر پویا برای نمایش ویوها -->
        <main class="admin-main-content">
          <div id="view-container" class="admin-view-container"></div>
        </main>
      </div>
    </div>
  `;
}

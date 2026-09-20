import { icons } from '../components/icons.ts';
import type { StaffInfo } from '../utils/auth.ts';
import { hasPermission } from '../utils/auth.ts';

function tile(view: string, icon: string, label: string): string {
  return `
    <button type="button" class="home-tile" data-home-tile="${view}">
      <span class="home-tile-icon">${icon}</span>
      <span class="home-tile-label">${label}</span>
    </button>
  `;
}

// صفحه‌ی خانه: همه‌ی بخش‌های در دسترسِ این کارمند به‌صورت یک شبکه از کاشی‌ها — به‌جای فهرست کناری قبلی.
export function renderHomeView(staff: StaffInfo): string {
  const showContent = hasPermission(staff, 'content') || hasPermission(staff, 'stories') || hasPermission(staff, 'seo') || hasPermission(staff, 'settings');
  const showPersonnel = hasPermission(staff, 'staff') || hasPermission(staff, 'recruitment') || hasPermission(staff, 'roles') || hasPermission(staff, 'wallet');
  const showSettings = hasPermission(staff, 'settings') || hasPermission(staff, 'homepage');

  const showRequests = hasPermission(staff, 'pipeline') || hasPermission(staff, 'map');
  const showFinance = hasPermission(staff, 'dashboard') || hasPermission(staff, 'wallet') || hasPermission(staff, 'roles') || hasPermission(staff, 'staff');

  const tiles: string[] = [];
  tiles.push(tile('dashboard', icons.chart, 'داشبورد'));
  if (showRequests) tiles.push(tile('requests', icons.columns, 'درخواست‌ها'));
  if (showSettings || showContent) tiles.push(tile('services', icons.wrench, 'مدیریت خدمات'));
  if (showFinance) tiles.push(tile('finance', icons.finance, 'مدیریت مالی'));
  if (showSettings) tiles.push(tile('settings', icons.settings, 'تنظیمات سایت'));
  if (hasPermission(staff, 'chat')) tiles.push(tile('chat', icons.chat, 'چت پشتیبانی'));
  if (showContent) tiles.push(tile('content', icons.grid, 'مدیریت محتوا'));
  if (showPersonnel) tiles.push(tile('personnel', icons.users, 'مدیریت پرسنل'));
  if (hasPermission(staff, 'plugins')) tiles.push(tile('plugins', icons.plugin, 'افزونه‌ها'));
  if (showSettings) tiles.push(tile('contact-manager', icons.phone, 'ارتباطات و شبکه‌ها'));

  return `<div class="home-grid">${tiles.join('')}</div>`;
}

// زیرمجموعه‌ی «درخواست‌ها»: مراحل درخواست‌ها و نقشه درخواست‌ها.
export function renderRequestsHomeView(staff: StaffInfo): string {
  const tiles: string[] = [];
  if (hasPermission(staff, 'pipeline')) tiles.push(tile('pipeline', icons.columns, 'مراحل درخواست‌ها'));
  if (hasPermission(staff, 'map')) tiles.push(tile('map', icons.map, 'نقشه درخواست‌ها'));
  return `<div class="home-grid">${tiles.join('')}</div>`;
}

// زیرمجموعه‌ی «مدیریت محتوا»: مجله، نظرات مشتریان، استوری‌ها، اسلایدر، سئو و مدیریت فایل همگی یک دسته‌اند.
export function renderContentHomeView(staff: StaffInfo): string {
  const tiles: string[] = [];
  if (hasPermission(staff, 'content')) tiles.push(tile('magazine', icons.article, 'مجله'));
  if (hasPermission(staff, 'content')) tiles.push(tile('testimonials', icons.message, 'نظرات مشتریان'));
  if (hasPermission(staff, 'stories')) tiles.push(tile('stories', icons.story, 'استوری‌ها'));
  if (hasPermission(staff, 'content') || hasPermission(staff, 'settings')) tiles.push(tile('sliders', icons.image, 'اسلایدر موبایل و سایت'));
  if (hasPermission(staff, 'seo')) tiles.push(tile('seo', icons.seo, 'مدیریت سئو'));
  if (hasPermission(staff, 'content') || hasPermission(staff, 'settings')) tiles.push(tile('media', icons.image, 'مدیریت فایل'));
  return `<div class="home-grid">${tiles.join('')}</div>`;
}

// زیرمجموعه‌ی «مدیریت پرسنل»: کارمندان، فرصت‌های شغلی و نقش‌ها و اختیارات.
export function renderPersonnelHomeView(staff: StaffInfo): string {
  const tiles: string[] = [];
  if (hasPermission(staff, 'staff')) tiles.push(tile('staff', icons.users, 'کارمندان و تکنسین‌ها'));
  if (hasPermission(staff, 'recruitment')) tiles.push(tile('jobApplications', icons.briefcase, 'فرصت‌های شغلی'));
  if (hasPermission(staff, 'roles')) tiles.push(tile('roles', icons.lock, 'نقش‌ها و اختیارات'));
  if (hasPermission(staff, 'staff') || hasPermission(staff, 'roles')) tiles.push(tile('activityLog', icons.history, 'گزارش فعالیت'));
  if (hasPermission(staff, 'wallet')) tiles.push(tile('payroll', icons.wallet, 'حقوق و دستمزد'));
  return `<div class="home-grid">${tiles.join('')}</div>`;
}

// زیرمجموعه‌ی «آمار و گزارش»: سفارش‌ها، بازدیدکنندگان و عملکرد کارمندان — هرکدام جدا باز می‌شوند.
export function renderDashboardHomeView(): string {
  const tiles: string[] = [
    tile('dashboardOrders', icons.chart, 'سفارش‌ها'),
    tile('dashboardVisitors', icons.eye, 'بازدیدکنندگان'),
    tile('dashboardStaff', icons.users, 'عملکرد کارمندان'),
  ];
  return `<div class="home-grid">${tiles.join('')}</div>`;
}

export function wireHomeTiles(container: HTMLElement, onSelect: (view: string) => void): void {
  container.querySelectorAll<HTMLButtonElement>('[data-home-tile]').forEach((btn) => {
    btn.addEventListener('click', () => onSelect(btn.dataset.homeTile ?? ''));
  });
}

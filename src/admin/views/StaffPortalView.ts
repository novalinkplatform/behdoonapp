import { icons } from '../components/icons.ts';
import {
  fetchProviderDashboard,
  fetchProviderOrders,
  fetchProviderOrderDetail,
  performProviderOrderAction,
  fetchProviderSchedule,
  fetchProviderEarnings,
  fetchProviderPerformance,
  fetchProviderNotifications,
  markProviderNotificationRead,
  toggleProviderOnlineStatus,
  type ProviderDashboardData,
  type ProviderOrderDetail,
  type OrderRecord,
} from '../utils/api.ts';
import { formatToman, toPersianDigits } from '../utils/format.ts';
import type { StaffInfo } from '../utils/auth.ts';
import { renderMyWalletView, initMyWalletView } from './MyWalletView.ts';
import { renderLicenseLockBanner } from '../components/LicenseLockBanner.ts';
import { renderDemoAccountBanner } from '../components/DemoAccountBanner.ts';

const STATUS_LABELS: Record<string, string> = {
  submitted: 'ثبت اولیه',
  under_review: 'در انتظار بررسی',
  matching: 'در حال انتخاب متخصص',
  provider_assigned: 'سفارش جدید (ارجاع شده)',
  quoted: 'پیش‌فاکتور صادر شد',
  confirmed: 'تأیید شده / زمان‌بندی',
  scheduled: 'زمان‌بندی شده',
  en_route: 'در مسیر اعزام',
  arrived: 'رسیده به محل',
  inspection: 'کارشناسی و بررسی',
  in_progress: 'در حال انجام کار',
  waiting_for_parts: 'در انتظار تهیه قطعه',
  completed: 'تکمیل و تحویل شد',
  cancelled: 'لغو شده',
  disputed: 'دارای اختلاف',
  pending: 'در انتظار',
  contacted: 'تماس گرفته شد',
};

const STATUS_BADGE_CLASSES: Record<string, string> = {
  submitted: 'badge-muted',
  under_review: 'badge-warning',
  matching: 'badge-warning',
  provider_assigned: 'badge-primary-pulse',
  quoted: 'badge-info',
  confirmed: 'badge-info',
  scheduled: 'badge-info',
  en_route: 'badge-primary',
  arrived: 'badge-primary',
  inspection: 'badge-primary',
  in_progress: 'badge-primary',
  waiting_for_parts: 'badge-warning',
  completed: 'badge-success',
  cancelled: 'badge-danger',
  disputed: 'badge-danger',
  pending: 'badge-muted',
  contacted: 'badge-warning',
};

function escapeHtml(str: string | null | undefined): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function renderStaffPortalView(staff: StaffInfo): string {
  return `
    <div class="portal-shell">
      <header class="portal-header">
        <div class="portal-brand">
          <img class="portal-brand-logo" src="/favicon.svg" alt="بهدون" />
          <div>
            <div class="portal-brand-title">بهدون</div>
            <div class="portal-brand-sub">پنل عملیات متخصصین</div>
          </div>
        </div>
        <div class="portal-header-actions">
          <button type="button" class="provider-status-toggle is-offline" id="portal-status-toggle" title="تغییر وضعیت کاربری">
            <span class="status-dot"></span>
            <span id="portal-status-text">آفلاین</span>
          </button>
          <button type="button" class="portal-icon-btn" id="portal-notif-btn" title="اعلانات">
            <span class="icon">${icons.message}</span>
            <span class="portal-badge-count" id="portal-notif-badge" hidden>۰</span>
          </button>
          <button type="button" class="btn btn-secondary btn-sm" id="portal-wallet-btn" title="کیف پول">
            <span class="icon">${icons.wallet}</span>
            <span class="hide-mobile">کیف پول</span>
          </button>
          <button type="button" class="btn btn-secondary btn-sm" id="portal-logout-btn" title="خروج">
            <span class="icon">${icons.logout}</span>
          </button>
        </div>
      </header>

      ${staff.licenseLocked ? renderLicenseLockBanner() : ''}
      ${staff.username === 'test' ? renderDemoAccountBanner() : ''}

      <!-- Navigation Tabs -->
      <nav class="portal-nav-bar" id="portal-nav-tabs">
        <button type="button" class="portal-tab-btn is-active" data-tab="dashboard">
          <span class="icon">${icons.grid}</span>
          <span>داشبورد</span>
        </button>
        <button type="button" class="portal-tab-btn" data-tab="orders">
          <span class="icon">${icons.briefcase}</span>
          <span>سفارش‌ها</span>
          <span class="tab-badge" id="orders-count-badge">۰</span>
        </button>
        <button type="button" class="portal-tab-btn" data-tab="schedule">
          <span class="icon">${icons.calendar}</span>
          <span>برنامه کاری</span>
        </button>
        <button type="button" class="portal-tab-btn" data-tab="earnings">
          <span class="icon">${icons.chart}</span>
          <span>درآمد و تسویه</span>
        </button>
        <button type="button" class="portal-tab-btn" data-tab="performance">
          <span class="icon">${icons.shield}</span>
          <span>کارنامه عملکرد</span>
        </button>
      </nav>

      <main class="portal-main">
        <p class="error-text" id="portal-global-error" hidden></p>

        <!-- Tab 1: Dashboard -->
        <section id="tab-content-dashboard" class="tab-section">
          <div id="urgent-action-banner" hidden></div>
          <div class="portal-stats-grid" id="portal-dashboard-stats"></div>
          
          <div class="view-header" style="margin-top: 1rem; margin-bottom: 0.75rem;">
            <h2 style="font-size: 1.05rem; font-weight: 800;">سفارش‌های فعال امروز</h2>
            <button type="button" class="btn btn-ghost btn-sm" id="dashboard-refresh-btn">
              <span class="icon">${icons.refresh}</span>
              به‌روزرسانی
            </button>
          </div>
          <div class="portal-list" id="dashboard-active-orders"></div>
        </section>

        <!-- Tab 2: Orders List -->
        <section id="tab-content-orders" class="tab-section" hidden>
          <div class="portal-filter-chips" id="portal-order-filters">
            <button type="button" class="filter-chip is-active" data-filter="all">همه سفارش‌ها</button>
            <button type="button" class="filter-chip" data-filter="new">نیازمند اقدام</button>
            <button type="button" class="filter-chip" data-filter="in_progress">در جریان</button>
            <button type="button" class="filter-chip" data-filter="completed">تکمیل‌شده</button>
            <button type="button" class="filter-chip" data-filter="cancelled">لغوشده</button>
          </div>
          <div class="portal-list" id="portal-orders-list"></div>
        </section>

        <!-- Tab 3: Schedule -->
        <section id="tab-content-schedule" class="tab-section" hidden>
          <div class="view-header" style="margin-bottom: 1rem;">
            <h2 style="font-size: 1.05rem; font-weight: 800;">تقویم کاری و نوبت‌های امروز</h2>
          </div>
          <div class="schedule-slots-grid" id="portal-schedule-grid"></div>
        </section>

        <!-- Tab 4: Earnings -->
        <section id="tab-content-earnings" class="tab-section" hidden>
          <div id="portal-earnings-mount"></div>
        </section>

        <!-- Tab 5: Performance -->
        <section id="tab-content-performance" class="tab-section" hidden>
          <div id="portal-performance-mount"></div>
        </section>

        <!-- Legacy Wallet Fallback Container -->
        <div id="portal-wallet-container" hidden>
          <button type="button" class="btn btn-ghost btn-sm" id="portal-back-to-jobs-btn" style="margin-bottom: 1rem">
            بازگشت به پنل عملیات
          </button>
          <div id="portal-wallet-mount"></div>
        </div>
      </main>

      <!-- Order Detail Modal -->
      <div class="portal-modal-backdrop" id="portal-order-modal" hidden>
        <div class="portal-modal-content">
          <div class="portal-modal-header">
            <div class="portal-modal-title" id="order-modal-title">جزئیات سفارش</div>
            <button type="button" class="portal-icon-btn" id="order-modal-close">
              <span class="icon">${icons.close}</span>
            </button>
          </div>
          <div class="portal-modal-body" id="order-modal-body"></div>
        </div>
      </div>

      <!-- Notifications Modal -->
      <div class="portal-modal-backdrop" id="portal-notif-modal" hidden>
        <div class="portal-modal-content">
          <div class="portal-modal-header">
            <div class="portal-modal-title">اعلانات و پیام‌ها</div>
            <button type="button" class="portal-icon-btn" id="notif-modal-close">
              <span class="icon">${icons.close}</span>
            </button>
          </div>
          <div class="portal-modal-body" id="notif-modal-body"></div>
        </div>
      </div>
    </div>
  `;
}

export function initStaffPortalView(onLogout: () => void): void {
  // Navigation & State
  let currentTab = 'dashboard';
  let currentFilter = 'all';
  let isOnline = false;
  let cachedDashboard: ProviderDashboardData | null = null;

  const globalErrorEl = document.getElementById('portal-global-error');
  const statusToggleBtn = document.getElementById('portal-status-toggle');
  const statusTextEl = document.getElementById('portal-status-text');
  const notifBtn = document.getElementById('portal-notif-btn');
  const notifBadgeEl = document.getElementById('portal-notif-badge');
  const notifModal = document.getElementById('portal-notif-modal');
  const notifModalClose = document.getElementById('notif-modal-close');
  const notifModalBody = document.getElementById('notif-modal-body');
  const orderModal = document.getElementById('portal-order-modal');
  const orderModalClose = document.getElementById('order-modal-close');
  const orderModalBody = document.getElementById('order-modal-body');
  const orderModalTitle = document.getElementById('order-modal-title');
  const logoutBtn = document.getElementById('portal-logout-btn');
  const ordersCountBadge = document.getElementById('orders-count-badge');
  const refreshBtn = document.getElementById('dashboard-refresh-btn');

  // Wallet Local Mount
  const walletContainer = document.getElementById('portal-wallet-container');
  const walletMount = document.getElementById('portal-wallet-mount');
  const walletBtn = document.getElementById('portal-wallet-btn');
  const backToJobsBtn = document.getElementById('portal-back-to-jobs-btn');
  let walletLoaded = false;

  function showError(msg: string): void {
    if (globalErrorEl) {
      globalErrorEl.hidden = false;
      globalErrorEl.textContent = msg;
    }
  }

  function clearError(): void {
    if (globalErrorEl) {
      globalErrorEl.hidden = true;
      globalErrorEl.textContent = '';
    }
  }

  // Tab Switching
  const navTabs = document.querySelectorAll<HTMLButtonElement>('.portal-tab-btn');
  const tabSections = document.querySelectorAll<HTMLElement>('.tab-section');

  function switchTab(tabId: string): void {
    currentTab = tabId;
    navTabs.forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.tab === tabId);
    });
    tabSections.forEach((sec) => {
      sec.hidden = sec.id !== `tab-content-${tabId}`;
    });
    if (walletContainer) walletContainer.hidden = true;

    // Load data for active tab
    if (tabId === 'dashboard') loadDashboard();
    else if (tabId === 'orders') loadOrders();
    else if (tabId === 'schedule') loadSchedule();
    else if (tabId === 'earnings') loadEarnings();
    else if (tabId === 'performance') loadPerformance();
  }

  navTabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.tab) switchTab(btn.dataset.tab);
    });
  });

  // Online / Offline Toggle
  statusToggleBtn?.addEventListener('click', async () => {
    try {
      const res = await toggleProviderOnlineStatus(!isOnline);
      isOnline = res.isOnline;
      updateOnlineStatusUi(isOnline);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'تغییر وضعیت ناموفق بود.');
    }
  });

  function updateOnlineStatusUi(online: boolean): void {
    isOnline = online;
    if (statusToggleBtn && statusTextEl) {
      statusToggleBtn.classList.toggle('is-online', online);
      statusToggleBtn.classList.toggle('is-offline', !online);
      statusTextEl.textContent = online ? 'آنلاین (آماده کار)' : 'آفلاین';
    }
  }

  // Render Single Order Card
  function renderOrderCard(order: OrderRecord, isHighlight = false): string {
    const statusLabel = STATUS_LABELS[order.status] ?? order.status;
    const badgeClass = STATUS_BADGE_CLASSES[order.status] ?? 'badge-muted';
    const navLat = order.originLat ?? order.destinationLat;
    const navLng = order.originLng ?? order.destinationLng;
    const navUrl =
      navLat != null && navLng != null
        ? `https://www.google.com/maps/dir/?api=1&destination=${navLat},${navLng}`
        : null;

    let actionsHtml = '';

    // Provider Operational State Machine Actions
    if (order.status === 'provider_assigned') {
      actionsHtml = `
        <div class="portal-actions-grid">
          <button type="button" class="btn-action-success" data-action="accept" data-order-id="${order.id}">
            <span class="icon">${icons.checkCircle}</span>
            قبول سفارش
          </button>
          <button type="button" class="btn-action-danger" data-action="reject" data-order-id="${order.id}">
            <span class="icon">${icons.close}</span>
            رد سفارش
          </button>
        </div>
      `;
    } else if (order.status === 'confirmed' || order.status === 'scheduled') {
      actionsHtml = `
        <div class="portal-actions-grid">
          <button type="button" class="btn-action-primary" data-action="en_route" data-order-id="${order.id}">
            <span class="icon">${icons.truck}</span>
            اعزام به محل
          </button>
          ${navUrl ? `<a class="btn-action-secondary" href="${navUrl}" target="_blank" rel="noopener"><span class="icon">${icons.pin}</span>مسیریابی</a>` : ''}
        </div>
      `;
    } else if (order.status === 'en_route') {
      actionsHtml = `
        <div class="portal-actions-grid">
          <button type="button" class="btn-action-primary" data-action="arrived" data-order-id="${order.id}">
            <span class="icon">${icons.pin}</span>
            رسیدن به محل
          </button>
          ${navUrl ? `<a class="btn-action-secondary" href="${navUrl}" target="_blank" rel="noopener"><span class="icon">${icons.pin}</span>مسیریابی</a>` : ''}
        </div>
      `;
    } else if (order.status === 'arrived') {
      actionsHtml = `
        <div class="portal-actions-grid">
          <button type="button" class="btn-action-primary" data-action="start_inspection" data-order-id="${order.id}">
            <span class="icon">${icons.wrench}</span>
            شروع کارشناسی
          </button>
          <button type="button" class="btn-action-success" data-action="start_service" data-order-id="${order.id}">
            <span class="icon">${icons.wrench}</span>
            شروع مستقیم کار
          </button>
        </div>
      `;
    } else if (order.status === 'inspection') {
      actionsHtml = `
        <div class="portal-actions-grid">
          <button type="button" class="btn-action-success" data-action="start_service" data-order-id="${order.id}">
            <span class="icon">${icons.checkCircle}</span>
            پایان بازدید و شروع کار
          </button>
          <button type="button" class="btn-action-secondary" data-detail-id="${order.id}">
            صدور پیش‌فاکتور
          </button>
        </div>
      `;
    } else if (order.status === 'in_progress') {
      actionsHtml = `
        <div class="portal-actions-grid">
          <button type="button" class="btn-action-success" data-action="complete_service" data-order-id="${order.id}">
            <span class="icon">${icons.checkCircle}</span>
            پایان کار و تحویل
          </button>
          <button type="button" class="btn-action-secondary" data-action="waiting_for_parts" data-order-id="${order.id}">
            نیاز به قطعه
          </button>
        </div>
      `;
    } else if (order.status === 'waiting_for_parts') {
      actionsHtml = `
        <div class="portal-actions-grid">
          <button type="button" class="btn-action-primary" data-action="resume_service" data-order-id="${order.id}">
            <span class="icon">${icons.checkCircle}</span>
            قطعه تهیه شد (ادامه کار)
          </button>
          <button type="button" class="btn-action-secondary" data-detail-id="${order.id}">
            مشاهده جزئیات
          </button>
        </div>
      `;
    } else {
      actionsHtml = `
        <div style="display: flex; gap: 0.5rem; margin-top: 0.25rem;">
          <button type="button" class="btn-action-secondary" style="flex: 1;" data-detail-id="${order.id}">
            <span class="icon">${icons.fileText}</span>
            مشاهده پرونده و فاکتور
          </button>
        </div>
      `;
    }

    return `
      <div class="portal-card ${isHighlight ? 'card-highlight' : ''}" data-order-card-id="${order.id}">
        <div class="portal-card-header">
          <span class="portal-card-id">#${toPersianDigits(order.trackingCode || String(order.id))}</span>
          <span class="portal-status-badge ${badgeClass}">${statusLabel}</span>
        </div>
        <div class="portal-service-title">${escapeHtml(order.serviceLabel)}</div>
        <div class="portal-info-row">
          <span class="icon">${icons.pin}</span>
          <span>${escapeHtml(order.originCity || 'تهران')} ${order.destinationCity && order.destinationCity !== order.originCity ? `(${escapeHtml(order.destinationCity)})` : ''}</span>
        </div>
        <div class="portal-info-row">
          <span class="icon">${icons.calendar}</span>
          <span>${toPersianDigits(order.scheduledDate || 'امروز')} — ساعت ${toPersianDigits(order.scheduledTime || '--:--')}</span>
        </div>
        ${order.originNotes ? `<div class="portal-notes-box"><strong>توضیحات:</strong> ${escapeHtml(order.originNotes)}</div>` : ''}
        ${
          order.phone && order.status !== 'completed' && order.status !== 'cancelled'
            ? `<a class="portal-info-row" href="tel:${order.phone}" style="color: var(--primary); font-weight: 700; text-decoration: none;">
                <span class="icon">${icons.phone}</span>
                <span dir="ltr">${toPersianDigits(order.phone)}</span>
              </a>`
            : ''
        }
        <div class="portal-price-row">
          <span style="color: var(--muted);">برآورد هزینه:</span>
          <span class="portal-price-val">${formatToman(order.estimateAvg || 0)}</span>
        </div>
        ${actionsHtml}
        <div style="text-align: left; margin-top: 0.25rem;">
          <button type="button" class="btn btn-ghost btn-sm" data-detail-id="${order.id}" style="font-size: 0.78rem; padding: 0.2rem 0.5rem;">
            جزئیات کامل سفارش &larr;
          </button>
        </div>
      </div>
    `;
  }

  // Load Tab 1: Dashboard
  async function loadDashboard(): Promise<void> {
    clearError();
    const statsEl = document.getElementById('portal-dashboard-stats');
    const activeEl = document.getElementById('dashboard-active-orders');
    const bannerEl = document.getElementById('urgent-action-banner');
    if (!statsEl || !activeEl) return;

    try {
      const data = await fetchProviderDashboard();
      cachedDashboard = data;
      updateOnlineStatusUi(Boolean(data.provider?.isOnline));

      // Unread notifications badge
      if (notifBadgeEl) {
        const unread = data.unreadNotifications || 0;
        notifBadgeEl.hidden = unread === 0;
        notifBadgeEl.textContent = toPersianDigits(unread);
      }

      if (ordersCountBadge) {
        ordersCountBadge.textContent = toPersianDigits(data.metrics?.inProgressOrders + data.metrics?.pendingOrders || 0);
      }

      // Urgent Banner for new orders
      if (bannerEl) {
        if (data.pendingActionOrdersList?.length > 0) {
          const first = data.pendingActionOrdersList[0];
          bannerEl.hidden = false;
          bannerEl.innerHTML = `
            <div class="portal-alert-card">
              <div class="portal-alert-info">
                <div class="portal-alert-icon"><span class="icon">${icons.wrench}</span></div>
                <div>
                  <div class="portal-alert-title">سفارش جدید آماده بررسی شماست!</div>
                  <div class="portal-alert-desc">${escapeHtml(first.serviceLabel)} — #${toPersianDigits(first.trackingCode)}</div>
                </div>
              </div>
              <button type="button" class="btn btn-primary btn-sm" data-action="accept" data-order-id="${first.id}">
                قبول سریع
              </button>
            </div>
          `;
        } else {
          bannerEl.hidden = true;
          bannerEl.innerHTML = '';
        }
      }

      // Stats Grid
      const m = data.metrics;
      statsEl.innerHTML = `
        <div class="portal-stat-box">
          <div class="portal-stat-box-top">
            <span>سفارش‌های امروز</span>
            <span class="icon">${icons.calendar}</span>
          </div>
          <div class="portal-stat-box-val">${toPersianDigits(m.todayOrders)}</div>
        </div>
        <div class="portal-stat-box">
          <div class="portal-stat-box-top">
            <span>در حال انجام</span>
            <span class="icon">${icons.wrench}</span>
          </div>
          <div class="portal-stat-box-val" style="color: var(--primary);">${toPersianDigits(m.inProgressOrders)}</div>
        </div>
        <div class="portal-stat-box">
          <div class="portal-stat-box-top">
            <span>طلب در انتظار تسویه</span>
            <span class="icon">${icons.wallet}</span>
          </div>
          <div class="portal-stat-box-val" style="font-size: 1.05rem; color: #059669;">${formatToman(m.unsettledBalance)}</div>
        </div>
        <div class="portal-stat-box">
          <div class="portal-stat-box-top">
            <span>امتیاز و کارنامه (PPS)</span>
            <span class="icon">${icons.shield}</span>
          </div>
          <div class="portal-stat-box-val">${toPersianDigits(data.provider?.performanceScore || 100)} <span class="portal-stat-box-unit">از ۱۰۰</span></div>
        </div>
      `;

      // Active / In-progress Orders
      const activeList = [...(data.inProgressOrdersList || []), ...(data.pendingActionOrdersList || [])];
      if (activeList.length === 0) {
        activeEl.innerHTML = '<p class="portal-empty">در حال حاضر سفارش فعالی برای امروز ندارید. با آنلاین ماندن، سفارشات جدید به شما ارجاع داده می‌شود.</p>';
      } else {
        activeEl.innerHTML = activeList.map((o) => renderOrderCard(o, true)).join('');
      }

      wireCardActions(activeEl);
      if (bannerEl) wireCardActions(bannerEl);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'بارگذاری داشبورد با خطا مواجه شد.');
    }
  }

  // Load Tab 2: Orders
  async function loadOrders(): Promise<void> {
    clearError();
    const listEl = document.getElementById('portal-orders-list');
    if (!listEl) return;
    listEl.innerHTML = '<p class="portal-empty">در حال دریافت لیست سفارش‌ها...</p>';

    try {
      const res = await fetchProviderOrders(currentFilter);
      if (!res.orders || res.orders.length === 0) {
        listEl.innerHTML = '<p class="portal-empty">هیچ سفارشی در این وضعیت یافت نشد.</p>';
      } else {
        listEl.innerHTML = res.orders.map((o) => renderOrderCard(o)).join('');
      }
      wireCardActions(listEl);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'دریافت سفارشات با خطا مواجه شد.');
    }
  }

  // Order Filter Chips
  const filterChips = document.querySelectorAll<HTMLButtonElement>('.filter-chip');
  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      filterChips.forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      currentFilter = chip.dataset.filter || 'all';
      void loadOrders();
    });
  });

  // Load Tab 3: Schedule
  async function loadSchedule(): Promise<void> {
    clearError();
    const gridEl = document.getElementById('portal-schedule-grid');
    if (!gridEl) return;
    gridEl.innerHTML = '<p class="portal-empty">در حال دریافت زمان‌بندی کاری...</p>';

    try {
      const res = await fetchProviderSchedule();
      if (!res.schedule || res.schedule.length === 0) {
        gridEl.innerHTML = '<p class="portal-empty">نوبتی برای این روز ثبت نشده است.</p>';
      } else {
        gridEl.innerHTML = res.schedule
          .map((slot) => {
            const isBooked = Boolean(slot.isBooked);
            return `
              <div class="schedule-slot-card ${isBooked ? 'is-booked' : 'is-available'}">
                <div class="slot-time">${toPersianDigits(slot.startTime)} تا ${toPersianDigits(slot.endTime)}</div>
                <div class="slot-status" style="color: ${isBooked ? '#1e40af' : '#065f46'};">
                  ${isBooked ? `رزرو شده (${escapeHtml(slot.orderTrackingCode || 'سفارش')})` : 'آزاد و در دسترس'}
                </div>
                ${slot.orderService ? `<div style="font-size: 0.76rem; color: var(--muted);">${escapeHtml(slot.orderService)}</div>` : ''}
              </div>
            `;
          })
          .join('');
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'دریافت تقویم کاری با خطا مواجه شد.');
    }
  }

  // Load Tab 4: Earnings
  async function loadEarnings(): Promise<void> {
    clearError();
    const mountEl = document.getElementById('portal-earnings-mount');
    if (!mountEl) return;
    mountEl.innerHTML = '<p class="portal-empty">در حال محاسبه درآمد و تسویه‌ها...</p>';

    try {
      const data = await fetchProviderEarnings();
      const s = data.summary;

      mountEl.innerHTML = `
        <div class="earnings-card">
          <div class="earnings-card-top">
            <span>مانده قابل تسویه به حساب بانکی</span>
            <span class="icon">${icons.wallet}</span>
          </div>
          <div class="earnings-big-val">${formatToman(s.unsettledBalance)}</div>
          <div class="earnings-card-sub">
            <div>کل کارکرد ناخالص: <strong>${formatToman(s.totalEarnings)}</strong></div>
            <div>تسویه‌شده تا کنون: <strong>${formatToman(s.paidSettlementTotal)}</strong></div>
            <div>تعداد خدمات: <strong>${toPersianDigits(s.completedJobs)}</strong></div>
          </div>
        </div>

        <div class="view-header" style="margin-top: 1.5rem; margin-bottom: 0.75rem;">
          <h3 style="font-size: 0.95rem; font-weight: 800;">تسویه حساب‌های سفارشات</h3>
        </div>
        <div class="portal-list">
          ${
            data.settlements.length === 0
              ? '<p class="portal-empty">هنوز هیچ تسویه‌ای برای شما ثبت نشده است.</p>'
              : data.settlements
                  .map(
                    (item) => `
                    <div class="settlement-item">
                      <div>
                        <div style="font-weight: 700; font-size: 0.88rem;">#${toPersianDigits(item.trackingCode)} — ${escapeHtml(item.serviceLabel)}</div>
                        <div style="font-size: 0.76rem; color: var(--muted);">ناخالص: ${formatToman(item.grossAmount)} | کارمزد: ${formatToman(item.platformFee)}</div>
                      </div>
                      <div style="text-align: left;">
                        <div style="font-weight: 800; color: #059669; font-size: 0.92rem;">${formatToman(item.netPayable)}</div>
                        <span class="portal-status-badge ${item.status === 'settled' ? 'badge-success' : 'badge-warning'}">
                          ${item.status === 'settled' ? 'واریز شد' : 'در نوبت تسویه'}
                        </span>
                      </div>
                    </div>
                  `
                  )
                  .join('')
          }
        </div>

        <div class="view-header" style="margin-top: 1.5rem; margin-bottom: 0.75rem;">
          <h3 style="font-size: 0.95rem; font-weight: 800;">دفتر کل مالی (Ledger)</h3>
        </div>
        <div class="portal-list">
          ${
            data.ledger.length === 0
              ? '<p class="portal-empty">تراکنشی در دفتر کل ثبت نشده است.</p>'
              : data.ledger
                  .map(
                    (entry) => `
                    <div class="settlement-item" style="font-size: 0.82rem;">
                      <div>
                        <div style="font-weight: 600;">${escapeHtml(entry.description || 'تراکنش مالی')}</div>
                        <div style="font-size: 0.72rem; color: var(--muted);">${escapeHtml(entry.createdAt)}</div>
                      </div>
                      <div style="text-align: left;">
                        <div style="font-weight: 700; color: ${entry.amount >= 0 ? '#059669' : '#dc2626'};">
                          ${entry.amount >= 0 ? '+' : ''}${formatToman(entry.amount)}
                        </div>
                        <div style="font-size: 0.72rem; color: var(--muted);">مانده: ${formatToman(entry.balanceAfter)}</div>
                      </div>
                    </div>
                  `
                  )
                  .join('')
          }
        </div>
      `;
    } catch (err) {
      showError(err instanceof Error ? err.message : 'دریافت گزارش مالی با خطا مواجه شد.');
    }
  }

  // Load Tab 5: Performance
  async function loadPerformance(): Promise<void> {
    clearError();
    const mountEl = document.getElementById('portal-performance-mount');
    if (!mountEl) return;
    mountEl.innerHTML = '<p class="portal-empty">در حال محاسبه شاخص‌های عملکرد...</p>';

    try {
      const data = await fetchProviderPerformance();
      const pps = data.performanceScore || 100;

      mountEl.innerHTML = `
        <div class="portal-card" style="align-items: center; text-align: center; padding: 1.5rem;">
          <div class="pps-score-badge" style="--pps-pct: ${pps};">
            <span class="pps-score-num">${toPersianDigits(pps)}</span>
          </div>
          <div style="font-weight: 800; font-size: 1.15rem; margin-top: 0.75rem;">شاخص عملکرد جامع (PPS)</div>
          <div style="font-size: 0.82rem; color: var(--muted); max-width: 320px;">
            این شاخص بر اساس کیفیت کار، رضایت مشتری، وقت‌شناسی و نرخ پذیرش سفارش‌های شما محاسبه می‌شود.
          </div>
        </div>

        <div class="portal-stats-grid" style="margin-top: 1rem;">
          <div class="portal-stat-box">
            <div class="portal-stat-box-top">میانگین امتیاز</div>
            <div class="portal-stat-box-val" style="color: #f59e0b;">⭐ ${toPersianDigits(data.ratingAvg.toFixed(1))}</div>
            <div style="font-size: 0.72rem; color: var(--muted);">${toPersianDigits(data.ratingCount)} نظر ثبت‌شده</div>
          </div>
          <div class="portal-stat-box">
            <div class="portal-stat-box-top">قابلیت اعتماد</div>
            <div class="portal-stat-box-val" style="color: #059669;">${toPersianDigits(data.reliabilityScore)}%</div>
          </div>
          <div class="portal-stat-box">
            <div class="portal-stat-box-top">نرخ پذیرش سفارش</div>
            <div class="portal-stat-box-val">${toPersianDigits(data.acceptanceRate)}%</div>
          </div>
          <div class="portal-stat-box">
            <div class="portal-stat-box-top">کارهای تکمیل‌شده</div>
            <div class="portal-stat-box-val">${toPersianDigits(data.completedJobs)}</div>
          </div>
        </div>

        <div class="view-header" style="margin-top: 1.5rem; margin-bottom: 0.75rem;">
          <h3 style="font-size: 0.95rem; font-weight: 800;">تفکیک کیفیت خدمات</h3>
        </div>
        <div class="portal-card">
          <div style="display: flex; justify-content: space-between; font-size: 0.84rem; margin-bottom: 0.5rem;">
            <span>وقت‌شناسی و حضور به‌موقع:</span>
            <strong>⭐ ${toPersianDigits(data.breakdown.punctuality.toFixed(1))}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.84rem; margin-bottom: 0.5rem;">
            <span>تمیزی و نظم محیط کار:</span>
            <strong>⭐ ${toPersianDigits(data.breakdown.cleanliness.toFixed(1))}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.84rem;">
            <span>مهارت و کیفیت فنی کار:</span>
            <strong>⭐ ${toPersianDigits(data.breakdown.skill.toFixed(1))}</strong>
          </div>
        </div>

        <div class="view-header" style="margin-top: 1.5rem; margin-bottom: 0.75rem;">
          <h3 style="font-size: 0.95rem; font-weight: 800;">آخرین نظرات مشتریان</h3>
        </div>
        <div class="portal-list">
          ${
            data.ratings.length === 0
              ? '<p class="portal-empty">هنوز نظری از سمت مشتریان برای سفارش‌های شما ثبت نشده است.</p>'
              : data.ratings
                  .map(
                    (r) => `
                    <div class="portal-card" style="gap: 0.35rem;">
                      <div style="display: flex; justify-content: space-between; font-size: 0.8rem;">
                        <span style="color: #f59e0b; font-weight: 800;">⭐ ${toPersianDigits(r.overallScore)} از ۵</span>
                        <span style="color: var(--muted);">${escapeHtml(r.createdAt)}</span>
                      </div>
                      ${r.comment ? `<div style="font-size: 0.82rem; color: var(--text);">${escapeHtml(r.comment)}</div>` : '<div style="font-size: 0.78rem; color: var(--muted);">بدون توضیحات متنی</div>'}
                    </div>
                  `
                  )
                  .join('')
          }
        </div>
      `;
    } catch (err) {
      showError(err instanceof Error ? err.message : 'دریافت کارنامه عملکرد با خطا مواجه شد.');
    }
  }

  // Open Order Detail Modal
  async function openOrderDetail(orderId: number): Promise<void> {
    if (!orderModal || !orderModalBody || !orderModalTitle) return;
    orderModalBody.innerHTML = '<p class="portal-empty">در حال بارگذاری پرونده سفارش...</p>';
    orderModal.hidden = false;

    try {
      const d: ProviderOrderDetail = await fetchProviderOrderDetail(orderId);
      const o = d.order;
      orderModalTitle.textContent = `پرونده سفارش #${toPersianDigits(o.trackingCode || String(o.id))}`;

      const navLat = o.originLat ?? o.destinationLat;
      const navLng = o.originLng ?? o.destinationLng;
      const navUrl =
        navLat != null && navLng != null
          ? `https://www.google.com/maps/dir/?api=1&destination=${navLat},${navLng}`
          : null;

      orderModalBody.innerHTML = `
        <div class="portal-detail-section">
          <div class="portal-detail-section-title">اطلاعات کلی و آدرس پروژه</div>
          <div class="portal-info-row"><strong>خدمت:</strong> ${escapeHtml(o.serviceLabel)}</div>
          <div class="portal-info-row"><strong>وضعیت:</strong> <span class="portal-status-badge ${STATUS_BADGE_CLASSES[o.status] || 'badge-muted'}">${STATUS_LABELS[o.status] || o.status}</span></div>
          <div class="portal-info-row"><strong>زمان درخواستی:</strong> ${toPersianDigits(o.scheduledDate || 'تعیین نشده')} — ساعت ${toPersianDigits(o.scheduledTime || '--:--')}</div>
          <div class="portal-info-row"><strong>آدرس و شهر:</strong> ${escapeHtml(o.originCity || 'تهران')} ${o.destinationCity && o.destinationCity !== o.originCity ? `(${escapeHtml(o.destinationCity)})` : ''}</div>
          ${o.originNotes ? `<div class="portal-notes-box"><strong>یادداشت مشتری:</strong> ${escapeHtml(o.originNotes)}</div>` : ''}
          <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
            ${
              o.canCallCustomer && o.phone
                ? `<a class="btn-action-primary" href="tel:${o.phone}" style="flex: 1;"><span class="icon">${icons.phone}</span>تماس (${toPersianDigits(o.customerPhoneMasked || o.phone)})</a>`
                : `<span class="btn-action-secondary" style="flex: 1; opacity: 0.7;"><span class="icon">${icons.phone}</span>${toPersianDigits(o.customerPhoneMasked || 'مشتری')}</span>`
            }
            ${navUrl ? `<a class="btn-action-secondary" href="${navUrl}" target="_blank" rel="noopener" style="flex: 1;"><span class="icon">${icons.pin}</span>مسیریابی</a>` : ''}
          </div>
        </div>

        <div class="portal-detail-section">
          <div class="portal-detail-section-title">پیش‌فاکتورها</div>
          ${
            d.quotes.length === 0
              ? '<p style="font-size: 0.8rem; color: var(--muted);">پیش‌فاکتوری برای این سفارش ثبت نشده است.</p>'
              : d.quotes
                  .map(
                    (q) => `
                    <div style="border: 1px solid var(--border); border-radius: var(--radius-md); padding: 0.65rem; font-size: 0.82rem; background: var(--background);">
                      <div style="display: flex; justify-content: space-between; font-weight: 700;">
                        <span>مبلغ کل: ${formatToman(q.finalAmount)}</span>
                        <span class="portal-status-badge ${q.status === 'accepted' ? 'badge-success' : 'badge-muted'}">${q.status === 'accepted' ? 'تأیید شده' : q.status}</span>
                      </div>
                      <div style="font-size: 0.74rem; color: var(--muted); margin-top: 0.25rem;">
                        پایه: ${formatToman(q.baseAmount)} | اجرت: ${formatToman(q.laborAmount)} | قطعات: ${formatToman(q.materialsAmount)}
                      </div>
                      ${q.description ? `<div style="margin-top: 0.25rem; font-size: 0.75rem;">${escapeHtml(q.description)}</div>` : ''}
                    </div>
                  `
                  )
                  .join('')
          }
        </div>

        <div class="portal-detail-section">
          <div class="portal-detail-section-title">صورت‌حساب و سهم خالص متخصص</div>
          ${
            d.settlement
              ? `
              <div style="font-size: 0.82rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;"><span>مبلغ ناخالص فاکتور:</span> <strong>${formatToman(d.settlement.grossAmount)}</strong></div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem; color: var(--muted);"><span>کارمزد بهدون (۱۵٪):</span> <span>-${formatToman(d.settlement.commissionAmount)}</span></div>
                <div style="display: flex; justify-content: space-between; font-size: 0.92rem; font-weight: 800; color: #059669; border-top: 1px dashed var(--border); padding-top: 0.25rem;">
                  <span>سهم خالص قابل دریافت:</span>
                  <span>${formatToman(d.settlement.netPayable)}</span>
                </div>
                <div style="margin-top: 0.35rem;">
                  وضعیت تسویه: <span class="portal-status-badge ${d.settlement.status === 'settled' ? 'badge-success' : 'badge-warning'}">${d.settlement.status === 'settled' ? 'واریز شده' : 'در نوبت واریز'}</span>
                </div>
              </div>
            `
              : '<p style="font-size: 0.8rem; color: var(--muted);">پس از ثبت پیش‌فاکتور و شروع کار، صورت‌حساب قطعی محاسبه می‌شود.</p>'
          }
        </div>

        <div class="portal-detail-section">
          <div class="portal-detail-section-title">تایم‌لاین چرخه عملیات</div>
          <div style="display: flex; flex-direction: column; gap: 0.25rem;">
            ${
              o.timeline && o.timeline.length > 0
                ? o.timeline
                    .map(
                      (item) => `
                      <div class="portal-timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                          <div class="timeline-status">${STATUS_LABELS[item.status] || item.status} ${item.note ? `— ${escapeHtml(item.note)}` : ''}</div>
                          <div class="timeline-meta">${item.changedByName ? `توسط ${escapeHtml(item.changedByName)} · ` : ''}${escapeHtml(item.createdAt)}</div>
                        </div>
                      </div>
                    `
                    )
                    .join('')
                : '<p style="font-size: 0.8rem; color: var(--muted);">رویدادی ثبت نشده است.</p>'
            }
          </div>
        </div>
      `;
    } catch (err) {
      orderModalBody.innerHTML = `<p class="error-text">${err instanceof Error ? err.message : 'خطا در دریافت اطلاعات سفارش.'}</p>`;
    }
  }

  // Open Notifications Modal
  async function openNotifications(): Promise<void> {
    if (!notifModal || !notifModalBody) return;
    notifModal.hidden = false;
    notifModalBody.innerHTML = '<p class="portal-empty">در حال دریافت اعلانات...</p>';

    try {
      const res = await fetchProviderNotifications();
      if (!res.notifications || res.notifications.length === 0) {
        notifModalBody.innerHTML = '<p class="portal-empty">هیچ اعلانی ندارید.</p>';
      } else {
        notifModalBody.innerHTML = res.notifications
          .map(
            (n) => `
            <div class="portal-card" style="gap: 0.35rem; ${!n.isRead ? 'border-color: var(--primary); background: var(--primary-light);' : ''}">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <strong style="font-size: 0.86rem; color: var(--primary-dark);">${escapeHtml(n.title)}</strong>
                <span style="font-size: 0.72rem; color: var(--muted);">${escapeHtml(n.createdAt)}</span>
              </div>
              <div style="font-size: 0.8rem; color: var(--text);">${escapeHtml(n.message)}</div>
              ${
                !n.isRead
                  ? `<div style="text-align: left;"><button type="button" class="btn btn-ghost btn-sm" data-mark-read="${n.id}" style="font-size: 0.74rem;">علامت‌گذاری به عنوان خوانده‌شده</button></div>`
                  : ''
              }
            </div>
          `
          )
          .join('');

        notifModalBody.querySelectorAll<HTMLButtonElement>('[data-mark-read]').forEach((btn) => {
          btn.addEventListener('click', async () => {
            const id = Number(btn.dataset.markRead);
            try {
              await markProviderNotificationRead(id);
              void openNotifications();
              if (cachedDashboard) {
                cachedDashboard.unreadNotifications = Math.max(0, (cachedDashboard.unreadNotifications || 1) - 1);
                if (notifBadgeEl) {
                  notifBadgeEl.hidden = cachedDashboard.unreadNotifications === 0;
                  notifBadgeEl.textContent = toPersianDigits(cachedDashboard.unreadNotifications);
                }
              }
            } catch {}
          });
        });
      }
    } catch (err) {
      notifModalBody.innerHTML = `<p class="error-text">${err instanceof Error ? err.message : 'خطا در دریافت اعلانات.'}</p>`;
    }
  }

  // Wire Card Actions (Accept, Reject, Advance status, Open Detail)
  function wireCardActions(container: HTMLElement): void {
    // Action buttons
    container.querySelectorAll<HTMLButtonElement>('[data-action]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const orderId = Number(btn.dataset.orderId);
        const action = btn.dataset.action as string;
        if (!orderId || !action) return;

        btn.disabled = true;
        clearError();
        try {
          await performProviderOrderAction(orderId, action);
          // Reload active view
          if (currentTab === 'dashboard') await loadDashboard();
          else await loadOrders();
        } catch (err) {
          showError(err instanceof Error ? err.message : 'عملیات با شکست مواجه شد.');
          btn.disabled = false;
        }
      });
    });

    // Detail buttons
    container.querySelectorAll<HTMLButtonElement>('[data-detail-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.detailId);
        if (id) void openOrderDetail(id);
      });
    });
  }

  // Modal Closures
  orderModalClose?.addEventListener('click', () => {
    if (orderModal) orderModal.hidden = true;
  });
  notifModalClose?.addEventListener('click', () => {
    if (notifModal) notifModal.hidden = true;
  });
  notifBtn?.addEventListener('click', () => void openNotifications());

  // Close modals on background click
  window.addEventListener('click', (e) => {
    if (e.target === orderModal) orderModal!.hidden = true;
    if (e.target === notifModal) notifModal!.hidden = true;
  });

  // Refresh & Logout
  refreshBtn?.addEventListener('click', () => void loadDashboard());
  logoutBtn?.addEventListener('click', onLogout);

  // Wallet Switcher
  walletBtn?.addEventListener('click', () => {
    if (!walletContainer || !walletMount) return;
    tabSections.forEach((s) => (s.hidden = true));
    walletContainer.hidden = false;
    if (!walletLoaded) {
      walletLoaded = true;
      walletMount.innerHTML = renderMyWalletView();
      initMyWalletView();
    }
  });

  backToJobsBtn?.addEventListener('click', () => {
    if (!walletContainer) return;
    walletContainer.hidden = true;
    switchTab(currentTab);
  });

  // Initial Load
  void loadDashboard();
}

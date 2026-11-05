import { icons } from '../components/icons.ts';
import {
  fetchRequests,
  updateRequestStatus,
  deleteRequest,
  assignRequest,
  fetchStaff,
  fetchRequestReports,
  sendRequestReport,
  fetchRequestEvents,
  downloadRequestsCsv,
} from '../utils/api.ts';
import type { OrderRecord, StaffRecord, RequestReport, RequestEvent } from '../utils/api.ts';
import { STATUS_PIPELINE, STATUS_LABELS } from '../data/status.ts';
import { formatToman, toPersianDigits } from '../utils/format.ts';
import { formatMessageTimestamp } from '../utils/jalali.ts';
import { openAdminInvoiceModal } from '../utils/invoice.ts';

const AUTO_REFRESH_MS = 30000;
const DEFAULT_STATUS = 'pending';

let activeIntervalId: number | undefined;

// گروه‌بندی مراحل برای پایپ‌لاین کانبان ۵ ستونه
interface PipelineStage {
  id: string;
  title: string;
  subtitle: string;
  accent: string;
  statuses: string[];
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'stage_review',
    title: 'پذیرش و بررسی',
    subtitle: 'ثبت جدید و هماهنگی',
    accent: '#64748b',
    statuses: ['submitted', 'pending', 'under_review', 'contacted'],
  },
  {
    id: 'stage_assignment',
    title: 'تخصیص و اعزام',
    subtitle: 'ارجاع تکنسین و اعزام',
    accent: '#0d5c72',
    statuses: ['matching', 'provider_assigned', 'scheduled', 'en_route'],
  },
  {
    id: 'stage_in_progress',
    title: 'در حال اجرا',
    subtitle: 'انجام کار در محل',
    accent: '#d97706',
    statuses: ['in_progress'],
  },
  {
    id: 'stage_completed',
    title: 'تکمیل و تحویل',
    subtitle: 'انجام موفق و فاکتور',
    accent: '#059669',
    statuses: ['completed'],
  },
  {
    id: 'stage_cancelled',
    title: 'لغو / بایگانی',
    subtitle: 'عدم توافق یا انصراف',
    accent: '#dc2626',
    statuses: ['cancelled'],
  },
];

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function matchesSearch(order: OrderRecord, query: string, staffFilter: string): boolean {
  if (staffFilter && staffFilter !== 'all') {
    if (staffFilter === 'unassigned') {
      if (order.assignedStaffId) return false;
    } else if (String(order.assignedStaffId) !== staffFilter) {
      return false;
    }
  }
  if (!query) return true;
  const haystack = `${order.trackingCode} ${order.phone} ${order.originCity} ${order.destinationCity} ${order.customerName} ${order.serviceLabel}`.toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function renderStatusOptions(current: string): string {
  return STATUS_PIPELINE.map(
    (s) => `<option value="${s.id}" ${s.id === current ? 'selected' : ''}>${s.label}</option>`,
  ).join('');
}

function renderAssignOptions(current: number | null, assignable: StaffRecord[]): string {
  const options = assignable
    .map((s) => {
      const busy = s.onActiveService && s.id !== current;
      const label = busy ? `${s.fullName} (${s.roleLabel} — در حال سرویس)` : `${s.fullName} (${s.roleLabel})`;
      return `<option value="${s.id}" ${s.id === current ? 'selected' : ''} ${busy ? 'disabled' : ''}>${label}</option>`;
    })
    .join('');
  return `<option value="">بدون تکنسین (کلیک برای تخصیص)</option>${options}`;
}

function getStatusBadgeStyle(status: string): { bg: string; text: string; dot: string } {
  switch (status) {
    case 'completed':
      return { bg: '#ecfdf5', text: '#065f46', dot: '#10b981' };
    case 'in_progress':
      return { bg: '#fffbeb', text: '#92400e', dot: '#f59e0b' };
    case 'en_route':
    case 'scheduled':
    case 'provider_assigned':
      return { bg: '#f0f9ff', text: '#0369a1', dot: '#0284c7' };
    case 'matching':
    case 'contacted':
      return { bg: '#fef3c7', text: '#b45309', dot: '#f59e0b' };
    case 'cancelled':
      return { bg: '#fef2f2', text: '#991b1b', dot: '#ef4444' };
    default:
      return { bg: '#f1f5f9', text: '#334155', dot: '#64748b' };
  }
}

function renderCard(order: OrderRecord, assignable: StaffRecord[]): string {
  const assigned = assignable.find((s) => s.id === order.assignedStaffId);
  const badgeStyle = getStatusBadgeStyle(order.status);
  const statusLabel = STATUS_LABELS[order.status] || order.status;
  const isUrgent = order.urgency === 'urgent';
  const price = order.finalPrice || order.estimateAvg;

  return `
    <article class="pipeline-card" data-card-id="${order.id}">
      <!-- Card Header -->
      <div class="pipeline-card-header">
        <div class="pipeline-card-tracking-wrap">
          <span class="pipeline-tracking-code">#${toPersianDigits(order.trackingCode)}</span>
          <button type="button" class="pipeline-btn-icon-copy" data-copy-tracking="${order.trackingCode}" title="کپی کد رهگیری">
            <span class="icon">${icons.copy}</span>
          </button>
          ${isUrgent ? `<span class="pipeline-urgent-pill"><span class="icon">${icons.flame}</span>فوری</span>` : ''}
        </div>
        <div class="pipeline-card-status-badge" style="background:${badgeStyle.bg}; color:${badgeStyle.text};">
          <span class="pipeline-status-dot" style="background:${badgeStyle.dot};"></span>
          <span>${statusLabel}</span>
        </div>
      </div>

      <!-- Service & Customer -->
      <div class="pipeline-card-body">
        <div class="pipeline-card-title-row">
          <span class="pipeline-card-service-title">${escapeHtml(order.serviceLabel)}</span>
          <span class="pipeline-card-price">${price ? formatToman(price) : 'توافقی'}</span>
        </div>

        <div class="pipeline-card-info-grid">
          <div class="pipeline-info-item">
            <span class="icon">${icons.user}</span>
            <span class="pipeline-info-text font-medium">${escapeHtml(order.customerName)}</span>
          </div>
          <div class="pipeline-info-item">
            <span class="icon">${icons.phone}</span>
            <a href="tel:${order.phone}" class="pipeline-phone-link" dir="ltr">${order.phone}</a>
          </div>
          <div class="pipeline-info-item">
            <span class="icon">${icons.pin}</span>
            <span class="pipeline-info-text">${escapeHtml(order.originCity || 'تهران')}${order.originDistrict ? ` (${order.originDistrict})` : ''}</span>
          </div>
          <div class="pipeline-info-item">
            <span class="icon">${icons.calendar}</span>
            <span class="pipeline-info-text">${order.scheduledDate ? `${order.scheduledDate} ${order.scheduledTime ? `(${toPersianDigits(order.scheduledTime)})` : ''}` : 'زمان نامشخص'}</span>
          </div>
        </div>

        ${
          order.originNotes
            ? `
          <div class="pipeline-notes-snippet" title="${escapeHtml(order.originNotes)}">
            <span class="icon">${icons.quote}</span>
            <p>${escapeHtml(order.originNotes)}</p>
          </div>
        `
            : ''
        }

        <!-- Technician Assignment Row -->
        <div class="pipeline-tech-row">
          <span class="pipeline-tech-label">متخصص:</span>
          ${
            assigned
              ? `
            <div class="pipeline-tech-assigned">
              <span class="pipeline-tech-avatar">${assigned.fullName.charAt(0)}</span>
              <span class="pipeline-tech-name">${assigned.fullName}</span>
              ${assigned.onActiveService ? '<span class="pipeline-busy-tag">در حال کار</span>' : ''}
            </div>
          `
              : `<span class="pipeline-unassigned-tag">تخصیص‌نیافته</span>`
          }
        </div>
      </div>

      <!-- Quick Action Controls -->
      <div class="pipeline-card-footer">
        <div class="pipeline-card-selects">
          <div class="pipeline-select-wrap">
            <select class="pipeline-custom-select" data-status-select-id="${order.id}" title="تغییر وضعیت سفارش">
              ${renderStatusOptions(order.status)}
            </select>
            <span class="pipeline-select-arrow">${icons.chevronDown}</span>
          </div>

          <div class="pipeline-select-wrap">
            <select class="pipeline-custom-select" data-assign-select-id="${order.id}" title="تخصیص یا تعویض متخصص">
              ${renderAssignOptions(order.assignedStaffId, assignable)}
            </select>
            <span class="pipeline-select-arrow">${icons.chevronDown}</span>
          </div>
        </div>

        <div class="pipeline-card-actions">
          <button type="button" class="pipeline-action-btn" data-invoice-request-id="${order.id}" title="مشاهده و چاپ فاکتور تفکیکی رسمی">
            <span class="icon">${icons.fileText}</span>
            <span>فاکتور</span>
          </button>
          <button type="button" class="pipeline-action-btn" data-drawer-open-id="${order.id}" title="پیامک، گزارش‌ها و تاریخچه سفارش">
            <span class="icon">${icons.message}</span>
            <span>پرونده</span>
          </button>
          <button type="button" class="pipeline-delete-btn" data-delete-request-id="${order.id}" title="حذف درخواست" aria-label="حذف درخواست">
            <span class="icon">${icons.trash}</span>
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderReportsHtml(reports: RequestReport[] | undefined): string {
  if (!reports) return '<div class="drawer-loading">در حال بارگذاری گزارش‌ها...</div>';
  if (!reports.length) return '<p class="drawer-empty-state">هنوز هیچ گزارش یا پیامکی برای این سفارش ثبت نشده است.</p>';
  return reports
    .map(
      (r) => `
    <div class="drawer-report-card">
      <div class="drawer-report-header">
        <span class="drawer-report-author">${escapeHtml(r.staffName || 'همکار سامانه')}</span>
        <span class="drawer-sms-status drawer-sms-status-${r.smsStatus}">
          ${r.smsStatus === 'sent' ? '✓ پیامک ارسال شد' : '✕ پیامک ارسال نشد'}
        </span>
      </div>
      <p class="drawer-report-text">${escapeHtml(r.message)}</p>
    </div>
  `,
    )
    .join('');
}

function renderEventsHtml(events: RequestEvent[] | undefined): string {
  if (!events) return '<div class="drawer-loading">در حال دریافت تاریخچه رویدادها...</div>';
  if (!events.length) return '<p class="drawer-empty-state">هیچ رویدادی در تاریخچه این پرونده ثبت نشده است.</p>';
  return `
    <ol class="drawer-timeline">
      ${events
        .map(
          (e) => `
        <li class="drawer-timeline-item timeline-type-${e.type}">
          <span class="drawer-timeline-marker"></span>
          <div class="drawer-timeline-content">
            <p class="drawer-timeline-title">${escapeHtml(e.description)}</p>
            <div class="drawer-timeline-meta">
              ${e.staffName ? `<span class="drawer-timeline-staff">${escapeHtml(e.staffName)}</span> · ` : ''}
              <time>${formatMessageTimestamp(e.createdAt)}</time>
            </div>
          </div>
        </li>
      `,
        )
        .join('')}
    </ol>
  `;
}

export function renderPipelineView(): string {
  return `
    <div class="pipeline-view-root">
      <!-- Header & Top Command Bar -->
      <div class="pipeline-top-bar">
        <div class="pipeline-title-group">
          <div class="pipeline-title-line">
            <h1>مراحل و پایپ‌لاین سفارش‌ها</h1>
            <span class="pipeline-live-pill" id="pipeline-live-pill" title="به‌روزرسانی خودکار هر ۳۰ ثانیه فعال است">
              <span class="pipeline-live-indicator"></span>
              <span>همگام برخط</span>
            </span>
          </div>
          <p class="pipeline-subtitle">جریان کار، وضعیت حضور در محل و تخصیص تکنسین‌های پلتفرم بهدون</p>
        </div>

        <div class="pipeline-toolbar-actions">
          <button type="button" class="btn btn-secondary btn-sm" id="pipeline-map-btn" title="نمایش پراکندگی سفارش‌ها روی نقشه">
            <span class="icon">${icons.map}</span>
            <span>نقشه سفارش‌ها</span>
          </button>
          <button type="button" class="btn btn-secondary btn-sm" id="pipeline-export-csv" title="دریافت فایل خروجی اکسل و CSV">
            <span class="icon">${icons.download}</span>
            <span>خروجی CSV</span>
          </button>
          <button type="button" class="btn btn-primary btn-sm" id="pipeline-refresh" title="بازخوانی فوری اطلاعات">
            <span class="icon">${icons.refresh}</span>
            <span>به‌روزرسانی</span>
          </button>
        </div>
      </div>

      <!-- Quick Metrics Ribbon -->
      <div class="pipeline-metrics-ribbon" id="pipeline-metrics-ribbon">
        <div class="metric-ribbon-item">
          <span class="metric-label">کل سفارش‌ها</span>
          <span class="metric-value" id="metric-total">۰</span>
        </div>
        <div class="metric-ribbon-divider"></div>
        <div class="metric-ribbon-item" data-filter-status="submitted,pending,under_review,contacted">
          <span class="metric-dot" style="background:#64748b;"></span>
          <span class="metric-label">در انتظار بررسی</span>
          <span class="metric-value" id="metric-review">۰</span>
        </div>
        <div class="metric-ribbon-divider"></div>
        <div class="metric-ribbon-item" data-filter-status="matching,provider_assigned,scheduled,en_route">
          <span class="metric-dot" style="background:#0d5c72;"></span>
          <span class="metric-label">تخصیص و اعزام</span>
          <span class="metric-value" id="metric-dispatch">۰</span>
        </div>
        <div class="metric-ribbon-divider"></div>
        <div class="metric-ribbon-item" data-filter-status="in_progress">
          <span class="metric-dot" style="background:#d97706;"></span>
          <span class="metric-label">در حال انجام</span>
          <span class="metric-value" id="metric-progress">۰</span>
        </div>
        <div class="metric-ribbon-divider"></div>
        <div class="metric-ribbon-item" data-filter-status="completed">
          <span class="metric-dot" style="background:#059669;"></span>
          <span class="metric-label">تکمیل و تحویل</span>
          <span class="metric-value" id="metric-completed">۰</span>
        </div>
      </div>

      <!-- Filter & View Switcher Bar -->
      <div class="pipeline-filter-bar">
        <div class="pipeline-search-wrap">
          <span class="icon search-icon">${icons.search}</span>
          <input
            type="text"
            class="pipeline-search-input"
            id="pipeline-search"
            placeholder="جستجو در سفارش‌ها (کد رهگیری، مشتری، تلفن، خدمت، محدوده)..."
          />
          <button type="button" class="pipeline-search-clear" id="pipeline-search-clear" title="پاک‌کردن" hidden>
            <span class="icon">${icons.close}</span>
          </button>
        </div>

        <div class="pipeline-filter-controls">
          <div class="pipeline-filter-select-wrap">
            <span class="icon">${icons.users}</span>
            <select id="pipeline-staff-filter" class="pipeline-filter-select">
              <option value="all">همه تکنسین‌ها</option>
              <option value="unassigned">فقط بدون تکنسین</option>
            </select>
          </div>

          <div class="pipeline-view-mode-toggle">
            <button type="button" class="mode-toggle-btn is-active" id="btn-mode-kanban" title="نمای پایپ‌لاین ستونی (کانبان)">
              <span class="icon">${icons.columns}</span>
              <span>پایپ‌لاین ستونی</span>
            </button>
            <button type="button" class="mode-toggle-btn" id="btn-mode-tabs" title="نمای دسته‌بندی تب‌ها و گرید">
              <span class="icon">${icons.grid}</span>
              <span>تب‌های وضعیت</span>
            </button>
          </div>
        </div>
      </div>

      <p class="pipeline-error-banner" id="pipeline-error" hidden></p>

      <!-- Status Tabs (Shown in 'tabs' view mode) -->
      <div class="pipeline-status-tabs-container" id="pipeline-tabs-container" hidden>
        <div class="pipeline-status-tabs" id="pipeline-tabs">
          ${STATUS_PIPELINE.map(
            (status) => `
              <button type="button" class="pipeline-status-tab ${status.id === DEFAULT_STATUS ? 'is-active' : ''}" data-pipeline-tab="${status.id}" style="--tab-color:${status.color};">
                <span class="tab-indicator" style="background:${status.color};"></span>
                <span class="tab-label">${status.label}</span>
                <span class="tab-count" id="tab-count-${status.id}">۰</span>
              </button>
            `,
          ).join('')}
        </div>
      </div>

      <!-- Main Board Container -->
      <div class="pipeline-board-container" id="pipeline-board-container">
        <!-- Rendered dynamically (Kanban or Tab Grid) -->
      </div>

      <!-- Order Side Drawer (Slide-Over for Reports, History & SMS) -->
      <div class="pipeline-drawer-backdrop" id="pipeline-drawer-backdrop" hidden>
        <div class="pipeline-drawer-panel" id="pipeline-drawer-panel" role="dialog" aria-modal="true">
          <div class="drawer-header">
            <div>
              <div class="drawer-title" id="drawer-order-title">پرونده سفارش #--</div>
              <div class="drawer-subtitle" id="drawer-order-sub">مدیریت پیامک‌های ارسالی، گزارش‌ها و تاریخچه رویدادها</div>
            </div>
            <button type="button" class="drawer-close-btn" id="drawer-close-btn" aria-label="بستن پنل">
              <span class="icon">${icons.close}</span>
            </button>
          </div>

          <div class="drawer-tabs">
            <button type="button" class="drawer-tab is-active" id="drawer-tab-reports" data-drawer-tab="reports">
              <span class="icon">${icons.message}</span>
              <span>پیامک و گزارش به مشتری</span>
            </button>
            <button type="button" class="drawer-tab" id="drawer-tab-history" data-drawer-tab="history">
              <span class="icon">${icons.history}</span>
              <span>تاریخچه رویدادها</span>
            </button>
          </div>

          <div class="drawer-content">
            <!-- Reports Section -->
            <div class="drawer-section" id="drawer-section-reports">
              <div class="drawer-sms-form">
                <label for="drawer-sms-text" class="drawer-form-label">متن پیامک ارسالی به شماره همراه مشتری:</label>
                <textarea
                  id="drawer-sms-text"
                  class="drawer-textarea"
                  rows="3"
                  placeholder="متن گزارش خود را بنویسید (مثلاً: تکنسین به محل رسید و بررسی آغاز شد)..."
                ></textarea>
                <div class="drawer-form-actions">
                  <span class="drawer-error-msg" id="drawer-report-error" hidden></span>
                  <button type="button" class="btn btn-primary btn-sm" id="drawer-btn-send">
                    <span class="icon">${icons.sendArrow}</span>
                    <span>ثبت گزارش و ارسال پیامک</span>
                  </button>
                </div>
              </div>

              <div class="drawer-history-list" id="drawer-reports-list"></div>
            </div>

            <!-- History Section -->
            <div class="drawer-section" id="drawer-section-history" hidden>
              <div class="drawer-history-list" id="drawer-events-list"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initPipelineView(onNavigate?: (screen: string) => void): void {
  const container = document.getElementById('pipeline-board-container');
  const tabsContainer = document.getElementById('pipeline-tabs-container');
  const tabsEl = document.getElementById('pipeline-tabs');
  const errorEl = document.getElementById('pipeline-error');
  const refreshBtn = document.getElementById('pipeline-refresh');
  const searchInput = document.getElementById('pipeline-search') as HTMLInputElement | null;
  const searchClearBtn = document.getElementById('pipeline-search-clear');
  const staffFilterSelect = document.getElementById('pipeline-staff-filter') as HTMLSelectElement | null;
  const btnKanban = document.getElementById('btn-mode-kanban');
  const btnTabs = document.getElementById('btn-mode-tabs');
  const mapBtn = document.getElementById('pipeline-map-btn');
  const exportBtn = document.getElementById('pipeline-export-csv') as HTMLButtonElement | null;

  if (!container || !errorEl || !refreshBtn || !searchInput) return;

  mapBtn?.addEventListener('click', () => {
    if (onNavigate) onNavigate('map');
  });

  let latestOrders: OrderRecord[] = [];
  let latestAssignable: StaffRecord[] = [];
  let searchQuery = '';
  let selectedStaffFilter = 'all';
  let activeStatusTab = DEFAULT_STATUS;
  let viewMode: 'kanban' | 'tabs' = 'kanban';

  // Drawer states
  let currentDrawerOrderId: number | null = null;
  const reportsCache = new Map<number, RequestReport[]>();
  const eventsCache = new Map<number, RequestEvent[]>();
  const drawerBackdrop = document.getElementById('pipeline-drawer-backdrop');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerTitle = document.getElementById('drawer-order-title');
  const drawerSub = document.getElementById('drawer-order-sub');
  const drawerTabReports = document.getElementById('drawer-tab-reports');
  const drawerTabHistory = document.getElementById('drawer-tab-history');
  const drawerSecReports = document.getElementById('drawer-section-reports');
  const drawerSecHistory = document.getElementById('drawer-section-history');
  const drawerSmsText = document.getElementById('drawer-sms-text') as HTMLTextAreaElement | null;
  const drawerBtnSend = document.getElementById('drawer-btn-send') as HTMLButtonElement | null;
  const drawerReportError = document.getElementById('drawer-report-error');
  const drawerReportsList = document.getElementById('drawer-reports-list');
  const drawerEventsList = document.getElementById('drawer-events-list');

  function updateMetrics(): void {
    const total = latestOrders.length;
    const review = latestOrders.filter((o) => ['submitted', 'pending', 'under_review', 'contacted'].includes(o.status)).length;
    const dispatch = latestOrders.filter((o) => ['matching', 'provider_assigned', 'scheduled', 'en_route'].includes(o.status)).length;
    const progress = latestOrders.filter((o) => o.status === 'in_progress').length;
    const completed = latestOrders.filter((o) => o.status === 'completed').length;

    const elTotal = document.getElementById('metric-total');
    const elReview = document.getElementById('metric-review');
    const elDispatch = document.getElementById('metric-dispatch');
    const elProgress = document.getElementById('metric-progress');
    const elCompleted = document.getElementById('metric-completed');

    if (elTotal) elTotal.textContent = toPersianDigits(total);
    if (elReview) elReview.textContent = toPersianDigits(review);
    if (elDispatch) elDispatch.textContent = toPersianDigits(dispatch);
    if (elProgress) elProgress.textContent = toPersianDigits(progress);
    if (elCompleted) elCompleted.textContent = toPersianDigits(completed);

    // Update tab counts
    STATUS_PIPELINE.forEach((status) => {
      const countEl = document.getElementById(`tab-count-${status.id}`);
      if (countEl) {
        countEl.textContent = toPersianDigits(latestOrders.filter((o) => o.status === status.id).length);
      }
    });
  }

  function renderKanbanBoard(): void {
    const filteredOrders = latestOrders.filter((o) => matchesSearch(o, searchQuery, selectedStaffFilter));

    const columnsHtml = PIPELINE_STAGES.map((stage) => {
      const stageOrders = filteredOrders.filter((o) => stage.statuses.includes(o.status));
      const totalAmount = stageOrders.reduce((sum, o) => sum + (o.finalPrice || o.estimateAvg || 0), 0);

      const cardsHtml = stageOrders.length
        ? stageOrders.map((o) => renderCard(o, latestAssignable)).join('')
        : `<div class="pipeline-column-empty">
             <span class="icon">${icons.columns}</span>
             <span>سفارشی در این مرحله وجود ندارد</span>
           </div>`;

      return `
        <div class="pipeline-kanban-column" data-stage-id="${stage.id}">
          <div class="pipeline-column-header" style="border-top-color: ${stage.accent};">
            <div class="pipeline-column-title-wrap">
              <span class="pipeline-column-indicator" style="background:${stage.accent};"></span>
              <h3 class="pipeline-column-title">${stage.title}</h3>
              <span class="pipeline-column-count">${toPersianDigits(stageOrders.length)}</span>
            </div>
            <div class="pipeline-column-meta">
              <span>${stage.subtitle}</span>
              ${totalAmount > 0 ? `<span class="pipeline-column-amount">${formatToman(totalAmount)}</span>` : ''}
            </div>
          </div>
          <div class="pipeline-column-cards-list">
            ${cardsHtml}
          </div>
        </div>
      `;
    }).join('');

    container!.innerHTML = `
      <div class="pipeline-kanban-board">
        ${columnsHtml}
      </div>
    `;

    wireCardEvents();
  }

  function renderTabsGrid(): void {
    const filteredOrders = latestOrders.filter((o) => o.status === activeStatusTab && matchesSearch(o, searchQuery, selectedStaffFilter));

    if (!filteredOrders.length) {
      container!.innerHTML = `
        <div class="pipeline-empty-grid-state">
          <span class="icon">${icons.grid}</span>
          <h3>هیچ سفارشی در وضعیت «${STATUS_LABELS[activeStatusTab] || activeStatusTab}» یافت نشد.</h3>
          <p>با تغییر فیلترها یا جستجو، سفارش‌های دیگر را مشاهده کنید.</p>
        </div>
      `;
    } else {
      container!.innerHTML = `
        <div class="pipeline-cards-grid">
          ${filteredOrders.map((o) => renderCard(o, latestAssignable)).join('')}
        </div>
      `;
    }

    wireCardEvents();
  }

  function renderView(): void {
    updateMetrics();

    if (viewMode === 'kanban') {
      tabsContainer!.hidden = true;
      renderKanbanBoard();
    } else {
      tabsContainer!.hidden = false;
      renderTabsGrid();
    }
  }

  function wireCardEvents(): void {
    // 1. Status Dropdown
    container!.querySelectorAll<HTMLSelectElement>('[data-status-select-id]').forEach((select) => {
      select.addEventListener('change', async () => {
        const id = Number(select.dataset.statusSelectId);
        const newStatus = select.value;
        select.disabled = true;
        try {
          await updateRequestStatus(id, newStatus);
          await load();
        } catch (err) {
          errorEl!.hidden = false;
          errorEl!.textContent = err instanceof Error ? err.message : 'به‌روزرسانی وضعیت ناموفق بود.';
          select.disabled = false;
        }
      });
    });

    // 2. Staff Assign Dropdown
    container!.querySelectorAll<HTMLSelectElement>('[data-assign-select-id]').forEach((select) => {
      select.addEventListener('change', async () => {
        const id = Number(select.dataset.assignSelectId);
        const staffId = select.value ? Number(select.value) : null;
        select.disabled = true;
        try {
          await assignRequest(id, staffId);
          await load();
        } catch (err) {
          errorEl!.hidden = false;
          errorEl!.textContent = err instanceof Error ? err.message : 'اختصاص متخصص ناموفق بود.';
          select.disabled = false;
        }
      });
    });

    // 3. Invoice Button
    container!.querySelectorAll<HTMLButtonElement>('[data-invoice-request-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.invoiceRequestId);
        const order = latestOrders.find((o) => o.id === id);
        if (order) {
          openAdminInvoiceModal(order, () => {
            void load();
          });
        }
      });
    });

    // 4. Delete Request Button
    container!.querySelectorAll<HTMLButtonElement>('[data-delete-request-id]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = Number(btn.dataset.deleteRequestId);
        if (!window.confirm('این درخواست برای همیشه از سرور حذف شود؟ این کار قابل بازگشت نیست.')) return;
        btn.disabled = true;
        try {
          await deleteRequest(id);
          await load();
        } catch (err) {
          errorEl!.hidden = false;
          errorEl!.textContent = err instanceof Error ? err.message : 'حذف درخواست ناموفق بود.';
          btn.disabled = false;
        }
      });
    });

    // 5. Copy Tracking Code
    container!.querySelectorAll<HTMLButtonElement>('[data-copy-tracking]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const code = btn.dataset.copyTracking || '';
        if (!code) return;
        try {
          await navigator.clipboard.writeText(code);
          const orig = btn.innerHTML;
          btn.innerHTML = `<span class="icon text-success">${icons.check}</span>`;
          setTimeout(() => {
            btn.innerHTML = orig;
          }, 1500);
        } catch {
          /* ignore */
        }
      });
    });

    // 6. Open Drawer Button
    container!.querySelectorAll<HTMLButtonElement>('[data-drawer-open-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.drawerOpenId);
        openDrawer(id);
      });
    });
  }

  // Drawer functions
  async function openDrawer(orderId: number): Promise<void> {
    currentDrawerOrderId = orderId;
    const order = latestOrders.find((o) => o.id === orderId);
    if (!order || !drawerBackdrop) return;

    if (drawerTitle) drawerTitle.textContent = `پرونده سفارش #${toPersianDigits(order.trackingCode)} — ${order.customerName}`;
    if (drawerSub) drawerSub.textContent = `${order.serviceLabel} · ${order.originCity || 'تهران'} · ${order.scheduledDate || ''}`;

    if (drawerSmsText) drawerSmsText.value = '';
    if (drawerReportError) drawerReportError.hidden = true;

    // Default to reports tab
    switchDrawerTab('reports');
    drawerBackdrop.hidden = false;
    document.body.classList.add('pipeline-drawer-open');

    // Fetch reports
    if (drawerReportsList) drawerReportsList.innerHTML = renderReportsHtml(reportsCache.get(orderId));
    if (drawerEventsList) drawerEventsList.innerHTML = renderEventsHtml(eventsCache.get(orderId));

    try {
      const [reports, events] = await Promise.all([
        fetchRequestReports(orderId).catch(() => []),
        fetchRequestEvents(orderId).catch(() => []),
      ]);
      reportsCache.set(orderId, reports);
      eventsCache.set(orderId, events);
      if (drawerReportsList) drawerReportsList.innerHTML = renderReportsHtml(reports);
      if (drawerEventsList) drawerEventsList.innerHTML = renderEventsHtml(events);
    } catch {
      /* ignore */
    }
  }

  function closeDrawer(): void {
    if (drawerBackdrop) drawerBackdrop.hidden = true;
    document.body.classList.remove('pipeline-drawer-open');
    currentDrawerOrderId = null;
  }

  function switchDrawerTab(tab: 'reports' | 'history'): void {
    if (tab === 'reports') {
      drawerTabReports?.classList.add('is-active');
      drawerTabHistory?.classList.remove('is-active');
      if (drawerSecReports) drawerSecReports.hidden = false;
      if (drawerSecHistory) drawerSecHistory.hidden = true;
    } else {
      drawerTabReports?.classList.remove('is-active');
      drawerTabHistory?.classList.add('is-active');
      if (drawerSecReports) drawerSecReports.hidden = true;
      if (drawerSecHistory) drawerSecHistory.hidden = false;
    }
  }

  drawerTabReports?.addEventListener('click', () => switchDrawerTab('reports'));
  drawerTabHistory?.addEventListener('click', () => switchDrawerTab('history'));
  drawerCloseBtn?.addEventListener('click', closeDrawer);
  drawerBackdrop?.addEventListener('click', (e) => {
    if (e.target === drawerBackdrop) closeDrawer();
  });

  drawerBtnSend?.addEventListener('click', async () => {
    if (!currentDrawerOrderId || !drawerSmsText || !drawerBtnSend) return;
    const msg = drawerSmsText.value.trim();
    if (!msg) {
      if (drawerReportError) {
        drawerReportError.hidden = false;
        drawerReportError.textContent = 'لطفاً متن پیامک را وارد کنید.';
      }
      return;
    }

    if (drawerReportError) drawerReportError.hidden = true;
    drawerBtnSend.disabled = true;

    try {
      const res = await sendRequestReport(currentDrawerOrderId, msg);
      const existing = reportsCache.get(currentDrawerOrderId) ?? [];
      const updated = [res.report, ...existing];
      reportsCache.set(currentDrawerOrderId, updated);
      if (drawerReportsList) drawerReportsList.innerHTML = renderReportsHtml(updated);
      drawerSmsText.value = '';

      if (!res.ok && res.error) {
        if (drawerReportError) {
          drawerReportError.hidden = false;
          drawerReportError.textContent = `گزارش ثبت شد اما ارسال پیامک با خطا مواجه شد: ${res.error}`;
        }
      }
    } catch (err) {
      if (drawerReportError) {
        drawerReportError.hidden = false;
        drawerReportError.textContent = err instanceof Error ? err.message : 'ثبت گزارش ناموفق بود.';
      }
    } finally {
      drawerBtnSend.disabled = false;
    }
  });

  // Populate staff filter
  function populateStaffFilter(): void {
    if (!staffFilterSelect) return;
    const currentVal = staffFilterSelect.value;
    const optionsHtml = latestAssignable
      .map((s) => `<option value="${s.id}" ${String(s.id) === currentVal ? 'selected' : ''}>${s.fullName} (${s.roleLabel})</option>`)
      .join('');
    staffFilterSelect.innerHTML = `
      <option value="all">همه تکنسین‌ها</option>
      <option value="unassigned">فقط بدون تکنسین</option>
      ${optionsHtml}
    `;
  }

  async function load(): Promise<void> {
    errorEl!.hidden = true;
    try {
      const [orders, staff] = await Promise.all([fetchRequests(), fetchStaff()]);
      latestOrders = orders;
      latestAssignable = staff.filter((s) => s.assignable && s.isActive);
      populateStaffFilter();
      renderView();
    } catch (err) {
      errorEl!.hidden = false;
      errorEl!.textContent = err instanceof Error ? err.message : 'خطا در بارگذاری اطلاعات سفارش‌ها.';
    }
  }

  // View mode toggling
  btnKanban?.addEventListener('click', () => {
    viewMode = 'kanban';
    btnKanban.classList.add('is-active');
    btnTabs?.classList.remove('is-active');
    renderView();
  });

  btnTabs?.addEventListener('click', () => {
    viewMode = 'tabs';
    btnTabs.classList.add('is-active');
    btnKanban?.classList.remove('is-active');
    renderView();
  });

  // Tab click in tabs mode
  tabsEl?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-pipeline-tab]');
    if (!btn) return;
    tabsEl.querySelectorAll('[data-pipeline-tab]').forEach((t) => t.classList.remove('is-active'));
    btn.classList.add('is-active');
    activeStatusTab = btn.dataset.pipelineTab!;
    renderTabsGrid();
  });

  // Search input
  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.trim();
    if (searchClearBtn) searchClearBtn.hidden = !searchQuery;
    renderView();
  });

  searchClearBtn?.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    searchClearBtn.hidden = true;
    renderView();
  });

  // Staff filter
  staffFilterSelect?.addEventListener('change', () => {
    selectedStaffFilter = staffFilterSelect.value;
    renderView();
  });

  // Refresh
  refreshBtn.addEventListener('click', () => void load());

  // Export CSV
  exportBtn?.addEventListener('click', async () => {
    exportBtn.disabled = true;
    try {
      await downloadRequestsCsv();
    } catch (err) {
      errorEl.textContent = err instanceof Error ? err.message : 'دریافت خروجی ناموفق بود.';
      errorEl.hidden = false;
    } finally {
      exportBtn.disabled = false;
    }
  });

  if (activeIntervalId !== undefined) window.clearInterval(activeIntervalId);
  activeIntervalId = window.setInterval(() => void load(), AUTO_REFRESH_MS);

  void load();
}

import { icons } from '../components/icons.ts';
import { fetchRequestsByStaff } from '../utils/api.ts';
import type { OrderRecord, StaffRecord } from '../utils/api.ts';
import { STATUS_LABELS } from '../data/status.ts';
import { formatToman, toPersianDigits } from '../utils/format.ts';

function renderCard(order: OrderRecord): string {
  return `
    <div class="portal-card">
      <div class="portal-card-top">
        <span class="pipeline-tracking">#${toPersianDigits(order.trackingCode)}</span>
        <span class="portal-status">${STATUS_LABELS[order.status] ?? order.status}</span>
      </div>
      <div class="pipeline-service">${order.serviceLabel}</div>
      <div class="pipeline-row">
        <span class="icon">${icons.pin}</span>
        <span>${order.originCity || 'تهران'}</span>
        ${order.destinationCity && order.destinationCity !== order.originCity ? `<span> (${order.destinationCity})</span>` : ''}
      </div>
      <div class="pipeline-row pipeline-muted">
        <span class="icon">${icons.calendar}</span>
        <span>${order.scheduledDate} — ساعت ${toPersianDigits(order.scheduledTime)}</span>
      </div>
      <div class="pipeline-estimate">${formatToman(order.estimateAvg)}</div>
    </div>
  `;
}

// این بخش خودش "تاریخچه‌ی خدمات و کارها" است — سوابق کامل درخواست‌هایی که تا‌به‌حال به این
// کارمند (تکنسین، استادکار یا هر نقش دیگر) اختصاص یافته، نه فقط عملکرد لحظه‌ای.
export function renderStaffHistoryView(staff: StaffRecord): string {
  return `
    <div class="view-header">
      <h1>تاریخچه خدمات و کارها — ${staff.fullName}</h1>
      <button type="button" class="btn btn-secondary" id="staff-history-refresh">به‌روزرسانی</button>
    </div>
    <p class="error-text" id="staff-history-error" hidden></p>
    <div class="stat-cards" id="staff-history-stats"></div>
    <div class="portal-list" id="staff-history-list"></div>
  `;
}

export function initStaffHistoryView(staff: StaffRecord): void {
  const errorEl = document.getElementById('staff-history-error');
  const statsEl = document.getElementById('staff-history-stats');
  const listEl = document.getElementById('staff-history-list');
  const refreshBtn = document.getElementById('staff-history-refresh');
  if (!errorEl || !statsEl || !listEl || !refreshBtn) return;

  async function load(): Promise<void> {
    errorEl!.hidden = true;
    try {
      const orders = await fetchRequestsByStaff(staff.id);
      const completed = orders.filter((o) => o.status === 'completed').length;
      const inProgress = orders.filter((o) => o.status === 'in_progress').length;

      statsEl!.innerHTML = `
        <div class="stat-card">
          <span class="stat-card-label">کل کارهای اختصاص‌یافته</span>
          <span class="stat-card-value">${toPersianDigits(orders.length)}</span>
        </div>
        <div class="stat-card">
          <span class="stat-card-label">انجام‌شده</span>
          <span class="stat-card-value">${toPersianDigits(completed)}</span>
        </div>
        <div class="stat-card">
          <span class="stat-card-label">در حال انجام</span>
          <span class="stat-card-value">${toPersianDigits(inProgress)}</span>
        </div>
      `;

      listEl!.innerHTML = orders.length ? orders.map(renderCard).join('') : '<p class="portal-empty">هنوز کاری به این کارمند اختصاص داده نشده است.</p>';
    } catch (err) {
      errorEl!.hidden = false;
      errorEl!.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
    }
  }

  refreshBtn.addEventListener('click', () => void load());
  void load();
}

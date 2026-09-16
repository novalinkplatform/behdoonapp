import { icons } from '../components/icons.ts';
import { fetchMyRequests, updateMyRequestStatus } from '../utils/api.ts';
import type { OrderRecord } from '../utils/api.ts';
import { STATUS_LABELS } from '../data/status.ts';
import { formatToman, toPersianDigits } from '../utils/format.ts';
import type { StaffInfo } from '../utils/auth.ts';
import { renderMyWalletView, initMyWalletView } from './MyWalletView.ts';
import { renderLicenseLockBanner } from '../components/LicenseLockBanner.ts';
import { renderDemoAccountBanner } from '../components/DemoAccountBanner.ts';

const NEXT_STATUS: Record<string, { next: string; label: string } | undefined> = {
  pending: { next: 'in_progress', label: 'شروع کار' },
  contacted: { next: 'in_progress', label: 'شروع کار' },
  scheduled: { next: 'in_progress', label: 'شروع کار' },
  in_progress: { next: 'completed', label: 'پایان کار' },
};

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderCard(order: OrderRecord): string {
  const action = NEXT_STATUS[order.status];
  const navLat = order.originLat ?? order.destinationLat;
  const navLng = order.originLng ?? order.destinationLng;
  const navUrl =
    navLat != null && navLng != null
      ? `https://www.google.com/maps/dir/?api=1&destination=${navLat},${navLng}`
      : null;

  return `
    <div class="portal-card" data-portal-card-id="${order.id}">
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
      ${order.originNotes ? `<p class="pipeline-note"><strong>توضیحات درخواست:</strong> ${escapeHtml(order.originNotes)}</p>` : ''}
      ${order.destinationNotes && order.destinationNotes !== order.originNotes ? `<p class="pipeline-note"><strong>یادداشت تکمیلی:</strong> ${escapeHtml(order.destinationNotes)}</p>` : ''}
      <a class="pipeline-row pipeline-phone" href="tel:${order.phone}">
        <span class="icon">${icons.phone}</span>
        <span dir="ltr">${order.phone}</span>
      </a>
      <div class="pipeline-estimate">${formatToman(order.estimateAvg)}</div>
      <div class="portal-actions">
        ${navUrl ? `<a class="btn btn-secondary btn-sm" href="${navUrl}" target="_blank" rel="noopener">مسیریابی به آدرس پروژه</a>` : ''}
        ${action ? `<button type="button" class="btn btn-primary btn-sm" data-advance-id="${order.id}" data-advance-status="${action.next}">${action.label}</button>` : ''}
      </div>
    </div>
  `;
}

export function renderStaffPortalView(staff: StaffInfo): string {
  return `
    <div class="portal-shell">
      <header class="portal-header">
        <div class="admin-logo">
          <img class="admin-logo-mark" src="/favicon.svg" alt="" />
          <span id="staff-portal-brand-text">بهدون</span>
        </div>
        <div class="portal-user">
          <span>${staff.fullName}</span>
          <button type="button" class="btn btn-secondary btn-sm" id="portal-wallet-btn">
            <span class="icon">${icons.wallet}</span>
            کیف پول من
          </button>
          <button type="button" class="btn btn-secondary btn-sm" id="portal-logout-btn">
            <span class="icon">${icons.logout}</span>
            خروج
          </button>
        </div>
      </header>
      ${staff.licenseLocked ? renderLicenseLockBanner() : ''}
      ${staff.username === 'test' ? renderDemoAccountBanner() : ''}
      <main class="portal-main">
        <div id="portal-jobs-container">
          <div class="view-header">
            <h1>کارهای فعال</h1>
            <button type="button" class="btn btn-secondary" id="portal-refresh">
              <span class="icon">${icons.refresh}</span>
              به‌روزرسانی
            </button>
          </div>
          <p class="error-text" id="portal-error" hidden></p>
          <div class="portal-list" id="portal-list"></div>

          <div class="view-header" style="margin-top:var(--space-6)">
            <h1>تاریخچه خدمات و کارها</h1>
          </div>
          <div class="stat-cards" id="portal-history-stats"></div>
          <div class="portal-list" id="portal-history-list"></div>
        </div>
        <div id="portal-wallet-container" hidden>
          <button type="button" class="btn btn-ghost btn-sm" id="portal-back-to-jobs-btn" style="margin-bottom: var(--space-4)">بازگشت به کارها</button>
          <div id="portal-wallet-mount"></div>
        </div>
      </main>
    </div>
  `;
}

const ACTIVE_STATUSES = new Set(['pending', 'contacted', 'scheduled', 'in_progress']);

export function initStaffPortalView(onLogout: () => void): void {
  const errorEl = document.getElementById('portal-error');
  const list = document.getElementById('portal-list');
  const historyStats = document.getElementById('portal-history-stats');
  const historyList = document.getElementById('portal-history-list');
  const refreshBtn = document.getElementById('portal-refresh');
  const logoutBtn = document.getElementById('portal-logout-btn');
  if (!errorEl || !list || !historyStats || !historyList || !refreshBtn || !logoutBtn) return;

  async function load(): Promise<void> {
    errorEl!.hidden = true;
    try {
      const orders = await fetchMyRequests();
      const active = orders.filter((o) => ACTIVE_STATUSES.has(o.status));
      const history = orders.filter((o) => !ACTIVE_STATUSES.has(o.status));
      const completed = history.filter((o) => o.status === 'completed').length;

      list!.innerHTML = active.length
        ? active.map(renderCard).join('')
        : '<p class="portal-empty">در حال حاضر کاری در جریان ندارید.</p>';

      historyStats!.innerHTML = `
        <div class="stat-card">
          <span class="stat-card-label">کل خدمات ارائه‌شده</span>
          <span class="stat-card-value">${toPersianDigits(orders.length)}</span>
        </div>
        <div class="stat-card">
          <span class="stat-card-label">انجام‌شده</span>
          <span class="stat-card-value">${toPersianDigits(completed)}</span>
        </div>
      `;
      historyList!.innerHTML = history.length
        ? history.map(renderCard).join('')
        : '<p class="portal-empty">هنوز کاری در تاریخچه‌ی شما ثبت نشده است.</p>';

      wireActions();
    } catch (err) {
      errorEl!.hidden = false;
      errorEl!.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
    }
  }

  function wireActions(): void {
    list!.querySelectorAll<HTMLButtonElement>('[data-advance-id]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = Number(btn.dataset.advanceId);
        const status = btn.dataset.advanceStatus as string;
        btn.disabled = true;
        try {
          await updateMyRequestStatus(id, status);
          await load();
        } catch (err) {
          errorEl!.hidden = false;
          errorEl!.textContent = err instanceof Error ? err.message : 'به‌روزرسانی ناموفق بود.';
          btn.disabled = false;
        }
      });
    });
  }

  refreshBtn.addEventListener('click', () => void load());
  logoutBtn.addEventListener('click', onLogout);
  void load();

  // این پرتال یک شِل کاملاً جدا از main.ts/showScreen است (راننده/کارگر اصلاً وارد آن نمی‌شوند)، پس
  // «کیف پول من» این‌جا یک سوییچ محلی بین دو بخش همین صفحه است، نه یک صفحه‌ی مسیریابی‌شده.
  const jobsContainer = document.getElementById('portal-jobs-container');
  const walletContainer = document.getElementById('portal-wallet-container');
  const walletMount = document.getElementById('portal-wallet-mount');
  const walletBtn = document.getElementById('portal-wallet-btn');
  const backToJobsBtn = document.getElementById('portal-back-to-jobs-btn');
  let walletLoaded = false;

  walletBtn?.addEventListener('click', () => {
    if (!jobsContainer || !walletContainer || !walletMount) return;
    jobsContainer.hidden = true;
    walletContainer.hidden = false;
    if (!walletLoaded) {
      walletLoaded = true;
      walletMount.innerHTML = renderMyWalletView();
      initMyWalletView();
    }
  });

  backToJobsBtn?.addEventListener('click', () => {
    if (!jobsContainer || !walletContainer) return;
    walletContainer.hidden = true;
    jobsContainer.hidden = false;
  });
}

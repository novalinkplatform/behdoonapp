import { fetchActivityLog } from '../utils/api.ts';
import type { ActivityLogEntry } from '../utils/api.ts';
import { formatMessageTimestamp } from '../utils/jalali.ts';

function escapeHtml(input: string): string {
  return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderRow(entry: ActivityLogEntry): string {
  return `
    <div class="activity-log-row">
      <div class="activity-log-main">
        <span class="activity-log-action">${escapeHtml(entry.action)}</span>
        ${entry.targetLabel ? `<span class="activity-log-target">${escapeHtml(entry.targetLabel)}</span>` : ''}
      </div>
      <div class="activity-log-meta">
        <span>${escapeHtml(entry.staffName)}</span>
        <span>${formatMessageTimestamp(entry.createdAt)}</span>
      </div>
    </div>
  `;
}

export function renderActivityLogView(): string {
  return `
    <div class="view-header">
      <h1>گزارش فعالیت کارمندان</h1>
      <button type="button" class="btn btn-secondary" id="activity-log-refresh">به‌روزرسانی</button>
    </div>
    <p class="settings-panel-hint">
      اقدامات حساس پنل ادمین (حذف کارمند/درخواست، تغییر نقش، ایجاد/ویرایش/حذف نقش) این‌جا ثبت می‌شود — آخرین ۳۰۰ مورد.
    </p>
    <p class="error-text" id="activity-log-error" hidden></p>
    <div class="activity-log-list" id="activity-log-list"></div>
  `;
}

export function initActivityLogView(): void {
  const listEl = document.getElementById('activity-log-list');
  const errorEl = document.getElementById('activity-log-error');
  const refreshBtn = document.getElementById('activity-log-refresh');
  if (!listEl || !errorEl || !refreshBtn) return;

  async function load(): Promise<void> {
    errorEl!.hidden = true;
    try {
      const entries = await fetchActivityLog();
      listEl!.innerHTML = entries.length
        ? entries.map(renderRow).join('')
        : '<p class="portal-empty">هنوز فعالیتی ثبت نشده است.</p>';
    } catch (err) {
      errorEl!.hidden = false;
      errorEl!.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
    }
  }

  refreshBtn.addEventListener('click', () => void load());
  void load();
}

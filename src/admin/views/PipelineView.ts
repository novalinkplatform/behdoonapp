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
import { STATUS_PIPELINE, STATUS_COLORS } from '../data/status.ts';
import { formatToman, toPersianDigits } from '../utils/format.ts';
import { formatMessageTimestamp } from '../utils/jalali.ts';
import { openAdminInvoiceModal } from '../utils/invoice.ts';

const AUTO_REFRESH_MS = 30000;
const DEFAULT_STATUS = 'pending';

let activeIntervalId: number | undefined;

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
  return `<option value="">اختصاص‌نیافته (انتخاب تکنسین)</option>${options}`;
}

function matchesSearch(order: OrderRecord, query: string): boolean {
  if (!query) return true;
  const haystack = `${order.trackingCode} ${order.phone} ${order.originCity} ${order.destinationCity} ${order.customerName}`.toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderReportsList(reports: RequestReport[] | undefined): string {
  if (!reports) return '';
  if (!reports.length) return '<p class="pipeline-report-empty">هنوز گزارشی ثبت نشده است.</p>';
  return reports
    .map(
      (r) => `
      <div class="pipeline-report-item">
        <div class="pipeline-report-item-head">
          <span>${escapeHtml(r.staffName)}</span>
          <span class="pipeline-report-status pipeline-report-status-${r.smsStatus}">${r.smsStatus === 'sent' ? 'پیامک ارسال شد' : 'پیامک ارسال نشد'}</span>
        </div>
        <p>${escapeHtml(r.message)}</p>
      </div>
    `,
    )
    .join('');
}

function renderEventsList(events: RequestEvent[] | undefined): string {
  if (!events) return '';
  if (!events.length) return '<p class="pipeline-report-empty">هنوز رویدادی ثبت نشده است.</p>';
  return `
    <ol class="pipeline-timeline">
      ${events
        .map(
          (e) => `
        <li class="pipeline-timeline-item pipeline-timeline-${e.type}">
          <span class="pipeline-timeline-dot"></span>
          <div class="pipeline-timeline-body">
            <p>${escapeHtml(e.description)}</p>
            <span class="pipeline-timeline-meta">${e.staffName ? `${escapeHtml(e.staffName)} — ` : ''}${formatMessageTimestamp(e.createdAt)}</span>
          </div>
        </li>
      `,
        )
        .join('')}
    </ol>
  `;
}

function renderCard(
  order: OrderRecord,
  assignable: StaffRecord[],
  expanded: boolean,
  reports: RequestReport[] | undefined,
  draft: string,
  historyExpanded: boolean,
  events: RequestEvent[] | undefined,
): string {
  return `
    <div class="pipeline-card" data-card-id="${order.id}" style="--card-accent:${STATUS_COLORS[order.status] ?? 'var(--muted)'}">
      <div class="pipeline-card-top">
        <span class="pipeline-tracking">#${toPersianDigits(order.trackingCode)}</span>
        <span class="pipeline-card-top-end">
          <button type="button" class="pipeline-btn-invoice" data-invoice-request-id="${order.id}" title="مشاهده و چاپ فاکتور تفکیکی رسمی">
            <span class="icon">${icons.fileText}</span>
            <span>فاکتور</span>
          </button>
          <span class="pipeline-estimate">${formatToman(order.estimateAvg)}</span>
          <button type="button" class="pipeline-delete-btn" data-delete-request-id="${order.id}" title="حذف کامل درخواست" aria-label="حذف کامل درخواست">${icons.close}</button>
        </span>
      </div>
      <div class="pipeline-row">
        <span class="pipeline-service">${order.serviceLabel}</span>
        <span class="pipeline-muted">${order.customerName}</span>
      </div>
      <div class="pipeline-row">
        <span class="icon">${icons.pin}</span>
        <span>${order.originCity || 'تهران'}${order.destinationCity && order.destinationCity !== order.originCity ? ` (محدوده ${order.destinationCity})` : ''}</span>
      </div>
      <div class="pipeline-row pipeline-muted">
        <span class="icon">${icons.calendar}</span>
        <span>${order.scheduledDate} — ساعت ${toPersianDigits(order.scheduledTime)}</span>
        <a class="pipeline-phone" href="tel:${order.phone}" dir="ltr">${order.phone}</a>
      </div>
      ${order.originNotes ? `<p class="pipeline-note"><strong>توضیحات درخواست:</strong> ${escapeHtml(order.originNotes)}</p>` : ''}
      ${order.destinationNotes && order.destinationNotes !== order.originNotes ? `<p class="pipeline-note"><strong>یادداشت تکمیلی:</strong> ${escapeHtml(order.destinationNotes)}</p>` : ''}
      <div class="pipeline-selects">
        <select class="pipeline-status-select" data-status-select-id="${order.id}">
          ${renderStatusOptions(order.status)}
        </select>
        <select class="pipeline-status-select" data-assign-select-id="${order.id}">
          ${renderAssignOptions(order.assignedStaffId, assignable)}
        </select>
      </div>
      <div class="pipeline-report">
        <button type="button" class="pipeline-report-toggle" data-report-toggle-id="${order.id}" aria-expanded="${expanded}">
          <span class="icon">${icons.message}</span>
          ثبت گزارش
        </button>
        <div class="pipeline-report-body" data-report-body-id="${order.id}" ${expanded ? '' : 'hidden'}>
          <div class="pipeline-report-list" data-report-list-id="${order.id}">${renderReportsList(reports)}</div>
          <textarea class="pipeline-report-textarea" data-report-textarea-id="${order.id}" rows="2" placeholder="متنی که برای مشتری پیامک می‌شود...">${escapeHtml(draft)}</textarea>
          <div class="pipeline-report-actions">
            <p class="pipeline-report-error" data-report-error-id="${order.id}" hidden></p>
            <button type="button" class="btn btn-secondary btn-sm" data-report-send-id="${order.id}">ارسال پیامک به مشتری</button>
          </div>
        </div>
      </div>
      <div class="pipeline-report">
        <button type="button" class="pipeline-report-toggle" data-history-toggle-id="${order.id}" aria-expanded="${historyExpanded}">
          <span class="icon">${icons.refresh}</span>
          تاریخچه
        </button>
        <div class="pipeline-report-body" data-history-body-id="${order.id}" ${historyExpanded ? '' : 'hidden'}>
          <div data-history-list-id="${order.id}">${renderEventsList(events)}</div>
        </div>
      </div>
    </div>
  `;
}

export function renderPipelineView(): string {
  return `
    <div class="view-header">
      <h1>مراحل درخواست‌ها</h1>
      <div class="pipeline-toolbar">
        <input type="text" class="pipeline-search" id="pipeline-search" placeholder="جست‌وجو: کد رهگیری، شماره، شهر، نام..." />
        <span class="pipeline-live" id="pipeline-live" title="هر ۳۰ ثانیه به‌روزرسانی می‌شود">
          <span class="pipeline-live-dot"></span>
          زنده
        </span>
        <button type="button" class="btn btn-secondary" id="pipeline-refresh">
          <span class="icon">${icons.refresh}</span>
          به‌روزرسانی
        </button>
        <button type="button" class="btn btn-secondary" id="pipeline-export-csv">
          <span class="icon">${icons.download}</span>
          خروجی CSV
        </button>
      </div>
    </div>
    <p class="error-text" id="pipeline-error" hidden></p>
    <div class="pipeline-tabs" id="pipeline-tabs">
      ${STATUS_PIPELINE.map(
        (status) => `
          <button type="button" class="pipeline-tab ${status.id === DEFAULT_STATUS ? 'is-active' : ''}" data-pipeline-tab="${status.id}" style="--tab-accent:${status.color}">
            <span>${status.label}</span>
            <span class="pipeline-count" id="pipeline-count-${status.id}">۰</span>
          </button>
        `,
      ).join('')}
    </div>
    <div class="pipeline-list" id="pipeline-list"></div>
  `;
}

export function initPipelineView(): void {
  const list = document.getElementById('pipeline-list');
  const tabs = document.getElementById('pipeline-tabs');
  const errorEl = document.getElementById('pipeline-error');
  const refreshBtn = document.getElementById('pipeline-refresh');
  const searchInput = document.getElementById('pipeline-search') as HTMLInputElement | null;
  if (!list || !tabs || !errorEl || !refreshBtn || !searchInput) return;

  let latestOrders: OrderRecord[] = [];
  let latestAssignable: StaffRecord[] = [];
  let searchQuery = '';
  let activeStatus = DEFAULT_STATUS;
  const expandedReportIds = new Set<number>();
  const reportsCache = new Map<number, RequestReport[]>();
  const draftMessages = new Map<number, string>();
  const expandedHistoryIds = new Set<number>();
  const eventsCache = new Map<number, RequestEvent[]>();

  function renderList(): void {
    STATUS_PIPELINE.forEach((status) => {
      const count = document.getElementById(`pipeline-count-${status.id}`);
      if (count) count.textContent = toPersianDigits(latestOrders.filter((o) => o.status === status.id).length);
    });

    const ordersForStatus = latestOrders.filter((o) => o.status === activeStatus && matchesSearch(o, searchQuery));
    list!.innerHTML = ordersForStatus.length
      ? ordersForStatus
          .map((o) =>
            renderCard(
              o,
              latestAssignable,
              expandedReportIds.has(o.id),
              reportsCache.get(o.id),
              draftMessages.get(o.id) ?? '',
              expandedHistoryIds.has(o.id),
              eventsCache.get(o.id),
            ),
          )
          .join('')
      : '<p class="pipeline-empty">موردی نیست</p>';

    wireSelects();
    wireReportUI();
    wireHistoryUI();
  }

  async function load(): Promise<void> {
    errorEl!.hidden = true;
    try {
      const [orders, staff] = await Promise.all([fetchRequests(), fetchStaff()]);
      latestOrders = orders;
      latestAssignable = staff.filter((s) => s.assignable && s.isActive);
      renderList();
    } catch (err) {
      errorEl!.hidden = false;
      errorEl!.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
    }
  }

  function wireSelects(): void {
    list!.querySelectorAll<HTMLSelectElement>('[data-status-select-id]').forEach((select) => {
      select.addEventListener('change', async () => {
        const id = Number(select.dataset.statusSelectId);
        const newStatus = select.value;
        select.disabled = true;
        try {
          await updateRequestStatus(id, newStatus);
          await load();
        } catch (err) {
          errorEl!.hidden = false;
          errorEl!.textContent = err instanceof Error ? err.message : 'به‌روزرسانی ناموفق بود.';
          select.disabled = false;
        }
      });
    });

    list!.querySelectorAll<HTMLSelectElement>('[data-assign-select-id]').forEach((select) => {
      select.addEventListener('change', async () => {
        const id = Number(select.dataset.assignSelectId);
        const staffId = select.value ? Number(select.value) : null;
        select.disabled = true;
        try {
          await assignRequest(id, staffId);
          await load();
        } catch (err) {
          errorEl!.hidden = false;
          errorEl!.textContent = err instanceof Error ? err.message : 'اختصاص ناموفق بود.';
          select.disabled = false;
        }
      });
    });

    list!.querySelectorAll<HTMLButtonElement>('[data-invoice-request-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.invoiceRequestId);
        const order = latestOrders.find((o) => o.id === id);
        if (order) openAdminInvoiceModal(order, () => { void load(); });
      });
    });

    list!.querySelectorAll<HTMLButtonElement>('[data-delete-request-id]').forEach((btn) => {
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
  }

  function wireReportUI(): void {
    list!.querySelectorAll<HTMLTextAreaElement>('[data-report-textarea-id]').forEach((textarea) => {
      textarea.addEventListener('input', () => {
        const id = Number(textarea.dataset.reportTextareaId);
        if (textarea.value) draftMessages.set(id, textarea.value);
        else draftMessages.delete(id);
      });
    });

    list!.querySelectorAll<HTMLButtonElement>('[data-report-toggle-id]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = Number(btn.dataset.reportToggleId);
        const body = list!.querySelector<HTMLElement>(`[data-report-body-id="${id}"]`);
        if (!body) return;

        if (expandedReportIds.has(id)) {
          expandedReportIds.delete(id);
          body.hidden = true;
          btn.setAttribute('aria-expanded', 'false');
          return;
        }

        expandedReportIds.add(id);
        body.hidden = false;
        btn.setAttribute('aria-expanded', 'true');

        if (!reportsCache.has(id)) {
          try {
            const reports = await fetchRequestReports(id);
            reportsCache.set(id, reports);
            const listEl = list!.querySelector<HTMLElement>(`[data-report-list-id="${id}"]`);
            if (listEl) listEl.innerHTML = renderReportsList(reports);
          } catch {
            /* leave empty; user can retry by collapsing/expanding */
          }
        }
      });
    });

    list!.querySelectorAll<HTMLButtonElement>('[data-report-send-id]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = Number(btn.dataset.reportSendId);
        const textarea = list!.querySelector<HTMLTextAreaElement>(`[data-report-textarea-id="${id}"]`);
        const reportErrorEl = list!.querySelector<HTMLElement>(`[data-report-error-id="${id}"]`);
        if (!textarea || !reportErrorEl) return;

        const message = textarea.value.trim();
        reportErrorEl.hidden = true;
        if (!message) {
          reportErrorEl.hidden = false;
          reportErrorEl.textContent = 'متن گزارش را بنویسید.';
          return;
        }

        btn.disabled = true;
        try {
          const result = await sendRequestReport(id, message);
          const updated = [result.report, ...(reportsCache.get(id) ?? [])];
          reportsCache.set(id, updated);
          const listEl = list!.querySelector<HTMLElement>(`[data-report-list-id="${id}"]`);
          if (listEl) listEl.innerHTML = renderReportsList(updated);
          textarea.value = '';
          draftMessages.delete(id);
          if (!result.ok && result.error) {
            reportErrorEl.hidden = false;
            reportErrorEl.textContent = `گزارش ثبت شد اما ${result.error}`;
          }
        } catch (err) {
          reportErrorEl.hidden = false;
          reportErrorEl.textContent = err instanceof Error ? err.message : 'ثبت گزارش ناموفق بود.';
        } finally {
          btn.disabled = false;
        }
      });
    });
  }

  function wireHistoryUI(): void {
    list!.querySelectorAll<HTMLButtonElement>('[data-history-toggle-id]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = Number(btn.dataset.historyToggleId);
        const body = list!.querySelector<HTMLElement>(`[data-history-body-id="${id}"]`);
        if (!body) return;

        if (expandedHistoryIds.has(id)) {
          expandedHistoryIds.delete(id);
          body.hidden = true;
          btn.setAttribute('aria-expanded', 'false');
          return;
        }

        expandedHistoryIds.add(id);
        body.hidden = false;
        btn.setAttribute('aria-expanded', 'true');

        if (!eventsCache.has(id)) {
          try {
            const events = await fetchRequestEvents(id);
            eventsCache.set(id, events);
            const listEl = list!.querySelector<HTMLElement>(`[data-history-list-id="${id}"]`);
            if (listEl) listEl.innerHTML = renderEventsList(events);
          } catch {
            /* leave empty; user can retry by collapsing/expanding */
          }
        }
      });
    });
  }

  tabs!.addEventListener('click', (event) => {
    const btn = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-pipeline-tab]');
    if (!btn) return;
    tabs!.querySelectorAll('[data-pipeline-tab]').forEach((t) => t.classList.remove('is-active'));
    btn.classList.add('is-active');
    activeStatus = btn.dataset.pipelineTab!;
    renderList();
  });

  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.trim();
    renderList();
  });

  refreshBtn.addEventListener('click', () => void load());

  const exportBtn = document.getElementById('pipeline-export-csv') as HTMLButtonElement | null;
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

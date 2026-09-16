import { renderQuickActions, initQuickActions } from './components/QuickActions.ts';
import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/600.css';
import '@fontsource/vazirmatn/700.css';
import './styles/main.css';

import { renderHeader, initHeader } from './components/Header.ts';
import { renderFooter, initFooter } from './components/Footer.ts';
import { renderBottomNav, initBottomNav } from './components/BottomNav.ts';
import { renderOrdersView, renderOrderEditForm } from './sections/OrdersView.ts';
import { fetchOrdersByPhone, rescheduleOrder, cancelOrder, EDITABLE_ORDER_STATUSES } from './utils/api.ts';
import type { OrderRecord } from './utils/api.ts';
import { statusLabel } from './data/status.ts';
import { formatToman } from './utils/format.ts';
import { toPersianDigits, formatIranianDate } from './utils/jalali.ts';
import { resolveOrderInvoice } from './data/pricing.ts';
import { openCustomerInvoiceModal } from './components/InvoiceModal.ts';
import { initCalendarPicker } from './components/PersianCalendar.ts';
import { initTimePicker, formatTime } from './components/TimePicker.ts';
import { icons } from './components/icons.ts';
import { initLangToggle } from './components/LangToggle.ts';
import { bootstrapI18n } from './i18n/bootstrap.ts';
import { initBehaviorTracking } from './utils/analytics.ts';
import { pick } from './i18n/lang.ts';
import { displayCityName } from './data/provinces.ts';
import { loadSettings } from './utils/dynamicContent.ts';
import { applyTheme } from './utils/theme.ts';
import { applySiteSeoSettings } from './utils/seo.ts';
import { applyBranding, applySiteNameEverywhere } from './utils/branding.ts';
import { forceSiteLanguageIfSingleMode, hideLanguageToggleIfSingleMode } from './i18n/languageMode.ts';
import { markAppReady } from './utils/appReady.ts';
import { fetchCurrentCustomer } from './utils/customerAuth.ts';

const ACTIVE_STATUSES = ['pending', 'contacted', 'scheduled', 'in_progress'];
const HISTORY_STATUSES = ['completed', 'cancelled'];

const STATUS_ACCENT: Record<string, string> = {
  pending: 'var(--primary)',
  contacted: 'var(--warning)',
  scheduled: 'var(--warning)',
  in_progress: 'var(--primary-dark)',
  completed: 'var(--success)',
  cancelled: 'var(--muted)',
};

let cachedSettings: Awaited<ReturnType<typeof loadSettings>> = {};

function renderApp(): void {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) return;

  app.innerHTML = `
    <a class="skip-link" href="#main-content">${pick('رفتن به محتوای اصلی', 'Skip to main content')}</a>
    ${renderHeader(cachedSettings)}
    <main id="main-content">
      ${renderOrdersView()}
    </main>
    ${renderFooter(cachedSettings)}
    ${renderBottomNav()}
    ${renderQuickActions(cachedSettings)}
  `;
}

function renderOrderCard(order: OrderRecord): string {
  const canEdit = EDITABLE_ORDER_STATUSES.includes(order.status);
  return `
    <div class="order-card" data-order-id="${order.id}" style="--card-accent:${STATUS_ACCENT[order.status] ?? 'var(--muted)'}">
      <div class="order-card-header">
        <span class="order-tracking">#${toPersianDigits(order.trackingCode)}</span>
        <span class="order-status order-status-${order.status}">${statusLabel(order.status)}</span>
      </div>
      <div class="order-route">
        <span class="icon">${icons.pin}</span>
        <span>${displayCityName(order.originProvince, order.originCity)}</span>
        <span aria-hidden="true">←</span>
        <span class="icon">${icons.flag}</span>
        <span>${displayCityName(order.destinationProvince, order.destinationCity)}</span>
      </div>
      <div class="order-meta">${order.serviceLabel} · <span id="order-schedule-${order.id}">${formatIranianDate(order.scheduledDate)} — ${pick('ساعت', 'at')} ${toPersianDigits(order.scheduledTime)}</span></div>
      <div class="order-estimate">${formatToman(order.estimateAvg)}</div>
      <div class="order-actions" style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;">
        <button type="button" class="btn btn-secondary btn-sm" data-order-invoice="${order.id}">
          <span class="icon" style="width: 14px; height: 14px;">${icons.fileText}</span>
          <span>${pick('مشاهده و دریافت فاکتور', 'View & download invoice')}</span>
        </button>
        ${
          canEdit
            ? `
          <button type="button" class="btn btn-secondary btn-sm" data-edit-toggle="${order.id}">${pick('ویرایش زمان', 'Edit time')}</button>
          <button type="button" class="btn btn-ghost btn-sm" data-cancel-order="${order.id}">${pick('لغو درخواست', 'Cancel request')}</button>
        `
            : ''
        }
      </div>
      ${canEdit ? renderOrderEditForm(order.id) : ''}
    </div>
  `;
}

async function init(): Promise<void> {
  initBehaviorTracking();
  cachedSettings = await loadSettings();
  forceSiteLanguageIfSingleMode(cachedSettings.language_mode);
  applyTheme(cachedSettings.theme);
  applySiteSeoSettings(cachedSettings.seo);
  renderApp();
  markAppReady();
  applyBranding(cachedSettings.branding);
  applySiteNameEverywhere(cachedSettings.site_name);
  hideLanguageToggleIfSingleMode(cachedSettings.language_mode);
  initHeader(cachedSettings);
  initFooter(cachedSettings);
  initBottomNav();
  initLangToggle();
  initQuickActions(cachedSettings);

  const loadingEl = document.getElementById('orders-loading');
  const loginPrompt = document.getElementById('orders-login-prompt');
  const contentEl = document.getElementById('orders-page-content');
  const activeResults = document.getElementById('orders-active-results');
  const historyResults = document.getElementById('orders-history-results');
  const activePanel = document.getElementById('orders-active-panel');
  const historyPanel = document.getElementById('orders-history-panel');
  const activeCount = document.getElementById('orders-active-count');
  const historyCount = document.getElementById('orders-history-count');
  const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-orders-tab]'));

  if (
    !loadingEl ||
    !loginPrompt ||
    !contentEl ||
    !activeResults ||
    !historyResults ||
    !activePanel ||
    !historyPanel ||
    !activeCount ||
    !historyCount
  ) {
    return;
  }

  let currentPhone = '';

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.ordersTab === 'history' ? 'history' : 'active';
      activePanel!.hidden = target !== 'active';
      historyPanel!.hidden = target !== 'history';
      tabs.forEach((t) => {
        const isActive = t === tab;
        t.classList.toggle('is-active', isActive);
        t.setAttribute('aria-selected', String(isActive));
      });
    });
  });

  function wireOrderActions(): void {
    document.querySelectorAll<HTMLButtonElement>('[data-edit-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.editToggle;
        const form = document.getElementById(`edit-form-${id}`);
        if (!form || !id) return;
        const wasHidden = form.hidden;
        form.hidden = !wasHidden;
        if (wasHidden && !form.dataset.wired) {
          form.dataset.wired = 'true';
          const calendar = initCalendarPicker(`edit-calendar-${id}`, { maxDaysAhead: 7 });
          const timePicker = initTimePicker(`edit-time-${id}`);
          const saveBtn = form.querySelector<HTMLButtonElement>(`[data-save-schedule="${id}"]`);
          const editErrorEl = document.getElementById(`edit-error-${id}`);

          saveBtn?.addEventListener('click', () => {
            const date = calendar.getSelected();
            const time = timePicker.getSelected();
            if (!date || !time) {
              if (editErrorEl) {
                editErrorEl.hidden = false;
                editErrorEl.textContent = pick('تاریخ و ساعت جدید را انتخاب کنید.', 'Select a new date and time.');
              }
              return;
            }
            saveBtn.disabled = true;
            saveBtn.textContent = pick('در حال ذخیره...', 'Saving...');
            rescheduleOrder(Number(id), currentPhone, date, formatTime(time))
              .then((updated) => {
                const scheduleEl = document.getElementById(`order-schedule-${id}`);
                if (scheduleEl) {
                  scheduleEl.textContent = `${updated.scheduledDate} — ${pick('ساعت', 'at')} ${toPersianDigits(updated.scheduledTime)}`;
                }
                form.hidden = true;
                if (editErrorEl) editErrorEl.hidden = true;
              })
              .catch((err) => {
                if (editErrorEl) {
                  editErrorEl.hidden = false;
                  editErrorEl.textContent = err instanceof Error ? err.message : pick('ویرایش ناموفق بود.', 'Update failed.');
                }
              })
              .finally(() => {
                saveBtn.disabled = false;
                saveBtn.textContent = pick('ذخیره تغییرات', 'Save changes');
              });
          });
        }
      });
    });

    document.querySelectorAll<HTMLButtonElement>('[data-cancel-edit]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.cancelEdit;
        const form = document.getElementById(`edit-form-${id}`);
        if (form) form.hidden = true;
      });
    });

    document.querySelectorAll<HTMLButtonElement>('[data-order-invoice]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.orderInvoice);
        const order = currentOrdersList.find((o) => o.id === id);
        if (!order) return;
        const invoice = resolveOrderInvoice(order);
        openCustomerInvoiceModal({
          trackingCode: order.trackingCode,
          customerName: order.customerName,
          phone: order.phone,
          serviceLabel: order.serviceLabel,
          originProvince: order.originProvince,
          originCity: order.originCity,
          destinationProvince: order.destinationProvince,
          destinationCity: order.destinationCity,
          scheduledDate: order.scheduledDate,
          scheduledTime: order.scheduledTime,
          createdAt: order.createdAt,
          statusLabel: statusLabel(order.status),
          invoice,
        });
      });
    });

    document.querySelectorAll<HTMLButtonElement>('[data-cancel-order]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.cancelOrder;
        if (!id) return;
        if (!window.confirm(pick('از لغو این درخواست مطمئن هستید؟', 'Are you sure you want to cancel this request?'))) return;
        btn.disabled = true;
        cancelOrder(Number(id), currentPhone)
          .then(() => search(currentPhone))
          .catch((err) => {
            window.alert(err instanceof Error ? err.message : pick('لغو درخواست ناموفق بود.', 'Cancellation failed.'));
            btn.disabled = false;
          });
      });
    });
  }

  let currentOrdersList: OrderRecord[] = [];

  function renderResults(orders: OrderRecord[]): void {
    currentOrdersList = orders;
    const active = orders.filter((o) => ACTIVE_STATUSES.includes(o.status));
    const history = orders.filter((o) => HISTORY_STATUSES.includes(o.status));

    activeResults!.innerHTML = active.length
      ? active.map(renderOrderCard).join('')
      : `<p class="orders-empty">${pick('درخواست جاری وجود ندارد.', 'No active requests.')}</p>`;

    historyResults!.innerHTML = history.length
      ? history.map(renderOrderCard).join('')
      : `<p class="orders-empty">${pick('تاریخچه‌ای وجود ندارد.', 'No history yet.')}</p>`;

    activeCount!.textContent = active.length ? toPersianDigits(active.length) : '';
    historyCount!.textContent = history.length ? toPersianDigits(history.length) : '';

    wireOrderActions();
  }

  function search(phone: string): void {
    currentPhone = phone;
    fetchOrdersByPhone(phone)
      .then((orders) => renderResults(orders))
      .catch(() => renderResults([]));
  }

  fetchCurrentCustomer()
    .then((customer) => {
      loadingEl!.hidden = true;
      if (customer) {
        loginPrompt!.hidden = true;
        contentEl!.hidden = false;
        search(customer.phone);
        return;
      }
      loginPrompt!.hidden = false;
    })
    .catch(() => {
      loadingEl!.hidden = true;
      loginPrompt!.hidden = false;
    });
}

bootstrapI18n(() => void init());

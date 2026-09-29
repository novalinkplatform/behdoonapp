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
import { fetchOrdersByPhone, fetchCustomerOrders, fetchCustomerOrderDetail, rescheduleOrder, cancelOrder, EDITABLE_ORDER_STATUSES } from './utils/api.ts';
import type { OrderRecord } from './utils/api.ts';
import { statusLabel } from './data/status.ts';
import { formatToman } from './utils/format.ts';
import { toPersianDigits, formatIranianDate } from './utils/jalali.ts';
import { resolveOrderInvoice } from './data/pricing.ts';
import { openCustomerInvoiceModal } from './components/InvoiceModal.ts';
import { printCustomerOrderSheet } from './utils/orderPrint.ts';
import { initCalendarPicker } from './components/PersianCalendar.ts';
import { initTimePicker, formatTime } from './components/TimePicker.ts';
import { icons } from './components/icons.ts';
import { initLangToggle } from './components/LangToggle.ts';
import { bootstrapI18n } from './i18n/bootstrap.ts';
import { initBehaviorTracking } from './utils/analytics.ts';
import { pick } from './i18n/lang.ts';
import { openCustomerTrackingModal } from './components/OrderTrackingModal.ts';
import { loadSettings } from './utils/dynamicContent.ts';
import { applyTheme } from './utils/theme.ts';
import { applySiteSeoSettings } from './utils/seo.ts';
import { applyBranding, applySiteNameEverywhere } from './utils/branding.ts';
import { forceSiteLanguageIfSingleMode, hideLanguageToggleIfSingleMode } from './i18n/languageMode.ts';
import { markAppReady } from './utils/appReady.ts';
import { fetchCurrentCustomer, getCustomerToken, getLocalCustomerInfo, logoutCustomer } from './utils/customerAuth.ts';
import { getLastPhone, saveLastPhone } from './utils/localOrders.ts';

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

function getStepperStep(status: string): number {
  if (['contacted', 'scheduled', 'provider_assigned'].includes(status)) return 2;
  if (status === 'in_progress') return 3;
  if (status === 'completed') return 4;
  if (status === 'cancelled') return 0;
  return 1; // submitted, pending
}

function renderOrderCard(order: OrderRecord): string {
  const canEdit = EDITABLE_ORDER_STATUSES.includes(order.status);
  const step = getStepperStep(order.status);
  const isCancelled = order.status === 'cancelled';

  // Determine service category icon
  const icon = icons.tool || icons.box;

  return `
    <div class="order-card-pro" data-order-id="${order.id}" data-status="${order.status}">
      
      <!-- Top Bar: Service Info, Tracking Code & Status -->
      <div class="order-card-pro-top">
        <div class="order-card-pro-title-wrap">
          <div class="order-card-pro-service-icon">
            <span class="icon">${icon}</span>
          </div>
          <div>
            <h3 class="order-card-pro-service-title">${order.serviceLabel}</h3>
            <span class="order-card-pro-date-meta">
              <span class="icon" style="width: 13px; height: 13px; display: inline-block; vertical-align: middle;">${icons.calendar}</span>
              <span id="order-schedule-${order.id}">${formatIranianDate(order.scheduledDate)} — ${pick('ساعت', 'at')} ${toPersianDigits(order.scheduledTime)}</span>
            </span>
          </div>
        </div>

        <div class="order-card-pro-badges">
          <span class="order-card-pro-status status-${order.status}">
            <span class="status-dot"></span>
            ${statusLabel(order.status)}
          </span>
          <div class="order-tracking-badge" title="${pick('کلیک برای کپی کد پیگیری', 'Click to copy tracking code')}">
            <span class="order-tracking-num" dir="ltr">#${toPersianDigits(order.trackingCode)}</span>
            <button type="button" class="btn-copy-tracking" data-copy-code="${order.trackingCode}" aria-label="${pick('کپی کد', 'Copy code')}">
              <span class="icon">${icons.copy || icons.fileText}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Stepper / Progress Timeline -->
      <div class="order-pro-stepper ${isCancelled ? 'is-cancelled' : ''}">
        <div class="stepper-step ${step >= 1 ? 'is-completed' : ''} ${step === 1 ? 'is-current' : ''}">
          <span class="stepper-circle">${step > 1 ? icons.check : '۱'}</span>
          <span class="stepper-label">${pick('ثبت درخواست', 'Submitted')}</span>
        </div>
        <div class="stepper-line ${step >= 2 ? 'is-active' : ''}"></div>
        <div class="stepper-step ${step >= 2 ? 'is-completed' : ''} ${step === 2 ? 'is-current' : ''}">
          <span class="stepper-circle">${step > 2 ? icons.check : '۲'}</span>
          <span class="stepper-label">${pick('تأیید و تخصیص', 'Dispatched')}</span>
        </div>
        <div class="stepper-line ${step >= 3 ? 'is-active' : ''}"></div>
        <div class="stepper-step ${step >= 3 ? 'is-completed' : ''} ${step === 3 ? 'is-current' : ''}">
          <span class="stepper-circle">${step > 3 ? icons.check : '۳'}</span>
          <span class="stepper-label">${pick('اعزام و انجام', 'In progress')}</span>
        </div>
        <div class="stepper-line ${step >= 4 ? 'is-active' : ''}"></div>
        <div class="stepper-step ${step >= 4 ? 'is-completed' : ''} ${step === 4 ? 'is-current' : ''}">
          <span class="stepper-circle">${step >= 4 ? icons.check : '۴'}</span>
          <span class="stepper-label">${pick('اتمام و ضمانت', 'Completed')}</span>
        </div>
      </div>

      <!-- Details Highlights Grid -->
      <div class="order-pro-grid">
        <div class="order-pro-info-item">
          <span class="info-label"><span class="icon">${icons.pin}</span> ${pick('نشانی محل خدمت', 'Service address')}</span>
          <span class="info-value">${order.originNotes ? order.originNotes : pick('تهران (آدرس ثبت‌شده روی نقشه)', 'Tehran (Map location)')}</span>
        </div>
        <div class="order-pro-info-item">
          <span class="info-label"><span class="icon">${icons.box}</span> ${pick('تأمین قطعات و لوازم', 'Parts / Materials')}</span>
          <span class="info-value">${order.laborChoice === 'with_parts' ? pick('همراه با قطعات و لوازم (فاکتور خرید)', 'With parts & materials') : pick('فقط اجرت کار تکنسین (بدون لوازم)', 'Labor only (no parts)')}</span>
        </div>
        <div class="order-pro-info-item">
          <span class="info-label"><span class="icon">${icons.shield}</span> ${pick('برآورد هزینه و اجرت', 'Estimated cost')}</span>
          <span class="info-value price-tag">${formatToman(order.finalPrice || order.estimateAvg)} <small style="font-weight: 500; font-size: 0.8rem; color: var(--muted);">${pick('(حدودی)', '(approx)')}</small></span>
        </div>
        <div class="order-pro-info-item">
          <span class="info-label"><span class="icon">${icons.user}</span> ${pick('متخصص اعزامی بهدون', 'Assigned Specialist')}</span>
          <span class="info-value">${order.providerName || pick('در نوبت تخصیص تکنسین مجرب', 'Matching top technician')}</span>
        </div>
      </div>

      <!-- Action Buttons Row -->
      <div class="order-pro-actions">
        <button type="button" class="btn btn-primary btn-sm" data-track-order="${order.id}">
          <span class="icon">${icons.clock}</span>
          <span>${pick('رهگیری زنده و جزئیات', 'Live Tracking')}</span>
        </button>
        <button type="button" class="btn btn-secondary btn-sm" data-order-invoice="${order.id}">
          <span class="icon">${icons.fileText}</span>
          <span>${pick('مشاهده و چاپ فاکتور', 'Invoice')}</span>
        </button>
        <button type="button" class="btn btn-secondary btn-sm" data-order-print="${order.id}" title="${pick('چاپ و ذخیره برگه رسمی درخواست به صورت PDF', 'Print / Save PDF Request')}">
          <span class="icon">${icons.printer}</span>
          <span>${pick('چاپ برگه درخواست', 'Print Request')}</span>
        </button>
        ${
          canEdit
            ? `
          <button type="button" class="btn btn-secondary btn-sm" data-edit-toggle="${order.id}">${pick('تغییر زمان مراجعه', 'Reschedule')}</button>
          <button type="button" class="btn btn-ghost btn-sm text-danger" data-cancel-order="${order.id}">${pick('لغو درخواست', 'Cancel')}</button>
        `
            : ''
        }
        <a href="tel:09333256885" class="btn btn-ghost btn-sm">
          <span class="icon">${icons.phone}</span>
          <span>${pick('پشتیبانی', 'Support')}</span>
        </a>
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
  const resultsContainer = document.getElementById('orders-results-list');
  const userBar = document.getElementById('orders-user-badge-bar');
  const userNameEl = document.getElementById('orders-user-name');
  const userPhoneEl = document.getElementById('orders-user-phone');
  const logoutBtn = document.getElementById('orders-logout-shortcut-btn');
  const filterInput = document.getElementById('orders-filter-input') as HTMLInputElement | null;

  const countAll = document.getElementById('orders-count-all');
  const countPending = document.getElementById('orders-count-pending');
  const countInProgress = document.getElementById('orders-count-in-progress');
  const countCompleted = document.getElementById('orders-count-completed');
  const countCancelled = document.getElementById('orders-count-cancelled');

  const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-orders-tab]'));

  if (!loadingEl || !loginPrompt || !contentEl || !resultsContainer) {
    return;
  }

  let allOrders: OrderRecord[] = [];
  let currentActiveTab = 'all';
  let currentPhone = '';

  // Tab switching
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      currentActiveTab = tab.dataset.ordersTab || 'all';
      tabs.forEach((t) => {
        const isActive = t === tab;
        t.classList.toggle('is-active', isActive);
        t.setAttribute('aria-selected', String(isActive));
      });
      applyFilters();
    });
  });

  // Live text filter
  filterInput?.addEventListener('input', () => {
    applyFilters();
  });

  function applyFilters(): void {
    const query = (filterInput?.value || '').trim().toLowerCase();
    
    let filtered = allOrders.filter((order) => {
      // Status filtering
      if (currentActiveTab === 'pending') {
        return ['submitted', 'pending', 'contacted', 'scheduled', 'provider_assigned'].includes(order.status);
      }
      if (currentActiveTab === 'in_progress') {
        return order.status === 'in_progress';
      }
      if (currentActiveTab === 'completed') {
        return order.status === 'completed';
      }
      if (currentActiveTab === 'cancelled') {
        return order.status === 'cancelled';
      }
      return true; // 'all'
    });

    if (query) {
      filtered = filtered.filter((order) => {
        const track = String(order.trackingCode || '').toLowerCase();
        const sLabel = String(order.serviceLabel || '').toLowerCase();
        const notes = String(order.originNotes || '').toLowerCase();
        return track.includes(query) || sLabel.includes(query) || notes.includes(query);
      });
    }

    renderCards(filtered);
  }

  function updateCounts(orders: OrderRecord[]): void {
    const pendingCount = orders.filter((o) => ['submitted', 'pending', 'contacted', 'scheduled', 'provider_assigned'].includes(o.status)).length;
    const inProgressCount = orders.filter((o) => o.status === 'in_progress').length;
    const completedCount = orders.filter((o) => o.status === 'completed').length;
    const cancelledCount = orders.filter((o) => o.status === 'cancelled').length;

    if (countAll) countAll.textContent = toPersianDigits(orders.length);
    if (countPending) countPending.textContent = toPersianDigits(pendingCount);
    if (countInProgress) countInProgress.textContent = toPersianDigits(inProgressCount);
    if (countCompleted) countCompleted.textContent = toPersianDigits(completedCount);
    if (countCancelled) countCancelled.textContent = toPersianDigits(cancelledCount);
  }

  function renderCards(orders: OrderRecord[]): void {
    if (!orders.length) {
      let emptyMsg = pick('هیچ درخواستی در این بخش ثبت نشده است.', 'No requests found in this section.');
      if (currentActiveTab === 'pending') emptyMsg = pick('در حال حاضر هیچ درخواست جاری یا در نوبت اعزامی ندارید.', 'No pending or scheduled requests.');
      else if (currentActiveTab === 'in_progress') emptyMsg = pick('در حال حاضر هیچ خدمتی در حال اجرا نیست.', 'No service is currently in progress.');
      else if (currentActiveTab === 'completed') emptyMsg = pick('هنوز هیچ خدمت تکمیل‌شده‌ای در سوابق شما ثبت نشده است.', 'No completed services found.');
      else if (currentActiveTab === 'cancelled') emptyMsg = pick('هیچ درخواست لغو‌شده‌ای وجود ندارد.', 'No cancelled requests.');

      resultsContainer!.innerHTML = `
        <div class="orders-empty-state">
          <div class="orders-empty-icon">${icons.box}</div>
          <h3>${pick('موردی یافت نشد', 'No orders found')}</h3>
          <p>${emptyMsg}</p>
          <a href="/#request" class="btn btn-primary btn-sm">
            <span class="icon">${icons.plusCircle}</span>
            <span>${pick('ثبت اولین درخواست خدمت', 'Submit a new request')}</span>
          </a>
        </div>
      `;
      return;
    }

    resultsContainer!.innerHTML = orders.map(renderOrderCard).join('');
    wireOrderActions();
  }

  function wireOrderActions(): void {
    // 1-Click Copy tracking code
    document.querySelectorAll<HTMLButtonElement>('[data-copy-code]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const code = btn.dataset.copyCode;
        if (!code) return;
        navigator.clipboard.writeText(code).then(() => {
          const original = btn.innerHTML;
          btn.innerHTML = `<span style="font-size: 0.75rem; color: #16a34a; font-weight: 700;">${pick('کپی شد!', 'Copied!')}</span>`;
          setTimeout(() => {
            btn.innerHTML = original;
          }, 1800);
        }).catch(() => {});
      });
    });

    // Edit schedule
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
                  scheduleEl.textContent = `${formatIranianDate(updated.scheduledDate)} — ${pick('ساعت', 'at')} ${toPersianDigits(updated.scheduledTime)}`;
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

    // Invoice modal
    document.querySelectorAll<HTMLButtonElement>('[data-order-invoice]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.orderInvoice);
        const order = allOrders.find((o) => o.id === id);
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

    // Print / PDF order sheet
    document.querySelectorAll<HTMLButtonElement>('[data-order-print]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = Number(btn.dataset.orderPrint);
        const order = allOrders.find((o) => o.id === id);
        if (!order) return;

        btn.disabled = true;
        const originalText = btn.innerHTML;
        btn.innerHTML = `<span class="orders-spinner" style="width: 14px; height: 14px;" aria-hidden="true"></span><span>${pick('آماده‌سازی سند...', 'Preparing...')}</span>`;

        try {
          const detail = await fetchCustomerOrderDetail(id);
          printCustomerOrderSheet(detail);
        } catch {
          printCustomerOrderSheet(order);
        } finally {
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
      });
    });

    // Cancel order
    document.querySelectorAll<HTMLButtonElement>('[data-cancel-order]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.cancelOrder;
        if (!id) return;
        if (!window.confirm(pick('آیا از لغو این درخواست خدمت اطمینان دارید؟', 'Are you sure you want to cancel this request?'))) return;
        btn.disabled = true;
        cancelOrder(Number(id), currentPhone)
          .then(() => search(currentPhone))
          .catch((err) => {
            window.alert(err instanceof Error ? err.message : pick('لغو درخواست ناموفق بود.', 'Cancellation failed.'));
            btn.disabled = false;
          });
      });
    });

    // Live tracking modal
    document.querySelectorAll<HTMLButtonElement>('[data-track-order]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.trackOrder);
        if (id) {
          openCustomerTrackingModal(id, {
            onUpdate: () => {
              if (currentPhone) search(currentPhone);
            },
          });
        }
      });
    });
  }

  async function search(phoneOrCode: string): Promise<void> {
    let cleanQuery = phoneOrCode
      .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
      .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
      .replace(/[\s\-_\(\)\+]/g, '')
      .trim();

    if (cleanQuery.startsWith('0098')) cleanQuery = '0' + cleanQuery.slice(4);
    else if (cleanQuery.startsWith('98')) cleanQuery = '0' + cleanQuery.slice(2);
    else if (cleanQuery.startsWith('9') && cleanQuery.length === 10) cleanQuery = '0' + cleanQuery;

    currentPhone = cleanQuery;
    const token = getCustomerToken();

    try {
      let orders: OrderRecord[] = [];
      if (/^09\d{9}$/.test(cleanQuery)) {
        if (token) {
          try {
            orders = await fetchCustomerOrders();
          } catch {}
        }
        if (!orders || orders.length === 0) {
          orders = await fetchOrdersByPhone(cleanQuery);
        }
      } else {
        // Look up by numeric tracking code (e.g. 85070208)
        const res = await fetch(`/api/requests?code=${encodeURIComponent(cleanQuery)}`);
        const body = await res.json().catch(() => ({}));
        orders = (body.requests ?? []) as OrderRecord[];
      }
      allOrders = orders;
      updateCounts(orders);
      applyFilters();
    } catch {
      allOrders = [];
      updateCounts([]);
      applyFilters();
    }
  }

  // Quick search form for guests
  const trackForm = document.getElementById('orders-quick-track-form') as HTMLFormElement | null;
  const trackInput = document.getElementById('orders-quick-track-input') as HTMLInputElement | null;
  const trackError = document.getElementById('orders-quick-track-error');

  if (trackForm && trackInput) {
    trackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = trackInput.value.trim();
      if (!val) {
        if (trackError) {
          trackError.hidden = false;
          trackError.textContent = pick('لطفاً شماره همراه یا کد رهگیری را وارد کنید.', 'Enter mobile or tracking code.');
        }
        return;
      }
      if (trackError) trackError.hidden = true;
      loginPrompt!.hidden = true;
      contentEl!.hidden = false;
      saveLastPhone(val);
      void search(val);
    });
  }

  // Logout shortcut
  logoutBtn?.addEventListener('click', async () => {
    if (window.confirm(pick('آیا مایل به خروج از حساب کاربری هستید؟', 'Are you sure you want to log out?'))) {
      await logoutCustomer();
      window.location.reload();
    }
  });

  const localCust = getLocalCustomerInfo();
  const lastPhone = getLastPhone();

  fetchCurrentCustomer()
    .then((customer) => {
      loadingEl!.hidden = true;
      const target = customer?.phone || localCust?.phone || lastPhone;
      
      if (customer || localCust) {
        const c = customer || localCust;
        if (userBar) userBar.hidden = false;
        if (userNameEl) userNameEl.textContent = c?.fullName || pick('مشتری گرامی بهدون', 'Valued Customer');
        if (userPhoneEl && c?.phone) userPhoneEl.textContent = toPersianDigits(c.phone);
      }

      if (target) {
        loginPrompt!.hidden = true;
        contentEl!.hidden = false;
        void search(target);
        return;
      }
      loginPrompt!.hidden = false;
    })
    .catch(() => {
      loadingEl!.hidden = true;
      const target = localCust?.phone || lastPhone;
      if (localCust) {
        if (userBar) userBar.hidden = false;
        if (userNameEl) userNameEl.textContent = localCust.fullName || pick('مشتری گرامی بهدون', 'Valued Customer');
        if (userPhoneEl && localCust.phone) userPhoneEl.textContent = toPersianDigits(localCust.phone);
      }
      if (target) {
        loginPrompt!.hidden = true;
        contentEl!.hidden = false;
        void search(target);
        return;
      }
      loginPrompt!.hidden = false;
    });
}

bootstrapI18n(() => void init());

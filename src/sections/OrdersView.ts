import { icons } from '../components/icons.ts';
import { renderCalendarPicker } from '../components/PersianCalendar.ts';
import { renderTimePicker } from '../components/TimePicker.ts';
import { pick } from '../i18n/lang.ts';

export function renderOrdersView(): string {
  return `
    <article class="orders-page">
      <div class="container orders-container">
        <!-- Breadcrumbs -->
        <nav class="article-breadcrumb" aria-label="${pick('مسیر صفحه', 'Breadcrumb')}">
          <a href="/">${pick('خانه', 'Home')}</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">${pick('درخواست‌های من', 'My requests')}</span>
        </nav>

        <div class="orders-island">
          <!-- Loading Spinner -->
          <div id="orders-loading" class="orders-loading">
            <span class="orders-spinner" aria-hidden="true"></span>
            <p style="margin-top: 12px; font-weight: 600; color: var(--muted);">${pick('در حال دریافت اطلاعات درخواست‌ها...', 'Loading requests...')}</p>
          </div>

          <!-- Guest Prompt / Quick Track -->
          <div id="orders-login-prompt" class="orders-login-prompt" hidden>
            <div class="orders-login-prompt-icon-wrap">
              <span class="icon">${icons.box}</span>
            </div>
            <h1>${pick('پیگیری درخواست‌های خدمات', 'Track Service Requests')}</h1>
            <p>${pick(
              'جهت استعلام آنی سفارش، شماره موبایل یا کد رهگیری ۸ رقمی خود را وارد فرمایید:',
              'Enter your mobile number or 8-digit tracking code to view your orders:'
            )}</p>
            
            <form id="orders-quick-track-form" class="orders-search-form">
              <div class="orders-input-group">
                <span class="icon input-icon">${icons.search}</span>
                <input
                  type="text"
                  id="orders-quick-track-input"
                  placeholder="${pick('مثال: ۰۹xxxxxxxxx یا ۸۵۰۷۰۲۰۸', 'e.g. 09xxxxxxxxx or 85070208')}"
                  dir="ltr"
                  autocomplete="tel"
                />
              </div>
              <button type="submit" class="btn btn-primary" id="orders-track-submit-btn">
                <span>${pick('استعلام سفارش', 'Track Order')}</span>
              </button>
            </form>
            <p id="orders-quick-track-error" class="orders-form-error" hidden></p>

            <div class="orders-auth-alt-box">
              <span class="icon">${icons.user}</span>
              <div>
                <strong>${pick('ورود به حساب کاربری بهدون', 'Log in to your Behdoon Account')}</strong>
                <p>${pick('برای دسترسی دائمی به سوابق، فاکتورها و آدرس‌های ذخیره‌شده، وارد شوید.', 'Log in for permanent access to orders, invoices and saved addresses.')}</p>
              </div>
              <a href="/profile" class="btn btn-secondary btn-sm">${pick('ورود با کد پیامکی', 'Log in with SMS')}</a>
            </div>
          </div>

          <!-- Main Orders Content -->
          <div class="orders-content" id="orders-page-content" hidden>
            
            <!-- User Status Bar (Shows when customer is logged in) -->
            <div class="orders-user-badge-bar" id="orders-user-badge-bar" hidden>
              <div class="orders-user-meta">
                <div class="orders-user-avatar">
                  <span class="icon">${icons.user}</span>
                </div>
                <div>
                  <h2 class="orders-user-name" id="orders-user-name">${pick('مشتری گرامی بهدون', 'Valued Customer')}</h2>
                  <div class="orders-user-phone-wrap">
                    <span class="badge-verified"><span class="icon">${icons.shield}</span> ${pick('شماره تأیید شده', 'Verified')}</span>
                    <span id="orders-user-phone" dir="ltr"></span>
                  </div>
                </div>
              </div>
              <div class="orders-user-actions">
                <a href="/profile" class="btn btn-secondary btn-sm">
                  <span class="icon">${icons.user}</span>
                  <span>${pick('پروفایل و آدرس‌ها', 'Profile & Addresses')}</span>
                </a>
                <a href="/#request" class="btn btn-primary btn-sm">
                  <span class="icon">${icons.plusCircle}</span>
                  <span>${pick('ثبت درخواست جدید', 'New Request')}</span>
                </a>
                <button type="button" class="btn btn-ghost btn-sm btn-logout" id="orders-logout-shortcut-btn" title="${pick('خروج از حساب', 'Log out')}">
                  <span class="icon">${icons.logout}</span>
                </button>
              </div>
            </div>

            <!-- Page Heading & Search -->
            <div class="orders-pro-header">
              <div>
                <h1 class="orders-pro-title">${pick('سوابق و پیگیری درخواست‌ها', 'My Service Requests')}</h1>
                <p class="orders-pro-subtitle">${pick('مدیریت وضعیت اعزام تکنسین، زمان‌بندی و دریافت فاکتورهای رسمی بهدون', 'Track technician status, schedules and download invoices')}</p>
              </div>
              
              <!-- Live Filter Box -->
              <div class="orders-live-search-wrap">
                <span class="icon search-icon">${icons.search}</span>
                <input
                  type="text"
                  id="orders-filter-input"
                  class="orders-filter-input"
                  placeholder="${pick('جستجو با کد رهگیری یا نام خدمت...', 'Search by code or service name...')}"
                />
              </div>
            </div>

            <!-- Segmented Tabs (بخش‌بندی استاندارد و حرفه‌ای) -->
            <div class="orders-segmented-tabs" role="tablist">
              <button type="button" class="orders-seg-tab is-active" data-orders-tab="all" role="tab" aria-selected="true">
                <span class="icon">${icons.layers || icons.box}</span>
                <span>${pick('همه درخواست‌ها', 'All Orders')}</span>
                <span class="orders-tab-count" id="orders-count-all">۰</span>
              </button>
              <button type="button" class="orders-seg-tab" data-orders-tab="pending" role="tab" aria-selected="false">
                <span class="icon">${icons.clock}</span>
                <span>${pick('در انتظار اعزام و هماهنگی', 'Pending / Scheduled')}</span>
                <span class="orders-tab-count" id="orders-count-pending">۰</span>
              </button>
              <button type="button" class="orders-seg-tab" data-orders-tab="in_progress" role="tab" aria-selected="false">
                <span class="icon">${icons.bolt}</span>
                <span>${pick('در حال انجام', 'In Progress')}</span>
                <span class="orders-tab-count" id="orders-count-in-progress">۰</span>
              </button>
              <button type="button" class="orders-seg-tab" data-orders-tab="completed" role="tab" aria-selected="false">
                <span class="icon">${icons.checkCircle || icons.shield}</span>
                <span>${pick('تکمیل شده', 'Completed')}</span>
                <span class="orders-tab-count" id="orders-count-completed">۰</span>
              </button>
              <button type="button" class="orders-seg-tab" data-orders-tab="cancelled" role="tab" aria-selected="false">
                <span class="icon">${icons.close}</span>
                <span>${pick('لغو شده', 'Cancelled')}</span>
                <span class="orders-tab-count" id="orders-count-cancelled">۰</span>
              </button>
            </div>

            <!-- Results List -->
            <div class="orders-pro-results" id="orders-results-list">
              <!-- Rendered via JS -->
            </div>

          </div>
        </div>
      </div>
    </article>
  `;
}

export function renderOrderEditForm(orderId: number): string {
  return `
    <div class="order-edit-form" id="edit-form-${orderId}" hidden>
      <div class="form-field">
        <span class="field-label">${pick('تاریخ جدید', 'New date')}</span>
        ${renderCalendarPicker(`edit-calendar-${orderId}`)}
      </div>
      <div class="form-field">
        <span class="field-label">${pick('ساعت جدید', 'New time')}</span>
        ${renderTimePicker(`edit-time-${orderId}`)}
      </div>
      <div class="order-edit-actions">
        <button type="button" class="btn btn-primary btn-sm" data-save-schedule="${orderId}">${pick('ذخیره تغییرات', 'Save changes')}</button>
        <button type="button" class="btn btn-secondary btn-sm" data-cancel-edit="${orderId}">${pick('انصراف', 'Cancel')}</button>
      </div>
      <p class="request-panel-error" id="edit-error-${orderId}" hidden></p>
    </div>
  `;
}

import { icons } from '../components/icons.ts';
import { renderCalendarPicker } from '../components/PersianCalendar.ts';
import { renderTimePicker } from '../components/TimePicker.ts';
import { pick } from '../i18n/lang.ts';

export function renderOrdersView(): string {
  return `
    <article class="orders-page">
      <div class="container orders-container">
        <nav class="article-breadcrumb" aria-label="${pick('مسیر صفحه', 'Breadcrumb')}">
          <a href="/">${pick('خانه', 'Home')}</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">${pick('درخواست‌های من', 'My requests')}</span>
        </nav>

        <div class="orders-island">
          <div id="orders-loading" class="orders-loading">
            <span class="orders-spinner" aria-hidden="true"></span>
          </div>

          <div id="orders-login-prompt" class="orders-login-prompt" hidden>
            <span class="icon orders-login-prompt-icon">${icons.user}</span>
            <h1>${pick('پیگیری درخواست‌های من', 'My Requests Tracking')}</h1>
            <p>${pick('جهت مشاهده وضعیت سفارش، شماره موبایل یا کد رهگیری خود را وارد نمایید:', 'Enter your mobile number or tracking code to view your orders:')}</p>
            
            <form id="orders-quick-track-form" style="display: flex; gap: 8px; max-width: 380px; margin: 16px auto; width: 100%;">
              <input
                type="text"
                id="orders-quick-track-input"
                placeholder="${pick('۰۹xxxxxxxxx یا کد رهگیری', '09xxxxxxxxx or Tracking code')}"
                style="flex: 1; height: 44px; border: 1.5px solid var(--border); border-radius: 12px; padding: 0 14px; font-size: 0.95rem; text-align: center; direction: ltr;"
              />
              <button type="submit" class="btn btn-primary btn-sm" style="height: 44px; padding: 0 18px; border-radius: 12px; font-weight: 700;">
                ${pick('جستجو', 'Search')}
              </button>
            </form>
            <p id="orders-quick-track-error" hidden style="color: #dc2626; font-size: 0.85rem; font-weight: 700; margin: 4px auto 12px;"></p>

            <div style="margin-top: 10px; font-size: 0.85rem; color: #64748b;">
              <span>${pick('یا برای ورود به حساب کاربری:', 'Or log in to your account:')} </span>
              <a href="/profile.html" style="color: #7c3aed; font-weight: 700; text-decoration: underline;">${pick('ورود با کد پیامکی', 'Log in with SMS')}</a>
            </div>
          </div>

          <div class="orders-content" id="orders-page-content" hidden>
            <div class="orders-page-heading">
              <h1 class="article-title">${pick('درخواست‌های من', 'My requests')}</h1>
              <a class="btn btn-primary btn-sm" href="/#request" id="orders-new-request-btn">
                <span class="icon">${icons.plusCircle}</span>
                <span>${pick('ثبت درخواست جدید', 'Submit new request')}</span>
              </a>
            </div>

            <div class="orders-tabs" role="tablist">
              <button type="button" class="orders-tab is-active" data-orders-tab="active" role="tab" aria-selected="true">
                <span>${pick('درخواست‌های جاری', 'Active requests')}</span>
                <span class="orders-tab-count" id="orders-active-count"></span>
              </button>
              <button type="button" class="orders-tab" data-orders-tab="history" role="tab" aria-selected="false">
                <span>${pick('تاریخچه', 'History')}</span>
                <span class="orders-tab-count" id="orders-history-count"></span>
              </button>
            </div>

            <div class="orders-tab-panel" id="orders-active-panel">
              <div class="orders-results" id="orders-active-results"></div>
            </div>
            <div class="orders-tab-panel" id="orders-history-panel" hidden>
              <div class="orders-results" id="orders-history-results"></div>
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

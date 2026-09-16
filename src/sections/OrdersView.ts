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
            <h1>${pick('درخواست‌های من', 'My requests')}</h1>
            <p>${pick('هنوز وارد نشده‌اید.', "You haven't logged in yet.")}</p>
            <a class="btn btn-primary btn-sm" href="/profile.html">${pick('برای ورود یا ثبت‌نام وارد شوید', 'Log in or sign up')}</a>
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

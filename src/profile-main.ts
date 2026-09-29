import { renderQuickActions, initQuickActions } from './components/QuickActions.ts';
import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/600.css';
import '@fontsource/vazirmatn/700.css';
import './styles/main.css';

import { renderHeader, initHeader } from './components/Header.ts';
import { renderFooter, initFooter } from './components/Footer.ts';
import { renderBottomNav, initBottomNav } from './components/BottomNav.ts';
import { renderProfileView } from './sections/ProfileView.ts';
import { fetchOrdersByPhone } from './utils/api.ts';
import type { OrderRecord } from './utils/api.ts';
import { statusLabel } from './data/status.ts';
import { formatToman } from './utils/format.ts';
import { formatIranianDate, gregorianToJalaali, formatJalaaliDate, toPersianDigits } from './utils/jalali.ts';
import { resolveOrderInvoice } from './data/pricing.ts';
import { openCustomerInvoiceModal } from './components/InvoiceModal.ts';
import { openCustomerTrackingModal } from './components/OrderTrackingModal.ts';
import { icons } from './components/icons.ts';
import { initLangToggle } from './components/LangToggle.ts';
import { initThemeToggle } from './components/ThemeToggle.ts';
import { bootstrapI18n } from './i18n/bootstrap.ts';
import { initBehaviorTracking } from './utils/analytics.ts';
import { pick } from './i18n/lang.ts';
import { loadSettings } from './utils/dynamicContent.ts';
import { applyTheme } from './utils/theme.ts';
import { applySiteSeoSettings } from './utils/seo.ts';
import { applyBranding, applySiteNameEverywhere } from './utils/branding.ts';
import { forceSiteLanguageIfSingleMode, hideLanguageToggleIfSingleMode } from './i18n/languageMode.ts';
import {
  sendCustomerOtp,
  verifyCustomerOtp,
  updateCustomerProfile,
  logoutCustomer,
  fetchCurrentCustomer,
  getCustomerAddresses,
  addCustomerAddress,
  deleteCustomerAddress,
  saveCustomerSession,
  getLocalCustomerInfo,
} from './utils/customerAuth.ts';
import type { CustomerInfo, CustomerIdentityType, CustomerAddress } from './utils/customerAuth.ts';
import { markAppReady } from './utils/appReady.ts';
import { initOtpInput } from './components/OtpInput.ts';
import type { OtpInputHandle } from './components/OtpInput.ts';

let cachedSettings: Awaited<ReturnType<typeof loadSettings>> = {};

const PHONE_RE = /^09\d{9}$/;

function normalizeCustomerPhone(val: string): string {
  let p = (val || '')
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
    .trim()
    .replace(/[\s\-_\(\)\+]/g, '');
  if (p.startsWith('0098')) p = p.slice(4);
  else if (p.startsWith('98')) p = p.slice(2);
  if (p.startsWith('9') && p.length === 10) p = '0' + p;
  return p;
}

function renderApp(): void {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) return;

  app.innerHTML = `
    <a class="skip-link" href="#main-content">${pick('رفتن به محتوای اصلی', 'Skip to main content')}</a>
    ${renderHeader(cachedSettings)}
    <main id="main-content">
      ${renderProfileView()}
    </main>
    ${renderFooter(cachedSettings)}
    ${renderBottomNav()}
    ${renderQuickActions(cachedSettings)}
  `;
}

function earliestJoinDate(orders: OrderRecord[]): string {
  if (!orders.length) {
    return formatJalaaliDate(gregorianToJalaali(new Date()));
  }
  const dates = orders.map((o) => new Date(o.createdAt).getTime()).filter((t) => !isNaN(t));
  if (!dates.length) {
    return formatJalaaliDate(gregorianToJalaali(new Date()));
  }
  const minTime = Math.min(...dates);
  return formatJalaaliDate(gregorianToJalaali(new Date(minTime)));
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
  initThemeToggle();
  initQuickActions(cachedSettings);

  const authSection = document.getElementById('profile-auth-section');
  const dashboardEl = document.getElementById('profile-page-content');

  // Auth Forms
  const phoneForm = document.getElementById('profile-phone-form') as HTMLFormElement | null;
  const phoneInput = document.getElementById('profile-phone-input') as HTMLInputElement | null;
  const phoneSubmitBtn = document.getElementById('profile-phone-submit-btn') as HTMLButtonElement | null;
  const phoneError = document.getElementById('profile-phone-error');

  const otpForm = document.getElementById('profile-otp-form') as HTMLFormElement | null;
  const otpPhoneDisplay = document.getElementById('profile-otp-phone-display');
  const changePhoneBtn = document.getElementById('profile-change-phone-btn') as HTMLButtonElement | null;
  const otpSubmitBtn = document.getElementById('profile-otp-submit-btn') as HTMLButtonElement | null;
  const otpError = document.getElementById('profile-otp-error');

  const detailsForm = document.getElementById('profile-details-form') as HTMLFormElement | null;
  const genderBtns = Array.from(document.querySelectorAll<HTMLButtonElement>('.profile-identity-picker .profile-gender-btn'));
  const genderInput = document.getElementById('profile-gender-input') as HTMLInputElement | null;
  const companyField = document.getElementById('profile-company-field');
  const companyInput = document.getElementById('profile-company-input') as HTMLInputElement | null;
  const fullNameInput = document.getElementById('profile-fullname-input') as HTMLInputElement | null;
  const detailsSubmitBtn = document.getElementById('profile-details-submit-btn') as HTMLButtonElement | null;
  const detailsError = document.getElementById('profile-details-error');

  // Hero Card Elements
  const heroNameEl = document.getElementById('profile-hero-name');
  const heroPhoneEl = document.getElementById('profile-hero-phone');
  const heroDateEl = document.getElementById('profile-hero-date');
  const heroIdentityEl = document.getElementById('profile-hero-identity');
  const heroAvatarEl = document.getElementById('profile-hero-avatar');

  // Tabs & Panels
  const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-profile-tab]'));
  const panelHistory = document.getElementById('profile-panel-history');
  const panelAddresses = document.getElementById('profile-panel-addresses');
  const panelEdit = document.getElementById('profile-panel-edit');
  const panelSettings = document.getElementById('profile-panel-settings');
  const ordersListEl = document.getElementById('profile-orders-list');
  const ordersBadgeEl = document.getElementById('profile-orders-count-badge');
  const addressBadgeEl = document.getElementById('profile-address-count-badge');

  // Address Elements
  const addAddressBtn = document.getElementById('profile-add-address-btn') as HTMLButtonElement | null;
  const newAddressForm = document.getElementById('profile-new-address-form') as HTMLFormElement | null;
  const cancelAddressBtn = document.getElementById('profile-cancel-address-btn') as HTMLButtonElement | null;
  const addressTitleInput = document.getElementById('profile-address-title-input') as HTMLInputElement | null;
  const addressCityInput = document.getElementById('profile-address-city-input') as HTMLInputElement | null;
  const addressTextInput = document.getElementById('profile-address-text-input') as HTMLInputElement | null;
  const addressFloorInput = document.getElementById('profile-address-floor-input') as HTMLInputElement | null;
  const addressUnitInput = document.getElementById('profile-address-unit-input') as HTMLInputElement | null;
  const addressElevatorInput = document.getElementById('profile-address-elevator-input') as HTMLInputElement | null;
  const addressFormError = document.getElementById('profile-address-form-error');
  const addressesGrid = document.getElementById('profile-addresses-grid');
  const addressChips = Array.from(document.querySelectorAll<HTMLButtonElement>('.profile-chip'));

  // Edit Profile Elements
  const editForm = document.getElementById('profile-edit-form') as HTMLFormElement | null;
  const editGenderBtns = Array.from(document.querySelectorAll<HTMLButtonElement>('#profile-edit-gender-picker .profile-gender-btn'));
  const editGenderInput = document.getElementById('profile-edit-gender-input') as HTMLInputElement | null;
  const editCompanyField = document.getElementById('profile-edit-company-field');
  const editCompanyInput = document.getElementById('profile-edit-company-input') as HTMLInputElement | null;
  const editNameInput = document.getElementById('profile-edit-name-input') as HTMLInputElement | null;
  const editPhoneInput = document.getElementById('profile-edit-phone-input') as HTMLInputElement | null;
  const editSaveBtn = document.getElementById('profile-save-profile-btn') as HTMLButtonElement | null;
  const editErrorEl = document.getElementById('profile-edit-error');
  const editSuccessEl = document.getElementById('profile-edit-success');

  // Logout Buttons
  const headerLogoutBtn = document.getElementById('profile-logout-btn') as HTMLButtonElement | null;
  const settingsLogoutBtn = document.getElementById('profile-settings-logout-btn') as HTMLButtonElement | null;

  let currentCustomer: CustomerInfo | null = null;
  let currentPhone = '';
  let otpHandle: OtpInputHandle | null = null;
  let loadedOrders: OrderRecord[] = [];

  // ==========================================
  // Tab Switching & Hash Navigation
  // ==========================================
  function activateTab(tabId: string): void {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.profileTab === tabId;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });

    if (panelHistory) panelHistory.hidden = tabId !== 'history';
    if (panelAddresses) panelAddresses.hidden = tabId !== 'addresses';
    if (panelEdit) panelEdit.hidden = tabId !== 'edit';
    if (panelSettings) panelSettings.hidden = tabId !== 'settings';

    // update hash cleanly
    if (location.hash !== `#${tabId}`) {
      history.replaceState(null, '', `#${tabId}`);
    }
  }

  window.addEventListener('hashchange', () => {
    const h = (location.hash || '').replace('#', '');
    if (['history', 'addresses', 'edit', 'settings'].includes(h)) {
      activateTab(h);
    }
  });

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const tabId = tab.dataset.profileTab || 'history';
      activateTab(tabId);
    });
  });

  // ==========================================
  // Identity Picker helper
  // ==========================================
  function setupIdentityPicker(
    btns: HTMLButtonElement[],
    inputEl: HTMLInputElement | null,
    companyWrap: HTMLElement | null,
    companyInputEl: HTMLInputElement | null,
    initialVal: string
  ) {
    function setVal(val: string) {
      if (inputEl) inputEl.value = val;
      btns.forEach((b) => {
        const isSel = b.dataset.gender === val;
        b.classList.toggle('is-active', isSel);
        b.setAttribute('aria-checked', String(isSel));
      });
      const isOrg = val === 'company' || val === 'organization';
      if (companyWrap) {
        companyWrap.hidden = !isOrg;
      }
      if (companyInputEl) {
        companyInputEl.required = isOrg;
      }
    }

    btns.forEach((b) => {
      b.addEventListener('click', () => {
        setVal(b.dataset.gender || 'male');
      });
    });

    setVal(initialVal);
  }

  setupIdentityPicker(genderBtns, genderInput, companyField, companyInput, 'male');
  setupIdentityPicker(editGenderBtns, editGenderInput, editCompanyField, editCompanyInput, 'male');

  // ==========================================
  // Load & Render Customer Dashboard
  // ==========================================
  async function showLoggedIn(customer: CustomerInfo): Promise<void> {
    currentCustomer = customer;
    authSection!.hidden = true;
    dashboardEl!.hidden = false;

    // Update Hero Card
    if (heroNameEl) heroNameEl.textContent = customer.fullName || pick('کاربر گرامی بهدون', 'Valued Customer');
    if (heroPhoneEl) heroPhoneEl.textContent = toPersianDigits(customer.phone);
    if (heroAvatarEl) {
      const initial = (customer.fullName || 'ک').trim().charAt(0);
      heroAvatarEl.innerHTML = `<span class="profile-avatar-char">${initial}</span>`;
    }

    let identityLabel = pick('شخص حقیقی', 'Individual');
    if (customer.gender === 'female') identityLabel = pick('خانم', 'Female');
    else if (customer.gender === 'male') identityLabel = pick('آقا', 'Male');
    else if (customer.gender === 'company') identityLabel = pick('حساب شرکتی', 'Company');
    else if (customer.gender === 'organization') identityLabel = pick('اداری و سازمانی', 'Organization');
    if (heroIdentityEl) heroIdentityEl.textContent = identityLabel;

    // Populate Edit Form
    if (editNameInput) editNameInput.value = customer.fullName || '';
    if (editPhoneInput) editPhoneInput.value = toPersianDigits(customer.phone);
    if (editCompanyInput && customer.companyName) editCompanyInput.value = customer.companyName;
    setupIdentityPicker(editGenderBtns, editGenderInput, editCompanyField, editCompanyInput, customer.gender || 'male');

    // Load Orders & Addresses in parallel
    void loadOrders(customer.phone);
    void loadAddresses();

    // Check initial tab by hash
    const initialHash = (location.hash || '').replace('#', '');
    if (['history', 'addresses', 'edit', 'settings'].includes(initialHash)) {
      activateTab(initialHash);
    } else {
      activateTab('history');
    }
  }

  async function loadOrders(phone: string): Promise<void> {
    try {
      const orders = await fetchOrdersByPhone(phone);
      loadedOrders = orders;
      if (ordersBadgeEl) ordersBadgeEl.textContent = toPersianDigits(orders.length);
      if (heroDateEl) heroDateEl.textContent = `${pick('عضویت از', 'Member since')} ${earliestJoinDate(orders)}`;
      renderOrders(orders);
    } catch {
      loadedOrders = [];
      renderOrders([]);
    }
  }

  function renderOrders(orders: OrderRecord[]): void {
    if (!ordersListEl) return;
    if (!orders.length) {
      ordersListEl.innerHTML = `
        <div class="orders-empty-state" style="padding: 32px 16px;">
          <div class="orders-empty-icon">${icons.box}</div>
          <h3>${pick('هنوز هیچ سفارشی ثبت نشده است', 'No orders recorded yet')}</h3>
          <p>${pick('برای اعزام فوری متخصصین بهدون، درخواست خدمت خود را ثبت کنید.', 'Submit a request to dispatch Behdoon specialists.')}</p>
          <a href="/#request" class="btn btn-primary btn-sm">
            <span class="icon">${icons.plusCircle}</span>
            <span>${pick('ثبت اولین درخواست خدمت', 'New Service Request')}</span>
          </a>
        </div>
      `;
      return;
    }

    ordersListEl.innerHTML = orders.map((o) => `
      <div class="profile-order-summary-card" data-order-id="${o.id}">
        <div class="profile-order-card-header">
          <div class="profile-order-service-wrap">
            <span class="icon profile-order-icon">${icons.tool || icons.box}</span>
            <div>
              <strong class="profile-order-service-name">${o.serviceLabel}</strong>
              <span class="profile-order-date">${formatIranianDate(o.scheduledDate)} — ساعت ${toPersianDigits(o.scheduledTime)}</span>
            </div>
          </div>
          <span class="order-card-pro-status status-${o.status}">
            <span class="status-dot"></span>
            ${statusLabel(o.status)}
          </span>
        </div>

        <div class="profile-order-meta-grid">
          <div>
            <span class="profile-meta-label">${pick('کد پیگیری:', 'Tracking Code:')}</span>
            <strong class="profile-tracking-val" dir="ltr">#${toPersianDigits(o.trackingCode)}</strong>
            <button type="button" class="btn-copy-tracking" data-copy-code="${o.trackingCode}" title="${pick('کپی کد', 'Copy code')}">
              <span class="icon">${icons.copy || icons.fileText}</span>
            </button>
          </div>
          <div>
            <span class="profile-meta-label">${pick('مبلغ برآوردی:', 'Estimate:')}</span>
            <strong class="profile-price-val">${formatToman(o.finalPrice || o.estimateAvg)}</strong>
          </div>
          <div style="grid-column: 1 / -1;">
            <span class="profile-meta-label">${pick('نشانی محل خدمت:', 'Address:')}</span>
            <span>${o.originNotes ? o.originNotes : pick('تهران (موقعیت نقشه)', 'Tehran')}</span>
          </div>
        </div>

        <div class="profile-order-card-actions">
          <button type="button" class="btn btn-primary btn-sm" data-track-order="${o.id}">
            <span class="icon">${icons.clock}</span>
            <span>${pick('رهگیری زنده', 'Live Tracking')}</span>
          </button>
          <button type="button" class="btn btn-secondary btn-sm" data-order-invoice="${o.id}">
            <span class="icon">${icons.fileText}</span>
            <span>${pick('مشاهده فاکتور', 'View Invoice')}</span>
          </button>
        </div>
      </div>
    `).join('');

    // Wire actions
    ordersListEl.querySelectorAll<HTMLButtonElement>('[data-track-order]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.trackOrder);
        if (id) openCustomerTrackingModal(id, { onUpdate: () => void loadOrders(currentCustomer!.phone) });
      });
    });

    ordersListEl.querySelectorAll<HTMLButtonElement>('[data-order-invoice]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.orderInvoice);
        const order = loadedOrders.find((o) => o.id === id);
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

    ordersListEl.querySelectorAll<HTMLButtonElement>('[data-copy-code]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const code = btn.dataset.copyCode;
        if (!code) return;
        navigator.clipboard.writeText(code).then(() => {
          const original = btn.innerHTML;
          btn.innerHTML = `<span style="font-size: 0.72rem; color: #16a34a; font-weight: 700;">${pick('کپی شد!', 'Copied!')}</span>`;
          setTimeout(() => {
            btn.innerHTML = original;
          }, 1800);
        }).catch(() => {});
      });
    });
  }

  async function loadAddresses(): Promise<void> {
    try {
      const addresses = await getCustomerAddresses();
      if (addressBadgeEl) addressBadgeEl.textContent = toPersianDigits(addresses.length);
      renderAddresses(addresses);
    } catch {
      renderAddresses([]);
    }
  }

  function renderAddresses(addresses: CustomerAddress[]): void {
    if (!addressesGrid) return;
    if (!addresses.length) {
      addressesGrid.innerHTML = `
        <div class="orders-empty-state" style="padding: 32px 16px; grid-column: 1 / -1;">
          <div class="orders-empty-icon">${icons.pin}</div>
          <h3>${pick('هنوز هیچ آدرسی ثبت نشده است', 'No saved addresses')}</h3>
          <p>${pick('با زدن دکمه «افزودن آدرس جدید»، اولین نشانی خود را ذخیره فرمایید.', 'Click "Add New Address" to save your first location.')}</p>
        </div>
      `;
      return;
    }

    addressesGrid.innerHTML = addresses.map((a) => {
      const meta = [];
      if (a.floor) meta.push(`${pick('طبقه', 'Floor')} ${toPersianDigits(a.floor)}`);
      if (a.unit) meta.push(`${pick('واحد', 'Unit')} ${toPersianDigits(a.unit)}`);
      if (a.hasElevator) meta.push(pick('آسانسور دارد', 'Has elevator'));

      return `
        <div class="profile-address-card">
          <div class="profile-address-card-header">
            <span class="profile-address-badge"><span class="icon">${icons.pin}</span> ${a.title}</span>
            <button type="button" class="profile-address-del-btn" data-delete-id="${a.id}" title="${pick('حذف آدرس', 'Delete address')}">
              <span class="icon">${icons.close}</span>
            </button>
          </div>
          <div class="profile-address-text">${a.city} — ${a.address}</div>
          ${meta.length ? `<div class="profile-address-tags">${meta.map((m) => `<span class="profile-address-tag">${m}</span>`).join('')}</div>` : ''}
        </div>
      `;
    }).join('');

    addressesGrid.querySelectorAll<HTMLButtonElement>('[data-delete-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.deleteId);
        if (!id) return;
        if (!window.confirm(pick('آیا از حذف این آدرس اطمینان دارید؟', 'Are you sure you want to delete this address?'))) return;
        btn.disabled = true;
        deleteCustomerAddress(id)
          .then(() => loadAddresses())
          .catch((err) => {
            alert(err instanceof Error ? err.message : pick('حذف با خطا مواجه شد.', 'Failed to delete'));
            btn.disabled = false;
          });
      });
    });
  }

  // Address Form toggles & submit
  addAddressBtn?.addEventListener('click', () => {
    if (newAddressForm) {
      newAddressForm.hidden = !newAddressForm.hidden;
      if (!newAddressForm.hidden && addressTitleInput) addressTitleInput.focus();
    }
  });

  cancelAddressBtn?.addEventListener('click', () => {
    if (newAddressForm) {
      newAddressForm.hidden = true;
      newAddressForm.reset();
      if (addressFormError) addressFormError.hidden = true;
    }
  });

  addressChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      if (addressTitleInput) {
        addressTitleInput.value = chip.dataset.chip || chip.textContent || '';
        addressTitleInput.focus();
      }
    });
  });

  newAddressForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = addressTitleInput?.value.trim();
    const city = addressCityInput?.value.trim() || 'تهران';
    const address = addressTextInput?.value.trim();
    if (!title || !address) {
      if (addressFormError) {
        addressFormError.hidden = false;
        addressFormError.textContent = pick('عنوان و نشانی دقیق الزامی هستند.', 'Title and address are required.');
      }
      return;
    }

    const saveBtn = document.getElementById('profile-save-address-btn') as HTMLButtonElement | null;
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = pick('در حال ذخیره...', 'Saving...');
    }

    addCustomerAddress({
      title,
      city,
      address,
      floor: addressFloorInput?.value.trim() || undefined,
      unit: addressUnitInput?.value.trim() || undefined,
      hasElevator: addressElevatorInput?.checked || false,
    })
      .then(() => {
        newAddressForm.hidden = true;
        newAddressForm.reset();
        if (addressFormError) addressFormError.hidden = true;
        void loadAddresses();
      })
      .catch((err) => {
        if (addressFormError) {
          addressFormError.hidden = false;
          addressFormError.textContent = err instanceof Error ? err.message : pick('ثبت آدرس ناموفق بود.', 'Failed to save address.');
        }
      })
      .finally(() => {
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.textContent = pick('ذخیره در دفترچه آدرس‌ها', 'Save Address');
        }
      });
  });

  // Edit Profile Form Submit
  editForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fullName = editNameInput?.value.trim();
    const gender = (editGenderInput?.value || 'male') as CustomerIdentityType;
    const companyName = editCompanyInput?.value.trim();

    if (!fullName) {
      if (editErrorEl) {
        editErrorEl.hidden = false;
        editErrorEl.textContent = pick('نام و نام خانوادگی الزامی است.', 'Full name is required.');
      }
      return;
    }

    if (editSaveBtn) {
      editSaveBtn.disabled = true;
      editSaveBtn.textContent = pick('در حال ذخیره...', 'Saving...');
    }
    if (editErrorEl) editErrorEl.hidden = true;
    if (editSuccessEl) editSuccessEl.hidden = true;

    updateCustomerProfile(fullName, gender, companyName)
      .then((updated) => {
        currentCustomer = updated;
        saveCustomerSession(updated);
        if (heroNameEl) heroNameEl.textContent = updated.fullName;
        if (heroAvatarEl) {
          const initial = updated.fullName.trim().charAt(0);
          heroAvatarEl.innerHTML = `<span class="profile-avatar-char">${initial}</span>`;
        }
        let idLabel = pick('شخص حقیقی', 'Individual');
        if (updated.gender === 'female') idLabel = pick('خانم', 'Female');
        else if (updated.gender === 'male') idLabel = pick('آقا', 'Male');
        else if (updated.gender === 'company') idLabel = pick('حساب شرکتی', 'Company');
        else if (updated.gender === 'organization') idLabel = pick('اداری و سازمانی', 'Organization');
        if (heroIdentityEl) heroIdentityEl.textContent = idLabel;

        if (editSuccessEl) editSuccessEl.hidden = false;
        setTimeout(() => {
          if (editSuccessEl) editSuccessEl.hidden = true;
        }, 4000);
      })
      .catch((err) => {
        if (editErrorEl) {
          editErrorEl.hidden = false;
          editErrorEl.textContent = err instanceof Error ? err.message : pick('به‌روزرسانی با خطا مواجه شد.', 'Update failed.');
        }
      })
      .finally(() => {
        if (editSaveBtn) {
          editSaveBtn.disabled = false;
          editSaveBtn.textContent = pick('ذخیره تغییرات پروفایل', 'Save Profile Changes');
        }
      });
  });

  // Logout Handlers
  async function performLogout(): Promise<void> {
    if (window.confirm(pick('آیا از خروج از حساب کاربری اطمینان دارید؟', 'Are you sure you want to log out?'))) {
      await logoutCustomer();
      window.location.reload();
    }
  }

  headerLogoutBtn?.addEventListener('click', performLogout);
  settingsLogoutBtn?.addEventListener('click', performLogout);

  // ==========================================
  // Guest Authentication Flow (Strict OTP Entry)
  // ==========================================
  function showStepPhone(): void {
    authSection!.hidden = false;
    dashboardEl!.hidden = true;
    phoneForm!.hidden = false;
    otpForm!.hidden = true;
    detailsForm!.hidden = true;
    if (phoneError) phoneError.hidden = true;
    phoneInput?.focus();
  }

  function showStepOtp(phone: string): void {
    currentPhone = phone;
    authSection!.hidden = false;
    dashboardEl!.hidden = true;
    phoneForm!.hidden = true;
    otpForm!.hidden = false;
    detailsForm!.hidden = true;
    if (otpError) otpError.hidden = true;
    if (otpPhoneDisplay) otpPhoneDisplay.textContent = toPersianDigits(phone);

    otpHandle?.destroy();
    otpHandle = initOtpInput('profile-otp', {
      length: 5,
      onComplete: (code) => {
        void submitOtp(code);
      },
      onResend: () => {
        void handleResendOtp();
      },
    });
    setTimeout(() => {
      otpHandle?.focusFirst();
    }, 50);
  }

  function showStepDetails(customer: CustomerInfo): void {
    authSection!.hidden = false;
    dashboardEl!.hidden = true;
    phoneForm!.hidden = true;
    otpForm!.hidden = true;
    detailsForm!.hidden = false;
    if (detailsError) detailsError.hidden = true;

    if (customer.fullName && fullNameInput) fullNameInput.value = customer.fullName;
    if (customer.companyName && companyInput) companyInput.value = customer.companyName;
    setupIdentityPicker(genderBtns, genderInput, companyField, companyInput, customer.gender || 'male');
    fullNameInput?.focus();
  }

  phoneForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const phone = normalizeCustomerPhone(phoneInput?.value || '');
    if (phoneError) phoneError.hidden = true;

    if (!PHONE_RE.test(phone)) {
      if (phoneError) {
        phoneError.hidden = false;
        phoneError.textContent = pick('شماره موبایل معتبر ۱۱ رقمی وارد کنید (مثال: ۰۹xxxxxxxxx).', 'Enter a valid 11-digit mobile number.');
      }
      phoneInput?.focus();
      return;
    }

    if (phoneSubmitBtn) {
      phoneSubmitBtn.disabled = true;
      phoneSubmitBtn.textContent = pick('در حال ارسال پیامک...', 'Sending SMS...');
    }

    sendCustomerOtp(phone)
      .then(() => {
        showStepOtp(phone);
      })
      .catch((err) => {
        if (phoneError) {
          phoneError.hidden = false;
          phoneError.textContent = err instanceof Error ? err.message : pick('خطایی در ارسال کد پیش آمد.', 'Failed to send code.');
        }
      })
      .finally(() => {
        if (phoneSubmitBtn) {
          phoneSubmitBtn.disabled = false;
          phoneSubmitBtn.textContent = pick('دریافت کد تأیید پیامکی', 'Send SMS verification code');
        }
      });
  });

  changePhoneBtn?.addEventListener('click', () => {
    showStepPhone();
  });

  async function handleResendOtp(): Promise<void> {
    if (otpError) otpError.hidden = true;
    try {
      await sendCustomerOtp(currentPhone);
    } catch (err) {
      if (otpError) {
        otpError.hidden = false;
        otpError.textContent = err instanceof Error ? err.message : pick('ارسال مجدد کد با خطا مواجه شد.', 'Failed to resend code.');
      }
    }
  }

  async function submitOtp(code: string): Promise<void> {
    if (otpError) otpError.hidden = true;
    if (otpSubmitBtn) {
      otpSubmitBtn.disabled = true;
      otpSubmitBtn.textContent = pick('در حال بررسی کد...', 'Verifying code...');
    }

    try {
      const res = await verifyCustomerOtp(currentPhone, code);
      otpHandle?.stopWebOtp();
      saveCustomerSession(res.customer, res.token);
      if (res.needsProfile) {
        showStepDetails(res.customer);
      } else {
        void showLoggedIn(res.customer);
      }
    } catch (err) {
      if (otpError) {
        otpError.hidden = false;
        otpError.textContent = err instanceof Error ? err.message : pick('کد وارد شده صحیح نیست یا منقضی شده است.', 'Invalid or expired code.');
      }
      otpHandle?.reset();
      otpHandle?.focusFirst();
    } finally {
      if (otpSubmitBtn) {
        otpSubmitBtn.disabled = false;
        otpSubmitBtn.textContent = pick('بررسی کد و ورود', 'Verify & Enter');
      }
    }
  }

  otpForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = otpHandle?.getCode() || '';
    if (code.length === 5) {
      void submitOtp(code);
    } else {
      if (otpError) {
        otpError.hidden = false;
        otpError.textContent = pick('لطفاً کد ۵ رقمی را کامل وارد نمایید.', 'Enter 5-digit code.');
      }
    }
  });

  detailsForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fullName = fullNameInput?.value.trim();
    const gender = (genderInput?.value || 'male') as CustomerIdentityType;
    const companyName = companyInput?.value.trim();

    if (!fullName) {
      if (detailsError) {
        detailsError.hidden = false;
        detailsError.textContent = pick('لطفاً نام و نام خانوادگی را وارد کنید.', 'Enter full name.');
      }
      return;
    }

    if (detailsSubmitBtn) {
      detailsSubmitBtn.disabled = true;
      detailsSubmitBtn.textContent = pick('در حال ثبت اطلاعات...', 'Saving...');
    }
    if (detailsError) detailsError.hidden = true;

    updateCustomerProfile(fullName, gender, companyName)
      .then((customer) => {
        saveCustomerSession(customer);
        void showLoggedIn(customer);
      })
      .catch((err) => {
        if (detailsError) {
          detailsError.hidden = false;
          detailsError.textContent = err instanceof Error ? err.message : pick('ثبت اطلاعات با خطا مواجه شد.', 'Failed to save.');
        }
      })
      .finally(() => {
        if (detailsSubmitBtn) {
          detailsSubmitBtn.disabled = false;
          detailsSubmitBtn.textContent = pick('ورود به داشبورد حساب', 'Enter Profile Dashboard');
        }
      });
  });

  // ==========================================
  // Check Existing Session on page load
  // ==========================================
  const localCust = getLocalCustomerInfo();
  if (localCust) {
    void showLoggedIn(localCust);
  }

  fetchCurrentCustomer()
    .then((customer) => {
      if (customer) {
        void showLoggedIn(customer);
      } else if (!localCust) {
        showStepPhone();
      }
    })
    .catch(() => {
      if (!localCust) {
        showStepPhone();
      }
    });
}

bootstrapI18n(() => void init());

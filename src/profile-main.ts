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
import { extractSavedAddresses, formatAddressLabel } from './utils/addresses.ts';
import { gregorianToJalaali, formatJalaaliDate, toPersianDigits } from './utils/jalali.ts';
import { icons } from './components/icons.ts';
import { initLangToggle } from './components/LangToggle.ts';
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
} from './utils/customerAuth.ts';
import type { CustomerInfo, CustomerIdentityType } from './utils/customerAuth.ts';
import { markAppReady } from './utils/appReady.ts';
import { initOtpInput } from './components/OtpInput.ts';
import type { OtpInputHandle } from './components/OtpInput.ts';

let cachedSettings: Awaited<ReturnType<typeof loadSettings>> = {};

const PHONE_RE = /^09\d{9}$/;

function normalizeCustomerPhone(val: string): string {
  let p = val
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
    .trim()
    .replace(/[\s\-_]/g, '');
  if (p.startsWith('+98')) p = '0' + p.slice(3);
  else if (p.startsWith('0098')) p = '0' + p.slice(4);
  else if (p.startsWith('98')) p = '0' + p.slice(2);
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
  if (!orders.length) return pick('نامشخص', 'Unknown');
  const earliest = orders.reduce((min, o) => (new Date(o.createdAt) < new Date(min.createdAt) ? o : min));
  return formatJalaaliDate(gregorianToJalaali(new Date(earliest.createdAt)));
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

  const authSection = document.getElementById('profile-auth-section');
  const contentEl = document.getElementById('profile-page-content');
  const infoCard = document.getElementById('profile-info-card');
  const addressesBlock = document.getElementById('profile-addresses-block');
  const originAddressesGroup = document.getElementById('profile-origin-addresses');
  const originAddressList = document.getElementById('profile-origin-address-list');
  const destinationAddressesGroup = document.getElementById('profile-destination-addresses');
  const destinationAddressList = document.getElementById('profile-destination-address-list');
  const logoutBtn = document.getElementById('profile-logout-btn') as HTMLButtonElement | null;

  // گام ۱: شماره موبایل
  const phoneForm = document.getElementById('profile-phone-form') as HTMLFormElement | null;
  const phoneInput = document.getElementById('profile-phone-input') as HTMLInputElement | null;
  const phoneSubmitBtn = document.getElementById('profile-phone-submit-btn') as HTMLButtonElement | null;
  const phoneError = document.getElementById('profile-phone-error');

  // گام ۲: کد تأیید پیامک
  const otpForm = document.getElementById('profile-otp-form') as HTMLFormElement | null;
  const otpPhoneDisplay = document.getElementById('profile-otp-phone-display');
  const changePhoneBtn = document.getElementById('profile-change-phone-btn') as HTMLButtonElement | null;
  const otpSubmitBtn = document.getElementById('profile-otp-submit-btn') as HTMLButtonElement | null;
  const otpError = document.getElementById('profile-otp-error');

  // گام ۳: تکمیل اطلاعات و جنسیت / نوع حساب
  const detailsForm = document.getElementById('profile-details-form') as HTMLFormElement | null;
  const genderBtns = Array.from(document.querySelectorAll<HTMLButtonElement>('.profile-gender-btn'));
  const genderInput = document.getElementById('profile-gender-input') as HTMLInputElement | null;
  const fullNameInput = document.getElementById('profile-fullname-input') as HTMLInputElement | null;
  const fullNameLabel = document.getElementById('profile-fullname-label');
  const companyField = document.getElementById('profile-company-field');
  const companyInput = document.getElementById('profile-company-input') as HTMLInputElement | null;
  const companyLabel = document.getElementById('profile-company-label');
  const detailsSubmitBtn = document.getElementById('profile-details-submit-btn') as HTMLButtonElement | null;
  const detailsError = document.getElementById('profile-details-error');

  // دفترچه آدرس‌ها
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

  if (
    !authSection ||
    !contentEl ||
    !infoCard ||
    !addressesBlock ||
    !originAddressesGroup ||
    !originAddressList ||
    !destinationAddressesGroup ||
    !destinationAddressList ||
    !logoutBtn ||
    !phoneForm ||
    !phoneInput ||
    !phoneSubmitBtn ||
    !phoneError ||
    !otpForm ||
    !otpPhoneDisplay ||
    !changePhoneBtn ||
    !otpSubmitBtn ||
    !otpError ||
    !detailsForm ||
    !genderInput ||
    !fullNameInput ||
    !detailsSubmitBtn ||
    !detailsError
  ) {
    return;
  }

  let currentPhone = '';
  let otpHandle: OtpInputHandle | null = null;

  async function loadAndRenderAddressBook(): Promise<void> {
    if (!addressesGrid) return;
    const addresses = await getCustomerAddresses();
    if (!addresses.length) {
      addressesGrid.innerHTML = `
        <div class="profile-addresses-empty">
          <span class="icon">${icons.pin}</span>
          <p>${pick('هنوز هیچ آدرسی ثبت نکرده‌اید. با زدن دکمه «افزودن آدرس جدید» اولین آدرس خود را ذخیره کنید.', 'No saved addresses yet.')}</p>
        </div>
      `;
      return;
    }

    addressesGrid.innerHTML = addresses
      .map((addr) => {
        const metaTags: string[] = [];
        if (addr.city) metaTags.push(`<span class="profile-address-tag">${addr.city}</span>`);
        if (addr.floor) metaTags.push(`<span class="profile-address-tag">${pick('طبقه', 'Floor')} ${toPersianDigits(addr.floor)}</span>`);
        if (addr.unit) metaTags.push(`<span class="profile-address-tag">${pick('واحد', 'Unit')} ${toPersianDigits(addr.unit)}</span>`);
        if (addr.hasElevator) metaTags.push(`<span class="profile-address-tag">${pick('دارای آسانسور', 'With elevator')}</span>`);

        return `
          <div class="profile-address-card" data-address-id="${addr.id}">
            <div class="profile-address-card-header">
              <span class="profile-address-badge"><span class="icon">${icons.pin}</span>${addr.title}</span>
              <button type="button" class="profile-address-del-btn" data-delete-id="${addr.id}" title="${pick('حذف آدرس', 'Delete address')}">
                <span class="icon">${icons.trash}</span>
              </button>
            </div>
            <p class="profile-address-text">${addr.address}</p>
            ${metaTags.length ? `<div class="profile-address-tags">${metaTags.join('')}</div>` : ''}
          </div>
        `;
      })
      .join('');

    const delBtns = Array.from(addressesGrid.querySelectorAll<HTMLButtonElement>('.profile-address-del-btn'));
    delBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.deleteId);
        if (!id) return;
        btn.disabled = true;
        deleteCustomerAddress(id)
          .then(() => loadAndRenderAddressBook())
          .catch((err) => {
            alert(err instanceof Error ? err.message : pick('حذف ناموفق بود.', 'Failed to delete'));
            btn.disabled = false;
          });
      });
    });
  }

  function renderProfile(customer: CustomerInfo, orders: OrderRecord[]): void {
    const joinDate = earliestJoinDate(orders);
    let genderIcon = icons.user;
    let genderLabel = '';
    let badgeClass = 'profile-badge-male';

    if (customer.gender === 'female') {
      genderIcon = icons.female;
      genderLabel = pick('خانم', 'Female');
      badgeClass = 'profile-badge-female';
    } else if (customer.gender === 'male') {
      genderIcon = icons.male;
      genderLabel = pick('آقا', 'Male');
      badgeClass = 'profile-badge-male';
    } else if (customer.gender === 'company') {
      genderIcon = icons.building;
      genderLabel = pick('شرکتی', 'Company');
      badgeClass = 'profile-badge-company';
    } else if (customer.gender === 'organization') {
      genderIcon = icons.organization;
      genderLabel = pick('اداری و سازمانی', 'Organization');
      badgeClass = 'profile-badge-org';
    }

    const companyRow = customer.companyName
      ? `
        <div class="orders-profile-row">
          <span class="icon">${customer.gender === 'organization' ? icons.organization : icons.building}</span>
          <strong>${customer.companyName}</strong>
          ${customer.gender ? `<span class="profile-gender-badge ${badgeClass}">${genderLabel}</span>` : ''}
        </div>
      `
      : '';

    const personBadge = !customer.companyName && genderLabel
      ? `<span class="profile-gender-badge ${badgeClass}">${genderLabel}</span>`
      : '';

    infoCard!.innerHTML = `
      ${companyRow}
      <div class="orders-profile-row">
        <span class="icon">${genderIcon}</span>
        <strong>${customer.fullName}</strong>
        ${personBadge}
      </div>
      <div class="orders-profile-row">
        <span class="icon">${icons.phone}</span>
        <span dir="ltr">${toPersianDigits(customer.phone)}</span>
      </div>
      <div class="orders-profile-row">
        <span class="icon">${icons.calendar}</span>
        <span>${pick('عضویت از', 'Member since')} ${joinDate}</span>
      </div>
    `;

    void loadAndRenderAddressBook();

    const { origins, destinations } = extractSavedAddresses(orders);

    if (origins.length) {
      originAddressesGroup!.hidden = false;
      originAddressList!.innerHTML = origins
        .map((a) => `<li class="saved-address-item"><span class="icon">${icons.pin}</span><span>${formatAddressLabel(a)}</span></li>`)
        .join('');
    } else {
      originAddressesGroup!.hidden = true;
    }

    if (destinations.length) {
      destinationAddressesGroup!.hidden = false;
      destinationAddressList!.innerHTML = destinations
        .map((a) => `<li class="saved-address-item"><span class="icon">${icons.flag}</span><span>${formatAddressLabel(a)}</span></li>`)
        .join('');
    } else {
      destinationAddressesGroup!.hidden = true;
    }

    addressesBlock!.hidden = !origins.length && !destinations.length;
  }

  function showLoggedIn(customer: CustomerInfo): void {
    authSection!.hidden = true;
    contentEl!.hidden = false;
    fetchOrdersByPhone(customer.phone)
      .then((orders) => renderProfile(customer, orders))
      .catch(() => renderProfile(customer, []));
  }

  function showStepPhone(): void {
    authSection!.hidden = false;
    contentEl!.hidden = true;
    phoneForm!.hidden = false;
    otpForm!.hidden = true;
    detailsForm!.hidden = true;
    phoneError!.hidden = true;
    phoneInput!.focus();
  }

  function showStepOtp(phone: string): void {
    currentPhone = phone;
    authSection!.hidden = false;
    contentEl!.hidden = true;
    phoneForm!.hidden = true;
    otpForm!.hidden = false;
    detailsForm!.hidden = true;
    otpError!.hidden = true;
    otpPhoneDisplay!.textContent = toPersianDigits(phone);

    otpHandle?.stopWebOtp();
    otpHandle = initOtpInput('profile-otp', {
      length: 5,
      onComplete: (code) => {
        void submitOtp(code);
      },
      onResend: () => {
        void handleResendOtp();
      },
    });
    otpHandle?.focusFirst();
  }

  function showStepDetails(customer: CustomerInfo): void {
    authSection!.hidden = false;
    contentEl!.hidden = true;
    phoneForm!.hidden = true;
    otpForm!.hidden = true;
    detailsForm!.hidden = false;
    detailsError!.hidden = true;

    if (customer.fullName) {
      fullNameInput!.value = customer.fullName;
    }
    if (customer.companyName && companyInput) {
      companyInput.value = customer.companyName;
    }
    if (customer.gender) {
      selectGender(customer.gender);
    } else {
      selectGender('');
    }
    if (customer.gender === 'company' || customer.gender === 'organization') {
      companyInput?.focus();
    } else {
      fullNameInput!.focus();
    }
  }

  function selectGender(gender: CustomerIdentityType | ''): void {
    genderInput!.value = gender;
    genderBtns.forEach((btn) => {
      const isSelected = btn.dataset.gender === gender;
      btn.classList.toggle('is-active', isSelected);
      btn.setAttribute('aria-checked', String(isSelected));
    });

    const isOrg = gender === 'company' || gender === 'organization';
    if (companyField) {
      companyField.hidden = !isOrg;
      if (isOrg) {
        if (companyLabel) {
          companyLabel.textContent = gender === 'company'
            ? pick('نام شرکت یا مجموعه تجاری', 'Company name')
            : pick('نام اداره یا سازمان', 'Organization name');
        }
        if (companyInput) {
          companyInput.placeholder = gender === 'company'
            ? pick('نام شرکت، فروشگاه یا برند تجاری', 'Enter company name')
            : pick('نام اداره، سازمان یا نهاد دولتی/عمومی', 'Enter organization name');
          companyInput.required = true;
        }
      } else {
        if (companyInput) {
          companyInput.required = false;
          companyInput.value = '';
        }
      }
    }

    if (fullNameLabel && fullNameInput) {
      if (isOrg) {
        fullNameLabel.textContent = pick('نام و نام خانوادگی رابط / نماینده', 'Representative full name');
        fullNameInput.placeholder = pick('نام و نام خانوادگی شخص رابط یا مسئول هماهنگی', 'Representative name');
      } else {
        fullNameLabel.textContent = pick('نام و نام خانوادگی', 'Full name');
        fullNameInput.placeholder = pick('نام و نام خانوادگی خود را وارد کنید', 'Enter your full name');
      }
    }
  }

  genderBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selected = (btn.dataset.gender ?? '') as CustomerIdentityType | '';
      selectGender(selected);
      detailsError!.hidden = true;
    });
  });

  // رویدادهای دفترچه آدرس‌ها
  if (addAddressBtn && newAddressForm) {
    addAddressBtn.addEventListener('click', () => {
      newAddressForm.hidden = !newAddressForm.hidden;
      if (!newAddressForm.hidden && addressTitleInput) {
        addressTitleInput.focus();
      }
    });
  }

  if (cancelAddressBtn && newAddressForm) {
    cancelAddressBtn.addEventListener('click', () => {
      newAddressForm.hidden = true;
      newAddressForm.reset();
      if (addressFormError) addressFormError.hidden = true;
    });
  }

  addressChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      if (addressTitleInput) {
        addressTitleInput.value = chip.dataset.chip ?? chip.textContent ?? '';
        addressTitleInput.focus();
      }
    });
  });

  if (newAddressForm) {
    newAddressForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (addressFormError) addressFormError.hidden = true;

      const title = addressTitleInput?.value.trim() ?? '';
      const city = addressCityInput?.value.trim() ?? 'تهران';
      const address = addressTextInput?.value.trim() ?? '';
      const floor = addressFloorInput?.value.trim() || undefined;
      const unit = addressUnitInput?.value.trim() || undefined;
      const hasElevator = addressElevatorInput?.checked ?? false;

      if (!title) {
        if (addressFormError) {
          addressFormError.hidden = false;
          addressFormError.textContent = pick('لطفاً عنوان آدرس را وارد کنید.', 'Please enter address title.');
        }
        return;
      }

      if (!address || address.length < 5) {
        if (addressFormError) {
          addressFormError.hidden = false;
          addressFormError.textContent = pick('لطفاً نشانی کامل را وارد کنید.', 'Please enter full address.');
        }
        return;
      }

      const saveBtn = document.getElementById('profile-save-address-btn') as HTMLButtonElement | null;
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = pick('در حال ذخیره...', 'Saving...');
      }

      addCustomerAddress({ title, city, address, floor, unit, hasElevator })
        .then(() => {
          newAddressForm.reset();
          newAddressForm.hidden = true;
          void loadAndRenderAddressBook();
        })
        .catch((err) => {
          if (addressFormError) {
            addressFormError.hidden = false;
            addressFormError.textContent = err instanceof Error ? err.message : pick('خطایی در ثبت آدرس پیش آمد.', 'Failed to add address.');
          }
        })
        .finally(() => {
          if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.textContent = pick('ذخیره آدرس', 'Save Address');
          }
        });
    });
  }

  changePhoneBtn.addEventListener('click', () => {
    otpHandle?.stopWebOtp();
    showStepPhone();
  });

  phoneForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const raw = phoneInput!.value;
    const phone = normalizeCustomerPhone(raw);
    phoneError!.hidden = true;

    if (!PHONE_RE.test(phone)) {
      phoneError!.hidden = false;
      phoneError!.textContent = pick('شماره موبایل معتبر ۱۱ رقمی وارد کنید (مثال: ۰۹۱۲۳۴۵۶۷۸۹).', 'Enter a valid 11-digit mobile number.');
      return;
    }

    phoneSubmitBtn!.disabled = true;
    phoneSubmitBtn!.textContent = pick('در حال ارسال کد...', 'Sending code...');

    sendCustomerOtp(phone)
      .then(() => {
        showStepOtp(phone);
      })
      .catch((err) => {
        phoneError!.hidden = false;
        phoneError!.textContent = err instanceof Error ? err.message : pick('خطایی در ارسال کد پیش آمد.', 'Failed to send code.');
      })
      .finally(() => {
        phoneSubmitBtn!.disabled = false;
        phoneSubmitBtn!.textContent = pick('دریافت کد تأیید', 'Send verification code');
      });
  });

  function handleResendOtp(): Promise<void> {
    otpError!.hidden = true;
    return sendCustomerOtp(currentPhone).catch((err) => {
      otpError!.hidden = false;
      otpError!.textContent = err instanceof Error ? err.message : pick('ارسال مجدد کد با خطا مواجه شد.', 'Failed to resend code.');
    });
  }

  async function submitOtp(code: string): Promise<void> {
    otpError!.hidden = true;
    otpSubmitBtn!.disabled = true;
    otpSubmitBtn!.textContent = pick('در حال بررسی...', 'Verifying...');

    try {
      const res = await verifyCustomerOtp(currentPhone, code);
      otpHandle?.stopWebOtp();
      if (res.needsProfile) {
        showStepDetails(res.customer);
      } else {
        showLoggedIn(res.customer);
      }
    } catch (err) {
      otpError!.hidden = false;
      otpError!.textContent = err instanceof Error ? err.message : pick('کد واردشده معتبر نیست.', 'Invalid code.');
      otpHandle?.reset();
    } finally {
      otpSubmitBtn!.disabled = false;
      otpSubmitBtn!.textContent = pick('تأیید و ادامه', 'Verify and continue');
    }
  }

  otpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = otpHandle?.getCode() ?? '';
    if (code.length !== 5) {
      otpError!.hidden = false;
      otpError!.textContent = pick('لطفاً کد ۵ رقمی را کامل وارد کنید.', 'Please enter the full 5-digit code.');
      return;
    }
    void submitOtp(code);
  });

  detailsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    detailsError!.hidden = true;
    const gender = genderInput!.value as CustomerIdentityType;
    const fullName = fullNameInput!.value.trim();
    const companyName = companyInput?.value.trim() || undefined;

    const validGenders = ['female', 'male', 'company', 'organization'];
    if (!gender || !validGenders.includes(gender)) {
      detailsError!.hidden = false;
      detailsError!.textContent = pick('لطفاً نوع حساب کاربری را انتخاب کنید.', 'Please select account type.');
      return;
    }

    if ((gender === 'company' || gender === 'organization') && !companyName) {
      detailsError!.hidden = false;
      detailsError!.textContent = gender === 'company'
        ? pick('لطفاً نام شرکت را وارد کنید.', 'Please enter company name.')
        : pick('لطفاً نام اداره یا سازمان را وارد کنید.', 'Please enter organization name.');
      return;
    }

    if (!fullName || fullName.length < 2) {
      detailsError!.hidden = false;
      detailsError!.textContent = pick('لطفاً نام و نام خانوادگی را وارد کنید.', 'Please enter full name.');
      return;
    }

    detailsSubmitBtn!.disabled = true;
    detailsSubmitBtn!.textContent = pick('در حال ثبت...', 'Saving...');

    updateCustomerProfile(fullName, gender, companyName)
      .then((updated) => {
        showLoggedIn(updated);
      })
      .catch((err) => {
        detailsError!.hidden = false;
        detailsError!.textContent = err instanceof Error ? err.message : pick('خطایی در ثبت اطلاعات رخ داد.', 'Failed to save profile.');
      })
      .finally(() => {
        detailsSubmitBtn!.disabled = false;
        detailsSubmitBtn!.textContent = pick('تکمیل و ورود به حساب', 'Complete & Enter');
      });
  });

  logoutBtn.addEventListener('click', () => {
    logoutCustomer().finally(() => {
      showStepPhone();
      phoneForm!.reset();
      otpForm!.reset();
      detailsForm!.reset();
      selectGender('');
    });
  });

  fetchCurrentCustomer()
    .then((customer) => {
      if (customer) {
        if (!customer.fullName || !customer.gender) {
          showStepDetails(customer);
        } else {
          showLoggedIn(customer);
        }
      } else {
        showStepPhone();
      }
    })
    .catch(() => showStepPhone());
}

bootstrapI18n(() => void init());

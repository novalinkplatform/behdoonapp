import { icons } from '../components/icons.ts';
import { pick } from '../i18n/lang.ts';
import { renderOtpInputMarkup } from '../components/OtpInput.ts';

export function renderProfileView(): string {
  return `
    <article class="orders-page">
      <div class="container orders-container">
        <nav class="article-breadcrumb" aria-label="${pick('مسیر صفحه', 'Breadcrumb')}">
          <a href="/">${pick('خانه', 'Home')}</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">${pick('حساب کاربری', 'Account')}</span>
        </nav>

        <h1 class="article-title">${pick('حساب کاربری', 'Account')}</h1>

        <div id="profile-auth-section">
          <!-- گام ۱: شماره موبایل (ورود و ثبت‌نام یکپارچه) -->
          <form class="profile-auth-form" id="profile-phone-form">
            <div class="profile-auth-header">
              <div class="profile-auth-badge"><span class="icon">${icons.user}</span></div>
              <h2 class="profile-auth-title">${pick('ورود یا ثبت‌نام در بهدون', 'Log in or Sign up to Behdoon')}</h2>
              <p class="profile-auth-subtitle">${pick(
                'شماره موبایل خود را وارد کنید تا کد تأیید پیامک شود.',
                'Enter your mobile number to receive a verification code.'
              )}</p>
            </div>

            <div class="form-field">
              <label for="profile-phone-input">${pick('شماره موبایل', 'Mobile number')}</label>
              <div class="input-wrapper">
                <span class="icon input-icon">${icons.phone}</span>
                <input type="tel" id="profile-phone-input" dir="ltr" placeholder="${pick('۰۹xxxxxxxxx', '09xxxxxxxxx')}" inputmode="numeric" autocomplete="tel" required />
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-block" id="profile-phone-submit-btn">
              <span>${pick('دریافت کد تأیید', 'Send verification code')}</span>
            </button>

            <p class="request-panel-error" id="profile-phone-error" hidden></p>
          </form>

          <!-- گام ۲: کد تأیید پیامک -->
          <form class="profile-auth-form" id="profile-otp-form" hidden>
            <div class="profile-auth-header">
              <div class="profile-auth-badge"><span class="icon">${icons.shield}</span></div>
              <h2 class="profile-auth-title">${pick('کد تأیید پیامکی', 'Verification Code')}</h2>
              <div class="profile-otp-phone-row">
                <span>${pick('کد تأیید به شماره', 'Code sent to')}</span>
                <strong id="profile-otp-phone-display" dir="ltr"></strong>
                <button type="button" class="profile-edit-phone-btn" id="profile-change-phone-btn">${pick('ویرایش شماره', 'Edit')}</button>
              </div>
            </div>

            <div class="form-field otp-center-field">
              ${renderOtpInputMarkup('profile-otp', 5)}
            </div>

            <button type="submit" class="btn btn-primary btn-block" id="profile-otp-submit-btn">
              <span>${pick('تأیید و ادامه', 'Verify and continue')}</span>
            </button>

            <p class="request-panel-error" id="profile-otp-error" hidden></p>
          </form>

          <!-- گام ۳: انتخاب هویت و مشخصات حساب (آقا، خانم، شرکتی، اداری و سازمانی) -->
          <form class="profile-auth-form" id="profile-details-form" hidden>
            <div class="profile-auth-header">
              <div class="profile-auth-badge"><span class="icon">${icons.badge}</span></div>
              <h2 class="profile-auth-title">${pick('تکمیل اطلاعات حساب', 'Complete Profile')}</h2>
              <p class="profile-auth-subtitle">${pick(
                'لطفاً نوع حساب و مشخصات خود را برای ورود مشخص کنید.',
                'Please select your account type and enter your details.'
              )}</p>
            </div>

            <!-- انتخاب هویت و ماهیت حساب -->
            <div class="form-field">
              <label class="form-field-label">${pick('نوع حساب / هویت', 'Account Type / Identity')}</label>
              <div class="profile-gender-picker profile-identity-picker" role="radiogroup" aria-label="${pick('انتخاب نوع حساب', 'Account type selection')}">
                <button type="button" class="profile-gender-btn" data-gender="female" role="radio" aria-checked="false">
                  <span class="profile-gender-icon">${icons.female}</span>
                  <span class="profile-gender-text">${pick('خانم', 'Female')}</span>
                  <span class="profile-gender-check">${icons.checkCircle}</span>
                </button>
                <button type="button" class="profile-gender-btn" data-gender="male" role="radio" aria-checked="false">
                  <span class="profile-gender-icon">${icons.male}</span>
                  <span class="profile-gender-text">${pick('آقا', 'Male')}</span>
                  <span class="profile-gender-check">${icons.checkCircle}</span>
                </button>
                <button type="button" class="profile-gender-btn" data-gender="company" role="radio" aria-checked="false">
                  <span class="profile-gender-icon">${icons.building}</span>
                  <span class="profile-gender-text">${pick('شرکتی', 'Company')}</span>
                  <span class="profile-gender-check">${icons.checkCircle}</span>
                </button>
                <button type="button" class="profile-gender-btn" data-gender="organization" role="radio" aria-checked="false">
                  <span class="profile-gender-icon">${icons.organization}</span>
                  <span class="profile-gender-text">${pick('اداری و سازمانی', 'Organization')}</span>
                  <span class="profile-gender-check">${icons.checkCircle}</span>
                </button>
              </div>
              <input type="hidden" id="profile-gender-input" value="" />
            </div>

            <!-- نام شرکت یا سازمان (ویژه اشخاص حقوقی) -->
            <div class="form-field" id="profile-company-field" hidden>
              <label for="profile-company-input" id="profile-company-label">${pick('نام شرکت / سازمان', 'Company / Organization name')}</label>
              <div class="input-wrapper">
                <span class="icon input-icon" id="profile-company-icon">${icons.building}</span>
                <input type="text" id="profile-company-input" placeholder="${pick('نام کامل شرکت، اداره یا سازمان', 'Enter company/organization name')}" />
              </div>
            </div>

            <!-- نام و نام خانوادگی / نام رابط -->
            <div class="form-field">
              <label for="profile-fullname-input" id="profile-fullname-label">${pick('نام و نام خانوادگی', 'Full name')}</label>
              <div class="input-wrapper">
                <span class="icon input-icon">${icons.user}</span>
                <input type="text" id="profile-fullname-input" autocomplete="name" placeholder="${pick('نام و نام خانوادگی خود را وارد کنید', 'Enter your full name')}" required />
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-block" id="profile-details-submit-btn">
              <span>${pick('تکمیل و ورود به حساب', 'Complete & Enter')}</span>
            </button>

            <p class="request-panel-error" id="profile-details-error" hidden></p>
          </form>
        </div>

        <div class="orders-content" id="profile-page-content" hidden>
          <section class="orders-block">
            <h2>${pick('اطلاعات حساب', 'Account information')}</h2>
            <div class="orders-profile-card" id="profile-info-card"></div>
          </section>

          <!-- دفترچه آدرس‌ها -->
          <section class="orders-block" id="profile-addressbook-block">
            <div class="profile-section-header">
              <div>
                <h2>${pick('دفترچه آدرس‌ها', 'Address Book')}</h2>
                <p class="profile-section-sub">${pick('آدرس‌های منتخب برای استفاده در سفارش‌ها', 'Saved addresses for quick selection')}</p>
              </div>
              <button type="button" class="btn btn-secondary btn-sm" id="profile-add-address-btn">
                <span class="icon">${icons.plus}</span>
                <span>${pick('افزودن آدرس جدید', 'Add New Address')}</span>
              </button>
            </div>

            <!-- فرم درج آدرس جدید -->
            <form class="profile-new-address-form" id="profile-new-address-form" hidden>
              <h3 class="profile-form-inner-title">${pick('ثبت آدرس جدید', 'New Address')}</h3>

              <div class="form-field">
                <label class="form-field-label">${pick('عنوان آدرس', 'Address Title')}</label>
                <div class="profile-address-chips" id="profile-address-chips">
                  <button type="button" class="profile-chip" data-chip="${pick('منزل', 'Home')}">${pick('منزل', 'Home')}</button>
                  <button type="button" class="profile-chip" data-chip="${pick('محل کار', 'Work')}">${pick('محل کار', 'Work')}</button>
                  <button type="button" class="profile-chip" data-chip="${pick('دفتر مرکزی', 'Headquarters')}">${pick('دفتر مرکزی', 'Headquarters')}</button>
                  <button type="button" class="profile-chip" data-chip="${pick('انبار', 'Warehouse')}">${pick('انبار', 'Warehouse')}</button>
                  <button type="button" class="profile-chip" data-chip="${pick('شعبه', 'Branch')}">${pick('شعبه', 'Branch')}</button>
                </div>
                <div class="input-wrapper" style="margin-top: 8px;">
                  <span class="icon input-icon">${icons.pin}</span>
                  <input type="text" id="profile-address-title-input" placeholder="${pick('عنوان دلخواه (مثلاً: منزل، شرکت یا انبار)', 'Title (e.g. Home, Office, Warehouse)')}" required />
                </div>
              </div>

              <div class="profile-address-fields-row">
                <div class="form-field profile-city-col">
                  <label for="profile-address-city-input">${pick('شهر', 'City')}</label>
                  <div class="input-wrapper">
                    <input type="text" id="profile-address-city-input" value="تهران" required />
                  </div>
                </div>
                <div class="form-field profile-address-col">
                  <label for="profile-address-text-input">${pick('نشانی دقیق', 'Full Address')}</label>
                  <div class="input-wrapper">
                    <input type="text" id="profile-address-text-input" placeholder="${pick('خیابان، کوچه، پلاک...', 'Street, alley, building number...')}" required />
                  </div>
                </div>
              </div>

              <div class="profile-address-meta-row">
                <div class="form-field">
                  <label for="profile-address-floor-input">${pick('طبقه', 'Floor')}</label>
                  <div class="input-wrapper">
                    <input type="text" id="profile-address-floor-input" placeholder="${pick('مثلاً ۲', 'e.g. 2')}" />
                  </div>
                </div>
                <div class="form-field">
                  <label for="profile-address-unit-input">${pick('واحد', 'Unit')}</label>
                  <div class="input-wrapper">
                    <input type="text" id="profile-address-unit-input" placeholder="${pick('مثلاً ۴', 'e.g. 4')}" />
                  </div>
                </div>
                <div class="form-field profile-elevator-col">
                  <label class="form-field-label">${pick('آسانسور', 'Elevator')}</label>
                  <label class="profile-checkbox-wrap">
                    <input type="checkbox" id="profile-address-elevator-input" />
                    <span>${pick('آسانسور دارد', 'Has elevator')}</span>
                  </label>
                </div>
              </div>

              <div class="profile-address-actions">
                <button type="submit" class="btn btn-primary btn-sm" id="profile-save-address-btn">
                  <span>${pick('ذخیره آدرس', 'Save Address')}</span>
                </button>
                <button type="button" class="btn btn-secondary btn-sm" id="profile-cancel-address-btn">
                  <span>${pick('انصراف', 'Cancel')}</span>
                </button>
              </div>
              <p class="request-panel-error" id="profile-address-form-error" hidden></p>
            </form>

            <div class="profile-addresses-grid" id="profile-addresses-grid">
              <div class="profile-addresses-empty" id="profile-addresses-empty">
                <span class="icon">${icons.pin}</span>
                <p>${pick('هنوز هیچ آدرسی ثبت نکرده‌اید. با زدن دکمه «افزودن آدرس جدید» اولین آدرس خود را ذخیره کنید.', 'No saved addresses yet.')}</p>
              </div>
            </div>
          </section>

          <section class="orders-block" id="profile-addresses-block" hidden>
            <h2>${pick('آدرس‌های سفارش‌های قبلی', 'Previous orders addresses')}</h2>
            <div class="saved-address-groups">
              <div class="saved-address-group" id="profile-origin-addresses" hidden>
                <h3 class="saved-address-group-title"><span class="icon">${icons.pin}</span>${pick('آدرس‌های محل خدمت در تهران', 'Service locations in Tehran')}</h3>
                <ul class="saved-address-list" id="profile-origin-address-list"></ul>
              </div>
            </div>
          </section>

          <button type="button" class="btn btn-secondary btn-block" id="profile-logout-btn">
            <span class="icon">${icons.logout}</span>
            <span>${pick('خروج از حساب', 'Log out')}</span>
          </button>
        </div>
      </div>
    </article>
  `;
}

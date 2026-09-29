import { icons } from '../components/icons.ts';
import { pick } from '../i18n/lang.ts';
import { renderOtpInputMarkup } from '../components/OtpInput.ts';
import { renderThemeToggle } from '../components/ThemeToggle.ts';
import { renderLangToggle } from '../components/LangToggle.ts';

export function renderProfileView(): string {
  return `
    <article class="orders-page profile-page">
      <div class="container orders-container">
        <!-- Breadcrumbs -->
        <nav class="article-breadcrumb" aria-label="${pick('مسیر صفحه', 'Breadcrumb')}">
          <a href="/">${pick('خانه', 'Home')}</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">${pick('حساب کاربری', 'Account')}</span>
        </nav>

        <!-- بخش احراز هویت برای کاربران مهمان -->
        <div id="profile-auth-section">
          <!-- گام ۱: شماره موبایل -->
          <form class="profile-auth-form" id="profile-phone-form">
            <div class="profile-auth-header">
              <div class="profile-auth-badge"><span class="icon">${icons.user}</span></div>
              <h1 class="profile-auth-title">${pick('ورود به حساب کاربری بهدون', 'Log in to Behdoon')}</h1>
              <p class="profile-auth-subtitle">${pick(
                'شماره موبایل خود را وارد کنید تا کد تأیید ۵ رقمی پیامک شود.',
                'Enter your mobile number to receive a 5-digit verification code.'
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
              <span>${pick('دریافت کد تأیید پیامکی', 'Send SMS verification code')}</span>
            </button>

            <p class="request-panel-error" id="profile-phone-error" hidden></p>
          </form>

          <!-- گام ۲: کد تأیید پیامک -->
          <form class="profile-auth-form" id="profile-otp-form" hidden>
            <div class="profile-auth-header">
              <div class="profile-auth-badge"><span class="icon">${icons.shield}</span></div>
              <h2 class="profile-auth-title">${pick('کد تأیید پیامکی', 'SMS Verification Code')}</h2>
              <div class="profile-otp-phone-row">
                <span>${pick('کد تأیید ۵ رقمی به شماره', '5-digit code sent to')}</span>
                <strong id="profile-otp-phone-display" dir="ltr"></strong>
                <button type="button" class="profile-edit-phone-btn" id="profile-change-phone-btn">${pick('ویرایش شماره', 'Edit')}</button>
              </div>
            </div>

            <div class="form-field otp-center-field">
              ${renderOtpInputMarkup('profile-otp', 5)}
            </div>

            <button type="submit" class="btn btn-primary btn-block" id="profile-otp-submit-btn">
              <span>${pick('بررسی کد و ورود', 'Verify & Enter')}</span>
            </button>

            <p class="request-panel-error" id="profile-otp-error" hidden></p>
          </form>

          <!-- گام ۳: مشخصات تکمیلی برای کاربران جدید -->
          <form class="profile-auth-form" id="profile-details-form" hidden>
            <div class="profile-auth-header">
              <div class="profile-auth-badge"><span class="icon">${icons.badge}</span></div>
              <h2 class="profile-auth-title">${pick('تکمیل اطلاعات حساب', 'Complete Profile')}</h2>
              <p class="profile-auth-subtitle">${pick(
                'لطفاً نوع حساب و مشخصات خود را جهت ثبت در سامانه مشخص کنید.',
                'Please select your account type and enter your details.'
              )}</p>
            </div>

            <div class="form-field">
              <label class="form-field-label">${pick('نوع حساب / هویت', 'Account Type / Identity')}</label>
              <div class="profile-gender-picker profile-identity-picker" role="radiogroup">
                <button type="button" class="profile-gender-btn is-active" data-gender="female" role="radio" aria-checked="false">
                  <span class="profile-gender-icon">${icons.female}</span>
                  <span class="profile-gender-text">${pick('خانم', 'Female')}</span>
                </button>
                <button type="button" class="profile-gender-btn" data-gender="male" role="radio" aria-checked="false">
                  <span class="profile-gender-icon">${icons.male}</span>
                  <span class="profile-gender-text">${pick('آقا', 'Male')}</span>
                </button>
                <button type="button" class="profile-gender-btn" data-gender="company" role="radio" aria-checked="false">
                  <span class="profile-gender-icon">${icons.building}</span>
                  <span class="profile-gender-text">${pick('شرکتی', 'Company')}</span>
                </button>
                <button type="button" class="profile-gender-btn" data-gender="organization" role="radio" aria-checked="false">
                  <span class="profile-gender-icon">${icons.organization}</span>
                  <span class="profile-gender-text">${pick('اداری و سازمانی', 'Organization')}</span>
                </button>
              </div>
              <input type="hidden" id="profile-gender-input" value="male" />
            </div>

            <div class="form-field" id="profile-company-field" hidden>
              <label for="profile-company-input" id="profile-company-label">${pick('نام شرکت / سازمان', 'Company / Organization name')}</label>
              <div class="input-wrapper">
                <span class="icon input-icon">${icons.building}</span>
                <input type="text" id="profile-company-input" placeholder="${pick('نام کامل شرکت یا نهاد تجاری', 'Enter company name')}" />
              </div>
            </div>

            <div class="form-field">
              <label for="profile-fullname-input" id="profile-fullname-label">${pick('نام و نام خانوادگی', 'Full name')}</label>
              <div class="input-wrapper">
                <span class="icon input-icon">${icons.user}</span>
                <input type="text" id="profile-fullname-input" autocomplete="name" placeholder="${pick('نام و نام خانوادگی خود را وارد کنید', 'Enter your full name')}" required />
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-block" id="profile-details-submit-btn">
              <span>${pick('ورود به داشبورد حساب', 'Enter Profile Dashboard')}</span>
            </button>

            <p class="request-panel-error" id="profile-details-error" hidden></p>
          </form>
        </div>

        <!-- پنل جامع و حرفه‌ای پروفایل (ویژه کاربر وارد شده) -->
        <div class="profile-dashboard" id="profile-page-content" hidden>
          
          <!-- ۱. هدر کاربری پروفایل (User Hero Card) -->
          <div class="profile-hero-card">
            <div class="profile-hero-main">
              <div class="profile-hero-avatar" id="profile-hero-avatar">
                <span class="icon">${icons.user}</span>
              </div>
              <div class="profile-hero-info">
                <div class="profile-hero-name-row">
                  <h1 class="profile-hero-name" id="profile-hero-name">${pick('کاربر گرامی بهدون', 'Valued Customer')}</h1>
                  <span class="profile-hero-identity-badge" id="profile-hero-identity"></span>
                </div>
                <div class="profile-hero-meta-row">
                  <span class="badge-verified"><span class="icon">${icons.shield}</span> ${pick('شماره تأیید شده', 'Verified')}</span>
                  <span class="profile-hero-phone" id="profile-hero-phone" dir="ltr"></span>
                  <span class="profile-hero-date" id="profile-hero-date"></span>
                </div>
              </div>
            </div>
            <div class="profile-hero-actions">
              <a href="/#request" class="btn btn-primary btn-sm">
                <span class="icon">${icons.plusCircle}</span>
                <span>${pick('ثبت درخواست جدید', 'New Request')}</span>
              </a>
              <button type="button" class="btn btn-ghost btn-sm btn-logout" id="profile-logout-btn" title="${pick('خروج از حساب', 'Log out')}">
                <span class="icon">${icons.logout}</span>
                <span>${pick('خروج', 'Log out')}</span>
              </button>
            </div>
          </div>

          <!-- ۲. تب‌های بخش‌بندی شده موبایل و دسکتاپ (Segmented Tabs) -->
          <div class="profile-segmented-nav" role="tablist">
            <button type="button" class="profile-seg-tab is-active" data-profile-tab="history" role="tab" aria-selected="true">
              <span class="icon">${icons.box}</span>
              <span>${pick('سوابق درخواست‌ها', 'Order History')}</span>
              <span class="profile-tab-badge" id="profile-orders-count-badge">۰</span>
            </button>
            <button type="button" class="profile-seg-tab" data-profile-tab="addresses" role="tab" aria-selected="false">
              <span class="icon">${icons.pin}</span>
              <span>${pick('دفترچه آدرس‌ها', 'Addresses')}</span>
              <span class="profile-tab-badge" id="profile-address-count-badge">۰</span>
            </button>
            <button type="button" class="profile-seg-tab" data-profile-tab="edit" role="tab" aria-selected="false">
              <span class="icon">${icons.user}</span>
              <span>${pick('ویرایش پروفایل', 'Edit Profile')}</span>
            </button>
            <button type="button" class="profile-seg-tab" data-profile-tab="settings" role="tab" aria-selected="false">
              <span class="icon">${icons.shield || icons.layers}</span>
              <span>${pick('تنظیمات و امنیت', 'Settings')}</span>
            </button>
          </div>

          <!-- ۳. محتوای تب‌ها -->

          <!-- تب ۱: سوابق درخواست‌ها -->
          <section class="profile-tab-panel is-active" id="profile-panel-history" role="tabpanel">
            <div class="profile-panel-heading">
              <div>
                <h2>${pick('سوابق و وضعیت خدمات شما', 'Your Service History')}</h2>
                <p>${pick('مشاهده سفارش‌های فعال، اعزام تکنسین، فاکتورها و جزئیات خدمات', 'Active requests, technician dispatch, invoices and details')}</p>
              </div>
              <a href="/orders" class="btn btn-secondary btn-sm">
                <span class="icon">${icons.box}</span>
                <span>${pick('مدیریت کامل در صفحه درخواست‌ها', 'Full Orders View')}</span>
              </a>
            </div>

            <!-- لیست سفارشات کاربر -->
            <div class="profile-orders-list" id="profile-orders-list">
              <!-- Rendered via JS -->
            </div>
          </section>

          <!-- تب ۲: دفترچه آدرس‌ها -->
          <section class="profile-tab-panel" id="profile-panel-addresses" role="tabpanel" hidden>
            <div class="profile-panel-heading">
              <div>
                <h2>${pick('دفترچه آدرس‌های منتخب', 'Saved Address Book')}</h2>
                <p>${pick('آدرس‌های منزل، محل کار یا شرکت برای انتخاب سریع در ثبت سفارش', 'Saved addresses for quick selection during service requests')}</p>
              </div>
              <button type="button" class="btn btn-primary btn-sm" id="profile-add-address-btn">
                <span class="icon">${icons.plus}</span>
                <span>${pick('افزودن آدرس جدید', 'Add New Address')}</span>
              </button>
            </div>

            <!-- فرم ثبت آدرس جدید -->
            <form class="profile-new-address-form" id="profile-new-address-form" hidden>
              <h3 class="profile-form-inner-title">${pick('ثبت آدرس جدید در تهران', 'New Address in Tehran')}</h3>

              <div class="form-field">
                <label class="form-field-label">${pick('عنوان آدرس (انتخاب سریع یا تایپ دلخواه)', 'Address Title')}</label>
                <div class="profile-address-chips" id="profile-address-chips">
                  <button type="button" class="profile-chip" data-chip="${pick('منزل', 'Home')}">${pick('منزل', 'Home')}</button>
                  <button type="button" class="profile-chip" data-chip="${pick('محل کار', 'Work')}">${pick('محل کار', 'Work')}</button>
                  <button type="button" class="profile-chip" data-chip="${pick('شرکت', 'Company')}">${pick('شرکت', 'Company')}</button>
                  <button type="button" class="profile-chip" data-chip="${pick('انبار', 'Warehouse')}">${pick('انبار', 'Warehouse')}</button>
                  <button type="button" class="profile-chip" data-chip="${pick('شعبه', 'Branch')}">${pick('شعبه', 'Branch')}</button>
                </div>
                <div class="input-wrapper" style="margin-top: 8px;">
                  <span class="icon input-icon">${icons.pin}</span>
                  <input type="text" id="profile-address-title-input" placeholder="${pick('مثال: منزل پدری، دفتر سعادت‌آباد...', 'e.g. Home, Office...')}" required />
                </div>
              </div>

              <div class="profile-address-fields-row">
                <div class="form-field profile-city-col">
                  <label for="profile-address-city-input">${pick('شهر', 'City')}</label>
                  <div class="input-wrapper">
                    <input type="text" id="profile-address-city-input" value="تهران" required readonly />
                  </div>
                </div>
                <div class="form-field profile-address-col">
                  <label for="profile-address-text-input">${pick('نشانی دقیق پستی', 'Full Address')}</label>
                  <div class="input-wrapper">
                    <input type="text" id="profile-address-text-input" placeholder="${pick('خیابان، کوچه، پلاک، واحد...', 'Street, alley, building number, unit...')}" required />
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
                    <span>${pick('ساختمان آسانسور دارد', 'Building has elevator')}</span>
                  </label>
                </div>
              </div>

              <div class="profile-address-actions">
                <button type="submit" class="btn btn-primary btn-sm" id="profile-save-address-btn">
                  <span>${pick('ذخیره در دفترچه آدرس‌ها', 'Save Address')}</span>
                </button>
                <button type="button" class="btn btn-secondary btn-sm" id="profile-cancel-address-btn">
                  <span>${pick('انصراف', 'Cancel')}</span>
                </button>
              </div>
              <p class="request-panel-error" id="profile-address-form-error" hidden></p>
            </form>

            <div class="profile-addresses-grid" id="profile-addresses-grid">
              <!-- Rendered via JS -->
            </div>
          </section>

          <!-- تب ۳: ویرایش پروفایل -->
          <section class="profile-tab-panel" id="profile-panel-edit" role="tabpanel" hidden>
            <div class="profile-panel-heading">
              <div>
                <h2>${pick('ویرایش اطلاعات و مشخصات کاربری', 'Edit Profile Information')}</h2>
                <p>${pick('به‌روزرسانی نام و نوع حساب کاربری جهت صدور فاکتورها و هماهنگی تکنسین', 'Update name and account identity for invoices and technician coordination')}</p>
              </div>
            </div>

            <form class="profile-edit-form" id="profile-edit-form">
              <div class="form-field">
                <label class="form-field-label">${pick('نوع حساب کاربری / ماهیت', 'Account Type / Identity')}</label>
                <div class="profile-gender-picker profile-identity-picker" id="profile-edit-gender-picker" role="radiogroup">
                  <button type="button" class="profile-gender-btn" data-gender="female" role="radio">
                    <span class="profile-gender-icon">${icons.female}</span>
                    <span class="profile-gender-text">${pick('خانم', 'Female')}</span>
                  </button>
                  <button type="button" class="profile-gender-btn" data-gender="male" role="radio">
                    <span class="profile-gender-icon">${icons.male}</span>
                    <span class="profile-gender-text">${pick('آقا', 'Male')}</span>
                  </button>
                  <button type="button" class="profile-gender-btn" data-gender="company" role="radio">
                    <span class="profile-gender-icon">${icons.building}</span>
                    <span class="profile-gender-text">${pick('شرکتی', 'Company')}</span>
                  </button>
                  <button type="button" class="profile-gender-btn" data-gender="organization" role="radio">
                    <span class="profile-gender-icon">${icons.organization}</span>
                    <span class="profile-gender-text">${pick('اداری و سازمانی', 'Organization')}</span>
                  </button>
                </div>
                <input type="hidden" id="profile-edit-gender-input" value="male" />
              </div>

              <div class="form-field" id="profile-edit-company-field" hidden>
                <label for="profile-edit-company-input">${pick('نام شرکت، فروشگاه یا نهاد سازمانی', 'Company / Organization name')}</label>
                <div class="input-wrapper">
                  <span class="icon input-icon">${icons.building}</span>
                  <input type="text" id="profile-edit-company-input" placeholder="${pick('نام رسمی مجموعه یا برند تجاری', 'Company / Brand name')}" />
                </div>
              </div>

              <div class="form-field">
                <label for="profile-edit-name-input" id="profile-edit-name-label">${pick('نام و نام خانوادگی', 'Full name')}</label>
                <div class="input-wrapper">
                  <span class="icon input-icon">${icons.user}</span>
                  <input type="text" id="profile-edit-name-input" required />
                </div>
              </div>

              <div class="form-field">
                <label>${pick('شماره همراه (تأیید شده با پیامک)', 'Verified Mobile Number')}</label>
                <div class="input-wrapper disabled-field">
                  <span class="icon input-icon">${icons.phone}</span>
                  <input type="text" id="profile-edit-phone-input" dir="ltr" readonly disabled />
                  <span class="badge-verified-inline"><span class="icon">${icons.checkCircle || icons.shield}</span> ${pick('تأیید شده', 'Verified')}</span>
                </div>
                <span class="form-hint">${pick('شماره همراه کلید امنیتی حساب کاربری شماست و امکان تغییر مستقیم آن وجود ندارد.', 'Mobile number is your security key and cannot be changed directly.')}</span>
              </div>

              <div class="profile-edit-actions">
                <button type="submit" class="btn btn-primary" id="profile-save-profile-btn">
                  <span>${pick('ذخیره تغییرات پروفایل', 'Save Profile Changes')}</span>
                </button>
              </div>

              <p class="request-panel-error" id="profile-edit-error" hidden></p>
              <div class="profile-success-banner" id="profile-edit-success" hidden>
                <span class="icon">${icons.checkCircle || icons.shield}</span>
                <span>${pick('اطلاعات کاربری شما با موفقیت ذخیره و به‌روزرسانی شد.', 'Profile updated successfully.')}</span>
              </div>
            </form>
          </section>

          <!-- تب ۴: تنظیمات و امنیت -->
          <section class="profile-tab-panel" id="profile-panel-settings" role="tabpanel" hidden>
            <div class="profile-panel-heading">
              <div>
                <h2>${pick('تنظیمات، پشتیبانی و امنیت', 'Settings, Support & Security')}</h2>
                <p>${pick('شخصی‌سازی رابط کاربری، تماس شبانه‌روزی با کارشناسان و خروج امن', 'Personalization, 24/7 support and secure logout')}</p>
              </div>
            </div>

            <div class="profile-settings-grid">
              
              <!-- حالت پوسته -->
              <div class="profile-setting-item">
                <div class="profile-setting-meta">
                  <span class="icon">${icons.layers || icons.bolt}</span>
                  <div>
                    <strong>${pick('حالت نمایش (تاریک / روشن)', 'Theme Mode')}</strong>
                    <span>${pick('انتخاب تم تیره برای مطالعه در شب یا تم روشن', 'Switch dark or light mode')}</span>
                  </div>
                </div>
                <div class="profile-setting-control">
                  ${renderThemeToggle('profile-theme-toggle')}
                </div>
              </div>

              <!-- زبان سامانه -->
              <div class="profile-setting-item">
                <div class="profile-setting-meta">
                  <span class="icon">${icons.globe}</span>
                  <div>
                    <strong>${pick('زبان سامانه', 'System Language')}</strong>
                    <span>${pick('فارسی / English', 'Persian or English')}</span>
                  </div>
                </div>
                <div class="profile-setting-control">
                  ${renderLangToggle('profile-lang-toggle')}
                </div>
              </div>

              <!-- اعلانات پیامکی -->
              <div class="profile-setting-item">
                <div class="profile-setting-meta">
                  <span class="icon">${icons.shield}</span>
                  <div>
                    <strong>${pick('اعلانات پیامکی وضعیت خدمت', 'SMS Notifications')}</strong>
                    <span>${pick('ارسال خودکار پیامک زمان اعزام و کد رهگیری', 'Automated SMS updates for dispatched orders')}</span>
                  </div>
                </div>
                <div class="profile-setting-control">
                  <span class="badge-verified">${pick('همواره فعال', 'Always active')}</span>
                </div>
              </div>

              <!-- تماس شبانه‌روزی -->
              <a href="tel:09333256885" class="profile-setting-item is-link">
                <div class="profile-setting-meta">
                  <span class="icon" style="color: #16a34a;">${icons.phone}</span>
                  <div>
                    <strong>${pick('تماس مستقیم با پشتیبانی ۲۴ ساعته', '24/7 Telephone Support')}</strong>
                    <span dir="ltr">۰۹۳۳-۳۲۵-۶۸۸۵</span>
                  </div>
                </div>
                <span class="btn btn-secondary btn-sm">${pick('تماس', 'Call')}</span>
              </a>

              <!-- قوانین و ضمانت ۳۰ روزه -->
              <a href="/terms" class="profile-setting-item is-link">
                <div class="profile-setting-meta">
                  <span class="icon">${icons.shield}</span>
                  <div>
                    <strong>${pick('قوانین، مقررات و ضمانت‌نامه خدمات', 'Terms & 30-Day Warranty')}</strong>
                    <span>${pick('ضمانت کتبی کیفیت، تعرفه‌ها و تعهدات اجرایی بهدون', 'Quality warranty & service policy')}</span>
                  </div>
                </div>
                <span class="icon">${icons.chevronLeft}</span>
              </a>

              <!-- خروج امن از حساب -->
              <div class="profile-setting-item profile-logout-card">
                <div class="profile-setting-meta">
                  <span class="icon text-danger">${icons.logout}</span>
                  <div>
                    <strong class="text-danger">${pick('خروج از حساب کاربری', 'Log out of Account')}</strong>
                    <span>${pick('پاکسازی نشست و خروج امن از دستگاه فعلی', 'Clear session and securely log out')}</span>
                  </div>
                </div>
                <button type="button" class="btn btn-ghost btn-sm text-danger" id="profile-settings-logout-btn">
                  <span>${pick('خروج امن', 'Log out')}</span>
                </button>
              </div>

            </div>
          </section>

        </div>
      </div>
    </article>
  `;
}

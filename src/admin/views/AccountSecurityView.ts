import { getStaff } from '../utils/auth.ts';
import { setupSmsTwoFactor, confirmSmsTwoFactor, disableTwoFactor, changePassword } from '../utils/api.ts';
import { renderOtpInputMarkup, initOtpInput } from '../components/OtpInput.ts';
import { showToast } from '../utils/toast.ts';

// این صفحه خودسرویس است — هر کارمند فقط روی حساب خودش کار می‌کند (تغییر رمز عبور و ورود دومرحله‌ای)
export function renderAccountSecurityView(): string {
  const staff = getStaff();
  const enabled = staff?.twoFactorEnabled ?? false;

  return `
    <div class="settings-view">
      <div class="settings-panel">
        <h2>امنیت حساب و گذرواژه</h2>
        <p class="settings-panel-hint">مدیریت رمز عبور حساب کاربری و تنظیمات امنیتی ورود دو مرحله‌ای</p>

        <!-- Change Password Card -->
        <div class="editor-sidebar-card" id="account-security-password-card" style="margin-bottom: var(--space-4);">
          <h3 style="margin-top: 0; font-size: 1.05rem; font-weight: 700;">تغییر رمز عبور</h3>
          <p class="settings-panel-hint">رمز عبور جدید باید حداقل ۶ کاراکتر و شامل حروف و ارقام باشد.</p>

          <form id="account-security-change-pwd-form" style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 440px;">
            <div class="form-field">
              <label for="pwd-current">رمز عبور فعلی</label>
              <input type="password" id="pwd-current" autocomplete="current-password" placeholder="رمز عبور فعلی خود را وارد کنید" />
            </div>

            <div class="form-field">
              <label for="pwd-new">رمز عبور جدید</label>
              <input type="password" id="pwd-new" autocomplete="new-password" required minlength="6" placeholder="حداقل ۶ کاراکتر" />
            </div>

            <div class="form-field">
              <label for="pwd-confirm">تکرار رمز عبور جدید</label>
              <input type="password" id="pwd-confirm" autocomplete="new-password" required minlength="6" placeholder="تکرار رمز عبور جدید" />
            </div>

            <p class="error-text" id="pwd-change-error" hidden></p>

            <div>
              <button type="submit" class="btn btn-primary" id="pwd-change-submit-btn">ذخیره و تغییر رمز عبور</button>
            </div>
          </form>
        </div>

        <!-- 2FA Card -->
        <div class="editor-sidebar-card" id="account-security-status-card">
          <h3 style="margin-top: 0; font-size: 1.05rem; font-weight: 700;">ورود دو مرحله‌ای پیامکی</h3>
          ${
            enabled
              ? `
            <p><strong>وضعیت فعلی:</strong> ورود دومرحله‌ای پیامکی فعال است.</p>
            <form id="account-security-disable-form" style="display:flex; flex-direction:column; gap: var(--space-3);">
              <div class="form-field">
                <label for="account-security-disable-password">برای غیرفعال‌سازی، رمز عبور فعلی را وارد کنید</label>
                <input type="password" id="account-security-disable-password" autocomplete="current-password" required />
              </div>
              <p class="error-text" id="account-security-disable-error" hidden></p>
              <button type="submit" class="btn btn-ghost" id="account-security-disable-btn">غیرفعال‌سازی ورود دومرحله‌ای</button>
            </form>
          `
              : `
            <p><strong>وضعیت فعلی:</strong> ورود دومرحله‌ای فعال نیست.</p>
            <button type="button" class="btn btn-primary" id="account-security-start-sms">فعال‌سازی ورود دومرحله‌ای پیامکی</button>
          `
          }
        </div>

        <div class="editor-sidebar-card" id="account-security-sms-setup-card" hidden>
          <p>یک کد ۶رقمی به شماره‌ی ثبت‌شده‌ی شما پیامک شد.</p>
          ${renderOtpInputMarkup('account-security-sms')}
          <p class="error-text" id="account-security-sms-error" hidden></p>
          <p class="login-2fa-verifying" id="account-security-sms-verifying" hidden>در حال تأیید...</p>
        </div>
      </div>
    </div>
  `;
}

export function initAccountSecurityView(): void {
  const statusCard = document.getElementById('account-security-status-card');
  const smsCard = document.getElementById('account-security-sms-setup-card');

  const smsErrorEl = document.getElementById('account-security-sms-error')!;
  const smsVerifyingEl = document.getElementById('account-security-sms-verifying')!;

  // Handle Change Password Form
  const changePwdForm = document.getElementById('account-security-change-pwd-form') as HTMLFormElement;
  const currentPwdInput = document.getElementById('pwd-current') as HTMLInputElement;
  const newPwdInput = document.getElementById('pwd-new') as HTMLInputElement;
  const confirmPwdInput = document.getElementById('pwd-confirm') as HTMLInputElement;
  const pwdErrorEl = document.getElementById('pwd-change-error')!;
  const submitBtn = document.getElementById('pwd-change-submit-btn') as HTMLButtonElement;

  changePwdForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    pwdErrorEl.hidden = true;

    const currentPwd = currentPwdInput?.value || '';
    const newPwd = newPwdInput?.value || '';
    const confirmPwd = confirmPwdInput?.value || '';

    if (newPwd.length < 6) {
      pwdErrorEl.hidden = false;
      pwdErrorEl.textContent = 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد.';
      return;
    }

    if (newPwd !== confirmPwd) {
      pwdErrorEl.hidden = false;
      pwdErrorEl.textContent = 'رمز عبور جدید با تکرار آن یکسان نیست.';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'در حال ذخیره...';

    try {
      await changePassword(newPwd, currentPwd);
      showToast('رمز عبور با موفقیت تغییر کرد.', 'success');
      changePwdForm.reset();
    } catch (err) {
      pwdErrorEl.hidden = false;
      pwdErrorEl.textContent = err instanceof Error ? err.message : 'خطا در تغییر رمز عبور';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'ذخیره و تغییر رمز عبور';
    }
  });

  async function confirmCode(code: string, otpHandle: ReturnType<typeof initOtpInput>): Promise<void> {
    smsErrorEl.hidden = true;
    smsVerifyingEl.hidden = false;
    try {
      await confirmSmsTwoFactor(code);
      window.location.reload();
    } catch (err) {
      smsVerifyingEl.hidden = true;
      smsErrorEl.hidden = false;
      smsErrorEl.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
      otpHandle?.reset();
    }
  }

  document.getElementById('account-security-start-sms')?.addEventListener('click', () => {
    void (async () => {
      try {
        await setupSmsTwoFactor();
        if (statusCard) statusCard.hidden = true;
        if (smsCard) smsCard.hidden = false;
        const otpHandle = initOtpInput('account-security-sms', {
          onComplete: (code) => void confirmCode(code, otpHandle),
          onResend: () => void setupSmsTwoFactor().catch((err) => window.alert(err instanceof Error ? err.message : 'ارسال دوباره‌ی کد ناموفق بود.')),
        });
      } catch (err) {
        window.alert(err instanceof Error ? err.message : 'خطایی پیش آمد.');
      }
    })();
  });

  document.getElementById('account-security-disable-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const passwordInput = document.getElementById('account-security-disable-password') as HTMLInputElement;
    const errorEl = document.getElementById('account-security-disable-error')!;
    void (async () => {
      errorEl.hidden = true;
      try {
        await disableTwoFactor(passwordInput.value);
        window.location.reload();
      } catch (err) {
        errorEl.hidden = false;
        errorEl.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
      }
    })();
  });
}

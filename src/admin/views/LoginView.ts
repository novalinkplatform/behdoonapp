import { icons } from '../components/icons.ts';
import { login, verifyTwoFactor } from '../utils/api.ts';
import { saveSession } from '../utils/auth.ts';
import type { StaffInfo } from '../utils/auth.ts';
import { renderOtpInputMarkup, initOtpInput } from '../components/OtpInput.ts';
import type { OtpInputHandle } from '../components/OtpInput.ts';

export function renderLoginView(): string {
  return `
    <div class="login-screen">
      <form class="login-card" id="login-form" novalidate>
        <div class="login-brand">
          <img class="login-brand-logo" src="/favicon.svg" alt="" />
          <span id="login-brand-text">پنل مدیریت بهدون</span>
        </div>
        <p class="login-demo-notice" id="login-demo-notice" hidden>
          این یک حساب آزمایشی (فقط نمایش) است — اطلاعات ورود از پیش پر شده، فقط روی «ورود» بزنید.
        </p>
        <div class="form-field">
          <label for="login-username">نام کاربری</label>
          <div class="login-input-wrapper">
            <span class="icon">${icons.user}</span>
            <input type="text" id="login-username" autocomplete="username" autofocus />
          </div>
        </div>
        <div class="form-field">
          <label for="login-password">رمز عبور</label>
          <div class="login-input-wrapper">
            <span class="icon">${icons.lock}</span>
            <input type="password" id="login-password" autocomplete="current-password" />
            <button type="button" class="login-toggle-password" id="login-toggle-password" title="نمایش رمز" aria-label="نمایش رمز عبور">
              <span class="login-eye-icon">${icons.eye}</span>
            </button>
          </div>
        </div>
        <p class="error-text" id="login-error" hidden></p>
        <button type="submit" class="btn btn-primary btn-block" id="login-submit">ورود</button>
      </form>

      <div class="login-card" id="login-2fa-form" hidden>
        <div class="login-brand">
          <img class="login-brand-logo" src="/favicon.svg" alt="" />
          <span id="login-2fa-title">تأیید ورود</span>
        </div>
        <p class="login-2fa-hint" id="login-2fa-hint"></p>
        ${renderOtpInputMarkup('login-2fa')}
        <p class="error-text" id="login-2fa-error" hidden></p>
        <p class="login-2fa-verifying" id="login-2fa-verifying" hidden>در حال تأیید...</p>
        <button type="button" class="btn btn-ghost btn-block" id="login-2fa-back">بازگشت</button>
      </div>
    </div>
  `;
}

export function initLoginView(onSuccess: (staff: StaffInfo) => void): void {
  const form = document.getElementById('login-form');
  const usernameInput = document.getElementById('login-username') as HTMLInputElement | null;
  const passwordInput = document.getElementById('login-password') as HTMLInputElement | null;
  const errorEl = document.getElementById('login-error');
  const submitBtn = document.getElementById('login-submit') as HTMLButtonElement | null;

  const twoFaForm = document.getElementById('login-2fa-form');
  const twoFaHint = document.getElementById('login-2fa-hint');
  const twoFaErrorEl = document.getElementById('login-2fa-error');
  const twoFaVerifyingEl = document.getElementById('login-2fa-verifying');
  const twoFaBackBtn = document.getElementById('login-2fa-back');

  if (!form || !usernameInput || !passwordInput || !errorEl || !submitBtn || !twoFaForm || !twoFaHint || !twoFaErrorEl || !twoFaVerifyingEl || !twoFaBackBtn)
    return;

  // لینک «مشاهده‌ی پنل مدیریت» در صفحه‌ی فروش (Behbar/src/sections/SaleView.ts) این پارامتر را اضافه
  // می‌کند — فقط نام‌کاربری/رمز را از پیش پر می‌کند، خودش لاگین را نمی‌زند (کاربر باید خودش «ورود» را
  // بزند)، عمداً برای جلوگیری از رفتار غیرمنتظره‌ی ورود خودکار.
  if (new URLSearchParams(location.search).get('demo') === '1') {
    usernameInput.value = 'test';
    passwordInput.value = '12345678';
    document.getElementById('login-demo-notice')!.hidden = false;
  }

  const togglePasswordBtn = document.getElementById('login-toggle-password') as HTMLButtonElement | null;
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      togglePasswordBtn.title = isPassword ? 'مخفی کردن رمز' : 'نمایش رمز';
      togglePasswordBtn.setAttribute('aria-label', isPassword ? 'مخفی کردن رمز عبور' : 'نمایش رمز عبور');
      const eyeSpan = togglePasswordBtn.querySelector('.login-eye-icon');
      if (eyeSpan) {
        eyeSpan.innerHTML = isPassword ? icons.eyeOff : icons.eye;
      }
    });
  }

  let pendingChallengeToken = '';
  let otpHandle: OtpInputHandle | null = null;

  async function verifyCode(code: string): Promise<void> {
    twoFaErrorEl!.hidden = true;
    twoFaVerifyingEl!.hidden = false;
    try {
      const { token, staff } = await verifyTwoFactor(pendingChallengeToken, code);
      saveSession(token, staff);
      onSuccess(staff);
    } catch (err) {
      twoFaVerifyingEl!.hidden = true;
      twoFaErrorEl!.hidden = false;
      twoFaErrorEl!.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
      otpHandle?.reset();
    }
  }

  async function resendCode(): Promise<void> {
    try {
      const result = await login(usernameInput!.value.trim(), passwordInput!.value);
      if (result.needsTwoFactor) pendingChallengeToken = result.challengeToken;
    } catch (err) {
      twoFaErrorEl!.hidden = false;
      twoFaErrorEl!.textContent = err instanceof Error ? err.message : 'ارسال دوباره‌ی کد ناموفق بود.';
    }
  }

  function showTwoFaStep(): void {
    form!.hidden = true;
    twoFaForm!.hidden = false;
    twoFaHint!.textContent = 'کد ۶رقمی که همین الان پیامک شد را وارد کنید.';
    otpHandle = initOtpInput('login-2fa', { onComplete: (code) => void verifyCode(code), onResend: () => void resendCode() });
  }

  function backToPasswordStep(): void {
    pendingChallengeToken = '';
    otpHandle?.stopWebOtp();
    otpHandle = null;
    twoFaForm!.hidden = true;
    form!.hidden = false;
    passwordInput!.value = '';
    passwordInput!.focus();
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorEl.hidden = true;
    submitBtn.disabled = true;
    submitBtn.textContent = 'در حال ورود...';

    try {
      const result = await login(usernameInput.value.trim(), passwordInput.value);
      if (result.needsTwoFactor) {
        pendingChallengeToken = result.challengeToken;
        showTwoFaStep();
      } else {
        saveSession(result.token, result.staff);
        onSuccess(result.staff);
      }
    } catch (err) {
      errorEl.hidden = false;
      errorEl.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'ورود';
    }
  });

  twoFaBackBtn.addEventListener('click', backToPasswordStep);
}

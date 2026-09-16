import { pick } from '../i18n/lang.ts';

// کادر ورود کد پیامکی — هر رقم یک خانه‌ی جدا، با پرشدن خودکار فوکوس، پیست کل کد در یک‌ضربه، شمارش‌معکوس
// ۶۰ثانیه‌ای برای «ارسال دوباره»، و روی گوشی‌های اندروید با کروم، پرشدن خودکار کد از پیامک با WebOTP API.
// همان کامپوننت در پنل مدیریت (Behbar-Admin/src/components/OtpInput.ts) هم هست — چون این دو یک اپ
// جدا با npm project جدا هستند، اشتراک کد ممکن نبود، ولی رفتار و طراحی عیناً یکسان نگه داشته شده.

export function renderOtpInputMarkup(idPrefix: string, length = 6): string {
  const boxes = Array.from({ length }, (_, i) => `<input type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="1" class="otp-digit" data-otp-index="${i}" />`).join('');
  return `
    <div class="otp-input-group" id="${idPrefix}-group">${boxes}</div>
    <div class="otp-resend-row">
      <span class="otp-timer" id="${idPrefix}-timer"></span>
      <button type="button" class="otp-resend-btn" id="${idPrefix}-resend-btn" hidden>${pick('ارسال دوباره‌ی کد', 'Resend code')}</button>
    </div>
  `;
}

export interface OtpInputHandle {
  reset(): void;
  focusFirst(): void;
  stopWebOtp(): void;
  getCode(): string;
}

export function initOtpInput(
  idPrefix: string,
  options: { length?: number; onComplete: (code: string) => void; onResend: () => void; resendSeconds?: number },
): OtpInputHandle | null {
  const length = options.length ?? 6;
  const resendSeconds = options.resendSeconds ?? 60;
  const group = document.getElementById(`${idPrefix}-group`);
  const timerEl = document.getElementById(`${idPrefix}-timer`);
  const resendBtn = document.getElementById(`${idPrefix}-resend-btn`) as HTMLButtonElement | null;
  if (!group || !timerEl || !resendBtn) return null;

  const digits = Array.from(group.querySelectorAll<HTMLInputElement>('.otp-digit'));
  let intervalId: number | null = null;
  let abortController: AbortController | null = null;

  function currentCode(): string {
    return digits.map((d) => d.value).join('');
  }

  function checkComplete(): void {
    const code = currentCode();
    if (code.length === length && /^\d+$/.test(code)) {
      stopWebOtp();
      options.onComplete(code);
    }
  }

  digits.forEach((input, index) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/\D/g, '').slice(-1);
      if (input.value && index < digits.length - 1) digits[index + 1].focus();
      checkComplete();
    });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Backspace' && !input.value && index > 0) {
        digits[index - 1].focus();
      }
    });
    input.addEventListener('paste', (event) => {
      const pasted = event.clipboardData?.getData('text').replace(/\D/g, '') ?? '';
      if (!pasted) return;
      event.preventDefault();
      pasted
        .slice(0, length)
        .split('')
        .forEach((ch, i) => {
          if (digits[i]) digits[i].value = ch;
        });
      const lastFilledIndex = Math.min(pasted.length, length) - 1;
      if (lastFilledIndex >= 0) digits[lastFilledIndex].focus();
      checkComplete();
    });
  });

  function startTimer(): void {
    let remaining = resendSeconds;
    resendBtn!.hidden = true;
    timerEl!.hidden = false;
    if (intervalId) window.clearInterval(intervalId);
    const tick = () => {
      const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
      const ss = String(remaining % 60).padStart(2, '0');
      timerEl!.textContent = `${pick('ارسال دوباره تا', 'Resend in')} ${mm}:${ss}`;
      if (remaining <= 0) {
        if (intervalId) window.clearInterval(intervalId);
        timerEl!.hidden = true;
        resendBtn!.hidden = false;
      }
      remaining -= 1;
    };
    tick();
    intervalId = window.setInterval(tick, 1000);
  }

  resendBtn.addEventListener('click', () => {
    options.onResend();
    reset();
    startTimer();
  });

  function reset(): void {
    digits.forEach((d) => (d.value = ''));
    digits[0]?.focus();
  }

  function focusFirst(): void {
    digits[0]?.focus();
  }

  function stopWebOtp(): void {
    abortController?.abort();
    abortController = null;
  }

  // WebOTP: فقط کروم روی اندروید پشتیبانی می‌کند و فقط اگر پیامک با فرمت ویژه‌ی «@دامنه #کد» ختم شده
  // باشد (سمت سرور تضمین شده) — در غیر این صورت این کد بی‌اثر می‌ماند، بدون خطا.
  if ('OTPCredential' in window) {
    abortController = new AbortController();
    (
      navigator.credentials.get({
        // @ts-expect-error -- otp در تایپ‌های استاندارد lib.dom.d.ts هنوز تعریف نشده
        otp: { transport: ['sms'] },
        signal: abortController.signal,
      }) as Promise<{ code?: string } | null>
    )
      .then((cred) => {
        const code = cred?.code?.replace(/\D/g, '');
        if (code && code.length === length) {
          code.split('').forEach((ch, i) => {
            if (digits[i]) digits[i].value = ch;
          });
          checkComplete();
        }
      })
      .catch(() => {
        /* کاربر اجازه نداد یا مرورگر پشتیبانی نمی‌کند — بی‌اهمیت، تایپ دستی همچنان کار می‌کند */
      });
  }

  startTimer();
  focusFirst();

  return { reset, focusFirst, stopWebOtp, getCode: currentCode };
}

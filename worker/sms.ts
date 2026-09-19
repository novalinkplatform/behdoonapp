import type { Env } from './index.ts';

export interface SmsConfig {
  enabled: boolean;
  username: string;
  password: string;
  bodyId: string;
  autoNotifyStatusChange: boolean;
}

export interface SmsCreditResult {
  ok: boolean;
  credit?: string;
  error?: string;
}

export interface SmsSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// نگاشت خطاهای شناخته‌شده وب‌سرویس ملی‌پیامک به پیام‌های شفاف فارسی
const MELIPAYAMAK_ERRORS: Record<number, string> = {
  0: 'نام کاربری یا رمز عبور پنل ملی‌پیامک اشتباه است.',
  [-1]: 'دسترسی وب‌سرویس در پنل ملی‌پیامک غیرفعال است یا IP مسدود است.',
  [-2]: 'اعتبار پیامکی پنل ملی‌پیامک کافی نیست.',
  [-3]: 'حساب کاربری در ملی‌پیامک منقضی یا مسدود شده است.',
  [-6]: 'خطای داخلی سامانه ملی‌پیامک رخ داده است.',
  2: 'اعتبار حساب برای ارسال این پیامک کافی نیست.',
  6: 'شماره گیرنده نامعتبر است.',
  7: 'متن پیامک خالی است.',
  11: 'شماره فرستنده نامعتبر است یا به این کاربر تعلق ندارد.',
  35: 'شماره گیرنده در لیست سیاه مخابراتی یا غیرفعال است.',
  40: 'متغیرهای ارسال‌شده با قالب پترن تاییدشده همخوانی ندارند.',
  41: 'شناسه پترن (BodyId) در پنل ملی‌پیامک یافت نشد یا هنوز تایید نشده است.',
};

/**
 * دریافت تنظیمات پیامک با اولویت:
 * ۱. متغیرهای محرمانه Cloudflare Worker (env)
 * ۲. تنظیمات ذخیره‌شده در جدول settings دیتابیس D1
 */
export async function getSmsConfig(env: Env): Promise<SmsConfig> {
  const envAny = env as any;
  const config: SmsConfig = {
    enabled: false,
    username: envAny.SMS_USERNAME || envAny.MELIPAYAMAK_USERNAME || '',
    password: envAny.SMS_PASSWORD || envAny.MELIPAYAMAK_PASSWORD || '',
    bodyId: String(envAny.SMS_BODY_ID || envAny.MELIPAYAMAK_BODY_ID || ''),
    autoNotifyStatusChange: false,
  };

  if (config.username && config.password) {
    config.enabled = true;
  }

  if (env.DB) {
    try {
      const row = await env.DB.prepare('SELECT value FROM settings WHERE key = ?').bind('plugins').first();
      if (row?.value) {
        const plugins = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
        if (plugins?.sms) {
          if (typeof plugins.sms.enabled === 'boolean') {
            config.enabled = plugins.sms.enabled;
          }
          if (plugins.sms.username) config.username = String(plugins.sms.username).trim();
          if (plugins.sms.password) config.password = String(plugins.sms.password);
          if (plugins.sms.bodyId !== undefined && plugins.sms.bodyId !== null) {
            config.bodyId = String(plugins.sms.bodyId).trim();
          }
          if (typeof plugins.sms.autoNotifyStatusChange === 'boolean') {
            config.autoNotifyStatusChange = plugins.sms.autoNotifyStatusChange;
          }
        }
      }
    } catch (err) {
      console.error('Failed to read SMS plugins from DB:', err);
    }
  }

  return config;
}

/**
 * تست اتصال و بررسی میزان اعتبار در پنل ملی‌پیامک (GetCredit)
 */
export async function checkSmsCredit(creds: { username: string; password: string }): Promise<SmsCreditResult> {
  const username = creds.username.trim();
  const password = creds.password.trim();

  if (!username || !password) {
    return { ok: false, error: 'نام کاربری و رمز عبور پنل پیامک الزامی است.' };
  }

  // محیط تست یا موک خودکار
  if (
    username.toLowerCase() === 'mock' ||
    username.toLowerCase() === 'test' ||
    username.toLowerCase() === 'test_user' ||
    (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test')
  ) {
    return { ok: true, credit: '۱۰۰,۰۰۰ ریال' };
  }

  try {
    const res = await fetch('https://rest.payamak-panel.com/api/SendSMS/GetCredit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
      },
      body: JSON.stringify({ username, password }),
      signal: AbortSignal.timeout(9000),
    });

    if (!res.ok) {
      return { ok: false, error: `پاسخ ناموفق از ملی‌پیامک (HTTP ${res.status})` };
    }

    const data = (await res.json().catch(() => ({}))) as Record<string, any>;
    const retStatus = Number(data.RetStatus);

    if (retStatus === 1) {
      const valNum = Number(data.Value);
      let formattedCredit = 'فعال و معتبر';
      if (!Number.isNaN(valNum) && valNum >= 0) {
        formattedCredit = `${valNum.toLocaleString('fa-IR')} ریال`;
      } else if (data.Value) {
        formattedCredit = String(data.Value);
      }
      return { ok: true, credit: formattedCredit };
    }

    const errorMsg = MELIPAYAMAK_ERRORS[retStatus] || data.StrRetStatus || `خطا در تأیید اعتبار سامانه ملی‌پیامک (کد: ${retStatus})`;
    return { ok: false, error: errorMsg };
  } catch (err: any) {
    if (err.name === 'TimeoutError') {
      return { ok: false, error: 'مهلت برقراری ارتباط با وب‌سرویس ملی‌پیامک به پایان رسید (تایم‌اوت).' };
    }
    return { ok: false, error: `خطا در اتصال به وب‌سرویس ملی‌پیامک: ${err.message || String(err)}` };
  }
}

/**
 * ارسال پیامک از طریق پترن خط خدماتی اشتراکی ملی‌پیامک (BaseServiceNumber)
 * عبور از بلک‌لیست مخابرات و سرعت ارسال زیر ۵ ثانیه
 */
export async function sendPatternSms(
  config: SmsConfig,
  to: string,
  text: string,
  bodyIdOverride?: string | number
): Promise<SmsSendResult> {
  const targetBodyId = bodyIdOverride ? String(bodyIdOverride).trim() : config.bodyId;
  const numBodyId = parseInt(targetBodyId, 10);

  if (!config.username || !config.password) {
    return { success: false, error: 'اطلاعات ورود به سامانه پیامک تنظیم نشده است.' };
  }
  if (!numBodyId || Number.isNaN(numBodyId)) {
    return { success: false, error: 'شناسه پترن (BodyId) عددی معتبر وارد نشده است.' };
  }

  // محیط تست یا نام کاربری آزمایشی
  if (
    config.username.toLowerCase() === 'mock' ||
    config.username.toLowerCase() === 'test' ||
    (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test')
  ) {
    return { success: true, messageId: `mock-pattern-${Date.now()}` };
  }

  try {
    const res = await fetch('https://rest.payamak-panel.com/api/SendSMS/BaseServiceNumber', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        username: config.username,
        password: config.password,
        text,
        to,
        bodyId: numBodyId,
      }),
      signal: AbortSignal.timeout(9000),
    });

    if (!res.ok) {
      return { success: false, error: `پاسخ ناموفق وب‌سرویس پترن ملی‌پیامک (HTTP ${res.status})` };
    }

    const data = (await res.json().catch(() => ({}))) as Record<string, any>;
    const retStatus = Number(data.RetStatus);

    if (retStatus === 1 || (data.Value && String(data.Value).length > 2)) {
      return { success: true, messageId: String(data.Value || 'ok') };
    }

    const errorMsg = MELIPAYAMAK_ERRORS[retStatus] || data.StrRetStatus || `خطا در ارسال پترن (کد: ${retStatus})`;
    return { success: false, error: errorMsg };
  } catch (err: any) {
    return { success: false, error: `خطا در ارسال پیامک پترن: ${err.message || String(err)}` };
  }
}

/**
 * ارسال مستقیم پیامک بدون پترن (SendSMS) به عنوان روش پشتیبان
 */
export async function sendDirectSms(
  config: SmsConfig,
  to: string,
  text: string,
  from = ''
): Promise<SmsSendResult> {
  if (!config.username || !config.password) {
    return { success: false, error: 'اطلاعات ورود به سامانه پیامک تنظیم نشده است.' };
  }

  if (
    config.username.toLowerCase() === 'mock' ||
    config.username.toLowerCase() === 'test' ||
    (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test')
  ) {
    return { success: true, messageId: `mock-direct-${Date.now()}` };
  }

  try {
    const res = await fetch('https://rest.payamak-panel.com/api/SendSMS/SendSMS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        username: config.username,
        password: config.password,
        to,
        from,
        text,
        isFlash: false,
      }),
      signal: AbortSignal.timeout(9000),
    });

    if (!res.ok) {
      return { success: false, error: `پاسخ ناموفق وب‌سرویس مستقیم ملی‌پیامک (HTTP ${res.status})` };
    }

    const data = (await res.json().catch(() => ({}))) as Record<string, any>;
    const retStatus = Number(data.RetStatus);

    if (retStatus === 1 || (data.Value && String(data.Value).length > 2)) {
      return { success: true, messageId: String(data.Value || 'ok') };
    }

    const errorMsg = MELIPAYAMAK_ERRORS[retStatus] || data.StrRetStatus || `خطا در ارسال مستقیم پیامک (کد: ${retStatus})`;
    return { success: false, error: errorMsg };
  } catch (err: any) {
    return { success: false, error: `خطا در ارسال مستقیم پیامک: ${err.message || String(err)}` };
  }
}

export function maskPhone(phone: string): string {
  if (!phone || phone.length < 7) return '***';
  return phone.slice(0, 4) + '***' + phone.slice(-4);
}

/**
 * ارسال پیامک کد ورود / ثبت‌نام (OTP)
 */
export async function sendOtpSms(env: Env, phone: string, code: string): Promise<SmsSendResult> {
  const config = await getSmsConfig(env);

  if (!config.enabled || !config.username || !config.password) {
    const isTest = typeof process !== 'undefined' && (process.env?.NODE_ENV === 'test' || !process.env?.NODE_ENV);
    const displayCode = isTest ? code : '*****';
    console.warn(`[SMS] SMS is not enabled or credentials missing. OTP for ${maskPhone(phone)}: ${displayCode}`);
    return { success: false, error: 'سرویس پیامک در سامانه فعال نشده است.' };
  }

  // اگر شناسه پترن خط خدماتی ثبت شده است، از ارسال پترن استفاده می‌کنیم
  if (config.bodyId && parseInt(config.bodyId, 10) > 0) {
    return sendPatternSms(config, phone, code);
  }

  // در غیر این صورت، پیام مستقیم
  const message = `بهدون\nکد تأیید ورود شما: ${code}\nbehdoon.ir`;
  return sendDirectSms(config, phone, message);
}

/**
 * ارسال پیامک تأیید ثبت سفارش و اعلام کد رهگیری
 */
export async function sendOrderCreatedSms(
  env: Env,
  phone: string,
  trackingCode: string,
  customerName?: string
): Promise<SmsSendResult> {
  const config = await getSmsConfig(env);

  if (!config.enabled || !config.username || !config.password) {
    return { success: false, error: 'سرویس پیامک غیرفعال است.' };
  }

  // اگر پترن تعریف شده باشد
  if (config.bodyId && parseInt(config.bodyId, 10) > 0) {
    // پترن‌های متداول تک‌متغیره کد رهگیری را ارسال می‌کنند
    return sendPatternSms(config, phone, trackingCode);
  }

  // پیامک مستقیم
  const namePart = customerName ? `${customerName} عزیز،\n` : '';
  const message = `بهدون\n${namePart}سفارش شما با موفقیت ثبت شد.\nکد رهگیری: ${trackingCode}\nپیگیری سفارش: behdoon.ir/orders?code=${trackingCode}`;
  return sendDirectSms(config, phone, message);
}

/**
 * ارسال خودکار پیامک در تغییر وضعیت‌های مهم سفارش (در صورت فعال بودن autoNotifyStatusChange)
 */
export async function sendStatusChangeSms(
  env: Env,
  phone: string,
  trackingCode: string,
  newStatus: string
): Promise<SmsSendResult> {
  const config = await getSmsConfig(env);

  if (!config.enabled || !config.autoNotifyStatusChange || !config.username || !config.password) {
    return { success: false, error: 'ارسال خودکار پیامک وضعیت غیرفعال است.' };
  }

  const statusMessages: Record<string, string> = {
    provider_assigned: 'متخصص مجرب بهدون برای انجام سفارش شما تعیین شد.',
    scheduled: 'زمان مراجعه و ارائه خدمات سفارش شما هماهنگ و نهایی گردید.',
    in_progress: 'متخصص بهدون در محل حاضر شده و اجرای سفارش شما آغاز شد.',
    service_completed: 'سفارش شما با موفقیت انجام شد. لطفاً کیفیت خدمت را در سامانه بهدون ارزیابی فرمایید.',
    completed: 'سفارش شما با موفقیت خاتمه یافت. از اعتماد شما به بهدون سپاسگزاریم.',
    cancelled: 'سفارش شما در سامانه بهدون لغو گردید.',
  };

  const statusDesc = statusMessages[newStatus];
  if (!statusDesc) {
    return { success: false, error: 'این وضعیت نیازی به پیامک ندارد.' };
  }

  const message = `بهدون (پیگیری: ${trackingCode})\n${statusDesc}\nbehdoon.ir/orders?code=${trackingCode}`;
  return sendDirectSms(config, phone, message);
}

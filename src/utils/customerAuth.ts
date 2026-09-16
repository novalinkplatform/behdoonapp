import { API_BASE_URL } from '../data/config.ts';
import { pick } from '../i18n/lang.ts';
import { notifyNativeApiBase, notifyNativeSession } from './nativeBridge.ts';

const TOKEN_KEY = 'behbar_customer_token';

// اگر همین الان (بارگذاری اولیه‌ی صفحه) توکنی موجود باشد، اپ بومی باید از قبلی‌بودنِ نشست باخبر شود —
// نه فقط از لحظه‌ی ورود/خروج جدید.
notifyNativeApiBase();
notifyNativeSession(getCustomerToken());

export type CustomerIdentityType = 'female' | 'male' | 'company' | 'organization';

export interface CustomerInfo {
  id: number;
  phone: string;
  fullName: string;
  gender?: CustomerIdentityType | null;
  companyName?: string | null;
}

export interface CustomerAddress {
  id: number;
  title: string;
  city: string;
  address: string;
  floor?: string;
  unit?: string;
  hasElevator?: boolean;
  notes?: string;
  createdAt: string;
}

export interface CreateCustomerAddressInput {
  title: string;
  city: string;
  address: string;
  floor?: string;
  unit?: string;
  hasElevator?: boolean;
  notes?: string;
}

export interface VerifyOtpResult {
  customer: CustomerInfo;
  token: string;
  isNew: boolean;
  needsProfile: boolean;
}

export function getCustomerToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function saveCustomerToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* localStorage unavailable — the customer will just need to log in again next visit */
  }
  notifyNativeSession(token);
}

export function clearCustomerToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* non-critical */
  }
  notifyNativeSession(null);
}

async function readError(res: Response, fallback: string): Promise<string> {
  const body = await res.json().catch(() => ({}));
  return typeof body?.error === 'string' ? body.error : fallback;
}

export async function sendCustomerOtp(phone: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/customer/otp/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  if (!res.ok) throw new Error(await readError(res, pick('ارسال کد تأیید ناموفق بود.', 'Failed to send verification code.')));
}

export async function verifyCustomerOtp(phone: string, code: string): Promise<VerifyOtpResult> {
  const res = await fetch(`${API_BASE_URL}/api/customer/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, code }),
  });
  if (!res.ok) throw new Error(await readError(res, pick('کد واردشده معتبر نیست.', 'Invalid verification code.')));
  const body = await res.json();
  if (body.token) {
    saveCustomerToken(body.token);
  }
  return body as VerifyOtpResult;
}

export async function updateCustomerProfile(
  fullName: string,
  gender: CustomerIdentityType,
  companyName?: string,
): Promise<CustomerInfo> {
  const token = getCustomerToken();
  if (!token) throw new Error(pick('ابتدا باید وارد شوید.', 'You must log in first.'));
  const res = await fetch(`${API_BASE_URL}/api/customer/profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ fullName, gender, companyName }),
  });
  if (!res.ok) throw new Error(await readError(res, pick('ثبت اطلاعات ناموفق بود.', 'Failed to save profile.')));
  const body = await res.json();
  return body.customer as CustomerInfo;
}

export async function getCustomerAddresses(): Promise<CustomerAddress[]> {
  const token = getCustomerToken();
  if (!token) return [];
  try {
    const res = await fetch(`${API_BASE_URL}/api/customer/addresses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    const body = await res.json();
    return Array.isArray(body.addresses) ? body.addresses : [];
  } catch {
    return [];
  }
}

export async function addCustomerAddress(input: CreateCustomerAddressInput): Promise<CustomerAddress> {
  const token = getCustomerToken();
  if (!token) throw new Error(pick('ابتدا باید وارد شوید.', 'You must log in first.'));
  const res = await fetch(`${API_BASE_URL}/api/customer/addresses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await readError(res, pick('ثبت آدرس ناموفق بود.', 'Failed to add address.')));
  const body = await res.json();
  return body.address as CustomerAddress;
}

export async function deleteCustomerAddress(id: number): Promise<void> {
  const token = getCustomerToken();
  if (!token) throw new Error(pick('ابتدا باید وارد شوید.', 'You must log in first.'));
  const res = await fetch(`${API_BASE_URL}/api/customer/addresses/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await readError(res, pick('حذف آدرس با خطا مواجه شد.', 'Failed to delete address.')));
}

export async function registerCustomer(phone: string, password: string, fullName: string): Promise<CustomerInfo> {
  const res = await fetch(`${API_BASE_URL}/api/customer/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, password, fullName }),
  });
  if (!res.ok) throw new Error(await readError(res, pick('ثبت‌نام ناموفق بود.', 'Registration failed.')));
  const body = await res.json();
  saveCustomerToken(body.token);
  return body.customer as CustomerInfo;
}

export async function loginCustomer(phone: string, password: string): Promise<CustomerInfo> {
  const res = await fetch(`${API_BASE_URL}/api/customer/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, password }),
  });
  if (!res.ok) throw new Error(await readError(res, pick('ورود ناموفق بود.', 'Login failed.')));
  const body = await res.json();
  saveCustomerToken(body.token);
  return body.customer as CustomerInfo;
}

export async function logoutCustomer(): Promise<void> {
  const token = getCustomerToken();
  clearCustomerToken();
  if (!token) return;
  await fetch(`${API_BASE_URL}/api/customer/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => {
    /* non-critical — local token is already cleared */
  });
}

export async function fetchCurrentCustomer(): Promise<CustomerInfo | null> {
  const token = getCustomerToken();
  if (!token) return null;
  const res = await fetch(`${API_BASE_URL}/api/customer/me`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) {
    clearCustomerToken();
    return null;
  }
  const body = await res.json();
  return body.customer as CustomerInfo;
}

export async function requestPasswordReset(phone: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/customer/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  if (!res.ok) throw new Error(await readError(res, pick('ارسال کد ناموفق بود.', 'Failed to send the code.')));
}

export async function confirmPasswordReset(phone: string, code: string, newPassword: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/customer/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, code, newPassword }),
  });
  if (!res.ok) throw new Error(await readError(res, pick('بازیابی رمز عبور ناموفق بود.', 'Password reset failed.')));
}

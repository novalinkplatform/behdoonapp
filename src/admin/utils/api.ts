import { API_BASE_URL } from '../data/config.ts';
import { getToken, clearSession } from './auth.ts';
import type { StaffInfo, StaffRole } from './auth.ts';

export interface OrderRecord {
  id: number;
  trackingCode: string;
  customerName: string;
  serviceId: string;
  serviceLabel: string;
  originProvince: string;
  originCity: string;
  originCountry: string;
  originLat: number | null;
  originLng: number | null;
  originNotes: string | null;
  destinationProvince: string;
  destinationCity: string;
  destinationCountry: string;
  destinationLat: number | null;
  destinationLng: number | null;
  destinationNotes: string | null;
  originFloor: number;
  originElevator: boolean;
  destinationFloor: number;
  destinationElevator: boolean;
  wantsPacking: boolean;
  laborChoice: string;
  scheduledDate: string;
  scheduledTime: string;
  estimateMin: number;
  estimateAvg: number;
  estimateMax: number;
  phone: string;
  status: string;
  assignedStaffId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface StatsResponse {
  total: number;
  byStatus: { status: string; count: number }[];
  byService: { service_id: string; service_label: string; count: number }[];
  completedRevenue: number;
  daily: { day: string; count: number }[];
  topCities: { city: string; count: number }[];
  topProvinces: { province: string; count: number }[];
  avgOrderValue: number;
  staffPerformance: { name: string; role: string; role_label: string; total: number; completed: number }[];
}

export interface StaffRecord {
  id: number;
  username: string;
  fullName: string;
  role: StaffRole;
  roleLabel: string;
  permissions: string[];
  assignable: boolean;
  phone: string | null;
  avatarUrl: string | null;
  nationalId: string | null;
  address: string | null;
  hireDate: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  notes: string | null;
  gender: 'male' | 'female' | null;
  isActive: boolean;
  isReadOnly: boolean;
  onActiveService: boolean;
  salaryAmountOverride: number | null;
  bonusTypeOverride: WalletBonusType | null;
  bonusAmountOverride: number | null;
  createdAt: string;
}

export type ArticleBlock =
  | { type: 'heading'; text: string; textEn: string }
  | { type: 'paragraph'; text: string; textEn: string }
  | { type: 'list'; items: string[]; itemsEn: string[] }
  | { type: 'richtext'; html: string; htmlEn: string }
  | { type: 'image'; url: string; caption: string; captionEn: string }
  | { type: 'video'; url: string };

export interface ArticleRecord {
  id: number;
  slug: string;
  title: string;
  titleEn: string;
  excerpt: string;
  excerptEn: string;
  category: string;
  categoryEn: string;
  coverImageUrl: string | null;
  content: ArticleBlock[];
  metaTitle: string | null;
  metaDescription: string | null;
  status: 'draft' | 'published';
  authorStaffId: number | null;
  readingTime: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ArticlePayload {
  slug?: string;
  title: string;
  titleEn: string;
  excerpt: string;
  excerptEn: string;
  category: string;
  categoryEn: string;
  coverImageUrl: string | null;
  content: ArticleBlock[];
  metaTitle: string;
  metaDescription: string;
}

export type CustomPageBlock = ArticleBlock;

export interface CustomPageRecord {
  id: number;
  slug: string;
  title: string;
  titleEn: string;
  excerpt: string;
  excerptEn: string;
  coverImageUrl: string | null;
  content: CustomPageBlock[];
  metaTitle: string | null;
  metaDescription: string | null;
  status: 'draft' | 'published';
  authorStaffId: number | null;
  publishedAt: string | null;
  showInHeader?: boolean;
  showInFooter?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomPagePayload {
  slug?: string;
  title: string;
  titleEn?: string;
  excerpt?: string;
  excerptEn?: string;
  coverImageUrl?: string | null;
  content: CustomPageBlock[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  showInHeader?: boolean;
  showInFooter?: boolean;
}


export class UnauthorizedError extends Error {}

let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler;
}

async function authedFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status === 401) {
    clearSession();
    onUnauthorized?.();
    throw new UnauthorizedError('نشست شما منقضی شده است.');
  }

  return res;
}

// اگر ورود دومرحله‌ای فعال باشد، سرور هنوز توکن نمی‌دهد — یک چالش موقت برمی‌گرداند که با
// verifyTwoFactor کامل می‌شود.
export type LoginResult = { needsTwoFactor: true; challengeToken: string } | { needsTwoFactor: false; token: string; staff: StaffInfo };

export async function login(username: string, password: string): Promise<LoginResult> {
  const res = await fetch(`${API_BASE_URL}/api/staff/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'ورود ناموفق بود.');
  if (body?.needsTwoFactor) return { needsTwoFactor: true, challengeToken: body.challengeToken };
  return { needsTwoFactor: false, token: body.token, staff: body.staff };
}

export async function verifyTwoFactor(challengeToken: string, code: string): Promise<{ token: string; staff: StaffInfo }> {
  const res = await fetch(`${API_BASE_URL}/api/staff/login/verify-2fa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challengeToken, code }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'کد نامعتبر است.');
  return body as { token: string; staff: StaffInfo };
}

export async function setupSmsTwoFactor(): Promise<void> {
  const res = await authedFetch('/api/staff/2fa/sms/setup', { method: 'POST' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'ارسال کد ناموفق بود.');
}

export async function confirmSmsTwoFactor(code: string): Promise<void> {
  const res = await authedFetch('/api/staff/2fa/sms/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'تأیید کد ناموفق بود.');
}

export async function disableTwoFactor(password: string): Promise<void> {
  const res = await authedFetch('/api/staff/2fa/disable', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'غیرفعال‌سازی ناموفق بود.');
}

export async function changePassword(newPassword: string, currentPassword?: string): Promise<void> {
  const res = await authedFetch('/api/staff/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newPassword, currentPassword }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'تغییر رمز عبور ناموفق بود.');
}

export async function logout(): Promise<void> {
  await authedFetch('/api/staff/logout', { method: 'POST' }).catch(() => {});
}

export async function fetchMe(): Promise<StaffInfo> {
  const res = await authedFetch('/api/staff/me');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت اطلاعات ناموفق بود.');
  return {
    ...(body.staff as StaffInfo),
    licenseLocked: Boolean(body.licenseLocked),
    licenseSummary: body.licenseSummary,
  };
}

export async function fetchRequests(status?: string): Promise<OrderRecord[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  const res = await authedFetch(`/api/admin/requests${query}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت درخواست‌ها ناموفق بود.');
  return (body.requests ?? []) as OrderRecord[];
}

export async function updateRequestStatus(id: number, status: string): Promise<void> {
  const res = await authedFetch(`/api/admin/requests/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'به‌روزرسانی ناموفق بود.');
}

export interface UpdateInvoicePayload {
  invoiceItems: { id: string; title: string; description: string; amount: number }[];
  estimateAvg: number;
  laborChoice?: string;
  laborCount?: number;
  notifyCustomer?: boolean;
}

export async function updateRequestInvoice(id: number, payload: UpdateInvoicePayload): Promise<void> {
  const res = await authedFetch(`/api/admin/requests/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'به‌روزرسانی و ثبت فاکتور ناموفق بود.');
}

export async function deleteRequest(id: number): Promise<void> {
  const res = await authedFetch(`/api/admin/requests/${id}`, { method: 'DELETE' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'حذف درخواست ناموفق بود.');
}

export async function downloadRequestsCsv(): Promise<void> {
  const res = await authedFetch('/api/admin/requests/export');
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت خروجی ناموفق بود.');
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `behbar-requests-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export interface ActivityLogEntry {
  id: number;
  staffId: number | null;
  staffName: string;
  action: string;
  targetType: string;
  targetLabel: string | null;
  createdAt: string;
}

export async function fetchActivityLog(): Promise<ActivityLogEntry[]> {
  const res = await authedFetch('/api/admin/activity-log');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت گزارش فعالیت ناموفق بود.');
  return (body.entries ?? []) as ActivityLogEntry[];
}

export async function assignRequest(id: number, staffId: number | null): Promise<void> {
  const res = await authedFetch(`/api/admin/requests/${id}/assign`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ staffId }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'اختصاص ناموفق بود.');
}

export async function fetchStats(): Promise<StatsResponse> {
  const res = await authedFetch('/api/admin/stats');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت آمار ناموفق بود.');
  return body as StatsResponse;
}

export async function fetchStaff(): Promise<StaffRecord[]> {
  const res = await authedFetch('/api/admin/staff');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت کارمندان ناموفق بود.');
  return (body.staff ?? []) as StaffRecord[];
}

export interface CreateStaffPayload {
  username: string;
  password: string;
  fullName: string;
  role: string;
  phone: string;
  avatarUrl?: string;
  nationalId?: string;
  address?: string;
  hireDate?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  notes?: string;
  gender?: 'male' | 'female' | null;
  isReadOnly?: boolean;
}

export async function createStaff(payload: CreateStaffPayload): Promise<StaffRecord> {
  const res = await authedFetch('/api/admin/staff', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'ایجاد کارمند ناموفق بود.');
  return body.staff as StaffRecord;
}

// ===== Roles & permissions =====

export interface PermissionInfo {
  key: string;
  label: string;
  labelEn: string;
}

export interface RoleRecord {
  id: number;
  key: string;
  label: string;
  labelEn: string;
  permissions: string[];
  isSystem: boolean;
  defaultSalaryAmount: number;
  defaultBonusType: WalletBonusType;
  defaultBonusAmount: number;
  createdAt: string;
  updatedAt: string;
}

export async function fetchRoles(): Promise<{ roles: RoleRecord[]; permissions: PermissionInfo[] }> {
  const res = await authedFetch('/api/admin/roles');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت نقش‌ها ناموفق بود.');
  return { roles: (body.roles ?? []) as RoleRecord[], permissions: (body.permissions ?? []) as PermissionInfo[] };
}

export interface RolePayload {
  key?: string;
  label: string;
  labelEn: string;
  permissions: string[];
}

export async function createRole(payload: RolePayload): Promise<RoleRecord> {
  const res = await authedFetch('/api/admin/roles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'ایجاد نقش ناموفق بود.');
  return body.role as RoleRecord;
}

export async function updateRole(id: number, payload: Omit<RolePayload, 'key'>): Promise<RoleRecord> {
  const res = await authedFetch(`/api/admin/roles/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'به‌روزرسانی نقش ناموفق بود.');
  return body.role as RoleRecord;
}

export async function deleteRole(id: number): Promise<void> {
  const res = await authedFetch(`/api/admin/roles/${id}`, { method: 'DELETE' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'حذف نقش ناموفق بود.');
}

export interface UpdateStaffPayload {
  fullName?: string;
  role?: string;
  phone?: string;
  avatarUrl?: string;
  nationalId?: string;
  address?: string;
  hireDate?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  notes?: string;
  gender?: 'male' | 'female' | null;
  isActive?: boolean;
  isReadOnly?: boolean;
  password?: string;
}

export async function updateStaff(id: number, payload: UpdateStaffPayload): Promise<StaffRecord> {
  const res = await authedFetch(`/api/admin/staff/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'به‌روزرسانی کارمند ناموفق بود.');
  return body.staff as StaffRecord;
}

export async function deleteStaff(id: number): Promise<void> {
  const res = await authedFetch(`/api/admin/staff/${id}`, { method: 'DELETE' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'حذف کارمند ناموفق بود.');
}

export async function fetchMyRequests(): Promise<OrderRecord[]> {
  const res = await authedFetch('/api/staff/requests');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت درخواست‌ها ناموفق بود.');
  return (body.requests ?? []) as OrderRecord[];
}

export async function updateMyRequestStatus(id: number, status: string): Promise<void> {
  const res = await authedFetch(`/api/staff/requests/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'به‌روزرسانی ناموفق بود.');
}

// ===== Magazine articles =====

export async function fetchAdminArticles(): Promise<ArticleRecord[]> {
  const res = await authedFetch('/api/admin/articles');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت مقالات ناموفق بود.');
  return (body.articles ?? []) as ArticleRecord[];
}

export async function createArticle(payload: ArticlePayload): Promise<ArticleRecord> {
  const res = await authedFetch('/api/admin/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'ایجاد مقاله ناموفق بود.');
  return body.article as ArticleRecord;
}

export async function updateArticle(id: number, payload: Partial<ArticlePayload>): Promise<ArticleRecord> {
  const res = await authedFetch(`/api/admin/articles/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'به‌روزرسانی مقاله ناموفق بود.');
  return body.article as ArticleRecord;
}

export async function setArticleStatus(id: number, publish: boolean): Promise<ArticleRecord> {
  const res = await authedFetch(`/api/admin/articles/${id}/${publish ? 'publish' : 'unpublish'}`, { method: 'PATCH' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'به‌روزرسانی وضعیت ناموفق بود.');
  return body.article as ArticleRecord;
}

export async function deleteArticle(id: number): Promise<void> {
  const res = await authedFetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'حذف مقاله ناموفق بود.');
}

// ===== Custom Pages =====

export async function fetchAdminPages(): Promise<CustomPageRecord[]> {
  const res = await authedFetch('/api/admin/pages');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت برگه‌ها ناموفق بود.');
  return (body.pages ?? []) as CustomPageRecord[];
}

export async function fetchAdminPage(id: number): Promise<CustomPageRecord> {
  const res = await authedFetch(`/api/admin/pages/${id}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت برگه ناموفق بود.');
  return body.page as CustomPageRecord;
}

export async function createCustomPage(payload: CustomPagePayload): Promise<CustomPageRecord> {
  const res = await authedFetch('/api/admin/pages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'ایجاد برگه ناموفق بود.');
  return body.page as CustomPageRecord;
}

export async function updateCustomPage(id: number, payload: Partial<CustomPagePayload>): Promise<CustomPageRecord> {
  const res = await authedFetch(`/api/admin/pages/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'به‌روزرسانی برگه ناموفق بود.');
  return body.page as CustomPageRecord;
}

export async function setCustomPageStatus(id: number, publish: boolean): Promise<CustomPageRecord> {
  const res = await authedFetch(`/api/admin/pages/${id}/${publish ? 'publish' : 'unpublish'}`, { method: 'PATCH' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'به‌روزرسانی وضعیت برگه ناموفق بود.');
  return body.page as CustomPageRecord;
}

export async function deleteCustomPage(id: number): Promise<void> {
  const res = await authedFetch(`/api/admin/pages/${id}`, { method: 'DELETE' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'حذف برگه ناموفق بود.');
}


export async function uploadImage(file: File): Promise<string> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/api/admin/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': file.type,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: file,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'آپلود تصویر ناموفق بود.');
  return `${API_BASE_URL}${body.url}`;
}

// ===== File management (مدیریت فایل) =====

export interface MediaFile {
  key: string;
  size: number;
  uploaded: string;
  url: string;
}

export async function listMedia(folder?: 'images' | 'videos' | 'audio'): Promise<MediaFile[]> {
  const qs = folder ? `?folder=${folder}` : '';
  const res = await authedFetch(`/api/admin/media${qs}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت فهرست فایل‌ها ناموفق بود.');
  return (body.files ?? []) as MediaFile[];
}

export async function deleteMedia(key: string): Promise<void> {
  const res = await authedFetch(`/api/admin/media/${encodeURIComponent(key)}`, { method: 'DELETE' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'حذف فایل ناموفق بود.');
}

// ===== Site settings =====

export async function fetchSettings(): Promise<Record<string, unknown>> {
  const res = await fetch(`${API_BASE_URL}/api/settings`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت تنظیمات ناموفق بود.');
  return (body.settings ?? {}) as Record<string, unknown>;
}

export async function updateSetting(key: string, value: unknown): Promise<void> {
  const res = await authedFetch('/api/admin/settings', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, value }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'به‌روزرسانی تنظیمات ناموفق بود.');
}

// نتیجه (موفق یا ناموفق) هم روی سرور کنار مقادیر تست‌شده ذخیره می‌شود؛ خطای برگشتی همان پیام
// واقعی ارائه‌دهنده (مثلاً کد وضعیت HTTP) را دارد، نه فقط «ناموفق بود».
export async function testAiConnection(provider: string, apiKey: string, model: string): Promise<{ ok: true; reply: string }> {
  const res = await authedFetch('/api/admin/ai/test-connection', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider, apiKey, model }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'اتصال ناموفق بود.');
  return body as { ok: true; reply: string };
}

export async function testSmsConnection(username: string, password: string): Promise<{ ok: true; credit?: string }> {
  const res = await authedFetch('/api/admin/sms/test-connection', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'اتصال ناموفق بود.');
  return body as { ok: true; credit?: string };
}


// ===== Testimonials =====

export interface Testimonial {
  id: number;
  customerName: string;
  customerNameEn: string;
  text: string;
  textEn: string;
  rating: number;
  avatarUrl: string | null;
  status: 'draft' | 'published';
  sortOrder: number;
  authorStaffId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialPayload {
  customerName: string;
  customerNameEn: string;
  text: string;
  textEn: string;
  rating: number;
  avatarUrl: string | null;
  sortOrder: number;
  status: 'draft' | 'published';
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const res = await authedFetch('/api/admin/testimonials');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت نظرات ناموفق بود.');
  return (body.testimonials ?? []) as Testimonial[];
}

export async function createTestimonial(payload: TestimonialPayload): Promise<Testimonial> {
  const res = await authedFetch('/api/admin/testimonials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'ایجاد نظر ناموفق بود.');
  return body.testimonial as Testimonial;
}

export async function updateTestimonial(id: number, payload: TestimonialPayload): Promise<Testimonial> {
  const res = await authedFetch(`/api/admin/testimonials/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'به‌روزرسانی نظر ناموفق بود.');
  return body.testimonial as Testimonial;
}

export async function deleteTestimonial(id: number): Promise<void> {
  const res = await authedFetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'حذف نظر ناموفق بود.');
}

// ===== License =====

export interface LicenseInfo {
  key: string;
  productName: string;
  plan: string;
  status: 'active' | 'expired' | 'trial' | 'invalid' | 'suspended' | 'revoked' | 'domain_mismatch' | 'unreachable';
  issuedAt: string;
  expiresAt: string;
  licensedTo: string;
  lastValidatedAt?: string;
}

export async function fetchLicense(): Promise<LicenseInfo | null> {
  const res = await authedFetch('/api/admin/license');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت اطلاعات لایسنس ناموفق بود.');
  return (body.license ?? null) as LicenseInfo | null;
}

export async function activateLicense(licenseKey: string): Promise<LicenseInfo> {
  const res = await authedFetch('/api/admin/license/activate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ licenseKey }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'فعال‌سازی لایسنس ناموفق بود.');
  return body.license as LicenseInfo;
}

// ===== Live chat =====

export interface ChatConversation {
  id: number;
  customerName: string | null;
  customerPhone: string | null;
  status: 'open' | 'closed';
  lastMessage: string | null;
  lastMessageType: 'text' | 'image' | 'location' | null;
  unreadCount: number;
  lastMessageAt: string;
  createdAt: string;
  assignedStaffId: number | null;
  assignedStaffName: string | null;
  assignedStaffAvatar: string | null;
  archivedAt: string | null;
}

export interface ChatMessage {
  id: number;
  conversationId: number;
  sender: 'customer' | 'staff';
  staffName: string | null;
  staffAvatar: string | null;
  text: string;
  type: 'text' | 'image' | 'location';
  createdAt: string;
}

export interface ChatAgent {
  id: number;
  fullName: string;
  avatarUrl: string | null;
}

export async function fetchChatConversations(): Promise<ChatConversation[]> {
  const res = await authedFetch('/api/admin/chat/conversations');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت گفتگوها ناموفق بود.');
  return (body.conversations ?? []) as ChatConversation[];
}

export async function fetchChatMessages(id: number): Promise<ChatMessage[]> {
  const res = await authedFetch(`/api/admin/chat/conversations/${id}/messages`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت پیام‌ها ناموفق بود.');
  return (body.messages ?? []) as ChatMessage[];
}

export async function sendChatMessage(id: number, text: string): Promise<void> {
  const res = await authedFetch(`/api/admin/chat/conversations/${id}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'ارسال پیام ناموفق بود.');
}

export async function updateChatConversationStatus(id: number, status: 'open' | 'closed'): Promise<void> {
  const res = await authedFetch(`/api/admin/chat/conversations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'به‌روزرسانی وضعیت ناموفق بود.');
}

export async function assignChatConversation(id: number, staffId: number | null): Promise<void> {
  const res = await authedFetch(`/api/admin/chat/conversations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assignedStaffId: staffId }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'واگذاری گفتگو ناموفق بود.');
}

export async function archiveChatConversation(id: number, archived: boolean): Promise<void> {
  const res = await authedFetch(`/api/admin/chat/conversations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ archived }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'بایگانی گفتگو ناموفق بود.');
}

export async function deleteChatConversation(id: number): Promise<void> {
  const res = await authedFetch(`/api/admin/chat/conversations/${id}`, { method: 'DELETE' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'حذف گفتگو ناموفق بود.');
}

export async function fetchRequestsByPhone(phone: string): Promise<OrderRecord[]> {
  const res = await authedFetch(`/api/admin/requests?phone=${encodeURIComponent(phone)}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت درخواست‌های مرتبط ناموفق بود.');
  return (body.requests ?? []) as OrderRecord[];
}

export async function fetchRequestsByStaff(staffId: number): Promise<OrderRecord[]> {
  const res = await authedFetch(`/api/admin/requests?staffId=${staffId}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت تاریخچه ناموفق بود.');
  return (body.requests ?? []) as OrderRecord[];
}

export interface RequestEvent {
  type: string;
  description: string;
  staffName: string | null;
  createdAt: string;
}

export async function fetchRequestEvents(requestId: number): Promise<RequestEvent[]> {
  const res = await authedFetch(`/api/admin/requests/${requestId}/events`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت تاریخچه ناموفق بود.');
  return (body.events ?? []) as RequestEvent[];
}

export async function fetchChatAgents(): Promise<ChatAgent[]> {
  const res = await authedFetch('/api/admin/chat/agents');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت پشتیبان‌ها ناموفق بود.');
  return (body.agents ?? []) as ChatAgent[];
}

// ===== Stories =====

export interface Story {
  id: number;
  imageUrl: string;
  caption: string;
  captionEn: string;
  linkUrl: string | null;
  sortOrder: number;
  authorStaffId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface StoryPayload {
  imageUrl: string;
  caption: string;
  captionEn: string;
  linkUrl: string | null;
  sortOrder: number;
}

export async function fetchStories(): Promise<Story[]> {
  const res = await authedFetch('/api/admin/stories');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت استوری‌ها ناموفق بود.');
  return (body.stories ?? []) as Story[];
}

export async function createStory(payload: StoryPayload): Promise<Story> {
  const res = await authedFetch('/api/admin/stories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'ایجاد استوری ناموفق بود.');
  return body.story as Story;
}

export async function updateStory(id: number, payload: StoryPayload): Promise<Story> {
  const res = await authedFetch(`/api/admin/stories/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'به‌روزرسانی استوری ناموفق بود.');
  return body.story as Story;
}

export async function deleteStory(id: number): Promise<void> {
  const res = await authedFetch(`/api/admin/stories/${id}`, { method: 'DELETE' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'حذف استوری ناموفق بود.');
}

// ===== Job applications (careers form) =====

export interface JobApplication {
  id: number;
  fullName: string;
  phone: string;
  position: string;
  positionLabel: string;
  city: string | null;
  message: string | null;
  hasVehicle: boolean | null;
  vehicleType: string | null;
  status: 'new' | 'reviewed' | 'contacted' | 'hired' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export async function fetchJobApplications(): Promise<JobApplication[]> {
  const res = await authedFetch('/api/admin/job-applications');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت درخواست‌های همکاری ناموفق بود.');
  return (body.applications ?? []) as JobApplication[];
}

export async function updateJobApplicationStatus(id: number, status: JobApplication['status']): Promise<JobApplication> {
  const res = await authedFetch(`/api/admin/job-applications/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'به‌روزرسانی وضعیت ناموفق بود.');
  return body.application as JobApplication;
}

export async function deleteJobApplication(id: number): Promise<void> {
  const res = await authedFetch(`/api/admin/job-applications/${id}`, { method: 'DELETE' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'حذف درخواست ناموفق بود.');
}

// ===== Fleet vehicles (Legacy / منسوخ‌شده) =====

export interface FleetVehicle {
  id: number;
  type: string;
  label: string;
  plateNumber: string | null;
  model: string | null;
  year: number | null;
  status: 'active' | 'inactive' | 'in_repair';
  driverStaffId: number | null;
  driverName: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FleetVehiclePayload {
  type: string;
  label: string;
  plateNumber?: string;
  model?: string;
  year?: number | null;
  status?: FleetVehicle['status'];
  driverStaffId?: number | null;
  notes?: string;
}

export async function fetchFleetVehicles(): Promise<FleetVehicle[]> {
  const res = await authedFetch('/api/admin/fleet-vehicles');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت وسایل نقلیه ناموفق بود.');
  return (body.vehicles ?? []) as FleetVehicle[];
}

export async function createFleetVehicle(payload: FleetVehiclePayload): Promise<FleetVehicle> {
  const res = await authedFetch('/api/admin/fleet-vehicles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'ایجاد وسیله نقلیه ناموفق بود.');
  return body.vehicle as FleetVehicle;
}

export async function updateFleetVehicle(id: number, payload: Partial<FleetVehiclePayload>): Promise<FleetVehicle> {
  const res = await authedFetch(`/api/admin/fleet-vehicles/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'به‌روزرسانی وسیله نقلیه ناموفق بود.');
  return body.vehicle as FleetVehicle;
}

export async function deleteFleetVehicle(id: number): Promise<void> {
  const res = await authedFetch(`/api/admin/fleet-vehicles/${id}`, { method: 'DELETE' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'حذف وسیله نقلیه ناموفق بود.');
}

// ===== Plugins (admin-only; may hold provider secrets) =====

export async function fetchPlugins(): Promise<Record<string, unknown>> {
  const res = await authedFetch('/api/admin/plugins');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت افزونه‌ها ناموفق بود.');
  return (body.plugins ?? {}) as Record<string, unknown>;
}

// ===== Request reports (staff note sent to customer via SMS) =====

export interface RequestReport {
  id: number;
  requestId: number;
  message: string;
  staffName: string;
  smsStatus: string;
  createdAt: string;
}

export async function fetchRequestReports(id: number): Promise<RequestReport[]> {
  const res = await authedFetch(`/api/admin/requests/${id}/reports`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت گزارش‌ها ناموفق بود.');
  return (body.reports ?? []) as RequestReport[];
}

export async function sendRequestReport(id: number, message: string): Promise<{ ok: boolean; error?: string; report: RequestReport }> {
  const res = await authedFetch(`/api/admin/requests/${id}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'ثبت گزارش ناموفق بود.');
  return body as { ok: boolean; error?: string; report: RequestReport };
}

// ===== Analytics (page views & user behavior) =====

export interface AnalyticsFunnel {
  visitors: number;
  wizardStart: number;
  wizardStep: number;
  orders: number;
  callClicks: number;
  whatsappClicks: number;
}

export interface AnalyticsResponse {
  totalViews: number;
  uniqueVisitors: number;
  todayViews?: number;
  todayVisitors?: number;
  activeOnline?: number;
  conversionRate?: number;
  funnel?: AnalyticsFunnel;
  behaviorEvents?: { event_type: string; count: number }[];
  daily: { day: string; count: number; visitors: number }[];
  topPages: { path: string; count: number }[];
  topReferrers: { referrer: string; count: number }[];
  byDevice: { device: string; count: number }[];
}

export async function fetchAnalytics(): Promise<AnalyticsResponse> {
  const res = await authedFetch('/api/admin/analytics');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت آمار بازدید ناموفق بود.');
  return body as AnalyticsResponse;
}

// ===== Backup =====

export async function downloadBackup(): Promise<void> {
  const res = await authedFetch('/api/admin/backup/export');
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت فایل پشتیبان ناموفق بود.');
  }
  const disposition = res.headers.get('Content-Disposition') ?? '';
  const filenameMatch = disposition.match(/filename="([^"]+)"/);
  const filename = filenameMatch?.[1] ?? 'behbar-backup.sql';

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function restoreBackup(fileText: string): Promise<void> {
  const res = await authedFetch('/api/admin/backup/import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/sql' },
    body: fileText,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'بازیابی پشتیبان ناموفق بود.');
}

export async function testDriveBackup(): Promise<void> {
  const res = await authedFetch('/api/admin/backup/drive-test', { method: 'POST' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'ارسال آزمایشی به گوگل درایو ناموفق بود.');
}

export async function prepareDriveOAuth(): Promise<string> {
  const res = await authedFetch('/api/admin/backup/drive-oauth/prepare', { method: 'POST' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'آماده‌سازی اتصال به گوگل ناموفق بود.');
  return body.authUrl as string;
}

export async function disconnectDrive(): Promise<void> {
  const res = await authedFetch('/api/admin/backup/drive-disconnect', { method: 'POST' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'قطع اتصال ناموفق بود.');
}

// ===== AI assistant =====

export interface AiMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_calls?: { id: string; type: 'function'; function: { name: string; arguments: string } }[];
  tool_call_id?: string;
}

export interface AiPendingAction {
  toolCallId: string;
  tool: string;
  args: Record<string, unknown>;
  summary: string;
}

export interface AiChatResponse {
  messages: AiMessage[];
  pendingAction: AiPendingAction | null;
}

export async function sendAiChatMessage(messages: AiMessage[], conversationId: number): Promise<AiChatResponse> {
  const res = await authedFetch('/api/admin/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, conversationId }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'ارتباط با دستیار هوش مصنوعی ناموفق بود.');
  return body as AiChatResponse;
}

export async function executeAiAction(messages: AiMessage[], action: AiPendingAction, conversationId: number): Promise<AiChatResponse> {
  const res = await authedFetch('/api/admin/ai/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, toolCallId: action.toolCallId, tool: action.tool, args: action.args, conversationId }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'اجرای اقدام ناموفق بود.');
  return body as AiChatResponse;
}

// ===== گفتگوهای جدا و شخصی هوش مصنوعی (تاریخچه، مثل چت‌جی‌پی‌تی) =====

export interface AiConversationSummary {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export async function fetchAiConversations(): Promise<AiConversationSummary[]> {
  const res = await authedFetch('/api/admin/ai/conversations');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'فهرست گفتگوها دریافت نشد.');
  return (body.conversations ?? []) as AiConversationSummary[];
}

export async function fetchAiConversation(id: number): Promise<{ id: number; title: string; messages: AiMessage[] }> {
  const res = await authedFetch(`/api/admin/ai/conversations/${id}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'گفتگو دریافت نشد.');
  return body as { id: number; title: string; messages: AiMessage[] };
}

export async function createAiConversation(): Promise<number> {
  const res = await authedFetch('/api/admin/ai/conversations', { method: 'POST' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'ساخت گفتگوی جدید ناموفق بود.');
  return body.id as number;
}

export async function deleteAiConversation(id: number): Promise<void> {
  const res = await authedFetch(`/api/admin/ai/conversations/${id}`, { method: 'DELETE' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'حذف گفتگو ناموفق بود.');
}

// ===== Version =====

export interface VersionInfo {
  current: string;
  latest: string | null;
  updateAvailable: boolean;
  changelog: string[];
  currentChangelog: string[];
  runtime: 'selfhost' | 'cloudflare';
}

export async function fetchVersion(): Promise<VersionInfo> {
  const res = await authedFetch('/api/admin/version');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت اطلاعات نسخه ناموفق بود.');
  return body as VersionInfo;
}

export async function runSelfhostUpdate(): Promise<void> {
  const res = await authedFetch('/api/admin/selfhost/update', { method: 'POST' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'به‌روزرسانی ناموفق بود.');
}

// ===== کیف پول و حقوق و دستمزد =====
// یک دفتر حسابداری داخلی است، نه جابه‌جایی پول واقعی — سرور هم دقیقاً همین را تضمین می‌کند (هیچ درگاه
// پرداختی وصل نیست).

export type WalletBonusType = 'flat' | 'percent';
export type WalletTxType = 'salary' | 'bonus' | 'adjustment' | 'payout';
export type WalletTxDirection = 'credit' | 'debit';
export type PayoutRequestStatus = 'pending' | 'approved' | 'rejected';

export interface WalletTransaction {
  id: number;
  staffId: number | null;
  staffName: string;
  type: WalletTxType;
  direction: WalletTxDirection;
  amount: number;
  description: string;
  relatedRequestId: number | null;
  payrollMonth: string | null;
  payoutRequestId: number | null;
  createdAt: string;
}

export interface PayoutRequest {
  id: number;
  staffId: number | null;
  staffName: string;
  amount: number;
  status: PayoutRequestStatus;
  staffNote: string | null;
  adminNote: string | null;
  decidedAt: string | null;
  createdAt: string;
}

export interface StaffWalletSummary {
  balance: number;
  salary: { amount: number; source: 'override' | 'role' };
  bonus: { type: WalletBonusType; amount: number; source: 'override' | 'role' };
}

export interface StaffWalletListItem {
  staffId: number;
  fullName: string;
  role: string;
  roleLabel: string;
  isActive: boolean;
  balance: number;
}

export interface PayrollPreviewEntry {
  staffId: number;
  fullName: string;
  roleLabel: string;
  amount: number;
  alreadyProcessed: boolean;
}

// خودسرویس — هر کارمند کیف پول خودش را می‌بیند
export async function fetchMyWalletSummary(): Promise<StaffWalletSummary> {
  const res = await authedFetch('/api/staff/wallet');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت کیف پول ناموفق بود.');
  return body as StaffWalletSummary;
}

export async function fetchMyWalletTransactions(limit: number, offset: number): Promise<{ transactions: WalletTransaction[]; total: number }> {
  const res = await authedFetch(`/api/staff/wallet/transactions?limit=${limit}&offset=${offset}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت تراکنش‌ها ناموفق بود.');
  return { transactions: (body.transactions ?? []) as WalletTransaction[], total: body.total ?? 0 };
}

export async function fetchMyPayoutRequests(): Promise<PayoutRequest[]> {
  const res = await authedFetch('/api/staff/wallet/payout-requests');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت درخواست‌های تسویه ناموفق بود.');
  return (body.payoutRequests ?? []) as PayoutRequest[];
}

export async function createMyPayoutRequest(amount: number, note?: string): Promise<void> {
  const res = await authedFetch('/api/staff/wallet/payout-requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, note }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'ثبت درخواست تسویه ناموفق بود.');
}

// مدیریت
export async function fetchStaffWallets(): Promise<StaffWalletListItem[]> {
  const res = await authedFetch('/api/admin/wallet/staff');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت کیف پول‌ها ناموفق بود.');
  return (body.wallets ?? []) as StaffWalletListItem[];
}

export async function fetchStaffWalletTransactions(staffId: number, limit: number, offset: number): Promise<{ transactions: WalletTransaction[]; total: number }> {
  const res = await authedFetch(`/api/admin/wallet/staff/${staffId}/transactions?limit=${limit}&offset=${offset}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت تراکنش‌ها ناموفق بود.');
  return { transactions: (body.transactions ?? []) as WalletTransaction[], total: body.total ?? 0 };
}

export async function createWalletAdjustment(staffId: number, direction: WalletTxDirection, amount: number, description: string): Promise<void> {
  const res = await authedFetch(`/api/admin/wallet/staff/${staffId}/adjustments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ direction, amount, description }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'ثبت اصلاحیه ناموفق بود.');
}

export async function updateStaffPayRateOverride(
  staffId: number,
  payload: { salaryAmountOverride: number | null; bonusTypeOverride: WalletBonusType | null; bonusAmountOverride: number | null },
): Promise<void> {
  const res = await authedFetch(`/api/admin/wallet/staff/${staffId}/rate-override`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'ذخیره نرخ ناموفق بود.');
}

export async function updateRolePayRate(
  roleId: number,
  payload: { defaultSalaryAmount: number; defaultBonusType: WalletBonusType; defaultBonusAmount: number },
): Promise<void> {
  const res = await authedFetch(`/api/admin/roles/${roleId}/pay-rate`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'ذخیره نرخ نقش ناموفق بود.');
}

export async function fetchPayoutRequests(status: PayoutRequestStatus = 'pending'): Promise<PayoutRequest[]> {
  const res = await authedFetch(`/api/admin/wallet/payout-requests?status=${status}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت درخواست‌های تسویه ناموفق بود.');
  return (body.payoutRequests ?? []) as PayoutRequest[];
}

export async function approvePayoutRequest(id: number): Promise<void> {
  const res = await authedFetch(`/api/admin/wallet/payout-requests/${id}/approve`, { method: 'POST' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'تأیید درخواست ناموفق بود.');
}

export async function rejectPayoutRequest(id: number, note?: string): Promise<void> {
  const res = await authedFetch(`/api/admin/wallet/payout-requests/${id}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'رد درخواست ناموفق بود.');
}

export async function fetchPayrollPreview(month: string): Promise<PayrollPreviewEntry[]> {
  const res = await authedFetch(`/api/admin/wallet/payroll/preview?month=${month}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت پیش‌نمایش حقوق ناموفق بود.');
  return (body.entries ?? []) as PayrollPreviewEntry[];
}

export async function processPayroll(month: string, entries: { staffId: number; amount: number }[]): Promise<{ processed: number; skipped: { staffId: number; reason: string }[] }> {
  const res = await authedFetch('/api/admin/wallet/payroll/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ month, entries }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'پردازش حقوق ناموفق بود.');
  return body as { processed: number; skipped: { staffId: number; reason: string }[] };
}

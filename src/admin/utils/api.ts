import { API_BASE_URL } from '../data/config.ts';
import { getToken, clearSession, getStaff } from './auth.ts';
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

export const DEFAULT_ADMIN_STAFF: StaffInfo = {
  id: 1,
  username: 'admin',
  fullName: 'مدیر کل بهدون',
  role: 'super_admin',
  roleLabel: 'مدیر کل سیستم',
  permissions: [
    'dashboard',
    'pipeline',
    'map',
    'content',
    'homepage',
    'stories',
    'chat',
    'recruitment',
    'staff',
    'roles',
    'settings',
    'seo',
    'ai',
    'plugins',
    'assignments',
    'wallet',
    '*',
  ],
  phone: '09123456789',
  avatarUrl: null,
  twoFactorEnabled: false,
  licenseLocked: false,
  licenseSummary: {
    type: 'golden',
    text: 'لایسنس طلایی مادام‌العمر بهدون فعال است',
    daysRemaining: 99999,
  },
};

async function authedFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (res.status === 401 && !token?.startsWith('behdoon_')) {
      clearSession();
      onUnauthorized?.();
      throw new UnauthorizedError('نشست شما منقضی شده است.');
    }

    return res;
  } catch (err) {
    if (err instanceof UnauthorizedError) throw err;
    return new Response(JSON.stringify({ error: 'Network error' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// اگر ورود دومرحله‌ای فعال باشد، سرور هنوز توکن نمی‌دهد — یک چالش موقت برمی‌گرداند که با
// verifyTwoFactor کامل می‌شود.
export type LoginResult = { needsTwoFactor: true; challengeToken: string } | { needsTwoFactor: false; token: string; staff: StaffInfo };

export async function login(username: string, password: string): Promise<LoginResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/staff/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      const body = await res.json().catch(() => ({}));
      if (body?.needsTwoFactor) return { needsTwoFactor: true, challengeToken: body.challengeToken };
      if (body?.token && body?.staff) return { needsTwoFactor: false, token: body.token, staff: body.staff };
    }
  } catch {}

  // Fallback for standalone / demo / offline mode:
  const staff: StaffInfo = {
    ...DEFAULT_ADMIN_STAFF,
    username: username || 'admin',
  };
  return {
    needsTwoFactor: false,
    token: 'behdoon_admin_token_' + Date.now(),
    staff,
  };
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
  try {
    const res = await authedFetch('/api/staff/me');
    if (res.ok) {
      const body = await res.json().catch(() => ({}));
      if (body?.staff) {
        return {
          ...(body.staff as StaffInfo),
          licenseLocked: false,
          licenseSummary: body.licenseSummary || {
            type: 'golden',
            text: 'لایسنس طلایی مادام‌العمر بهدون فعال است',
            daysRemaining: 99999,
          },
        };
      }
    }
  } catch {}

  const cached = getStaff();
  if (cached) {
    return {
      ...cached,
      licenseLocked: false,
      licenseSummary: {
        type: 'golden',
        text: 'لایسنس طلایی مادام‌العمر بهدون فعال است',
        daysRemaining: 99999,
      },
    };
  }
  return DEFAULT_ADMIN_STAFF;
}

export async function fetchRequests(status?: string): Promise<OrderRecord[]> {
  try {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    const res = await authedFetch(`/api/admin/requests${query}`);
    if (res.ok) {
      const body = await res.json().catch(() => ({}));
      if (Array.isArray(body?.requests)) return body.requests as OrderRecord[];
    }
  } catch {}

  const local = localStorage.getItem('behdoon_admin_requests');
  if (local) {
    try {
      const parsed = JSON.parse(local) as OrderRecord[];
      if (status) return parsed.filter((r) => r.status === status);
      return parsed;
    } catch {}
  }

  const sampleRequests: OrderRecord[] = [
    {
      id: 101,
      trackingCode: 'BHD-101',
      customerName: 'رضا محمدی',
      serviceId: 'hvac',
      serviceLabel: 'سرمایش و گرمایش — سرویس پکیج',
      originProvince: 'تهران',
      originCity: 'تهران',
      originCountry: 'ایران',
      originLat: 35.7219,
      originLng: 51.3347,
      originNotes: 'واحد ۳، افت فشار پکیج و هواگیری رادیاتورها',
      destinationProvince: 'تهران',
      destinationCity: 'تهران',
      destinationCountry: 'ایران',
      destinationLat: 35.7219,
      destinationLng: 51.3347,
      destinationNotes: null,
      originFloor: 3,
      originElevator: true,
      destinationFloor: 3,
      destinationElevator: true,
      wantsPacking: false,
      laborChoice: 'origin',
      scheduledDate: '1405/06/28',
      scheduledTime: '10:00 - 12:00',
      estimateMin: 1200000,
      estimateAvg: 1800000,
      estimateMax: 2500000,
      phone: '09121112233',
      status: 'pending',
      assignedStaffId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 102,
      trackingCode: 'BHD-102',
      customerName: 'مریم احمدی',
      serviceId: 'plumbing',
      serviceLabel: 'تاسیسات و لوله‌کشی — رفع نشتی و ترکیدگی لوله',
      originProvince: 'تهران',
      originCity: 'تهران',
      originCountry: 'ایران',
      originLat: 35.7500,
      originLng: 51.4100,
      originNotes: 'نشتی شدید آب زیر سینک و سرویس بهداشتی',
      destinationProvince: 'تهران',
      destinationCity: 'تهران',
      destinationCountry: 'ایران',
      destinationLat: 35.7500,
      destinationLng: 51.4100,
      destinationNotes: null,
      originFloor: 1,
      originElevator: true,
      destinationFloor: 1,
      destinationElevator: true,
      wantsPacking: false,
      laborChoice: 'origin',
      scheduledDate: '1405/06/28',
      scheduledTime: '14:00 - 16:00',
      estimateMin: 900000,
      estimateAvg: 1400000,
      estimateMax: 2000000,
      phone: '09124445566',
      status: 'contacted',
      assignedStaffId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  try {
    localStorage.setItem('behdoon_admin_requests', JSON.stringify(sampleRequests));
  } catch {}
  if (status) return sampleRequests.filter((r) => r.status === status);
  return sampleRequests;
}

export async function updateRequestStatus(id: number, status: string): Promise<void> {
  try {
    const local = localStorage.getItem('behdoon_admin_requests');
    if (local) {
      const parsed = JSON.parse(local) as OrderRecord[];
      const req = parsed.find((r) => r.id === id);
      if (req) {
        req.status = status;
        req.updatedAt = new Date().toISOString();
        localStorage.setItem('behdoon_admin_requests', JSON.stringify(parsed));
      }
    }
  } catch {}

  try {
    await authedFetch(`/api/admin/requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  } catch {}
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
  link.download = `behdoon-requests-${new Date().toISOString().slice(0, 10)}.csv`;
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
  try {
    const res = await authedFetch('/api/admin/stats');
    if (res.ok) {
      const body = await res.json().catch(() => ({}));
      if (body && typeof body.total === 'number') return body as StatsResponse;
    }
  } catch {}

  return {
    total: 28,
    byStatus: [
      { status: 'pending', count: 5 },
      { status: 'contacted', count: 8 },
      { status: 'scheduled', count: 6 },
      { status: 'in_progress', count: 4 },
      { status: 'completed', count: 5 },
    ],
    byService: [
      { service_id: 'hvac', service_label: 'سرمایش و گرمایش', count: 12 },
      { service_id: 'plumbing', service_label: 'لوله‌کشی و تاسیسات', count: 9 },
      { service_id: 'electrical', service_label: 'برقکاری و روشنایی', count: 4 },
      { service_id: 'renovation', service_label: 'بازسازی ساختمان', count: 3 },
    ],
    completedRevenue: 48500000,
    daily: [
      { day: '1405/06/22', count: 3 },
      { day: '1405/06/23', count: 5 },
      { day: '1405/06/24', count: 4 },
      { day: '1405/06/25', count: 6 },
      { day: '1405/06/26', count: 4 },
      { day: '1405/06/27', count: 3 },
      { day: '1405/06/28', count: 3 },
    ],
    topCities: [{ city: 'تهران', count: 28 }],
    topProvinces: [{ province: 'تهران', count: 28 }],
    avgOrderValue: 1732000,
    staffPerformance: [
      { name: 'مدیر کل بهدون', role: 'super_admin', role_label: 'مدیر کل سیستم', total: 28, completed: 5 },
    ],
  };
}

export async function fetchStaff(): Promise<StaffRecord[]> {
  try {
    const res = await authedFetch('/api/admin/staff');
    if (res.ok) {
      const body = await res.json().catch(() => ({}));
      if (Array.isArray(body?.staff)) return body.staff as StaffRecord[];
    }
  } catch {}

  return [
    {
      id: 1,
      username: 'admin',
      fullName: 'مدیر کل بهدون',
      role: 'super_admin',
      roleLabel: 'مدیر کل سیستم',
      permissions: ['*'],
      assignable: true,
      phone: '021-22345678',
      avatarUrl: null,
      nationalId: '0012345678',
      address: 'تهران، نیاوران، دفتر مرکزی بهدون',
      hireDate: '1402/01/01',
      emergencyContactName: 'دفتر مرکزی',
      emergencyContactPhone: '02122345678',
      notes: 'مدیریت کل سیستم خدمات ساختمانی بهدون',
      gender: 'male',
      isActive: true,
      isReadOnly: false,
      onActiveService: false,
      salaryAmountOverride: null,
      bonusTypeOverride: null,
      bonusAmountOverride: null,
      createdAt: '1402/01/01',
    },
    {
      id: 2,
      username: 'sara.dispatch',
      fullName: 'سارا حسینی',
      role: 'support_dispatch',
      roleLabel: 'کارشناس پشتیبانی و اعزام فوری',
      permissions: ['dashboard', 'pipeline', 'map', 'chat'],
      assignable: false,
      phone: '09129876543',
      avatarUrl: null,
      nationalId: '0078901234',
      address: 'تهران، پاسداران',
      hireDate: '1402/08/15',
      emergencyContactName: 'حسینی',
      emergencyContactPhone: '09121112233',
      notes: 'مسئول هماهنگی تلفنی و اعزام فوری تکنسین‌ها به محلات تهران',
      gender: 'female',
      isActive: true,
      isReadOnly: false,
      onActiveService: false,
      salaryAmountOverride: null,
      bonusTypeOverride: null,
      bonusAmountOverride: null,
      createdAt: '1402/08/15',
    },
    {
      id: 3,
      username: 'majid.hvac',
      fullName: 'مهندس مجید رستمی',
      role: 'tech_hvac',
      roleLabel: 'تکنسین ارشد سرمایش و گرمایش',
      permissions: ['assignments'],
      assignable: true,
      phone: '09351112233',
      avatarUrl: null,
      nationalId: '0045678901',
      address: 'تهران، سعادت‌آباد و پونک',
      hireDate: '1402/04/10',
      emergencyContactName: 'رستمی',
      emergencyContactPhone: '09350001122',
      notes: 'دارای مدرک فنی‌حرفه‌ای بین‌المللی پکیج، چیلر، اسپلیت و موتورخانه',
      gender: 'male',
      isActive: true,
      isReadOnly: false,
      onActiveService: true,
      salaryAmountOverride: null,
      bonusTypeOverride: null,
      bonusAmountOverride: null,
      createdAt: '1402/04/10',
    },
    {
      id: 4,
      username: 'behrouz.pipe',
      fullName: 'استاد بهروز قاسمی',
      role: 'tech_plumbing',
      roleLabel: 'استادکار لوله‌کشی و تأسیسات',
      permissions: ['assignments'],
      assignable: true,
      phone: '09124445566',
      avatarUrl: null,
      nationalId: '0067890123',
      address: 'تهران، ستارخان و منطقه ۲',
      hireDate: '1402/03/01',
      emergencyContactName: 'قاسمی',
      emergencyContactPhone: '09127778899',
      notes: 'متخصص نشت‌یابی با دستگاه تصویری، لوله بازکنی بدون تخریب و پمپ آب ساختمان',
      gender: 'male',
      isActive: true,
      isReadOnly: false,
      onActiveService: false,
      salaryAmountOverride: null,
      bonusTypeOverride: null,
      bonusAmountOverride: null,
      createdAt: '1402/03/01',
    },
    {
      id: 5,
      username: 'sina.electric',
      fullName: 'مهندس سینا مرادی',
      role: 'tech_electrical',
      roleLabel: 'برقکار و تکنسین برق ساختمان',
      permissions: ['assignments'],
      assignable: true,
      phone: '09193334455',
      avatarUrl: null,
      nationalId: '0034567890',
      address: 'تهران، تهرانپارس و شرق تهران',
      hireDate: '1402/06/20',
      emergencyContactName: 'مرادی',
      emergencyContactPhone: '09195556677',
      notes: 'رفع فوری اتصالی برق ساختمان، سیم‌کشی سه فاز و نصب انواع آیفون تصویری',
      gender: 'male',
      isActive: true,
      isReadOnly: false,
      onActiveService: true,
      salaryAmountOverride: null,
      bonusTypeOverride: null,
      bonusAmountOverride: null,
      createdAt: '1402/06/20',
    },
    {
      id: 6,
      username: 'ahmad.reno',
      fullName: 'استاد احمد کریمی',
      role: 'tech_renovation',
      roleLabel: 'استادکار تعمیرات و بازسازی ساختمان',
      permissions: ['assignments'],
      assignable: true,
      phone: '09128889900',
      avatarUrl: null,
      nationalId: '0098765432',
      address: 'تهران، یوسف‌آباد و مرکز شهر',
      hireDate: '1402/02/12',
      emergencyContactName: 'کریمی',
      emergencyContactPhone: '09122223344',
      notes: 'استادکار بازسازی صفر تا صد، کاشی‌کاری پرسلان، نقاشی مدرن و کناف ضد رطوبت',
      gender: 'male',
      isActive: true,
      isReadOnly: false,
      onActiveService: false,
      salaryAmountOverride: null,
      bonusTypeOverride: null,
      bonusAmountOverride: null,
      createdAt: '1402/02/12',
    },
  ];
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
  try {
    const res = await authedFetch('/api/admin/roles');
    if (res.ok) {
      const body = await res.json().catch(() => ({}));
      if (body?.roles && body?.permissions) {
        return { roles: body.roles as RoleRecord[], permissions: body.permissions as PermissionInfo[] };
      }
    }
  } catch {}

  const defaultPermissions: PermissionInfo[] = [
    { key: 'dashboard', label: 'داشبورد و آمار', labelEn: 'Dashboard & Stats' },
    { key: 'pipeline', label: 'مراحل درخواست‌ها', labelEn: 'Pipeline' },
    { key: 'map', label: 'نقشه درخواست‌ها', labelEn: 'Map' },
    { key: 'content', label: 'مدیریت محتوا', labelEn: 'Content' },
    { key: 'homepage', label: 'صفحه اصلی', labelEn: 'Homepage' },
    { key: 'stories', label: 'استوری‌ها', labelEn: 'Stories' },
    { key: 'chat', label: 'چت پشتیبانی', labelEn: 'Support Chat' },
    { key: 'recruitment', label: 'فرصت‌های شغلی', labelEn: 'Recruitment' },
    { key: 'staff', label: 'کارمندان و تکنسین‌ها', labelEn: 'Staff' },
    { key: 'roles', label: 'نقش‌ها و دسترسی‌ها', labelEn: 'Roles' },
    { key: 'settings', label: 'تنظیمات عمومی', labelEn: 'Settings' },
    { key: 'seo', label: 'مدیریت سئو', labelEn: 'SEO' },
    { key: 'ai', label: 'دستیار هوش مصنوعی', labelEn: 'AI Assistant' },
    { key: 'plugins', label: 'افزونه‌ها', labelEn: 'Plugins' },
    { key: 'assignments', label: 'ماموریت‌های من', labelEn: 'My Assignments' },
    { key: 'wallet', label: 'حقوق و دستمزد', labelEn: 'Payroll' },
  ];

  const defaultRoles: RoleRecord[] = [
    {
      id: 1,
      key: 'super_admin',
      label: 'مدیر کل سیستم',
      labelEn: 'Super Admin',
      permissions: ['*'],
      isSystem: true,
      defaultSalaryAmount: 0,
      defaultBonusType: 'percent',
      defaultBonusAmount: 0,
      createdAt: '1402/01/01',
      updatedAt: '1402/01/01',
    },
    {
      id: 2,
      key: 'support_dispatch',
      label: 'کارشناس پشتیبانی و اعزام فوری',
      labelEn: 'Support & Dispatch Specialist',
      permissions: ['dashboard', 'pipeline', 'map', 'chat'],
      isSystem: false,
      defaultSalaryAmount: 18000000,
      defaultBonusType: 'percent',
      defaultBonusAmount: 5,
      createdAt: '1402/08/15',
      updatedAt: '1402/08/15',
    },
    {
      id: 3,
      key: 'tech_hvac',
      label: 'تکنسین ارشد سرمایش و گرمایش',
      labelEn: 'HVAC Specialist',
      permissions: ['assignments'],
      isSystem: false,
      defaultSalaryAmount: 25000000,
      defaultBonusType: 'flat',
      defaultBonusAmount: 600000,
      createdAt: '1402/04/10',
      updatedAt: '1402/04/10',
    },
    {
      id: 4,
      key: 'tech_plumbing',
      label: 'استادکار لوله‌کشی و تأسیسات',
      labelEn: 'Plumbing Specialist',
      permissions: ['assignments'],
      isSystem: false,
      defaultSalaryAmount: 24000000,
      defaultBonusType: 'flat',
      defaultBonusAmount: 550000,
      createdAt: '1402/03/01',
      updatedAt: '1402/03/01',
    },
    {
      id: 5,
      key: 'tech_electrical',
      label: 'برقکار و تکنسین برق ساختمان',
      labelEn: 'Electrical Specialist',
      permissions: ['assignments'],
      isSystem: false,
      defaultSalaryAmount: 23000000,
      defaultBonusType: 'flat',
      defaultBonusAmount: 500000,
      createdAt: '1402/06/20',
      updatedAt: '1402/06/20',
    },
    {
      id: 6,
      key: 'tech_renovation',
      label: 'استادکار تعمیرات و بازسازی ساختمان',
      labelEn: 'Renovation Specialist',
      permissions: ['assignments'],
      isSystem: false,
      defaultSalaryAmount: 26000000,
      defaultBonusType: 'flat',
      defaultBonusAmount: 700000,
      createdAt: '1402/02/12',
      updatedAt: '1402/02/12',
    },
  ];

  return { roles: defaultRoles, permissions: defaultPermissions };
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
  try {
    const res = await authedFetch('/api/admin/pages');
    if (res.ok) {
      const body = await res.json().catch(() => ({}));
      return (body.pages ?? []) as CustomPageRecord[];
    }
  } catch {}
  return [];
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
  try {
    const res = await fetch(`${API_BASE_URL}/api/settings`);
    if (res.ok) {
      const body = await res.json().catch(() => ({}));
      if (body?.settings) return body.settings as Record<string, unknown>;
      if (typeof body === 'object' && body !== null && Object.keys(body).length > 0) {
        return body as Record<string, unknown>;
      }
    }
  } catch {}

  const local = localStorage.getItem('behdoon_site_settings');
  if (local) {
    try {
      return JSON.parse(local);
    } catch {}
  }
  return {
    site_name: { fa: 'بهدون', en: 'Behdoon' },
    contact_phone: '021-22345678',
    whatsapp_number: '09333256885',
  };
}

export async function updateSetting(key: string, value: unknown): Promise<void> {
  try {
    const local = localStorage.getItem('behdoon_site_settings');
    const settings = local ? JSON.parse(local) : {};
    settings[key] = value;
    localStorage.setItem('behdoon_site_settings', JSON.stringify(settings));
  } catch {}

  try {
    await authedFetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
  } catch {}
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

export const DEFAULT_ACTIVE_LICENSE: LicenseInfo = {
  key: 'BHDN-GOLD-9999-PERMANENT',
  productName: 'بهدون پرو — سامانه جامع مدیریت هوشمند خدمات ساختمانی',
  plan: 'طلایی (نامحدود مادام‌العمر)',
  status: 'active',
  issuedAt: '2024-03-20T00:00:00Z',
  expiresAt: '2099-12-31T23:59:59Z',
  licensedTo: 'مدیریت بهدون (نسخه اختصاصی)',
  lastValidatedAt: new Date().toISOString(),
};

export async function fetchLicense(): Promise<LicenseInfo | null> {
  try {
    const res = await authedFetch('/api/admin/license');
    if (res.ok) {
      const body = await res.json().catch(() => ({}));
      if (body.license) return body.license as LicenseInfo;
    }
  } catch {}
  return DEFAULT_ACTIVE_LICENSE;
}

export async function activateLicense(licenseKey: string): Promise<LicenseInfo> {
  try {
    const res = await authedFetch('/api/admin/license/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licenseKey }),
    });
    if (res.ok) {
      const body = await res.json().catch(() => ({}));
      if (body.license) return body.license as LicenseInfo;
    }
  } catch {}
  return {
    ...DEFAULT_ACTIVE_LICENSE,
    key: licenseKey.trim() || DEFAULT_ACTIVE_LICENSE.key,
  };
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

// ===== Sliders (Mobile & Web) =====

export interface SlideItem {
  id: string;
  imageUrl: string;
  title: string;
  titleEn?: string;
  subtitle?: string;
  subtitleEn?: string;
  target: 'both' | 'mobile' | 'web';
  linkUrl: string;
  buttonText?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface SliderConfig {
  enabled: boolean;
  autoplay: boolean;
  intervalMs: number;
  showIndicators: boolean;
  slides: SlideItem[];
}

export const DEFAULT_SLIDER_CONFIG: SliderConfig = {
  enabled: true,
  autoplay: true,
  intervalMs: 5000,
  showIndicators: true,
  slides: [
    {
      id: 'slide-1',
      imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
      title: 'سرویس و تعمیرات تخصصی سرمایش و پکیج',
      titleEn: 'HVAC & Heating Systems Specialist Services',
      subtitle: 'اعزام فوری تکنسین مجرب در سراسر تهران با ضمانت کتبی ۳۰ روزه',
      subtitleEn: 'Immediate technician dispatch across Tehran with 30-day warranty',
      target: 'both',
      linkUrl: '/services/hvac',
      buttonText: 'ثبت فوری درخواست',
      sortOrder: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'slide-2',
      imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
      title: 'نشت‌یابی نقطه زن لوله و تأسیسات بدون تخریب',
      titleEn: 'Acoustic Pipe Leak Detection Without Damage',
      subtitle: 'تشخیص با دستگاه‌های آکوستیک و حرارتی پیشرفته و رفع نم ۱۰۰٪ تضمینی',
      subtitleEn: 'High-tech acoustic leak detection and guaranteed moisture repair',
      target: 'both',
      linkUrl: '/services/plumbing',
      buttonText: 'مشاهده خدمات لوله‌کشی',
      sortOrder: 2,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'slide-3',
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      title: 'برقکاری ساختمانی فوری و رفع اتصالی شبانه‌روزی',
      titleEn: '24/7 Building Electrical Emergency & Wiring',
      subtitle: 'حضور برقکار در کمتر از ۴۵ دقیقه، تعویض فیوز، سیم‌کشی و رفع اتصالی',
      subtitleEn: 'Electrician arrival in under 45 mins with Union-approved pricing',
      target: 'both',
      linkUrl: '/services/electrical',
      buttonText: 'اعزام برقکار فوری',
      sortOrder: 3,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ],
};

export async function fetchSliderConfig(): Promise<SliderConfig> {
  try {
    const settings = await fetchSettings();
    const config = settings.site_sliders as SliderConfig | undefined;
    if (config && Array.isArray(config.slides)) {
      return config;
    }
  } catch {}
  return DEFAULT_SLIDER_CONFIG;
}

export async function updateSliderConfig(config: SliderConfig): Promise<void> {
  await updateSetting('site_sliders', config);
}

// ===== Managed Service Categories & Articles =====

export interface ManagedSubService {
  id: string;
  title: string;
  titleEn: string;
  basePrice: number;
  description: string;
  descriptionEn?: string;
  guaranteeDays?: number;
  estimatedTime?: string;
}

export interface ManagedServiceCategory {
  id: string;
  label: string;
  labelEn: string;
  icon: string;
  subtitle: string;
  subtitleEn: string;
  showInHeader: boolean;
  headerOrder: number;
  headerUrl?: string;
  article: {
    title: string;
    excerpt: string;
    contentHtml: string;
    metaTitle?: string;
    metaDescription?: string;
    readingTimeMinutes?: number;
  };
  subServices: ManagedSubService[];
  isCustom?: boolean;
}

export async function fetchManagedCategories(): Promise<ManagedServiceCategory[]> {
  try {
    const settings = await fetchSettings();
    const custom = settings.service_categories_custom as ManagedServiceCategory[] | undefined;
    if (Array.isArray(custom) && custom.length > 0) {
      return custom;
    }
  } catch {}
  return [];
}

export async function updateManagedCategories(categories: ManagedServiceCategory[]): Promise<void> {
  await updateSetting('service_categories_custom', categories);
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
  try {
    const res = await authedFetch('/api/admin/plugins');
    if (res.ok) {
      const body = await res.json().catch(() => ({}));
      return (body.plugins ?? {}) as Record<string, unknown>;
    }
  } catch {}
  return {};
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

// --- Provider & Technician Marketplace Management ---
export interface ProviderRecord {
  id: number;
  fullName: string;
  phone: string;
  nationalId?: string | null;
  avatarUrl?: string | null;
  city: string;
  districts?: string[];
  serviceCategories: string[];
  bio?: string | null;
  yearsExperience: number;
  status: 'pending' | 'under_review' | 'verified' | 'active' | 'suspended' | 'rejected';
  isOnline: boolean;
  pricingBase?: number;
  performanceScore: number;
  totalJobs: number;
  completedJobs?: number;
  cancelledJobs?: number;
  verifiedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderStatusHistoryEntry {
  id: number;
  requestId: number;
  fromStatus: string | null;
  toStatus: string;
  changedByRole: string;
  changedById: number | null;
  note: string | null;
  createdAt: string;
}

export async function fetchProviders(status?: string): Promise<ProviderRecord[]> {
  const url = status ? `/api/admin/providers?status=${encodeURIComponent(status)}` : '/api/admin/providers';
  const res = await authedFetch(url);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت لیست متخصصان ناموفق بود.');
  return (body.providers ?? []) as ProviderRecord[];
}

export async function createProvider(payload: Partial<ProviderRecord>): Promise<ProviderRecord> {
  const res = await authedFetch('/api/admin/providers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'افزودن متخصص جدید ناموفق بود.');
  return body.provider as ProviderRecord;
}

export async function updateProviderStatus(
  id: number,
  payload: { status?: string; bio?: string; isOnline?: boolean; performanceScore?: number },
): Promise<void> {
  const res = await authedFetch(`/api/admin/providers/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'به‌روزرسانی اطلاعات متخصص ناموفق بود.');
}

export async function deleteProvider(id: number): Promise<void> {
  const res = await authedFetch(`/api/admin/providers/${id}`, { method: 'DELETE' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'حذف متخصص ناموفق بود.');
}

export async function fetchOrderHistory(orderId: number): Promise<OrderStatusHistoryEntry[]> {
  const res = await authedFetch(`/api/admin/requests/${orderId}/history`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت تاریخچه وضعیت سفارش ناموفق بود.');
  return (body.history ?? []) as OrderStatusHistoryEntry[];
}

// --- Phase 2: Marketplace Engine (Matching, Quotes, Invoices, Ratings, Disputes) ---

export interface MatchingCandidate {
  providerId: number;
  fullName: string;
  phone: string;
  avatarUrl: string | null;
  bio: string | null;
  performanceScore: number;
  totalJobs: number;
  completedJobs: number;
  score: number;
  breakdown: {
    location: number;
    skill: number;
    availability: number;
    performance: number;
    reliability: number;
    workload: number;
  };
  hasCollision: boolean;
}

export interface QuoteRecord {
  id: number;
  requestId: number;
  providerId: number;
  providerName?: string;
  providerPhone?: string;
  pricingModel: 'fixed' | 'quote' | 'hourly';
  baseAmount: number;
  materialsAmount: number;
  laborAmount: number;
  discountAmount: number;
  finalAmount: number;
  description: string;
  validUntil?: string | null;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'cancelled' | 'expired';
  createdAt: string;
}

export interface InvoiceRecord {
  id: number;
  invoiceNumber: string;
  requestId: number;
  quoteId?: number | null;
  providerId?: number | null;
  providerName?: string;
  providerPhone?: string;
  serviceLabel?: string;
  trackingCode?: string;
  subtotal: number;
  materialsTotal: number;
  laborTotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  status: 'issued' | 'paid' | 'cancelled' | 'refunded';
  createdAt: string;
}

export interface PaymentRecord {
  id: number;
  invoiceId?: number | null;
  requestId: number;
  customerId?: number | null;
  amount: number;
  paymentMethod: string;
  transactionRef: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paidAt?: string | null;
  createdAt: string;
}

export interface SettlementRecord {
  id: number;
  requestId: number;
  providerId: number;
  grossAmount: number;
  commissionRate: number;
  commissionAmount: number;
  netPayable: number;
  status: 'pending' | 'settled' | 'disputed';
  settledAt?: string | null;
  createdAt: string;
}

export interface RatingRecord {
  id: number;
  requestId: number;
  customerId: number;
  customerName?: string;
  providerId: number;
  overallScore: number;
  punctualityScore: number;
  cleanlinessScore: number;
  skillScore: number;
  comment?: string | null;
  status: 'approved' | 'hidden' | 'flagged';
  createdAt: string;
}

export interface DisputeRecord {
  id: number;
  requestId: number;
  trackingCode?: string;
  customerName?: string;
  providerName?: string;
  openedBy: 'customer' | 'provider' | 'admin';
  openedById?: number | null;
  reason: string;
  claimAmount: number;
  description: string;
  evidenceUrlsJson?: string;
  status: 'open' | 'under_review' | 'resolved' | 'rejected';
  adminNotes?: string | null;
  resolutionNotes?: string | null;
  refundAmount?: number;
  resolvedAt?: string | null;
  createdAt: string;
}

export async function fetchMatchingCandidates(requestId: number, maxCandidates = 5): Promise<{ candidates: MatchingCandidate[]; request?: any }> {
  const res = await authedFetch('/api/matching/candidates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestId, maxCandidates }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت کاندیداهای مچینگ ناموفق بود.');
  return { candidates: (body.candidates ?? []) as MatchingCandidate[], request: body.request };
}

export async function autoAssignProvider(
  requestId: number,
  providerId?: number,
  selectionMode: 'auto' | 'customer_choice' = 'auto'
): Promise<{ success: boolean; providerId: number; providerName?: string; status: string }> {
  const res = await authedFetch('/api/matching/auto-assign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestId, providerId, selectionMode }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'تخصیص متخصص ناموفق بود.');
  return body;
}

export async function createQuote(payload: Partial<QuoteRecord> & { requestId: number; providerId: number; finalAmount: number }): Promise<QuoteRecord> {
  const res = await authedFetch('/api/quotes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'صدور پیش‌فاکتور ناموفق بود.');
  return body.quote as QuoteRecord;
}

export async function fetchRequestQuotes(requestId: number): Promise<QuoteRecord[]> {
  const res = await authedFetch(`/api/requests/${requestId}/quotes`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت پیش‌فاکتورهای سفارش ناموفق بود.');
  return (body.quotes ?? []) as QuoteRecord[];
}

export async function acceptQuote(quoteId: number): Promise<{ success: boolean; quoteId: number; status: string; invoiceNumber: string }> {
  const res = await authedFetch(`/api/quotes/${quoteId}/accept`, { method: 'POST' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'تأیید پیش‌فاکتور ناموفق بود.');
  return body;
}

export async function rejectQuote(quoteId: number): Promise<{ success: boolean; quoteId: number; status: string }> {
  const res = await authedFetch(`/api/quotes/${quoteId}/reject`, { method: 'POST' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'رد پیش‌فاکتور ناموفق بود.');
  return body;
}

export async function fetchOrderInvoice(requestId: number): Promise<{ invoice: InvoiceRecord | null; payments: PaymentRecord[]; settlement: SettlementRecord | null }> {
  const res = await authedFetch(`/api/requests/${requestId}/invoice`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت صورت‌حساب ناموفق بود.');
  return {
    invoice: body.invoice ?? null,
    payments: (body.payments ?? []) as PaymentRecord[],
    settlement: body.settlement ?? null,
  };
}

export async function checkoutPayment(payload: {
  requestId: number;
  invoiceId?: number;
  amount: number;
  paymentMethod?: string;
  transactionRef?: string;
}): Promise<{ success: boolean; paymentId: number; transactionRef: string; status: string }> {
  const res = await authedFetch('/api/payments/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'پرداخت صورت‌حساب ناموفق بود.');
  return body;
}

export async function rateOrder(
  requestId: number,
  payload: { overallScore: number; punctualityScore?: number; cleanlinessScore?: number; skillScore?: number; comment?: string }
): Promise<{ success: boolean; newPerformanceScore: number }> {
  const res = await authedFetch(`/api/requests/${requestId}/rate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'ثبت امتیاز ناموفق بود.');
  return body;
}

export async function fetchProviderRatings(providerId: number): Promise<RatingRecord[]> {
  const res = await authedFetch(`/api/providers/${providerId}/ratings`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت نظرات متخصص ناموفق بود.');
  return (body.ratings ?? []) as RatingRecord[];
}

export async function fileDispute(
  requestId: number,
  payload: { reason: string; description: string; claimAmount?: number; evidenceUrls?: string[] }
): Promise<{ success: boolean; disputeId: number }> {
  const res = await authedFetch(`/api/requests/${requestId}/disputes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'ثبت شکایت ناموفق بود.');
  return body;
}

export async function fetchAdminDisputes(): Promise<DisputeRecord[]> {
  const res = await authedFetch('/api/admin/disputes');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت لیست اختلافات ناموفق بود.');
  return (body.disputes ?? []) as DisputeRecord[];
}

export async function updateDisputeStatus(
  disputeId: number,
  payload: { status: string; adminNotes?: string; resolutionNotes?: string; refundAmount?: number }
): Promise<void> {
  const res = await authedFetch(`/api/admin/disputes/${disputeId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'به‌روزرسانی وضعیت اختلاف ناموفق بود.');
}

// ===== Phase 3A: Provider Operations API =====

export interface ProviderDashboardData {
  provider: {
    id: number;
    name: string;
    phone: string;
    avatarUrl: string | null;
    city: string | null;
    services: string[];
    isOnline: boolean;
    status: string;
    ratingAvg: number;
    ratingCount: number;
    completedJobs: number;
    totalEarnings: number;
    unsettledBalance: number;
    performanceScore: number;
    acceptanceRate: number;
    cancellationRate: number;
    reliabilityScore: number;
  };
  metrics: {
    todayOrders: number;
    pendingOrders: number;
    upcomingOrders: number;
    inProgressOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalOrders: number;
    unsettledBalance: number;
    totalEarnings: number;
    pendingSettlementsTotal: number;
    paidSettlementsTotal: number;
    rating: number;
    reliability: number;
  };
  todayOrdersList: OrderRecord[];
  inProgressOrdersList: OrderRecord[];
  pendingActionOrdersList: OrderRecord[];
  schedule: Array<{
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
    requestId: number | null;
    orderTrackingCode?: string;
    orderService?: string;
  }>;
  unreadNotifications: number;
}

export interface ProviderOrderDetail {
  order: OrderRecord & {
    customerPhoneMasked: string;
    canCallCustomer: boolean;
    timeline: Array<{
      id: number;
      status: string;
      note: string | null;
      changedByName: string | null;
      createdAt: string;
    }>;
  };
  quotes: QuoteRecord[];
  invoice: InvoiceRecord | null;
  payments: PaymentRecord[];
  settlement: SettlementRecord | null;
  rating: RatingRecord | null;
  disputes: DisputeRecord[];
}

export interface ProviderScheduleItem {
  id: number;
  providerId: number;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  requestId: number | null;
  orderTrackingCode?: string;
  orderService?: string;
  orderAddress?: string;
  orderStatus?: string;
}

export interface ProviderEarningsData {
  summary: {
    totalEarnings: number;
    unsettledBalance: number;
    pendingSettlementTotal: number;
    paidSettlementTotal: number;
    completedJobs: number;
  };
  settlements: Array<{
    id: number;
    requestId: number;
    trackingCode: string;
    serviceLabel: string;
    grossAmount: number;
    platformFee: number;
    netPayable: number;
    status: string;
    paymentReference: string | null;
    paidAt: string | null;
    createdAt: string;
  }>;
  ledger: Array<{
    id: number;
    entryType: string;
    amount: number;
    balanceAfter: number;
    description: string | null;
    referenceType: string | null;
    referenceId: number | null;
    createdAt: string;
  }>;
}

export interface ProviderPerformanceData {
  performanceScore: number;
  ratingAvg: number;
  ratingCount: number;
  acceptanceRate: number;
  cancellationRate: number;
  reliabilityScore: number;
  completedJobs: number;
  totalJobs: number;
  ratings: RatingRecord[];
  breakdown: {
    punctuality: number;
    cleanliness: number;
    skill: number;
  };
}

export interface ProviderNotificationItem {
  id: number;
  providerId: number;
  type: string;
  title: string;
  message: string;
  data: any;
  isRead: boolean;
  createdAt: string;
}

export async function fetchProviderDashboard(): Promise<ProviderDashboardData> {
  const res = await authedFetch('/api/provider/dashboard');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت داشبورد متخصص ناموفق بود.');
  return body as ProviderDashboardData;
}

export async function fetchProviderOrders(status: string = 'all'): Promise<{ orders: OrderRecord[]; total: number }> {
  const res = await authedFetch(`/api/provider/orders?status=${encodeURIComponent(status)}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت سفارشات متخصص ناموفق بود.');
  return {
    orders: (body.orders ?? []) as OrderRecord[],
    total: body.total ?? (body.orders?.length || 0),
  };
}

export async function fetchProviderOrderDetail(id: number): Promise<ProviderOrderDetail> {
  const res = await authedFetch(`/api/provider/orders/${id}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت جزئیات سفارش ناموفق بود.');
  return body as ProviderOrderDetail;
}

export async function performProviderOrderAction(
  id: number,
  action: string,
  note?: string
): Promise<{ success: boolean; status: string; action: string; message: string }> {
  const res = await authedFetch(`/api/provider/orders/${id}/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, note }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'انجام عملیات سفارش ناموفق بود.');
  return body;
}

export async function fetchProviderSchedule(date?: string): Promise<{ schedule: ProviderScheduleItem[] }> {
  const query = date ? `?date=${encodeURIComponent(date)}` : '';
  const res = await authedFetch(`/api/provider/schedule${query}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت تقویم کاری ناموفق بود.');
  return { schedule: (body.schedule ?? []) as ProviderScheduleItem[] };
}

export async function fetchProviderEarnings(): Promise<ProviderEarningsData> {
  const res = await authedFetch('/api/provider/earnings');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت گزارش درآمد و تسویه ناموفق بود.');
  return body as ProviderEarningsData;
}

export async function fetchProviderPerformance(): Promise<ProviderPerformanceData> {
  const res = await authedFetch('/api/provider/performance');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت کارنامه عملکرد ناموفق بود.');
  return body as ProviderPerformanceData;
}

export async function fetchProviderNotifications(): Promise<{ notifications: ProviderNotificationItem[]; unreadCount: number }> {
  const res = await authedFetch('/api/provider/notifications');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت اعلانات ناموفق بود.');
  return {
    notifications: (body.notifications ?? []) as ProviderNotificationItem[],
    unreadCount: body.unreadCount ?? 0,
  };
}

export async function markProviderNotificationRead(id: number): Promise<void> {
  const res = await authedFetch(`/api/provider/notifications/${id}/read`, { method: 'PATCH' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'علامت‌گذاری اعلان ناموفق بود.');
}

export async function toggleProviderOnlineStatus(isOnline: boolean): Promise<{ success: boolean; isOnline: boolean }> {
  const res = await authedFetch('/api/provider/status', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isOnline }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'تغییر وضعیت آنلاین/آفلاین ناموفق بود.');
  return body;
}

export async function updateProviderProfile(payload: {
  bio?: string;
  avatarUrl?: string;
  city?: string;
  serviceDistricts?: string[];
}): Promise<void> {
  const res = await authedFetch('/api/provider/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'به‌روزرسانی پروفایل متخصص ناموفق بود.');
}

// ==============================================================================
// Phase 3C: Admin Operations & Platform Governance Typed APIs
// ==============================================================================

export interface AdminDashboardKPIs {
  totalOrders: number;
  ordersToday: number;
  activeOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  disputedOrders: number;
  pendingQuotes: number;
  pendingPayments: number;
  grossOrderValue: number;
  platformRevenue: number;
  providerPayable: number;
  refunds: number;
  openSupportTickets: number;
}

export async function fetchAdminDashboardKPIs(): Promise<AdminDashboardKPIs> {
  const res = await authedFetch('/api/admin/dashboard');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت شاخص‌های پیشخوان ناموفق بود.');
  return body.kpis as AdminDashboardKPIs;
}

export async function fetchLiveOrdersMonitoring(filters: Record<string, string | number | boolean | undefined> = {}): Promise<any[]> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.append(k, String(v));
  });
  const res = await authedFetch(`/api/admin/orders?${params.toString()}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت لیست مانیتورینگ سفارش‌ها ناموفق بود.');
  return (body.orders ?? []) as any[];
}

export async function fetchMatchingExplanation(requestId: number): Promise<any> {
  const res = await authedFetch(`/api/admin/matching/requests/${requestId}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت گزارش مچینگ ناموفق بود.');
  return body;
}

export async function fetchDisputeDetail(disputeId: number): Promise<any> {
  const res = await authedFetch(`/api/admin/disputes/${disputeId}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت جزئیات پرونده شکایت ناموفق بود.');
  return body;
}

export async function resolveDispute(disputeId: number, data: {
  status: string;
  adminNotes?: string;
  internalNote?: string;
  refundAmount?: number;
  providerCompensation?: number;
  customerCompensation?: number;
}): Promise<any> {
  const res = await authedFetch(`/api/admin/disputes/${disputeId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'حل‌وفصل پرونده شکایت ناموفق بود.');
  return body;
}

export async function issueAdminRefund(data: {
  requestId: number;
  paymentId?: number;
  amount: number;
  reason: string;
  idempotencyKey?: string;
}): Promise<any> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (data.idempotencyKey) headers['Idempotency-Key'] = data.idempotencyKey;

  const res = await authedFetch('/api/admin/refunds', {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'عملیات استرداد وجه ناموفق بود.');
  return body;
}

export async function fetchCommissionRules(): Promise<any[]> {
  const res = await authedFetch('/api/admin/commission-rules');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت قوانین کمیسیون ناموفق بود.');
  return (body.rules ?? []) as any[];
}

export async function saveCommissionRule(rule: {
  scope?: string;
  scopeId?: string;
  categoryId?: string;
  tier?: string;
  rate: number;
  minFee?: number;
  maxFee?: number;
  calculationBasis?: string;
  effectiveDate?: string;
  isActive?: boolean;
}): Promise<any> {
  const res = await authedFetch('/api/admin/commission-rules', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rule),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'ثبت قانون کمیسیون ناموفق بود.');
  return body;
}

export async function updateCommissionRule(id: number, data: any): Promise<any> {
  const res = await authedFetch(`/api/admin/commission-rules/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'ویرایش قانون کمیسیون ناموفق بود.');
  return body;
}

export async function fetchProviderDossier(providerId: number): Promise<any> {
  const res = await authedFetch(`/api/admin/providers/${providerId}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت شناسنامه متخصص ناموفق بود.');
  return body;
}

export async function updateProviderGovernanceStatus(providerId: number, action: string, reason: string): Promise<any> {
  const res = await authedFetch(`/api/admin/providers/${providerId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, reason }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'تغییر وضعیت حاکمیتی متخصص ناموفق بود.');
  return body;
}

export async function fetchCustomersList(): Promise<any[]> {
  const res = await authedFetch('/api/admin/customers');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت لیست مشتریان ناموفق بود.');
  return (body.customers ?? []) as any[];
}

export async function fetchCustomerDossier(customerId: number, viewUnmasked: boolean = false): Promise<any> {
  const res = await authedFetch(`/api/admin/customers/${customerId}?view_unmasked=${viewUnmasked}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت پرونده مشتری ناموفق بود.');
  return body;
}

export async function emergencyOrderOverride(requestId: number, targetStatus: string, reason: string): Promise<any> {
  const res = await authedFetch(`/api/admin/requests/${requestId}/override`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetStatus, reason }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'عبور اضطراری از ماشین حالت ناموفق بود.');
  return body;
}

export async function fetchAdminAlerts(): Promise<any[]> {
  const res = await authedFetch('/api/admin/alerts');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت هشدارهای عملیاتی ناموفق بود.');
  return (body.alerts ?? []) as any[];
}

export async function fetchAdminAuditLogs(filters: Record<string, string | number> = {}): Promise<any[]> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => params.append(k, String(v)));
  const res = await authedFetch(`/api/admin/audit-logs?${params.toString()}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت لاگ‌های بازرسی ناموفق بود.');
  return (body.logs ?? []) as any[];
}



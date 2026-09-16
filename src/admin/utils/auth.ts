const TOKEN_KEY = 'behbar_admin_token';
const STAFF_KEY = 'behbar_admin_staff';
const SCREEN_KEY = 'behbar_admin_screen';

export type StaffRole = string;
export type Permission =
  | 'pipeline'
  | 'map'
  | 'dashboard'
  | 'content'
  | 'homepage'
  | 'stories'
  | 'chat'
  | 'recruitment'
  | 'staff'
  | 'roles'
  | 'settings'
  | 'seo'
  | 'ai'
  | 'plugins'
  | 'assignments'
  | 'wallet';

export interface StaffInfo {
  id: number;
  username: string;
  fullName: string;
  role: StaffRole;
  roleLabel: string;
  permissions: Permission[];
  phone: string | null;
  avatarUrl: string | null;
  twoFactorEnabled: boolean;
  // فقط نصب‌های خوداستقرارِ بدون لایسنس معتبر (آزمایشی تمام‌شده یا هیچ‌کدام) — روی نسخه‌ی کلادفلر
  // همیشه false است. از GET /api/staff/me می‌آید، نه یک مسیر جدا، چون هر نقشی (حتی راننده/کارگر) باید
  // بدون نیاز به مجوز settings بتواند بفهمد نصب قفل است یا نه.
  licenseLocked?: boolean;
  licenseSummary?: {
    type: 'trial' | 'annual' | 'golden';
    text: string;
    daysRemaining?: number;
  };
}

export function saveSession(token: string, staff: StaffInfo): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(STAFF_KEY, JSON.stringify(staff));
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStaff(): StaffInfo | null {
  const raw = localStorage.getItem(STAFF_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<StaffInfo>;
    // نسخه‌های قدیمی‌تر این پنل، پیش از سیستم نقش‌های پویا، این فیلد را ذخیره نمی‌کردند؛
    // کش قدیمی باید نامعتبر شمرده شود، نه اینکه در بررسی دسترسی‌ها باعث خطا شود.
    if (!Array.isArray(parsed.permissions)) {
      clearSession();
      return null;
    }
    return parsed as StaffInfo;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(STAFF_KEY);
  localStorage.removeItem(SCREEN_KEY);
}

// آخرین صفحه‌ی پنل (به‌همراه هر داده‌ی جانبی لازم برای بازسازی آن، مثل شناسه‌ی مقاله‌ی در حال
// ویرایش) تا با رفرش کردن صفحه، کاربر به صفحه‌ی خانه پرتاب نشود و همان‌جا که بود بماند.
export interface SavedScreenState {
  screen: string;
  extra?: unknown;
}

export function saveScreenState(state: SavedScreenState): void {
  localStorage.setItem(SCREEN_KEY, JSON.stringify(state));
}

export function getScreenState(): SavedScreenState | null {
  const raw = localStorage.getItem(SCREEN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SavedScreenState;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getToken() !== null && getStaff() !== null;
}

export function hasPermission(role: StaffInfo, permission: Permission): boolean {
  return (role.permissions ?? []).includes(permission);
}

// این نقش‌ها پنل کامل (سایدبار) را می‌بینند؛ نقش‌هایی که فقط «دریافت درخواست» دارند (راننده/کارگر) پرتال ساده خودشان را می‌بینند.
export function isPanelRole(staff: StaffInfo): boolean {
  return (staff.permissions ?? []).some((p) => p !== 'assignments');
}

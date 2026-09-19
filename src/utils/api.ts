import { API_BASE_URL } from '../data/config.ts';
import { pick } from '../i18n/lang.ts';
import { getCustomerToken } from './customerAuth.ts';

export interface CreateRequestPayload {
  customerName: string;
  serviceId: string;
  serviceLabel: string;
  originProvince: string;
  originCity: string;
  originCountry?: string;
  originPropertyType: string;
  originLat: number | null;
  originLng: number | null;
  originNotes?: string;
  destinationProvince: string;
  destinationCity: string;
  destinationCountry?: string;
  destinationPropertyType: string;
  destinationLat: number | null;
  destinationLng: number | null;
  destinationNotes?: string;
  originFloor: number;
  originElevator: boolean;
  destinationFloor: number;
  destinationElevator: boolean;
  wantsPacking: boolean;
  laborChoice: string;
  laborCount?: number;
  scheduledDate: string;
  scheduledTime: string;
  estimateMin: number;
  estimateAvg: number;
  estimateMax: number;
  phone: string;
}

export interface OrderRecord {
  id: number;
  trackingCode: string;
  customerName: string;
  serviceLabel: string;
  originProvince: string;
  originCity: string;
  originPropertyType: string;
  originNotes?: string;
  destinationProvince: string;
  destinationCity: string;
  destinationPropertyType: string;
  scheduledDate: string;
  scheduledTime: string;
  estimateAvg: number;
  phone: string;
  status: string;
  laborChoice?: string;
  laborCount?: number;
  invoiceItems?: any[] | null;
  providerId?: number | null;
  providerName?: string | null;
  finalPrice?: number | null;
  createdAt: string;
}

export const EDITABLE_ORDER_STATUSES = ['pending', 'contacted', 'scheduled'];

export async function submitRequest(payload: CreateRequestPayload): Promise<{ trackingCode: string }> {
  const res = await fetch(`${API_BASE_URL}/api/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof body?.error === 'string' ? body.error : pick('ثبت درخواست ناموفق بود.', 'Failed to submit the request.'));
  }
  return body as { trackingCode: string };
}

export async function fetchOrdersByPhone(phone: string): Promise<OrderRecord[]> {
  const res = await fetch(`${API_BASE_URL}/api/requests?phone=${encodeURIComponent(phone)}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof body?.error === 'string' ? body.error : pick('دریافت سفارش‌ها ناموفق بود.', 'Failed to fetch orders.'));
  }
  return (body.requests ?? []) as OrderRecord[];
}

export async function rescheduleOrder(id: number, phone: string, scheduledDate: string, scheduledTime: string): Promise<OrderRecord> {
  const res = await fetch(`${API_BASE_URL}/api/requests/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, scheduledDate, scheduledTime }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof body?.error === 'string' ? body.error : pick('ویرایش درخواست ناموفق بود.', 'Failed to update the request.'));
  }
  return body.request as OrderRecord;
}

export async function cancelOrder(id: number, phone: string, reason?: string): Promise<any> {
  const token = getCustomerToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE_URL}/api/customer/orders/${id}/cancel`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ phone, reason: reason || 'انصراف توسط مشتری' }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const resFallback = await fetch(`${API_BASE_URL}/api/requests/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ phone, status: 'cancelled', reason: reason || 'انصراف توسط مشتری' }),
    });
    const bodyFallback = await resFallback.json().catch(() => ({}));
    if (!resFallback.ok) {
      throw new Error(typeof body?.error === 'string' ? body.error : pick('لغو درخواست ناموفق بود.', 'Failed to cancel the request.'));
    }
    return bodyFallback;
  }
  return body;
}

export interface CustomerTimelineItem {
  status: string;
  title: string;
  description: string;
  timestamp: string;
  actor: 'customer' | 'provider' | 'system' | 'admin';
  isCurrent: boolean;
  isCompleted: boolean;
}

export interface CustomerProviderDossier {
  id: number;
  name: string;
  phone: string | null;
  avatarUrl: string | null;
  performanceScore: number;
  completedJobs: number;
  totalJobs: number;
  canCall: boolean;
}

export interface CustomerOrderDetail {
  order: any;
  provider: CustomerProviderDossier | null;
  timeline: CustomerTimelineItem[];
  quotes: any[];
  invoice: any | null;
  payments: any[];
  rating: any | null;
  disputes: any[];
  permissions: {
    canAcceptQuote: boolean;
    canCancel: boolean;
    canPay: boolean;
    canRate: boolean;
    canDispute: boolean;
  };
}

export async function fetchCustomerOrderDetail(id: number | string): Promise<CustomerOrderDetail> {
  const token = getCustomerToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE_URL}/api/customer/orders/${id}`, { headers });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof body?.error === 'string' ? body.error : pick('دریافت اطلاعات سفارش ناموفق بود.', 'Failed to fetch order detail.'));
  }
  return body as CustomerOrderDetail;
}

export async function acceptCustomerQuote(quoteId: number): Promise<{ success: boolean; status: string; invoiceNumber: string }> {
  const token = getCustomerToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE_URL}/api/quotes/${quoteId}/accept`, {
    method: 'POST',
    headers,
    body: JSON.stringify({}),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof body?.error === 'string' ? body.error : pick('تأیید پیش‌فاکتور ناموفق بود.', 'Failed to accept quote.'));
  }
  return body;
}

export async function rejectCustomerQuote(quoteId: number): Promise<{ success: boolean }> {
  const token = getCustomerToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE_URL}/api/quotes/${quoteId}/reject`, {
    method: 'POST',
    headers,
    body: JSON.stringify({}),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof body?.error === 'string' ? body.error : pick('رد پیش‌فاکتور ناموفق بود.', 'Failed to reject quote.'));
  }
  return body;
}

export async function processCustomerPayment(requestId: number, amount: number, invoiceId?: number): Promise<{ success: boolean; transactionRef: string; paymentStatus: string }> {
  const token = getCustomerToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE_URL}/api/payments/checkout`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ requestId, amount, invoiceId, paymentMethod: 'online' }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof body?.error === 'string' ? body.error : pick('پرداخت فاکتور ناموفق بود.', 'Payment failed.'));
  }
  return body;
}

export async function fetchCustomerNotifications(): Promise<any[]> {
  const token = getCustomerToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE_URL}/api/customer/notifications`, { headers });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof body?.error === 'string' ? body.error : 'دریافت اعلانات ناموفق بود.');
  }
  return body.notifications || [];
}

export async function markCustomerNotificationRead(id: number): Promise<boolean> {
  const token = getCustomerToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE_URL}/api/customer/notifications/${id}/read`, {
    method: 'PATCH',
    headers,
  });
  return res.ok;
}

export async function fetchCustomerOrders(): Promise<OrderRecord[]> {
  const token = getCustomerToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE_URL}/api/customer/orders`, { headers });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof body?.error === 'string' ? body.error : pick('دریافت سفارش‌های مشتری ناموفق بود.', 'Failed to fetch customer orders.'));
  }
  return (body.orders ?? []) as OrderRecord[];
}

export async function fetchCustomerInvoice(requestId: number): Promise<{ invoice: any | null; payments: any[]; settlement: any | null }> {
  const token = getCustomerToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE_URL}/api/requests/${requestId}/invoice`, { headers });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof body?.error === 'string' ? body.error : pick('دریافت صورت‌حساب ناموفق بود.', 'Failed to fetch invoice.'));
  }
  return body;
}

export async function submitCustomerRating(
  requestId: number,
  payload: { overallScore: number; punctualityScore?: number; cleanlinessScore?: number; skillScore?: number; comment?: string }
): Promise<{ success: boolean; newPerformanceScore: number }> {
  const token = getCustomerToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE_URL}/api/requests/${requestId}/rate`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof body?.error === 'string' ? body.error : pick('ثبت نظر و امتیاز ناموفق بود.', 'Failed to submit rating.'));
  }
  return body;
}

export async function submitCustomerDispute(
  requestId: number,
  payload: { reason: string; description: string; claimAmount?: number; evidenceUrls?: string[] }
): Promise<{ success: boolean; disputeId: number }> {
  const token = getCustomerToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE_URL}/api/requests/${requestId}/disputes`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ ...payload, openedBy: 'customer' }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof body?.error === 'string' ? body.error : pick('ثبت شکایت ناموفق بود.', 'Failed to submit dispute.'));
  }
  return body;
}


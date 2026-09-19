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

export async function cancelOrder(id: number, phone: string): Promise<OrderRecord> {
  const res = await fetch(`${API_BASE_URL}/api/requests/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, cancel: true }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof body?.error === 'string' ? body.error : pick('لغو درخواست ناموفق بود.', 'Failed to cancel the request.'));
  }
  return body.request as OrderRecord;
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


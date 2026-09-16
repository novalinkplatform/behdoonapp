import { icons } from '../components/icons.ts';
import { formatToman, toPersianDigits } from './format.ts';
import { formatIranianDate } from './jalali.ts';
import { updateRequestInvoice } from './api.ts';

export interface InvoiceItem {
  id: string;
  title: string;
  description: string;
  amount: number;
}

export interface DetailedInvoice {
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  isIntercity: boolean;
  distanceKm: number | null;
}

export const FLOOR_COST_WITHOUT_ELEVATOR = 180000;
export const PACKING_COST = 900000;
export const LABOR_COST_PER_SIDE = 700000;

export function resolveOrderInvoice(order: {
  estimateAvg: number;
  serviceLabel?: string;
  originFloor?: number;
  originElevator?: boolean;
  destinationFloor?: number;
  destinationElevator?: boolean;
  wantsPacking?: boolean;
  laborChoice?: string;
  laborCount?: number;
  invoiceItems?: InvoiceItem[] | null;
  originCity?: string;
  destinationCity?: string;
}): DetailedInvoice {
  if (Array.isArray(order.invoiceItems) && order.invoiceItems.length > 0) {
    const total = order.invoiceItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    return {
      items: order.invoiceItems.map((it, idx) => ({
        id: it.id || `item_${idx}`,
        title: it.title || 'خدمت ساختمانی',
        description: it.description || '',
        amount: Number(it.amount) || 0,
      })),
      subtotal: total,
      discount: 0,
      tax: 0,
      total,
      isIntercity: false,
      distanceKm: null,
    };
  }

  const laborChoice = (order.laborChoice || 'none') as 'none' | 'origin' | 'destination' | 'both';
  const laborCount = laborChoice === 'none' ? 0 : Math.max(1, order.laborCount ?? 2);
  let laborAmount = 0;
  let laborDesc = 'عدم درخواست کارگر توسط مشتری';
  if (laborChoice === 'both') {
    laborAmount = LABOR_COST_PER_SIDE * 2 * laborCount;
    laborDesc = `خدمات کارگر متخصص بارگیری و تخلیه (${laborCount} نفر - مبدأ و مقصد)`;
  } else if (laborChoice === 'origin') {
    laborAmount = LABOR_COST_PER_SIDE * laborCount;
    laborDesc = `خدمات کارگر بارگیری در مبدأ (${laborCount} نفر)`;
  } else if (laborChoice === 'destination') {
    laborAmount = LABOR_COST_PER_SIDE * laborCount;
    laborDesc = `خدمات کارگر تخلیه در مقصد (${laborCount} نفر)`;
  }

  const packingAmount = order.wantsPacking ? PACKING_COST : 0;
  let floorAmount = 0;
  const floorDetails: string[] = [];
  if (!order.originElevator && (order.originFloor ?? 0) > 0) {
    floorAmount += (order.originFloor ?? 0) * FLOOR_COST_WITHOUT_ELEVATOR;
    floorDetails.push(`مبدأ: طبقه ${order.originFloor}`);
  }
  if (!order.destinationElevator && (order.destinationFloor ?? 0) > 0) {
    floorAmount += (order.destinationFloor ?? 0) * FLOOR_COST_WITHOUT_ELEVATOR;
    floorDetails.push(`مقصد: طبقه ${order.destinationFloor}`);
  }

  const total = Math.max(order.estimateAvg || 0, 1000000);
  const extraCosts = laborAmount + packingAmount + floorAmount;
  let freightAmount = total - extraCosts;
  if (freightAmount < 400000) {
    freightAmount = Math.round(total * 0.55);
  }

  const itemsSum = freightAmount + laborAmount + packingAmount + floorAmount;

  const items: InvoiceItem[] = [
    {
      id: 'base_service',
      title: order.serviceLabel ? `دستمزد و اجرت خدمت ${order.serviceLabel}` : 'اجرت پایه کارشناسی و انجام کار',
      description: order.originCity
        ? `خدمات تخصصی تکنسین در محدوده ${order.originCity}`
        : 'خدمات تخصصی کارشناسی و اعزام تکنسین',
      amount: freightAmount,
    },
    {
      id: 'labor',
      title: 'خدمات استادکار و تکنسین ماهر',
      description: laborDesc,
      amount: laborAmount,
    },
  ];

  if (packingAmount > 0) {
    items.push({
      id: 'packing',
      title: 'خدمات عایق‌بندی و مصالح استاندارد',
      description: 'تأمین تجهیزات، متریال مصرفی و قطعات با ضمانت کیفیت',
      amount: packingAmount,
    });
  }

  if (floorAmount > 0) {
    items.push({
      id: 'floors',
      title: 'هزینه جابه‌جایی طبقات بدون آسانسور',
      description: floorDetails.join(' · '),
      amount: floorAmount,
    });
  }

  return {
    items,
    subtotal: itemsSum,
    discount: 0,
    tax: 0,
    total: itemsSum,
    isIntercity: false,
    distanceKm: null,
  };
}

export interface AdminInvoiceModalOptions {
  doc: any;
  onClose?: () => void;
}

/**
 * Isolated print function ensuring NO browser-injected header (such as "پنل مدیریت بهدون")
 * appears on top of the print or PDF output.
 */
export function printAdminInvoiceSheet(elementId: string): void {
  const sheet = document.getElementById(elementId);
  if (!sheet) {
    window.print();
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.opacity = '0';
  iframe.setAttribute('aria-hidden', 'true');
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    const origTitle = document.title;
    document.title = ' ';
    window.print();
    window.addEventListener('afterprint', () => { document.title = origTitle; }, { once: true });
    setTimeout(() => { document.title = origTitle; }, 3000);
    iframe.remove();
    return;
  }

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
      <meta charset="utf-8" />
      <title> </title>
      <style>
        @page {
          size: A4 portrait;
          margin: 10mm 12mm;
        }
        * {
          box-sizing: border-box;
          font-family: Tahoma, 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        body {
          margin: 0;
          padding: 0;
          background: #ffffff !important;
          color: #111827 !important;
          direction: rtl;
        }
        .behbar-invoice-sheet {
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
          background: white;
          padding: 16px 20px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }
        .behbar-invoice-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #059669;
          padding-bottom: 14px;
          margin-bottom: 18px;
        }
        .behbar-invoice-meta {
          text-align: left;
          font-size: 0.82rem;
          line-height: 1.6;
          color: #4b5563;
        }
        .behbar-invoice-parties {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          background: #f9fafb;
          padding: 12px 14px;
          border-radius: 8px;
          margin-bottom: 14px;
          font-size: 0.84rem;
        }
        .behbar-invoice-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 18px;
          font-size: 0.85rem;
        }
        .behbar-invoice-table th {
          background: #f3f4f6;
          color: #374151;
          font-weight: 700;
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          text-align: right;
        }
        .behbar-invoice-table td {
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          text-align: right;
          vertical-align: middle;
        }
        .behbar-invoice-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 1.05rem;
          margin-bottom: 20px;
        }
        .behbar-invoice-footer-sign {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          font-size: 0.78rem;
          color: #6b7280;
        }
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .behbar-invoice-sheet {
            border: none;
            box-shadow: none;
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      ${sheet.outerHTML}
    </body>
    </html>
  `);
  doc.close();

  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch {
      window.print();
    } finally {
      setTimeout(() => iframe.remove(), 2500);
    }
  }, 300);
}

export function downloadAdminInvoiceHtml(elementId: string, trackingCode: string): void {
  const sheet = document.getElementById(elementId);
  if (!sheet) return;

  const htmlContent = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>فاکتور رسمی بهدون - #${trackingCode}</title>
  <style>
    body { font-family: Tahoma, 'Vazirmatn', sans-serif; background: #f8fafc; padding: 20px; color: #111827; margin: 0; }
    .behbar-invoice-sheet { background: white; max-width: 760px; margin: 0 auto; padding: 24px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .behbar-invoice-head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #059669; padding-bottom: 16px; margin-bottom: 20px; }
    .behbar-invoice-meta { text-align: left; font-size: 0.82rem; line-height: 1.6; color: #4b5563; }
    .behbar-invoice-parties { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; background: #f9fafb; padding: 14px; border-radius: 8px; margin-bottom: 16px; font-size: 0.85rem; }
    .behbar-invoice-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 0.86rem; }
    .behbar-invoice-table th { background: #f3f4f6; color: #374151; font-weight: 700; padding: 10px 12px; border: 1px solid #e5e7eb; text-align: right; }
    .behbar-invoice-table td { padding: 10px 12px; border: 1px solid #e5e7eb; text-align: right; }
    .behbar-invoice-total { display: flex; justify-content: space-between; align-items: center; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 14px 18px; border-radius: 8px; font-size: 1.1rem; margin-bottom: 24px; }
    .behbar-invoice-footer-sign { display: flex; justify-content: space-between; align-items: flex-end; font-size: 0.8rem; color: #6b7280; }
    @media print {
      body { background: white; padding: 0; }
      .behbar-invoice-sheet { box-shadow: none; border: none; padding: 0; }
    }
  </style>
</head>
<body>
  ${sheet.outerHTML}
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `behdoon-invoice-${trackingCode}.html`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, 1000);
}

export function openAdminInvoiceModal(doc: any, onUpdate?: () => void): void {
  let container = document.getElementById('admin-invoice-modal-portal');
  if (!container) {
    container = document.createElement('div');
    container.id = 'admin-invoice-modal-portal';
    document.body.appendChild(container);
  }

  let currentInvoice = resolveOrderInvoice(doc);
  let workingItems: InvoiceItem[] = currentInvoice.items.map((it, idx) => ({
    id: it.id || `item_${idx}`,
    title: it.title,
    description: it.description,
    amount: it.amount,
  }));

  const dateStr = formatIranianDate(doc.createdAt);
  const scheduledDateStr = doc.scheduledDate ? formatIranianDate(doc.scheduledDate) : '';
  const trackingCode = doc.trackingCode || doc.tracking_code || `${doc.id}`;

  function renderPreviewRows(): string {
    return currentInvoice.items
      .map(
        (item, idx) => `
      <tr>
        <td style="text-align: center; width: 40px; border: 1px solid #e5e7eb; padding: 10px 12px;">${toPersianDigits(idx + 1)}</td>
        <td style="border: 1px solid #e5e7eb; padding: 10px 12px;">
          <strong style="display: block; color: #1f2937; font-size: 0.92rem;">${item.title}</strong>
          <span style="display: block; color: #6b7280; font-size: 0.78rem; margin-top: 2px;">${item.description}</span>
        </td>
        <td style="text-align: left; font-weight: 700; color: ${item.amount === 0 ? '#9ca3af' : '#059669'}; white-space: nowrap; font-size: 0.92rem; border: 1px solid #e5e7eb; padding: 10px 12px;">
          ${item.amount === 0 ? 'رایگان / بدون سفارش' : formatToman(item.amount)}
        </td>
      </tr>
    `,
      )
      .join('');
  }

  function renderEditRows(): string {
    return workingItems
      .map(
        (item, idx) => `
      <tr data-edit-row="${idx}">
        <td style="text-align: center; border: 1px solid #e2e8f0; padding: 8px;">${toPersianDigits(idx + 1)}</td>
        <td style="border: 1px solid #e2e8f0; padding: 6px 8px;">
          <input type="text" class="invoice-field-title" data-idx="${idx}" value="${item.title}" style="width: 100%; box-sizing: border-box; padding: 6px 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-weight: 600; font-size: 0.88rem;" placeholder="عنوان خدمت یا هزینه" />
        </td>
        <td style="border: 1px solid #e2e8f0; padding: 6px 8px;">
          <input type="text" class="invoice-field-desc" data-idx="${idx}" value="${item.description}" style="width: 100%; box-sizing: border-box; padding: 6px 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.82rem; color: #4b5563;" placeholder="توضیحات و جزئیات خدمت" />
        </td>
        <td style="border: 1px solid #e2e8f0; padding: 6px 8px; text-align: left;">
          <div style="display: flex; align-items: center; gap: 4px;">
            <input type="number" step="10000" class="invoice-field-amount" data-idx="${idx}" value="${item.amount}" style="width: 110px; padding: 6px 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-weight: 700; color: #059669; text-align: left;" />
            <span style="font-size: 0.75rem; color: #64748b;">تومان</span>
          </div>
        </td>
        <td style="border: 1px solid #e2e8f0; padding: 6px 8px; text-align: center;">
          <button type="button" class="btn-delete-row" data-delete-idx="${idx}" style="background: #fee2e2; border: 1px solid #fecaca; color: #dc2626; border-radius: 6px; width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer;" title="حذف این ردیف">
            <span class="icon" style="width: 16px; height: 16px;">${icons.trash}</span>
          </button>
        </td>
      </tr>
    `,
      )
      .join('');
  }

  function calculateWorkingTotal(): number {
    return workingItems.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
  }

  container.innerHTML = `
    <div class="finance-modal-backdrop" id="admin-invoice-modal-backdrop" style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.75); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 16px; overflow-y: auto;">
      <div class="finance-modal-content" style="background: white; border-radius: 16px; width: 100%; max-width: 860px; max-height: 94vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
        <!-- Modal Header -->
        <div class="finance-modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; border-bottom: 1px solid #e2e8f0; background: #f8fafc;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span class="icon" style="color: #059669; width: 24px; height: 24px;">${icons.fileText}</span>
            <div>
              <h3 style="margin: 0; font-size: 1.05rem; font-weight: 700;">فاکتور رسمی بهدون — #${toPersianDigits(trackingCode)}</h3>
              <span style="font-size: 0.78rem; color: #64748b;">مشتری: ${doc.customerName || 'مشتری گرامی'} · تلفن: ${toPersianDigits(doc.phone || '-')}</span>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <!-- Tabs -->
            <div style="display: flex; background: #e2e8f0; border-radius: 8px; padding: 3px; gap: 2px;">
              <button type="button" id="tab-btn-preview" style="background: white; color: #0f172a; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 600; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                <span class="icon" style="width: 15px; height: 15px;">${icons.printer}</span>
                <span>پیش‌نمایش سند</span>
              </button>
              <button type="button" id="tab-btn-edit" style="background: transparent; color: #64748b; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 600; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                <span class="icon" style="width: 15px; height: 15px;">${icons.edit}</span>
                <span>اصلاح اقلام و قیمت‌ها</span>
              </button>
            </div>

            <button type="button" class="admin-topbar-icon-btn" id="admin-invoice-close-btn" style="background: none; border: 1px solid #cbd5e1; border-radius: 8px; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
              <span class="icon" style="width: 18px; height: 18px;">${icons.close}</span>
            </button>
          </div>
        </div>

        <!-- Status Message Banner -->
        <div id="admin-invoice-alert-banner" hidden style="margin: 12px 24px 0; padding: 10px 14px; border-radius: 8px; font-size: 0.88rem;"></div>

        <!-- Modal Body -->
        <div class="finance-modal-body" style="padding: 20px 24px; overflow-y: auto; flex: 1;">
          <!-- SECTION 1: PREVIEW -->
          <div id="section-invoice-preview">
            <div class="behbar-invoice-sheet" id="admin-printable-invoice" style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 26px; max-width: 760px; margin: 0 auto; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);">
              <!-- Header -->
              <div class="behbar-invoice-head" style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #059669; padding-bottom: 16px; margin-bottom: 20px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <img src="/favicon.svg" alt="بهدون" style="width: 44px; height: 44px;" />
                  <div>
                    <h2 style="margin: 0; font-size: 1.28rem; color: #059669; font-weight: 800;">سامانه هوشمند خدمات ساختمان بهدون</h2>
                    <span style="font-size: 0.78rem; color: #6b7280;">صورتحساب و فاکتور رسمی خدمات و تأسیسات ساختمان در تهران</span>
                  </div>
                </div>
                <div class="behbar-invoice-meta" style="text-align: left; font-size: 0.82rem; line-height: 1.6; color: #4b5563;">
                  <div><strong>شماره سند:</strong> <span style="font-family: monospace; direction: ltr; font-weight: 700;">#${toPersianDigits(trackingCode)}</span></div>
                  <div><strong>تاریخ صدور:</strong> ${dateStr}</div>
                  <div><strong>وضعیت سند:</strong> <span style="display: inline-block; padding: 2px 8px; background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; border-radius: 6px; font-weight: 600; font-size: 0.75rem;">رسمی و ثبت‌شده</span></div>
                </div>
              </div>

              <!-- Parties -->
              <div class="behbar-invoice-parties" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; background: #f9fafb; padding: 14px; border-radius: 8px; margin-bottom: 16px; font-size: 0.85rem;">
                <div>
                  <div style="font-weight: 700; color: #374151; margin-bottom: 4px;">صادرکننده خدمات:</div>
                  <div style="font-weight: 600; color: #111827;">مرکز تخصصی خدمات ساختمانی بهدون</div>
                  <div style="color: #6b7280; font-size: 0.78rem; margin-top: 2px;">دارای مجوز اتحادیه تأسیسات · پشتیبانی شبانه‌روزی در تهران</div>
                </div>
                <div>
                  <div style="font-weight: 700; color: #374151; margin-bottom: 4px;">طرف حساب (کارفرما / مشتری):</div>
                  <div style="font-weight: 600; color: #111827;">${doc.customerName || 'مشتری گرامی'}</div>
                  <div style="color: #6b7280; font-size: 0.78rem; margin-top: 2px;">شماره تماس: ${toPersianDigits(doc.phone || '-')}</div>
                </div>
              </div>

              <!-- Logistics Details -->
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px; background: #ecfdf5; border: 1px solid #d1fae5; padding: 10px 14px; border-radius: 8px; margin-bottom: 16px; font-size: 0.84rem;">
                <div>
                  <span style="color: #059669; font-weight: 700;">موقعیت پروژه:</span> ${doc.originCity || 'تهران'}
                </div>
                ${scheduledDateStr ? `<div><span style="color: #059669; font-weight: 700;">زمان‌بندی:</span> ${scheduledDateStr} — ساعت ${toPersianDigits(doc.scheduledTime || '')}</div>` : ''}
                <div>
                  <span style="color: #059669; font-weight: 700;">نوع خدمت:</span> ${doc.serviceLabel || 'خدمات ساختمانی'}
                </div>
              </div>

              <!-- Table of Itemized Lines -->
              <table class="behbar-invoice-table" style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 0.86rem;">
                <thead>
                  <tr style="background: #f3f4f6;">
                    <th style="text-align: center; width: 40px; padding: 10px 12px; border: 1px solid #e5e7eb;">ردیف</th>
                    <th style="text-align: right; padding: 10px 12px; border: 1px solid #e5e7eb;">شرح اقلام خدمات و هزینه‌ها</th>
                    <th style="text-align: left; width: 140px; padding: 10px 12px; border: 1px solid #e5e7eb;">مبلغ (تومان)</th>
                  </tr>
                </thead>
                <tbody id="preview-invoice-tbody">
                  ${renderPreviewRows()}
                </tbody>
              </table>

              <!-- Total -->
              <div class="behbar-invoice-total" style="display: flex; justify-content: space-between; align-items: center; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 14px 18px; border-radius: 8px; font-size: 1.1rem; margin-bottom: 24px;">
                <div>
                  <span style="font-weight: 700; color: #374151;">جمع کل صورتحساب نهایی:</span>
                </div>
                <div id="preview-invoice-total" style="font-size: 1.25rem; font-weight: 800; color: #059669;">
                  ${formatToman(currentInvoice.total)}
                </div>
              </div>

              <!-- Stamp & Sign -->
              <div class="behbar-invoice-footer-sign" style="display: flex; justify-content: space-between; align-items: flex-end; font-size: 0.8rem; color: #6b7280;">
                <div style="max-width: 480px; line-height: 1.5; font-size: 0.76rem;">
                  این سند به‌صورت دیجیتال توسط سامانه هوشمند خدمات ساختمان بهدون صادر گردیده و دارای اعتبار رسمی، کد پیگیری و تأییدیه قانونی می‌باشد.
                </div>
                <div style="text-align: center; border-top: 1px dashed #d1d5db; padding-top: 6px; width: 150px; font-size: 0.78rem; color: #4b5563;">
                  مهر و امضای امور مالی بهدون
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION 2: EDIT INVOICE -->
          <div id="section-invoice-edit" hidden>
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; padding: 12px 16px; border-radius: 10px; margin-bottom: 18px; font-size: 0.86rem; line-height: 1.6;">
              💡 <strong>راهنمای اصلاح فاکتور:</strong> در این بخش می‌توانید هر ردیف را ویرایش کنید، مبالغ را تغییر دهید، ردیف‌های جدید اضافه نمایید یا موارد اضافی را حذف کنید. پس از ثبت نهایی، فاکتور به‌روزرسانی شده و پیامک و اعلان خودکار به مشتری ارسال خواهد شد.
            </div>

            <!-- Edit Table -->
            <div style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; margin-bottom: 16px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 0.86rem;">
                <thead>
                  <tr style="background: #f8fafc; color: #334155;">
                    <th style="width: 36px; padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">#</th>
                    <th style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; width: 230px;">عنوان ردیف خدمت / هزینه</th>
                    <th style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">شرح و جزئیات</th>
                    <th style="width: 170px; padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: left;">مبلغ (تومان)</th>
                    <th style="width: 48px; padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">عملیات</th>
                  </tr>
                </thead>
                <tbody id="admin-invoice-edit-tbody">
                  ${renderEditRows()}
                </tbody>
              </table>
            </div>

            <!-- Add Row Button -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <button type="button" id="btn-admin-add-invoice-row" style="background: #ecfdf5; border: 1px dashed #059669; color: #059669; font-weight: 700; padding: 8px 16px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; font-size: 0.86rem;">
                <span class="icon" style="width: 16px; height: 16px;">${icons.plusCircle}</span>
                <span>افزودن ردیف جدید به فاکتور</span>
              </button>

              <button type="button" id="btn-admin-reset-invoice" style="background: none; border: 1px solid #cbd5e1; color: #64748b; padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; cursor: pointer;">
                بازنشانی به اقلام اولیه
              </button>
            </div>

            <!-- Live Calculation Summary -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 700; color: #1e293b; font-size: 1rem;">جمع کل جدید فاکتور:</span>
                <span id="admin-invoice-edit-live-total" style="font-size: 1.3rem; font-weight: 800; color: #059669;">
                  ${formatToman(calculateWorkingTotal())}
                </span>
              </div>
              <div style="margin-top: 14px; border-top: 1px solid #e2e8f0; padding-top: 12px;">
                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 0.88rem; color: #1e293b;">
                  <input type="checkbox" id="chk-admin-notify-customer" checked style="width: 18px; height: 18px; accent-color: #059669; cursor: pointer;" />
                  <span>ثبت رویداد اصلاح فاکتور و ارسال خودکار اعلان درون‌برنامه‌ای و پیامک به مشتری (${toPersianDigits(doc.phone || '-')})</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Controls -->
        <div class="finance-modal-footer" style="display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; border-top: 1px solid #e2e8f0; background: #f8fafc;">
          <div id="footer-preview-actions" style="display: flex; gap: 8px;">
            <button type="button" id="btn-switch-to-edit" style="background: #0284c7; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
              <span class="icon" style="width: 16px; height: 16px;">${icons.edit}</span>
              <span>اصلاح اقلام و قیمت‌ها</span>
            </button>
          </div>

          <div id="footer-edit-actions" hidden style="display: flex; gap: 8px;">
            <button type="button" id="btn-save-invoice-changes" style="background: #059669; color: white; border: none; padding: 8px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 2px 8px rgba(5, 150, 105, 0.3);">
              <span class="icon" style="width: 18px; height: 18px;">${icons.checkCircle}</span>
              <span>ثبت تغییرات فاکتور و اعلان به کاربر</span>
            </button>
            <button type="button" id="btn-cancel-edit-invoice" style="background: white; border: 1px solid #cbd5e1; padding: 8px 14px; border-radius: 8px; cursor: pointer;">
              انصراف
            </button>
          </div>

          <div style="display: flex; gap: 8px;">
            <button type="button" class="btn btn-primary" id="btn-admin-print-invoice" style="background: #059669; color: white; border: none; padding: 8px 14px; border-radius: 8px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;" title="چاپ یا ذخیره PDF">
              <span class="icon" style="width: 16px; height: 16px;">${icons.printer}</span>
              <span>چاپ PDF</span>
            </button>
            <button type="button" class="btn btn-secondary" id="btn-admin-download-invoice" style="background: white; border: 1px solid #cbd5e1; padding: 8px 14px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;" title="دریافت فایل سند">
              <span class="icon" style="width: 16px; height: 16px;">${icons.download}</span>
              <span>دریافت HTML</span>
            </button>
            <button type="button" class="btn btn-secondary" id="btn-admin-close-modal" style="background: white; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 8px; cursor: pointer;">
              بستن
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  const close = () => {
    container!.innerHTML = '';
  };

  const previewSection = document.getElementById('section-invoice-preview');
  const editSection = document.getElementById('section-invoice-edit');
  const previewTabBtn = document.getElementById('tab-btn-preview');
  const editTabBtn = document.getElementById('tab-btn-edit');
  const previewActions = document.getElementById('footer-preview-actions');
  const editActions = document.getElementById('footer-edit-actions');
  const alertBanner = document.getElementById('admin-invoice-alert-banner');
  const editTbody = document.getElementById('admin-invoice-edit-tbody');
  const liveTotalEl = document.getElementById('admin-invoice-edit-live-total');
  const previewTbody = document.getElementById('preview-invoice-tbody');
  const previewTotal = document.getElementById('preview-invoice-total');

  function setTab(tab: 'preview' | 'edit') {
    if (tab === 'preview') {
      previewSection!.hidden = false;
      editSection!.hidden = true;
      previewActions!.hidden = false;
      editActions!.hidden = true;
      previewTabBtn!.style.background = 'white';
      previewTabBtn!.style.color = '#0f172a';
      editTabBtn!.style.background = 'transparent';
      editTabBtn!.style.color = '#64748b';
    } else {
      previewSection!.hidden = true;
      editSection!.hidden = false;
      previewActions!.hidden = true;
      editActions!.hidden = false;
      editTabBtn!.style.background = 'white';
      editTabBtn!.style.color = '#0f172a';
      previewTabBtn!.style.background = 'transparent';
      previewTabBtn!.style.color = '#64748b';
    }
  }

  function showAlert(msg: string, isError = false) {
    if (!alertBanner) return;
    alertBanner.hidden = false;
    alertBanner.style.background = isError ? '#fef2f2' : '#ecfdf5';
    alertBanner.style.border = isError ? '1px solid #fecaca' : '1px solid #a7f3d0';
    alertBanner.style.color = isError ? '#dc2626' : '#059669';
    alertBanner.textContent = msg;
  }

  function wireEditInputs() {
    if (!editTbody) return;
    editTbody.innerHTML = renderEditRows();

    // Sync input changes to workingItems
    editTbody.querySelectorAll<HTMLInputElement>('.invoice-field-title').forEach((input) => {
      input.addEventListener('input', () => {
        const idx = Number(input.dataset.idx);
        if (workingItems[idx]) workingItems[idx].title = input.value.trim();
      });
    });

    editTbody.querySelectorAll<HTMLInputElement>('.invoice-field-desc').forEach((input) => {
      input.addEventListener('input', () => {
        const idx = Number(input.dataset.idx);
        if (workingItems[idx]) workingItems[idx].description = input.value.trim();
      });
    });

    editTbody.querySelectorAll<HTMLInputElement>('.invoice-field-amount').forEach((input) => {
      input.addEventListener('input', () => {
        const idx = Number(input.dataset.idx);
        const val = Math.max(0, Number(input.value) || 0);
        if (workingItems[idx]) workingItems[idx].amount = val;
        if (liveTotalEl) liveTotalEl.textContent = formatToman(calculateWorkingTotal());
      });
    });

    // Delete row buttons
    editTbody.querySelectorAll<HTMLButtonElement>('[data-delete-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.deleteIdx);
        workingItems.splice(idx, 1);
        wireEditInputs();
        if (liveTotalEl) liveTotalEl.textContent = formatToman(calculateWorkingTotal());
      });
    });
  }

  previewTabBtn?.addEventListener('click', () => setTab('preview'));
  editTabBtn?.addEventListener('click', () => {
    wireEditInputs();
    setTab('edit');
  });
  document.getElementById('btn-switch-to-edit')?.addEventListener('click', () => {
    wireEditInputs();
    setTab('edit');
  });
  document.getElementById('btn-cancel-edit-invoice')?.addEventListener('click', () => setTab('preview'));

  // Add new row button
  document.getElementById('btn-admin-add-invoice-row')?.addEventListener('click', () => {
    workingItems.push({
      id: `custom_${Date.now()}`,
      title: 'خدمات مازاد / هزینه سفارشی',
      description: 'شرح خدمت انجام‌شده',
      amount: 100000,
    });
    wireEditInputs();
    if (liveTotalEl) liveTotalEl.textContent = formatToman(calculateWorkingTotal());
  });

  // Reset to original
  document.getElementById('btn-admin-reset-invoice')?.addEventListener('click', () => {
    const original = resolveOrderInvoice(doc);
    workingItems = original.items.map((it, idx) => ({
      id: it.id || `item_${idx}`,
      title: it.title,
      description: it.description,
      amount: it.amount,
    }));
    wireEditInputs();
    if (liveTotalEl) liveTotalEl.textContent = formatToman(calculateWorkingTotal());
  });

  // Save invoice modifications and notify customer
  const saveBtn = document.getElementById('btn-save-invoice-changes') as HTMLButtonElement | null;
  saveBtn?.addEventListener('click', async () => {
    // Read any pending input values
    editTbody?.querySelectorAll<HTMLInputElement>('.invoice-field-title').forEach((input) => {
      const idx = Number(input.dataset.idx);
      if (workingItems[idx]) workingItems[idx].title = input.value.trim();
    });
    editTbody?.querySelectorAll<HTMLInputElement>('.invoice-field-desc').forEach((input) => {
      const idx = Number(input.dataset.idx);
      if (workingItems[idx]) workingItems[idx].description = input.value.trim();
    });
    editTbody?.querySelectorAll<HTMLInputElement>('.invoice-field-amount').forEach((input) => {
      const idx = Number(input.dataset.idx);
      if (workingItems[idx]) workingItems[idx].amount = Math.max(0, Number(input.value) || 0);
    });

    const total = calculateWorkingTotal();
    const notifyCustomer = (document.getElementById('chk-admin-notify-customer') as HTMLInputElement | null)?.checked ?? true;

    saveBtn.disabled = true;
    saveBtn.textContent = 'در حال ثبت و ارسال اعلان...';

    try {
      await updateRequestInvoice(doc.id, {
        invoiceItems: workingItems,
        estimateAvg: total,
        notifyCustomer,
      });

      // Update local doc state
      doc.invoiceItems = workingItems;
      doc.estimateAvg = total;
      currentInvoice = {
        items: [...workingItems],
        subtotal: total,
        discount: 0,
        tax: 0,
        total,
        isIntercity: currentInvoice.isIntercity,
        distanceKm: currentInvoice.distanceKm,
      };

      // Refresh preview sheet
      if (previewTbody) previewTbody.innerHTML = renderPreviewRows();
      if (previewTotal) previewTotal.textContent = formatToman(total);

      showAlert('✓ اقلام و مبالغ فاکتور با موفقیت ذخیره شد و اعلان سیستمی و پیامک برای مشتری ارسال گردید.');
      setTab('preview');

      // Trigger pipeline update
      onUpdate?.();
    } catch (err) {
      showAlert(err instanceof Error ? err.message : 'ثبت تغییرات فاکتور ناموفق بود.', true);
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = `<span class="icon" style="width: 18px; height: 18px;">${icons.checkCircle}</span><span>ثبت تغییرات فاکتور و اعلان به کاربر</span>`;
    }
  });

  document.getElementById('admin-invoice-close-btn')?.addEventListener('click', close);
  document.getElementById('btn-admin-close-modal')?.addEventListener('click', close);
  document.getElementById('admin-invoice-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('admin-invoice-modal-backdrop')) close();
  });

  document.getElementById('btn-admin-print-invoice')?.addEventListener('click', () => {
    printAdminInvoiceSheet('admin-printable-invoice');
  });

  document.getElementById('btn-admin-download-invoice')?.addEventListener('click', () => {
    downloadAdminInvoiceHtml('admin-printable-invoice', trackingCode);
  });
}


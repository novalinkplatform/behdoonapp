import { icons } from './icons.ts';
import { formatToman } from '../utils/format.ts';
import { toPersianDigits, formatIranianDate } from '../utils/jalali.ts';
import { pick } from '../i18n/lang.ts';
import type { DetailedInvoice } from '../data/pricing.ts';

export interface CustomerInvoiceData {
  trackingCode: string;
  customerName: string;
  phone: string;
  serviceLabel: string;
  originProvince?: string;
  originCity: string;
  destinationProvince?: string;
  destinationCity: string;
  scheduledDate: string;
  scheduledTime: string;
  createdAt?: string;
  statusLabel?: string;
  invoice: DetailedInvoice;
}

/**
 * Isolated print function ensuring NO browser-injected header (such as "پنل مدیریت بهدون")
 * appears on top of the print or PDF output.
 */
function printCustomerInvoiceSheet(elementId: string): void {
  const sheet = document.getElementById(elementId);
  if (!sheet) {
    window.print();
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.left = '-9999px';
  iframe.style.top = '0';
  iframe.style.width = '794px'; // 210mm at 96 DPI
  iframe.style.height = '1123px'; // 297mm at 96 DPI
  iframe.style.border = '0';
  iframe.style.opacity = '0.01';
  iframe.style.pointerEvents = 'none';
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
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body {
          margin: 0;
          padding: 0;
          background: #ffffff !important;
          color: #0f172a !important;
          direction: rtl;
        }
        .behdoon-invoice-sheet,
        .behbar-invoice-sheet {
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
          background: white;
          padding: 20px 24px;
          border: 2px solid #334155 !important;
          border-radius: 8px !important;
          box-sizing: border-box;
        }
        .behdoon-invoice-head,
        .behbar-invoice-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2.5px solid #059669;
          padding-bottom: 14px;
          margin-bottom: 16px;
        }
        .behdoon-invoice-meta,
        .behbar-invoice-meta {
          text-align: left;
          font-size: 0.82rem;
          line-height: 1.6;
          color: #334155;
          background: #f8fafc;
          border: 1.5px solid #cbd5e1;
          border-radius: 6px;
          padding: 8px 14px;
          min-width: 220px;
        }
        .behdoon-invoice-parties,
        .behbar-invoice-parties {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          background: #f8fafc !important;
          border: 1.5px solid #cbd5e1 !important;
          padding: 12px 14px;
          border-radius: 6px;
          margin-bottom: 14px;
          font-size: 0.84rem;
        }
        .behdoon-invoice-route,
        .behbar-invoice-route {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          background: #ecfdf5 !important;
          border: 1.5px solid #a7f3d0 !important;
          padding: 10px 14px;
          border-radius: 6px;
          margin-bottom: 14px;
          font-size: 0.82rem;
        }
        .behdoon-invoice-table,
        .behbar-invoice-table {
          width: 100%;
          border-collapse: collapse !important;
          border: 1.5px solid #334155 !important;
          margin-bottom: 18px;
          font-size: 0.85rem;
        }
        .behdoon-invoice-table th,
        .behbar-invoice-table th {
          background: #f1f5f9 !important;
          color: #0f172a !important;
          font-weight: 700;
          padding: 10px 12px;
          border: 1.5px solid #334155 !important;
          text-align: right;
        }
        .behdoon-invoice-table td,
        .behbar-invoice-table td {
          padding: 10px 12px;
          border: 1px solid #cbd5e1 !important;
          text-align: right;
          vertical-align: middle;
        }
        .behdoon-invoice-total,
        .behbar-invoice-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #ecfdf5 !important;
          border: 1.5px solid #059669 !important;
          padding: 12px 18px;
          border-radius: 6px;
          font-size: 1.05rem;
          margin-bottom: 20px;
        }
        .behdoon-invoice-footer-sign,
        .behbar-invoice-footer-sign {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          font-size: 0.78rem;
          color: #475569;
          border-top: 1.5px dashed #cbd5e1;
          padding-top: 12px;
        }
        .invoice-badge-status {
          display: inline-block;
          padding: 2px 8px;
          background: #ecfdf5 !important;
          color: #065f46 !important;
          border: 1px solid #a7f3d0 !important;
          border-radius: 4px;
          font-weight: 600;
          font-size: 0.75rem;
        }
        .behdoon-invoice-sheet .icon,
        .behbar-invoice-sheet .icon,
        .icon {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 15px !important;
          height: 15px !important;
          min-width: 15px !important;
          min-height: 15px !important;
          vertical-align: middle !important;
        }
        .behdoon-invoice-sheet .icon svg,
        .behdoon-invoice-sheet svg,
        .behbar-invoice-sheet .icon svg,
        .behbar-invoice-sheet svg,
        .icon svg,
        svg {
          width: 14px !important;
          height: 14px !important;
          max-width: 15px !important;
          max-height: 15px !important;
          display: inline-block !important;
          vertical-align: middle !important;
        }
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: #ffffff !important;
          }
          .behdoon-invoice-sheet,
          .behbar-invoice-sheet {
            border: 2px solid #334155 !important;
            border-radius: 8px !important;
            box-shadow: none !important;
            padding: 18px 22px !important;
            max-width: 100% !important;
            page-break-inside: avoid;
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

function downloadCustomerInvoiceHtml(elementId: string, trackingCode: string): void {
  const sheet = document.getElementById(elementId);
  if (!sheet) return;

  const htmlContent = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>فاکتور رسمی بهدون - #${trackingCode}</title>
  <style>
    * { box-sizing: border-box; font-family: Tahoma, 'Vazirmatn', sans-serif; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { font-family: Tahoma, 'Vazirmatn', sans-serif; background: #f8fafc; padding: 20px; color: #0f172a; margin: 0; }
    .behdoon-invoice-sheet, .behbar-invoice-sheet { background: white; max-width: 760px; margin: 0 auto; padding: 22px 24px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 2px solid #334155 !important; }
    .behdoon-invoice-head, .behbar-invoice-head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2.5px solid #059669; padding-bottom: 14px; margin-bottom: 16px; }
    .behdoon-invoice-meta, .behbar-invoice-meta { text-align: left; font-size: 0.82rem; line-height: 1.6; color: #334155; background: #f8fafc !important; border: 1.5px solid #cbd5e1 !important; border-radius: 6px; padding: 8px 14px; min-width: 220px; }
    .behdoon-invoice-parties, .behbar-invoice-parties { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; background: #f8fafc !important; border: 1.5px solid #cbd5e1 !important; padding: 12px 14px; border-radius: 6px; margin-bottom: 14px; font-size: 0.84rem; }
    .behdoon-invoice-route, .behbar-invoice-route { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px; background: #ecfdf5 !important; border: 1.5px solid #a7f3d0 !important; padding: 10px 14px; border-radius: 6px; margin-bottom: 14px; font-size: 0.82rem; }
    .behdoon-invoice-table, .behbar-invoice-table { width: 100%; border-collapse: collapse !important; border: 1.5px solid #334155 !important; margin-bottom: 18px; font-size: 0.85rem; }
    .behdoon-invoice-table th, .behbar-invoice-table th { background: #f1f5f9 !important; color: #0f172a !important; font-weight: 700; padding: 10px 12px; border: 1.5px solid #334155 !important; text-align: right; }
    .behdoon-invoice-table td, .behbar-invoice-table td { padding: 10px 12px; border: 1px solid #cbd5e1 !important; text-align: right; vertical-align: middle; }
    .behdoon-invoice-total, .behbar-invoice-total { display: flex; justify-content: space-between; align-items: center; background: #ecfdf5 !important; border: 1.5px solid #059669 !important; padding: 12px 18px; border-radius: 6px; font-size: 1.05rem; margin-bottom: 20px; }
    .behdoon-invoice-footer-sign, .behbar-invoice-footer-sign { display: flex; justify-content: space-between; align-items: flex-end; font-size: 0.78rem; color: #475569; border-top: 1.5px dashed #cbd5e1; padding-top: 12px; }
    .invoice-badge-status { display: inline-block; padding: 2px 8px; background: #ecfdf5 !important; color: #065f46 !important; border: 1px solid #a7f3d0 !important; border-radius: 4px; font-weight: 600; font-size: 0.75rem; }
    .behdoon-invoice-sheet .icon,
    .behbar-invoice-sheet .icon,
    .icon {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 15px !important;
      height: 15px !important;
      min-width: 15px !important;
      min-height: 15px !important;
      vertical-align: middle !important;
    }
    .behdoon-invoice-sheet .icon svg,
    .behdoon-invoice-sheet svg,
    .behbar-invoice-sheet .icon svg,
    .behbar-invoice-sheet svg,
    .icon svg,
    svg {
      width: 14px !important;
      height: 14px !important;
      max-width: 15px !important;
      max-height: 15px !important;
      display: inline-block !important;
      vertical-align: middle !important;
    }
    @media print {
      body { background: white !important; padding: 0 !important; }
      .behdoon-invoice-sheet, .behbar-invoice-sheet { box-shadow: none !important; border: 2px solid #334155 !important; border-radius: 8px !important; padding: 18px 22px !important; }
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

export function openCustomerInvoiceModal(data: CustomerInvoiceData): void {
  const existing = document.getElementById('behdoon-invoice-modal-overlay') || document.getElementById('behbar-invoice-modal-overlay');
  if (existing) existing.remove();

  // Always format dates to Iranian (Jalali) calendar
  const issueDateJalali = formatIranianDate(data.createdAt);
  const scheduleDateJalali = formatIranianDate(data.scheduledDate);

  const rowsHtml = data.invoice.items
    .map(
      (item, idx) => `
    <tr>
      <td style="text-align: center; width: 40px;">${toPersianDigits(idx + 1)}</td>
      <td>
        <strong style="display: block; color: #1f2937; font-size: 0.92rem;">${item.title}</strong>
        <span style="display: block; color: #6b7280; font-size: 0.78rem; margin-top: 2px;">${item.description}</span>
      </td>
      <td style="text-align: left; font-weight: 700; color: ${item.amount === 0 ? '#9ca3af' : '#059669'}; white-space: nowrap; font-size: 0.92rem;">
        ${item.amount === 0 ? pick('رایگان / بدون سفارش', 'Free / Not requested') : formatToman(item.amount)}
      </td>
    </tr>
  `,
    )
    .join('');

  const modalHtml = `
    <div class="invoice-modal-overlay" id="behdoon-invoice-modal-overlay">
      <div class="invoice-modal-dialog">
        <div class="invoice-modal-topbar">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="icon" style="color: #059669; width: 22px; height: 22px;">${icons.fileText}</span>
            <h3 style="margin: 0; font-size: 1.05rem; font-weight: 700;">${pick('فاکتور رسمی خدمات بهدون', 'Official Service Invoice')}</h3>
          </div>
          <button type="button" class="invoice-modal-close-btn" id="invoice-modal-close" title="${pick('بستن', 'Close')}">
            <span class="icon">${icons.close}</span>
          </button>
        </div>

        <div class="invoice-modal-body">
          <div class="behdoon-invoice-sheet" id="behdoon-customer-printable-sheet">
            <!-- Header -->
            <div class="behdoon-invoice-head">
              <div style="display: flex; align-items: center; gap: 10px;">
                <img src="/favicon.svg" alt="بهدون" style="width: 32px; height: 32px; max-width: 32px; max-height: 32px; object-fit: contain;" />
                <div>
                  <h2 style="margin: 0; font-size: 1.15rem; color: #059669; font-weight: 800;">${pick('سامانه هوشمند خدمات ساختمان بهدون', 'Behdoon Smart Home Services')}</h2>
                  <span style="font-size: 0.78rem; color: #6b7280;">${pick('صورتحساب و فاکتور رسمی خدمات و تأسیسات ساختمان در تهران', 'Official Home Maintenance & Repair Invoice')}</span>
                </div>
              </div>
              <div class="behdoon-invoice-meta">
                <div><strong>${pick('شماره سند / پیگیری:', 'Doc / Tracking No:')}</strong> <span style="font-family: monospace; direction: ltr; font-weight: 700;">#${toPersianDigits(data.trackingCode)}</span></div>
                <div><strong>${pick('تاریخ صدور:', 'Issue Date:')}</strong> ${issueDateJalali}</div>
                ${data.statusLabel ? `<div><strong>${pick('وضعیت درخواست:', 'Status:')}</strong> <span class="invoice-badge-status">${data.statusLabel}</span></div>` : ''}
              </div>
            </div>

            <!-- Parties -->
            <div class="behdoon-invoice-parties">
              <div>
                <div style="font-weight: 700; color: #374151; margin-bottom: 4px;">${pick('صادرکننده خدمات:', 'Service Provider:')}</div>
                <div style="font-weight: 600; color: #111827;">${pick('مرکز تخصصی خدمات ساختمانی بهدون', 'Behdoon Home Services Co.')}</div>
                <div style="color: #6b7280; font-size: 0.78rem; margin-top: 2px;">${pick('دارای مجوز منصفانه تأسیسات · پشتیبانی شبانه‌روزی در تهران', 'Licensed Home Services · 24/7 Support')}</div>
              </div>
              <div>
                <div style="font-weight: 700; color: #374151; margin-bottom: 4px;">${pick('طرف حساب (کارفرما / مشتری):', 'Customer / Bill To:')}</div>
                <div style="font-weight: 600; color: #111827;">${data.customerName || pick('مشتری گرامی', 'Valued Customer')}</div>
                <div style="color: #6b7280; font-size: 0.78rem; margin-top: 2px;">${pick('شماره تماس:', 'Phone:')} ${toPersianDigits(data.phone)}</div>
              </div>
            </div>

            <!-- Logistics Details -->
            <div class="behdoon-invoice-route">
              <div>
                <span class="icon" style="width: 14px; height: 14px; min-width: 14px; min-height: 14px; max-width: 14px; max-height: 14px; display: inline-flex; align-items: center; justify-content: center; color: #059669;">${icons.pin}</span>
                <span><strong>${pick('موقعیت و محدوده سرویس:', 'Service Location:')}</strong> ${data.originCity || 'تهران'}</span>
              </div>
              <div>
                <span class="icon" style="width: 14px; height: 14px; min-width: 14px; min-height: 14px; max-width: 14px; max-height: 14px; display: inline-flex; align-items: center; justify-content: center; color: #059669;">${icons.calendar}</span>
                <span><strong>${pick('زمان‌بندی مراجعه تکنسین:', 'Schedule:')}</strong> ${scheduleDateJalali} — ${pick('ساعت', 'at')} ${toPersianDigits(data.scheduledTime)}</span>
              </div>
              <div>
                <span class="icon" style="width: 14px; height: 14px; min-width: 14px; min-height: 14px; max-width: 14px; max-height: 14px; display: inline-flex; align-items: center; justify-content: center; color: #059669;">${icons.route}</span>
                <span><strong>${pick('نوع خدمت:', 'Service:')}</strong> ${data.serviceLabel}</span>
              </div>
            </div>

            <!-- Itemized Table -->
            <table class="behdoon-invoice-table">
              <thead>
                <tr>
                  <th style="text-align: center; width: 40px;">${pick('ردیف', '#')}</th>
                  <th>${pick('شرح اقلام خدمات و هزینه‌ها', 'Description of Services & Fees')}</th>
                  <th style="text-align: left; width: 140px;">${pick('مبلغ (تومان)', 'Amount (Toman)')}</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>

            <!-- Total -->
            <div class="behdoon-invoice-total">
              <div>
                <span style="font-weight: 700; color: #374151;">${pick('جمع کل صورتحساب نهایی:', 'Total Invoice Amount:')}</span>
              </div>
              <div style="font-size: 1.22rem; font-weight: 800; color: #059669;">
                ${formatToman(data.invoice.total)}
              </div>
            </div>

            <!-- Legal Footer -->
            <div class="behdoon-invoice-footer-sign">
              <div style="font-size: 0.76rem; color: #6b7280; max-width: 480px; line-height: 1.5;">
                ${pick(
                  'این فاکتور به‌صورت الکترونیکی و رسمی توسط سامانه بهدون صادر شده و دارای ضمانت کتبی کیفیت خدمات می‌باشد.',
                  'This invoice was generated electronically by Behdoon with official warranty and valid tracking code.',
                )}
              </div>
              <div style="border: 1.5px dashed #059669; border-radius: 6px; padding: 6px 12px; text-align: center; background: #f0fdf4; color: #065f46; min-width: 150px;">
                <div style="font-weight: 700; font-size: 0.78rem;">${pick('مهر و امضای دیجیتال بهدون', 'Digital Seal & Signature')}</div>
                <div style="font-size: 0.68rem; color: #059669; font-weight: 600; margin-top: 2px;">واحد مالی و نظارت کیفی</div>
                <div style="font-size: 0.65rem; color: #047857; margin-top: 4px; font-family: monospace;">OFFICIAL · VERIFIED</div>
              </div>
            </div>
          </div>
        </div>

        <div class="invoice-modal-actions">
          <button type="button" class="btn btn-primary" id="btn-print-customer-invoice" title="${pick('چاپ یا ذخیره فاکتور به‌صورت PDF بدون عنوان اضافی', 'Print or Save as PDF')}">
            <span class="icon">${icons.printer}</span>
            <span>${pick('چاپ و ذخیره PDF', 'Print / Save PDF')}</span>
          </button>
          <button type="button" class="btn btn-secondary" id="btn-download-customer-invoice" style="display: inline-flex; align-items: center; gap: 6px;" title="${pick('دریافت فایل سند آفلاین فاکتور', 'Download Offline Invoice File')}">
            <span class="icon" style="width: 16px; height: 16px;">${icons.download}</span>
            <span>${pick('دریافت فایل فاکتور', 'Download Invoice')}</span>
          </button>
          <button type="button" class="btn btn-secondary" id="btn-close-customer-invoice">
            ${pick('بستن', 'Close')}
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const overlay = document.getElementById('behdoon-invoice-modal-overlay');
  const closeBtn = document.getElementById('invoice-modal-close');
  const closeBottomBtn = document.getElementById('btn-close-customer-invoice');
  const printBtn = document.getElementById('btn-print-customer-invoice');
  const downloadBtn = document.getElementById('btn-download-customer-invoice');

  const close = () => overlay?.remove();

  closeBtn?.addEventListener('click', close);
  closeBottomBtn?.addEventListener('click', close);
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  printBtn?.addEventListener('click', () => {
    printCustomerInvoiceSheet('behdoon-customer-printable-sheet');
  });

  downloadBtn?.addEventListener('click', () => {
    downloadCustomerInvoiceHtml('behdoon-customer-printable-sheet', data.trackingCode);
  });
}


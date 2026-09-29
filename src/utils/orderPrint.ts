import { toPersianDigits, formatIranianDate } from './jalali.ts';
import { formatToman } from './format.ts';
import { statusLabel } from '../data/status.ts';
import { pick } from '../i18n/lang.ts';
import type { CustomerOrderDetail, OrderRecord } from './api.ts';

export function generateOrderPrintHtml(input: CustomerOrderDetail | OrderRecord): string {
  // Normalize whether input is CustomerOrderDetail or OrderRecord
  const isDetail = 'order' in input && input.order !== undefined;
  const order: OrderRecord = isDetail ? (input as CustomerOrderDetail).order : (input as OrderRecord);
  const detail = isDetail ? (input as CustomerOrderDetail) : null;
  const provider = detail?.provider || null;
  const timeline = detail?.timeline || [];
  const invoice = detail?.invoice || null;

  const trackingCode = order.trackingCode || `${order.id}`;
  const createdAtFormatted = order.createdAt ? formatIranianDate(order.createdAt) : '-';
  const scheduledDateFormatted = order.scheduledDate ? formatIranianDate(order.scheduledDate) : '-';
  const scheduledTimeFormatted = order.scheduledTime ? toPersianDigits(order.scheduledTime) : '-';
  const priceDisplay = order.finalPrice || order.estimateAvg || (invoice?.totalAmount ?? 0);

  // Status badge styling
  const statusFa = statusLabel(order.status);

  // Specialist info
  const specialistName = provider?.name || order.providerName || pick('در نوبت اعزام نزدیک‌ترین کارشناس بهدون', 'Matching specialist');
  const specialistPhone = provider?.phone ? toPersianDigits(provider.phone) : pick('ارتباط از طریق پشتیبانی سامانه', 'Contact via support');
  const score = provider?.performanceScore ?? (provider as any)?.rating;
  const specialistRating = score ? `★ ${toPersianDigits(Number(score).toFixed(1))} (${toPersianDigits(provider?.totalJobs || 0)} خدمت موفق)` : pick('تکنسین احراز صلاحیت‌شده', 'Verified Technician');

  // Timeline rows
  let timelineRows = '';
  if (timeline && timeline.length > 0) {
    timelineRows = timeline
      .map(
        (t, idx) => `
      <tr>
        <td style="text-align: center; width: 35px;">${toPersianDigits(idx + 1)}</td>
        <td style="font-weight: 600; color: #1e293b;">${t.title}</td>
        <td style="color: #475569; font-size: 0.8rem;">${t.description || '-'}</td>
        <td style="text-align: center; color: #64748b; font-size: 0.78rem; white-space: nowrap;">${formatIranianDate(t.timestamp)}</td>
      </tr>
    `,
      )
      .join('');
  } else {
    timelineRows = `
      <tr>
        <td style="text-align: center; width: 35px;">۱</td>
        <td style="font-weight: 600; color: #1e293b;">ثبت اولیه و استعلام هوشمند</td>
        <td style="color: #475569; font-size: 0.8rem;">درخواست متقاضی در سامانه هوشمند بهدون ثبت و ارزیابی فنی اولیه انجام شد.</td>
        <td style="text-align: center; color: #64748b; font-size: 0.78rem; white-space: nowrap;">${createdAtFormatted}</td>
      </tr>
      <tr>
        <td style="text-align: center; width: 35px;">۲</td>
        <td style="font-weight: 600; color: #1e293b;">تخصیص کارشناس و اعزام</td>
        <td style="color: #475569; font-size: 0.8rem;">هماهنگی ساعت مراجعه تکنسین و آمادگی تجهیزات مورد نیاز.</td>
        <td style="text-align: center; color: #64748b; font-size: 0.78rem; white-space: nowrap;">${scheduledDateFormatted}</td>
      </tr>
    `;
  }

  // Address
  const fullAddress = [
    order.originProvince ? `${order.originProvince}، ` : '',
    order.originCity || 'تهران',
    order.originNotes ? ` — ${order.originNotes}` : ' (موقعیت ثبت‌شده در سفارش)',
  ].join('');

  return `
    <div class="behdoon-request-sheet" id="printable-order-request-sheet">
      <!-- Header -->
      <div class="behdoon-request-head">
        <div class="behdoon-brand-wrap">
          <img src="/favicon.svg" alt="بهدون" style="width: 32px; height: 32px; max-width: 32px; max-height: 32px; object-fit: contain;" />
          <div class="behdoon-brand-titles">
            <h1>${pick('سامانه هوشمند خدمات فنی و ساختمانی بهدون', 'Behdoon Smart Home Services')}</h1>
            <p>${pick('برگه رسمی ثبت، پیگیری و پذیرش درخواست خدمات فنی در محل', 'Official Service Request & Dispatch Dossier')}</p>
          </div>
        </div>
        <div class="behdoon-request-meta">
          <div><strong>${pick('شماره پرونده / پیگیری:', 'Tracking No:')}</strong> <span style="font-family: monospace; font-weight: 800; font-size: 0.95rem; direction: ltr; color: #0f172a;">#${toPersianDigits(trackingCode)}</span></div>
          <div><strong>${pick('تاریخ ثبت درخواست:', 'Registration Date:')}</strong> <span>${createdAtFormatted}</span></div>
          <div><strong>${pick('وضعیت پرونده:', 'Current Status:')}</strong> <span class="behdoon-badge behdoon-badge-status">${statusFa}</span></div>
          <div style="font-size: 0.72rem; color: #64748b; margin-top: 4px;">behdoon.ir/orders.html</div>
        </div>
      </div>

      <!-- Customer & Specialist Details Cards (Grid) -->
      <div class="behdoon-grid-2">
        <!-- Customer Box -->
        <div class="behdoon-card">
          <div class="behdoon-card-title">
            <span>👤</span>
            <span>${pick('مشخصات متقاضی (کارفرما)', 'Customer Details')}</span>
          </div>
          <div style="display: grid; grid-template-columns: 90px 1fr; gap: 4px; line-height: 1.6;">
            <span style="color: #64748b;">${pick('نام و نشان:', 'Full Name:')}</span>
            <strong style="color: #0f172a;">${order.customerName || pick('مشتری گرامی', 'Valued Customer')}</strong>
            <span style="color: #64748b;">${pick('شماره تماس:', 'Phone:')}</span>
            <span style="direction: ltr; text-align: right; font-weight: 600;">${toPersianDigits(order.phone || '-')}</span>
            <span style="color: #64748b;">${pick('نشانی محل:', 'Address:')}</span>
            <span style="color: #1e293b;">${fullAddress}</span>
            ${order.originPropertyType ? `<span style="color: #64748b;">نوع ملک:</span><span>${order.originPropertyType}</span>` : ''}
          </div>
        </div>

        <!-- Specialist / Provider Box -->
        <div class="behdoon-card">
          <div class="behdoon-card-title">
            <span>🔧</span>
            <span>${pick('اطلاعات کارشناس و تکنسین بهدون', 'Assigned Specialist')}</span>
          </div>
          <div style="display: grid; grid-template-columns: 90px 1fr; gap: 4px; line-height: 1.6;">
            <span style="color: #64748b;">${pick('کارشناس مجری:', 'Specialist:')}</span>
            <strong style="color: #0f172a;">${specialistName}</strong>
            <span style="color: #64748b;">${pick('تماس هماهنگی:', 'Contact:')}</span>
            <span style="direction: ltr; text-align: right; font-weight: 600;">${specialistPhone}</span>
            <span style="color: #64748b;">${pick('امتیاز و رتبه:', 'Rating:')}</span>
            <span style="color: #b45309; font-weight: 600;">${specialistRating}</span>
            <span style="color: #64748b;">${pick('ضمانت اجرا:', 'Warranty:')}</span>
            <span style="color: #059669; font-weight: 600;">پشتیبانی و تضمین رسمی بهدون</span>
          </div>
        </div>
      </div>

      <!-- Service Specifications & Schedule Banner -->
      <div class="behdoon-card" style="margin-bottom: 14px; background: #ffffff;">
        <div class="behdoon-card-title" style="color: #059669;">
          <span>📋</span>
          <span>${pick('مشخصات خدمت و زمان‌بندی حضور متخصص', 'Service Details & Scheduled Appointment')}</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 0.82rem;">
          <div>
            <div style="color: #64748b; font-size: 0.76rem;">${pick('رسته و عنوان خدمت:', 'Service Category:')}</div>
            <strong style="color: #0f172a; font-size: 0.88rem;">${order.serviceLabel}</strong>
          </div>
          <div>
            <div style="color: #64748b; font-size: 0.76rem;">${pick('تاریخ مقرر مراجعه:', 'Scheduled Date:')}</div>
            <strong style="color: #0f172a; font-size: 0.88rem;">${scheduledDateFormatted}</strong>
          </div>
          <div>
            <div style="color: #64748b; font-size: 0.76rem;">${pick('ساعت هماهنگ‌شده:', 'Time Slot:')}</div>
            <strong style="color: #0f172a; font-size: 0.88rem;">ساعت ${scheduledTimeFormatted}</strong>
          </div>
        </div>
        ${
          order.laborChoice || order.wantsPacking
            ? `
          <div style="margin-top: 8px; padding-top: 6px; border-top: 1px dashed #e2e8f0; font-size: 0.78rem; color: #475569;">
            <span>${pick('جزئیات سفارش:', 'Preferences:')}</span>
            ${order.laborChoice === 'with_parts' ? ' · تأمین قطعات و لوازم یدکی توسط بهدون (همراه فاکتور خرید معتبر)' : ' · فقط دستمزد و کارشناسی فنی (بدون تهیه قطعات مصرفی)'}
            ${order.wantsPacking ? ' · همراه با بسته‌بندی و متریال محافظ' : ''}
          </div>
        `
            : ''
        }
      </div>

      <!-- Workflow Timeline Table -->
      <div style="margin-bottom: 14px;">
        <div style="font-weight: 700; font-size: 0.86rem; color: #0f172a; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
          <span>گردش کار و وضعیت مراحل انجام خدمت</span>
          <span style="font-size: 0.75rem; color: #64748b; font-weight: normal;">سامانه نظارت بر کیفیت خدمات فنی</span>
        </div>
        <table class="behdoon-table">
          <thead>
            <tr>
              <th style="text-align: center; width: 35px;">#</th>
              <th style="width: 160px;">عنوان مرحله</th>
              <th>شرح اقدامات و توضیحات تکنسین</th>
              <th style="text-align: center; width: 110px;">تاریخ و ساعت</th>
            </tr>
          </thead>
          <tbody>
            ${timelineRows}
          </tbody>
        </table>
      </div>

      <!-- Financial Summary Banner -->
      <div class="behdoon-finance-banner">
        <div>
          <span style="font-weight: 700; color: #065f46;">${pick('برآورد هزینه و وضعیت تسویه حساب:', 'Estimated Amount & Payment Status:')}</span>
          <div style="font-size: 0.78rem; color: #047857; margin-top: 2px;">
            ${order.paymentStatus === 'paid' ? '✓ این سفارش به‌صورت آنلاین تسویه شده است.' : 'پرداخت پس از انجام خدمت، کارشناسی نهایی و اعلام رضایت کارفرما انجام می‌شود.'}
          </div>
        </div>
        <div style="text-align: left;">
          <div style="font-size: 1.15rem; font-weight: 800; color: #047857;">
            ${priceDisplay ? formatToman(priceDisplay) : 'مطابق تعرفه منصفانه'}
          </div>
          <span style="font-size: 0.74rem; color: #065f46;">
            ${order.paymentStatus === 'paid' ? 'تسویه کامل' : 'برآورد منصفانه بهدون'}
          </span>
        </div>
      </div>

      <!-- Footer / Legal & Signature -->
      <div class="behdoon-request-footer">
        <div>
          <div style="font-weight: 700; color: #0f172a; margin-bottom: 3px;">شرایط ضمانت و استانداردهای بهدون:</div>
          <div style="line-height: 1.5; color: #64748b;">
            کلیه خدمات انجام‌شده توسط متخصصین بهدون دارای ضمانت کتبی حسن انجام کار تا ۴۸ ساعت پس از تحویل می‌باشند. در صورت هرگونه نقص، اعزام مجدد کارشناس بدون هزینه صورت می‌پذیرد.
          </div>
        </div>

        <div class="behdoon-customer-sign-box">
          <div style="font-weight: 700; margin-bottom: 25px;">تأیید و رضایت کارفرما / متقاضی</div>
          <div style="font-size: 0.72rem; color: #94a3b8;">امضا پس از انجام کامل خدمت</div>
        </div>

        <div class="behdoon-seal-box">
          <div style="font-weight: 700; color: #065f46; margin-bottom: 2px;">تأییدیه واحد نظارت کیفی بهدون</div>
          <div style="font-size: 0.7rem; color: #059669; font-weight: 600;">صحت‌سنجی دیجیتال و ضمانت کیفیت</div>
          <div style="font-size: 0.68rem; color: #047857; margin-top: 14px; font-family: monospace;">VERIFIED · 24/7 SUPPORT</div>
        </div>
      </div>
    </div>
  `;
}

export function printCustomerOrderSheet(input: CustomerOrderDetail | OrderRecord): void {
  const htmlInner = generateOrderPrintHtml(input);

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
          line-height: 1.5;
        }
        .behdoon-brand-wrap img {
          width: 32px !important;
          height: 32px !important;
          max-width: 32px !important;
          max-height: 32px !important;
          object-fit: contain !important;
        }
        .icon, .icon svg, svg {
          width: 14px !important;
          height: 14px !important;
          max-width: 15px !important;
          max-height: 15px !important;
          display: inline-block !important;
          vertical-align: middle !important;
        }
        .behdoon-request-sheet {
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
          background: #ffffff;
          padding: 20px 24px;
          border: 2px solid #334155 !important;
          border-radius: 8px !important;
          position: relative;
        }
        .behdoon-request-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2.5px solid #059669;
          padding-bottom: 14px;
          margin-bottom: 16px;
          gap: 16px;
        }
        .behdoon-brand-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .behdoon-brand-titles h1 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 800;
          color: #059669;
        }
        .behdoon-brand-titles p {
          margin: 2px 0 0;
          font-size: 0.8rem;
          color: #475569;
        }
        .behdoon-request-meta {
          text-align: left;
          font-size: 0.82rem;
          color: #334155;
          background: #f8fafc !important;
          border: 1.5px solid #cbd5e1 !important;
          border-radius: 6px;
          padding: 8px 14px;
          min-width: 220px;
        }
        .behdoon-request-meta div {
          margin-bottom: 3px;
        }
        .behdoon-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 700;
          font-size: 0.76rem;
          border: 1px solid;
        }
        .behdoon-badge-status {
          background: #ecfdf5 !important;
          color: #065f46 !important;
          border-color: #a7f3d0 !important;
        }
        .behdoon-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 14px;
        }
        .behdoon-card {
          border: 1.5px solid #cbd5e1 !important;
          background: #f8fafc !important;
          border-radius: 6px;
          padding: 10px 14px;
          font-size: 0.84rem;
        }
        .behdoon-card-title {
          font-weight: 800;
          color: #0f172a;
          font-size: 0.88rem;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 4px;
        }
        .behdoon-table {
          width: 100%;
          border-collapse: collapse !important;
          border: 1.5px solid #334155 !important;
          margin-bottom: 14px;
          font-size: 0.83rem;
        }
        .behdoon-table th {
          background: #f1f5f9 !important;
          color: #0f172a !important;
          border: 1.5px solid #334155 !important;
          padding: 8px 10px;
          text-align: right;
          font-weight: 700;
        }
        .behdoon-table td {
          border: 1px solid #cbd5e1 !important;
          padding: 8px 10px;
          vertical-align: middle;
        }
        .behdoon-finance-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #ecfdf5 !important;
          border: 1.5px solid #059669 !important;
          padding: 10px 16px;
          border-radius: 6px;
          margin-bottom: 14px;
          font-size: 0.88rem;
        }
        .behdoon-request-footer {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr;
          gap: 12px;
          border-top: 1.5px dashed #94a3b8;
          padding-top: 12px;
          margin-top: 10px;
          font-size: 0.76rem;
          color: #475569;
        }
        .behdoon-seal-box {
          border: 1.5px dashed #059669 !important;
          border-radius: 6px;
          padding: 6px 10px;
          text-align: center;
          background: #f0fdf4 !important;
          color: #065f46 !important;
        }
        .behdoon-customer-sign-box {
          border: 1.5px dashed #94a3b8 !important;
          border-radius: 6px;
          padding: 6px 10px;
          text-align: center;
          background: #f8fafc !important;
          color: #334155 !important;
        }
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: #ffffff !important;
          }
          .behdoon-request-sheet {
            border: 2px solid #334155 !important;
            border-radius: 8px !important;
            padding: 18px 22px !important;
            box-shadow: none !important;
            max-width: 100% !important;
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      ${htmlInner}
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

export function downloadCustomerOrderHtml(input: CustomerOrderDetail | OrderRecord): void {
  const isDetail = 'order' in input && input.order !== undefined;
  const order: OrderRecord = isDetail ? (input as CustomerOrderDetail).order : (input as OrderRecord);
  const trackingCode = order.trackingCode || `${order.id}`;
  const htmlInner = generateOrderPrintHtml(input);

  const htmlContent = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>برگه رسمی درخواست بهدون - #${trackingCode}</title>
  <style>
    * { box-sizing: border-box; font-family: Tahoma, 'Vazirmatn', sans-serif; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { font-family: Tahoma, 'Vazirmatn', sans-serif; background: #f8fafc; padding: 20px; color: #0f172a; margin: 0; line-height: 1.5; }
    .behdoon-brand-wrap img { width: 32px !important; height: 32px !important; max-width: 32px !important; max-height: 32px !important; object-fit: contain !important; }
    .icon, .icon svg, svg { width: 14px !important; height: 14px !important; max-width: 15px !important; max-height: 15px !important; display: inline-block !important; vertical-align: middle !important; }
    .behdoon-request-sheet { width: 100%; max-width: 760px; margin: 0 auto; background: #ffffff; padding: 22px 24px; border: 2px solid #334155 !important; border-radius: 8px !important; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    .behdoon-request-head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2.5px solid #059669; padding-bottom: 14px; margin-bottom: 16px; gap: 16px; }
    .behdoon-brand-wrap { display: flex; align-items: center; gap: 12px; }
    .behdoon-brand-titles h1 { margin: 0; font-size: 1.25rem; font-weight: 800; color: #059669; }
    .behdoon-brand-titles p { margin: 2px 0 0; font-size: 0.8rem; color: #475569; }
    .behdoon-request-meta { text-align: left; font-size: 0.82rem; color: #334155; background: #f8fafc !important; border: 1.5px solid #cbd5e1 !important; border-radius: 6px; padding: 8px 14px; min-width: 220px; }
    .behdoon-request-meta div { margin-bottom: 3px; }
    .behdoon-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 0.76rem; border: 1px solid; }
    .behdoon-badge-status { background: #ecfdf5 !important; color: #065f46 !important; border-color: #a7f3d0 !important; }
    .behdoon-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
    .behdoon-card { border: 1.5px solid #cbd5e1 !important; background: #f8fafc !important; border-radius: 6px; padding: 10px 14px; font-size: 0.84rem; }
    .behdoon-card-title { font-weight: 800; color: #0f172a; font-size: 0.88rem; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
    .behdoon-table { width: 100%; border-collapse: collapse !important; border: 1.5px solid #334155 !important; margin-bottom: 14px; font-size: 0.83rem; }
    .behdoon-table th { background: #f1f5f9 !important; color: #0f172a !important; border: 1.5px solid #334155 !important; padding: 8px 10px; text-align: right; font-weight: 700; }
    .behdoon-table td { border: 1px solid #cbd5e1 !important; padding: 8px 10px; vertical-align: middle; }
    .behdoon-finance-banner { display: flex; justify-content: space-between; align-items: center; background: #ecfdf5 !important; border: 1.5px solid #059669 !important; padding: 10px 16px; border-radius: 6px; margin-bottom: 14px; font-size: 0.88rem; }
    .behdoon-request-footer { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 12px; border-top: 1.5px dashed #94a3b8; padding-top: 12px; margin-top: 10px; font-size: 0.76rem; color: #475569; }
    .behdoon-seal-box { border: 1.5px dashed #059669 !important; border-radius: 6px; padding: 6px 10px; text-align: center; background: #f0fdf4 !important; color: #065f46 !important; }
    .behdoon-customer-sign-box { border: 1.5px dashed #94a3b8 !important; border-radius: 6px; padding: 6px 10px; text-align: center; background: #f8fafc !important; color: #334155 !important; }
    @media print {
      body { background: white !important; padding: 0 !important; }
      .behdoon-request-sheet { border: 2px solid #334155 !important; border-radius: 8px !important; box-shadow: none !important; padding: 18px 22px !important; }
    }
  </style>
</head>
<body>
  ${htmlInner}
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `behdoon-request-${trackingCode}.html`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, 1000);
}

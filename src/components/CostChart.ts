import { formatToman } from '../utils/format.ts';
import { toPersianDigits } from '../utils/jalali.ts';
import { pick } from '../i18n/lang.ts';
import type { CostEstimate, DetailedInvoice } from '../data/pricing.ts';

export function renderCostChart(estimate: CostEstimate, invoice?: DetailedInvoice): string {
  const breakdownRows = invoice?.items
    ? invoice.items
        .map(
          (item) => `
        <tr class="invoice-breakdown-row ${item.amount === 0 ? 'invoice-breakdown-zero' : ''}">
          <td class="invoice-item-desc">
            <strong>${item.title}</strong>
            <small>${item.description}</small>
          </td>
          <td class="invoice-item-amount" style="text-align: left;">
            ${item.amount === 0 ? pick('رایگان / بدون سفارش', 'Free / Not requested') : formatToman(item.amount)}
          </td>
        </tr>
      `,
        )
        .join('')
    : '';

  return `
    <div class="cost-chart">
      <svg viewBox="0 0 400 150" role="img" aria-label="${pick('نمودار برآورد هزینه جابه‌جایی', 'Moving cost estimate chart')}">
        <path class="cost-chart-area" d="M20,125 C90,20 310,20 380,125 Z" />
        <line class="cost-chart-baseline" x1="20" y1="125" x2="380" y2="125" />
        <path class="cost-chart-arc" d="M20,125 C90,20 310,20 380,125" />
        <line class="cost-chart-avg-line" x1="200" y1="20" x2="200" y2="125" />
        <circle class="cost-chart-avg-dot" cx="200" cy="20" r="4.5" />
        <text class="cost-chart-label" x="20" y="144">${formatToman(estimate.min)}</text>
        <text class="cost-chart-label" x="380" y="144" text-anchor="end">${formatToman(estimate.max)}</text>
      </svg>
      <div class="cost-chart-avg-value">
        <span class="cost-chart-avg-caption">${pick('میانگین برآورد هزینه', 'Average estimated cost')}</span>
        <span class="cost-chart-avg-amount">${formatToman(estimate.avg)}</span>
      </div>
      ${
        estimate.isIntercity && estimate.distanceKm
          ? `<p class="cost-chart-distance">${pick(
              `مسیر بین‌شهری — فاصله تقریبی ${toPersianDigits(estimate.distanceKm)} کیلومتر`,
              `Intercity route — approx. ${toPersianDigits(estimate.distanceKm)} km`,
            )}</p>`
          : ''
      }

      ${
        invoice && breakdownRows
          ? `
        <div class="wizard-invoice-breakdown">
          <div class="wizard-invoice-header">
            <span class="wizard-invoice-title">${pick('پیش‌فاکتور تفکیکی خدمات شما', 'Itemized Cost Breakdown')}</span>
            <span class="wizard-invoice-badge">${pick('محاسبه دقیق سیستمی', 'Accurate System Pricing')}</span>
          </div>
          <table class="wizard-invoice-table">
            <thead>
              <tr>
                <th>${pick('شرح خدمت و آیتم هزینه', 'Service Item')}</th>
                <th style="text-align: left;">${pick('مبلغ', 'Amount')}</th>
              </tr>
            </thead>
            <tbody>
              ${breakdownRows}
            </tbody>
            <tfoot>
              <tr>
                <td><strong>${pick('جمع کل فاکتور', 'Total Invoice')}</strong></td>
                <td style="text-align: left; font-weight: 800; color: var(--primary); font-size: 1.05rem;">
                  ${formatToman(invoice.total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      `
          : ''
      }

      <p class="cost-chart-disclaimer">
        ${pick('این فاکتور بر اساس مشخصات انتخابی شما محاسبه شده و در سامانه ثبت می‌شود.', 'This invoice is calculated based on your selections and recorded in the system.')}
      </p>
    </div>
  `;
}

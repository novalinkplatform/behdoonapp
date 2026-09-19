import { pick } from '../i18n/lang.ts';
import { icons } from './icons.ts';
import { formatToman } from '../utils/format.ts';
import { toPersianDigits, formatIranianDate } from '../utils/jalali.ts';
import { statusLabel } from '../data/status.ts';
import {
  fetchCustomerOrderDetail,
  acceptCustomerQuote,
  rejectCustomerQuote,
  processCustomerPayment,
  submitCustomerRating,
  submitCustomerDispute,
  cancelOrder,
  type CustomerOrderDetail
} from '../utils/api.ts';

const STEPPER_STAGES = [
  { id: 'submitted', label: 'ثبت اولیه', statuses: ['requested', 'submitted'] },
  { id: 'assigned', label: 'تخصیص و بررسی', statuses: ['matching', 'under_review', 'provider_assigned', 'quote_pending', 'quoted'] },
  { id: 'en_route', label: 'اعزام و حضور', statuses: ['confirmed', 'scheduled', 'en_route', 'on_the_way', 'arrived', 'inspection'] },
  { id: 'in_progress', label: 'اجرای کار', statuses: ['in_progress', 'waiting_for_parts'] },
  { id: 'completed', label: 'اتمام و تحویل', statuses: ['service_completed', 'completed', 'closed'] },
];

function getActiveStageIndex(status: string): number {
  if (status === 'cancelled' || status === 'disputed') return -1;
  for (let i = 0; i < STEPPER_STAGES.length; i++) {
    if (STEPPER_STAGES[i].statuses.includes(status)) return i;
  }
  return 0;
}

export function openCustomerTrackingModal(
  orderId: number | string,
  options?: { onUpdate?: () => void }
): void {
  const existing = document.querySelector('.customer-tracking-modal-backdrop');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.className = 'customer-tracking-modal-backdrop';
  backdrop.innerHTML = `
    <div class="customer-tracking-modal" role="dialog" aria-modal="true">
      <div class="customer-tracking-header">
        <h2>
          <span class="icon" style="width: 20px; height: 20px; color: var(--primary);">${icons.clock}</span>
          <span>${pick('رهگیری و اطلاعات پرونده سفارش', 'Order Tracking & Details')}</span>
        </h2>
        <button type="button" class="btn btn-ghost btn-sm btn-icon" id="tracking-close-btn" aria-label="${pick('بستن', 'Close')}">
          <span class="icon" style="width: 18px; height: 18px;">${icons.close}</span>
        </button>
      </div>
      <div class="customer-tracking-body" id="tracking-modal-body">
        <div class="orders-loading" style="padding: 40px 0; text-align: center;">
          <span class="orders-spinner" aria-hidden="true"></span>
          <p style="margin-top: 12px; font-size: 0.9rem; color: var(--muted);">${pick('در حال دریافت اطلاعات پرونده سفارش...', 'Loading order details...')}</p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);

  const closeBtn = backdrop.querySelector('#tracking-close-btn');
  closeBtn?.addEventListener('click', () => backdrop.remove());
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) backdrop.remove();
  });

  const bodyEl = backdrop.querySelector('#tracking-modal-body') as HTMLElement;

  function loadDetails(): void {
    fetchCustomerOrderDetail(orderId)
      .then((detail) => {
        renderModalContent(detail);
      })
      .catch((err) => {
        bodyEl.innerHTML = `
          <div style="text-align: center; padding: 30px 10px;">
            <p style="color: #ef4444; margin-bottom: 16px;">${err instanceof Error ? err.message : pick('خطا در دریافت اطلاعات سفارش.', 'Failed to load order.')}</p>
            <button type="button" class="btn btn-secondary btn-sm" id="tracking-retry-btn">${pick('تلاش مجدد', 'Retry')}</button>
          </div>
        `;
        bodyEl.querySelector('#tracking-retry-btn')?.addEventListener('click', loadDetails);
      });
  }

  function renderModalContent(detail: CustomerOrderDetail): void {
    const { order, provider, timeline, quotes, invoice, rating, disputes, permissions } = detail;
    const stageIdx = getActiveStageIndex(order.status);
    const isCancelled = order.status === 'cancelled';
    const isDisputed = order.status === 'disputed';

    let stepperHtml = '';
    if (!isCancelled && !isDisputed) {
      stepperHtml = `
        <div class="tracking-stepper">
          ${STEPPER_STAGES.map((s, idx) => {
            const isCompleted = idx < stageIdx;
            const isCurrent = idx === stageIdx;
            return `
              <div class="tracking-step-item ${isCompleted ? 'is-completed' : ''} ${isCurrent ? 'is-current' : ''}">
                <div class="tracking-step-dot">${isCompleted ? icons.checkCircle : toPersianDigits(idx + 1)}</div>
                <span class="tracking-step-label">${s.label}</span>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    let providerHtml = '';
    if (provider) {
      providerHtml = `
        <div class="provider-dossier-card">
          <div class="provider-dossier-info">
            <div class="provider-dossier-avatar">
              ${provider.avatarUrl ? `<img src="${provider.avatarUrl}" alt="${provider.name}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" />` : provider.name.charAt(0)}
            </div>
            <div class="provider-dossier-meta">
              <div class="provider-dossier-name">${provider.name}</div>
              <div class="provider-dossier-sub">
                <span class="provider-score-badge">★ ${toPersianDigits(provider.performanceScore.toFixed(1))}</span>
                <span>·</span>
                <span>${toPersianDigits(provider.completedJobs)} ${pick('سفارش موفق', 'completed jobs')}</span>
              </div>
            </div>
          </div>
          <div>
            ${
              provider.canCall && provider.phone
                ? `<a href="tel:${provider.phone}" class="btn btn-secondary btn-sm" style="display: inline-flex; align-items: center; gap: 6px;">
                    <span class="icon" style="width: 14px; height: 14px;">${icons.phone}</span>
                    <span>${pick('تماس با متخصص', 'Call Provider')}</span>
                   </a>`
                : `<span style="font-size: 0.78rem; color: var(--muted);">${provider.phone ? toPersianDigits(provider.phone) : pick('متخصص محول‌شده', 'Assigned Specialist')}</span>`
            }
          </div>
        </div>
      `;
    }

    let quotesHtml = '';
    const pendingQuote = quotes.find((q) => q.status === 'sent' || q.status === 'pending');
    if (pendingQuote && permissions.canAcceptQuote) {
      quotesHtml = `
        <div class="quote-review-card">
          <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 4px; color: var(--primary);">
            ${pick('پیش‌فاکتور جدید صادر شده برای شما', 'New Quote Issued For You')}
          </div>
          <div class="quote-amount-row">
            <span>${pick('اجرت کارشناسی و خدمات:', 'Labor Fee:')}</span>
            <span>${formatToman(pendingQuote.laborAmount || pendingQuote.baseAmount)}</span>
          </div>
          ${
            pendingQuote.materialsAmount
              ? `<div class="quote-amount-row">
                  <span>${pick('هزینه قطعات و لوازم:', 'Parts Fee:')}</span>
                  <span>${formatToman(pendingQuote.materialsAmount)}</span>
                 </div>`
              : ''
          }
          ${
            pendingQuote.discountAmount
              ? `<div class="quote-amount-row" style="color: #16a34a;">
                  <span>${pick('تخفیف ویژه بهدون:', 'Discount:')}</span>
                  <span>-${formatToman(pendingQuote.discountAmount)}</span>
                 </div>`
              : ''
          }
          <div class="quote-amount-row is-total">
            <span>${pick('مبلغ نهایی پیش‌فاکتور:', 'Final Quote Amount:')}</span>
            <span>${formatToman(pendingQuote.finalAmount)}</span>
          </div>
          ${pendingQuote.description ? `<p style="font-size: 0.8rem; color: var(--muted); margin: 6px 0;">${pendingQuote.description}</p>` : ''}
          <div style="display: flex; gap: 8px; margin-top: 10px;">
            <button type="button" class="btn btn-primary btn-sm" id="accept-quote-btn" data-quote-id="${pendingQuote.id}">
              ${pick('تأیید پیش‌فاکتور و ادامه خدمت', 'Accept Quote')}
            </button>
            <button type="button" class="btn btn-ghost btn-sm" id="reject-quote-btn" data-quote-id="${pendingQuote.id}">
              ${pick('رد پیش‌فاکتور', 'Reject Quote')}
            </button>
          </div>
        </div>
      `;
    }

    let invoiceHtml = '';
    if (invoice) {
      const isPaid = invoice.status === 'paid' || order.paymentStatus === 'paid';
      invoiceHtml = `
        <div class="invoice-summary-card">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 700; font-size: 0.95rem;">${pick('صورت‌حساب سفارش', 'Order Invoice')} #${toPersianDigits(invoice.invoiceNumber)}</span>
            <span class="${isPaid ? 'badge-paid' : 'badge-unpaid'}">${isPaid ? pick('پرداخت شده', 'Paid') : pick('در انتظار پرداخت', 'Unpaid')}</span>
          </div>
          <div class="invoice-amount-row is-total">
            <span>${pick('مبلغ قابل پرداخت:', 'Payable Amount:')}</span>
            <span>${formatToman(invoice.totalAmount)}</span>
          </div>
          ${
            !isPaid && permissions.canPay
              ? `<div style="margin-top: 10px;">
                  <button type="button" class="btn btn-primary btn-sm" id="pay-invoice-btn" data-req-id="${order.id}" data-amount="${invoice.totalAmount}" data-inv-id="${invoice.id}">
                    ${pick('پرداخت آنلاین امن با شتاب', 'Pay Securely Online')}
                  </button>
                 </div>`
              : ''
          }
        </div>
      `;
    }

    let ratingHtml = '';
    if (permissions.canRate) {
      ratingHtml = `
        <div class="quote-review-card" style="background: rgba(254, 240, 138, 0.2); border-color: rgba(234, 179, 8, 0.4);">
          <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 6px;">
            ${pick('خدمت شما تکمیل شد. به تخصص و برخورد همکار بهدون امتیاز دهید:', 'Rate the service provided:')}
          </div>
          <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;" id="rating-stars-container">
            ${[1, 2, 3, 4, 5].map(star => `
              <button type="button" class="btn btn-ghost btn-sm star-btn" data-star="${star}" style="font-size: 1.3rem; padding: 2px 6px; color: #ca8a04;">
                ★
              </button>
            `).join('')}
            <span id="selected-star-label" style="font-size: 0.85rem; font-weight: 600; margin-right: 8px;">۵ ستاره (عالی)</span>
          </div>
          <textarea id="rating-comment" class="form-input" placeholder="${pick('نظر شما درباره کیفیت خدمت و متخصص...', 'Your review comments...')}" rows="2" style="font-size: 0.85rem; margin-bottom: 8px;"></textarea>
          <div>
            <button type="button" class="btn btn-primary btn-sm" id="submit-rating-btn">${pick('ثبت امتیاز و نظر', 'Submit Rating')}</button>
          </div>
        </div>
      `;
    } else if (rating) {
      ratingHtml = `
        <div style="font-size: 0.85rem; padding: 10px; background: var(--surface-secondary, #f8fafc); border-radius: var(--radius-md); border: 1px solid var(--border);">
          <span style="font-weight: 600; color: #ca8a04;">★ ${toPersianDigits(rating.overallScore)} ستاره</span> — 
          <span>${pick('نظر شما برای این خدمت ثبت شده است.', 'Your rating has been recorded.')}</span>
          ${rating.comment ? `<p style="margin: 4px 0 0 0; color: var(--muted);">«${rating.comment}»</p>` : ''}
        </div>
      `;
    }

    let disputeHtml = '';
    if (permissions.canDispute) {
      disputeHtml = `
        <div style="border-top: 1px dashed var(--border); padding-top: 12px;">
          <button type="button" class="btn btn-ghost btn-sm" id="toggle-dispute-btn" style="color: #ef4444; font-size: 0.82rem;">
            ${pick('ثبت شکایت یا مغایرت در انجام خدمت', 'Report an Issue / Dispute')}
          </button>
          <div id="dispute-form-container" hidden style="margin-top: 10px; display: flex; flex-direction: column; gap: 8px;">
            <select id="dispute-reason" class="form-input" style="font-size: 0.85rem;">
              <option value="poor_quality">${pick('کیفیت نامناسب خدمت', 'Poor service quality')}</option>
              <option value="delay">${pick('تاخیر یا عدم مراجعه متخصص', 'Delay / No-show')}</option>
              <option value="overcharge">${pick('مغایرت هزینه با پیش‌فاکتور', 'Pricing mismatch')}</option>
              <option value="behavior">${pick('رفتار نامناسب', 'Unprofessional behavior')}</option>
              <option value="damage">${pick('خسارت به تجهیزات یا منزل', 'Property damage')}</option>
            </select>
            <textarea id="dispute-desc" class="form-input" placeholder="${pick('شرح کامل موضوع جهت بررسی واحد بازرسی بهدون...', 'Describe the issue for support...')}" rows="2" style="font-size: 0.85rem;"></textarea>
            <div>
              <button type="button" class="btn btn-primary btn-sm" id="submit-dispute-btn" style="background: #dc2626; border-color: #dc2626;">
                ${pick('ارسال گزارش به بازرسی و پشتیبانی', 'Submit to Support')}
              </button>
            </div>
          </div>
        </div>
      `;
    } else if (disputes && disputes.length > 0) {
      disputeHtml = `
        <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: var(--radius-md); padding: 10px; font-size: 0.82rem;">
          <strong style="color: #dc2626;">${pick('پرونده اختلاف در پشتیبانی بهدون باز است', 'Dispute Case Open')}:</strong>
          <span>${disputes[0].description}</span>
        </div>
      `;
    }

    let timelineHtml = `
      <div style="margin-top: 8px;">
        <h3 style="font-size: 0.92rem; font-weight: 700; margin-bottom: 12px;">${pick('گزارش زنده رویدادهای خدمت', 'Live Service Events')}</h3>
        <div class="customer-timeline-list">
          ${timeline.map(item => `
            <div class="customer-timeline-entry ${item.isCurrent ? 'is-current' : ''}">
              <div class="customer-timeline-title">${item.title}</div>
              <div class="customer-timeline-desc">${item.description}</div>
              <div class="customer-timeline-time">${toPersianDigits(formatIranianDate(item.timestamp))}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    let cancelHtml = '';
    if (permissions.canCancel) {
      cancelHtml = `
        <div style="text-align: left; margin-top: 10px;">
          <button type="button" class="btn btn-ghost btn-sm" id="tracking-cancel-btn" style="color: #64748b; font-size: 0.8rem;">
            ${pick('انصراف از این درخواست', 'Cancel Request')}
          </button>
        </div>
      `;
    }

    bodyEl.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 12px; border-bottom: 1px solid var(--border);">
        <div>
          <span style="font-size: 0.8rem; color: var(--muted);">${pick('شناسه پیگیری:', 'Tracking #')}</span>
          <strong style="font-size: 1rem; color: var(--primary); margin-right: 4px;">#${toPersianDigits(order.trackingCode)}</strong>
          <div style="font-size: 0.95rem; font-weight: 700; margin-top: 2px;">${order.serviceLabel}</div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
          <span class="order-status order-status-${order.status}">${statusLabel(order.status)}</span>
          <span class="${order.paymentStatus === 'paid' ? 'badge-paid' : 'badge-unpaid'}">
            ${order.paymentStatus === 'paid' ? pick('تسویه شده', 'Paid') : pick('پرداخت نشده', 'Unpaid')}
          </span>
        </div>
      </div>

      ${stepperHtml}
      ${providerHtml}
      ${quotesHtml}
      ${invoiceHtml}
      ${ratingHtml}
      ${disputeHtml}
      ${timelineHtml}
      ${cancelHtml}
    `;

    // Wire action listeners
    const acceptQuoteBtn = bodyEl.querySelector('#accept-quote-btn') as HTMLButtonElement | null;
    acceptQuoteBtn?.addEventListener('click', () => {
      const qId = Number(acceptQuoteBtn.dataset.quoteId);
      acceptQuoteBtn.disabled = true;
      acceptCustomerQuote(qId)
        .then(() => {
          loadDetails();
          options?.onUpdate?.();
        })
        .catch(err => {
          window.alert(err instanceof Error ? err.message : pick('خطا در تأیید پیش‌فاکتور', 'Error'));
          acceptQuoteBtn.disabled = false;
        });
    });

    const rejectQuoteBtn = bodyEl.querySelector('#reject-quote-btn') as HTMLButtonElement | null;
    rejectQuoteBtn?.addEventListener('click', () => {
      const qId = Number(rejectQuoteBtn.dataset.quoteId);
      if (!window.confirm(pick('آیا از رد این پیش‌فاکتور اطمینان دارید؟', 'Reject this quote?'))) return;
      rejectQuoteBtn.disabled = true;
      rejectCustomerQuote(qId)
        .then(() => {
          loadDetails();
          options?.onUpdate?.();
        })
        .catch(err => {
          window.alert(err instanceof Error ? err.message : pick('خطا در رد پیش‌فاکتور', 'Error'));
          rejectQuoteBtn.disabled = false;
        });
    });

    const payBtn = bodyEl.querySelector('#pay-invoice-btn') as HTMLButtonElement | null;
    payBtn?.addEventListener('click', () => {
      const rId = Number(payBtn.dataset.reqId);
      const amount = Number(payBtn.dataset.amount);
      const invId = Number(payBtn.dataset.invId);
      payBtn.disabled = true;
      payBtn.textContent = pick('در حال اتصال به درگاه...', 'Connecting...');
      processCustomerPayment(rId, amount, invId)
        .then((res) => {
          window.alert(pick(`پرداخت با موفقیت انجام شد. شماره پیگیری: ${res.transactionRef}`, `Payment successful: ${res.transactionRef}`));
          loadDetails();
          options?.onUpdate?.();
        })
        .catch(err => {
          window.alert(err instanceof Error ? err.message : pick('خطا در پرداخت', 'Payment Error'));
          payBtn.disabled = false;
          payBtn.textContent = pick('پرداخت آنلاین امن با شتاب', 'Pay Online');
        });
    });

    let currentScore = 5;
    const starBtns = bodyEl.querySelectorAll<HTMLButtonElement>('.star-btn');
    const starLabel = bodyEl.querySelector('#selected-star-label');
    starBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currentScore = Number(btn.dataset.star);
        const labels: Record<number, string> = {
          1: '۱ ستاره (ضعیف)',
          2: '۲ ستاره (متوسط)',
          3: '۳ ستاره (خوب)',
          4: '۴ ستاره (خیلی خوب)',
          5: '۵ ستاره (عالی)',
        };
        if (starLabel) starLabel.textContent = labels[currentScore] || '';
      });
    });

    const submitRatingBtn = bodyEl.querySelector('#submit-rating-btn') as HTMLButtonElement | null;
    submitRatingBtn?.addEventListener('click', () => {
      const commentEl = bodyEl.querySelector('#rating-comment') as HTMLTextAreaElement | null;
      submitRatingBtn.disabled = true;
      submitCustomerRating(order.id, {
        overallScore: currentScore,
        punctualityScore: currentScore,
        cleanlinessScore: currentScore,
        skillScore: currentScore,
        comment: commentEl?.value.trim() || undefined,
      })
        .then(() => {
          window.alert(pick('نظر و امتیاز شما با موفقیت ثبت گردید. با تشکر!', 'Rating recorded. Thank you!'));
          loadDetails();
          options?.onUpdate?.();
        })
        .catch(err => {
          window.alert(err instanceof Error ? err.message : pick('خطا در ثبت نظر', 'Error'));
          submitRatingBtn.disabled = false;
        });
    });

    const toggleDisputeBtn = bodyEl.querySelector('#toggle-dispute-btn') as HTMLButtonElement | null;
    const disputeContainer = bodyEl.querySelector('#dispute-form-container') as HTMLElement | null;
    toggleDisputeBtn?.addEventListener('click', () => {
      if (disputeContainer) {
        disputeContainer.hidden = !disputeContainer.hidden;
      }
    });

    const submitDisputeBtn = bodyEl.querySelector('#submit-dispute-btn') as HTMLButtonElement | null;
    submitDisputeBtn?.addEventListener('click', () => {
      const reasonEl = bodyEl.querySelector('#dispute-reason') as HTMLSelectElement | null;
      const descEl = bodyEl.querySelector('#dispute-desc') as HTMLTextAreaElement | null;
      const description = descEl?.value.trim();
      if (!description) {
        window.alert(pick('لطفاً توضیحات شکایت خود را بنویسید.', 'Please write a description.'));
        return;
      }
      submitDisputeBtn.disabled = true;
      submitCustomerDispute(order.id, {
        reason: reasonEl?.value || 'poor_quality',
        description,
      })
        .then(() => {
          window.alert(pick('شکایت شما ثبت شد و کارشناسان بهدون با شما تماس خواهند گرفت.', 'Dispute registered.'));
          loadDetails();
          options?.onUpdate?.();
        })
        .catch(err => {
          window.alert(err instanceof Error ? err.message : pick('خطا در ثبت شکایت', 'Error'));
          submitDisputeBtn.disabled = false;
        });
    });

    const cancelBtn = bodyEl.querySelector('#tracking-cancel-btn') as HTMLButtonElement | null;
    cancelBtn?.addEventListener('click', () => {
      const reason = window.prompt(pick('لطفاً علت لغو سفارش را وارد کنید:', 'Reason for cancellation:'), 'انصراف توسط مشتری');
      if (reason === null) return;
      cancelBtn.disabled = true;
      cancelOrder(order.id, order.phone, reason)
        .then(() => {
          window.alert(pick('سفارش با موفقیت لغو شد.', 'Order cancelled.'));
          loadDetails();
          options?.onUpdate?.();
        })
        .catch(err => {
          window.alert(err instanceof Error ? err.message : pick('خطا در لغو سفارش', 'Error'));
          cancelBtn.disabled = false;
        });
    });
  }

  loadDetails();
}

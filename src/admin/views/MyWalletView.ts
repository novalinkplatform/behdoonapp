import { formatToman } from '../utils/format.ts';
import {
  fetchMyWalletSummary,
  fetchMyWalletTransactions,
  fetchMyPayoutRequests,
  createMyPayoutRequest,
} from '../utils/api.ts';
import type { WalletTransaction, PayoutRequest, PayoutRequestStatus } from '../utils/api.ts';

const PAGE_SIZE = 20;

function escapeHtml(input: string): string {
  return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const TX_TYPE_LABELS: Record<string, string> = {
  salary: 'حقوق',
  bonus: 'پاداش',
  adjustment: 'اصلاحیه',
  payout: 'تسویه',
};

const PAYOUT_STATUS_LABELS: Record<PayoutRequestStatus, { label: string; badgeClass: string }> = {
  pending: { label: 'در انتظار بررسی', badgeClass: 'article-status-badge' },
  approved: { label: 'تأیید شد', badgeClass: 'article-status-badge article-status-published' },
  rejected: { label: 'رد شد', badgeClass: 'article-status-badge article-status-draft' },
};

// هر کارمند کیف پول خودش را می‌بیند — خودسرویس، بدون نیاز به مجوز خاص (همان الگوی امنیت حساب).
export function renderMyWalletView(): string {
  return `
    <div class="settings-view">
      <div class="settings-panel">
        <h2>کیف پول من</h2>
        <div class="editor-sidebar-card" id="my-wallet-summary-card">
          <p class="settings-panel-hint">در حال بارگذاری...</p>
        </div>

        <div class="editor-sidebar-card">
          <h3>درخواست تسویه</h3>
          <p class="settings-panel-hint">مبلغی از موجودی خود را برای دریافت درخواست دهید — مدیر آن را بررسی و تأیید یا رد می‌کند.</p>
          <form id="payout-request-form" style="display:flex; flex-direction:column; gap: var(--space-3);">
            <div class="form-field">
              <label for="payout-request-amount">مبلغ (تومان)</label>
              <input type="number" id="payout-request-amount" min="1" dir="ltr" required />
            </div>
            <div class="form-field">
              <label for="payout-request-note">توضیح (اختیاری)</label>
              <input type="text" id="payout-request-note" maxlength="200" />
            </div>
            <p class="error-text" id="payout-request-error" hidden></p>
            <p class="settings-saved-note" id="payout-request-success" hidden>درخواست ثبت شد.</p>
            <button type="submit" class="btn btn-primary" id="payout-request-submit">ثبت درخواست</button>
          </form>
        </div>

        <div class="editor-sidebar-card">
          <h3>درخواست‌های تسویه‌ی من</h3>
          <div id="my-payout-requests-list"><p class="settings-panel-hint">در حال بارگذاری...</p></div>
        </div>

        <div class="editor-sidebar-card">
          <h3>تراکنش‌ها</h3>
          <div id="my-wallet-tx-list"><p class="settings-panel-hint">در حال بارگذاری...</p></div>
          <button type="button" class="btn btn-ghost btn-sm" id="my-wallet-load-more" hidden style="margin-top: var(--space-3)">بارگذاری بیشتر</button>
        </div>
      </div>
    </div>
  `;
}

function renderTxRow(tx: WalletTransaction): string {
  const sign = tx.direction === 'credit' ? '+' : '−';
  const color = tx.direction === 'credit' ? 'var(--success)' : 'var(--danger)';
  return `
    <div class="activity-log-row">
      <div class="activity-log-main">
        <span class="activity-log-action">${TX_TYPE_LABELS[tx.type] ?? tx.type}</span>
        <span class="activity-log-target">${escapeHtml(tx.description)}</span>
      </div>
      <div class="activity-log-meta">
        <span style="color:${color}; font-weight:700;">${sign} ${formatToman(tx.amount)}</span>
      </div>
    </div>
  `;
}

function renderPayoutRow(req: PayoutRequest): string {
  const statusInfo = PAYOUT_STATUS_LABELS[req.status];
  return `
    <div class="activity-log-row">
      <div class="activity-log-main">
        <span class="activity-log-action">${formatToman(req.amount)}</span>
        ${req.staffNote ? `<span class="activity-log-target">${escapeHtml(req.staffNote)}</span>` : ''}
        ${req.adminNote ? `<span class="activity-log-target">پاسخ مدیر: ${escapeHtml(req.adminNote)}</span>` : ''}
      </div>
      <div class="activity-log-meta"><span class="${statusInfo.badgeClass}">${statusInfo.label}</span></div>
    </div>
  `;
}

export function initMyWalletView(): void {
  const summaryCard = document.getElementById('my-wallet-summary-card');
  const txList = document.getElementById('my-wallet-tx-list');
  const loadMoreBtn = document.getElementById('my-wallet-load-more') as HTMLButtonElement | null;
  const payoutListEl = document.getElementById('my-payout-requests-list');

  let txOffset = 0;
  let txTotal = 0;
  let allTx: WalletTransaction[] = [];

  async function loadSummary(): Promise<void> {
    if (!summaryCard) return;
    try {
      const summary = await fetchMyWalletSummary();
      const bonusText = summary.bonus.type === 'percent' ? `${summary.bonus.amount}٪ برآورد هر درخواست` : formatToman(summary.bonus.amount);
      summaryCard.innerHTML = `
        <p class="settings-panel-hint">موجودی فعلی</p>
        <p style="font-size: 1.8rem; font-weight: 800; color: var(--primary);">${formatToman(summary.balance)}</p>
        <div class="settings-form-grid" style="margin-top: var(--space-3)">
          <div><p class="settings-panel-hint">حقوق ماهانه</p><p><strong>${formatToman(summary.salary.amount)}</strong></p></div>
          <div><p class="settings-panel-hint">پاداش هر درخواست تکمیل‌شده</p><p><strong>${bonusText}</strong></p></div>
        </div>
      `;
    } catch (err) {
      summaryCard.innerHTML = `<p class="error-text">${err instanceof Error ? err.message : 'خطایی پیش آمد.'}</p>`;
    }
  }

  async function loadTransactions(): Promise<void> {
    if (!txList) return;
    try {
      const { transactions, total } = await fetchMyWalletTransactions(PAGE_SIZE, txOffset);
      allTx = [...allTx, ...transactions];
      txTotal = total;
      txOffset += transactions.length;
      txList.innerHTML = allTx.length ? allTx.map(renderTxRow).join('') : '<p class="settings-panel-hint">هنوز تراکنشی ثبت نشده.</p>';
      if (loadMoreBtn) loadMoreBtn.hidden = txOffset >= txTotal;
    } catch (err) {
      txList.innerHTML = `<p class="error-text">${err instanceof Error ? err.message : 'خطایی پیش آمد.'}</p>`;
    }
  }

  async function loadPayoutRequests(): Promise<void> {
    if (!payoutListEl) return;
    try {
      const requests = await fetchMyPayoutRequests();
      payoutListEl.innerHTML = requests.length ? requests.map(renderPayoutRow).join('') : '<p class="settings-panel-hint">هنوز درخواستی ثبت نکرده‌اید.</p>';
    } catch (err) {
      payoutListEl.innerHTML = `<p class="error-text">${err instanceof Error ? err.message : 'خطایی پیش آمد.'}</p>`;
    }
  }

  loadMoreBtn?.addEventListener('click', () => void loadTransactions());

  document.getElementById('payout-request-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const amountInput = document.getElementById('payout-request-amount') as HTMLInputElement;
    const noteInput = document.getElementById('payout-request-note') as HTMLInputElement;
    const errorEl = document.getElementById('payout-request-error')!;
    const successEl = document.getElementById('payout-request-success')!;
    const submitBtn = document.getElementById('payout-request-submit') as HTMLButtonElement;

    errorEl.hidden = true;
    successEl.hidden = true;
    const amount = Number(amountInput.value);
    if (!Number.isFinite(amount) || amount <= 0) {
      errorEl.hidden = false;
      errorEl.textContent = 'مبلغ نامعتبر است.';
      return;
    }

    submitBtn.disabled = true;
    void (async () => {
      try {
        await createMyPayoutRequest(amount, noteInput.value.trim() || undefined);
        successEl.hidden = false;
        amountInput.value = '';
        noteInput.value = '';
        await Promise.all([loadSummary(), loadPayoutRequests()]);
      } catch (err) {
        errorEl.hidden = false;
        errorEl.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
      } finally {
        submitBtn.disabled = false;
      }
    })();
  });

  void loadSummary();
  void loadTransactions();
  void loadPayoutRequests();
}

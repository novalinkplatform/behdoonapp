import { formatToman } from '../utils/format.ts';
import {
  fetchStaffWallets,
  fetchStaffWalletTransactions,
  createWalletAdjustment,
  fetchPayoutRequests,
  approvePayoutRequest,
  rejectPayoutRequest,
  fetchPayrollPreview,
  processPayroll,
  fetchRoles,
  updateRolePayRate,
} from '../utils/api.ts';
import type { StaffWalletListItem, WalletTransaction, PayoutRequest, PayrollPreviewEntry, RoleRecord, WalletBonusType } from '../utils/api.ts';

function escapeHtml(input: string): string {
  return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const TX_TYPE_LABELS: Record<string, string> = { salary: 'حقوق', bonus: 'پاداش', adjustment: 'اصلاحیه', payout: 'تسویه' };

export function renderPayrollView(): string {
  return `
    <div class="view-header">
      <h1>حقوق و دستمزد</h1>
    </div>
    <p class="settings-panel-hint">
      این بخش یک دفتر حسابداری داخلی است، نه پرداخت خودکار — هیچ مبلغی واقعاً جابه‌جا نمی‌شود. وقتی مبلغی را
      واقعاً (مثلاً با کارت‌به‌کارت) پرداخت کردید، همین‌جا ثبتش کنید تا موجودی به‌روز شود.
    </p>

    <div class="settings-tabs">
      <button type="button" class="settings-tab is-active" data-payroll-tab="balances">موجودی‌ها</button>
      <button type="button" class="settings-tab" data-payroll-tab="payroll">پردازش حقوق ماهانه</button>
      <button type="button" class="settings-tab" data-payroll-tab="payouts">درخواست‌های تسویه</button>
      <button type="button" class="settings-tab" data-payroll-tab="rates">نرخ نقش‌ها</button>
    </div>

    <div data-payroll-panel="balances">
      <p class="error-text" id="balances-error" hidden></p>
      <div class="staff-table-wrapper">
        <table class="staff-table">
          <thead>
            <tr><th>نام</th><th>نقش</th><th>موجودی</th><th>عملیات</th></tr>
          </thead>
          <tbody id="balances-table-body"></tbody>
        </table>
      </div>
    </div>

    <div data-payroll-panel="payroll" hidden>
      <p class="error-text" id="payroll-error" hidden></p>
      <div class="editor-sidebar-card">
        <div class="form-field" style="max-width: 220px">
          <label for="payroll-month">ماه</label>
          <input type="month" id="payroll-month" />
        </div>
        <button type="button" class="btn btn-secondary" id="payroll-preview-btn">نمایش پیش‌نمایش</button>
      </div>
      <div id="payroll-preview-wrap" hidden>
        <div class="staff-table-wrapper">
          <table class="staff-table">
            <thead><tr><th>نام</th><th>نقش</th><th></th><th>مبلغ</th><th>وضعیت</th></tr></thead>
            <tbody id="payroll-preview-body"></tbody>
          </table>
        </div>
        <div class="editor-header-actions" style="margin-top: var(--space-4)">
          <button type="button" class="btn btn-primary" id="payroll-confirm-btn">تأیید و واریز به کیف پول</button>
        </div>
        <p class="settings-saved-note" id="payroll-result" hidden></p>
      </div>
    </div>

    <div data-payroll-panel="payouts" hidden>
      <p class="error-text" id="payouts-error" hidden></p>
      <div id="payouts-list"></div>
    </div>

    <div data-payroll-panel="rates" hidden>
      <p class="error-text" id="rates-error" hidden></p>
      <p class="settings-saved-note" id="rates-saved-note" hidden>ذخیره شد.</p>
      <div class="staff-table-wrapper">
        <table class="staff-table">
          <thead><tr><th>نقش</th><th>حقوق ماهانه (تومان)</th><th>نوع پاداش</th><th>مقدار پاداش</th><th></th></tr></thead>
          <tbody id="role-rates-body"></tbody>
        </table>
      </div>
    </div>

    <div class="editor-sidebar-card" id="wallet-tx-modal" hidden>
      <div class="plugin-card-head">
        <h3 id="wallet-tx-modal-title">تراکنش‌ها</h3>
        <button type="button" class="btn btn-ghost btn-sm" id="wallet-tx-modal-close">بستن</button>
      </div>
      <div id="wallet-tx-modal-list"></div>
    </div>

    <div class="editor-sidebar-card" id="wallet-adjustment-modal" hidden>
      <div class="plugin-card-head">
        <h3>ثبت اصلاحیه</h3>
        <button type="button" class="btn btn-ghost btn-sm" id="wallet-adjustment-modal-close">بستن</button>
      </div>
      <form id="wallet-adjustment-form" style="display:flex; flex-direction:column; gap: var(--space-3);">
        <div class="settings-form-grid">
          <div class="form-field">
            <label for="adjustment-direction">نوع</label>
            <select id="adjustment-direction">
              <option value="credit">واریز (طلب کارمند)</option>
              <option value="debit">برداشت (کسر از موجودی)</option>
            </select>
          </div>
          <div class="form-field">
            <label for="adjustment-amount">مبلغ (تومان)</label>
            <input type="number" id="adjustment-amount" min="1" dir="ltr" required />
          </div>
        </div>
        <div class="form-field">
          <label for="adjustment-description">توضیح</label>
          <input type="text" id="adjustment-description" maxlength="200" required />
        </div>
        <p class="error-text" id="adjustment-error" hidden></p>
        <button type="submit" class="btn btn-primary" id="adjustment-submit">ثبت</button>
      </form>
    </div>
  `;
}

function renderBalanceRow(w: StaffWalletListItem): string {
  return `
    <tr>
      <td>${escapeHtml(w.fullName)}${!w.isActive ? ' <span class="settings-panel-hint">(غیرفعال)</span>' : ''}</td>
      <td>${escapeHtml(w.roleLabel)}</td>
      <td><strong>${formatToman(w.balance)}</strong></td>
      <td>
        <div class="staff-table-actions">
          <button type="button" class="btn btn-ghost btn-sm" data-wallet-view-tx="${w.staffId}" data-wallet-staff-name="${escapeHtml(w.fullName)}">تراکنش‌ها</button>
          <button type="button" class="btn btn-ghost btn-sm" data-wallet-adjust="${w.staffId}">ثبت اصلاحیه</button>
        </div>
      </td>
    </tr>
  `;
}

function renderTxModalRow(tx: WalletTransaction): string {
  const sign = tx.direction === 'credit' ? '+' : '−';
  const color = tx.direction === 'credit' ? 'var(--success)' : 'var(--danger)';
  return `
    <div class="activity-log-row">
      <div class="activity-log-main">
        <span class="activity-log-action">${TX_TYPE_LABELS[tx.type] ?? tx.type}</span>
        <span class="activity-log-target">${escapeHtml(tx.description)}</span>
      </div>
      <div class="activity-log-meta"><span style="color:${color}; font-weight:700;">${sign} ${formatToman(tx.amount)}</span></div>
    </div>
  `;
}

function renderPayoutQueueRow(req: PayoutRequest): string {
  return `
    <div class="editor-sidebar-card">
      <div class="plugin-card-head">
        <h3>${escapeHtml(req.staffName)} — ${formatToman(req.amount)}</h3>
      </div>
      ${req.staffNote ? `<p class="settings-panel-hint">${escapeHtml(req.staffNote)}</p>` : ''}
      <div class="staff-table-actions">
        <button type="button" class="btn btn-primary btn-sm" data-payout-approve="${req.id}">تأیید</button>
        <button type="button" class="btn btn-ghost btn-sm" data-payout-reject="${req.id}">رد</button>
      </div>
    </div>
  `;
}

function renderRoleRateRow(role: RoleRecord): string {
  return `
    <tr data-role-rate-row="${role.id}">
      <td>${escapeHtml(role.label)}${role.isSystem ? ' <span class="settings-panel-hint">(سیستمی)</span>' : ''}</td>
      <td><input type="number" min="0" dir="ltr" data-field="salary" value="${role.defaultSalaryAmount}" style="width:100%" /></td>
      <td>
        <select data-field="bonusType">
          <option value="flat" ${role.defaultBonusType === 'flat' ? 'selected' : ''}>مبلغ ثابت</option>
          <option value="percent" ${role.defaultBonusType === 'percent' ? 'selected' : ''}>درصد برآورد</option>
        </select>
      </td>
      <td><input type="number" min="0" dir="ltr" data-field="bonusAmount" value="${role.defaultBonusAmount}" style="width:100%" /></td>
      <td><button type="button" class="btn btn-primary btn-sm" data-role-rate-save="${role.id}">ذخیره</button></td>
    </tr>
  `;
}

export function initPayrollView(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-payroll-tab]').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-payroll-tab]').forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      document.querySelectorAll<HTMLElement>('[data-payroll-panel]').forEach((panel) => {
        panel.hidden = panel.dataset.payrollPanel !== tab.dataset.payrollTab;
      });
    });
  });

  const balancesError = document.getElementById('balances-error')!;
  const balancesBody = document.getElementById('balances-table-body')!;

  async function loadBalances(): Promise<void> {
    balancesError.hidden = true;
    try {
      const wallets = await fetchStaffWallets();
      balancesBody.innerHTML = wallets.length ? wallets.map(renderBalanceRow).join('') : '<tr><td colspan="4">کارمندی ثبت نشده.</td></tr>';
    } catch (err) {
      balancesError.hidden = false;
      balancesError.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
    }
  }

  // ----- تراکنش‌های یک کارمند (مودال ساده) -----
  const txModal = document.getElementById('wallet-tx-modal')!;
  const txModalTitle = document.getElementById('wallet-tx-modal-title')!;
  const txModalList = document.getElementById('wallet-tx-modal-list')!;
  document.getElementById('wallet-tx-modal-close')?.addEventListener('click', () => (txModal.hidden = true));

  balancesBody.addEventListener('click', (event) => {
    const viewBtn = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-wallet-view-tx]');
    if (viewBtn) {
      const staffId = Number(viewBtn.dataset.walletViewTx);
      const staffName = viewBtn.dataset.walletStaffName ?? '';
      txModalTitle.textContent = `تراکنش‌های ${staffName}`;
      txModalList.innerHTML = '<p class="settings-panel-hint">در حال بارگذاری...</p>';
      txModal.hidden = false;
      void fetchStaffWalletTransactions(staffId, 50, 0).then(({ transactions }) => {
        txModalList.innerHTML = transactions.length ? transactions.map(renderTxModalRow).join('') : '<p class="settings-panel-hint">تراکنشی ثبت نشده.</p>';
      });
      return;
    }
    const adjustBtn = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-wallet-adjust]');
    if (adjustBtn) {
      adjustmentModal.dataset.staffId = adjustBtn.dataset.walletAdjust;
      adjustmentModal.hidden = false;
    }
  });

  // ----- ثبت اصلاحیه -----
  const adjustmentModal = document.getElementById('wallet-adjustment-modal')!;
  document.getElementById('wallet-adjustment-modal-close')?.addEventListener('click', () => (adjustmentModal.hidden = true));
  document.getElementById('wallet-adjustment-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const staffId = Number(adjustmentModal.dataset.staffId);
    const direction = (document.getElementById('adjustment-direction') as HTMLSelectElement).value as 'credit' | 'debit';
    const amount = Number((document.getElementById('adjustment-amount') as HTMLInputElement).value);
    const description = (document.getElementById('adjustment-description') as HTMLInputElement).value.trim();
    const errorEl = document.getElementById('adjustment-error')!;
    const submitBtn = document.getElementById('adjustment-submit') as HTMLButtonElement;
    errorEl.hidden = true;
    if (!Number.isFinite(amount) || amount <= 0 || !description) {
      errorEl.hidden = false;
      errorEl.textContent = 'مبلغ و توضیح را کامل وارد کنید.';
      return;
    }
    submitBtn.disabled = true;
    void createWalletAdjustment(staffId, direction, amount, description)
      .then(() => {
        adjustmentModal.hidden = true;
        (document.getElementById('wallet-adjustment-form') as HTMLFormElement).reset();
        return loadBalances();
      })
      .catch((err) => {
        errorEl.hidden = false;
        errorEl.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
      })
      .finally(() => {
        submitBtn.disabled = false;
      });
  });

  // ----- پردازش حقوق ماهانه -----
  const payrollError = document.getElementById('payroll-error')!;
  const payrollPreviewWrap = document.getElementById('payroll-preview-wrap')!;
  const payrollPreviewBody = document.getElementById('payroll-preview-body')!;
  const payrollResult = document.getElementById('payroll-result')!;
  const monthInput = document.getElementById('payroll-month') as HTMLInputElement;
  monthInput.value = new Date().toISOString().slice(0, 7);

  function renderPreviewRow(entry: PayrollPreviewEntry): string {
    return `
      <tr data-payroll-entry="${entry.staffId}">
        <td>${escapeHtml(entry.fullName)}</td>
        <td>${escapeHtml(entry.roleLabel)}</td>
        <td><input type="checkbox" data-field="include" ${entry.alreadyProcessed ? 'disabled' : 'checked'} /></td>
        <td><input type="number" min="0" dir="ltr" data-field="amount" value="${entry.amount}" ${entry.alreadyProcessed ? 'disabled' : ''} style="width:120px" /></td>
        <td>${entry.alreadyProcessed ? '<span class="article-status-badge article-status-published">قبلاً واریز شده</span>' : ''}</td>
      </tr>
    `;
  }

  document.getElementById('payroll-preview-btn')?.addEventListener('click', () => {
    payrollError.hidden = true;
    payrollResult.hidden = true;
    void fetchPayrollPreview(monthInput.value)
      .then((entries) => {
        payrollPreviewBody.innerHTML = entries.map(renderPreviewRow).join('');
        payrollPreviewWrap.hidden = false;
      })
      .catch((err) => {
        payrollError.hidden = false;
        payrollError.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
      });
  });

  document.getElementById('payroll-confirm-btn')?.addEventListener('click', () => {
    const entries: { staffId: number; amount: number }[] = [];
    document.querySelectorAll<HTMLElement>('[data-payroll-entry]').forEach((row) => {
      const include = row.querySelector<HTMLInputElement>('[data-field="include"]');
      const amount = row.querySelector<HTMLInputElement>('[data-field="amount"]');
      if (include?.checked && amount && Number(amount.value) > 0) {
        entries.push({ staffId: Number(row.dataset.payrollEntry), amount: Number(amount.value) });
      }
    });
    if (!entries.length) return;
    payrollError.hidden = true;
    void processPayroll(monthInput.value, entries)
      .then((result) => {
        payrollResult.hidden = false;
        payrollResult.textContent = `${result.processed} نفر پردازش شد.${result.skipped.length ? ` (${result.skipped.length} مورد رد شد — قبلاً واریز شده یا نامعتبر بود)` : ''}`;
        void loadBalances();
      })
      .catch((err) => {
        payrollError.hidden = false;
        payrollError.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
      });
  });

  // ----- صف درخواست‌های تسویه -----
  const payoutsError = document.getElementById('payouts-error')!;
  const payoutsList = document.getElementById('payouts-list')!;

  async function loadPayouts(): Promise<void> {
    payoutsError.hidden = true;
    try {
      const requests = await fetchPayoutRequests('pending');
      payoutsList.innerHTML = requests.length ? requests.map(renderPayoutQueueRow).join('') : '<p class="settings-panel-hint">درخواست در انتظاری نیست.</p>';
    } catch (err) {
      payoutsError.hidden = false;
      payoutsError.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
    }
  }

  payoutsList.addEventListener('click', (event) => {
    const approveBtn = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-payout-approve]');
    if (approveBtn) {
      void approvePayoutRequest(Number(approveBtn.dataset.payoutApprove))
        .then(() => Promise.all([loadPayouts(), loadBalances()]))
        .catch((err) => {
          payoutsError.hidden = false;
          payoutsError.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
        });
      return;
    }
    const rejectBtn = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-payout-reject]');
    if (rejectBtn) {
      const note = window.prompt('دلیل رد (اختیاری):') ?? undefined;
      void rejectPayoutRequest(Number(rejectBtn.dataset.payoutReject), note)
        .then(() => loadPayouts())
        .catch((err) => {
          payoutsError.hidden = false;
          payoutsError.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
        });
    }
  });

  // ----- نرخ پیش‌فرض نقش‌ها -----
  const ratesError = document.getElementById('rates-error')!;
  const ratesSavedNote = document.getElementById('rates-saved-note')!;
  const roleRatesBody = document.getElementById('role-rates-body')!;

  async function loadRoleRates(): Promise<void> {
    ratesError.hidden = true;
    try {
      const { roles } = await fetchRoles();
      roleRatesBody.innerHTML = roles.map(renderRoleRateRow).join('');
    } catch (err) {
      ratesError.hidden = false;
      ratesError.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
    }
  }

  roleRatesBody.addEventListener('click', (event) => {
    const saveBtn = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-role-rate-save]');
    if (!saveBtn) return;
    const row = saveBtn.closest<HTMLElement>('[data-role-rate-row]')!;
    const roleId = Number(row.dataset.roleRateRow);
    const salary = Number(row.querySelector<HTMLInputElement>('[data-field="salary"]')!.value);
    const bonusType = row.querySelector<HTMLSelectElement>('[data-field="bonusType"]')!.value as WalletBonusType;
    const bonusAmount = Number(row.querySelector<HTMLInputElement>('[data-field="bonusAmount"]')!.value);
    ratesError.hidden = true;
    void updateRolePayRate(roleId, { defaultSalaryAmount: salary, defaultBonusType: bonusType, defaultBonusAmount: bonusAmount })
      .then(() => {
        ratesSavedNote.hidden = false;
        window.setTimeout(() => (ratesSavedNote.hidden = true), 2500);
      })
      .catch((err) => {
        ratesError.hidden = false;
        ratesError.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
      });
  });

  void loadBalances();
  void loadPayouts();
  void loadRoleRates();
}

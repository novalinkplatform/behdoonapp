import { icons } from '../components/icons.ts';
import { fetchRequests, fetchStats, updateRequestStatus } from '../utils/api.ts';
import type { OrderRecord } from '../utils/api.ts';
import type { StaffInfo } from '../utils/auth.ts';
import { showToast } from '../utils/toast.ts';
import { resolveOrderInvoice, printAdminInvoiceSheet, downloadAdminInvoiceHtml } from '../utils/invoice.ts';
import { formatIranianDate } from '../utils/jalali.ts';

interface CustomFinanceDoc {
  id: string;
  trackingCode: string;
  customerName: string;
  phone: string;
  serviceLabel: string;
  originCity: string;
  destinationCity: string;
  amount: number;
  settlementStatus: 'settled' | 'pending' | 'credit' | 'canceled';
  createdAt: string;
  notes?: string;
}

const STORAGE_CUSTOM_DOCS_KEY = 'behdoon_custom_finance_docs';

function getStoredCustomDocs(): CustomFinanceDoc[] {
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_DOCS_KEY) || localStorage.getItem('behbar_custom_finance_docs');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredCustomDocs(docs: CustomFinanceDoc[]): void {
  try {
    localStorage.setItem(STORAGE_CUSTOM_DOCS_KEY, JSON.stringify(docs));
  } catch {
    // ignore
  }
}

function toPersianDigits(n: number | string): string {
  return String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
}

function formatPriceToman(amount: number): string {
  const parts = Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '،');
  return toPersianDigits(parts);
}

const SETTLEMENT_STATUS_MAP: Record<string, { label: string; badgeClass: string }> = {
  settled: { label: 'تسویه‌شده', badgeClass: 'finance-badge-settled' },
  pending: { label: 'در انتظار تسویه', badgeClass: 'finance-badge-pending' },
  credit: { label: 'بستانکار', badgeClass: 'finance-badge-credit' },
  canceled: { label: 'ابطال‌شده', badgeClass: 'finance-badge-canceled' },
};

export function renderFinanceView(_staff: StaffInfo): string {
  return `
    <div class="finance-view">
      <header class="finance-header">
        <div>
          <h1 class="dash-title">مدیریت مالی و حسابداری</h1>
          <p class="dash-subtitle">نظارت بر جریان مالی، دفتر اسناد مالی و فاکتورها، شاخص‌های سود و مطالبات، و استخراج اکسل</p>
        </div>
        <div class="finance-header-actions">
          <button type="button" class="finance-btn-excel" id="finance-export-excel-btn" title="دریافت فایل اکسل اسناد مالی">
            <span class="icon">${icons.fileSpreadsheet}</span>
            <span>دریافت اکسل (Excel)</span>
          </button>
          <button type="button" class="finance-btn-primary" id="finance-add-doc-btn">
            <span class="icon">${icons.plusCircle}</span>
            <span>ثبت سند مالی جدید</span>
          </button>
        </div>
      </header>

      <!-- Navigation Tabs -->
      <nav class="finance-subnav" role="tablist">
        <button type="button" class="finance-tab-btn active" data-finance-tab="overview" role="tab">
          <span class="icon">${icons.chart}</span>
          <span>شاخص‌های مالی و سود</span>
        </button>
        <button type="button" class="finance-tab-btn" data-finance-tab="documents" role="tab">
          <span class="icon">${icons.article}</span>
          <span>دفتر اسناد و فاکتورها</span>
        </button>
      </nav>

      <!-- Tab 1: Overview & KPIs -->
      <section id="finance-tab-overview" class="finance-tab-content">
        <div class="finance-kpis" id="finance-kpis-container">
          <div class="finance-kpi-card" style="--kpi-accent: #10b981;">
            <span class="finance-kpi-title">کل گردش مالی ناخالص</span>
            <div class="finance-kpi-value"><span id="kpi-gross-turnover">۰</span> <span class="finance-kpi-unit">تومان</span></div>
            <span class="finance-kpi-sub">مجموع ارزش سفارش‌ها و خدمات</span>
          </div>

          <div class="finance-kpi-card" style="--kpi-accent: #059669;">
            <span class="finance-kpi-title">درآمد محقق‌شده (تسویه‌شده)</span>
            <div class="finance-kpi-value"><span id="kpi-realized-revenue">۰</span> <span class="finance-kpi-unit">تومان</span></div>
            <span class="finance-kpi-sub">سفارش‌ها و اسناد نهایی‌شده</span>
          </div>

          <div class="finance-kpi-card" style="--kpi-accent: #f59e0b;">
            <span class="finance-kpi-title">مطالبات در انتظار تسویه</span>
            <div class="finance-kpi-value"><span id="kpi-pending-settlements">۰</span> <span class="finance-kpi-unit">تومان</span></div>
            <span class="finance-kpi-sub">اسناد در دست اجرا و در انتظار واریز</span>
          </div>

          <div class="finance-kpi-card" style="--kpi-accent: #ef4444;">
            <span class="finance-kpi-title">کل هزینه‌ها و بستانکاری</span>
            <div class="finance-kpi-value"><span id="kpi-total-expenses">۰</span> <span class="finance-kpi-unit">تومان</span></div>
            <span class="finance-kpi-sub">هزینه‌های جاری و تسویه همکاران</span>
          </div>

          <div class="finance-kpi-card" style="--kpi-accent: #3b82f6;">
            <span class="finance-kpi-title">سود ناخالص برآوردشده</span>
            <div class="finance-kpi-value"><span id="kpi-estimated-profit">۰</span> <span class="finance-kpi-unit">تومان</span></div>
            <span class="finance-kpi-sub">تفاضل درآمد محقق‌شده از هزینه‌ها</span>
          </div>

          <div class="finance-kpi-card" style="--kpi-accent: #8b5cf6;">
            <span class="finance-kpi-title">تعداد کل اسناد و فاکتورها</span>
            <div class="finance-kpi-value"><span id="kpi-docs-count">۰</span> <span class="finance-kpi-unit">سند</span></div>
            <span class="finance-kpi-sub">کل پرونده‌های مالی ثبت‌شده</span>
          </div>
        </div>

        <div class="finance-summary-grid" style="margin-top: var(--space-4);">
          <!-- Service Breakdown -->
          <div class="finance-panel">
            <div class="finance-panel-header">
              <h3 class="finance-panel-title">گردش مالی بر مبنای خدمات و تخصص‌های ساختمانی</h3>
            </div>
            <div id="finance-services-breakdown" style="display: flex; flex-direction: column; gap: 12px;">
              <p class="settings-panel-hint">در حال تجمیع آمار...</p>
            </div>
          </div>

          <!-- Settlement status breakdown -->
          <div class="finance-panel">
            <div class="finance-panel-header">
              <h3 class="finance-panel-title">وضعیت تسویه اسناد مالی</h3>
            </div>
            <div id="finance-settlement-breakdown" style="display: flex; flex-direction: column; gap: 12px;">
              <p class="settings-panel-hint">در حال تجمیع آمار...</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Tab 2: Documents / Invoices Registry -->
      <section id="finance-tab-documents" class="finance-tab-content" style="display: none;">
        <!-- Filters Bar -->
        <div class="finance-filters-bar">
          <input type="text" id="finance-search-input" class="finance-search-input" placeholder="جستجو بر اساس شماره سند، نام مشتری یا تلفن..." />
          
          <select id="finance-status-filter" class="finance-filter-select">
            <option value="all">تمام وضعیت‌های تسویه</option>
            <option value="settled">تسویه‌شده</option>
            <option value="pending">در انتظار تسویه</option>
            <option value="credit">بستانکار</option>
            <option value="canceled">ابطال‌شده</option>
          </select>

          <button type="button" class="finance-btn-secondary" id="finance-refresh-btn" title="تازه‌سازی لیست">
            <span class="icon">${icons.refresh}</span>
            <span>تازه‌سازی</span>
          </button>
        </div>

        <!-- Table -->
        <div class="finance-table-wrapper" style="margin-top: var(--space-3);">
          <table class="finance-table">
            <thead>
              <tr>
                <th>شماره سند</th>
                <th>تاریخ صدور</th>
                <th>طرف حساب</th>
                <th>تلفن</th>
                <th>عنوان خدمت</th>
                <th>موقعیت / منطقه</th>
                <th>مبلغ (تومان)</th>
                <th>وضعیت تسویه</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody id="finance-table-body">
              <tr>
                <td colspan="9" style="text-align: center; padding: 24px; color: var(--color-text-muted);">
                  در حال بارگذاری اسناد مالی...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Modal Container for Invoice View and New Document -->
      <div id="finance-modal-container"></div>
    </div>
  `;
}

export function initFinanceView(): void {
  const tabBtns = document.querySelectorAll<HTMLButtonElement>('[data-finance-tab]');
  const tabOverview = document.getElementById('finance-tab-overview');
  const tabDocuments = document.getElementById('finance-tab-documents');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.financeTab;
      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      if (tabName === 'overview') {
        if (tabOverview) tabOverview.style.display = 'block';
        if (tabDocuments) tabDocuments.style.display = 'none';
      } else if (tabName === 'documents') {
        if (tabOverview) tabOverview.style.display = 'none';
        if (tabDocuments) tabDocuments.style.display = 'block';
      }
    });
  });

  let allOrders: OrderRecord[] = [];
  let customDocs: CustomFinanceDoc[] = getStoredCustomDocs();

  async function loadData(): Promise<void> {
    try {
      const [ordersRes] = await Promise.allSettled([fetchRequests(), fetchStats()]);

      if (ordersRes.status === 'fulfilled') {
        allOrders = ordersRes.value;
      }

      customDocs = getStoredCustomDocs();
      updateKpisAndOverview();
      renderDocumentsTable();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'خطا در بارگذاری داده‌های مالی', 'error');
    }
  }

  function getUnifiedDocs(): Array<{
    id: string | number;
    isCustom: boolean;
    trackingCode: string;
    customerName: string;
    phone: string;
    serviceLabel: string;
    originCity: string;
    destinationCity: string;
    amount: number;
    settlementStatus: 'settled' | 'pending' | 'credit' | 'canceled';
    createdAt: string;
    notes?: string;
  }> {
    const list: Array<any> = [];

    // Map orders to financial documents
    for (const ord of allOrders) {
      let status: 'settled' | 'pending' | 'credit' | 'canceled' = 'pending';
      if (ord.status === 'completed') status = 'settled';
      else if (ord.status === 'canceled') status = 'canceled';
      else status = 'pending';

      list.push({
        id: ord.id,
        isCustom: false,
        trackingCode: ord.trackingCode || `BHD-${ord.id}`,
        customerName: ord.customerName || 'مشتری سامانه',
        phone: ord.phone || '—',
        serviceLabel: ord.serviceLabel || 'خدمات ساختمانی',
        originCity: ord.originCity || '—',
        destinationCity: ord.destinationCity || '—',
        amount: ord.estimateAvg || ord.estimateMin || 0,
        settlementStatus: status,
        createdAt: ord.createdAt || new Date().toISOString(),
        notes: ord.originNotes || '',
      });
    }

    // Append custom manual financial docs
    for (const c of customDocs) {
      list.push({
        id: c.id,
        isCustom: true,
        trackingCode: c.trackingCode,
        customerName: c.customerName,
        phone: c.phone,
        serviceLabel: c.serviceLabel,
        originCity: c.originCity,
        destinationCity: c.destinationCity,
        amount: c.amount,
        settlementStatus: c.settlementStatus,
        createdAt: c.createdAt,
        notes: c.notes,
      });
    }

    // Sort by createdAt desc
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  }

  function updateKpisAndOverview(): void {
    const docs = getUnifiedDocs();

    let grossTurnover = 0;
    let realizedRevenue = 0;
    let pendingSettlements = 0;
    let totalExpenses = 0;

    const serviceMap: Record<string, { count: number; total: number }> = {};
    const settlementCount: Record<string, number> = { settled: 0, pending: 0, credit: 0, canceled: 0 };

    for (const d of docs) {
      const amt = Number(d.amount) || 0;
      grossTurnover += amt;

      if (d.settlementStatus === 'settled') {
        realizedRevenue += amt;
        settlementCount.settled++;
      } else if (d.settlementStatus === 'pending') {
        pendingSettlements += amt;
        settlementCount.pending++;
      } else if (d.settlementStatus === 'credit') {
        totalExpenses += amt;
        settlementCount.credit++;
      } else if (d.settlementStatus === 'canceled') {
        settlementCount.canceled++;
      }

      // service aggregation
      const srv = d.serviceLabel || 'سایر';
      if (!serviceMap[srv]) serviceMap[srv] = { count: 0, total: 0 };
      serviceMap[srv].count++;
      serviceMap[srv].total += amt;
    }

    const estimatedProfit = Math.max(0, realizedRevenue - totalExpenses);

    const elGross = document.getElementById('kpi-gross-turnover');
    if (elGross) elGross.textContent = formatPriceToman(grossTurnover);

    const elRealized = document.getElementById('kpi-realized-revenue');
    if (elRealized) elRealized.textContent = formatPriceToman(realizedRevenue);

    const elPending = document.getElementById('kpi-pending-settlements');
    if (elPending) elPending.textContent = formatPriceToman(pendingSettlements);

    const elExpenses = document.getElementById('kpi-total-expenses');
    if (elExpenses) elExpenses.textContent = formatPriceToman(totalExpenses);

    const elProfit = document.getElementById('kpi-estimated-profit');
    if (elProfit) elProfit.textContent = formatPriceToman(estimatedProfit);

    const elDocsCount = document.getElementById('kpi-docs-count');
    if (elDocsCount) elDocsCount.textContent = toPersianDigits(docs.length);

    // Services breakdown list
    const servicesEl = document.getElementById('finance-services-breakdown');
    if (servicesEl) {
      const entries = Object.entries(serviceMap).sort((a, b) => b[1].total - a[1].total);
      if (!entries.length) {
        servicesEl.innerHTML = '<p class="settings-panel-hint">اطلاعاتی موجود نیست.</p>';
      } else {
        servicesEl.innerHTML = entries
          .map(([srv, data]) => {
            const pct = grossTurnover > 0 ? Math.round((data.total / grossTurnover) * 100) : 0;
            return `
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px;">
                  <span style="font-weight: 600;">${srv} (${toPersianDigits(data.count)} مورد)</span>
                  <span>${formatPriceToman(data.total)} تومان (%${toPersianDigits(pct)})</span>
                </div>
                <div style="background: rgba(0,0,0,0.06); height: 7px; border-radius: 4px; overflow: hidden;">
                  <div style="background: #10b981; height: 100%; width: ${pct}%;"></div>
                </div>
              </div>
            `;
          })
          .join('');
      }
    }

    // Settlement breakdown list
    const settlementEl = document.getElementById('finance-settlement-breakdown');
    if (settlementEl) {
      const totalDocs = docs.length || 1;
      settlementEl.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px;">
              <span class="finance-badge finance-badge-settled">تسویه‌شده: ${toPersianDigits(settlementCount.settled)} سند</span>
              <span>%${toPersianDigits(Math.round((settlementCount.settled / totalDocs) * 100))}</span>
            </div>
            <div style="background: rgba(0,0,0,0.06); height: 7px; border-radius: 4px; overflow: hidden;">
              <div style="background: #059669; height: 100%; width: ${(settlementCount.settled / totalDocs) * 100}%;"></div>
            </div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px;">
              <span class="finance-badge finance-badge-pending">در انتظار تسویه: ${toPersianDigits(settlementCount.pending)} سند</span>
              <span>%${toPersianDigits(Math.round((settlementCount.pending / totalDocs) * 100))}</span>
            </div>
            <div style="background: rgba(0,0,0,0.06); height: 7px; border-radius: 4px; overflow: hidden;">
              <div style="background: #f59e0b; height: 100%; width: ${(settlementCount.pending / totalDocs) * 100}%;"></div>
            </div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px;">
              <span class="finance-badge finance-badge-credit">بستانکار / هزینه‌ها: ${toPersianDigits(settlementCount.credit)} سند</span>
              <span>%${toPersianDigits(Math.round((settlementCount.credit / totalDocs) * 100))}</span>
            </div>
            <div style="background: rgba(0,0,0,0.06); height: 7px; border-radius: 4px; overflow: hidden;">
              <div style="background: #3b82f6; height: 100%; width: ${(settlementCount.credit / totalDocs) * 100}%;"></div>
            </div>
          </div>
        </div>
      `;
    }
  }

  function renderDocumentsTable(): void {
    const tableBody = document.getElementById('finance-table-body');
    if (!tableBody) return;

    const searchInput = (document.getElementById('finance-search-input') as HTMLInputElement)?.value.trim().toLowerCase();
    const statusFilter = (document.getElementById('finance-status-filter') as HTMLSelectElement)?.value || 'all';

    let docs = getUnifiedDocs();

    if (statusFilter !== 'all') {
      docs = docs.filter((d) => d.settlementStatus === statusFilter);
    }

    if (searchInput) {
      docs = docs.filter(
        (d) =>
          d.trackingCode.toLowerCase().includes(searchInput) ||
          d.customerName.toLowerCase().includes(searchInput) ||
          d.phone.includes(searchInput) ||
          d.serviceLabel.toLowerCase().includes(searchInput),
      );
    }

    if (!docs.length) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; padding: 28px; color: var(--color-text-muted);">
            سند مالی منطبق با جستجو یا فیلترهای انتخابی یافت نشد.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = docs
      .map((d) => {
        const badgeInfo = SETTLEMENT_STATUS_MAP[d.settlementStatus] || { label: d.settlementStatus, badgeClass: 'finance-badge-pending' };
        const routeLabel = d.originCity && d.destinationCity && d.originCity !== d.destinationCity
          ? `${d.originCity} ➔ ${d.destinationCity}`
          : (d.originCity || 'تهران');
        const dateStr = d.createdAt ? formatIranianDate(d.createdAt) : '—';

        return `
          <tr data-doc-id="${d.id}">
            <td style="font-weight: 700; font-family: monospace; direction: ltr; text-align: right;">${d.trackingCode}</td>
            <td style="white-space: nowrap;">${dateStr}</td>
            <td style="font-weight: 600;">${d.customerName}</td>
            <td style="direction: ltr; text-align: right;">${toPersianDigits(d.phone)}</td>
            <td>${d.serviceLabel}</td>
            <td style="font-size: 0.8rem; color: var(--color-text-muted);">${routeLabel}</td>
            <td style="font-weight: 700; color: #059669;">${formatPriceToman(d.amount)}</td>
            <td>
              <span class="finance-badge ${badgeInfo.badgeClass}">${badgeInfo.label}</span>
            </td>
            <td>
              <div style="display: flex; align-items: center; gap: 6px;">
                <button type="button" class="finance-btn-secondary btn-view-invoice" data-doc-code="${d.trackingCode}" title="مشاهده و چاپ فاکتور رسمی">
                  <span class="icon">${icons.printer}</span>
                  <span>فاکتور</span>
                </button>
                <button type="button" class="finance-btn-secondary btn-toggle-settlement" data-doc-id="${d.id}" data-is-custom="${d.isCustom}" title="تغییر وضعیت تسویه">
                  <span>${d.settlementStatus === 'settled' ? 'معلق' : 'تسویه'}</span>
                </button>
              </div>
            </td>
          </tr>
        `;
      })
      .join('');

    // Wire action buttons
    tableBody.querySelectorAll<HTMLButtonElement>('.btn-view-invoice').forEach((btn) => {
      btn.addEventListener('click', () => {
        const code = btn.dataset.docCode;
        const doc = docs.find((x) => x.trackingCode === code);
        if (doc) openInvoiceModal(doc);
      });
    });

    tableBody.querySelectorAll<HTMLButtonElement>('.btn-toggle-settlement').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.docId;
        const isCustom = btn.dataset.isCustom === 'true';

        if (isCustom) {
          const target = customDocs.find((x) => String(x.id) === id);
          if (target) {
            target.settlementStatus = target.settlementStatus === 'settled' ? 'pending' : 'settled';
            saveStoredCustomDocs(customDocs);
            showToast('وضعیت تسویه سند دستی به‌روزرسانی شد.', 'success');
            updateKpisAndOverview();
            renderDocumentsTable();
          }
        } else {
          const ord = allOrders.find((x) => String(x.id) === id);
          if (ord) {
            const nextStatus = ord.status === 'completed' ? 'in_progress' : 'completed';
            try {
              await updateRequestStatus(ord.id, nextStatus);
              ord.status = nextStatus;
              showToast('وضعیت تسویه سفارش به‌روزرسانی شد.', 'success');
              updateKpisAndOverview();
              renderDocumentsTable();
            } catch (e) {
              showToast('خطا در به‌روزرسانی وضعیت تسویه', 'error');
            }
          }
        }
      });
    });
  }

  // View & Print Official Invoice Modal
  function openInvoiceModal(doc: any): void {
    const modalContainer = document.getElementById('finance-modal-container');
    if (!modalContainer) return;

    const dateStr = formatIranianDate(doc.createdAt);
    const scheduledDateStr = doc.scheduledDate ? formatIranianDate(doc.scheduledDate) : '';
    const badgeInfo = SETTLEMENT_STATUS_MAP[doc.settlementStatus] || { label: doc.settlementStatus, badgeClass: 'finance-badge-pending' };
    const invoice = resolveOrderInvoice({ ...doc, estimateAvg: doc.amount || doc.estimateAvg || 1000000 });

    modalContainer.innerHTML = `
      <div class="finance-modal-backdrop" id="finance-modal-backdrop">
        <div class="finance-modal-content">
          <div class="finance-modal-header">
            <h3 style="margin: 0; font-size: 1.1rem; font-weight: 700;">فاکتور رسمی سند مالی بهدون</h3>
            <button type="button" class="admin-topbar-icon-btn" id="finance-modal-close">
              <span class="icon">${icons.close}</span>
            </button>
          </div>

          <div class="finance-modal-body">
            <!-- Printable Invoice Sheet -->
            <div class="behbar-invoice-sheet" id="behbar-printable-invoice">
              <div class="behbar-invoice-head">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <img src="/favicon.svg" alt="بهدون" style="width: 44px; height: 44px;" />
                  <div>
                    <h2 style="margin: 0; font-size: 1.3rem; color: #059669; font-weight: 800;">سامانه خدمات ساختمانی بهدون</h2>
                    <span style="font-size: 0.78rem; color: #6b7280;">سند و فاکتور رسمی خدمات فنی و مهندسی ساختمان</span>
                  </div>
                </div>
                <div class="behbar-invoice-meta">
                  <div><strong>شماره سند:</strong> <span style="font-family: monospace; direction: ltr;">${doc.trackingCode}</span></div>
                  <div><strong>تاریخ صدور:</strong> ${dateStr}</div>
                  <div><strong>وضعیت تسویه:</strong> <span class="finance-badge ${badgeInfo.badgeClass}">${badgeInfo.label}</span></div>
                </div>
              </div>

              <div class="behbar-invoice-parties">
                <div>
                  <div style="font-weight: 700; color: #374151; margin-bottom: 4px;">صادرکننده:</div>
                  <div>شرکت خدمات ساختمانی بهدون</div>
                  <div style="color: #6b7280; font-size: 0.78rem;">شناسه ثبت ملی: ۵۴۹۰۲۱ · پشتیبانی ۲۴ ساعته تهران</div>
                </div>
                <div>
                  <div style="font-weight: 700; color: #374151; margin-bottom: 4px;">طرف حساب (کارفرما/مشتری):</div>
                  <div><strong>${doc.customerName}</strong></div>
                  <div style="color: #6b7280; font-size: 0.78rem;">شماره تماس: ${toPersianDigits(doc.phone)}</div>
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px; background: #ecfdf5; border: 1px solid #d1fae5; padding: 10px 14px; border-radius: 8px; margin-bottom: 16px; font-size: 0.84rem;">
                <div><strong>محدوده / منطقه:</strong> ${doc.originCity || 'تهران'}</div>
                ${scheduledDateStr ? `<div><strong>زمان‌بندی:</strong> ${scheduledDateStr} ${doc.scheduledTime ? '— ساعت ' + toPersianDigits(doc.scheduledTime) : ''}</div>` : ''}
                <div><strong>خدمت:</strong> ${doc.serviceLabel || 'خدمات ساختمانی'}</div>
              </div>

              <table class="behbar-invoice-table">
                <thead>
                  <tr>
                    <th style="width: 40px; text-align: center;">#</th>
                    <th>شرح خدمات و اقلام هزینه</th>
                    <th style="width: 130px; text-align: left;">مبلغ (تومان)</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoice.items
                    .map(
                      (item, idx) => `
                    <tr>
                      <td style="text-align: center;">${toPersianDigits(idx + 1)}</td>
                      <td>
                        <strong>${item.title}</strong>
                        <div style="font-size: 0.75rem; color: #6b7280; margin-top: 2px;">${item.description}</div>
                      </td>
                      <td style="text-align: left; font-weight: 700; color: ${item.amount === 0 ? '#9ca3af' : '#059669'};">
                        ${item.amount === 0 ? 'رایگان' : formatPriceToman(item.amount)}
                      </td>
                    </tr>
                  `,
                    )
                    .join('')}
                </tbody>
              </table>

              <div class="behbar-invoice-total">
                <span style="font-weight: 700;">جمع کل قابل پرداخت:</span>
                <span style="font-size: 1.25rem; font-weight: 800; color: #059669;">${formatPriceToman(invoice.total)} تومان</span>
              </div>

              <div class="behbar-invoice-footer-sign" style="display: flex; justify-content: space-between; align-items: flex-end; font-size: 0.78rem; color: #6b7280; margin-top: 18px;">
                <div style="max-width: 440px; line-height: 1.5;">
                  این صورتحساب توسط سامانه هوشمند خدمات ساختمان بهدون صادر شده و معتبر می‌باشد.
                </div>
                <div style="text-align: center; border-top: 1px dashed #d1d5db; padding-top: 6px; width: 140px;">
                  مهر و امضای امور مالی بهدون
                </div>
              </div>
            </div>
          </div>

          <div class="finance-modal-footer">
            <button type="button" class="finance-btn-primary" id="btn-print-invoice-sheet" title="چاپ یا ذخیره فاکتور به‌صورت PDF بدون عنوان اضافی">
              <span class="icon">${icons.printer}</span>
              <span>چاپ و ذخیره PDF</span>
            </button>
            <button type="button" class="finance-btn-secondary" id="btn-download-finance-invoice" style="display: inline-flex; align-items: center; gap: 6px;" title="دریافت فایل سند آفلاین فاکتور">
              <span class="icon" style="width: 16px; height: 16px;">${icons.download}</span>
              <span>دریافت فایل فاکتور</span>
            </button>
            <button type="button" class="finance-btn-secondary" id="btn-close-invoice-modal">بستن</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('finance-modal-close')?.addEventListener('click', closeModal);
    document.getElementById('btn-close-invoice-modal')?.addEventListener('click', closeModal);
    document.getElementById('finance-modal-backdrop')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeModal();
    });

    document.getElementById('btn-print-invoice-sheet')?.addEventListener('click', () => {
      printAdminInvoiceSheet('behbar-printable-invoice');
    });

    document.getElementById('btn-download-finance-invoice')?.addEventListener('click', () => {
      downloadAdminInvoiceHtml('behbar-printable-invoice', doc.trackingCode);
    });

    function closeModal(): void {
      if (modalContainer) modalContainer.innerHTML = '';
    }
  }

  // Open New Financial Document Modal
  function openAddDocModal(): void {
    const modalContainer = document.getElementById('finance-modal-container');
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="finance-modal-backdrop" id="finance-add-modal-backdrop">
        <div class="finance-modal-content">
          <div class="finance-modal-header">
            <h3 style="margin: 0; font-size: 1.1rem; font-weight: 700;">ثبت سند مالی و هزینه جدید</h3>
            <button type="button" class="admin-topbar-icon-btn" id="finance-add-modal-close">
              <span class="icon">${icons.close}</span>
            </button>
          </div>

          <form id="finance-add-doc-form" class="finance-modal-body">
            <div>
              <label class="settings-form-label">نوع سند مالی:</label>
              <select id="doc-type-select" class="finance-filter-select" style="width: 100%; margin-top: 4px;">
                <option value="revenue">درآمد خدمات و پروژه‌های ساختمانی</option>
                <option value="expense">هزینه جاری عملیاتی (ابزار، ایاب و ذهاب، قطعات و مصالح)</option>
                <option value="fleet_settle">تسویه حساب با تکنسین و استادکار</option>
              </select>
            </div>

            <div>
              <label class="settings-form-label">نام طرف حساب / تکنسین / کارفرما:</label>
              <input type="text" id="doc-customer-input" class="finance-search-input" style="width: 100%; margin-top: 4px;" required placeholder="مثال: آقای محمدی یا استاد رضایی" />
            </div>

            <div>
              <label class="settings-form-label">شماره تماس طرف حساب:</label>
              <input type="tel" id="doc-phone-input" class="finance-search-input" style="width: 100%; margin-top: 4px;" placeholder="۰۹۱۲..." />
            </div>

            <div>
              <label class="settings-form-label">شرح سند مالی / خدمت:</label>
              <input type="text" id="doc-service-input" class="finance-search-input" style="width: 100%; margin-top: 4px;" required placeholder="مثال: سرویس پکیج، رفع نم با دستگاه، کناف یا خرید قطعه" />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2);">
              <div>
                <label class="settings-form-label">منطقه / محله:</label>
                <input type="text" id="doc-origin-input" class="finance-search-input" style="width: 100%; margin-top: 4px;" placeholder="تهران - منطقه ۲" />
              </div>
              <div>
                <label class="settings-form-label">آدرس یا واحد پروژه:</label>
                <input type="text" id="doc-dest-input" class="finance-search-input" style="width: 100%; margin-top: 4px;" placeholder="سعادت‌آباد، واحد ۴" />
              </div>
            </div>

            <div>
              <label class="settings-form-label">مبلغ سند (تومان):</label>
              <input type="number" id="doc-amount-input" class="finance-search-input" style="width: 100%; margin-top: 4px;" required min="1000" step="1000" placeholder="مثال: ۱۵۰۰۰۰۰" />
            </div>

            <div>
              <label class="settings-form-label">وضعیت اولیه تسویه:</label>
              <select id="doc-status-select" class="finance-filter-select" style="width: 100%; margin-top: 4px;">
                <option value="settled">تسویه‌شده (واریزشده)</option>
                <option value="pending">در انتظار تسویه</option>
                <option value="credit">بستانکار</option>
              </select>
            </div>

            <div class="finance-modal-footer" style="margin-top: var(--space-3); padding-inline: 0; padding-bottom: 0;">
              <button type="submit" class="finance-btn-primary">
                <span class="icon">${icons.plusCircle}</span>
                <span>ثبت قطعی سند مالی</span>
              </button>
              <button type="button" class="finance-btn-secondary" id="btn-cancel-add-doc">انصراف</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.getElementById('finance-add-modal-close')?.addEventListener('click', closeAddModal);
    document.getElementById('btn-cancel-add-doc')?.addEventListener('click', closeAddModal);
    document.getElementById('finance-add-modal-backdrop')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeAddModal();
    });

    const form = document.getElementById('finance-add-doc-form') as HTMLFormElement;
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const customer = (document.getElementById('doc-customer-input') as HTMLInputElement).value.trim();
      const phone = (document.getElementById('doc-phone-input') as HTMLInputElement).value.trim() || '—';
      const service = (document.getElementById('doc-service-input') as HTMLInputElement).value.trim();
      const origin = (document.getElementById('doc-origin-input') as HTMLInputElement).value.trim() || 'تهران';
      const dest = (document.getElementById('doc-dest-input') as HTMLInputElement).value.trim() || 'تهران';
      const amount = Number((document.getElementById('doc-amount-input') as HTMLInputElement).value) || 0;
      const status = (document.getElementById('doc-status-select') as HTMLSelectElement).value as any;

      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      const newDoc: CustomFinanceDoc = {
        id: `custom_${Date.now()}`,
        trackingCode: `BHD-FIN-${randomSuffix}`,
        customerName: customer,
        phone,
        serviceLabel: service,
        originCity: origin,
        destinationCity: dest,
        amount,
        settlementStatus: status,
        createdAt: new Date().toISOString(),
      };

      customDocs.push(newDoc);
      saveStoredCustomDocs(customDocs);

      showToast('سند مالی جدید با موفقیت ثبت شد.', 'success');
      closeAddModal();
      updateKpisAndOverview();
      renderDocumentsTable();
    });

    function closeAddModal(): void {
      if (modalContainer) modalContainer.innerHTML = '';
    }
  }

  // Export to Excel / CSV with UTF-8 BOM
  function exportToExcel(): void {
    const docs = getUnifiedDocs();
    if (!docs.length) {
      showToast('سند مالی برای صدور فایل اکسل موجود نیست.', 'error');
      return;
    }

    const headers = [
      'شماره سند مالی',
      'تاریخ صدور',
      'طرف حساب',
      'شماره تماس',
      'عنوان خدمت',
      'منطقه / محله',
      'آدرس پروژه',
      'مبلغ کل (تومان)',
      'وضعیت تسویه',
      'توضیحات',
    ];

    function csvCell(val: any): string {
      const s = val === null || val === undefined ? '' : String(val);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    }

    const lines: string[] = [headers.map(csvCell).join(',')];

    for (const d of docs) {
      const statusLabel = SETTLEMENT_STATUS_MAP[d.settlementStatus]?.label || d.settlementStatus;
      const dateStr = d.createdAt ? formatIranianDate(d.createdAt) : '';

      lines.push(
        [
          d.trackingCode,
          dateStr,
          d.customerName,
          d.phone,
          d.serviceLabel,
          d.originCity,
          d.destinationCity,
          d.amount,
          statusLabel,
          d.notes || '',
        ]
          .map(csvCell)
          .join(','),
      );
    }

    // Include UTF-8 BOM so Excel opens Persian text without encoding issues
    const csvContent = '\uFEFF' + lines.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStamp = new Date().toISOString().slice(0, 10);
    link.download = `behdoon-financial-report-${dateStamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('فایل اکسل گزارش مالی بهدون با موفقیت ایجاد و دانلود شد.', 'success');
  }

  // Event Listeners
  document.getElementById('finance-export-excel-btn')?.addEventListener('click', exportToExcel);
  document.getElementById('finance-add-doc-btn')?.addEventListener('click', openAddDocModal);
  document.getElementById('finance-refresh-btn')?.addEventListener('click', () => {
    void loadData();
    showToast('اطلاعات مالی به‌روز شد.', 'success');
  });

  const searchInput = document.getElementById('finance-search-input');
  searchInput?.addEventListener('input', () => renderDocumentsTable());

  const statusFilter = document.getElementById('finance-status-filter');
  statusFilter?.addEventListener('change', () => renderDocumentsTable());

  // Load initial data
  void loadData();
}

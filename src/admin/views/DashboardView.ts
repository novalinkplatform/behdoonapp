import { fetchStats, fetchAnalytics, fetchRequests } from '../utils/api.ts';
import { STATUS_LABELS, STATUS_COLORS } from '../data/status.ts';
import { formatToman, toPersianDigits } from '../utils/format.ts';
import { renderBarChart, renderLineChart } from '../components/Charts.ts';
import { icons } from '../components/icons.ts';

const DEVICE_LABELS: Record<string, string> = { mobile: 'موبایل', desktop: 'رایانه' };

function formatDayLabel(day: string): string {
  const parts = day.split('-');
  if (parts.length !== 3) return toPersianDigits(day);
  return toPersianDigits(`${parts[1]}/${parts[2]}`);
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

type DashboardSubTab = 'overview' | 'orders' | 'visitors' | 'staff';

// ==========================================
// پیشخوان یکپارچه و جامع مدیریت بهدون
// ==========================================

export function renderDashboardView(): string {
  return `
    <div class="dash-view">
      <header class="dash-header">
        <div class="dash-header-main">
          <div class="dash-live-badge">
            <span class="dash-live-dot"></span>
            <span>سامانه آنلاین و فعال</span>
          </div>
          <h1 class="dash-title">پیشخوان مدیریت و مانیتورینگ بهدون</h1>
          <p class="dash-subtitle">مرکز کنترل و رصد برخط خدمات تأسیسات، تکنسین‌ها و درخواست‌های ساختمانی تهران</p>
        </div>
        <div class="dash-header-actions">
          <button type="button" class="btn btn-secondary dash-refresh-btn" id="dash-refresh-btn">
            <span class="icon">${icons.refresh}</span>
            <span>به‌روزرسانی داده‌ها</span>
          </button>
        </div>
      </header>

      <nav class="dash-subnav" id="dash-subnav" aria-label="بخش‌های پیشخوان">
        <button type="button" class="dash-subnav-btn is-active" data-dash-tab="overview">
          <span class="icon">${icons.chart}</span>
          <span>نمای کلی عملیات</span>
        </button>
        <button type="button" class="dash-subnav-btn" data-dash-tab="orders">
          <span class="icon">${icons.columns}</span>
          <span>تحلیل سفارش‌ها و تقاضا</span>
        </button>
        <button type="button" class="dash-subnav-btn" data-dash-tab="visitors">
          <span class="icon">${icons.eye}</span>
          <span>بازدید و ترافیک</span>
        </button>
        <button type="button" class="dash-subnav-btn" data-dash-tab="staff">
          <span class="icon">${icons.users}</span>
          <span>عملکرد پرسنل</span>
        </button>
      </nav>

      <p class="error-text" id="dash-error" hidden></p>

      <div class="dash-body" id="dash-body">
        <div class="dash-loading">
          <span class="dash-spinner"></span>
          <span>در حال بارگذاری اطلاعات پیشخوان...</span>
        </div>
      </div>
    </div>
  `;
}

export function initDashboardView(onNavigate: (view: string) => void): void {
  const bodyEl = document.getElementById('dash-body');
  const errorEl = document.getElementById('dash-error');
  const refreshBtn = document.getElementById('dash-refresh-btn');
  const subnavBtns = document.querySelectorAll<HTMLButtonElement>('#dash-subnav [data-dash-tab]');

  if (!bodyEl) return;

  let currentTab: DashboardSubTab = 'overview';

  async function renderOverviewTab(): Promise<void> {
    if (!bodyEl) return;
    bodyEl.innerHTML = `
      <div class="dash-loading">
        <span class="dash-spinner"></span>
        <span>در حال پایش اطلاعات عملیات...</span>
      </div>
    `;

    try {
      const [statsRes, analyticsRes, requestsRes] = await Promise.allSettled([
        fetchStats(),
        fetchAnalytics(),
        fetchRequests(),
      ]);

      const stats = statsRes.status === 'fulfilled' ? statsRes.value : null;
      const analytics = analyticsRes.status === 'fulfilled' ? analyticsRes.value : null;
      const requests = requestsRes.status === 'fulfilled' ? requestsRes.value : [];

      const pendingCount = stats?.byStatus?.find((s) => s.status === 'pending')?.count ?? 0;
      const inProgressCount = stats?.byStatus?.find((s) => s.status === 'in_progress')?.count ?? 0;
      const completedCount = stats?.byStatus?.find((s) => s.status === 'completed')?.count ?? 0;
      const totalRevenue = stats?.completedRevenue ?? 0;
      const avgValue = stats?.avgOrderValue ?? 0;

      const totalViews = analytics?.totalViews ?? 0;
      const uniqueVisitors = analytics?.uniqueVisitors ?? 0;
      const activeOnline = analytics?.activeOnline ?? 0;
      const conversionRate = analytics?.conversionRate ?? 0;

      const recentOrders = requests.slice(0, 8);

      const html = `
        <!-- KPI Cards Grid -->
        <div class="dash-kpi-grid">
          <div class="dash-kpi-card ${pendingCount > 0 ? 'is-alert' : ''}">
            <div class="dash-kpi-header">
              <span class="dash-kpi-label">در انتظار بررسی و تماس</span>
              <span class="dash-kpi-badge ${pendingCount > 0 ? 'badge-warning' : 'badge-neutral'}">
                ${pendingCount > 0 ? 'نیازمند اقدام' : 'به‌روز'}
              </span>
            </div>
            <div class="dash-kpi-value">${toPersianDigits(pendingCount)}</div>
            <div class="dash-kpi-sub">سفارش‌های جدید بدون رسیدگی</div>
          </div>

          <div class="dash-kpi-card">
            <div class="dash-kpi-header">
              <span class="dash-kpi-label">خدمات در حال انجام</span>
              <span class="dash-kpi-badge badge-primary">سرویس فعال</span>
            </div>
            <div class="dash-kpi-value">${toPersianDigits(inProgressCount)}</div>
            <div class="dash-kpi-sub">تکنسین‌های در حال اجرای خدمت در تهران</div>
          </div>

          <div class="dash-kpi-card">
            <div class="dash-kpi-header">
              <span class="dash-kpi-label">خدمات انجام‌شده</span>
              <span class="dash-kpi-badge badge-success">موفق</span>
            </div>
            <div class="dash-kpi-value">${toPersianDigits(completedCount)}</div>
            <div class="dash-kpi-sub">کل خدمات پایان‌یافته با ضمانت کتبی</div>
          </div>

          <div class="dash-kpi-card">
            <div class="dash-kpi-header">
              <span class="dash-kpi-label">درآمد سفارش‌های انجام‌شده</span>
              <span class="dash-kpi-badge badge-success">تومان</span>
            </div>
            <div class="dash-kpi-value is-currency">${formatToman(totalRevenue)}</div>
            <div class="dash-kpi-sub">میانگین هر سفارش: ${formatToman(avgValue)}</div>
          </div>

          <div class="dash-kpi-card">
            <div class="dash-kpi-header">
              <span class="dash-kpi-label">کاربران آنلاین لحظه‌ای</span>
              <span class="dash-live-badge"><span class="dash-live-dot"></span>زنده</span>
            </div>
            <div class="dash-kpi-value">${toPersianDigits(activeOnline)}</div>
            <div class="dash-kpi-sub">کاربران فعال در ۱۵ دقیقه اخیر</div>
          </div>

          <div class="dash-kpi-card">
            <div class="dash-kpi-header">
              <span class="dash-kpi-label">نرخ تبدیل به سفارش</span>
              <span class="dash-kpi-badge badge-primary">${toPersianDigits(conversionRate)}٪</span>
            </div>
            <div class="dash-kpi-value">${toPersianDigits(conversionRate)} <span class="dash-kpi-unit">درصد</span></div>
            <div class="dash-kpi-sub">از ${toPersianDigits(uniqueVisitors)} بازدیدکننده ماه</div>
          </div>

          <div class="dash-kpi-card">
            <div class="dash-kpi-header">
              <span class="dash-kpi-label">پوشش فعال مناطق تهران</span>
              <span class="dash-kpi-badge badge-neutral">تهران</span>
            </div>
            <div class="dash-kpi-value">۲۲ <span class="dash-kpi-unit">منطقه</span></div>
            <div class="dash-kpi-sub">اعزام فوری تکنسین زیر ۴۵ دقیقه</div>
          </div>

          <div class="dash-kpi-card">
            <div class="dash-kpi-header">
              <span class="dash-kpi-label">بازدید ۳۰ روز اخیر</span>
              <span class="dash-kpi-badge badge-neutral">ترافیک</span>
            </div>
            <div class="dash-kpi-value">${toPersianDigits(totalViews)}</div>
            <div class="dash-kpi-sub">${toPersianDigits(uniqueVisitors)} کاربر یکتا در ماه گذشته</div>
          </div>
        </div>

        <!-- Quick Operational Hub -->
        <div class="dash-section">
          <div class="dash-section-header">
            <div>
              <h2 class="dash-section-title">دسترسی سریع عملیاتی</h2>
              <p class="dash-section-desc">انتقال سریع به ماژول‌های پرکاربرد سامانه بهدون</p>
            </div>
          </div>
          <div class="dash-quick-grid">
            <button type="button" class="dash-quick-card" data-dash-nav="pipeline">
              <div class="dash-quick-icon icon-pipeline">${icons.columns}</div>
              <div class="dash-quick-body">
                <strong>مراحل درخواست‌ها</strong>
                <span>بررسی، تعیین وضعیت و تخصیص تکنسین به سفارش‌ها</span>
              </div>
              <span class="dash-quick-arrow">${icons.arrowLeft}</span>
            </button>

            <button type="button" class="dash-quick-card" data-dash-nav="map">
              <div class="dash-quick-icon icon-map">${icons.map}</div>
              <div class="dash-quick-body">
                <strong>نقشه زنده درخواست‌ها</strong>
                <span>ردیابی موقعیت آدرس‌ها و پروژه‌ها در مناطق تهران</span>
              </div>
              <span class="dash-quick-arrow">${icons.arrowLeft}</span>
            </button>

            <button type="button" class="dash-quick-card" data-dash-nav="staff">
              <div class="dash-quick-icon icon-pipeline">${icons.users}</div>
              <div class="dash-quick-body">
                <strong>مدیریت تکنسین‌ها و پرسنل</strong>
                <span>تعریف تکنسین‌های فنی، مهارت‌ها و عملکرد</span>
              </div>
              <span class="dash-quick-arrow">${icons.arrowLeft}</span>
            </button>

            <button type="button" class="dash-quick-card" data-dash-nav="chat">
              <div class="dash-quick-icon icon-chat">${icons.chat}</div>
              <div class="dash-quick-body">
                <strong>چت و پشتیبانی برخط</strong>
                <span>پاسخگویی زنده به سوالات کاربران</span>
              </div>
              <span class="dash-quick-arrow">${icons.arrowLeft}</span>
            </button>

            <button type="button" class="dash-quick-card" data-dash-nav="home">
              <div class="dash-quick-icon icon-modules">${icons.grid}</div>
              <div class="dash-quick-body">
                <strong>تمام بخش‌ها و ماژول‌ها</strong>
                <span>تنظیمات، پرسنل، محتوا، پلاگین‌ها، سئو و گزارش‌ها</span>
              </div>
              <span class="dash-quick-arrow">${icons.arrowLeft}</span>
            </button>
          </div>
        </div>

        <!-- Charts Grid -->
        <div class="dash-charts-grid">
          <div class="dash-card">
            <div class="dash-card-header">
              <h2 class="dash-card-title">روند روزانه درخواست‌ها (۱۴ روز اخیر)</h2>
            </div>
            <div class="dash-card-body">
              ${
                stats?.daily?.length
                  ? renderLineChart(stats.daily.map((d) => ({ label: formatDayLabel(d.day), value: d.count })))
                  : '<p class="dash-empty">داده‌ای ثبت نشده است.</p>'
              }
            </div>
          </div>

          <div class="dash-card">
            <div class="dash-card-header">
              <h2 class="dash-card-title">وضعیت درخواست‌های سامانه</h2>
            </div>
            <div class="dash-card-body">
              ${
                stats?.byStatus?.length
                  ? renderBarChart(
                      stats.byStatus.map((s) => ({
                        label: STATUS_LABELS[s.status] ?? s.status,
                        value: s.count,
                      })),
                    )
                  : '<p class="dash-empty">داده‌ای ثبت نشده است.</p>'
              }
            </div>
          </div>
        </div>

        <!-- Recent Orders Feed -->
        <div class="dash-section">
          <div class="dash-section-header">
            <div class="dash-section-title-group">
              <h2 class="dash-section-title">سفارش‌های اخیر دریافتی</h2>
              <span class="dash-count-pill">${toPersianDigits(recentOrders.length)} سفارش آخر</span>
            </div>
            <button type="button" class="dash-link-btn" data-dash-nav="pipeline">
              <span>مشاهده همه در مراحل درخواست‌ها</span>
              <span class="icon">${icons.arrowLeft}</span>
            </button>
          </div>

          <div class="dash-card dash-table-card">
            <div class="dash-table-wrapper">
              ${
                recentOrders.length === 0
                  ? '<p class="dash-empty">هنوز سفارشی در سامانه بهدون ثبت نشده است.</p>'
                  : `
                <table class="dash-table">
                  <thead>
                    <tr>
                      <th>کد رهگیری</th>
                      <th>مشتری و تماس</th>
                      <th>نوع خدمت</th>
                      <th>موقعیت / منطقه</th>
                      <th>برآورد هزینه</th>
                      <th>وضعیت</th>
                      <th>عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${recentOrders
                      .map((order) => {
                        const statusColor = STATUS_COLORS[order.status] ?? 'var(--muted)';
                        const statusLabel = STATUS_LABELS[order.status] ?? order.status;
                        const route = escapeHtml(order.originCity || 'تهران');
                        return `
                        <tr>
                          <td><span class="dash-code">${escapeHtml(order.trackingCode)}</span></td>
                          <td>
                            <div class="dash-customer-cell">
                              <span class="dash-customer-name">${escapeHtml(order.customerName || 'بدون نام')}</span>
                              <span class="dash-customer-phone">${toPersianDigits(order.phone || '')}</span>
                            </div>
                          </td>
                          <td><span class="dash-service-tag">${escapeHtml(order.serviceLabel || 'خدمات ساختمانی')}</span></td>
                          <td><span class="dash-route">${route}</span></td>
                          <td><span class="dash-price">${order.estimateAvg ? formatToman(order.estimateAvg) : 'توافقی'}</span></td>
                          <td>
                            <span class="dash-status-pill" style="--status-color: ${statusColor}">
                              <span class="dash-status-dot"></span>
                              ${statusLabel}
                            </span>
                          </td>
                          <td>
                            <button type="button" class="btn btn-sm btn-ghost dash-view-order-btn" data-dash-nav="pipeline">
                              <span>بررسی</span>
                              <span class="icon">${icons.arrowLeft}</span>
                            </button>
                          </td>
                        </tr>
                      `;
                      })
                      .join('')}
                  </tbody>
                </table>
              `
              }
            </div>
          </div>
        </div>
      `;

      bodyEl.innerHTML = html;

      // کلیک روی لینک‌ها و دکمه‌های ناوبری سریع
      bodyEl.querySelectorAll<HTMLElement>('[data-dash-nav]').forEach((el) => {
        el.addEventListener('click', () => {
          const target = el.dataset.dashNav;
          if (target) onNavigate(target);
        });
      });
    } catch (err) {
      bodyEl.innerHTML = `<p class="error-text">${err instanceof Error ? err.message : 'بارگذاری پیشخوان با خطا مواجه شد.'}</p>`;
    }
  }

  async function renderOrdersTab(): Promise<void> {
    if (!bodyEl) return;
    bodyEl.innerHTML = `
      <div class="dash-loading">
        <span class="dash-spinner"></span>
        <span>در حال بارگذاری تحلیل سفارش‌ها...</span>
      </div>
    `;

    try {
      const stats = await fetchStats();
      const inProgress = stats.byStatus.find((s) => s.status === 'in_progress')?.count ?? 0;
      const completed = stats.byStatus.find((s) => s.status === 'completed')?.count ?? 0;

      bodyEl.innerHTML = `
        <div class="dash-kpi-grid">
          <div class="dash-kpi-card">
            <span class="dash-kpi-label">کل درخواست‌ها</span>
            <span class="dash-kpi-value">${toPersianDigits(stats.total)}</span>
          </div>
          <div class="dash-kpi-card">
            <span class="dash-kpi-label">در حال انجام</span>
            <span class="dash-kpi-value">${toPersianDigits(inProgress)}</span>
          </div>
          <div class="dash-kpi-card">
            <span class="dash-kpi-label">انجام‌شده</span>
            <span class="dash-kpi-value">${toPersianDigits(completed)}</span>
          </div>
          <div class="dash-kpi-card">
            <span class="dash-kpi-label">درآمد سفارش‌های انجام‌شده</span>
            <span class="dash-kpi-value is-currency">${formatToman(stats.completedRevenue)}</span>
          </div>
          <div class="dash-kpi-card">
            <span class="dash-kpi-label">میانگین ارزش هر سفارش</span>
            <span class="dash-kpi-value is-currency">${formatToman(stats.avgOrderValue)}</span>
          </div>
        </div>

        <div class="dash-charts-grid">
          <div class="dash-card">
            <div class="dash-card-header"><h2 class="dash-card-title">روند درخواست‌ها (۱۴ روز اخیر)</h2></div>
            <div class="dash-card-body">${renderLineChart(stats.daily.map((d) => ({ label: formatDayLabel(d.day), value: d.count })))}</div>
          </div>
          <div class="dash-card">
            <div class="dash-card-header"><h2 class="dash-card-title">وضعیت درخواست‌ها</h2></div>
            <div class="dash-card-body">${renderBarChart(stats.byStatus.map((s) => ({ label: STATUS_LABELS[s.status] ?? s.status, value: s.count })))}</div>
          </div>
          <div class="dash-card">
            <div class="dash-card-header"><h2 class="dash-card-title">نوع خدمات</h2></div>
            <div class="dash-card-body">${renderBarChart(stats.byService.map((s) => ({ label: s.service_label, value: s.count })))}</div>
          </div>
          <div class="dash-card">
            <div class="dash-card-header"><h2 class="dash-card-title">پرتقاضاترین شهرهای مبدأ</h2></div>
            <div class="dash-card-body">${stats.topCities.length ? renderBarChart(stats.topCities.map((c) => ({ label: c.city, value: c.count }))) : '<p class="dash-empty">داده‌ای وجود ندارد.</p>'}</div>
          </div>
          <div class="dash-card">
            <div class="dash-card-header"><h2 class="dash-card-title">درخواست‌ها به تفکیک استان مبدأ</h2></div>
            <div class="dash-card-body">${stats.topProvinces.length ? renderBarChart(stats.topProvinces.map((p) => ({ label: p.province, value: p.count }))) : '<p class="dash-empty">داده‌ای وجود ندارد.</p>'}</div>
          </div>
        </div>
      `;
    } catch (err) {
      bodyEl.innerHTML = `<p class="error-text">${err instanceof Error ? err.message : 'خطایی پیش آمد.'}</p>`;
    }
  }

  async function renderVisitorsTab(): Promise<void> {
    if (!bodyEl) return;
    bodyEl.innerHTML = `
      <div class="dash-loading">
        <span class="dash-spinner"></span>
        <span>در حال بارگذاری آمار بازدید و ترافیک...</span>
      </div>
    `;

    try {
      const analytics = await fetchAnalytics();

      bodyEl.innerHTML = `
        <div class="dash-kpi-grid">
          <div class="dash-kpi-card">
            <div class="dash-kpi-header">
              <span class="dash-kpi-label">کاربران آنلاین لحظه‌ای</span>
              <span class="dash-live-badge"><span class="dash-live-dot"></span>زنده</span>
            </div>
            <div class="dash-kpi-value">${toPersianDigits(analytics.activeOnline ?? 0)}</div>
            <div class="dash-kpi-sub">فعال در ۱۵ دقیقه گذشته</div>
          </div>

          <div class="dash-kpi-card">
            <div class="dash-kpi-header">
              <span class="dash-kpi-label">بازدید امروز</span>
              <span class="dash-kpi-badge badge-neutral">۲۴ ساعت</span>
            </div>
            <div class="dash-kpi-value">${toPersianDigits(analytics.todayViews ?? 0)}</div>
            <div class="dash-kpi-sub">${toPersianDigits(analytics.todayVisitors ?? 0)} بازدیدکننده یکتای امروز</div>
          </div>

          <div class="dash-kpi-card">
            <div class="dash-kpi-header">
              <span class="dash-kpi-label">نرخ تبدیل به سفارش</span>
              <span class="dash-kpi-badge badge-primary">${toPersianDigits(analytics.conversionRate ?? 0)}٪</span>
            </div>
            <div class="dash-kpi-value">${toPersianDigits(analytics.conversionRate ?? 0)} <span class="dash-kpi-unit">درصد</span></div>
            <div class="dash-kpi-sub">نسبت سفارشات موفق به کل مراجعین</div>
          </div>

          <div class="dash-kpi-card">
            <div class="dash-kpi-header">
              <span class="dash-kpi-label">کل بازدید (۳۰ روز)</span>
              <span class="dash-kpi-badge badge-neutral">ماهانه</span>
            </div>
            <div class="dash-kpi-value">${toPersianDigits(analytics.totalViews)}</div>
            <div class="dash-kpi-sub">${toPersianDigits(analytics.uniqueVisitors)} کاربر یکتا</div>
          </div>
        </div>

        <!-- Funnel & User Behavior Actions Card -->
        <div class="dash-card" style="margin-bottom: var(--space-4);">
          <div class="dash-card-header">
            <h2 class="dash-card-title">رفتار و تعامل کاربران در سایت (قیف تبدیل)</h2>
          </div>
          <div class="dash-card-body">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--space-3);">
              <div style="padding: var(--space-3); border-radius: var(--radius-md); background: var(--surface-alt); border: 1px solid var(--border);">
                <div style="font-size: 0.82rem; color: var(--muted); margin-bottom: 4px;">شروع ثبت سفارش</div>
                <div style="font-size: 1.4rem; font-weight: 700; color: var(--primary);">${toPersianDigits(analytics.funnel?.wizardStart ?? 0)}</div>
                <div style="font-size: 0.75rem; color: var(--muted);">انتخاب نوع خدمت و آغاز فرم</div>
              </div>
              <div style="padding: var(--space-3); border-radius: var(--radius-md); background: var(--surface-alt); border: 1px solid var(--border);">
                <div style="font-size: 0.82rem; color: var(--muted); margin-bottom: 4px;">طی مراحل فرم هوشمند</div>
                <div style="font-size: 1.4rem; font-weight: 700; color: var(--text);">${toPersianDigits(analytics.funnel?.wizardStep ?? 0)}</div>
                <div style="font-size: 0.75rem; color: var(--muted);">پیشروی در مراحل جابه‌جایی</div>
              </div>
              <div style="padding: var(--space-3); border-radius: var(--radius-md); background: var(--surface-alt); border: 1px solid var(--border);">
                <div style="font-size: 0.82rem; color: var(--muted); margin-bottom: 4px;">ثبت نهایی سفارش</div>
                <div style="font-size: 1.4rem; font-weight: 700; color: var(--success);">${toPersianDigits(analytics.funnel?.orders ?? 0)}</div>
                <div style="font-size: 0.75rem; color: var(--muted);">سفارش‌های قطعی ثبت‌شده</div>
              </div>
              <div style="padding: var(--space-3); border-radius: var(--radius-md); background: var(--surface-alt); border: 1px solid var(--border);">
                <div style="font-size: 0.82rem; color: var(--muted); margin-bottom: 4px;">کلیک تماس تلفنی</div>
                <div style="font-size: 1.4rem; font-weight: 700; color: #047857;">${toPersianDigits(analytics.funnel?.callClicks ?? 0)}</div>
                <div style="font-size: 0.75rem; color: var(--muted);">ارتباط مستقیم تلفنی از سایت</div>
              </div>
              <div style="padding: var(--space-3); border-radius: var(--radius-md); background: var(--surface-alt); border: 1px solid var(--border);">
                <div style="font-size: 0.82rem; color: var(--muted); margin-bottom: 4px;">کلیک واتس‌اپ</div>
                <div style="font-size: 1.4rem; font-weight: 700; color: #059669;">${toPersianDigits(analytics.funnel?.whatsappClicks ?? 0)}</div>
                <div style="font-size: 0.75rem; color: var(--muted);">شروع چت پیام‌رسان واتس‌اپ</div>
              </div>
            </div>
          </div>
        </div>

        <div class="dash-charts-grid">
          <div class="dash-card">
            <div class="dash-card-header"><h2 class="dash-card-title">روند بازدید (۱۴ روز اخیر)</h2></div>
            <div class="dash-card-body">${analytics.daily.length ? renderLineChart(analytics.daily.map((d) => ({ label: formatDayLabel(d.day), value: d.count }))) : '<p class="dash-empty">هنوز بازدیدی ثبت نشده است.</p>'}</div>
          </div>
          <div class="dash-card">
            <div class="dash-card-header"><h2 class="dash-card-title">صفحات پربازدید</h2></div>
            <div class="dash-card-body">${analytics.topPages.length ? renderBarChart(analytics.topPages.map((p) => ({ label: p.path, value: p.count }))) : '<p class="dash-empty">داده‌ای وجود ندارد.</p>'}</div>
          </div>
          <div class="dash-card">
            <div class="dash-card-header"><h2 class="dash-card-title">منابع ورودی</h2></div>
            <div class="dash-card-body">${analytics.topReferrers.length ? renderBarChart(analytics.topReferrers.map((r) => ({ label: r.referrer, value: r.count }))) : '<p class="dash-empty">داده‌ای وجود ندارد.</p>'}</div>
          </div>
          <div class="dash-card">
            <div class="dash-card-header"><h2 class="dash-card-title">دستگاه‌ها</h2></div>
            <div class="dash-card-body">${analytics.byDevice.length ? renderBarChart(analytics.byDevice.map((d) => ({ label: DEVICE_LABELS[d.device] ?? d.device, value: d.count }))) : '<p class="dash-empty">داده‌ای وجود ندارد.</p>'}</div>
          </div>
        </div>
      `;
    } catch (err) {
      bodyEl.innerHTML = `<p class="error-text">${err instanceof Error ? err.message : 'دریافت آمار بازدید ناموفق بود.'}</p>`;
    }
  }

  async function renderStaffTab(): Promise<void> {
    if (!bodyEl) return;
    bodyEl.innerHTML = `
      <div class="dash-loading">
        <span class="dash-spinner"></span>
        <span>در حال بارگذاری عملکرد پرسنل...</span>
      </div>
    `;

    try {
      const stats = await fetchStats();

      bodyEl.innerHTML = `
        <div class="dash-card dash-table-card">
          <div class="dash-card-header">
            <h2 class="dash-card-title">عملکرد کارمندان و مأموریت‌های ثبت‌شده</h2>
          </div>
          <div class="dash-table-wrapper">
            <table class="dash-table">
              <thead>
                <tr>
                  <th>نام کارمند</th>
                  <th>نقش سازمانی</th>
                  <th>کل درخواست‌های اختصاص‌یافته</th>
                  <th>سفارش‌های انجام‌شده</th>
                </tr>
              </thead>
              <tbody>
                ${
                  stats.staffPerformance.length
                    ? stats.staffPerformance
                        .map(
                          (s) => `
                    <tr>
                      <td><strong>${escapeHtml(s.name)}</strong></td>
                      <td><span class="dash-service-tag">${escapeHtml(s.role_label)}</span></td>
                      <td>${toPersianDigits(s.total)}</td>
                      <td><strong style="color: var(--success);">${toPersianDigits(s.completed)}</strong></td>
                    </tr>
                  `,
                        )
                        .join('')
                    : '<tr><td colspan="4" class="dash-empty">هنوز درخواستی اختصاص داده نشده است.</td></tr>'
                }
              </tbody>
            </table>
          </div>
        </div>
      `;
    } catch (err) {
      bodyEl.innerHTML = `<p class="error-text">${err instanceof Error ? err.message : 'دریافت عملکرد پرسنل ناموفق بود.'}</p>`;
    }
  }

  function switchTab(tab: DashboardSubTab): void {
    currentTab = tab;
    subnavBtns.forEach((b) => b.classList.toggle('is-active', b.dataset.dashTab === tab));
    if (errorEl) errorEl.hidden = true;

    if (tab === 'overview') void renderOverviewTab();
    else if (tab === 'orders') void renderOrdersTab();
    else if (tab === 'visitors') void renderVisitorsTab();
    else if (tab === 'staff') void renderStaffTab();
  }

  subnavBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.dashTab as DashboardSubTab | undefined;
      if (tab) switchTab(tab);
    });
  });

  refreshBtn?.addEventListener('click', () => {
    switchTab(currentTab);
  });

  switchTab('overview');
}

// ==========================================
// توابع سازگار با گذشته (Backward Compatibility)
// ==========================================

export function renderDashboardOrdersView(): string {
  return renderDashboardView();
}

export function initDashboardOrdersView(): void {
  // Already unified
}

export function renderDashboardVisitorsView(): string {
  return renderDashboardView();
}

export function initDashboardVisitorsView(): void {
  // Already unified
}

export function renderDashboardStaffView(): string {
  return renderDashboardView();
}

export function initDashboardStaffView(): void {
  // Already unified
}


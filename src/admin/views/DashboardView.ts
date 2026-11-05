import { fetchStats, fetchAnalytics, fetchRequests, fetchAdminDashboardKPIs } from '../utils/api.ts';
import { STATUS_LABELS } from '../data/status.ts';
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
// پیشخوان جامع نظارتی Tidewell — بهدون
// ==========================================

export function renderDashboardView(): string {
  return `
    <div class="dash-view">
      <!-- هدر پیشخوان Tidewell -->
      <div class="page-head">
        <div>
          <h1>پیشخوان جامع و مانیتورینگ</h1>
          <p>وضعیت تجمیعی گردش کار، سفارش‌ها و جریان مالی بهدون تا این لحظه</p>
        </div>
        <div class="head-actions">
          <button type="button" class="btn-ghost" id="dash-month-btn">
            <span>آبان ۱۴۰۵</span>
            <span class="icon">${icons.chevronDown}</span>
          </button>
          <button type="button" class="btn-ghost" id="dash-refresh-btn">
            <span class="icon">${icons.refresh}</span>
            <span>به‌روزرسانی داده‌ها</span>
          </button>
        </div>
      </div>

      <!-- بار زیرمنو جهت دسترسی به تحلیل‌های جزئی‌تر -->
      <nav class="dash-subnav" id="dash-subnav" aria-label="بخش‌های پیشخوان">
        <button type="button" class="dash-subnav-btn is-active" data-dash-tab="overview">
          <span class="icon">${icons.chart}</span>
          <span>نمای کلی (Overview)</span>
        </button>
        <button type="button" class="dash-subnav-btn" data-dash-tab="orders">
          <span class="icon">${icons.columns}</span>
          <span>تحلیل تقاضا و سفارش‌ها</span>
        </button>
        <button type="button" class="dash-subnav-btn" data-dash-tab="visitors">
          <span class="icon">${icons.eye}</span>
          <span>پایش ترافیک و مراجعین</span>
        </button>
        <button type="button" class="dash-subnav-btn" data-dash-tab="staff">
          <span class="icon">${icons.users}</span>
          <span>عملکرد تکنسین‌ها</span>
        </button>
      </nav>

      <p class="error-text" id="dash-error" hidden></p>

      <div class="dash-body" id="dash-body">
        <div class="dash-loading">
          <span class="dash-spinner"></span>
          <span>در حال دریافت اطلاعات هوشمند پیشخوان...</span>
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
        <span>در حال پایش اطلاعات عملیات و جریان مالی...</span>
      </div>
    `;

    try {
      const [statsRes, analyticsRes, requestsRes, kpiRes] = await Promise.allSettled([
        fetchStats(),
        fetchAnalytics(),
        fetchRequests(),
        fetchAdminDashboardKPIs(),
      ]);

      const stats = statsRes.status === 'fulfilled' ? statsRes.value : null;
      const analytics = analyticsRes.status === 'fulfilled' ? analyticsRes.value : null;
      const requests = requestsRes.status === 'fulfilled' ? requestsRes.value : [];
      const kpis = kpiRes.status === 'fulfilled' ? kpiRes.value : null;

      const pendingCount = kpis ? kpis.pendingQuotes : (stats?.byStatus?.find((s) => s.status === 'pending')?.count ?? 0);
      const inProgressCount = kpis ? kpis.activeOrders : (stats?.byStatus?.find((s) => s.status === 'in_progress')?.count ?? 0);
      const completedCount = kpis ? kpis.completedOrders : (stats?.byStatus?.find((s) => s.status === 'completed')?.count ?? 0);
      const totalRevenue = kpis ? kpis.platformRevenue : (stats?.completedRevenue ?? 0);

      const recentOrders = requests.slice(0, 7);

      // آماده‌سازی داده‌های نمودار میله‌ای Tidewell
      const dailyData = (stats?.daily && stats.daily.length > 0)
        ? stats.daily.slice(-14)
        : [
            { day: '2026-10-23', count: 12 },
            { day: '2026-10-24', count: 18 },
            { day: '2026-10-25', count: 24 },
            { day: '2026-10-26', count: 15 },
            { day: '2026-10-27', count: 32 },
            { day: '2026-10-28', count: 28 },
            { day: '2026-10-29', count: 42 },
          ];

      const maxDailyCount = Math.max(...dailyData.map((d) => d.count), 1);
      const activeBarIndex = Math.min(dailyData.length - 1, 2); // ستون برجسته

      const html = `
        <!-- ۳ کارت شاخص Tidewell -->
        <section class="stats">
          <!-- کارت ۱: برجسته (Featured) با شیب گرادیان پترول مشبک -->
          <article class="stat featured">
            <div class="stat-top">
              <div class="stat-head">
                <div class="stat-icon">${icons.wallet}</div>
                <div>
                  <h3>گردش کل و درآمد عملیاتی</h3>
                  <p class="sub">تسویه سفارش‌ها و تراکنش‌های انجام‌شده</p>
                </div>
              </div>
              <button type="button" class="more" aria-label="گزینه‌ها" data-dash-nav="finance">${icons.dotsHorizontal}</button>
              <div class="stat-amount">
                <span class="value">${formatToman(totalRevenue)}</span>
                <span class="delta">+۱۲.۴٪ <span class="icon">${icons.arrowUp}</span></span>
              </div>
            </div>
            <div class="stat-foot" data-dash-nav="finance" role="button" tabindex="0">
              <span>مشاهده گزارش‌های مالی و تسویه</span>
              <span class="icon">${icons.arrowLeft}</span>
            </div>
          </article>

          <!-- کارت ۲: سفارش‌های در حال اقدام -->
          <article class="stat">
            <div class="stat-top">
              <div class="stat-head">
                <div class="stat-icon">${icons.columns}</div>
                <div>
                  <h3>سفارش‌های در حال اقدام</h3>
                  <p class="sub">اعزام فوری تکنسین در ۲۲ منطقه تهران</p>
                </div>
              </div>
              <button type="button" class="more" aria-label="گزینه‌ها" data-dash-nav="pipeline">${icons.dotsHorizontal}</button>
              <div class="stat-amount">
                <span class="value">${toPersianDigits(inProgressCount)} <span style="font-size:0.95rem;font-weight:500;">خدمت فعال</span></span>
                <span class="delta">${toPersianDigits(pendingCount)} در انتظار</span>
              </div>
            </div>
            <div class="stat-foot" data-dash-nav="pipeline" role="button" tabindex="0">
              <span>مشاهده مراحل در پایپ‌لاین</span>
              <span class="icon">${icons.arrowLeft}</span>
            </div>
          </article>

          <!-- کارت ۳: خدمات انجام‌شده با ضمانت کیفیت -->
          <article class="stat">
            <div class="stat-top">
              <div class="stat-head">
                <div class="stat-icon">${icons.checkCircle}</div>
                <div>
                  <h3>خدمات انجام‌شده با ضمانت</h3>
                  <p class="sub">اتمام خدمت با ۱۰۰٪ رضایت و ضمانت کتبی</p>
                </div>
              </div>
              <button type="button" class="more" aria-label="گزینه‌ها" data-dash-nav="staff">${icons.dotsHorizontal}</button>
              <div class="stat-amount">
                <span class="value">${toPersianDigits(completedCount)} <span style="font-size:0.95rem;font-weight:500;">سفارش</span></span>
                <span class="delta">۱۰۰٪ تضمین</span>
              </div>
            </div>
            <div class="stat-foot" data-dash-nav="staff" role="button" tabindex="0">
              <span>پایش عملکرد تکنسین‌ها</span>
              <span class="icon">${icons.arrowLeft}</span>
            </div>
          </article>
        </section>

        <!-- بخش ۲ ستونه Tidewell: کیف‌پول‌ها/حوزه‌های خدمات و نمودار تقاضا -->
        <section class="split">
          <!-- پنل راست (RTL): حوزه‌های تخصصی خدمات (Currency Wallets equivalent) -->
          <article class="panel">
            <div class="panel-head">
              <div>
                <h2>حوزه‌های تخصصی خدمات</h2>
                <p class="muted">پوشش لحظه‌ای تقاضا در ۲۲ منطقه تهران</p>
              </div>
              <button type="button" class="btn-pill" data-dash-nav="services">
                <span class="icon">${icons.wrench}</span>
                <span>مدیریت خدمات</span>
              </button>
            </div>

            <div class="wallets">
              <div class="wallet">
                <div class="wallet-head">
                  <span class="wallet-icon flame">${icons.flame}</span>
                  <span>سرمایش و گرمایش</span>
                  <button type="button" aria-label="بیشتر" data-dash-nav="services">${icons.dotsVertical}</button>
                </div>
                <p class="amt">${toPersianDigits(35)}٪ <span style="font-size:0.75rem;font-weight:500;">سهم تقاضا</span></p>
                <p class="limit">پکیج، چیلر، رادیاتور</p>
                <span class="state">فعال و آماده اعزام</span>
              </div>

              <div class="wallet">
                <div class="wallet-head">
                  <span class="wallet-icon water">${icons.droplet}</span>
                  <span>آب و فاضلاب</span>
                  <button type="button" aria-label="بیشتر" data-dash-nav="services">${icons.dotsVertical}</button>
                </div>
                <p class="amt">${toPersianDigits(28)}٪ <span style="font-size:0.75rem;font-weight:500;">سهم تقاضا</span></p>
                <p class="limit">اعزام فوری ۲۰ دقیقه‌ای</p>
                <span class="state">فعال و آماده اعزام</span>
              </div>

              <div class="wallet">
                <div class="wallet-head">
                  <span class="wallet-icon zap">${icons.zap}</span>
                  <span>برق و هوشمند</span>
                  <button type="button" aria-label="بیشتر" data-dash-nav="services">${icons.dotsVertical}</button>
                </div>
                <p class="amt">${toPersianDigits(22)}٪ <span style="font-size:0.75rem;font-weight:500;">سهم تقاضا</span></p>
                <p class="limit">سیم‌کشی و آیفون تصویری</p>
                <span class="state">فعال و آماده اعزام</span>
              </div>

              <div class="wallet">
                <div class="wallet-head">
                  <span class="wallet-icon wrench">${icons.wrench}</span>
                  <span>سرویس‌های دوره‌ای</span>
                  <button type="button" aria-label="بیشتر" data-dash-nav="services">${icons.dotsVertical}</button>
                </div>
                <p class="amt">${toPersianDigits(15)}٪ <span style="font-size:0.75rem;font-weight:500;">سهم تقاضا</span></p>
                <p class="limit">قراردادهای دوره‌ای مجتمع‌ها</p>
                <span class="state">فعال و آماده اعزام</span>
              </div>
            </div>
          </article>

          <!-- پنل چپ (RTL): نمودار میله‌ای جریان مالی و تقاضا (Cash Flow Chart) -->
          <article class="panel cash">
            <div class="cash-head">
              <div>
                <p class="label">جریان درآمدی و تقاضای کل (۱۴ روز اخیر)</p>
                <p class="total">${formatToman(totalRevenue)}</p>
              </div>
              <div class="seg" role="tablist">
                <button type="button" role="tab" class="on">روزانه</button>
                <button type="button" role="tab" data-dash-nav="finance">ماهانه</button>
              </div>
            </div>

            <div class="chart">
              <div class="y-axis" aria-hidden="true">
                <span>${toPersianDigits(50)}k</span>
                <span>${toPersianDigits(40)}k</span>
                <span>${toPersianDigits(30)}k</span>
                <span>${toPersianDigits(20)}k</span>
                <span>${toPersianDigits(10)}k</span>
                <span>۰</span>
              </div>

              <div class="plot">
                ${dailyData
                  .map((item, idx) => {
                    const heightPercent = Math.min(95, Math.max(18, Math.round((item.count / maxDailyCount) * 90)));
                    const isActive = idx === activeBarIndex;
                    return `
                      <div class="bar ${isActive ? 'active' : ''}" style="height:${heightPercent}%" title="${formatDayLabel(item.day)}: ${toPersianDigits(item.count)} تقاضا">
                        ${
                          isActive
                            ? `
                          <span class="dot"></span>
                          <div class="tip">
                            <span class="date">${formatDayLabel(item.day)} - نقطه اوج تقاضا</span>
                            <dl>
                              <dt>کل درخواست‌ها</dt><dd>${toPersianDigits(item.count)} سفارش</dd>
                              <dt>کاربران آنلاین</dt><dd>${toPersianDigits(analytics?.activeOnline ?? 14)} فعال</dd>
                              <dt>تضمین کیفیت</dt><dd>ضمانت کتبی</dd>
                            </dl>
                          </div>
                        `
                            : ''
                        }
                      </div>
                    `;
                  })
                  .join('')}
              </div>

              <div class="x-axis" aria-hidden="true">
                ${dailyData.map((item) => `<span>${formatDayLabel(item.day)}</span>`).join('')}
              </div>
            </div>
          </article>
        </section>

        <!-- پنل جدول فعالیت‌های اخیر (Status-Dot Table) -->
        <section class="panel activities">
          <div class="act-head">
            <h2>فعالیت‌های اخیر و آخرین سفارش‌ها</h2>
            <div class="act-search">
              <span class="icon">${icons.search}</span>
              <input type="text" id="dash-order-search" placeholder="جستجوی سفارش‌ها و پرداخت‌ها..." />
            </div>
            <button type="button" class="act-filter" data-dash-nav="pipeline">
              <span class="icon">${icons.filter}</span>
              <span>فیلتر</span>
            </button>
          </div>

          <div class="table-wrap">
            <table class="tidewell-table">
              <thead>
                <tr>
                  <th style="width: 44px; text-align: center;"><input type="checkbox" style="cursor: pointer;" aria-label="انتخاب همه" /></th>
                  <th>فعالیت و نام متقاضی</th>
                  <th>کد رهگیری</th>
                  <th>تاریخ ثبت</th>
                  <th>موقعیت</th>
                  <th>برآورد هزینه</th>
                  <th>وضعیت سفارش</th>
                  <th style="width: 44px;"></th>
                </tr>
              </thead>
              <tbody>
                ${
                  recentOrders.length === 0
                    ? `
                  <tr>
                    <td colspan="8" class="dash-empty">هنوز سفارشی در سامانه بهدون ثبت نشده است.</td>
                  </tr>
                `
                    : recentOrders
                        .map((order) => {
                          const statusLabel = STATUS_LABELS[order.status] ?? order.status;
                          let statusDotClass = 'status-dot-cell';
                          if (order.status === 'pending') statusDotClass += ' pending';
                          else if (order.status === 'in_progress') statusDotClass += ' in-progress';
                          else if (order.status === 'canceled') statusDotClass += ' failed';

                          let iconSvg = icons.wrench;
                          let logoBg = '#e5f1ea';
                          let logoColor = '#23805a';

                          const serviceLower = (order.serviceLabel || '').toLowerCase();
                          if (serviceLower.includes('پکیج') || serviceLower.includes('گرمایش') || serviceLower.includes('سرمایش')) {
                            iconSvg = icons.flame;
                            logoBg = '#fbe7e1';
                            logoColor = '#c4452f';
                          } else if (serviceLower.includes('لوله') || serviceLower.includes('آب') || serviceLower.includes('فاضلاب')) {
                            iconSvg = icons.droplet;
                            logoBg = '#e2eff2';
                            logoColor = '#0d5c72';
                          } else if (serviceLower.includes('برق') || serviceLower.includes('روشنایی')) {
                            iconSvg = icons.zap;
                            logoBg = '#fef3c7';
                            logoColor = '#b45309';
                          }

                          return `
                        <tr>
                          <td style="text-align: center;"><input type="checkbox" style="cursor: pointer;" aria-label="انتخاب سفارش" /></td>
                          <td>
                            <div class="act">
                              <span class="act-logo" style="background:${logoBg}; color:${logoColor};">
                                ${iconSvg}
                              </span>
                              <div class="act-title-col">
                                <span class="act-title">${escapeHtml(order.customerName || 'مشتری محترم')}</span>
                                <span class="act-sub">${escapeHtml(order.serviceLabel || 'خدمات ساختمانی')}</span>
                              </div>
                            </div>
                          </td>
                          <td><span class="act-ref">${escapeHtml(order.trackingCode)}</span></td>
                          <td>${toPersianDigits(order.createdAt ? order.createdAt.split('T')[0] : 'امروز')}</td>
                          <td>${escapeHtml(order.originCity || 'تهران')}</td>
                          <td><strong>${order.estimateAvg ? formatToman(order.estimateAvg) : 'توافقی'}</strong></td>
                          <td>
                            <span class="${statusDotClass}">${statusLabel}</span>
                          </td>
                          <td class="menu-cell">
                            <button type="button" class="menu-btn" data-dash-nav="pipeline" title="مشاهده جزئیات سفارش" aria-label="مشاهده در پایپ‌لاین">
                              ${icons.dotsHorizontal}
                            </button>
                          </td>
                        </tr>
                      `;
                        })
                        .join('')
                }
              </tbody>
            </table>
          </div>
        </section>
      `;

      bodyEl.innerHTML = html;

      // جستجوی برخط در جدول سفارش‌ها
      const searchInput = document.getElementById('dash-order-search') as HTMLInputElement | null;
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          const query = (e.target as HTMLInputElement).value.toLowerCase().trim();
          const rows = bodyEl.querySelectorAll<HTMLTableRowElement>('.tidewell-table tbody tr');
          rows.forEach((row) => {
            const text = row.innerText.toLowerCase();
            row.style.display = text.includes(query) ? '' : 'none';
          });
        });
      }

      // ناوبری هوشمند با دکمه‌ها
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
        <div class="stats" style="margin-bottom: 24px;">
          <div class="stat">
            <div class="stat-top">
              <span class="sub">کل درخواست‌ها</span>
              <span class="value" style="font-size:2rem; margin-top:12px;">${toPersianDigits(stats.total)}</span>
            </div>
          </div>
          <div class="stat">
            <div class="stat-top">
              <span class="sub">خدمات در حال انجام</span>
              <span class="value" style="font-size:2rem; margin-top:12px; color: var(--primary);">${toPersianDigits(inProgress)}</span>
            </div>
          </div>
          <div class="stat">
            <div class="stat-top">
              <span class="sub">سفارش‌های پایان‌یافته</span>
              <span class="value" style="font-size:2rem; margin-top:12px; color: var(--positive);">${toPersianDigits(completed)}</span>
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
          <div class="panel">
            <h3 style="margin-top:0; font-size:1.1rem; color:var(--ink);">روند درخواست‌ها (۱۴ روز اخیر)</h3>
            ${renderLineChart(stats.daily.map((d) => ({ label: formatDayLabel(d.day), value: d.count })))}
          </div>
          <div class="panel">
            <h3 style="margin-top:0; font-size:1.1rem; color:var(--ink);">وضعیت درخواست‌ها</h3>
            ${renderBarChart(stats.byStatus.map((s) => ({ label: STATUS_LABELS[s.status] ?? s.status, value: s.count })))}
          </div>
          <div class="panel">
            <h3 style="margin-top:0; font-size:1.1rem; color:var(--ink);">نوع خدمات پرتقاضا</h3>
            ${renderBarChart(stats.byService.map((s) => ({ label: s.service_label, value: s.count })))}
          </div>
          <div class="panel">
            <h3 style="margin-top:0; font-size:1.1rem; color:var(--ink);">مناطق پرتقاضای تهران</h3>
            ${stats.topCities.length ? renderBarChart(stats.topCities.map((c) => ({ label: c.city, value: c.count }))) : '<p class="dash-empty">داده‌ای ثبت نشده است.</p>'}
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
        <div class="stats" style="margin-bottom: 24px;">
          <div class="stat featured">
            <div class="stat-top">
              <span class="sub">کاربران آنلاین لحظه‌ای</span>
              <span class="value" style="font-size:2.2rem; margin-top:10px;">${toPersianDigits(analytics.activeOnline ?? 0)}</span>
              <span class="sub" style="margin-top:4px;">فعال در ۱۵ دقیقه گذشته</span>
            </div>
          </div>
          <div class="stat">
            <div class="stat-top">
              <span class="sub">بازدید امروز</span>
              <span class="value" style="font-size:2rem; margin-top:10px;">${toPersianDigits(analytics.todayViews ?? 0)}</span>
              <span class="sub" style="margin-top:4px;">${toPersianDigits(analytics.todayVisitors ?? 0)} بازدیدکننده یکتا</span>
            </div>
          </div>
          <div class="stat">
            <div class="stat-top">
              <span class="sub">نرخ تبدیل به سفارش</span>
              <span class="value" style="font-size:2rem; margin-top:10px; color:var(--positive);">${toPersianDigits(analytics.conversionRate ?? 0)}٪</span>
              <span class="sub" style="margin-top:4px;">نسبت سفارش به مراجعین</span>
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
          <div class="panel">
            <h3 style="margin-top:0; font-size:1.1rem; color:var(--ink);">روند بازدید (۱۴ روز اخیر)</h3>
            ${analytics.daily.length ? renderLineChart(analytics.daily.map((d) => ({ label: formatDayLabel(d.day), value: d.count }))) : '<p class="dash-empty">هنوز بازدیدی ثبت نشده است.</p>'}
          </div>
          <div class="panel">
            <h3 style="margin-top:0; font-size:1.1rem; color:var(--ink);">صفحات پربازدید</h3>
            ${analytics.topPages.length ? renderBarChart(analytics.topPages.map((p) => ({ label: p.path, value: p.count }))) : '<p class="dash-empty">داده‌ای وجود ندارد.</p>'}
          </div>
          <div class="panel">
            <h3 style="margin-top:0; font-size:1.1rem; color:var(--ink);">دستگاه‌های کاربران</h3>
            ${analytics.byDevice.length ? renderBarChart(analytics.byDevice.map((d) => ({ label: DEVICE_LABELS[d.device] ?? d.device, value: d.count }))) : '<p class="dash-empty">داده‌ای وجود ندارد.</p>'}
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
        <div class="panel activities">
          <div class="panel-head" style="margin-bottom: 16px;">
            <div>
              <h2>عملکرد تکنسین‌ها و مأموریت‌های ثبت‌شده</h2>
              <p class="muted">پایش نرخ موفقیت و تکمیل مأموریت‌های خدمات در تهران</p>
            </div>
          </div>
          <div class="table-wrap">
            <table class="tidewell-table">
              <thead>
                <tr>
                  <th>نام تکنسین / همکار</th>
                  <th>نقش و حوزه تخصص</th>
                  <th>کل مأموریت‌های اختصاص‌یافته</th>
                  <th>سفارش‌های انجام‌شده</th>
                  <th>ضمانت کیفیت</th>
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
                      <td><span class="act-ref">${escapeHtml(s.role_label)}</span></td>
                      <td>${toPersianDigits(s.total)} مأموریت</td>
                      <td><strong style="color: var(--positive);">${toPersianDigits(s.completed)} خدمت</strong></td>
                      <td><span class="status-dot-cell">۱۰۰٪ گارانتی</span></td>
                    </tr>
                  `,
                        )
                        .join('')
                    : '<tr><td colspan="5" class="dash-empty">هنوز مأموریتی اختصاص داده نشده است.</td></tr>'
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

// توابع سازگار با نسخه‌های قبل
export function renderDashboardOrdersView(): string {
  return renderDashboardView();
}
export function initDashboardOrdersView(): void {}
export function renderDashboardVisitorsView(): string {
  return renderDashboardView();
}
export function initDashboardVisitorsView(): void {}
export function renderDashboardStaffView(): string {
  return renderDashboardView();
}
export function initDashboardStaffView(): void {}

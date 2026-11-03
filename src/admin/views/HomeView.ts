import { icons } from '../components/icons.ts';
import type { StaffInfo } from '../utils/auth.ts';
import { hasPermission } from '../utils/auth.ts';

interface TileData {
  view: string;
  icon: string;
  title: string;
  desc: string;
  badge?: string;
  badgeClass?: string;
}

function renderTile(tile: TileData): string {
  return `
    <button type="button" class="op-command-card" data-home-tile="${tile.view}" title="${tile.title}">
      <div class="op-card-header">
        <div class="op-card-icon-wrap">
          <span class="icon">${tile.icon}</span>
        </div>
        ${tile.badge ? `<span class="op-card-badge ${tile.badgeClass || ''}">${tile.badge}</span>` : ''}
      </div>
      <div class="op-card-body">
        <h4 class="op-card-title">${tile.title}</h4>
        <p class="op-card-desc">${tile.desc}</p>
      </div>
      <div class="op-card-footer">
        <span class="op-card-action">ورود به بخش</span>
        <span class="op-card-arrow">${icons.arrowLeft}</span>
      </div>
    </button>
  `;
}

// مرکز فرماندهی بهدون (Mission Control & OpenDesign Command Center)
export function renderHomeView(staff: StaffInfo): string {
  const showContent =
    hasPermission(staff, 'content') ||
    hasPermission(staff, 'stories') ||
    hasPermission(staff, 'seo') ||
    hasPermission(staff, 'settings');
  const showPersonnel =
    hasPermission(staff, 'staff') ||
    hasPermission(staff, 'recruitment') ||
    hasPermission(staff, 'roles') ||
    hasPermission(staff, 'wallet');
  const showSettings = hasPermission(staff, 'settings') || hasPermission(staff, 'homepage');
  const showRequests = hasPermission(staff, 'pipeline') || hasPermission(staff, 'map');
  const showFinance =
    hasPermission(staff, 'dashboard') ||
    hasPermission(staff, 'wallet') ||
    hasPermission(staff, 'roles') ||
    hasPermission(staff, 'staff');

  return `
    <div class="op-command-center">
      <!-- هدر خوش‌آمدگویی و بنر وضعیت -->
      <section class="op-hero-banner">
        <div class="op-hero-content">
          <div class="op-hero-pill">
            <span class="op-pulse-dot"></span>
            <span>سامانه یکپارچه مدیریت بهدون</span>
          </div>
          <h2 class="op-hero-title">سلام، ${staff.fullName} عزیز 👋</h2>
          <p class="op-hero-subtitle">
            به مرکز کنترل و مانیتورینگ خدمات ساختمانی بهدون خوش آمدید. تمامی درخواست‌ها، سفارش‌ها، تکنسین‌ها و گزارش‌های عملکرد به صورت هوشمند و زنده در دسترس شماست.
          </p>
          <div class="op-hero-status-tags">
            <span class="op-status-tag tag-success">
              <span class="icon">${icons.checkCircle}</span>
              <span>سیستم پایدار و آنلاین</span>
            </span>
            <span class="op-status-tag tag-ai">
              <span class="icon">${icons.ai}</span>
              <span>دستیار هوش مصنوعی آماده</span>
            </span>
            <span class="op-status-tag tag-neutral">
              <span class="icon">${icons.shield}</span>
              <span>امنیت فعال و رمزنگاری‌شده</span>
            </span>
          </div>
        </div>

        <div class="op-hero-quick-actions">
          <button type="button" class="op-quick-cta" data-home-tile="pipeline">
            <span class="icon">${icons.columns}</span>
            <div class="cta-texts">
              <span class="cta-title">مراحل سفارش‌ها</span>
              <span class="cta-sub">مشاهده و انتقال کارت‌ها</span>
            </div>
          </button>
          <button type="button" class="op-quick-cta" data-home-tile="ai">
            <span class="icon">${icons.sparkles}</span>
            <div class="cta-texts">
              <span class="cta-title">گفتگو با هوشواره</span>
              <span class="cta-sub">تحلیل و مشاوره هوشمند</span>
            </div>
          </button>
        </div>
      </section>

      <!-- کارت‌های شاخص‌های کلیدی (KPIs) -->
      <section class="op-kpi-grid">
        <div class="op-kpi-card" data-home-tile="pipeline" role="button" tabindex="0">
          <div class="kpi-icon-wrap icon-violet">
            <span class="icon">${icons.columns}</span>
          </div>
          <div class="kpi-info">
            <span class="kpi-label">مراحل و وضعیت سفارش‌ها</span>
            <h3 class="kpi-value">پایپ‌لاین فعال</h3>
            <span class="kpi-trend trend-positive">مدیریت کارت‌ها به تفکیک مرحله</span>
          </div>
        </div>

        <div class="op-kpi-card" data-home-tile="dashboard" role="button" tabindex="0">
          <div class="kpi-icon-wrap icon-emerald">
            <span class="icon">${icons.chart}</span>
          </div>
          <div class="kpi-info">
            <span class="kpi-label">گزارشات و تحلیل جامع</span>
            <h3 class="kpi-value">داشبورد آمار</h3>
            <span class="kpi-trend trend-positive">نمودار سفارش‌ها و بازدیدها</span>
          </div>
        </div>

        <div class="op-kpi-card" data-home-tile="staff" role="button" tabindex="0">
          <div class="kpi-icon-wrap icon-amber">
            <span class="icon">${icons.users}</span>
          </div>
          <div class="kpi-info">
            <span class="kpi-label">تکنسین‌ها و پرسنل</span>
            <h3 class="kpi-value">مدیریت متخصصین</h3>
            <span class="kpi-trend trend-neutral">نظارت بر عملکرد و اعزام</span>
          </div>
        </div>

        <div class="op-kpi-card" data-home-tile="chat" role="button" tabindex="0">
          <div class="kpi-icon-wrap icon-cyan">
            <span class="icon">${icons.chat}</span>
          </div>
          <div class="kpi-info">
            <span class="kpi-label">ارتباط آنلاین با مشتریان</span>
            <h3 class="kpi-value">چت پشتیبانی</h3>
            <span class="kpi-trend trend-positive">پاسخگویی لحظه‌ای به مراجعین</span>
          </div>
        </div>
      </section>

      <!-- شبکه‌ی دسته‌بندی‌شده کارت‌های دسترسی سریع (Command Categories) -->
      <div class="op-sections-stack">
        <!-- دسته ۱: پیشخوان و عملیات -->
        <div class="op-category-block">
          <div class="op-block-header">
            <div class="op-block-title-wrap">
              <span class="op-block-icon">${icons.layers}</span>
              <h3 class="op-block-title">عملیات، مانیتورینگ و سفارش‌ها</h3>
            </div>
            <span class="op-block-count">بخش‌های عملیاتی</span>
          </div>
          <div class="op-cards-grid">
            ${renderTile({
              view: 'dashboard',
              icon: icons.chart,
              title: 'داشبورد تحلیلی',
              desc: 'مشاهده نمودارهای مالی، نرخ تبدیل و آمار لحظه‌ای کل سامانه',
              badge: 'تحلیلی',
              badgeClass: 'badge-primary',
            })}
            ${
              showRequests
                ? renderTile({
                    view: 'pipeline',
                    icon: icons.columns,
                    title: 'مراحل سفارش‌ها (پایپ‌لاین)',
                    desc: 'کنترل چرخه عمر درخواست‌ها از ثبت اولیه تا پایان و صدور فاکتور',
                    badge: 'زنده',
                    badgeClass: 'badge-live',
                  })
                : ''
            }
            ${
              showRequests
                ? renderTile({
                    view: 'map',
                    icon: icons.map,
                    title: 'نقشه هوشمند درخواست‌ها',
                    desc: 'موقعیت مکانی پروژه‌ها، تراکم محله‌های تهران و اعزام نزدیک‌ترین متخصص',
                  })
                : ''
            }
            ${
              showSettings || showContent
                ? renderTile({
                    view: 'services',
                    icon: icons.wrench,
                    title: 'مدیریت خدمات و دسته‌ها',
                    desc: 'تعریف خدمات ساختمانی جدید، برآورد هزینه‌ها، توضیحات و گارانتی‌ها',
                  })
                : ''
            }
          </div>
        </div>

        <!-- دسته ۲: محتوا، ارتباطات و تعامل -->
        ${
          showContent || hasPermission(staff, 'chat')
            ? `
          <div class="op-category-block">
            <div class="op-block-header">
              <div class="op-block-title-wrap">
                <span class="op-block-icon">${icons.message}</span>
                <h3 class="op-block-title">محتوا، مجله و ارتباط با کاربران</h3>
              </div>
              <span class="op-block-count">تولید محتوا و ارتباطات</span>
            </div>
            <div class="op-cards-grid">
              ${
                hasPermission(staff, 'chat')
                  ? renderTile({
                      view: 'chat',
                      icon: icons.chat,
                      title: 'چت و پشتیبانی آنلاین',
                      desc: 'گفتگوی دوطرفه مستقیم با مراجعین سایت و راهنمایی سریع',
                      badge: 'فعال',
                      badgeClass: 'badge-info',
                    })
                  : ''
              }
              ${
                hasPermission(staff, 'content')
                  ? renderTile({
                      view: 'magazine',
                      icon: icons.article,
                      title: 'مجله و مقالات تخصصی',
                      desc: 'انتشار مقالات سئو، نکات آموزشی ساختمان و افزایش ورودی گوگل',
                    })
                  : ''
              }
              ${
                hasPermission(staff, 'stories')
                  ? renderTile({
                      view: 'stories',
                      icon: icons.story,
                      title: 'استوری‌های تصویری',
                      desc: 'نمایش ویدیوها و تصاویر نمونه‌کارهای اجرا شده در بالای سایت',
                    })
                  : ''
              }
              ${
                hasPermission(staff, 'content')
                  ? renderTile({
                      view: 'testimonials',
                      icon: icons.message,
                      title: 'نظرات و رضایت مشتریان',
                      desc: 'بررسی و تایید دیدگاه‌های ثبت‌شده کارفرمایان و ارزیابی کیفیت',
                    })
                  : ''
              }
              ${
                showSettings
                  ? renderTile({
                      view: 'contact-manager',
                      icon: icons.phone,
                      title: 'ارتباطات و شبکه‌های اجتماعی',
                      desc: 'تنظیم شماره‌های تماس اضطراری، ساعات کاری و آدرس شعب',
                    })
                  : ''
              }
            </div>
          </div>
        `
            : ''
        }

        <!-- دسته ۳: پرسنل، کارمندان و مالی -->
        ${
          showPersonnel || showFinance
            ? `
          <div class="op-category-block">
            <div class="op-block-header">
              <div class="op-block-title-wrap">
                <span class="op-block-icon">${icons.users}</span>
                <h3 class="op-block-title">پرسنل، استخدام و امور مالی</h3>
              </div>
              <span class="op-block-count">تیم و حسابداری</span>
            </div>
            <div class="op-cards-grid">
              ${
                hasPermission(staff, 'staff')
                  ? renderTile({
                      view: 'staff',
                      icon: icons.users,
                      title: 'تکنسین‌ها و همکاران',
                      desc: 'فهرست کارمندان و متخصصین فنی، سوابق تسویه و اطلاعات تماس',
                    })
                  : ''
              }
              ${
                hasPermission(staff, 'recruitment')
                  ? renderTile({
                      view: 'jobApplications',
                      icon: icons.briefcase,
                      title: 'فرصت‌های شغلی و استخدام',
                      desc: 'بررسی فرم‌های ثبت‌نامی متخصصین جدید و مصاحبه همکاری',
                      badge: 'جذب',
                      badgeClass: 'badge-emerald',
                    })
                  : ''
              }
              ${
                showFinance
                  ? renderTile({
                      view: 'finance',
                      icon: icons.finance,
                      title: 'مدیریت مالی و تراکنش‌ها',
                      desc: 'گزارش سود و زیان، تراکنش‌های پرداخت آنلاین و مانده‌حساب‌ها',
                    })
                  : ''
              }
              ${
                hasPermission(staff, 'roles')
                  ? renderTile({
                      view: 'roles',
                      icon: icons.lock,
                      title: 'نقش‌ها و اختیارات دسترسی',
                      desc: 'تعریف نقش‌های کاربری، کنترل سطح دسترسی به بخش‌های مختلف پنل',
                    })
                  : ''
              }
              ${
                hasPermission(staff, 'wallet')
                  ? renderTile({
                      view: 'payroll',
                      icon: icons.wallet,
                      title: 'حقوق و تسویه‌حساب',
                      desc: 'محاسبه دستمزد تکنسین‌ها، کارمزدها و فیش‌های تسویه دوره‌ای',
                    })
                  : ''
              }
            </div>
          </div>
        `
            : ''
        }

        <!-- دسته ۴: سامانه، هوش مصنوعی و تنظیمات زیرساخت -->
        <div class="op-category-block">
          <div class="op-block-header">
            <div class="op-block-title-wrap">
              <span class="op-block-icon">${icons.settings}</span>
              <h3 class="op-block-title">هوش مصنوعی، سئو و تنظیمات سامانه</h3>
            </div>
            <span class="op-block-count">پیکربندی کلان</span>
          </div>
          <div class="op-cards-grid">
            ${renderTile({
              view: 'ai',
              icon: icons.ai,
              title: 'هوشواره هوشمند بهدون',
              desc: 'دستیار خودکار هوش مصنوعی برای تحلیل درخواست‌ها و پیشنهاد استراتژی',
              badge: 'AI Pro',
              badgeClass: 'badge-ai',
            })}
            ${
              showSettings
                ? renderTile({
                    view: 'settings',
                    icon: icons.settings,
                    title: 'تنظیمات کلی سامانه',
                    desc: 'عنوان سایت، رنگ‌بندی تم، اطلاعات حقوقی، پیامک و تنظیمات پایه',
                  })
                : ''
            }
            ${
              hasPermission(staff, 'seo')
                ? renderTile({
                    view: 'seo',
                    icon: icons.seo,
                    title: 'مدیریت سئو و اسکیمای گوگل',
                    desc: 'بررسی رتبه کلمات کلیدی، فایل sitemap.xml و بهینه‌سازی موتورهای جستجو',
                  })
                : ''
            }
            ${
              hasPermission(staff, 'plugins')
                ? renderTile({
                    view: 'plugins',
                    icon: icons.plugin,
                    title: 'افزونه‌ها و اتصالات خارجی',
                    desc: 'درگاه‌های پرداخت، وب‌سرویس پیامکی کاوه‌نگار و وب‌هوک‌ها',
                  })
                : ''
            }
            ${
              hasPermission(staff, 'staff') || hasPermission(staff, 'roles')
                ? renderTile({
                    view: 'activityLog',
                    icon: icons.history,
                    title: 'گزارش لاگ و فعالیت‌ها',
                    desc: 'ثبت رویدادهای سیستمی، لاگین کاربران و تغییرات برای حسابرسی امنیتی',
                  })
                : ''
            }
          </div>
        </div>
      </div>
    </div>
  `;
}

// زیرمجموعه‌ی «درخواست‌ها»
export function renderRequestsHomeView(staff: StaffInfo): string {
  const tiles: string[] = [];
  if (hasPermission(staff, 'pipeline')) {
    tiles.push(
      renderTile({
        view: 'pipeline',
        icon: icons.columns,
        title: 'مراحل و جریان درخواست‌ها',
        desc: 'مشاهده ستون‌های پایپ‌لاین، جابجایی کارت‌های وضعیت و کنترل اعزام تکنسین',
        badge: 'زنده',
        badgeClass: 'badge-live',
      })
    );
  }
  if (hasPermission(staff, 'map')) {
    tiles.push(
      renderTile({
        view: 'map',
        icon: icons.map,
        title: 'نقشه جغرافیایی سفارش‌ها',
        desc: 'مشاهده موقعیت مکانی پروژه‌های ساختمانی در سطح شهر تهران روی نقشه تعاملی',
      })
    );
  }
  return `
    <div class="op-subview-wrapper">
      <div class="op-subview-header">
        <h3 class="op-subview-title">مدیریت و پیگیری درخواست‌ها</h3>
        <p class="op-subview-desc">بخش‌های مرتبط با گردش کار و مسیریابی سفارش‌های مشتریان</p>
      </div>
      <div class="op-cards-grid">${tiles.join('')}</div>
    </div>
  `;
}

// زیرمجموعه‌ی «مدیریت محتوا»
export function renderContentHomeView(staff: StaffInfo): string {
  const tiles: string[] = [];
  if (hasPermission(staff, 'content')) {
    tiles.push(
      renderTile({
        view: 'magazine',
        icon: icons.article,
        title: 'مجله و وبلاگ تخصصی',
        desc: 'نوشتن و ویرایش مقالات، درج برچسب‌ها و جذب ترافیک ارگانیک',
      })
    );
    tiles.push(
      renderTile({
        view: 'testimonials',
        icon: icons.message,
        title: 'دیدگاه‌ها و رضایت کارفرمایان',
        desc: 'مدیریت نظرات منتشر شده و امتیازدهی به کیفیت انجام خدمات',
      })
    );
  }
  if (hasPermission(staff, 'stories')) {
    tiles.push(
      renderTile({
        view: 'stories',
        icon: icons.story,
        title: 'استوری‌های تعاملی',
        desc: 'ویدیوها و تصاویر قبل/بعد از پروژه برای نمایش در صفحه اصلی',
      })
    );
  }
  if (hasPermission(staff, 'content') || hasPermission(staff, 'settings')) {
    tiles.push(
      renderTile({
        view: 'sliders',
        icon: icons.image,
        title: 'اسلایدر و بنرها',
        desc: 'تنظیم بنرهای گرافیکی دسکتاپ و موبایل همراه با لینک مقصد',
      })
    );
    tiles.push(
      renderTile({
        view: 'media',
        icon: icons.image,
        title: 'مدیریت فایل و رسانه‌ها',
        desc: 'آپلود تصاویر، آیکون‌ها و مدیریت فضای ذخیره‌سازی رسانه‌ای',
      })
    );
  }
  if (hasPermission(staff, 'seo')) {
    tiles.push(
      renderTile({
        view: 'seo',
        icon: icons.seo,
        title: 'مدیریت سئو و متادیتا',
        desc: 'تنظیم تایتل، دیسکریپشن و اسکیمای ساختاریافته گوگل برای تمام صفحات',
      })
    );
  }
  return `
    <div class="op-subview-wrapper">
      <div class="op-subview-header">
        <h3 class="op-subview-title">مدیریت محتوا و وب‌سایت</h3>
        <p class="op-subview-desc">ابزارهای انتشار مقالات، رسانه‌ها، دیدگاه‌ها و بهینه‌سازی ظاهر سایت</p>
      </div>
      <div class="op-cards-grid">${tiles.join('')}</div>
    </div>
  `;
}

// زیرمجموعه‌ی «مدیریت پرسنل»
export function renderPersonnelHomeView(staff: StaffInfo): string {
  const tiles: string[] = [];
  if (hasPermission(staff, 'staff')) {
    tiles.push(
      renderTile({
        view: 'staff',
        icon: icons.users,
        title: 'پرسنل و تکنسین‌ها',
        desc: 'ثبت اطلاعات تکنسین‌های فنی، تخصیص تخصص‌ها و پیگیری وضعیت فعالیت',
      })
    );
  }
  if (hasPermission(staff, 'recruitment')) {
    tiles.push(
      renderTile({
        view: 'jobApplications',
        icon: icons.briefcase,
        title: 'درخواست‌های همکاری و استخدام',
        desc: 'بررسی متقاضیان پیوستن به ناوگان بهدون و بررسی رزومه‌ها',
      })
    );
  }
  if (hasPermission(staff, 'roles')) {
    tiles.push(
      renderTile({
        view: 'roles',
        icon: icons.lock,
        title: 'نقش‌ها و اختیارات',
        desc: 'تعریف سطوح مجوز دسترسی مدیریتی برای حفاظت از اطلاعات حساس',
      })
    );
  }
  if (hasPermission(staff, 'staff') || hasPermission(staff, 'roles')) {
    tiles.push(
      renderTile({
        view: 'activityLog',
        icon: icons.history,
        title: 'گزارش فعالیت کاربران',
        desc: 'ردگیری تاریخچه لاگین‌ها، ویرایش‌ها و اقدامات انجام‌شده در پنل',
      })
    );
  }
  if (hasPermission(staff, 'wallet')) {
    tiles.push(
      renderTile({
        view: 'payroll',
        icon: icons.wallet,
        title: 'حقوق و تسویه‌حساب',
        desc: 'محاسبه کارمزدها، پورسانت و صدور فیش‌های تسویه هفتگی و ماهانه',
      })
    );
  }
  return `
    <div class="op-subview-wrapper">
      <div class="op-subview-header">
        <h3 class="op-subview-title">مدیریت پرسنل و منابع انسانی</h3>
        <p class="op-subview-desc">ساماندهی تکنسین‌های فنی، پرونده‌های استخدامی و مجوزهای دسترسی</p>
      </div>
      <div class="op-cards-grid">${tiles.join('')}</div>
    </div>
  `;
}

// زیرمجموعه‌ی «آمار و گزارش»
export function renderDashboardHomeView(): string {
  const tiles = [
    renderTile({
      view: 'dashboardOrders',
      icon: icons.chart,
      title: 'تحلیل آمار سفارش‌ها',
      desc: 'روند رشد درخواست‌ها، پرطرفدارترین خدمات و زمان‌های اوج ثبت سفارش',
    }),
    renderTile({
      view: 'dashboardVisitors',
      icon: icons.eye,
      title: 'آمار بازدیدکنندگان',
      desc: 'حجم ترافیک روزانه، مبادی ورودی کاربران و نرخ تعامل با صفحات',
    }),
    renderTile({
      view: 'dashboardStaff',
      icon: icons.users,
      title: 'عملکرد کارمندان و تکنسین‌ها',
      desc: 'ارزیابی سرعت پاسخگویی، امتیاز رضایت و میزان پروژه‌های تکمیل‌شده',
    }),
  ];
  return `
    <div class="op-subview-wrapper">
      <div class="op-subview-header">
        <h3 class="op-subview-title">آمار، شاخص‌ها و تحلیل‌های مدیریتی</h3>
        <p class="op-subview-desc">گزارش‌های تفکیکی از رفتار کاربران، نرخ تکمیل سفارش‌ها و بهره‌وری تیم</p>
      </div>
      <div class="op-cards-grid">${tiles.join('')}</div>
    </div>
  `;
}

export function wireHomeTiles(container: HTMLElement, onSelect: (view: string) => void): void {
  container.querySelectorAll<HTMLElement>('[data-home-tile]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.homeTile;
      if (view) onSelect(view);
    });
  });
}

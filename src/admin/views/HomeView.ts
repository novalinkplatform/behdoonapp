import { icons } from '../components/icons.ts';
import type { StaffInfo } from '../utils/auth.ts';
import { hasPermission } from '../utils/auth.ts';

interface TileData {
  view: string;
  icon: string;
  title: string;
  desc?: string;
  tag?: string;
}

function renderTile(tile: TileData): string {
  return `
    <button type="button" class="op-compact-tile" data-home-tile="${tile.view}" title="${tile.title}">
      <div class="tile-icon-wrap">
        <span class="icon">${tile.icon}</span>
      </div>
      <div class="tile-content">
        <div class="tile-title-row">
          <span class="tile-title">${tile.title}</span>
          ${tile.tag ? `<span class="tile-tag">${tile.tag}</span>` : ''}
        </div>
        ${tile.desc ? `<span class="tile-desc">${tile.desc}</span>` : ''}
      </div>
      <span class="tile-arrow">${icons.arrowLeft}</span>
    </button>
  `;
}

// مرکز مدیریت شیک، مینیمال و حرفه‌ای بهدون (Clean Minimalist Mission Control)
export function renderHomeView(staff: StaffInfo): string {
  const showContent =
    hasPermission(staff, 'content') ||
    hasPermission(staff, 'stories') ||
    hasPermission(staff, 'seo') ||
    hasPermission(staff, 'settings');
  const showSettings = hasPermission(staff, 'settings') || hasPermission(staff, 'homepage');
  const showRequests = hasPermission(staff, 'pipeline') || hasPermission(staff, 'map');
  const showFinance =
    hasPermission(staff, 'dashboard') ||
    hasPermission(staff, 'wallet') ||
    hasPermission(staff, 'roles') ||
    hasPermission(staff, 'staff');

  return `
    <div class="op-control-hub">
      <!-- هدر مینیمال و خلوت مدیریت -->
      <header class="op-hub-header">
        <div class="op-hub-title-block">
          <h2 class="op-hub-title">مرکز مدیریت بهدون</h2>
          <span class="op-hub-sub">خوش آمدید، ${staff.fullName} (${staff.roleLabel})</span>
        </div>
        <div class="op-hub-status-pill">
          <span class="op-status-dot"></span>
          <span>سامانه فعال و آنلاین</span>
        </div>
      </header>

      <!-- شاخص‌های کلیدی وضعیت (KPIs) - خلوت و مدرن -->
      <section class="op-kpi-row">
        <div class="op-kpi-item" data-home-tile="pipeline" role="button" tabindex="0">
          <div class="kpi-mini-icon violet">${icons.columns}</div>
          <div class="kpi-mini-body">
            <span class="kpi-mini-label">پایپ‌لاین سفارش‌ها</span>
            <strong class="kpi-mini-value">مراحل فعال</strong>
          </div>
          <span class="kpi-mini-arrow">${icons.arrowLeft}</span>
        </div>

        <div class="op-kpi-item" data-home-tile="dashboard" role="button" tabindex="0">
          <div class="kpi-mini-icon emerald">${icons.chart}</div>
          <div class="kpi-mini-body">
            <span class="kpi-mini-label">داشبورد آمار</span>
            <strong class="kpi-mini-value">گزارشات تحلیلی</strong>
          </div>
          <span class="kpi-mini-arrow">${icons.arrowLeft}</span>
        </div>

        <div class="op-kpi-item" data-home-tile="staff" role="button" tabindex="0">
          <div class="kpi-mini-icon amber">${icons.users}</div>
          <div class="kpi-mini-body">
            <span class="kpi-mini-label">تکنسین‌ها و پرسنل</span>
            <strong class="kpi-mini-value">مدیریت تیم</strong>
          </div>
          <span class="kpi-mini-arrow">${icons.arrowLeft}</span>
        </div>

        <div class="op-kpi-item" data-home-tile="chat" role="button" tabindex="0">
          <div class="kpi-mini-icon cyan">${icons.chat}</div>
          <div class="kpi-mini-body">
            <span class="kpi-mini-label">پشتیبانی آنلاین</span>
            <strong class="kpi-mini-value">چت کاربران</strong>
          </div>
          <span class="kpi-mini-arrow">${icons.arrowLeft}</span>
        </div>
      </section>

      <!-- اقدامات سریع (Quick Actions) -->
      <section class="op-quick-bar">
        <span class="op-quick-label">دسترسی سریع:</span>
        <div class="op-quick-pills">
          <button type="button" class="op-pill-btn" data-home-tile="pipeline">
            <span class="icon">${icons.columns}</span>
            <span>پایپ‌لاین سفارش‌ها</span>
          </button>
          <button type="button" class="op-pill-btn" data-home-tile="map">
            <span class="icon">${icons.map}</span>
            <span>نقشه زنده</span>
          </button>
          <button type="button" class="op-pill-btn" data-home-tile="services">
            <span class="icon">${icons.wrench}</span>
            <span>مدیریت خدمات</span>
          </button>
          <button type="button" class="op-pill-btn" data-home-tile="ai">
            <span class="icon">${icons.ai}</span>
            <span>هوشواره هوشمند</span>
          </button>
        </div>
      </section>

      <!-- شبکه‌ی دسته‌بندی‌شده و مرتب بخش‌ها (خلوت و بدون متن‌های اضافه) -->
      <div class="op-sections-container">
        <!-- ستون ۱: عملیات، سفارش‌ها و خدمات -->
        <div class="op-group-column">
          <div class="op-group-header">
            <span class="op-group-title">عملیات و سفارش‌ها</span>
          </div>
          <div class="op-group-tiles">
            ${
              showRequests
                ? renderTile({
                    view: 'pipeline',
                    icon: icons.columns,
                    title: 'پایپ‌لاین و مراحل سفارش‌ها',
                    desc: 'کنترل چرخه عمر درخواست‌ها و تکنسین‌ها',
                  })
                : ''
            }
            ${
              showRequests
                ? renderTile({
                    view: 'map',
                    icon: icons.map,
                    title: 'نقشه هوشمند درخواست‌ها',
                    desc: 'پایش موقعیت سفارش‌ها روی نقشه تهران',
                  })
                : ''
            }
            ${
              showSettings || showContent
                ? renderTile({
                    view: 'services',
                    icon: icons.wrench,
                    title: 'مدیریت خدمات و قیمت‌ها',
                    desc: 'تعریف خدمات ساختمانی، اجرت‌ها و گارانتی',
                  })
                : ''
            }
            ${
              hasPermission(staff, 'chat')
                ? renderTile({
                    view: 'chat',
                    icon: icons.chat,
                    title: 'چت و گفتگوی آنلاین',
                    desc: 'پاسخگویی سریع به مراجعین و مشتریان',
                  })
                : ''
            }
            ${
              showSettings
                ? renderTile({
                    view: 'contact-manager',
                    icon: icons.phone,
                    title: 'اطلاعات تماس و شبکه‌ها',
                    desc: 'شماره‌های پشتیبانی، شعب و شبکه‌های اجتماعی',
                  })
                : ''
            }
          </div>
        </div>

        <!-- ستون ۲: محتوا، مجله و بازاریابی -->
        ${
          showContent
            ? `
          <div class="op-group-column">
            <div class="op-group-header">
              <span class="op-group-title">محتوا و وب‌سایت</span>
            </div>
            <div class="op-group-tiles">
              ${
                hasPermission(staff, 'content')
                  ? renderTile({
                      view: 'magazine',
                      icon: icons.article,
                      title: 'مجله و مقالات تخصصی',
                      desc: 'تولید و انتشار مطالب آموزشی و سئو',
                    })
                  : ''
              }
              ${
                hasPermission(staff, 'stories')
                  ? renderTile({
                      view: 'stories',
                      icon: icons.story,
                      title: 'استوری‌های تعاملی',
                      desc: 'ویدیوها و تصاویر قبل/بعد از پروژه',
                    })
                  : ''
              }
              ${
                hasPermission(staff, 'content')
                  ? renderTile({
                      view: 'testimonials',
                      icon: icons.message,
                      title: 'نظرات و رضایت مشتریان',
                      desc: 'بررسی دیدگاه‌ها و بازخوردهای دریافتی',
                    })
                  : ''
              }
              ${
                hasPermission(staff, 'content') || hasPermission(staff, 'settings')
                  ? renderTile({
                      view: 'sliders',
                      icon: icons.image,
                      title: 'اسلایدر و بنرهای تبلیغاتی',
                      desc: 'بنرهای صفحه اصلی دسکتاپ و موبایل',
                    })
                  : ''
              }
              ${
                hasPermission(staff, 'seo')
                  ? renderTile({
                      view: 'seo',
                      icon: icons.seo,
                      title: 'مدیریت سئو و متادیتا',
                      desc: 'تنظیمات اسکیمای گوگل و رتبه کلمات کلیدی',
                    })
                  : ''
              }
              ${
                hasPermission(staff, 'content') || hasPermission(staff, 'settings')
                  ? renderTile({
                      view: 'media',
                      icon: icons.image,
                      title: 'مدیریت رسانه و فایل‌ها',
                      desc: 'آرشیو تصاویر، اسناد و فایل‌های آپلودشده',
                    })
                  : ''
              }
            </div>
          </div>
        `
            : ''
        }

        <!-- ستون ۳: پرسنل، مالی و سامانه -->
        <div class="op-group-column">
          <div class="op-group-header">
            <span class="op-group-title">پرسنل، مالی و تنظیمات</span>
          </div>
          <div class="op-group-tiles">
            ${
              hasPermission(staff, 'staff')
                ? renderTile({
                    view: 'staff',
                    icon: icons.users,
                    title: 'کارمندان و تکنسین‌ها',
                    desc: 'پرونده پرسنل فنی و سوابق فعالیت',
                  })
                : ''
            }
            ${
              hasPermission(staff, 'recruitment')
                ? renderTile({
                    view: 'jobApplications',
                    icon: icons.briefcase,
                    title: 'فرصت‌های شغلی و استخدام',
                    desc: 'بررسی متقاضیان پیوستن به تیم متخصصین',
                  })
                : ''
            }
            ${
              showFinance
                ? renderTile({
                    view: 'finance',
                    icon: icons.finance,
                    title: 'مدیریت مالی و تراکنش‌ها',
                    desc: 'تراکنش‌ها، تسویه‌حساب‌ها و گزارش سود',
                  })
                : ''
            }
            ${
              hasPermission(staff, 'wallet')
                ? renderTile({
                    view: 'payroll',
                    icon: icons.wallet,
                    title: 'حقوق و تسویه‌حساب',
                    desc: 'محاسبه کارمزدها و فیش‌های تسویه',
                  })
                : ''
            }
            ${renderTile({
              view: 'ai',
              icon: icons.ai,
              title: 'هوشواره هوشمند بهدون',
              desc: 'دستیار خودکار هوش مصنوعی و تحلیلگر',
            })}
            ${
              showSettings
                ? renderTile({
                    view: 'settings',
                    icon: icons.settings,
                    title: 'تنظیمات کلی سامانه',
                    desc: 'پیکربندی هویت، پیامک و تنظیمات سایت',
                  })
                : ''
            }
            ${
              hasPermission(staff, 'plugins')
                ? renderTile({
                    view: 'plugins',
                    icon: icons.plugin,
                    title: 'افزونه‌ها و اتصالات',
                    desc: 'درگاه‌های پرداخت و وب‌سرویس‌ها',
                  })
                : ''
            }
            ${
              hasPermission(staff, 'staff') || hasPermission(staff, 'roles')
                ? renderTile({
                    view: 'activityLog',
                    icon: icons.history,
                    title: 'گزارش رویدادها و لاگ',
                    desc: 'تاریخچه لاگین‌ها و تغییرات سیستمی',
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
        title: 'مراحل و پایپ‌لاین سفارش‌ها',
        desc: 'کنترل چرخه عمر درخواست‌ها و اعزام تکنسین',
      })
    );
  }
  if (hasPermission(staff, 'map')) {
    tiles.push(
      renderTile({
        view: 'map',
        icon: icons.map,
        title: 'نقشه جغرافیایی سفارش‌ها',
        desc: 'پایش موقعیت سفارش‌ها در سطح شهر تهران روی نقشه',
      })
    );
  }
  return `
    <div class="op-subview-wrapper">
      <div class="op-subview-header">
        <h3 class="op-subview-title">مدیریت و پیگیری درخواست‌ها</h3>
        <p class="op-subview-desc">بخش‌های مرتبط با گردش کار و مسیریابی سفارش‌های مشتریان</p>
      </div>
      <div class="op-subview-tiles">${tiles.join('')}</div>
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
        title: 'مجله و مقالات تخصصی',
        desc: 'انتشار مقالات سئو و آموزش‌های ساختمانی',
      })
    );
    tiles.push(
      renderTile({
        view: 'testimonials',
        icon: icons.message,
        title: 'دیدگاه‌ها و نظرات مشتریان',
        desc: 'بررسی نظرات و امتیازدهی به کیفیت خدمات',
      })
    );
  }
  if (hasPermission(staff, 'stories')) {
    tiles.push(
      renderTile({
        view: 'stories',
        icon: icons.story,
        title: 'استوری‌های تعاملی',
        desc: 'ویدیوها و تصاویر قبل/بعد از پروژه',
      })
    );
  }
  if (hasPermission(staff, 'content') || hasPermission(staff, 'settings')) {
    tiles.push(
      renderTile({
        view: 'sliders',
        icon: icons.image,
        title: 'اسلایدر و بنرها',
        desc: 'تنظیم بنرهای گرافیکی و لینک‌های مقصد',
      })
    );
    tiles.push(
      renderTile({
        view: 'media',
        icon: icons.image,
        title: 'مدیریت فایل و رسانه‌ها',
        desc: 'آپلود تصاویر و مدیریت فضای رسانه‌ای',
      })
    );
  }
  if (hasPermission(staff, 'seo')) {
    tiles.push(
      renderTile({
        view: 'seo',
        icon: icons.seo,
        title: 'مدیریت سئو و متادیتا',
        desc: 'اسکیمای گوگل و بهینه‌سازی کلمات کلیدی',
      })
    );
  }
  return `
    <div class="op-subview-wrapper">
      <div class="op-subview-header">
        <h3 class="op-subview-title">مدیریت محتوا و وب‌سایت</h3>
        <p class="op-subview-desc">ابزارهای انتشار مقالات، رسانه‌ها، دیدگاه‌ها و سئو</p>
      </div>
      <div class="op-subview-tiles">${tiles.join('')}</div>
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
        desc: 'اطلاعات پرسنل، تخصص‌ها و وضعیت فعالیت',
      })
    );
  }
  if (hasPermission(staff, 'recruitment')) {
    tiles.push(
      renderTile({
        view: 'jobApplications',
        icon: icons.briefcase,
        title: 'فرصت‌های شغلی و استخدام',
        desc: 'بررسی درخواست‌های همکاری و رزومه‌ها',
      })
    );
  }
  if (hasPermission(staff, 'roles')) {
    tiles.push(
      renderTile({
        view: 'roles',
        icon: icons.lock,
        title: 'نقش‌ها و اختیارات دسترسی',
        desc: 'تعریف سطوح دسترسی مدیریتی کاربران',
      })
    );
  }
  if (hasPermission(staff, 'staff') || hasPermission(staff, 'roles')) {
    tiles.push(
      renderTile({
        view: 'activityLog',
        icon: icons.history,
        title: 'گزارش رویدادها و لاگ',
        desc: 'ردگیری تاریخچه لاگین‌ها و ویرایش‌ها',
      })
    );
  }
  if (hasPermission(staff, 'wallet')) {
    tiles.push(
      renderTile({
        view: 'payroll',
        icon: icons.wallet,
        title: 'حقوق و تسویه‌حساب',
        desc: 'محاسبه کارمزدها و فیش‌های تسویه دوره‌ای',
      })
    );
  }
  return `
    <div class="op-subview-wrapper">
      <div class="op-subview-header">
        <h3 class="op-subview-title">مدیریت پرسنل و منابع انسانی</h3>
        <p class="op-subview-desc">ساماندهی تکنسین‌های فنی، استخدام و سطوح دسترسی</p>
      </div>
      <div class="op-subview-tiles">${tiles.join('')}</div>
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
      desc: 'روند رشد درخواست‌ها و خدمات پرطرفدار',
    }),
    renderTile({
      view: 'dashboardVisitors',
      icon: icons.eye,
      title: 'آمار بازدیدکنندگان',
      desc: 'حجم ترافیک روزانه و مبادی ورودی',
    }),
    renderTile({
      view: 'dashboardStaff',
      icon: icons.users,
      title: 'عملکرد کارمندان و تکنسین‌ها',
      desc: 'سرعت پاسخگویی و امتیاز رضایت کارفرمایان',
    }),
  ];
  return `
    <div class="op-subview-wrapper">
      <div class="op-subview-header">
        <h3 class="op-subview-title">آمار و تحلیل‌های مدیریتی</h3>
        <p class="op-subview-desc">گزارش‌های رفتار کاربران، نرخ سفارش‌ها و عملکرد تیم</p>
      </div>
      <div class="op-subview-tiles">${tiles.join('')}</div>
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

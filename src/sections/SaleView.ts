export function renderSaleView(): string {
  return `
  <div class="nobex-wrapper">
    <!-- Fixed Luxury Dark Navbar -->
    <header class="nobex-navbar">
      <div class="nobex-nav-container">
        <div class="nobex-nav-right">
          <a href="/sale" class="nobex-logo-box">
            <img src="/behbaricon.png" alt="بهبار" class="nobex-logo-img" />
            <div class="nobex-logo-text">
              <span class="nobex-logo-title">سامانه بهبار</span>
              <span class="nobex-logo-sub">نسخه حرفه‌ای ژاکت</span>
            </div>
          </a>
          <nav class="nobex-nav-links">
            <a href="#features">ویژگی‌های کلیدی</a>
            <a href="#showcase">پیش‌نمایش زنده</a>
            <a href="#tech-specs">مشخصات فنی</a>
          </nav>
        </div>
        <div class="nobex-nav-left">
          <a href="https://www.zhaket.com/web/behbar-script" target="_blank" rel="noopener" class="nobex-btn-gold">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span>خرید از مارکت بزرگ ژاکت</span>
          </a>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="nobex-hero">
      <div class="nobex-hero-ambient-glow"></div>
      <div class="nobex-hero-ambient-glow-2"></div>
      <div class="nobex-hero-container">
        <div class="nobex-hero-badge">
          <span class="nobex-badge-dot"></span>
          <span>سامانه پیشرفته خدمات فنی و مهندسی ساختمان با معماری ابری و مدرن</span>
        </div>

        <h1 class="nobex-hero-title">
          پلتفرم و سامانه هوشمند <span class="nobex-gold-text">بـه‌دون</span>
        </h1>

        <p class="nobex-hero-desc">
          راهکار یکپارچه و مدرن برای شرکت‌های خدمات فنی، تأسیسات و تعمیرات ساختمانی تهران با پنل مدیریت فوق‌سریع و اپلیکیشن وب ثبت آنلاین سفارشات تکنسین با نقشه زنده و سیستم محاسبه آنی هزینه.
        </p>

        <div class="nobex-hero-actions">
          <a href="#showcase" class="nobex-btn-gold nobex-btn-lg">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
            <span>مشاهده پیش‌نمایش سامانه بهدون</span>
          </a>
          <a href="/management" class="nobex-btn-glass nobex-btn-lg">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <span>ورود به پنل مدیریت</span>
          </a>
        </div>

        <!-- 3D Layered Mockup Showcase -->
        <div class="nobex-hero-stage">
          <div class="nobex-stage-card nobex-stage-card-admin">
            <div class="nobex-stage-header">
              <span class="nobex-dot red"></span>
              <span class="nobex-dot yellow"></span>
              <span class="nobex-dot green"></span>
              <span class="nobex-stage-title">پنل مدیریت اعزام و تکنسین‌ها (Management Panel)</span>
            </div>
            <img src="/admin_showcase.png" alt="پیش‌نمایش پنل مدیریت بهدون" class="nobex-stage-img" />
          </div>
          <div class="nobex-stage-card nobex-stage-card-client">
            <div class="nobex-stage-header">
              <span class="nobex-dot red"></span>
              <span class="nobex-dot yellow"></span>
              <span class="nobex-dot green"></span>
              <span class="nobex-stage-title">وب‌اپلیکیشن ثبت درخواست مشتریان (Client App)</span>
            </div>
            <img src="/client_showcase.png" alt="پیش‌نمایش سفارش مشتری بهدون" class="nobex-stage-img" />
          </div>
        </div>
      </div>
    </section>

    <!-- Key Features Grid -->
    <section id="features" class="nobex-section">
      <div class="nobex-container">
        <div class="nobex-section-head">
          <span class="nobex-section-tag">چرا پلتفرم بهدون؟</span>
          <h2 class="nobex-section-title">امکانات استاندارد، پرسرعت و بدون رقیب</h2>
          <p class="nobex-section-subtitle">سامانه‌ای مستقل و مدرن، بدون وابستگی‌های سنگین و آماده بهره‌برداری فوری</p>
        </div>

        <div class="nobex-grid-3">
          <div class="nobex-card">
            <div class="nobex-card-icon-wrap">
              <svg viewBox="0 0 24 24" width="28" height="28" stroke="#ffae11" stroke-width="2" fill="none"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            </div>
            <h3 class="nobex-card-title">هسته مستقل و پرسرعت ابری</h3>
            <p class="nobex-card-text">معماری سبک بدون نیاز به سامانه‌های سنگین سنتی، با مصرف بسیار پایین منابع سرور و بازدهی حداکثری در ترافیک بالای کاربران.</p>
          </div>

          <div class="nobex-card">
            <div class="nobex-card-icon-wrap">
              <svg viewBox="0 0 24 24" width="28" height="28" stroke="#ffae11" stroke-width="2" fill="none"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
            </div>
            <h3 class="nobex-card-title">نقشه زنده و هوشمند تهران</h3>
            <p class="nobex-card-text">انتخاب دقیق موقعیت ملک روی نقشه اختصاصی تهران با تفکیک ۲۲ منطقه، پلاک و طبقه، و محاسبه خودکار زمان اعزام تکنسین.</p>
          </div>

          <div class="nobex-card">
            <div class="nobex-card-icon-wrap">
              <svg viewBox="0 0 24 24" width="28" height="28" stroke="#ffae11" stroke-width="2" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            </div>
            <h3 class="nobex-card-title">ورود سریع با پیامک یکبار مصرف (OTP)</h3>
            <p class="nobex-card-text">پشتیبانی از ارائه‌دهندگان پیامکی معتبر برای ورود امن و تایید آنی شماره تماس کاربران و ارسال پیامک وضعیت اعزام تکنسین.</p>
          </div>

          <div class="nobex-card">
            <div class="nobex-card-icon-wrap">
              <svg viewBox="0 0 24 24" width="28" height="28" stroke="#ffae11" stroke-width="2" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </div>
            <h3 class="nobex-card-title">پنل مدیریت اعزام و تکنسین‌ها</h3>
            <p class="nobex-card-text">مدیریت یکپارچه سفارش‌ها، تخصیص هوشمند تکنسین‌های مجرب، مشاهده گزارش‌های فنی و گزارش‌گیری پیشرفته از عملکرد کسب‌وکار.</p>
          </div>

          <div class="nobex-card">
            <div class="nobex-card-icon-wrap">
              <svg viewBox="0 0 24 24" width="28" height="28" stroke="#ffae11" stroke-width="2" fill="none"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>
            </div>
            <h3 class="nobex-card-title">پشتیبان‌گیری خودکار و امنیت ابری</h3>
            <p class="nobex-card-text">امنیت صددرصدی داده‌ها؛ پایگاه داده سامانه به‌طور منظم پشتیبان‌گیری شده و نسخه محافظت‌شده در فضای ابری ذخیره می‌گردد.</p>
          </div>

          <div class="nobex-card">
            <div class="nobex-card-icon-wrap">
              <svg viewBox="0 0 24 24" width="28" height="28" stroke="#ffae11" stroke-width="2" fill="none"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </div>
            <h3 class="nobex-card-title">نصب خودکار و بهینه‌سازی شده</h3>
            <p class="nobex-card-text">استقرار آنی بر بستر کلادفلر و لینوکس با SSL خودکار و سرعت بارگذاری فوق‌العاده در سرتاسر ایران.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Live Showcase Section -->
    <section id="showcase" class="nobex-section nobex-section-dark">
      <div class="nobex-container">
        <div class="nobex-section-head">
          <span class="nobex-section-tag">دمو آنلاین و تست زنده</span>
          <h2 class="nobex-section-title">محیط‌های پیش‌نمایش سامانه را امتحان کنید</h2>
          <p class="nobex-section-subtitle">با یک کلیک وارد سامانه شوید و سرعت بی‌نظیر آن را از نزدیک لمس کنید</p>
        </div>

        <div class="nobex-grid-2">
          <!-- Management Demo Card -->
          <div class="nobex-showcase-box">
            <div class="nobex-showcase-img-wrap">
              <img src="/admin_showcase.png" alt="دموی پنل مدیریت بهبار" />
              <div class="nobex-showcase-overlay">
                <a href="https://behbarapp.ir/management" target="_blank" rel="noopener" class="nobex-btn-gold">
                  ورود به پنل مدیریت
                </a>
              </div>
            </div>
            <div class="nobex-showcase-content">
              <div class="nobex-showcase-header">
                <h3 class="nobex-showcase-title">پنل مدیریت (Management Panel)</h3>
                <span class="nobex-badge-soft">نسخه دمو</span>
              </div>
              <p class="nobex-showcase-desc">
                داشبورد نظارت بر سفارش‌ها، مدیریت سرویس‌ها، تنظیم تعرفه‌ها، بررسی رانندگان و گزارش‌های آماری زنده.
              </p>
              <div class="nobex-demo-creds">
                <span>آدرس مستقیم: <code>behbarapp.ir/management</code></span>
                <span>شماره ورود آزمایشی: <code>09120000000</code></span>
                <span>کد تایید پیامکی: <code>12345</code></span>
              </div>
              <a href="https://behbarapp.ir/management" target="_blank" rel="noopener" class="nobex-btn-glass nobex-btn-block">
                مشاهده دموی زنده مدیریت
              </a>
            </div>
          </div>

          <!-- Client Demo Card -->
          <div class="nobex-showcase-box">
            <div class="nobex-showcase-img-wrap">
              <img src="/client_showcase.png" alt="دموی اپلیکیشن مشتری بهبار" />
              <div class="nobex-showcase-overlay">
                <a href="https://behbarapp.ir" target="_blank" rel="noopener" class="nobex-btn-gold">
                  ورود به اپ مشتری
                </a>
              </div>
            </div>
            <div class="nobex-showcase-content">
              <div class="nobex-showcase-header">
                <h3 class="nobex-showcase-title">وب‌اپلیکیشن ثبت سفارش مشتری (Client App)</h3>
                <span class="nobex-badge-soft">PWA آماده نصب</span>
              </div>
              <p class="nobex-showcase-desc">
                فرم رزرو هوشمند چندمرحله‌ای، نقشه تعاملی، انتخاب جزئیات اسباب‌کشی، محاسبه تعرفه و رهگیری زنده.
              </p>
              <div class="nobex-demo-creds">
                <span>آدرس اصلی: <code>behbarapp.ir</code></span>
                <span>پشتیبانی کامل از موبایل و تبلت</span>
              </div>
              <a href="https://behbarapp.ir" target="_blank" rel="noopener" class="nobex-btn-glass nobex-btn-block">
                مشاهده دموی زنده مشتری
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech Specs & Comparison -->
    <section id="tech-specs" class="nobex-section">
      <div class="nobex-container">
        <div class="nobex-section-head">
          <span class="nobex-section-tag">برتری فنی</span>
          <h2 class="nobex-section-title">مقایسه مشخصات بهبار با سیستم‌های سنتی</h2>
          <p class="nobex-section-subtitle">تفاوت اساسی معماری مدرن با راهکارهای قدیمی</p>
        </div>

        <div class="nobex-table-wrapper">
          <table class="nobex-table">
            <thead>
              <tr>
                <th>معیار و قابلیت</th>
                <th class="highlight">سامانه هوشمند بهبار</th>
                <th>سیستم‌های سنتی و قالبی</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>زبان و فناوری توسعه</td>
                <td class="highlight"><strong class="text-gold">Node.js + TypeScript + Vite</strong></td>
                <td>قالب‌ها و افزونه‌های متفرقه سنگین</td>
              </tr>
              <tr>
                <td>سرعت بارگذاری صفحه</td>
                <td class="highlight">کمتر از ۵۰۰ میلی‌ثانیه (فوق‌سریع)</td>
                <td>۳ الی ۸ ثانیه (بسیار سنگین)</td>
              </tr>
              <tr>
                <td>نقشه آنلاین و مکان‌یابی</td>
                <td class="highlight">نقشه تعاملی زنده با محاسبه هوشمند مسیر</td>
                <td>مختصات دستی یا بدون نقشه</td>
              </tr>
              <tr>
                <td>ارسال پیامک و OTP</td>
                <td class="highlight">وب‌سرویس پترن آنی (زیر ۵ ثانیه)</td>
                <td>ارسال پیامک ساده با تاخیر بالا</td>
              </tr>
              <tr>
                <td>پشتیبان‌گیری ابری خودکار</td>
                <td class="highlight">اتصال مستقیم به گوگل درایو</td>
                <td>نیازمند افزونه‌های جانبی یا دستی</td>
              </tr>
              <tr>
                <td>آپدیت و نگهداری سرور</td>
                <td class="highlight">فرمان اختصاصی بهینه‌ساز beh-manager</td>
                <td>پیچیدگی بالا و خطاهای مکرر تداخل</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- FAQ Accordion -->
    <section id="faq" class="nobex-section nobex-section-dark">
      <div class="nobex-container nobex-container-narrow">
        <div class="nobex-section-head">
          <span class="nobex-section-tag">پاسخ به پرسش‌ها</span>
          <h2 class="nobex-section-title">سوالات متداول خریداران</h2>
          <p class="nobex-section-subtitle">پاسخ به سوالاتی که پیش از سفارش ممکن است داشته باشید</p>
        </div>

        <div class="nobex-faq-list">
          <details class="nobex-faq-item" open>
            <summary class="nobex-faq-question">
              <span>آیا این اسکریپت بر روی هاست اشتراکی اجرا می‌شود یا سرور مجازی؟</span>
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="nobex-faq-answer">
              این سامانه با معماری مدرن Node.js توسعه یافته و برای بهترین بازدهی بر روی هرگونه سرور مجازی لینوکس (حتی یک سرور با ۱ گیگابایت رم) به‌سادگی اجرا می‌شود. اسکریپت نصب اختصاصی کلیه مراحل را به‌صورت خودکار انجام می‌دهد.
            </div>
          </details>

          <details class="nobex-faq-item">
            <summary class="nobex-faq-question">
              <span>نصب و راه‌اندازی اولیه چقدر زمان می‌برد؟</span>
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="nobex-faq-answer">
              به‌دلیل آماده‌بودن اسکریپت نصب هوشمند، اجرای یک خط فرمان در ترمینال سرور در کمتر از ۳ دقیقه کلیه ملزومات را پیکربندی و سامانه را بر روی دامنه شما فعال می‌سازد.
            </div>
          </details>

          <details class="nobex-faq-item">
            <summary class="nobex-faq-question">
              <span>آیا امکان اتصال پیامک اختصاصی وجود دارد؟</span>
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="nobex-faq-answer">
              بله، در فایل تنظیمات سامانه می‌توانید API Key ارائه‌دهنده پیامک خود را قرار دهید تا ارسال کدهای ورود با خطوط خدماتی و بدون مسدودی بلک‌لیست انجام شود.
            </div>
          </details>

          <details class="nobex-faq-item">
            <summary class="nobex-faq-question">
              <span>آیا برای آپدیت‌های بعدی نیاز به انجام دستی مراحل هست؟</span>
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="nobex-faq-answer">
              خیر، با اجرای ابزار beh-manager در سرور، گزینه بروزرسانی را انتخاب کرده و نسخه جدید بدون حذف اطلاعات و بدون وقفه در کار سامانه جایگزین خواهد شد.
            </div>
          </details>
        </div>
      </div>
    </section>

    <!-- Bottom Zhaket CTA Box -->
    <section class="nobex-cta-section">
      <div class="nobex-container">
        <div class="nobex-cta-box">
          <div class="nobex-cta-ambient"></div>
          <div class="nobex-cta-content">
            <h2 class="nobex-cta-title">هم‌اکنون کسب‌وکار باربری و حمل‌ونقل خود را هوشمند کنید</h2>
            <p class="nobex-cta-desc">
              با خرید نسخه اورجینال از مارکت بزرگ ژاکت، از ۶ ماه پشتیبانی رایگان، بروزرسانی‌های منظم و ضمانت کیفیت بهره‌مند شوید.
            </p>
            <div class="nobex-cta-actions">
              <a href="https://www.zhaket.com/web/behbar-script" target="_blank" rel="noopener" class="nobex-btn-gold nobex-btn-xl">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <span>خرید از مارکت بزرگ ژاکت</span>
              </a>
            </div>
            <div class="nobex-cta-guarantees">
              <div class="nobex-g-item">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="#ffae11" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
                <span>ضمانت اصالت و سلامت کد</span>
              </div>
              <div class="nobex-g-item">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="#ffae11" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
                <span>نصب آسان و پشتیبانی تخصصی</span>
              </div>
              <div class="nobex-g-item">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="#ffae11" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
                <span>بروزرسانی‌های رایگان آینده</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Dark Luxury Footer -->
    <footer class="nobex-footer">
      <div class="nobex-container">
        <div class="nobex-footer-inner">
          <div class="nobex-footer-brand">
            <img src="/behbaricon.png" alt="بهبار" class="nobex-footer-logo" />
            <span>اسکریپت پیشرفته سامانه حمل‌بار و اسباب‌کشی آنلاین بهبار</span>
          </div>
          <div class="nobex-footer-meta">
            <span>عرضه‌شده به‌صورت انحصاری در مارکت بزرگ ژاکت</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
  `;
}

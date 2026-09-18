import { icons } from '../components/icons.ts';
import { pick } from '../i18n/lang.ts';
import { toPersianDigits } from '../utils/jalali.ts';
import { formatToman } from '../utils/format.ts';
import { SUPPORT_PHONE, SUPPORT_PHONE_DISPLAY } from '../data/contact.ts';
import {
  getAllCategories,
  type ServiceCategoryDetail,
  type SubServiceDetail,
} from '../data/allServicesData.ts';

/**
 * رندر برگه دایرکتوری و فهرست کلیه ۵۳ خدمت تخصصی بهدون در ۸ دسته
 */
export function renderServicesDirectoryView(_settings: any): string {
  const categories = getAllCategories();
  const totalServices = categories.reduce((sum, c) => sum + c.subServices.length, 0);

  return `
    <div class="services-page-container">
      <!-- Breadcrumb -->
      <nav class="services-breadcrumb" aria-label="Breadcrumb">
        <a href="/">
          <span class="icon">${icons.home}</span>
          <span>${pick('خانه', 'Home')}</span>
        </a>
        <span class="separator">/</span>
        <span class="current">${pick('کاتالوگ خدمات تخصصی بهدون', 'All Building Services')}</span>
      </nav>

      <!-- Hero Header -->
      <section class="service-hero">
        <div class="service-hero-top">
          <span class="service-hero-badge">
            <span class="icon">${icons.bolt}</span>
            <span>${toPersianDigits(totalServices)} ${pick('خدمت ساختمانی دارای ضمانت کتبی', 'Guaranteed Building Services')}</span>
          </span>
          <span class="service-hero-badge">
            <span class="icon">${icons.pin}</span>
            <span>${pick('پوشش سراسری کلیه مناطق ۲۲ گانه تهران', 'All 22 Districts of Tehran')}</span>
          </span>
        </div>

        <h1 class="service-hero-title">
          ${pick('کاتالوگ جامع خدمات فنی و تعمیرات ساختمان بهدون', 'Behdoon Building Services & Repair Catalog')}
        </h1>
        <p class="service-hero-subtitle">
          ${pick(
            'دسترسی سریع به کلیه خدمات سرمایش و گرمایش، لوله‌کشی و تأسیسات، برقکاری، بازسازی، کلیدسازی، کابینت، در و پنجره و نظافت با اعزام فوری تکنسین، نرخ مصوب اتحادیه و ضمانت ۳۰ روزه.',
            'Instant access to HVAC, plumbing, electrical, remodeling, locksmith, carpentry, doors/windows and cleaning services in Tehran.'
          )}
        </p>

        <!-- Search input for services -->
        <div style="max-width: 600px; margin-bottom: 1.5rem; position: relative;">
          <input
            type="text"
            id="services-live-search"
            placeholder="${pick('جستجوی سریع میان ۵۳ خدمت تخصصی (مثلاً: نشت‌یابی، پکیج، کلیدسازی...)', 'Search 53 services (e.g. leak detection, boiler, locksmith)...')}"
            style="width: 100%; padding: 0.9rem 1.25rem 0.9rem 3rem; border-radius: 1rem; border: 2px solid rgba(255, 255, 255, 0.3); background: rgba(255, 255, 255, 0.15); color: #fff; font-size: 0.95rem; outline: none; backdrop-filter: blur(10px);"
          />
          <span class="icon" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #e2e8f0; pointer-events: none;">
            ${icons.search}
          </span>
        </div>

        <div class="service-hero-actions">
          <button type="button" class="btn-hero-primary" data-open-wizard="all">
            <span class="icon">${icons.plusCircle}</span>
            <span>${pick('ثبت درخواست آنلاین تکنسین', 'Request Technician Online')}</span>
          </button>
          <a href="tel:${SUPPORT_PHONE}" class="btn-hero-call">
            <span class="icon">${icons.phone}</span>
            <span>${pick('تماس مستقیم:', 'Direct Call:')} ${toPersianDigits(SUPPORT_PHONE_DISPLAY)}</span>
          </a>
        </div>
      </section>

      <!-- Categories Directory List -->
      <div id="services-directory-list">
        ${categories
          .map(
            (cat) => `
          <div class="directory-category-card" data-category-section="${cat.id}">
            <div class="directory-category-header">
              <div class="directory-category-main">
                <div class="directory-category-icon">
                  <span class="icon">${cat.icon}</span>
                </div>
                <div>
                  <h2 class="directory-category-title">
                    <a href="/services/${cat.slug}" style="color: inherit; text-decoration: none;">
                      ${pick(cat.title, cat.titleEn)}
                    </a>
                  </h2>
                  <p class="directory-category-sub">${pick(cat.subtitle, cat.subtitleEn)}</p>
                </div>
              </div>
              <a href="/services/${cat.slug}" class="directory-category-link">
                <span>${pick('صفحه جامع و راهنما', 'Full Category Guide')}</span>
                <span class="icon">${icons.chevronLeft}</span>
              </a>
            </div>

            <div class="subservices-grid">
              ${cat.subServices
                .map(
                  (sub) => `
                <div class="subservice-card" data-service-item="${sub.id}" data-search-text="${sub.name} ${sub.nameEn} ${sub.shortDesc}">
                  <div class="subservice-card-top">
                    <h3 class="subservice-card-title">
                      <a href="/services/${cat.slug}/${sub.slug}">
                        ${pick(sub.name, sub.nameEn)}
                      </a>
                    </h3>
                    <span class="subservice-card-price">
                      ${pick('شروع از:', 'From:')} ${formatToman(sub.basePrice)}
                    </span>
                  </div>
                  <p class="subservice-card-desc">${pick(sub.shortDesc, sub.shortDescEn)}</p>
                  <ul class="subservice-card-features">
                    ${sub.features.slice(0, 3).map((f) => `<li>${f}</li>`).join('')}
                  </ul>
                  <div class="subservice-card-footer">
                    <button
                      type="button"
                      class="btn-order"
                      data-service-cat="${cat.id}"
                      data-service-sub="${sub.id}"
                    >
                      <span class="icon">${icons.plusCircle}</span>
                      <span>${pick('ثبت درخواست', 'Order')}</span>
                    </button>
                    <a href="/services/${cat.slug}/${sub.slug}" class="btn-details">
                      <span>${pick('جزئیات', 'Details')}</span>
                    </a>
                  </div>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `;
}

/**
 * رندر صفحه اختصاصی یک دسته‌بندی با کلیه زیرخدمات و راهنمای جامع سئو
 */
export function renderCategoryPageView(category: ServiceCategoryDetail, _settings: any): string {
  return `
    <div class="services-page-container">
      <!-- Breadcrumb -->
      <nav class="services-breadcrumb" aria-label="Breadcrumb">
        <a href="/">
          <span class="icon">${icons.home}</span>
          <span>${pick('خانه', 'Home')}</span>
        </a>
        <span class="separator">/</span>
        <a href="/services">
          <span>${pick('خدمات ساختمانی', 'Services')}</span>
        </a>
        <span class="separator">/</span>
        <span class="current">${pick(category.title, category.titleEn)}</span>
      </nav>

      <!-- Category Hero Section -->
      <section class="service-hero">
        <div class="service-hero-top">
          <span class="service-hero-badge">
            <span class="icon">${icons.shield}</span>
            <span>${pick('ضمانت کتبی ۳۰ روزه کیفیت بهدون', '30-Day Written Warranty')}</span>
          </span>
          <span class="service-hero-badge">
            <span class="icon">${icons.bolt}</span>
            <span>${toPersianDigits(category.subServices.length)} ${pick('خدمت تخصصی در این حوزه', 'Specialized Services')}</span>
          </span>
        </div>

        <h1 class="service-hero-title">${pick(category.title, category.titleEn)}</h1>
        <p class="service-hero-subtitle">${pick(category.subtitle, category.subtitleEn)}</p>

        <!-- Specs bar -->
        <div class="service-hero-specs">
          <div class="service-spec-item">
            <div class="service-spec-icon">${icons.bolt}</div>
            <div class="service-spec-info">
              <span class="service-spec-label">${pick('زمان حضور تکنسین', 'Arrival Time')}</span>
              <span class="service-spec-val">${pick('کمتر از ۴۵ دقیقه در تهران', 'Under 45 mins')}</span>
            </div>
          </div>
          <div class="service-spec-item">
            <div class="service-spec-icon">${icons.shield}</div>
            <div class="service-spec-info">
              <span class="service-spec-label">${pick('گارانتی خدمات', 'Warranty')}</span>
              <span class="service-spec-val">${pick('۳۰ روز ضمانت رسمی کتبی', '30-Day Official Warranty')}</span>
            </div>
          </div>
          <div class="service-spec-item">
            <div class="service-spec-icon">${icons.checkCircle}</div>
            <div class="service-spec-info">
              <span class="service-spec-label">${pick('تعرفه و شفافیت', 'Pricing')}</span>
              <span class="service-spec-val">${pick('مطابق نرخنامه مصوب اتحادیه', 'Union-Approved Rates')}</span>
            </div>
          </div>
          <div class="service-spec-item">
            <div class="service-spec-icon">${icons.pin}</div>
            <div class="service-spec-info">
              <span class="service-spec-label">${pick('محدوده پوشش', 'Coverage')}</span>
              <span class="service-spec-val">${pick('تمام مناطق ۲۲ گانه شهر تهران', 'All 22 Districts')}</span>
            </div>
          </div>
        </div>

        <div class="service-hero-actions">
          <button type="button" class="btn-hero-primary" data-service-cat="${category.id}">
            <span class="icon">${icons.plusCircle}</span>
            <span>${pick('ثبت فوری درخواست در این دسته', 'Request Service in This Category')}</span>
          </button>
          <a href="tel:${SUPPORT_PHONE}" class="btn-hero-call">
            <span class="icon">${icons.phone}</span>
            <span>${pick('تماس مستقیم با کارشناس:', 'Direct Call:')} ${toPersianDigits(SUPPORT_PHONE_DISPLAY)}</span>
          </a>
        </div>
      </section>

      <!-- Subservices Section -->
      <section>
        <div class="subservices-section-title">
          <h2>${pick(`خدمات تخصصی زیرمجموعه ${category.title}`, `Services Under ${category.titleEn}`)}</h2>
          <span style="font-size: 0.85rem; color: #64748b;">
            ${toPersianDigits(category.subServices.length)} ${pick('خدمت مجزا با قیمت پایه و صفحه اختصاصی', 'Services with dedicated pages')}
          </span>
        </div>

        <div class="subservices-grid">
          ${category.subServices
            .map(
              (sub) => `
            <div class="subservice-card">
              <div class="subservice-card-top">
                <h3 class="subservice-card-title">
                  <a href="/services/${category.slug}/${sub.slug}">
                    ${pick(sub.name, sub.nameEn)}
                  </a>
                </h3>
                <span class="subservice-card-price">
                  ${pick('شروع از:', 'From:')} ${formatToman(sub.basePrice)}
                </span>
              </div>
              <p class="subservice-card-desc">${pick(sub.shortDesc, sub.shortDescEn)}</p>
              <ul class="subservice-card-features">
                ${sub.features.slice(0, 3).map((f) => `<li>${f}</li>`).join('')}
              </ul>
              <div class="subservice-card-footer">
                <button
                  type="button"
                  class="btn-order"
                  data-service-cat="${category.id}"
                  data-service-sub="${sub.id}"
                >
                  <span class="icon">${icons.plusCircle}</span>
                  <span>${pick('ثبت درخواست آنلاین', 'Order')}</span>
                </button>
                <a href="/services/${category.slug}/${sub.slug}" class="btn-details">
                  <span>${pick('توضیحات و تعرفه', 'Details')}</span>
                </a>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </section>

      <!-- Comprehensive SEO Guide -->
      ${category.comprehensiveGuide ? `<div class="category-guide-wrapper">${category.comprehensiveGuide}</div>` : ''}

      <!-- FAQ Section -->
      ${
        category.faq && category.faq.length > 0
          ? `
        <section class="faq-section">
          <h3 class="faq-title">${pick('پرسش‌های متداول در این زمینه', 'Frequently Asked Questions')}</h3>
          <div class="faq-list">
            ${category.faq
              .map(
                (item) => `
              <div class="faq-item">
                <h4 class="faq-question">${item.q}</h4>
                <p class="faq-answer">${item.a}</p>
              </div>
            `
              )
              .join('')}
          </div>
        </section>
      `
          : ''
      }
    </div>
  `;
}

/**
 * رندر صفحه اختصاصی یک زیرخدمت معین با مشخصات فنی، گارانتی، برآورد قیمت و دکمه ثبت
 */
export function renderSubServicePageView(
  category: ServiceCategoryDetail,
  subService: SubServiceDetail,
  _settings: any
): string {
  // Find other services in the same category for "Related Services"
  const relatedServices = category.subServices.filter((s) => s.id !== subService.id);

  return `
    <div class="services-page-container">
      <!-- Breadcrumb -->
      <nav class="services-breadcrumb" aria-label="Breadcrumb">
        <a href="/">
          <span class="icon">${icons.home}</span>
          <span>${pick('خانه', 'Home')}</span>
        </a>
        <span class="separator">/</span>
        <a href="/services">
          <span>${pick('خدمات', 'Services')}</span>
        </a>
        <span class="separator">/</span>
        <a href="/services/${category.slug}">
          <span>${pick(category.title, category.titleEn)}</span>
        </a>
        <span class="separator">/</span>
        <span class="current">${pick(subService.name, subService.nameEn)}</span>
      </nav>

      <!-- Sub-Service Hero -->
      <section class="service-hero">
        <div class="service-hero-top">
          <span class="service-hero-badge">
            <span class="icon">${icons.shield}</span>
            <span>${pick('ضمانت کتبی ۳۰ روزه کیفیت بهدون', '30-Day Written Warranty')}</span>
          </span>
          <span class="service-hero-badge">
            <span class="icon">${icons.bolt}</span>
            <span>${pick('اعزام فوری تکنسین در کلیه مناطق تهران', 'Immediate Dispatch in Tehran')}</span>
          </span>
        </div>

        <h1 class="service-hero-title">${pick(subService.name, subService.nameEn)}</h1>
        <p class="service-hero-subtitle">${pick(subService.shortDesc, subService.shortDescEn)}</p>

        <!-- Specs Bar -->
        <div class="service-hero-specs">
          <div class="service-spec-item">
            <div class="service-spec-icon">${icons.bolt}</div>
            <div class="service-spec-info">
              <span class="service-spec-label">${pick('شروع تعرفه از', 'Starting Price')}</span>
              <span class="service-spec-val">${formatToman(subService.basePrice)}</span>
            </div>
          </div>
          <div class="service-spec-item">
            <div class="service-spec-icon">${icons.calendar}</div>
            <div class="service-spec-info">
              <span class="service-spec-label">${pick('زمان حضور', 'Arrival Time')}</span>
              <span class="service-spec-val">${pick('زیر ۴۵ دقیقه یا زمان دلخواه شما', 'Under 45 mins / Scheduled')}</span>
            </div>
          </div>
          <div class="service-spec-item">
            <div class="service-spec-icon">${icons.shield}</div>
            <div class="service-spec-info">
              <span class="service-spec-label">${pick('ضمانت اجرایی', 'Guarantee')}</span>
              <span class="service-spec-val">${pick('۳۰ روز پشتیبانی و بازبینی رایگان', '30-Day Free Follow-up')}</span>
            </div>
          </div>
          <div class="service-spec-item">
            <div class="service-spec-icon">${icons.checkCircle}</div>
            <div class="service-spec-info">
              <span class="service-spec-label">${pick('تکنسین بهدون', 'Technician')}</span>
              <span class="service-spec-val">${pick('تایید هویت و صلاحیت حرفه‌ای', 'Certified & Background Checked')}</span>
            </div>
          </div>
        </div>

        <div class="service-hero-actions">
          <button
            type="button"
            class="btn-hero-primary"
            data-service-cat="${category.id}"
            data-service-sub="${subService.id}"
          >
            <span class="icon">${icons.plusCircle}</span>
            <span>${pick(`ثبت آنلاین درخواست ${subService.name}`, `Book ${subService.nameEn} Online`)}</span>
          </button>
          <a href="tel:${SUPPORT_PHONE}" class="btn-hero-call">
            <span class="icon">${icons.phone}</span>
            <span>${pick('تماس مستقیم با کارشناس:', 'Direct Call:')} ${toPersianDigits(SUPPORT_PHONE_DISPLAY)}</span>
          </a>
        </div>
      </section>

      <!-- Main Detail Layout (Content + Sidebar) -->
      <div class="service-detail-layout">
        <!-- Main Technical Article / Guide -->
        <main class="service-detail-main">
          ${subService.detailHtml}

          <!-- Features block if not already in detail -->
          <div style="margin-top: 2rem; padding: 1.5rem; background: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
            <h4 style="font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">
              ${pick('چرا برای این خدمت بهدون را انتخاب کنید؟', 'Why choose Behdoon for this service?')}
            </h4>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">
              ${subService.features.map((f) => `<li style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.88rem; color: #475569;"><span style="color: #10b981; font-weight: 900;">✓</span> ${f}</li>`).join('')}
            </ul>
          </div>
        </main>

        <!-- Sidebar -->
        <aside class="service-detail-sidebar">
          <!-- Price & Booking Card -->
          <div class="sidebar-card">
            <div class="sidebar-price-tag">
              <div class="sidebar-price-label">${pick('حداقل تعرفه شروع خدمت:', 'Starting Price from:')}</div>
              <div class="sidebar-price-amount">${formatToman(subService.basePrice)}</div>
              <div class="sidebar-price-note">${pick('مطابق نرخنامه مصوب اتحادیه تهران', 'Official Union Rates')}</div>
            </div>

            <div class="sidebar-actions">
              <button
                type="button"
                class="btn-primary"
                data-service-cat="${category.id}"
                data-service-sub="${subService.id}"
              >
                ${pick('ثبت آنلاین این خدمت', 'Book This Service')}
              </button>
              <a href="tel:${SUPPORT_PHONE}" class="btn-outline">
                <span class="icon">${icons.phone}</span>
                <span>${pick('تماس تلفنی با پشتیبانی', 'Call Support')}</span>
              </a>
            </div>

            <ul class="sidebar-trust-list">
              <li class="sidebar-trust-item">
                <span class="icon">${icons.checkCircle}</span>
                <span>${pick('تضمین کیفیت و گارانتی کتبی ۳۰ روزه', '30-day written guarantee')}</span>
              </li>
              <li class="sidebar-trust-item">
                <span class="icon">${icons.checkCircle}</span>
                <span>${pick('اعزام تکنسین زیر ۴۵ دقیقه در محل', 'Dispatch under 45 minutes')}</span>
              </li>
              <li class="sidebar-trust-item">
                <span class="icon">${icons.checkCircle}</span>
                <span>${pick('بدون هزینه ایاب‌وذهاب در صورت انجام کار', 'No travel fee upon service')}</span>
              </li>
              <li class="sidebar-trust-item">
                <span class="icon">${icons.checkCircle}</span>
                <span>${pick('صدور فاکتور رسمی و کد رهگیری', 'Official invoice & tracking')}</span>
              </li>
            </ul>
          </div>

          <!-- Related Services in Category -->
          ${
            relatedServices.length > 0
              ? `
            <div class="sidebar-card">
              <h4 style="font-size: 1rem; font-weight: 800; color: #1e293b; margin: 0 0 1rem;">
                ${pick('سایر خدمات مرتبط در این دسته', 'Related Services')}
              </h4>
              <ul class="related-services-list">
                ${relatedServices.slice(0, 6).map((rel) => `
                  <li>
                    <a href="/services/${category.slug}/${rel.slug}" class="related-service-link">
                      <span>${pick(rel.name, rel.nameEn)}</span>
                      <span style="font-size: 0.75rem; color: #94a3b8;">${formatToman(rel.basePrice)}</span>
                    </a>
                  </li>
                `).join('')}
              </ul>
              <div style="margin-top: 1rem; text-align: center;">
                <a href="/services/${category.slug}" style="font-size: 0.82rem; font-weight: 700; color: #8B1C31; text-decoration: none;">
                  ${pick(`مشاهده همه خدمات ${category.title}`, `View all ${category.titleEn}`)} ←
                </a>
              </div>
            </div>
          `
              : ''
          }
        </aside>
      </div>

      <!-- FAQ Section if Category has FAQ -->
      ${
        category.faq && category.faq.length > 0
          ? `
        <section class="faq-section">
          <h3 class="faq-title">${pick('پرسش‌های متداول تکنسین‌های بهدون', 'Frequently Asked Questions')}</h3>
          <div class="faq-list">
            ${category.faq
              .map(
                (item) => `
              <div class="faq-item">
                <h4 class="faq-question">${item.q}</h4>
                <p class="faq-answer">${item.a}</p>
              </div>
            `
              )
              .join('')}
          </div>
        </section>
      `
          : ''
      }
    </div>
  `;
}

/**
 * رندر صفحه ۴۰۴ خدمت در صورت نبودن اسلاگ
 */
export function renderServiceNotFound(): string {
  return `
    <div class="services-page-container">
      <nav class="services-breadcrumb" aria-label="Breadcrumb">
        <a href="/">
          <span class="icon">${icons.home}</span>
          <span>${pick('خانه', 'Home')}</span>
        </a>
        <span class="separator">/</span>
        <a href="/services">
          <span>${pick('خدمات', 'Services')}</span>
        </a>
        <span class="separator">/</span>
        <span class="current">${pick('خدمت مورد نظر یافت نشد', 'Not Found')}</span>
      </nav>

      <div style="text-align: center; padding: 4rem 1rem; background: #fff; border-radius: 1.5rem; border: 1px solid #e2e8f0; margin-top: 1.5rem;">
        <div style="font-size: 4rem; font-weight: 900; color: #8B1C31; margin-bottom: 1rem;">۴۰۴</div>
        <h1 style="font-size: 1.5rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem;">
          ${pick('صفحه خدمت مورد نظر شما یافت نشد', 'Service Page Not Found')}
        </h1>
        <p style="color: #64748b; font-size: 0.95rem; max-width: 500px; margin: 0 auto 2rem; line-height: 1.7;">
          ${pick(
            'ممکن است آدرس وارد شده تغییر کرده باشد یا خدمت مورد نظر در فهرست دیگری دسته‌بندی شده باشد. می‌توانید از کاتالوگ جامع زیر استفاده کنید.',
            'The requested service address may have changed. Please browse our full catalog.'
          )}
        </p>
        <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
          <a href="/services" class="btn-hero-primary" style="text-decoration: none;">
            <span>${pick('مشاهده کاتالوگ همه خدمات بهدون', 'View All Services')}</span>
          </a>
          <a href="tel:${SUPPORT_PHONE}" class="btn-hero-call" style="color: #334155 !important; border-color: #cbd5e1; background: #f8fafc;">
            <span class="icon">${icons.phone}</span>
            <span>${pick('تماس با پشتیبانی بهدون', 'Contact Support')}</span>
          </a>
        </div>
      </div>
    </div>
  `;
}

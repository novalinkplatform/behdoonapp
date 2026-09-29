import { renderQuickActions, initQuickActions } from './components/QuickActions.ts';
import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/600.css';
import '@fontsource/vazirmatn/700.css';
import './styles/main.css';
import './styles/services.css';

import { renderHeader, initHeader } from './components/Header.ts';
import { renderFooter, initFooter } from './components/Footer.ts';
import { renderBottomNav, initBottomNav } from './components/BottomNav.ts';
import { renderSpecialistsSlider, initSpecialistsSlider } from './components/SpecialistsSlider.ts';
import { initRequestWizard, renderRequestWizardModal } from './sections/RequestWizard.ts';
import {
  renderServicesDirectoryView,
  renderCategoryPageView,
  renderSubServicePageView,
  renderServiceNotFound,
} from './sections/ServicePageView.ts';
import {
  findCategory,
  findSubService,
  findSubServiceByAnySlug,
} from './data/allServicesData.ts';
import { DEFAULT_VEHICLE_TYPES } from './data/services.ts';
import { loadSettings } from './utils/dynamicContent.ts';
import { applyTheme } from './utils/theme.ts';
import { applySiteSeoSettings } from './utils/seo.ts';
import { applyBranding, applySiteNameEverywhere } from './utils/branding.ts';
import { forceSiteLanguageIfSingleMode, hideLanguageToggleIfSingleMode } from './i18n/languageMode.ts';
import { markAppReady } from './utils/appReady.ts';
import { setGeocodeMapConfig } from './utils/geocode.ts';
import { pick } from './i18n/lang.ts';
import { initBehaviorTracking } from './utils/analytics.ts';

declare global {
  interface Window {
    openRequestModal?: (serviceName?: string) => void;
  }
}

/**
 * تجزیه و تحلیل مسیر URL جاری برای یافتن دسته یا زیرخدمت مرتبط
 */
function resolveCurrentRoute(): {
  type: 'directory' | 'category' | 'subservice' | 'not_found';
  category?: any;
  subService?: any;
} {
  let pathname = location.pathname;
  try {
    pathname = decodeURIComponent(pathname);
  } catch {
    // fallback
  }

  // حذف پسوند .html یا اسلش‌های انتهایی
  const cleanPath = pathname.replace(/\.html$/, '').replace(/\/+$/, '');
  const segments = cleanPath.split('/').filter(Boolean);

  // اگر مسیر /services یا خالی باشد -> دایرکتوری کلی
  if (segments.length === 0 || (segments.length === 1 && segments[0] === 'services')) {
    return { type: 'directory' };
  }

  // اگر فرمت /services/:part1 باشد
  if (segments.length === 2 && segments[0] === 'services') {
    const part1 = segments[1];

    // ۱. بررسی آیا part1 دسته‌بندی است؟
    const category = findCategory(part1);
    if (category) {
      return { type: 'category', category };
    }

    // ۲. بررسی آیا part1 یک زیرخدمت مستقیم است؟ (alias مانند /services/leak-detection)
    const foundSub = findSubServiceByAnySlug(part1);
    if (foundSub) {
      return { type: 'subservice', category: foundSub.category, subService: foundSub.subService };
    }

    return { type: 'not_found' };
  }

  // اگر فرمت /services/:category/:subservice باشد
  if (segments.length >= 3 && segments[0] === 'services') {
    const catPart = segments[1];
    const subPart = segments[2];

    const match = findSubService(catPart, subPart);
    if (match) {
      return { type: 'subservice', category: match.category, subService: match.subService };
    }

    // پشتیبانی در صورت تغییر دسته اما صحت نام زیرخدمت
    const fallbackSub = findSubServiceByAnySlug(subPart);
    if (fallbackSub) {
      return { type: 'subservice', category: fallbackSub.category, subService: fallbackSub.subService };
    }

    return { type: 'not_found' };
  }

  return { type: 'directory' };
}

function updateSeoMeta(route: ReturnType<typeof resolveCurrentRoute>, siteName: string) {
  const brand = siteName || 'بهدون';
  if (route.type === 'subservice' && route.subService) {
    document.title = `${route.subService.name} در تهران | ${brand}`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', route.subService.shortDesc || '');
  } else if (route.type === 'category' && route.category) {
    document.title = `${route.category.title} | ${brand}`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', route.category.metaDesc || '');
  } else if (route.type === 'directory') {
    document.title = `کاتالوگ کلیه خدمات تخصصی ساختمان در تهران | ${brand}`;
  }
}

async function init(): Promise<void> {
  initBehaviorTracking();
  const settings = await loadSettings();

  forceSiteLanguageIfSingleMode(settings.language_mode);
  applyTheme(settings.theme);
  applySiteSeoSettings(settings.seo);

  const vehicleTypes = settings.vehicle_types?.length ? settings.vehicle_types : DEFAULT_VEHICLE_TYPES;
  const route = resolveCurrentRoute();
  updateSeoMeta(route, settings.site_name?.fa || 'بهدون');

  let mainHtml = '';
  if (route.type === 'directory') {
    mainHtml = renderServicesDirectoryView(settings);
  } else if (route.type === 'category') {
    mainHtml = renderCategoryPageView(route.category, settings);
  } else if (route.type === 'subservice') {
    mainHtml = renderSubServicePageView(route.category, route.subService, settings);
  } else {
    mainHtml = renderServiceNotFound();
  }

  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) return;

  app.innerHTML = `
    <a class="skip-link" href="#main-content">${pick('رفتن به محتوای اصلی', 'Skip to main content')}</a>
    ${renderHeader(settings)}
    <main id="main-content">
      ${mainHtml}
    </main>
    ${renderSpecialistsSlider()}
    ${renderFooter(settings)}
    ${renderBottomNav()}
    ${renderQuickActions(settings)}
    ${renderRequestWizardModal(vehicleTypes, settings.service_cities, settings.service_categories, settings.site_name)}
  `;

  markAppReady();
  applyBranding(settings.branding);
  applySiteNameEverywhere(settings.site_name);
  hideLanguageToggleIfSingleMode(settings.language_mode);

  initHeader(settings);
  initFooter(settings);
  initSpecialistsSlider();
  initBottomNav();
  initQuickActions(settings);

  setGeocodeMapConfig(settings.map);
  const wizardController = initRequestWizard(vehicleTypes, settings.service_cities, settings.map, settings.site_name);

  // تعریف متد سراسری openRequestModal جهت سازگاری با کدهای قبلی
  window.openRequestModal = (serviceName?: string) => {
    if (!serviceName) {
      wizardController.openModal();
      return;
    }
    const match = findSubServiceByAnySlug(serviceName);
    if (match) {
      wizardController.openModal(match.category.id, match.subService.id);
    } else {
      wizardController.openModal();
    }
  };

  // اتصال دکمه‌های ثبت درخواست در سراسر صفحات خدمات
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    const btn = target.closest<HTMLElement>('[data-service-cat], [data-service-sub], [data-open-wizard], [data-order-service]');
    if (!btn) return;

    e.preventDefault();
    const catId = btn.getAttribute('data-service-cat') || (route.category ? route.category.id : undefined);
    const subId = btn.getAttribute('data-service-sub') || btn.getAttribute('data-order-service') || (route.subService ? route.subService.id : undefined);

    wizardController.openModal(catId, subId);
  });

  // فیلتر دسته‌بندی با کلیک روی قرص‌های ناوبری (Pills)
  const filterPills = document.querySelectorAll<HTMLButtonElement>('.services-filter-pill');
  const categoryCards = document.querySelectorAll<HTMLElement>('.directory-category-card');
  const searchInput = document.getElementById('services-live-search') as HTMLInputElement | null;
  const searchClearBtn = document.getElementById('services-search-clear') as HTMLButtonElement | null;
  const searchStatus = document.getElementById('services-search-status');
  const emptyState = document.getElementById('services-empty-state');
  const resetSearchBtn = document.getElementById('btn-reset-search');

  function applyFilters() {
    const q = (searchInput?.value || '').trim().toLowerCase();
    const activePill = document.querySelector<HTMLButtonElement>('.services-filter-pill.active');
    const selectedCat = activePill?.getAttribute('data-filter-cat') || 'all';

    let totalVisible = 0;

    categoryCards.forEach((catCard) => {
      const catId = catCard.getAttribute('data-category-section');
      const matchesCat = selectedCat === 'all' || selectedCat === catId;

      if (!matchesCat) {
        catCard.style.display = 'none';
        return;
      }

      const cards = catCard.querySelectorAll<HTMLElement>('.subservice-card');
      let catVisibleCount = 0;

      cards.forEach((card) => {
        const text = card.getAttribute('data-search-text')?.toLowerCase() || '';
        const isMatch = !q || text.includes(q);
        card.style.display = isMatch ? '' : 'none';
        if (isMatch) catVisibleCount++;
      });

      catCard.style.display = catVisibleCount > 0 ? '' : 'none';
      totalVisible += catVisibleCount;
    });

    if (searchClearBtn) {
      searchClearBtn.style.display = q ? 'flex' : 'none';
    }

    if (searchStatus) {
      if (q) {
        searchStatus.textContent = `${totalVisible} خدمت مرتبط با «${q}» یافت شد`;
      } else {
        searchStatus.textContent = '';
      }
    }

    if (emptyState) {
      emptyState.style.display = totalVisible === 0 ? 'block' : 'none';
    }
  }

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      applyFilters();

      const catId = pill.getAttribute('data-filter-cat');
      if (catId && catId !== 'all') {
        const targetCard = document.querySelector<HTMLElement>(`[data-category-section="${catId}"]`);
        if (targetCard) {
          const headerOffset = 130;
          const elementPosition = targetCard.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - headerOffset,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      applyFilters();
    });
  }

  if (resetSearchBtn) {
    resetSearchBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
      }
      filterPills.forEach((p) => {
        if (p.getAttribute('data-filter-cat') === 'all') p.classList.add('active');
        else p.classList.remove('active');
      });
      applyFilters();
    });
  }
}

init();

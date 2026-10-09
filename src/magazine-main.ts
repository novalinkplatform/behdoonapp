import { renderQuickActions, initQuickActions } from './components/QuickActions.ts';
import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/600.css';
import '@fontsource/vazirmatn/700.css';
import './styles/main.css';

import { renderHeader, initHeader } from './components/Header.ts';
import { renderFooter, initFooter } from './components/Footer.ts';
import { renderBottomNav, initBottomNav } from './components/BottomNav.ts';
import { renderMagazineIndex, initMagazineIndex } from './sections/MagazineIndex.ts';
import { initRequestWizard, renderRequestWizardModal } from './sections/RequestWizard.ts';
import { DEFAULT_VEHICLE_TYPES } from './data/services.ts';
import { setGeocodeMapConfig } from './utils/geocode.ts';
import { initLangToggle } from './components/LangToggle.ts';
import { bootstrapI18n } from './i18n/bootstrap.ts';
import { initBehaviorTracking } from './utils/analytics.ts';
import { pick } from './i18n/lang.ts';
import { fetchPublicArticles, loadSettings } from './utils/dynamicContent.ts';
import type { DynamicArticle } from './utils/dynamicContent.ts';
import { applyTheme } from './utils/theme.ts';
import { applySiteSeoSettings } from './utils/seo.ts';
import { applyBranding, applySiteNameEverywhere } from './utils/branding.ts';
import { forceSiteLanguageIfSingleMode, hideLanguageToggleIfSingleMode } from './i18n/languageMode.ts';
import { markAppReady } from './utils/appReady.ts';

declare global {
  interface Window {
    openRequestModal?: (param1?: string, param2?: string) => void;
  }
}

function renderApp(
  articles: DynamicArticle[],
  settings: Awaited<ReturnType<typeof loadSettings>>,
  vehicleTypes: typeof DEFAULT_VEHICLE_TYPES
): void {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) return;

  app.innerHTML = `
    <a class="skip-link" href="#main-content">${pick('رفتن به محتوای اصلی', 'Skip to main content')}</a>
    ${renderHeader(settings)}
    <main id="main-content">
      ${renderMagazineIndex(articles)}
    </main>
    ${renderFooter(settings)}
    ${renderBottomNav()}
    ${renderQuickActions(settings)}
    ${renderRequestWizardModal(vehicleTypes, settings.service_cities, settings.service_categories, settings.site_name)}
  `;
}

async function init(): Promise<void> {
  initBehaviorTracking();
  const [articles, settings] = await Promise.all([fetchPublicArticles(), loadSettings()]);
  forceSiteLanguageIfSingleMode(settings.language_mode);
  applyTheme(settings.theme);
  applySiteSeoSettings(settings.seo);

  const vehicleTypes = settings.vehicle_types?.length ? settings.vehicle_types : DEFAULT_VEHICLE_TYPES;
  renderApp(articles, settings, vehicleTypes);
  markAppReady();
  applyBranding(settings.branding);
  applySiteNameEverywhere(settings.site_name);
  hideLanguageToggleIfSingleMode(settings.language_mode);

  initHeader(settings);
  initFooter(settings);
  initBottomNav();
  initLangToggle();
  initQuickActions(settings);
  initMagazineIndex();

  setGeocodeMapConfig(settings.map);
  const wizardController = initRequestWizard(vehicleTypes, settings.service_cities, settings.map, settings.site_name);

  // تعریف متد سراسری باز کردن مودال ثبت درخواست
  window.openRequestModal = (param1?: string, param2?: string) => {
    wizardController.openModal(param1, param2);
  };

  // اتصال سراسری کلیک روی تمامی دکمه‌های ثبت درخواست در صفحه مجله
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    const btn = target.closest<HTMLElement>(
      '[data-service-cat], [data-service-sub], [data-open-wizard], [data-order-service], .btn-order, .service-order-trigger, .header-cta, .btn-hero-primary, .request-wizard-open-trigger, a[href="#request"], a[href="/#request"]'
    );
    if (!btn || btn.closest('#request-wizard-modal')) return;

    e.preventDefault();
    const catId = btn.getAttribute('data-service-cat') || btn.getAttribute('data-service-id') || undefined;
    const subId = btn.getAttribute('data-service-sub') || btn.getAttribute('data-order-service') || btn.getAttribute('data-vehicle-id') || undefined;
    wizardController.openModal(catId, subId);
  });
}

bootstrapI18n(() => void init());

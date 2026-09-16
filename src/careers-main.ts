import { renderQuickActions, initQuickActions } from './components/QuickActions.ts';
import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/600.css';
import '@fontsource/vazirmatn/700.css';
import './styles/main.css';

import { renderHeader, initHeader } from './components/Header.ts';
import { renderFooter, initFooter } from './components/Footer.ts';
import { renderBottomNav, initBottomNav } from './components/BottomNav.ts';
import { renderCareersView, initCareersView } from './sections/CareersView.ts';
import { loadSettings } from './utils/dynamicContent.ts';
import { applyTheme } from './utils/theme.ts';
import { applySiteSeoSettings } from './utils/seo.ts';
import { applyBranding, applySiteNameEverywhere } from './utils/branding.ts';
import { forceSiteLanguageIfSingleMode, hideLanguageToggleIfSingleMode } from './i18n/languageMode.ts';
import { initLangToggle } from './components/LangToggle.ts';
import { bootstrapI18n } from './i18n/bootstrap.ts';
import { initBehaviorTracking } from './utils/analytics.ts';
import { pick } from './i18n/lang.ts';
import { DEFAULT_VEHICLE_TYPES } from './data/services.ts';
import { markAppReady } from './utils/appReady.ts';

function renderApp(settings: Awaited<ReturnType<typeof loadSettings>>): void {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) return;

  const vehicleTypes = settings.vehicle_types?.length ? settings.vehicle_types : DEFAULT_VEHICLE_TYPES;

  app.innerHTML = `
    <a class="skip-link" href="#main-content">${pick('رفتن به محتوای اصلی', 'Skip to main content')}</a>
    ${renderHeader(settings)}
    <main id="main-content">
      ${renderCareersView(vehicleTypes, settings.career_positions, settings.site_name)}
    </main>
    ${renderFooter(settings)}
    ${renderBottomNav()}
    ${renderQuickActions(settings)}
  `;
}

async function init(): Promise<void> {
  initBehaviorTracking();
  const settings = await loadSettings();
  forceSiteLanguageIfSingleMode(settings.language_mode);
  applyTheme(settings.theme);
  applySiteSeoSettings(settings.seo);
  renderApp(settings);
  markAppReady();
  applyBranding(settings.branding);
  applySiteNameEverywhere(settings.site_name);
  hideLanguageToggleIfSingleMode(settings.language_mode);
  initHeader(settings);
  initFooter(settings);
  initBottomNav();
  initLangToggle();
  initQuickActions(settings);
  initCareersView();
}

bootstrapI18n(() => void init());

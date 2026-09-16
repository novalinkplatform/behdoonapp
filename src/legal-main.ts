import { renderQuickActions, initQuickActions } from './components/QuickActions.ts';
import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/600.css';
import '@fontsource/vazirmatn/700.css';
import './styles/main.css';

import { renderHeader, initHeader } from './components/Header.ts';
import { renderFooter, initFooter } from './components/Footer.ts';
import { renderBottomNav, initBottomNav } from './components/BottomNav.ts';
import { renderLegalPageView } from './sections/LegalPageView.ts';
import { loadSettings } from './utils/dynamicContent.ts';
import type { LegalPage } from './utils/dynamicContent.ts';
import { applyTheme } from './utils/theme.ts';
import { applySiteSeoSettings } from './utils/seo.ts';
import { applyBranding, applySiteNameEverywhere } from './utils/branding.ts';
import { forceSiteLanguageIfSingleMode, hideLanguageToggleIfSingleMode } from './i18n/languageMode.ts';
import { initLangToggle } from './components/LangToggle.ts';
import { bootstrapI18n } from './i18n/bootstrap.ts';
import { initBehaviorTracking } from './utils/analytics.ts';
import { pick } from './i18n/lang.ts';
import { markAppReady } from './utils/appReady.ts';

function currentSlug(): LegalPage['slug'] {
  if (location.pathname.startsWith('/terms')) return 'terms';
  if (location.pathname.startsWith('/privacy')) return 'privacy';
  return 'about';
}

function renderApp(page: LegalPage | null, settings: Awaited<ReturnType<typeof loadSettings>>): void {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) return;

  app.innerHTML = `
    <a class="skip-link" href="#main-content">${pick('رفتن به محتوای اصلی', 'Skip to main content')}</a>
    ${renderHeader(settings)}
    <main id="main-content">
      ${
        page
          ? renderLegalPageView(page)
          : `<div class="container legal-container"><p class="orders-empty">${pick('خطا در بارگذاری این صفحه.', 'Failed to load this page.')}</p></div>`
      }
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
  const page = settings.legal_pages?.[currentSlug()] ?? null;
  renderApp(page, settings);
  markAppReady();
  applyBranding(settings.branding);
  applySiteNameEverywhere(settings.site_name);
  hideLanguageToggleIfSingleMode(settings.language_mode);
  initHeader(settings);
  initFooter(settings);
  initBottomNav();
  initLangToggle();
  initQuickActions(settings);
}

bootstrapI18n(() => void init());

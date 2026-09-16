import { renderQuickActions, initQuickActions } from './components/QuickActions.ts';
import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/600.css';
import '@fontsource/vazirmatn/700.css';
import './styles/main.css';

import { renderHeader, initHeader } from './components/Header.ts';
import { renderFooter, initFooter } from './components/Footer.ts';
import { renderBottomNav, initBottomNav } from './components/BottomNav.ts';
import { renderPageView, renderPageNotFound } from './sections/PageView.ts';
import { initLangToggle } from './components/LangToggle.ts';
import { bootstrapI18n } from './i18n/bootstrap.ts';
import { initBehaviorTracking } from './utils/analytics.ts';
import { pick } from './i18n/lang.ts';
import { fetchPublicPage, loadSettings } from './utils/dynamicContent.ts';
import type { DynamicCustomPage } from './utils/dynamicContent.ts';
import { applyTheme } from './utils/theme.ts';
import { applySiteSeoSettings, applyPageSeo } from './utils/seo.ts';
import { applyBranding, applySiteNameEverywhere } from './utils/branding.ts';
import { forceSiteLanguageIfSingleMode, hideLanguageToggleIfSingleMode } from './i18n/languageMode.ts';
import { markAppReady } from './utils/appReady.ts';

function currentSlug(): string {
  const match = location.pathname.match(/^\/(?:p|page)\/([^/?#]+)/);
  if (match) return decodeURIComponent(match[1]);
  const urlParams = new URLSearchParams(location.search);
  const qSlug = urlParams.get('slug');
  return qSlug ? decodeURIComponent(qSlug) : '';
}

function renderApp(page: DynamicCustomPage | null, settings: Awaited<ReturnType<typeof loadSettings>>): void {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) return;

  app.innerHTML = `
    <a class="skip-link" href="#main-content">${pick('رفتن به محتوای اصلی', 'Skip to main content')}</a>
    ${renderHeader(settings)}
    <main id="main-content">
      ${page ? renderPageView(page) : renderPageNotFound()}
    </main>
    ${renderFooter(settings)}
    ${renderBottomNav()}
    ${renderQuickActions(settings)}
  `;
}

async function init(): Promise<void> {
  initBehaviorTracking();
  const slug = currentSlug();
  const [page, settings] = await Promise.all([slug ? fetchPublicPage(slug) : Promise.resolve(null), loadSettings()]);
  forceSiteLanguageIfSingleMode(settings.language_mode);
  applyTheme(settings.theme);
  applySiteSeoSettings(settings.seo);
  if (page) applyPageSeo(page);
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

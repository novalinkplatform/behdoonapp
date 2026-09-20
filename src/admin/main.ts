import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/600.css';
import '@fontsource/vazirmatn/700.css';
import './styles/main.css';

import { renderLoginView, initLoginView } from './views/LoginView.ts';
import { renderShell } from './components/Shell.ts';
import { renderPipelineView, initPipelineView } from './views/PipelineView.ts';
import {
  renderDashboardView,
  initDashboardView,
  renderDashboardOrdersView,
  initDashboardOrdersView,
  renderDashboardVisitorsView,
  initDashboardVisitorsView,
  renderDashboardStaffView,
  initDashboardStaffView,
} from './views/DashboardView.ts';
import { renderMapView, initMapView } from './views/MapView.ts';
import { renderStaffView, initStaffView } from './views/StaffView.ts';
import { renderStaffHistoryView, initStaffHistoryView } from './views/StaffHistoryView.ts';
import { renderMediaManagementView, initMediaManagementView } from './views/MediaManagementView.ts';
import { renderRolesView, initRolesView } from './views/RolesView.ts';
import type { StaffRecord } from './utils/api.ts';
import { renderStaffPortalView, initStaffPortalView } from './views/StaffPortalView.ts';
import { renderMagazineListView, initMagazineListView } from './views/MagazineListView.ts';
import { renderArticleEditorView, initArticleEditorView } from './views/ArticleEditorView.ts';
import { renderPageEditorView, initPageEditorView } from './views/PageEditorView.ts';
import { renderTestimonialsView, initTestimonialsView } from './views/TestimonialsView.ts';
import { renderChatView, initChatView } from './views/ChatView.ts';
import { renderStoriesView, initStoriesView } from './views/StoriesView.ts';
import { renderServicesManagerView, initServicesManagerView } from './views/ServicesManagerView.ts';
import { renderSlidersManagerView, initSlidersManagerView } from './views/SlidersManagerView.ts';
import { renderContactManagerView, initContactManagerView } from './views/ContactManagerView.ts';
import { renderJobApplicationsView, initJobApplicationsView } from './views/JobApplicationsView.ts';
import { renderActivityLogView, initActivityLogView } from './views/ActivityLogView.ts';
import { renderSettingsView, initSettingsView } from './views/SettingsView.ts';
import { renderPluginsView, initPluginsView } from './views/PluginsView.ts';
import { renderSetupWizardView, initSetupWizardView, needsSetupWizard } from './views/SetupWizardView.ts';
import { renderSeoManagementView, initSeoManagementView } from './views/SeoManagementView.ts';
import { renderAccountSecurityView, initAccountSecurityView } from './views/AccountSecurityView.ts';
import { renderMyWalletView, initMyWalletView } from './views/MyWalletView.ts';
import { renderPayrollView, initPayrollView } from './views/PayrollView.ts';
import { renderFinanceView, initFinanceView } from './views/FinanceView.ts';
import {
  renderHomeView,
  renderRequestsHomeView,
  renderContentHomeView,
  renderPersonnelHomeView,
  wireHomeTiles,
} from './views/HomeView.ts';
import { initAiWidget } from './components/AiWidget.ts';
import {
  isAuthenticated,
  isPanelRole,
  hasPermission,
  clearSession,
  getStaff,
  saveSession,
  getToken,
  saveScreenState,
  getScreenState,
} from './utils/auth.ts';
import type { StaffInfo } from './utils/auth.ts';
import { setUnauthorizedHandler, logout, fetchMe, fetchVersion, fetchSettings } from './utils/api.ts';
import { ensureLanguageMode } from './utils/languageMode.ts';
import { applySiteNameToAdminChrome } from './utils/siteName.ts';

type AdminView = 'contact-manager' |
  'pipeline'
  | 'map'
  | 'staff'
  | 'services'
  | 'sliders'
  | 'magazine'
  | 'magazine-editor'
  | 'pages'
  | 'page-editor'
  | 'testimonials'
  | 'chat'
  | 'stories'
  | 'jobApplications'
  | 'settings'
  | 'plugins'
  | 'seo'
  | 'dashboardOrders'
  | 'dashboardVisitors'
  | 'dashboardStaff'
  | 'staffHistory'
  | 'media'
  | 'roles'
  | 'activityLog'
  | 'accountSecurity'
  | 'myWallet'
  | 'payroll'
  | 'finance';
type AdminScreen = 'home' | 'requests' | 'content' | 'personnel' | 'dashboard' | AdminView;

// صفحه‌ی خانه با کاشی‌های شبکه‌ای جایگزین فهرست کناری قبلی شده؛ این نگاشت مشخص می‌کند دکمه‌ی «بازگشت»
// از هر صفحه به کدام صفحه‌ی والد برمی‌گردد (پایپ‌لاین/نقشه زیرمجموعه‌ی «درخواست‌ها»، مجله/نظرات/استوری/سئو
// زیرمجموعه‌ی «مدیریت محتوا»، کارمندان/فرصت‌های شغلی زیرمجموعه‌ی «مدیریت پرسنل»، و سفارش‌ها/بازدیدکنندگان/
// عملکرد کارمندان زیرمجموعه‌ی «آمار و گزارش» هستند).
function screenParent(screen: AdminScreen): AdminScreen | null {
  if (screen === 'home') return null;
  if (screen === 'requests' || screen === 'content' || screen === 'personnel' || screen === 'dashboard' || screen === 'settings' || screen === 'plugins' || screen === 'chat' || screen === 'finance' || screen === 'services') return 'home';
  if (screen === 'pipeline' || screen === 'map') return 'requests';
  if (screen === 'magazine' || screen === 'testimonials' || screen === 'stories' || screen === 'seo' || screen === 'media' || screen === 'sliders') return 'content';
  if (screen === 'staff' || screen === 'jobApplications' || screen === 'roles' || screen === 'activityLog' || screen === 'payroll') return 'personnel';
  if (screen === 'staffHistory') return 'staff';
  if (screen === 'dashboardOrders' || screen === 'dashboardVisitors' || screen === 'dashboardStaff') return 'dashboard';
  if (screen === 'magazine-editor') return 'magazine';
  if (screen === 'page-editor' || screen === 'pages') return 'settings';
  return 'home';
}

function getApp(): HTMLElement {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) throw new Error('#app not found');
  return app;
}

function showLogin(): void {
  const app = getApp();
  app.innerHTML = renderLoginView();
  initLoginView(routeAfterLogin);
  void applySiteNameToAdminChrome();
}

const SCREEN_TO_PATH: Record<AdminScreen, string> = {
  home: '',
  dashboard: 'dashboard',
  requests: 'requests',
  pipeline: 'pipeline',
  map: 'map',
  chat: 'chat',
  content: 'content',
  personnel: 'personnel',
  settings: 'settings',
  plugins: 'plugins',
  seo: 'seo',
  media: 'media',
  staff: 'staff',
  roles: 'roles',
  testimonials: 'testimonials',
  stories: 'stories',
  services: 'services',
  sliders: 'sliders',
  'contact-manager': 'home',
  jobApplications: 'job-applications',
  activityLog: 'activity-log',
  accountSecurity: 'account-security',
  myWallet: 'wallet',
  payroll: 'payroll',
  finance: 'finance',
  magazine: 'magazine',
  'magazine-editor': 'magazine-editor',
  pages: 'settings',
  'page-editor': 'page-editor',
  dashboardOrders: 'dashboard/orders',
  dashboardVisitors: 'dashboard/visitors',
  dashboardStaff: 'dashboard/staff',
  staffHistory: 'staff/history',
};

const PATH_TO_SCREEN: Record<string, AdminScreen> = {
  '': 'home',
  dashboard: 'dashboard',
  requests: 'requests',
  pipeline: 'pipeline',
  map: 'map',
  finance: 'finance',
  chat: 'chat',
  content: 'content',
  personnel: 'personnel',
  settings: 'settings',
  plugins: 'plugins',
  seo: 'seo',
  media: 'media',
  staff: 'staff',
  roles: 'roles',
  testimonials: 'testimonials',
  stories: 'stories',
  services: 'services',
  sliders: 'sliders',
  'contact-manager': 'home',
  'job-applications': 'jobApplications',
  'activity-log': 'activityLog',
  'account-security': 'accountSecurity',
  wallet: 'myWallet',
  payroll: 'payroll',
  magazine: 'magazine',
  'magazine-editor': 'magazine-editor',
  'page-editor': 'page-editor',
  'dashboard/orders': 'dashboardOrders',
  'dashboard/visitors': 'dashboardVisitors',
  'dashboard/staff': 'dashboardStaff',
  'staff/history': 'staffHistory',
};

function getScreenFromUrl(): { screen: AdminScreen; detailId?: number | null } | null {
  const pathname = window.location.pathname;
  const normalized = pathname.replace(/^\/(?:management|admin)\/?/, '').replace(/\/+$/, '');
  if (!normalized) return { screen: 'home' };

  if (PATH_TO_SCREEN[normalized]) {
    return { screen: PATH_TO_SCREEN[normalized] };
  }

  const parts = normalized.split('/');
  if (parts.length === 2 && (parts[0] === 'magazine-editor' || parts[0] === 'page-editor')) {
    const screen = parts[0] as AdminScreen;
    const id = parseInt(parts[1], 10);
    return { screen, detailId: isNaN(id) ? null : id };
  }

  return null;
}

function updateBrowserUrl(screen: AdminScreen, editingDetailId: number | null = null): void {
  const subpath = SCREEN_TO_PATH[screen] ?? '';
  let fullSubpath = subpath;
  if ((screen === 'magazine-editor' || screen === 'page-editor') && editingDetailId) {
    fullSubpath = `${subpath}/${editingDetailId}`;
  }
  const targetUrl = fullSubpath ? `/management/${fullSubpath}` : '/management/';
  if (window.location.pathname !== targetUrl) {
    window.history.pushState({ screen, editingDetailId }, '', targetUrl);
  }
}

let currentScreen: AdminScreen = 'home';
let viewingStaffHistory: StaffRecord | null = null;

function showScreen(screen: AdminScreen, editingDetailId: number | null = null, syncUrl = true): void {
  const container = document.getElementById('view-container');
  const backBtn = document.getElementById('admin-back-btn') as HTMLButtonElement | null;
  const staff = getStaff();
  if (!container || !staff) return;

  currentScreen = screen;
  if (backBtn) backBtn.hidden = screen === 'home';
  saveScreenState({
    screen,
    extra: (screen === 'magazine-editor' || screen === 'page-editor') ? editingDetailId : screen === 'staffHistory' ? viewingStaffHistory : undefined,
  });

  if (syncUrl) {
    updateBrowserUrl(screen, editingDetailId);
  }

  if (screen === 'home') {
    container.innerHTML = renderHomeView(staff);
    wireHomeTiles(container, (view) => showScreen(view as AdminScreen));
  } else if (screen === 'requests') {
    container.innerHTML = renderRequestsHomeView(staff);
    wireHomeTiles(container, (view) => showScreen(view as AdminScreen));
  } else if (screen === 'content') {
    container.innerHTML = renderContentHomeView(staff);
    wireHomeTiles(container, (view) => showScreen(view as AdminScreen));
  } else if (screen === 'personnel') {
    container.innerHTML = renderPersonnelHomeView(staff);
    wireHomeTiles(container, (view) => showScreen(view as AdminScreen));
  } else if (screen === 'dashboard') {
    container.innerHTML = renderDashboardView();
    initDashboardView((view) => showScreen(view as AdminScreen));
  } else if (screen === 'dashboardOrders') {
    container.innerHTML = renderDashboardOrdersView();
    initDashboardOrdersView();
  } else if (screen === 'dashboardVisitors') {
    container.innerHTML = renderDashboardVisitorsView();
    initDashboardVisitorsView();
  } else if (screen === 'dashboardStaff') {
    container.innerHTML = renderDashboardStaffView();
    initDashboardStaffView();
  } else if (screen === 'pipeline') {
    container.innerHTML = renderPipelineView();
    initPipelineView();
  } else if (screen === 'map') {
    container.innerHTML = renderMapView();
    initMapView();
  } else if (screen === 'staff') {
    container.innerHTML = renderStaffView();
    initStaffView((staffMember) => {
      viewingStaffHistory = staffMember;
      showScreen('staffHistory');
    });
  } else if (screen === 'staffHistory') {
    if (!viewingStaffHistory) {
      showScreen('staff');
      return;
    }
    container.innerHTML = renderStaffHistoryView(viewingStaffHistory);
    initStaffHistoryView(viewingStaffHistory);
  } else if (screen === 'magazine') {
    container.innerHTML = renderMagazineListView();
    initMagazineListView((id) => showScreen('magazine-editor', id));
  } else if (screen === 'magazine-editor') {
    container.innerHTML = renderArticleEditorView();
    initArticleEditorView(editingDetailId, () => showScreen('magazine'));
  } else if (screen === 'pages') {
    showScreen('settings');
    return;
  } else if (screen === 'page-editor') {
    container.innerHTML = renderPageEditorView();
    initPageEditorView(editingDetailId, () => showScreen('settings'));
  } else if (screen === 'testimonials') {
    container.innerHTML = renderTestimonialsView();
    initTestimonialsView();
  } else if (screen === 'chat') {
    container.innerHTML = renderChatView();
    initChatView();
  } else if (screen === 'stories') {
    container.innerHTML = renderStoriesView();
    initStoriesView();
  } else if (screen === 'services') {
    container.innerHTML = renderServicesManagerView();
    initServicesManagerView();
  } else if (screen === 'contact-manager') {
    container.innerHTML = renderContactManagerView();
    initContactManagerView();
  } else if (screen === 'sliders') {
    container.innerHTML = renderSlidersManagerView();
    initSlidersManagerView();
  } else if (screen === 'jobApplications') {
    container.innerHTML = renderJobApplicationsView();
    initJobApplicationsView();
  } else if (screen === 'settings') {
    container.innerHTML = renderSettingsView();
    initSettingsView((targetScreen, detail) => showScreen(targetScreen as AdminScreen, (detail as number) ?? null));
  } else if (screen === 'plugins') {
    container.innerHTML = renderPluginsView();
    initPluginsView();
  } else if (screen === 'seo') {
    container.innerHTML = renderSeoManagementView();
    initSeoManagementView((id) => showScreen('magazine-editor', id));
  } else if (screen === 'media') {
    container.innerHTML = renderMediaManagementView();
    initMediaManagementView();
  } else if (screen === 'roles') {
    container.innerHTML = renderRolesView();
    initRolesView();
  } else if (screen === 'activityLog') {
    container.innerHTML = renderActivityLogView();
    initActivityLogView();
  } else if (screen === 'accountSecurity') {
    container.innerHTML = renderAccountSecurityView();
    initAccountSecurityView();
  } else if (screen === 'myWallet') {
    container.innerHTML = renderMyWalletView();
    initMyWalletView();
  } else if (screen === 'payroll') {
    container.innerHTML = renderPayrollView();
    initPayrollView();
  } else if (screen === 'finance') {
    container.innerHTML = renderFinanceView(staff);
    initFinanceView();
  } else {
    container.innerHTML = renderHomeView(staff);
    wireHomeTiles(container, (view) => showScreen(view as AdminScreen));
  }
}

function showAdminShell(staff: StaffInfo, restore = false): void {
  const app = getApp();
  app.innerHTML = renderShell(staff);

  document.getElementById('admin-back-btn')?.addEventListener('click', () => {
    const parent = screenParent(currentScreen);
    if (parent) showScreen(parent);
  });

  document.getElementById('logout-btn')?.addEventListener('click', () => {
    void logout();
    clearSession();
    showLogin();
  });

  document.getElementById('admin-account-btn')?.addEventListener('click', () => showScreen('accountSecurity'));

  function updateThemeToggleUI(): void {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const sunIcon = document.getElementById('admin-theme-sun');
    const moonIcon = document.getElementById('admin-theme-moon');
    if (sunIcon && moonIcon) {
      sunIcon.hidden = !isDark;
      moonIcon.hidden = isDark;
    }
  }

  updateThemeToggleUI();

  document.getElementById('admin-theme-toggle-btn')?.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('behbar_admin_theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('behdoon_admin_theme', 'dark');
      localStorage.setItem('behbar_admin_theme', 'dark');
    }
    updateThemeToggleUI();
  });

  // کلیک روی نشان بهدون -> بازگشت به صفحه مدیریت خالص (/management/)
  document.getElementById('admin-logo-btn')?.addEventListener('click', () => {
    showScreen('home');
  });

  // ناوبری با دکمه‌های بازگشت و جلو مرورگر (History Popstate)
  window.addEventListener('popstate', (event) => {
    const state = event.state as { screen?: AdminScreen; editingDetailId?: number | null } | null;
    if (state?.screen) {
      showScreen(state.screen, state.editingDetailId ?? null, false);
    } else {
      const fromUrl = getScreenFromUrl();
      if (fromUrl) {
        showScreen(fromUrl.screen, fromUrl.detailId ?? null, false);
      } else {
        showScreen('home', null, false);
      }
    }
  });

  if (hasPermission(staff, 'settings')) void loadSidebarVersion();
  void loadSidebarBranding();
  void ensureLanguageMode();
  void applySiteNameToAdminChrome();
  if (hasPermission(staff, 'ai')) initAiWidget();

  const fromUrl = getScreenFromUrl();
  const saved = restore ? getScreenState() : null;

  if (fromUrl && fromUrl.screen !== 'home') {
    showScreen(fromUrl.screen, fromUrl.detailId ?? null, false);
  } else if (saved?.screen === 'staffHistory' && saved.extra) {
    viewingStaffHistory = saved.extra as StaffRecord;
    showScreen('staffHistory');
  } else if (saved?.screen === 'magazine-editor') {
    showScreen('magazine-editor', (saved.extra as number | null) ?? null);
  } else if (saved?.screen === 'page-editor') {
    showScreen('page-editor', (saved.extra as number | null) ?? null);
  } else if (saved?.screen && saved.screen !== 'home') {
    showScreen(saved.screen as AdminScreen);
  } else {
    showScreen('home', null, true);
  }
}

async function loadSidebarBranding(): Promise<void> {
  try {
    const settings = await fetchSettings();
    const branding = settings.branding as { logoUrl?: string; faviconUrl?: string } | undefined;
    const logoUrl = branding?.logoUrl;
    if (logoUrl) {
      document.querySelectorAll<HTMLImageElement>('.admin-logo-mark').forEach((img) => (img.src = logoUrl));
    }
    const faviconUrl = branding?.faviconUrl || logoUrl;
    if (faviconUrl) {
      document.querySelectorAll<HTMLLinkElement>('link[rel="icon"]').forEach((link) => (link.href = faviconUrl));
    }
    const siteName = settings.site_name as { fa?: string; en?: string } | undefined;
    if (siteName?.fa?.trim()) {
      document.title = `${siteName.fa.trim()} - پنل مدیریت`;
      document.querySelectorAll<HTMLElement>('.admin-logo-title').forEach((el) => (el.textContent = siteName.fa!.trim()));
    }
  } catch {
    /* بی‌اهمیت — لوگوی پیش‌فرض همان‌طور می‌ماند. */
  }
}

async function loadSidebarVersion(): Promise<void> {
  const el = document.getElementById('admin-sidebar-version');
  if (!el) return;
  try {
    const version = await fetchVersion();
    el.textContent = version.updateAvailable ? `نسخه ${version.current} · نسخه جدید موجود است` : `نسخه ${version.current}`;
    el.classList.toggle('has-update', version.updateAvailable);
    el.hidden = false;
  } catch {
    /* بی‌اهمیت — اگر نسخه لود نشد، فقط نمایش داده نمی‌شود. */
  }
}

function showStaffPortal(staff: StaffInfo): void {
  const app = getApp();
  app.innerHTML = renderStaffPortalView(staff);
  void applySiteNameToAdminChrome();
  initStaffPortalView(() => {
    void logout();
    clearSession();
    showLogin();
  });
}

function showSetupWizard(staff: StaffInfo): void {
  const app = getApp();
  app.innerHTML = renderSetupWizardView();
  void applySiteNameToAdminChrome();
  initSetupWizardView(staff, () => showAdminShell(staff));
}

function routeAfterLogin(staff: StaffInfo, restore = false): void {
  if (!isPanelRole(staff)) {
    showStaffPortal(staff);
    return;
  }
  if (!hasPermission(staff, 'settings')) {
    showAdminShell(staff, restore);
    return;
  }
  fetchSettings()
    .then((settings) => {
      if (needsSetupWizard(settings)) showSetupWizard(staff);
      else showAdminShell(staff, restore);
    })
    .catch(() => showAdminShell(staff, restore));
}

function init(): void {
  setUnauthorizedHandler(showLogin);
  if (!isAuthenticated()) {
    showLogin();
    return;
  }

  // با رفرش کردن صفحه (نه یک ورود تازه)، کاربر باید همان صفحه‌ای که بود را ببیند، نه صفحه‌ی خانه.
  const cached = getStaff();
  if (cached) routeAfterLogin(cached, true);
  else showLogin();

  fetchMe()
    .then((fresh) => {
      const token = getToken();
      if (!token) return;
      saveSession(token, fresh);
      if (!cached || cached.role !== fresh.role) routeAfterLogin(fresh, true);
    })
    .catch(() => {
      /* onUnauthorized handler already redirects to login on 401 */
    });
}

// Prevent page title (such as "پنل مدیریت بهدون") from ever appearing on PDF/print header
let originalAdminDocTitle = '';
window.addEventListener('beforeprint', () => {
  originalAdminDocTitle = document.title;
  document.title = ' ';
});
window.addEventListener('afterprint', () => {
  if (originalAdminDocTitle) {
    document.title = originalAdminDocTitle;
  }
});

init();

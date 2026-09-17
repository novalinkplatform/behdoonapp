import { renderQuickActions, initQuickActions } from './components/QuickActions.ts';
import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/600.css';
import '@fontsource/vazirmatn/700.css';
import './styles/main.css';

import { renderHeader, initHeader } from './components/Header.ts';
import { renderFooter, initFooter } from './components/Footer.ts';
import { renderHero } from './sections/Hero.ts';
import { renderContentBlock, initContentBlocks } from './sections/ContentBlock.ts';
import { initRequestWizard, renderRequestWizardModal } from './sections/RequestWizard.ts';
import { initServiceCategoriesAccordion } from './components/ServiceCategoriesAccordion.ts';
import { renderBottomNav, initBottomNav } from './components/BottomNav.ts';
import { renderDemoBadges } from './components/DemoBadges.ts';
import { renderStoriesStrip, initStoriesStrip } from './components/StoriesStrip.ts';
import { initLangToggle } from './components/LangToggle.ts';
import { bootstrapI18n } from './i18n/bootstrap.ts';
import { initBehaviorTracking } from './utils/analytics.ts';
import { pick } from './i18n/lang.ts';
import { loadSettings, fetchPublicTestimonials, fetchPublicStories } from './utils/dynamicContent.ts';
import type { PublicTestimonial, PublicStory, HomepageSection } from './utils/dynamicContent.ts';
import { applyTheme } from './utils/theme.ts';
import { applySiteSeoSettings, applyHeroSloganSeo } from './utils/seo.ts';
import { applyBranding, applySiteNameEverywhere } from './utils/branding.ts';
import { forceSiteLanguageIfSingleMode, hideLanguageToggleIfSingleMode } from './i18n/languageMode.ts';
import { DEFAULT_VEHICLE_TYPES } from './data/services.ts';
import { markAppReady } from './utils/appReady.ts';
import { fetchCurrentCustomer } from './utils/customerAuth.ts';
import { fetchOrdersByPhone } from './utils/api.ts';
import { extractSavedAddresses } from './utils/addresses.ts';
import { setGeocodeMapConfig } from './utils/geocode.ts';

// وقتی خریدار هنوز چیدمان صفحه اصلی را شخصی‌سازی نکرده، این چیدمان نمونه (نه ثابت و نه اجباری) نمایش داده
// می‌شود تا صفحه از همان اول خالی به نظر نرسد — ولی از دید سیستم، این‌ها هم فقط چند بلوک عادی‌اند که از تنظیمات
// سایت کاملاً قابل ویرایش، جابه‌جایی یا حذف‌اند، نه نوع بخش ثابت و مخصوص.
const DEFAULT_HOMEPAGE_SECTIONS: HomepageSection[] = [
  { id: 'hero', type: 'hero', visible: true },
  {
    id: 'starter-steps',
    type: 'block',
    layout: 'steps',
    visible: true,
    heading: 'مراحل ثبت و انجام خدمات در بهدون',
    headingEn: 'How Behdoon Works',
    subheading: 'دریافت خدمات حرفه‌ای ساختمان در تهران تنها در ۳ گام سریع و مطمئن',
    subheadingEn: 'Get professional building services in Tehran in 3 quick steps',
    items: [
      {
        id: 'step-1',
        title: '۱. انتخاب خدمت و تعیین موقعیت',
        titleEn: '1. Select Service & Location',
        text: 'نوع خدمت ساختمانی (سرمایش/گرمایش، لوله‌کشی، برق، بازسازی) و موقعیت مکانی خود در تهران را مشخص کنید.',
        textEn: 'Select the required service and specify your address or location in Tehran.',
      },
      {
        id: 'step-2',
        title: '۲. تعیین زمان و هماهنگی سریع',
        titleEn: '2. Schedule & Quick Coordination',
        text: 'زمان مراجعه تکنسین را به صورت فوری یا برنامه‌ریزی‌شده انتخاب کرده و کد رهگیری هوشمند دریافت نمایید.',
        textEn: 'Choose immediate dispatch or schedule a convenient time and get your tracking code.',
      },
      {
        id: 'step-3',
        title: '۳. اجرای تخصصی با ضمانت کتبی',
        titleEn: '3. Professional Execution & Warranty',
        text: 'تکنسین مجرب در کمتر از ۴۵ دقیقه در محل حاضر شده و خدمات را با نرخ مصوب و ضمانت کتبی انجام می‌دهد.',
        textEn: 'Certified technician arrives in under 45 minutes with written warranty and union rates.',
      },
    ],
  },
];

function renderApp(settings: Awaited<ReturnType<typeof loadSettings>>, testimonials: PublicTestimonial[], stories: PublicStory[]): void {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) return;

  const vehicleTypes = settings.vehicle_types?.length ? settings.vehicle_types : DEFAULT_VEHICLE_TYPES;
  const rawSections = settings.homepage_layout?.sections?.length ? settings.homepage_layout.sections : DEFAULT_HOMEPAGE_SECTIONS;
  const sections = rawSections.filter(
    (s) =>
      s.id !== 'starter-faq' &&
      s.id !== 'starter-grid' &&
      s.id !== 'starter-testimonials' &&
      s.heading !== 'چرا مهسان؟' &&
      s.heading !== 'چرا بهبار؟',
  );
  const hasHero = sections.some((s) => s.type === 'hero');
  const visibleStories = settings.homepage_layout?.storiesEnabled === false ? [] : stories;

  const body = (hasHero ? sections : [{ id: 'hero', type: 'hero' as const, visible: true }, ...sections])
    .map((section) => {
      if (section.type !== 'hero' && section.visible === false) return '';
      return section.type === 'hero'
        ? renderHero(vehicleTypes, section, settings.service_cities, settings.service_categories, settings.hero_slogan, settings.site_name)
        : renderContentBlock(section, testimonials);
    })
    .join('');

  app.innerHTML = `
    <a class="skip-link" href="#main-content">${pick('رفتن به محتوای اصلی', 'Skip to main content')}</a>
    ${renderHeader(settings)}
    ${renderStoriesStrip(visibleStories)}
    <main id="main-content">
      ${body}
    </main>
    ${renderFooter(settings)}
    ${renderBottomNav()}
    ${renderQuickActions(settings)}
    ${renderDemoBadges()}
    ${renderRequestWizardModal(vehicleTypes, settings.service_cities, settings.service_categories, settings.site_name)}
  `;
}

function scrollToHashIfPresent(): void {
  if (!location.hash) return;
  document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'start' });
}

async function init(): Promise<void> {
  initBehaviorTracking();
  const [settings, testimonials, stories] = await Promise.all([loadSettings(), fetchPublicTestimonials(), fetchPublicStories()]);
  forceSiteLanguageIfSingleMode(settings.language_mode);
  applyTheme(settings.theme);
  applySiteSeoSettings(settings.seo);
  applyHeroSloganSeo(settings.hero_slogan, settings.site_name);
  const vehicleTypes = settings.vehicle_types?.length ? settings.vehicle_types : DEFAULT_VEHICLE_TYPES;
  renderApp(settings, testimonials, stories);
  markAppReady();
  applyBranding(settings.branding);
  applySiteNameEverywhere(settings.site_name);
  hideLanguageToggleIfSingleMode(settings.language_mode);

  initHeader(settings);
  initFooter(settings);
  setGeocodeMapConfig(settings.map);
  const wizardController = initRequestWizard(vehicleTypes, settings.service_cities, settings.map, settings.site_name);
  initServiceCategoriesAccordion((catId, vehicleId) => {
    wizardController.openModal(catId, vehicleId);
  });
  initContentBlocks();
  initBottomNav();
  initLangToggle();
  initQuickActions(settings);
  initStoriesStrip(settings.homepage_layout?.storiesEnabled === false ? [] : stories);

  scrollToHashIfPresent();

  // اگر مشتری وارد حساب کاربری خود شده، آدرس‌های مبدأ/مقصد سفارش‌های قبلی‌اش برای انتخاب سریع در فرم آماده می‌شود.
  fetchCurrentCustomer()
    .then((customer) => {
      if (!customer) return;
      return fetchOrdersByPhone(customer.phone).then((orders) => {
        wizardController.setSavedAddresses(extractSavedAddresses(orders));
      });
    })
    .catch(() => {
      /* بی‌اهمیت — فرم بدون لیست آدرس‌های قبلی هم کاملاً کار می‌کند. */
    });
}

bootstrapI18n(() => void init());

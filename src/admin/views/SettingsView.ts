import { icons } from '../components/icons.ts';
import { icons as publicIcons } from '../../components/icons.ts';
import { applyTheme } from '../../utils/theme.ts';
import {
  fetchSettings,
  updateSetting,
  fetchPlugins,
  fetchLicense,
  activateLicense,
  downloadBackup,
  restoreBackup,
  testDriveBackup,
  prepareDriveOAuth,
  disconnectDrive,
  uploadImage,
} from '../utils/api.ts';
import type { LicenseInfo } from '../utils/api.ts';
import { getStaff, hasPermission } from '../utils/auth.ts';
import { renderUpdatePanel, initUpdatePanel } from '../components/UpdatePanel.ts';
import { ensureLanguageMode, applyLanguageVisibility } from '../utils/languageMode.ts';
import { renderPagesListView, initPagesListView } from './PagesListView.ts';
import { renderSlidersManagerView, initSlidersManagerView } from './SlidersManagerView.ts';
import { API_BASE_URL } from '../data/config.ts';
import type { Permission } from '../utils/auth.ts';
import { handleSaveButton } from '../utils/save-button.ts';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  createConfiguredTileLayer,
  DEFAULT_MAP_SETTINGS,
  MAP_PROVIDERS,
  type MapSettings,
  type MapProvider,
} from '../utils/mapProvider.ts';


interface SocialLinkSetting {
  id: string;
  platform: string;
  label: string;
  url: string;
  customIconUrl?: string;
}

interface ContactSettings {
  phoneDisplay: string;
  phoneTelHref: string;
  socialIconColor?: string;
  socialLinks: SocialLinkSetting[];
}

interface AppLinkSetting {
  id: string;
  platform: string;
  label: string;
  url: string;
}

interface AppLinksSettings {
  enabled: boolean;
  links: AppLinkSetting[];
}

interface CertificationBadge {
  id: string;
  label: string;
  imageUrl: string;
  linkUrl: string;
}

interface CertificationsSettings {
  enabled: boolean;
  badges: CertificationBadge[];
}

const SOCIAL_PLATFORMS: { value: string; label: string }[] = [
  { value: 'telegram', label: 'تلگرام' },
  { value: 'whatsapp', label: 'واتس‌اپ' },
  { value: 'instagram', label: 'اینستاگرام' },
  { value: 'linkedin', label: 'لینکدین' },
  { value: 'youtube', label: 'یوتیوب' },
  { value: 'twitterX', label: 'ایکس (توییتر)' },
  { value: 'facebook', label: 'فیس‌بوک' },
  { value: 'mail', label: 'ایمیل' },
  { value: 'custom', label: 'سفارشی (با آیکون دلخواه)' },
  { value: 'globe', label: 'وبسایت / سایر' },
];

const APP_PLATFORMS: { value: string; label: string }[] = [
  { value: 'googlePlay', label: 'گوگل پلی' },
  { value: 'appStore', label: 'اپ استور' },
  { value: 'bazaar', label: 'کافه‌بازار' },
  { value: 'custom', label: 'سایر' },
];


interface GoogleDrivePluginConfig {
  enabled: boolean;
  clientId: string;
  clientSecret: string;
  refreshToken?: string;
  folderId: string;
}

interface ThemeField {
  key: string;
  label: string;
  desc: string;
  group: string;
}

const THEME_FIELDS: ThemeField[] = [
  { key: 'primary', label: 'رنگ اصلی برند', desc: 'دکمه‌های اقدام، المان‌های شاخص، آیکون‌ها و لینک‌های اصلی', group: 'رنگ‌های اصلی' },
  { key: 'secondary', label: 'رنگ مکمل و ثانویه', desc: 'بج‌های تایید، گرادیان‌ها و دکمه‌های فرعی', group: 'رنگ‌های اصلی' },
  { key: 'background', label: 'پس‌زمینه سایت', desc: 'رنگ کلی فضای خالی و پس‌زمینه صفحات', group: 'سطوح و متون' },
  { key: 'surface', label: 'سطح کارت‌ها و فرم‌ها', desc: 'پس‌زمینه کارت‌های خدمات، کادرها و پنل‌ها', group: 'سطوح و متون' },
  { key: 'text', label: 'رنگ متون اصلی', desc: 'تیترها و پاراگراف‌های اصلی با کنتراست خوانا', group: 'سطوح و متون' },
  { key: 'muted', label: 'متن کم‌رنگ و راهنما', desc: 'توضیحات تکمیلی، زیرعنوان‌ها و راهنمای فیلدها', group: 'سطوح و متون' },
  { key: 'border', label: 'خطوط دور و کادرها', desc: 'حاشیه کارت‌ها، جداکننده‌ها و لبه‌های فیلدها', group: 'سطوح و متون' },
  { key: 'callGreen', label: 'رنگ تماس و واتس‌اپ', desc: 'دکمه‌های تماس تلفنی، واتس‌اپ و پشتیبانی فوری', group: 'اقدام و هشدار' },
  { key: 'warning', label: 'رنگ فوریت و هشدار', desc: 'نشان‌های فوریت اعزام، تخفیف‌ها و گارانتی کتبی', group: 'اقدام و هشدار' },
];

const THEME_DEFAULTS: Record<string, string> = {
  primary: '#7c3aed',
  secondary: '#8b5cf6',
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#0f172a',
  muted: '#64748b',
  border: '#e2e8f0',
  callGreen: '#059669',
  warning: '#ea580c',
};

export interface ThemePreset {
  id: string;
  name: string;
  badge: string;
  colors: Record<string, string>;
}

const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'behdoon_purple',
    name: 'بنفش مدرن بهدون (پیش‌فرض)',
    badge: '🔮 رسمی',
    colors: {
      primary: '#7c3aed',
      secondary: '#8b5cf6',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#0f172a',
      muted: '#64748b',
      border: '#e2e8f0',
      callGreen: '#059669',
      warning: '#ea580c',
    },
  },
  {
    id: 'emerald_technic',
    name: 'سبز زمردی و خدمات تأسیسات',
    badge: '🌿 فنی',
    colors: {
      primary: '#059669',
      secondary: '#10b981',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#064e3b',
      muted: '#6b7280',
      border: '#d1fae5',
      callGreen: '#047857',
      warning: '#d97706',
    },
  },
  {
    id: 'ocean_blue',
    name: 'آبی اقیانوسی و شرکتی',
    badge: '🌊 مدرن',
    colors: {
      primary: '#0284c7',
      secondary: '#38bdf8',
      background: '#f0f9ff',
      surface: '#ffffff',
      text: '#0c4a6e',
      muted: '#64748b',
      border: '#bae6fd',
      callGreen: '#059669',
      warning: '#e11d48',
    },
  },
  {
    id: 'warm_amber',
    name: 'نارنجی ساختمانی و پرانرژی',
    badge: '⚡ پرانرژی',
    colors: {
      primary: '#ea580c',
      secondary: '#f97316',
      background: '#fff7ed',
      surface: '#ffffff',
      text: '#431407',
      muted: '#78716c',
      border: '#fed7aa',
      callGreen: '#059669',
      warning: '#dc2626',
    },
  },
  {
    id: 'dark_luxury',
    name: 'تاریک شیشه‌ای و نایت‌مود',
    badge: '🌙 Dark',
    colors: {
      primary: '#8b5cf6',
      secondary: '#a78bfa',
      background: '#0b0f19',
      surface: '#111827',
      text: '#f9fafb',
      muted: '#9ca3af',
      border: '#1f2937',
      callGreen: '#10b981',
      warning: '#f59e0b',
    },
  },
];

export interface TypographySettings {
  fontFamily: string;
  fontScale: string;
  persianDigits: boolean;
  fontSmoothing: boolean;
}

const TYPOGRAPHY_FONTS: { id: string; name: string; desc: string }[] = [
  { id: 'vazirmatn', name: 'وزیرمتن (Vazirmatn)', desc: 'قلم پیش‌فرض و استاندارد وب فارسی، فوق‌العاده خوانا و مدرن' },
  { id: 'yekan', name: 'ایران یکان / یکان‌بخش (Yekan Bakh)', desc: 'قلم رسمی، هندسی و بسیار محبوب در اپلیکیشن‌های مدرن ایرانی' },
  { id: 'dana', name: 'دانا (Dana)', desc: 'قلم یکپارچه، هندسی و خلاقانه با توازن بالا در تیترها' },
  { id: 'shabnam', name: 'شبنم (Shabnam)', desc: 'قلم نرم با زوایای گرد، چشم‌نواز و صمیمی' },
  { id: 'sahel', name: 'ساحل (Sahel)', desc: 'قلم سنتی، مطبوعاتی و باوقار' },
  { id: 'iransans', name: 'ایران‌سنس (IRANSans)', desc: 'قلم کلاسیک سازمانی و شرکتی' },
  { id: 'system', name: 'قلم پیش‌فرض سیستم‌عامل (System UI)', desc: 'بدون دانلود فونت وب، استفاده از فونت پیش‌فرض دستگاه' },
];

export interface CoreSocialItem {
  id: string;
  name: string;
  nameEn: string;
  brandColor: string;
  placeholder: string;
  iconSvg: string;
}

const CORE_SOCIAL_LIST: CoreSocialItem[] = [
  { id: 'whatsapp', name: 'واتس‌اپ (WhatsApp)', nameEn: 'WhatsApp', brandColor: '#25D366', placeholder: 'https://wa.me/989333256885 یا ۰۹۳۳۳۲۵۶۸۸۵', iconSvg: publicIcons.whatsappFilled },
  { id: 'telegram', name: 'تلگرام (Telegram)', nameEn: 'Telegram', brandColor: '#229ED9', placeholder: 'https://t.me/behdoon_ir یا @behdoon_ir', iconSvg: publicIcons.telegramFilled },
  { id: 'instagram', name: 'اینستاگرام (Instagram)', nameEn: 'Instagram', brandColor: '#E4405F', placeholder: 'https://instagram.com/behdoon.ir یا behdoon.ir', iconSvg: publicIcons.instagramFilled },
  { id: 'bale', name: 'پیام‌رسان بله (Bale)', nameEn: 'Bale', brandColor: '#15803D', placeholder: 'https://ble.ir/behdoon یا @behdoon', iconSvg: publicIcons.baleFilled },
  { id: 'eitaa', name: 'پیام‌رسان ایتا (Eitaa)', nameEn: 'Eitaa', brandColor: '#F97316', placeholder: 'https://eitaa.com/behdoon یا @behdoon', iconSvg: publicIcons.eitaaFilled },
  { id: 'rubika', name: 'روبیکا (Rubika)', nameEn: 'Rubika', brandColor: '#8B5CF6', placeholder: 'https://rubika.ir/behdoon یا @behdoon', iconSvg: publicIcons.rubikaFilled },
  { id: 'aparat', name: 'آپارات (Aparat)', nameEn: 'Aparat', brandColor: '#EA1D5D', placeholder: 'https://aparat.com/behdoon', iconSvg: publicIcons.aparatFilled },
  { id: 'linkedin', name: 'لینکدین (LinkedIn)', nameEn: 'LinkedIn', brandColor: '#0A66C2', placeholder: 'https://linkedin.com/company/behdoon', iconSvg: publicIcons.linkedinFilled },
];

const SETTINGS_TABS: { id: string; label: string; permission: Permission }[] = [
  { id: 'pages', label: 'صفحات سایت', permission: 'settings' },
  { id: 'sliders', label: 'اسلایدر موبایل و وب‌سایت', permission: 'settings' },
  { id: 'general', label: 'نام سایت و فوتر', permission: 'settings' },
  { id: 'theme', label: 'رنگ‌بندی و تم', permission: 'settings' },
  { id: 'typography', label: 'تنظیمات فونت و قلم', permission: 'settings' },
  { id: 'social', label: 'شبکه‌های اجتماعی', permission: 'settings' },
  { id: 'contact', label: 'تماس و دکمه‌ها', permission: 'settings' },
  { id: 'map', label: 'نقشه', permission: 'settings' },
  { id: 'language', label: 'زبان', permission: 'settings' },
  { id: 'license', label: 'لایسنس', permission: 'settings' },
  { id: 'backup-update', label: 'پشتیبان‌گیری و به‌روزرسانی', permission: 'settings' },
];

function visibleTabs(): { id: string; label: string; permission: Permission }[] {
  const staff = getStaff();
  if (!staff) return [];
  return SETTINGS_TABS.filter((t) => {
    if (t.id === 'pages' || t.id === 'sliders') return hasPermission(staff, 'settings') || hasPermission(staff, 'homepage') || hasPermission(staff, 'content');
    return hasPermission(staff, t.permission);
  });
}

export function renderSettingsView(): string {
  const tabs = visibleTabs();
  const activeId = tabs[0]?.id;
  const hiddenAttr = (id: string): string => (id === activeId ? '' : 'hidden');

  return `
    <div class="view-header">
      <h1>تنظیمات سایت</h1>
    </div>
    <p class="error-text" id="settings-error" hidden></p>
    <p class="settings-saved-note" id="settings-saved-note" hidden>ذخیره شد.</p>

    <div class="settings-tabs">
      ${tabs.map((t, i) => `<button type="button" class="settings-tab ${i === 0 ? 'is-active' : ''}" data-settings-tab="${t.id}">${t.label}</button>`).join('')}
    </div>

    <div class="settings-panel" data-settings-panel="pages" ${hiddenAttr('pages')}>
      ${renderPagesListView(true)}
    </div>

    <div class="settings-panel" data-settings-panel="sliders" ${hiddenAttr('sliders')}>
      ${renderSlidersManagerView(true)}
    </div>

    <div class="settings-panel" data-settings-panel="language" ${hiddenAttr('language')}>
      <div class="editor-sidebar-card">
        <div class="card-header-action">
          <h3>زبان سایت</h3>
          <button type="button" class="btn btn-primary btn-sm" data-save-setting="language_mode">ذخیره</button>
        </div>
        <p class="settings-panel-hint">
          اگر سایت فقط یک زبانه است، فیلد زبان دیگر هم روی سایت (دکمه تعویض زبان) و هم در همین فرم‌های پنل مدیریت مخفی می‌شود.
        </p>
        <div class="form-field" style="max-width: 260px">
          <label for="settings-language-mode">حالت زبان</label>
          <select id="settings-language-mode">
            <option value="both">دوزبانه (فارسی و انگلیسی)</option>
            <option value="fa">فقط فارسی</option>
            <option value="en">فقط انگلیسی</option>
          </select>
        </div>
      </div>
    </div>

    <div class="settings-panel" data-settings-panel="general" ${hiddenAttr('general')}>
      <div class="editor-sidebar-card">
        <div class="card-header-action">
          <h3>نام سایت</h3>
          <button type="button" class="btn btn-primary btn-sm" data-save-setting="site_name">ذخیره</button>
        </div>
        <div class="settings-form-grid">
          <div class="form-field" data-i18n="fa"><label for="settings-site-name-fa">فارسی</label><input type="text" id="settings-site-name-fa" /></div>
          <div class="form-field" data-i18n="en"><label for="settings-site-name-en">انگلیسی</label><input type="text" id="settings-site-name-en" dir="ltr" /></div>
        </div>
      </div>

      <div class="editor-sidebar-card">
        <div class="card-header-action">
          <h3>لوگو و فاوآیکن</h3>
          <button type="button" class="btn btn-primary btn-sm" data-save-setting="branding">ذخیره</button>
        </div>
        <p class="settings-panel-hint">
          اگر خالی بگذارید، لوگوی پیش‌فرض بهدون (در هدر، فوتر، فاوآیکن و پنل مدیریت) استفاده می‌شود.
          برای لوگوی خودتان، آدرس یک تصویر مربعی (ترجیحاً SVG یا PNG با پس‌زمینه) وارد کنید.
        </p>
        <div class="settings-form-grid">
          <div class="form-field">
            <label for="settings-logo-url">آدرس لوگو</label>
            <div class="staff-avatar-upload-row">
              <span class="staff-avatar staff-avatar-preview" id="settings-logo-preview"></span>
              <input type="text" id="settings-logo-url" dir="ltr" placeholder="/logo.svg یا https://..." />
              <button type="button" class="btn btn-secondary btn-sm" id="settings-logo-upload-btn">آپلود</button>
              <input type="file" id="settings-logo-file-input" accept="image/*" hidden />
            </div>
          </div>
          <div class="form-field">
            <label for="settings-favicon-url">آدرس فاوآیکن (اختیاری)</label>
            <div class="staff-avatar-upload-row">
              <span class="staff-avatar staff-avatar-preview" id="settings-favicon-preview"></span>
              <input type="text" id="settings-favicon-url" dir="ltr" placeholder="خالی = همان لوگو" />
              <button type="button" class="btn btn-secondary btn-sm" id="settings-favicon-upload-btn">آپلود</button>
              <input type="file" id="settings-favicon-file-input" accept="image/*" hidden />
            </div>
          </div>
        </div>
        <p class="error-text" id="settings-branding-upload-error" hidden></p>
      </div>

      <div class="editor-sidebar-card">
        <div class="card-header-action">
          <h3>شعار و پیام اصلی سایت (هیرو)</h3>
          <button type="button" class="btn btn-primary btn-sm" data-save-setting="hero_slogan">ذخیره</button>
        </div>
        <p class="settings-panel-hint">
          پیام و متن خوش‌آمدگویی که در بالای صفحه اصلی کنار فرم استعلام قیمت نمایش داده می‌شود.
        </p>
        <div style="margin-bottom: var(--space-4)">
          <label class="custom-page-checkbox-label" style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" id="settings-hero-slogan-enabled" />
            <span style="font-weight: 500;">نمایش شعار در بالای صفحه اصلی</span>
          </label>
        </div>
        <div class="settings-form-grid">
          <div class="form-field" data-i18n="fa">
            <label for="settings-hero-slogan-headline-fa">عنوان اصلی / شعار (فارسی)</label>
            <input type="text" id="settings-hero-slogan-headline-fa" placeholder="خدمات تخصصی فنی و تأسیسات ساختمان در تهران" />
          </div>
          <div class="form-field" data-i18n="en">
            <label for="settings-hero-slogan-headline-en">عنوان اصلی / شعار (انگلیسی)</label>
            <input type="text" id="settings-hero-slogan-headline-en" dir="ltr" placeholder="Professional Building & Home Maintenance Services in Tehran" />
          </div>
        </div>
        <div class="settings-form-grid" style="margin-top: var(--space-3)">
          <div class="form-field" data-i18n="fa">
            <label for="settings-hero-slogan-subtitle-fa">توضیحات تکمیلی / زیرعنوان (فارسی)</label>
            <textarea id="settings-hero-slogan-subtitle-fa" rows="2" placeholder="ثبت آنلاین درخواست اعزام فوری تکنسین و استادکار تأسیسات، لوله‌کشی، برقکاری و بازسازی ساختمان با ضمانت کتبی کیفیت."></textarea>
          </div>
          <div class="form-field" data-i18n="en">
            <label for="settings-hero-slogan-subtitle-en">توضیحات تکمیلی / زیرعنوان (انگلیسی)</label>
            <textarea id="settings-hero-slogan-subtitle-en" rows="2" dir="ltr" placeholder="Submit your request online for certified building repair, plumbing, HVAC, and electrical technicians."></textarea>
          </div>
        </div>
      </div>

      <div class="editor-sidebar-card">
        <div class="card-header-action">
          <h3>متن فوتر (سئو) و کپی‌رایت</h3>
          <button type="button" class="btn btn-primary btn-sm" data-save-setting="footer">ذخیره</button>
        </div>
        <div id="settings-footer-paragraphs"></div>
        <div class="settings-form-grid" style="margin-top: var(--space-4)">
          <div class="form-field" data-i18n="fa"><label for="settings-copyright-fa">متن کپی‌رایت (فارسی)</label><input type="text" id="settings-copyright-fa" /></div>
          <div class="form-field" data-i18n="en"><label for="settings-copyright-en">متن کپی‌رایت (انگلیسی)</label><input type="text" id="settings-copyright-en" dir="ltr" /></div>
        </div>
      </div>
    </div>

    <div class="settings-panel" data-settings-panel="map" ${hiddenAttr('map')}>
      <div class="editor-sidebar-card">
        <div class="card-header-action">
          <h3>سرویس‌دهنده و تنظیمات نقشه</h3>
          <button type="button" class="btn btn-primary btn-sm" id="settings-map-save-btn">ذخیره تنظیمات نقشه</button>
        </div>
        <p class="settings-panel-hint">
          سرویس نقشه برای انتخاب دقیق موقعیت مکانی انجام خدمت در تهران در مرحله ثبت سفارش مشتریان و پایش موقعیت روی نقشه مدیریت استفاده می‌شود.
          حالت پیش‌فرض <strong>اوپن‌استریت‌مپ (OpenStreetMap)</strong> است که کاملاً رایگان و بدون نیاز به کلید کار می‌کند.
        </p>

        <div class="form-field" style="margin-bottom: var(--space-4);">
          <label for="settings-map-provider">انتخاب سرویس‌دهنده نقشه</label>
          <select id="settings-map-provider" style="font-weight: 600;">
            <option value="osm">اوپن‌استریت‌مپ (OpenStreetMap) — پیش‌فرض، رایگان و بدون کلید</option>
            <option value="neshan">نقشه نشان (Neshan) — ویژه ایران با معابر و پلاک‌های دقیق</option>
            <option value="balad">نقشه بلد (Balad) — سرویس نقشه ایرانی</option>
            <option value="google">گوگل مپ (Google Maps) — استاندارد بین‌المللی با نمای ماهواره‌ای</option>
            <option value="mapir">مپ دات آی‌آر (Map.ir) — نقشه ایرانی شیوه‌محور</option>
            <option value="custom">سرور کاشی دلخواه (Custom Tile Server)</option>
          </select>
        </div>

        <div id="settings-map-api-key-group" class="form-field" style="margin-bottom: var(--space-4);" hidden>
          <label for="settings-map-api-key" id="settings-map-api-key-label">کلید دسترسی (API Key)</label>
          <input type="text" id="settings-map-api-key" dir="ltr" placeholder="کلید دسترسی را وارد کنید..." autocomplete="off" />
          <p class="settings-panel-hint" id="settings-map-api-key-hint"></p>
        </div>

        <div id="settings-map-custom-url-group" class="form-field" style="margin-bottom: var(--space-4);" hidden>
          <label for="settings-map-custom-url">آدرس الگوی تایل کاشی (Tile URL Template)</label>
          <input type="text" id="settings-map-custom-url" dir="ltr" placeholder="https://{s}.tile.example.com/{z}/{x}/{y}.png" />
          <p class="settings-panel-hint">از پارامترهای {z}، {x}، {y} و اختیاری {s} در آدرس استفاده کنید.</p>
        </div>

        <div id="settings-map-type-group" class="form-field" style="margin-bottom: var(--space-4); max-width: 280px;" hidden>
          <label for="settings-map-type">نوع نمایش نقشه (استایل)</label>
          <select id="settings-map-type">
            <option value="standard">استاندارد خیابانی (Standard)</option>
            <option value="satellite">تصاویر ماهواره‌ای (Satellite - ویژه گوگل)</option>
            <option value="terrain">عوارض طبیعی و پستی‌بلندی‌ها (Terrain)</option>
          </select>
        </div>

        <div style="display: flex; gap: 10px; align-items: center; margin-top: var(--space-3); flex-wrap: wrap;">
          <button type="button" class="btn btn-secondary btn-sm" id="settings-map-test-preview-btn">اعمال و تست در پیش‌نمایش</button>
          <span id="settings-map-status" class="article-status-badge">آماده بررسی</span>
        </div>
      </div>

      <div class="editor-sidebar-card" style="margin-top: var(--space-4);">
        <div class="card-header-action">
          <h3>پیش‌نمایش زنده نقشه</h3>
          <span class="settings-panel-hint">نشانگر را جابه‌جا کنید یا بزرگ‌نمایی را تغییر دهید.</span>
        </div>
        <div id="settings-map-preview" style="height: 340px; width: 100%; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-color); margin-top: var(--space-2);"></div>
      </div>
    </div>

    <div class="settings-panel" data-settings-panel="contact" ${hiddenAttr('contact')}>
      <div class="editor-sidebar-card">
        <div class="card-header-action">
          <h3 style="margin: 0;">شماره تماس</h3>
          <button type="button" class="btn btn-primary btn-sm" data-save-setting="contact">ذخیره</button>
        </div>
        <div class="settings-form-grid">
          <div class="form-field">
            <label for="settings-phone-display">شماره تماس (نمایشی)</label>
            <input type="text" id="settings-phone-display" dir="ltr" placeholder="021-200200" />
          </div>
          <div class="form-field">
            <label for="settings-phone-tel">لینک شماره‌گیری</label>
            <input type="text" id="settings-phone-tel" dir="ltr" placeholder="tel:+9821200200" />
          </div>
        </div>
      </div>

      <div class="editor-sidebar-card">
        <div class="card-header-action">
          <h3 style="margin: 0;">شبکه‌های اجتماعی و پیام‌رسان‌ها</h3>
          <button type="button" class="btn btn-secondary btn-sm" data-switch-to-tab="social">رفتن به تنظیمات شبکه‌های اجتماعی</button>
        </div>
        <p class="settings-panel-hint" style="margin: 6px 0 0 0;">
          کلیه پیام‌رسان‌های ایرانی (بله، ایتا، روبیکا، آپارات) و خارجی (واتس‌اپ، تلگرام، اینستاگرام) به همراه تنظیم آیکون‌ها و لینک‌های دلخواه به تب اختصاصی <strong>«شبکه‌های اجتماعی»</strong> منتقل شده است.
        </p>
      </div>

      <div class="editor-sidebar-card">
        <div class="card-header-action">
          <div style="display: flex; align-items: center; gap: 12px;">
            <h3 style="margin: 0;">دکمه‌های تماس و چت</h3>
            <label class="settings-inline-toggle" style="margin: 0;"><input type="checkbox" id="theme-quick-actions-enabled" /> فعال</label>
          </div>
          <button type="button" class="btn btn-primary btn-sm" data-save-setting="contact">ذخیره</button>
        </div>
        <div class="form-field">
          <label for="theme-quick-actions-style">نحوه نمایش</label>
          <select id="theme-quick-actions-style">
            <option value="floating">شناور (همیشه روی صفحه ثابت می‌ماند)</option>
            <option value="fixed">فیکس (با اسکرول صفحه جابه‌جا می‌شود)</option>
          </select>
        </div>
        <div class="form-field" style="margin-top: 12px;">
          <label for="theme-quick-actions-position">سمت قرارگیری در وب (دسکتاپ)</label>
          <select id="theme-quick-actions-position">
            <option value="right">سمت راست (پیش‌فرض)</option>
            <option value="left">سمت چپ</option>
          </select>
        </div>
      </div>

      <div class="editor-sidebar-card">
        <div class="card-header-action">
          <div style="display: flex; align-items: center; gap: 12px;">
            <h3 style="margin: 0;">دکمه‌های دانلود اپلیکیشن</h3>
            <label class="settings-inline-toggle" style="margin: 0;"><input type="checkbox" id="applinks-enabled" /> فعال</label>
          </div>
          <button type="button" class="btn btn-primary btn-sm" data-save-setting="app_links">ذخیره</button>
        </div>
        <p class="settings-panel-hint">اگر اپلیکیشن موبایل دارید، دکمه‌های دانلود آن در فوتر سایت نمایش داده می‌شود.</p>
        <div id="app-links-list"></div>
        <button type="button" class="btn btn-secondary btn-sm" id="app-link-add-btn">
          <span class="icon">${icons.plusCircle}</span>
          افزودن لینک اپلیکیشن
        </button>
      </div>

      <div class="editor-sidebar-card">
        <div class="card-header-action">
          <div style="display: flex; align-items: center; gap: 12px;">
            <h3 style="margin: 0;">مجوزها و نمادهای اعتماد</h3>
            <label class="settings-inline-toggle" style="margin: 0;"><input type="checkbox" id="certifications-enabled" /> فعال</label>
          </div>
          <button type="button" class="btn btn-primary btn-sm" data-save-setting="certifications">ذخیره</button>
        </div>
        <p class="settings-panel-hint">مثلاً نماد اعتماد الکترونیکی یا ساماندهی؛ لینک تصویر نماد و لینک صفحه تایید را وارد کنید.</p>
        <div id="certifications-list"></div>
        <button type="button" class="btn btn-secondary btn-sm" id="certification-add-btn">
          <span class="icon">${icons.plusCircle}</span>
          افزودن مجوز
        </button>
      </div>
    </div>

    <!-- تب رنگ‌بندی و تم -->
    <div class="settings-panel" data-settings-panel="theme" ${hiddenAttr('theme')}>
      <div class="editor-sidebar-card">
        <div class="card-header-action">
          <h3 style="margin: 0;">پالت‌های رنگی آماده بهدون (یک کلیک)</h3>
          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            <button type="button" class="btn btn-secondary btn-sm" id="theme-reset-btn">بازگردانی به پیش‌فرض</button>
            <button type="button" class="btn btn-primary btn-sm" data-save-setting="theme">ذخیره و انتشار تم</button>
          </div>
        </div>
        <p class="settings-panel-hint">
          با کلیک روی هر پالت، رنگ‌های سایت فوراً هماهنگ شده و در پیش‌نمایش زنده زیر قابل مشاهده است. با کلیک روی «ذخیره و انتشار تم»، پالت در تمام بخش‌های سایت ذخیره و فعال می‌شود.
        </p>
        <div class="theme-presets-grid">
          ${THEME_PRESETS.map((p) => `
            <button type="button" class="theme-preset-card" data-preset-id="${p.id}" aria-pressed="false">
              <div class="preset-card-header">
                <div class="preset-card-title-row">
                  <span class="preset-radio-indicator" aria-hidden="true"></span>
                  <span class="preset-card-name">${p.name}</span>
                </div>
                <span class="preset-badge">${p.badge}</span>
              </div>
              <div class="theme-swatches-row">
                <span class="theme-swatch-dot" style="background: ${p.colors.primary};" title="رنگ اصلی: ${p.colors.primary}"></span>
                <span class="theme-swatch-dot" style="background: ${p.colors.secondary};" title="رنگ ثانویه: ${p.colors.secondary}"></span>
                <span class="theme-swatch-dot" style="background: ${p.colors.background};" title="پس‌زمینه: ${p.colors.background}"></span>
                <span class="theme-swatch-dot" style="background: ${p.colors.surface};" title="سطح کارت‌ها: ${p.colors.surface}"></span>
                <span class="theme-swatch-dot" style="background: ${p.colors.callGreen};" title="رنگ تماس: ${p.colors.callGreen}"></span>
                <span class="theme-swatch-dot" style="background: ${p.colors.warning};" title="هشدار: ${p.colors.warning}"></span>
              </div>
              <span class="preset-status-tag">برای انتخاب کلیک کنید</span>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="editor-sidebar-card" style="margin-top: var(--space-4);">
        <div class="card-header-action">
          <h3 style="margin: 0;">شخصی‌سازی دقیق رنگ‌ها</h3>
          <button type="button" class="btn btn-primary btn-sm" data-save-setting="theme">ذخیره رنگ‌ها</button>
        </div>
        <p class="settings-panel-hint">
          رنگ‌های کاربردی زیر را متناسب با هویت برند خود تنظیم کنید. سایر کدهای هدر، فوتر و المان‌ها خودکار منطبق می‌شوند.
        </p>
        <div class="theme-color-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; margin-top: 14px;">
          ${THEME_FIELDS.map((f) => `
            <div class="theme-color-field" style="background: var(--background); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border);">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
                <label for="theme-${f.key}" style="font-weight: 700; font-size: 0.88rem; color: var(--text);">${f.label}</label>
                <span style="font-size: 0.72rem; color: var(--muted);">${f.group}</span>
              </div>
              <p style="font-size: 0.76rem; color: var(--muted); margin: 0 0 8px 0; line-height: 1.4;">${f.desc}</p>
              <div class="theme-color-input-row" style="display: flex; gap: 8px; align-items: center;">
                <input type="color" id="theme-${f.key}-picker" data-theme-picker="${f.key}" style="width: 40px; height: 36px; border: none; cursor: pointer; border-radius: 6px; padding: 0; background: transparent;" />
                <input type="text" id="theme-${f.key}" dir="ltr" data-theme-hex="${f.key}" maxlength="7" placeholder="#000000" style="flex: 1; font-family: monospace; font-size: 0.9rem;" />
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="editor-sidebar-card" style="margin-top: var(--space-4);">
        <div class="card-header-action">
          <h3 style="margin: 0;">پیش‌نمایش زنده تم</h3>
          <span class="settings-panel-hint">شبیه‌سازی فوری کارت‌ها و دکمه‌ها</span>
        </div>
        <div id="theme-live-preview-box" style="margin-top: 14px; padding: 20px; border-radius: 12px; border: 1.5px solid var(--border); background: var(--background); transition: all 0.2s ease;">
          <div id="theme-preview-card" style="background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 18px; max-width: 480px; margin: 0 auto; box-shadow: 0 4px 14px rgba(0,0,0,0.05);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span id="theme-preview-badge" style="background: var(--primary); color: #ffffff; padding: 3px 10px; border-radius: 6px; font-size: 0.78rem; font-weight: 700;">گارانتی کتبی ۱۸۰ روزه</span>
              <span id="theme-preview-urgent" style="color: var(--warning); font-size: 0.78rem; font-weight: 700;">اعزام فوری کمتر از ۳۰ دقیقه</span>
            </div>
            <h4 id="theme-preview-title" style="margin: 0 0 6px 0; font-size: 1.05rem; font-weight: 800; color: var(--text);">تعمیر و سرویس تخصصی پکیج دیواری</h4>
            <p id="theme-preview-desc" style="font-size: 0.85rem; color: var(--muted); margin: 0 0 16px 0; line-height: 1.6;">
              عیب‌یابی برد، رفع کدهای ارور، شستشوی مبدل و تنظیم فشار توسط متخصصین دارای گواهی معتبر.
            </p>
            <div style="display: flex; gap: 10px; align-items: center; justify-content: space-between; flex-wrap: wrap;">
              <button type="button" id="theme-preview-btn-primary" style="background: var(--primary); color: #ffffff; border: none; padding: 8px 16px; border-radius: 8px; font-size: 0.84rem; font-weight: 700; cursor: default;">
                ثبت آنلاین درخواست
              </button>
              <button type="button" id="theme-preview-btn-call" style="background: var(--call-green); color: #ffffff; border: none; padding: 8px 14px; border-radius: 8px; font-size: 0.84rem; font-weight: 700; cursor: default; display: flex; align-items: center; gap: 6px;">
                تماس فوری ۰۲۱-۲۲۳۴۵۶۷۸
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- تب فونت و قلم -->
    <div class="settings-panel" data-settings-panel="typography" ${hiddenAttr('typography')}>
      <div class="editor-sidebar-card">
        <div class="card-header-action">
          <h3 style="margin: 0;">تنظیمات فونت و قلم (تایپوگرافی)</h3>
          <button type="button" class="btn btn-primary btn-sm" data-save-setting="typography">ذخیره فونت</button>
        </div>
        <p class="settings-panel-hint">
          قلم و ابعاد نمایشی متون در سراسر سایت (هدر، منوها، کارت‌های خدمت، مقالات و فوتر) را مدیریت کنید.
        </p>
        <div class="settings-form-grid" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-top: 16px;">
          <div class="form-field">
            <label for="typography-font-family">انتخاب قلم فارسی</label>
            <select id="typography-font-family">
              ${TYPOGRAPHY_FONTS.map((f) => `<option value="${f.id}">${f.name}</option>`).join('')}
            </select>
            <p class="settings-panel-hint" id="typography-font-desc" style="margin-top: 6px; font-size: 0.78rem;">قلم پیش‌فرض و استاندارد وب فارسی</p>
          </div>

          <div class="form-field">
            <label for="typography-font-scale">مقیاس اندازه کلی متون</label>
            <select id="typography-font-scale">
              <option value="90">۹۰٪ (جمع‌وجورتر)</option>
              <option value="100" selected>۱۰۰٪ (استاندارد و پیش‌فرض)</option>
              <option value="110">۱۱۰٪ (بزرگ‌تر و بسیار خوانا)</option>
            </select>
            <p class="settings-panel-hint" style="margin-top: 6px; font-size: 0.78rem;">تنظیم اندازه پایه فونت برای نمایشگرهای مختلف</p>
          </div>
        </div>

        <div style="display: flex; gap: 20px; align-items: center; margin-top: 16px; flex-wrap: wrap;">
          <label class="settings-inline-toggle" style="margin: 0;">
            <input type="checkbox" id="typography-persian-digits" checked />
            تبدیل خودکار ارقام به فارسی (۱۲۳۴۵۶۷۸۹۰)
          </label>
          <label class="settings-inline-toggle" style="margin: 0;">
            <input type="checkbox" id="typography-font-smoothing" checked />
            بهینه‌سازی لبه‌های فونت برای صفحات نمایش (Font Smoothing)
          </label>
        </div>
      </div>

      <div class="editor-sidebar-card" style="margin-top: var(--space-4);">
        <div class="card-header-action">
          <h3 style="margin: 0;">پیش‌نمایش زنده قلم</h3>
          <span class="settings-panel-hint">شبیه‌سازی زنده فونت و اندازه انتخابی</span>
        </div>
        <div id="typography-live-preview" style="margin-top: 14px; padding: 24px; border-radius: 12px; border: 1px solid var(--border); background: var(--surface); transition: all 0.2s ease;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid var(--border); padding-bottom: 12px; margin-bottom: 14px;">
            <h2 id="typo-preview-title" style="margin: 0; font-size: 1.35rem; font-weight: 800; color: var(--text);">بهدون؛ سامانه هوشمند خدمات تخصصی منزل و ساختمان در تهران</h2>
            <span style="font-size: 0.85rem; color: var(--primary); font-weight: 700;">شماره تماس: ۰۲۱-۲۲۳۴۵۶۷۸</span>
          </div>
          <p id="typo-preview-body" style="font-size: 0.95rem; line-height: 1.8; color: var(--muted); margin: 0 0 14px 0;">
            ارائه کلیه خدمات تأسیسات، سرمایش، گرمایش، لوله‌کشی و برقکاری با بیش از ۵۰ تکنسین مجرب، گارانتی کتبی ۱۸۰ روزه و اعزام کمتر از ۳۰ دقیقه در تمام مناطق ۲۲گانه تهران.
          </p>
          <div style="display: flex; gap: 10px; align-items: center; font-size: 0.82rem; color: var(--text); flex-wrap: wrap;">
            <span style="background: rgba(124, 58, 237, 0.1); color: var(--primary); padding: 4px 10px; border-radius: 6px; font-weight: 700;">ارقام فارسی: ۰ ۱ ۲ ۳ ۴ ۵ ۶ ۷ ۸ ۹</span>
            <span style="background: var(--background); padding: 4px 10px; border-radius: 6px; border: 1px solid var(--border);">English: Behdoon Specialized Home Repairs 2026</span>
          </div>
        </div>
      </div>
    </div>

    <!-- تب شبکه‌های اجتماعی -->
    <div class="settings-panel" data-settings-panel="social" ${hiddenAttr('social')}>
      <div class="editor-sidebar-card">
        <div class="card-header-action">
          <h3 style="margin: 0;">پیام‌رسان‌ها و شبکه‌های اجتماعی</h3>
          <button type="button" class="btn btn-primary btn-sm" data-save-setting="social">ذخیره شبکه‌های اجتماعی</button>
        </div>
        <p class="settings-panel-hint">
          پیام‌رسان‌های ایرانی و بین‌المللی کسب‌وکار خود را فعال و آدرس یا شناسه آن‌ها را وارد کنید. این آیکون‌ها در هدر، فوتر و دکمه‌های ارتباطی سایت قرار می‌گیرند.
        </p>

        <div style="display: flex; gap: 16px; align-items: center; margin: 16px 0; background: var(--background); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border);">
          <label for="social-tab-color-hex" style="font-weight: 700; font-size: 0.88rem; color: var(--text);">رنگ یکدست برای آیکون‌های فوتر (اختیاری):</label>
          <div class="theme-color-input-row" style="display: flex; gap: 8px; align-items: center;">
            <input type="color" id="social-tab-color-picker" style="width: 36px; height: 32px; border: none; cursor: pointer; border-radius: 6px; background: transparent;" />
            <input type="text" id="social-tab-color-hex" dir="ltr" maxlength="7" placeholder="رنگ رسمی برندها" style="max-width: 140px; font-family: monospace; font-size: 0.88rem;" />
          </div>
          <span style="font-size: 0.78rem; color: var(--muted);">(در صورت خالی بودن، هر پیام‌رسان با رنگ رسمی خودش نمایش می‌یابد)</span>
        </div>

        <div class="social-core-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 14px; margin-top: 14px;">
          ${CORE_SOCIAL_LIST.map((item) => `
            <div class="social-network-card" data-core-social="${item.id}" style="background: var(--background); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 12px; display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="icon" style="width: 24px; height: 24px; color: ${item.brandColor}; display: inline-flex; align-items: center; justify-content: center;">${item.iconSvg}</span>
                  <span style="font-weight: 700; font-size: 0.88rem; color: var(--text);">${item.name}</span>
                </div>
                <label class="settings-inline-toggle" style="margin: 0;">
                  <input type="checkbox" id="social-core-toggle-${item.id}" data-social-core-toggle="${item.id}" />
                  فعال
                </label>
              </div>
              <div>
                <input type="text" id="social-core-url-${item.id}" data-social-core-url="${item.id}" dir="ltr" placeholder="${item.placeholder}" style="width: 100%; font-size: 0.84rem; padding: 6px 10px; border-radius: 6px; border: 1px solid var(--border);" />
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="editor-sidebar-card" style="margin-top: var(--space-4);">
        <div class="card-header-action">
          <h3 style="margin: 0;">لینک‌ها و کانال‌های دلخواه اضافی</h3>
          <button type="button" class="btn btn-secondary btn-sm" id="social-tab-custom-add-btn">
            <span class="icon">${icons.plusCircle}</span>
            افزودن لینک سفارشی
          </button>
        </div>
        <p class="settings-panel-hint">اگر کانال، گروه یا صفحه دیگری در پلتفرم‌های دیگر دارید، در این بخش اضافه نمایید.</p>
        <div id="social-tab-custom-list" style="margin-top: 12px; display: flex; flex-direction: column; gap: 10px;"></div>
      </div>

      <div class="editor-sidebar-card" style="margin-top: var(--space-4);">
        <div class="card-header-action">
          <h3 style="margin: 0;">پیش‌نمایش آیکون‌ها در فوتر سایت</h3>
          <span class="settings-panel-hint">چیدمان و رنگ آیکون‌ها در بخش پایین سایت</span>
        </div>
        <div id="social-tab-preview-row" style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-top: 12px; padding: 16px; background: #0f172a; border-radius: 8px;">
          <span style="color: #94a3b8; font-size: 0.82rem;">آیکون‌های فعال در فوتر:</span>
          <div id="social-tab-preview-icons" style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;"></div>
        </div>
      </div>
    </div>

    <div class="settings-panel" data-settings-panel="license" ${hiddenAttr('license')}>
      <div class="editor-sidebar-card">
        <h3>فعال‌سازی لایسنس</h3>
        <p class="settings-panel-hint">کد لایسنسی که هنگام خرید قالب دریافت کرده‌اید را وارد کنید.</p>
        <div class="license-activate-row">
          <input type="text" id="license-key-input" dir="ltr" placeholder="BHBR-XXXX-XXXX-XXXX-XXXX" />
          <button type="button" class="btn btn-primary" id="license-activate-btn">فعال‌سازی</button>
        </div>
        <p class="error-text" id="license-activate-error" hidden></p>
      </div>
      <div id="license-panel-content"></div>
    </div>

    <div class="settings-panel" data-settings-panel="backup-update" ${hiddenAttr('backup-update')}>
      <div class="settings-subtabs">
        <button type="button" class="settings-tab is-active" data-backup-subtab="manual">پشتیبان‌گیری دستی</button>
        <button type="button" class="settings-tab" data-backup-subtab="drive">پشتیبان ابری (گوگل درایو)</button>
        <button type="button" class="settings-tab" data-backup-subtab="update">به‌روزرسانی نرم‌افزار</button>
      </div>

      <div class="backup-subpanel" data-backup-subpanel="manual">
        <div class="editor-sidebar-card">
          <h3>پشتیبان‌گیری دستی</h3>
          <p class="settings-panel-hint">یک فایل کامل از تمام محتوای سایت (درخواست‌ها، کارمندان، تنظیمات، مقالات، نظرات، چت‌ها، استوری‌ها و ...) دانلود یا بازیابی کنید.</p>
          <div class="settings-panel-footer" style="justify-content:flex-start">
            <button type="button" class="btn btn-secondary" id="backup-download-btn">
              <span class="icon">${icons.download}</span>
              دانلود بک‌آپ کامل
            </button>
          </div>
          <p class="error-text" id="backup-download-error" hidden></p>

          <hr style="margin:var(--space-5) 0; border:none; border-top:1px solid var(--border)" />

          <label for="backup-restore-file" style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:var(--space-2)">بازیابی از فایل بک‌آپ</label>
          <input type="file" id="backup-restore-file" accept=".sql" />
          <p class="settings-panel-hint" style="color:var(--danger)">
            توجه: بازیابی، تمام داده‌های فعلی سایت را با محتوای فایل بک‌آپ جایگزین می‌کند و غیرقابل‌بازگشت است.
          </p>
          <div class="settings-panel-footer" style="justify-content:flex-start">
            <button type="button" class="btn btn-secondary" id="backup-restore-btn" disabled>بازیابی از این فایل</button>
          </div>
          <p class="error-text" id="backup-restore-error" hidden></p>
          <p class="settings-saved-note" id="backup-restore-success" hidden>بازیابی با موفقیت انجام شد.</p>
        </div>
      </div>

      <div class="backup-subpanel" data-backup-subpanel="drive" hidden>
        <div class="editor-sidebar-card">
          <div class="card-header-action">
            <h3 style="margin:0;">ارسال خودکار روزانه به گوگل درایو</h3>
            <button type="button" class="btn btn-primary btn-sm" id="backup-drive-save-btn">ذخیره تنظیمات</button>
          </div>
          <p class="settings-panel-hint">
            با اتصال حساب گوگل خودتان، هر شب یک نسخه‌ی پشتیبان به‌صورت خودکار در Google Drive شما ذخیره می‌شود.
          </p>

          <div class="drive-connection-status" id="drive-connection-status"></div>

          <details class="drive-oauth-setup">
            <summary>راه‌اندازی اولیه (فقط یک‌بار لازم است)</summary>
            <ol class="settings-panel-hint" style="padding-inline-start:1.2rem; margin:var(--space-2) 0">
              <li>در <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener">Google Cloud Console → Credentials</a> یک «OAuth client ID» از نوع Web application بسازید.</li>
              <li>این آدرس را به‌عنوان «Authorized redirect URI» اضافه کنید: <code id="drive-redirect-uri" dir="ltr"></code></li>
              <li>شناسه (Client ID) و کلید (Client Secret) را اینجا وارد و ذخیره کنید.</li>
              <li>روی «اتصال به گوگل درایو» بزنید و با حساب گوگل خودتان وارد شوید.</li>
            </ol>
          </details>

          <div class="form-field" style="margin-top:var(--space-3)">
            <label for="backup-drive-client-id">Client ID</label>
            <input type="text" id="backup-drive-client-id" dir="ltr" placeholder="xxxxx.apps.googleusercontent.com" />
          </div>
          <div class="form-field">
            <label for="backup-drive-client-secret">Client Secret</label>
            <input type="password" id="backup-drive-client-secret" dir="ltr" placeholder="GOCSPX-..." />
          </div>
          <div class="form-field">
            <label for="backup-drive-folder">شناسه‌ی پوشه‌ی Google Drive (اختیاری)</label>
            <input type="text" id="backup-drive-folder" dir="ltr" placeholder="1AbCdEfG..." />
          </div>
          <label class="settings-inline-toggle"><input type="checkbox" id="backup-drive-enabled" /> ارسال خودکار روزانه فعال باشد</label>

          <p class="error-text" id="backup-drive-error" hidden></p>
          <div class="settings-panel-footer">
            <button type="button" class="btn btn-secondary" id="backup-drive-test-btn">ارسال آزمایشی الان</button>
            <button type="button" class="btn btn-primary" id="backup-drive-connect-btn">اتصال به گوگل درایو</button>
            <button type="button" class="btn btn-ghost" id="backup-drive-disconnect-btn" hidden>قطع اتصال</button>
          </div>
        </div>
      </div>

      <div class="backup-subpanel" data-backup-subpanel="update" hidden>
        ${renderUpdatePanel()}
      </div>
    </div>
  `;
}

export function initSettingsView(onNavigate?: (screen: string, detail?: unknown) => void, initialTab?: string): void {
  const errorEl = document.getElementById('settings-error');
  const savedNote = document.getElementById('settings-saved-note');
  if (!errorEl || !savedNote) return;

  initPagesListView((id) => onNavigate?.('page-editor', id));
  initSlidersManagerView();

  if (initialTab) {
    const targetTabBtn = document.querySelector<HTMLButtonElement>(`[data-settings-tab="${initialTab}"]`);
    if (targetTabBtn) {
      document.querySelectorAll('[data-settings-tab]').forEach((t) => t.classList.remove('is-active'));
      targetTabBtn.classList.add('is-active');
      document.querySelectorAll<HTMLElement>('[data-settings-panel]').forEach((panel) => {
        panel.hidden = panel.dataset.settingsPanel !== initialTab;
      });
    }
  }

  // این تابع در چند جا برای جلوگیری از فراخوانی درخواست‌های پس‌زمینه‌ای استفاده می‌شود که کارمند
  // به آن‌ها دسترسی ندارد — چون هر ۴۰۱ (حتی «این دسترسی رو نداری» برای یک بخش دیگر، نه انقضای نشست)
  // کاربر را کامل از پنل خارج می‌کند (authedFetch → onUnauthorized روی هر ۴۰۱ای فراخوانی می‌شود).
  const currentStaff = getStaff();
  void ensureLanguageMode().then(() => applyLanguageVisibility(document.body));

  function showSaved(): void {
    savedNote!.hidden = false;
    window.setTimeout(() => (savedNote!.hidden = true), 2500);
  }
  function showError(err: unknown): void {
    errorEl!.hidden = false;
    errorEl!.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
  }

  // ----- tabs -----
  document.querySelectorAll<HTMLButtonElement>('[data-settings-tab]').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-settings-tab]').forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      document.querySelectorAll<HTMLElement>('[data-settings-panel]').forEach((panel) => {
        panel.hidden = panel.dataset.settingsPanel !== tab.dataset.settingsTab;
      });
      if (tab.dataset.settingsTab === 'map') {
        window.setTimeout(() => previewMapInstance?.invalidateSize(), 150);
      }
    });
  });

  document.querySelectorAll<HTMLButtonElement>('[data-switch-to-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.switchToTab;
      const targetBtn = document.querySelector<HTMLButtonElement>(`[data-settings-tab="${targetTab}"]`);
      targetBtn?.click();
    });
  });

  // ----- backup subtabs -----
  document.querySelectorAll<HTMLButtonElement>('[data-backup-subtab]').forEach((subtab) => {
    subtab.addEventListener('click', () => {
      document.querySelectorAll('[data-backup-subtab]').forEach((t) => t.classList.remove('is-active'));
      subtab.classList.add('is-active');
      document.querySelectorAll<HTMLElement>('[data-backup-subpanel]').forEach((panel) => {
        panel.hidden = panel.dataset.backupSubpanel !== subtab.dataset.backupSubtab;
      });
    });
  });

  let settings: Record<string, unknown> = {};
  let plugins: Record<string, unknown> = {};

  // ----- لوگو و فاوآیکن: هم آدرس دستی و هم آپلود مستقیم فایل پشتیبانی می‌شود -----
  function updateBrandingPreview(kind: 'logo' | 'favicon'): void {
    const preview = document.getElementById(`settings-${kind}-preview`);
    const url = (document.getElementById(`settings-${kind}-url`) as HTMLInputElement)?.value.trim();
    if (!preview) return;
    preview.innerHTML = url ? `<img src="${url}" alt="" />` : '';
  }

  function wireBrandingUpload(kind: 'logo' | 'favicon'): void {
    const urlInput = document.getElementById(`settings-${kind}-url`) as HTMLInputElement | null;
    const uploadBtn = document.getElementById(`settings-${kind}-upload-btn`) as HTMLButtonElement | null;
    const fileInput = document.getElementById(`settings-${kind}-file-input`) as HTMLInputElement | null;
    const uploadError = document.getElementById('settings-branding-upload-error');
    if (!urlInput || !uploadBtn || !fileInput) return;

    urlInput.addEventListener('input', () => updateBrandingPreview(kind));
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', async () => {
      const file = fileInput.files?.[0];
      if (!file) return;
      if (uploadError) uploadError.hidden = true;
      uploadBtn.disabled = true;
      const originalText = uploadBtn.textContent;
      uploadBtn.textContent = 'در حال آپلود...';
      try {
        const url = await uploadImage(file);
        urlInput.value = url;
        updateBrandingPreview(kind);
      } catch (err) {
        if (uploadError) {
          uploadError.hidden = false;
          uploadError.textContent = err instanceof Error ? err.message : 'آپلود عکس ناموفق بود.';
        }
      } finally {
        fileInput.value = '';
        uploadBtn.disabled = false;
        uploadBtn.textContent = originalText;
      }
    });
  }

  wireBrandingUpload('logo');
  wireBrandingUpload('favicon');

  // ----- general -----
  function renderGeneral(): void {
    const siteName = (settings.site_name as { fa: string; en: string } | undefined) ?? { fa: '', en: '' };
    const siteNameFa = siteName.fa?.trim() || '';
    const siteNameEn = siteName.en?.trim() || '';
    const siteNameFaInput = document.getElementById('settings-site-name-fa') as HTMLInputElement;
    const siteNameEnInput = document.getElementById('settings-site-name-en') as HTMLInputElement;
    siteNameFaInput.value = siteNameFa;
    siteNameEnInput.value = siteNameEn;

    (document.getElementById('settings-language-mode') as HTMLSelectElement).value = (settings.language_mode as string | undefined) ?? 'both';

    const branding = (settings.branding as { logoUrl?: string; faviconUrl?: string } | undefined) ?? {};
    (document.getElementById('settings-logo-url') as HTMLInputElement).value = branding.logoUrl ?? '';
    (document.getElementById('settings-favicon-url') as HTMLInputElement).value = branding.faviconUrl ?? '';
    updateBrandingPreview('logo');
    updateBrandingPreview('favicon');

    const footer = (settings.footer as { seoParagraphs: { fa: string; en: string }[]; copyright: { fa: string; en: string } } | undefined) ?? {
      seoParagraphs: [],
      copyright: { fa: '', en: '' },
    };
    const container = document.getElementById('settings-footer-paragraphs')!;
    container.innerHTML = footer.seoParagraphs
      .map(
        (p, i) => `
        <div class="settings-form-grid" data-footer-paragraph="${i}">
          <div class="form-field" data-i18n="fa"><label>پاراگراف ${i + 1} (فارسی)</label><textarea rows="3" data-field="fa">${p.fa}</textarea></div>
          <div class="form-field" data-i18n="en"><label>پاراگراف ${i + 1} (انگلیسی)</label><textarea rows="3" dir="ltr" data-field="en">${p.en}</textarea></div>
        </div>`,
      )
      .join('');
    applyLanguageVisibility(container);

    const defaultCopyrightFa = siteNameFa ? `همه حقوق برای ${siteNameFa} محفوظ است.` : 'همه حقوق محفوظ است.';
    const defaultCopyrightEn = siteNameEn ? `All rights reserved for ${siteNameEn}.` : 'All rights reserved.';

    const copyrightFaInput = document.getElementById('settings-copyright-fa') as HTMLInputElement;
    const copyrightEnInput = document.getElementById('settings-copyright-en') as HTMLInputElement;

    copyrightFaInput.placeholder = defaultCopyrightFa;
    copyrightEnInput.placeholder = defaultCopyrightEn;

    let savedCopyrightFa = footer.copyright?.fa?.trim() ?? '';
    let savedCopyrightEn = footer.copyright?.en?.trim() ?? '';

    if (siteNameFa && siteNameFa !== 'بهدون' && savedCopyrightFa && (savedCopyrightFa.includes('بهدون') || savedCopyrightFa.includes('بهبار'))) {
      savedCopyrightFa = savedCopyrightFa.replace(/به[بد]ون?|بهبار/g, siteNameFa);
    }
    if (!savedCopyrightFa) {
      savedCopyrightFa = defaultCopyrightFa;
    }

    if (siteNameEn && siteNameEn !== 'Behdoon' && savedCopyrightEn && (savedCopyrightEn.includes('Behdoon') || savedCopyrightEn.includes('Behbar'))) {
      savedCopyrightEn = savedCopyrightEn.replace(/Beh(doon|bar)/gi, siteNameEn);
    }
    if (!savedCopyrightEn) {
      savedCopyrightEn = defaultCopyrightEn;
    }

    copyrightFaInput.value = savedCopyrightFa;
    copyrightEnInput.value = savedCopyrightEn;

    siteNameFaInput.oninput = () => {
      const curName = siteNameFaInput.value.trim();
      const newDef = curName ? `همه حقوق برای ${curName} محفوظ است.` : 'همه حقوق محفوظ است.';
      copyrightFaInput.placeholder = newDef;
      const curVal = copyrightFaInput.value.trim();
      if (!curVal || curVal.startsWith('همه حقوق برای ') || curVal === 'همه حقوق محفوظ است.') {
        copyrightFaInput.value = newDef;
      }
    };

    siteNameEnInput.oninput = () => {
      const curName = siteNameEnInput.value.trim();
      const newDef = curName ? `All rights reserved for ${curName}.` : 'All rights reserved.';
      copyrightEnInput.placeholder = newDef;
      const curVal = copyrightEnInput.value.trim();
      if (!curVal || curVal.startsWith('All rights reserved for ') || curVal === 'All rights reserved.') {
        copyrightEnInput.value = newDef;
      }
    };

    const heroSlogan = (settings.hero_slogan as {
      enabled?: boolean;
      headline?: { fa?: string; en?: string };
      subtitle?: { fa?: string; en?: string };
    } | undefined) ?? {};
    (document.getElementById('settings-hero-slogan-enabled') as HTMLInputElement).checked = heroSlogan.enabled !== false;
    (document.getElementById('settings-hero-slogan-headline-fa') as HTMLInputElement).value = heroSlogan.headline?.fa ?? '';
    (document.getElementById('settings-hero-slogan-headline-en') as HTMLInputElement).value = heroSlogan.headline?.en ?? '';
    (document.getElementById('settings-hero-slogan-subtitle-fa') as HTMLTextAreaElement).value = heroSlogan.subtitle?.fa ?? '';
    (document.getElementById('settings-hero-slogan-subtitle-en') as HTMLTextAreaElement).value = heroSlogan.subtitle?.en ?? '';
  }

  document.querySelectorAll<HTMLButtonElement>('[data-save-setting="site_name"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await handleSaveButton(btn, async () => {
          const fa = (document.getElementById('settings-site-name-fa') as HTMLInputElement).value;
          const en = (document.getElementById('settings-site-name-en') as HTMLInputElement).value;
          await updateSetting('site_name', { fa, en });
          settings.site_name = { fa, en };
        });
        showSaved();
      } catch (err) {
        showError(err);
      }
    });
  });

  document.querySelectorAll<HTMLButtonElement>('[data-save-setting="language_mode"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await handleSaveButton(btn, async () => {
          const val = (document.getElementById('settings-language-mode') as HTMLSelectElement).value;
          await updateSetting('language_mode', val);
          settings.language_mode = val;
        });
        showSaved();
      } catch (err) {
        showError(err);
      }
    });
  });

  document.querySelectorAll<HTMLButtonElement>('[data-save-setting="branding"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await handleSaveButton(btn, async () => {
          const branding = {
            logoUrl: (document.getElementById('settings-logo-url') as HTMLInputElement).value.trim(),
            faviconUrl: (document.getElementById('settings-favicon-url') as HTMLInputElement).value.trim(),
          };
          await updateSetting('branding', branding);
          settings.branding = branding;
        });
        showSaved();
      } catch (err) {
        showError(err);
      }
    });
  });

  document.querySelectorAll<HTMLButtonElement>('[data-save-setting="footer"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await handleSaveButton(btn, async () => {
          const paragraphNodes = Array.from(document.querySelectorAll<HTMLElement>('[data-footer-paragraph]'));
          const seoParagraphs = paragraphNodes.map((node) => ({
            fa: node.querySelector<HTMLTextAreaElement>('[data-field="fa"]')!.value,
            en: node.querySelector<HTMLTextAreaElement>('[data-field="en"]')!.value,
          }));
          const footerData = {
            seoParagraphs,
            copyright: {
              fa: (document.getElementById('settings-copyright-fa') as HTMLInputElement).value,
              en: (document.getElementById('settings-copyright-en') as HTMLInputElement).value,
            },
          };
          await updateSetting('footer', footerData);
          settings.footer = footerData;
        });
        showSaved();
      } catch (err) {
        showError(err);
      }
    });
  });

  document.querySelectorAll<HTMLButtonElement>('[data-save-setting="hero_slogan"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await handleSaveButton(btn, async () => {
          const heroSlogan = {
            enabled: (document.getElementById('settings-hero-slogan-enabled') as HTMLInputElement).checked,
            headline: {
              fa: (document.getElementById('settings-hero-slogan-headline-fa') as HTMLInputElement).value.trim(),
              en: (document.getElementById('settings-hero-slogan-headline-en') as HTMLInputElement).value.trim(),
            },
            subtitle: {
              fa: (document.getElementById('settings-hero-slogan-subtitle-fa') as HTMLTextAreaElement).value.trim(),
              en: (document.getElementById('settings-hero-slogan-subtitle-en') as HTMLTextAreaElement).value.trim(),
            },
          };
          await updateSetting('hero_slogan', heroSlogan);
          settings.hero_slogan = heroSlogan;
        });
        showSaved();
      } catch (err) {
        showError(err);
      }
    });
  });

  // ----- contact & social -----
  let socialLinks: SocialLinkSetting[] = [];
  let appLinksState: AppLinksSettings = { enabled: false, links: [] };
  let certificationsState: CertificationsSettings = { enabled: false, badges: [] };

  function renderSocialLinksList(): void {
    const list = document.getElementById('social-links-list');
    if (!list) return;
    list.innerHTML = socialLinks
      .map(
        (link, i) => `
      <div class="settings-form-grid" data-social-link-index="${i}" style="grid-template-columns: 140px 140px 1fr 1fr auto; align-items: end; gap: 8px;">
        <div class="form-field">
          <label>شبکه</label>
          <select data-field="platform">
            ${SOCIAL_PLATFORMS.map((p) => `<option value="${p.value}" ${p.value === link.platform ? 'selected' : ''}>${p.label}</option>`).join('')}
          </select>
        </div>
        <div class="form-field"><label>برچسب</label><input type="text" data-field="label" value="${link.label}" placeholder="مثلاً: بله یا تلگرام" /></div>
        <div class="form-field"><label>لینک</label><input type="text" dir="ltr" data-field="url" value="${link.url}" placeholder="https://..." /></div>
        <div class="form-field"><label>آیکون دلخواه (اختیاری)</label><input type="text" dir="ltr" data-field="customIconUrl" value="${link.customIconUrl || ''}" placeholder="آدرس آیکون یا لوگو" /></div>
        <button type="button" class="btn btn-ghost btn-sm" data-remove-social-link="${i}" style="margin-bottom: 4px;">حذف</button>
      </div>
    `,
      )
      .join('');
  }

  function readSocialLinksFromDom(): void {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-social-link-index]'));
    socialLinks = els.map((el, i) => ({
      id: socialLinks[i]?.id ?? `social-${crypto.randomUUID().slice(0, 8)}`,
      platform: el.querySelector<HTMLSelectElement>('[data-field="platform"]')!.value,
      label: el.querySelector<HTMLInputElement>('[data-field="label"]')!.value.trim(),
      url: el.querySelector<HTMLInputElement>('[data-field="url"]')!.value.trim(),
      customIconUrl: el.querySelector<HTMLInputElement>('[data-field="customIconUrl"]')?.value.trim() || undefined,
    }));
  }

  document.getElementById('social-links-list')?.addEventListener('click', (event) => {
    const btn = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-remove-social-link]');
    if (!btn) return;
    readSocialLinksFromDom();
    socialLinks.splice(Number(btn.dataset.removeSocialLink), 1);
    renderSocialLinksList();
  });

  document.getElementById('social-link-add-btn')?.addEventListener('click', () => {
    readSocialLinksFromDom();
    socialLinks.push({ id: `social-${crypto.randomUUID().slice(0, 8)}`, platform: 'telegram', label: '', url: '' });
    renderSocialLinksList();
  });

  document.getElementById('social-color-picker')?.addEventListener('input', (e) => {
    (document.getElementById('social-color-hex') as HTMLInputElement).value = (e.currentTarget as HTMLInputElement).value;
  });

  function renderContact(): void {
    const contact = (settings.contact as ContactSettings | undefined) ?? { phoneDisplay: '', phoneTelHref: '', socialLinks: [] };
    (document.getElementById('settings-phone-display') as HTMLInputElement).value = contact.phoneDisplay ?? '';
    (document.getElementById('settings-phone-tel') as HTMLInputElement).value = contact.phoneTelHref ?? '';
    (document.getElementById('social-color-hex') as HTMLInputElement).value = contact.socialIconColor ?? '';
    if (contact.socialIconColor && /^#[0-9a-fA-F]{6}$/.test(contact.socialIconColor)) {
      (document.getElementById('social-color-picker') as HTMLInputElement).value = contact.socialIconColor;
    }
    socialLinks = contact.socialLinks ?? [];
    renderSocialLinksList();
    // این فیلد رنگ نیست، ولی چون درباره‌ی همین دکمه‌های شناور تماس/چت است، اینجا ویرایش می‌شود؛
    // برای سازگاری با نسخه‌های قبلی همچنان زیر کلید «theme» ذخیره می‌شود (نه یک کلید جدید).
    const themeSettings = (settings.theme as Record<string, string | boolean> | undefined) ?? {};
    const styleEl = document.getElementById('theme-quick-actions-style') as HTMLSelectElement | null;
    if (styleEl) {
      styleEl.value = themeSettings.quickActionsStyle === 'fixed' ? 'fixed' : 'floating';
    }
    const enabledEl = document.getElementById('theme-quick-actions-enabled') as HTMLInputElement | null;
    if (enabledEl) {
      enabledEl.checked = themeSettings.quickActionsEnabled !== false;
    }
    const posSelect = document.getElementById('theme-quick-actions-position') as HTMLSelectElement | null;
    if (posSelect) {
      posSelect.value = themeSettings.quickActionsPosition === 'left' ? 'left' : 'right';
    }
  }

  document.querySelectorAll<HTMLButtonElement>('[data-save-setting="contact"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await handleSaveButton(btn, async () => {
          readSocialLinksFromDom();
          const contactData = {
            phoneDisplay: (document.getElementById('settings-phone-display') as HTMLInputElement).value,
            phoneTelHref: (document.getElementById('settings-phone-tel') as HTMLInputElement).value,
            socialIconColor: (document.getElementById('social-color-hex') as HTMLInputElement).value.trim(),
            socialLinks,
          };
          await updateSetting('contact', contactData);
          settings.contact = contactData;
          const quickActionsStyle = (document.getElementById('theme-quick-actions-style') as HTMLSelectElement).value;
          const quickActionsEnabled = (document.getElementById('theme-quick-actions-enabled') as HTMLInputElement)?.checked ?? true;
          const quickActionsPosition = (document.getElementById('theme-quick-actions-position') as HTMLSelectElement)?.value ?? 'right';
          const existingTheme = (settings.theme as Record<string, string | boolean> | undefined) ?? {};
          await updateSetting('theme', { ...existingTheme, quickActionsStyle, quickActionsPosition, quickActionsEnabled });
          settings.theme = { ...existingTheme, quickActionsStyle, quickActionsPosition, quickActionsEnabled };
        });
        showSaved();
      } catch (err) {
        showError(err);
      }
    });
  });

  // ----- app download links -----
  function renderAppLinksList(): void {
    const list = document.getElementById('app-links-list');
    if (!list) return;
    list.innerHTML = appLinksState.links
      .map(
        (link, i) => `
      <div class="settings-form-grid" data-app-link-index="${i}">
        <div class="form-field">
          <label>پلتفرم</label>
          <select data-field="platform">
            ${APP_PLATFORMS.map((p) => `<option value="${p.value}" ${p.value === link.platform ? 'selected' : ''}>${p.label}</option>`).join('')}
          </select>
        </div>
        <div class="form-field"><label>برچسب (اختیاری)</label><input type="text" data-field="label" value="${link.label}" /></div>
        <div class="form-field"><label>لینک دانلود</label><input type="text" dir="ltr" data-field="url" value="${link.url}" /></div>
        <button type="button" class="btn btn-ghost btn-sm" data-remove-app-link="${i}">حذف</button>
      </div>
    `,
      )
      .join('');
  }

  function readAppLinksFromDom(): void {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-app-link-index]'));
    appLinksState.links = els.map((el, i) => ({
      id: appLinksState.links[i]?.id ?? `app-${crypto.randomUUID().slice(0, 8)}`,
      platform: el.querySelector<HTMLSelectElement>('[data-field="platform"]')!.value,
      label: el.querySelector<HTMLInputElement>('[data-field="label"]')!.value,
      url: el.querySelector<HTMLInputElement>('[data-field="url"]')!.value,
    }));
  }

  document.getElementById('app-links-list')?.addEventListener('click', (event) => {
    const btn = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-remove-app-link]');
    if (!btn) return;
    readAppLinksFromDom();
    appLinksState.links.splice(Number(btn.dataset.removeAppLink), 1);
    renderAppLinksList();
  });

  document.getElementById('app-link-add-btn')?.addEventListener('click', () => {
    readAppLinksFromDom();
    appLinksState.links.push({ id: `app-${crypto.randomUUID().slice(0, 8)}`, platform: 'googlePlay', label: '', url: '' });
    renderAppLinksList();
  });

  function renderAppLinks(): void {
    const data = (settings.app_links as AppLinksSettings | undefined) ?? { enabled: false, links: [] };
    appLinksState = { enabled: data.enabled ?? false, links: data.links ?? [] };
    (document.getElementById('applinks-enabled') as HTMLInputElement).checked = appLinksState.enabled;
    renderAppLinksList();
  }

  document.querySelectorAll<HTMLButtonElement>('[data-save-setting="app_links"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await handleSaveButton(btn, async () => {
          readAppLinksFromDom();
          appLinksState.enabled = (document.getElementById('applinks-enabled') as HTMLInputElement).checked;
          await updateSetting('app_links', appLinksState);
          settings.app_links = appLinksState;
        });
        showSaved();
      } catch (err) {
        showError(err);
      }
    });
  });

  // ----- certifications / trust badges -----
  function renderCertificationsList(): void {
    const list = document.getElementById('certifications-list');
    if (!list) return;
    list.innerHTML = certificationsState.badges
      .map(
        (badge, i) => `
      <div class="settings-form-grid" data-certification-index="${i}">
        <div class="form-field"><label>عنوان</label><input type="text" data-field="label" value="${badge.label}" /></div>
        <div class="form-field"><label>لینک تصویر نماد</label><input type="text" dir="ltr" data-field="imageUrl" value="${badge.imageUrl}" /></div>
        <div class="form-field"><label>لینک صفحه تایید</label><input type="text" dir="ltr" data-field="linkUrl" value="${badge.linkUrl}" /></div>
        <button type="button" class="btn btn-ghost btn-sm" data-remove-certification="${i}">حذف</button>
      </div>
    `,
      )
      .join('');
  }

  function readCertificationsFromDom(): void {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-certification-index]'));
    certificationsState.badges = els.map((el, i) => ({
      id: certificationsState.badges[i]?.id ?? `cert-${crypto.randomUUID().slice(0, 8)}`,
      label: el.querySelector<HTMLInputElement>('[data-field="label"]')!.value,
      imageUrl: el.querySelector<HTMLInputElement>('[data-field="imageUrl"]')!.value,
      linkUrl: el.querySelector<HTMLInputElement>('[data-field="linkUrl"]')!.value,
    }));
  }

  document.getElementById('certifications-list')?.addEventListener('click', (event) => {
    const btn = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-remove-certification]');
    if (!btn) return;
    readCertificationsFromDom();
    certificationsState.badges.splice(Number(btn.dataset.removeCertification), 1);
    renderCertificationsList();
  });

  document.getElementById('certification-add-btn')?.addEventListener('click', () => {
    readCertificationsFromDom();
    certificationsState.badges.push({ id: `cert-${crypto.randomUUID().slice(0, 8)}`, label: '', imageUrl: '', linkUrl: '' });
    renderCertificationsList();
  });

  function renderCertifications(): void {
    const data = (settings.certifications as CertificationsSettings | undefined) ?? { enabled: false, badges: [] };
    certificationsState = { enabled: data.enabled ?? false, badges: data.badges ?? [] };
    (document.getElementById('certifications-enabled') as HTMLInputElement).checked = certificationsState.enabled;
    renderCertificationsList();
  }

  document.querySelectorAll<HTMLButtonElement>('[data-save-setting="certifications"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await handleSaveButton(btn, async () => {
          readCertificationsFromDom();
          certificationsState.enabled = (document.getElementById('certifications-enabled') as HTMLInputElement).checked;
          await updateSetting('certifications', certificationsState);
          settings.certifications = certificationsState;
        });
        showSaved();
      } catch (err) {
        showError(err);
      }
    });
  });

  // ----- license -----
  function renderLicensePanel(license: LicenseInfo | null): void {
    const container = document.getElementById('license-panel-content');
    if (!container) return;
    if (!license) {
      container.innerHTML = '<p class="pipeline-empty">اطلاعات لایسنسی ثبت نشده است.</p>';
      return;
    }

    const issuedRaw = new Date(license.issuedAt).getTime();
    const expiresRaw = new Date(license.expiresAt).getTime();
    const issued = Number.isFinite(issuedRaw) ? issuedRaw : Date.now() - 365 * 86400000;
    const expires = Number.isFinite(expiresRaw) ? expiresRaw : Date.now() + 36500 * 86400000;
    const now = Date.now();
    const daysLeft = Math.max(0, Math.round((expires - now) / 86400000));
    const isPermanent = daysLeft > 1000 || license.plan.includes('مادام') || license.plan.includes('طلایی');
    const daysLeftDisplay = isPermanent ? 'نامحدود (مادام‌العمر)' : `${daysLeft} روز`;
    const percentUsed = isPermanent ? 100 : Math.min(100, Math.max(0, Math.round(((now - issued) / (expires - issued)) * 100)));
    const statusLabels: Record<LicenseInfo['status'], string> = {
      active: 'فعال و معتبر',
      trial: 'آزمایشی',
      expired: 'منقضی‌شده',
      invalid: 'نامعتبر',
      suspended: 'معلق‌شده',
      revoked: 'باطل‌شده',
      domain_mismatch: 'دامنه مطابقت ندارد',
      unreachable: 'عدم دسترسی به سرور اعتبارسنجی',
    };
    const statusLabel = statusLabels[license.status] ?? license.status;

    const issuedDisplay = license.issuedAt.includes('T') ? '۱۴۰۳/۰۱/۰۱' : license.issuedAt;
    const expiresDisplay = isPermanent ? 'نامحدود (مادام‌العمر)' : (license.expiresAt.includes('T') ? '۱۴۹۹/۱۲/۲۹' : license.expiresAt);

    container.innerHTML = `
      <div class="editor-sidebar-card license-card">
        <div class="plugin-card-head">
          <h3>${license.productName}</h3>
          <span class="article-status-badge article-status-${license.status === 'active' ? 'published' : 'draft'}">${statusLabel}</span>
        </div>
        <div class="license-grid">
          <div><label>کلید لایسنس</label><p dir="ltr">${license.key}</p></div>
          <div><label>طرح</label><p>${license.plan}</p></div>
          <div><label>متعلق به</label><p>${license.licensedTo}</p></div>
          <div><label>تاریخ صدور</label><p>${issuedDisplay}</p></div>
          <div><label>تاریخ انقضا</label><p>${expiresDisplay}</p></div>
          <div><label>اعتبار</label><p class="license-days-left">${daysLeftDisplay}</p></div>
        </div>
        <div class="license-timeline">
          <div class="license-timeline-bar"><div class="license-timeline-fill" style="width:${percentUsed}%; background: linear-gradient(90deg, #8b5cf6, #7c3aed);"></div></div>
          <div class="license-timeline-labels"><span>طرح فعال و نامحدود</span><span>${isPermanent ? 'بدون انقضا' : `${daysLeft} روز مانده`}</span></div>
        </div>
      </div>
    `;
  }

  // ----- plugins -----
  // این تابع (و باقی متغیرها/دکمه‌های زیر) فقط بخش گوگل‌درایو را پر می‌کند — پیامک و دستیار هوش
  // مصنوعی حالا صفحه‌ی مستقل خودشان را دارند («افزونه‌ها» در کاشی‌های خانه).
  function renderPlugins(): void {
    const drive = (plugins.googleDrive as GoogleDrivePluginConfig | undefined) ?? { enabled: false, clientId: '', clientSecret: '', folderId: '' };
    (document.getElementById('backup-drive-enabled') as HTMLInputElement).checked = Boolean(drive.enabled);
    (document.getElementById('backup-drive-client-id') as HTMLInputElement).value = drive.clientId ?? '';
    (document.getElementById('backup-drive-client-secret') as HTMLInputElement).value = drive.clientSecret ?? '';
    (document.getElementById('backup-drive-folder') as HTMLInputElement).value = drive.folderId ?? '';
    renderDriveConnectionStatus(Boolean(drive.refreshToken));
  }

  function renderDriveConnectionStatus(connected: boolean): void {
    const statusEl = document.getElementById('drive-connection-status');
    const disconnectBtn = document.getElementById('backup-drive-disconnect-btn');
    if (statusEl) {
      statusEl.innerHTML = connected
        ? `<span class="article-status-badge article-status-published">متصل به گوگل درایو</span>`
        : `<span class="article-status-badge">هنوز متصل نشده</span>`;
    }
    if (disconnectBtn) disconnectBtn.hidden = !connected;
  }

  // ----- theme -----
  let activePresetId: string | null = null;

  function sanitizeHex(val: string | undefined | null, fallback: string): string {
    if (!val) return fallback;
    let clean = val.trim();
    if (!clean.startsWith('#') && /^[0-9a-fA-F]{3,6}$/.test(clean)) {
      clean = '#' + clean;
    }
    if (/^#[0-9a-fA-F]{3}$/.test(clean)) {
      clean = '#' + clean[1] + clean[1] + clean[2] + clean[2] + clean[3] + clean[3];
    }
    return /^#[0-9a-fA-F]{6}$/i.test(clean) ? clean.toLowerCase() : fallback;
  }

  function highlightPresetCard(presetId: string | null): void {
    activePresetId = presetId;
    document.querySelectorAll<HTMLButtonElement>('[data-preset-id]').forEach((card) => {
      const isMatch = card.dataset.presetId === presetId;
      card.classList.toggle('is-selected', isMatch);
      card.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
      const tag = card.querySelector<HTMLElement>('.preset-status-tag');
      if (tag) {
        tag.textContent = isMatch ? '✓ پالت فعال سایت' : 'برای انتخاب کلیک کنید';
      }
    });
  }

  function detectMatchingPreset(colors: Record<string, string>): string | null {
    if (colors.presetId && THEME_PRESETS.some((p) => p.id === colors.presetId)) {
      return colors.presetId;
    }
    const currentPrimary = (colors.primary || '').toLowerCase();
    const currentBg = (colors.background || '').toLowerCase();
    for (const p of THEME_PRESETS) {
      if (p.colors.primary.toLowerCase() === currentPrimary) {
        if (!currentBg || p.colors.background.toLowerCase() === currentBg) {
          return p.id;
        }
      }
    }
    return null;
  }

  function updateThemeLivePreview(): void {
    const box = document.getElementById('theme-live-preview-box');
    const card = document.getElementById('theme-preview-card');
    const badge = document.getElementById('theme-preview-badge');
    const urgent = document.getElementById('theme-preview-urgent');
    const title = document.getElementById('theme-preview-title');
    const desc = document.getElementById('theme-preview-desc');
    const btnPrimary = document.getElementById('theme-preview-btn-primary');
    const btnCall = document.getElementById('theme-preview-btn-call');

    const getVal = (k: string) => {
      const v = (document.getElementById(`theme-${k}`) as HTMLInputElement)?.value;
      return sanitizeHex(v, THEME_DEFAULTS[k]);
    };

    if (box) box.style.background = getVal('background');
    if (card) {
      card.style.background = getVal('surface');
      card.style.borderColor = getVal('border');
    }
    if (badge) badge.style.background = getVal('primary');
    if (urgent) urgent.style.color = getVal('warning');
    if (title) title.style.color = getVal('text');
    if (desc) desc.style.color = getVal('muted');
    if (btnPrimary) btnPrimary.style.background = getVal('primary');
    if (btnCall) btnCall.style.background = getVal('callGreen');
  }

  function applyThemeFieldValue(key: string, hex: string): void {
    const validHex = sanitizeHex(hex, THEME_DEFAULTS[key]);
    const hexInput = document.getElementById(`theme-${key}`) as HTMLInputElement | null;
    const pickerInput = document.getElementById(`theme-${key}-picker`) as HTMLInputElement | null;
    if (hexInput) hexInput.value = validHex;
    if (pickerInput) pickerInput.value = validHex;
  }

  function checkCustomizedPreset(): void {
    if (!activePresetId) return;
    const preset = THEME_PRESETS.find((p) => p.id === activePresetId);
    if (!preset) return;
    const isStillMatch = THEME_FIELDS.every((f) => {
      const v = (document.getElementById(`theme-${f.key}`) as HTMLInputElement)?.value;
      return sanitizeHex(v, '') === (preset.colors[f.key] || THEME_DEFAULTS[f.key]).toLowerCase();
    });
    if (!isStillMatch) {
      highlightPresetCard(null);
    }
  }

  function renderTheme(): void {
    const theme = (settings.theme as Record<string, string> | undefined) ?? {};
    THEME_FIELDS.forEach((f) => applyThemeFieldValue(f.key, theme[f.key] ?? THEME_DEFAULTS[f.key]));
    const matched = detectMatchingPreset(theme) || 'behdoon_purple';
    highlightPresetCard(matched);
    updateThemeLivePreview();
  }

  document.querySelectorAll<HTMLInputElement>('[data-theme-picker]').forEach((picker) => {
    const onPickerChange = () => {
      const key = picker.dataset.themePicker!;
      applyThemeFieldValue(key, picker.value);
      checkCustomizedPreset();
      updateThemeLivePreview();
    };
    picker.addEventListener('input', onPickerChange);
    picker.addEventListener('change', onPickerChange);
  });

  document.querySelectorAll<HTMLInputElement>('[data-theme-hex]').forEach((hexInput) => {
    const onHexChange = () => {
      const key = hexInput.dataset.themeHex!;
      let val = hexInput.value.trim();
      if (!val.startsWith('#') && /^[0-9a-fA-F]{3,6}$/.test(val)) {
        val = '#' + val;
      }
      const picker = document.getElementById(`theme-${key}-picker`) as HTMLInputElement | null;
      if (picker && /^#[0-9a-fA-F]{6}$/i.test(val)) {
        picker.value = val;
      }
      checkCustomizedPreset();
      updateThemeLivePreview();
    };
    hexInput.addEventListener('input', onHexChange);
    hexInput.addEventListener('change', onHexChange);
    hexInput.addEventListener('blur', () => {
      const key = hexInput.dataset.themeHex!;
      hexInput.value = sanitizeHex(hexInput.value, THEME_DEFAULTS[key]);
    });
  });

  document.querySelectorAll<HTMLButtonElement>('[data-preset-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const presetId = btn.dataset.presetId;
      const preset = THEME_PRESETS.find((p) => p.id === presetId);
      if (!preset) return;
      highlightPresetCard(presetId || null);
      THEME_FIELDS.forEach((f) => {
        const val = preset.colors[f.key] || THEME_DEFAULTS[f.key];
        applyThemeFieldValue(f.key, val);
      });
      updateThemeLivePreview();
    });
  });

  document.getElementById('theme-reset-btn')?.addEventListener('click', () => {
    highlightPresetCard('behdoon_purple');
    THEME_FIELDS.forEach((f) => applyThemeFieldValue(f.key, THEME_DEFAULTS[f.key]));
    updateThemeLivePreview();
  });

  document.querySelectorAll<HTMLButtonElement>('[data-save-setting="theme"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await handleSaveButton(btn, async () => {
          const theme: Record<string, string | boolean> = {};
          THEME_FIELDS.forEach((f) => {
            const raw = (document.getElementById(`theme-${f.key}`) as HTMLInputElement)?.value;
            theme[f.key] = sanitizeHex(raw, THEME_DEFAULTS[f.key]);
          });
          const existingTheme = (settings.theme as Record<string, string | boolean> | undefined) ?? {};
          
          const styleEl = document.getElementById('theme-quick-actions-style') as HTMLSelectElement | null;
          const posEl = document.getElementById('theme-quick-actions-position') as HTMLSelectElement | null;
          const enabledEl = document.getElementById('theme-quick-actions-enabled') as HTMLInputElement | null;
          theme.quickActionsStyle = styleEl ? styleEl.value : (existingTheme.quickActionsStyle === 'fixed' ? 'fixed' : 'floating') as string;
          theme.quickActionsPosition = posEl ? posEl.value : (existingTheme.quickActionsPosition === 'left' ? 'left' : 'right') as string;
          theme.quickActionsEnabled = enabledEl ? enabledEl.checked : (existingTheme.quickActionsEnabled !== false);

          if (activePresetId) {
            theme.presetId = activePresetId;
          }

          await updateSetting('theme', theme);
          settings.theme = theme as any;
          applyTheme(theme as any, settings.typography as any);
          highlightPresetCard((theme.presetId as string) || null);
        });
        showSaved();
      } catch (err) {
        showError(err);
      }
    });
  });

  // ----- typography -----
  function updateTypographyLivePreview(): void {
    const familyId = (document.getElementById('typography-font-family') as HTMLSelectElement)?.value || 'vazirmatn';
    const scale = (document.getElementById('typography-font-scale') as HTMLSelectElement)?.value || '100';
    const persianDigits = (document.getElementById('typography-persian-digits') as HTMLInputElement)?.checked ?? true;

    const preview = document.getElementById('typography-live-preview');
    if (!preview) return;

    const fontObj = TYPOGRAPHY_FONTS.find((f) => f.id === familyId);
    const descEl = document.getElementById('typography-font-desc');
    if (descEl && fontObj) descEl.textContent = fontObj.desc;

    const FONT_FAMILIES_PREVIEW: Record<string, string> = {
      vazirmatn: "'Vazirmatn', -apple-system, BlinkMacSystemFont, sans-serif",
      yekan: "'Yekan Bakh', 'IRANYekan', 'Vazirmatn', sans-serif",
      dana: "'Dana', 'Vazirmatn', sans-serif",
      shabnam: "'Shabnam', 'Vazirmatn', sans-serif",
      sahel: "'Sahel', 'Vazirmatn', sans-serif",
      iransans: "'IRANSans', 'IRANSansX', 'Vazirmatn', sans-serif",
      system: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    };
    preview.style.fontFamily = FONT_FAMILIES_PREVIEW[familyId] || 'sans-serif';
    const scaleFactor = scale === '90' ? 0.92 : scale === '110' ? 1.08 : 1.0;
    preview.style.fontSize = `${scaleFactor * 16}px`;
    preview.style.fontFeatureSettings = persianDigits ? '"ss01", "ss02"' : 'normal';
  }

  function renderTypography(): void {
    const typo = (settings.typography as TypographySettings | undefined) ?? {
      fontFamily: 'vazirmatn',
      fontScale: '100',
      persianDigits: true,
      fontSmoothing: true,
    };
    const famSelect = document.getElementById('typography-font-family') as HTMLSelectElement | null;
    const scaleSelect = document.getElementById('typography-font-scale') as HTMLSelectElement | null;
    const digitsCheckbox = document.getElementById('typography-persian-digits') as HTMLInputElement | null;
    const smoothCheckbox = document.getElementById('typography-font-smoothing') as HTMLInputElement | null;

    if (famSelect) famSelect.value = typo.fontFamily || 'vazirmatn';
    if (scaleSelect) scaleSelect.value = typo.fontScale || '100';
    if (digitsCheckbox) digitsCheckbox.checked = typo.persianDigits !== false;
    if (smoothCheckbox) smoothCheckbox.checked = typo.fontSmoothing !== false;

    updateTypographyLivePreview();
  }

  document.getElementById('typography-font-family')?.addEventListener('change', updateTypographyLivePreview);
  document.getElementById('typography-font-scale')?.addEventListener('change', updateTypographyLivePreview);
  document.getElementById('typography-persian-digits')?.addEventListener('change', updateTypographyLivePreview);
  document.getElementById('typography-font-smoothing')?.addEventListener('change', updateTypographyLivePreview);

  document.querySelectorAll<HTMLButtonElement>('[data-save-setting="typography"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await handleSaveButton(btn, async () => {
          const typoData: TypographySettings = {
            fontFamily: (document.getElementById('typography-font-family') as HTMLSelectElement)?.value || 'vazirmatn',
            fontScale: (document.getElementById('typography-font-scale') as HTMLSelectElement)?.value || '100',
            persianDigits: (document.getElementById('typography-persian-digits') as HTMLInputElement)?.checked ?? true,
            fontSmoothing: (document.getElementById('typography-font-smoothing') as HTMLInputElement)?.checked ?? true,
          };
          await updateSetting('typography', typoData);
          settings.typography = typoData;
          applyTheme(settings.theme as any, typoData);
        });
        showSaved();
      } catch (err) {
        showError(err);
      }
    });
  });

  // ----- social networks tab -----
  interface CustomSocialItem {
    id: string;
    platform: string;
    label: string;
    url: string;
  }
  let customSocialList: CustomSocialItem[] = [];

  function updateSocialTabPreview(): void {
    const previewContainer = document.getElementById('social-tab-preview-icons');
    if (!previewContainer) return;

    const iconColor = (document.getElementById('social-tab-color-hex') as HTMLInputElement)?.value.trim();

    const activeIcons: { name: string; brandColor: string; iconSvg: string }[] = [];

    CORE_SOCIAL_LIST.forEach((core) => {
      const toggle = document.querySelector<HTMLInputElement>(`[data-social-core-toggle="${core.id}"]`);
      const urlInput = document.querySelector<HTMLInputElement>(`[data-social-core-url="${core.id}"]`);
      if (toggle?.checked && urlInput?.value.trim()) {
        activeIcons.push({
          name: core.nameEn,
          brandColor: iconColor && /^#[0-9a-fA-F]{6}$/.test(iconColor) ? iconColor : core.brandColor,
          iconSvg: core.iconSvg,
        });
      }
    });

    customSocialList.forEach((c) => {
      if (c.url.trim()) {
        activeIcons.push({
          name: c.label || c.platform,
          brandColor: iconColor && /^#[0-9a-fA-F]{6}$/.test(iconColor) ? iconColor : '#94a3b8',
          iconSvg: publicIcons.globeFilled || icons.link,
        });
      }
    });

    if (activeIcons.length === 0) {
      previewContainer.innerHTML = '<span style="color: #64748b; font-size: 0.78rem;">هنوز هیچ شبکه‌ای فعال نشده است.</span>';
      return;
    }

    previewContainer.innerHTML = activeIcons
      .map(
        (ic) => `
        <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; color: ${ic.brandColor}; border: 1px solid rgba(255,255,255,0.15);" title="${ic.name}">
          <span style="width: 18px; height: 18px; display: inline-flex; align-items: center; justify-content: center;">${ic.iconSvg}</span>
        </div>
      `,
      )
      .join('');
  }

  function renderCustomSocialList(): void {
    const list = document.getElementById('social-tab-custom-list');
    if (!list) return;
    list.innerHTML = customSocialList
      .map(
        (item, idx) => `
        <div class="settings-form-grid" data-custom-social-index="${idx}" style="grid-template-columns: 140px 160px 1fr auto; align-items: end; gap: 8px;">
          <div class="form-field">
            <label>نوع پلتفرم</label>
            <select data-field="platform">
              ${SOCIAL_PLATFORMS.map((p) => `<option value="${p.value}" ${p.value === item.platform ? 'selected' : ''}>${p.label}</option>`).join('')}
            </select>
          </div>
          <div class="form-field">
            <label>عنوان / برچسب</label>
            <input type="text" data-field="label" value="${item.label}" placeholder="مثال: کانال دوم یا پیج پشتیبانی" />
          </div>
          <div class="form-field">
            <label>آدرس اینترنتی (URL)</label>
            <input type="text" dir="ltr" data-field="url" value="${item.url}" placeholder="https://..." />
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-remove-custom-social="${idx}" style="margin-bottom: 4px; color: var(--danger);">حذف</button>
        </div>
      `,
      )
      .join('');
  }

  function readCustomSocialFromDom(): void {
    const rows = Array.from(document.querySelectorAll<HTMLElement>('[data-custom-social-index]'));
    customSocialList = rows.map((r, i) => ({
      id: customSocialList[i]?.id ?? `custom-soc-${crypto.randomUUID().slice(0, 8)}`,
      platform: r.querySelector<HTMLSelectElement>('[data-field="platform"]')!.value,
      label: r.querySelector<HTMLInputElement>('[data-field="label"]')!.value.trim(),
      url: r.querySelector<HTMLInputElement>('[data-field="url"]')!.value.trim(),
    }));
  }

  document.getElementById('social-tab-custom-add-btn')?.addEventListener('click', () => {
    readCustomSocialFromDom();
    customSocialList.push({ id: `custom-soc-${crypto.randomUUID().slice(0, 8)}`, platform: 'bale', label: '', url: '' });
    renderCustomSocialList();
    updateSocialTabPreview();
  });

  document.getElementById('social-tab-custom-list')?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-remove-custom-social]');
    if (!btn) return;
    readCustomSocialFromDom();
    customSocialList.splice(Number(btn.dataset.removeCustomSocial), 1);
    renderCustomSocialList();
    updateSocialTabPreview();
  });

  document.getElementById('social-tab-color-picker')?.addEventListener('input', (e) => {
    (document.getElementById('social-tab-color-hex') as HTMLInputElement).value = (e.currentTarget as HTMLInputElement).value;
    updateSocialTabPreview();
  });
  document.getElementById('social-tab-color-hex')?.addEventListener('input', updateSocialTabPreview);

  document.querySelectorAll<HTMLInputElement>('[data-social-core-toggle]').forEach((toggle) => {
    toggle.addEventListener('change', updateSocialTabPreview);
  });
  document.querySelectorAll<HTMLInputElement>('[data-social-core-url]').forEach((input) => {
    input.addEventListener('input', updateSocialTabPreview);
  });

  function renderSocialTab(): void {
    const contact = (settings.contact as ContactSettings | undefined) ?? { phoneDisplay: '', phoneTelHref: '', socialLinks: [] };
    const savedLinks = (settings.social_links as SocialLinkSetting[] | undefined) ?? contact.socialLinks ?? [];

    const iconColorHex = document.getElementById('social-tab-color-hex') as HTMLInputElement | null;
    const iconColorPicker = document.getElementById('social-tab-color-picker') as HTMLInputElement | null;
    if (iconColorHex && contact.socialIconColor) {
      iconColorHex.value = contact.socialIconColor;
      if (iconColorPicker && /^#[0-9a-fA-F]{6}$/.test(contact.socialIconColor)) {
        iconColorPicker.value = contact.socialIconColor;
      }
    }

    // Populate core items
    const customItems: CustomSocialItem[] = [];
    savedLinks.forEach((link) => {
      const core = CORE_SOCIAL_LIST.find((c) => c.id === link.platform || c.id === link.id);
      if (core) {
        const toggle = document.getElementById(`social-core-toggle-${core.id}`) as HTMLInputElement | null;
        const urlInput = document.getElementById(`social-core-url-${core.id}`) as HTMLInputElement | null;
        if (toggle) toggle.checked = Boolean(link.url);
        if (urlInput) urlInput.value = link.url || '';
      } else {
        customItems.push({
          id: link.id,
          platform: link.platform,
          label: link.label,
          url: link.url,
        });
      }
    });

    customSocialList = customItems;
    renderCustomSocialList();
    updateSocialTabPreview();
  }

  document.querySelectorAll<HTMLButtonElement>('[data-save-setting="social"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await handleSaveButton(btn, async () => {
          readCustomSocialFromDom();
          const socialColor = (document.getElementById('social-tab-color-hex') as HTMLInputElement)?.value.trim() || undefined;

          const linksToSave: SocialLinkSetting[] = [];
          CORE_SOCIAL_LIST.forEach((core) => {
            const toggle = document.querySelector<HTMLInputElement>(`[data-social-core-toggle="${core.id}"]`);
            const urlInput = document.querySelector<HTMLInputElement>(`[data-social-core-url="${core.id}"]`);
            if (toggle?.checked && urlInput?.value.trim()) {
              linksToSave.push({
                id: core.id,
                platform: core.id,
                label: core.name,
                url: urlInput.value.trim(),
              });
            }
          });

          customSocialList.forEach((c) => {
            if (c.url.trim()) {
              linksToSave.push({
                id: c.id,
                platform: c.platform,
                label: c.label,
                url: c.url.trim(),
              });
            }
          });

          // Save to social_links
          await updateSetting('social_links', linksToSave);
          settings.social_links = linksToSave;

          // Also synchronize with contact settings so Footer.ts and other consumers stay 100% updated
          const existingContact = (settings.contact as ContactSettings | undefined) ?? { phoneDisplay: '', phoneTelHref: '', socialLinks: [] };
          const updatedContact = {
            ...existingContact,
            socialIconColor: socialColor,
            socialLinks: linksToSave,
          };
          await updateSetting('contact', updatedContact);
          settings.contact = updatedContact;
        });
        showSaved();
      } catch (err) {
        showError(err);
      }
    });
  });

  // ----- map settings -----
  let previewMapInstance: L.Map | null = null;
  let currentPreviewTileLayer: L.TileLayer | null = null;

  function initMapPreview(config: MapSettings): void {
    const container = document.getElementById('settings-map-preview');
    if (!container) return;

    if (!previewMapInstance) {
      previewMapInstance = L.map('settings-map-preview', {
        center: [35.6892, 51.389],
        zoom: 12,
      });
      L.marker([35.6892, 51.389], { draggable: true }).addTo(previewMapInstance);
    }

    if (currentPreviewTileLayer) {
      try {
        previewMapInstance.removeLayer(currentPreviewTileLayer);
      } catch {}
    }

    currentPreviewTileLayer = createConfiguredTileLayer(config);
    currentPreviewTileLayer.addTo(previewMapInstance);

    const statusEl = document.getElementById('settings-map-status');
    if (statusEl) {
      const meta = MAP_PROVIDERS.find((p) => p.id === config.provider);
      const providerName = meta ? meta.nameFa : config.provider;
      const keyNotice = meta?.hasApiKey && !config.apiKey ? ' (بدون کلید — فال‌بک OSM)' : '';
      statusEl.innerHTML = `<span style="color: var(--color-success, #10b981); font-weight: 600;">● لایه فعال: ${providerName}${keyNotice}</span>`;
    }

    window.setTimeout(() => previewMapInstance?.invalidateSize(), 120);
  }

  function updateMapFormForProvider(providerId: MapProvider): void {
    const meta = MAP_PROVIDERS.find((p) => p.id === providerId) || MAP_PROVIDERS[0];
    const keyGroup = document.getElementById('settings-map-api-key-group');
    const keyLabel = document.getElementById('settings-map-api-key-label');
    const keyInput = document.getElementById('settings-map-api-key') as HTMLInputElement | null;
    const keyHint = document.getElementById('settings-map-api-key-hint');
    const customUrlGroup = document.getElementById('settings-map-custom-url-group');
    const typeGroup = document.getElementById('settings-map-type-group');

    if (keyGroup && keyLabel && keyInput && keyHint) {
      if (meta.hasApiKey) {
        keyGroup.hidden = false;
        keyLabel.textContent = meta.apiKeyLabel;
        keyInput.placeholder = meta.apiKeyPlaceholder;
        const devLink = meta.devUrl ? ` (<a href="${meta.devUrl}" target="_blank" rel="noopener" style="text-decoration: underline; color: var(--primary);">دریافت کلید از پنل توسعه‌دهنده</a>)` : '';
        keyHint.innerHTML = meta.helpText + devLink;
      } else if (providerId === 'custom') {
        keyGroup.hidden = false;
        keyLabel.textContent = 'کلید یا توکن دسترسی (در صورت نیاز)';
        keyInput.placeholder = 'اختیاری';
        keyHint.textContent = 'اگر سرور کاشی شما نیاز به کلید دارد، وارد کنید.';
      } else {
        keyGroup.hidden = true;
        keyHint.textContent = meta.helpText;
      }
    }

    if (customUrlGroup) {
      customUrlGroup.hidden = providerId !== 'custom';
    }

    if (typeGroup) {
      typeGroup.hidden = providerId !== 'google';
    }
  }

  function getMapDraftSettings(): MapSettings {
    const provider = ((document.getElementById('settings-map-provider') as HTMLSelectElement)?.value || 'osm') as MapProvider;
    const apiKey = (document.getElementById('settings-map-api-key') as HTMLInputElement)?.value.trim() || '';
    const customTileUrl = (document.getElementById('settings-map-custom-url') as HTMLInputElement)?.value.trim() || '';
    const mapType = ((document.getElementById('settings-map-type') as HTMLSelectElement)?.value || 'standard') as 'standard' | 'satellite' | 'terrain';
    return { provider, apiKey, customTileUrl, mapType };
  }

  document.getElementById('settings-map-provider')?.addEventListener('change', (e) => {
    const provider = (e.target as HTMLSelectElement).value as MapProvider;
    updateMapFormForProvider(provider);
    initMapPreview(getMapDraftSettings());
  });

  document.getElementById('settings-map-type')?.addEventListener('change', () => {
    initMapPreview(getMapDraftSettings());
  });

  document.getElementById('settings-map-test-preview-btn')?.addEventListener('click', () => {
    initMapPreview(getMapDraftSettings());
  });

  document.getElementById('settings-map-save-btn')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget as HTMLButtonElement;
    try {
      await handleSaveButton(btn, async () => {
        const mapConfig = getMapDraftSettings();
        await updateSetting('map', mapConfig);
        settings.map = mapConfig;
        initMapPreview(mapConfig);
      });
      showSaved();
    } catch (err) {
      showError(err);
    }
  });

  function renderMapSettings(): void {
    const mapConfig = (settings.map as MapSettings | undefined) ?? DEFAULT_MAP_SETTINGS;
    const providerSelect = document.getElementById('settings-map-provider') as HTMLSelectElement | null;
    const apiKeyInput = document.getElementById('settings-map-api-key') as HTMLInputElement | null;
    const customUrlInput = document.getElementById('settings-map-custom-url') as HTMLInputElement | null;
    const typeSelect = document.getElementById('settings-map-type') as HTMLSelectElement | null;

    if (providerSelect) providerSelect.value = mapConfig.provider || 'osm';
    if (apiKeyInput) apiKeyInput.value = mapConfig.apiKey || '';
    if (customUrlInput) customUrlInput.value = mapConfig.customTileUrl || '';
    if (typeSelect) typeSelect.value = mapConfig.mapType || 'standard';

    updateMapFormForProvider(mapConfig.provider || 'osm');
    initMapPreview(mapConfig);
  }

  // ----- load everything -----
  fetchSettings()
    .then((data) => {
      settings = data;

      renderGeneral();
      renderContact();
      renderTheme();
      renderTypography();
      renderSocialTab();
      renderAppLinks();
      renderCertifications();
      renderMapSettings();
    })
    .catch(showError);

  if (currentStaff && hasPermission(currentStaff, 'plugins')) {
    fetchPlugins()
      .then((data) => {
        plugins = data;
        renderPlugins();
      })
      .catch(showError);
  }

  if (currentStaff && hasPermission(currentStaff, 'settings')) {
    fetchLicense()
      .then((license) => renderLicensePanel(license))
      .catch(showError);
  }

  const licenseKeyInput = document.getElementById('license-key-input') as HTMLInputElement | null;
  const licenseActivateBtn = document.getElementById('license-activate-btn') as HTMLButtonElement | null;
  const licenseActivateError = document.getElementById('license-activate-error');
  licenseActivateBtn?.addEventListener('click', async () => {
    if (!licenseKeyInput || !licenseActivateError) return;
    const licenseKey = licenseKeyInput.value.trim();
    licenseActivateError.hidden = true;
    if (!licenseKey) {
      licenseActivateError.hidden = false;
      licenseActivateError.textContent = 'کد لایسنس را وارد کنید.';
      return;
    }
    licenseActivateBtn.disabled = true;
    try {
      const license = await activateLicense(licenseKey);
      licenseKeyInput.value = '';
      renderLicensePanel(license);
    } catch (err) {
      licenseActivateError.hidden = false;
      licenseActivateError.textContent = err instanceof Error ? err.message : 'فعال‌سازی لایسنس ناموفق بود.';
    } finally {
      licenseActivateBtn.disabled = false;
    }
  });

  // ----- پشتیبان‌گیری -----
  const backupDownloadBtn = document.getElementById('backup-download-btn') as HTMLButtonElement | null;
  const backupDownloadError = document.getElementById('backup-download-error');
  backupDownloadBtn?.addEventListener('click', async () => {
    if (!backupDownloadError) return;
    backupDownloadError.hidden = true;
    backupDownloadBtn.disabled = true;
    try {
      await downloadBackup();
    } catch (err) {
      backupDownloadError.hidden = false;
      backupDownloadError.textContent = err instanceof Error ? err.message : 'دریافت فایل پشتیبان ناموفق بود.';
    } finally {
      backupDownloadBtn.disabled = false;
    }
  });

  const backupRestoreFile = document.getElementById('backup-restore-file') as HTMLInputElement | null;
  const backupRestoreBtn = document.getElementById('backup-restore-btn') as HTMLButtonElement | null;
  const backupRestoreError = document.getElementById('backup-restore-error');
  const backupRestoreSuccess = document.getElementById('backup-restore-success');
  backupRestoreFile?.addEventListener('change', () => {
    if (backupRestoreBtn) backupRestoreBtn.disabled = !backupRestoreFile.files?.length;
    if (backupRestoreSuccess) backupRestoreSuccess.hidden = true;
  });
  backupRestoreBtn?.addEventListener('click', async () => {
    if (!backupRestoreFile || !backupRestoreError || !backupRestoreSuccess) return;
    const file = backupRestoreFile.files?.[0];
    if (!file) return;

    const confirmed = window.confirm(
      'با ادامه، تمام داده‌های فعلی سایت (درخواست‌ها، کارمندان، تنظیمات، محتوا و ...) با محتوای این فایل جایگزین می‌شود و این عمل غیرقابل‌بازگشت است. مطمئنید؟',
    );
    if (!confirmed) return;

    backupRestoreError.hidden = true;
    backupRestoreSuccess.hidden = true;
    backupRestoreBtn.disabled = true;
    try {
      const text = await file.text();
      await restoreBackup(text);
      backupRestoreSuccess.hidden = false;
      backupRestoreFile.value = '';
    } catch (err) {
      backupRestoreError.hidden = false;
      backupRestoreError.textContent = err instanceof Error ? err.message : 'بازیابی پشتیبان ناموفق بود.';
    } finally {
      backupRestoreBtn.disabled = !backupRestoreFile.files?.length;
    }
  });

  // آدرس بک‌اند را نشان می‌دهیم، نه آدرس پنل — روی کلادفلر این دو دامنه‌ی متفاوتی هستند (باید همان چیزی
  // باشد که Worker خودش هنگام ساخت redirect_uri محاسبه می‌کند: new URL(request.url).origin).
  const redirectUriEl = document.getElementById('drive-redirect-uri');
  if (redirectUriEl) redirectUriEl.textContent = `${API_BASE_URL || location.origin}/api/admin/backup/drive-oauth/callback`;

  const backupDriveError = document.getElementById('backup-drive-error');
  const backupDriveSaveBtn = document.getElementById('backup-drive-save-btn') as HTMLButtonElement | null;
  if (backupDriveSaveBtn) {
    backupDriveSaveBtn.addEventListener('click', async () => {
      if (!backupDriveError) return;
      backupDriveError.hidden = true;
      try {
        await handleSaveButton(backupDriveSaveBtn, async () => {
          const existing = (plugins.googleDrive as GoogleDrivePluginConfig | undefined) ?? {};
          plugins = {
            ...plugins,
            googleDrive: {
              ...existing,
              enabled: (document.getElementById('backup-drive-enabled') as HTMLInputElement).checked,
              clientId: (document.getElementById('backup-drive-client-id') as HTMLInputElement).value.trim(),
              clientSecret: (document.getElementById('backup-drive-client-secret') as HTMLInputElement).value.trim(),
              folderId: (document.getElementById('backup-drive-folder') as HTMLInputElement).value.trim(),
            },
          };
          await updateSetting('plugins', plugins);
        });
      } catch (err) {
        backupDriveError.hidden = false;
        backupDriveError.textContent = err instanceof Error ? err.message : 'ذخیره تنظیمات ناموفق بود.';
      }
    });
  }

  document.getElementById('backup-drive-test-btn')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget as HTMLButtonElement;
    if (!backupDriveError) return;
    backupDriveError.hidden = true;
    btn.disabled = true;
    btn.textContent = 'در حال ارسال...';
    try {
      await testDriveBackup();
      showSaved();
    } catch (err) {
      backupDriveError.hidden = false;
      backupDriveError.textContent = err instanceof Error ? err.message : 'ارسال آزمایشی ناموفق بود.';
    } finally {
      btn.disabled = false;
      btn.textContent = 'ارسال آزمایشی الان';
    }
  });

  document.getElementById('backup-drive-connect-btn')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget as HTMLButtonElement;
    if (!backupDriveError) return;
    backupDriveError.hidden = true;
    btn.disabled = true;
    try {
      const authUrl = await prepareDriveOAuth();
      window.location.href = authUrl;
    } catch (err) {
      backupDriveError.hidden = false;
      backupDriveError.textContent = err instanceof Error ? err.message : 'آماده‌سازی اتصال ناموفق بود.';
      btn.disabled = false;
    }
  });

  document.getElementById('backup-drive-disconnect-btn')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget as HTMLButtonElement;
    if (!backupDriveError) return;
    if (!window.confirm('اتصال به گوگل درایو قطع شود؟ ارسال خودکار روزانه متوقف می‌شود.')) return;
    backupDriveError.hidden = true;
    btn.disabled = true;
    try {
      await disconnectDrive();
      renderDriveConnectionStatus(false);
      const enabledEl = document.getElementById('backup-drive-enabled') as HTMLInputElement | null;
      if (enabledEl) enabledEl.checked = false;
    } catch (err) {
      backupDriveError.hidden = false;
      backupDriveError.textContent = err instanceof Error ? err.message : 'قطع اتصال ناموفق بود.';
    } finally {
      btn.disabled = false;
    }
  });

  if (currentStaff && hasPermission(currentStaff, 'settings')) initUpdatePanel();
}

import type { ThemeSettings } from './dynamicContent.ts';

const THEME_VAR_NAMES: Record<string, string> = {
  primary: '--primary',
  primaryDark: '--primary-dark',
  secondary: '--secondary',
  secondaryLight: '--secondary-light',
  background: '--background',
  surface: '--surface',
  surfaceAlt: '--surface-alt',
  text: '--text',
  muted: '--muted',
  border: '--border',
  success: '--success',
  successDark: '--success-dark',
  successBg: '--success-bg',
  warning: '--warning',
  callGreen: '--call-green',
  callGreenDark: '--call-green-dark',
  accentPurple: '--accent-purple',
  accentPurpleLight: '--accent-purple-light',
  accentPurpleLightHover: '--accent-purple-light-hover',
  gooseGreen: '--goose-green',
  gooseGreenLight: '--goose-green-light',
};

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

export interface TypographySettings {
  fontFamily?: string;
  fontScale?: string;
  persianDigits?: boolean;
  fontSmoothing?: boolean;
}

const FONT_FAMILIES: Record<string, string> = {
  vazirmatn: "'Vazirmatn', -apple-system, BlinkMacSystemFont, sans-serif",
  yekan: "'Yekan Bakh', 'IRANYekan', 'Vazirmatn', sans-serif",
  dana: "'Dana', 'Vazirmatn', sans-serif",
  shabnam: "'Shabnam', 'Vazirmatn', sans-serif",
  sahel: "'Sahel', 'Vazirmatn', sans-serif",
  iransans: "'IRANSans', 'IRANSansX', 'Vazirmatn', sans-serif",
  system: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};

function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  if (isNaN(num)) return hex;
  let r = (num >> 16) + Math.round(255 * (percent / 100));
  let g = ((num >> 8) & 0x00ff) + Math.round(255 * (percent / 100));
  let b = (num & 0x0000ff) + Math.round(255 * (percent / 100));
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function hexToRgba(hex: string, alpha: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  if (isNaN(num)) return hex;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function isDarkColor(hex: string): boolean {
  const num = parseInt(hex.replace('#', ''), 16);
  if (isNaN(num)) return false;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance < 128;
}

export function applyTheme(theme?: ThemeSettings, typography?: TypographySettings): void {
  // «فیکس» یعنی دکمه‌های تماس/چت بخشی ثابت از صفحه‌اند (با اسکرول جابه‌جا نمی‌شوند)
  document.documentElement.classList.toggle('quick-actions-fixed', theme?.quickActionsStyle === 'fixed');

  // جهت قرارگیری دکمه‌های تماس و چت روی وب (دسکتاپ): راست (پیش‌فرض) یا چپ
  const savedSide = localStorage.getItem('behdoon_quick_actions_side') || localStorage.getItem('behbar_quick_actions_side');
  const activeSide = savedSide === 'left' || savedSide === 'right'
    ? savedSide
    : (theme?.quickActionsPosition === 'left' ? 'left' : 'right');
  document.documentElement.classList.toggle('quick-actions-left', activeSide === 'left');
  document.documentElement.classList.toggle('quick-actions-right', activeSide === 'right');

  const root = document.documentElement.style;

  if (theme) {
    for (const [key, varName] of Object.entries(THEME_VAR_NAMES)) {
      const value = theme[key];
      if (value && HEX_COLOR.test(value)) root.setProperty(varName, value);
    }

    // Auto-calculate smart fallbacks and derived shades
    if (theme.primary) {
      if (!theme.primaryDark) {
        root.setProperty('--primary-dark', adjustBrightness(theme.primary, -12));
      }
      if (!theme.accentPurple) {
        root.setProperty('--accent-purple', theme.primary);
      }
      if (!theme.accentPurpleLight) {
        root.setProperty('--accent-purple-light', hexToRgba(theme.primary, 0.12));
      }
      if (!theme.accentPurpleLightHover) {
        root.setProperty('--accent-purple-light-hover', hexToRgba(theme.primary, 0.22));
      }
    }

    if (theme.secondary) {
      if (!theme.secondaryLight) {
        root.setProperty('--secondary-light', hexToRgba(theme.secondary, 0.15));
      }
    }

    if (theme.callGreen) {
      if (!theme.callGreenDark) {
        root.setProperty('--call-green-dark', adjustBrightness(theme.callGreen, -12));
      }
      if (!theme.gooseGreen) {
        root.setProperty('--goose-green', theme.callGreen);
      }
      if (!theme.gooseGreenLight) {
        root.setProperty('--goose-green-light', hexToRgba(theme.callGreen, 0.15));
      }
    }

    if (theme.surface && !theme.surfaceAlt) {
      root.setProperty('--surface-alt', theme.background ? (isDarkColor(theme.background) ? adjustBrightness(theme.surface, 8) : adjustBrightness(theme.surface, -4)) : '#f1f5f9');
    }

    // Dynamic color-scheme based on theme background
    if (theme.background) {
      const isDark = isDarkColor(theme.background);
      root.setProperty('color-scheme', isDark ? 'dark' : 'light');
      if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        const localTheme = localStorage.getItem('behdoon_theme') || localStorage.getItem('behbar_theme');
        if (localTheme !== 'dark') {
          document.documentElement.removeAttribute('data-theme');
        }
      }
    }
  }

  // Apply Typography
  if (typography) {
    if (typography.fontFamily && FONT_FAMILIES[typography.fontFamily]) {
      root.setProperty('--font-family', FONT_FAMILIES[typography.fontFamily]);
      document.body && (document.body.style.fontFamily = FONT_FAMILIES[typography.fontFamily]);
    }
    if (typography.fontScale) {
      const scaleMap: Record<string, string> = { '90': '0.92', '100': '1.0', '110': '1.08' };
      const scale = scaleMap[typography.fontScale] || '1.0';
      root.setProperty('--font-scale', scale);
      document.documentElement.style.fontSize = `${Number(scale) * 16}px`;
    }
    if (typography.persianDigits !== false) {
      root.setProperty('font-feature-settings', '"ss01", "ss02"');
    }
  }
}

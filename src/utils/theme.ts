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

export function applyTheme(theme?: ThemeSettings, typography?: TypographySettings): void {
  // «فیکس» یعنی دکمه‌های تماس/چت بخشی ثابت از صفحه‌اند (با اسکرول جابه‌جا نمی‌شوند)
  document.documentElement.classList.toggle('quick-actions-fixed', theme?.quickActionsStyle === 'fixed');

  // جهت قرارگیری دکمه‌های تماس و چت روی وب (دسکتاپ): راست (پیش‌فرض) یا چپ
  const savedSide = localStorage.getItem('behbar_quick_actions_side');
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

    // Auto-calculate smart fallbacks if only simplified 9 keys are provided
    if (theme.primary && !theme.primaryDark) {
      root.setProperty('--primary-dark', theme.primary);
    }
    if (theme.primary && !theme.accentPurple) {
      root.setProperty('--accent-purple', theme.primary);
    }
    if (theme.primary && !theme.accentPurpleLight) {
      root.setProperty('--accent-purple-light', `${theme.primary}18`);
    }
    if (theme.primary && !theme.accentPurpleLightHover) {
      root.setProperty('--accent-purple-light-hover', `${theme.primary}28`);
    }
    if (theme.callGreen && !theme.callGreenDark) {
      root.setProperty('--call-green-dark', theme.callGreen);
      root.setProperty('--goose-green', theme.callGreen);
    }
    if (theme.surface && !theme.surfaceAlt) {
      root.setProperty('--surface-alt', theme.background || '#f1f5f9');
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

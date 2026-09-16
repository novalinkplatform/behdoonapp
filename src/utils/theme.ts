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

export function applyTheme(theme?: ThemeSettings): void {
  // «فیکس» یعنی دکمه‌های تماس/چت بخشی ثابت از صفحه‌اند (با اسکرول جابه‌جا نمی‌شوند)، برخلاف حالت
  // پیش‌فرض «شناور» که همیشه روی صفحه ثابت می‌مانند — یک تنظیم سراسری، مستقل از تک‌تک صفحات.
  document.documentElement.classList.toggle('quick-actions-fixed', theme?.quickActionsStyle === 'fixed');

  // جهت قرارگیری دکمه‌های تماس و چت روی وب (دسکتاپ): راست (پیش‌فرض) یا چپ
  const savedSide = localStorage.getItem('behbar_quick_actions_side');
  const activeSide = savedSide === 'left' || savedSide === 'right'
    ? savedSide
    : (theme?.quickActionsPosition === 'left' ? 'left' : 'right');
  document.documentElement.classList.toggle('quick-actions-left', activeSide === 'left');
  document.documentElement.classList.toggle('quick-actions-right', activeSide === 'right');

  if (!theme) return;
  const root = document.documentElement.style;
  for (const [key, varName] of Object.entries(THEME_VAR_NAMES)) {
    const value = theme[key];
    if (value && HEX_COLOR.test(value)) root.setProperty(varName, value);
  }
}

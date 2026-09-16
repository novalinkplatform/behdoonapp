import { icons } from './icons.ts';
import {
  PERSIAN_MONTH_NAMES,
  PERSIAN_MONTH_NAMES_EN,
  PERSIAN_WEEKDAY_SHORT,
  formatJalaaliDate,
  jalaaliMonthLength,
  jalaaliWeekday,
  toPersianDigits,
  todayJalaali,
  addDaysJalaali,
} from '../utils/jalali.ts';
import {
  GREGORIAN_MONTH_NAMES,
  GREGORIAN_WEEKDAY_SHORT,
  formatGregorianDate,
  gregorianMonthLength,
  gregorianWeekday,
  todayGregorian,
  addDaysGregorian,
} from '../utils/gregorian.ts';
import { getLang, pick } from '../i18n/lang.ts';

// وقتی سایت فارسی است تقویم شمسی و وقتی انگلیسی است تقویم میلادی واقعی نشان داده می‌شود — نه فقط
// برچسب انگلیسی روی همان تقویم شمسی. چون سیستم‌های تقویمی متفاوت‌اند، فقط y/m/d و اندیس روزهای هفته
// مشترک نگه داشته می‌شود و بقیه‌ی محاسبات (طول ماه، اولین روز هفته) بسته به سیستم فراخوانی می‌شود.

function defaultPlaceholder(): string {
  return pick('انتخاب تاریخ', 'Select date');
}

export function renderCalendarPicker(id: string, placeholder?: string): string {
  const resolvedPlaceholder = placeholder ?? defaultPlaceholder();
  return `
    <div class="calendar-picker" id="${id}">
      <button
        type="button"
        class="calendar-trigger"
        id="${id}-trigger"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls="${id}-panel"
      >
        <span class="icon">${icons.calendar}</span>
        <span class="calendar-trigger-text" id="${id}-trigger-text">${resolvedPlaceholder}</span>
      </button>
      <div class="calendar-panel" id="${id}-panel" role="dialog" aria-label="${pick('انتخاب تاریخ', 'Select date')}" hidden>
        <div class="calendar-header">
          <button type="button" class="calendar-nav" id="${id}-prev" aria-label="${pick('ماه قبل', 'Previous month')}">${icons.chevronRight}</button>
          <div class="calendar-month-label" id="${id}-month-label"></div>
          <button type="button" class="calendar-nav" id="${id}-next" aria-label="${pick('ماه بعد', 'Next month')}">${icons.chevronLeft}</button>
        </div>
        <div class="calendar-weekdays" id="${id}-weekdays"></div>
        <div class="calendar-days" id="${id}-days"></div>
      </div>
    </div>
  `;
}

export interface CalendarPickerController {
  getSelected: () => string | null;
  reset: () => void;
}

export interface CalendarPickerOptions {
  maxDaysAhead?: number;
  placeholder?: string;
  onSelect?: (label: string) => void;
}

export function initCalendarPicker(id: string, options: CalendarPickerOptions = {}): CalendarPickerController {
  const root = document.getElementById(id);
  const trigger = document.getElementById(`${id}-trigger`);
  const triggerText = document.getElementById(`${id}-trigger-text`);
  const panel = document.getElementById(`${id}-panel`);
  const monthLabel = document.getElementById(`${id}-month-label`);
  const weekdaysContainer = document.getElementById(`${id}-weekdays`);
  const daysContainer = document.getElementById(`${id}-days`);
  const prevBtn = document.getElementById(`${id}-prev`) as HTMLButtonElement | null;
  const nextBtn = document.getElementById(`${id}-next`) as HTMLButtonElement | null;

  const noop: CalendarPickerController = { getSelected: () => null, reset: () => {} };
  if (!root || !trigger || !triggerText || !panel || !monthLabel || !weekdaysContainer || !daysContainer || !prevBtn || !nextBtn) {
    return noop;
  }

  const isGregorian = getLang() !== 'fa';
  const placeholder = options.placeholder ?? defaultPlaceholder();
  const maxDaysAhead = options.maxDaysAhead;

  type YMD = { y: number; m: number; d: number };
  let minYmd: YMD;
  let maxYmd: YMD | null;
  if (isGregorian) {
    const today = todayGregorian();
    minYmd = { y: today.y, m: today.m, d: today.d };
    const max = maxDaysAhead != null ? addDaysGregorian(today, maxDaysAhead) : null;
    maxYmd = max ? { y: max.y, m: max.m, d: max.d } : null;
  } else {
    const today = todayJalaali();
    minYmd = { y: today.jy, m: today.jm, d: today.jd };
    const max = maxDaysAhead != null ? addDaysJalaali(today, maxDaysAhead) : null;
    maxYmd = max ? { y: max.jy, m: max.jm, d: max.jd } : null;
  }

  let viewYear = minYmd.y;
  let viewMonth = minYmd.m;
  let selected: YMD | null = null;

  const isBeforeMin = (y: number, m: number, d: number): boolean => {
    if (y !== minYmd.y) return y < minYmd.y;
    if (m !== minYmd.m) return m < minYmd.m;
    return d < minYmd.d;
  };

  const isAfterMax = (y: number, m: number, d: number): boolean => {
    if (!maxYmd) return false;
    if (y !== maxYmd.y) return y > maxYmd.y;
    if (m !== maxYmd.m) return m > maxYmd.m;
    return d > maxYmd.d;
  };

  const monthLength = (y: number, m: number): number => (isGregorian ? gregorianMonthLength(y, m) : jalaaliMonthLength(y, m));
  const firstWeekday = (y: number, m: number): number => (isGregorian ? gregorianWeekday(y, m, 1) : jalaaliWeekday(y, m, 1));
  const monthNames = isGregorian ? GREGORIAN_MONTH_NAMES : getLang() === 'fa' ? PERSIAN_MONTH_NAMES : PERSIAN_MONTH_NAMES_EN;
  const weekdayShort = isGregorian ? GREGORIAN_WEEKDAY_SHORT : PERSIAN_WEEKDAY_SHORT;
  const formatSelected = (v: YMD): string => (isGregorian ? formatGregorianDate(v) : formatJalaaliDate({ jy: v.y, jm: v.m, jd: v.d }));

  weekdaysContainer.innerHTML = weekdayShort.map((day) => `<span>${day}</span>`).join('');

  const onDocClick = (event: MouseEvent): void => {
    if (!root.contains(event.target as Node)) closePanel();
  };

  const onScroll = (): void => closePanel();

  function positionPanel(): void {
    if (!panel || !trigger) return;
    const rect = trigger.getBoundingClientRect();
    panel.style.top = `${rect.bottom + 8}px`;
    panel.style.right = `${Math.max(8, window.innerWidth - rect.right)}px`;
    panel.style.left = 'auto';
  }

  function openPanel(): void {
    if (!panel || !trigger) return;
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    renderDays();
    positionPanel();
    document.addEventListener('click', onDocClick, true);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', positionPanel);
  }

  function closePanel(): void {
    if (!panel || !trigger) return;
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', onDocClick, true);
    window.removeEventListener('scroll', onScroll, true);
    window.removeEventListener('resize', positionPanel);
  }

  function renderDays(): void {
    if (!monthLabel || !daysContainer || !prevBtn || !nextBtn) return;
    monthLabel.textContent = isGregorian ? `${monthNames[viewMonth - 1]} ${viewYear}` : `${monthNames[viewMonth - 1]} ${toPersianDigits(viewYear)}`;

    const startWeekday = firstWeekday(viewYear, viewMonth);
    const daysInMonth = monthLength(viewYear, viewMonth);
    const cells: string[] = [];

    for (let i = 0; i < startWeekday; i += 1) {
      cells.push('<span class="calendar-day calendar-day-empty" aria-hidden="true"></span>');
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const disabled = isBeforeMin(viewYear, viewMonth, day) || isAfterMax(viewYear, viewMonth, day);
      const isSelected = !!selected && selected.y === viewYear && selected.m === viewMonth && selected.d === day;
      const isToday = viewYear === minYmd.y && viewMonth === minYmd.m && day === minYmd.d;
      const classes = ['calendar-day'];
      if (isSelected) classes.push('is-selected');
      if (isToday) classes.push('is-today');
      const dayLabel = isGregorian ? String(day) : toPersianDigits(day);
      cells.push(`<button type="button" class="${classes.join(' ')}" data-day="${day}" ${disabled ? 'disabled' : ''}>${dayLabel}</button>`);
    }

    daysContainer.innerHTML = cells.join('');
    daysContainer.querySelectorAll<HTMLButtonElement>('.calendar-day:not(.calendar-day-empty)').forEach((btn) => {
      btn.addEventListener('click', () => {
        const day = Number(btn.dataset.day);
        selected = { y: viewYear, m: viewMonth, d: day };
        const label = formatSelected(selected);
        if (triggerText) triggerText.textContent = label;
        trigger?.classList.add('has-value');
        closePanel();
        options.onSelect?.(label);
      });
    });

    prevBtn.disabled = viewYear === minYmd.y && viewMonth === minYmd.m;
    nextBtn.disabled = !!maxYmd && viewYear === maxYmd.y && viewMonth === maxYmd.m;
  }

  trigger.addEventListener('click', () => {
    if (panel.hidden) openPanel();
    else closePanel();
  });

  prevBtn.addEventListener('click', () => {
    viewMonth -= 1;
    if (viewMonth < 1) {
      viewMonth = 12;
      viewYear -= 1;
    }
    renderDays();
  });

  nextBtn.addEventListener('click', () => {
    viewMonth += 1;
    if (viewMonth > 12) {
      viewMonth = 1;
      viewYear += 1;
    }
    renderDays();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) closePanel();
  });

  return {
    getSelected: () => (selected ? formatSelected(selected) : null),
    reset: () => {
      selected = null;
      viewYear = minYmd.y;
      viewMonth = minYmd.m;
      if (triggerText) triggerText.textContent = placeholder;
      trigger.classList.remove('has-value');
    },
  };
}

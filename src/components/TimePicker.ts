import { icons } from './icons.ts';
import { toPersianDigits } from '../utils/jalali.ts';
import { pick } from '../i18n/lang.ts';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function renderTimePicker(id: string): string {
  return `
    <div class="time-picker" id="${id}">
      <span class="icon time-picker-icon">${icons.clock}</span>
      <div class="select-wrapper time-select-wrapper">
        <select class="time-select" id="${id}-hour" aria-label="${pick('ساعت', 'Hour')}">
          <option value="">${pick('ساعت', 'HH')}</option>
          ${HOURS.map((hour) => `<option value="${hour}">${toPersianDigits(pad(hour))}</option>`).join('')}
        </select>
        <span class="icon select-chevron">${icons.chevronDown}</span>
      </div>
      <span class="time-picker-colon">:</span>
      <div class="select-wrapper time-select-wrapper">
        <select class="time-select" id="${id}-minute" aria-label="${pick('دقیقه', 'Minute')}">
          <option value="">${pick('دقیقه', 'MM')}</option>
          ${MINUTES.map((minute) => `<option value="${minute}">${toPersianDigits(pad(minute))}</option>`).join('')}
        </select>
        <span class="icon select-chevron">${icons.chevronDown}</span>
      </div>
    </div>
  `;
}

export interface SelectedTime {
  hour: number;
  minute: number;
}

export interface TimePickerController {
  getSelected: () => SelectedTime | null;
  reset: () => void;
}

export function formatTime(time: SelectedTime): string {
  return toPersianDigits(`${pad(time.hour)}:${pad(time.minute)}`);
}

export function initTimePicker(id: string): TimePickerController {
  const hourSelect = document.getElementById(`${id}-hour`) as HTMLSelectElement | null;
  const minuteSelect = document.getElementById(`${id}-minute`) as HTMLSelectElement | null;

  if (!hourSelect || !minuteSelect) {
    return { getSelected: () => null, reset: () => {} };
  }

  return {
    getSelected: () => {
      if (hourSelect.value === '' || minuteSelect.value === '') return null;
      return { hour: Number(hourSelect.value), minute: Number(minuteSelect.value) };
    },
    reset: () => {
      hourSelect.value = '';
      minuteSelect.value = '';
    },
  };
}

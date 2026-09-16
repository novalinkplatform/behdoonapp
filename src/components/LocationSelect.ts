import { provinces } from '../data/provinces.ts';
import { icons } from './icons.ts';
import { pick } from '../i18n/lang.ts';

export function renderLocationSelect(id: string, label: string): string {
  return `
    <div class="form-field">
      <span class="field-label">${label}</span>
      <div class="location-select-group">
        <div class="select-wrapper">
          <select id="${id}-province" aria-label="${pick('استان', 'Province')} ${label}">
            <option value="">${pick('انتخاب استان', 'Select province')}</option>
            ${provinces.map((province) => `<option value="${province.id}">${pick(province.name, province.nameEn)}</option>`).join('')}
          </select>
          <span class="icon select-chevron">${icons.chevronDown}</span>
        </div>
        <div class="select-wrapper">
          <select id="${id}-city" aria-label="${pick('شهر', 'City')} ${label}" disabled>
            <option value="">${pick('ابتدا استان را انتخاب کنید', 'Select a province first')}</option>
          </select>
          <span class="icon select-chevron">${icons.chevronDown}</span>
        </div>
      </div>
    </div>
  `;
}

export interface LocationValue {
  province: string;
  city: string;
}

export interface LocationSelectController {
  getValue: () => LocationValue | null;
  setProvince: (provinceId: string) => void;
  setValue: (value: LocationValue) => void;
  reset: () => void;
}

// اگر خریدار پوشش مقصد را به «فقط شهرهای مشخص‌شده» محدود کرده باشد، لیست استان‌ها و شهرها به همان‌ها محدود می‌شود.
export interface LocationSelectOptions {
  allowedCities?: { city: string; province: string }[];
}

export function initLocationSelect(
  id: string,
  onProvinceChange?: (provinceId: string) => void,
  options?: LocationSelectOptions,
): LocationSelectController {
  const provinceSelect = document.getElementById(`${id}-province`) as HTMLSelectElement | null;
  const citySelect = document.getElementById(`${id}-city`) as HTMLSelectElement | null;

  const noop: LocationSelectController = { getValue: () => null, setProvince: () => {}, setValue: () => {}, reset: () => {} };
  if (!provinceSelect || !citySelect) return noop;

  const allowedCities = options?.allowedCities;
  const allowedProvinceIds = allowedCities?.length
    ? new Set(provinces.filter((p) => allowedCities.some((c) => c.province === p.name)).map((p) => p.id))
    : null;

  if (allowedProvinceIds) {
    provinceSelect.innerHTML =
      `<option value="">${pick('انتخاب استان', 'Select province')}</option>` +
      provinces
        .filter((p) => allowedProvinceIds.has(p.id))
        .map((province) => `<option value="${province.id}">${pick(province.name, province.nameEn)}</option>`)
        .join('');
  }

  function populateCities(provinceId: string): void {
    if (!citySelect) return;
    const province = provinces.find((item) => item.id === provinceId);
    if (!province) {
      citySelect.innerHTML = `<option value="">${pick('ابتدا استان را انتخاب کنید', 'Select a province first')}</option>`;
      citySelect.disabled = true;
      return;
    }
    const cityIndexes = province.cities
      .map((city, index) => ({ city, index }))
      .filter(({ city }) => !allowedCities?.length || allowedCities.some((c) => c.province === province.name && c.city === city));
    // مقدار (value) هر شهر همیشه به فارسی می‌ماند تا ثبت درخواست و ژئوکدینگ مستقل از زبان نمایش باشد.
    citySelect.innerHTML =
      `<option value="">${pick('انتخاب شهر', 'Select city')}</option>` +
      cityIndexes.map(({ city, index }) => `<option value="${city}">${pick(city, province.citiesEn[index] ?? city)}</option>`).join('');
    citySelect.disabled = false;
  }

  provinceSelect.addEventListener('change', () => {
    populateCities(provinceSelect.value);
    onProvinceChange?.(provinceSelect.value);
  });

  return {
    getValue: () => {
      const province = provinces.find((item) => item.id === provinceSelect.value);
      if (!province || !citySelect.value) return null;
      return { province: province.name, city: citySelect.value };
    },
    setProvince: (provinceId: string) => {
      if (!provinces.some((item) => item.id === provinceId)) return;
      provinceSelect.value = provinceId;
      populateCities(provinceId);
      onProvinceChange?.(provinceId);
    },
    setValue: (value: LocationValue) => {
      const province = provinces.find((item) => item.name === value.province);
      if (!province) return;
      provinceSelect.value = province.id;
      populateCities(province.id);
      onProvinceChange?.(province.id);
      if (Array.from(citySelect.options).some((o) => o.value === value.city)) {
        citySelect.value = value.city;
        // شنونده‌های خارجی (مثل ژئوکدینگ نقشه) به رویداد change شهر گوش می‌دهند؛ چون این مقداردهی
        // برنامه‌ای است نه تعامل واقعی کاربر، آن رویداد را دستی شبیه‌سازی می‌کنیم.
        citySelect.dispatchEvent(new Event('change'));
      }
    },
    reset: () => {
      provinceSelect.selectedIndex = 0;
      populateCities('');
    },
  };
}

import type { OrderRecord } from './api.ts';
import { displayCityName, displayProvinceName } from '../data/provinces.ts';
import { pick } from '../i18n/lang.ts';

export interface SavedAddress {
  province: string;
  city: string;
}

export interface SavedAddresses {
  origins: SavedAddress[];
  destinations: SavedAddress[];
}

function collectUnique(orders: OrderRecord[], pick: 'origin' | 'destination'): SavedAddress[] {
  const seen = new Map<string, SavedAddress>();
  orders.forEach((o) => {
    const province = pick === 'origin' ? o.originProvince : o.destinationProvince;
    const city = pick === 'origin' ? o.originCity : o.destinationCity;
    const key = `${province}|${city}`;
    if (!seen.has(key)) seen.set(key, { province, city });
  });
  return Array.from(seen.values());
}

// آدرس‌های مبدأ و مقصد گذشته‌ی مشتری را جدا از هم برمی‌گرداند — هم برای نمایش در حساب کاربری،
// هم برای انتخاب سریع در فرم ثبت درخواست (به‌جای وارد کردن دوباره‌ی استان/شهر).
export function extractSavedAddresses(orders: OrderRecord[]): SavedAddresses {
  return {
    origins: collectUnique(orders, 'origin'),
    destinations: collectUnique(orders, 'destination'),
  };
}

export function formatAddressLabel(address: SavedAddress): string {
  const separator = pick('،', ',');
  return `${displayCityName(address.province, address.city)}${separator} ${displayProvinceName(address.province)}`;
}

export interface GeocodeResult {
  lat: number;
  lng: number;
}

export interface ReverseGeocodeResult {
  province: string;
  city: string;
}

import type { MapSettings } from './mapProvider.ts';

let activeMapSettings: MapSettings | null = null;

export function setGeocodeMapConfig(config?: MapSettings | null): void {
  activeMapSettings = config ?? null;
}

export async function reverseGeocode(lat: number, lng: number): Promise<ReverseGeocodeResult | null> {
  const provider = activeMapSettings?.provider;
  const apiKey = (activeMapSettings?.apiKey || '').trim();

  // 1. اگر نشان با کلید معتبر تنظیم شده باشد
  if (provider === 'neshan' && apiKey) {
    try {
      const res = await fetch(`https://api.neshan.org/v5/reverse?lat=${lat}&lng=${lng}`, {
        headers: { 'Api-Key': apiKey },
      });
      if (res.ok) {
        const data = (await res.json()) as { state?: string; city?: string; formatted_address?: string };
        const province = data.state ?? '';
        const city = data.city ?? '';
        if (province) return { province, city };
      }
    } catch {
      // ادامه به فال‌بک اوپن‌استریت‌مپ
    }
  }

  // 2. اگر مپ دات آی‌آر با کلید معتبر تنظیم شده باشد
  if (provider === 'mapir' && apiKey) {
    try {
      const res = await fetch(`https://map.ir/reverse?lat=${lat}&lon=${lng}`, {
        headers: { 'x-api-key': apiKey },
      });
      if (res.ok) {
        const data = (await res.json()) as { province?: string; city?: string };
        const province = data.province ?? '';
        const city = data.city ?? '';
        if (province) return { province, city };
      }
    } catch {
      // ادامه به فال‌بک اوپن‌استریت‌مپ
    }
  }

  // 3. حالت پیش‌فرض و فال‌بک: OpenStreetMap Nominatim
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fa`,
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { address?: Record<string, string> };
    const address = data.address;
    if (!address) return null;
    const province = address.state ?? '';
    const city = address.city ?? address.town ?? address.county ?? address.village ?? '';
    if (!province) return null;
    return { province, city };
  } catch {
    return null;
  }
}

export async function geocodeCity(city: string, provinceName: string): Promise<GeocodeResult | null> {
  try {
    const query = encodeURIComponent(`${city}, ${provinceName}, Iran`);
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${query}`);
    if (!res.ok) return null;
    const results = (await res.json()) as Array<{ lat: string; lon: string }>;
    if (!results.length) return null;
    const lat = Number(results[0].lat);
    const lng = Number(results[0].lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  } catch {
    return null;
  }
}

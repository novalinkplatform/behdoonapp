import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { pick } from '../i18n/lang.ts';
import { createConfiguredTileLayer, type MapSettings } from '../utils/mapProvider.ts';

const TEHRAN: [number, number] = [35.6892, 51.389];
const IRAN_BOUNDS: [[number, number], [number, number]] = [
  [24.5, 43.0],
  [40.5, 63.8],
];

const PIN_SVG = `
  <svg width="34" height="42" viewBox="0 0 34 42" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 1C8.16 1 1 8.16 1 17c0 11.5 16 23.5 16 23.5S33 28.5 33 17C33 8.16 25.84 1 17 1Z" fill="#1656c9" stroke="#ffffff" stroke-width="2"/>
    <circle cx="17" cy="17" r="6" fill="#ffffff"/>
  </svg>
`;

const pinIcon = L.divIcon({
  className: 'location-map-pin',
  html: PIN_SVG,
  iconSize: [34, 42],
  iconAnchor: [17, 40],
});

export function renderLocationMap(id: string): string {
  return `<div class="location-map" id="${id}" role="application" aria-label="${pick('نقشه انتخاب موقعیت', 'Location picker map')}"></div>`;
}

export interface LocationMapController {
  setCenter: (lat: number, lng: number, zoom?: number) => void;
  getPosition: () => { lat: number; lng: number };
  hasInteracted: () => boolean;
  refresh: () => void;
  setBoundsMode: (mode: 'iran' | 'global') => void;
  resetToIran: () => void;
}

export function initLocationMap(
  id: string,
  onUserMove?: (lat: number, lng: number) => void,
  mapSettings?: MapSettings,
): LocationMapController | null {
  const container = document.getElementById(id);
  if (!container) return null;

  const map = L.map(id, {
    center: TEHRAN,
    zoom: 11,
    minZoom: 5,
    maxZoom: 18,
    maxBounds: IRAN_BOUNDS,
    maxBoundsViscosity: 1,
  });

  const tileLayer = createConfiguredTileLayer(mapSettings);
  tileLayer.addTo(map);

  const marker = L.marker(TEHRAN, { icon: pinIcon, draggable: true }).addTo(map);

  // فقط تعامل مستقیم کاربر (کلیک روی نقشه یا جابه‌جایی نشانگر) ثبت می‌شود؛ جابه‌جایی خودکار
  // نشانگر توسط geocode شهر (setCenter) به این معنی نیست که کاربر موقعیت را تأیید کرده است.
  let interacted = false;

  map.on('click', (event: L.LeafletMouseEvent) => {
    marker.setLatLng(event.latlng);
    interacted = true;
    onUserMove?.(event.latlng.lat, event.latlng.lng);
  });

  marker.on('dragend', () => {
    interacted = true;
    const pos = marker.getLatLng();
    onUserMove?.(pos.lat, pos.lng);
  });

  window.setTimeout(() => map.invalidateSize(), 100);

  return {
    setCenter: (lat, lng, zoom = 12) => {
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
      map.invalidateSize();
      marker.setLatLng([lat, lng]);
      // اگر پنل نقشه هنوز مخفی است (ابعاد صفر)، flyTo انیمیشنی روی مختصات پیکسلی نامعتبر محاسبه می‌کند
      // (خطای مکرر «Invalid LatLng» در کنسول) — در این حالت جابه‌جایی فوری (setView) امن است.
      const isVisible = container.offsetWidth > 0 && container.offsetHeight > 0;
      if (isVisible) {
        map.flyTo([lat, lng], zoom, { duration: 0.9 });
      } else {
        map.setView([lat, lng], zoom, { animate: false });
      }
    },
    getPosition: () => {
      const pos = marker.getLatLng();
      return { lat: pos.lat, lng: pos.lng };
    },
    hasInteracted: () => interacted,
    refresh: () => {
      map.invalidateSize();
    },
    setBoundsMode: (mode: 'iran' | 'global') => {
      if (mode === 'iran') {
        map.setMaxBounds(IRAN_BOUNDS);
        map.setMinZoom(5);
        const pos = marker.getLatLng();
        const bounds = L.latLngBounds(IRAN_BOUNDS[0], IRAN_BOUNDS[1]);
        if (!bounds.contains(pos)) {
          marker.setLatLng(TEHRAN);
          map.setView(TEHRAN, 6, { animate: false });
        }
      } else {
        try {
          (map as any).setMaxBounds(null);
        } catch {
          (map as any).options.maxBounds = null;
          (map as any).off('moveend', (map as any)._panInsideMaxBounds);
        }
        map.setMinZoom(2);
      }
      map.invalidateSize();
    },
    resetToIran: () => {
      try {
        map.setMaxBounds(IRAN_BOUNDS);
      } catch {
        // fallback
      }
      map.setMinZoom(5);
      marker.setLatLng(TEHRAN);
      map.setView(TEHRAN, 6, { animate: true });
    },
  };
}

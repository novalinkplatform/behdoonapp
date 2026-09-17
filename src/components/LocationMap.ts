import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { pick } from '../i18n/lang.ts';
import { createConfiguredTileLayer, type MapSettings } from '../utils/mapProvider.ts';

export const TEHRAN_CENTER: [number, number] = [35.7219, 51.3347];
export const TEHRAN_BOUNDS: [[number, number], [number, number]] = [
  [35.55, 51.15], // محدوده جنوب غربی تهران
  [35.85, 51.65], // محدوده شمال شرقی تهران
];

const PIN_SVG = `
  <svg width="34" height="42" viewBox="0 0 34 42" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 1C8.16 1 1 8.16 1 17c0 11.5 16 23.5 16 23.5S33 28.5 33 17C33 8.16 25.84 1 17 1Z" fill="#7c3aed" stroke="#ffffff" stroke-width="2"/>
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
  return `<div class="location-map" id="${id}" role="application" aria-label="${pick('نقشه انتخاب موقعیت در تهران', 'Tehran location picker map')}"></div>`;
}

export interface LocationMapController {
  setCenter: (lat: number, lng: number, zoom?: number) => void;
  getPosition: () => { lat: number; lng: number };
  hasInteracted: () => boolean;
  markInteracted: () => void;
  refresh: () => void;
  setBoundsMode: (mode?: string) => void;
  resetToIran: () => void;
}

export function initLocationMap(
  id: string,
  onUserMove?: (lat: number, lng: number) => void,
  mapSettings?: MapSettings,
): LocationMapController | null {
  const container = document.getElementById(id);
  if (!container) return null;

  // نقشه صرفاً بر روی محدوده شهر تهران قفل شده است و خروج از آن ناممکن است
  const map = L.map(id, {
    center: TEHRAN_CENTER,
    zoom: 12,
    minZoom: 10,
    maxZoom: 18,
    maxBounds: TEHRAN_BOUNDS,
    maxBoundsViscosity: 1.0,
  });

  const tileLayer = createConfiguredTileLayer(mapSettings);
  tileLayer.addTo(map);

  const marker = L.marker(TEHRAN_CENTER, { icon: pinIcon, draggable: true }).addTo(map);

  // تعامل مستقیم کاربر (کلیک روی نقشه یا جابه‌جایی نشانگر در تهران) الزامی است
  let interacted = false;

  function markInteraction(): void {
    interacted = true;
    const err = document.getElementById(`${id}-error`);
    if (err) err.hidden = true;
    const generalErr = document.getElementById('wizard-location-map-error');
    if (generalErr) generalErr.hidden = true;
  }

  function clampToTehran(lat: number, lng: number): [number, number] {
    const clampedLat = Math.max(35.55, Math.min(35.85, lat));
    const clampedLng = Math.max(51.15, Math.min(51.65, lng));
    return [clampedLat, clampedLng];
  }

  // شنود رویدادها روی کانتینر DOM برای تضمین ثبت تعامل حتی در کلیک روی لایه‌های داخلی
  container.addEventListener('pointerdown', () => markInteraction());
  container.addEventListener('click', () => markInteraction());
  container.addEventListener('touchstart', () => markInteraction(), { passive: true });

  map.on('click', (event: L.LeafletMouseEvent) => {
    const [lat, lng] = clampToTehran(event.latlng.lat, event.latlng.lng);
    marker.setLatLng([lat, lng]);
    markInteraction();
    onUserMove?.(lat, lng);
  });

  marker.on('click', () => {
    markInteraction();
  });

  marker.on('dragstart', () => {
    markInteraction();
  });

  marker.on('drag', () => {
    markInteraction();
  });

  marker.on('dragend', () => {
    markInteraction();
    const pos = marker.getLatLng();
    const [lat, lng] = clampToTehran(pos.lat, pos.lng);
    marker.setLatLng([lat, lng]);
    onUserMove?.(lat, lng);
  });

  map.on('movestart', () => markInteraction());
  map.on('zoomstart', () => markInteraction());

  window.setTimeout(() => map.invalidateSize(), 100);

  return {
    setCenter: (lat, lng, zoom = 13) => {
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
      const [clampedLat, clampedLng] = clampToTehran(lat, lng);
      map.invalidateSize();
      marker.setLatLng([clampedLat, clampedLng]);
      const isVisible = container.offsetWidth > 0 && container.offsetHeight > 0;
      if (isVisible) {
        map.flyTo([clampedLat, clampedLng], zoom, { duration: 0.8 });
      } else {
        map.setView([clampedLat, clampedLng], zoom, { animate: false });
      }
    },
    getPosition: () => {
      const pos = marker.getLatLng();
      return { lat: pos.lat, lng: pos.lng };
    },
    hasInteracted: () => interacted,
    markInteracted: () => {
      markInteraction();
    },
    refresh: () => {
      map.invalidateSize();
      window.setTimeout(() => map.invalidateSize(), 50);
      window.setTimeout(() => map.invalidateSize(), 200);
    },
    setBoundsMode: () => {
      map.setMaxBounds(TEHRAN_BOUNDS);
      map.setMinZoom(10);
      map.setMaxZoom(18);
      const pos = marker.getLatLng();
      const bounds = L.latLngBounds(TEHRAN_BOUNDS[0], TEHRAN_BOUNDS[1]);
      if (!bounds.contains(pos)) {
        marker.setLatLng(TEHRAN_CENTER);
        map.setView(TEHRAN_CENTER, 12, { animate: false });
      }
      map.invalidateSize();
    },
    resetToIran: () => {
      map.setMaxBounds(TEHRAN_BOUNDS);
      map.setMinZoom(10);
      map.setMaxZoom(18);
      marker.setLatLng(TEHRAN_CENTER);
      map.setView(TEHRAN_CENTER, 12, { animate: true });
    },
  };
}

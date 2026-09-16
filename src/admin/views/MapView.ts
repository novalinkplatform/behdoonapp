import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchRequests, fetchStaff, assignRequest, fetchSettings } from '../utils/api.ts';
import type { OrderRecord, StaffRecord } from '../utils/api.ts';
import { STATUS_LABELS } from '../data/status.ts';
import { toPersianDigits } from '../utils/format.ts';
import { createConfiguredTileLayer, DEFAULT_MAP_SETTINGS, type MapSettings } from '../utils/mapProvider.ts';

const TEHRAN: [number, number] = [35.6892, 51.389];
const ACTIVE_STATUSES = ['pending', 'contacted', 'scheduled', 'in_progress'];

const pinIcon = L.divIcon({
  className: 'admin-map-pin',
  html: `<svg width="30" height="38" viewBox="0 0 34 42" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 1C8.16 1 1 8.16 1 17c0 11.5 16 23.5 16 23.5S33 28.5 33 17C33 8.16 25.84 1 17 1Z" fill="#1656c9" stroke="#ffffff" stroke-width="2"/>
    <circle cx="17" cy="17" r="6" fill="#ffffff"/>
  </svg>`,
  iconSize: [30, 38],
  iconAnchor: [15, 36],
});

export function renderMapView(): string {
  return `
    <div class="view-header">
      <h1>نقشه درخواست‌ها</h1>
      <button type="button" class="btn btn-secondary" id="map-refresh">به‌روزرسانی</button>
    </div>
    <p class="error-text" id="map-error" hidden></p>
    <div class="admin-map" id="admin-map"></div>
  `;
}

export function initMapView(): void {
  const mapError = document.getElementById('map-error');
  const refreshBtn = document.getElementById('map-refresh');
  const mapContainer = document.getElementById('admin-map');
  if (!mapError || !refreshBtn || !mapContainer) return;

  const map = L.map('admin-map', { center: TEHRAN, zoom: 11 });

  fetchSettings()
    .then((settings) => {
      const mapConfig = (settings.map as MapSettings | undefined) ?? DEFAULT_MAP_SETTINGS;
      createConfiguredTileLayer(mapConfig).addTo(map);
    })
    .catch(() => {
      createConfiguredTileLayer(DEFAULT_MAP_SETTINGS).addTo(map);
    });

  let markers: L.Marker[] = [];

  function popupHtml(order: OrderRecord, assignable: StaffRecord[]): string {
    const options = assignable
      .map((s) => {
        const busy = s.onActiveService && s.id !== order.assignedStaffId;
        const label = busy ? `${s.fullName} (${s.roleLabel} — در حال سرویس)` : `${s.fullName} (${s.roleLabel})`;
        return `<option value="${s.id}" ${s.id === order.assignedStaffId ? 'selected' : ''} ${busy ? 'disabled' : ''}>${label}</option>`;
      })
      .join('');
    return `
      <div class="admin-map-popup">
        <div class="admin-map-popup-title">#${toPersianDigits(order.trackingCode)} — ${order.serviceLabel}</div>
        <div class="admin-map-popup-row">${order.originCity || 'تهران'}${order.destinationCity && order.destinationCity !== order.originCity ? ` (${order.destinationCity})` : ''}</div>
        <div class="admin-map-popup-row">${STATUS_LABELS[order.status] ?? order.status}</div>
        <div class="admin-map-popup-row" dir="ltr">${order.phone}</div>
        <select class="admin-map-assign-select" data-map-assign-id="${order.id}">
          <option value="">اختصاص‌نیافته (انتخاب تکنسین)</option>
          ${options}
        </select>
      </div>
    `;
  }

  async function load(): Promise<void> {
    mapError!.hidden = true;
    try {
      const [orders, staff] = await Promise.all([fetchRequests(), fetchStaff()]);
      const assignable = staff.filter((s) => s.assignable && s.isActive);
      const active = orders.filter((o) => ACTIVE_STATUSES.includes(o.status) && o.originLat != null && o.originLng != null);

      markers.forEach((m) => m.remove());
      markers = active.map((order) => {
        const marker = L.marker([order.originLat as number, order.originLng as number], { icon: pinIcon }).addTo(map);
        marker.bindPopup(popupHtml(order, assignable));
        marker.on('popupopen', () => {
          const select = document.querySelector<HTMLSelectElement>(`[data-map-assign-id="${order.id}"]`);
          select?.addEventListener('change', async () => {
            const staffId = select.value ? Number(select.value) : null;
            select.disabled = true;
            try {
              await assignRequest(order.id, staffId);
              marker.closePopup();
              await load();
            } catch (err) {
              mapError!.hidden = false;
              mapError!.textContent = err instanceof Error ? err.message : 'اختصاص ناموفق بود.';
              select.disabled = false;
            }
          });
        });
        return marker;
      });
    } catch (err) {
      mapError!.hidden = false;
      mapError!.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
    }
  }

  refreshBtn.addEventListener('click', () => void load());
  void load();
  window.setTimeout(() => map.invalidateSize(), 100);
}

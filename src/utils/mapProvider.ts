import L from 'leaflet';

export type MapProvider = 'osm' | 'neshan' | 'balad' | 'google' | 'mapir' | 'custom';

export interface MapSettings {
  provider: MapProvider;
  apiKey?: string;
  customTileUrl?: string;
  mapType?: 'standard' | 'satellite' | 'terrain';
}

export const DEFAULT_MAP_SETTINGS: MapSettings = {
  provider: 'osm',
  apiKey: '',
  customTileUrl: '',
  mapType: 'standard',
};

export interface MapProviderMeta {
  id: MapProvider;
  nameFa: string;
  nameEn: string;
  tag: string;
  hasApiKey: boolean;
  apiKeyLabel: string;
  apiKeyPlaceholder: string;
  helpText: string;
  devUrl?: string;
}

export const MAP_PROVIDERS: MapProviderMeta[] = [
  {
    id: 'osm',
    nameFa: 'اوپن‌استریت‌مپ (OpenStreetMap)',
    nameEn: 'OpenStreetMap',
    tag: 'پیش‌فرض و رایگان',
    hasApiKey: false,
    apiKeyLabel: '',
    apiKeyPlaceholder: '',
    helpText: 'نقشه جهانی متن‌باز و استاندارد، کاملاً رایگان بدون نیاز به ثبت‌نام یا وارد کردن کلید API.',
  },
  {
    id: 'neshan',
    nameFa: 'نقشه نشان (Neshan)',
    nameEn: 'Neshan Maps',
    tag: 'ویژه ایران',
    hasApiKey: true,
    apiKeyLabel: 'کلید دسترسی وب نشان (Web API Key)',
    apiKeyPlaceholder: 'service.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    helpText: 'کلید وب دریافتی از پلتفرم توسعه‌دهندگان نشان (platform.neshan.org) را وارد کنید.',
    devUrl: 'https://platform.neshan.org/',
  },
  {
    id: 'balad',
    nameFa: 'نقشه بلد (Balad)',
    nameEn: 'Balad Maps',
    tag: 'ویژه ایران',
    hasApiKey: true,
    apiKeyLabel: 'کلید دسترسی بلد (API Key اختیاری)',
    apiKeyPlaceholder: 'balad_api_key_xxxxxxxx',
    helpText: 'در صورت داشتن کلید API از نقشه بلد آن را وارد کنید یا فیلد را خالی بگذارید.',
    devUrl: 'https://balad.ir/',
  },
  {
    id: 'google',
    nameFa: 'گوگل مپ (Google Maps)',
    nameEn: 'Google Maps',
    tag: 'بین‌المللی',
    hasApiKey: true,
    apiKeyLabel: 'کلید Google Maps API Key',
    apiKeyPlaceholder: 'AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    helpText: 'کلید دسترسی دریافتی از Google Cloud Console با دسترسی سرویس نقشه جاوااسکریپت.',
    devUrl: 'https://console.cloud.google.com/google/maps-apis/',
  },
  {
    id: 'mapir',
    nameFa: 'مپ دات آی‌آر (Map.ir)',
    nameEn: 'Map.ir',
    tag: 'سرویس ایرانی',
    hasApiKey: true,
    apiKeyLabel: 'توکن دسترسی (x-api-key)',
    apiKeyPlaceholder: 'mapir_xxxxxxxxxxxxxxxxxxxx',
    helpText: 'توکن دسترسی x-api-key دریافتی از پلتفرم مپ دات آی‌آر را وارد کنید.',
    devUrl: 'https://map.ir/',
  },
  {
    id: 'custom',
    nameFa: 'سرور کاشی دلخواه (Custom Tile Server)',
    nameEn: 'Custom Tile Server',
    tag: 'سفارشی',
    hasApiKey: false,
    apiKeyLabel: 'کلید دسترسی (اختیاری)',
    apiKeyPlaceholder: '',
    helpText: 'آدرس الگوی تایل دلخواه (مانند https://{s}.tile.example.com/{z}/{x}/{y}.png) را وارد کنید.',
  },
];

function createOsmTileLayer(extraAttr?: string): L.TileLayer {
  return L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: extraAttr ? `© OpenStreetMap (${extraAttr})` : '© OpenStreetMap contributors',
    maxZoom: 19,
    subdomains: ['a', 'b', 'c'],
  });
}

function createHeaderTileLayer(
  urlTemplate: string,
  headers: Record<string, string>,
  attribution: string,
  maxZoom = 19,
): L.TileLayer {
  const hasHeaders = Object.keys(headers).length > 0;
  if (!hasHeaders) {
    return L.tileLayer(urlTemplate, { attribution, maxZoom });
  }

  type TileElementWithCleanup = HTMLImageElement & {
    _abortCtrl?: AbortController;
    _objectUrl?: string;
  };

  const HeaderLayer = (L.TileLayer as unknown as {
    extend: (opts: Record<string, unknown>) => new (url: string, opts: Record<string, unknown>) => L.TileLayer;
  }).extend({
    createTile(coords: L.Coords, done: (error: Error | null, tile: HTMLElement) => void) {
      const tile = document.createElement('img') as TileElementWithCleanup;
      const url = (this as any).getTileUrl(coords);

      const abortCtrl = new AbortController();
      tile._abortCtrl = abortCtrl;

      fetch(url, { headers, signal: abortCtrl.signal })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.blob();
        })
        .then((blob) => {
          const objectUrl = URL.createObjectURL(blob);
          tile._objectUrl = objectUrl;
          tile.src = objectUrl;
          done(null, tile);
        })
        .catch(() => {
          // Fallback to OSM tile on error
          const subdomains = ['a', 'b', 'c'];
          const s = subdomains[Math.abs(coords.x + coords.y) % subdomains.length];
          tile.src = `https://${s}.tile.openstreetmap.org/${coords.z}/${coords.x}/${coords.y}.png`;
          done(null, tile);
        });

      return tile;
    },
    _removeTile(key: string) {
      const tile = (this as any)._tiles?.[key]?.el as TileElementWithCleanup | undefined;
      if (tile) {
        if (tile._abortCtrl) {
          try { tile._abortCtrl.abort(); } catch {}
        }
        if (tile._objectUrl) {
          try { URL.revokeObjectURL(tile._objectUrl); } catch {}
        }
      }
      (L.TileLayer.prototype as any)._removeTile?.call(this, key);
    },
  });

  return new HeaderLayer(urlTemplate, { attribution, maxZoom });
}

export function createConfiguredTileLayer(config?: MapSettings | null): L.TileLayer {
  const settings = config && config.provider ? config : DEFAULT_MAP_SETTINGS;
  const apiKey = (settings.apiKey || '').trim();

  switch (settings.provider) {
    case 'neshan': {
      if (!apiKey) {
        return createOsmTileLayer('نشان — بدون کلید، فال‌بک اوپن‌استریت‌مپ');
      }
      const url = 'https://api.neshan.org/v4/mapbox/v2/standard/day/{z}/{x}/{y}.png';
      return createHeaderTileLayer(url, { 'Api-Key': apiKey }, '© نقشه نشان (Neshan)', 19);
    }

    case 'balad': {
      const url = apiKey
        ? `https://tile.balad.ir/tile/{z}/{x}/{y}.png?api_key=${encodeURIComponent(apiKey)}`
        : 'https://tile.balad.ir/tile/{z}/{x}/{y}.png';
      const headers: Record<string, string> = apiKey ? { 'x-api-key': apiKey } : {};
      return createHeaderTileLayer(url, headers, '© نقشه بلد (Balad)', 19);
    }

    case 'google': {
      const lyrs = settings.mapType === 'satellite' ? 's' : settings.mapType === 'terrain' ? 'p' : 'm';
      const url = apiKey
        ? `https://mt{s}.google.com/vt/lyrs=${lyrs}&x={x}&y={y}&z={z}&key=${encodeURIComponent(apiKey)}`
        : `https://mt{s}.google.com/vt/lyrs=${lyrs}&x={x}&y={y}&z={z}`;
      return L.tileLayer(url, {
        attribution: '© Google Maps',
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 20,
      });
    }

    case 'mapir': {
      if (!apiKey) {
        return createOsmTileLayer('مپ دات آی‌آر — بدون کلید، فال‌بک اوپن‌استریت‌مپ');
      }
      const url = `https://map.ir/shiveh/xyz/1.0.0/Shiveh:Shiveh/{z}/{x}/{y}.png?x-api-key=${encodeURIComponent(apiKey)}`;
      return createHeaderTileLayer(url, { 'x-api-key': apiKey }, '© Map.ir', 19);
    }

    case 'custom': {
      const customUrl = settings.customTileUrl?.trim() || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      return L.tileLayer(customUrl, {
        attribution: '© نقشه سفارشی',
        maxZoom: 19,
      });
    }

    case 'osm':
    default:
      return createOsmTileLayer();
  }
}

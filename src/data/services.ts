import type { ServiceCategory } from '../types/index.ts';
import { icons } from '../components/icons.ts';
import type { VehicleTypeSetting } from '../utils/dynamicContent.ts';

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'hvac',
    label: 'سرمایش و گرمایش',
    labelEn: 'HVAC & Climate',
    icon: icons.hvac,
    subtitle: 'کولر آبی، پکیج، شوفاژ، کولر گازی و آبگرمکن',
    subtitleEn: 'Water coolers, AC, heating packages & radiators',
  },
  {
    id: 'plumbing',
    label: 'لوله‌کشی و تأسیسات',
    labelEn: 'Plumbing & Pipes',
    icon: icons.plumbing,
    subtitle: 'نشت‌یابی نقطه زن، رفع نم، لوله بازکنی، شیرآلات',
    subtitleEn: 'Acoustic leak detection, unclogging & pipe repairs',
  },
  {
    id: 'electrical',
    label: 'برقکاری ساختمان',
    labelEn: 'Electrical Works',
    icon: icons.electrical,
    subtitle: 'رفع اتصالی فوری، سیم‌کشی، لوستر، کلید و پریز',
    subtitleEn: 'Short-circuit fix, wiring, fixtures & outlets',
  },
  {
    id: 'renovation',
    label: 'تعمیرات و بازسازی',
    labelEn: 'Renovation & Paint',
    icon: icons.renovation,
    subtitle: 'نقاشی ساختمان، کاشی‌کاری، ایزوگام، کناف، بنایی',
    subtitleEn: 'Painting, tiling, waterproofing & interior remodel',
  },
];

// در صورتی که تنظیمات از سرور بارگذاری نشود، این فهرست پیش‌فرض خدمات به‌کار می‌رود.
export const DEFAULT_VEHICLE_TYPES: VehicleTypeSetting[] = [
  // HVAC
  { id: 'water-cooler', label: 'کولر آبی', labelEn: 'Water Cooler', icon: 'hvac', basePrice: 450000, perKmRate: 0, floorCostExempt: true, active: true, sortOrder: 1 },
  { id: 'package', label: 'پکیج و شوفاژ', labelEn: 'Heating Package', icon: 'hvac', basePrice: 650000, perKmRate: 0, floorCostExempt: true, active: true, sortOrder: 2 },
  { id: 'split-ac', label: 'کولر گازی و اسپلیت', labelEn: 'Air Conditioner', icon: 'hvac', basePrice: 850000, perKmRate: 0, floorCostExempt: true, active: true, sortOrder: 3 },
  { id: 'radiator', label: 'رادیاتور شوفاژ', labelEn: 'Radiator', icon: 'hvac', basePrice: 400000, perKmRate: 0, floorCostExempt: true, active: true, sortOrder: 4 },

  // Plumbing
  { id: 'leak-detection', label: 'نشت‌یابی با دستگاه', labelEn: 'Leak Detection', icon: 'plumbing', basePrice: 950000, perKmRate: 0, floorCostExempt: true, active: true, sortOrder: 5 },
  { id: 'unclogging', label: 'لوله بازکنی', labelEn: 'Drain Unclogging', icon: 'plumbing', basePrice: 500000, perKmRate: 0, floorCostExempt: true, active: true, sortOrder: 6 },
  { id: 'faucet-repair', label: 'نصب و تعمیر شیرآلات', labelEn: 'Faucet Repair', icon: 'plumbing', basePrice: 350000, perKmRate: 0, floorCostExempt: true, active: true, sortOrder: 7 },
  { id: 'water-pump', label: 'پمپ آب و منبع', labelEn: 'Water Pump', icon: 'plumbing', basePrice: 800000, perKmRate: 0, floorCostExempt: true, active: true, sortOrder: 8 },

  // Electrical
  { id: 'short-circuit', label: 'رفع فوری اتصالی', labelEn: 'Short Circuit Fix', icon: 'electrical', basePrice: 550000, perKmRate: 0, floorCostExempt: true, active: true, sortOrder: 9 },
  { id: 'wiring', label: 'سیم‌کشی ساختمان', labelEn: 'Electrical Wiring', icon: 'electrical', basePrice: 700000, perKmRate: 0, floorCostExempt: true, active: true, sortOrder: 10 },
  { id: 'chandelier', label: 'نصب لوستر و چراغ', labelEn: 'Chandelier Installation', icon: 'electrical', basePrice: 450000, perKmRate: 0, floorCostExempt: true, active: true, sortOrder: 11 },
  { id: 'intercom', label: 'آیفون تصویری', labelEn: 'Video Intercom', icon: 'electrical', basePrice: 500000, perKmRate: 0, floorCostExempt: true, active: true, sortOrder: 12 },

  // Renovation
  { id: 'painting', label: 'نقاشی ساختمان', labelEn: 'House Painting', icon: 'renovation', basePrice: 1200000, perKmRate: 0, floorCostExempt: true, active: true, sortOrder: 13 },
  { id: 'tiling', label: 'کاشی و سرامیک', labelEn: 'Tiling & Ceramic', icon: 'renovation', basePrice: 1500000, perKmRate: 0, floorCostExempt: true, active: true, sortOrder: 14 },
  { id: 'waterproofing', label: 'ایزوگام و عایق‌کاری', labelEn: 'Waterproofing', icon: 'renovation', basePrice: 900000, perKmRate: 0, floorCostExempt: true, active: true, sortOrder: 15 },
  { id: 'knauf', label: 'کناف و دکوراسیون', labelEn: 'Drywall & Knauf', icon: 'renovation', basePrice: 1800000, perKmRate: 0, floorCostExempt: true, active: true, sortOrder: 16 },
];

// هر دسته‌بندی خدمت، زیرمجموعه‌ای از خدمات تخصصی را نشان می‌دهد.
export const CATEGORY_VEHICLE_IDS: Record<string, string[]> = {
  hvac: ['water-cooler', 'package', 'split-ac', 'radiator'],
  plumbing: ['leak-detection', 'unclogging', 'faucet-repair', 'water-pump'],
  electrical: ['short-circuit', 'wiring', 'chandelier', 'intercom'],
  renovation: ['painting', 'tiling', 'waterproofing', 'knauf'],
};

export const MOTORCYCLE_VEHICLE_ID = 'water-cooler';

const VEHICLE_ICON_MAP: Record<string, string> = {
  hvac: icons.hvac,
  plumbing: icons.plumbing,
  electrical: icons.electrical,
  renovation: icons.renovation,
  motorcycle: icons.bolt,
  pickup: icons.plumbing,
  van: icons.hvac,
  lightTruck: icons.renovation,
  truck: icons.electrical,
  trailer: icons.shield,
};

export function vehicleIcon(iconKey: string): string {
  return VEHICLE_ICON_MAP[iconKey] || icons.checkCircle;
}

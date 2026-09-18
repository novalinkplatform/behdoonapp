import fs from 'fs';

const catalog = JSON.parse(fs.readFileSync('src/data/all_services_data.json', 'utf8'));

let defaultVehicleTypes = [];
let categoryVehicleIds = {};
let sortOrder = 1;

for (const catId of ['hvac', 'plumbing', 'electrical', 'renovation', 'locksmith', 'carpentry', 'doors_windows', 'cleaning']) {
  const cat = catalog[catId];
  categoryVehicleIds[catId] = [];
  
  for (const sub of cat.subServices) {
    categoryVehicleIds[catId].push(sub.id);
    defaultVehicleTypes.push({
      id: sub.id,
      label: sub.name,
      labelEn: sub.nameEn,
      icon: catId === 'doors_windows' ? 'doorsWindows' : catId,
      basePrice: sub.basePrice,
      perKmRate: 0,
      floorCostExempt: true,
      active: true,
      sortOrder: sortOrder++
    });
  }
}

const fileContent = `import type { ServiceCategory } from '../types/index.ts';
import { icons } from '../components/icons.ts';
import type { VehicleTypeSetting } from '../utils/dynamicContent.ts';

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'hvac',
    label: 'سرمایش و گرمایش',
    labelEn: 'HVAC & Climate',
    icon: icons.hvac,
    subtitle: 'کولر آبی، پکیج، شوفاژ، آبگرمکن و کولر گازی',
    subtitleEn: 'Water coolers, AC, heating packages & radiators',
  },
  {
    id: 'plumbing',
    label: 'لوله‌کشی و تأسیسات',
    labelEn: 'Plumbing & Pipes',
    icon: icons.plumbing,
    subtitle: 'نشت‌یابی نقطه زن، رفع نم، لوله بازکنی، شیرآلات، توالت و منبع آب',
    subtitleEn: 'Acoustic leak detection, unclogging & pipe repairs',
  },
  {
    id: 'electrical',
    label: 'برقکاری ساختمان',
    labelEn: 'Electrical Works',
    icon: icons.electrical,
    subtitle: 'رفع اتصالی فوری، سیم‌کشی، لوستر، کلید و پریز، آیفون، تابلو برق و دوربین',
    subtitleEn: 'Short-circuit fix, wiring, fixtures & outlets',
  },
  {
    id: 'renovation',
    label: 'تعمیرات و بازسازی',
    labelEn: 'Renovation & Paint',
    icon: icons.renovation,
    subtitle: 'نقاشی ساختمان، کاشی‌کاری، بنایی، گچ‌کاری، ایزوگام، کناف و پارکت',
    subtitleEn: 'Painting, tiling, waterproofing & interior remodel',
  },
  {
    id: 'locksmith',
    label: 'کلیدسازی، قفل و امنیت',
    labelEn: 'Locksmith & Security',
    icon: icons.locksmith,
    subtitle: 'باز کردن درب ضدسرقت، قفل هوشمند، جک پارکینگ و دزدگیر',
    subtitleEn: 'Emergency lock opening, smart locks, gate motors & CCTV',
  },
  {
    id: 'carpentry',
    label: 'کابینت، نجاری و MDF',
    labelEn: 'Carpentry & Cabinetry',
    icon: icons.carpentry,
    subtitle: 'کابینت آشپزخانه، کمد دیواری، رگلاژ درب چوبی، پارکت و مصنوعات چوبی',
    subtitleEn: 'Kitchen cabinets, custom closets, door adjustments & parquet',
  },
  {
    id: 'doors_windows',
    label: 'در، پنجره و شیشه UPVC',
    labelEn: 'Doors, Windows & Glass',
    icon: icons.doorsWindows,
    subtitle: 'رگلاژ پنجره دوجداره، توری پلیسه، تعویض شیشه سکوریت و کرکره برقی',
    subtitleEn: 'UPVC window repair, insect mesh screens & glass replacement',
  },
  {
    id: 'cleaning',
    label: 'نظافت و پاکسازی مشاعات',
    labelEn: 'Building Cleaning Services',
    icon: icons.cleaning,
    subtitle: 'نظافت راه‌پله و لابی، نماشویی با طناب، قالیشویی و سم‌پاشی تخصصی',
    subtitleEn: 'Staircase cleaning, facade washing, sofa wash & pest control',
  },
];

// فهرست جامع کلیه ۵۳ خدمت تخصصی بهدون برای استفاده در ویزارد و برآورد هزینه
export const DEFAULT_VEHICLE_TYPES: VehicleTypeSetting[] = ${JSON.stringify(defaultVehicleTypes, null, 2)};

// نقشه‌برداری خدمات تخصصی هر دسته‌بندی
export const CATEGORY_VEHICLE_IDS: Record<string, string[]> = ${JSON.stringify(categoryVehicleIds, null, 2)};

export const MOTORCYCLE_VEHICLE_ID = 'water-cooler';

const VEHICLE_ICON_MAP: Record<string, string> = {
  hvac: icons.hvac,
  plumbing: icons.plumbing,
  electrical: icons.electrical,
  renovation: icons.renovation,
  locksmith: icons.locksmith,
  carpentry: icons.carpentry,
  doors_windows: icons.doorsWindows,
  doorsWindows: icons.doorsWindows,
  cleaning: icons.cleaning,
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
`;

fs.writeFileSync('src/data/services.ts', fileContent, 'utf8');
console.log('src/data/services.ts successfully written with', defaultVehicleTypes.length, 'services!');

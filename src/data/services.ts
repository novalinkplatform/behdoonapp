import type { ServiceCategory } from '../types/index.ts';
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
export const DEFAULT_VEHICLE_TYPES: VehicleTypeSetting[] = [
  {
    "id": "water-cooler",
    "label": "نصب و سرویس کولر آبی",
    "labelEn": "Water Cooler Service",
    "icon": "hvac",
    "basePrice": 450000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 1
  },
  {
    "id": "package",
    "label": "نصب و سرویس پکیج",
    "labelEn": "Heating Package & Boiler",
    "icon": "hvac",
    "basePrice": 650000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 2
  },
  {
    "id": "radiator",
    "label": "نصب و سرویس رادیاتور شوفاژ",
    "labelEn": "Radiator & Heating Valve",
    "icon": "hvac",
    "basePrice": 400000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 3
  },
  {
    "id": "water-heater",
    "label": "تعمیر و سرویس آبگرمکن",
    "labelEn": "Water Heater Service",
    "icon": "hvac",
    "basePrice": 450000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 4
  },
  {
    "id": "split-ac",
    "label": "نصب و سرویس کولر گازی و اسپلیت",
    "labelEn": "Split AC & Air Conditioning",
    "icon": "hvac",
    "basePrice": 850000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 5
  },
  {
    "id": "leak-detection",
    "label": "تشخیص و ترمیم ترکیدگی لوله",
    "labelEn": "Acoustic Pipe Leak Detection",
    "icon": "plumbing",
    "basePrice": 950000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 6
  },
  {
    "id": "moisture-repair",
    "label": "رفع نم و نشتی و رطوبت",
    "labelEn": "Damp & Moisture Repair",
    "icon": "plumbing",
    "basePrice": 850000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 7
  },
  {
    "id": "faucets",
    "label": "نصب و تعمیر شیرآلات",
    "labelEn": "Faucet & Tap Repair",
    "icon": "plumbing",
    "basePrice": 350000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 8
  },
  {
    "id": "water-tank",
    "label": "نصب و سرویس منبع آب",
    "labelEn": "Water Storage Tank & Pump",
    "icon": "plumbing",
    "basePrice": 800000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 9
  },
  {
    "id": "toilet",
    "label": "نصب و سرویس توالت فرنگی و ایرانی",
    "labelEn": "Toilet Installation & Repair",
    "icon": "plumbing",
    "basePrice": 550000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 10
  },
  {
    "id": "piping",
    "label": "لوله کشی آب و فاضلاب",
    "labelEn": "Plumbing & Drainage Piping",
    "icon": "plumbing",
    "basePrice": 900000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 11
  },
  {
    "id": "sink",
    "label": "نصب سینک ظرفشویی",
    "labelEn": "Kitchen Sink & Trap",
    "icon": "plumbing",
    "basePrice": 400000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 12
  },
  {
    "id": "water-purifier",
    "label": "نصب و تعمیر دستگاه تصفیه آب",
    "labelEn": "Water Purifier Filter & Service",
    "icon": "plumbing",
    "basePrice": 450000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 13
  },
  {
    "id": "flush-tank",
    "label": "نصب و تعمیر فلاش تانک و سیفون",
    "labelEn": "Flush Tank & Valve Repair",
    "icon": "plumbing",
    "basePrice": 350000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 14
  },
  {
    "id": "washbasin",
    "label": "نصب روشویی",
    "labelEn": "Washbasin & Vanity Mounting",
    "icon": "plumbing",
    "basePrice": 450000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 15
  },
  {
    "id": "wall-hung",
    "label": "نصب و تعمیر وال هنگ",
    "labelEn": "Wall-Hung Concealed Toilet",
    "icon": "plumbing",
    "basePrice": 750000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 16
  },
  {
    "id": "sewage-connection",
    "label": "اتصال به شبکه فاضلاب شهری",
    "labelEn": "City Sewage Network Connection",
    "icon": "plumbing",
    "basePrice": 1200000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 17
  },
  {
    "id": "short-circuit",
    "label": "رفع اتصالی",
    "labelEn": "Urgent Short-Circuit Troubleshooting",
    "icon": "electrical",
    "basePrice": 550000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 18
  },
  {
    "id": "wiring",
    "label": "سیم کشی و کابل کشی",
    "labelEn": "Building Electrical Wiring",
    "icon": "electrical",
    "basePrice": 700000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 19
  },
  {
    "id": "chandelier",
    "label": "نصب لوستر و چراغ",
    "labelEn": "Chandelier & Lighting Installation",
    "icon": "electrical",
    "basePrice": 450000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 20
  },
  {
    "id": "switches",
    "label": "کلید و پریز",
    "labelEn": "Switches & Sockets Replacement",
    "icon": "electrical",
    "basePrice": 300000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 21
  },
  {
    "id": "intercom",
    "label": "نصب و تعمیر آیفون صوتی و تصویری",
    "labelEn": "Video & Audio Intercom Repair",
    "icon": "electrical",
    "basePrice": 500000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 22
  },
  {
    "id": "electrical-panel",
    "label": "ساخت و تعمیر تابلو برق",
    "labelEn": "Electrical Breaker Panel Assembly",
    "icon": "electrical",
    "basePrice": 900000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 23
  },
  {
    "id": "earthing",
    "label": "سیم کشی ارت",
    "labelEn": "Earthing & Grounding System",
    "icon": "electrical",
    "basePrice": 850000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 24
  },
  {
    "id": "fire-alarm",
    "label": "سیستم اعلام و اطفاء حریق",
    "labelEn": "Fire Alarm & Detection Systems",
    "icon": "electrical",
    "basePrice": 1100000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 25
  },
  {
    "id": "stabilizer",
    "label": "نصب محافظ برق و استابلایزر",
    "labelEn": "Voltage Stabilizer & Surge Protector",
    "icon": "electrical",
    "basePrice": 650000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 26
  },
  {
    "id": "cctv",
    "label": "نصب و تعمیر دوربین مداربسته",
    "labelEn": "CCTV Security Camera Installation",
    "icon": "electrical",
    "basePrice": 950000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 27
  },
  {
    "id": "painting",
    "label": "نقاشی و رنگ کاری ساختمان",
    "labelEn": "Building Wall & Ceiling Painting",
    "icon": "renovation",
    "basePrice": 1200000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 28
  },
  {
    "id": "tiling",
    "label": "کاشی کاری و سرامیک",
    "labelEn": "Floor & Wall Ceramic Tiling",
    "icon": "renovation",
    "basePrice": 1500000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 29
  },
  {
    "id": "masonry",
    "label": "بنایی و تخریب",
    "labelEn": "Masonry, Brickwork & Demolition",
    "icon": "renovation",
    "basePrice": 1100000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 30
  },
  {
    "id": "plastering",
    "label": "گچ کاری و لکه گیری",
    "labelEn": "Plastering & Drywall Patching",
    "icon": "renovation",
    "basePrice": 850000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 31
  },
  {
    "id": "roof-insulation",
    "label": "عایق کاری پشت بام (ایزوگام و قیرگونی و...)",
    "labelEn": "Roof Waterproofing & Tar Coating",
    "icon": "renovation",
    "basePrice": 900000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 32
  },
  {
    "id": "knauf",
    "label": "کنافکاری",
    "labelEn": "Knauf False Ceilings & Lighting Boxes",
    "icon": "renovation",
    "basePrice": 1800000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 33
  },
  {
    "id": "wallpaper",
    "label": "نصب کاغذ دیواری",
    "labelEn": "Wallpaper & Wall Decal Mounting",
    "icon": "renovation",
    "basePrice": 950000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 34
  },
  {
    "id": "parquet",
    "label": "پارکت و لمینت",
    "labelEn": "Parquet & Laminate Flooring",
    "icon": "renovation",
    "basePrice": 1400000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 35
  },
  {
    "id": "stone-work",
    "label": "سنگ کاری",
    "labelEn": "Building Stonework & Stairs",
    "icon": "renovation",
    "basePrice": 1600000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 36
  },
  {
    "id": "facade-repair",
    "label": "تعمیرات نما",
    "labelEn": "Building Facade Anchoring & Restoration",
    "icon": "renovation",
    "basePrice": 1750000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 37
  },
  {
    "id": "emergency-lockout",
    "label": "باز کردن فوری قفل درب (ضدسرقت و اتاقی)",
    "labelEn": "Emergency Lockout Service",
    "icon": "locksmith",
    "basePrice": 400000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 38
  },
  {
    "id": "smart-locks",
    "label": "نصب و راه‌اندازی قفل هوشمند دیجیتال",
    "labelEn": "Smart Digital Lock Installation",
    "icon": "locksmith",
    "basePrice": 850000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 39
  },
  {
    "id": "parking-gate",
    "label": "نصب و تعمیر جک پارکینگ و آرام‌بند",
    "labelEn": "Parking Gate Motor & Door Closer",
    "icon": "locksmith",
    "basePrice": 750000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 40
  },
  {
    "id": "cctv-alarm",
    "label": "دوربین مداربسته و دزدگیر اماکن",
    "labelEn": "CCTV & Security Alarm Systems",
    "icon": "locksmith",
    "basePrice": 1100000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 41
  },
  {
    "id": "cabinet-repair",
    "label": "تعمیر و رگلاژ کابینت آشپزخانه",
    "labelEn": "Cabinet Repair & Alignment",
    "icon": "carpentry",
    "basePrice": 600000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 42
  },
  {
    "id": "closet-design",
    "label": "کمد دیواری و جاکفشی سفارشی",
    "labelEn": "Custom Closets & Wardrobes",
    "icon": "carpentry",
    "basePrice": 1800000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 43
  },
  {
    "id": "door-repair",
    "label": "تعمیر و رگلاژ درب چوبی",
    "labelEn": "Wooden Door Adjustment & Repair",
    "icon": "carpentry",
    "basePrice": 450000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 44
  },
  {
    "id": "parquet-flooring",
    "label": "نصب پارکت و لمینت",
    "labelEn": "Parquet & Laminate Flooring",
    "icon": "carpentry",
    "basePrice": 1400000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 45
  },
  {
    "id": "upvc-repair",
    "label": "رگلاژ و تعمیر پنجره UPVC",
    "labelEn": "UPVC Window Adjustment & Repair",
    "icon": "doorsWindows",
    "basePrice": 500000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 46
  },
  {
    "id": "pleated-mesh",
    "label": "نصب توری پلیسه کشویی",
    "labelEn": "Pleated Insect Mesh Screen",
    "icon": "doorsWindows",
    "basePrice": 650000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 47
  },
  {
    "id": "glass-replacement",
    "label": "تعویض شیشه دوجداره و سکوریت",
    "labelEn": "Double-Glazed & Tempered Glass Replacement",
    "icon": "doorsWindows",
    "basePrice": 800000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 48
  },
  {
    "id": "electric-shutter",
    "label": "کرکره برقی و رول‌آپ",
    "labelEn": "Electric Roll-up Shutter",
    "icon": "doorsWindows",
    "basePrice": 950000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 49
  },
  {
    "id": "staircase-cleaning",
    "label": "نظافت راه‌پله و مشاعات",
    "labelEn": "Staircase & Common Area Cleaning",
    "icon": "cleaning",
    "basePrice": 450000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 50
  },
  {
    "id": "facade-cleaning",
    "label": "نماشویی ساختمان",
    "labelEn": "Building Facade Washing",
    "icon": "cleaning",
    "basePrice": 2200000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 51
  },
  {
    "id": "carpet-sofa-wash",
    "label": "مبل‌شویی و قالیشویی در محل",
    "labelEn": "On-site Sofa & Carpet Wash",
    "icon": "cleaning",
    "basePrice": 700000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 52
  },
  {
    "id": "pest-control",
    "label": "سم‌پاشی و ضدعفونی تخصصی",
    "labelEn": "Professional Pest Control",
    "icon": "cleaning",
    "basePrice": 850000,
    "perKmRate": 0,
    "floorCostExempt": true,
    "active": true,
    "sortOrder": 53
  }
];

// نقشه‌برداری خدمات تخصصی هر دسته‌بندی
export const CATEGORY_VEHICLE_IDS: Record<string, string[]> = {
  "hvac": [
    "water-cooler",
    "package",
    "radiator",
    "water-heater",
    "split-ac"
  ],
  "plumbing": [
    "leak-detection",
    "moisture-repair",
    "faucets",
    "water-tank",
    "toilet",
    "piping",
    "sink",
    "water-purifier",
    "flush-tank",
    "washbasin",
    "wall-hung",
    "sewage-connection"
  ],
  "electrical": [
    "short-circuit",
    "wiring",
    "chandelier",
    "switches",
    "intercom",
    "electrical-panel",
    "earthing",
    "fire-alarm",
    "stabilizer",
    "cctv"
  ],
  "renovation": [
    "painting",
    "tiling",
    "masonry",
    "plastering",
    "roof-insulation",
    "knauf",
    "wallpaper",
    "parquet",
    "stone-work",
    "facade-repair"
  ],
  "locksmith": [
    "emergency-lockout",
    "smart-locks",
    "parking-gate",
    "cctv-alarm"
  ],
  "carpentry": [
    "cabinet-repair",
    "closet-design",
    "door-repair",
    "parquet-flooring"
  ],
  "doors_windows": [
    "upvc-repair",
    "pleated-mesh",
    "glass-replacement",
    "electric-shutter"
  ],
  "cleaning": [
    "staircase-cleaning",
    "facade-cleaning",
    "carpet-sofa-wash",
    "pest-control"
  ]
};

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

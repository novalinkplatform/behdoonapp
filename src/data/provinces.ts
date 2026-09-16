import type { Province } from '../types/index.ts';
import { pick } from '../i18n/lang.ts';

export const provinces: Province[] = [
  {
    id: 'east-azerbaijan',
    name: 'آذربایجان شرقی',
    nameEn: 'East Azerbaijan',
    cities: ['تبریز', 'مراغه', 'میانه', 'مرند', 'اهر', 'بناب', 'شبستر', 'سراب', 'هریس', 'ملکان'],
    citiesEn: ['Tabriz', 'Maragheh', 'Mianeh', 'Marand', 'Ahar', 'Bonab', 'Shabestar', 'Sarab', 'Heris', 'Malekan'],
    lat: 38.08,
    lng: 46.2919,
  },
  {
    id: 'west-azerbaijan',
    name: 'آذربایجان غربی',
    nameEn: 'West Azerbaijan',
    cities: ['ارومیه', 'خوی', 'میاندوآب', 'بوکان', 'مهاباد', 'سلماس', 'پیرانشهر', 'نقده', 'تکاب', 'ماکو'],
    citiesEn: ['Urmia', 'Khoy', 'Miandoab', 'Bukan', 'Mahabad', 'Salmas', 'Piranshahr', 'Naqadeh', 'Takab', 'Maku'],
    lat: 37.5527,
    lng: 45.0761,
  },
  {
    id: 'ardabil',
    name: 'اردبیل',
    nameEn: 'Ardabil',
    cities: ['اردبیل', 'پارس‌آباد', 'مشگین‌شهر', 'خلخال', 'گرمی', 'نمین', 'بیله‌سوار'],
    citiesEn: ['Ardabil', 'Parsabad', 'Meshginshahr', 'Khalkhal', 'Germi', 'Namin', 'Bileh Savar'],
    lat: 38.2498,
    lng: 48.2933,
  },
  {
    id: 'isfahan',
    name: 'اصفهان',
    nameEn: 'Isfahan',
    cities: ['اصفهان', 'کاشان', 'نجف‌آباد', 'خمینی‌شهر', 'شاهین‌شهر', 'نطنز', 'گلپایگان', 'فولادشهر', 'مبارکه', 'شهرضا'],
    citiesEn: ['Isfahan', 'Kashan', 'Najafabad', 'Khomeinishahr', 'Shahin Shahr', 'Natanz', 'Golpayegan', 'Fooladshahr', 'Mobarakeh', 'Shahreza'],
    lat: 32.6546,
    lng: 51.668,
  },
  {
    id: 'alborz',
    name: 'البرز',
    nameEn: 'Alborz',
    cities: ['کرج', 'فردیس', 'نظرآباد', 'هشتگرد', 'اشتهارد', 'ماهدشت'],
    citiesEn: ['Karaj', 'Fardis', 'Nazarabad', 'Hashtgerd', 'Eshtehard', 'Mahdasht'],
    lat: 35.84,
    lng: 50.9391,
  },
  {
    id: 'ilam',
    name: 'ایلام',
    nameEn: 'Ilam',
    cities: ['ایلام', 'دهلران', 'آبدانان', 'ایوان', 'مهران', 'دره‌شهر'],
    citiesEn: ['Ilam', 'Dehloran', 'Abdanan', 'Eyvan', 'Mehran', 'Darrehshahr'],
    lat: 33.6374,
    lng: 46.4227,
  },
  {
    id: 'bushehr',
    name: 'بوشهر',
    nameEn: 'Bushehr',
    cities: ['بوشهر', 'برازجان', 'گناوه', 'کنگان', 'دیلم', 'دشتستان', 'عسلویه'],
    citiesEn: ['Bushehr', 'Borazjan', 'Genaveh', 'Kangan', 'Deylam', 'Dashtestan', 'Asaluyeh'],
    lat: 28.9234,
    lng: 50.8203,
  },
  {
    id: 'tehran',
    name: 'تهران',
    nameEn: 'Tehran',
    cities: ['تهران', 'ری', 'شهریار', 'اسلامشهر', 'پاکدشت', 'ورامین', 'دماوند', 'پردیس', 'رباط‌کریم', 'قدس', 'پیشوا', 'ملارد'],
    citiesEn: ['Tehran', 'Rey', 'Shahriar', 'Eslamshahr', 'Pakdasht', 'Varamin', 'Damavand', 'Pardis', 'Robat Karim', 'Qods', 'Pishva', 'Malard'],
    lat: 35.6892,
    lng: 51.389,
  },
  {
    id: 'chaharmahal-bakhtiari',
    name: 'چهارمحال و بختیاری',
    nameEn: 'Chaharmahal and Bakhtiari',
    cities: ['شهرکرد', 'بروجن', 'فارسان', 'لردگان', 'اردل', 'فرخ‌شهر'],
    citiesEn: ['Shahrekord', 'Borujen', 'Farsan', 'Lordegan', 'Ardal', 'Farrokhshahr'],
    lat: 32.3256,
    lng: 50.8644,
  },
  {
    id: 'south-khorasan',
    name: 'خراسان جنوبی',
    nameEn: 'South Khorasan',
    cities: ['بیرجند', 'قاین', 'فردوس', 'طبس', 'نهبندان', 'سربیشه'],
    citiesEn: ['Birjand', 'Qayen', 'Ferdows', 'Tabas', 'Nehbandan', 'Sarbisheh'],
    lat: 32.8649,
    lng: 59.2262,
  },
  {
    id: 'razavi-khorasan',
    name: 'خراسان رضوی',
    nameEn: 'Razavi Khorasan',
    cities: ['مشهد', 'نیشابور', 'سبزوار', 'تربت‌حیدریه', 'قوچان', 'کاشمر', 'تربت‌جام', 'چناران', 'گناباد', 'سرخس'],
    citiesEn: ['Mashhad', 'Neyshabur', 'Sabzevar', 'Torbat-e Heydarieh', 'Quchan', 'Kashmar', 'Torbat-e Jam', 'Chenaran', 'Gonabad', 'Sarakhs'],
    lat: 36.297,
    lng: 59.6062,
  },
  {
    id: 'north-khorasan',
    name: 'خراسان شمالی',
    nameEn: 'North Khorasan',
    cities: ['بجنورد', 'شیروان', 'اسفراین', 'جاجرم', 'آشخانه'],
    citiesEn: ['Bojnord', 'Shirvan', 'Esfarayen', 'Jajarm', 'Ashkhaneh'],
    lat: 37.4747,
    lng: 57.329,
  },
  {
    id: 'khuzestan',
    name: 'خوزستان',
    nameEn: 'Khuzestan',
    cities: ['اهواز', 'آبادان', 'خرمشهر', 'دزفول', 'ماهشهر', 'شوشتر', 'ایذه', 'اندیمشک', 'بهبهان', 'شوش'],
    citiesEn: ['Ahvaz', 'Abadan', 'Khorramshahr', 'Dezful', 'Mahshahr', 'Shushtar', 'Izeh', 'Andimeshk', 'Behbahan', 'Shush'],
    lat: 31.3183,
    lng: 48.6706,
  },
  {
    id: 'zanjan',
    name: 'زنجان',
    nameEn: 'Zanjan',
    cities: ['زنجان', 'ابهر', 'خدابنده', 'ماهنشان', 'خرمدره'],
    citiesEn: ['Zanjan', 'Abhar', 'Khodabandeh', 'Mahneshan', 'Khorramdarreh'],
    lat: 36.6736,
    lng: 48.4787,
  },
  {
    id: 'semnan',
    name: 'سمنان',
    nameEn: 'Semnan',
    cities: ['سمنان', 'شاهرود', 'دامغان', 'گرمسار', 'مهدی‌شهر'],
    citiesEn: ['Semnan', 'Shahrud', 'Damghan', 'Garmsar', 'Mahdishahr'],
    lat: 35.5729,
    lng: 53.3971,
  },
  {
    id: 'sistan-baluchestan',
    name: 'سیستان و بلوچستان',
    nameEn: 'Sistan and Baluchestan',
    cities: ['زاهدان', 'زابل', 'ایرانشهر', 'چابهار', 'سراوان', 'خاش', 'کنارک'],
    citiesEn: ['Zahedan', 'Zabol', 'Iranshahr', 'Chabahar', 'Saravan', 'Khash', 'Konarak'],
    lat: 29.4963,
    lng: 60.8629,
  },
  {
    id: 'fars',
    name: 'فارس',
    nameEn: 'Fars',
    cities: ['شیراز', 'مرودشت', 'جهرم', 'کازرون', 'لار', 'فسا', 'داراب', 'آباده', 'نی‌ریز', 'فیروزآباد'],
    citiesEn: ['Shiraz', 'Marvdasht', 'Jahrom', 'Kazerun', 'Lar', 'Fasa', 'Darab', 'Abadeh', 'Neyriz', 'Firuzabad'],
    lat: 29.5918,
    lng: 52.5837,
  },
  {
    id: 'qazvin',
    name: 'قزوین',
    nameEn: 'Qazvin',
    cities: ['قزوین', 'البرز', 'تاکستان', 'بوئین‌زهرا', 'آبیک'],
    citiesEn: ['Qazvin', 'Alborz', 'Takestan', 'Buin Zahra', 'Abyek'],
    lat: 36.2688,
    lng: 50.0041,
  },
  {
    id: 'qom',
    name: 'قم',
    nameEn: 'Qom',
    cities: ['قم'],
    citiesEn: ['Qom'],
    lat: 34.6401,
    lng: 50.8764,
  },
  {
    id: 'kurdistan',
    name: 'کردستان',
    nameEn: 'Kurdistan',
    cities: ['سنندج', 'سقز', 'مریوان', 'بانه', 'قروه', 'بیجار', 'کامیاران'],
    citiesEn: ['Sanandaj', 'Saqqez', 'Marivan', 'Baneh', 'Qorveh', 'Bijar', 'Kamyaran'],
    lat: 35.3111,
    lng: 46.9923,
  },
  {
    id: 'kerman',
    name: 'کرمان',
    nameEn: 'Kerman',
    cities: ['کرمان', 'رفسنجان', 'جیرفت', 'سیرجان', 'بم', 'زرند', 'بردسیر', 'کهنوج'],
    citiesEn: ['Kerman', 'Rafsanjan', 'Jiroft', 'Sirjan', 'Bam', 'Zarand', 'Bardsir', 'Kahnuj'],
    lat: 30.2839,
    lng: 57.0834,
  },
  {
    id: 'kermanshah',
    name: 'کرمانشاه',
    nameEn: 'Kermanshah',
    cities: ['کرمانشاه', 'اسلام‌آباد غرب', 'سنقر', 'پاوه', 'کنگاور', 'هرسین', 'سرپل ذهاب'],
    citiesEn: ['Kermanshah', 'Eslamabad-e Gharb', 'Sonqor', 'Paveh', 'Kangavar', 'Harsin', 'Sarpol-e Zahab'],
    lat: 34.3277,
    lng: 47.0778,
  },
  {
    id: 'kohgiluyeh-boyer-ahmad',
    name: 'کهگیلویه و بویراحمد',
    nameEn: 'Kohgiluyeh and Boyer-Ahmad',
    cities: ['یاسوج', 'دهدشت', 'گچساران', 'لیکک'],
    citiesEn: ['Yasuj', 'Dehdasht', 'Gachsaran', 'Likak'],
    lat: 30.6682,
    lng: 51.588,
  },
  {
    id: 'golestan',
    name: 'گلستان',
    nameEn: 'Golestan',
    cities: ['گرگان', 'گنبد کاووس', 'علی‌آباد کتول', 'آق‌قلا', 'کردکوی', 'بندر ترکمن', 'مینودشت'],
    citiesEn: ['Gorgan', 'Gonbad-e Kavus', 'Aliabad-e Katul', 'Aqqala', 'Kordkuy', 'Bandar-e Torkaman', 'Minudasht'],
    lat: 36.8427,
    lng: 54.4392,
  },
  {
    id: 'gilan',
    name: 'گیلان',
    nameEn: 'Gilan',
    cities: ['رشت', 'بندرانزلی', 'لاهیجان', 'لنگرود', 'آستارا', 'رودسر', 'صومعه‌سرا', 'تالش', 'فومن', 'رودبار'],
    citiesEn: ['Rasht', 'Bandar-e Anzali', 'Lahijan', 'Langarud', 'Astara', 'Rudsar', 'Sowme\'eh Sara', 'Talesh', 'Fuman', 'Rudbar'],
    lat: 37.2809,
    lng: 49.5832,
  },
  {
    id: 'lorestan',
    name: 'لرستان',
    nameEn: 'Lorestan',
    cities: ['خرم‌آباد', 'بروجرد', 'دورود', 'الیگودرز', 'کوهدشت', 'ازنا'],
    citiesEn: ['Khorramabad', 'Borujerd', 'Dorud', 'Aligudarz', 'Kuhdasht', 'Azna'],
    lat: 33.4878,
    lng: 48.3558,
  },
  {
    id: 'mazandaran',
    name: 'مازندران',
    nameEn: 'Mazandaran',
    cities: ['ساری', 'بابل', 'آمل', 'قائم‌شهر', 'بهشهر', 'نوشهر', 'چالوس', 'تنکابن', 'بابلسر', 'رامسر'],
    citiesEn: ['Sari', 'Babol', 'Amol', 'Qaemshahr', 'Behshahr', 'Nowshahr', 'Chalus', 'Tonekabon', 'Babolsar', 'Ramsar'],
    lat: 36.5633,
    lng: 53.0601,
  },
  {
    id: 'markazi',
    name: 'مرکزی',
    nameEn: 'Markazi',
    cities: ['اراک', 'ساوه', 'خمین', 'محلات', 'دلیجان', 'شازند', 'تفرش'],
    citiesEn: ['Arak', 'Saveh', 'Khomein', 'Mahallat', 'Delijan', 'Shazand', 'Tafresh'],
    lat: 34.0917,
    lng: 49.6889,
  },
  {
    id: 'hormozgan',
    name: 'هرمزگان',
    nameEn: 'Hormozgan',
    cities: ['بندرعباس', 'میناب', 'بندرلنگه', 'قشم', 'کیش', 'رودان', 'جاسک'],
    citiesEn: ['Bandar Abbas', 'Minab', 'Bandar Lengeh', 'Qeshm', 'Kish', 'Rudan', 'Jask'],
    lat: 27.1832,
    lng: 56.2666,
  },
  {
    id: 'hamedan',
    name: 'همدان',
    nameEn: 'Hamedan',
    cities: ['همدان', 'ملایر', 'نهاوند', 'تویسرکان', 'اسدآباد', 'بهار', 'رزن'],
    citiesEn: ['Hamedan', 'Malayer', 'Nahavand', 'Tuyserkan', 'Asadabad', 'Bahar', 'Razan'],
    lat: 34.7992,
    lng: 48.5146,
  },
  {
    id: 'yazd',
    name: 'یزد',
    nameEn: 'Yazd',
    cities: ['یزد', 'میبد', 'اردکان', 'ابرکوه', 'بافق', 'تفت'],
    citiesEn: ['Yazd', 'Meybod', 'Ardakan', 'Abarkuh', 'Bafq', 'Taft'],
    lat: 31.8974,
    lng: 54.3569,
  },
];

/**
 * جابه‌جایی همیشه با مقادیر فارسی (کانونی) ثبت می‌شود تا داده در پنل مدیریت یکدست بماند؛
 * این تابع فقط برای نمایش به مشتری، نام استان/شهر را در زبان جاری برمی‌گرداند.
 */
export function displayCityName(provinceName: string, cityName: string): string {
  const province = provinces.find((p) => p.name === provinceName);
  if (!province) return cityName;
  const index = province.cities.indexOf(cityName);
  if (index === -1) return cityName;
  return pick(cityName, province.citiesEn[index] ?? cityName);
}

/**
 * نتیجه‌ی reverse geocode نقشه (نام آزاد استان/شهر از Nominatim) را به نزدیک‌ترین استان/شهر
 * موجود در دیتاست کانونی خودمان تطبیق می‌دهد — چون املا/سطح تفصیل Nominatim همیشه با فهرست
 * ثابت ما یکی نیست. اگر شهر دقیق پیدا نشود، مرکز همان استان (اولین شهر فهرست) را برمی‌گرداند.
 */
export function matchProvinceAndCity(rawProvince: string, rawCity: string): { province: string; city: string } | null {
  const normalize = (s: string) => s.replace(/^استان\s+/, '').trim();
  const provinceName = normalize(rawProvince);
  const province = provinces.find(
    (p) => p.name === provinceName || p.nameEn === provinceName || provinceName.includes(p.name) || p.name.includes(provinceName),
  );
  if (!province) return null;

  const cityName = normalize(rawCity);
  const matchedCity = cityName
    ? province.cities.find((c) => c === cityName || cityName.includes(c) || c.includes(cityName))
    : undefined;

  return { province: province.name, city: matchedCity ?? province.cities[0] };
}

export function displayProvinceName(provinceName: string): string {
  const province = provinces.find((p) => p.name === provinceName);
  return province ? pick(province.name, province.nameEn) : provinceName;
}

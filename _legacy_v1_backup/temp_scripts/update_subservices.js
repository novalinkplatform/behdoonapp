const hvacSubs = [
  "نصب و سرویس کولر آبی",
  "نصب و سرویس پکیج",
  "نصب و سرویس رادیاتور شوفاژ",
  "تعمیر و سرویس آبگرمکن"
];

const renovationSubs = [
  "نقاشی و رنگ کاری ساختمان",
  "کاشی کاری و سرامیک",
  "بنایی و تخریب",
  "گچ کاری و لکه گیری",
  "عایق کاری پشت بام (ایزوگام و قیرگونی و...)",
  "کنافکاری",
  "نصب کاغذ دیواری",
  "پارکت و لمینت",
  "سنگ کاری",
  "تعمیرات نما"
];

const plumbingSubs = [
  "نصب و تعمیر شیرآلات",
  "نصب سینک ظرفشویی",
  "تشخیص و ترمیم ترکیدگی لوله",
  "رفع نم و نشتی و رطوبت",
  "نصب و سرویس منبع آب",
  "نصب و تعمیر دستگاه تصفیه آب",
  "نصب و سرویس توالت فرنگی و ایرانی",
  "نصب و تعمیر فلاش تانک و سیفون",
  "نصب روشویی",
  "نصب و تعمیر وال هنگ",
  "لوله کشی آب و فاضلاب",
  "اتصال به شبکه فاضلاب شهری"
];

const electricalSubs = [
  "نصب و تعمیر آیفون صوتی و تصویری",
  "سیم کشی و کابل کشی",
  "نصب لوستر و چراغ",
  "رفع اتصالی",
  "رفع خرابی و سیم کشی تلفن",
  "نصب و تعمیر دوربین مداربسته",
  "نصب و تعمیر آنتن تلویزیون",
  "کلید و پریز",
  "نصب و تعمیر ژنراتور و یو پی اس",
  "نصب پنل خورشیدی",
  "نصب و تعمیر جک پارکینگ و آرام بند",
  "تعمیر و سرویس آسانسور",
  "نصب و تعمیر کرکره برقی",
  "نصب و تعویض فیوز",
  "هواکش و تهویه مطبوع",
  "نصب و تعمیر بالابر",
  "نصب و تعمیر دزدگیر اماکن",
  "نصب محافظ برق و استابلایزر",
  "ساخت و تعمیر تابلو تبلیغاتی",
  "خدمات برق صنعتی و سه فاز",
  "رفع خرابی و نصب سانترال",
  "طراحی و اجرای نور مخفی",
  "نصب سنسور و تایمر",
  "سیم پیچی",
  "نصب داکت و ترانکینگ",
  "ساخت و تعمیر تابلو برق",
  "سیستم اعلام و اطفاء حریق",
  "سیم کشی ارت"
];

function generateSubServicesJSON(arr, defaultIcon) {
    return "[\n" + arr.map(name => `      { "name": "${name}", "icon": "${defaultIcon}" }`).join(',\n') + "\n    ]";
}

const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

// Icons
const hvacIcon = "M12 3v18m-4-14h8m-8 10h8M6 8a6 6 0 1112 0 6 6 0 01-12 0z";
const plumbIcon = "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"; // water drop
const elecIcon = "M13 10V3L4 14h7v7l9-11h-7z"; // lightning
const renovIcon = "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"; // building

// Regex to replace subServices array for each category
// Look for "id": "hvac", ... "subServices": [ ... ]
function replaceSubServices(content, id, newJSON) {
    const regex = new RegExp(`("id"\\s*:\\s*"${id}"[\\s\\S]*?"subServices"\\s*:\\s*)\\[[\\s\\S]*?\\]`, 'g');
    return content.replace(regex, `$1${newJSON}`);
}

content = replaceSubServices(content, 'hvac', generateSubServicesJSON(hvacSubs, hvacIcon));
content = replaceSubServices(content, 'plumbing', generateSubServicesJSON(plumbingSubs, plumbIcon));
content = replaceSubServices(content, 'electrical', generateSubServicesJSON(electricalSubs, elecIcon));
content = replaceSubServices(content, 'renovation', generateSubServicesJSON(renovationSubs, renovIcon));

fs.writeFileSync('worker.js', content);
console.log('SubServices updated.');

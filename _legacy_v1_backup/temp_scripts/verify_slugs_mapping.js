const fs = require('fs');

const slugsMap = {
    hvac: [
        { name: 'نصب و سرویس کولر آبی', slug: 'water-cooler', persianSlug: 'نصب-و-سرویس-کولر-آبی' },
        { name: 'نصب و سرویس پکیج', slug: 'package', persianSlug: 'نصب-و-سرویس-پکیج' },
        { name: 'نصب و سرویس رادیاتور شوفاژ', slug: 'radiator', persianSlug: 'نصب-و-سرویس-رادیاتور-شوفاژ' },
        { name: 'تعمیر و سرویس آبگرمکن', slug: 'water-heater', persianSlug: 'تعمیر-و-سرویس-آبگرمکن' }
    ],
    plumbing: [
        { name: 'تشخیص و ترمیم ترکیدگی لوله', slug: 'leak-detection', persianSlug: 'تشخیص-ترکیدگی-لوله' },
        { name: 'رفع نم و نشتی و رطوبت', slug: 'moisture-repair', persianSlug: 'رفع-نم-و-رطوبت' },
        { name: 'نصب و تعمیر شیرآلات', slug: 'faucets', persianSlug: 'نصب-و-تعمیر-شیرآلات' },
        { name: 'نصب و سرویس منبع آب', slug: 'water-tank', persianSlug: 'نصب-منبع-آب' },
        { name: 'نصب و سرویس توالت فرنگی و ایرانی', slug: 'toilet', persianSlug: 'نصب-توالت-فرنگی' },
        { name: 'لوله کشی آب و فاضلاب', slug: 'piping', persianSlug: 'لوله-کشی-آب-و-فاضلاب' },
        { name: 'نصب سینک ظرفشویی', slug: 'sink', persianSlug: 'نصب-سینک-ظرفشویی' },
        { name: 'نصب و تعمیر دستگاه تصفیه آب', slug: 'water-purifier', persianSlug: 'دستگاه-تصفیه-آب' },
        { name: 'نصب و تعمیر فلاش تانک و سیفون', slug: 'flush-tank', persianSlug: 'فلاش-تانک' },
        { name: 'نصب روشویی', slug: 'washbasin', persianSlug: 'نصب-روشویی' },
        { name: 'نصب و تعمیر وال هنگ', slug: 'wall-hung', persianSlug: 'وال-هنگ' },
        { name: 'اتصال به شبکه فاضلاب شهری', slug: 'sewage-connection', persianSlug: 'فاضلاب-شهری' }
    ],
    electrical: [
        { name: 'رفع اتصالی', slug: 'short-circuit', persianSlug: 'رفع-اتصالی' },
        { name: 'سیم کشی و کابل کشی', slug: 'wiring', persianSlug: 'سیم-کشی-ساختمان' },
        { name: 'نصب لوستر و چراغ', slug: 'chandelier', persianSlug: 'نصب-لوستر-و-چراغ' },
        { name: 'کلید و پریز', slug: 'switches', persianSlug: 'کلید-و-پریز' },
        { name: 'نصب و تعمیر آیفون صوتی و تصویری', slug: 'intercom', persianSlug: 'آیفون-تصویری' },
        { name: 'ساخت و تعمیر تابلو برق', slug: 'electrical-panel', persianSlug: 'تابلو-برق' },
        { name: 'سیم کشی ارت', slug: 'earthing', persianSlug: 'سیم-کشی-ارت' },
        { name: 'سیستم اعلام و اطفاء حریق', slug: 'fire-alarm', persianSlug: 'اعلام-حریق' },
        { name: 'نصب محافظ برق و استابلایزر', slug: 'stabilizer', persianSlug: 'محافظ-برق' },
        { name: 'نصب و تعمیر دوربین مداربسته', slug: 'cctv', persianSlug: 'دوربین-مداربسته' }
    ],
    renovation: [
        { name: 'نقاشی و رنگ کاری ساختمان', slug: 'painting', persianSlug: 'نقاشی-ساختمان' },
        { name: 'کاشی کاری و سرامیک', slug: 'tiling', persianSlug: 'کاشی-کاری-و-سرامیک' },
        { name: 'بنایی و تخریب', slug: 'masonry', persianSlug: 'بنایی-و-تخریب' },
        { name: 'گچ کاری و لکه گیری', slug: 'plastering', persianSlug: 'گچ-کاری-و-لکه-گیری' },
        { name: 'عایق کاری پشت بام (ایزوگام و قیرگونی و...)', slug: 'roof-insulation', persianSlug: 'عایق-کاری-پشت-بام' },
        { name: 'کنافکاری', slug: 'knauf', persianSlug: 'کناف-کاری' },
        { name: 'نصب کاغذ دیواری', slug: 'wallpaper', persianSlug: 'نصب-کاغذ-دیواری' },
        { name: 'پارکت و لمینت', slug: 'parquet', persianSlug: 'پارکت-و-لمینت' },
        { name: 'سنگ کاری', slug: 'stone-work', persianSlug: 'سنگ-کاری' },
        { name: 'تعمیرات نما', slug: 'facade-repair', persianSlug: 'تعمیرات-نما' }
    ]
};

for (const [cat, items] of Object.entries(slugsMap)) {
    const data = JSON.parse(fs.readFileSync(`${cat}_data.json`, 'utf8'));
    console.log(`Checking ${cat}: data has ${data.subServices.length} items, map has ${items.length}`);
    data.subServices.forEach((sub, i) => {
        const mapped = items[i];
        if (!mapped || mapped.name !== sub.name) {
            console.warn(`Mismatch in ${cat}[${i}]: json="${sub.name}" vs map="${mapped ? mapped.name : 'NONE'}"`);
        }
    });
}
console.log('Mapping verification finished.');

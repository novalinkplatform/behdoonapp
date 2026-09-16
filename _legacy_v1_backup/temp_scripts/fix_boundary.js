const fs = require('fs');

let code = fs.readFileSync('src/frontend.js', 'utf8');

const needleStart = '{"q":"آیا برای بازسازی نیاز به تخلیه کامل خانه است؟"';
// Let's find "آیا برای بازسازی نیاز به تخلیه کامل خانه است؟"
const qIdx = code.indexOf('آیا برای بازسازی نیاز به تخلیه کامل خانه است؟');
const heroIdx = code.indexOf('const heroSection = `', qIdx);

console.log('qIdx:', qIdx, 'heroIdx:', heroIdx);

const startSlice = code.lastIndexOf('{', qIdx);
console.log('startSlice:', startSlice);

const cleanReplacement = `{
                "q": "آیا برای بازسازی نیاز به تخلیه کامل خانه است؟",
                "a": "برای نقاشی جزئی یا خرده‌کاری‌های ساختمانی نیازی به تخلیه نیست و اسباب‌اثاثیه با کاورهای نایلونی محافظت می‌شوند؛ اما در بازسازی‌های صفر تا صد (تخریب، تعویض لوله‌کشی و سرامیک کف) تخلیه واحد جهت پیشبرد سریع‌تر کار الزامی است."
            },
            {
                "q": "هزینه نقاشی ساختمان چگونه محاسبه می‌شود؟",
                "a": "هزینه نقاشی ساختمان بر اساس متر مربع سطح کار (دیوارها و سقف)، نوع رنگ انتخابی (روغنی، پلاستیک، اکریلیک یا پتینه) و میزان زیرسازی و بتونه‌کاری مورد نیاز، طبق نرخ مصوب اتحادیه نقاشان تهران محاسبه می‌شود."
            }
        ]
    }
};

export function renderServicePage(serviceId) {
    const data = servicesData[serviceId];
    if (!data) return '404';

    const breadcrumbs = \`
        <nav class="hidden md:flex text-xs text-slate-500 mb-4 justify-start" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 space-x-reverse md:space-x-2 bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-sm rounded-xl px-4 py-2 text-xs">
                <li class="inline-flex items-center">
                    <a href="/" class="inline-flex items-center hover:text-brand-600 transition-colors">
                        <svg class="w-3.5 h-3.5 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                        خانه
                    </a>
                </li>
                <li>
                    <div class="flex items-center">
                        <svg class="w-3.5 h-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                        <a href="/#services" class="mr-1 hover:text-brand-600 transition-colors">خدمات</a>
                    </div>
                </li>
                <li aria-current="page">
                    <div class="flex items-center">
                        <svg class="w-3.5 h-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                        <span class="mr-1 text-slate-700 font-bold" id="breadcrumb-current">\${data.title}</span>
                    </div>
                </li>
            </ol>
        </nav>
    \`;

    `;

code = code.substring(0, startSlice) + cleanReplacement + code.substring(heroIdx);
fs.writeFileSync('src/frontend.js', code, 'utf8');
console.log('Fixed src/frontend.js successfully!');

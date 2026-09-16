const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const regex = /<!-- ROW 3: SEO Intro -->[\s\S]*?<p class="mb-5">بهدون خدمات فنی و ساختمانی خود را در مناطق مختلف تهران ارائه می‌دهد و تلاش می‌کند تجربه‌ای ساده، منظم و قابل اعتماد برای دریافت خدمات ساختمان ایجاد کند\.<\/p>\s*<\/div>/g;

const replacement = `<!-- ROW 3: SEO Intro -->
                <div class="bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-8 text-slate-600 text-sm md:text-base leading-loose">
                    <h2 class="text-lg font-black text-slate-800 mb-4">بهدون؛ خدمات حرفه‌ای ساختمان در تهران</h2>
                    <p class="mb-4">بهدون ارائه‌دهنده خدمات فنی و ساختمانی در تهران است و با هدف ساده‌تر کردن دسترسی به خدمات تخصصی ساختمان فعالیت می‌کند.</p>
                    <p class="mb-4">خدمات بهدون بخش‌های مختلفی از نیازهای ساختمان را پوشش می‌دهد؛ از جمله <a href="/services/tasisat" class="text-brand-600 hover:underline">تأسیسات ساختمان</a>، لوله‌کشی آب و فاضلاب، رفع نشتی، نشت‌یابی، رفع نم و رطوبت، تعمیرات سیستم‌های گرمایشی و سرمایشی، <a href="/services/electrical" class="text-brand-600 hover:underline">برق‌کشی و روشنایی</a>، <a href="/services/renovation" class="text-brand-600 hover:underline">بازسازی و دکوراسیون</a> و <a href="/services/construction" class="text-brand-600 hover:underline">خدمات بنایی و عمرانی</a>.</p>
                    <p class="mb-4">هدف بهدون این است که فرایند پیدا کردن و دریافت خدمات فنی ساختمان برای ساکنان تهران ساده‌تر و منظم‌تر باشد. کاربران می‌توانند متناسب با نیاز خود، خدمت موردنظرشان را پیدا کرده و برای بررسی و اجرای آن درخواست ثبت کنند.</p>
                    <p class="mb-4">خدمات فنی ساختمان بسته به نوع بنا و مشکل موجود می‌تواند شامل تعمیرات تأسیسات، رفع نشتی و مشکلات رطوبتی، برق‌کاری و عیب‌یابی، بازسازی و نوسازی، یا خدمات بنایی و عمرانی باشد. در بسیاری از موارد، بررسی اولیه و تشخیص صحیح مشکل می‌تواند از آسیب بیشتر و هزینه‌های اضافی جلوگیری کند.</p>
                    <p>بهدون خدمات خود را در مناطق مختلف تهران ارائه می‌دهد و تلاش می‌کند تجربه‌ای ساده، منظم و قابل اعتماد برای دسترسی به خدمات تخصصی ساختمان ایجاد کند.</p>
                </div>`;

const matches = content.match(regex);
console.log('Matches found:', matches ? matches.length : 0);

if (matches && matches.length > 0) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('worker.js', content);
    console.log('Successfully updated ROW 3 SEO text.');
} else {
    console.log('Regex failed to match.');
}

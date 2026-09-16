const fs = require('fs');

let content = fs.readFileSync('worker.js', 'utf8');

// The file looks like:
// const html = `<!DOCTYPE html> ... <body><header>...</header><main>...</main><footer>...</footer></body></html>`;
// return new Response(html, ...)

// Let's replace 'const html = `' with a function and router
const newRouterLogic = `
    const url = new URL(request.url);
    const path = url.pathname;

    const headerHTML = \`<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>بهدون؛ خدمات حرفه ای ساختمان در تهران</title>
    <meta name="description" content="تشخیص ترکیدگی لوله با دستگاه نقطه زن، لوله بازکنی و تعمیرات تاسیسات با ضمانت کتبی در تهران.">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><rect width=%2224%22 height=%2224%22 rx=%226%22 fill=%22%23133458%22/><path stroke=%22%23ffffff%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 fill=%22none%22 d=%22M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4%22/></svg>">
    
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" type="text/css" />
    
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              success: { 50: '#ecfdf5', 100: '#d1fae5', 500: '#10b981', 600: '#059669', 700: '#047857' },
              brand: {
                50: '#f3f6f9',
                100: '#e1e8ef',
                200: '#c5d3e0',
                300: '#9bb7cc',
                400: '#5282a3',
                500: '#133458',
                600: '#0f2a46',
                700: '#0b2034'
              }
            },
            fontFamily: {
              sans: ['Vazirmatn', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
              'card': '0 10px 40px -10px rgba(19,52,88,0.08)',
              'card-hover': '0 20px 40px -10px rgba(19,52,88,0.15)',
            },
            animation: {
              'float': 'float 6s ease-in-out infinite',
              'heartbeat': 'heartbeat 2s ease-in-out infinite',
            },
            keyframes: {
              float: {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-10px)' },
              },
              heartbeat: {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.05)' },
              }
            }
          }
        }
      }
    </script>
    <style>
        body { font-family: 'Vazirmatn', sans-serif; background-color: #f8fafc; }
        html { scroll-behavior: smooth; }
        ::selection { background-color: #133458; color: white; }
    </style>
</head>
<body class="text-slate-800 antialiased selection:bg-brand-500 selection:text-white">
    <!-- Navbar -->
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/50 shadow-sm transition-all duration-300">
        <div class="container mx-auto px-4 lg:px-8 flex items-center justify-between h-20">
            <!-- Logo -->
            <div class="flex items-center gap-3">
                <a href="/" class="flex items-center gap-2 group">
                    <div class="w-12 h-12 bg-gradient-to-br from-brand-600 to-brand-400 rounded-[1rem] flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform duration-300 ring-2 ring-brand-100 ring-offset-2">
                        ب
                    </div>
                    <div>
                        <div class="font-black text-xl text-brand-600 tracking-tight">بهدون</div>
                        <div class="text-[10px] text-slate-500 font-bold tracking-wider">خدمات حرفه‌ای ساختمان</div>
                    </div>
                </a>
            </div>
            
            <nav class="hidden md:flex items-center gap-8 font-bold text-slate-600 text-sm">
                <a href="/#services" class="hover:text-brand-500 transition-colors">انواع خدمات</a>
                <a href="/magazine" class="hover:text-brand-500 transition-colors">دانشنامه</a>
                <a href="/#about-us" class="hover:text-brand-500 transition-colors">درباره ما</a>
            </nav>

            <div class="hidden md:flex">
                <a href="tel:\${PHONE}" class="flex items-center gap-2 bg-success-600 text-white px-5 py-2.5 rounded-full font-bold shadow-md shadow-success-600/20 animate-heartbeat hover:bg-success-700 transition-colors text-sm">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
                    <span dir="ltr">\${PHONE_DISPLAY}</span>
                </a>
            </div>

            <!-- Mobile Hamburger -->
            <button class="md:hidden p-2 text-brand-500 bg-brand-50 rounded-full" onclick="document.getElementById('mobile-menu').classList.toggle('hidden')">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>

            <!-- Mobile Menu Dropdown -->
            <div id="mobile-menu" class="hidden absolute top-[120%] left-0 w-full bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col overflow-hidden py-2">
                <a href="/#services" class="px-6 py-4 border-b border-slate-100 font-bold text-slate-700 text-center" onclick="document.getElementById('mobile-menu').classList.add('hidden')">انواع خدمات ساختمان</a>
                <a href="/magazine" class="px-6 py-4 border-b border-slate-100 font-bold text-slate-700 text-center" onclick="document.getElementById('mobile-menu').classList.add('hidden')">دانشنامه</a>
                <a href="/#about-us" class="px-6 py-4 border-b border-slate-100 font-bold text-slate-700 text-center" onclick="document.getElementById('mobile-menu').classList.add('hidden')">درباره ما</a>
                <a href="tel:\${PHONE}" class="px-6 py-4 font-bold text-success-600 text-center bg-success-50 flex items-center justify-center gap-2">
                    تماس: <span dir="ltr">\${PHONE_DISPLAY}</span>
                </a>
            </div>
        </div>
    </header>
\`;

    const footerHTML = \`
    <footer class="bg-brand-600 text-brand-100 py-12 md:py-16 pb-28 md:pb-16 border-t-[8px] border-brand-500 relative overflow-hidden">
        <div class="absolute -right-20 -bottom-20 w-64 h-64 bg-brand-500/30 rounded-full blur-[60px]"></div>
        <div class="container mx-auto px-4 max-w-7xl relative z-10">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div class="col-span-1 md:col-span-1">
                    <div class="flex items-center gap-2 mb-6 opacity-50 grayscale">
                        <div class="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-inner">
                            ب
                        </div>
                        <span class="font-black text-2xl text-white tracking-tight">بهدون</span>
                    </div>
                    <p class="text-brand-200 text-sm leading-loose text-justify mb-6">
                        ما با کادری مجرب و تجهیزات پیشرفته، آرامش را به خانه شما بازمی‌گردانیم. تمامی خدمات با ضمانت و فاکتور رسمی ارائه می‌گردد.
                    </p>
                </div>

                <div>
                    <h4 class="text-white font-bold text-lg mb-6 flex items-center gap-2">
                        <div class="w-1.5 h-6 bg-amber-400 rounded-full"></div>
                        دسترسی سریع
                    </h4>
                    <ul class="space-y-3 text-sm">
                        <li><a href="/#services" class="hover:text-amber-400 transition-colors flex items-center gap-2"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> خدمات ما</a></li>
                        <li><a href="/magazine" class="hover:text-amber-400 transition-colors flex items-center gap-2"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> دانشنامه</a></li>
                        <li><a href="/#about-us" class="hover:text-amber-400 transition-colors flex items-center gap-2"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> درباره بهدون</a></li>
                    </ul>
                </div>

                <div>
                    <h4 class="text-white font-bold text-lg mb-6 flex items-center gap-2">
                        <div class="w-1.5 h-6 bg-success-400 rounded-full"></div>
                        تماس با ما
                    </h4>
                    <ul class="space-y-4 text-sm">
                        <li class="flex items-start gap-3">
                            <div class="p-2 bg-brand-500 rounded-lg text-brand-200 shrink-0"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></div>
                            <span class="leading-relaxed">تهران، پوشش سراسری در تمامی مناطق (شمال، جنوب، شرق، غرب)</span>
                        </li>
                        <li class="flex items-center gap-3">
                            <div class="p-2 bg-brand-500 rounded-lg text-brand-200 shrink-0"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg></div>
                            <a href="tel:\${PHONE}" class="font-bold text-lg hover:text-white transition-colors" dir="ltr">\${PHONE_DISPLAY}</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="mt-12 pt-6 border-t border-brand-500/50 text-center text-brand-300 text-xs flex flex-col md:flex-row justify-between items-center gap-4">
                <p>تمام حقوق برای گروه تاسیساتی بهدون محفوظ است. &copy; 1403</p>
                <div class="flex gap-4">
                    <a href="#" class="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center hover:bg-brand-400 transition-colors text-white"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></a>
                    <a href="#" class="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center hover:bg-brand-400 transition-colors text-white"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
                </div>
            </div>
        </div>
    </footer>

    <!-- Fixed Mobile CTA -->
    <div class="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <a href="tel:\${PHONE}" class="flex items-center justify-between bg-success-600 text-white p-4 rounded-2xl shadow-xl shadow-success-600/30 font-bold active:scale-95 transition-transform">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center animate-heartbeat">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
                </div>
                <div class="flex flex-col">
                    <span class="text-[13px] opacity-90 font-normal">درخواست فوری نیروی متخصص</span>
                    <span>تماس با پشتیبانی</span>
                </div>
            </div>
            <div class="text-[11px] font-bold opacity-90 tracking-widest font-sans" dir="ltr">\${PHONE_DISPLAY}</div>
        </a>
    </div>
</body>
</html>
\`;

    const magazineHTML = \`
        <main class="min-h-screen bg-slate-50 pt-10 pb-20">
            <div class="container mx-auto px-4 max-w-5xl">
                <h1 class="text-3xl font-black text-slate-800 mb-8 border-b border-slate-200 pb-4">دانشنامه بهدون</h1>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- Article 1 -->
                    <a href="/magazine/article-1" class="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-card-hover transition-all border border-slate-200 flex flex-col">
                        <div class="h-56 overflow-hidden bg-[url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center group-hover:scale-105 transition-transform duration-500"></div>
                        <div class="p-6">
                            <span class="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full mb-4 inline-block">معماری و ساخت</span>
                            <h2 class="text-xl font-bold text-slate-800 mb-3 group-hover:text-purple-600 transition-colors">راهنمای جامع تخریب و بازسازی منزل</h2>
                            <p class="text-slate-600 text-sm leading-relaxed mb-4">هرآنچه باید قبل از شروع پروژه بازسازی و تخریب بدانید تا هزینه‌های خود را مدیریت کنید...</p>
                            <span class="text-purple-600 text-sm font-bold flex items-center gap-2">ادامه مطلب <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg></span>
                        </div>
                    </a>
                    
                    <!-- Article 2 -->
                    <a href="/magazine/article-2" class="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-card-hover transition-all border border-slate-200 flex flex-col">
                        <div class="h-56 overflow-hidden bg-[url('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center group-hover:scale-105 transition-transform duration-500"></div>
                        <div class="p-6">
                            <span class="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full mb-4 inline-block">دکوراسیون</span>
                            <h2 class="text-xl font-bold text-slate-800 mb-3 group-hover:text-purple-600 transition-colors">بهترین رنگ برای اتاق خواب چیست؟</h2>
                            <p class="text-slate-600 text-sm leading-relaxed mb-4">انتخاب رنگ مناسب می‌تواند روی کیفیت خواب و آرامش اعصاب شما تاثیر مستقیم داشته باشد...</p>
                            <span class="text-purple-600 text-sm font-bold flex items-center gap-2">ادامه مطلب <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg></span>
                        </div>
                    </a>

                    <!-- Article 3 -->
                    <a href="/magazine/article-3" class="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-card-hover transition-all border border-slate-200 flex flex-col">
                        <div class="h-56 overflow-hidden bg-[url('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center group-hover:scale-105 transition-transform duration-500"></div>
                        <div class="p-6">
                            <span class="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full mb-4 inline-block">تأسیسات</span>
                            <h2 class="text-xl font-bold text-slate-800 mb-3 group-hover:text-purple-600 transition-colors">چرا فشار آب ساختمان کم می‌شود؟</h2>
                            <p class="text-slate-600 text-sm leading-relaxed mb-4">علل افت فشار آب و راهکارهای عملی برای افزایش فشار آب پکیج و شیرآلات منزل...</p>
                            <span class="text-purple-600 text-sm font-bold flex items-center gap-2">ادامه مطلب <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg></span>
                        </div>
                    </a>
                </div>
            </div>
        </main>
    \`;

    const singleArticleHTML = \`
        <main class="min-h-screen bg-white pb-20">
            <!-- Article Header -->
            <div class="w-full h-[40vh] md:h-[60vh] bg-[url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center relative">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                <div class="absolute bottom-0 left-0 w-full p-6 md:p-12">
                    <div class="container mx-auto max-w-4xl text-white">
                        <span class="text-xs font-bold text-white bg-purple-600 px-3 py-1 rounded-full mb-4 inline-block shadow-lg">معماری و ساخت</span>
                        <h1 class="text-3xl md:text-5xl font-black mb-4 leading-tight">راهنمای جامع تخریب و بازسازی منزل</h1>
                        <div class="flex items-center gap-4 text-slate-300 text-sm">
                            <span>زمان مطالعه: ۵ دقیقه</span>
                            <span>•</span>
                            <span>تاریخ انتشار: ۱۲ آبان ۱۴۰۳</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Article Content -->
            <div class="container mx-auto max-w-4xl px-4 py-12">
                <div class="prose prose-lg prose-slate max-w-none text-justify leading-loose">
                    <p class="text-xl text-slate-600 font-medium mb-8 leading-relaxed">تخریب و بازسازی منزل یکی از مهم‌ترین تصمیماتی است که هر مالکی ممکن است در طول زندگی خود بگیرد. این فرآیند اگر با دقت و برنامه‌ریزی انجام نشود، می‌تواند هزینه‌های گزافی روی دست شما بگذارد.</p>
                    
                    <h2 class="text-2xl font-bold text-slate-800 mt-10 mb-4">۱. برآورد بودجه و برنامه‌ریزی</h2>
                    <p>مهم‌ترین قدم قبل از هرگونه کلنگ‌زنی، مشخص کردن دقیق بودجه است. همیشه ۲۰ درصد بیشتر از بودجه پیش‌بینی شده را برای هزینه‌های پنهان کنار بگذارید.</p>
                    
                    <div class="bg-purple-50 border-r-4 border-purple-500 p-6 rounded-l-xl my-8">
                        <h4 class="font-bold text-purple-800 mb-2">نکته کلیدی</h4>
                        <p class="text-purple-700 m-0">تخریب دیوارهای حمال بدون مشورت با مهندس سازه می‌تواند باعث ریزش کل ساختمان شود. حتماً از متخصصین کمک بگیرید.</p>
                    </div>

                    <h2 class="text-2xl font-bold text-slate-800 mt-10 mb-4">۲. اولویت‌بندی زیرساخت‌ها</h2>
                    <p>بسیاری از افراد تمام بودجه خود را صرف زیبایی ظاهری (کابینت، کاغذ دیواری) می‌کنند و از زیرساخت‌ها (لوله‌کشی، سیم‌کشی) غافل می‌شوند. تعویض لوله‌های پوسیده باید اولین قدم در بازسازی باشد.</p>
                    
                    <h2 class="text-2xl font-bold text-slate-800 mt-10 mb-4">۳. انتخاب پیمانکار معتبر</h2>
                    <p>گروه تاسیساتی بهدون با سال‌ها تجربه در امر بازسازی و تاسیسات، آماده ارائه مشاوره رایگان و اجرای پروژه‌های شما با ضمانت کتبی می‌باشد.</p>
                </div>

                <!-- Related Articles -->
                <div class="mt-16 pt-10 border-t border-slate-200">
                    <h3 class="text-2xl font-black text-slate-800 mb-8">پیشنهاد موارد بیشتر</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <a href="/magazine/article-2" class="group bg-slate-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-card transition-all border border-slate-200 flex items-center p-3 gap-4">
                            <div class="w-24 h-24 rounded-xl overflow-hidden bg-[url('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80')] bg-cover bg-center shrink-0"></div>
                            <div>
                                <h4 class="font-bold text-slate-800 group-hover:text-purple-600 transition-colors mb-1 line-clamp-2">بهترین رنگ برای اتاق خواب چیست؟</h4>
                                <span class="text-xs text-slate-500">مطالعه مقاله</span>
                            </div>
                        </a>
                        <a href="/magazine/article-3" class="group bg-slate-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-card transition-all border border-slate-200 flex items-center p-3 gap-4">
                            <div class="w-24 h-24 rounded-xl overflow-hidden bg-[url('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80')] bg-cover bg-center shrink-0"></div>
                            <div>
                                <h4 class="font-bold text-slate-800 group-hover:text-purple-600 transition-colors mb-1 line-clamp-2">چرا فشار آب ساختمان کم می‌شود؟</h4>
                                <span class="text-xs text-slate-500">مطالعه مقاله</span>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </main>
    \`;

    let htmlResponse = '';
    if (path === '/magazine' || path === '/magazine/') {
        htmlResponse = headerHTML + magazineHTML + footerHTML;
    } else if (path.startsWith('/magazine/')) {
        htmlResponse = headerHTML + singleArticleHTML + footerHTML;
    } else {
        htmlResponse = html;
    }

    return new Response(htmlResponse, {
`;

// Replace the return logic.
// The file has:
// const html = `<!DOCTYPE html> ... </html>`;
// 
// return new Response(html, { ...
//
// We need to inject the router and separate the home HTML.

const parts = content.split('const html = `');
if (parts.length < 2) {
    console.log("Could not split content correctly.");
    process.exit(1);
}

// Split the second part at `return new Response`
const subParts = parts[1].split('return new Response(html, {');

let homeHTML = subParts[0];
// Remove the trailing backtick and semicolon from homeHTML
homeHTML = homeHTML.trim();
if (homeHTML.endsWith('`;')) {
    homeHTML = homeHTML.slice(0, -2);
}

const finalScript = parts[0] + 'const html = `' + homeHTML + '`;\n' + newRouterLogic + '      headers: {\n        "content-type": "text/html;charset=UTF-8",\n        "Cache-Control": "public, max-age=3600"\n      },\n    });\n  },\n};\n';

fs.writeFileSync('worker.js', finalScript);
console.log('Routing and pages updated successfully.');

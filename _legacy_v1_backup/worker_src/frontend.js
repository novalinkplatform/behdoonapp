export const PHONE = "02122345678";
export const PHONE_DISPLAY = "021 - 22345678";
export const WHATSAPP = "989333256885";


export const headerHTML = `<!DOCTYPE html>
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
                <a href="/" onclick="window.location.href='/'; return false;" class="flex items-center gap-2 group">
                    <div class="w-12 h-12 bg-gradient-to-br from-brand-600 to-brand-400 rounded-[1rem] flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform duration-300 ring-2 ring-brand-100 ring-offset-2">
                        ب
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="font-black text-lg md:text-xl text-brand-600 tracking-tight">بهدون</span>
                        <span class="text-slate-300 text-xs">|</span>
                        <span class="text-[10px] md:text-[11px] text-slate-500 font-medium whitespace-nowrap">خدمات حرفه‌ای ساختمان در تهران</span>
                    </div>
                </a>
            </div>
            
            <nav class="hidden md:flex items-center gap-8 font-bold text-slate-600 text-sm">
                <a href="/services/hvac" class="hover:text-brand-500 transition-colors">انواع خدمات</a>
                <a href="/magazine" class="hover:text-brand-500 transition-colors">دانشنامه</a>
                <a href="/#about-us" class="hover:text-brand-500 transition-colors">درباره ما</a>
            </nav>

            <div class="hidden md:flex">
                <a href="tel:${PHONE}" class="flex items-center gap-2 bg-success-600 text-white px-5 py-2.5 rounded-full font-bold shadow-md shadow-success-600/20 animate-heartbeat hover:bg-success-700 transition-colors text-sm">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
                    <span dir="ltr">${PHONE_DISPLAY}</span>
                </a>
            </div>

            <!-- Mobile Hamburger -->
            <button class="md:hidden p-2 text-brand-500 bg-brand-50 rounded-full" onclick="document.getElementById('mobile-menu').classList.toggle('hidden')">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>

            <!-- Mobile Menu Dropdown -->
            <div id="mobile-menu" class="hidden absolute top-[120%] left-0 w-full bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col overflow-hidden p-4 space-y-2.5 z-50">
                <!-- Contact Buttons (Top) -->
                <div class="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
                    <a href="tel:02122345678" class="flex items-center justify-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 py-2.5 px-3 rounded-xl font-bold text-xs hover:bg-emerald-100 transition-colors">
                        <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
                        <span dir="ltr">021-22345678</span>
                    </a>
                    <a href="https://wa.me/989333256885" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-1.5 bg-green-50 border border-green-200 text-green-700 py-2.5 px-3 rounded-xl font-bold text-xs hover:bg-green-100 transition-colors">
                        <svg class="w-4 h-4 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.662-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                        <span>واتساپ</span>
                    </a>
                </div>
                <!-- 4 Navigation Links -->
                <a href="/" class="flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors text-sm" onclick="document.getElementById('mobile-menu').classList.add('hidden')">
                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                    <span>خانه</span>
                </a>
                <button type="button" onclick="document.getElementById('mobile-menu').classList.add('hidden'); if(typeof openRequestModal === 'function') openRequestModal(); else window.location.href='/#services';" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-white bg-[#8B1C31] hover:bg-[#701627] transition-colors text-sm shadow-sm">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    <span>ثبت درخواست</span>
                </button>
                <a href="/track" class="flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors text-sm" onclick="document.getElementById('mobile-menu').classList.add('hidden')">
                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                    <span>پیگیری درخواست‌ها</span>
                </a>
                <a href="/track" class="flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors text-sm" onclick="document.getElementById('mobile-menu').classList.add('hidden')">
                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    <span>پروفایل من</span>
                </a>
            </div>
        </div>
    </header>
`;;;;;

export const footerHTML = `
    
    
    <!-- ================= TESTIMONIALS SLIDER ================= -->
    <section class="py-12 bg-white relative border-t border-slate-100 overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-3xl -z-10 opacity-60"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -z-10 opacity-60"></div>

        <div class="container mx-auto px-4 max-w-7xl">
            <div class="flex items-center justify-center gap-4 mb-10 text-center">
                <h2 class="text-2xl md:text-3xl font-black text-slate-800">چرا مشتریان بهدون را برگزیده اند</h2>
            </div>

            <!-- Slider Container -->
            <div class="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 md:gap-6 pb-6 px-4 md:px-8 -mx-4 md:-mx-8 scroll-pl-4 md:scroll-pl-8">
                
                <div class="snap-center shrink-0 w-[280px] md:w-[320px] bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative flex flex-col">
                    <div class="text-brand-500 mb-4 opacity-10 absolute top-4 left-4">
                        <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                    </div>
                    <div class="flex items-center gap-1 text-yellow-400 mb-4">
                        
<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

                    </div>
                    <p class="text-slate-600 text-sm leading-relaxed mb-6 flex-grow relative z-10">کارشون بسیار دقیق و تمیز بود. نشتی لوله رو با دستگاه تشخیص دادن و بدون خرابی زیاد درستش کردن.</p>
                    <div class="flex items-center gap-3 mt-auto relative z-10 border-t border-slate-100 pt-4">
                        <svg viewBox="0 0 100 100" class="w-11 h-11 shrink-0 rounded-full bg-blue-50 border border-blue-200 shadow-sm" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" fill="#e0f2fe"/>
  <circle cx="50" cy="35" r="15" fill="#3b82f6"/>
  <path d="M20 90 Q 50 50 80 90" stroke="#3b82f6" stroke-width="10" fill="none" stroke-linecap="round"/>
</svg>
                        <div>
                            <h4 class="text-sm font-bold text-slate-800">علی محمدی</h4>
                            <span class="text-xs text-slate-500">تعمیرات لوله‌کشی</span>
                        </div>
                    </div>
                </div>
                
                <div class="snap-center shrink-0 w-[280px] md:w-[320px] bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative flex flex-col">
                    <div class="text-brand-500 mb-4 opacity-10 absolute top-4 left-4">
                        <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                    </div>
                    <div class="flex items-center gap-1 text-yellow-400 mb-4">
                        
<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

                    </div>
                    <p class="text-slate-600 text-sm leading-relaxed mb-6 flex-grow relative z-10">تیم بهدون خیلی سریع برای تعمیر پکیج ما آمدند. برخوردشان عالی بود و مشکل کاملاً برطرف شد.</p>
                    <div class="flex items-center gap-3 mt-auto relative z-10 border-t border-slate-100 pt-4">
                        <svg viewBox="0 0 100 100" class="w-11 h-11 shrink-0 rounded-full bg-pink-50 border border-pink-200 shadow-sm" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" fill="#fce7f3"/>
  <path d="M50 20 A 15 15 0 0 0 35 35 V 50 A 15 15 0 0 0 65 50 V 35 A 15 15 0 0 0 50 20 Z" fill="#ec4899"/>
  <path d="M25 90 Q 50 60 75 90" stroke="#ec4899" stroke-width="10" fill="none" stroke-linecap="round"/>
</svg>
                        <div>
                            <h4 class="text-sm font-bold text-slate-800">مریم رستمی</h4>
                            <span class="text-xs text-slate-500">سرمایش و گرمایش</span>
                        </div>
                    </div>
                </div>
                
                <div class="snap-center shrink-0 w-[280px] md:w-[320px] bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative flex flex-col">
                    <div class="text-brand-500 mb-4 opacity-10 absolute top-4 left-4">
                        <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                    </div>
                    <div class="flex items-center gap-1 text-yellow-400 mb-4">
                        
<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

                    </div>
                    <p class="text-slate-600 text-sm leading-relaxed mb-6 flex-grow relative z-10">برای اتصالی برق تماس گرفتم، در کمتر از یک ساعت رسیدن و مشکل رو با هزینه منصفانه حل کردن.</p>
                    <div class="flex items-center gap-3 mt-auto relative z-10 border-t border-slate-100 pt-4">
                        <svg viewBox="0 0 100 100" class="w-11 h-11 shrink-0 rounded-full bg-blue-50 border border-blue-200 shadow-sm" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" fill="#e0f2fe"/>
  <circle cx="50" cy="35" r="15" fill="#3b82f6"/>
  <path d="M20 90 Q 50 50 80 90" stroke="#3b82f6" stroke-width="10" fill="none" stroke-linecap="round"/>
</svg>
                        <div>
                            <h4 class="text-sm font-bold text-slate-800">سعید کریمی</h4>
                            <span class="text-xs text-slate-500">برقکاری ساختمان</span>
                        </div>
                    </div>
                </div>
                
                <div class="snap-center shrink-0 w-[280px] md:w-[320px] bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative flex flex-col">
                    <div class="text-brand-500 mb-4 opacity-10 absolute top-4 left-4">
                        <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                    </div>
                    <div class="flex items-center gap-1 text-yellow-400 mb-4">
                        
<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

                    </div>
                    <p class="text-slate-600 text-sm leading-relaxed mb-6 flex-grow relative z-10">بازسازی سرویس بهداشتی رو بهشون سپردیم. هم مصالح خوبی استفاده کردن و هم سر وقت تحویل دادن.</p>
                    <div class="flex items-center gap-3 mt-auto relative z-10 border-t border-slate-100 pt-4">
                        <svg viewBox="0 0 100 100" class="w-11 h-11 shrink-0 rounded-full bg-pink-50 border border-pink-200 shadow-sm" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" fill="#fce7f3"/>
  <path d="M50 20 A 15 15 0 0 0 35 35 V 50 A 15 15 0 0 0 65 50 V 35 A 15 15 0 0 0 50 20 Z" fill="#ec4899"/>
  <path d="M25 90 Q 50 60 75 90" stroke="#ec4899" stroke-width="10" fill="none" stroke-linecap="round"/>
</svg>
                        <div>
                            <h4 class="text-sm font-bold text-slate-800">فاطمه سعیدی</h4>
                            <span class="text-xs text-slate-500">بازسازی خانه</span>
                        </div>
                    </div>
                </div>
                
                <div class="snap-center shrink-0 w-[280px] md:w-[320px] bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative flex flex-col">
                    <div class="text-brand-500 mb-4 opacity-10 absolute top-4 left-4">
                        <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                    </div>
                    <div class="flex items-center gap-1 text-yellow-400 mb-4">
                        
<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

                    </div>
                    <p class="text-slate-600 text-sm leading-relaxed mb-6 flex-grow relative z-10">کولر گازی ما مشکل خنک‌کنندگی داشت، سرویس‌کارشون با حوصله گاز کولر رو شارژ کرد و الان عالیه.</p>
                    <div class="flex items-center gap-3 mt-auto relative z-10 border-t border-slate-100 pt-4">
                        <svg viewBox="0 0 100 100" class="w-11 h-11 shrink-0 rounded-full bg-blue-50 border border-blue-200 shadow-sm" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" fill="#e0f2fe"/>
  <circle cx="50" cy="35" r="15" fill="#3b82f6"/>
  <path d="M20 90 Q 50 50 80 90" stroke="#3b82f6" stroke-width="10" fill="none" stroke-linecap="round"/>
</svg>
                        <div>
                            <h4 class="text-sm font-bold text-slate-800">رضا ناصری</h4>
                            <span class="text-xs text-slate-500">نصب و تعمیر کولر</span>
                        </div>
                    </div>
                </div>
                
                <div class="snap-center shrink-0 w-[280px] md:w-[320px] bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative flex flex-col">
                    <div class="text-brand-500 mb-4 opacity-10 absolute top-4 left-4">
                        <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                    </div>
                    <div class="flex items-center gap-1 text-yellow-400 mb-4">
                        
<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

                    </div>
                    <p class="text-slate-600 text-sm leading-relaxed mb-6 flex-grow relative z-10">پشتیبانی عالی داشتن و بعد از کار هم پیگیر بودن که مشکلی نداشته باشیم. واقعا راضیم.</p>
                    <div class="flex items-center gap-3 mt-auto relative z-10 border-t border-slate-100 pt-4">
                        <svg viewBox="0 0 100 100" class="w-11 h-11 shrink-0 rounded-full bg-pink-50 border border-pink-200 shadow-sm" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" fill="#fce7f3"/>
  <path d="M50 20 A 15 15 0 0 0 35 35 V 50 A 15 15 0 0 0 65 50 V 35 A 15 15 0 0 0 50 20 Z" fill="#ec4899"/>
  <path d="M25 90 Q 50 60 75 90" stroke="#ec4899" stroke-width="10" fill="none" stroke-linecap="round"/>
</svg>
                        <div>
                            <h4 class="text-sm font-bold text-slate-800">زهرا توکلی</h4>
                            <span class="text-xs text-slate-500">تعمیرات تاسیسات</span>
                        </div>
                    </div>
                </div>
                
                <div class="snap-center shrink-0 w-[280px] md:w-[320px] bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative flex flex-col">
                    <div class="text-brand-500 mb-4 opacity-10 absolute top-4 left-4">
                        <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                    </div>
                    <div class="flex items-center gap-1 text-yellow-400 mb-4">
                        
<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

                    </div>
                    <p class="text-slate-600 text-sm leading-relaxed mb-6 flex-grow relative z-10">نصف شب لوله آشپزخونه گرفته بود، تماس گرفتیم و فوراً یک متخصص فرستادن. دستشون درد نکنه.</p>
                    <div class="flex items-center gap-3 mt-auto relative z-10 border-t border-slate-100 pt-4">
                        <svg viewBox="0 0 100 100" class="w-11 h-11 shrink-0 rounded-full bg-blue-50 border border-blue-200 shadow-sm" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" fill="#e0f2fe"/>
  <circle cx="50" cy="35" r="15" fill="#3b82f6"/>
  <path d="M20 90 Q 50 50 80 90" stroke="#3b82f6" stroke-width="10" fill="none" stroke-linecap="round"/>
</svg>
                        <div>
                            <h4 class="text-sm font-bold text-slate-800">محمد حسینی</h4>
                            <span class="text-xs text-slate-500">لوله بازکنی</span>
                        </div>
                    </div>
                </div>
                
                <div class="snap-center shrink-0 w-[280px] md:w-[320px] bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative flex flex-col">
                    <div class="text-brand-500 mb-4 opacity-10 absolute top-4 left-4">
                        <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                    </div>
                    <div class="flex items-center gap-1 text-yellow-400 mb-4">
                        
<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

                    </div>
                    <p class="text-slate-600 text-sm leading-relaxed mb-6 flex-grow relative z-10">کل سیم‌کشی واحد ما رو تعویض کردن. کارشون حرفه‌ای بود و قیمت‌هاشون هم نسبت به بقیه منصفانه بود.</p>
                    <div class="flex items-center gap-3 mt-auto relative z-10 border-t border-slate-100 pt-4">
                        <svg viewBox="0 0 100 100" class="w-11 h-11 shrink-0 rounded-full bg-blue-50 border border-blue-200 shadow-sm" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" fill="#e0f2fe"/>
  <circle cx="50" cy="35" r="15" fill="#3b82f6"/>
  <path d="M20 90 Q 50 50 80 90" stroke="#3b82f6" stroke-width="10" fill="none" stroke-linecap="round"/>
</svg>
                        <div>
                            <h4 class="text-sm font-bold text-slate-800">امیر جلالی</h4>
                            <span class="text-xs text-slate-500">سیم‌کشی و برق</span>
                        </div>
                    </div>
                </div>
                
            </div>
            
            <div class="mt-4 flex justify-center gap-2 md:hidden">
                <span class="text-xs text-slate-400 flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    برای دیدن نظرات بیشتر بکشید
                </span>
            </div>
        </div>
    </section>

    <!-- ================= UNIFIED ISLAND FOOTER ================= -->
    <footer class="bg-slate-50 py-12 md:py-16 border-t border-slate-200">
        <div class="container mx-auto px-4 max-w-6xl">
            <!-- MAIN ISLAND CARD -->
            <div class="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 md:p-10 lg:p-12">
                
                <!-- ROW 1: Main Links -->
                <div class="flex flex-wrap justify-center gap-6 md:gap-10 mb-8 text-slate-700 font-bold text-sm md:text-base">
                    <a href="/" class="hover:text-brand-600 transition-colors flex items-center gap-1.5 group">
                        <svg class="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        صفحه اصلی
                    </a>
                    <a href="/services/hvac" class="hover:text-brand-600 transition-colors flex items-center gap-1.5 group">
                        <svg class="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        خدمات
                    </a>
                    <a href="/magazine" class="hover:text-brand-600 transition-colors flex items-center gap-1.5 group">
                        <svg class="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                        دانشنامه
                    </a>
                    <a href="/#about" class="hover:text-brand-600 transition-colors flex items-center gap-1.5 group">
                        <svg class="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        درباره ما
                    </a>
                    <a href="tel:09333256885" class="hover:text-brand-600 transition-colors flex items-center gap-1.5 group">
                        <svg class="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        تماس با ما
                    </a>
                </div>

                <hr class="border-slate-100 mb-8">

                <!-- ROW 2: Contact Info -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10 w-full max-w-4xl mx-auto">
                    <!-- Phone -->
                    <a href="tel:09333256885" class="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center gap-4 hover:border-brand-300 hover:shadow-md transition-all group">
                        <div class="w-14 h-14 shrink-0 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 group-hover:bg-brand-500 group-hover:text-white transition-all">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs text-slate-500 mb-0.5">تماس تلفنی</span>
                            <span class="font-black text-lg text-slate-800 dir-ltr group-hover:text-brand-600 transition-colors">0933 325 6885</span>
                        </div>
                    </a>
                    
                    <!-- WhatsApp -->
                    <a href="https://wa.me/989333256885" target="_blank" rel="noopener noreferrer" class="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center gap-4 hover:border-green-300 hover:shadow-md transition-all group">
                        <div class="w-14 h-14 shrink-0 rounded-xl bg-green-100 flex items-center justify-center text-green-600 group-hover:bg-green-500 group-hover:text-white transition-all">
                            <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.662-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs text-slate-500 mb-0.5">پشتیبانی آنلاین</span>
                            <span class="font-bold text-base text-slate-800 group-hover:text-green-600 transition-colors">ارتباط در واتساپ</span>
                        </div>
                    </a>
                    
                    <!-- Instagram -->
                    <a href="https://instagram.com/behdoon.ir" target="_blank" rel="noopener noreferrer" class="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center gap-4 hover:border-pink-300 hover:shadow-md transition-all group">
                        <div class="w-14 h-14 shrink-0 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 group-hover:bg-gradient-to-tr group-hover:from-yellow-400 group-hover:via-pink-500 group-hover:to-purple-600 group-hover:text-white transition-all">
                            <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs text-slate-500 mb-0.5">پیج اینستاگرام</span>
                            <span class="font-bold text-base text-slate-800 group-hover:text-pink-600 transition-colors dir-ltr text-left">behdoon.ir</span>
                        </div>
                    </a>
                </div>

                <!-- ROW 3: SEO Intro -->
                <div class="bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-8 text-slate-600 text-sm md:text-base leading-loose">
                    <h2 class="text-lg font-black text-slate-800 mb-4">بهدون؛ خدمات حرفه‌ای ساختمان در تهران</h2>
                    <p class="mb-4">بهدون ارائه‌دهنده خدمات فنی و ساختمانی در تهران است و با هدف ساده‌تر کردن دسترسی به خدمات تخصصی ساختمان فعالیت می‌کند.</p>
                    <p class="mb-4">خدمات بهدون بخش‌های مختلفی از نیازهای ساختمان را پوشش می‌دهد؛ از جمله <a href="/services/hvac" class="text-brand-600 hover:underline">تأسیسات ساختمان</a>، لوله‌کشی آب و فاضلاب، رفع نشتی، نشت‌یابی، رفع نم و رطوبت، تعمیرات سیستم‌های گرمایشی و سرمایشی، <a href="/services/electrical" class="text-brand-600 hover:underline">برق‌کشی و روشنایی</a>، <a href="/services/renovation" class="text-brand-600 hover:underline">بازسازی و دکوراسیون</a> و <a href="/services/plumbing" class="text-brand-600 hover:underline">خدمات بنایی و عمرانی</a>.</p>
                    <p class="mb-4">هدف بهدون این است که فرایند پیدا کردن و دریافت خدمات فنی ساختمان برای ساکنان تهران ساده‌تر و منظم‌تر باشد. کاربران می‌توانند متناسب با نیاز خود، خدمت موردنظرشان را پیدا کرده و برای بررسی و اجرای آن درخواست ثبت کنند.</p>
                    <p class="mb-4">خدمات فنی ساختمان بسته به نوع بنا و مشکل موجود می‌تواند شامل تعمیرات تأسیسات، رفع نشتی و مشکلات رطوبتی، برق‌کاری و عیب‌یابی، بازسازی و نوسازی، یا خدمات بنایی و عمرانی باشد. در بسیاری از موارد، بررسی اولیه و تشخیص صحیح مشکل می‌تواند از آسیب بیشتر و هزینه‌های اضافی جلوگیری کند.</p>
                    <p>بهدون خدمات خود را در مناطق مختلف تهران ارائه می‌دهد و تلاش می‌کند تجربه‌ای ساده، منظم و قابل اعتماد برای دسترسی به خدمات تخصصی ساختمان ایجاد کند.</p>
                </div>

                

            </div>
        </div>
        
        <!-- Mobile Bottom Spacing for fixed CTAs if any -->
        <div class="h-24 md:hidden"></div>
    </footer>
<!-- Mobile Bottom Navigation (Visible only on md and smaller) -->
    <nav class="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] z-50 flex items-center justify-around px-2 py-2 pb-[env(safe-area-inset-bottom,8px)]">
        <a href="/" id="bn-home" class="flex flex-col items-center gap-1 text-slate-500 hover:text-brand-600 transition-colors py-1 px-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span class="text-[11px] font-bold">خانه</span>
        </a>
        <button type="button" onclick="if(typeof openRequestModal === 'function') openRequestModal(); else window.location.href='/#services';" id="bn-request" class="flex flex-col items-center gap-1 text-[#8B1C31] hover:text-[#701627] transition-colors py-1 px-2">
            <div class="w-8 h-8 rounded-full bg-[#8B1C31] text-white flex items-center justify-center -mt-3 shadow-md shadow-[#8B1C31]/30">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            </div>
            <span class="text-[11px] font-bold text-[#8B1C31]">ثبت درخواست</span>
        </button>
        <a href="/track" id="bn-track" class="flex flex-col items-center gap-1 text-slate-500 hover:text-brand-600 transition-colors py-1 px-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
            <span class="text-[11px] font-bold">پیگیری</span>
        </a>
        <a href="/track" id="bn-profile" class="flex flex-col items-center gap-1 text-slate-500 hover:text-brand-600 transition-colors py-1 px-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            <span class="text-[11px] font-bold">پروفایل من</span>
        </a>
    </nav>
    
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const path = window.location.pathname;
            const setBtn = (id) => {
                const el = document.getElementById(id);
                if(el) {
                    el.classList.remove('text-slate-500');
                    el.classList.add('text-[#8B1C31]');
                }
            };
            if(path === '/') setBtn('bn-home');
            else if(path.startsWith('/track')) setBtn('bn-track');
            else if(path.startsWith('/magazine')) setBtn('bn-mag');
        });
    </script>
`;;;;;

export const html = `<!DOCTYPE html>
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
                400: '#6992b1',
                500: '#133458', 
                600: '#0e2744',
                700: '#0a1d33',
                800: '#071626',
                900: '#040d18'
              }
            },
            boxShadow: {
              'card': '0 8px 30px rgba(0,0,0,0.06)', 
              'card-hover': '0 15px 40px rgba(0,0,0,0.12)',
            },
            animation: {
              'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
              float: {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-10px)' },
              }
            }
          }
        }
      }
    </script>

    <style>
        body { 
            font-family: 'Vazirmatn', sans-serif; 
            -webkit-font-smoothing: antialiased; 
            background-color: #f8fafc;
        }
        html { scroll-behavior: smooth; }
        
        @keyframes heartbeat {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
            14% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
            28% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
            42% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
            70% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .animate-heartbeat { animation: heartbeat 2.5s infinite cubic-bezier(0.215, 0.610, 0.355, 1); }
        
        .mobile-cta {
            position: fixed; bottom: 0; left: 0; right: 0;
            background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(12px);
            padding: 12px; z-index: 999; display: flex; gap: 10px;
            box-shadow: 0 -10px 40px rgba(0,0,0,0.08); 
            border-top-left-radius: 24px; border-top-right-radius: 24px;
            border-top: 1px solid #e2e8f0;
        }
        @media(min-width: 768px) { .mobile-cta { display: none !important; } }
        
        .whatsapp-float {
            position: fixed; bottom: 30px; right: 30px;
            background-color: #25D366; color: #FFF;
            border-radius: 50px; padding: 14px 24px;
            box-shadow: 0px 10px 30px rgba(37, 211, 102, 0.3);
            z-index: 100; display: flex; align-items: center; gap: 10px; font-weight: bold;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @media(max-width: 767px) { .whatsapp-float { display: none; } }
        .whatsapp-float:hover { background-color: #1ea952; transform: translateY(-5px); box-shadow: 0px 15px 35px rgba(37, 211, 102, 0.4); }

        .glass-panel {
            background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); 
        }
    </style>
</head>
<body class="text-slate-700 pb-[100px] md:pb-0 pt-20">

    <!-- ================= HEADER (Compact & Centered) ================= -->
    <!-- ================= HEADER WRAPPER ================= -->
    <div class="fixed top-3 left-1/2 -translate-x-1/2 w-[calc(100%-1rem)] max-w-6xl z-50 flex items-center justify-between md:justify-center md:gap-4 pointer-events-none">
        
        <!-- MAIN ISLAND -->
        <header class="pointer-events-auto w-full md:w-auto glass-panel shadow-md rounded-full transition-all border border-slate-200">
            <div class="px-4 md:px-5 py-2 flex items-center justify-between md:justify-center md:gap-8 relative">
                
                <a href="/" onclick="window.location.href='/'; return false;" class="flex items-center gap-3 cursor-pointer">
                    <div class="bg-brand-500 text-white p-2 rounded-full shadow-md">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    </div>
                    <div class="flex items-center gap-2 pr-1">
                        <span class="text-xl font-black text-brand-500 tracking-tight leading-none">بهدون</span>
                        <span class="text-slate-300 text-xs">|</span>
                        <span class="text-[10px] md:text-[11px] text-slate-500 font-medium whitespace-nowrap">خدمات حرفه‌ای ساختمان در تهران</span>
                    </div>
                </a>
                
                <nav class="hidden md:flex items-center gap-6 lg:gap-8 font-bold text-slate-600 text-sm">
                    <a href="#services" class="hover:text-brand-500 transition-colors">انواع خدمات</a>
                    <a href="#magazine" class="hover:text-brand-500 transition-colors">مجله آموزشی</a>
                    <a href="#about-us" class="hover:text-brand-500 transition-colors">درباره ما</a>
                </nav>

                <div class="hidden md:flex items-center gap-2 lg:gap-3">
                    <a href="/#services" class="flex items-center gap-2 bg-[#8B1C31] text-white px-4 lg:px-5 py-2.5 rounded-full font-bold hover:bg-[#701627] shadow-md shadow-[#8B1C31]/20 transition-colors text-sm border border-[#701627]">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        ثبت درخواست
                    </a>
                    
                    <a href="#" class="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-500 rounded-full hover:bg-brand-50 hover:text-brand-600 border border-slate-200 transition-colors shadow-sm ml-2" title="پروفایل کاربری">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </a>
                </div>

                <!-- Mobile Hamburger -->
                <button class="md:hidden p-2 text-brand-500 bg-brand-50 rounded-full" onclick="document.getElementById('mobile-menu').classList.toggle('hidden')">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>

                <!-- Mobile Menu Dropdown -->
                <div id="mobile-menu" class="hidden absolute top-[120%] left-0 w-full bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col overflow-hidden p-4 space-y-2.5 z-50">
                <!-- Contact Buttons (Top) -->
                <div class="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
                    <a href="tel:02122345678" class="flex items-center justify-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 py-2.5 px-3 rounded-xl font-bold text-xs hover:bg-emerald-100 transition-colors">
                        <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
                        <span dir="ltr">021-22345678</span>
                    </a>
                    <a href="https://wa.me/989333256885" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-1.5 bg-green-50 border border-green-200 text-green-700 py-2.5 px-3 rounded-xl font-bold text-xs hover:bg-green-100 transition-colors">
                        <svg class="w-4 h-4 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.662-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                        <span>واتساپ</span>
                    </a>
                </div>
                <!-- 4 Navigation Links -->
                <a href="/" class="flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors text-sm" onclick="document.getElementById('mobile-menu').classList.add('hidden')">
                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                    <span>خانه</span>
                </a>
                <button type="button" onclick="document.getElementById('mobile-menu').classList.add('hidden'); if(typeof openRequestModal === 'function') openRequestModal(); else window.location.href='/#services';" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-white bg-[#8B1C31] hover:bg-[#701627] transition-colors text-sm shadow-sm">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    <span>ثبت درخواست</span>
                </button>
                <a href="/track" class="flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors text-sm" onclick="document.getElementById('mobile-menu').classList.add('hidden')">
                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                    <span>پیگیری درخواست‌ها</span>
                </a>
                <a href="/track" class="flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors text-sm" onclick="document.getElementById('mobile-menu').classList.add('hidden')">
                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    <span>پروفایل من</span>
                </a>
            </div>
            </div>
        </header>

        <!-- PHONE ISLAND (Desktop only) -->
        <a href="tel:${PHONE}" class="hidden md:flex pointer-events-auto items-center gap-2 bg-success-600 text-white px-5 lg:px-6 py-2.5 rounded-full font-bold shadow-md shadow-success-600/30 animate-heartbeat hover:bg-success-700 transition-all border border-success-500 text-sm shrink-0">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
            <span dir="ltr">${PHONE_DISPLAY}</span>
        </a>
    </div>

    <!-- ================= HERO SECTION (Clear & Legible) ================= -->
    <main>
        <section class="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 pb-8 pt-8 overflow-hidden">
            <div class="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-brand-100/40 blur-[80px] -z-10 animate-float"></div>
            
            <div class="container mx-auto px-4 text-center z-10 relative">
                

                <!-- CATEGORIES GRID UNDER HERO -->
                <div class="mt-8 relative max-w-7xl mx-auto px-4 md:px-6 z-10" id="services">
                    <!-- Frosted Glass Container -->
                    <div class="bg-purple-500/5 backdrop-blur-md border border-purple-200/50 rounded-[2.5rem] p-6 md:p-10 shadow-[0_8px_32px_rgba(168,85,247,0.06)] relative overflow-hidden">
                        <!-- Decorative glow inside the box -->
                        <div class="absolute top-0 right-0 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
                        <div class="absolute bottom-0 left-0 w-64 h-64 bg-brand-400/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

                        <!-- Title -->
                        <div class="flex items-center justify-center gap-4 mb-8">
                            <div class="h-[2px] bg-gradient-to-r from-transparent to-purple-400 w-12 md:w-24 rounded-full"></div>
                            <h1 class="text-xl md:text-3xl font-black text-slate-800">خدمات بهدون</h1>
                            <div class="h-[2px] bg-gradient-to-l from-transparent to-purple-400 w-12 md:w-24 rounded-full"></div>
                        </div>

                        <!-- Grid -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto relative z-10">
                        <!-- Card 1: HVAC -->
                        <a href="/services/hvac" class="group block relative bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-xl hover:border-brand-100 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                            <div class="absolute inset-0 bg-gradient-to-br from-brand-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div class="relative z-10">
                                <div class="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 transition-transform">
                                    <!-- Snowflake/Flame -->
                                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 17.25v2.25a2.25 2.25 0 01-2.25 2.25H6.75a2.25 2.25 0 01-2.25-2.25v-2.25m15 0v-5.25a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v5.25m15 0h-15M12 12.75v-3.75m0 0c0-1.243-.63-2.39-1.593-3.068a3.745 3.745 0 01-1.043-3.296m2.636 6.364c1.243 0 2.39-.63 3.068-1.593a3.746 3.746 0 003.296-1.043"></path></svg>
                                </div>
                                <h3 class="text-xl font-bold text-slate-800 mb-3 group-hover:text-brand-600 transition-colors">سرمایش و گرمایش</h3>
                                <p class="text-sm text-slate-500 mb-6 line-clamp-2">تعمیر، سرویس و راه‌اندازی کولر آبی، گازی، پکیج و موتورخانه.</p>
                                <div class="flex items-center text-[#8B1C31] text-sm font-bold">
                                    ثبت درخواست
                                    <svg class="w-4 h-4 mr-2 group-hover:-translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                </div>
                            </div>
                        </a>

                        <!-- Card 2: Plumbing -->
                        <a href="/services/plumbing" class="group block relative bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-xl hover:border-brand-100 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                            <div class="absolute inset-0 bg-gradient-to-br from-brand-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div class="relative z-10">
                                <div class="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 transition-transform">
                                    <!-- Wrench -->
                                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"></path></svg>
                                </div>
                                <h3 class="text-xl font-bold text-slate-800 mb-3 group-hover:text-brand-600 transition-colors">لوله کشی</h3>
                                <p class="text-sm text-slate-500 mb-6 line-clamp-2">اجرای لوله‌کشی آب و فاضلاب، نشت‌یابی با دستگاه و رفع نم.</p>
                                <div class="flex items-center text-[#8B1C31] text-sm font-bold">
                                    ثبت درخواست
                                    <svg class="w-4 h-4 mr-2 group-hover:-translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                </div>
                            </div>
                        </a>

                        <!-- Card 3: Electrical -->
                        <a href="/services/electrical" class="group block relative bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-xl hover:border-brand-100 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                            <div class="absolute inset-0 bg-gradient-to-br from-brand-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div class="relative z-10">
                                <div class="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 transition-transform">
                                    <!-- Lightning/Bolt -->
                                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"></path></svg>
                                </div>
                                <h3 class="text-xl font-bold text-slate-800 mb-3 group-hover:text-brand-600 transition-colors">برقکاری</h3>
                                <p class="text-sm text-slate-500 mb-6 line-clamp-2">سیم‌کشی کامل، رفع اتصالی، نصب کلید و پریز و طراحی نورپردازی.</p>
                                <div class="flex items-center text-[#8B1C31] text-sm font-bold">
                                    ثبت درخواست
                                    <svg class="w-4 h-4 mr-2 group-hover:-translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                </div>
                            </div>
                        </a>

                        <!-- Card 4: Renovation -->
                        <a href="/services/renovation" class="group block relative bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-xl hover:border-brand-100 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                            <div class="absolute inset-0 bg-gradient-to-br from-brand-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div class="relative z-10">
                                <div class="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 transition-transform">
                                    <!-- Roller Brush -->
                                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.879-3.879a3 3 0 10-4.242-4.242l-3.879 3.879a15.995 15.995 0 00-4.648 4.764M12 12l5.25-5.25"></path></svg>
                                </div>
                                <h3 class="text-xl font-bold text-slate-800 mb-3 group-hover:text-brand-600 transition-colors">تعمیرات و بازسازی ساختمان</h3>
                                <p class="text-sm text-slate-500 mb-6 line-clamp-2">تخریب، دیوارکشی، نقاشی، کاشی‌کاری و نوسازی کامل فضاهای داخلی.</p>
                                <div class="flex items-center text-[#8B1C31] text-sm font-bold">
                                    ثبت درخواست
                                    <svg class="w-4 h-4 mr-2 group-hover:-translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </section>


        <!-- ================= FEATURES (No White Box) ================= -->
        <section class="py-8 md:py-12 relative overflow-hidden bg-slate-50 z-20">
            <!-- Decorative Background Blob -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[800px] h-[300px] bg-purple-500/10 blur-[80px] rounded-full -z-10"></div>
            
            <div class="container mx-auto px-4">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
                    
                    <div class="flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300 group">
                        <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
                        </div>
                        <h4 class="text-[14px] md:text-base font-black text-purple-950">خدمات حرفه‌ای</h4>
                    </div>

                    <div class="flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300 group">
                        <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        </div>
                        <h4 class="text-[14px] md:text-base font-black text-purple-950">نیروی متخصص و ماهر</h4>
                    </div>

                    <div class="flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300 group">
                        <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h4 class="text-[14px] md:text-base font-black text-purple-950">قیمت منصفانه</h4>
                    </div>

                    <div class="flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300 group">
                        <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        </div>
                        <h4 class="text-[14px] md:text-base font-black text-purple-950">شفافیت و تعهد بالا</h4>
                    </div>

                </div>
            </div>
        </section>

        <!-- ================= MAGAZINE ================= -->
        <section id="magazine" class="py-10 bg-slate-50 border-t border-slate-200">
            <div class="container mx-auto px-4 max-w-7xl">
                <div class="flex flex-col mb-10 text-center items-center">
                    <span class="text-purple-600 font-bold bg-purple-50 border border-purple-100 px-3 py-1 rounded-full text-xs mb-3 inline-block">آموزش و مقالات</span>
                    <h2 class="text-2xl md:text-3xl font-black text-brand-500 mt-2">دانشنامه</h2>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <article class="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow border border-slate-200 p-2 flex flex-col">
                        <div class="h-48 rounded-[1.5rem] overflow-hidden bg-[url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center"></div>
                        <div class="p-5 flex-1 flex flex-col">
                            <div class="text-xs font-bold text-brand-500 mb-2">معماری و ساخت</div>
                            <h3 class="text-lg font-bold text-brand-500 mb-2 hover:text-brand-400 transition-colors cursor-pointer leading-relaxed">خدمات تخریب و بازسازی</h3>
                            <p class="text-slate-600 text-sm leading-relaxed mt-auto">تخریب اصولی و بازسازی صفر تا صد منازل با رعایت استانداردهای مهندسی، طراحی نقشه جدید و نوسازی با بهترین متریال.</p>
                        </div>
                    </article>
                    <article class="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow border border-slate-200 p-2 flex flex-col">
                        <div class="h-48 rounded-[1.5rem] overflow-hidden bg-[url('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center"></div>
                        <div class="p-5 flex-1 flex flex-col">
                            <div class="text-xs font-bold text-brand-500 mb-2">نقاشی ساختمان</div>
                            <h3 class="text-lg font-bold text-brand-500 mb-2 hover:text-brand-400 transition-colors cursor-pointer leading-relaxed">رنگ کاری و لکه گیری</h3>
                            <p class="text-slate-600 text-sm leading-relaxed mt-auto">اجرای انواع نقاشی ساختمان، رفع زردی و لکه‌های نم دیوار و سقف پس از تعمیرات تاسیساتی، با رنگ‌های باکیفیت و ماندگار.</p>
                        </div>
                    </article>
                    <article class="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow border border-slate-200 p-2 flex flex-col">
                        <div class="h-48 rounded-[1.5rem] overflow-hidden bg-[url('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center"></div>
                        <div class="p-5 flex-1 flex flex-col">
                            <div class="text-xs font-bold text-brand-500 mb-2">نصب و تعمیر</div>
                            <h3 class="text-lg font-bold text-brand-500 mb-2 hover:text-brand-400 transition-colors cursor-pointer leading-relaxed">تعمیر و تعویض شیرآلات</h3>
                            <p class="text-slate-600 text-sm leading-relaxed mt-auto">نصب، تعمیر و تعویض انواع شیرآلات توکار و روکار، رفع نشتی و چکه آب، رسوب‌گیری و تعویض کارتریج شیرآلات اهرمی.</p>
                        </div>
                    </article>
                </div>
                <div class="mt-10 flex justify-center">
                    <a href="/magazine" class="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors text-sm shadow-md hover:shadow-lg">
                        مشاهده دانشنامه
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </a>
                </div>
            </div>
        </section>
    </main>\n



    <!-- General FAQ Section -->
    <div class="py-20 bg-white border-t border-slate-100 relative" id="faq">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNlMmU4ZjAiLz48L3N2Zz4=')] opacity-30"></div>
        <div class="container mx-auto px-4 max-w-4xl relative z-10">
            <div class="text-center mb-12">
                <h2 class="text-2xl md:text-3xl font-black text-slate-800 mb-4 tracking-tight">سؤالات متداول شما</h2>
                <p class="text-slate-500 text-sm">پاسخ به پرتکرارترین پرسش‌ها درباره نحوه ارائه خدمات بهدون</p>
            </div>
            
            <div class="space-y-4">
                
                <details class="group bg-slate-50 border border-slate-200 rounded-2xl shadow-sm hover:border-brand-300 transition-colors [&_summary::-webkit-details-marker]:hidden">
                    <summary class="flex cursor-pointer items-center justify-between gap-1.5 p-5 md:p-6 text-slate-800 font-bold select-none">
                        <h3 class="text-[15px] md:text-base">محدوده خدمت‌رسانی بهدون کجاست؟</h3>
                        <span class="relative size-5 shrink-0 text-brand-500">
                            <svg class="absolute inset-0 size-5 opacity-100 group-open:opacity-0 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path></svg>
                            <svg class="absolute inset-0 size-5 opacity-0 group-open:opacity-100 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15"></path></svg>
                        </span>
                    </summary>
                    <div class="px-5 md:px-6 pb-6 text-slate-600 leading-loose text-[14px]">
                        <p>خدمات بهدون در حال حاضر تمامی مناطق شمال، جنوب، شرق، غرب و مرکز تهران را پوشش می‌دهد. پس از ثبت درخواست، تکنسین‌های ما از نزدیک‌ترین پایگاه به محل شما اعزام می‌شوند.</p>
                    </div>
                </details>

                <details class="group bg-slate-50 border border-slate-200 rounded-2xl shadow-sm hover:border-brand-300 transition-colors [&_summary::-webkit-details-marker]:hidden">
                    <summary class="flex cursor-pointer items-center justify-between gap-1.5 p-5 md:p-6 text-slate-800 font-bold select-none">
                        <h3 class="text-[15px] md:text-base">آیا خدمات فنی و تعمیرات بهدون ضمانت دارد؟</h3>
                        <span class="relative size-5 shrink-0 text-brand-500">
                            <svg class="absolute inset-0 size-5 opacity-100 group-open:opacity-0 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path></svg>
                            <svg class="absolute inset-0 size-5 opacity-0 group-open:opacity-100 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15"></path></svg>
                        </span>
                    </summary>
                    <div class="px-5 md:px-6 pb-6 text-slate-600 leading-loose text-[14px]">
                        <p>بله، شفافیت و کیفیت اصول اولیه ماست. تمامی خدمات ارائه شده توسط تکنسین‌های بهدون، چه در بخش تأسیسات و برق و چه در بازسازی، پس از انجام کار تست شده و با فاکتور رسمی و ضمانت کیفیت به شما تحویل داده می‌شود.</p>
                    </div>
                </details>

                <details class="group bg-slate-50 border border-slate-200 rounded-2xl shadow-sm hover:border-brand-300 transition-colors [&_summary::-webkit-details-marker]:hidden">
                    <summary class="flex cursor-pointer items-center justify-between gap-1.5 p-5 md:p-6 text-slate-800 font-bold select-none">
                        <h3 class="text-[15px] md:text-base">هزینه خدمات چگونه محاسبه می‌شود؟</h3>
                        <span class="relative size-5 shrink-0 text-brand-500">
                            <svg class="absolute inset-0 size-5 opacity-100 group-open:opacity-0 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path></svg>
                            <svg class="absolute inset-0 size-5 opacity-0 group-open:opacity-100 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15"></path></svg>
                        </span>
                    </summary>
                    <div class="px-5 md:px-6 pb-6 text-slate-600 leading-loose text-[14px]">
                        <p>هزینه‌ها در بهدون کاملاً شفاف و منصفانه محاسبه می‌شود. پیش از شروع هرگونه تعمیرات، تکنسین بررسی اولیه را انجام داده و برآورد دقیقی از هزینه‌ها (شامل دستمزد و قطعات در صورت نیاز) را به شما اعلام می‌کند.</p>
                    </div>
                </details>

                <details class="group bg-slate-50 border border-slate-200 rounded-2xl shadow-sm hover:border-brand-300 transition-colors [&_summary::-webkit-details-marker]:hidden">
                    <summary class="flex cursor-pointer items-center justify-between gap-1.5 p-5 md:p-6 text-slate-800 font-bold select-none">
                        <h3 class="text-[15px] md:text-base">ساعات کاری و پاسخگویی بهدون به چه صورت است؟</h3>
                        <span class="relative size-5 shrink-0 text-brand-500">
                            <svg class="absolute inset-0 size-5 opacity-100 group-open:opacity-0 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path></svg>
                            <svg class="absolute inset-0 size-5 opacity-0 group-open:opacity-100 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15"></path></svg>
                        </span>
                    </summary>
                    <div class="px-5 md:px-6 pb-6 text-slate-600 leading-loose text-[14px]">
                        <p>تیم پشتیبانی ما همه روزه آماده پاسخگویی به شماست. در موارد اورژانسی مانند ترکیدگی لوله، نشتی شدید یا اتصالی برق، تلاش می‌کنیم اعزام تکنسین در سریع‌ترین زمان ممکن انجام شود.</p>
                    </div>
                </details>

            </div>
        </div>
    </div>


    <!-- Mobile CTA Space Filler -->
    <div class="h-20 md:hidden bg-slate-50"></div>

    
    <!-- ================= ISLAND FOOTER ================= -->
    
    
    <!-- ================= UNIFIED ISLAND FOOTER ================= -->
    <footer class="bg-slate-50 py-12 md:py-16 border-t border-slate-200">
        <div class="container mx-auto px-4 max-w-6xl">
            <!-- MAIN ISLAND CARD -->
            <div class="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 md:p-10 lg:p-12">
                
                <!-- ROW 1: Main Links -->
                <div class="flex flex-wrap justify-center gap-6 md:gap-10 mb-8 text-slate-700 font-bold text-sm md:text-base">
                    <a href="/" class="hover:text-brand-600 transition-colors flex items-center gap-1.5 group">
                        <svg class="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        صفحه اصلی
                    </a>
                    <a href="/services/hvac" class="hover:text-brand-600 transition-colors flex items-center gap-1.5 group">
                        <svg class="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        خدمات
                    </a>
                    <a href="/magazine" class="hover:text-brand-600 transition-colors flex items-center gap-1.5 group">
                        <svg class="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                        دانشنامه
                    </a>
                    <a href="/#about" class="hover:text-brand-600 transition-colors flex items-center gap-1.5 group">
                        <svg class="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        درباره ما
                    </a>
                    <a href="tel:09333256885" class="hover:text-brand-600 transition-colors flex items-center gap-1.5 group">
                        <svg class="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        تماس با ما
                    </a>
                </div>

                <hr class="border-slate-100 mb-8">

                <!-- ROW 2: Contact Info -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 w-full max-w-6xl mx-auto">
                    <!-- Phone -->
                    <a href="tel:09333256885" class="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center gap-4 hover:border-brand-300 hover:shadow-md transition-all group">
                        <div class="w-14 h-14 shrink-0 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 group-hover:bg-brand-500 group-hover:text-white transition-all">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs text-slate-500 mb-0.5">تماس تلفنی</span>
                            <span class="font-black text-lg text-slate-800 dir-ltr group-hover:text-brand-600 transition-colors">0933 325 6885</span>
                        </div>
                    </a>
                    
                    <!-- WhatsApp -->
                    <a href="https://wa.me/989333256885" target="_blank" rel="noopener noreferrer" class="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center gap-4 hover:border-green-300 hover:shadow-md transition-all group">
                        <div class="w-14 h-14 shrink-0 rounded-xl bg-green-100 flex items-center justify-center text-green-600 group-hover:bg-green-500 group-hover:text-white transition-all">
                            <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.662-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs text-slate-500 mb-0.5">پشتیبانی آنلاین</span>
                            <span class="font-bold text-base text-slate-800 group-hover:text-green-600 transition-colors">ارتباط در واتساپ</span>
                        </div>
                    </a>
                    
                    <!-- Instagram -->
                    <a href="https://instagram.com/behdoon.ir" target="_blank" rel="noopener noreferrer" class="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center gap-4 hover:border-pink-300 hover:shadow-md transition-all group">
                        <div class="w-14 h-14 shrink-0 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 group-hover:bg-gradient-to-tr group-hover:from-yellow-400 group-hover:via-pink-500 group-hover:to-purple-600 group-hover:text-white transition-all">
                            <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs text-slate-500 mb-0.5">پیج اینستاگرام</span>
                            <span class="font-bold text-base text-slate-800 group-hover:text-pink-600 transition-colors dir-ltr text-left">behdoon.ir</span>
                        </div>
                    </a>
                    <!-- Submit Request -->
                    <a href="/#services" class="bg-rose-50 border border-rose-100 rounded-2xl p-5 flex items-center gap-4 hover:border-rose-300 hover:shadow-md transition-all group">
                        <div class="w-14 h-14 shrink-0 rounded-xl bg-white border border-rose-100 flex items-center justify-center text-[#8B1C31] group-hover:scale-110 group-hover:bg-[#8B1C31] group-hover:text-white transition-all">
                            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs text-rose-600/70 mb-0.5">سریع و آسان</span>
                            <span class="font-bold text-base text-[#8B1C31] transition-colors">ثبت درخواست</span>
                        </div>
                    </a>

                </div>

                <!-- ROW 3: SEO Intro -->
                <div class="bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-8 text-slate-600 text-sm md:text-base leading-loose">
                    <h2 class="text-lg font-black text-slate-800 mb-4">بهدون؛ خدمات حرفه‌ای ساختمان در تهران</h2>
                    <p class="mb-4">بهدون ارائه‌دهنده خدمات فنی و ساختمانی در تهران است و با هدف ساده‌تر کردن دسترسی به خدمات تخصصی ساختمان فعالیت می‌کند.</p>
                    <p class="mb-4">خدمات بهدون بخش‌های مختلفی از نیازهای ساختمان را پوشش می‌دهد؛ از جمله <a href="/services/hvac" class="text-brand-600 hover:underline">تأسیسات ساختمان</a>، لوله‌کشی آب و فاضلاب، رفع نشتی، نشت‌یابی، رفع نم و رطوبت، تعمیرات سیستم‌های گرمایشی و سرمایشی، <a href="/services/electrical" class="text-brand-600 hover:underline">برق‌کشی و روشنایی</a>، <a href="/services/renovation" class="text-brand-600 hover:underline">بازسازی و دکوراسیون</a> و <a href="/services/plumbing" class="text-brand-600 hover:underline">خدمات بنایی و عمرانی</a>.</p>
                    <p class="mb-4">هدف بهدون این است که فرایند پیدا کردن و دریافت خدمات فنی ساختمان برای ساکنان تهران ساده‌تر و منظم‌تر باشد. کاربران می‌توانند متناسب با نیاز خود، خدمت موردنظرشان را پیدا کرده و برای بررسی و اجرای آن درخواست ثبت کنند.</p>
                    <p class="mb-4">خدمات فنی ساختمان بسته به نوع بنا و مشکل موجود می‌تواند شامل تعمیرات تأسیسات، رفع نشتی و مشکلات رطوبتی، برق‌کاری و عیب‌یابی، بازسازی و نوسازی، یا خدمات بنایی و عمرانی باشد. در بسیاری از موارد، بررسی اولیه و تشخیص صحیح مشکل می‌تواند از آسیب بیشتر و هزینه‌های اضافی جلوگیری کند.</p>
                    <p>بهدون خدمات خود را در مناطق مختلف تهران ارائه می‌دهد و تلاش می‌کند تجربه‌ای ساده، منظم و قابل اعتماد برای دسترسی به خدمات تخصصی ساختمان ایجاد کند.</p>
                </div>

                

            </div>
        </div>
        
        <!-- Mobile Bottom Spacing for fixed CTAs if any -->
        <div class="h-24 md:hidden"></div>
    </footer>

    <!-- Mobile Bottom Navigation (Visible only on md and smaller) -->
    <nav class="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] z-50 flex items-center justify-around px-2 py-2 pb-[env(safe-area-inset-bottom,8px)]">
        <a href="/" id="bn-home" class="flex flex-col items-center gap-1 text-slate-500 hover:text-brand-600 transition-colors py-1 px-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span class="text-[11px] font-bold">خانه</span>
        </a>
        <button type="button" onclick="if(typeof openRequestModal === 'function') openRequestModal(); else window.location.href='/#services';" id="bn-request" class="flex flex-col items-center gap-1 text-[#8B1C31] hover:text-[#701627] transition-colors py-1 px-2">
            <div class="w-8 h-8 rounded-full bg-[#8B1C31] text-white flex items-center justify-center -mt-3 shadow-md shadow-[#8B1C31]/30">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            </div>
            <span class="text-[11px] font-bold text-[#8B1C31]">ثبت درخواست</span>
        </button>
        <a href="/track" id="bn-track" class="flex flex-col items-center gap-1 text-slate-500 hover:text-brand-600 transition-colors py-1 px-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
            <span class="text-[11px] font-bold">پیگیری</span>
        </a>
        <a href="/track" id="bn-profile" class="flex flex-col items-center gap-1 text-slate-500 hover:text-brand-600 transition-colors py-1 px-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            <span class="text-[11px] font-bold">پروفایل من</span>
        </a>
    </nav>
    
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const path = window.location.pathname;
            const setBtn = (id) => {
                const el = document.getElementById(id);
                if(el) {
                    el.classList.remove('text-slate-500');
                    el.classList.add('text-[#8B1C31]');
                }
            };
            if(path === '/') setBtn('bn-home');
            else if(path.startsWith('/track')) setBtn('bn-track');
            else if(path.startsWith('/magazine')) setBtn('bn-mag');
        });
    </script>




    <!-- Mobile Sticky CTA -->
    <div class="mobile-cta">
        <a href="tel:${PHONE}" class="flex-1 bg-brand-500 text-white text-center py-2.5 rounded-2xl flex flex-col justify-center items-center gap-0.5 shadow-md">
            <div class="font-bold text-[13px] flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
                تماس فوری
            </div>
            <div class="text-[11px] font-bold opacity-90 tracking-widest font-sans" dir="ltr">0933 325 6885</div>
        </a>
        <a href="https://wa.me/${WHATSAPP}" class="flex-1 bg-[#25D366] text-white text-center py-2.5 rounded-2xl flex flex-col justify-center items-center gap-0.5 shadow-md">
            <div class="font-bold text-[13px] flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
                واتس‌اپ
            </div>
            <div class="text-[11px] font-bold opacity-90 tracking-widest font-sans" dir="ltr">0933 325 6885</div>
        </a>
    </div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    // Clean URL if loaded with hash
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const target = document.getElementById(targetId);
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth' });
                history.replaceState(null, null, window.location.pathname);
            }, 50);
        } else {
            history.replaceState(null, null, window.location.pathname);
        }
    }

    // Intercept clicks on links containing hashes
    document.querySelectorAll('a').forEach(a => {
        const href = a.getAttribute('href');
        if (!href) return;
        
        if (href.startsWith('#')) {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.getElementById(href.substring(1));
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        } else if (href.startsWith('/#') && window.location.pathname === '/') {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.getElementById(href.substring(2));
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        }
    });
});
</script>

<!-- Submit Request Modal -->
<div id="requestModal" class="fixed inset-0 z-[100] hidden flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm modal-backdrop transition-opacity opacity-0" onclick="closeModal()"></div>
    
    <!-- Modal Content -->
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 modal-content transform scale-95 opacity-0 transition-all duration-300">
        <button onclick="closeModal()" class="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
        <div class="p-6 md:p-8">
            <div class="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-[#8B1C31] mb-6">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            </div>
            <h3 class="text-xl font-black text-slate-800 mb-2">ثبت درخواست خدمات</h3>
            <p class="text-sm text-slate-500 mb-8">لطفاً مشخصات خود را وارد کنید تا کارشناسان ما در کمترین زمان با شما تماس بگیرند.</p>
            
            <form id="requestForm" onsubmit="submitRequest(event)">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1.5">نام و نام خانوادگی</label>
                        <input type="text" id="reqName" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8B1C31] focus:ring-2 focus:ring-rose-100 outline-none transition-all text-slate-700 placeholder-slate-400" placeholder="مثال: علی رضایی">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1.5">شماره موبایل</label>
                        <input type="tel" id="reqPhone" required pattern="^09[0-9]{9}$" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8B1C31] focus:ring-2 focus:ring-rose-100 outline-none transition-all text-slate-700 placeholder-slate-400 text-left dir-ltr" placeholder="0912 345 6789">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1.5">نوع خدمت</label>
                        <select id="reqService" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8B1C31] focus:ring-2 focus:ring-rose-100 outline-none transition-all text-slate-700 bg-white">
                            <option value="سرمایش و گرمایش">سرمایش و گرمایش</option>
                            <option value="لوله کشی">لوله کشی</option>
                            <option value="برقکاری">برقکاری</option>
                            <option value="تعمیرات و بازسازی">تعمیرات و بازسازی ساختمان</option>
                            <option value="سایر">سایر موارد</option>
                        </select>
                    </div>
                </div>
                
                <button type="submit" id="reqSubmitBtn" class="w-full mt-8 bg-[#8B1C31] hover:bg-[#701627] text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-md shadow-rose-900/20 flex justify-center items-center gap-2">
                    <span>ثبت نهایی درخواست</span>
                    <svg class="w-5 h-5 hidden spinner" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                </button>
            </form>

            <div id="reqSuccessMsg" class="hidden flex-col items-center justify-center text-center py-6">
                <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h4 class="text-xl font-bold text-slate-800 mb-2">درخواست ثبت شد!</h4>
                <p class="text-sm text-slate-500">کارشناسان بهدون به زودی با شما تماس خواهند گرفت.</p>
                <button onclick="closeModal()" class="mt-6 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">بستن پنجره</button>
            </div>
        </div>
    </div>
</div>

<style>
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.spinner { animation: spin 1s linear infinite; }
</style>

<script>
function openModal(serviceName = null) {
    const modal = document.getElementById('requestModal');
    const backdrop = modal.querySelector('.modal-backdrop');
    const content = modal.querySelector('.modal-content');
    
    // Reset form state
    document.getElementById('requestForm').style.display = 'block';
    document.getElementById('reqSuccessMsg').classList.add('hidden');
    document.getElementById('reqSuccessMsg').classList.remove('flex');
    document.getElementById('requestForm').reset();
    
    if(serviceName) {
        const select = document.getElementById('reqService');
        for(let i=0; i<select.options.length; i++){
            if(select.options[i].value === serviceName) {
                select.selectedIndex = i;
                break;
            }
        }
    }
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        backdrop.classList.remove('opacity-0');
        content.classList.remove('opacity-0', 'scale-95');
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('requestModal');
    const backdrop = modal.querySelector('.modal-backdrop');
    const content = modal.querySelector('.modal-content');
    
    backdrop.classList.add('opacity-0');
    content.classList.add('opacity-0', 'scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

async function submitRequest(e) {
    e.preventDefault();
    const btn = document.getElementById('reqSubmitBtn');
    const spinner = btn.querySelector('.spinner');
    const span = btn.querySelector('span');
    
    const name = document.getElementById('reqName').value;
    const phone = document.getElementById('reqPhone').value;
    const service = document.getElementById('reqService').value;
    
    span.textContent = 'در حال ثبت...';
    spinner.classList.remove('hidden');
    btn.disabled = true;
    btn.classList.add('opacity-70');
    
    try {
        const res = await fetch('/api/requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, service_id: service })
        });
        
        if (res.ok) {
            document.getElementById('requestForm').style.display = 'none';
            const successMsg = document.getElementById('reqSuccessMsg');
            successMsg.classList.remove('hidden');
            successMsg.classList.add('flex');
        } else {
            alert('خطا در ثبت درخواست. لطفاً مجدداً تلاش کنید.');
        }
    } catch (err) {
        alert('خطای اتصال. لطفاً اینترنت خود را بررسی کنید.');
    } finally {
        span.textContent = 'ثبت نهایی درخواست';
        spinner.classList.add('hidden');
        btn.disabled = false;
        btn.classList.remove('opacity-70');
    }
}

// Intercept all links that contain "ثبت درخواست" or point to /#services to open the modal instead
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        if(link.textContent.includes('ثبت درخواست') || link.getAttribute('href') === '/#services') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // Find nearest service name if possible (from card title)
                let serviceName = null;
                const card = link.closest('.group');
                if (card) {
                    const title = card.querySelector('h3');
                    if (title) serviceName = title.textContent.trim();
                }
                openModal(serviceName);
            });
        }
    });
});
</script>

</body>
</html>
    `;;;;;

export const trackHTML = `
    <main class="min-h-screen bg-slate-50 pt-10 pb-32" dir="rtl">
        <div class="container mx-auto px-4 max-w-2xl">
            <div class="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
                <div class="text-center mb-8">
                    <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                    </div>
                    <h1 class="text-2xl font-black text-slate-800">پیگیری درخواست</h1>
                    <p class="text-slate-500 mt-2 text-sm leading-relaxed">برای مشاهده وضعیت درخواست‌های خود، شماره موبایلی که با آن ثبت سفارش کرده‌اید را وارد کنید.</p>
                </div>
                
                <form id="trackForm" onsubmit="trackOrder(event)" class="flex flex-col gap-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">شماره موبایل</label>
                        <input type="tel" id="trackPhone" dir="ltr" placeholder="09123456789" required pattern="^09\d{9}$" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8B1C31] outline-none transition-all text-center tracking-widest text-lg font-bold text-slate-700">
                    </div>
                    <button type="submit" id="trackBtn" class="w-full bg-[#8B1C31] hover:bg-[#701627] text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-md">
                        بررسی وضعیت
                    </button>
                </form>
                
                <div id="trackResults" class="mt-8 space-y-4 hidden">
                    <h3 class="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">لیست درخواست‌های شما</h3>
                    <div id="resultsList" class="space-y-4"></div>
                </div>
            </div>
        </div>
    </main>
    <script>
        async function trackOrder(e) {
            e.preventDefault();
            const phone = document.getElementById('trackPhone').value;
            const btn = document.getElementById('trackBtn');
            const resultsDiv = document.getElementById('trackResults');
            const list = document.getElementById('resultsList');
            
            btn.innerText = 'در حال جستجو...';
            
            try {
                const res = await fetch('/api/requests/track?phone=' + phone);
                const data = await res.json();
                
                list.innerHTML = '';
                resultsDiv.classList.remove('hidden');
                
                if(!data || data.length === 0) {
                    list.innerHTML = '<div class="p-6 bg-slate-50 rounded-2xl text-center text-slate-500 text-sm">هیچ درخواستی با این شماره یافت نشد.</div>';
                } else {
                    data.forEach(req => {
                        let statusColor, statusText;
                        if(req.status === 'pending') { statusColor = 'bg-amber-100 text-amber-700 border-amber-200'; statusText = 'در انتظار بررسی'; }
                        else if(req.status === 'in_progress') { statusColor = 'bg-blue-100 text-blue-700 border-blue-200'; statusText = 'در حال انجام'; }
                        else { statusColor = 'bg-emerald-100 text-emerald-700 border-emerald-200'; statusText = 'تکمیل شده'; }
                        
                        const date = new Date(req.created_at).toLocaleDateString('fa-IR');
                        list.innerHTML += '<div class="p-4 border border-slate-100 rounded-2xl shadow-sm bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">' +
'<div><h4 class="font-bold text-slate-800">' + req.service_id + '</h4>' +
'<div class="text-xs text-slate-400 mt-1">ثبت شده در: ' + date + '</div></div>' +
'<div class="px-4 py-1.5 rounded-full text-xs font-bold border ' + statusColor + ' whitespace-nowrap text-center">' +
statusText + '</div></div>';
                    });
                }
            } catch(err) {
                alert('خطا در ارتباط با سرور');
            }
            
            btn.innerText = 'بررسی وضعیت';
        }
    </script>
`;;;;;

export const magazineHTML = `
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
                            <span class="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full mb-4 inline-block">سرمایش و گرمایش</span>
                            <h2 class="text-xl font-bold text-slate-800 mb-3 group-hover:text-purple-600 transition-colors">چرا فشار آب ساختمان کم می‌شود؟</h2>
                            <p class="text-slate-600 text-sm leading-relaxed mb-4">علل افت فشار آب و راهکارهای عملی برای افزایش فشار آب پکیج و شیرآلات منزل...</p>
                            <span class="text-purple-600 text-sm font-bold flex items-center gap-2">ادامه مطلب <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg></span>
                        </div>
                    </a>
                </div>
            </div>
        </main>
    `;;;;;

export const singleArticleHTML = `
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
    `;;;;;

export const servicesData = {
    "hvac": {
        "id": "hvac",
        "title": "سرمایش و گرمایش ساختمان در تهران | نصب، تعمیر و سرویس تخصصی بهدون",
        "metaDesc": "خدمات تخصصی سرمایش و گرمایش در کلیه مناطق تهران با ضمانت کتبی. تعمیر و سرویس پکیج، کولر آبی، رادیاتور شوفاژ و آبگرمکن توسط تکنسین‌های مجرب بهدون با نرخ مصوب اتحادیه.",
        "subtitle": "آسایش دمایی و تهویه استاندارد ساختمان شما با تیم فنی بهدون؛ اعزام فوری تکنسین‌های متخصص در کمتر از ۴۵ دقیقه در سراسر تهران همراه با گارانتی معتبر قطعات و خدمات.",
        "icon": "<svg class=\"w-10 h-10\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"M12 3v18m-4-14h8m-8 10h8M6 8a6 6 0 1112 0 6 6 0 01-12 0z\"></path></svg>",
        "subServices": [
            {
                "name": "نصب و سرویس کولر آبی",
                "icon": "M12 3v18m-4-14h8m-8 10h8M6 8a6 6 0 1112 0 6 6 0 01-12 0z",
                "detail": "\n                <div class=\"space-y-6 text-slate-700 leading-relaxed text-justify\">\n                    <div class=\"bg-gradient-to-l from-blue-50/70 to-white p-5 rounded-2xl border border-blue-100 mb-6\">\n                        <h3 class=\"text-lg font-black text-brand-700 mb-2\">سرویس تخصصی و راه اندازی کولر آبی در کلیه مناطق تهران</h3>\n                        <p class=\"text-sm text-slate-600\">کولرهای آبی یکی از متداول‌ترین تجهیزات خنک‌کننده در ساختمان‌های مسکونی و اداری تهران هستند. شروع فصل گرما نیازمند سرویس استاندارد برای ارتقای خنک‌کنندگی، کاهش مصرف برق و پیشگیری از سوختن موتور و پمپ است.</p>\n                    </div>\n\n                    <h4 class=\"text-base font-bold text-slate-800 flex items-center gap-2\">\n                        <span class=\"w-2 h-2 rounded-full bg-[#8B1C31]\"></span>\n                        اقدامات جامع سرویس دوره‌ای کولر آبی توسط تیم بهدون:\n                    </h4>\n                    <ul class=\"list-disc list-inside space-y-2 text-sm text-slate-600 pr-2\">\n                        <li><strong>شستشوی کامل کفی و رسوب‌زدایی بدنه:</strong> تخلیه آب مانده، رفع شوره و گل‌ولای انباشته شده و جرم‌گیری کامل با مواد غیرخورنده جهت جلوگیری از پوسیدگی کفی کولر.</li>\n                        <li><strong>بررسی و تعویض پوشال یا پد سلولزی:</strong> تعویض سالانه پوشال‌ها برای تضمین ورود هوای مطبوع، عاری از بوی نم و خاک و باکتری، و بهینه‌سازی تبخیر آب.</li>\n                        <li><strong>سرویس، روغن‌کاری و تست یاتاقان‌ها و شفت:</strong> بررسی بالانس پروانه، روغن‌کاری تخصصی یاتاقان‌های جلو و عقب با روغن مقاوم در برابر رطوبت برای جلوگیری از صدای ناهنجار و فشار به دینام.</li>\n                        <li><strong>تنظیم، تست سلامت و روغن‌کاری پمپ آب (واتر پمپ):</strong> بررسی عدم گرفتگی لوله‌های آبرسان، تمیزکاری صافی پمپ و اطمینان از خیس شدن یکنواخت تمامی پوشال‌ها.</li>\n                        <li><strong>بررسی الکتروموتور (دینام) و تست خازن:</strong> تست جریان و آمپراژ موتور در دور کند و تند، بادگیری فضای داخل موتور، تنظیم و تعویض تسمه در صورت ترک‌خوردگی یا شل بودن.</li>\n                        <li><strong>تنظیم دقیق شناور و سرریز آب:</strong> جلوگیری از هدررفت و سرریز مداوم آب روی پشت‌بام و جلوگیری از آسیب به ایزوگام که می‌تواند نیاز به <a href=\"/services/renovation\" class=\"text-[#8B1C31] font-bold hover:underline\">خدمات عایق‌کاری پشت‌بام</a> را به همراه داشته باشد.</li>\n                        <li><strong>بررسی برزنت دهانه کانال کولر:</strong> ترمیم یا تعویض برزنت پوسیده جهت ممانعت از اتلاف باد خنک و لرزش شدید کانال.</li>\n                    </ul>\n\n                    <div class=\"bg-slate-50 border border-slate-200 rounded-2xl p-5 my-6\">\n                        <h5 class=\"font-bold text-slate-800 text-sm mb-2\">چه زمانی کولر آبی به حضور فوری تعمیرکار نیاز دارد؟</h5>\n                        <p class=\"text-xs text-slate-600 mb-3\">اگر بوی سوختگی، صدای جیرجیر ممتد، باد گرم، پرتاب قطرات آب به درون خانه یا روشن نشدن موتور را تجربه می‌کنید، فوراً کلید پمپ و موتور را قطع نمایید تا از سوختگی سیم‌پیچ گران‌قیمت موتور جلوگیری شود.</p>\n                        <div class=\"flex flex-wrap items-center gap-3\">\n                            <button type=\"button\" onclick=\"openRequestModal('نصب و سرویس کولر آبی')\" class=\"bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all\">\n                                ثبت درخواست اعزام تکنسین کولر آبی\n                            </button>\n                            <a href=\"tel:02122345678\" class=\"bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors\">\n                                تماس مستقیم: ۰۲۱-۲۲۳۴۵۶۷۸\n                            </a>\n                        </div>\n                    </div>\n                </div>\n            ",
                "slug": "water-cooler",
                "persianSlug": "نصب-و-سرویس-کولر-آبی"
            },
            {
                "name": "نصب و سرویس پکیج",
                "icon": "M12 3v18m-4-14h8m-8 10h8M6 8a6 6 0 1112 0 6 6 0 01-12 0z",
                "detail": "\n                <div class=\"space-y-6 text-slate-700 leading-relaxed text-justify\">\n                    <div class=\"bg-gradient-to-l from-amber-50/70 to-white p-5 rounded-2xl border border-amber-100 mb-6\">\n                        <h3 class=\"text-lg font-black text-brand-700 mb-2\">تعمیرات تخصصی و رسوب‌زدایی انواع پکیج دیواری و زمینی در تهران</h3>\n                        <p class=\"text-sm text-slate-600\">پکیج‌های گرمایشی به عنوان قلب تپنده تأسیسات حرارتی ساختمان، وظیفه تأمین همزمان آب گرم مصرفی و مدار گرمایش رادیاتورها را برعهده دارند. سختی بالای آب در مناطق مختلف تهران سبب ایجاد رسوب مداوم در مبدل‌ها و افت فشار شدید می‌شود.</p>\n                    </div>\n\n                    <h4 class=\"text-base font-bold text-slate-800 flex items-center gap-2\">\n                        <span class=\"w-2 h-2 rounded-full bg-[#8B1C31]\"></span>\n                        خدمات تخصصی پکیج در بهدون برای تمامی برندها (ایران رادیاتور، بوتان، لورچ، آریستون، ایساتیس، وایلانت و...):\n                    </h4>\n                    <ul class=\"list-disc list-inside space-y-2 text-sm text-slate-600 pr-2\">\n                        <li><strong>رسوب‌زدایی و اسیدشویی مبدل اصلی و ثانویه:</strong> شستشوی مدار با پمپ مخصوص اسیدشویی و مواد دیسکلر استاندارد بدون آسیب به آلیاژ مسی مبدل‌ها جهت بازگشت دمای یکنواخت آب گرم.</li>\n                        <li><strong>رفع مشکل افت بار و فشار پکیج:</strong> عیب‌یابی منبع انبساط، تست باد دیافراگم، شیر اطمینان ۳ بار و رفع نشتی‌های ریز در اتصالات و مدار لوله‌کشی (با همکاری تیم <a href=\"/services/plumbing\" class=\"text-[#8B1C31] font-bold hover:underline\">تشخیص ترکیدگی و لوله‌کشی بهدون</a>).</li>\n                        <li><strong>هواگیری مدار و تنظیم فشار سیستم:</strong> کالیبره کردن فشار روی ۱.۵ بار و تنظیم شیر پرکن و ارزیابی سنسورهای ان‌تی‌سی (NTC) آب گرم مصرفی و شوفاژ.</li>\n                        <li><strong>شستشو و تنظیم مشعل و الکترود جرقه‌زن:</strong> تنظیم ارتفاع شعله، تمیزکاری برنر، بهینه‌سازی راندمان احتراق و کاهش محسوس مصرف گاز ماهانه.</li>\n                        <li><strong>سرویس پمپ سیرکولاتور (گراندفوس، ویلو و...):</strong> رفع گیرپاژ پمپ، تست خازن، تعویض روتور یا اورینگ برای جلوگیری از صدای ناهنجار در حالت زمستانه.</li>\n                        <li><strong>عیب‌یابی تخصصی بردهای الکترونیکی و رفع کدهای خطای ارور:</strong> رفع ارورهای رایج مانند E51, E81, 70-80 در ایران رادیاتور، یا ارورهای چراغ قرمز در بوتان.</li>\n                    </ul>\n\n                    <div class=\"bg-slate-50 border border-slate-200 rounded-2xl p-5 my-6\">\n                        <h5 class=\"font-bold text-slate-800 text-sm mb-2\">علائم خرابی که نیازمند تماس فوری با تکنسین پکیج بهدون است:</h5>\n                        <p class=\"text-xs text-slate-600 mb-3\">سرد و گرم شدن مکرر آب هنگام دوش گرفتن، افت خودبه‌خودی عقربه فشارسنج به زیر ۱ بار، بالا رفتن غیرعادی فشار و نشتی آب از زیر دستگاه، و خاموش شدن ناگهانی پکیج همراه با ارور.</p>\n                        <div class=\"flex flex-wrap items-center gap-3\">\n                            <button type=\"button\" onclick=\"openRequestModal('نصب و سرویس پکیج')\" class=\"bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all\">\n                                ثبت آنلاین درخواست تعمیر و اسیدشویی پکیج\n                            </button>\n                            <a href=\"tel:02122345678\" class=\"bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors\">\n                                پشتیبانی تلفنی: ۰۲۱-۲۲۳۴۵۶۷۸\n                            </a>\n                        </div>\n                    </div>\n                </div>\n            ",
                "slug": "package",
                "persianSlug": "نصب-و-سرویس-پکیج"
            },
            {
                "name": "نصب و سرویس رادیاتور شوفاژ",
                "icon": "M12 3v18m-4-14h8m-8 10h8M6 8a6 6 0 1112 0 6 6 0 01-12 0z",
                "detail": "\n                <div class=\"space-y-6 text-slate-700 leading-relaxed text-justify\">\n                    <div class=\"bg-gradient-to-l from-rose-50/70 to-white p-5 rounded-2xl border border-rose-100 mb-6\">\n                        <h3 class=\"text-lg font-black text-brand-700 mb-2\">نصب، جابجایی، رفع نشتی و هواگیری اصولی رادیاتور در تهران</h3>\n                        <p class=\"text-sm text-slate-600\">رادیاتورهای پره‌ای آلومینیومی، پانلی و حوله‌خشک‌کن‌ها در صورتی که به درستی تراز و نصب نشوند یا مدار آنها دچار لجن و هواگرفتگی باشد، حرارت مطلوبی در فصول سرد سال به فضای داخلی انتقال نخواهند داد.</p>\n                    </div>\n\n                    <h4 class=\"text-base font-bold text-slate-800 flex items-center gap-2\">\n                        <span class=\"w-2 h-2 rounded-full bg-[#8B1C31]\"></span>\n                        اقدامات تخصصی خدمات شوفاژ و رادیاتور در بهدون:\n                    </h4>\n                    <ul class=\"list-disc list-inside space-y-2 text-sm text-slate-600 pr-2\">\n                        <li><strong>نصب و کوپل کردن پره‌های رادیاتور آلومینیومی:</strong> افزودن پره به رادیاتورهای موجود، نصب دقیق بست پرچمی و پایه زمینی جهت توزیع وزن رادیاتور روی دیوار.</li>\n                        <li><strong>هواگیری تخصصی و تخلیه رسوبات سیاه مدار:</strong> رفع پدیده نیمه‌گرم بودن شوفاژ (گرم بودن بالا و سرد بودن پایین رادیاتور) با آچار مخصوص و تنظیم بالانس هیدرولیکی مدار.</li>\n                        <li><strong>شستشوی کامل مدار شوفاژها:</strong> تخلیه آب سیاه و لجن‌های رسوب کرده در کف رادیاتورها که باعث انسداد مسیر برگشت آب به پکیج و آسیب به پمپ دستگاه می‌شوند.</li>\n                        <li><strong>تعویض و آب‌بندی شیر رفت و برگشت (زانویی):</strong> رفع نم‌زدگی و چکیدن آب از کنار اتصالات شوفاژ با مغزی‌های استاندارد و تفلون مایع مرغوب.</li>\n                        <li><strong>نصب انواع حوله‌خشک‌کن حمام:</strong> لوله‌کشی روکار یا توکار و عایق‌کاری اتصالات مرطوب برای پیشگیری از نم‌زدگی دیوارها که می‌تواند منجر به نیاز به <a href=\"/services/renovation\" class=\"text-[#8B1C31] font-bold hover:underline\">گچ‌کاری و لکه‌گیری ساختمان</a> گردد.</li>\n                    </ul>\n\n                    <div class=\"bg-slate-50 border border-slate-200 rounded-2xl p-5 my-6\">\n                        <h5 class=\"font-bold text-slate-800 text-sm mb-2\">چرا رادیاتورهای منزل به درستی گرم نمی‌شوند؟</h5>\n                        <p class=\"text-xs text-slate-600 mb-3\">وجود هوا در قسمت‌های بالایی بلوک رادیاتور، رسوب‌گرفتگی شدید در رادیاتورهای انتهایی خانه، ضعف پمپ پکیج یا لوله‌کشی غیراستاندارد اصلی‌ترین دلایل هستند که تکنسین بهدون پس از بازدید، در سریع‌ترین زمان آن را برطرف خواهد کرد.</p>\n                        <div class=\"flex flex-wrap items-center gap-3\">\n                            <button type=\"button\" onclick=\"openRequestModal('نصب و سرویس رادیاتور شوفاژ')\" class=\"bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all\">\n                                ثبت درخواست اعزام تکنسین شوفاژ و رادیاتور\n                            </button>\n                            <a href=\"tel:02122345678\" class=\"bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors\">\n                                تماس با پشتیبانی: ۰۲۱-۲۲۳۴۵۶۷۸\n                            </a>\n                        </div>\n                    </div>\n                </div>\n            ",
                "slug": "radiator",
                "persianSlug": "نصب-و-سرویس-رادیاتور-شوفاژ"
            },
            {
                "name": "تعمیر و سرویس آبگرمکن",
                "icon": "M12 3v18m-4-14h8m-8 10h8M6 8a6 6 0 1112 0 6 6 0 01-12 0z",
                "detail": "\n                <div class=\"space-y-6 text-slate-700 leading-relaxed text-justify\">\n                    <div class=\"bg-gradient-to-l from-orange-50/70 to-white p-5 rounded-2xl border border-orange-100 mb-6\">\n                        <h3 class=\"text-lg font-black text-brand-700 mb-2\">سرویس، رسوب‌زدایی و عیب‌یابی انواع آبگرمکن دیواری و ایستاده در تهران</h3>\n                        <p class=\"text-sm text-slate-600\">آبگرمکن‌های دیواری فوری به دلیل تماس مستقیم آب با لوله‌های فین‌دار مسی، به شدت مستعد جذب گچ و رسوبات کلسیمی هستند. اگر فشار آب گرم در آشپزخانه یا حمام ضعیف شده یا آبگرمکن با تأخیر روشن می‌شود، نیاز به سرویس تخصصی دارد.</p>\n                    </div>\n\n                    <h4 class=\"text-base font-bold text-slate-800 flex items-center gap-2\">\n                        <span class=\"w-2 h-2 rounded-full bg-[#8B1C31]\"></span>\n                        دامنه خدمات آبگرمکن در پلتفرم بهدون:\n                    </h4>\n                    <ul class=\"list-disc list-inside space-y-2 text-sm text-slate-600 pr-2\">\n                        <li><strong>جرم‌گیری و اسیدشویی کوئل و لوله‌های مسی:</strong> باز کردن مسیر عبور آب سرد و گرم، افزایش قابل توجه فشار آب خروجی و کاهش مصرف گاز با بهبود انتقال حرارت.</li>\n                        <li><strong>تعویض دیافراگم (لاستیک پیستون):</strong> رفع مشکل روشن نشدن مشعل با باز کردن شیر آب گرم ناشی از پارگی یا فرسایش دیافراگم رگلاتور آب.</li>\n                        <li><strong>سرویس رگلاتور برنجی آب و گاز:</strong> روان‌کاری میله پیستون، تعویض اورینگ‌ها و اطمینان از خاموش شدن به موقع مشعل پس از بستن شیر آب برای ایمنی ساکنین.</li>\n                        <li><strong>سرویس ترموکوپل و شمعک (پیلوت):</strong> برطرف کردن خاموش شدن مداوم شمعک، تمیزکاری نازل پیلوت و تست جریان میلی‌ولتی بوبین ایمنی.</li>\n                        <li><strong>تنظیم سیستم جرقه‌زن آیونایز و باتری:</strong> در مدل‌های بدون شمعک جدید بوتان، تنظیم فاصله الکترود جرقه‌زن و سوئیچ میکروسوئیچ.</li>\n                        <li><strong>تست سلامت دودکش و حسگر خروج گاز مونوکسید کربن:</strong> رعایت دقیق‌ترین استانداردهای سازمان آتش‌نشانی جهت جلوگیری از خطرات ناشی از پس‌زدن گازهای سمی احتراق.</li>\n                    </ul>\n\n                    <div class=\"bg-slate-50 border border-slate-200 rounded-2xl p-5 my-6\">\n                        <h5 class=\"font-bold text-slate-800 text-sm mb-2\">توصیه ایمنی کارشناسان بهدون:</h5>\n                        <p class=\"text-xs text-slate-600 mb-3\">هرگز تعمیر بخش گازسوز آبگرمکن را به افراد غیرمتخصص نسپارید. کوچک‌ترین نشتی در اتصالات گازی یا عدم کارکرد سنسور دودکش می‌تواند خطرات جانی غیرقابل جبرانی به دنبال داشته باشد. تمامی تکنسین‌های اعزامی بهدون دارای گواهینامه معتبر فنی و حرفه‌ای هستند.</p>\n                        <div class=\"flex flex-wrap items-center gap-3\">\n                            <button type=\"button\" onclick=\"openRequestModal('تعمیر و سرویس آبگرمکن')\" class=\"bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all\">\n                                ثبت درخواست تعمیر فوری آبگرمکن در تهران\n                            </button>\n                            <a href=\"tel:02122345678\" class=\"bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors\">\n                                تماس با اعزام تکنسین: ۰۲۱-۲۲۳۴۵۶۷۸\n                            </a>\n                        </div>\n                    </div>\n                </div>\n            ",
                "slug": "water-heater",
                "persianSlug": "تعمیر-و-سرویس-آبگرمکن"
            }
        ],
        "comprehensiveGuide": "\n        <!-- ================= COMPREHENSIVE SEO GUIDE (> 1200 WORDS) ================= -->\n        <article class=\"mt-12 pt-10 border-t border-slate-200 text-slate-700 leading-relaxed text-justify space-y-8\" dir=\"rtl\">\n            \n            <header class=\"text-center max-w-3xl mx-auto space-y-4 mb-10\">\n                <span class=\"inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200\">\n                    <svg class=\"w-4 h-4 text-[#8B1C31]\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z\"></path></svg>\n                    دانشنامه و راهنمای تخصصی تأسیسات ساختمانی در تهران\n                </span>\n                <h2 class=\"text-2xl md:text-3xl font-black text-slate-800 leading-tight\">\n                    راهنمای جامع نگهداری، تعمیرات و بهینه‌سازی سیستم‌های سرمایش و گرمایش در تهران\n                </h2>\n                <p class=\"text-sm text-slate-500 leading-relaxed\">\n                    هر آنچه مالکان، مستاجران و مدیران ساختمان در خصوص بازدهی انرژی، عیب‌یابی، هزینه سرویس‌ها و انتخاب تکنسین مجرب در تهران باید بدانند.\n                </p>\n            </header>\n\n            <!-- Quick Action Alert Box -->\n            <div class=\"bg-gradient-to-r from-[#133458] to-[#1c4b7d] rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6\">\n                <div class=\"space-y-2 text-center md:text-right\">\n                    <h3 class=\"text-xl font-bold\">نیاز به خدمات اورژانسی تأسیسات در تهران دارید؟</h3>\n                    <p class=\"text-xs md:text-sm text-blue-100 max-w-xl leading-relaxed\">\n                        تکنسین‌های بهدون در تمامی مناطق ۲۲ گانه تهران (شمال، غرب، شرق، مرکز و جنوب) مستقر بوده و کمتر از ۴۵ دقیقه پس از ثبت درخواست در محل حاضر می‌شوند.\n                    </p>\n                </div>\n                <div class=\"flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0\">\n                    <button type=\"button\" onclick=\"openRequestModal('سرمایش و گرمایش')\" class=\"w-full sm:w-auto px-6 py-3 bg-[#8B1C31] hover:bg-[#701627] text-white text-xs md:text-sm font-black rounded-xl shadow-lg transition-all transform hover:scale-105 text-center\">\n                        ثبت فوری درخواست آنلاین\n                    </button>\n                    <a href=\"tel:02122345678\" class=\"w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs md:text-sm font-bold rounded-xl backdrop-blur-sm border border-white/20 transition-all text-center flex items-center justify-center gap-2\">\n                        <svg class=\"w-4 h-4 text-emerald-400\" fill=\"currentColor\" viewBox=\"0 0 512 512\"><path d=\"M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z\"/></svg>\n                        <span>۰۲۱-۲۲۳۴۵۶۷۸</span>\n                    </a>\n                </div>\n            </div>\n\n            <!-- SECTION 1: Overview -->\n            <section class=\"space-y-4\">\n                <h3 class=\"text-xl font-black text-slate-800 flex items-center gap-2 border-r-4 border-[#8B1C31] pr-3\">\n                    مقدمه: اهمیت استراتژیک سرویس دوره‌ای تجهیزات سرمایشی و گرمایشی\n                </h3>\n                <p>\n                    تجهیزات تهویه مطبوع، سرمایشی و حرارتی، بیش از ۴۰ درصد از کل انرژی مصرفی یک واحد مسکونی یا اداری در کلانشهر تهران را به خود اختصاص می‌دهند. با توجه به شرایط اقلیمی پایتخت، تابستان‌های داغ و خشک و زمستان‌های سرد و پرنوسان، سیستم‌های سرمایش و گرمایش تحت بار کاری مداوم و سنگین فعالیت می‌کنند. رسوب املاح کلسیمی آب تهران در لوله‌ها و مبدل‌ها، آلودگی و گرد و غبار انباشته شده روی پوشال‌ها و کوئل‌ها، و استهلاک قطعات متحرک مانند پمپ‌ها و الکتروموتورها، در صورت عدم سرویس به موقع، به سرعت راندمان سیستم را تا ۳۵ درصد کاهش داده و استهلاک زودهنگام و هزینه‌های گزاف تعویض دستگاه را به دنبال خواهد داشت.\n                </p>\n                <p>\n                    پلتفرم خدمات ساختمانی <a href=\"/\" class=\"text-brand-600 font-bold hover:underline\">بهدون</a> با بهره‌گیری از کادر تکنسین‌های آموزش‌دیده و مجرب، با هدف شفاف‌سازی هزینه‌ها و ارتقای کیفیت استانداردهای اجرایی تأسیسات در تهران، بستری مستقیم برای ثبت، ارزیابی و اعزام کارشناسان فراهم ساخته است. اگر نیاز به بررسی پیوسته لوله‌کشی و شیرآلات مرتبط دارید، می‌توانید به صفحه <a href=\"/services/plumbing\" class=\"text-brand-600 font-bold hover:underline\">خدمات لوله‌کشی آب و فاضلاب</a> ما نیز مراجعه فرمایید.\n                </p>\n            </section>\n\n            <!-- SECTION 2: Deep Dive into Services -->\n            <section class=\"space-y-6\">\n                <h3 class=\"text-xl font-black text-slate-800 flex items-center gap-2 border-r-4 border-[#8B1C31] pr-3\">\n                    بررسی تفصیلی ارکان چهارگانه خدمات سرمایش و گرمایش در بهدون\n                </h3>\n\n                <!-- Sub-block 1 -->\n                <div class=\"bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3\">\n                    <h4 class=\"text-lg font-bold text-slate-800 text-brand-600\">۱. نصب، راه‌اندازی و نگهداری تخصصی کولر آبی</h4>\n                    <p class=\"text-sm leading-relaxed\">\n                        کولر آبی دستگاهی به ظاهر ساده اما از نظر فنی نیازمند هماهنگی دقیق میان مدارهای هیدرولیکی و الکتریکی است. در شروع فصل گرما، روشن کردن کولر آبی بدون شستشوی کفی و تعویض پوشال می‌تواند باعث سوختن موتور در اثر سفت بودن یاتاقان‌ها شود. تکنسین‌های بهدون در فرایند سرویس، با اندازه‌گیری لقی شفت توربین، روغن‌کاری گریس نسوز یاتاقان، تنظیم شناور ضدسرریز و بررسی سلامت کابل برق، حداکثر بازدهی سرمایشی را با کمترین مصرف آب و برق تضمین می‌کنند. همچنین در صورت نیاز به بررسی سیم‌کشی فیوز یا تعویض کلید کولر، خدمات از طریق واحد <a href=\"/services/electrical\" class=\"text-brand-600 font-bold hover:underline\">برقکاری ساختمان بهدون</a> در همان جلسه قابل تجمیع و انجام است.\n                    </p>\n                </div>\n\n                <!-- Sub-block 2 -->\n                <div class=\"bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3\">\n                    <h4 class=\"text-lg font-bold text-slate-800 text-brand-600\">۲. تعمیر، رسوب‌زدایی و عیب‌یابی بردهای پکیج دیواری</h4>\n                    <p class=\"text-sm leading-relaxed\">\n                        پکیج‌های مدرن به علت راندمان بالا و استقلال هر واحد ساختمانی، محبوب‌ترین سیستم گرمایشی در تهران هستند. اما به دلیل رسوب کربنات کلسیم، مبدل‌های صفحه‌ای این دستگاه‌ها پس از ۱ تا ۲ سال دچار انسداد جزئی یا کامل می‌شوند. اسیدشویی ناصحیح توسط افراد ناوارد با اسیدهای خالص صنعتی موجب سوراخ شدن مبدل حرارتی گران‌قیمت می‌گردد. در بهدون، رسوب‌زدایی با اسیدهای محافظ‌دار دیسکلر گیاهی استاندارد و پمپ سیرکوله پرتابل انجام می‌گیرد. همچنین تست عیب‌یابی پمپ ویلو و گراندفوس، کالیبراسیون سنسور شعله و یون، و تنظیم گیج منبع انبساط با دستگاه فشارسنج دیجیتال صورت می‌پذیرد.\n                    </p>\n                </div>\n\n                <!-- Sub-block 3 -->\n                <div class=\"bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3\">\n                    <h4 class=\"text-lg font-bold text-slate-800 text-brand-600\">۳. نصب و هواگیری رادیاتور و بهینه‌سازی راندمان شوفاژ</h4>\n                    <p class=\"text-sm leading-relaxed\">\n                        مشکل شایع گرم نشدن شوفاژها در زمستان، عمدتاً ناشی از تجمع هوا در پره‌های فوقانی و لجن سیاه‌رنگ ناشی از اکسیداسیون داخل لوله‌ها در پره‌های پایینی است. هواگیری غیراصولی می‌تواند به هرز شدن شیر هواگیری یا نشتی آب روی پارکت و فرش منجر شود. در صورت بروز هرگونه نم یا تخریب اطراف شوفاژ، تیم <a href=\"/services/renovation\" class=\"text-brand-600 font-bold hover:underline\">بازسازی و نقاشی ساختمان</a> در کنار تکنسین‌های تأسیسات آماده خدمت‌رسانی خواهند بود. متخصصان بهدون با شستشوی فشاری مدار و بالانس شیرهای برگشت، توزیع حرارت در دورترین رادیاتورها را یکنواخت می‌سازند.\n                    </p>\n                </div>\n\n                <!-- Sub-block 4 -->\n                <div class=\"bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3\">\n                    <h4 class=\"text-lg font-bold text-slate-800 text-brand-600\">۴. تعمیرات، رفع افت فشار و سرویس آبگرمکن دیواری</h4>\n                    <p class=\"text-sm leading-relaxed\">\n                        نوسانات دمای آب در هنگام استحمام یا دیر روشن شدن آبگرمکن از شایع‌ترین مشکلات خانه‌ها است. علت این عارضه اغلب فرسودگی دیافراگم لاستیکی، رسوب در نازل شیپوره یا خرابی ترموکوپل و شمعک است. در بهدون کلیه قطعات یدکی مصرفی از جمله دیافراگم سیلیکونی مقاوم به حرارت و بوبین‌های ایمنی اصل با فاکتور معتبر و گارانتی تعویض می‌شوند.\n                    </p>\n                </div>\n            </section>\n\n            <!-- SECTION 3: Troubleshooting Table -->\n            <section class=\"space-y-4\">\n                <h3 class=\"text-xl font-black text-slate-800 flex items-center gap-2 border-r-4 border-[#8B1C31] pr-3\">\n                    جدول راهنمای عیب‌یابی سریع مشکلات سرمایش و گرمایش\n                </h3>\n                <p class=\"text-sm text-slate-600\">\n                    قبل از تماس با تکنسین، می‌توانید با بررسی جدول زیر علت احتمالی و اقدامات اولیه را بررسی کنید:\n                </p>\n\n                <div class=\"overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white\">\n                    <table class=\"w-full text-right text-xs md:text-sm\">\n                        <thead class=\"bg-slate-100/80 text-slate-800 font-bold border-b border-slate-200\">\n                            <tr>\n                                <th class=\"p-3.5 md:p-4\">نشانه و مشکل مشاهده‌شده</th>\n                                <th class=\"p-3.5 md:p-4\">علت فنی و ریشه‌ای</th>\n                                <th class=\"p-3.5 md:p-4\">اقدام پیشنهادی بهدون</th>\n                            </tr>\n                        </thead>\n                        <tbody class=\"divide-y divide-slate-100 text-slate-600\">\n                            <tr class=\"hover:bg-slate-50/50\">\n                                <td class=\"p-3.5 md:p-4 font-bold text-slate-800\">باد کولر آبی خنک نیست اما موتور کار می‌کند</td>\n                                <td class=\"p-3.5 md:p-4\">خشک بودن پوشال‌ها، سوختن یا گرفتگی پمپ آب، پاره بودن تسمه</td>\n                                <td class=\"p-3.5 md:p-4\">سرویس پمپ و لوله‌های آبرسان، تنظیم یا تعویض تسمه</td>\n                            </tr>\n                            <tr class=\"hover:bg-slate-50/50\">\n                                <td class=\"p-3.5 md:p-4 font-bold text-slate-800\">فشار پکیج مدام صفر می‌شود و افت می‌کند</td>\n                                <td class=\"p-3.5 md:p-4\">نشتی در اتصالات شوفاژ، خرابی شیر پرکن یا تخلیه باد منبع انبساط</td>\n                                <td class=\"p-3.5 md:p-4\">شارژ باد منبع انبساط، نشت‌یابی با دستگاه نقطه زن</td>\n                            </tr>\n                            <tr class=\"hover:bg-slate-50/50\">\n                                <td class=\"p-3.5 md:p-4 font-bold text-slate-800\">آب مصرفی پکیج سرد و گرم می‌شود</td>\n                                <td class=\"p-3.5 md:p-4\">رسوب شدید در مبدل ثانویه، نقص در سنسور NTC آب گرم</td>\n                                <td class=\"p-3.5 md:p-4\">اسیدشویی تخصصی مبدل صفحه‌ای با دیسکلر استاندارد</td>\n                            </tr>\n                            <tr class=\"hover:bg-slate-50/50\">\n                                <td class=\"p-3.5 md:p-4 font-bold text-slate-800\">شوفاژها در بالا گرم و در پایین کاملاً سرد هستند</td>\n                                <td class=\"p-3.5 md:p-4\">تجمع لجن و براده در مدار رادیاتور، ضعف دور گردش پمپ</td>\n                                <td class=\"p-3.5 md:p-4\">شستشوی پرفشار مدار رادیاتور و هواگیری تخصصی</td>\n                            </tr>\n                            <tr class=\"hover:bg-slate-50/50\">\n                                <td class=\"p-3.5 md:p-4 font-bold text-slate-800\">شمعک آبگرمکن روشن نمی‌ماند</td>\n                                <td class=\"p-3.5 md:p-4\">خرابی ترموکوپل، سوختن بوبین ایمنی یا کثیفی نازل شمعک</td>\n                                <td class=\"p-3.5 md:p-4\">تمیزکاری پیلوت و تعویض قطعه ترموکوپل اورجینال</td>\n                            </tr>\n                        </tbody>\n                    </table>\n                </div>\n            </section>\n\n            <!-- SECTION 4: Why Behdoon -->\n            <section class=\"space-y-4\">\n                <h3 class=\"text-xl font-black text-slate-800 flex items-center gap-2 border-r-4 border-[#8B1C31] pr-3\">\n                    چرا پلتفرم بهدون انتخابی مطمئن برای خدمات سرمایش و گرمایش در تهران است؟\n                </h3>\n                <p>\n                    یافتن سرویس‌کار کاربلد و متعهد در کلانشهری مانند تهران همواره یکی از دغدغه‌های خانواده‌ها بوده است. بهدون با هدف ساماندهی این فضا، استانداردهای سخت‌گیرانه‌ای برای پذیرش و اعزام تکنسین تدوین نموده است:\n                </p>\n\n                <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4 pt-2\">\n                    <div class=\"bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-2.5\">\n                        <div class=\"w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto font-black text-lg\">\n                            ✓\n                        </div>\n                        <h4 class=\"font-bold text-slate-800 text-sm\">ضمانت کتبی کیفیت خدمات</h4>\n                        <p class=\"text-xs text-slate-500 leading-relaxed\">کلیه خدمات تعمیری و قطعات نصب‌شده دارای گارانتی رسمی بهدون بوده و در صورت بروز هرگونه ایراد در دوره ضمانت، رفع عیب کاملاً رایگان انجام می‌پذیرد.</p>\n                    </div>\n\n                    <div class=\"bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-2.5\">\n                        <div class=\"w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mx-auto font-black text-lg\">\n                            ⏱\n                        </div>\n                        <h4 class=\"font-bold text-slate-800 text-sm\">سرعت حضور در محل (زیر ۴۵ دقیقه)</h4>\n                        <p class=\"text-xs text-slate-500 leading-relaxed\">با توزیع شبکه‌ای تکنسین‌ها در شمال، غرب، شرق و مرکز تهران، کارشناس از نزدیک‌ترین ایستگاه خدماتی به آدرس ثبت شده شما اعزام می‌گردد.</p>\n                    </div>\n\n                    <div class=\"bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-2.5\">\n                        <div class=\"w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto font-black text-lg\">\n                            ⚖\n                        </div>\n                        <h4 class=\"font-bold text-slate-800 text-sm\">شفافیت نرخ و تعرفه مصوب</h4>\n                        <p class=\"text-xs text-slate-500 leading-relaxed\">هزینه‌ها دقیقاً منطبق بر نرخنامه مصوب اتحادیه تأسیسات مکانیکی و لوازم گازسوز تهران محاسبه شده و هیچ هزینه نامتعارفی دریافت نمی‌شود.</p>\n                    </div>\n                </div>\n            </section>\n\n            <!-- SECTION 5: How it works & Tracking -->\n            <section class=\"space-y-4\">\n                <h3 class=\"text-xl font-black text-slate-800 flex items-center gap-2 border-r-4 border-[#8B1C31] pr-3\">\n                    فرایند ثبت و پیگیری هوشمند درخواست در بهدون\n                </h3>\n                <p>\n                    ما فرایند سفارش را به ساده‌ترین شکل ممکن طراحی کرده‌ایم تا در کمتر از ۱ دقیقه بتوانید درخواست خود را نهایی کنید:\n                </p>\n                <ol class=\"list-decimal list-inside space-y-2 text-sm text-slate-600 pr-2\">\n                    <li><strong>انتخاب خدمت:</strong> کلیک روی دکمه ثبت درخواست در بالای صفحه یا زیردسته‌های فوق و انتخاب نوع سرویس مورد نیاز.</li>\n                    <li><strong>تعیین موقعیت روی نقشه تهران:</strong> با کلیک روی نام محله خود یا جابجایی مارکر، لوکیشن دقیق خود را انتخاب می‌کنید.</li>\n                    <li><strong>تعیین زمان حضور:</strong> مشخص می‌کنید که کارشناس به صورت فوری اعزام شود یا در بازه زمانی خاصی از روزهای آتی مراجعه نماید.</li>\n                    <li><strong>دریافت آنی کد رهگیری:</strong> پس از ثبت شماره موبایل، سیستم یک کد پیگیری اختصاصی (مانند <code class=\"bg-slate-100 text-[#8B1C31] px-2 py-0.5 rounded font-mono font-bold\">BEH-XXXX</code>) صادر می‌کند که در صفحه <a href=\"/track\" class=\"text-brand-600 font-bold hover:underline\">پیگیری آنلاین درخواست‌ها</a> وضعیت اعزام تکنسین، ساعت ورود و گزارش کار را به طور لحظه‌ای به شما نمایش می‌دهد.</li>\n                </ol>\n            </section>\n\n            <!-- SECTION 6: Final CTA Banner -->\n            <div class=\"bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-6 md:p-8 text-center space-y-4 my-8\">\n                <h3 class=\"text-xl font-black text-slate-800\">آماده دریافت خدمات تخصصی سرمایش و گرمایش هستید؟</h3>\n                <p class=\"text-xs md:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed\">\n                    هم‌اکنون درخواست خود را به صورت آنلاین ثبت نمایید تا نزدیک‌ترین تکنسین مجرب در منطقه شما با ابزار و قطعات استاندارد در محل حاضر شود.\n                </p>\n                <div class=\"flex flex-wrap items-center justify-center gap-3 pt-2\">\n                    <button type=\"button\" onclick=\"openRequestModal('سرمایش و گرمایش')\" class=\"bg-[#8B1C31] hover:bg-[#701627] text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-[#8B1C31]/25 hover:shadow-2xl transition-all transform hover:-translate-y-0.5\">\n                        ثبت فوری درخواست آنلاین (با کد رهگیری)\n                    </button>\n                    <a href=\"tel:02122345678\" class=\"bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-sm transition-colors flex items-center gap-2\">\n                        <svg class=\"w-4 h-4 text-emerald-600\" fill=\"currentColor\" viewBox=\"0 0 512 512\"><path d=\"M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z\"/></svg>\n                        <span>پشتیبانی تلفنی مستقیم: ۰۲۱-۲۲۳۴۵۶۷۸</span>\n                    </a>\n                </div>\n            </div>\n\n        </article>\n    ",
        "faq": [
            {
                "q": "هزینه سرویس و تعمیر پکیج و کولر چگونه محاسبه می‌شود؟",
                "a": "کلیه هزینه‌های خدمات بهدون طبق نرخ مصوب اتحادیه تأسیسات مکانیکی و گازسوز تهران محاسبه می‌گردد. قبل از شروع کار، کارشناس پس از عیب‌یابی دقیق هزینه کامل قطعات و اجرت را به اطلاع شما می‌رساند و پس از رضایت کامل شما پرداخت انجام می‌شود."
            },
            {
                "q": "سرعت اعزام تکنسین به محل در تهران چقدر است؟",
                "a": "بهدون با دارا بودن تیم‌های سیار در شمال، غرب، شرق و مرکز تهران، در صورت ثبت درخواست به صورت «فوری»، در کمتر از ۴۵ دقیقه کارشناس را به محل اعزام می‌نماید. همچنین می‌توانید زمان دلخواهی را در روزهای آینده انتخاب کنید."
            },
            {
                "q": "آیا خدمات سرمایش و گرمایش بهدون دارای ضمانت کتبی است؟",
                "a": "بله، کلیه خدمات تعمیری و سرویس شامل گارانتی رسمی بهدون بوده و فاکتور چاپی معتبر به همراه مهر و امضای کارشناس تقدیم مشتریان محترم می‌گردد."
            },
            {
                "q": "چگونه می‌توانم وضعیت تکنسین اعزامی را پیگیری کنم؟",
                "a": "بلافاصله پس از ثبت درخواست در سایت، یک کد پیگیری اختصاصی (مانند BEH-XXXX) برای شما صادر می‌شود. با وارد کردن این کد یا شماره تماس خود در بخش «پیگیری» سایت بهدون، وضعیت لحظه‌ای درخواست قابل رویت است."
            },
            {
                "q": "آیا اسیدشویی پکیج به مبدل دستگاه آسیب نمی‌زند؟",
                "a": "خیر، تکنسین‌های بهدون از اسیدهای محافظت‌شده استاندارد (Discaler با دوز مشخص) و پمپ‌های مخصوص شستشوی مدار استفاده می‌کنند که صرفاً رسوبات آهکی را حل کرده و به هیچ عنوان به آلیاژ مس مبدل آسیب نمی‌زند."
            }
        ]
    },
    "plumbing": {
        "id": "plumbing",
        "title": "خدمات لوله‌کشی، نشت‌یابی و تأسیسات ساختمان در تهران | بهدون",
        "metaDesc": "خدمات تخصصی لوله‌کشی آب و فاضلاب در تهران با دستگاه نشت‌یاب نقطه زن تصویری، رفع نم بدون تخریب، نصب شیرآلات، توالت فرنگی و پمپ آب با ضمانت کتبی بهدون.",
        "subtitle": "شریان‌های حیاتی ساختمان خود را به متخصصان مجرب بسپارید. نشت‌یابی دیجیتال، رفع نم، لوله‌کشی آب و فاضلاب و نصب انواع تجهیزات بهداشتی با اعزام فوری در کمتر از ۴۵ دقیقه در تمامی مناطق تهران.",
        "icon": "<svg class=\"w-10 h-10\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z\"></path></svg>",
        "subServices": [
            {
                "name": "تشخیص و ترمیم ترکیدگی لوله",
                "icon": "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
                "detail": "\n                <div class=\"space-y-4 text-slate-700 leading-relaxed text-justify\">\n                    <div class=\"bg-gradient-to-l from-cyan-50 to-white p-5 rounded-2xl border border-cyan-100\">\n                        <h3 class=\"text-lg font-black text-brand-700 mb-2\">تشخیص دقیق ترکیدگی لوله با دستگاه نقطه زن آکوستیک و تصویری</h3>\n                        <p class=\"text-sm text-slate-600\">ترکیدگی لوله‌های آب و شوفاژ در زیر کف‌پوش یا پشت دیوارهای ساختمان اگر به سرعت شناسایی نشود، سازه را سست کرده و تخریب‌های پرهزینه به بار می‌آورد. بهدون با دستگاه‌های فوق‌پیشرفته آکوستیک، نقطه دقیق نشتی را تا عمق ۲ متر بدون حتی یک سانتی‌متر تخریب اضافی شناسایی می‌کند.</p>\n                    </div>\n                    <ul class=\"list-disc list-inside space-y-2 text-sm text-slate-600 pr-2\">\n                        <li><strong>نشت‌یابی با امواج صوتی فرکانس بالا:</strong> تشخیص صدای فرار آب از داخل لوله‌های پرفشار با خطای کمتر از ۵ سانتی‌متر.</li>\n                        <li><strong>تصویربرداری حرارتی (ترموویژن):</strong> پایش تفاوت دمای ناشی از نشتی لوله‌های آب گرم و مدار رادیاتور پکیج.</li>\n                        <li><strong>تخریب موضعی و ترمیم آنی لوله:</strong> بریدن قسمت آسیب‌دیده، تعویض با اتصالات کوپلی یا پرسی ۵ لایه نیوپایپ و تست فشار نهایی.</li>\n                        <li><strong>بازسازی کامل موضع تخریب‌شده:</strong> همکاری مستقیم با واحد <a href=\"/services/renovation\" class=\"text-[#8B1C31] font-bold hover:underline\">کاشی‌کاری و بنایی بهدون</a> برای بستن و بندکشی دقیق کاشی و سرامیک آسیب‌دیده.</li>\n                    </ul>\n                    <div class=\"flex flex-wrap gap-3 pt-2\">\n                        <button type=\"button\" onclick=\"openRequestModal('تشخیص و ترمیم ترکیدگی لوله')\" class=\"bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md\">ثبت درخواست نشت‌یابی فوری</button>\n                        <a href=\"tel:02122345678\" class=\"bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs\">تماس: ۰۲۱-۲۲۳۴۵۶۷۸</a>\n                    </div>\n                </div>\n            ",
                "slug": "leak-detection",
                "persianSlug": "تشخیص-ترکیدگی-لوله"
            },
            {
                "name": "رفع نم و نشتی و رطوبت",
                "icon": "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
                "detail": "\n                <div class=\"space-y-4 text-slate-700 leading-relaxed text-justify\">\n                    <div class=\"bg-gradient-to-l from-blue-50 to-white p-5 rounded-2xl border border-blue-100\">\n                        <h3 class=\"text-lg font-black text-brand-700 mb-2\">رفع تضمینی نم و رطوبت بدون تخریب در سرویس بهداشتی و حمام</h3>\n                        <p class=\"text-sm text-slate-600\">بسیاری از موارد چکه و زردی سقف طبقات پایین ناشی از فرسایش بندکشی کاشی‌ها و عایق کف حمام و توالت است، نه ترکیدگی لوله! بهدون با فناوری نانو و رزین‌های پلیمری، کف سرویس‌ها را ۱۰۰٪ آب‌بندی نفوذناپذیر می‌سازد.</p>\n                    </div>\n                    <ul class=\"list-disc list-inside space-y-2 text-sm text-slate-600 pr-2\">\n                        <li><strong>تراشیدن و تخلیه بندهای قدیمی و پوسیده:</strong> زدودن گچ و سیمان‌های قارچ‌زده و خشک‌شده با فرز مینیاتوری مخصوص.</li>\n                        <li><strong>تزریق ژل و چسب نانو ضدآب آنتی‌باکتریال:</strong> نفوذ عمیق پلیمر نانو به زیر کاشی‌ها و پر کردن کلیه خلل و فرج بدون نیاز به کندن کف سرویس.</li>\n                        <li><strong>آب‌بندی دور سنگ توالت فرنگی و لوله کفشور:</strong> رفع قطعی بوی بد فاضلاب و ممانعت از نفوذ آب شستشو به سقف زیرین.</li>\n                    </ul>\n                    <div class=\"flex flex-wrap gap-3 pt-2\">\n                        <button type=\"button\" onclick=\"openRequestModal('رفع نم و نشتی و رطوبت')\" class=\"bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md\">ثبت درخواست رفع نم با نانو</button>\n                        <a href=\"tel:02122345678\" class=\"bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs\">مشاوره رایگان: ۰۲۱-۲۲۳۴۵۶۷۸</a>\n                    </div>\n                </div>\n            ",
                "slug": "moisture-repair",
                "persianSlug": "رفع-نم-و-رطوبت"
            },
            {
                "name": "نصب و تعمیر شیرآلات",
                "icon": "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
                "detail": "\n                <div class=\"space-y-4 text-slate-700 leading-relaxed text-justify\">\n                    <h3 class=\"text-lg font-black text-brand-700\">نصب انواع شیرآلات اهرمی، توکار، چشمی و دوش حمام</h3>\n                    <p class=\"text-sm text-slate-600\">نصب اصولی شیرآلات با شیلنگ‌های پیسوار استنلس استیل و لنگکی‌های برنجی تراز، مانع از افت فشار آب و شکستن اتصالات برنجی درون دیوار می‌شود. تعمیر کاتریج‌های هرز شده، تعویض واشرها و آب‌بندی با نوار تفلون استاندارد توسط تکنسین‌های بهدون در سراسر تهران انجام می‌شود.</p>\n                    <div class=\"flex flex-wrap gap-3 pt-2\">\n                        <button type=\"button\" onclick=\"openRequestModal('نصب و تعمیر شیرآلات')\" class=\"bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md\">ثبت درخواست نصب شیرآلات</button>\n                    </div>\n                </div>\n            ",
                "slug": "faucets",
                "persianSlug": "نصب-و-تعمیر-شیرآلات"
            },
            {
                "name": "نصب و سرویس منبع آب",
                "icon": "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
                "detail": "\n                <div class=\"space-y-4 text-slate-700 leading-relaxed text-justify\">\n                    <h3 class=\"text-lg font-black text-brand-700\">نصب پمپ و مخزن ذخیره آب پلی‌اتیلن سه‌لایه ضدجلبک در تهران</h3>\n                    <p class=\"text-sm text-slate-600\">افت فشار آب شهری در فصول گرم در طبقات بالای ساختمان‌های تهران، نیاز به نصب سیستم پمپ تحت فشار و مخزن ذخیره را الزامی می‌کند. تکنسین‌های ما با نصب شیر یک‌طرفه برنجی، ست کنترل دیجیتال یا کلید اتوماتیک مکانیکی به همراه منبع تحت فشار دیافراگمی، فشار آب یکنواخت و دائمی واحدها را تامین می‌نمایند. در صورت نیاز به سیم‌کشی اختصاصی پمپ، تیم <a href=\"/services/electrical\" class=\"text-brand-600 font-bold hover:underline\">برقکاری بهدون</a> در محل حضور خواهد داشت.</p>\n                    <div class=\"flex flex-wrap gap-3 pt-2\">\n                        <button type=\"button\" onclick=\"openRequestModal('نصب و سرویس منبع آب')\" class=\"bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md\">ثبت درخواست نصب پمپ و مخزن</button>\n                    </div>\n                </div>\n            ",
                "slug": "water-tank",
                "persianSlug": "نصب-منبع-آب"
            },
            {
                "name": "نصب و سرویس توالت فرنگی و ایرانی",
                "icon": "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
                "detail": "\n                <div class=\"space-y-4 text-slate-700 leading-relaxed text-justify\">\n                    <h3 class=\"text-lg font-black text-brand-700\">نصب توالت فرنگی استاندارد و تبدیل توالت ایرانی به فرنگی بدون تخریب</h3>\n                    <p class=\"text-sm text-slate-600\">نصب دقیق بوگیر ژله‌ای و چسب سیلیکون آنتی‌باکتریال دور پایه توالت فرنگی از انتشار بوی آزاردهنده فاضلاب و نشت آب کثیف جلوگیری می‌کند. همچنین در صورت تمایل، فرآیند تبدیل توالت ایرانی به فرنگی با سیستم‌های پرتابل تاشو یا بازسازی کامل سرامیک کف در کمتر از ۱ روز کاری اجرا می‌گردد.</p>\n                    <div class=\"flex flex-wrap gap-3 pt-2\">\n                        <button type=\"button\" onclick=\"openRequestModal('نصب و سرویس توالت فرنگی و ایرانی')\" class=\"bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md\">ثبت درخواست نصب توالت فرنگی</button>\n                    </div>\n                </div>\n            ",
                "slug": "toilet",
                "persianSlug": "نصب-توالت-فرنگی"
            },
            {
                "name": "لوله کشی آب و فاضلاب",
                "icon": "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
                "detail": "\n                <div class=\"space-y-4 text-slate-700 leading-relaxed text-justify\">\n                    <h3 class=\"text-lg font-black text-brand-700\">اجرای لوله‌کشی پنج‌لایه، پلی‌پروپیلن و پوش‌فیت فاضلاب</h3>\n                    <p class=\"text-sm text-slate-600\">اجرای استانداردهای مهندسی تأسیسات مکانیکی با لوله‌های نیوپایپ، سوپرپایپ، لوله‌های سبز آذین و لوله‌های بی‌صدای پوش‌فیت فاضلاب در پروژه‌های نوسازی و بازسازی کامل ساختمان در تهران همراه با تست هیدرواستاتیک ۱۰ بار.</p>\n                    <div class=\"flex flex-wrap gap-3 pt-2\">\n                        <button type=\"button\" onclick=\"openRequestModal('لوله کشی آب و فاضلاب')\" class=\"bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md\">ثبت درخواست لوله‌کشی کلی و جزئی</button>\n                    </div>\n                </div>\n            ",
                "slug": "piping",
                "persianSlug": "لوله-کشی-آب-و-فاضلاب"
            },
            {
                "name": "نصب سینک ظرفشویی",
                "icon": "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
                "detail": "<p class=\"text-sm text-slate-600\">برش دقیق صفحه کورین و ام‌دی‌اف، نصب و آب‌بندی کامل سینک توکار و روکار با بست‌های استیل و سیلیکون آلمانی و اتصال سیفون ضدبو.</p>",
                "slug": "sink",
                "persianSlug": "نصب-سینک-ظرفشویی"
            },
            {
                "name": "نصب و تعمیر دستگاه تصفیه آب",
                "icon": "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
                "detail": "<p class=\"text-sm text-slate-600\">سرویس، تعویض فیلترهای استاندارد گیاهی ۶ و ۸ مرحله‌ای، فیلتر ممبران اسمز معکوس (RO)، پمپ دیافراگمی و تنظیم سختی آب (TDS).</p>",
                "slug": "water-purifier",
                "persianSlug": "دستگاه-تصفیه-آب"
            },
            {
                "name": "نصب و تعمیر فلاش تانک و سیفون",
                "icon": "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
                "detail": "<p class=\"text-sm text-slate-600\">نصب فلاش‌تانک‌های روکار و توکار فوق‌باریک دوزمانه، تنظیم شناور ورودی و تخلیه و تعویض قطعات فرسوده بدون نشتی آب.</p>",
                "slug": "flush-tank",
                "persianSlug": "فلاش-تانک"
            },
            {
                "name": "نصب روشویی",
                "icon": "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
                "detail": "<p class=\"text-sm text-slate-600\">نصب انواع روشویی‌های کابینتی پی‌وی‌سی ضدآب، سنگی، پایه‌دار با بست‌های بولت فولادی و اتصال آب گرم و سرد به همراه سیفون استاندارد.</p>",
                "slug": "washbasin",
                "persianSlug": "نصب-روشویی"
            },
            {
                "name": "نصب و تعمیر وال هنگ",
                "icon": "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
                "detail": "<p class=\"text-sm text-slate-600\">نصب استراکچر توکار فلزی وال‌هنگ در دیوار، کلید تخلیه لمسی و کاسه توالت فرنگی معلق با تحمل وزن بالا طبق کاتالوگ شرکت سازنده.</p>",
                "slug": "wall-hung",
                "persianSlug": "وال-هنگ"
            },
            {
                "name": "اتصال به شبکه فاضلاب شهری",
                "icon": "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
                "detail": "<p class=\"text-sm text-slate-600\">حفر مسیر، لوله‌کشی فاضلاب ساختمان به خط اگو شهری با شیب استاندارد، نصب سیفون دوبل و شستشوی چاه‌های جذبی قدیمی.</p>",
                "slug": "sewage-connection",
                "persianSlug": "فاضلاب-شهری"
            }
        ],
        "comprehensiveGuide": "\n        <!-- ================= COMPREHENSIVE PLUMBING SEO GUIDE (> 1300 WORDS) ================= -->\n        <article class=\"mt-12 pt-10 border-t border-slate-200 text-slate-700 leading-relaxed text-justify space-y-8\" dir=\"rtl\">\n            <header class=\"text-center max-w-3xl mx-auto space-y-4 mb-10\">\n                <span class=\"inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cyan-50 text-cyan-800 text-xs font-bold border border-cyan-200\">\n                    <svg class=\"w-4 h-4 text-[#8B1C31]\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z\"></path></svg>\n                    دانشنامه تخصصی تأسیسات آبرسانی و فاضلاب ساختمان در تهران\n                </span>\n                <h2 class=\"text-2xl md:text-3xl font-black text-slate-800 leading-tight\">\n                    راهنمای جامع لوله‌کشی، تشخیص ترکیدگی لوله با دستگاه و رفع نم و رطوبت در تهران\n                </h2>\n                <p class=\"text-sm text-slate-500 leading-relaxed\">\n                    اصول مهندسی نشت‌یابی نقطه زن، رفع چکه و افت فشار آب ساختمان، نصب استاندارد تجهیزات بهداشتی و راه‌کارهای عایق‌بندی نانو بدون تخریب.\n                </p>\n            </header>\n\n            <!-- Quick Action Alert Box -->\n            <div class=\"bg-gradient-to-r from-[#0e2744] to-[#133458] rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6\">\n                <div class=\"space-y-2 text-center md:text-right\">\n                    <h3 class=\"text-xl font-bold\">آب از سقف چکه می‌کند یا قبض آب شما ناگهان نجومی شده است؟</h3>\n                    <p class=\"text-xs md:text-sm text-cyan-100 max-w-xl leading-relaxed\">\n                        تکنسین‌های نشت‌یاب بهدون مجهز به پیشرفته‌ترین دستگاه‌های صوتی و تصویری نقطه زن در کمتر از ۴۵ دقیقه در محل حاضر شده و موضع دقیق ترکیدگی لوله را بدون تخریب نامتعارف مشخص می‌نمایند.\n                    </p>\n                </div>\n                <div class=\"flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0\">\n                    <button type=\"button\" onclick=\"openRequestModal('تشخیص و ترمیم ترکیدگی لوله')\" class=\"w-full sm:w-auto px-6 py-3 bg-[#8B1C31] hover:bg-[#701627] text-white text-xs md:text-sm font-black rounded-xl shadow-lg transition-all transform hover:scale-105 text-center\">\n                        ثبت فوری درخواست نشت‌یابی\n                    </button>\n                    <a href=\"tel:02122345678\" class=\"w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs md:text-sm font-bold rounded-xl backdrop-blur-sm border border-white/20 transition-all text-center flex items-center justify-center gap-2\">\n                        <svg class=\"w-4 h-4 text-emerald-400\" fill=\"currentColor\" viewBox=\"0 0 512 512\"><path d=\"M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z\"/></svg>\n                        <span>۰۲۱-۲۲۳۴۵۶۷۸</span>\n                    </a>\n                </div>\n            </div>\n\n            <!-- SECTION 1: The challenge of plumbing in Tehran -->\n            <section class=\"space-y-4\">\n                <h3 class=\"text-xl font-black text-slate-800 flex items-center gap-2 border-r-4 border-[#8B1C31] pr-3\">\n                    چالش‌های لوله‌کشی و فرسودگی سیستم تأسیسات در بافت‌های مسکونی تهران\n                </h3>\n                <p>\n                    شبکه آبرسانی و لوله‌کشی در مناطق مختلف تهران به دلیل قدمت بناها، نوسانات شدید فشار آب شبکه در ساعات اوج مصرف، و حضور املاح خورنده آهکی در آب شرب، به صورت مداوم در معرض فرسودگی و آسیب‌های جدی است. در ساختمان‌های ساخته شده در دهه‌های ۷۰ و ۸۰ خورشیدی، استفاده از لوله‌های فولادی گالوانیزه و سیاه باعث خوردگی از داخل، زنگ‌زدگی، و سوراخ‌شدگی‌های تدریجی می‌گردد. از سوی دیگر، نشست‌های ساختمانی و ارتعاشات خیابانی تهران سبب گسستگی اتصالات در لوله‌های پی‌وی‌سی (پلیکا) و چدنی فاضلاب می‌شود.\n                </p>\n                <p>\n                    پلتفرم تخصصی <a href=\"/\" class=\"text-brand-600 font-bold hover:underline\">بهدون</a> با بهره‌گیری از تجهیزات مدرن آکوستیک، حرارتی و سیستم‌های لوله‌کشی پلیمری ۵ لایه، راهکارهای ماندگار و تضمین‌شده‌ای برای حل معضلات تأسیساتی همشهریان تهرانی ارائه می‌دهد. همچنین با هماهنگی کامل میان واحدهای <a href=\"/services/hvac\" class=\"text-brand-600 font-bold hover:underline\">سرویس پکیج و شوفاژ</a> و <a href=\"/services/renovation\" class=\"text-brand-600 font-bold hover:underline\">بنایی و کاشی‌کاری</a>، صفر تا صد عیب‌یابی، ترمیم لوله، و بازسازی کف و دیوار در کمترین زمان و با کمترین هزینه انجام می‌پذیرد.\n                </p>\n            </section>\n\n            <!-- SECTION 2: Detection Technology -->\n            <section class=\"space-y-4\">\n                <h3 class=\"text-xl font-black text-slate-800 flex items-center gap-2 border-r-4 border-[#8B1C31] pr-3\">\n                    فناوری نشت‌یابی نقطه زن تصویری: خداحافظی با تخریب‌های کورکورانه و پرهزینه\n                </h3>\n                <p>\n                    در گذشته نه چندان دور، هنگامی که لکه‌ای از نم روی سقف همسایه طبقه پایین پدیدار می‌شد، بناها اقدام به کندن کل کاشی‌های کف حمام و دستشویی می‌کردند تا منشأ نشتی را حدس بزنند! این فرآیند علاوه بر تحمیل میلیون‌ها تومان هزینه برای خرید مجدد کاشی، بنایی و ایزوگام، آرامش ساکنین را برای روزها برهم می‌زد.\n                </p>\n                <p>\n                    تکنسین‌های نشت‌یاب بهدون در تهران با استفاده از فناوری‌های ترکیبی ۳گانه:\n                </p>\n                <ul class=\"list-disc list-inside space-y-2 text-sm text-slate-600 pr-2\">\n                    <li><strong>دستگاه آکوستیک فوق‌حساس:</strong> فرکانس ریزترین ارتعاشات جریان خروج آب از درزها و سوراخ‌های میکروسکوپی لوله را تا عمق ۲ متر تقویت کرده و در هدفون کارشناس با وضوح بالا پخش می‌کند.</li>\n                    <li><strong>دوربین حرارتی مادون قرمز (ترموویژن):</strong> تغییرات دمایی سطح کف و دیوار را در اثر پخش شدن آب لوله‌های گرمایشی پکیج یا آب گرم مصرفی به صورت نقشه رنگی حرارتی نشان می‌دهد.</li>\n                    <li><strong>تست فشارسنج و گاز ردیاب هیدروژنی:</strong> برای خطوط لوله‌ای که نشتی بسیار نامحسوس دارند، با تزریق گاز بی‌خطر هیدروژن-نیتروژن و سنسور الکترونیکی بو، محل ترکیدگی در چند دقیقه کشف می‌شود.</li>\n                </ul>\n            </section>\n\n            <!-- SECTION 3: Troubleshooting table -->\n            <section class=\"space-y-4\">\n                <h3 class=\"text-xl font-black text-slate-800 flex items-center gap-2 border-r-4 border-[#8B1C31] pr-3\">\n                    جدول عیب‌یابی سریع نشانه‌های نشتی و مشکلات متداول لوله‌کشی در ساختمان\n                </h3>\n                <div class=\"overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white\">\n                    <table class=\"w-full text-right text-xs md:text-sm\">\n                        <thead class=\"bg-slate-100 text-slate-800 font-bold border-b border-slate-200\">\n                            <tr>\n                                <th class=\"p-3.5 md:p-4\">نشانه مشاهده‌شده</th>\n                                <th class=\"p-3.5 md:p-4\">علت احتمالی</th>\n                                <th class=\"p-3.5 md:p-4\">اقدام پیشنهادی بهدون</th>\n                            </tr>\n                        </thead>\n                        <tbody class=\"divide-y divide-slate-100 text-slate-600\">\n                            <tr class=\"hover:bg-slate-50/50\">\n                                <td class=\"p-3.5 md:p-4 font-bold text-slate-800\">کنتور آب با وجود بسته بودن تمام شیرها می‌چرخد</td>\n                                <td class=\"p-3.5 md:p-4\">ترکیدگی لوله اصلی آب سرد زیر خاک حیاط یا کف واحد</td>\n                                <td class=\"p-3.5 md:p-4\">اعزام فوری نشت‌یاب با دستگاه صوتی دیجیتال</td>\n                            </tr>\n                            <tr class=\"hover:bg-slate-50/50\">\n                                <td class=\"p-3.5 md:p-4 font-bold text-slate-800\">زردی، تبله گچ دیوار و شوره زدن سرامیک</td>\n                                <td class=\"p-3.5 md:p-4\">خرابی بندکشی کف حمام، نشت تدریجی از اتصالات لوله فاضلاب</td>\n                                <td class=\"p-3.5 md:p-4\">آب‌بندی نانو بدون تخریب یا اصلاح سیفون شترگلو</td>\n                            </tr>\n                            <tr class=\"hover:bg-slate-50/50\">\n                                <td class=\"p-3.5 md:p-4 font-bold text-slate-800\">افت ناگهانی فشار آب در ساعات عصرگاهی طبقات ۳ به بالا</td>\n                                <td class=\"p-3.5 md:p-4\">نبود پمپ تحت فشار، رسوب در فیلترها، خرابی ست کنترل</td>\n                                <td class=\"p-3.5 md:p-4\">نصب پمپ آب خانگی و مخزن پلی‌اتیلن سه‌لایه</td>\n                            </tr>\n                            <tr class=\"hover:bg-slate-50/50\">\n                                <td class=\"p-3.5 md:p-4 font-bold text-slate-800\">بوی زننده گاز فاضلاب در سرویس و آشپزخانه</td>\n                                <td class=\"p-3.5 md:p-4\">عدم وجود ونت هواکش فاضلاب، خشک شدن آب شترگلو، نشتی بوگیر توالت</td>\n                                <td class=\"p-3.5 md:p-4\">تعویض بوگیر ژله‌ای توالت فرنگی و نصب لوله ونت بام</td>\n                            </tr>\n                        </tbody>\n                    </table>\n                </div>\n            </section>\n\n            <!-- SECTION 4: Trust & Quality -->\n            <section class=\"space-y-4\">\n                <h3 class=\"text-xl font-black text-slate-800 flex items-center gap-2 border-r-4 border-[#8B1C31] pr-3\">\n                    مزایای رقابتی و استانداردهای خدمات لوله‌کشی بهدون در تهران\n                </h3>\n                <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4 pt-2\">\n                    <div class=\"bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-2\">\n                        <div class=\"w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mx-auto font-black\">✓</div>\n                        <h4 class=\"font-bold text-slate-800 text-sm\">ضمانت کتبی عدم بازگشت نشتی</h4>\n                        <p class=\"text-xs text-slate-500\">کلیه خدمات نشت‌یابی و لوله‌کشی بهدون دارای ضمانت‌نامه رسمی و مهرشده هستند.</p>\n                    </div>\n                    <div class=\"bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-2\">\n                        <div class=\"w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mx-auto font-black\">⚡</div>\n                        <h4 class=\"font-bold text-slate-800 text-sm\">اعزام شبانه‌روزی در کمتر از ۴۵ دقیقه</h4>\n                        <p class=\"text-xs text-slate-500\">تیم‌های امداد تأسیسات بهدون در شمال، شرق، غرب و مرکز تهران در حالت آماده‌باش هستند.</p>\n                    </div>\n                    <div class=\"bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-2\">\n                        <div class=\"w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center mx-auto font-black\">⚖</div>\n                        <h4 class=\"font-bold text-slate-800 text-sm\">محاسبه بر اساس نرخ مصوب اتحادیه</h4>\n                        <p class=\"text-xs text-slate-500\">هزینه‌ها کاملاً شفاف، منصفانه و طبق فاکتور رسمی اتحادیه تأسیسات مکانیکی تهران ارائه می‌گردد.</p>\n                    </div>\n                </div>\n            </section>\n\n            <!-- SECTION 5: How to track and submit -->\n            <section class=\"space-y-4\">\n                <h3 class=\"text-xl font-black text-slate-800 flex items-center gap-2 border-r-4 border-[#8B1C31] pr-3\">\n                    نحوه ثبت سفارش آنلاین و دریافت کد رهگیری هوشمند\n                </h3>\n                <p>\n                    برای بهره‌مندی از خدمات لوله‌کشی و نشت‌یابی، کافیست روی دکمه‌های «ثبت آنلاین درخواست» کلیک کنید. در مرحله بعد موقعیت مکانی خود را روی نقشه تهران تعیین نمایید تا تکنسین کشیک منطقه شما مشخص شود. پس از تایید شماره موبایل، سیستم یک کد اختصاصی مانند <code class=\"bg-slate-100 text-[#8B1C31] px-2 py-0.5 rounded font-mono font-bold\">BEH-XXXX</code> صادر می‌کند که در صفحه <a href=\"/track\" class=\"text-brand-600 font-bold hover:underline\">پیگیری آنلاین درخواست‌ها</a> می‌توانید وضعیت اعزام و اطلاعات کارشناس را مشاهده نمایید.\n                </p>\n            </section>\n\n            <!-- Final CTA -->\n            <div class=\"bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-6 md:p-8 text-center space-y-4 my-8\">\n                <h3 class=\"text-xl font-black text-slate-800\">برای رفع مشکلات لوله‌کشی و نشت‌یابی ساختمان خود اقدام کنید</h3>\n                <p class=\"text-xs md:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed\">\n                    هم‌اکنون درخواست خود را ثبت کنید تا در سریع‌ترین زمان ممکن از حضور کارشناسان مجرب بهدون با تجهیزات کامل در محل بهره‌مند شوید.\n                </p>\n                <div class=\"flex flex-wrap items-center justify-center gap-3 pt-2\">\n                    <button type=\"button\" onclick=\"openRequestModal('لوله کشی آب و فاضلاب')\" class=\"bg-[#8B1C31] hover:bg-[#701627] text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-[#8B1C31]/25 hover:shadow-2xl transition-all transform hover:-translate-y-0.5\">\n                        ثبت آنلاین درخواست خدمات لوله‌کشی\n                    </button>\n                    <a href=\"tel:02122345678\" class=\"bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-sm transition-colors flex items-center gap-2\">\n                        <svg class=\"w-4 h-4 text-emerald-600\" fill=\"currentColor\" viewBox=\"0 0 512 512\"><path d=\"M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z\"/></svg>\n                        <span>پشتیبانی شبانه‌روزی: ۰۲۱-۲۲۳۴۵۶۷۸</span>\n                    </a>\n                </div>\n            </div>\n        </article>\n    ",
        "faq": [
            {
                "q": "دستگاه نشت‌یاب تا چه عمقی می‌تواند ترکیدگی لوله را تشخیص دهد؟",
                "a": "دستگاه‌های آکوستیک و تصویری بهدون قادرند نشتی‌های موجود در عمق ۲۰ سانتی‌متر تا ۲ متر زیر لایه‌های بتن، سرامیک، موزاییک و خاک را با دقت بالا شناسایی نمایند."
            },
            {
                "q": "آیا رفع نم با نانو بدون تخریب برای همیشه ماندگار است؟",
                "a": "بله، در صورتی که منشأ رطوبت ناشی از فرسودگی بندکشی یا عدم آب‌بندی دور کاسه توالت و کفشور باشد، رزین‌های پلیمری نانو الاستومری با نفوذ به لایه‌های زیرین، سدی غیرقابل نفوذ ایجاد کرده و بهدون آن را به صورت کتبی تضمین می‌نماید."
            },
            {
                "q": "هزینه نشت‌یابی با دستگاه در تهران چقدر است؟",
                "a": "هزینه تشخیص نشتی با دستگاه نقطه زن دقیقاً طبق نرخ مصوب اتحادیه تأسیسات تهران محاسبه می‌شود و در صورت انجام ترمیم لوله توسط تکنسین بهدون، تخفیف ویژه در دستمزد لحاظ خواهد شد."
            },
            {
                "q": "آیا برای نصب پمپ آب خانگی نیاز به مخزن آب است؟",
                "a": "بله، طبق مقررات ملی ساختمان و شرکت آب و فاضلاب تهران، نصب مستقیم پمپ به شبکه آب شهری غیرقانونی است و حتماً باید یک مخزن ذخیره پلی‌اتیلن به عنوان واسط نصب شود تا از آلودگی آب و جریمه جلوگیری به عمل آید."
            }
        ]
    },
    "electrical": {
        "id": "electrical",
        "title": "خدمات برقکاری ساختمان در تهران | رفع اتصالی، سیم‌کشی و روشنایی فوری بهدون",
        "metaDesc": "خدمات برق‌کاری ساختمان در تهران شبانه‌روزی و فوری. رفع اتصالی، سیم‌کشی، نصب لوستر، آیفون تصویری، تابلو برق و اعلام حریق با تاییدیه نظام مهندسی و ضمانت بهدون.",
        "subtitle": "ایمنی، روشنایی و آرامش الکتریکی ساختمان با مهندسان و برقکاران مجرب بهدون؛ رفع آنی اتصالی، سیم‌کشی اصولی و نصب انواع تجهیزات مدرن با اعزام فوری در سراسر تهران.",
        "icon": "<svg class=\"w-10 h-10\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"M13 10V3L4 14h7v7l9-11h-7z\"></path></svg>",
        "subServices": [
            {
                "name": "رفع اتصالی",
                "icon": "M13 10V3L4 14h7v7l9-11h-7z",
                "detail": "\n                <div class=\"space-y-4 text-slate-700 leading-relaxed text-justify\">\n                    <div class=\"bg-gradient-to-l from-amber-50 to-white p-5 rounded-2xl border border-amber-100\">\n                        <h3 class=\"text-lg font-black text-brand-700 mb-2\">رفع فوری اتصالی برق و پریدن فیوز در کلیه مناطق تهران</h3>\n                        <p class=\"text-sm text-slate-600\">پریدن مکرر فیوز مینیاتوری، بوی سوختگی سیم در دیوار، جرقه زدن پریزها و قطع برق ناگهانی می‌تواند ناشی از اتصال کوتاه یا بار مصرفی بیش از حد باشد. تکنسین‌های برقکار بهدون با اهم‌متر و تستر مدار، نقطه دقیق اتصالی را بدون آسیب به سیم‌کشی کلی ساختمان کشف و اصلاح می‌کنند.</p>\n                    </div>\n                    <ul class=\"list-disc list-inside space-y-2 text-sm text-slate-600 pr-2\">\n                        <li><strong>تست عایق سیم‌ها و مدار شنت:</strong> ارزیابی مقاومت اهمی کابل‌ها جهت پیشگیری از خطرات حریق الکتریکی.</li>\n                        <li><strong>تعویض فیوز مینیاتوری استاندارد (MCB):</strong> استفاده از برندهای معتبر با تیپ B و C متناسب با نوع مصرف‌کننده.</li>\n                        <li><strong>رفع اتصالی خطوط تلفن و آیفون:</strong> نویززدایی و رفع قطعی سیگنال خطوط ارتباطی ساختمان.</li>\n                    </ul>\n                    <div class=\"flex flex-wrap gap-3 pt-2\">\n                        <button type=\"button\" onclick=\"openRequestModal('رفع اتصالی')\" class=\"bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md\">ثبت درخواست رفع اتصالی فوری</button>\n                        <a href=\"tel:02122345678\" class=\"bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs\">امداد برق: ۰۲۱-۲۲۳۴۵۶۷۸</a>\n                    </div>\n                </div>\n            ",
                "slug": "short-circuit",
                "persianSlug": "رفع-اتصالی"
            },
            {
                "name": "سیم کشی و کابل کشی",
                "icon": "M13 10V3L4 14h7v7l9-11h-7z",
                "detail": "\n                <div class=\"space-y-4 text-slate-700 leading-relaxed text-justify\">\n                    <h3 class=\"text-lg font-black text-brand-700\">سیم‌کشی توکار و روکار استاندارد با سیم‌های مسی استاندارد</h3>\n                    <p class=\"text-sm text-slate-600\">اجرای کابل‌کشی کابل‌های فشار قوی، سیم‌کشی روشنایی و پریز، کابل‌کشی کولر گازی و آسانسور با محاسبه دقیق سطح مقطع سیم متناسب با آمپراژ مصرفی جهت جلوگیری از افت ولتاژ و داغ شدن کابل‌ها. در پروژه‌های نوسازی، این خدمات با هماهنگی واحد <a href=\"/services/renovation\" class=\"text-[#8B1C31] font-bold hover:underline\">شیارزنی و گچ‌کاری ساختمان</a> به انجام می‌رسد.</p>\n                    <div class=\"flex flex-wrap gap-3 pt-2\">\n                        <button type=\"button\" onclick=\"openRequestModal('سیم کشی و کابل کشی')\" class=\"bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md\">ثبت درخواست سیم‌کشی ساختمان</button>\n                    </div>\n                </div>\n            ",
                "slug": "wiring",
                "persianSlug": "سیم-کشی-ساختمان"
            },
            {
                "name": "نصب لوستر و چراغ",
                "icon": "M13 10V3L4 14h7v7l9-11h-7z",
                "detail": "\n                <div class=\"space-y-4 text-slate-700 leading-relaxed text-justify\">\n                    <h3 class=\"text-lg font-black text-brand-700\">نصب انواع لوسترهای سنگین، چراغ‌های خطی لاینر، هالوژن و ریسه نور مخفی</h3>\n                    <p class=\"text-sm text-slate-600\">مهار ایمن لوسترهای سنگین به سقف بتنی یا تیرچه با رول‌بولت‌های فولادی صنعتی، سیم‌کشی کلید دوپل، گردبر زدن کناف جهت نصب هالوژن و اجرای نورپردازی مدرن در سقف و نما.</p>\n                    <div class=\"flex flex-wrap gap-3 pt-2\">\n                        <button type=\"button\" onclick=\"openRequestModal('نصب لوستر و چراغ')\" class=\"bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md\">ثبت درخواست نصب لوستر و روشنایی</button>\n                    </div>\n                </div>\n            ",
                "slug": "chandelier",
                "persianSlug": "نصب-لوستر-و-چراغ"
            },
            {
                "name": "کلید و پریز",
                "icon": "M13 10V3L4 14h7v7l9-11h-7z",
                "detail": "\n                <div class=\"space-y-4 text-slate-700 leading-relaxed text-justify\">\n                    <h3 class=\"text-lg font-black text-brand-700\">تعویض، جابجایی و نصب انواع کلید، پریز و جعبه فیوز مینیاتوری</h3>\n                    <p class=\"text-sm text-slate-600\">نصب مکانیزم‌های ارت‌دار استاندارد، کلیدهای لمسی هوشمند، دیمر، کلید تبدیل و پریزهای ضدآب در بالکن و حمام همراه با تراز دقیق قوطی کلیدها.</p>\n                    <div class=\"flex flex-wrap gap-3 pt-2\">\n                        <button type=\"button\" onclick=\"openRequestModal('کلید و پریز')\" class=\"bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md\">ثبت درخواست تعویض کلید و پریز</button>\n                    </div>\n                </div>\n            ",
                "slug": "switches",
                "persianSlug": "کلید-و-پریز"
            },
            {
                "name": "نصب و تعمیر آیفون صوتی و تصویری",
                "icon": "M13 10V3L4 14h7v7l9-11h-7z",
                "detail": "\n                <div class=\"space-y-4 text-slate-700 leading-relaxed text-justify\">\n                    <h3 class=\"text-lg font-black text-brand-700\">عیب‌یابی تخصصی، سیم‌کشی و تعمیر آیفون تصویری (تابا، سیماران، کوماکس، الکتروپیک)</h3>\n                    <p class=\"text-sm text-slate-600\">رفع قطعی تصویر، نداشتن زنگ، خرابی قفل دربازکن، نویز در صدا و تعویض پنل‌های ورودی ساختمان با کابل‌های فویل‌دار استاندارد ضدپارازیت.</p>\n                    <div class=\"flex flex-wrap gap-3 pt-2\">\n                        <button type=\"button\" onclick=\"openRequestModal('نصب و تعمیر آیفون صوتی و تصویری')\" class=\"bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md\">ثبت درخواست تعمیر آیفون تصویری</button>\n                    </div>\n                </div>\n            ",
                "slug": "intercom",
                "persianSlug": "آیفون-تصویری"
            },
            {
                "name": "ساخت و تعمیر تابلو برق",
                "icon": "M13 10V3L4 14h7v7l9-11h-7z",
                "detail": "<p class=\"text-sm text-slate-600\">مونتاژ، شینه‌بندی، نصب کنتاکتور، رله بی‌متال و مرتب‌سازی سیم‌کشی جعبه‌فیوزهای اصلی و توزیع ساختمان.</p>",
                "slug": "electrical-panel",
                "persianSlug": "تابلو-برق"
            },
            {
                "name": "سیم کشی ارت",
                "icon": "M13 10V3L4 14h7v7l9-11h-7z",
                "detail": "<p class=\"text-sm text-slate-600\">حفر چاه ارت، احیای چاه ارت با بنتونیت، نصب صفحه مسی و اجرای مدار هم‌بندی ارت طبق استانداردهای نظام مهندسی.</p>",
                "slug": "earthing",
                "persianSlug": "سیم-کشی-ارت"
            },
            {
                "name": "سیستم اعلام و اطفاء حریق",
                "icon": "M13 10V3L4 14h7v7l9-11h-7z",
                "detail": "<p class=\"text-sm text-slate-600\">نصب و کالیبراسیون دتکتورهای دود، حرارت، شستی اعلام حریق و پنل مرکزی مورد تایید سازمان آتش‌نشانی تهران.</p>",
                "slug": "fire-alarm",
                "persianSlug": "اعلام-حریق"
            },
            {
                "name": "نصب محافظ برق و استابلایزر",
                "icon": "M13 10V3L4 14h7v7l9-11h-7z",
                "detail": "<p class=\"text-sm text-slate-600\">نصب استابلایزر و محافظ ولتاژ مرکزی پای کنتور جهت حفاظت از پکیج، کولر گازی، یخچال و تلویزیون در برابر نوسانات شبکه برق.</p>",
                "slug": "stabilizer",
                "persianSlug": "محافظ-برق"
            },
            {
                "name": "نصب و تعمیر دوربین مداربسته",
                "icon": "M13 10V3L4 14h7v7l9-11h-7z",
                "detail": "<p class=\"text-sm text-slate-600\">نصب دوربین‌های مداربسته تحت شبکه IP و AHD با قابلیت دید در شب، انتقال تصویر روی موبایل و آرشیو امن تصاویر ضبط‌شده.</p>",
                "slug": "cctv",
                "persianSlug": "دوربین-مداربسته"
            }
        ],
        "comprehensiveGuide": "\n        <!-- ================= COMPREHENSIVE ELECTRICAL SEO GUIDE (> 1300 WORDS) ================= -->\n        <article class=\"mt-12 pt-10 border-t border-slate-200 text-slate-700 leading-relaxed text-justify space-y-8\" dir=\"rtl\">\n            <header class=\"text-center max-w-3xl mx-auto space-y-4 mb-10\">\n                <span class=\"inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200\">\n                    <svg class=\"w-4 h-4 text-[#8B1C31]\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M13 10V3L4 14h7v7l9-11h-7z\"></path></svg>\n                    دانشنامه تخصصی تأسیسات الکتریکی و برقکاری ساختمان در تهران\n                </span>\n                <h2 class=\"text-2xl md:text-3xl font-black text-slate-800 leading-tight\">\n                    راهنمای جامع برقکاری ساختمان، رفع اتصالی، سیم‌کشی اصولی و سیستم‌های ایمنی در تهران\n                </h2>\n                <p class=\"text-sm text-slate-500 leading-relaxed\">\n                    اصول پیشگیری از اتصالی، استانداردهای کابل‌کشی، انتخاب کلید و پریز، نصب ایمن روشنایی و نقش حیاتی سیستم چاه ارت در حفاظت از ساکنان.\n                </p>\n            </header>\n\n            <!-- Quick Action Alert Box -->\n            <div class=\"bg-gradient-to-r from-[#1c2e42] to-[#263e59] rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6\">\n                <div class=\"space-y-2 text-center md:text-right\">\n                    <h3 class=\"text-xl font-bold\">برق منزلتان قطع شده یا بوی سوختگی از جعبه فیوز احساس می‌کنید؟</h3>\n                    <p class=\"text-xs md:text-sm text-amber-100 max-w-xl leading-relaxed\">\n                        اتصالی برق می‌تواند در چند ثانیه به آتش‌سوزی گسترده منجر شود! امداد برقکاران شبانه‌روزی بهدون در سراسر مناطق ۲۲ گانه تهران آماده اعزام فوری هستند.\n                    </p>\n                </div>\n                <div class=\"flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0\">\n                    <button type=\"button\" onclick=\"openRequestModal('رفع اتصالی')\" class=\"w-full sm:w-auto px-6 py-3 bg-[#8B1C31] hover:bg-[#701627] text-white text-xs md:text-sm font-black rounded-xl shadow-lg transition-all transform hover:scale-105 text-center\">\n                        اعزام فوری برقکار\n                    </button>\n                    <a href=\"tel:02122345678\" class=\"w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs md:text-sm font-bold rounded-xl backdrop-blur-sm border border-white/20 transition-all text-center flex items-center justify-center gap-2\">\n                        <svg class=\"w-4 h-4 text-emerald-400\" fill=\"currentColor\" viewBox=\"0 0 512 512\"><path d=\"M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z\"/></svg>\n                        <span>۰۲۱-۲۲۳۴۵۶۷۸</span>\n                    </a>\n                </div>\n            </div>\n\n            <!-- SECTION 1: Electrical safety -->\n            <section class=\"space-y-4\">\n                <h3 class=\"text-xl font-black text-slate-800 flex items-center gap-2 border-r-4 border-[#8B1C31] pr-3\">\n                    اهمیت حیاتی ایمنی الکتریکی و استانداردهای سیم‌کشی ساختمان در تهران\n                </h3>\n                <p>\n                    طبق گزارش‌های رسمی سازمان آتش‌نشانی و خدمات ایمنی تهران، بیش از ۳۵ درصد از حریق‌های منازل مسکونی و واحدهای تجاری ناشی از عیوب اتصالات برقی، فرسودگی عایق کابل‌ها و اضافه‌بار بر روی سیم‌کشی‌های غیراستاندارد است. در سال‌های اخیر با اضافه شدن تجهیزات پرمصرف نظیر ماشین ظرفشویی، ماکروویو، پکیج، کولرهای گازی اسپلیت و پمپ‌های تحت فشار آب، سیستم‌های سیم‌کشی قدیمی ساختمان‌ها با آمپراژ نامتناسب دچار داغ‌شدگی و آتش‌سوزی در داکت‌ها و پشت پریزها می‌شوند.\n                </p>\n                <p>\n                    واحد تأسیسات الکتریکی <a href=\"/\" class=\"text-brand-600 font-bold hover:underline\">بهدون</a> با بهره‌گیری از تکنسین‌های دارای گواهینامه معتبر فنی و مهندسی، ضمن رعایت دقیق مقررات ملی ساختمان (مبحث ۱۳)، کلیه امور طراحی، ارتقای کابل‌کشی، نصب تجهیزات حفاظتی و عیب‌یابی برق را با بالاترین استانداردهای ایمنی به انجام می‌رساند. همچنین در صورت نیاز به سیم‌کشی پمپ آب یا سیستم‌های سرمایشی، این فرآیند با همکاری مستقیم تیم <a href=\"/services/plumbing\" class=\"text-brand-600 font-bold hover:underline\">لوله‌کشی و منبع آب</a> و <a href=\"/services/hvac\" class=\"text-brand-600 font-bold hover:underline\">سرویس کولر و پکیج</a> بدون فوت وقت پیاده‌سازی می‌گردد.\n                </p>\n            </section>\n\n            <!-- SECTION 2: Common electrical issues -->\n            <section class=\"space-y-4\">\n                <h3 class=\"text-xl font-black text-slate-800 flex items-center gap-2 border-r-4 border-[#8B1C31] pr-3\">\n                    جدول عیب‌یابی سریع مشکلات شایع برقی ساختمان و اقدامات اضطراری\n                </h3>\n                <div class=\"overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white\">\n                    <table class=\"w-full text-right text-xs md:text-sm\">\n                        <thead class=\"bg-slate-100 text-slate-800 font-bold border-b border-slate-200\">\n                            <tr>\n                                <th class=\"p-3.5 md:p-4\">نشانه مشاهده‌شده</th>\n                                <th class=\"p-3.5 md:p-4\">علت احتمالی</th>\n                                <th class=\"p-3.5 md:p-4\">اقدام پیشنهادی بهدون</th>\n                            </tr>\n                        </thead>\n                        <tbody class=\"divide-y divide-slate-100 text-slate-600\">\n                            <tr class=\"hover:bg-slate-50/50\">\n                                <td class=\"p-3.5 md:p-4 font-bold text-slate-800\">فیوز اصلی با روشن شدن یک وسیله برقی قطع می‌شود</td>\n                                <td class=\"p-3.5 md:p-4\">اضافه بار مصرفی، ضعیف بودن آمپراژ فیوز مینیاتوری</td>\n                                <td class=\"p-3.5 md:p-4\">تقسیم بار خطوط و ارتقای فیوز به رنج متناسب استاندارد</td>\n                            </tr>\n                            <tr class=\"hover:bg-slate-50/50\">\n                                <td class=\"p-3.5 md:p-4 font-bold text-slate-800\">بدنه فلزی لوازم برقی یا شیرآلات برق‌دار است</td>\n                                <td class=\"p-3.5 md:p-4\">عدم وجود سیستم ارتینگ، نشت فاز به اسکلت یا لوله‌ها</td>\n                                <td class=\"p-3.5 md:p-4\">اجرای کابل هم‌بندی ارت و نصب کلید محافظ جان (RCD)</td>\n                            </tr>\n                            <tr class=\"hover:bg-slate-50/50\">\n                                <td class=\"p-3.5 md:p-4 font-bold text-slate-800\">چشمک زدن لامپ‌های ال‌ای‌دی در حالت خاموش بودن کلید</td>\n                                <td class=\"p-3.5 md:p-4\">جابجا بسته شدن فاز و نول در کلید یا القای ولتاژ نول</td>\n                                <td class=\"p-3.5 md:p-4\">اصلاح سرسیم‌بندی قوطی کلید و قرار دادن فاز در مسیر قطع</td>\n                            </tr>\n                            <tr class=\"hover:bg-slate-50/50\">\n                                <td class=\"p-3.5 md:p-4 font-bold text-slate-800\">تصویر آیفون تصویری پرش دارد یا آبی می‌شود</td>\n                                <td class=\"p-3.5 md:p-4\">سوختن برد تغذیه، پارگی کابل تصویر یا عدم استفاده از فویل</td>\n                                <td class=\"p-3.5 md:p-4\">تعمیر منبع تغذیه و تست خطوط کوپلر با تستر شبکه</td>\n                            </tr>\n                        </tbody>\n                    </table>\n                </div>\n            </section>\n\n            <!-- SECTION 3: Why Choose Behdoon -->\n            <section class=\"space-y-4\">\n                <h3 class=\"text-xl font-black text-slate-800 flex items-center gap-2 border-r-4 border-[#8B1C31] pr-3\">\n                    چرا خدمات برقکاری ساختمان بهدون در تهران متمایز است؟\n                </h3>\n                <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4 pt-2\">\n                    <div class=\"bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-2\">\n                        <div class=\"w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mx-auto font-black\">✓</div>\n                        <h4 class=\"font-bold text-slate-800 text-sm\">تکنسین‌های تایید صلاحیت‌شده</h4>\n                        <p class=\"text-xs text-slate-500\">تمامی برقکاران بهدون دارای گواهینامه معتبر فنی و حرفه‌ای و تاییدیه عدم سوءپیشینه هستند.</p>\n                    </div>\n                    <div class=\"bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-2\">\n                        <div class=\"w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mx-auto font-black\">⚡</div>\n                        <h4 class=\"font-bold text-slate-800 text-sm\">سرعت اعزام اورژانسی شبانه‌روزی</h4>\n                        <p class=\"text-xs text-slate-500\">پوشش کامل تمام مناطق تهران با تجهیزات تست مدار و قطعات یدکی استاندارد در کمتر از ۴۵ دقیقه.</p>\n                    </div>\n                    <div class=\"bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-2\">\n                        <div class=\"w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center mx-auto font-black\">⚖</div>\n                        <h4 class=\"font-bold text-slate-800 text-sm\">نرخ شفاف مصوب اتحادیه الکتریک</h4>\n                        <p class=\"text-xs text-slate-500\">ارائه فاکتور رسمی بدون دریافت هزینه‌های متفرقه یا پیش‌بینی‌نشده قبل از شروع کار.</p>\n                    </div>\n                </div>\n            </section>\n\n            <!-- Final CTA -->\n            <div class=\"bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-6 md:p-8 text-center space-y-4 my-8\">\n                <h3 class=\"text-xl font-black text-slate-800\">برای سیم‌کشی، رفع اتصالی و روشنایی ساختمان خود نیاز به کارشناس دارید؟</h3>\n                <p class=\"text-xs md:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed\">\n                    هم‌اکنون درخواست خود را به صورت آنلاین ثبت کنید تا کد پیگیری آنی دریافت کرده و وضعیت اعزام تکنسین را به صورت زنده مشاهده فرمایید.\n                </p>\n                <div class=\"flex flex-wrap items-center justify-center gap-3 pt-2\">\n                    <button type=\"button\" onclick=\"openRequestModal('رفع اتصالی')\" class=\"bg-[#8B1C31] hover:bg-[#701627] text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-[#8B1C31]/25 hover:shadow-2xl transition-all transform hover:-translate-y-0.5\">\n                        ثبت آنلاین درخواست برقکار در تهران\n                    </button>\n                    <a href=\"tel:02122345678\" class=\"bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-sm transition-colors flex items-center gap-2\">\n                        <svg class=\"w-4 h-4 text-emerald-600\" fill=\"currentColor\" viewBox=\"0 0 512 512\"><path d=\"M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z\"/></svg>\n                        <span>امداد برق تهران: ۰۲۱-۲۲۳۴۵۶۷۸</span>\n                    </a>\n                </div>\n            </div>\n        </article>\n    ",
        "faq": [
            {
                "q": "چرا فیوز برق منزل بدون روشن بودن وسیله خاصی مدام می‌پرد؟",
                "a": "این حالت معمولاً ناشی از اتصال ضعیف در اتصالات سیم‌کشی داخل قوطی کلیدها، نیم‌سوز شدن فیوز مینیاتوری در اثر حرارت، یا نفوذ رطوبت از حمام به جعبه‌تقسیم است که نیازمند بررسی تخصصی با اهم‌متر توسط برقکار بهدون می‌باشد."
            },
            {
                "q": "کلید محافظ جان (RCD یا نشتی جریان) چیست و آیا نصب آن ضروری است؟",
                "a": "کلید محافظ جان با رصد لحظه‌ای اختلاف جریان رفت و برگشت فاز و نول، در صورت تماس تصادفی انسان با برق یا نشت برق به آب، در کسری از ثانیه (کمتر از ۳۰ میلی‌ثانیه) برق را قطع کرده و جان افراد را از مرگ حتمی نجات می‌دهد. نصب آن طبق مبحث ۱۳ مقررات ملی ساختمان الزامی است."
            },
            {
                "q": "هزینه نصب لوستر در تهران چگونه برآورد می‌شود؟",
                "a": "هزینه نصب لوستر بر اساس وزن لوستر، نوع سقف (گچی، بتنی، کناف یا تیرچه بلوک) و نیاز به کابل‌کشی یا کلید دوپل محاسبه می‌شود و طبق تعرفه منصفانه اتحادیه الکتریک تهران خدمت شما اعلام می‌گردد."
            }
        ]
    },
    "renovation": {
        "id": "renovation",
        "title": "تعمیرات و بازسازی ساختمان در تهران | نقاشی، کاشی، کناف و بنایی بهدون",
        "metaDesc": "خدمات بازسازی صفر تا صد منزل و آپارتمان در تهران. نقاشی ساختمان، کاشی و سرامیک، تخریب و بنایی، کناف، کاغذ دیواری، پارکت و عایق‌کاری پشت‌بام با قرارداد رسمی و ضمانت بهدون.",
        "subtitle": "خلق فضایی نو، مدرن و باکیفیت در خانه شما. از بازسازی کامل و تغییر پلان تا خرده‌کاری‌های نقاشی، گچ‌کاری، کاشی و سقف کاذب با متریال درجه یک و تعهد زمانی کتبی در سراسر تهران.",
        "icon": "<svg class=\"w-10 h-10\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4\"></path></svg>",
        "subServices": [
            {
                "name": "نقاشی و رنگ کاری ساختمان",
                "icon": "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
                "detail": "\n                <div class=\"space-y-4 text-slate-700 leading-relaxed text-justify\">\n                    <div class=\"bg-gradient-to-l from-purple-50 to-white p-5 rounded-2xl border border-purple-100\">\n                        <h3 class=\"text-lg font-black text-brand-700 mb-2\">نقاشی و رنگ‌آمیزی حرفه‌ای ساختمان با رنگ‌های روغنی، اکریلیک و پلاستیک</h3>\n                        <p class=\"text-sm text-slate-600\">زیرسازی اصولی، ماستیک کامل، بتونه‌کاری دو دست و سنباده‌زنی دقیق قبل از رنگ، تضمین‌کننده سطحی یکدست و آینه‌ای بدون موج است. استادکاران بهدون با استفاده از مرغوب‌ترین رنگ‌های بدون بو، کار را با پوشش کامل کاور نایلونی اسباب‌اثاثیه و در زمان‌بندی دقیق تحویل می‌دهند.</p>\n                    </div>\n                    <ul class=\"list-disc list-inside space-y-2 text-sm text-slate-600 pr-2\">\n                        <li><strong>رنگ اکریلیک قابل شستشو (بدون بو):</strong> مناسب برای فضای داخلی با خشک‌شدن سریع و بدون ایجاد حساسیت برای کودکان.</li>\n                        <li><strong>رنگ روغنی براق، نیمه‌براق و مات:</strong> مقاوم در برابر رطوبت جهت درب‌ها، پنجره‌ها و چهارچوب‌های فلزی.</li>\n                        <li><strong>پتینه‌کاری و رنگ‌های دکوراتیو مدرن:</strong> اجرای میکروسمنت، طرح بتن، ورق طلا و طرح سنگ برای دیوارهای شاخص سالن.</li>\n                    </ul>\n                    <div class=\"flex flex-wrap gap-3 pt-2\">\n                        <button type=\"button\" onclick=\"openRequestModal('نقاشی و رنگ کاری ساختمان')\" class=\"bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md\">ثبت درخواست بازدید و برآورد نقاشی</button>\n                        <a href=\"tel:02122345678\" class=\"bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs\">مشاوره نقاشی: ۰۲۱-۲۲۳۴۵۶۷۸</a>\n                    </div>\n                </div>\n            ",
                "slug": "painting",
                "persianSlug": "نقاشی-ساختمان"
            },
            {
                "name": "کاشی کاری و سرامیک",
                "icon": "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
                "detail": "\n                <div class=\"space-y-4 text-slate-700 leading-relaxed text-justify\">\n                    <h3 class=\"text-lg font-black text-brand-700\">نصب کاشی و سرامیک اسلب و پرسلان با چسب پودری و ملات</h3>\n                    <p class=\"text-sm text-slate-600\">اجرای همتراز کاشی‌های بزرگ‌مقیاس اسلب در حمام، سرویس بهداشتی و کف سالن با کلیپس همتراز و چسب‌های پلیمری پرسلان درجه یک. در صورت وجود نشتی قبلی در کف سرویس، این مرحله با همکاری تیم <a href=\"/services/plumbing\" class=\"text-[#8B1C31] font-bold hover:underline\">عایق‌بندی و لوله‌کشی بهدون</a> پیش از نصب سرامیک تضمین می‌گردد.</p>\n                    <div class=\"flex flex-wrap gap-3 pt-2\">\n                        <button type=\"button\" onclick=\"openRequestModal('کاشی کاری و سرامیک')\" class=\"bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md\">ثبت درخواست کاشی‌کاری</button>\n                    </div>\n                </div>\n            ",
                "slug": "tiling",
                "persianSlug": "کاشی-کاری-و-سرامیک"
            },
            {
                "name": "بنایی و تخریب",
                "icon": "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
                "detail": "\n                <div class=\"space-y-4 text-slate-700 leading-relaxed text-justify\">\n                    <h3 class=\"text-lg font-black text-brand-700\">تخریب اصولی، تیغه‌چینی، تغییر پلان و حمل نخاله</h3>\n                    <p class=\"text-sm text-slate-600\">حذف دیوارهای اضافی غیرباربر جهت سالن‌بزرگ‌تر، اجرای دیوارهای عایق سبک هبلکس یا بلوک لیکا، شیارزنی تأسیسات و جمع‌آوری و حمل سریع نخاله‌های ساختمانی در کلیه مناطق تهران.</p>\n                    <div class=\"flex flex-wrap gap-3 pt-2\">\n                        <button type=\"button\" onclick=\"openRequestModal('بنایی و تخریب')\" class=\"bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md\">ثبت درخواست بنایی و تخریب</button>\n                    </div>\n                </div>\n            ",
                "slug": "masonry",
                "persianSlug": "بنایی-و-تخریب"
            },
            {
                "name": "گچ کاری و لکه گیری",
                "icon": "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
                "detail": "\n                <div class=\"space-y-4 text-slate-700 leading-relaxed text-justify\">\n                    <h3 class=\"text-lg font-black text-brand-700\">گچ‌کاری، سفیدکاری و ترمیم لکه‌های ناشی از نم و ترکیدگی لوله</h3>\n                    <p class=\"text-sm text-slate-600\">سفیدکاری مجدد سقف و دیوارها، گچ‌بری مدرن و ترمیم فوری تبله‌های گچی ناشی از نشتی لوله یا رطوبت در کوتاه‌ترین زمان با متریال گچ سوپر مرغوب.</p>\n                    <div class=\"flex flex-wrap gap-3 pt-2\">\n                        <button type=\"button\" onclick=\"openRequestModal('گچ کاری و لکه گیری')\" class=\"bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md\">ثبت درخواست گچ‌کاری و لکه‌گیری</button>\n                    </div>\n                </div>\n            ",
                "slug": "plastering",
                "persianSlug": "گچ-کاری-و-لکه-گیری"
            },
            {
                "name": "عایق کاری پشت بام (ایزوگام و قیرگونی و...)",
                "icon": "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
                "detail": "\n                <div class=\"space-y-4 text-slate-700 leading-relaxed text-justify\">\n                    <h3 class=\"text-lg font-black text-brand-700\">نصب ایزوگام فویل‌دار دولایه، قیرگونی و عایق‌های رطوبتی نانو در پشت‌بام</h3>\n                    <p class=\"text-sm text-slate-600\">آب‌بندی ۱۰۰٪ پشت‌بام، دور ناودانی‌ها و پایه‌های کولر آبی با مرغوب‌ترین ایزوگام‌های دلیجان با ضمانت‌نامه ۱۰ ساله کتبی.</p>\n                    <div class=\"flex flex-wrap gap-3 pt-2\">\n                        <button type=\"button\" onclick=\"openRequestModal('عایق کاری پشت بام')\" class=\"bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md\">ثبت درخواست ایزوگام و عایق‌کاری</button>\n                    </div>\n                </div>\n            ",
                "slug": "roof-insulation",
                "persianSlug": "عایق-کاری-پشت-بام"
            },
            {
                "name": "کنافکاری",
                "icon": "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
                "detail": "<p class=\"text-sm text-slate-600\">طراحی و اجرای سقف کاذب کناف، دورباکس نور مخفی، دیوار جداکننده پارتیشن درای‌وال با سازه‌های استاندارد کناف و بتونه درزگیر فایبرگلاس.</p>",
                "slug": "knauf",
                "persianSlug": "کناف-کاری"
            },
            {
                "name": "نصب کاغذ دیواری",
                "icon": "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
                "detail": "<p class=\"text-sm text-slate-600\">نصب انواع کاغذ دیواری‌های پی‌وی‌سی قابل شستشو، پوستر سه‌بعدی و پارچه دیواری با چسب‌های ارجینال بدون تاول و خط درز.</p>",
                "slug": "wallpaper",
                "persianSlug": "نصب-کاغذ-دیواری"
            },
            {
                "name": "پارکت و لمینت",
                "icon": "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
                "detail": "<p class=\"text-sm text-slate-600\">نصب لمینت و پارکت چوبی به همراه فوم سایلنت ۲ میلی‌متری، نصب قرنیز، گرده و میانه با چسب‌های مخصوص ساختمانی.</p>",
                "slug": "parquet",
                "persianSlug": "پارکت-و-لمینت"
            },
            {
                "name": "سنگ کاری",
                "icon": "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
                "detail": "<p class=\"text-sm text-slate-600\">اجرای سنگ پله، سنگ کف حیاط و پارکینگ، نصب سنگ‌های آنتیک دکوراتیو و سنگ اسلب با اسکوپ فلزی ایمن.</p>",
                "slug": "stone-work",
                "persianSlug": "سنگ-کاری"
            },
            {
                "name": "تعمیرات نما",
                "icon": "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
                "detail": "<p class=\"text-sm text-slate-600\">پیچ و رولپلاک سنگ نما با طناب بدون داربست، شستشوی نما با واترجت، ترمیم آجر و بندکشی نانو نمای ساختمان.</p>",
                "slug": "facade-repair",
                "persianSlug": "تعمیرات-نما"
            }
        ],
        "comprehensiveGuide": "\n        <!-- ================= COMPREHENSIVE RENOVATION SEO GUIDE (> 1300 WORDS) ================= -->\n        <article class=\"mt-12 pt-10 border-t border-slate-200 text-slate-700 leading-relaxed text-justify space-y-8\" dir=\"rtl\">\n            <header class=\"text-center max-w-3xl mx-auto space-y-4 mb-10\">\n                <span class=\"inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-50 text-purple-800 text-xs font-bold border border-purple-200\">\n                    <svg class=\"w-4 h-4 text-[#8B1C31]\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4\"></path></svg>\n                    دانشنامه و راهنمای تخصصی بازسازی و تعمیرات ساختمان در تهران\n                </span>\n                <h2 class=\"text-2xl md:text-3xl font-black text-slate-800 leading-tight\">\n                    راهنمای جامع نوسازی، بازسازی داخلی، نقاشی، کاشی‌کاری و دکوراسیون در تهران\n                </h2>\n                <p class=\"text-sm text-slate-500 leading-relaxed\">\n                    چگونه خانه یا آپارتمان خود را با بودجه مشخص، زمان‌بندی دقیق و بالاترین کیفیت مهندسی بازسازی کرده و ارزش افزوده چشمگیری در املاک تهران خلق کنیم.\n                </p>\n            </header>\n\n            <!-- Quick Action Alert Box -->\n            <div class=\"bg-gradient-to-r from-[#2c1d38] to-[#421d3f] rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6\">\n                <div class=\"space-y-2 text-center md:text-right\">\n                    <h3 class=\"text-xl font-bold\">قصد بازسازی کلی یا خرده‌کاری نقاشی و بنایی در تهران دارید؟</h3>\n                    <p class=\"text-xs md:text-sm text-purple-100 max-w-xl leading-relaxed\">\n                        مهندسان و کارشناسان مجرب بهدون با بازدید رایگان، متراژ دقیق و لیست آنالیز هزینه‌ها (L.O.M) را با برآورد زمان‌بندی شفاف خدمت شما ارائه می‌دهند.\n                    </p>\n                </div>\n                <div class=\"flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0\">\n                    <button type=\"button\" onclick=\"openRequestModal('نقاشی و رنگ کاری ساختمان')\" class=\"w-full sm:w-auto px-6 py-3 bg-[#8B1C31] hover:bg-[#701627] text-white text-xs md:text-sm font-black rounded-xl shadow-lg transition-all transform hover:scale-105 text-center\">\n                        درخواست بازدید و کارشناسی رایگان\n                    </button>\n                    <a href=\"tel:02122345678\" class=\"w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs md:text-sm font-bold rounded-xl backdrop-blur-sm border border-white/20 transition-all text-center flex items-center justify-center gap-2\">\n                        <svg class=\"w-4 h-4 text-emerald-400\" fill=\"currentColor\" viewBox=\"0 0 512 512\"><path d=\"M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z\"/></svg>\n                        <span>۰۲۱-۲۲۳۴۵۶۷۸</span>\n                    </a>\n                </div>\n            </div>\n\n            <!-- SECTION 1: Renovation value in Tehran -->\n            <section class=\"space-y-4\">\n                <h3 class=\"text-xl font-black text-slate-800 flex items-center gap-2 border-r-4 border-[#8B1C31] pr-3\">\n                    چرا بازسازی ساختمان در کلانشهر تهران یک سرمایه‌گذاری پرسود است؟\n                </h3>\n                <p>\n                    با توجه به جهش‌های چشمگیر قیمت هر متر مربع مسکن در تهران، تعویض ملک و جابجایی به خانه‌ای نوساز برای بسیاری از خانواده‌ها بار مالی سنگینی به همراه دارد. بازسازی مهندسی و هوشمندانه آپارتمان نه‌تنها فضایی کاملاً لوکس و مطابق با سلیقه روز خلق می‌کند، بلکه ارزش افزوده ملک را بین ۳۰ تا ۵۰ درصد بیش از هزینه‌های صرف‌شده ارتقا می‌دهد. بهدون با اجرای پروژه‌های مدرن نوسازی در مناطق ۱ تا ۲۲ تهران، این فرآیند را با عقد قرارداد کتبی و ضمانت قطعی به انجام می‌رساند.\n                </p>\n                <p>\n                    نکته کلیدی در بازسازی پایدار، نوسازی زیرساخت‌های تأسیساتی پنهان پیش از اجرای نازک‌کاری است. بازسازی که بدون تعویض لوله‌های فرسوده یا اصلاح سیم‌کشی برق انجام شود، خیلی زود با یک نشتی آب یا اتصالی برقی نابود خواهد شد! تیم بهدون با بهره‌گیری از متخصصان <a href=\"/services/plumbing\" class=\"text-brand-600 font-bold hover:underline\">لوله‌کشی و تأسیسات آب</a> و <a href=\"/services/electrical\" class=\"text-brand-600 font-bold hover:underline\">برقکاری ساختمان</a>، ابتدا سلامت زیرساخت‌ها را تضمین کرده و سپس به اجرای کاشی، کناف، پارکت و نقاشی می‌پردازد.\n                </p>\n            </section>\n\n            <!-- SECTION 2: Step-by-step renovation table -->\n            <section class=\"space-y-4\">\n                <h3 class=\"text-xl font-black text-slate-800 flex items-center gap-2 border-r-4 border-[#8B1C31] pr-3\">\n                    مراحل مهندسی بازسازی و جدول گام‌به‌گام اقدامات اجرایی\n                </h3>\n                <div class=\"overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white\">\n                    <table class=\"w-full text-right text-xs md:text-sm\">\n                        <thead class=\"bg-slate-100 text-slate-800 font-bold border-b border-slate-200\">\n                            <tr>\n                                <th class=\"p-3.5 md:p-4\">مرحله بازسازی</th>\n                                <th class=\"p-3.5 md:p-4\">شرح اقدامات اجرایی</th>\n                                <th class=\"p-3.5 md:p-4\">نکات حیاتی و استاندارد بهدون</th>\n                            </tr>\n                        </thead>\n                        <tbody class=\"divide-y divide-slate-100 text-slate-600\">\n                            <tr class=\"hover:bg-slate-50/50\">\n                                <td class=\"p-3.5 md:p-4 font-bold text-slate-800\">۱. تخریب و آهن‌کشی</td>\n                                <td class=\"p-3.5 md:p-4\">برداشتن دیوارهای مزاحم، کندن کاشی‌های قدیمی، حمل نخاله</td>\n                                <td class=\"p-3.5 md:p-4\">رعایت اصول ایمنی ستون‌ها و دیوارهای باربر سازه</td>\n                            </tr>\n                            <tr class=\"hover:bg-slate-50/50\">\n                                <td class=\"p-3.5 md:p-4 font-bold text-slate-800\">۲. زیرساخت تأسیسات</td>\n                                <td class=\"p-3.5 md:p-4\">لوله‌کشی ۵ لایه آب، پوش‌فیت فاضلاب، سیم‌کشی برق و شبکه</td>\n                                <td class=\"p-3.5 md:p-4\">تست فشار ۱۰ بار و ارزیابی عایق حرارتی کابل‌ها</td>\n                            </tr>\n                            <tr class=\"hover:bg-slate-50/50\">\n                                <td class=\"p-3.5 md:p-4 font-bold text-slate-800\">۳. عایق‌کاری و سفت‌کاری</td>\n                                <td class=\"p-3.5 md:p-4\">قیرگونی یا نانو در سرویس‌ها، شیب‌بندی و سیمان‌کاری</td>\n                                <td class=\"p-3.5 md:p-4\">تست ۲۴ ساعته آب‌بندی پیش از اجرای سرامیک</td>\n                            </tr>\n                            <tr class=\"hover:bg-slate-50/50\">\n                                <td class=\"p-3.5 md:p-4 font-bold text-slate-800\">۴. کاشی، کناف و کف‌پوش</td>\n                                <td class=\"p-3.5 md:p-4\">نصب سرامیک پرسلان، سقف کناف، نصب پارکت و لمینت</td>\n                                <td class=\"p-3.5 md:p-4\">تراز لیزری سه‌بعدی و بندکشی آنتی‌باکتریال نانو</td>\n                            </tr>\n                            <tr class=\"hover:bg-slate-50/50\">\n                                <td class=\"p-3.5 md:p-4 font-bold text-slate-800\">۵. نقاشی و دکوراسیون</td>\n                                <td class=\"p-3.5 md:p-4\">بتونه ماستیک، نقاشی اکریلیک بدون بو، نصب کاغذ دیواری</td>\n                                <td class=\"p-3.5 md:p-4\">تحویل تمیز و بدون گردوغبار طبق جدول زمان‌بندی</td>\n                            </tr>\n                        </tbody>\n                    </table>\n                </div>\n            </section>\n\n            <!-- SECTION 3: Why Behdoon -->\n            <section class=\"space-y-4\">\n                <h3 class=\"text-xl font-black text-slate-800 flex items-center gap-2 border-r-4 border-[#8B1C31] pr-3\">\n                    چرا کارفرمایان تهرانی بازسازی خود را به بهدون می‌سپارند؟\n                </h3>\n                <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4 pt-2\">\n                    <div class=\"bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-2\">\n                        <div class=\"w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mx-auto font-black\">✓</div>\n                        <h4 class=\"font-bold text-slate-800 text-sm\">قرارداد رسمی با تعهد ضرر و زیان</h4>\n                        <p class=\"text-xs text-slate-500\">تاریخ دقیق تحویل پروژه در قرارداد ذکر شده و در صورت تاخیر، خسارت روزانه پرداخت می‌گردد.</p>\n                    </div>\n                    <div class=\"bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-2\">\n                        <div class=\"w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mx-auto font-black\">🏢</div>\n                        <h4 class=\"font-bold text-slate-800 text-sm\">تیم چندرشته‌ای مهندسی</h4>\n                        <p class=\"text-xs text-slate-500\">هماهنگی صفر تا صد میان بنا، کاشی‌کار، برقکار، لوله‌کش، کناف‌کار و نقاش بدون اتلاف وقت.</p>\n                    </div>\n                    <div class=\"bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-2\">\n                        <div class=\"w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center mx-auto font-black\">⚖</div>\n                        <h4 class=\"font-bold text-slate-800 text-sm\">خرید مستقیم متریال به قیمت کارخانه</h4>\n                        <p class=\"text-xs text-slate-500\">تامین مستقیم کاشی، گچ، رنگ، سیم و لوله از کارخانجات معتبر با کمترین قیمت تمام‌شده برای کارفرما.</p>\n                    </div>\n                </div>\n            </section>\n\n            <!-- Final CTA -->\n            <div class=\"bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-6 md:p-8 text-center space-y-4 my-8\">\n                <h3 class=\"text-xl font-black text-slate-800\">آماده نوسازی و تبدیل خانه خود به محیطی مدرن هستید؟</h3>\n                <p class=\"text-xs md:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed\">\n                    هم‌اکنون درخواست بازدید اولیه را به صورت آنلاین ثبت کنید تا کارشناس ارشد بازسازی بهدون جهت مشاوره تخصصی و برآورد رایگان در محل حضور یابد.\n                </p>\n                <div class=\"flex flex-wrap items-center justify-center gap-3 pt-2\">\n                    <button type=\"button\" onclick=\"openRequestModal('نقاشی و رنگ کاری ساختمان')\" class=\"bg-[#8B1C31] hover:bg-[#701627] text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-[#8B1C31]/25 hover:shadow-2xl transition-all transform hover:-translate-y-0.5\">\n                        ثبت آنلاین درخواست بازسازی و نقاشی\n                    </button>\n                    <a href=\"tel:02122345678\" class=\"bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-sm transition-colors flex items-center gap-2\">\n                        <svg class=\"w-4 h-4 text-emerald-600\" fill=\"currentColor\" viewBox=\"0 0 512 512\"><path d=\"M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z\"/></svg>\n                        <span>مشاوره بازسازی تهران: ۰۲۱-۲۲۳۴۵۶۷۸</span>\n                    </a>\n                </div>\n            </div>\n        </article>\n    ",
        "faq": [
            {
                "q": "مدت زمان بازسازی کامل یک آپارتمان مسکونی در تهران چقدر است؟",
                "a": "بسته به متراژ و حجم تخریب، بازسازی کامل یک آپارتمان ۱۰۰ متری معمولاً بین ۲۰ الی ۳۵ روز کاری زمان می‌برد که زمان‌بندی مرحله‌به‌مرحله به صورت دقیق در قرارداد قید می‌گردد."
            },
            {
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

    const catTitleShort = data.title.split('|')[0].trim();

    const breadcrumbs = `
        <nav class="hidden md:flex text-xs text-slate-500 mb-4 justify-start overflow-x-auto hide-scrollbar" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 space-x-reverse md:space-x-2 bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-sm rounded-xl px-4 py-2 whitespace-nowrap text-xs">
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
                        <span class="mr-1 text-slate-700 font-bold" id="breadcrumb-current">${catTitleShort}</span>
                    </div>
                </li>
            </ol>
        </nav>
    `;

    const heroSection = `
        <div class="pt-6 pb-4 bg-gradient-to-b from-brand-50/60 to-transparent">
            <div class="container mx-auto px-4 max-w-5xl">
                ${breadcrumbs}
                
                <div class="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm my-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div class="space-y-2 max-w-2xl">
                        <div class="inline-flex items-center gap-2 text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200/60">
                            <span>پوشش تمام مناطق تهران</span>
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>اعزام فوری تکنسین</span>
                        </div>
                        <h1 class="text-xl md:text-3xl font-black text-slate-800 leading-tight">${data.title}</h1>
                        <p class="text-xs md:text-sm text-slate-600 leading-relaxed">${data.subtitle || ''}</p>
                    </div>
                    
                    <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
                        <button type="button" onclick="openRequestModal('${data.subServices && data.subServices[0] ? data.subServices[0].name : data.title}')" class="w-full sm:w-auto px-6 py-3.5 bg-[#8B1C31] hover:bg-[#701627] text-white font-bold text-xs md:text-sm rounded-2xl shadow-lg shadow-[#8B1C31]/20 hover:shadow-xl transition-all transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                            <span>ثبت آنلاین درخواست</span>
                        </button>
                        <a href="tel:02122345678" class="w-full sm:w-auto px-5 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs md:text-sm rounded-2xl transition-colors text-center flex items-center justify-center gap-2">
                            <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
                            <span dir="ltr">021 - 22345678</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

    let subServicesHtml = '';
    let tabContents = '';

    if (data.subServices && data.subServices.length > 0) {
        let cardsHtml = data.subServices.map((sub, index) => {
            const isActive = index === 0;
            const containerClass = isActive 
                ? 'tab-btn cursor-pointer bg-brand-50 border border-brand-500 p-4 md:p-5 rounded-2xl shadow-sm transition-all group text-center flex flex-col items-center justify-center w-[130px] sm:w-[150px]'
                : 'tab-btn cursor-pointer bg-white border border-slate-100 p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-300 transition-all group text-center flex flex-col items-center justify-center w-[130px] sm:w-[150px]';
            
            const iconClass = isActive
                ? 'tab-icon-container w-10 h-10 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center mb-3 md:mb-4 transition-colors'
                : 'tab-icon-container w-10 h-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors';
                
            const titleClass = isActive
                ? 'font-black text-brand-700 text-sm'
                : 'font-bold text-slate-600 text-sm group-hover:text-brand-600 transition-colors';

            return `
            <div onclick="switchTab('${index}', '${sub.name}', '${sub.slug || ''}')" id="tab-btn-${index}" class="${containerClass}">
                <div class="${iconClass}">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${sub.icon}"></path></svg>
                </div>
                <h3 class="${titleClass}">${sub.name}</h3>
            </div>
            `;
        }).join('');

        subServicesHtml = `
            <div class="container mx-auto px-4 max-w-6xl mt-4 relative z-20 mb-8 md:mb-12">
                <div class="flex flex-wrap justify-center gap-3 md:gap-4 pb-4">
                    ${cardsHtml}
                </div>
            </div>
        `;
        
        tabContents = data.subServices.map((sub, index) => `
            <div id="tab-content-${index}" class="tab-content ${index === 0 ? 'block' : 'hidden'}">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
                    <h2 class="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2.5">
                        <span class="w-2.5 h-7 bg-[#8B1C31] rounded-full inline-block"></span>
                        ${sub.name}
                    </h2>
                    <div class="flex items-center gap-2">
                        <a href="/services/${serviceId}/${sub.slug}" class="inline-flex items-center justify-center gap-1.5 text-xs text-brand-600 hover:text-brand-700 font-bold bg-brand-50 hover:bg-brand-100 px-3.5 py-2.5 rounded-xl border border-brand-200 transition-colors">
                            <span>صفحه اختصاصی ${sub.name}</span>
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                        </a>
                        <button type="button" onclick="openRequestModal('${sub.name}')" class="inline-flex items-center justify-center gap-2 bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all transform hover:-translate-y-0.5">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                            <span>ثبت آنلاین درخواست ${sub.name}</span>
                        </button>
                    </div>
                </div>
                ${sub.detail ? sub.detail : `
                    <div class="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
                        <h3 class="text-lg font-bold text-slate-700 mb-2">محتوای «${sub.name}» در حال آماده‌سازی است</h3>
                        <p class="text-sm text-slate-500">به زودی اطلاعات کامل این بخش قرار خواهد گرفت.</p>
                    </div>
                `}
            </div>
        `).join('');
    } else {
        tabContents = `<div class="tab-content block">${data.content || ''}</div>`;
    }

    const contentSection = `
        <div class="container mx-auto px-4 max-w-5xl mb-8 md:mb-12 mt-2 md:mt-6">
            <div class="bg-white border border-slate-200 shadow-md rounded-[2rem] p-6 md:p-10 text-slate-700 leading-loose">
                ${tabContents}
            </div>
            
            <div class="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 md:p-10 mt-8 md:mt-12">
                <h2 class="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><span class="w-2 h-6 bg-slate-800 rounded-full inline-block"></span> سؤالات متداول</h2>
                <div class="space-y-4">
                    ${(data.faq || []).map(f => `
                        <details class="group bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-brand-300 transition-colors [&_summary::-webkit-details-marker]:hidden">
                            <summary class="flex cursor-pointer items-center justify-between gap-1.5 p-5 md:p-6 text-slate-800 font-bold select-none">
                                <h3 class="text-[15px] md:text-base">${f.q}</h3>
                                <span class="relative size-5 shrink-0 text-brand-500">
                                    <svg class="absolute inset-0 size-5 opacity-100 group-open:opacity-0 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path></svg>
                                    <svg class="absolute inset-0 size-5 opacity-0 group-open:opacity-100 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15"></path></svg>
                                </span>
                            </summary>
                            <div class="px-5 md:px-6 pb-6 text-slate-600 leading-loose text-[14px]">
                                <p>${f.a}</p>
                            </div>
                        </details>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <script>
            function switchTab(tabId, tabName, tabSlug) {
                document.querySelectorAll('.tab-content').forEach(el => {
                    el.classList.remove('block');
                    el.classList.add('hidden');
                });
                
                const activeContent = document.getElementById('tab-content-' + tabId);
                if(activeContent) {
                    activeContent.classList.remove('hidden');
                    activeContent.classList.add('block');
                }
                
                document.querySelectorAll('.tab-btn').forEach(el => {
                    el.className = 'tab-btn cursor-pointer bg-white border border-slate-100 p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-300 transition-all group text-center flex flex-col items-center justify-center w-[130px] sm:w-[150px]';
                    
                    const h3 = el.querySelector('h3');
                    if(h3) h3.className = 'font-bold text-slate-600 text-sm group-hover:text-brand-600 transition-colors';
                    
                    const iconBox = el.querySelector('.tab-icon-container');
                    if(iconBox) iconBox.className = 'tab-icon-container w-10 h-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors';
                });
                
                const activeTab = document.getElementById('tab-btn-' + tabId);
                if(activeTab) {
                    activeTab.className = 'tab-btn cursor-pointer bg-brand-50 border border-brand-500 p-4 md:p-5 rounded-2xl shadow-sm transition-all group text-center flex flex-col items-center justify-center w-[130px] sm:w-[150px]';
                    
                    const activeH3 = activeTab.querySelector('h3');
                    if(activeH3) activeH3.className = 'font-black text-brand-700 text-sm';
                    
                    const activeIconBox = activeTab.querySelector('.tab-icon-container');
                    if(activeIconBox) activeIconBox.className = 'tab-icon-container w-10 h-10 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center mb-3 md:mb-4 transition-colors';
                }
                
                const breadcrumb = document.getElementById('breadcrumb-current');
                if(breadcrumb) {
                    const originalTitle = "${catTitleShort}";
                    breadcrumb.innerHTML = originalTitle + ' <span class="mx-1 text-slate-300">/</span> <span class="text-brand-600">' + tabName + '</span>';
                }

                if(tabSlug && window.history && window.history.replaceState) {
                    window.history.replaceState(null, '', '/services/${serviceId}/' + tabSlug);
                }
            }

            document.addEventListener('DOMContentLoaded', () => {
                const breadcrumb = document.getElementById('breadcrumb-current');
                if(breadcrumb && breadcrumb.innerHTML === "${catTitleShort}") {
                    const firstTabName = "${data.subServices && data.subServices[0] ? data.subServices[0].name : ''}";
                    if(firstTabName) {
                        breadcrumb.innerHTML = "${catTitleShort}" + ' <span class="mx-1 text-slate-300">/</span> <span class="text-brand-600">' + firstTabName + '</span>';
                    }
                }
            });
        </script>
        <style>
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        </style>
    `;

    let customHeader = headerHTML
        .replace('<title>بهدون؛ خدمات حرفه ای ساختمان در تهران</title>', '<title>' + data.title + '</title>')
        .replace('content="تشخیص ترکیدگی لوله با دستگاه نقطه زن، لوله بازکنی و تعمیرات تاسیسات با ضمانت کتبی در تهران."', 'content="' + data.metaDesc + '"');

    return customHeader + heroSection + subServicesHtml + contentSection + footerHTML;
}

export function renderSubServicePage(categoryId, subIndex) {
    const data = servicesData[categoryId];
    if (!data) return '404';
    const sub = data.subServices && data.subServices[subIndex];
    if (!sub) return '404';

    const catTitleShort = data.title.split('|')[0].trim();
    const subTitle = `${sub.name} در تهران | خدمات و تعمیرات فوری بهدون`;
    const subMetaDesc = `ارائه تخصصی خدمات ${sub.name} در کلیه مناطق ۲۲ گانه تهران توسط تکنسین‌های مجرب بهدون با قطعات فابریک، ضمانت کتبی کیفیت و اعزام فوری زیر ۴۵ دقیقه.`;

    const breadcrumbs = `
        <nav class="hidden md:flex text-xs text-slate-500 mb-4 justify-start overflow-x-auto hide-scrollbar" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 space-x-reverse md:space-x-2 bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-sm rounded-xl px-4 py-2 whitespace-nowrap text-xs">
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
                <li>
                    <div class="flex items-center">
                        <svg class="w-3.5 h-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                        <a href="/services/${categoryId}" class="mr-1 hover:text-brand-600 transition-colors">${catTitleShort}</a>
                    </div>
                </li>
                <li aria-current="page">
                    <div class="flex items-center">
                        <svg class="w-3.5 h-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                        <span class="mr-1 text-[#8B1C31] font-bold">${sub.name}</span>
                    </div>
                </li>
            </ol>
        </nav>
    `;

    const heroSection = `
        <div class="pt-6 pb-4 bg-gradient-to-b from-brand-50/60 to-transparent">
            <div class="container mx-auto px-4 max-w-5xl">
                ${breadcrumbs}
                
                <div class="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm my-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div class="space-y-2 max-w-2xl">
                        <div class="inline-flex items-center gap-2 text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200/60">
                            <span>پوشش تمام مناطق ۲۲ گانه تهران</span>
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>اعزام فوری زیر ۴۵ دقیقه</span>
                        </div>
                        <h1 class="text-xl md:text-3xl font-black text-slate-800 leading-tight">${sub.name} در تهران</h1>
                        <p class="text-xs md:text-sm text-slate-600 leading-relaxed">ارائه خدمات تخصصی، فوری و تضمینی ${sub.name} با تکنسین‌های دارای گواهی فنی و حرفه‌ای و قطعات اورجینال در سراسر پایتخت.</p>
                    </div>
                    
                    <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
                        <button type="button" onclick="openRequestModal('${sub.name}')" class="w-full sm:w-auto px-6 py-3.5 bg-[#8B1C31] hover:bg-[#701627] text-white font-bold text-xs md:text-sm rounded-2xl shadow-lg shadow-[#8B1C31]/20 hover:shadow-xl transition-all transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                            <span>ثبت آنلاین درخواست ${sub.name}</span>
                        </button>
                        <a href="tel:02122345678" class="w-full sm:w-auto px-5 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs md:text-sm rounded-2xl transition-colors text-center flex items-center justify-center gap-2">
                            <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
                            <span dir="ltr">021 - 22345678</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

    const siblings = (data.subServices || []).map((s, idx) => {
        const isCurrent = idx === subIndex;
        return `
            <a href="/services/${categoryId}/${s.slug}" class="${isCurrent ? 'bg-brand-500 text-white border-brand-500 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:text-brand-600'} px-4 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap inline-flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${s.icon}"></path></svg>
                <span>${s.name}</span>
            </a>
        `;
    }).join('');

    const siblingsNav = `
        <div class="container mx-auto px-4 max-w-5xl my-4">
            <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                <div class="text-xs font-bold text-slate-500 mb-2.5 flex items-center justify-between">
                    <span>سایر خدمات ${catTitleShort}:</span>
                    <a href="/services/${categoryId}" class="text-brand-600 hover:underline text-xs">مشاهده همه خدمات &larr;</a>
                </div>
                <div class="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
                    ${siblings}
                </div>
            </div>
        </div>
    `;

    const contentSection = `
        <div class="container mx-auto px-4 max-w-5xl mb-8 md:mb-12">
            <div class="bg-white border border-slate-200 shadow-md rounded-[2rem] p-6 md:p-10 text-slate-700 leading-loose">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
                    <h2 class="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2.5">
                        <span class="w-2.5 h-7 bg-[#8B1C31] rounded-full inline-block"></span>
                        ${sub.name}
                    </h2>
                    <button type="button" onclick="openRequestModal('${sub.name}')" class="inline-flex items-center justify-center gap-2 bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all transform hover:-translate-y-0.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        <span>ثبت آنلاین درخواست ${sub.name}</span>
                    </button>
                </div>
                ${sub.detail ? sub.detail : `
                    <div class="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
                        <h3 class="text-lg font-bold text-slate-700 mb-2">محتوای «${sub.name}» در حال آماده‌سازی است</h3>
                        <p class="text-sm text-slate-500">به زودی اطلاعات کامل این بخش قرار خواهد گرفت.</p>
                    </div>
                `}
            </div>
            
            <div class="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 md:p-10 mt-8 md:mt-12">
                <h2 class="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><span class="w-2 h-6 bg-slate-800 rounded-full inline-block"></span> سؤالات متداول ${sub.name}</h2>
                <div class="space-y-4">
                    ${(data.faq || []).map(f => `
                        <details class="group bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-brand-300 transition-colors [&_summary::-webkit-details-marker]:hidden">
                            <summary class="flex cursor-pointer items-center justify-between gap-1.5 p-5 md:p-6 text-slate-800 font-bold select-none">
                                <h3 class="text-[15px] md:text-base">${f.q}</h3>
                                <span class="relative size-5 shrink-0 text-brand-500">
                                    <svg class="absolute inset-0 size-5 opacity-100 group-open:opacity-0 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path></svg>
                                    <svg class="absolute inset-0 size-5 opacity-0 group-open:opacity-100 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15"></path></svg>
                                </span>
                            </summary>
                            <div class="px-5 md:px-6 pb-6 text-slate-600 leading-loose text-[14px]">
                                <p>${f.a}</p>
                            </div>
                        </details>
                    `).join('')}
                </div>
            </div>
        </div>
        <style>
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        </style>
    `;

    let customHeader = headerHTML
        .replace('<title>بهدون؛ خدمات حرفه ای ساختمان در تهران</title>', '<title>' + subTitle + '</title>')
        .replace('content="تشخیص ترکیدگی لوله با دستگاه نقطه زن، لوله بازکنی و تعمیرات تاسیسات با ضمانت کتبی در تهران."', 'content="' + subMetaDesc + '"');

    return customHeader + heroSection + siblingsNav + contentSection + footerHTML;
}
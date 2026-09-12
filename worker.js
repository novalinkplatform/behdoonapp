export default {
  async fetch(request, env, ctx) {
    const PHONE = "09333256885"; 
    const PHONE_DISPLAY = "0933 325 6885"; 
    const WHATSAPP = "989333256885"; 
    
    const html = `<!DOCTYPE html>
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
                    <div class="flex flex-col pr-1">
                        <span class="text-xl font-black text-brand-500 tracking-tight leading-none">بهدون</span>
                        <span class="text-[10px] font-bold text-brand-400 mt-1">خدمات حرفه‌ای ساختمان</span>
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
                <div id="mobile-menu" class="hidden absolute top-[120%] left-0 w-full bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col overflow-hidden py-2">
                    <a href="#" class="px-6 py-4 border-b border-slate-100 font-bold text-slate-700 flex items-center justify-center gap-2" onclick="document.getElementById('mobile-menu').classList.add('hidden')">
                        <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        پروفایل کاربری
                    </a>
                    <a href="#services" class="px-6 py-4 border-b border-slate-100 font-bold text-slate-700 flex items-center justify-center gap-2" onclick="document.getElementById('mobile-menu').classList.add('hidden')">خدمات بهدون</a>
                    <a href="#magazine" class="px-6 py-4 border-b border-slate-100 font-bold text-slate-700 flex items-center justify-center gap-2" onclick="document.getElementById('mobile-menu').classList.add('hidden')">مجله آموزشی</a>
                    <a href="#about-us" class="px-6 py-4 border-b border-slate-100 font-bold text-slate-700 flex items-center justify-center gap-2" onclick="document.getElementById('mobile-menu').classList.add('hidden')">درباره ما</a>
                    <a href="/#services" class="px-6 py-4 font-bold text-white flex items-center justify-center gap-2 bg-[#8B1C31] hover:bg-[#701627] transition-colors" onclick="document.getElementById('mobile-menu').classList.add('hidden')">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        ثبت درخواست
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
                <h1 class="text-[clamp(1.1rem,4.5vw,1.5rem)] md:text-4xl lg:text-5xl font-black text-brand-500 mb-8 leading-snug tracking-tight whitespace-nowrap">
                    خدمات حرفه‌ای ساختمان در <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">تهران</span>
                </h1>

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
                            <h2 class="text-xl md:text-3xl font-black text-slate-800">خدمات بهدون</h2>
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
<script>
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('/api/requests');
        const requests = await res.json();
        
        const tbody = document.querySelector('tbody');
        tbody.innerHTML = '';
        
        if (!requests || requests.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="p-8 text-center text-slate-500">هیچ درخواستی ثبت نشده است.</td></tr>';
            return;
        }
        
        let pending = 0;
        let completed = 0;
        
        requests.forEach(req => {
            if (req.status === 'pending') pending++;
            if (req.status === 'completed') completed++;
            
            const date = new Date(req.created_at).toLocaleString('fa-IR');
            
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-slate-50 border-b border-slate-50 transition-colors';
            
            let statusBadge = '';
            if (req.status === 'pending') statusBadge = '<span class="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">در انتظار بررسی</span>';
            else if (req.status === 'in_progress') statusBadge = '<span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">در حال انجام</span>';
            else statusBadge = '<span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">تکمیل شده</span>';
            
            tr.innerHTML = \`
                <td class="p-4 font-bold text-slate-700">${req.name}</td>
                <td class="p-4 text-slate-600 dir-ltr text-left">${req.phone}</td>
                <td class="p-4 text-slate-600">${req.service_id}</td>
                <td class="p-4 text-slate-500 dir-ltr text-right text-xs">${date}</td>
                <td class="p-4">${statusBadge}</td>
                <td class="p-4"><button class="text-[#8B1C31] font-bold hover:underline">بررسی</button></td>
            \`;
            tbody.appendChild(tr);
        });
        
        document.getElementById('totalCount').innerText = requests.length;
        document.getElementById('pendingCount').innerText = pending;
        document.getElementById('completedCount').innerText = completed;
        
    } catch (e) {
        console.error('Error fetching requests', e);
    }
});
</script>


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
    `;

    
// --- INJECTED SERVICE PAGES ---
const servicesData = {
  "hvac": {
    "id": "hvac",
    "title": "سرمایش و گرمایش ساختمان | خدمات تخصصی بهدون",
    "metaDesc": "خدمات تخصصی سرمایش و گرمایش ساختمان در تهران شامل تعمیر و نصب کولر، پکیج، شوفاژ و سیستم‌های تهویه مطبوع.",
    "subtitle": "تنظیم دمای مطبوع ساختمان شما تخصص ماست. از راه‌اندازی و سرویس تا تعمیرات تخصصی انواع سیستم‌های سرمایشی و گرمایشی.",
    "icon": "<svg class=\"w-10 h-10\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"M12 3v18m-4-14h8m-8 10h8M6 8a6 6 0 1112 0 6 6 0 01-12 0z\"></path></svg>",
    "subServices": [
      { "name": "سیستم‌های گرمایشی", "icon": "M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" },
      { "name": "سیستم‌های سرمایشی", "icon": "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" }
    ],
    "content": `
        <p class="mb-4">محتوای این بخش در حال آماده‌سازی است.</p>
    `
  },
  "plumbing": {
    "id": "plumbing",
    "title": "لوله کشی ساختمان | خدمات تخصصی بهدون",
    "metaDesc": "خدمات لوله کشی، رفع نشتی، تشخیص ترکیدگی و نشت یابی لوله آب و فاضلاب در تهران.",
    "subtitle": "شریان‌های حیاتی ساختمان. انجام کلیه خدمات لوله کشی آب و فاضلاب با دستگاه‌های نشت‌یاب پیشرفته.",
    "icon": "<svg class=\"w-10 h-10\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z\"></path></svg>",
    "subServices": [
      { "name": "لوله‌کشی آب", "icon": "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" },
      { "name": "لوله‌کشی فاضلاب", "icon": "M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" },
      { "name": "رفع نشتی", "icon": "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.83-5.83M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
      { "name": "نشت‌یابی", "icon": "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" },
      { "name": "رفع نم و رطوبت", "icon": "M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" }
    ],
    "content": `
        <p class="mb-4">محتوای این بخش در حال آماده‌سازی است.</p>
    `
  },
  "electrical": {
    "id": "electrical",
    "title": "برقکاری ساختمان | خدمات تخصصی بهدون",
    "metaDesc": "خدمات تخصصی برق‌کاری ساختمان، عیب‌یابی، رفع اتصالی، کابل کشی و نصب روشنایی در تهران.",
    "subtitle": "روشنایی و امنیت الکتریکی ساختمان شما. رفع اتصالی، سیم‌کشی و نصب تجهیزات الکتریکی با رعایت کامل اصول ایمنی.",
    "icon": "<svg class=\"w-10 h-10\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"M13 10V3L4 14h7v7l9-11h-7z\"></path></svg>",
    "subServices": [
      { "name": "سیم‌کشی ساختمان", "icon": "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" },
      { "name": "رفع اتصالی", "icon": "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
      { "name": "نصب کلید و پریز", "icon": "M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" },
      { "name": "نورپردازی", "icon": "M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.829 1.508-2.316a7.5 7.5 0 10-7.516 0c.85.487 1.508 1.333 1.508 2.316v.192" }
    ],
    "content": `
        <p class="mb-4">محتوای این بخش در حال آماده‌سازی است.</p>
    `
  },
  "renovation": {
    "id": "renovation",
    "title": "تعمیرات و بازسازی ساختمان | خدمات تخصصی بهدون",
    "metaDesc": "خدمات بازسازی کامل، نقاشی، کاشی کاری، بنایی، و دکوراسیون داخلی در تهران.",
    "subtitle": "خلق فضایی نو در خانه شما. از بازسازی کامل و تغییر پلان تا خرده‌کاری‌های بنایی، نقاشی و نصب کاشی.",
    "icon": "<svg class=\"w-10 h-10\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4\"></path></svg>",
    "subServices": [
      { "name": "بازسازی کامل", "icon": "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" },
      { "name": "نقاشی ساختمان", "icon": "M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.879-6.84a1.5 1.5 0 00-1.4-2.136h-4.36c-.4 0-.76.222-.962.57L9.043 9.382a16.002 16.002 0 00-2.317 5.101" },
      { "name": "کاشی و سرامیک", "icon": "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" },
      { "name": "کناف‌کاری و سقف کاذب", "icon": "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" },
      { "name": "تخریب و خاک‌برداری", "icon": "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" },
      { "name": "دیوارکشی", "icon": "M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.75M5.25 9h3.75m-3.75 3h3.75m-3.75 3h3.75m3.75-6h3.825m-3.825 3h3.825m-3.825 3h3.825M5.25 21h14.25" },
      { "name": "سیمان‌کاری", "icon": "M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.879-6.84a1.5 1.5 0 00-1.4-2.136h-4.36c-.4 0-.76.222-.962.57L9.043 9.382a16.002 16.002 0 00-2.317 5.101" },
      { "name": "تعمیرات بنایی", "icon": "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.83-5.83M15 12a3 3 0 11-6 0 3 3 0 016 0z" }
    ],
    "content": `
        <p class="mb-4">محتوای این بخش در حال آماده‌سازی است.</p>
    `
  }
};

function renderServicePage(serviceId) {
    const data = servicesData[serviceId];
    if (!data) return '404';

    const breadcrumbs = `
        <nav class="flex text-sm text-slate-500 mb-6 justify-start" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 space-x-reverse md:space-x-3 bg-white border border-slate-200 shadow-sm rounded-2xl px-5 py-3">
                <li class="inline-flex items-center">
                    <a href="/" class="inline-flex items-center hover:text-brand-600 transition-colors">
                        <svg class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                        خانه
                    </a>
                </li>
                <li>
                    <div class="flex items-center">
                        <svg class="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                        <a href="/#services" class="mr-1 md:mr-2 hover:text-brand-600 transition-colors">خدمات</a>
                    </div>
                </li>
                <li aria-current="page">
                    <div class="flex items-center">
                        <svg class="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                        <span class="mr-1 md:mr-2 text-slate-700 font-bold" id="breadcrumb-current">${data.title}</span>
                    </div>
                </li>
            </ol>
        </nav>
    `;

    const heroSection = `
        <div class="pt-8 pb-4">
            <div class="container mx-auto px-4 max-w-5xl">
                ${breadcrumbs}
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
            <div onclick="switchTab('${index}', '${sub.name}')" id="tab-btn-${index}" class="${containerClass}">
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
                <h2 class="text-xl md:text-2xl font-black text-slate-800 mb-6 flex items-center gap-2"><span class="w-2 h-6 bg-brand-500 rounded-full inline-block"></span> ${sub.name}</h2>
                <div class="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 md:p-12 text-center">
                    <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-400">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${sub.icon}"></path></svg>
                    </div>
                    <h3 class="text-lg font-bold text-slate-700 mb-2">محتوای «${sub.name}» در حال آماده‌سازی است</h3>
                    <p class="text-sm text-slate-500">به زودی اطلاعات کامل و تخصصی این خدمت در این بخش قرار خواهد گرفت.</p>
                </div>
            </div>
        `).join('');
    } else {
        tabContents = `<div class="tab-content block">${data.content}</div>`;
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
            function switchTab(tabId, tabName) {
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
                    const originalTitle = "${data.title}";
                    breadcrumb.innerHTML = originalTitle + ' <span class="mx-1 text-slate-300">/</span> <span class="text-brand-600">' + tabName + '</span>';
                }
            }

            // Initialization logic: set the first breadcrumb text correctly
            document.addEventListener('DOMContentLoaded', () => {
                const breadcrumb = document.getElementById('breadcrumb-current');
                if(breadcrumb && breadcrumb.innerHTML === "${data.title}") {
                    const firstTabName = "${data.subServices && data.subServices[0] ? data.subServices[0].name : ''}";
                    if(firstTabName) {
                        breadcrumb.innerHTML = "${data.title}" + ' <span class="mx-1 text-slate-300">/</span> <span class="text-brand-600">' + firstTabName + '</span>';
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
// --- END INJECTED SERVICE PAGES ---

    const url = new URL(request.url);
    const path = url.pathname;

    const headerHTML = `<!DOCTYPE html>
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
                    <div>
                        <div class="font-black text-xl text-brand-600 tracking-tight">بهدون</div>
                        <div class="text-[10px] text-slate-500 font-bold tracking-wider">خدمات حرفه‌ای ساختمان</div>
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
            <div id="mobile-menu" class="hidden absolute top-[120%] left-0 w-full bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col overflow-hidden py-2">
                <a href="/services/hvac" class="px-6 py-4 border-b border-slate-100 font-bold text-slate-700 text-center" onclick="document.getElementById('mobile-menu').classList.add('hidden')">خدمات بهدون</a>
                <a href="/magazine" class="px-6 py-4 border-b border-slate-100 font-bold text-slate-700 text-center" onclick="document.getElementById('mobile-menu').classList.add('hidden')">دانشنامه</a>
                <a href="/#about-us" class="px-6 py-4 border-b border-slate-100 font-bold text-slate-700 text-center" onclick="document.getElementById('mobile-menu').classList.add('hidden')">درباره ما</a>
                <a href="tel:${PHONE}" class="px-6 py-4 font-bold text-success-600 text-center bg-success-50 flex items-center justify-center gap-2">
                    تماس: <span dir="ltr">${PHONE_DISPLAY}</span>
                </a>
            </div>
        </div>
    </header>
`;

    const footerHTML = `
    
    
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
`;

    const magazineHTML = `
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
    `;

    const singleArticleHTML = `
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
    `;

        const adminHTML = `
    <main class="min-h-screen bg-slate-50 flex" dir="rtl">
        <!-- Sidebar -->
        <aside class="w-64 bg-white border-l border-slate-200 flex flex-col hidden md:flex fixed h-full z-10">
            <div class="p-6 border-b border-slate-100 flex items-center justify-center">
                <span class="text-2xl font-black text-[#8B1C31] tracking-tight">بهدون <span class="text-sm text-slate-400 font-normal">| پنل مدیریت</span></span>
            </div>
            <nav class="flex-1 p-4 space-y-2">
                <a href="/admin" class="flex items-center gap-3 bg-rose-50 text-[#8B1C31] px-4 py-3 rounded-xl font-bold transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                    داشبورد
                </a>
                <a href="#requests" class="flex items-center gap-3 text-slate-600 hover:bg-slate-50 px-4 py-3 rounded-xl font-medium transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                    درخواست‌ها
                    <span class="mr-auto bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">12</span>
                </a>
                <a href="#services" class="flex items-center gap-3 text-slate-600 hover:bg-slate-50 px-4 py-3 rounded-xl font-medium transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    مدیریت خدمات
                </a>
                <a href="#users" class="flex items-center gap-3 text-slate-600 hover:bg-slate-50 px-4 py-3 rounded-xl font-medium transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    مشتریان
                </a>
            </nav>
            <div class="p-4 border-t border-slate-100">
                <a href="/" class="flex items-center gap-3 text-slate-500 hover:text-slate-800 px-4 py-3 rounded-xl font-medium transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    خروج / بازگشت
                </a>
            </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 md:mr-64 p-6 md:p-10">
            <header class="flex justify-between items-center mb-10 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <h1 class="text-2xl font-black text-slate-800">داشبورد</h1>
                <div class="flex items-center gap-4">
                    <button class="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 relative">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                        <span class="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
                    </button>
                    <div class="flex items-center gap-3">
                        <div class="text-left hidden md:block">
                            <div class="text-sm font-bold text-slate-800">مدیر سیستم</div>
                            <div class="text-xs text-slate-500">admin@behdoon.ir</div>
                        </div>
                        <div class="w-10 h-10 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center font-bold">M</div>
                    </div>
                </div>
            </header>

            <!-- Stats -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6">
                    <div class="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                    </div>
                    <div>
                        <div class="text-slate-500 text-sm mb-1">کل درخواست‌ها</div>
                        <div id="totalCount" class="text-3xl font-black text-slate-800">0</div>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6">
                    <div class="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div>
                        <div class="text-slate-500 text-sm mb-1">درخواست‌های در انتظار</div>
                        <div id="pendingCount" class="text-3xl font-black text-slate-800">0</div>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6">
                    <div class="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div>
                        <div class="text-slate-500 text-sm mb-1">انجام شده (این ماه)</div>
                        <div id="completedCount" class="text-3xl font-black text-slate-800">0</div>
                    </div>
                </div>
            </div>

            <!-- Recent Requests Table -->
            <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div class="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 class="text-xl font-bold text-slate-800">آخرین درخواست‌ها</h2>
                    <a href="#" class="text-sm font-bold text-[#8B1C31] hover:text-[#701627]">مشاهده همه</a>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-right border-collapse">
                        <thead>
                            <tr class="bg-slate-50 text-slate-500 text-sm">
                                <th class="p-4 font-medium border-b border-slate-100">نام مشتری</th>
                                <th class="p-4 font-medium border-b border-slate-100">شماره تماس</th>
                                <th class="p-4 font-medium border-b border-slate-100">نوع خدمت</th>
                                <th class="p-4 font-medium border-b border-slate-100">تاریخ ثبت</th>
                                <th class="p-4 font-medium border-b border-slate-100">وضعیت</th>
                                <th class="p-4 font-medium border-b border-slate-100">عملیات</th>
                            </tr>
                        </thead>
                        <tbody class="text-sm"><tr><td colspan="6" class="p-8 text-center text-slate-500">در حال دریافت اطلاعات...</td></tr></tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>
`;

    
    // Handle API requests
    // deleted duplicate url
    if (url.pathname === '/api/requests' && request.method === 'POST') {
        try {
            const body = await request.json();
            const { name, phone, service_id } = body;
            
            if (!name || !phone || !service_id) {
                return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
            }
            
            if (env.DB) {
                const result = await env.DB.prepare(
                    "INSERT INTO requests (name, phone, service_id) VALUES (?, ?, ?)"
                ).bind(name, phone, service_id).run();
                return new Response(JSON.stringify({ success: true, id: result.lastRowId }), { status: 200, headers: { 'Content-Type': 'application/json' } });
            } else {
                return new Response(JSON.stringify({ error: 'DB not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
            }
        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
    }
    
    if (url.pathname === '/api/requests' && request.method === 'GET') {
        try {
            if (env.DB) {
                const { results } = await env.DB.prepare("SELECT * FROM requests ORDER BY id DESC LIMIT 50").all();
                return new Response(JSON.stringify(results), { status: 200, headers: { 'Content-Type': 'application/json' } });
            } else {
                return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }
        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
    }

    let htmlResponse = '';
    if (path === '/admin' || path === '/admin/') {
        htmlResponse = html.replace('</head>', '<style>body{background-color:#f8fafc;}</style></head>').replace(/<body[^>]*>[\s\S]*<\/body>/i, '<body class="text-slate-700">' + adminHTML + '</body>');
    } else if (path === '/magazine' || path === '/magazine/') {
        htmlResponse = headerHTML + magazineHTML + footerHTML;
    } else if (path.startsWith('/magazine/')) {
        htmlResponse = headerHTML + singleArticleHTML + footerHTML;
    } else if (path.startsWith('/services/')) {
        const parts = path.split('/');
        const serviceId = parts[2];
        const pageContent = renderServicePage(serviceId);
        if (pageContent === '404') {
            htmlResponse = html; // fallback
        } else {
            htmlResponse = pageContent;
        }
    } else {
        htmlResponse = html;
    }

    return new Response(htmlResponse, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      },
    });
  },
};

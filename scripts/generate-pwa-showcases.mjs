import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

// --- Helper: Behdoon Logo SVG snippet ---
function getLogoSvg(x, y, size = 48) {
  const scale = size / 512;
  return `
    <g transform="translate(${x}, ${y}) scale(${scale})">
      <defs>
        <linearGradient id="purpleGrad_${x}_${y}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#a855f7" />
          <stop offset="45%" stop-color="#8b5cf6" />
          <stop offset="100%" stop-color="#6d28d9" />
        </linearGradient>
      </defs>
      <rect x="24" y="24" width="464" height="464" rx="116" fill="url(#purpleGrad_${x}_${y})" />
      <path d="M 376 175 C 376 265, 336 302, 256 302 C 176 302, 136 265, 136 175" fill="none" stroke="#ffffff" stroke-width="40" stroke-linecap="round" stroke-linejoin="round" />
      <rect x="234" y="340" width="44" height="44" rx="10" transform="rotate(45 256 362)" fill="#ffffff" />
    </g>
  `;
}

// ============================================================================
// 1. Mobile PWA Screenshot (720 x 1280) - Narrow Form Factor for Phone Prompts
// ============================================================================
function generateMobileSvg() {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="720" height="1280" viewBox="0 0 720 1280" style="background:#091224;">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="45%" stop-color="#133458" />
        <stop offset="100%" stop-color="#080e1a" />
      </linearGradient>
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.08" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.02" />
      </linearGradient>
      <linearGradient id="crimsonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#991b1b" />
        <stop offset="100%" stop-color="#8B1C31" />
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="720" height="1280" fill="url(#bgGrad)" />

    <!-- Top Status Bar -->
    <g fill="#94a3b8" font-family="Vazirmatn, Tahoma, Arial, sans-serif" font-size="20">
      <text x="50" y="46" font-weight="600">12:30</text>
      <circle cx="635" cy="40" r="5" fill="#38bdf8" />
      <circle cx="652" cy="40" r="7" fill="#38bdf8" />
      <rect x="670" y="33" width="20" height="13" rx="3" fill="#38bdf8" />
    </g>

    <!-- Header Navigation -->
    <rect x="30" y="70" width="660" height="82" rx="20" fill="url(#cardGrad)" stroke="#334155" stroke-width="1.5" />
    ${getLogoSvg(50, 84, 54)}
    <text x="120" y="122" fill="#ffffff" font-family="Vazirmatn, Tahoma, Arial, sans-serif" font-size="30" font-weight="900">بهدون</text>
    <rect x="220" y="93" width="140" height="34" rx="17" fill="#8b5cf6" fill-opacity="0.2" stroke="#8b5cf6" stroke-width="1" />
    <text x="290" y="116" fill="#c4b5fd" font-family="Vazirmatn, Tahoma, Arial, sans-serif" font-size="16" font-weight="700" text-anchor="middle">اعزام فوری تهران</text>

    <!-- Call Badge -->
    <rect x="495" y="89" width="175" height="42" rx="21" fill="url(#crimsonGrad)" />
    <text x="582" y="117" fill="#ffffff" font-family="Vazirmatn, Tahoma, Arial, sans-serif" font-size="18" font-weight="800" text-anchor="middle" direction="ltr">۰۹۳۳۳۲۵۶۸۸۵</text>

    <!-- Hero Card -->
    <rect x="30" y="175" width="660" height="240" rx="26" fill="#1e293b" stroke="#334155" stroke-width="2" />
    <text x="650" y="235" fill="#f8fafc" font-family="Vazirmatn, Tahoma, Arial, sans-serif" font-size="28" font-weight="900" text-anchor="end">سامانه آنلاین خدمات فنی و تأسیسات</text>
    <text x="650" y="278" fill="#38bdf8" font-family="Vazirmatn, Tahoma, Arial, sans-serif" font-size="24" font-weight="800" text-anchor="end">پوشش سراسری کلیه مناطق ۲۲‌گانه شهر تهران</text>
    <text x="650" y="318" fill="#94a3b8" font-family="Vazirmatn, Tahoma, Arial, sans-serif" font-size="18" text-anchor="end">اعزام تکنسین متخصص زیر ۴۵ دقیقه با ضمانت کتبی ۳۰ روزه کیفیت</text>

    <!-- Order Now Button -->
    <rect x="60" y="345" width="600" height="52" rx="16" fill="url(#crimsonGrad)" />
    <text x="360" y="379" fill="#ffffff" font-family="Vazirmatn, Tahoma, Arial, sans-serif" font-size="20" font-weight="800" text-anchor="middle">ثبت آنلاین درخواست تکنسین ←</text>

    <!-- Service Categories Header -->
    <text x="660" y="460" fill="#ffffff" font-family="Vazirmatn, Tahoma, Arial, sans-serif" font-size="24" font-weight="800" text-anchor="end">دسته‌بندی خدمات تخصصی ساختمان</text>

    <!-- Category 1: HVAC -->
    <g transform="translate(375, 485)">
      <rect width="315" height="155" rx="22" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5" />
      <circle cx="260" cy="48" r="26" fill="#3b82f6" fill-opacity="0.2" />
      <text x="260" y="56" fill="#60a5fa" font-size="26" text-anchor="middle">❄</text>
      <text x="280" y="105" fill="#f8fafc" font-family="Vazirmatn, Tahoma, sans-serif" font-size="20" font-weight="800" text-anchor="end">سرمایش و گرمایش</text>
      <text x="280" y="135" fill="#94a3b8" font-family="Vazirmatn, Tahoma, sans-serif" font-size="15" text-anchor="end">تعمیر پکیج دیواری، کولر آبی و گازی</text>
    </g>

    <!-- Category 2: Plumbing -->
    <g transform="translate(30, 485)">
      <rect width="315" height="155" rx="22" fill="#1e293b" stroke="#06b6d4" stroke-width="1.5" />
      <circle cx="260" cy="48" r="26" fill="#06b6d4" fill-opacity="0.2" />
      <text x="260" y="56" fill="#22d3ee" font-size="26" text-anchor="middle">💧</text>
      <text x="280" y="105" fill="#f8fafc" font-family="Vazirmatn, Tahoma, sans-serif" font-size="20" font-weight="800" text-anchor="end">لوله‌کشی و تأسیسات</text>
      <text x="280" y="135" fill="#94a3b8" font-family="Vazirmatn, Tahoma, sans-serif" font-size="15" text-anchor="end">تشخیص نشت با دستگاه، رفع نم</text>
    </g>

    <!-- Category 3: Electrical -->
    <g transform="translate(375, 665)">
      <rect width="315" height="155" rx="22" fill="#1e293b" stroke="#eab308" stroke-width="1.5" />
      <circle cx="260" cy="48" r="26" fill="#eab308" fill-opacity="0.2" />
      <text x="260" y="56" fill="#facc15" font-size="26" text-anchor="middle">⚡</text>
      <text x="280" y="105" fill="#f8fafc" font-family="Vazirmatn, Tahoma, sans-serif" font-size="20" font-weight="800" text-anchor="end">برقکاری ساختمان</text>
      <text x="280" y="135" fill="#94a3b8" font-family="Vazirmatn, Tahoma, sans-serif" font-size="15" text-anchor="end">رفع اتصالی شبانه‌روزی و سیم‌کشی</text>
    </g>

    <!-- Category 4: Renovation -->
    <g transform="translate(30, 665)">
      <rect width="315" height="155" rx="22" fill="#1e293b" stroke="#ec4899" stroke-width="1.5" />
      <circle cx="260" cy="48" r="26" fill="#ec4899" fill-opacity="0.2" />
      <text x="260" y="56" fill="#f472b6" font-size="26" text-anchor="middle">🎨</text>
      <text x="280" y="105" fill="#f8fafc" font-family="Vazirmatn, Tahoma, sans-serif" font-size="20" font-weight="800" text-anchor="end">تعمیرات و بازسازی</text>
      <text x="280" y="135" fill="#94a3b8" font-family="Vazirmatn, Tahoma, sans-serif" font-size="15" text-anchor="end">نقاشی، کاشی‌کاری، ایزوگام بام</text>
    </g>

    <!-- Guarantees & Trust Section -->
    <rect x="30" y="845" width="660" height="255" rx="26" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
    <text x="655" y="888" fill="#f8fafc" font-family="Vazirmatn, Tahoma, sans-serif" font-size="22" font-weight="800" text-anchor="end">مزایای انحصاری سامانه بهدون</text>

    <!-- Guarantee items -->
    <g transform="translate(50, 915)">
      <circle cx="585" cy="18" r="14" fill="#22c55e" fill-opacity="0.2" />
      <text x="585" y="24" fill="#4ade80" font-size="16" text-anchor="middle">✓</text>
      <text x="555" y="24" fill="#f1f5f9" font-family="Vazirmatn, Tahoma, sans-serif" font-size="18" font-weight="700" text-anchor="end">ضمانت کتبی ۳۰ روزه کیفیت خدمات</text>
      <text x="555" y="46" fill="#94a3b8" font-family="Vazirmatn, Tahoma, sans-serif" font-size="15" text-anchor="end">رفع رایگان هرگونه نقص کارکردی تا یک ماه پس از سفارش</text>

      <circle cx="585" cy="80" r="14" fill="#22c55e" fill-opacity="0.2" />
      <text x="585" y="86" fill="#4ade80" font-size="16" text-anchor="middle">✓</text>
      <text x="555" y="86" fill="#f1f5f9" font-family="Vazirmatn, Tahoma, sans-serif" font-size="18" font-weight="700" text-anchor="end">اعزام فوری زیر ۴۵ دقیقه در شهر تهران</text>
      <text x="555" y="108" fill="#94a3b8" font-family="Vazirmatn, Tahoma, sans-serif" font-size="15" text-anchor="end">استقرار تیم‌های سیار در کلیه مناطق ۲۲‌گانه پایتخت</text>

      <circle cx="585" cy="142" r="14" fill="#22c55e" fill-opacity="0.2" />
      <text x="585" y="148" fill="#4ade80" font-size="16" text-anchor="middle">✓</text>
      <text x="555" y="148" fill="#f1f5f9" font-family="Vazirmatn, Tahoma, sans-serif" font-size="18" font-weight="700" text-anchor="end">تعرفه‌های مصوب و شفاف اتحادیه</text>
      <text x="555" y="170" fill="#94a3b8" font-family="Vazirmatn, Tahoma, sans-serif" font-size="15" text-anchor="end">صدور فاکتور رسمی تفکیکی قطعات و اجرت پیش از آغاز کار</text>
    </g>

    <!-- Bottom App Navigation Bar -->
    <rect x="0" y="1180" width="720" height="100" fill="#0f172a" stroke="#1e293b" stroke-width="1" />
    <g font-family="Vazirmatn, Tahoma, sans-serif" font-size="18" font-weight="700">
      <text x="100" y="1242" fill="#38bdf8" text-anchor="middle">خانه</text>
      <text x="270" y="1242" fill="#94a3b8" text-anchor="middle">خدمات</text>
      <text x="450" y="1242" fill="#94a3b8" text-anchor="middle">پیگیری سفارش</text>
      <text x="620" y="1242" fill="#94a3b8" text-anchor="middle">مجله ساختمان</text>
    </g>
  </svg>
  `;
}

// ============================================================================
// 2. Desktop Web App Screenshot (1440 x 900) - Client Showcase & Desktop PWA
// ============================================================================
function generateDesktopSvg() {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="1440" height="900" viewBox="0 0 1440 900" style="background:#0b1329;">
    <defs>
      <linearGradient id="d_bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="45%" stop-color="#133458" />
        <stop offset="100%" stop-color="#091122" />
      </linearGradient>
      <linearGradient id="d_crimsonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#991b1b" />
        <stop offset="100%" stop-color="#8B1C31" />
      </linearGradient>
    </defs>

    <!-- Browser Window Frame -->
    <rect width="1440" height="900" fill="url(#d_bgGrad)" />

    <!-- Browser Title Bar -->
    <rect width="1440" height="48" fill="#1e293b" />
    <circle cx="30" cy="24" r="7" fill="#ef4444" />
    <circle cx="52" cy="24" r="7" fill="#eab308" />
    <circle cx="74" cy="24" r="7" fill="#22c55e" />

    <!-- Browser URL Bar -->
    <rect x="200" y="10" width="1040" height="28" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1" />
    <text x="720" y="29" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14" text-anchor="middle">https://behdoon.ir</text>

    <!-- Top Web Navbar -->
    <rect x="60" y="65" width="1320" height="74" rx="20" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
    ${getLogoSvg(85, 78, 48)}
    <text x="145" y="112" fill="#ffffff" font-family="Vazirmatn, Tahoma, sans-serif" font-size="28" font-weight="900">بهدون</text>
    <rect x="245" y="87" width="140" height="30" rx="15" fill="#8b5cf6" fill-opacity="0.2" stroke="#8b5cf6" stroke-width="1" />
    <text x="315" y="108" fill="#c4b5fd" font-family="Vazirmatn, Tahoma, sans-serif" font-size="14" font-weight="700" text-anchor="middle">سامانه شهر تهران</text>

    <!-- Nav Links -->
    <g fill="#cbd5e1" font-family="Vazirmatn, Tahoma, sans-serif" font-size="16" font-weight="600">
      <text x="750" y="110">خدمات تخصصی</text>
      <text x="890" y="110">مجله ساختمان</text>
      <text x="1030" y="110">پیگیری درخواست</text>
    </g>

    <!-- Call & CTA Buttons -->
    <rect x="1190" y="79" width="170" height="46" rx="14" fill="url(#d_crimsonGrad)" />
    <text x="1275" y="108" fill="#ffffff" font-family="Vazirmatn, Tahoma, sans-serif" font-size="16" font-weight="800" text-anchor="middle">ثبت درخواست تکنسین</text>

    <!-- Main Body Area -->
    <!-- Booking Card (Left) -->
    <g transform="translate(60, 175)">
      <rect width="520" height="560" rx="24" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
      <text x="485" y="55" fill="#f8fafc" font-family="Vazirmatn, Tahoma, sans-serif" font-size="22" font-weight="800" text-anchor="end">ثبت آنلاین درخواست تکنسین</text>
      <text x="485" y="90" fill="#94a3b8" font-family="Vazirmatn, Tahoma, sans-serif" font-size="15" text-anchor="end">تخصص مورد نظر خود را جهت اعزام فوری انتخاب نمایید:</text>

      <!-- Category Grid inside card -->
      <g transform="translate(25, 120)">
        <!-- Row 1 -->
        <rect x="315" y="0" width="150" height="110" rx="16" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5" />
        <text x="390" y="48" fill="#60a5fa" font-size="28" text-anchor="middle">❄</text>
        <text x="390" y="85" fill="#f8fafc" font-family="Vazirmatn, Tahoma, sans-serif" font-size="15" font-weight="700" text-anchor="middle">پکیج و کولر</text>

        <rect x="157" y="0" width="150" height="110" rx="16" fill="#0f172a" stroke="#06b6d4" stroke-width="1.5" />
        <text x="232" y="48" fill="#22d3ee" font-size="28" text-anchor="middle">💧</text>
        <text x="232" y="85" fill="#f8fafc" font-family="Vazirmatn, Tahoma, sans-serif" font-size="15" font-weight="700" text-anchor="middle">نشت‌یابی و لوله</text>

        <rect x="0" y="0" width="150" height="110" rx="16" fill="#0f172a" stroke="#eab308" stroke-width="1.5" />
        <text x="75" y="48" fill="#facc15" font-size="28" text-anchor="middle">⚡</text>
        <text x="75" y="85" fill="#f8fafc" font-family="Vazirmatn, Tahoma, sans-serif" font-size="15" font-weight="700" text-anchor="middle">برق و اتصالی</text>

        <!-- Row 2 -->
        <rect x="315" y="125" width="150" height="110" rx="16" fill="#0f172a" stroke="#ec4899" stroke-width="1.5" />
        <text x="390" y="173" fill="#f472b6" font-size="28" text-anchor="middle">🎨</text>
        <text x="390" y="210" fill="#f8fafc" font-family="Vazirmatn, Tahoma, sans-serif" font-size="15" font-weight="700" text-anchor="middle">نقاشی و بازسازی</text>

        <rect x="157" y="125" width="150" height="110" rx="16" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.5" />
        <text x="232" y="173" fill="#a78bfa" font-size="28" text-anchor="middle">🔑</text>
        <text x="232" y="210" fill="#f8fafc" font-family="Vazirmatn, Tahoma, sans-serif" font-size="15" font-weight="700" text-anchor="middle">کلیدسازی فوری</text>

        <rect x="0" y="125" width="150" height="110" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="1.5" />
        <text x="75" y="173" fill="#34d399" font-size="28" text-anchor="middle">🚪</text>
        <text x="75" y="210" fill="#f8fafc" font-family="Vazirmatn, Tahoma, sans-serif" font-size="15" font-weight="700" text-anchor="middle">درب و پنجره</text>
      </g>

      <!-- Fast Action Button in card -->
      <rect x="25" y="475" width="470" height="54" rx="16" fill="url(#d_crimsonGrad)" />
      <text x="260" y="509" fill="#ffffff" font-family="Vazirmatn, Tahoma, sans-serif" font-size="18" font-weight="800" text-anchor="middle">ثبت سفارش فوری آنلاین ←</text>
    </g>

    <!-- Right Hero Section -->
    <g transform="translate(620, 200)">
      <rect x="520" y="0" width="240" height="36" rx="18" fill="#38bdf8" fill-opacity="0.15" stroke="#38bdf8" stroke-width="1" />
      <text x="640" y="24" fill="#38bdf8" font-family="Vazirmatn, Tahoma, sans-serif" font-size="15" font-weight="700" text-anchor="middle">پوشش سراسری شهر تهران</text>

      <text x="760" y="85" fill="#ffffff" font-family="Vazirmatn, Tahoma, sans-serif" font-size="34" font-weight="900" text-anchor="end">سامانه هوشمند خدمات فنی و تاسیسات</text>
      <text x="760" y="135" fill="#38bdf8" font-family="Vazirmatn, Tahoma, sans-serif" font-size="26" font-weight="800" text-anchor="end">اعزام فوری تکنسین متخصص به تمام مناطق ۲۲‌گانه</text>
      <text x="760" y="180" fill="#cbd5e1" font-family="Vazirmatn, Tahoma, sans-serif" font-size="17" text-anchor="end">تضمین کیفیت کتبی ۳۰ روزه، فاکتور رسمی شفاف، تکنسین‌های تایید صلاحیت‌شده فنی</text>

      <!-- 4 Feature Badges in 2x2 grid -->
      <g transform="translate(180, 230)">
        <rect x="300" y="0" width="280" height="68" rx="18" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
        <text x="555" y="42" fill="#38bdf8" font-size="24">⚡</text>
        <text x="515" y="34" fill="#f8fafc" font-family="Vazirmatn, Tahoma, sans-serif" font-size="16" font-weight="800" text-anchor="end">اعزام زیر ۴۵ دقیقه</text>
        <text x="515" y="56" fill="#94a3b8" font-family="Vazirmatn, Tahoma, sans-serif" font-size="13" text-anchor="end">سریع‌ترین حضور در محل کار یا منزل</text>

        <rect x="0" y="0" width="280" height="68" rx="18" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
        <text x="255" y="42" fill="#4ade80" font-size="24">🛡</text>
        <text x="215" y="34" fill="#f8fafc" font-family="Vazirmatn, Tahoma, sans-serif" font-size="16" font-weight="800" text-anchor="end">گارانتی ۳۰ روزه کتبی</text>
        <text x="215" y="56" fill="#94a3b8" font-family="Vazirmatn, Tahoma, sans-serif" font-size="13" text-anchor="end">پشتیبانی کامل و تضمین حسن انجام کار</text>

        <rect x="300" y="85" width="280" height="68" rx="18" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
        <text x="555" y="127" fill="#fbbf24" font-size="24">⚖</text>
        <text x="515" y="119" fill="#f8fafc" font-family="Vazirmatn, Tahoma, sans-serif" font-size="16" font-weight="800" text-anchor="end">تعرفه رسمی مصوب</text>
        <text x="515" y="141" fill="#94a3b8" font-family="Vazirmatn, Tahoma, sans-serif" font-size="13" text-anchor="end">بدون هزینه اضافی با فاکتور دقیق</text>

        <rect x="0" y="85" width="280" height="68" rx="18" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
        <text x="255" y="127" fill="#c084fc" font-size="24">⭐</text>
        <text x="215" y="119" fill="#f8fafc" font-family="Vazirmatn, Tahoma, sans-serif" font-size="16" font-weight="800" text-anchor="end">رضایت ۹۸.۶٪ مشتریان</text>
        <text x="215" y="141" fill="#94a3b8" font-family="Vazirmatn, Tahoma, sans-serif" font-size="13" text-anchor="end">ارزیابی مستمر کیفیت تکنسین‌ها</text>
      </g>

      <!-- Support & Phone box -->
      <g transform="translate(180, 415)">
        <rect width="580" height="75" rx="20" fill="#0f172a" stroke="#8b5cf6" stroke-opacity="0.4" stroke-width="1.5" />
        <text x="550" y="36" fill="#ffffff" font-family="Vazirmatn, Tahoma, sans-serif" font-size="16" font-weight="800" text-anchor="end">پشتیبانی و مشاوره تلفنی رایگان شبانه‌روزی</text>
        <text x="550" y="60" fill="#94a3b8" font-family="Vazirmatn, Tahoma, sans-serif" font-size="14" text-anchor="end">کارشناسان بهدون آماده پاسخگویی و هماهنگی فوری هستند</text>
        <rect x="30" y="16" width="160" height="42" rx="12" fill="url(#d_crimsonGrad)" />
        <text x="110" y="43" fill="#ffffff" font-family="Vazirmatn, Tahoma, sans-serif" font-size="16" font-weight="900" text-anchor="middle" direction="ltr">۰۹۳۳۳۲۵۶۸۸۵</text>
      </g>
    </g>

    <!-- Bottom Districts Strip -->
    <rect x="60" y="775" width="1320" height="90" rx="20" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
    <text x="1340" y="812" fill="#38bdf8" font-family="Vazirmatn, Tahoma, sans-serif" font-size="17" font-weight="800" text-anchor="end">مناطق ۲۲‌گانه تحت پوشش خدمات فنی و تاسیسات بهدون در تهران</text>
    <text x="1340" y="842" fill="#cbd5e1" font-family="Vazirmatn, Tahoma, sans-serif" font-size="14" text-anchor="end">شمال تهران (تجریش، نیاوران، پاسداران، الهیه، ولنجک) • غرب تهران (سعادت‌آباد، شهرک غرب، صادقیه، پونک) • شرق تهران (تهرانپارس، نارمک، رسالت، پیروزی) • مرکز و جنوب تهران</text>
  </svg>
  `;
}

// ============================================================================
// 3. Admin Management Panel Screenshot (1440 x 900) - For admin_showcase.png
// ============================================================================
function generateAdminSvg() {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="1440" height="900" viewBox="0 0 1440 900" style="background:#0f172a;">
    <!-- Browser Window Frame -->
    <rect width="1440" height="48" fill="#1e293b" />
    <circle cx="30" cy="24" r="7" fill="#ef4444" />
    <circle cx="52" cy="24" r="7" fill="#eab308" />
    <circle cx="74" cy="24" r="7" fill="#22c55e" />
    <rect x="200" y="10" width="1040" height="28" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1" />
    <text x="720" y="29" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14" text-anchor="middle">https://behdoon.ir/management</text>

    <!-- Admin Topbar -->
    <rect y="48" width="1440" height="70" fill="#1e293b" stroke="#334155" stroke-width="1" />
    ${getLogoSvg(50, 59, 48)}
    <text x="115" y="93" fill="#ffffff" font-family="Vazirmatn, Tahoma, sans-serif" font-size="24" font-weight="900">پنل مدیریت بهدون</text>
    <rect x="330" y="69" width="170" height="28" rx="14" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6" stroke-width="1" />
    <text x="415" y="88" fill="#60a5fa" font-family="Vazirmatn, Tahoma, sans-serif" font-size="13" font-weight="700" text-anchor="middle">مدیریت اعزام و تکنسین‌ها</text>

    <text x="1350" y="90" fill="#cbd5e1" font-family="Vazirmatn, Tahoma, sans-serif" font-size="15" text-anchor="end">خوش آمدید، مدیر سیستم | نسخه ۲.۱ بهدون</text>

    <!-- 4 Stats Cards -->
    <g transform="translate(60, 145)">
      <!-- Card 1 -->
      <rect x="1005" y="0" width="315" height="120" rx="18" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5" />
      <text x="1295" y="45" fill="#94a3b8" font-family="Vazirmatn, Tahoma, sans-serif" font-size="16" text-anchor="end">سفارش‌های امروز تهران</text>
      <text x="1295" y="95" fill="#ffffff" font-family="Vazirmatn, Tahoma, sans-serif" font-size="36" font-weight="900" text-anchor="end">۴۸ خدمت</text>
      <circle cx="1045" cy="60" r="24" fill="#3b82f6" fill-opacity="0.2" />
      <text x="1045" y="68" fill="#60a5fa" font-size="24" text-anchor="middle">📦</text>

      <!-- Card 2 -->
      <rect x="670" y="0" width="315" height="120" rx="18" fill="#1e293b" stroke="#22c55e" stroke-width="1.5" />
      <text x="960" y="45" fill="#94a3b8" font-family="Vazirmatn, Tahoma, sans-serif" font-size="16" text-anchor="end">تکنسین‌های آماده‌به‌کار</text>
      <text x="960" y="95" fill="#ffffff" font-family="Vazirmatn, Tahoma, sans-serif" font-size="36" font-weight="900" text-anchor="end">۱۲۴ متخصص</text>
      <circle cx="710" cy="60" r="24" fill="#22c55e" fill-opacity="0.2" />
      <text x="710" y="68" fill="#4ade80" font-size="24" text-anchor="middle">👷</text>

      <!-- Card 3 -->
      <rect x="335" y="0" width="315" height="120" rx="18" fill="#1e293b" stroke="#eab308" stroke-width="1.5" />
      <text x="625" y="45" fill="#94a3b8" font-family="Vazirmatn, Tahoma, sans-serif" font-size="16" text-anchor="end">ضمانت‌های فعال ۳۰ روزه</text>
      <text x="625" y="95" fill="#ffffff" font-family="Vazirmatn, Tahoma, sans-serif" font-size="36" font-weight="900" text-anchor="end">۸۹۰ گارانتی</text>
      <circle cx="375" cy="60" r="24" fill="#eab308" fill-opacity="0.2" />
      <text x="375" y="68" fill="#facc15" font-size="24" text-anchor="middle">🛡</text>

      <!-- Card 4 -->
      <rect x="0" y="0" width="315" height="120" rx="18" fill="#1e293b" stroke="#a855f7" stroke-width="1.5" />
      <text x="290" y="45" fill="#94a3b8" font-family="Vazirmatn, Tahoma, sans-serif" font-size="16" text-anchor="end">نرخ رضایت مشتریان</text>
      <text x="290" y="95" fill="#ffffff" font-family="Vazirmatn, Tahoma, sans-serif" font-size="36" font-weight="900" text-anchor="end">۹۸.۶٪</text>
      <circle cx="40" cy="60" r="24" fill="#a855f7" fill-opacity="0.2" />
      <text x="40" y="68" fill="#c084fc" font-size="24" text-anchor="middle">⭐</text>
    </g>

    <!-- Live Orders Table Section -->
    <rect x="60" y="295" width="1320" height="560" rx="22" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
    <text x="1340" y="345" fill="#ffffff" font-family="Vazirmatn, Tahoma, sans-serif" font-size="22" font-weight="800" text-anchor="end">میز کار زنده اعزام و مدیریت درخواست‌های ساختمان (تهران)</text>

    <!-- Table Header -->
    <rect x="90" y="375" width="1260" height="50" rx="12" fill="#0f172a" />
    <g fill="#94a3b8" font-family="Vazirmatn, Tahoma, sans-serif" font-size="15" font-weight="700">
      <text x="1310" y="406" text-anchor="end">کد پیگیری</text>
      <text x="1100" y="406" text-anchor="end">نوع خدمت</text>
      <text x="860" y="406" text-anchor="end">منطقه / محله تهران</text>
      <text x="630" y="406" text-anchor="end">تکنسین اعزامی</text>
      <text x="410" y="406" text-anchor="end">مبلغ مصوب</text>
      <text x="200" y="406" text-anchor="end">وضعیت سفارش</text>
    </g>

    <!-- Row 1 -->
    <rect x="90" y="435" width="1260" height="65" rx="10" fill="#0f172a" fill-opacity="0.4" />
    <g fill="#f8fafc" font-family="Vazirmatn, Tahoma, sans-serif" font-size="15">
      <text x="1310" y="474" font-weight="700" text-anchor="end">#BHD-9021</text>
      <text x="1100" y="474" text-anchor="end">تعمیر و اسیدشویی پکیج دیواری</text>
      <text x="860" y="474" text-anchor="end">تهران، سعادت‌آباد</text>
      <text x="630" y="474" text-anchor="end">استاد محمدی (کد ۱۰۴)</text>
      <text x="410" y="474" text-anchor="end">۱,۲۰۰,۰۰۰ تومان</text>
      <rect x="120" y="452" width="110" height="30" rx="8" fill="#3b82f6" fill-opacity="0.2" />
      <text x="175" y="473" fill="#60a5fa" font-weight="700" text-anchor="middle">در حال انجام</text>
    </g>

    <!-- Row 2 -->
    <rect x="90" y="510" width="1260" height="65" rx="10" fill="#0f172a" fill-opacity="0.4" />
    <g fill="#f8fafc" font-family="Vazirmatn, Tahoma, sans-serif" font-size="15">
      <text x="1310" y="549" font-weight="700" text-anchor="end">#BHD-9020</text>
      <text x="1100" y="549" text-anchor="end">تشخیص نشت لوله با دستگاه تصویری</text>
      <text x="860" y="549" text-anchor="end">تهران، تهرانپارس غربی</text>
      <text x="630" y="549" text-anchor="end">مهندس رضایی (کد ۲۰۸)</text>
      <text x="410" y="549" text-anchor="end">۹۵۰,۰۰۰ تومان</text>
      <rect x="120" y="527" width="110" height="30" rx="8" fill="#eab308" fill-opacity="0.2" />
      <text x="175" y="548" fill="#facc15" font-weight="700" text-anchor="middle">اعزام تکنسین</text>
    </g>

    <!-- Row 3 -->
    <rect x="90" y="585" width="1260" height="65" rx="10" fill="#0f172a" fill-opacity="0.4" />
    <g fill="#f8fafc" font-family="Vazirmatn, Tahoma, sans-serif" font-size="15">
      <text x="1310" y="624" font-weight="700" text-anchor="end">#BHD-9019</text>
      <text x="1100" y="624" text-anchor="end">رفع اتصالی شبانه‌روزی و تعویض فیوز</text>
      <text x="860" y="624" text-anchor="end">تهران، یوسف‌آباد</text>
      <text x="630" y="624" text-anchor="end">استاد اکبری (کد ۱۱۵)</text>
      <text x="410" y="624" text-anchor="end">۶۰۰,۰۰۰ تومان</text>
      <rect x="120" y="602" width="110" height="30" rx="8" fill="#22c55e" fill-opacity="0.2" />
      <text x="175" y="623" fill="#4ade80" font-weight="700" text-anchor="middle">تکمیل و فاکتور</text>
    </g>

    <!-- Row 4 -->
    <rect x="90" y="660" width="1260" height="65" rx="10" fill="#0f172a" fill-opacity="0.4" />
    <g fill="#f8fafc" font-family="Vazirmatn, Tahoma, sans-serif" font-size="15">
      <text x="1310" y="699" font-weight="700" text-anchor="end">#BHD-9018</text>
      <text x="1100" y="699" text-anchor="end">سرویس کولر گازی و شارژ گاز R410</text>
      <text x="860" y="699" text-anchor="end">تهران، نیاوران</text>
      <text x="630" y="699" text-anchor="end">مهندس کاظمی (کد ۳۰۲)</text>
      <text x="410" y="699" text-anchor="end">۱,۸۵۰,۰۰۰ تومان</text>
      <rect x="120" y="677" width="110" height="30" rx="8" fill="#22c55e" fill-opacity="0.2" />
      <text x="175" y="698" fill="#4ade80" font-weight="700" text-anchor="middle">تکمیل و فاکتور</text>
    </g>

    <!-- Row 5 -->
    <rect x="90" y="735" width="1260" height="65" rx="10" fill="#0f172a" fill-opacity="0.4" />
    <g fill="#f8fafc" font-family="Vazirmatn, Tahoma, sans-serif" font-size="15">
      <text x="1310" y="774" font-weight="700" text-anchor="end">#BHD-9017</text>
      <text x="1100" y="774" text-anchor="end">نقاشی ساختمان و رنگ‌آمیزی دیوار</text>
      <text x="860" y="774" text-anchor="end">تهران، صادقیه</text>
      <text x="630" y="774" text-anchor="end">استاد حسینی (کد ۴۰۵)</text>
      <text x="410" y="774" text-anchor="end">۳,۴۰۰,۰۰۰ تومان</text>
      <rect x="120" y="752" width="110" height="30" rx="8" fill="#8b5cf6" fill-opacity="0.2" />
      <text x="175" y="773" fill="#a78bfa" font-weight="700" text-anchor="middle">در صف اعزام</text>
    </g>
  </svg>
  `;
}

// ============================================================================
// Main Execution
// ============================================================================
async function main() {
  console.log('[PWA Showcases] Generating Behdoon showcase and screenshot assets...');

  // 1. Mobile Screenshot (720x1280)
  const mobileSvg = generateMobileSvg();
  const mobilePng = await sharp(Buffer.from(mobileSvg)).png().toBuffer();
  writeFileSync(join(publicDir, 'screenshot_mobile.png'), mobilePng);
  console.log(`[PWA Showcases] Generated public/screenshot_mobile.png (${(mobilePng.length / 1024).toFixed(1)} KB)`);

  // 2. Desktop Screenshot (1440x900)
  const desktopSvg = generateDesktopSvg();
  const desktopPng = await sharp(Buffer.from(desktopSvg)).png().toBuffer();
  writeFileSync(join(publicDir, 'screenshot_desktop.png'), desktopPng);
  console.log(`[PWA Showcases] Generated public/screenshot_desktop.png (${(desktopPng.length / 1024).toFixed(1)} KB)`);

  // 3. Overwrite client_showcase.png with clean Behdoon desktop showcase
  writeFileSync(join(publicDir, 'client_showcase.png'), desktopPng);
  console.log(`[PWA Showcases] Overwrote public/client_showcase.png with Behdoon desktop showcase!`);

  // 4. Overwrite admin_showcase.png with clean Behdoon admin management panel
  const adminSvg = generateAdminSvg();
  const adminPng = await sharp(Buffer.from(adminSvg)).png().toBuffer();
  writeFileSync(join(publicDir, 'admin_showcase.png'), adminPng);
  console.log(`[PWA Showcases] Overwrote public/admin_showcase.png with Behdoon admin management panel!`);

  console.log('[PWA Showcases] All assets generated successfully with ZERO Behbar traces!');
}

main().catch((err) => {
  console.error('[PWA Showcases] Generation failed:', err);
  process.exit(1);
});

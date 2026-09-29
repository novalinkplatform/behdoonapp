import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const htmlContent = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <style>
    @font-face {
      font-family: 'Vazirmatn';
      src: url('file:///C:/Users/Administrator/.gemini/antigravity/scratch/home-repair-worker/public/fonts/IRANSansWeb_Medium.woff2') format('woff2');
      font-weight: 500;
    }
    @font-face {
      font-family: 'Vazirmatn';
      src: url('file:///C:/Users/Administrator/.gemini/antigravity/scratch/home-repair-worker/public/fonts/IRANSansWeb_Bold.woff2') format('woff2');
      font-weight: 700;
    }
    @font-face {
      font-family: 'Vazirmatn';
      src: url('file:///C:/Users/Administrator/.gemini/antigravity/scratch/home-repair-worker/public/fonts/IRANSansWeb_Black.woff2') format('woff2');
      font-weight: 900;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      background: #090a16;
      font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    /* Ambient Background Lights */
    .ambient-bg {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 80% 25%, rgba(124, 58, 237, 0.45) 0%, rgba(124, 58, 237, 0.08) 50%, transparent 75%),
                  radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0.05) 50%, transparent 70%),
                  radial-gradient(circle at 50% 50%, rgba(30, 20, 60, 0.9) 0%, #090a16 100%);
      z-index: 1;
    }

    .grid-lines {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 80px 80px;
      z-index: 2;
    }

    .card-frame {
      position: relative;
      z-index: 10;
      width: 1100px;
      height: 540px;
      background: rgba(18, 16, 36, 0.85);
      border: 1.5px solid rgba(168, 85, 247, 0.35);
      border-radius: 36px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(20px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 50px 65px;
    }

    /* Right Section: Content */
    .content-side {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .brand-row {
      display: flex;
      align-items: baseline;
      gap: 16px;
    }

    .brand-title {
      font-size: 68px;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: -1px;
      line-height: 1;
      text-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
    }

    .brand-latin {
      font-size: 30px;
      font-weight: 700;
      color: #c4b5fd;
      letter-spacing: 0.5px;
      direction: ltr;
    }

    .main-slogan {
      font-size: 31px;
      font-weight: 800;
      color: #f1f5f9;
      line-height: 1.35;
    }

    .sub-services {
      font-size: 20px;
      font-weight: 600;
      color: #94a3b8;
      line-height: 1.5;
    }

    .badges-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 10px;
    }

    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      border-radius: 14px;
      font-size: 16px;
      font-weight: 700;
    }

    .badge-purple {
      background: rgba(124, 58, 237, 0.18);
      border: 1px solid rgba(168, 85, 247, 0.4);
      color: #ddd6fe;
    }

    .badge-emerald {
      background: rgba(16, 185, 129, 0.18);
      border: 1px solid rgba(16, 185, 129, 0.45);
      color: #a7f3d0;
    }

    .badge-sky {
      background: rgba(14, 165, 233, 0.18);
      border: 1px solid rgba(56, 189, 248, 0.4);
      color: #bae6fd;
    }

    .footer-bar {
      margin-top: 16px;
      padding-top: 18px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 18px;
      color: #cbd5e1;
    }

    .phone-highlight {
      color: #fbbf24;
      font-weight: 800;
      font-size: 20px;
      direction: ltr;
      display: inline-block;
    }

    /* Left Section: Logo Showcase */
    .logo-side {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      margin-right: 50px;
    }

    .logo-card {
      width: 220px;
      height: 220px;
      background: linear-gradient(135deg, #a855f7 0%, #8b5cf6 50%, #6d28d9 100%);
      border-radius: 54px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 16px 40px rgba(109, 40, 217, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.4);
      border: 2px solid rgba(255, 255, 255, 0.35);
      position: relative;
    }

    .logo-card img {
      width: 140px;
      height: 140px;
      object-fit: contain;
    }

    .url-pill {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 10px 28px;
      border-radius: 9999px;
      font-size: 20px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: 1px;
      direction: ltr;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
  </style>
</head>
<body>
  <div class="ambient-bg"></div>
  <div class="grid-lines"></div>

  <div class="card-frame">
    <div class="content-side">
      <div class="brand-row">
        <h1 class="brand-title">بِـهدون</h1>
        <span class="brand-latin">| Behdoon.ir</span>
      </div>

      <h2 class="main-slogan">سامانه هوشمند خدمات فنی و تأسیسات ساختمان</h2>
      <p class="sub-services">سرمایش و گرمایش • لوله‌کشی و تأسیسات • برقکاری • تعمیرات و بازسازی</p>

      <div class="badges-row">
        <span class="badge-pill badge-purple">⚡ اعزام فوری در تهران</span>
        <span class="badge-pill badge-emerald">🛡️ ضمانت کتبی کیفیت</span>
        <span class="badge-pill badge-sky">🧾 فاکتور رسمی و معتبر</span>
      </div>

      <div class="footer-bar">
        <span>پشتیبانی شبانه‌روزی:</span>
        <span class="phone-highlight">۰۲۱-۲۲۳۴۵۶۷۸</span>
        <span style="opacity: 0.5;">|</span>
        <span>کلیه مناطق ۲۲‌گانه شهر تهران</span>
      </div>
    </div>

    <div class="logo-side">
      <div class="logo-card">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="150" height="150">
          <g>
            <path
              d="M 376 175 C 376 265, 336 302, 256 302 C 176 302, 136 265, 136 175"
              fill="none"
              stroke="#ffffff"
              stroke-width="44"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <rect
              x="232"
              y="352"
              width="48"
              height="48"
              rx="12"
              fill="#ffffff"
              transform="rotate(45 256 376)"
            />
          </g>
        </svg>
      </div>
      <div class="url-pill">behdoon.ir</div>
    </div>
  </div>
</body>
</html>
`;

const tempHtmlPath = path.resolve('public/temp_og_preview.html');
fs.writeFileSync(tempHtmlPath, htmlContent, 'utf8');

const targetPngPath = path.resolve('public/og-image.png');
const fileUrl = 'file:///' + tempHtmlPath.replace(/\\/g, '/');

const cmd = `"${chromePath}" --headless=new --disable-gpu --window-size=1200,630 --screenshot="${targetPngPath}" "${fileUrl}"`;
console.log('Rendering 1200x630 og-image with Chrome headless...');
execSync(cmd);

if (fs.existsSync(tempHtmlPath)) {
  fs.unlinkSync(tempHtmlPath);
}

console.log('✅ Successfully rendered pixel-perfect public/og-image.png');

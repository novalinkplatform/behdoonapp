import { handleApiRequest } from './api.js';
import { adminHTML, getAdminResponse } from './admin.js';
import { headerHTML, footerHTML, html, trackHTML, magazineHTML, singleArticleHTML, renderServicePage, renderSubServicePage, servicesData } from './frontend.js';

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;

        // --- API ROUTES ---
        if (path.startsWith('/api/')) {
            return await handleApiRequest(request, env, path);
        }

        // --- PWA MANIFEST ---
        if (path === '/manifest.webmanifest' || path === '/manifest.json') {
            const manifest = {
                name: "بهدون | خدمات تخصصی ساختمان در تهران",
                short_name: "بهدون",
                description: "پلتفرم جامع خدمات تخصصی ساختمان در تهران - لوله کشی، سرمایش گرمایش، برقکاری و بازسازی",
                start_url: "/",
                display: "standalone",
                background_color: "#ffffff",
                theme_color: "#133458",
                dir: "rtl",
                lang: "fa",
                icons: [
                    {
                        src: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 512 512%22><rect width=%22512%22 height=%22512%22 rx=%22100%22 fill=%22%23133458%22/><path stroke=%22%23ffffff%22 stroke-width=%2232%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 fill=%22none%22 d=%22M384 416V128a32 32 0 00-32-32H160a32 32 0 00-32 32v288m256 0h32m-32 0h-80m-176 0H96m32 0h80M192 160h16m-16 64h16m64-64h16m-16 64h16m-80 160v-80a16 16 0 0116-16h32a16 16 0 0116 16v80m-64 0h64%22/></svg>",
                        sizes: "512x512",
                        type: "image/svg+xml",
                        purpose: "any maskable"
                    }
                ]
            };
            return new Response(JSON.stringify(manifest), {
                headers: {
                    "Content-Type": "application/manifest+json;charset=UTF-8",
                    "Cache-Control": "public, max-age=86400"
                }
            });
        }

        
        // --- SITEMAP XML ---
        if (path === '/sitemap.xml') {
            let urls = [
                'https://behdoon.ir/',
                'https://behdoon.ir/track',
                'https://behdoon.ir/magazine'
            ];
            for (const catKey of Object.keys(servicesData)) {
                urls.push(`https://behdoon.ir/services/${catKey}`);
                const cat = servicesData[catKey];
                (cat.subServices || []).forEach(sub => {
                    urls.push(`https://behdoon.ir/services/${catKey}/${sub.slug}`);
                });
            }
            const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u}</loc>
    <changefreq>weekly</changefreq>
    <priority>${u === 'https://behdoon.ir/' ? '1.0' : u.includes('/services/') ? '0.9' : '0.7'}</priority>
  </url>`).join('\n')}
</urlset>`;
            return new Response(xml, {
                headers: {
                    "Content-Type": "application/xml;charset=UTF-8",
                    "Cache-Control": "public, max-age=86400"
                }
            });
        }

        // --- HTML ROUTES ---
        let htmlResponse = '';
        if (path === '/track' || path === '/track/') {
            htmlResponse = headerHTML + trackHTML + footerHTML;
        } else if (path === '/admin' || path === '/admin/') {
            const authHeader = request.headers.get('Authorization');
            if (authHeader !== 'Basic YWRtaW46MTIz') {
                return new Response('دسترسی غیرمجاز. لطفاً نام کاربری و رمز عبور را وارد کنید.', {
                    status: 401,
                    headers: { 
                        'WWW-Authenticate': 'Basic realm="Admin Panel"',
                        'Content-Type': 'text/plain; charset=utf-8'
                    }
                });
            }
            htmlResponse = getAdminResponse(html, adminHTML);
        } else if (path === '/magazine' || path === '/magazine/') {
            htmlResponse = headerHTML + magazineHTML + footerHTML;
        } else if (path.startsWith('/magazine/')) {
            htmlResponse = headerHTML + singleArticleHTML + footerHTML;
        } else if (path.startsWith('/services/') || path === '/services') {
            const decodedPath = decodeURIComponent(path);
            const segments = decodedPath.split('/').filter(Boolean); // e.g. ['services', 'hvac', 'water-cooler']
            
            if (segments.length === 1) {
                htmlResponse = html;
            } else if (segments.length === 2) {
                const target = segments[1].toLowerCase();
                if (servicesData[target]) {
                    htmlResponse = renderServicePage(target);
                } else {
                    // Check if target matches any subservice
                    for (const catKey of Object.keys(servicesData)) {
                        const cat = servicesData[catKey];
                        const sub = (cat.subServices || []).find(s => 
                            (s.slug && s.slug.toLowerCase() === target) ||
                            (s.persianSlug && s.persianSlug === segments[1]) ||
                            (s.name && s.name === segments[1])
                        );
                        if (sub) {
                            // 301 Permanent Redirect to canonical English route: /services/:catKey/:slug
                            return Response.redirect(`https://behdoon.ir/services/${catKey}/${sub.slug}`, 301);
                        }
                    }
                    htmlResponse = html;
                }
            } else if (segments.length >= 3) {
                const catKey = segments[1].toLowerCase();
                const subSlug = segments[2];
                if (servicesData[catKey]) {
                    const cat = servicesData[catKey];
                    // Find subservice by English slug
                    const subIdx = (cat.subServices || []).findIndex(s => s.slug && s.slug.toLowerCase() === subSlug.toLowerCase());
                    if (subIdx !== -1) {
                        htmlResponse = renderSubServicePage(catKey, subIdx);
                    } else {
                        // Check if it was requested with Persian slug or name -> 301 redirect to English slug!
                        const altSub = (cat.subServices || []).find(s => 
                            (s.persianSlug && s.persianSlug === subSlug) ||
                            (s.name && s.name === subSlug)
                        );
                        if (altSub) {
                            return Response.redirect(`https://behdoon.ir/services/${catKey}/${altSub.slug}`, 301);
                        }
                        htmlResponse = renderServicePage(catKey);
                    }
                } else {
                    htmlResponse = html;
                }
            }
        } else {
            // Check direct root route for category or subservice slug
            const decodedPath = decodeURIComponent(path);
            const rawSlug = decodedPath.replace(/^\/+|\/+$/g, '');
            const lowerSlug = rawSlug.toLowerCase();

            let matched = false;
            if (rawSlug && !['api', 'admin', 'track', 'magazine', 'manifest.webmanifest', 'manifest.json', 'favicon.ico', 'robots.txt'].includes(lowerSlug)) {
                if (servicesData[lowerSlug]) {
                    return Response.redirect(`https://behdoon.ir/services/${lowerSlug}`, 301);
                } else {
                    for (const catKey of Object.keys(servicesData)) {
                        const cat = servicesData[catKey];
                        // If exact English slug: redirect or render
                        const subBySlug = (cat.subServices || []).find(s => s.slug && s.slug.toLowerCase() === lowerSlug);
                        if (subBySlug) {
                            return Response.redirect(`https://behdoon.ir/services/${catKey}/${subBySlug.slug}`, 301);
                        }
                        // If Persian slug: 301 redirect to English canonical
                        const subByAlt = (cat.subServices || []).find(s => 
                            (s.persianSlug && s.persianSlug === rawSlug) ||
                            (s.name && s.name === rawSlug)
                        );
                        if (subByAlt) {
                            return Response.redirect(`https://behdoon.ir/services/${catKey}/${subByAlt.slug}`, 301);
                        }
                    }
                }
            }

            if (!matched) {
                htmlResponse = html; // Default Home page
            }
        }

        // --- Apply Global Settings to htmlResponse ---
        if (htmlResponse) {
            let settings = { 
                footer_about: 'بهدون؛ پلتفرم جامع خدمات تخصصی ساختمان در تهران.',
                footer_address: 'تهران',
                map_lat: '35.6997',
                map_lng: '51.3380'
            };
            try {
                if (env.DB) {
                    const { results } = await env.DB.prepare("SELECT key, value FROM settings").all();
                    results.forEach(row => settings[row.key] = row.value);
                }
            } catch(e) {}
            
            // Replace footer about
            htmlResponse = htmlResponse.replace(
                /<p class="text-brand-100 text-sm leading-relaxed max-w-sm mb-6">[\s\S]*?<\/p>/,
                `<p class="text-brand-100 text-sm leading-relaxed max-w-sm mb-6">${settings.footer_about}</p>`
            );
            
            // Replace address
            htmlResponse = htmlResponse.replace(
                /<p class="text-brand-100 text-sm">تهران، نیاوران[\s\S]*?<\/p>/,
                `<p class="text-brand-100 text-sm">${settings.footer_address}</p>`
            );
            
            // Inject Map into footer
            const mapScript = `
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
            <script>
                document.addEventListener('DOMContentLoaded', () => {
                    const mapEl = document.getElementById('footer-map');
                    if(mapEl) {
                        const map = L.map('footer-map').setView([${settings.map_lat}, ${settings.map_lng}], 13);
                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            attribution: '© OpenStreetMap'
                        }).addTo(map);
                        L.marker([${settings.map_lat}, ${settings.map_lng}]).addTo(map);
                    }
                });
            </script>
            `;
            htmlResponse = htmlResponse.replace('</body>', mapScript + '</body>');
            
            // Add leaflet css if not already present
            if (!htmlResponse.includes('leaflet.css')) {
                const leafletCss = '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />';
                htmlResponse = htmlResponse.replace('</head>', leafletCss + '</head>');
            }
        }

        return new Response(htmlResponse, {
            headers: {
                "content-type": "text/html;charset=UTF-8",
                "Cache-Control": "public, s-maxage=0, max-age=0, no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0",
                "Surrogate-Control": "no-store"
            },
        });
    },
};

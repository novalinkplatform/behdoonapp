const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const settingsLogic = `
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
                /<p class="text-brand-100 text-sm leading-relaxed max-w-sm mb-6">[\\s\\S]*?<\\/p>/,
                \`<p class="text-brand-100 text-sm leading-relaxed max-w-sm mb-6">\${settings.footer_about}</p>\`
            );
            
            // Replace address
            htmlResponse = htmlResponse.replace(
                /<p class="text-brand-100 text-sm">تهران، نیاوران[\\s\\S]*?<\\/p>/,
                \`<p class="text-brand-100 text-sm">\${settings.footer_address}</p>\`
            );
            
            // Inject Map into footer
            // Find the contact info section in footer and append map
            const contactUl = '<ul class="space-y-4">';
            const mapHtml = \`
                <li class="mt-6">
                    <h4 class="text-white font-bold mb-3">موقعیت ما</h4>
                    <div id="footer-map" class="w-full h-48 rounded-xl overflow-hidden border border-brand-800"></div>
                </li>
            \`;
            // Actually, let's just insert it before </ul> of the contact section
            
            // Also inject leaflet to head
            const leafletCss = '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />';
            htmlResponse = htmlResponse.replace('</head>', leafletCss + '</head>');
            
            // Inject leaflet js and map init before </body>
            const mapScript = \`
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
            <script>
                document.addEventListener('DOMContentLoaded', () => {
                    const mapEl = document.getElementById('footer-map');
                    if(mapEl) {
                        const map = L.map('footer-map').setView([\${settings.map_lat}, \${settings.map_lng}], 13);
                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            attribution: '© OpenStreetMap'
                        }).addTo(map);
                        L.marker([\${settings.map_lat}, \${settings.map_lng}]).addTo(map);
                    }
                });
            </script>
            \`;
            htmlResponse = htmlResponse.replace('</body>', mapScript + '</body>');
        }
`;

const insertPosStr = 'return new Response(htmlResponse, {';
const insertPos = content.lastIndexOf(insertPosStr);

if(insertPos === -1) {
    console.log('Could not find return new Response!');
} else {
    content = content.substring(0, insertPos) + settingsLogic + '\n        ' + content.substring(insertPos);
    
    // We also need to add <div id="footer-map"> to the static HTML footer
    // Let's replace the contact <ul> with map included
    const oldContactUl = '<ul class="space-y-4">\n                        <li class="flex items-start space-x-3 space-x-reverse">';
    const newContactUl = '<ul class="space-y-4">\n                        <li class="mt-2"><div id="footer-map" class="w-full h-32 rounded-xl overflow-hidden border border-brand-800 z-0 relative"></div></li>\n                        <li class="flex items-start space-x-3 space-x-reverse">';
    content = content.replace(oldContactUl, newContactUl);

    fs.writeFileSync('worker.js', content);
    console.log('Frontend map logic injected');
}

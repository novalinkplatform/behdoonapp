const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const targetStr = `<!-- CATEGORIES GRID UNDER HERO -->
                <div class="mt-8 border-t border-slate-200/50 pt-8 pb-4" id="services">

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4 md:px-0">`;

const replacement = `<!-- CATEGORIES GRID UNDER HERO -->
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
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto relative z-10">`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replacement);
    
    // Also we need to close the extra div for the Frosted Glass Container
    // Find where the grid ends
    const endGridMarker = `</section>

        <!-- ================= FEATURES`;
    const sIdx = content.indexOf(endGridMarker);
    if (sIdx !== -1) {
       // Let's actually look for the end of the grid. It's followed by `</div>\n            </div>\n        </main>` or similar
       // Wait, the grid was just closed by `</div>`. We need to add one more `</div>` for the Frosted box.
    }
}

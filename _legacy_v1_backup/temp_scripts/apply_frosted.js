const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const servicesStart = content.indexOf('<div class="mt-8 border-t border-slate-200/50 pt-8 pb-4" id="services">');
if (servicesStart === -1) {
    console.log('Could not find the start of services section');
    process.exit(1);
}

const gridStart = content.indexOf('<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4 md:px-0">', servicesStart);
if (gridStart === -1) {
    console.log('Could not find grid start');
    process.exit(1);
}

// Construct the new header and container
const replacementHeader = `<div class="mt-8 relative max-w-7xl mx-auto px-4 md:px-6 z-10" id="services">
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

// We replace from servicesStart up to gridStart + length of gridStart string
const textToReplace = content.substring(servicesStart, gridStart + '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4 md:px-0">'.length);

content = content.replace(textToReplace, replacementHeader);

// Now we need to add the closing </div> for the frosted container right after the grid closes.
// The grid closes right before `</section>` which is the end of the Hero section.
// Let's find `</a>\n                    </div>\n                </div>\n            </section>`
const gridEndIdx = content.indexOf('</section>', servicesStart);
if (gridEndIdx !== -1) {
    // Before `</section>`, there are `</div>`s. We need to add one more.
    // Let's just insert it right before `</section>`
    const beforeSection = content.substring(0, gridEndIdx);
    const afterSection = content.substring(gridEndIdx);
    content = beforeSection + '    </div>\n            ' + afterSection;
}

fs.writeFileSync('worker.js', content);
console.log('Applied frosted glass successfully.');

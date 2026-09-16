const fs = require('fs');

let code = fs.readFileSync('src/frontend.js', 'utf8');

const targetStr = "        `).join('');\n                        <details class=\"group bg-white";
const replacementStr = `        \`).join('');
    } else {
        tabContents = \`<div class="tab-content block">\${data.content}</div>\`;
    }

    const contentSection = \`
        <div class="container mx-auto px-4 max-w-5xl mb-8 md:mb-12 mt-2 md:mt-6">
            <div class="bg-white border border-slate-200 shadow-md rounded-[2rem] p-6 md:p-10 text-slate-700 leading-loose">
                \${tabContents}
                \${data.comprehensiveGuide || ''}
            </div>
            
            <div class="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 md:p-10 mt-8 md:mt-12">
                <h2 class="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><span class="w-2 h-6 bg-slate-800 rounded-full inline-block"></span> سؤالات متداول</h2>
                <div class="space-y-4">
                    \${(data.faq || []).map(f => \`
                        <details class="group bg-white`;

// Normalize newlines in search if needed
if (code.includes("`).join('');")) {
    const idx = code.indexOf("`).join('');");
    const afterIdx = code.indexOf('<details class="group bg-white', idx);
    if (idx !== -1 && afterIdx !== -1) {
        code = code.substring(0, idx) + `\`).join('');
    } else {
        tabContents = \`<div class="tab-content block">\${data.content}</div>\`;
    }

    const contentSection = \`
        <div class="container mx-auto px-4 max-w-5xl mb-8 md:mb-12 mt-2 md:mt-6">
            <div class="bg-white border border-slate-200 shadow-md rounded-[2rem] p-6 md:p-10 text-slate-700 leading-loose">
                \${tabContents}
                \${data.comprehensiveGuide || ''}
            </div>
            
            <div class="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 md:p-10 mt-8 md:mt-12">
                <h2 class="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><span class="w-2 h-6 bg-slate-800 rounded-full inline-block"></span> سؤالات متداول</h2>
                <div class="space-y-4">
                    \${(data.faq || []).map(f => \`
                        ` + code.substring(afterIdx);
        fs.writeFileSync('src/frontend.js', code);
        console.log('Successfully restored contentSection and comprehensiveGuide!');
    }
} else {
    console.error('Could not find pattern in frontend.js');
}

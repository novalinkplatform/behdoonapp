const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const regex = /const contentSection = `\s*<div class="container mx-auto px-4 max-w-4xl mb-16 text-slate-700 leading-loose">\s*\$\{data\.content\}\s*<div class="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 mt-12">/m;

const replacement = `const contentSection = \`
        <div class="container mx-auto px-4 max-w-5xl mb-16 mt-8">
            <div class="bg-white border border-slate-200 shadow-md rounded-[2rem] p-8 md:p-12 text-slate-700 leading-loose">
                \${data.content}
            </div>
            
            <div class="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 md:p-10 mt-12">`;

content = content.replace(regex, replacement);
fs.writeFileSync('worker.js', content);
console.log('Layout updated.');

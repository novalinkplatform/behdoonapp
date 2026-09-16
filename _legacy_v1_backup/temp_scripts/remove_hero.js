const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const startIdx = content.indexOf('const heroSection = `');
const endIdx = content.indexOf('`;', startIdx) + 2;

if (startIdx === -1 || endIdx === -1) {
    console.error('Could not find heroSection bounds');
    process.exit(1);
}

const newHeroSection = `const heroSection = \`
        <div class="pt-8 pb-4">
            <div class="container mx-auto px-4 max-w-5xl">
                \${breadcrumbs}
            </div>
        </div>
    \`;`;

// Replace hero section
content = content.substring(0, startIdx) + newHeroSection + content.substring(endIdx);

// Also need to remove the negative margin from subServicesHtml since there is no background to overlap anymore
content = content.replace('<div class="container mx-auto px-4 max-w-6xl -mt-4 md:-mt-6 relative z-20 mb-8 md:mb-12">', 
                          '<div class="container mx-auto px-4 max-w-6xl mt-4 relative z-20 mb-8 md:mb-12">');

fs.writeFileSync('worker.js', content);
console.log('Hero section removed, kept only breadcrumbs!');

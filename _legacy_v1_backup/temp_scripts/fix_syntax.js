const fs = require('fs');

let code = fs.readFileSync('src/frontend.js', 'utf8');

// 1. Fix .join(''); on tabContents
code = code.replace(
    /<\/div>\s*`;\s*\}\s*else\s*\{/m,
    `</div>\n        \`).join('');\n    } else {`
);

// 2. Add comprehensiveGuide inside contentSection
code = code.replace(
    '${tabContents}\n            </div>',
    '${tabContents}\n                ${data.comprehensiveGuide || \'\'}\n            </div>'
);

fs.writeFileSync('src/frontend.js', code);
console.log('Fixed tabContents .join and comprehensiveGuide placement.');

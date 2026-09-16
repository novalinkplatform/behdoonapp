const fs = require('fs');

const w = fs.readFileSync('worker.js', 'utf8');

const aStart = w.indexOf('const adminHTML = `');
if (aStart === -1) throw new Error('Could not find const adminHTML in worker.js');

const scriptTag = '</script>\n\n`;';
const aEnd = w.indexOf(scriptTag, aStart);
if (aEnd === -1) throw new Error('Could not find scriptTag end in worker.js');

const rawAdminHTML = w.substring(aStart + 'const adminHTML = `'.length, aEnd + '</script>'.length);

const adminJsContent = `export const adminHTML = \`${rawAdminHTML}\`;

export function getAdminResponse(html, adminHTML) {
    return html.replace("</head>", "<style>body{background-color:#f8fafc;}</style></head>").replace(/<body[^>]*>[\\s\\S]*<\\/body>/i, '<body class="text-slate-700">' + adminHTML + '</body>');
}
`;

fs.writeFileSync('src/admin.js', adminJsContent, 'utf8');
console.log('src/admin.js repaired successfully! Size:', fs.statSync('src/admin.js').size);

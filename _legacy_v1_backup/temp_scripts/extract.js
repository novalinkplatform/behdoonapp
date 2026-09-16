const fs = require('fs');
const code = fs.readFileSync('worker.js', 'utf8');

// Extract adminHTML
const adminStart = code.indexOf('const adminHTML = `');
const adminEnd = code.indexOf('`;', adminStart) + 2;
const adminHtmlContent = code.substring(adminStart, adminEnd);
fs.writeFileSync('src/admin.js', 'export ' + adminHtmlContent + '\n\nexport function getAdminResponse(html, adminHTML) {\n    return html.replace("</head>", "<style>body{background-color:#f8fafc;}</style></head>").replace(/<body[^>]*>[\\s\\S]*<\\/body>/i, \'<body class="text-slate-700">\' + adminHTML + \'</body>\');\n}\n');

// Extract headerHTML, footerHTML, html (homepage), trackHTML, magazineHTML, singleArticleHTML
function extractVar(varName) {
    const start = code.indexOf(`const ${varName} = \``);
    const end = code.indexOf('`;', start) + 2;
    return code.substring(start, end);
}

const frontendCode = `
export ${extractVar('headerHTML')}
export ${extractVar('footerHTML')}
export ${extractVar('html')}
export ${extractVar('trackHTML')}
export ${extractVar('magazineHTML')}
export ${extractVar('singleArticleHTML')}

export ${code.substring(code.indexOf('const servicesData = {'), code.indexOf('// --- END INJECTED SERVICE PAGES ---') + 37)}

`;
fs.writeFileSync('src/frontend.js', frontendCode);

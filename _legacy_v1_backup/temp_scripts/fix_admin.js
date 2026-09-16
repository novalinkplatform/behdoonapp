const fs = require('fs');
const code = fs.readFileSync('worker.js', 'utf8');

const adminStart = code.indexOf('const adminHTML = `');
const adminEnd = code.indexOf('</main>', adminStart) + 7;
// add the closing backtick and semicolon
const adminHtmlContent = code.substring(adminStart, adminEnd) + '\n`;';

let srcAdmin = 'export ' + adminHtmlContent + '\n\nexport function getAdminResponse(html, adminHTML) {\n    return html.replace("</head>", "<style>body{background-color:#f8fafc;}</style></head>").replace(/<body[^>]*>[\\s\\S]*<\\/body>/i, \'<body class="text-slate-700">\' + adminHTML + \'</body>\');\n}\n';

// Apply the replace for tracking code again
srcAdmin = srcAdmin.replace('<th class="p-4 font-bold w-1/4">نام مشتری</th>', '<th class="p-4 font-bold w-1/4">اطلاعات درخواست</th>');
const newCell = '<td class="p-4"><div class="font-bold text-slate-700 text-sm">کد: \\${req.tracking_code || \'-\'}</div><div class="text-xs text-slate-500 max-w-[200px] truncate" title="\\${req.description}">\\${req.description || \'بدون توضیح\'}</div><div class="text-xs text-blue-500 mt-1"><a href="https://www.google.com/maps?q=\\${req.lat},\\${req.lng}" target="_blank">مشاهده نقشه</a></div></td>';
srcAdmin = srcAdmin.replace('<td class="p-4 font-bold text-slate-700">\\${req.name}</td>', newCell);

fs.writeFileSync('src/admin.js', srcAdmin);

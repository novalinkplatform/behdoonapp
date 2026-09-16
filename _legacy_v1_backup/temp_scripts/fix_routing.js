const fs = require('fs');
let currentWorker = fs.readFileSync('worker.js', 'utf8');

const targetStr = "let htmlResponse = '';\\n    if (path === '/magazine'";
const replacementStr = "let htmlResponse = '';\\n    if (path === '/admin' || path === '/admin/') {\\n        htmlResponse = html.replace('</head>', '<style>body{background-color:#f8fafc;}</style></head>').replace(/<body[^>]*>[\\\\s\\\\S]*<\\\\/body>/i, '<body class=\"text-slate-700\">' + adminHTML + '</body>');\\n    } else if (path === '/magazine'";

let updated = currentWorker.replace(/let htmlResponse = '';\s*if \(path === '\/magazine'/g, 
    "let htmlResponse = '';\n    if (path === '/admin' || path === '/admin/') {\n        htmlResponse = html.replace('</head>', '<style>body{background-color:#f8fafc;}</style></head>').replace(/<body[^>]*>[\\\\s\\\\S]*<\\\\/body>/i, '<body class=\"text-slate-700\">' + adminHTML + '</body>');\n    } else if (path === '/magazine'");

fs.writeFileSync('worker.js', updated);
console.log('Updated routing.');

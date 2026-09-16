const fs = require('fs');
let currentWorker = fs.readFileSync('worker.js', 'utf8');

const targetRoute = `if (path === '/admin' || path === '/admin/') {
        htmlResponse = html.replace('</head>', '<style>body{background-color:#f8fafc;}</style></head>').replace(/<body[^>]*>[\\s\\S]*<\\/body>/i, '<body class="text-slate-700">' + adminHTML + '</body>');
    }`;

const replacementRoute = `if (path === '/admin' || path === '/admin/') {
        const authHeader = request.headers.get('Authorization');
        // Username: admin, Password: 123
        if (authHeader !== 'Basic YWRtaW46MTIz') {
            return new Response('دسترسی غیرمجاز. لطفاً نام کاربری و رمز عبور را وارد کنید.', {
                status: 401,
                headers: { 
                    'WWW-Authenticate': 'Basic realm="Admin Panel"',
                    'Content-Type': 'text/plain; charset=utf-8'
                }
            });
        }
        htmlResponse = html.replace('</head>', '<style>body{background-color:#f8fafc;}</style></head>').replace(/<body[^>]*>[\\s\\S]*<\\/body>/i, '<body class="text-slate-700">' + adminHTML + '</body>');
    }`;

if(currentWorker.includes("if (path === '/admin' || path === '/admin/') {")) {
    currentWorker = currentWorker.replace(/if \(path === '\/admin' \|\| path === '\/admin\/'\) \{[\s\S]*?\}\s*else if \(path === '\/magazine'/m, replacementRoute + " else if (path === '/magazine'");
    fs.writeFileSync('worker.js', currentWorker);
    console.log('Auth added');
} else {
    console.log('Admin route not found');
}

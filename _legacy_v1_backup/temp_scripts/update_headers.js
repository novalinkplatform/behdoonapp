const fs = require('fs');

let apiCode = fs.readFileSync('src/api.js', 'utf8');
apiCode = apiCode.replace(/headers:\s*{\s*'Content-Type':\s*'application\/json'\s*}/g, 
  `headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0', 'Pragma': 'no-cache', 'Expires': '0', 'Surrogate-Control': 'no-store' }`);
fs.writeFileSync('src/api.js', apiCode);

let indexCode = fs.readFileSync('src/index.js', 'utf8');
indexCode = indexCode.replace(/"Cache-Control":\s*"no-cache, no-store, must-revalidate"/g, 
  `"Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
                "Pragma": "no-cache",
                "Expires": "0",
                "Surrogate-Control": "no-store"`);
fs.writeFileSync('src/index.js', indexCode);

console.log("Headers updated.");

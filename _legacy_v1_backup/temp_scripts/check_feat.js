const fs = require('fs');
const content = fs.readFileSync('live_home.html', 'utf8');

const sIdx = content.indexOf('id="features"');
if (sIdx !== -1) {
    console.log(content.substring(sIdx - 100, sIdx + 3000));
} else {
    console.log("NOT FOUND");
}

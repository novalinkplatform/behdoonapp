const fs = require('fs');

let content = fs.readFileSync('worker.js', 'utf8');

// Find the footerHTML variable that we successfully updated
const footerMatch = content.match(/const footerHTML = `([\s\S]*?)`;/);
if (!footerMatch) {
    console.log("Could not find footerHTML definition");
    process.exit(1);
}

const newFooterHtml = footerMatch[1]; // This is the string content without `const footerHTML = `...`;`

// Now we need to find the hardcoded footer inside the home page and replace it
const hardcodedFooterStartRegex = /<!-- ================= ISLAND FOOTER v2 ================= -->\s*<footer class="bg-slate-50 pt-16 pb-28 md:pb-12 border-t border-slate-200 mt-10">/;
const hardcodedFooterStartMatch = content.match(hardcodedFooterStartRegex);

if (hardcodedFooterStartMatch) {
    const startIndex = hardcodedFooterStartMatch.index;
    const endIndex = content.indexOf('</footer>', startIndex) + '</footer>'.length;
    
    if (endIndex > startIndex) {
        // Create the new string: content before + newFooterHtml + content after
        content = content.substring(0, startIndex) + newFooterHtml + content.substring(endIndex);
        fs.writeFileSync('worker.js', content);
        console.log('Successfully replaced hardcoded home page footer!');
    } else {
        console.log('Could not find </footer> for the hardcoded footer.');
    }
} else {
    // If ISLAND FOOTER v2 is not there, maybe it's just ISLAND FOOTER
    const altRegex = /<!-- ================= ISLAND FOOTER ================= -->\s*<footer/;
    const altMatch = content.match(altRegex);
    if (altMatch) {
        const startIndex = altMatch.index;
        const endIndex = content.indexOf('</footer>', startIndex) + '</footer>'.length;
        if (endIndex > startIndex) {
            content = content.substring(0, startIndex) + newFooterHtml + content.substring(endIndex);
            fs.writeFileSync('worker.js', content);
            console.log('Successfully replaced hardcoded home page footer! (alt)');
        }
    } else {
        console.log('Could not find the hardcoded footer start tag.');
        // Debug
        const idx = content.indexOf('<footer');
        console.log('First <footer is at:', idx);
        console.log(content.substring(idx - 100, idx + 100));
    }
}

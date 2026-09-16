async function verifyAll() {
    const urls = [
        { path: '/services/hvac', name: 'سرمایش و گرمایش' },
        { path: '/services/plumbing', name: 'لوله‌کشی' },
        { path: '/services/electrical', name: 'برقکاری' },
        { path: '/services/renovation', name: 'تعمیرات و بازسازی' }
    ];

    for (let u of urls) {
        const res = await fetch('https://behdoon.ir' + u.path);
        const html = await res.text();
        const clean = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                          .replace(/<[^>]*>/g, ' ')
                          .replace(/\s+/g, ' ').trim();
        const wordCount = clean.split(' ').length;
        console.log(`[${u.name}] Status: ${res.status}, Word Count: ${wordCount}, Has CTA: ${html.includes('openRequestModal')}, Has Phone: ${html.includes('۰۲۱-۲۲۳۴۵۶۷۸')}`);
    }
}

verifyAll().catch(console.error);

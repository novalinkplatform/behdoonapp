async function test() {
    const res = await fetch('https://behdoon.ir/');
    const html = await res.text();
    console.log('1. Has /services/hvac link:', html.includes('href="/services/hvac"'));
    console.log('2. Has مشاهده خدمات و زیردسته‌ها:', html.includes('مشاهده خدمات و زیردسته‌ها'));
    console.log('3. Old interceptor removed:', !html.includes('link.textContent.includes'));
    console.log('4. Has unified request modal:', html.includes('id="requestModal"'));
    console.log('5. Has PWA manifest link:', html.includes('href="/manifest.webmanifest"'));

    const resHvac = await fetch('https://behdoon.ir/services/hvac');
    const htmlHvac = await resHvac.text();
    console.log('6. /services/hvac status:', resHvac.status);
    console.log('7. /services/hvac has subservice CTA:', htmlHvac.includes('ثبت آنلاین درخواست'));
}

test().catch(console.error);

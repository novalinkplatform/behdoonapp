#!/bin/sh
# ایمیج این سایت بین همه‌ی خریدارهای self-host مشترک است (از GHCR کشیده می‌شود)، پس دامنه‌ی واقعی
# هر خریدار نمی‌تواند در زمان build ثابت شده باشد — به‌جایش در فایل‌های ساخته‌شده __SITE_ORIGIN__
# به‌عنوان جای‌گیر باقی مانده و همین‌جا، در لحظه‌ی بالا آمدن کانتینر، با دامنه‌ی واقعی جایگزین می‌شود.
set -eu

if [ -n "${SITE_DOMAIN:-}" ]; then
  find /usr/share/nginx/html -maxdepth 1 -type f \( -name '*.html' -o -name 'robots.txt' -o -name 'sitemap.xml' \) \
    -exec sed -i "s|__SITE_ORIGIN__|https://${SITE_DOMAIN}|g" {} +
fi

/**
 * Shared line-style SVG icon set. All icons use `currentColor` and a common
 * viewBox/stroke-width so they stay visually consistent wherever they're placed.
 */

const ICON_ATTRS = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"';

// آیکون‌های «پر» (solid) — فقط برای نمادهای شبکه‌های اجتماعی در فوتر، جایی که یک نشان توپر و مستقل
// (بدون کادر دور آن) خواناتر از نسخه‌ی خطی مشترک است.
const FILLED_ICON_ATTRS = 'viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true" focusable="false"';

export const icons = {
  // Home Repair & Building Service Icons
  hvac: `<svg ${ICON_ATTRS}><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07 19.07 4.93M8 4l4 4 4-4M8 20l4-4 4 4M4 8l4 4-4 4M20 8l-4 4 4 4"/></svg>`,
  plumbing: `<svg ${ICON_ATTRS}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  electrical: `<svg ${ICON_ATTRS}><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  renovation: `<svg ${ICON_ATTRS}><path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z"/><path d="m5 2 5 5M2 5l5 5M14 8l6 6M17 5l4 4"/></svg>`,

  pickup: `<svg ${ICON_ATTRS}><path d="M3 16V9a1 1 0 0 1 1-1h8l4 4h4a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z"/><circle cx="7.5" cy="17.5" r="1.7"/><circle cx="16.5" cy="17.5" r="1.7"/><path d="M12 8v4"/></svg>`,

  van: `<svg ${ICON_ATTRS}><path d="M2 16V8a1 1 0 0 1 1-1h11v9"/><path d="M14 10h4.5l2.5 3v3h-2"/><circle cx="7" cy="17.5" r="1.7"/><circle cx="17" cy="17.5" r="1.7"/><path d="M2 16h3.3M9 16h6"/></svg>`,

  lightTruck: `<svg ${ICON_ATTRS}><path d="M2 15V7a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v8"/><path d="M12 11h4.8l3.2 2.6V16h-2"/><circle cx="6.5" cy="17" r="1.7"/><circle cx="16.5" cy="17" r="1.7"/><path d="M2 15h2.8M18.2 15h1.8"/></svg>`,

  truck: `<svg ${ICON_ATTRS}><path d="M1.5 14V6.5a1 1 0 0 1 1-1H14v9"/><path d="M14 9.5h4l3.5 3V15h-2"/><circle cx="6" cy="16.5" r="1.7"/><circle cx="17" cy="16.5" r="1.7"/><path d="M1.5 14h2.8M18.7 14h2.3"/></svg>`,

  trailer: `<svg ${ICON_ATTRS}><path d="M1 15.5V9.5a1 1 0 0 1 1-1h3.5v7"/><path d="M5.5 11h14"/><path d="M19.5 11l2 2.3v2.2h-2"/><circle cx="4" cy="17" r="1.6"/><circle cx="12.5" cy="17" r="1.6"/><circle cx="16.5" cy="17" r="1.6"/><path d="M1 15.5h1.4M8.9 15.5h1.6M18.1 15.5h1.4"/></svg>`,

  home: `<svg ${ICON_ATTRS}><path d="M3.5 11.5 12 4l8.5 7.5"/><path d="M5.5 10v9a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-9"/><path d="M9.5 20v-5.5h5V20"/></svg>`,

  box: `<svg ${ICON_ATTRS}><path d="M3.5 8 12 4l8.5 4-8.5 4-8.5-4Z"/><path d="M3.5 8v8L12 20l8.5-4V8"/><path d="M12 12v8"/></svg>`,

  worker: `<svg ${ICON_ATTRS}><circle cx="12" cy="6" r="2.5"/><path d="M6 20v-3.5a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4V20"/><path d="M9.5 12.5 8 20M14.5 12.5 16 20"/></svg>`,

  route: `<svg ${ICON_ATTRS}><circle cx="5.5" cy="6" r="2"/><circle cx="18.5" cy="18" r="2"/><path d="M5.5 8v3a3 3 0 0 0 3 3h7a3 3 0 0 1 3 3"/></svg>`,

  bolt: `<svg ${ICON_ATTRS}><path d="M12.5 3 5 13.5h5.5L11 21l7.5-10.5H13L12.5 3Z"/></svg>`,

  network: `<svg ${ICON_ATTRS}><circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M6.7 7.3 10.5 16.3M17.3 7.3 13.5 16.3M7 6h10"/></svg>`,

  compare: `<svg ${ICON_ATTRS}><path d="M7 4v16M17 4v16"/><path d="M4 8h6M4 16h6M14 8h6M14 16h6"/></svg>`,

  layers: `<svg ${ICON_ATTRS}><path d="M12 3.5 21 8l-9 4.5L3 8l9-4.5Z"/><path d="M3 12.5 12 17l9-4.5M3 16.5 12 21l9-4.5"/></svg>`,

  shield: `<svg ${ICON_ATTRS}><path d="M12 3.5 19 6.5v5c0 5-3 8-7 9-4-1-7-4-7-9v-5l7-3Z"/><path d="m9.3 12 1.9 1.9L15 10"/></svg>`,

  pin: `<svg ${ICON_ATTRS}><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/></svg>`,

  flag: `<svg ${ICON_ATTRS}><path d="M6 21V4"/><path d="M6 4.5h10.5L14 8l2.5 3.5H6"/></svg>`,

  calendar: `<svg ${ICON_ATTRS}><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/></svg>`,

  search: `<svg ${ICON_ATTRS}><circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.3-4.3"/></svg>`,

  chevronDown: `<svg ${ICON_ATTRS}><path d="m6 9 6 6 6-6"/></svg>`,

  chevronLeft: `<svg ${ICON_ATTRS}><path d="m15 6-6 6 6 6"/></svg>`,

  chevronRight: `<svg ${ICON_ATTRS}><path d="m9 6 6 6-6 6"/></svg>`,

  checkCircle: `<svg ${ICON_ATTRS}><circle cx="12" cy="12" r="8.5"/><path d="m8.5 12.3 2.3 2.3 4.7-5"/></svg>`,

  fileText: `<svg ${ICON_ATTRS}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>`,

  printer: `<svg ${ICON_ATTRS}><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="7" rx="1"/></svg>`,

  clock: `<svg ${ICON_ATTRS}><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>`,

  lock: `<svg ${ICON_ATTRS}><rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15" r="1.4" fill="currentColor" stroke="none"/></svg>`,

  phone: `<svg ${ICON_ATTRS}><path d="M5.5 4h2.8l1.2 4-2 1.3a11 11 0 0 0 5.2 5.2l1.3-2 4 1.2v2.8c0 1-.9 1.7-1.8 1.5-6-1.1-10.6-5.7-11.7-11.7C4.3 5.4 5 4 5.5 4Z"/></svg>`,

  plusCircle: `<svg ${ICON_ATTRS}><circle cx="12" cy="12" r="8.5"/><path d="M12 8v8M8 12h8"/></svg>`,

  menu: `<svg ${ICON_ATTRS}><path d="M4 6.5h16M4 12h16M4 17.5h16"/></svg>`,

  close: `<svg ${ICON_ATTRS}><path d="m5 5 14 14M19 5 5 19"/></svg>`,

  user: `<svg ${ICON_ATTRS}><circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/></svg>`,

  female: `<svg ${ICON_ATTRS}><circle cx="12" cy="7.5" r="3.5"/><path d="M7 8c.3 4 2 6 5 6s4.7-2 5-6"/><path d="M5.5 21v-1a5 5 0 0 1 5-5h3a5 5 0 0 1 5 5v1"/></svg>`,

  male: `<svg ${ICON_ATTRS}><circle cx="12" cy="7.5" r="3.5"/><path d="M5.5 21v-1a5 5 0 0 1 5-5h3a5 5 0 0 1 5 5v1"/><path d="M12 14.5v3"/></svg>`,

  building: `<svg ${ICON_ATTRS}><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3"/></svg>`,

  organization: `<svg ${ICON_ATTRS}><path d="m3 9 9-6 9 6M4 10h16M5 10v9M9 10v9M15 10v9M19 10v9M3 21h18"/></svg>`,

  plus: `<svg ${ICON_ATTRS}><path d="M12 5v14M5 12h14"/></svg>`,

  article: `<svg ${ICON_ATTRS}><rect x="5" y="3.5" width="14" height="17" rx="1.5"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4"/></svg>`,

  whatsapp: `<svg ${ICON_ATTRS}><path d="M12 3.5a8 8 0 0 0-7 11.9L4 20.5l5.2-1.4A8 8 0 1 0 12 3.5Z"/><path d="M9 9.2c0-.4.3-.7.7-.7h.6c.3 0 .6.2.7.5l.5 1.4c.1.3 0 .6-.2.8l-.5.5a5 5 0 0 0 2.5 2.5l.5-.5c.2-.2.5-.3.8-.2l1.4.5c.3.1.5.4.5.7v.6c0 .4-.3.7-.7.7-3.8 0-7-3.2-7-7Z"/></svg>`,

  telegram: `<svg ${ICON_ATTRS}><path d="m21 4-9 16-2.5-6.5L3 11Z"/><path d="M21 4 9.5 13.5"/></svg>`,

  instagram: `<svg ${ICON_ATTRS}><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="0.8" fill="currentColor" stroke="none"/></svg>`,

  mail: `<svg ${ICON_ATTRS}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>`,

  logout: `<svg ${ICON_ATTRS}><path d="M9 4H5.5a1.5 1.5 0 0 0-1.5 1.5v13A1.5 1.5 0 0 0 5.5 20H9"/><path d="M14 15.5 18.5 12 14 8.5"/><path d="M18.2 12H9.5"/></svg>`,

  linkedin: `<svg ${ICON_ATTRS}><rect x="3.5" y="3.5" width="17" height="17" rx="2.5"/><path d="M8 10.5v6M8 7.8v.1"/><path d="M12 16.5v-3.7a2.3 2.3 0 0 1 4.5 0v3.7M12 11v5.5"/></svg>`,

  youtube: `<svg ${ICON_ATTRS}><rect x="2.5" y="6" width="19" height="12" rx="4"/><path d="m10.5 9.5 5 2.5-5 2.5Z" fill="currentColor" stroke="none"/></svg>`,

  twitterX: `<svg ${ICON_ATTRS}><path d="M4.5 4.5 19.5 19.5M19.5 4.5 4.5 19.5"/></svg>`,

  facebook: `<svg ${ICON_ATTRS}><circle cx="12" cy="12" r="8.5"/><path d="M14 8.5h-1.5a2 2 0 0 0-2 2V12H8.5v2.5H10.5V20h2.5v-5.5H15L15.5 12H13v-1a.7.7 0 0 1 .7-.7H14Z"/></svg>`,

  globe: `<svg ${ICON_ATTRS}><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.3 2.3 3.5 5.3 3.5 8.5s-1.2 6.2-3.5 8.5c-2.3-2.3-3.5-5.3-3.5-8.5S9.7 5.8 12 3.5Z"/></svg>`,

  download: `<svg ${ICON_ATTRS}><path d="M12 3.5v11M8 10.5l4 4 4-4"/><path d="M4.5 17v2a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-2"/></svg>`,

  badge: `<svg ${ICON_ATTRS}><path d="M12 3.5 19 6.5v5c0 5-3 8-7 9-4-1-7-4-7-9v-5l7-3Z"/><path d="M9.5 12 11 13.5 14.5 10"/></svg>`,

  trash: `<svg ${ICON_ATTRS}><path d="M4.5 7h15M9.5 7V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v2M18 7l-.8 11.5a2 2 0 0 1-2 1.8H8.8a2 2 0 0 1-2-1.8L6 7"/><path d="M10 11v5M14 11v5"/></svg>`,

  chat: `<svg ${ICON_ATTRS}><path d="M3.5 6.5A2.5 2.5 0 0 1 6 4h9a2.5 2.5 0 0 1 2.5 2.5v6A2.5 2.5 0 0 1 15 15H9l-4 3.5v-3.5H6a2.5 2.5 0 0 1-2.5-2.5v-6Z"/><circle cx="7.5" cy="9.5" r="0.9" fill="currentColor" stroke="none"/><circle cx="11.5" cy="9.5" r="0.9" fill="currentColor" stroke="none"/><circle cx="15" cy="9.5" r="0.9" fill="currentColor" stroke="none"/></svg>`,
  image: `<svg ${ICON_ATTRS}><rect x="3" y="4.5" width="18" height="15" rx="2"/><circle cx="8.5" cy="9.5" r="1.7"/><path d="m4 17 5-5 4 4 2.5-2.5L21 17.5"/></svg>`,

  briefcase: `<svg ${ICON_ATTRS}><rect x="3" y="7.5" width="18" height="12" rx="2"/><path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5"/><path d="M3 12.5h18M10.5 12.5v2h3v-2"/></svg>`,

  whatsappFilled: `<svg ${FILLED_ICON_ATTRS}><path d="M12 2.5c-5.2 0-9.5 4.3-9.5 9.5 0 1.7.4 3.3 1.3 4.7L2.5 21.5l4.9-1.3c1.4.8 2.9 1.2 4.6 1.2 5.2 0 9.5-4.3 9.5-9.5s-4.3-9.4-9.5-9.4Zm5.6 13.4c-.2.6-1.4 1.2-1.9 1.3-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.6-.6-2.9-1.2-4.7-4.2-4.9-4.4-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.2.5-.3.8-.3h.5c.2 0 .4 0 .5.4.2.5.8 1.8.8 1.9.1.1.1.3 0 .4-.1.2-.1.3-.3.5-.1.2-.3.4-.4.5-.1.1-.3.3-.1.6.2.3.9 1.4 1.9 2.3 1.3 1.1 2.3 1.5 2.6 1.6.2.1.4.1.6-.1.2-.2.7-.8 1-1.1.2-.3.4-.2.6-.1.2.1 1.6.8 1.9.9.3.1.5.2.5.3.1.2.1.7-.1 1.3Z"/></svg>`,

  telegramFilled: `<svg ${FILLED_ICON_ATTRS}><path d="M21.9 4.3 2.7 11.9c-1.3.5-1.3 1.2-.2 1.5l4.9 1.5 1.9 5.8c.2.6.4.8.8.8.4 0 .6-.2.8-.5l2.4-2.3 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.7c.3-1.2-.4-1.7-1-1.4ZM9.4 14.4 18 8.8c.4-.3.8-.1.5.2L11.3 15c-.2.2-.4.4-.4.6l-.2 2.4-.9-3.6Z"/></svg>`,

  instagramFilled: `<svg ${FILLED_ICON_ATTRS}><path fill-rule="evenodd" d="M7 2.5h10A4.5 4.5 0 0 1 21.5 7v10a4.5 4.5 0 0 1-4.5 4.5H7A4.5 4.5 0 0 1 2.5 17V7A4.5 4.5 0 0 1 7 2.5Zm5 5.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5.3-1.8a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/></svg>`,

  linkedinFilled: `<svg ${FILLED_ICON_ATTRS}><path fill-rule="evenodd" d="M4.5 2.5h15a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2ZM8.7 10v7.3H6.3V10h2.4Zm-1.2-3.7a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8Zm4 3.7h2.3v1c.5-.7 1.3-1.2 2.4-1.2 1.9 0 3 1.3 3 3.7v4.5h-2.4V13c0-1-.4-1.6-1.3-1.6-.8 0-1.3.6-1.5 1.2-.1.2-.1.5-.1.8v3.9h-2.4V10Z"/></svg>`,

  youtubeFilled: `<svg ${FILLED_ICON_ATTRS}><path fill-rule="evenodd" d="M12 4c2.4 0 6.7.2 8.4.7.9.3 1.7 1 1.9 1.9.5 1.7.7 5 .7 5.4 0 .4-.2 3.7-.7 5.4-.3.9-1 1.7-1.9 1.9-1.7.5-6 .7-8.4.7s-6.7-.2-8.4-.7a2.6 2.6 0 0 1-1.9-1.9C1.2 15.7 1 12.4 1 12c0-.4.2-3.7.7-5.4.3-.9 1-1.6 1.9-1.9C5.3 4.2 9.6 4 12 4Zm-2 4.5v7l6-3.5-6-3.5Z"/></svg>`,

  twitterXFilled: `<svg ${FILLED_ICON_ATTRS}><path d="M13.6 10.6 20 3h-2l-5.6 6.4L7.9 3H3l6.9 9.8L3 21h2l6-6.8L15.9 21H21l-7.4-10.4Zm-2.2 2.5-.7-1L4.9 4.5h2l4.5 6.3.7 1 5.8 8.1h-2l-4.7-6.4Z"/></svg>`,

  facebookFilled: `<svg ${FILLED_ICON_ATTRS}><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z"/></svg>`,

  mailFilled: `<svg ${FILLED_ICON_ATTRS}><path d="M3.5 5h17a1 1 0 0 1 .9.5L12 11 2.6 5.5a1 1 0 0 1 .9-.5Z"/><path d="M2.5 6.7 12 12.5l9.5-5.8V17a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2V6.7Z"/></svg>`,

  globeFilled: `<svg ${FILLED_ICON_ATTRS}><circle cx="12" cy="12" r="9.5"/></svg>`,

  sun: `<svg ${ICON_ATTRS}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`,

  moon: `<svg ${ICON_ATTRS}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  arrowLeftRight: `<svg ${ICON_ATTRS}><path d="m9 7-4 4 4 4M15 7l4 4-4 4M5 11h14"/></svg>`,
};

export type IconName = keyof typeof icons;

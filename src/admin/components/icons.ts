const ICON_ATTRS = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"';

export const icons = {
  route: `<svg ${ICON_ATTRS}><circle cx="5.5" cy="6" r="2"/><circle cx="18.5" cy="18" r="2"/><path d="M5.5 8v3a3 3 0 0 0 3 3h7a3 3 0 0 1 3 3"/></svg>`,

  grid: `<svg ${ICON_ATTRS}><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></svg>`,

  chart: `<svg ${ICON_ATTRS}><path d="M4 20V10M12 20V4M20 20v-7"/><path d="M2 20h20"/></svg>`,

  columns: `<svg ${ICON_ATTRS}><rect x="3.5" y="4" width="5" height="16" rx="1"/><rect x="9.5" y="4" width="5" height="10" rx="1"/><rect x="15.5" y="4" width="5" height="13" rx="1"/></svg>`,

  phone: `<svg ${ICON_ATTRS}><path d="M5.5 4h2.8l1.2 4-2 1.3a11 11 0 0 0 5.2 5.2l1.3-2 4 1.2v2.8c0 1-.9 1.7-1.8 1.5-6-1.1-10.6-5.7-11.7-11.7C4.3 5.4 5 4 5.5 4Z"/></svg>`,

  pin: `<svg ${ICON_ATTRS}><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/></svg>`,

  flag: `<svg ${ICON_ATTRS}><path d="M6 21V4"/><path d="M6 4.5h10.5L14 8l2.5 3.5H6"/></svg>`,

  calendar: `<svg ${ICON_ATTRS}><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/></svg>`,

  logout: `<svg ${ICON_ATTRS}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>`,

  lock: `<svg ${ICON_ATTRS}><rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/></svg>`,

  close: `<svg ${ICON_ATTRS}><path d="m5 5 14 14M19 5 5 19"/></svg>`,

  chevronDown: `<svg ${ICON_ATTRS}><path d="m6 9 6 6 6-6"/></svg>`,

  refresh: `<svg ${ICON_ATTRS}><path d="M3.5 12a8.5 8.5 0 0 1 14.5-6M20.5 12a8.5 8.5 0 0 1-14.5 6"/><path d="M18 3v4h-4M6 21v-4h4"/></svg>`,

  map: `<svg ${ICON_ATTRS}><path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2Z"/><path d="M9 4v14M15 6v14"/></svg>`,

  users: `<svg ${ICON_ATTRS}><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.3"/><path d="M15.5 20a4.5 4.5 0 0 1 5.5-4.4"/></svg>`,

  plusCircle: `<svg ${ICON_ATTRS}><circle cx="12" cy="12" r="8.5"/><path d="M12 8v8M8 12h8"/></svg>`,

  checkCircle: `<svg ${ICON_ATTRS}><circle cx="12" cy="12" r="8.5"/><path d="m8.5 12.3 2.3 2.3 4.7-5"/></svg>`,
  fileText: `<svg ${ICON_ATTRS}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>`,

  user: `<svg ${ICON_ATTRS}><circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/></svg>`,

  article: `<svg ${ICON_ATTRS}><rect x="5" y="3.5" width="14" height="17" rx="1.5"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4"/></svg>`,

  settings: `<svg ${ICON_ATTRS}><circle cx="12" cy="12" r="3.2"/><path d="M12 3v2.4M12 18.6V21M21 12h-2.4M5.4 12H3M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7M18.4 18.4l-1.7-1.7M7.3 7.3 5.6 5.6"/></svg>`,

  message: `<svg ${ICON_ATTRS}><path d="M4 5.5h16a1 1 0 0 1 1 1V16a1 1 0 0 1-1 1H9l-4.5 3.5V17H4a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z"/><path d="M7.5 9.5h9M7.5 13h6"/></svg>`,

  chat: `<svg ${ICON_ATTRS}><path d="M3.5 6.5A2.5 2.5 0 0 1 6 4h9a2.5 2.5 0 0 1 2.5 2.5v6A2.5 2.5 0 0 1 15 15H9l-4 3.5v-3.5H6a2.5 2.5 0 0 1-2.5-2.5v-6Z"/><circle cx="7.5" cy="9.5" r="0.9" fill="currentColor" stroke="none"/><circle cx="11.5" cy="9.5" r="0.9" fill="currentColor" stroke="none"/><circle cx="15" cy="9.5" r="0.9" fill="currentColor" stroke="none"/></svg>`,

  story: `<svg ${ICON_ATTRS}><rect x="7" y="3" width="10" height="17" rx="2.2"/><circle cx="12" cy="7.2" r="1.5" fill="currentColor" stroke="none"/></svg>`,

  briefcase: `<svg ${ICON_ATTRS}><rect x="3" y="7.5" width="18" height="12" rx="2"/><path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5"/><path d="M3 12.5h18M10.5 12.5v2h3v-2"/></svg>`,

  download: `<svg ${ICON_ATTRS}><path d="M12 3.5v11M8 10.5l4 4 4-4"/><path d="M4.5 17v2a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-2"/></svg>`,

  truck: `<svg ${ICON_ATTRS}><rect x="2" y="7" width="11" height="7" rx="1"/><path d="M13 10h4l3 3v1h-2"/><path d="M7.8 17h6.9"/><circle cx="6" cy="17" r="1.8"/><circle cx="16.5" cy="17" r="1.8"/></svg>`,
  seo: `<svg ${ICON_ATTRS}><circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8"/><path d="M7.5 10.5h6M10.5 7.5v6"/></svg>`,
  ai: `<svg ${ICON_ATTRS}><path d="M11 3 12.7 8 17.5 9.7 12.7 11.4 11 16.4 9.3 11.4 4.5 9.7 9.3 8Z"/><path d="M18 15.5 18.8 17.7 21 18.5 18.8 19.3 18 21.5 17.2 19.3 15 18.5 17.2 17.7Z"/></svg>`,
  image: `<svg ${ICON_ATTRS}><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="m5 17 5-5 3 3 3-4 3 6"/></svg>`,
  video: `<svg ${ICON_ATTRS}><rect x="3" y="6" width="12" height="12" rx="2"/><path d="m15 10 6-3v10l-6-3Z"/></svg>`,
  audio: `<svg ${ICON_ATTRS}><path d="M9 18V6l8-2v12"/><circle cx="7" cy="18" r="2.2"/><circle cx="17" cy="16" r="2.2"/></svg>`,
  arrowRight: `<svg ${ICON_ATTRS}><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  arrowLeft: `<svg ${ICON_ATTRS}><path d="M19 12H5M11 18l-6-6 6-6"/></svg>`,
  maleAvatar: `<svg ${ICON_ATTRS}><circle cx="12" cy="8" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg>`,
  femaleAvatar: `<svg ${ICON_ATTRS}><circle cx="12" cy="7.5" r="4"/><path d="M12 11.5v6M9 15h6"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg>`,
  eye: `<svg ${ICON_ATTRS}><path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff: `<svg ${ICON_ATTRS}><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>`,
  history: `<svg ${ICON_ATTRS}><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 8v4l3 2"/></svg>`,
  link: `<svg ${ICON_ATTRS}><path d="M9.5 14.5 14.5 9.5"/><path d="M11 6.5 12.6 4.9a3.7 3.7 0 0 1 5.2 5.2L16 12"/><path d="M13 17.5 11.4 19.1a3.7 3.7 0 0 1-5.2-5.2L8 12"/></svg>`,
  externalLink: `<svg ${ICON_ATTRS}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
  unlink: `<svg ${ICON_ATTRS}><path d="M9.5 14.5 14.5 9.5"/><path d="M11 6.5 12.2 5.3a3.7 3.7 0 0 1 5.2 5.2L16.2 11.7"/><path d="M13 17.5 11.8 18.7a3.7 3.7 0 0 1-5.2-5.2L7.8 12.3"/><path d="m4 4 16 16"/></svg>`,
  quote: `<svg ${ICON_ATTRS}><path d="M7.5 8.5a3 3 0 0 0-3 3V16h5v-4.5h-2a3 3 0 0 1 2-3V8.5Z"/><path d="M16.5 8.5a3 3 0 0 0-3 3V16h5v-4.5h-2a3 3 0 0 1 2-3V8.5Z"/></svg>`,
  undo: `<svg ${ICON_ATTRS}><path d="M4 12a8 8 0 1 1 2.6 5.9"/><path d="M4 6.5V12h5.5"/></svg>`,
  redo: `<svg ${ICON_ATTRS}><path d="M20 12a8 8 0 1 0-2.6 5.9"/><path d="M20 6.5V12h-5.5"/></svg>`,
  minus: `<svg ${ICON_ATTRS}><path d="M4 12h16"/></svg>`,
  eraser: `<svg ${ICON_ATTRS}><path d="m17.5 8.5-9 9H4l-1-1L14 5.5a2 2 0 0 1 2.8 0l2 2a2 2 0 0 1-.3 2.9L9.5 19"/></svg>`,
  alignLeft: `<svg ${ICON_ATTRS}><path d="M4 6h16M4 12h10M4 18h13"/></svg>`,
  alignCenter: `<svg ${ICON_ATTRS}><path d="M4 6h16M7 12h10M5.5 18h13"/></svg>`,
  alignRight: `<svg ${ICON_ATTRS}><path d="M4 6h16M10 12h10M7 18h13"/></svg>`,
  listBullet: `<svg ${ICON_ATTRS}><circle cx="4.5" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="4.5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="4.5" cy="18" r="1" fill="currentColor" stroke="none"/><path d="M9 6h11M9 12h11M9 18h11"/></svg>`,
  listNumber: `<svg ${ICON_ATTRS}><path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 5v3M3.3 5H4.7M3 11.5h1.6c.5 0 .9.4.9.9 0 .3-.2.5-.4.7L3 15h2.6M3.3 19h1.4c.5 0 .9-.4.9-.9s-.4-.9-.9-.9H3.3"/></svg>`,
  plugin: `<svg ${ICON_ATTRS}><path d="M12 3 4 7v10l8 4 8-4V7Z"/><path d="M4 7l8 4 8-4M12 11v10"/></svg>`,
  wallet: `<svg ${ICON_ATTRS}><path d="M3 7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1"/><path d="M3 7v10a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2H5"/><circle cx="16" cy="13" r="1.2" fill="currentColor" stroke="none"/></svg>`,
  finance: `<svg ${ICON_ATTRS}><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/></svg>`,
  fileSpreadsheet: `<svg ${ICON_ATTRS}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h8M8 17h8M12 13v8"/></svg>`,
  printer: `<svg ${ICON_ATTRS}><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>`,
  shield: `<svg ${ICON_ATTRS}><path d="M12 3.5 19 6.5v5c0 5-3 8-7 9-4-1-7-4-7-9v-5l7-3Z"/><path d="m9.3 12 1.9 1.9L15 10"/></svg>`,
  clock: `<svg ${ICON_ATTRS}><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>`,
  sun: `<svg ${ICON_ATTRS}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`,
  moon: `<svg ${ICON_ATTRS}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  trash: `<svg ${ICON_ATTRS}><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  edit: `<svg ${ICON_ATTRS}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  wrench: `<svg ${ICON_ATTRS}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
};

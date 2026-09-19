import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/600.css';
import '@fontsource/vazirmatn/700.css';
import './styles/main.css';
import './styles/fonts.css';
import './styles/sale.css';

import { renderSaleView } from './sections/SaleView.ts';
import { initContentBlocks } from './sections/ContentBlock.ts';
import { initBehaviorTracking } from './utils/analytics.ts';
import { markAppReady } from './utils/appReady.ts';

// صفحه پرزنت و فروش ژاکت اسکریپت بهدون

function init(): void {
  initBehaviorTracking();
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) return;

  app.innerHTML = renderSaleView();

  markAppReady();
  initContentBlocks();
}

init();

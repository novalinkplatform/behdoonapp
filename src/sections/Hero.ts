import { renderServiceCategoriesAccordion } from '../components/ServiceCategoriesAccordion.ts';
import { pick } from '../i18n/lang.ts';
import type {
  VehicleTypeSetting,
  HomepageSection,
  ServiceCitiesSettings,
  ServiceCategoriesSettings,
  HeroSloganSetting,
} from '../utils/dynamicContent.ts';

export function renderHero(
  _vehicleTypes?: VehicleTypeSetting[],
  section?: HomepageSection,
  _serviceCities?: ServiceCitiesSettings,
  _serviceCategorySettings?: ServiceCategoriesSettings,
  heroSlogan?: HeroSloganSetting,
  _siteName?: { fa?: string; en?: string } | string,
): string {
  const isEnabled = heroSlogan?.enabled !== false;
  const headline = pick(
    heroSlogan?.headline?.fa || section?.heading || 'خدمات حرفه‌ای ساختمان در تهران',
    heroSlogan?.headline?.en || section?.headingEn || section?.heading || 'Professional Building Services in Tehran',
  );
  const lead = pick(
    heroSlogan?.subtitle?.fa || section?.body || '',
    heroSlogan?.subtitle?.en || section?.bodyEn || section?.body || '',
  );
  const backgroundImageUrl = section?.backgroundImageUrl ?? '';

  return `
    <section class="hero"${backgroundImageUrl ? ` style="background-image: url('${backgroundImageUrl}')"` : ''}>
      ${backgroundImageUrl ? '<div class="hero-bg-overlay" aria-hidden="true"></div>' : ''}
      <div class="container hero-inner">
        ${
          isEnabled && (headline || lead)
            ? `
        <div class="hero-content">
          ${headline ? `<h1>${headline}</h1>` : ''}
          ${lead ? `<p class="hero-lead">${lead}</p>` : ''}
        </div>`
            : ''
        }

        ${renderServiceCategoriesAccordion()}
      </div>
    </section>
  `;
}

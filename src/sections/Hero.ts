import { renderRequestWizard } from './RequestWizard.ts';
import { pick } from '../i18n/lang.ts';
import type {
  VehicleTypeSetting,
  HomepageSection,
  ServiceCitiesSettings,
  ServiceCategoriesSettings,
  HeroSloganSetting,
} from '../utils/dynamicContent.ts';

export function renderHero(
  vehicleTypes?: VehicleTypeSetting[],
  section?: HomepageSection,
  serviceCities?: ServiceCitiesSettings,
  serviceCategorySettings?: ServiceCategoriesSettings,
  heroSlogan?: HeroSloganSetting,
): string {
  const isEnabled = heroSlogan?.enabled !== false;
  const headline = pick(
    heroSlogan?.headline?.fa || section?.heading || 'خدمات حرفه‌ای ساختمان در تهران',
    heroSlogan?.headline?.en || section?.headingEn || section?.heading || 'Professional Building Services in Tehran',
  );
  const lead = pick(
    heroSlogan?.subtitle?.fa || section?.body || 'سرمایش و گرمایش، لوله‌کشی، برقکاری و بازسازی؛ اعزام فوری تکنسین‌های مجرب با ضمانت کتبی در سراسر تهران.',
    heroSlogan?.subtitle?.en || section?.bodyEn || section?.body || 'HVAC, plumbing, electrical and remodeling; fast certified technician dispatch across Tehran with written guarantee.',
  );
  const backgroundImageUrl = section?.backgroundImageUrl ?? '';

  return `
    <section class="hero"${backgroundImageUrl ? ` style="background-image: url('${backgroundImageUrl}')"` : ''}>
      ${backgroundImageUrl ? '<div class="hero-bg-overlay" aria-hidden="true"></div>' : ''}
      <div class="container hero-inner">
        ${
          isEnabled
            ? `
        <div class="hero-content">
          <h1>${headline}</h1>
          <p class="hero-lead">${lead}</p>
        </div>`
            : ''
        }

        ${renderRequestWizard(vehicleTypes, serviceCities, serviceCategorySettings)}
      </div>
    </section>
  `;
}

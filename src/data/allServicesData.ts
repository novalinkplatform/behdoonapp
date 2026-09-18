// ============================================================================
// مخزن جامع تمامی خدمات تخصصی و دسته‌بندی‌های بهدون (۵۳ خدمت در ۸ دسته)
// ============================================================================

export interface SubServiceDetail {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  persianSlug: string;
  aliases?: string[];
  basePrice: number;
  shortDesc: string;
  shortDescEn: string;
  features: string[];
  detailHtml: string;
}

export interface ServiceCategoryDetail {
  id: string;
  slug: string;
  persianSlug: string;
  aliases?: string[];
  title: string;
  titleEn: string;
  metaDesc: string;
  subtitle: string;
  subtitleEn: string;
  icon: string;
  subServices: SubServiceDetail[];
  comprehensiveGuide: string;
  faq: Array<{ q: string; a: string }>;
}

import allServicesJson from './all_services_data.json';

export const ALL_SERVICES_CATALOG: Record<string, ServiceCategoryDetail> = allServicesJson as unknown as Record<string, ServiceCategoryDetail>;

export function getAllCategories(): ServiceCategoryDetail[] {
  return Object.values(ALL_SERVICES_CATALOG);
}

export function findCategory(slugOrId: string): ServiceCategoryDetail | null {
  if (!slugOrId) return null;
  const decoded = decodeURIComponent(slugOrId).trim().toLowerCase();
  
  for (const cat of Object.values(ALL_SERVICES_CATALOG)) {
    if (
      cat.id.toLowerCase() === decoded ||
      cat.slug.toLowerCase() === decoded ||
      cat.persianSlug.toLowerCase() === decoded ||
      cat.aliases?.some(a => a.toLowerCase() === decoded)
    ) {
      return cat;
    }
  }
  return null;
}

export function findSubService(
  categorySlugOrId: string,
  subSlug: string
): { category: ServiceCategoryDetail; subService: SubServiceDetail } | null {
  const category = findCategory(categorySlugOrId);
  if (!category) return null;

  const decodedSub = decodeURIComponent(subSlug).trim().toLowerCase();
  for (const sub of category.subServices) {
    if (
      sub.id.toLowerCase() === decodedSub ||
      sub.slug.toLowerCase() === decodedSub ||
      sub.persianSlug.toLowerCase() === decodedSub ||
      sub.name.toLowerCase() === decodedSub ||
      sub.aliases?.some(a => a.toLowerCase() === decodedSub)
    ) {
      return { category, subService: sub };
    }
  }
  return null;
}

export function findSubServiceByAnySlug(
  subSlug: string
): { category: ServiceCategoryDetail; subService: SubServiceDetail } | null {
  if (!subSlug) return null;
  const decodedSub = decodeURIComponent(subSlug).trim().toLowerCase();

  for (const category of Object.values(ALL_SERVICES_CATALOG)) {
    for (const sub of category.subServices) {
      if (
        sub.id.toLowerCase() === decodedSub ||
        sub.slug.toLowerCase() === decodedSub ||
        sub.persianSlug.toLowerCase() === decodedSub ||
        sub.name.toLowerCase() === decodedSub ||
        sub.aliases?.some(a => a.toLowerCase() === decodedSub)
      ) {
        return { category, subService: sub };
      }
    }
  }
  return null;
}

export function getAllSubServices(): Array<{ category: ServiceCategoryDetail; subService: SubServiceDetail }> {
  const list: Array<{ category: ServiceCategoryDetail; subService: SubServiceDetail }> = [];
  for (const cat of Object.values(ALL_SERVICES_CATALOG)) {
    for (const sub of cat.subServices) {
      list.push({ category: cat, subService: sub });
    }
  }
  return list;
}

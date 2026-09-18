import { API_BASE_URL } from '../data/config.ts';
import { DEFAULT_ARTICLES } from '../data/defaultArticles.ts';

export interface LegalSection {
  heading: string;
  headingEn: string;
  paragraphs: string[];
  paragraphsEn: string[];
  list?: string[];
  listEn?: string[];
}

export interface LegalPage {
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  intro: string;
  introEn: string;
  sections: LegalSection[];
  showInHeader?: boolean;
  showInFooter?: boolean;
}

export interface VehicleTypeSetting {
  id: string;
  label: string;
  labelEn: string;
  icon: string;
  basePrice: number;
  perKmRate: number;
  floorCostExempt: boolean;
  active: boolean;
  sortOrder: number;
}

export interface ServiceCity {
  city: string;
  cityEn: string;
  province: string;
  provinceEn: string;
}

export interface ServiceCitiesSettings {
  originCity: ServiceCity | null;
  coverageMode: 'all' | 'selected';
  destinationCities: ServiceCity[];
  internationalShippingEnabled: boolean;
}

// دسته‌ی «ترانزیت» اینجا نیست — چون نمایشش از قبل با internationalShippingEnabled بالا کنترل
// می‌شود (همان پرچمی که فیلد کشور را هم نشان می‌دهد)؛ یک پرچم دوم برایش افزونگی/ناهماهنگی می‌سازد.
export interface ServiceCategoriesSettings {
  domestic: boolean;
  moving: boolean;
}

export interface SocialLinkSetting {
  id: string;
  platform: 'telegram' | 'whatsapp' | 'instagram' | 'linkedin' | 'youtube' | 'twitterX' | 'facebook' | 'mail' | 'globe' | string;
  label: string;
  url: string;
  customIconUrl?: string;
}

export interface ContactSettings {
  phoneDisplay: string;
  phoneTelHref: string;
  socialIconColor?: string;
  socialLinks: SocialLinkSetting[];
}

export type ThemeSettings = Record<string, string>;

export interface AppLinkSetting {
  id: string;
  platform: 'googlePlay' | 'appStore' | 'bazaar' | 'custom';
  label: string;
  url: string;
}

export interface AppLinksSettings {
  enabled: boolean;
  links: AppLinkSetting[];
}

export interface CertificationBadge {
  id: string;
  label: string;
  imageUrl: string;
  linkUrl: string;
}

export interface CertificationsSettings {
  enabled: boolean;
  badges: CertificationBadge[];
}

export type HomepageSectionType = 'hero' | 'block';

// یک بلوک عمومی صفحه اصلی: layout مشخص می‌کند چطور نمایش داده شود (اسلایدر/آکاردئون/شبکه/مراحل/نقل‌قول/متن/نظرات
// مشتریان)، ولی همه‌ی layoutها از همین یک شکل داده استفاده می‌کنند — هیچ نوع بخش ثابت و مخصوصی در سیستم نیست.
export type BlockLayout = 'text' | 'steps' | 'accordion' | 'grid' | 'slider' | 'quote' | 'testimonials' | 'stats';

export interface BlockItem {
  id: string;
  title?: string;
  titleEn?: string;
  text?: string;
  textEn?: string;
  imageUrl?: string;
  videoUrl?: string;
  linkUrl?: string;
}

export interface HomepageSection {
  id: string;
  type: HomepageSectionType;
  visible: boolean;
  // فیلدهای هدر (type === 'hero'):
  heading?: string;
  headingEn?: string;
  body?: string;
  bodyEn?: string;
  backgroundImageUrl?: string;
  // فیلدهای بلوک عمومی (type === 'block'):
  layout?: BlockLayout;
  subheading?: string;
  subheadingEn?: string;
  items?: BlockItem[];
}

export interface HomepageLayoutSettings {
  sections: HomepageSection[];
  storiesEnabled?: boolean;
}

export interface SeoSettings {
  googleSiteVerification?: string;
  googleAnalyticsId?: string;
  defaultOgImage?: string;
}

export interface BrandingSettings {
  logoUrl?: string;
  faviconUrl?: string;
}

export interface HeroSloganSetting {
  enabled?: boolean;
  headline?: { fa?: string; en?: string };
  subtitle?: { fa?: string; en?: string };
}

export interface CareerPositionSetting {
  id: string;
  title: string;
  titleEn?: string;
  description?: string;
  requiresVehicle?: boolean;
  active: boolean;
}

export interface SiteSettings {
  site_name?: { fa: string; en: string };
  footer?: { seoParagraphs: { fa: string; en: string }[]; copyright: { fa: string; en: string } };
  legal_pages?: Record<string, LegalPage>;
  vehicle_types?: VehicleTypeSetting[];
  service_cities?: ServiceCitiesSettings;
  service_categories?: ServiceCategoriesSettings;
  contact?: ContactSettings;
  theme?: ThemeSettings;
  app_links?: AppLinksSettings;
  certifications?: CertificationsSettings;
  homepage_layout?: HomepageLayoutSettings;
  seo?: SeoSettings;
  branding?: BrandingSettings;
  language_mode?: 'both' | 'fa' | 'en';
  hero_slogan?: HeroSloganSetting;
  career_positions?: CareerPositionSetting[];
  map?: import('./mapProvider.ts').MapSettings;
  nav_pages?: Array<{
    id: number;
    slug: string;
    title: string;
    titleEn: string;
    showInHeader: boolean;
    showInFooter: boolean;
  }>;
  site_sliders?: import('../admin/utils/api.ts').SliderConfig;
  service_categories_custom?: import('../admin/utils/api.ts').ManagedServiceCategory[];
}

let cached: SiteSettings | null = null;
let inflight: Promise<SiteSettings> | null = null;

export async function loadSettings(): Promise<SiteSettings> {
  if (cached) return cached;
  if (inflight) return inflight;
  inflight = fetch(`${API_BASE_URL}/api/settings`)
    .then((res) => res.json())
    .then((body) => {
      cached = (body?.settings ?? {}) as SiteSettings;
      return cached;
    })
    .catch(() => ({}) as SiteSettings);
  return inflight;
}

export type ArticleBlock =
  | { type: 'heading'; text: string; textEn: string }
  | { type: 'paragraph'; text: string; textEn: string }
  | { type: 'list'; items: string[]; itemsEn: string[] }
  | { type: 'richtext'; html: string; htmlEn: string }
  | { type: 'image'; url: string; caption: string; captionEn: string }
  | { type: 'video'; url: string };

export interface DynamicArticle {
  id: number;
  slug: string;
  title: string;
  titleEn: string;
  excerpt: string;
  excerptEn: string;
  category: string;
  categoryEn: string;
  coverImageUrl: string | null;
  content: ArticleBlock[];
  metaTitle: string | null;
  metaDescription: string | null;
  readingTime: number;
  publishedAt: string | null;
}

export async function fetchPublicArticles(): Promise<DynamicArticle[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/magazine/articles`);
    const body = await res.json().catch(() => ({}));
    const list = (body?.articles ?? []) as DynamicArticle[];
    return list.length ? list : DEFAULT_ARTICLES;
  } catch {
    return DEFAULT_ARTICLES;
  }
}

export async function fetchPublicArticle(slug: string): Promise<DynamicArticle | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/magazine/articles/${encodeURIComponent(slug)}`);
    if (res.ok) {
      const body = await res.json().catch(() => ({}));
      if (body?.article) return body.article as DynamicArticle;
    }
  } catch {
    // fallback below
  }
  const decoded = decodeURIComponent(slug).trim().toLowerCase();
  return (
    DEFAULT_ARTICLES.find(
      (a) =>
        a.slug.toLowerCase() === decoded ||
        a.slug.toLowerCase() === slug.toLowerCase() ||
        a.title.toLowerCase().includes(decoded) ||
        decoded.includes(a.slug.toLowerCase())
    ) ?? null
  );
}

export type CustomPageBlock = ArticleBlock;

export interface DynamicCustomPage {
  id: number;
  slug: string;
  title: string;
  titleEn: string;
  excerpt: string;
  excerptEn: string;
  coverImageUrl: string | null;
  content: CustomPageBlock[];
  metaTitle: string | null;
  metaDescription: string | null;
  status: 'draft' | 'published';
  showInHeader?: boolean;
  showInFooter?: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function fetchPublicPage(slug: string): Promise<DynamicCustomPage | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/pages/${encodeURIComponent(slug)}`);
    if (!res.ok) return null;
    const body = await res.json().catch(() => ({}));
    return (body?.page ?? null) as DynamicCustomPage | null;
  } catch {
    return null;
  }
}


export interface PublicTestimonial {
  id: number;
  customerName: string;
  customerNameEn: string;
  text: string;
  textEn: string;
  rating: number;
  avatarUrl: string | null;
}

export async function fetchPublicTestimonials(): Promise<PublicTestimonial[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/testimonials`);
    const body = await res.json().catch(() => ({}));
    return (body?.testimonials ?? []) as PublicTestimonial[];
  } catch {
    return [];
  }
}

export interface PublicStory {
  id: number;
  imageUrl: string;
  caption: string;
  captionEn: string;
  linkUrl: string | null;
}

export async function fetchPublicStories(): Promise<PublicStory[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/stories`);
    const body = await res.json().catch(() => ({}));
    return (body?.stories ?? []) as PublicStory[];
  } catch {
    return [];
  }
}

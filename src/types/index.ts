export interface NavLink {
  label: string;
  labelEn: string;
  href: string;
}

export interface ServiceCategory {
  id: string;
  label: string;
  labelEn: string;
  icon: string;
  subtitle: string;
  subtitleEn: string;
}

export interface HowItWorksStep {
  number: number;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
}

export interface TrustPoint {
  label: string;
  labelEn: string;
  icon: string;
}

export interface ServiceTypeOption {
  value: string;
  label: string;
}

export interface Province {
  id: string;
  name: string;
  nameEn: string;
  cities: string[];
  citiesEn: string[];
  lat: number;
  lng: number;
}

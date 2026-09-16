export interface PropertyType {
  id: string;
  label: string;
  labelEn: string;
}

export const PROPERTY_TYPES: PropertyType[] = [
  { id: 'residential', label: 'مسکونی', labelEn: 'Residential' },
  { id: 'commercial', label: 'تجاری', labelEn: 'Commercial' },
  { id: 'office', label: 'اداری', labelEn: 'Office' },
  { id: 'warehouse', label: 'انباری/صنعتی', labelEn: 'Warehouse/Industrial' },
  { id: 'other', label: 'سایر', labelEn: 'Other' },
];

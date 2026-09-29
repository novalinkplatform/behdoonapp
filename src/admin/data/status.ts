export interface StatusConfig {
  id: string;
  label: string;
  color: string;
}

export const STATUS_PIPELINE: StatusConfig[] = [
  { id: 'submitted', label: 'ثبت شده / در انتظار بررسی', color: 'var(--muted)' },
  { id: 'pending', label: 'در انتظار بررسی', color: 'var(--muted)' },
  { id: 'under_review', label: 'در حال بررسی', color: 'var(--muted)' },
  { id: 'contacted', label: 'تماس گرفته شده', color: 'var(--warning)' },
  { id: 'matching', label: 'یافتن متخصص', color: 'var(--warning)' },
  { id: 'provider_assigned', label: 'تخصیص متخصص', color: 'var(--secondary)' },
  { id: 'scheduled', label: 'زمان‌بندی شده', color: 'var(--secondary)' },
  { id: 'en_route', label: 'اعزام به محل', color: 'var(--secondary)' },
  { id: 'in_progress', label: 'در حال انجام', color: 'var(--primary)' },
  { id: 'completed', label: 'تکمیل شده و تحویل', color: 'var(--success)' },
  { id: 'cancelled', label: 'لغو شده', color: 'var(--danger)' },
];

export const STATUS_LABELS: Record<string, string> = {
  ...Object.fromEntries(STATUS_PIPELINE.map((s) => [s.id, s.label])),
  assigned: 'تخصیص متخصص',
  in_review: 'در حال بررسی',
};

export const STATUS_COLORS: Record<string, string> = Object.fromEntries(
  STATUS_PIPELINE.map((s) => [s.id, s.color]),
);

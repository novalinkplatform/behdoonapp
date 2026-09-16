export interface StatusConfig {
  id: string;
  label: string;
  color: string;
}

export const STATUS_PIPELINE: StatusConfig[] = [
  { id: 'pending', label: 'در انتظار بررسی', color: 'var(--muted)' },
  { id: 'contacted', label: 'تماس گرفته شده', color: 'var(--warning)' },
  { id: 'scheduled', label: 'زمان‌بندی شده', color: 'var(--secondary)' },
  { id: 'in_progress', label: 'در حال انجام', color: 'var(--primary)' },
  { id: 'completed', label: 'انجام شده', color: 'var(--success)' },
  { id: 'cancelled', label: 'لغو شده', color: 'var(--danger)' },
];

export const STATUS_LABELS: Record<string, string> = Object.fromEntries(
  STATUS_PIPELINE.map((s) => [s.id, s.label]),
);

export const STATUS_COLORS: Record<string, string> = Object.fromEntries(
  STATUS_PIPELINE.map((s) => [s.id, s.color]),
);

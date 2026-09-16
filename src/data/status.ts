import { pick } from '../i18n/lang.ts';

const STATUS_LABELS_FA: Record<string, string> = {
  pending: 'در انتظار بررسی',
  contacted: 'تماس گرفته شده',
  scheduled: 'زمان‌بندی شده',
  in_progress: 'در حال انجام',
  completed: 'انجام شده',
  cancelled: 'لغو شده',
};

const STATUS_LABELS_EN: Record<string, string> = {
  pending: 'Pending review',
  contacted: 'Contacted',
  scheduled: 'Scheduled',
  in_progress: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function statusLabel(status: string): string {
  return pick(STATUS_LABELS_FA[status] ?? status, STATUS_LABELS_EN[status] ?? status);
}

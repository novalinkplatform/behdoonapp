import { pick } from '../i18n/lang.ts';

const STATUS_LABELS_FA: Record<string, string> = {
  submitted: 'ثبت شده / در نوبت بررسی',
  pending: 'در انتظار بررسی',
  contacted: 'تماس گرفته شده',
  scheduled: 'زمان‌بندی شده',
  provider_assigned: 'متخصص تخصیص داده شد',
  in_progress: 'در حال انجام خدمت',
  completed: 'تکمیل شده',
  cancelled: 'لغو شده',
};

const STATUS_LABELS_EN: Record<string, string> = {
  submitted: 'Submitted',
  pending: 'Pending review',
  contacted: 'Contacted',
  scheduled: 'Scheduled',
  provider_assigned: 'Provider assigned',
  in_progress: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function statusLabel(status: string): string {
  return pick(STATUS_LABELS_FA[status] ?? status, STATUS_LABELS_EN[status] ?? status);
}

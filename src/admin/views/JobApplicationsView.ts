import { icons } from '../components/icons.ts';
import {
  fetchJobApplications,
  updateJobApplicationStatus,
  deleteJobApplication,
  fetchSettings,
  updateSetting,
} from '../utils/api.ts';
import type { JobApplication } from '../utils/api.ts';

export interface CareerPosition {
  id: string;
  title: string;
  titleEn?: string;
  description?: string;
  requiresVehicle?: boolean;
  active: boolean;
}

const DEFAULT_POSITIONS: CareerPosition[] = [
  { id: 'hvac-tech', title: 'تکنسین سرمایش و گرمایش (پکیج و کولر)', titleEn: 'HVAC Technician', description: 'سرویس‌کار و تعمیرکار انواع پکیج، رادیاتور و کولر آبی/گازی', requiresVehicle: true, active: true },
  { id: 'plumber', title: 'استادکار لوله‌کشی و تأسیسات', titleEn: 'Master Plumber', description: 'متخصص نشت‌یابی نقطه زن، لوله بازکنی و تعمیرات تأسیسات ساختمانی', requiresVehicle: false, active: true },
  { id: 'electrician', title: 'برقکار حرفه‌ای ساختمان', titleEn: 'Electrician', description: 'متخصص رفع فوری اتصالی، سیم‌کشی، لوستر، کلید و پریز و تابلو برق', requiresVehicle: false, active: true },
  { id: 'renovation-builder', title: 'استادکار بنایی، نقاشی و بازسازی', titleEn: 'Renovation Specialist', description: 'نقاش ماهر، کاشی‌کار، نصاب کناف و گچ‌کار با تجربه کاری', requiresVehicle: false, active: true },
  { id: 'support', title: 'کارشناس پشتیبانی و هماهنگی اعزام', titleEn: 'Support Specialist', description: 'پاسخگویی به تماس‌ها و هماهنگی اعزام تکنسین‌ها در تهران', requiresVehicle: false, active: true },
  { id: 'other', title: 'سایر زمینه‌های همکاری فنی', titleEn: 'Other Technical Roles', description: 'سایر تخصص‌های فنی، مهندسی ساختمان و امور اجرایی', requiresVehicle: false, active: true },
];

const STATUS_OPTIONS: { id: JobApplication['status']; label: string }[] = [
  { id: 'new', label: 'جدید' },
  { id: 'reviewed', label: 'بررسی‌شده' },
  { id: 'contacted', label: 'تماس گرفته شده' },
  { id: 'hired', label: 'استخدام شده' },
  { id: 'rejected', label: 'رد شده' },
];

const STATUS_LABELS: Record<string, string> = Object.fromEntries(STATUS_OPTIONS.map((s) => [s.id, s.label]));

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderStatusOptions(current: string): string {
  return STATUS_OPTIONS.map((s) => `<option value="${s.id}" ${s.id === current ? 'selected' : ''}>${s.label}</option>`).join('');
}

function renderApplicantRow(a: JobApplication): string {
  return `
    <div class="testimonial-row" data-application-row="${a.id}">
      <div class="testimonial-row-avatar"><span class="icon">${icons.briefcase}</span></div>
      <div class="testimonial-row-body">
        <div class="testimonial-row-head">
          <strong>${escapeHtml(a.fullName)}</strong>
          <span class="article-status-badge article-status-${a.status}">${STATUS_LABELS[a.status] ?? a.status}</span>
        </div>
        <div class="job-application-meta">
          <span>${escapeHtml(a.positionLabel)}</span>
          <a href="tel:${a.phone}" dir="ltr">${a.phone}</a>
          ${a.city ? `<span>${escapeHtml(a.city)}</span>` : ''}
          ${a.hasVehicle === true ? `<span>دارای وسیله نقلیه${a.vehicleType ? ` (${escapeHtml(a.vehicleType)})` : ''}</span>` : ''}
          ${a.hasVehicle === false ? `<span>بدون وسیله نقلیه</span>` : ''}
          <span>${new Date(a.createdAt).toLocaleDateString('fa-IR')}</span>
        </div>
        ${a.message ? `<p class="testimonial-row-text">${escapeHtml(a.message)}</p>` : ''}
      </div>
      <div class="staff-table-actions">
        <select class="pipeline-status-select" data-status-select-id="${a.id}">
          ${renderStatusOptions(a.status)}
        </select>
        <button type="button" class="btn btn-ghost btn-sm" data-delete-application="${a.id}">حذف</button>
      </div>
    </div>
  `;
}

function renderPositionRow(p: CareerPosition, index: number): string {
  return `
    <div class="testimonial-row" data-position-row="${escapeHtml(p.id)}">
      <div class="testimonial-row-avatar"><span class="icon">${icons.briefcase}</span></div>
      <div class="testimonial-row-body">
        <div class="testimonial-row-head">
          <strong>${escapeHtml(p.title)}</strong>
          <span class="article-status-badge ${p.active ? 'article-status-reviewed' : 'article-status-rejected'}">
            ${p.active ? 'فعال در سایت' : 'غیرفعال'}
          </span>
        </div>
        <div class="job-application-meta">
          ${p.titleEn ? `<span dir="ltr">${escapeHtml(p.titleEn)}</span>` : ''}
          <span>${p.requiresVehicle ? 'نیاز به وسیله نقلیه دارد' : 'بدون نیاز به وسیله نقلیه'}</span>
        </div>
        ${p.description ? `<p class="testimonial-row-text">${escapeHtml(p.description)}</p>` : ''}
      </div>
      <div class="staff-table-actions">
        <button type="button" class="btn btn-secondary btn-sm" data-toggle-position="${index}">
          ${p.active ? 'غیرفعال‌سازی' : 'فعال‌سازی'}
        </button>
        <button type="button" class="btn btn-secondary btn-sm" data-edit-position="${index}">
          ویرایش
        </button>
        <button type="button" class="btn btn-ghost btn-sm" data-delete-position="${index}">
          حذف
        </button>
      </div>
    </div>
  `;
}

export function renderJobApplicationsView(): string {
  return `
    <div class="view-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-3)">
      <div>
        <h1>مدیریت استخدام و فرصت‌های شغلی</h1>
        <p class="section-lead" style="margin: var(--space-1) 0 0 0; font-size: 0.9rem; color: var(--muted);">
          تعریف موقعیت‌های شغلی فعال و مدیریت رزومه‌ها و درخواست‌های همکاری دریافتی
        </p>
      </div>
      <div class="view-header-actions">
        <button type="button" class="btn btn-primary" id="btn-add-position" hidden>
          <span class="icon">${icons.plusCircle}</span>
          <span>افزودن موقعیت شغلی</span>
        </button>
      </div>
    </div>

    <div class="settings-nav-tabs" style="display: flex; gap: var(--space-2); margin-bottom: var(--space-4); border-bottom: 1px solid var(--border);">
      <button type="button" class="settings-tab-btn is-active" data-career-tab="positions" style="padding: 10px 16px; border: none; background: none; font-weight: 600; cursor: pointer; border-bottom: 2px solid var(--primary); color: var(--primary);">
        موقعیت‌های شغلی فعال
      </button>
      <button type="button" class="settings-tab-btn" data-career-tab="applications" style="padding: 10px 16px; border: none; background: none; font-weight: 600; cursor: pointer; border-bottom: 2px solid transparent; color: var(--muted);">
        درخواست‌های همکاری (متقاضیان)
      </button>
    </div>

    <p class="error-text" id="job-applications-error" hidden></p>
    <p class="success-text" id="job-applications-success" hidden style="color: var(--success); margin-bottom: var(--space-3); font-weight: 500;"></p>

    <!-- Positions Tab Content -->
    <div id="tab-career-positions">
      <!-- Add/Edit Position Modal/Inline Form -->
      <div class="editor-sidebar-card" id="career-position-editor" hidden style="margin-bottom: var(--space-4); border: 1px solid var(--primary);">
        <h3 id="position-editor-title">افزودن موقعیت شغلی جدید</h3>
        <input type="hidden" id="pos-edit-index" value="" />
        <div class="settings-form-grid" style="margin-top: var(--space-3)">
          <div class="form-field">
            <label for="pos-title">عنوان موقعیت شغلی (فارسی) *</label>
            <input type="text" id="pos-title" placeholder="مثال: تکنسین پکیج و کولر" required />
          </div>
          <div class="form-field">
            <label for="pos-title-en">عنوان انگلیسی (اختیاری)</label>
            <input type="text" id="pos-title-en" dir="ltr" placeholder="HVAC Technician" />
          </div>
        </div>
        <div class="form-field" style="margin-top: var(--space-3)">
          <label for="pos-desc">توضیحات و شرایط شغلی (اختیاری)</label>
          <textarea id="pos-desc" rows="2" placeholder="شرح وظایف یا مهارت‌های مورد نیاز..."></textarea>
        </div>
        <div style="display: flex; gap: var(--space-4); margin-top: var(--space-3); flex-wrap: wrap;">
          <label class="custom-page-checkbox-label" style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" id="pos-requires-vehicle" />
            <span>نیاز به داشتن ابزار تخصصی و وسیله نقلیه اعزام</span>
          </label>
          <label class="custom-page-checkbox-label" style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" id="pos-active" checked />
            <span>فعال و قابل انتخاب در سایت</span>
          </label>
        </div>
        <div style="display: flex; gap: var(--space-2); margin-top: var(--space-4);">
          <button type="button" class="btn btn-primary" id="pos-save-btn">ذخیره موقعیت شغلی</button>
          <button type="button" class="btn btn-secondary" id="pos-cancel-btn">انصراف</button>
        </div>
      </div>

      <div class="testimonial-list" id="career-positions-list"></div>
    </div>

    <!-- Applications Tab Content -->
    <div id="tab-career-applications" hidden>
      <div class="testimonial-list" id="job-applications-list"></div>
    </div>
  `;
}

export function initJobApplicationsView(): void {
  const errorEl = document.getElementById('job-applications-error');
  const successEl = document.getElementById('job-applications-success');
  const addBtn = document.getElementById('btn-add-position') as HTMLButtonElement | null;
  const positionsList = document.getElementById('career-positions-list');
  const applicationsList = document.getElementById('job-applications-list');
  const editorCard = document.getElementById('career-position-editor');
  const tabButtons = document.querySelectorAll<HTMLButtonElement>('[data-career-tab]');
  const tabPositions = document.getElementById('tab-career-positions');
  const tabApplications = document.getElementById('tab-career-applications');

  if (!errorEl || !positionsList || !applicationsList) return;

  let positions: CareerPosition[] = [];
  let applications: JobApplication[] = [];

  function showMsg(type: 'error' | 'success', text: string): void {
    if (type === 'error') {
      errorEl!.hidden = false;
      errorEl!.textContent = text;
      if (successEl) successEl.hidden = true;
    } else {
      if (successEl) {
        successEl.hidden = false;
        successEl.textContent = text;
        setTimeout(() => { if (successEl) successEl.hidden = true; }, 4000);
      }
      errorEl!.hidden = true;
    }
  }

  // Tab switching
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.careerTab as 'positions' | 'applications';
      tabButtons.forEach((b) => {
        const isCur = b.dataset.careerTab === tab;
        b.style.borderBottomColor = isCur ? 'var(--primary)' : 'transparent';
        b.style.color = isCur ? 'var(--primary)' : 'var(--muted)';
      });
      if (tabPositions) tabPositions.hidden = tab !== 'positions';
      if (tabApplications) tabApplications.hidden = tab !== 'applications';
      if (addBtn) addBtn.hidden = tab !== 'positions';
    });
  });

  // Load Positions
  async function loadPositions(): Promise<void> {
    try {
      const settings = await fetchSettings();
      const saved = settings.career_positions as CareerPosition[] | undefined;
      positions = Array.isArray(saved) && saved.length ? saved : [...DEFAULT_POSITIONS];
      renderPositions();
    } catch {
      positions = [...DEFAULT_POSITIONS];
      renderPositions();
    }
  }

  function renderPositions(): void {
    if (!positionsList) return;
    positionsList.innerHTML = positions.length
      ? positions.map(renderPositionRow).join('')
      : '<p class="pipeline-empty">هیچ موقعیت شغلی‌ای تعریف نشده است.</p>';
    wirePositionActions();
  }

  async function savePositions(): Promise<void> {
    try {
      await updateSetting('career_positions', positions);
      showMsg('success', 'تغییرات موقعیت‌های شغلی با موفقیت ذخیره شد.');
      renderPositions();
    } catch (err) {
      showMsg('error', err instanceof Error ? err.message : 'ذخیره موقعیت‌های شغلی ناموفق بود.');
    }
  }

  function wirePositionActions(): void {
    positionsList?.querySelectorAll<HTMLButtonElement>('[data-toggle-position]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const idx = Number(btn.dataset.togglePosition);
        if (positions[idx]) {
          positions[idx].active = !positions[idx].active;
          await savePositions();
        }
      });
    });

    positionsList?.querySelectorAll<HTMLButtonElement>('[data-edit-position]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.editPosition);
        const item = positions[idx];
        if (!item || !editorCard) return;

        (document.getElementById('pos-edit-index') as HTMLInputElement).value = String(idx);
        (document.getElementById('pos-title') as HTMLInputElement).value = item.title;
        (document.getElementById('pos-title-en') as HTMLInputElement).value = item.titleEn ?? '';
        (document.getElementById('pos-desc') as HTMLTextAreaElement).value = item.description ?? '';
        (document.getElementById('pos-requires-vehicle') as HTMLInputElement).checked = Boolean(item.requiresVehicle);
        (document.getElementById('pos-active') as HTMLInputElement).checked = item.active !== false;
        document.getElementById('position-editor-title')!.textContent = 'ویرایش موقعیت شغلی';
        editorCard.hidden = false;
        editorCard.scrollIntoView({ behavior: 'smooth' });
      });
    });

    positionsList?.querySelectorAll<HTMLButtonElement>('[data-delete-position]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const idx = Number(btn.dataset.deletePosition);
        if (!window.confirm('این موقعیت شغلی حذف شود؟')) return;
        positions.splice(idx, 1);
        await savePositions();
      });
    });
  }

  if (addBtn) {
    addBtn.hidden = false;
    addBtn.addEventListener('click', () => {
      if (!editorCard) return;
      (document.getElementById('pos-edit-index') as HTMLInputElement).value = '';
      (document.getElementById('pos-title') as HTMLInputElement).value = '';
      (document.getElementById('pos-title-en') as HTMLInputElement).value = '';
      (document.getElementById('pos-desc') as HTMLTextAreaElement).value = '';
      (document.getElementById('pos-requires-vehicle') as HTMLInputElement).checked = false;
      (document.getElementById('pos-active') as HTMLInputElement).checked = true;
      document.getElementById('position-editor-title')!.textContent = 'افزودن موقعیت شغلی جدید';
      editorCard.hidden = false;
      (document.getElementById('pos-title') as HTMLInputElement).focus();
    });
  }

  document.getElementById('pos-cancel-btn')?.addEventListener('click', () => {
    if (editorCard) editorCard.hidden = true;
  });

  document.getElementById('pos-save-btn')?.addEventListener('click', async () => {
    const title = (document.getElementById('pos-title') as HTMLInputElement).value.trim();
    if (!title) {
      showMsg('error', 'لطفاً عنوان موقعیت شغلی را وارد کنید.');
      return;
    }
    const titleEn = (document.getElementById('pos-title-en') as HTMLInputElement).value.trim();
    const description = (document.getElementById('pos-desc') as HTMLTextAreaElement).value.trim();
    const requiresVehicle = (document.getElementById('pos-requires-vehicle') as HTMLInputElement).checked;
    const active = (document.getElementById('pos-active') as HTMLInputElement).checked;
    const editIndexStr = (document.getElementById('pos-edit-index') as HTMLInputElement).value;

    if (editIndexStr !== '') {
      const idx = Number(editIndexStr);
      if (positions[idx]) {
        positions[idx] = {
          ...positions[idx],
          title,
          titleEn: titleEn || undefined,
          description: description || undefined,
          requiresVehicle,
          active,
        };
      }
    } else {
      const id = 'pos_' + Date.now();
      positions.push({
        id,
        title,
        titleEn: titleEn || undefined,
        description: description || undefined,
        requiresVehicle,
        active,
      });
    }

    if (editorCard) editorCard.hidden = true;
    await savePositions();
  });

  async function loadApplications(): Promise<void> {
    errorEl!.hidden = true;
    try {
      applications = await fetchJobApplications();
      applicationsList!.innerHTML = applications.length
        ? applications.map(renderApplicantRow).join('')
        : '<p class="pipeline-empty">هنوز درخواست همکاری‌ای ثبت نشده است.</p>';
      wireApplicationActions();
    } catch (err) {
      showMsg('error', err instanceof Error ? err.message : 'خطایی در دریافت درخواست‌ها پیش آمد.');
    }
  }

  function wireApplicationActions(): void {
    applicationsList!.querySelectorAll<HTMLSelectElement>('[data-status-select-id]').forEach((select) => {
      select.addEventListener('change', async () => {
        const id = Number(select.dataset.statusSelectId);
        select.disabled = true;
        try {
          await updateJobApplicationStatus(id, select.value as JobApplication['status']);
          await loadApplications();
        } catch (err) {
          showMsg('error', err instanceof Error ? err.message : 'به‌روزرسانی وضعیت ناموفق بود.');
          select.disabled = false;
        }
      });
    });

    applicationsList!.querySelectorAll<HTMLButtonElement>('[data-delete-application]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!window.confirm('این درخواست برای همیشه حذف شود؟')) return;
        btn.disabled = true;
        try {
          await deleteJobApplication(Number(btn.dataset.deleteApplication));
          await loadApplications();
        } catch (err) {
          showMsg('error', err instanceof Error ? err.message : 'حذف ناموفق بود.');
          btn.disabled = false;
        }
      });
    });
  }

  void loadPositions();
  void loadApplications();
}


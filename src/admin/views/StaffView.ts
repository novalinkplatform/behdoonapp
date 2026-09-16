import { icons } from '../components/icons.ts';
import { fetchStaff, createStaff, updateStaff, deleteStaff, fetchRoles, uploadImage, updateStaffPayRateOverride } from '../utils/api.ts';
import type { StaffRecord, RoleRecord, UpdateStaffPayload, WalletBonusType } from '../utils/api.ts';
import { getStaff, hasPermission } from '../utils/auth.ts';

function avatarHtml(staff: { fullName: string; avatarUrl: string | null; gender: 'male' | 'female' | null }): string {
  if (staff.avatarUrl) {
    return `<img class="staff-avatar" src="${staff.avatarUrl}" alt="${staff.fullName}" />`;
  }
  if (staff.gender === 'female') {
    return `<span class="staff-avatar staff-avatar-fallback staff-avatar-female">${icons.femaleAvatar}</span>`;
  }
  if (staff.gender === 'male') {
    return `<span class="staff-avatar staff-avatar-fallback staff-avatar-male">${icons.maleAvatar}</span>`;
  }
  return `<span class="staff-avatar staff-avatar-fallback">${staff.fullName.trim().charAt(0) || '؟'}</span>`;
}

function renderRow(staff: StaffRecord): string {
  return `
    <tr data-staff-row="${staff.id}" class="${staff.isActive ? '' : 'is-inactive'}">
      <td>${avatarHtml(staff)}</td>
      <td>
        ${staff.fullName}
        ${staff.onActiveService ? `<span class="article-status-badge article-status-busy">در حال سرویس</span>` : ''}
      </td>
      <td dir="ltr">${staff.username}</td>
      <td>${staff.roleLabel}</td>
      <td dir="ltr">${staff.phone ?? '—'}</td>
      <td>
        <span class="article-status-badge article-status-${staff.isActive ? 'published' : 'draft'}">
          ${staff.isActive ? 'فعال' : 'غیرفعال'}
        </span>
        ${staff.isReadOnly ? `<span class="article-status-badge article-status-busy">فقط نمایش</span>` : ''}
      </td>
      <td class="staff-table-actions">
        <button type="button" class="btn btn-secondary btn-sm" data-view-history="${staff.id}">تاریخچه خدمات و کارها</button>
        <button type="button" class="btn btn-secondary btn-sm" data-edit-staff="${staff.id}">ویرایش پروفایل</button>
        <button type="button" class="btn btn-ghost btn-sm" data-toggle-active="${staff.id}">
          ${staff.isActive ? 'غیرفعال کردن' : 'فعال کردن'}
        </button>
        <button type="button" class="btn btn-ghost btn-sm" data-delete-staff="${staff.id}">حذف</button>
      </td>
    </tr>
  `;
}

function renderForm(): string {
  return `
    <div class="editor-sidebar-card staff-form" id="staff-form-card" hidden>
      <h3 id="staff-form-title">کارمند جدید</h3>
      <input type="hidden" id="staff-form-id" />

      <h4 class="staff-form-section-title">اطلاعات ورود</h4>
      <div class="staff-form-grid">
        <div class="form-field">
          <label for="staff-full-name">نام و نام خانوادگی</label>
          <input type="text" id="staff-full-name" required />
        </div>
        <div class="form-field">
          <label for="staff-username">نام کاربری</label>
          <input type="text" id="staff-username" dir="ltr" required />
        </div>
        <div class="form-field">
          <label for="staff-password" id="staff-password-label">رمز عبور</label>
          <input type="password" id="staff-password" dir="ltr" />
        </div>
        <div class="form-field">
          <label for="staff-role">نقش</label>
          <select id="staff-role"></select>
        </div>
        <div class="form-field">
          <label for="staff-gender">جنسیت</label>
          <select id="staff-gender">
            <option value="">مشخص نشده</option>
            <option value="male">مرد</option>
            <option value="female">زن</option>
          </select>
        </div>
      </div>

      <label class="settings-inline-toggle">
        <input type="checkbox" id="staff-read-only" />
        فقط نمایش — می‌تواند همه‌جا را ببیند، ولی هیچ‌چیز نمی‌تواند تغییر دهد
      </label>

      <h4 class="staff-form-section-title">پروفایل کاری</h4>
      <div class="staff-form-grid">
        <div class="form-field">
          <label for="staff-phone">شماره تماس</label>
          <input type="tel" id="staff-phone" dir="ltr" />
        </div>
        <div class="form-field">
          <label for="staff-avatar-url">تصویر پروفایل</label>
          <div class="staff-avatar-upload-row">
            <span class="staff-avatar staff-avatar-preview" id="staff-avatar-preview">${icons.maleAvatar}</span>
            <input type="url" id="staff-avatar-url" dir="ltr" placeholder="https://..." />
            <button type="button" class="btn btn-secondary btn-sm" id="staff-avatar-upload-btn">آپلود عکس</button>
            <input type="file" id="staff-avatar-file-input" accept="image/*" hidden />
          </div>
          <p class="error-text" id="staff-avatar-upload-error" hidden></p>
        </div>
        <div class="form-field">
          <label for="staff-national-id">کد ملی</label>
          <input type="text" id="staff-national-id" dir="ltr" />
        </div>
        <div class="form-field">
          <label for="staff-hire-date">تاریخ استخدام</label>
          <input type="date" id="staff-hire-date" dir="ltr" />
        </div>
        <div class="form-field form-field-wide">
          <label for="staff-address">آدرس</label>
          <input type="text" id="staff-address" />
        </div>
      </div>

      <div id="staff-wallet-section" hidden>
        <h4 class="staff-form-section-title">کیف پول و حقوق</h4>
        <p class="settings-panel-hint">خالی بگذارید تا نرخ پیش‌فرض نقش استفاده شود (در «حقوق و دستمزد» قابل تنظیم است).</p>
        <div class="staff-form-grid">
          <div class="form-field">
            <label for="staff-salary-override">حقوق ماهانه (تومان) — استثنای این فرد</label>
            <input type="number" id="staff-salary-override" min="0" dir="ltr" placeholder="پیش‌فرض نقش" />
          </div>
          <div class="form-field">
            <label for="staff-bonus-type-override">نوع پاداش هر درخواست تکمیل‌شده</label>
            <select id="staff-bonus-type-override">
              <option value="">پیش‌فرض نقش</option>
              <option value="flat">مبلغ ثابت</option>
              <option value="percent">درصد برآورد</option>
            </select>
          </div>
          <div class="form-field">
            <label for="staff-bonus-amount-override">مقدار پاداش</label>
            <input type="number" id="staff-bonus-amount-override" min="0" dir="ltr" placeholder="پیش‌فرض نقش" />
          </div>
        </div>
      </div>

      <h4 class="staff-form-section-title">تماس اضطراری</h4>
      <div class="staff-form-grid">
        <div class="form-field">
          <label for="staff-emergency-name">نام تماس اضطراری</label>
          <input type="text" id="staff-emergency-name" />
        </div>
        <div class="form-field">
          <label for="staff-emergency-phone">شماره تماس اضطراری</label>
          <input type="tel" id="staff-emergency-phone" dir="ltr" />
        </div>
      </div>

      <div class="form-field">
        <label for="staff-notes">یادداشت مدیریتی</label>
        <textarea id="staff-notes" rows="3" placeholder="نکات، مهارت‌ها یا سوابق مهم برای مدیریت..."></textarea>
      </div>

      <p class="error-text" id="staff-form-error" hidden></p>
      <div class="settings-panel-footer">
        <button type="button" class="btn btn-secondary" id="staff-form-cancel">انصراف</button>
        <button type="button" class="btn btn-primary" id="staff-form-submit">ایجاد کارمند</button>
      </div>
    </div>
  `;
}

export function renderStaffView(): string {
  return `
    <div class="view-header">
      <h1>کارمندان</h1>
      <button type="button" class="btn btn-primary" id="staff-add-toggle">
        <span class="icon">${icons.plusCircle}</span>
        کارمند جدید
      </button>
    </div>

    ${renderForm()}

    <p class="error-text" id="staff-error" hidden></p>
    <div class="staff-table-wrapper">
      <table class="staff-table">
        <thead>
          <tr>
            <th>پروفایل</th>
            <th>نام</th>
            <th>نام کاربری</th>
            <th>نقش</th>
            <th>تماس</th>
            <th>وضعیت</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody id="staff-table-body"></tbody>
      </table>
    </div>
  `;
}

export function initStaffView(onViewHistory: (staff: StaffRecord) => void = () => {}): void {
  const addToggleBtn = document.getElementById('staff-add-toggle');
  const formCard = document.getElementById('staff-form-card');
  const formTitle = document.getElementById('staff-form-title');
  const cancelBtn = document.getElementById('staff-form-cancel');
  const formError = document.getElementById('staff-form-error');
  const submitBtn = document.getElementById('staff-form-submit') as HTMLButtonElement | null;
  const idInput = document.getElementById('staff-form-id') as HTMLInputElement | null;
  const fullNameInput = document.getElementById('staff-full-name') as HTMLInputElement | null;
  const usernameInput = document.getElementById('staff-username') as HTMLInputElement | null;
  const passwordInput = document.getElementById('staff-password') as HTMLInputElement | null;
  const passwordLabel = document.getElementById('staff-password-label');
  const roleSelect = document.getElementById('staff-role') as HTMLSelectElement | null;
  const genderSelect = document.getElementById('staff-gender') as HTMLSelectElement | null;
  const readOnlyCheckbox = document.getElementById('staff-read-only') as HTMLInputElement | null;
  const phoneInput = document.getElementById('staff-phone') as HTMLInputElement | null;
  const avatarUrlInput = document.getElementById('staff-avatar-url') as HTMLInputElement | null;
  const avatarPreview = document.getElementById('staff-avatar-preview');
  const avatarUploadBtn = document.getElementById('staff-avatar-upload-btn');
  const avatarFileInput = document.getElementById('staff-avatar-file-input') as HTMLInputElement | null;
  const avatarUploadError = document.getElementById('staff-avatar-upload-error');
  const nationalIdInput = document.getElementById('staff-national-id') as HTMLInputElement | null;
  const hireDateInput = document.getElementById('staff-hire-date') as HTMLInputElement | null;
  const addressInput = document.getElementById('staff-address') as HTMLInputElement | null;
  const emergencyNameInput = document.getElementById('staff-emergency-name') as HTMLInputElement | null;
  const emergencyPhoneInput = document.getElementById('staff-emergency-phone') as HTMLInputElement | null;
  const notesInput = document.getElementById('staff-notes') as HTMLTextAreaElement | null;
  const errorEl = document.getElementById('staff-error');
  const tableBody = document.getElementById('staff-table-body');
  const walletSection = document.getElementById('staff-wallet-section');
  const salaryOverrideInput = document.getElementById('staff-salary-override') as HTMLInputElement | null;
  const bonusTypeOverrideInput = document.getElementById('staff-bonus-type-override') as HTMLSelectElement | null;
  const bonusAmountOverrideInput = document.getElementById('staff-bonus-amount-override') as HTMLInputElement | null;
  const canManageWallet = hasPermission(getStaff()!, 'wallet');

  if (
    !addToggleBtn ||
    !formCard ||
    !formTitle ||
    !cancelBtn ||
    !formError ||
    !submitBtn ||
    !idInput ||
    !fullNameInput ||
    !usernameInput ||
    !passwordInput ||
    !passwordLabel ||
    !roleSelect ||
    !genderSelect ||
    !readOnlyCheckbox ||
    !phoneInput ||
    !avatarUrlInput ||
    !avatarPreview ||
    !avatarUploadBtn ||
    !avatarFileInput ||
    !avatarUploadError ||
    !nationalIdInput ||
    !hireDateInput ||
    !addressInput ||
    !emergencyNameInput ||
    !emergencyPhoneInput ||
    !notesInput ||
    !errorEl ||
    !tableBody ||
    !walletSection ||
    !salaryOverrideInput ||
    !bonusTypeOverrideInput ||
    !bonusAmountOverrideInput
  ) {
    return;
  }

  let roles: RoleRecord[] = [];
  let staffList: StaffRecord[] = [];

  function updateAvatarPreview(): void {
    const url = avatarUrlInput!.value.trim();
    if (url) {
      avatarPreview!.innerHTML = `<img src="${url}" alt="" />`;
      return;
    }
    avatarPreview!.innerHTML = genderSelect!.value === 'female' ? icons.femaleAvatar : icons.maleAvatar;
  }

  function openForm(staff: StaffRecord | null): void {
    formError!.hidden = true;
    avatarUploadError!.hidden = true;
    formTitle!.textContent = staff ? `ویرایش پروفایل ${staff.fullName}` : 'کارمند جدید';
    idInput!.value = staff ? String(staff.id) : '';
    fullNameInput!.value = staff?.fullName ?? '';
    usernameInput!.value = staff?.username ?? '';
    usernameInput!.disabled = Boolean(staff);
    passwordInput!.value = '';
    passwordInput!.required = !staff;
    passwordLabel!.textContent = staff ? 'رمز عبور جدید (اختیاری)' : 'رمز عبور';
    roleSelect!.value = staff?.role ?? roles[0]?.key ?? '';
    genderSelect!.value = staff?.gender ?? '';
    readOnlyCheckbox!.checked = staff?.isReadOnly ?? false;
    phoneInput!.value = staff?.phone ?? '';
    avatarUrlInput!.value = staff?.avatarUrl ?? '';
    nationalIdInput!.value = staff?.nationalId ?? '';
    hireDateInput!.value = staff?.hireDate ?? '';
    addressInput!.value = staff?.address ?? '';
    emergencyNameInput!.value = staff?.emergencyContactName ?? '';
    emergencyPhoneInput!.value = staff?.emergencyContactPhone ?? '';
    notesInput!.value = staff?.notes ?? '';
    // بخش کیف پول فقط برای ویرایش یک کارمند موجود معنا دارد (تا شناسه‌اش برای فراخوانی جدای
    // rate-override موجود باشد) و فقط اگر خودِ ادمین لاگین‌شده مجوز wallet را داشته باشد.
    walletSection!.hidden = !staff || !canManageWallet;
    salaryOverrideInput!.value = staff?.salaryAmountOverride != null ? String(staff.salaryAmountOverride) : '';
    bonusTypeOverrideInput!.value = staff?.bonusTypeOverride ?? '';
    bonusAmountOverrideInput!.value = staff?.bonusAmountOverride != null ? String(staff.bonusAmountOverride) : '';
    submitBtn!.textContent = staff ? 'ذخیره تغییرات' : 'ایجاد کارمند';
    updateAvatarPreview();
    formCard!.hidden = false;
    formCard!.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function closeForm(): void {
    formCard!.hidden = true;
  }

  async function load(): Promise<void> {
    errorEl!.hidden = true;
    try {
      const [staff, rolesData] = await Promise.all([fetchStaff(), roles.length ? Promise.resolve({ roles }) : fetchRoles()]);
      roles = rolesData.roles;
      staffList = staff;
      roleSelect!.innerHTML = roles.map((r) => `<option value="${r.key}">${r.label}</option>`).join('');
      tableBody!.innerHTML = staff.map((s) => renderRow(s)).join('');
      wireRowActions();
    } catch (err) {
      errorEl!.hidden = false;
      errorEl!.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
    }
  }

  function wireRowActions(): void {
    tableBody!.querySelectorAll<HTMLButtonElement>('[data-view-history]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const staff = staffList.find((s) => s.id === Number(btn.dataset.viewHistory));
        if (staff) onViewHistory(staff);
      });
    });

    tableBody!.querySelectorAll<HTMLButtonElement>('[data-edit-staff]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const staff = staffList.find((s) => s.id === Number(btn.dataset.editStaff));
        if (staff) openForm(staff);
      });
    });

    tableBody!.querySelectorAll<HTMLButtonElement>('[data-toggle-active]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = Number(btn.dataset.toggleActive);
        const staff = staffList.find((s) => s.id === id);
        if (!staff) return;
        btn.disabled = true;
        try {
          await updateStaff(id, { isActive: !staff.isActive });
          await load();
        } catch (err) {
          errorEl!.hidden = false;
          errorEl!.textContent = err instanceof Error ? err.message : 'به‌روزرسانی ناموفق بود.';
          btn.disabled = false;
        }
      });
    });

    tableBody!.querySelectorAll<HTMLButtonElement>('[data-delete-staff]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = Number(btn.dataset.deleteStaff);
        if (!window.confirm('این کارمند برای همیشه حذف شود؟ درخواست‌ها و محتوای قبلی او حذف نمی‌شود، فقط از او جدا می‌شود.')) return;
        btn.disabled = true;
        try {
          await deleteStaff(id);
          await load();
        } catch (err) {
          errorEl!.hidden = false;
          errorEl!.textContent = err instanceof Error ? err.message : 'حذف کارمند ناموفق بود.';
          btn.disabled = false;
        }
      });
    });
  }

  addToggleBtn.addEventListener('click', () => openForm(null));
  cancelBtn.addEventListener('click', closeForm);

  avatarUrlInput.addEventListener('input', updateAvatarPreview);
  genderSelect.addEventListener('change', updateAvatarPreview);

  avatarUploadBtn.addEventListener('click', () => avatarFileInput.click());
  avatarFileInput.addEventListener('change', async () => {
    const file = avatarFileInput.files?.[0];
    if (!file) return;
    avatarUploadError!.hidden = true;
    avatarUploadBtn!.textContent = 'در حال آپلود...';
    (avatarUploadBtn as HTMLButtonElement).disabled = true;
    try {
      const url = await uploadImage(file);
      avatarUrlInput!.value = url;
      updateAvatarPreview();
    } catch (err) {
      avatarUploadError!.hidden = false;
      avatarUploadError!.textContent = err instanceof Error ? err.message : 'آپلود عکس ناموفق بود.';
    } finally {
      avatarFileInput!.value = '';
      avatarUploadBtn!.textContent = 'آپلود عکس';
      (avatarUploadBtn as HTMLButtonElement).disabled = false;
    }
  });

  submitBtn.addEventListener('click', async () => {
    formError!.hidden = true;

    const fullName = fullNameInput!.value.trim();
    const username = usernameInput!.value.trim();
    const password = passwordInput!.value;
    const isEditing = Boolean(idInput!.value);

    if (!fullName) {
      formError!.hidden = false;
      formError!.textContent = 'نام و نام خانوادگی الزامی است.';
      return;
    }
    if (!isEditing && (!username || !password)) {
      formError!.hidden = false;
      formError!.textContent = 'نام کاربری و رمز عبور برای کارمند جدید الزامی است.';
      return;
    }

    const profileFields = {
      fullName,
      role: roleSelect!.value,
      gender: (genderSelect!.value || null) as 'male' | 'female' | null,
      phone: phoneInput!.value.trim(),
      avatarUrl: avatarUrlInput!.value.trim(),
      nationalId: nationalIdInput!.value.trim(),
      hireDate: hireDateInput!.value.trim(),
      address: addressInput!.value.trim(),
      emergencyContactName: emergencyNameInput!.value.trim(),
      emergencyContactPhone: emergencyPhoneInput!.value.trim(),
      notes: notesInput!.value.trim(),
      isReadOnly: readOnlyCheckbox!.checked,
    };

    submitBtn!.disabled = true;
    submitBtn!.textContent = isEditing ? 'در حال ذخیره...' : 'در حال ایجاد...';

    try {
      if (isEditing) {
        const payload: UpdateStaffPayload = { ...profileFields };
        if (password) payload.password = password;
        const staffId = Number(idInput!.value);
        await updateStaff(staffId, payload);
        if (canManageWallet) {
          await updateStaffPayRateOverride(staffId, {
            salaryAmountOverride: salaryOverrideInput!.value.trim() ? Number(salaryOverrideInput!.value) : null,
            bonusTypeOverride: (bonusTypeOverrideInput!.value || null) as WalletBonusType | null,
            bonusAmountOverride: bonusAmountOverrideInput!.value.trim() ? Number(bonusAmountOverrideInput!.value) : null,
          });
        }
      } else {
        await createStaff({ ...profileFields, username, password });
      }
      closeForm();
      await load();
    } catch (err) {
      formError!.hidden = false;
      formError!.textContent = err instanceof Error ? err.message : 'ذخیره ناموفق بود.';
    } finally {
      submitBtn!.disabled = false;
      submitBtn!.textContent = isEditing ? 'ذخیره تغییرات' : 'ایجاد کارمند';
    }
  });

  void load();
}

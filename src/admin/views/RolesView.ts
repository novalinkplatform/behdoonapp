import { icons } from '../components/icons.ts';
import { fetchRoles, createRole, updateRole, deleteRole } from '../utils/api.ts';
import type { RoleRecord, PermissionInfo } from '../utils/api.ts';
import { showToast } from '../utils/toast.ts';

export function renderRolesView(): string {
  return `
    <div class="view-header">
      <h1>نقش‌ها و اختیارات</h1>
    </div>
    <p class="settings-panel-hint">برای هر نقش، دسترسی‌هایی که باید داشته باشد را تیک بزنید. پنل کارمندی که این نقش را دارد فقط شامل همین موارد خواهد بود.</p>
    <p class="error-text" id="roles-error" hidden></p>
    <div id="roles-list"></div>
    <div class="settings-panel-footer">
      <button type="button" class="btn btn-secondary" id="role-add-btn">
        <span class="icon">${icons.plusCircle}</span>
        نقش جدید
      </button>
    </div>
  `;
}

export function initRolesView(): void {
  const errorEl = document.getElementById('roles-error');
  if (!errorEl) return;

  function showError(err: unknown): void {
    errorEl!.hidden = false;
    errorEl!.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
    showToast(err instanceof Error ? err.message : 'خطایی پیش آمد.', 'error');
  }

  let roles: RoleRecord[] = [];
  let allPermissions: PermissionInfo[] = [];
  let newRoleDraft: { label: string; labelEn: string; permissions: string[] } | null = null;

  function renderRoleCard(role: RoleRecord): string {
    const disabled = role.isSystem;
    return `
      <div class="editor-sidebar-card" data-role-card="${role.id}">
        <div class="plugin-card-head">
          <div class="settings-form-grid" style="flex:1">
            <div class="form-field"><label>نام نقش (فارسی)</label><input type="text" data-role-label value="${role.label}" ${disabled ? 'disabled' : ''} /></div>
            <div class="form-field"><label>نام نقش (انگلیسی)</label><input type="text" dir="ltr" data-role-label-en value="${role.labelEn}" ${disabled ? 'disabled' : ''} /></div>
          </div>
          ${
            disabled
              ? '<span class="article-status-badge">سیستمی</span>'
              : `<button type="button" class="btn btn-ghost btn-sm" data-role-delete="${role.id}">حذف</button>`
          }
        </div>
        <div class="role-permissions-grid">
          ${allPermissions
            .map(
              (p) => `
            <label class="settings-inline-toggle">
              <input type="checkbox" data-role-permission="${p.key}" ${role.permissions.includes(p.key) ? 'checked' : ''} ${disabled ? 'disabled' : ''} />
              ${p.label}
            </label>
          `,
            )
            .join('')}
        </div>
        ${
          disabled
            ? ''
            : `<div class="settings-panel-footer"><button type="button" class="btn btn-primary" data-role-save="${role.id}">ذخیره نقش</button></div>`
        }
      </div>
    `;
  }

  function renderNewRoleCard(): string {
    if (!newRoleDraft) return '';
    return `
      <div class="editor-sidebar-card" data-role-card="new">
        <div class="plugin-card-head">
          <div class="settings-form-grid" style="flex:1">
            <div class="form-field"><label>نام نقش (فارسی)</label><input type="text" data-role-label placeholder="مثلاً: پشتیبان انبار" /></div>
            <div class="form-field"><label>نام نقش (انگلیسی)</label><input type="text" dir="ltr" data-role-label-en /></div>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-role-cancel-new>انصراف</button>
        </div>
        <div class="role-permissions-grid">
          ${allPermissions.map((p) => `<label class="settings-inline-toggle"><input type="checkbox" data-role-permission="${p.key}" /> ${p.label}</label>`).join('')}
        </div>
        <div class="settings-panel-footer"><button type="button" class="btn btn-primary" data-role-save="new">ایجاد نقش</button></div>
      </div>
    `;
  }

  function renderRolesList(): void {
    const list = document.getElementById('roles-list');
    if (!list) return;
    list.innerHTML = renderNewRoleCard() + roles.map(renderRoleCard).join('');
    wireRoleCardActions();
  }

  function readRolePermissionsFromCard(card: Element): string[] {
    return Array.from(card.querySelectorAll<HTMLInputElement>('[data-role-permission]:checked')).map((el) => el.dataset.rolePermission!);
  }

  function wireRoleCardActions(): void {
    document.querySelectorAll<HTMLButtonElement>('[data-role-save]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const card = btn.closest('[data-role-card]');
        if (!card) return;
        const idAttr = btn.dataset.roleSave!;
        const label = (card.querySelector('[data-role-label]') as HTMLInputElement).value.trim();
        const labelEn = (card.querySelector('[data-role-label-en]') as HTMLInputElement).value.trim();
        if (!label) {
          showError(new Error('نام نقش الزامی است.'));
          return;
        }
        const permissions = readRolePermissionsFromCard(card);
        btn.disabled = true;
        try {
          if (idAttr === 'new') {
            await createRole({ label, labelEn, permissions });
            newRoleDraft = null;
          } else {
            await updateRole(Number(idAttr), { label, labelEn, permissions });
          }
          const data = await fetchRoles();
          roles = data.roles;
          renderRolesList();
          showToast('نقش ذخیره شد.');
        } catch (err) {
          showError(err);
          btn.disabled = false;
        }
      });
    });

    document.querySelectorAll<HTMLButtonElement>('[data-role-delete]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!window.confirm('این نقش برای همیشه حذف شود؟')) return;
        btn.disabled = true;
        try {
          await deleteRole(Number(btn.dataset.roleDelete));
          const data = await fetchRoles();
          roles = data.roles;
          renderRolesList();
        } catch (err) {
          showError(err);
          btn.disabled = false;
        }
      });
    });

    document.querySelector('[data-role-cancel-new]')?.addEventListener('click', () => {
      newRoleDraft = null;
      renderRolesList();
    });
  }

  document.getElementById('role-add-btn')?.addEventListener('click', () => {
    newRoleDraft = { label: '', labelEn: '', permissions: [] };
    renderRolesList();
  });

  fetchRoles()
    .then((data) => {
      roles = data.roles;
      allPermissions = data.permissions;
      renderRolesList();
    })
    .catch(showError);
}

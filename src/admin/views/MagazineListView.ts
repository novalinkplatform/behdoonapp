import { icons } from '../components/icons.ts';
import { fetchAdminArticles, deleteArticle } from '../utils/api.ts';
import type { ArticleRecord } from '../utils/api.ts';
import { toPersianDigits } from '../utils/format.ts';

function renderRow(article: ArticleRecord): string {
  return `
    <tr data-article-row="${article.id}">
      <td>${article.title || '(بدون عنوان)'}</td>
      <td>${article.category || '—'}</td>
      <td>
        <span class="article-status-badge article-status-${article.status}">
          ${article.status === 'published' ? 'منتشرشده' : 'پیش‌نویس'}
        </span>
      </td>
      <td>${toPersianDigits(article.readingTime)} دقیقه</td>
      <td>
        <div class="staff-table-actions">
          <button type="button" class="btn btn-secondary btn-sm" data-edit-article="${article.id}">ویرایش</button>
          <button type="button" class="btn btn-ghost btn-sm" data-delete-article="${article.id}">حذف</button>
        </div>
      </td>
    </tr>
  `;
}

export function renderMagazineListView(): string {
  return `
    <div class="view-header">
      <h1>مجله</h1>
      <button type="button" class="btn btn-primary" id="magazine-new-btn">
        <span class="icon">${icons.plusCircle}</span>
        مقاله جدید
      </button>
    </div>
    <p class="error-text" id="magazine-list-error" hidden></p>
    <div class="staff-table-wrapper">
      <table class="staff-table">
        <thead>
          <tr>
            <th>عنوان</th>
            <th>دسته</th>
            <th>وضعیت</th>
            <th>زمان مطالعه</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="magazine-table-body"></tbody>
      </table>
    </div>
  `;
}

export function initMagazineListView(onEdit: (id: number | null) => void): void {
  const errorEl = document.getElementById('magazine-list-error');
  const tableBody = document.getElementById('magazine-table-body');
  const newBtn = document.getElementById('magazine-new-btn');
  if (!errorEl || !tableBody || !newBtn) return;

  async function load(): Promise<void> {
    errorEl!.hidden = true;
    try {
      const articles = await fetchAdminArticles();
      tableBody!.innerHTML = articles.length
        ? articles.map(renderRow).join('')
        : '<tr><td colspan="5" class="staff-table-empty">هنوز مقاله‌ای ثبت نشده است.</td></tr>';
      wireRowActions();
    } catch (err) {
      errorEl!.hidden = false;
      errorEl!.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
    }
  }

  function wireRowActions(): void {
    tableBody!.querySelectorAll<HTMLButtonElement>('[data-edit-article]').forEach((btn) => {
      btn.addEventListener('click', () => onEdit(Number(btn.dataset.editArticle)));
    });
    tableBody!.querySelectorAll<HTMLButtonElement>('[data-delete-article]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!window.confirm('این مقاله برای همیشه حذف شود؟')) return;
        btn.disabled = true;
        try {
          await deleteArticle(Number(btn.dataset.deleteArticle));
          await load();
        } catch (err) {
          errorEl!.hidden = false;
          errorEl!.textContent = err instanceof Error ? err.message : 'حذف ناموفق بود.';
          btn.disabled = false;
        }
      });
    });
  }

  newBtn.addEventListener('click', () => onEdit(null));

  void load();
}

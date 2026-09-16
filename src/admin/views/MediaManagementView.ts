import { icons } from '../components/icons.ts';
import { listMedia, deleteMedia, uploadImage } from '../utils/api.ts';
import { API_BASE_URL } from '../data/config.ts';

export function renderMediaManagementView(): string {
  return `
    <div class="view-header">
      <h1>مدیریت فایل</h1>
      <div>
        <input type="file" id="media-upload-input" accept="image/*,video/mp4,video/webm,audio/mpeg,audio/wav,audio/ogg" hidden />
        <button type="button" class="btn btn-secondary btn-sm" id="media-upload-btn">آپلود فایل</button>
      </div>
    </div>
    <p class="settings-panel-hint">
      عکس، ویدیو و فایل صوتی که آپلود می‌کنید، بر اساس نوعش در پوشه‌ی مربوطه (عکس‌ها/ویدیوها/صوت‌ها) روی سرور ذخیره می‌شود.
    </p>
    <div class="settings-tabs" id="media-folder-filter" style="margin-bottom: 0">
      <button type="button" class="settings-tab is-active" data-media-folder="">همه</button>
      <button type="button" class="settings-tab" data-media-folder="images">عکس‌ها</button>
      <button type="button" class="settings-tab" data-media-folder="videos">ویدیوها</button>
      <button type="button" class="settings-tab" data-media-folder="audio">صوت‌ها</button>
    </div>
    <p class="error-text" id="media-error" hidden></p>
    <div id="media-list"></div>
  `;
}

export function initMediaManagementView(): void {
  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function mediaFileIcon(key: string): string {
    if (key.startsWith('videos/')) return icons.video;
    if (key.startsWith('audio/')) return icons.audio;
    return icons.image;
  }

  let currentMediaFolder: '' | 'images' | 'videos' | 'audio' = '';

  async function loadMediaList(): Promise<void> {
    const listEl = document.getElementById('media-list');
    const errorEl = document.getElementById('media-error');
    if (!listEl || !errorEl) return;
    errorEl.hidden = true;
    try {
      const files = await listMedia(currentMediaFolder || undefined);
      listEl.innerHTML = files.length
        ? files
            .map(
              (f) => `
        <div class="testimonial-row" data-media-key="${f.key}">
          <div class="testimonial-row-avatar"><span class="icon">${mediaFileIcon(f.key)}</span></div>
          <div class="testimonial-row-body">
            <div class="testimonial-row-head"><strong dir="ltr">${f.key.split('/').pop()}</strong></div>
            <div class="job-application-meta"><span>${formatFileSize(f.size)}</span><span>${new Date(f.uploaded).toLocaleDateString('fa-IR')}</span></div>
          </div>
          <div class="staff-table-actions">
            <button type="button" class="btn btn-secondary btn-sm" data-copy-media="${f.url}">کپی لینک</button>
            <button type="button" class="btn btn-ghost btn-sm" data-delete-media="${f.key}">حذف</button>
          </div>
        </div>
      `,
            )
            .join('')
        : '<p class="pipeline-empty">فایلی آپلود نشده است.</p>';

      listEl.querySelectorAll<HTMLButtonElement>('[data-copy-media]').forEach((btn) => {
        btn.addEventListener('click', () => {
          void navigator.clipboard.writeText(`${API_BASE_URL}${btn.dataset.copyMedia}`);
          btn.textContent = 'کپی شد';
          window.setTimeout(() => (btn.textContent = 'کپی لینک'), 1500);
        });
      });
      listEl.querySelectorAll<HTMLButtonElement>('[data-delete-media]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          if (!window.confirm('این فایل برای همیشه حذف شود؟')) return;
          btn.disabled = true;
          try {
            await deleteMedia(btn.dataset.deleteMedia as string);
            await loadMediaList();
          } catch (err) {
            errorEl.hidden = false;
            errorEl.textContent = err instanceof Error ? err.message : 'حذف فایل ناموفق بود.';
            btn.disabled = false;
          }
        });
      });
    } catch (err) {
      listEl.innerHTML = '';
      errorEl.hidden = false;
      errorEl.textContent = err instanceof Error ? err.message : 'دریافت فهرست فایل‌ها ناموفق بود.';
    }
  }

  document.getElementById('media-folder-filter')?.addEventListener('click', (event) => {
    const btn = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-media-folder]');
    if (!btn) return;
    document.querySelectorAll('#media-folder-filter .settings-tab').forEach((t) => t.classList.remove('is-active'));
    btn.classList.add('is-active');
    currentMediaFolder = (btn.dataset.mediaFolder as typeof currentMediaFolder) ?? '';
    void loadMediaList();
  });

  const mediaUploadInput = document.getElementById('media-upload-input') as HTMLInputElement | null;
  document.getElementById('media-upload-btn')?.addEventListener('click', () => mediaUploadInput?.click());
  mediaUploadInput?.addEventListener('change', async () => {
    const file = mediaUploadInput.files?.[0];
    if (!file) return;
    const errorEl = document.getElementById('media-error');
    try {
      await uploadImage(file);
      mediaUploadInput.value = '';
      await loadMediaList();
    } catch (err) {
      if (errorEl) {
        errorEl.hidden = false;
        errorEl.textContent = err instanceof Error ? err.message : 'آپلود فایل ناموفق بود.';
      }
    }
  });

  void loadMediaList();
}

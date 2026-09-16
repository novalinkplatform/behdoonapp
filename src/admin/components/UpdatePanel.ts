import { fetchVersion, runSelfhostUpdate, downloadBackup } from '../utils/api.ts';
import { showToast } from '../utils/toast.ts';

// این بخش قبلاً یک دکمه‌ی کوچک در نوار بالای پنل بود؛ حالا زیرمجموعه‌ی «تنظیمات سایت» است، کنار
// لایسنس و پشتیبان‌گیری که مفهوماً به همین دسته تعلق دارند.
export function renderUpdatePanel(): string {
  return `
    <div class="editor-sidebar-card">
      <h3>به‌روزرسانی</h3>
      <p class="settings-panel-hint" id="update-panel-current">در حال بارگذاری اطلاعات نسخه...</p>
      <div id="update-panel-current-changelog" hidden></div>
      <button type="button" class="btn btn-secondary" id="update-scan-btn">بررسی به‌روزرسانی</button>
      <div id="update-panel-result"></div>
      <div id="update-panel-manual-guide" hidden></div>
    </div>
  `;
}

// راهنمای نصب/به‌روزرسانی دستی — فقط برای خوداستقرار معنا دارد (نسخه‌ی کلادفلر اصلاً سروری در
// اختیار خریدار نیست که به آن SSH بزند)؛ همیشه نمایش داده می‌شود، نه فقط وقتی نسخه‌ی جدیدی هست،
// چون دکمه‌ی «اعمال به‌روزرسانی» ممکن است به هر دلیلی (مثلاً دسترسی داکر) جواب ندهد و کاربر به
// یک راه دستی از طریق SSH نیاز داشته باشد — همان دستوری که خودِ اسکریپت نصب هم در پایان پیشنهاد می‌دهد.
// چون خریداران این محصول لزوماً برنامه‌نویس نیستند، خودِ «چطور وارد سرور شد» هم توضیح داده می‌شود،
// نه فقط دستورهای خام — چیزی که قبلاً فرض می‌شد بدیهی است.
const INSTALL_CMD = 'sudo bash install.sh';

function renderInstallCmdSummary(): string {
  return `
    <div class="update-manual-step">
      <h5>به‌روزرسانی سریع از طریق سرور</h5>
      <p class="settings-panel-hint">
        برای به‌روزرسانی آسان، کافیست بعد از اتصال SSH به سرور، دستور زیر را اجرا نمایید:
      </p>
      <p class="update-manual-cmd-plain" dir="ltr">sudo beh-manager</p>
      <p class="settings-panel-hint">سپس از منوی بازشده، گزینه ۲ (Update) را انتخاب فرمایید.</p>
    </div>
  `;
}

function renderManualGuide(): string {
  const sshCmd = 'ssh root@IP-سرور-شما';
  const installCmd = INSTALL_CMD;
  const managerCmd = 'sudo beh-manager';
  return `
    <div class="update-manual-guide">
      <h4>راهنمای به‌روزرسانی یا نصب از طریق SSH</h4>

      <div class="update-manual-step">
        <h5>۱) وارد شدن به سرور</h5>
        <p class="settings-panel-hint">
          آدرس IP سرور و رمز عبور (یا کلید SSH) را از پنل میزبانی سرور خود پیدا کنید.
          سپس:
        </p>
        <ul class="update-manual-list">
          <li><strong>ویندوز:</strong> برنامه‌ی PowerShell یا Windows Terminal را باز کنید.</li>
          <li><strong>مک یا لینوکس:</strong> برنامه‌ی Terminal را باز کنید.</li>
        </ul>
        <p class="settings-panel-hint">این دستور را بزنید (به‌جای «IP-سرور-شما» آی‌پی واقعی سرورتان را بگذارید) و رمز عبور را وارد کنید:</p>
        <p class="update-manual-cmd-plain" dir="ltr">${sshCmd}</p>
      </div>

      <div class="update-manual-step">
        <h5>۲) نصب اولیه</h5>
        <p class="settings-panel-hint">
          پس از استخراج بسته اسکریپت در سرور، وارد پوشه مربوطه شده و این دستور را اجرا نمایید:
        </p>
        <p class="update-manual-cmd-plain" dir="ltr">${installCmd}</p>
      </div>

      <div class="update-manual-step">
        <h5>۳) به‌روزرسانی / تغییر دامنه / تغییر رمز ادمین</h5>
        <p class="settings-panel-hint">
          برای مدیریت سرویس‌ها، به‌روزرسانی یا تغییر مشخصات، بعد از اتصال به سرور این دستور را بزنید:
        </p>
        <p class="update-manual-cmd-plain" dir="ltr">${managerCmd}</p>
        <p class="settings-panel-hint">یک منو باز می‌شود؛ عدد گزینه‌ی مورد نظر (مثلاً «۲» برای به‌روزرسانی) را تایپ و Enter بزنید.</p>
      </div>
    </div>
  `;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function initUpdatePanel(): void {
  const currentEl = document.getElementById('update-panel-current');
  const currentChangelogEl = document.getElementById('update-panel-current-changelog');
  const resultEl = document.getElementById('update-panel-result');
  const scanBtn = document.getElementById('update-scan-btn') as HTMLButtonElement | null;
  const manualGuideEl = document.getElementById('update-panel-manual-guide');
  if (!currentEl || !currentChangelogEl || !resultEl || !scanBtn || !manualGuideEl) return;

  fetchVersion()
    .then((v) => {
      currentEl.textContent = `نسخه‌ی فعلی: ${v.current}`;
      if (v.currentChangelog.length) {
        currentChangelogEl.innerHTML = `
          <h4>این نسخه شامل چه چیزهایی است؟</h4>
          <ul class="update-modal-changelog">${v.currentChangelog.map((f) => `<li>${escapeHtml(f)}</li>`).join('')}</ul>
          ${renderInstallCmdSummary()}
        `;
        currentChangelogEl.hidden = false;
      }
      // این راهنما همیشه نمایش داده می‌شود، حتی روی استقرار کلادفلر — چون مرجع نصب/به‌روزرسانی
      // خوداستقرار است و صرفاً یک مسیر جایگزین را توضیح می‌دهد، نه دستوری که باید همین سایت اجرا کند.
      manualGuideEl.innerHTML = renderManualGuide();
      manualGuideEl.hidden = false;
    })
    .catch(() => {
      currentEl.textContent = '';
    });

  scanBtn.addEventListener('click', async () => {
    scanBtn.disabled = true;
    const originalText = scanBtn.textContent;
    scanBtn.textContent = 'در حال بررسی...';
    resultEl.innerHTML = '';
    try {
      const version = await fetchVersion();
      currentEl.textContent = `نسخه‌ی فعلی: ${version.current}`;

      if (!version.updateAvailable) {
        showToast('نسخه‌ی شما به‌روز است.');
        return;
      }

      const changelogHtml = version.changelog.length
        ? `<ul class="update-modal-changelog">${version.changelog.map((f) => `<li>${escapeHtml(f)}</li>`).join('')}</ul>`
        : '';

      if (version.runtime !== 'selfhost') {
        resultEl.innerHTML = `
          <h4>نسخه‌ی جدید موجود است: ${escapeHtml(version.latest ?? '')}</h4>
          ${changelogHtml}
          <p class="settings-panel-hint">این استقرار روی کلادفلر است — به‌روزرسانی از طریق دیپلوی مستقیم انجام می‌شود، نه از این پنل.</p>
        `;
        return;
      }

      resultEl.innerHTML = `
        <h4>نسخه‌ی جدید موجود است: ${escapeHtml(version.latest ?? '')}</h4>
        ${changelogHtml}
        <p class="update-modal-warning">قبل از به‌روزرسانی، حتماً یک نسخه پشتیبان دانلود کنید.</p>
        <div class="update-modal-actions">
          <button type="button" class="btn btn-secondary" id="update-panel-backup-btn">دانلود نسخه پشتیبان</button>
          <button type="button" class="btn btn-primary" id="update-panel-apply-btn">اعمال به‌روزرسانی</button>
        </div>
        <p class="error-text" id="update-panel-error" hidden></p>
      `;

      document.getElementById('update-panel-backup-btn')?.addEventListener('click', async (e) => {
        const btn = e.currentTarget as HTMLButtonElement;
        btn.disabled = true;
        btn.textContent = 'در حال دانلود...';
        try {
          await downloadBackup();
        } catch (err) {
          showToast(err instanceof Error ? err.message : 'دانلود پشتیبان ناموفق بود.', 'error');
        } finally {
          btn.disabled = false;
          btn.textContent = 'دانلود نسخه پشتیبان';
        }
      });

      document.getElementById('update-panel-apply-btn')?.addEventListener('click', async (e) => {
        if (!window.confirm('به‌روزرسانی سرویس را برای حدود یک دقیقه مختل می‌کند. آیا از پشتیبان‌گیری مطمئن هستید و می‌خواهید ادامه دهید؟')) return;
        const btn = e.currentTarget as HTMLButtonElement;
        const errorEl = document.getElementById('update-panel-error');
        btn.disabled = true;
        btn.textContent = 'در حال اعمال...';
        try {
          await runSelfhostUpdate();
          resultEl.innerHTML = `
            <h4>به‌روزرسانی آغاز شد</h4>
            <p>سرویس در حال بازسازی است — حدود یک دقیقه صبر کنید، سپس این صفحه را دوباره بارگذاری کنید.</p>
          `;
        } catch (err) {
          if (errorEl) {
            errorEl.hidden = false;
            errorEl.textContent = err instanceof Error ? err.message : 'به‌روزرسانی ناموفق بود.';
          }
          btn.disabled = false;
          btn.textContent = 'اعمال به‌روزرسانی';
        }
      });
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'بررسی به‌روزرسانی ناموفق بود.', 'error');
    } finally {
      scanBtn.disabled = false;
      scanBtn.textContent = originalText;
    }
  });
}

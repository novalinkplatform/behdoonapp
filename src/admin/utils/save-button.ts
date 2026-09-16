/**
 * Helper to handle save buttons:
 * - Disables button and sets loading state ("در حال ذخیره...")
 * - Calls async save function
 * - On success: turns green (.btn-saved), shows "✓ ذخیره شد", and restores after 2.5s
 * - On error: restores button and throws error
 */
export async function handleSaveButton(
  btn: HTMLButtonElement,
  saveFn: () => Promise<void>,
  successText = 'ذخیره شد',
  duration = 2500,
): Promise<void> {
  const originalHtml = btn.innerHTML;
  btn.disabled = true;
  btn.textContent = 'در حال ذخیره...';
  try {
    await saveFn();
    btn.classList.add('btn-saved');
    btn.innerHTML = `<span style="font-weight:bold;margin-inline-end:4px;">✓</span> ${successText}`;
    window.setTimeout(() => {
      btn.classList.remove('btn-saved');
      btn.innerHTML = originalHtml;
      btn.disabled = false;
    }, duration);
  } catch (err) {
    btn.classList.remove('btn-saved');
    btn.innerHTML = originalHtml;
    btn.disabled = false;
    throw err;
  }
}

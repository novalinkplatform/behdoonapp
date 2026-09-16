import { icons } from './icons.ts';
import { uploadImage } from '../utils/api.ts';

const BLOCK_FORMATS: { value: string; label: string; labelEn: string }[] = [
  { value: 'P', label: 'متن ساده', labelEn: 'Paragraph' },
  { value: 'H1', label: 'سرتیتر ۱', labelEn: 'Heading 1' },
  { value: 'H2', label: 'سرتیتر ۲', labelEn: 'Heading 2' },
  { value: 'H3', label: 'سرتیتر ۳', labelEn: 'Heading 3' },
  { value: 'H4', label: 'سرتیتر ۴', labelEn: 'Heading 4' },
  { value: 'H5', label: 'سرتیتر ۵', labelEn: 'Heading 5' },
  { value: 'H6', label: 'سرتیتر ۶', labelEn: 'Heading 6' },
  { value: 'BLOCKQUOTE', label: 'نقل‌قول', labelEn: 'Quote' },
];

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * یک ویرایش‌گر متن غنی به‌همراه نوار ابزار سبک کلاسیک (شبیه ویرایش‌گر کلاسیک وردپرس). خود نوار
 * ابزار همیشه راست‌چین می‌ماند (پنل مدیریت فارسی است) حتی برای ویرایش‌گر انگلیسیِ همین بلوک —
 * فقط جهت تایپ در ناحیه‌ی محتوا (rte-content) بر اساس زبان عوض می‌شود، وگرنه دکمه‌ها بین دو
 * ویرایش‌گر فارسی/انگلیسیِ یک بلوک از این‌رو به آن‌رو می‌شدند و گیج‌کننده بود.
 */
export function renderRichTextEditor(fieldName: string, initialHtml: string, dir: 'rtl' | 'ltr'): string {
  return `
    <div class="rte">
      <div class="rte-toolbar">
        <div class="rte-format-select-wrap">
          <select class="rte-format-select" data-rte-format title="${dir === 'rtl' ? 'قالب متن' : 'Text format'}">
            ${BLOCK_FORMATS.map((f) => `<option value="${f.value}">${dir === 'rtl' ? f.label : f.labelEn}</option>`).join('')}
          </select>
          <span class="rte-format-select-label" data-rte-format-label aria-hidden="true">${dir === 'rtl' ? BLOCK_FORMATS[0].label : BLOCK_FORMATS[0].labelEn}</span>
        </div>
        <span class="rte-sep"></span>
        <button type="button" class="rte-btn rte-btn-glyph" data-rte-cmd="bold" title="ضخیم"><b>B</b></button>
        <button type="button" class="rte-btn rte-btn-glyph" data-rte-cmd="italic" title="مورب"><i>I</i></button>
        <button type="button" class="rte-btn rte-btn-glyph" data-rte-cmd="underline" title="زیرخط"><u>U</u></button>
        <button type="button" class="rte-btn rte-btn-glyph" data-rte-cmd="strikeThrough" title="خط‌خورده"><s>S</s></button>
        <span class="rte-sep"></span>
        <label class="rte-color-btn" title="رنگ متن">
          <span class="rte-color-swatch" data-rte-swatch="foreColor">A</span>
          <input type="color" data-rte-color="foreColor" value="#1c1b18" />
        </label>
        <label class="rte-color-btn" title="رنگ پس‌زمینه متن">
          <span class="rte-color-swatch" data-rte-swatch="hiliteColor">A</span>
          <input type="color" data-rte-color="hiliteColor" value="#fff59d" />
        </label>
        <span class="rte-sep"></span>
        <button type="button" class="rte-btn" data-rte-cmd="insertUnorderedList" title="لیست نقطه‌ای">${icons.listBullet}</button>
        <button type="button" class="rte-btn" data-rte-cmd="insertOrderedList" title="لیست شماره‌دار">${icons.listNumber}</button>
        <span class="rte-sep"></span>
        <button type="button" class="rte-btn" data-rte-cmd="justifyRight" title="راست‌چین">${icons.alignRight}</button>
        <button type="button" class="rte-btn" data-rte-cmd="justifyCenter" title="وسط‌چین">${icons.alignCenter}</button>
        <button type="button" class="rte-btn" data-rte-cmd="justifyLeft" title="چپ‌چین">${icons.alignLeft}</button>
        <span class="rte-sep"></span>
        <button type="button" class="rte-btn" data-rte-action="link" title="افزودن/ویرایش لینک">${icons.link}</button>
        <button type="button" class="rte-btn" data-rte-cmd="unlink" title="حذف لینک">${icons.unlink}</button>
        <button type="button" class="rte-btn" data-rte-cmd="formatBlock" data-rte-cmd-value="BLOCKQUOTE" title="نقل‌قول">${icons.quote}</button>
        <button type="button" class="rte-btn" data-rte-cmd="insertHorizontalRule" title="خط جداکننده">${icons.minus}</button>
        <button type="button" class="rte-btn" data-rte-action="image" title="افزودن تصویر">${icons.image}</button>
        <span class="rte-sep"></span>
        <button type="button" class="rte-btn" data-rte-cmd="removeFormat" title="پاک‌کردن قالب‌بندی">${icons.eraser}</button>
        <button type="button" class="rte-btn" data-rte-cmd="undo" title="واگرد">${icons.undo}</button>
        <button type="button" class="rte-btn" data-rte-cmd="redo" title="ازنو">${icons.redo}</button>

        <div class="rte-link-popover" data-rte-link-popover hidden>
          <div class="form-field">
            <label>آدرس لینک</label>
            <input type="url" dir="ltr" placeholder="https://..." data-rte-link-url />
          </div>
          <label class="rte-checkbox"><input type="checkbox" data-rte-link-blank /> باز شدن در تب جدید</label>
          <label class="rte-checkbox"><input type="checkbox" data-rte-link-nofollow /> nofollow (این لینک دنبال نشود)</label>
          <div class="rte-link-popover-actions">
            <button type="button" class="btn btn-secondary btn-sm" data-rte-link-cancel>انصراف</button>
            <button type="button" class="btn btn-primary btn-sm" data-rte-link-apply>اعمال</button>
          </div>
        </div>
      </div>
      <input type="file" accept="image/*" hidden data-rte-image-input />
      <textarea data-field="${fieldName}" hidden>${escapeHtml(initialHtml)}</textarea>
      <div class="rte-content" contenteditable="true" dir="${dir}" data-rte-content>${initialHtml || '<p><br></p>'}</div>
    </div>
  `;
}

const savedRanges = new WeakMap<HTMLElement, Range>();

function closestRte(el: HTMLElement | null): HTMLElement | null {
  return el?.closest<HTMLElement>('.rte') ?? null;
}

function contentOf(rte: HTMLElement): HTMLElement | null {
  return rte.querySelector<HTMLElement>('[data-rte-content]');
}

function saveSelectionFor(content: HTMLElement): void {
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0 && content.contains(sel.anchorNode)) {
    savedRanges.set(content, sel.getRangeAt(0).cloneRange());
  }
}

function restoreSelectionFor(content: HTMLElement): void {
  const range = savedRanges.get(content);
  if (!range) return;
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
}

function syncHiddenField(rte: HTMLElement): void {
  const content = contentOf(rte);
  const field = rte.querySelector<HTMLTextAreaElement>('textarea[data-field]');
  if (content && field) field.value = content.innerHTML === '<p><br></p>' ? '' : content.innerHTML;
}

function anchorAtSelection(content: HTMLElement): HTMLAnchorElement | null {
  const sel = window.getSelection();
  if (!sel || !sel.anchorNode) return null;
  const el = sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentElement : (sel.anchorNode as HTMLElement);
  const anchor = el?.closest('a') ?? null;
  return anchor && content.contains(anchor) ? anchor : null;
}

/**
 * تمام ویرایش‌گرهای متن غنی داخل ریشه‌ی داده‌شده را با تفویض رویداد (event delegation) فعال می‌کند —
 * چون بلوک‌ها با هر افزودن/حذف/جابه‌جایی از نو رندر می‌شوند، اتصال مستقیم شنونده به هر نمونه بی‌فایده بود.
 */
export function wireRichTextEditors(root: HTMLElement): void {
  root.addEventListener('input', (event) => {
    const content = (event.target as HTMLElement).closest<HTMLElement>('[data-rte-content]');
    if (!content) return;
    const rte = closestRte(content);
    if (rte) syncHiddenField(rte);
  });

  root.addEventListener('mouseup', (event) => {
    const content = (event.target as HTMLElement).closest<HTMLElement>('[data-rte-content]');
    if (content) saveSelectionFor(content);
  });

  root.addEventListener('keyup', (event) => {
    const content = (event.target as HTMLElement).closest<HTMLElement>('[data-rte-content]');
    if (content) saveSelectionFor(content);
  });

  // جلوگیری از ربوده‌شدن فوکوس/انتخاب توسط کلیک روی دکمه‌های نوار ابزار؛ برای سوییچ رنگ (که باید
  // انتخابگر بومی مرورگر باز شود) به‌جای preventDefault فقط انتخاب فعلی را ذخیره می‌کنیم.
  root.addEventListener('mousedown', (event) => {
    const target = event.target as HTMLElement;
    if (target.closest('[data-rte-cmd], [data-rte-action]')) {
      event.preventDefault();
      return;
    }
    const swatch = target.closest<HTMLElement>('.rte-color-btn');
    if (swatch) {
      const rte = closestRte(swatch);
      const content = rte && contentOf(rte);
      if (content) saveSelectionFor(content);
    }
  });

  root.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;

    const cmdBtn = target.closest<HTMLButtonElement>('[data-rte-cmd]');
    if (cmdBtn) {
      const rte = closestRte(cmdBtn);
      const content = rte && contentOf(rte);
      if (!content) return;
      // انتخاب فعلی همین حالا هم معتبر است چون preventDefault روی mousedown مانع از ربوده‌شدن
      // فوکوس/انتخاب شده — بازگرداندن از savedRanges اینجا لازم نیست و می‌تواند یک انتخاب زنده‌ی
      // درست را با نسخه‌ی قدیمی‌تر جایگزین کند (مثلاً وقتی کاربر متن را درگ می‌کند و درست روی
      // دکمه‌ی نوار ابزار رها می‌کند، رویداد mouseup روی خود دکمه رخ می‌دهد نه داخل content).
      content.focus();
      document.execCommand(cmdBtn.dataset.rteCmd!, false, cmdBtn.dataset.rteCmdValue ?? undefined);
      syncHiddenField(rte!);
      return;
    }

    const linkCancelBtn = target.closest('[data-rte-link-cancel]');
    if (linkCancelBtn) {
      const rte = closestRte(linkCancelBtn as HTMLElement);
      rte?.querySelector<HTMLElement>('[data-rte-link-popover]')?.setAttribute('hidden', '');
      return;
    }

    const linkApplyBtn = target.closest('[data-rte-link-apply]');
    if (linkApplyBtn) {
      const rte = closestRte(linkApplyBtn as HTMLElement);
      const content = rte && contentOf(rte);
      const popover = rte?.querySelector<HTMLElement>('[data-rte-link-popover]');
      if (!rte || !content || !popover) return;
      const urlInput = popover.querySelector<HTMLInputElement>('[data-rte-link-url]')!;
      const blankInput = popover.querySelector<HTMLInputElement>('[data-rte-link-blank]')!;
      const nofollowInput = popover.querySelector<HTMLInputElement>('[data-rte-link-nofollow]')!;
      const url = urlInput.value.trim();
      popover.hidden = true;
      if (!url) return;
      content.focus();
      restoreSelectionFor(content);
      document.execCommand('createLink', false, url);
      const anchor =
        anchorAtSelection(content) ??
        Array.from(content.querySelectorAll<HTMLAnchorElement>('a[href]')).find((a) => a.getAttribute('href') === url);
      if (anchor) {
        const relParts: string[] = [];
        if (blankInput.checked) {
          anchor.setAttribute('target', '_blank');
          relParts.push('noopener');
        } else {
          anchor.removeAttribute('target');
        }
        if (nofollowInput.checked) relParts.push('nofollow');
        if (relParts.length) anchor.setAttribute('rel', relParts.join(' '));
        else anchor.removeAttribute('rel');
      }
      syncHiddenField(rte);
      return;
    }

    const actionBtn = target.closest<HTMLButtonElement>('[data-rte-action]');
    if (actionBtn) {
      const rte = closestRte(actionBtn);
      const content = rte && contentOf(rte);
      if (!rte || !content) return;
      if (actionBtn.dataset.rteAction === 'link') {
        saveSelectionFor(content);
        const popover = rte.querySelector<HTMLElement>('[data-rte-link-popover]')!;
        const urlInput = popover.querySelector<HTMLInputElement>('[data-rte-link-url]')!;
        const blankInput = popover.querySelector<HTMLInputElement>('[data-rte-link-blank]')!;
        const nofollowInput = popover.querySelector<HTMLInputElement>('[data-rte-link-nofollow]')!;
        const existing = anchorAtSelection(content);
        urlInput.value = existing?.getAttribute('href') ?? '';
        blankInput.checked = existing?.getAttribute('target') === '_blank';
        nofollowInput.checked = (existing?.getAttribute('rel') ?? '').includes('nofollow');
        popover.hidden = false;
        urlInput.focus();
      } else if (actionBtn.dataset.rteAction === 'image') {
        saveSelectionFor(content);
        rte.querySelector<HTMLInputElement>('[data-rte-image-input]')?.click();
      }
    }
  });

  root.addEventListener('change', (event) => {
    const target = event.target as HTMLElement;

    const formatSelect = target.closest<HTMLSelectElement>('[data-rte-format]');
    if (formatSelect) {
      const rte = closestRte(formatSelect);
      const content = rte && contentOf(rte);
      if (!content) return;
      const label = rte!.querySelector<HTMLElement>('[data-rte-format-label]');
      if (label) label.textContent = formatSelect.options[formatSelect.selectedIndex]?.textContent ?? '';
      content.focus();
      restoreSelectionFor(content);
      document.execCommand('formatBlock', false, `<${formatSelect.value}>`);
      syncHiddenField(rte!);
      return;
    }

    const colorInput = target.closest<HTMLInputElement>('[data-rte-color]');
    if (colorInput) {
      const rte = closestRte(colorInput);
      const content = rte && contentOf(rte);
      if (!content) return;
      content.focus();
      restoreSelectionFor(content);
      document.execCommand(colorInput.dataset.rteColor!, false, colorInput.value);
      syncHiddenField(rte!);
      return;
    }

    const imageInput = target.closest<HTMLInputElement>('[data-rte-image-input]');
    if (imageInput) {
      const rte = closestRte(imageInput);
      const content = rte && contentOf(rte);
      const file = imageInput.files?.[0];
      if (!rte || !content || !file) return;
      void uploadImage(file)
        .then((url) => {
          content.focus();
          restoreSelectionFor(content);
          document.execCommand('insertImage', false, url);
          syncHiddenField(rte);
        })
        .finally(() => {
          imageInput.value = '';
        });
    }
  });
}

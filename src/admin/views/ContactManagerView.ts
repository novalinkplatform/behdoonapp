import { icons } from '../components/icons.ts';
import { icons as publicIcons } from '../../components/icons.ts';
import { fetchSettings, updateSetting } from '../utils/api.ts';
import { handleSaveButton } from '../utils/save-button.ts';

interface SocialLinkSetting {
  id: string;
  platform: string;
  label: string;
  url: string;
  customIconUrl?: string;
}

interface ContactSettings {
  phoneDisplay: string;
  phoneTelHref: string;
  socialIconColor?: string;
  socialLinks: SocialLinkSetting[];
}

const CORE_SOCIAL_LIST = [
  { id: 'instagram', name: 'اینستاگرام', brandColor: '#E1306C', iconSvg: publicIcons.instagramFilled || icons.link, placeholder: 'https://instagram.com/...' },
  { id: 'telegram', name: 'تلگرام', brandColor: '#26A5E4', iconSvg: publicIcons.telegramFilled || icons.link, placeholder: 'https://t.me/...' },
  { id: 'whatsapp', name: 'واتس‌اپ', brandColor: '#25D366', iconSvg: publicIcons.whatsappFilled || icons.link, placeholder: 'https://wa.me/...' },
  { id: 'bale', name: 'بله', brandColor: '#45C4A0', iconSvg: publicIcons.baleFilled || icons.link, placeholder: 'https://ble.ir/...' },
  { id: 'eitaa', name: 'ایتا', brandColor: '#FF7D00', iconSvg: publicIcons.eitaaFilled || icons.link, placeholder: 'https://eitaa.com/...' },
  { id: 'rubika', name: 'روبیکا', brandColor: '#27B8EB', iconSvg: publicIcons.rubikaFilled || icons.link, placeholder: 'https://rubika.ir/...' },
  { id: 'aparat', name: 'آپارات', brandColor: '#EE2853', iconSvg: publicIcons.aparatFilled || icons.link, placeholder: 'https://aparat.com/...' },
  { id: 'linkedin', name: 'لینکدین', brandColor: '#0A66C2', iconSvg: publicIcons.linkedinFilled || icons.link, placeholder: 'https://linkedin.com/in/...' },
  { id: 'youtube', name: 'یوتیوب', brandColor: '#FF0000', iconSvg: publicIcons.youtubeFilled || icons.link, placeholder: 'https://youtube.com/...' },
  { id: 'x', name: 'ایکس (توییتر)', brandColor: '#000000', iconSvg: publicIcons.twitterX || icons.link, placeholder: 'https://x.com/...' },
];

const SOCIAL_PLATFORMS = [
  { value: 'bale', label: 'بله' },
  { value: 'eitaa', label: 'ایتا' },
  { value: 'rubika', label: 'روبیکا' },
  { value: 'aparat', label: 'آپارات' },
  { value: 'instagram', label: 'اینستاگرام' },
  { value: 'telegram', label: 'تلگرام' },
  { value: 'whatsapp', label: 'واتس‌اپ' },
  { value: 'linkedin', label: 'لینکدین' },
  { value: 'youtube', label: 'یوتیوب' },
  { value: 'x', label: 'ایکس' },
  { value: 'facebook', label: 'فیس‌بوک' },
  { value: 'github', label: 'گیت‌هاب' },
  { value: 'website', label: 'وب‌سایت شخصی/لینک دلخواه' },
];

export function renderContactManagerView(): string {
  return `
    <div class="admin-view-header">
      <h1 class="admin-view-title">
        <span class="icon">${icons.phone}</span>
        مدیریت تماس و شبکه‌های اجتماعی
      </h1>
      <p class="admin-view-desc">
        در این بخش می‌توانید شماره تماس هدر، دکمه‌های شناور (واتس‌اپ، تماس) و شبکه‌های اجتماعی فوتر را کنترل کنید.
      </p>
    </div>
    
    <div class="admin-view-content" style="max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px;">
      
      <div class="editor-sidebar-card">
        <div class="card-header-action">
          <h3 style="margin: 0;">مدیریت تماس و دکمه‌های شناور</h3>
          <button type="button" class="btn btn-primary btn-sm" data-save-setting="contact">ذخیره تماس</button>
        </div>
        <div class="settings-form-grid">
          <div class="form-field">
            <label for="settings-phone-display">شماره تماس در هدر (نمایشی)</label>
            <input type="text" id="settings-phone-display" dir="ltr" placeholder="021-200200" />
          </div>
          <div class="form-field">
            <label for="settings-phone-tel">لینک شماره‌گیری</label>
            <input type="text" id="settings-phone-tel" dir="ltr" placeholder="tel:+9821200200" />
          </div>
        </div>
        <hr style="margin: var(--space-4) 0; border: none; border-top: 1px solid var(--border);" />
        
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <h4 style="margin: 0; font-size: 0.95rem;">دکمه‌های شناور سایت (واتس‌اپ، تماس و ...)</h4>
          <label class="settings-inline-toggle" style="margin: 0;"><input type="checkbox" id="theme-quick-actions-enabled" /> فعال باشند</label>
        </div>
        <div class="settings-form-grid">
          <div class="form-field">
            <label for="theme-quick-actions-style">نحوه نمایش در اسکرول</label>
            <select id="theme-quick-actions-style">
              <option value="floating">شناور در گوشه تصویر (توصیه‌شده)</option>
              <option value="fixed">ثابت در نوار پایین</option>
            </select>
          </div>
          <div class="form-field">
            <label for="theme-quick-actions-position">موقعیت دکمه‌ها</label>
            <select id="theme-quick-actions-position">
              <option value="right">گوشه راست (پیش‌فرض)</option>
              <option value="left">گوشه چپ</option>
            </select>
          </div>
        </div>
      </div>

      <div class="editor-sidebar-card">
        <div class="card-header-action">
          <h3 style="margin: 0;">شبکه‌های اجتماعی و پیام‌رسان‌ها</h3>
          <button type="button" class="btn btn-primary btn-sm" data-save-setting="social">ذخیره شبکه‌ها</button>
        </div>
        <p class="settings-panel-hint">
          آدرس کانال‌ها و شناسه‌های خود را وارد کنید تا در فوتر و هدر سایت نمایش داده شوند.
        </p>

        <div style="display: flex; gap: 16px; align-items: center; margin: 16px 0; background: var(--background); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border);">
          <label for="social-tab-color-hex" style="font-weight: 700; font-size: 0.88rem; color: var(--text);">رنگ یکپارچه آیکون‌ها (اختیاری):</label>
          <div class="theme-color-input-row" style="display: flex; gap: 8px; align-items: center;">
            <input type="color" id="social-tab-color-picker" style="width: 36px; height: 32px; border: none; cursor: pointer; border-radius: 6px; background: transparent;" />
            <input type="text" id="social-tab-color-hex" dir="ltr" maxlength="7" placeholder="مثال: #8b5cf6" style="max-width: 140px; font-family: monospace; font-size: 0.88rem;" />
          </div>
          <span style="font-size: 0.78rem; color: var(--muted);">(در صورت خالی بودن، رنگ رسمی هر اپلیکیشن اعمال می‌شود)</span>
        </div>

        <div class="social-core-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 14px; margin-top: 14px;">
          ${CORE_SOCIAL_LIST.map((item) => `
            <div class="social-network-card" data-core-social="${item.id}" style="background: var(--background); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 12px; display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="icon" style="width: 24px; height: 24px; color: ${item.brandColor}; display: inline-flex; align-items: center; justify-content: center;">${item.iconSvg}</span>
                  <span style="font-weight: 700; font-size: 0.88rem; color: var(--text);">${item.name}</span>
                </div>
                <label class="settings-inline-toggle" style="margin: 0;">
                  <input type="checkbox" id="social-core-toggle-${item.id}" data-social-core-toggle="${item.id}" />
                  فعال
                </label>
              </div>
              <div>
                <input type="text" id="social-core-url-${item.id}" data-social-core-url="${item.id}" dir="ltr" placeholder="${item.placeholder}" style="width: 100%; font-size: 0.84rem; padding: 6px 10px; border-radius: 6px; border: 1px solid var(--border);" />
              </div>
            </div>
          `).join('')}
        </div>
        
        <div style="margin-top: 24px; border-top: 1px solid var(--border); padding-top: 16px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <h4 style="margin: 0;">لینک‌های اضافی / سفارشی</h4>
            <button type="button" class="btn btn-secondary btn-sm" id="social-tab-custom-add-btn">
              <span class="icon">${icons.plusCircle}</span>
              افزودن لینک
            </button>
          </div>
          <div id="social-tab-custom-list" style="display: flex; flex-direction: column; gap: 10px;"></div>
        </div>
        
        <div style="margin-top: 24px; background: #0f172a; border-radius: 8px; padding: 16px;">
          <span style="color: #94a3b8; font-size: 0.82rem; margin-bottom: 8px; display: block;">پیش‌نمایش آیکون‌ها در فوتر:</span>
          <div id="social-tab-preview-icons" style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;"></div>
        </div>
      </div>
    </div>
  `;
}

interface CustomSocialItem {
  id: string;
  platform: string;
  label: string;
  url: string;
}

export async function initContactManagerView(): Promise<void> {
  const settings = await fetchSettings();
  let customSocialList: CustomSocialItem[] = [];
  
  const existingTheme = (settings.theme as Record<string, string | boolean> | undefined) ?? {};
  
  const phoneDisplayEl = document.getElementById('settings-phone-display') as HTMLInputElement | null;
  const phoneTelHrefEl = document.getElementById('settings-phone-tel') as HTMLInputElement | null;
  if (phoneDisplayEl && phoneTelHrefEl) {
    const contact = (settings.contact as ContactSettings | undefined) ?? { phoneDisplay: '', phoneTelHref: '', socialLinks: [] };
    phoneDisplayEl.value = contact.phoneDisplay || '';
    phoneTelHrefEl.value = contact.phoneTelHref || '';
  }

  const enabledEl = document.getElementById('theme-quick-actions-enabled') as HTMLInputElement | null;
  if (enabledEl) {
    enabledEl.checked = existingTheme.quickActionsEnabled !== false;
  }
  const styleEl = document.getElementById('theme-quick-actions-style') as HTMLSelectElement | null;
  if (styleEl) {
    styleEl.value = existingTheme.quickActionsStyle === 'fixed' ? 'fixed' : 'floating';
  }
  const posSelect = document.getElementById('theme-quick-actions-position') as HTMLSelectElement | null;
  if (posSelect) {
    posSelect.value = existingTheme.quickActionsPosition === 'left' ? 'left' : 'right';
  }

  function updateSocialTabPreview(): void {
    const previewContainer = document.getElementById('social-tab-preview-icons');
    if (!previewContainer) return;
    const iconColor = (document.getElementById('social-tab-color-hex') as HTMLInputElement)?.value.trim();
    
    const activeIcons: { name: string; brandColor: string; iconSvg: string }[] = [];
    
    CORE_SOCIAL_LIST.forEach((core) => {
      const toggle = document.querySelector<HTMLInputElement>(`[data-social-core-toggle="${core.id}"]`);
      const urlInput = document.querySelector<HTMLInputElement>(`[data-social-core-url="${core.id}"]`);
      if (toggle?.checked && urlInput?.value.trim()) {
        activeIcons.push({
          name: core.name,
          brandColor: iconColor && /^#[0-9a-fA-F]{6}$/.test(iconColor) ? iconColor : core.brandColor,
          iconSvg: core.iconSvg,
        });
      }
    });

    customSocialList.forEach((c) => {
      if (c.url.trim()) {
        const plat = SOCIAL_PLATFORMS.find((p) => p.value === c.platform);
        activeIcons.push({
          name: c.label || plat?.label || 'لینک',
          brandColor: iconColor && /^#[0-9a-fA-F]{6}$/.test(iconColor) ? iconColor : '#94a3b8',
          iconSvg: publicIcons.globeFilled || icons.link,
        });
      }
    });

    if (activeIcons.length === 0) {
      previewContainer.innerHTML = '<span style="color: #64748b; font-size: 0.78rem;">هنوز هیچ شبکه‌ای فعال نشده است.</span>';
      return;
    }

    previewContainer.innerHTML = activeIcons
      .map(
        (ic) => `
        <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; color: ${ic.brandColor}; border: 1px solid rgba(255,255,255,0.15);" title="${ic.name}">
          <span style="width: 18px; height: 18px; display: inline-flex; align-items: center; justify-content: center;">${ic.iconSvg}</span>
        </div>
      `
      )
      .join('');
  }

  function renderCustomSocialList(): void {
    const list = document.getElementById('social-tab-custom-list');
    if (!list) return;
    list.innerHTML = customSocialList
      .map(
        (item, idx) => `
        <div class="settings-form-grid" data-custom-social-index="${idx}" style="grid-template-columns: 140px 160px 1fr auto; align-items: end; gap: 8px;">
          <div class="form-field">
            <label>نوع پلتفرم</label>
            <select data-field="platform">
              ${SOCIAL_PLATFORMS.map((p) => `<option value="${p.value}" ${p.value === item.platform ? 'selected' : ''}>${p.label}</option>`).join('')}
            </select>
          </div>
          <div class="form-field">
            <label>عنوان / برچسب</label>
            <input type="text" data-field="label" value="${item.label}" placeholder="مثال: کانال دوم یا پیج پشتیبانی" />
          </div>
          <div class="form-field">
            <label>آدرس اینترنتی (URL)</label>
            <input type="text" dir="ltr" data-field="url" value="${item.url}" placeholder="https://..." />
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-remove-custom-social="${idx}" style="margin-bottom: 4px; color: var(--danger);">حذف</button>
        </div>
      `
      )
      .join('');
  }

  function readCustomSocialFromDom(): void {
    const rows = Array.from(document.querySelectorAll<HTMLElement>('[data-custom-social-index]'));
    customSocialList = rows.map((r, i) => ({
      id: customSocialList[i]?.id ?? `custom-soc-${crypto.randomUUID().slice(0, 8)}`,
      platform: r.querySelector<HTMLSelectElement>('[data-field="platform"]')!.value,
      label: r.querySelector<HTMLInputElement>('[data-field="label"]')!.value.trim(),
      url: r.querySelector<HTMLInputElement>('[data-field="url"]')!.value.trim(),
    }));
  }

  document.getElementById('social-tab-custom-add-btn')?.addEventListener('click', () => {
    readCustomSocialFromDom();
    customSocialList.push({ id: `custom-soc-${crypto.randomUUID().slice(0, 8)}`, platform: 'bale', label: '', url: '' });
    renderCustomSocialList();
    updateSocialTabPreview();
  });

  document.getElementById('social-tab-custom-list')?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-remove-custom-social]');
    if (!btn) return;
    readCustomSocialFromDom();
    customSocialList.splice(Number(btn.dataset.removeCustomSocial), 1);
    renderCustomSocialList();
    updateSocialTabPreview();
  });

  document.getElementById('social-tab-color-picker')?.addEventListener('input', (e) => {
    (document.getElementById('social-tab-color-hex') as HTMLInputElement).value = (e.currentTarget as HTMLInputElement).value;
    updateSocialTabPreview();
  });
  document.getElementById('social-tab-color-hex')?.addEventListener('input', updateSocialTabPreview);

  document.querySelectorAll<HTMLInputElement>('[data-social-core-toggle]').forEach((toggle) => {
    toggle.addEventListener('change', updateSocialTabPreview);
  });
  document.querySelectorAll<HTMLInputElement>('[data-social-core-url]').forEach((input) => {
    input.addEventListener('input', updateSocialTabPreview);
  });

  function renderSocialTab(): void {
    const contact = (settings.contact as ContactSettings | undefined) ?? { phoneDisplay: '', phoneTelHref: '', socialLinks: [] };
    const savedLinks = (settings.social_links as SocialLinkSetting[] | undefined) ?? contact.socialLinks ?? [];

    const iconColorHex = document.getElementById('social-tab-color-hex') as HTMLInputElement | null;
    const iconColorPicker = document.getElementById('social-tab-color-picker') as HTMLInputElement | null;
    if (iconColorHex && contact.socialIconColor) {
      iconColorHex.value = contact.socialIconColor;
      if (iconColorPicker && /^#[0-9a-fA-F]{6}$/.test(contact.socialIconColor)) {
        iconColorPicker.value = contact.socialIconColor;
      }
    }

    const customItems: CustomSocialItem[] = [];
    savedLinks.forEach((link) => {
      const core = CORE_SOCIAL_LIST.find((c) => c.id === link.platform || c.id === link.id);
      if (core) {
        const toggle = document.getElementById(`social-core-toggle-${core.id}`) as HTMLInputElement | null;
        const urlInput = document.getElementById(`social-core-url-${core.id}`) as HTMLInputElement | null;
        if (toggle) toggle.checked = Boolean(link.url);
        if (urlInput) urlInput.value = link.url || '';
      } else {
        customItems.push({
          id: link.id,
          platform: link.platform,
          label: link.label,
          url: link.url,
        });
      }
    });

    customSocialList = customItems;
    renderCustomSocialList();
    updateSocialTabPreview();
  }

  renderSocialTab();

  document.querySelector<HTMLButtonElement>('[data-save-setting="contact"]')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget as HTMLButtonElement;
    await handleSaveButton(btn, async () => {
      // Re-read existing settings from backend just to be safe
      const latestSettings = await fetchSettings();
      const currentContact = (latestSettings.contact as ContactSettings | undefined) ?? { phoneDisplay: '', phoneTelHref: '', socialLinks: [] };
      const currentTheme = (latestSettings.theme as Record<string, string | boolean> | undefined) ?? {};

      const phoneDisplay = (document.getElementById('settings-phone-display') as HTMLInputElement).value.trim();
      const phoneTelHref = (document.getElementById('settings-phone-tel') as HTMLInputElement).value.trim();
      
      const quickActionsStyle = (document.getElementById('theme-quick-actions-style') as HTMLSelectElement).value;
      const quickActionsEnabled = (document.getElementById('theme-quick-actions-enabled') as HTMLInputElement)?.checked ?? true;
      const quickActionsPosition = (document.getElementById('theme-quick-actions-position') as HTMLSelectElement)?.value ?? 'right';

      currentContact.phoneDisplay = phoneDisplay;
      currentContact.phoneTelHref = phoneTelHref;
      await updateSetting('contact', currentContact);
      
      currentTheme.quickActionsStyle = quickActionsStyle;
      currentTheme.quickActionsEnabled = quickActionsEnabled;
      currentTheme.quickActionsPosition = quickActionsPosition;
      await updateSetting('theme', currentTheme);
    });
  });

  document.querySelector<HTMLButtonElement>('[data-save-setting="social"]')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget as HTMLButtonElement;
    await handleSaveButton(btn, async () => {
      readCustomSocialFromDom();
      const socialColor = (document.getElementById('social-tab-color-hex') as HTMLInputElement)?.value.trim() || undefined;

      const linksToSave: SocialLinkSetting[] = [];
      CORE_SOCIAL_LIST.forEach((core) => {
        const toggle = document.querySelector<HTMLInputElement>(`[data-social-core-toggle="${core.id}"]`);
        const urlInput = document.querySelector<HTMLInputElement>(`[data-social-core-url="${core.id}"]`);
        if (toggle?.checked && urlInput?.value.trim()) {
          linksToSave.push({
            id: core.id,
            platform: core.id,
            label: core.name,
            url: urlInput.value.trim(),
          });
        }
      });

      customSocialList.forEach((c) => {
        if (c.url.trim()) {
          linksToSave.push({
            id: c.id,
            platform: c.platform,
            label: c.label,
            url: c.url.trim(),
          });
        }
      });

      await updateSetting('social_links', linksToSave);

      const latestSettings = await fetchSettings();
      const existingContact = (latestSettings.contact as ContactSettings | undefined) ?? { phoneDisplay: '', phoneTelHref: '', socialLinks: [] };
      const updatedContact = {
        ...existingContact,
        socialIconColor: socialColor,
        socialLinks: linksToSave,
      };
      await updateSetting('contact', updatedContact);
    });
  });
}

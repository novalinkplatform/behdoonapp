import { icons } from '../components/icons.ts';
import { fetchSettings, updateSetting, updateStaff } from '../utils/api.ts';
import type { StaffInfo } from '../utils/auth.ts';
import { provinces } from '../data/provinces.ts';


interface WizardVehicleType {
  id: string;
  label: string;
  labelEn: string;
  icon: string;
  basePrice: number;
  perKmRate: number;
  floorCostExempt: boolean;
  active: boolean;
  sortOrder: number;
}

const FALLBACK_VEHICLE_TYPES: WizardVehicleType[] = [
  { id: 'motorcycle', label: 'موتور', labelEn: 'Motorcycle', icon: 'motorcycle', basePrice: 180000, perKmRate: 6000, floorCostExempt: true, active: true, sortOrder: 1 },
  { id: 'pickup', label: 'وانت', labelEn: 'Pickup', icon: 'pickup', basePrice: 950000, perKmRate: 26000, floorCostExempt: false, active: true, sortOrder: 2 },
  { id: 'van', label: 'نیسان', labelEn: 'Van', icon: 'van', basePrice: 1300000, perKmRate: 32000, floorCostExempt: false, active: true, sortOrder: 3 },
  { id: 'light-truck', label: 'خاور', labelEn: 'Light truck', icon: 'lightTruck', basePrice: 2100000, perKmRate: 55000, floorCostExempt: false, active: true, sortOrder: 4 },
  { id: 'truck', label: 'کامیون', labelEn: 'Truck', icon: 'truck', basePrice: 3000000, perKmRate: 90000, floorCostExempt: false, active: true, sortOrder: 5 },
  { id: 'trailer', label: 'تریلی', labelEn: 'Trailer', icon: 'trailer', basePrice: 4500000, perKmRate: 140000, floorCostExempt: false, active: true, sortOrder: 6 },
];

const STEP_COUNT = 8;

export function needsSetupWizard(settings: Record<string, unknown>): boolean {
  const explicit = settings.setup_completed;
  if (typeof explicit === 'boolean') return !explicit;
  const siteName = settings.site_name as { fa?: string } | undefined;
  return !siteName?.fa;
}

export function formatPhoneTelHref(raw: string): string {
  if (!raw) return '';
  const normalized = raw
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));
  let clean = normalized.replace(/[^\d+]/g, '');
  if (!clean) return '';
  if (clean.startsWith('00')) {
    clean = '+' + clean.slice(2);
  } else if (clean.startsWith('0')) {
    clean = '+98' + clean.slice(1);
  } else if (!clean.startsWith('+')) {
    clean = clean.startsWith('98') ? '+' + clean : '+98' + clean;
  }
  return `tel:${clean}`;
}

export function renderSetupWizardView(): string {
  return `
    <div class="setup-wizard-screen">
      <div class="setup-wizard-card">
        <div class="setup-wizard-progress">
          <div class="setup-wizard-progress-bar"><div class="setup-wizard-progress-fill" id="setup-progress-fill"></div></div>
          <span class="setup-wizard-progress-text" id="setup-progress-text"></span>
        </div>

        <div data-setup-step="0" class="setup-wizard-step setup-wizard-welcome">
          <span class="icon setup-wizard-hero-icon">${icons.settings}</span>
          <h2>راه‌اندازی اولیه‌ی سایت</h2>
          <p>بهدون را در چند قدم کوتاه مطابق سلیقه‌ی خودتان شخصی‌سازی کنید. همه‌ی این اطلاعات را بعداً هم از منوی «تنظیمات» می‌توانید تغییر دهید.</p>
        </div>

        <div data-setup-step="1" class="setup-wizard-step" hidden>
          <h2>نام سامانه</h2>
          <div class="form-field">
            <label for="setup-site-name-fa">نام فارسی (نمایش در هدر و متن‌ها)</label>
            <input type="text" id="setup-site-name-fa" placeholder="مثلاً بهدون" />
          </div>
          <div class="form-field">
            <label for="setup-site-name-en">نام انگلیسی (اختیاری)</label>
            <input type="text" id="setup-site-name-en" dir="ltr" placeholder="Behdoon" />
          </div>
          <p class="error-text" id="setup-site-name-error" hidden>نام فارسی سایت را وارد کنید.</p>
        </div>

        <div data-setup-step="2" class="setup-wizard-step" hidden>
          <h2>لوگوی سایت</h2>
          <div class="form-field">
            <label for="setup-logo-url">آدرس تصویر لوگو (اختیاری)</label>
            <input type="text" id="setup-logo-url" dir="ltr" placeholder="https://.../logo.png" />
          </div>
          <p class="setup-wizard-hint">این را می‌توانید بعداً از «تنظیمات سایت» با آپلود مستقیم هم تغییر دهید.</p>
        </div>

        <div data-setup-step="3" class="setup-wizard-step" hidden>
          <h2>اطلاعات تماس و شبکه‌های اجتماعی</h2>
          <div class="form-field">
            <label for="setup-phone-display">شماره تماس پشتیبانی</label>
            <input type="text" id="setup-phone-display" dir="ltr" placeholder="021-200200 یا 0912..." />
          </div>
          <p class="setup-wizard-hint">لینک شماره‌گیری مستقیم (جهت تماس با کلیک مشتریان) به‌صورت خودکار از روی همین شماره ساخته می‌شود.</p>

          <div class="settings-form-grid" style="margin-top: 16px; gap: 12px;">
            <div class="form-field">
              <label for="setup-whatsapp">واتس‌اپ (شماره یا لینک)</label>
              <input type="text" id="setup-whatsapp" dir="ltr" placeholder="0912... یا https://wa.me/..." />
            </div>
            <div class="form-field">
              <label for="setup-telegram">تلگرام (آیدی یا لینک)</label>
              <input type="text" id="setup-telegram" dir="ltr" placeholder="channel_id یا https://t.me/..." />
            </div>
          </div>

          <div class="settings-form-grid" style="margin-top: 12px; gap: 12px;">
            <div class="form-field">
              <label for="setup-instagram">اینستاگرام (آیدی یا لینک)</label>
              <input type="text" id="setup-instagram" dir="ltr" placeholder="page_id یا https://instagram.com/..." />
            </div>
            <div class="form-field">
              <label for="setup-email">ایمیل پشتیبانی</label>
              <input type="email" id="setup-email" dir="ltr" placeholder="info@example.com" />
            </div>
          </div>
          <p class="setup-wizard-hint">وارد کردن شبکه‌های اجتماعی اختیاری است؛ مواردی که پر کنید در فوتر و راه‌های ارتباطی سایت قرار می‌گیرند.</p>
        </div>

        <div data-setup-step="4" class="setup-wizard-step" hidden>
          <h2>شهر مبدأ خدمات</h2>
          <p class="setup-wizard-hint">شهری که خدمات شما از آن‌جا شروع می‌شود — این شهر در فرم ثبت درخواست مشتریان به‌صورت پیش‌فرض انتخاب می‌شود.</p>
          <div class="settings-form-grid">
            <div class="form-field">
              <label for="setup-origin-province">استان</label>
              <select id="setup-origin-province">
                <option value="">انتخاب استان...</option>
                ${provinces.map((p) => `<option value="${p.name}">${p.name}</option>`).join('')}
              </select>
            </div>
            <div class="form-field">
              <label for="setup-origin-city">شهرستان / شهر</label>
              <select id="setup-origin-city" disabled>
                <option value="">ابتدا استان را انتخاب کنید...</option>
              </select>
            </div>
          </div>
          <p class="setup-wizard-hint">این مرحله اختیاری است — اگر انتخاب نکنید، مشتریان از بین همه‌ی شهرهای کشور انتخاب می‌کنند.</p>
        </div>

        <div data-setup-step="5" class="setup-wizard-step" hidden>
          <h2>تعرفه پایه‌ی خدمات و تخصص‌ها</h2>
          <p class="setup-wizard-hint">این مبالغ پایه هستند و بعداً نیز در بخش تنظیمات و تعرفه‌ها قابل ویرایش می‌باشند.</p>
          <div id="setup-vehicle-list" class="setup-wizard-vehicle-list"></div>
        </div>

        <div data-setup-step="6" class="setup-wizard-step" hidden>
          <h2>رمز عبور حساب مدیر</h2>
          <p class="setup-wizard-hint">برای امنیت بیشتر، رمز پیش‌فرض را همین حالا عوض کنید (اختیاری).</p>
          <div class="form-field">
            <label for="setup-new-password">رمز عبور جدید</label>
            <input type="password" id="setup-new-password" autocomplete="new-password" />
          </div>
          <div class="form-field">
            <label for="setup-confirm-password">تکرار رمز عبور</label>
            <input type="password" id="setup-confirm-password" autocomplete="new-password" />
          </div>
          <p class="error-text" id="setup-password-error" hidden></p>
        </div>

        <div data-setup-step="7" class="setup-wizard-step setup-wizard-welcome" hidden>
          <span class="icon setup-wizard-hero-icon setup-wizard-done-icon">${icons.checkCircle}</span>
          <h2>آماده‌اید!</h2>
          <p>سایت شما تنظیم شد. می‌توانید همین حالا کار را شروع کنید و هر زمان خواستید این اطلاعات را از «تنظیمات سایت» تغییر دهید.</p>
        </div>

        <p class="error-text" id="setup-general-error" hidden></p>

        <div class="setup-wizard-footer">
          <button type="button" class="setup-wizard-skip-link" id="setup-skip-all">بعداً، رفتن به پنل</button>
          <div class="setup-wizard-nav-buttons">
            <button type="button" class="btn btn-secondary" id="setup-back" hidden>قبلی</button>
            <button type="button" class="btn btn-primary" id="setup-next">بعدی</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initSetupWizardView(staff: StaffInfo, onDone: (skippedOnly: boolean) => void): void {
  const card = document.querySelector('.setup-wizard-card');
  const progressFill = document.getElementById('setup-progress-fill');
  const progressText = document.getElementById('setup-progress-text');
  const backBtn = document.getElementById('setup-back') as HTMLButtonElement | null;
  const nextBtn = document.getElementById('setup-next') as HTMLButtonElement | null;
  const skipAllBtn = document.getElementById('setup-skip-all') as HTMLButtonElement | null;
  const generalError = document.getElementById('setup-general-error');
  const vehicleListEl = document.getElementById('setup-vehicle-list');

  if (!card || !progressFill || !progressText || !backBtn || !nextBtn || !skipAllBtn || !generalError || !vehicleListEl) return;

  let currentStep = 0;
  let settings: Record<string, unknown> = {};
  let vehicleTypes: WizardVehicleType[] = FALLBACK_VEHICLE_TYPES;

  function renderVehicleList(): void {
    vehicleListEl!.innerHTML = vehicleTypes
      .map(
        (v, i) => `
        <div class="setup-wizard-vehicle-row">
          <span class="setup-wizard-vehicle-label">
            ${icons[v.icon as keyof typeof icons] ? `<span class="icon">${icons[v.icon as keyof typeof icons]}</span>` : ''}
            <span>${v.label}</span>
          </span>
          <div class="form-field">
            <label>قیمت پایه (تومان)</label>
            <input type="number" min="0" step="1000" data-vehicle-base-price="${i}" value="${v.basePrice}" />
          </div>
          <div class="form-field">
            <label>هر کیلومتر (تومان)</label>
            <input type="number" min="0" step="1000" data-vehicle-per-km="${i}" value="${v.perKmRate}" />
          </div>
        </div>
      `,
      )
      .join('');
  }

  function updateStepUI(): void {
    document.querySelectorAll<HTMLElement>('[data-setup-step]').forEach((el) => {
      el.hidden = el.dataset.setupStep !== String(currentStep);
    });
    progressFill!.style.width = `${((currentStep + 1) / STEP_COUNT) * 100}%`;
    progressText!.textContent = `مرحله ${currentStep + 1} از ${STEP_COUNT}`;
    backBtn!.hidden = currentStep === 0;
    nextBtn!.textContent = currentStep === STEP_COUNT - 1 ? 'شروع کار با پنل' : currentStep === 0 ? 'شروع' : 'بعدی';
    generalError!.hidden = true;
  }

  async function saveCurrentStep(): Promise<boolean> {
    generalError!.hidden = true;
    try {
      if (currentStep === 1) {
        const fa = (document.getElementById('setup-site-name-fa') as HTMLInputElement).value.trim();
        const en = (document.getElementById('setup-site-name-en') as HTMLInputElement).value.trim();
        const errorEl = document.getElementById('setup-site-name-error')!;
        if (!fa) {
          errorEl.hidden = false;
          return false;
        }
        errorEl.hidden = true;
        await updateSetting('site_name', { fa, en });
      } else if (currentStep === 2) {
        const logoUrl = (document.getElementById('setup-logo-url') as HTMLInputElement).value.trim();
        if (logoUrl) {
          const branding = (settings.branding as { logoUrl?: string; faviconUrl?: string } | undefined) ?? {};
          await updateSetting('branding', { ...branding, logoUrl });
        }
      } else if (currentStep === 3) {
        const phoneDisplay = (document.getElementById('setup-phone-display') as HTMLInputElement).value.trim();
        const whatsapp = (document.getElementById('setup-whatsapp') as HTMLInputElement).value.trim();
        const telegram = (document.getElementById('setup-telegram') as HTMLInputElement).value.trim();
        const instagram = (document.getElementById('setup-instagram') as HTMLInputElement).value.trim();
        const email = (document.getElementById('setup-email') as HTMLInputElement).value.trim();

        const contact = (settings.contact as Record<string, unknown> | undefined) ?? {};
        const phoneTelHref = phoneDisplay ? formatPhoneTelHref(phoneDisplay) : ((contact.phoneTelHref as string | undefined) ?? '');

        type SocialEntry = { id: string; platform: string; label: string; url: string; customIconUrl?: string };
        const existingSocial: SocialEntry[] = Array.isArray(contact.socialLinks) ? [...(contact.socialLinks as SocialEntry[])] : [];

        function upsertSocial(platform: string, label: string, rawVal: string, urlFormatter: (val: string) => string) {
          if (!rawVal) return;
          const idx = existingSocial.findIndex((s) => s.platform === platform);
          const url = urlFormatter(rawVal);
          if (idx >= 0) {
            existingSocial[idx] = { ...existingSocial[idx], label, url };
          } else {
            existingSocial.push({ id: `social-${platform}`, platform, label, url });
          }
        }

        if (whatsapp) {
          upsertSocial('whatsapp', 'واتس‌اپ', whatsapp, (v) => {
            if (v.startsWith('http')) return v;
            const digits = v.replace(/\D/g, '');
            const intl = digits.startsWith('0') ? '98' + digits.slice(1) : digits.startsWith('98') ? digits : '98' + digits;
            return `https://wa.me/${intl}`;
          });
        }
        if (telegram) {
          upsertSocial('telegram', 'تلگرام', telegram, (v) => {
            if (v.startsWith('http')) return v;
            const handle = v.replace(/^@/, '');
            return `https://t.me/${handle}`;
          });
        }
        if (instagram) {
          upsertSocial('instagram', 'اینستاگرام', instagram, (v) => {
            if (v.startsWith('http')) return v;
            const handle = v.replace(/^@/, '');
            return `https://instagram.com/${handle}`;
          });
        }
        if (email) {
          upsertSocial('mail', 'ایمیل', email, (v) => (v.startsWith('mailto:') ? v : `mailto:${v}`));
        }

        const newContact = {
          ...contact,
          phoneDisplay: phoneDisplay || (contact.phoneDisplay as string) || '',
          phoneTelHref,
          socialLinks: existingSocial,
        };
        await updateSetting('contact', newContact);
        settings.contact = newContact;
      } else if (currentStep === 4) {
        const province = (document.getElementById('setup-origin-province') as HTMLSelectElement).value.trim();
        const city = (document.getElementById('setup-origin-city') as HTMLSelectElement).value.trim();
        if (city && province) {
          const cities = (settings.service_cities as Record<string, unknown> | undefined) ?? {};
          await updateSetting('service_cities', {
            coverageMode: 'all',
            destinationCities: [],
            internationalShippingEnabled: false,
            ...cities,
            originCity: { city, cityEn: '', province, provinceEn: '' },
          });
        }
      } else if (currentStep === 5) {
        const updated = vehicleTypes.map((v, i) => ({
          ...v,
          basePrice: Number(vehicleListEl!.querySelector<HTMLInputElement>(`[data-vehicle-base-price="${i}"]`)?.value) || v.basePrice,
          perKmRate: Number(vehicleListEl!.querySelector<HTMLInputElement>(`[data-vehicle-per-km="${i}"]`)?.value) || v.perKmRate,
        }));
        await updateSetting('vehicle_types', updated);
      } else if (currentStep === 6) {
        const pw = (document.getElementById('setup-new-password') as HTMLInputElement).value;
        const confirm = (document.getElementById('setup-confirm-password') as HTMLInputElement).value;
        const errorEl = document.getElementById('setup-password-error')!;
        if (pw || confirm) {
          if (pw.length < 6) {
            errorEl.hidden = false;
            errorEl.textContent = 'رمز عبور باید حداقل ۶ کاراکتر باشد.';
            return false;
          }
          if (pw !== confirm) {
            errorEl.hidden = false;
            errorEl.textContent = 'رمز عبور و تکرار آن یکسان نیستند.';
            return false;
          }
          errorEl.hidden = true;
          await updateStaff(staff.id, { password: pw });
        }
      } else if (currentStep === 7) {
        await updateSetting('setup_completed', true);
      }
      return true;
    } catch (err) {
      generalError!.hidden = false;
      generalError!.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
      return false;
    }
  }

  nextBtn.addEventListener('click', async () => {
    nextBtn!.disabled = true;
    const ok = await saveCurrentStep();
    nextBtn!.disabled = false;
    if (!ok) return;

    if (currentStep === STEP_COUNT - 1) {
      onDone(false);
      return;
    }
    currentStep += 1;
    updateStepUI();
  });

  backBtn.addEventListener('click', () => {
    if (currentStep === 0) return;
    currentStep -= 1;
    updateStepUI();
  });

  skipAllBtn.addEventListener('click', async () => {
    skipAllBtn!.disabled = true;
    try {
      await updateSetting('setup_completed', true);
    } catch {
      // اگر ذخیره‌ی این پرچم شکست بخورد هم اجازه می‌دهیم کاربر وارد پنل شود؛
      // فقط ویزارد ممکن است دفعه‌ی بعد دوباره نمایش داده شود.
    }
    onDone(true);
  });

  const provinceSelect = document.getElementById('setup-origin-province') as HTMLSelectElement | null;
  const citySelect = document.getElementById('setup-origin-city') as HTMLSelectElement | null;

  function populateCities(provName: string, selectedCity = ''): void {
    if (!citySelect) return;
    const found = provinces.find((p) => p.name === provName);
    if (!found || !found.cities.length) {
      citySelect.innerHTML = '<option value="">ابتدا استان را انتخاب کنید...</option>';
      citySelect.disabled = true;
      return;
    }
    citySelect.disabled = false;
    citySelect.innerHTML =
      '<option value="">انتخاب شهرستان / شهر...</option>' +
      found.cities.map((c: string) => `<option value="${c}" ${c === selectedCity ? 'selected' : ''}>${c}</option>`).join('');
  }

  provinceSelect?.addEventListener('change', () => {
    populateCities(provinceSelect.value);
  });

  fetchSettings()
    .then((fetched) => {
      settings = fetched;
      const siteName = (settings.site_name as { fa?: string; en?: string } | undefined) ?? {};
      (document.getElementById('setup-site-name-fa') as HTMLInputElement).value = siteName.fa ?? '';
      (document.getElementById('setup-site-name-en') as HTMLInputElement).value = siteName.en ?? '';

      const branding = (settings.branding as { logoUrl?: string } | undefined) ?? {};
      (document.getElementById('setup-logo-url') as HTMLInputElement).value = branding.logoUrl ?? '';

      const contact = (settings.contact as {
        phoneDisplay?: string;
        phoneTelHref?: string;
        socialLinks?: Array<{ platform: string; url: string }>;
      } | undefined) ?? {};
      (document.getElementById('setup-phone-display') as HTMLInputElement).value = contact.phoneDisplay ?? '';

      const sLinks = contact.socialLinks ?? [];
      const wa = sLinks.find((s) => s.platform === 'whatsapp')?.url ?? '';
      const tg = sLinks.find((s) => s.platform === 'telegram')?.url ?? '';
      const ig = sLinks.find((s) => s.platform === 'instagram')?.url ?? '';
      const mail = sLinks.find((s) => s.platform === 'mail')?.url ?? '';

      (document.getElementById('setup-whatsapp') as HTMLInputElement).value = wa;
      (document.getElementById('setup-telegram') as HTMLInputElement).value = tg;
      (document.getElementById('setup-instagram') as HTMLInputElement).value = ig;
      (document.getElementById('setup-email') as HTMLInputElement).value = mail.replace(/^mailto:/, '');

      const cities = settings.service_cities as { originCity?: { city?: string; province?: string } } | undefined;
      const initialProv = cities?.originCity?.province ?? '';
      const initialCity = cities?.originCity?.city ?? '';
      if (provinceSelect && initialProv) {
        provinceSelect.value = initialProv;
        populateCities(initialProv, initialCity);
      }

      const existingVehicles = settings.vehicle_types as WizardVehicleType[] | undefined;
      vehicleTypes = existingVehicles && existingVehicles.length ? existingVehicles : FALLBACK_VEHICLE_TYPES;
      renderVehicleList();
    })
    .catch(() => {
      renderVehicleList();
    });

  updateStepUI();
}

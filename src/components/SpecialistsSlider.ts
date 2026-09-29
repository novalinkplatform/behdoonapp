import { icons } from './icons.ts';
import { pick } from '../i18n/lang.ts';
import { toPersianDigits } from '../utils/jalali.ts';
import { API_BASE_URL } from '../data/config.ts';

export interface SpecialistCardData {
  id: number | string;
  fullName: string;
  specialty: string;
  yearsExperience: number | string;
  rating: number | string;
  totalJobs?: number | string;
  avatarUrl?: string | null;
  bio?: string | null;
  isOnline?: boolean;
}

const DEFAULT_SPECIALISTS: SpecialistCardData[] = [];

function getSpecialistAvatarHtml(s: SpecialistCardData): string {
  if (s.avatarUrl) {
    return `<img src="${s.avatarUrl}" alt="${s.fullName}" class="specialist-avatar-img" />`;
  }
  const initials = s.fullName.trim().split(' ').map((p) => p[0]).slice(0, 2).join('');
  return `<span class="specialist-avatar-fallback">${initials || 'استاد'}</span>`;
}

export function renderSpecialistCard(s: SpecialistCardData): string {
  const expNum = Number(s.yearsExperience) || 5;
  const ratingNum = Number(s.rating) || 4.9;
  const jobsNum = Number(s.totalJobs) || 200;

  return `
    <div class="specialist-card" data-specialist-id="${s.id}">
      <div class="specialist-card-top">
        <div class="specialist-avatar-container">
          <div class="specialist-avatar-frame">
            ${getSpecialistAvatarHtml(s)}
            ${s.isOnline !== false ? '<span class="specialist-online-dot" title="آنلاین و آماده اعزام فوری"></span>' : ''}
          </div>
          <span class="specialist-verified-badge" title="${pick('احراز صلاحیت و عدم سوءپیشینه تایید شده', 'Verified Specialist')}">
            <span class="icon">${icons.checkCircle}</span>
          </span>
        </div>

        <div class="specialist-info-head">
          <h3 class="specialist-name">${s.fullName}</h3>
          <span class="specialist-role-tag">${s.specialty || pick('متخصص فنی بهدون', 'Technical Specialist')}</span>
        </div>
      </div>

      <div class="specialist-stats-row">
        <div class="specialist-stat-pill">
          <span class="icon">${icons.badge || icons.shield}</span>
          <span>${toPersianDigits(expNum)} ${pick('سال سابقه تخصصی', 'years exp')}</span>
        </div>
        <div class="specialist-rating-pill">
          <span class="star">★</span>
          <strong>${toPersianDigits(ratingNum.toFixed(1))}</strong>
          <span class="jobs-count">(${toPersianDigits(jobsNum)}+ ${pick('خدمت', 'jobs')})</span>
        </div>
      </div>

      ${
        s.bio
          ? `<p class="specialist-bio-text">${s.bio}</p>`
          : `<p class="specialist-bio-text">${pick('متخصص احراز صلاحیت‌شده ناوگان بهدون با تاییدیه مهارت فنی‌وحرفه‌ای و گارانتی کتبی کیفیت خدمات.', 'Verified technician with certified background.')}</p>`
      }

      <div class="specialist-card-footer">
        <div class="specialist-trust-chips">
          <span class="trust-mini-chip">✓ ${pick('عدم سوءپیشینه', 'Police Clear')}</span>
          <span class="trust-mini-chip">✓ ${pick('کارت مهارت', 'Certified')}</span>
          <span class="trust-mini-chip">✓ ${pick('پوشش بیمه', 'Insured')}</span>
        </div>
        <a href="/#request" class="specialist-request-btn request-wizard-open-trigger">
          <span>${pick('درخواست اعزام این متخصص', 'Request This Specialist')}</span>
          <span class="icon">${icons.chevronLeft}</span>
        </a>
      </div>
    </div>
  `;
}

export function renderSpecialistsSlider(specialists: SpecialistCardData[] = DEFAULT_SPECIALISTS): string {
  const list = specialists.length ? specialists : DEFAULT_SPECIALISTS;
  const isHidden = list.length === 0;

  return `
    <section class="specialists-section" id="specialists-showcase" aria-label="${pick('متخصصان برتر بهدون', 'Top Specialists')}" ${isHidden ? 'style="display: none;"' : ''}>
      <div class="container">
        <div class="specialists-section-head">
          <div class="specialists-titles">
            <span class="specialists-sub-badge">
              <span class="icon">${icons.shield}</span>
              <span>${pick('ناوگان کارشناسان منتخب بهدون در تهران', 'Tehran Master Technicians Network')}</span>
            </span>
            <h2 class="specialists-title">
              ${pick('متخصصان برتر و استادکاران احراز هویت شده بهدون', 'Top Certified Specialists & Master Craftsmen')}
            </h2>
            <p class="specialists-subtitle">
              ${pick(
                'مشاهده سوابق کاری، امتیاز کیفی و تخصص استادکاران اعزامی به کلیه مناطق ۲۲‌گانه شهر تهران',
                'View verified credentials, customer ratings, and expertise of dispatched technicians across Tehran'
              )}
            </p>
          </div>

          <div class="specialists-slider-controls">
            <button type="button" class="slider-nav-btn slider-nav-prev" id="specialists-prev-btn" aria-label="${pick('متخصص قبلی', 'Previous')}">
              <span class="icon">${icons.chevronRight}</span>
            </button>
            <button type="button" class="slider-nav-btn slider-nav-next" id="specialists-next-btn" aria-label="${pick('متخصص بعدی', 'Next')}">
              <span class="icon">${icons.chevronLeft}</span>
            </button>
          </div>
        </div>

        <div class="specialists-track-wrapper">
          <div class="specialists-track" id="specialists-track">
            ${list.map(renderSpecialistCard).join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initSpecialistsSlider(): void {
  const showcase = document.getElementById('specialists-showcase');
  const track = document.getElementById('specialists-track');
  const prevBtn = document.getElementById('specialists-prev-btn');
  const nextBtn = document.getElementById('specialists-next-btn');

  if (!track || !prevBtn || !nextBtn) return;

  const scrollAmount = 340;

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  // Load dynamically from public API only if real specialists exist
  fetch(`${API_BASE_URL}/api/specialists`)
    .then((r) => r.json())
    .then((data: any) => {
      if (Array.isArray(data?.specialists) && data.specialists.length > 0) {
        if (showcase) showcase.style.display = '';
        track.innerHTML = data.specialists.map((s: any) => renderSpecialistCard({
          id: s.id,
          fullName: s.fullName || s.full_name || 'استادکار بهدون',
          specialty: s.specialty || s.roleLabel || s.role_label || 'متخصص فنی ساختمان',
          yearsExperience: s.yearsExperience || s.years_experience || 5,
          rating: s.rating || s.performanceScore || s.performance_score || 4.9,
          totalJobs: s.totalJobs || s.total_jobs || 150,
          avatarUrl: s.avatarUrl || s.avatar_url || null,
          bio: s.bio || s.notes || null,
          isOnline: s.isOnline ?? true,
        })).join('');
      } else {
        if (showcase) showcase.style.display = 'none';
      }
    })
    .catch(() => {
      if (showcase) showcase.style.display = 'none';
    });
}

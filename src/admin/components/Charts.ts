import { toPersianDigits } from '../utils/format.ts';

export interface BarItem {
  label: string;
  value: number;
}

export function renderBarChart(items: BarItem[]): string {
  if (items.length === 0) return '<p class="chart-empty">داده‌ای موجود نیست.</p>';
  const max = Math.max(...items.map((i) => i.value), 1);
  return `
    <div class="bar-chart">
      ${items
        .map(
          (item) => `
            <div class="bar-chart-row">
              <span class="bar-chart-label">${item.label}</span>
              <div class="bar-chart-track">
                <div class="bar-chart-fill" style="width:${(item.value / max) * 100}%"></div>
              </div>
              <span class="bar-chart-value">${toPersianDigits(item.value)}</span>
            </div>
          `,
        )
        .join('')}
    </div>
  `;
}

export interface LinePoint {
  label: string;
  value: number;
}

export function renderLineChart(points: LinePoint[]): string {
  if (points.length === 0) return '<p class="chart-empty">داده‌ای موجود نیست.</p>';

  const width = 640;
  const height = 200;
  const padding = 32;
  const max = Math.max(...points.map((p) => p.value), 1);
  const stepX = points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0;

  const coords = points.map((p, i) => ({
    x: padding + i * stepX,
    y: height - padding - (p.value / max) * (height - padding * 2),
  }));

  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x},${c.y}`).join(' ');
  const areaPath = `${linePath} L${coords[coords.length - 1].x},${height - padding} L${coords[0].x},${height - padding} Z`;
  const dots = coords
    .map((c) => `<circle cx="${c.x}" cy="${c.y}" r="3.5" class="line-chart-dot" />`)
    .join('');

  const firstLabel = points[0]?.label ?? '';
  const lastLabel = points[points.length - 1]?.label ?? '';

  return `
    <svg viewBox="0 0 ${width} ${height}" class="line-chart-svg" role="img" aria-label="روند تعداد درخواست‌ها">
      <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" class="line-chart-baseline" />
      <path d="${areaPath}" class="line-chart-area" />
      <path d="${linePath}" class="line-chart-line" />
      ${dots}
      <text x="${padding}" y="${height - 8}" class="line-chart-axis-label">${firstLabel}</text>
      <text x="${width - padding}" y="${height - 8}" class="line-chart-axis-label" text-anchor="end">${lastLabel}</text>
    </svg>
  `;
}

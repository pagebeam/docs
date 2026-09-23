/*
 * The two logo candidates, drawn on a 64 unit square. Each takes a paint map
 * so the same geometry renders with CSS variables inline (theme aware) or
 * with literal colours in exported files.
 *
 * Roles: paper (the page), line (text lines), brand (margin bar, beam, rays),
 * cut (the ground behind the mark, used to separate the beam from the page).
 */

export const cssPaint = {
  paper: 'var(--mark-paper)',
  line: 'var(--mark-line)',
  brand: 'var(--brand)',
  cut: 'var(--surface)',
};

// B9: the margin bar is 12 tall on y 22..34; the beam is 80% of it, centred
// on the bar, flush at the bar and slightly rounded at the far end.
const BAR = { x: 4, y: 22, w: 5, h: 12 };
const BEAM_H = BAR.h * 0.8;
const BEAM_Y = BAR.y + (BAR.h - BEAM_H) / 2;
const BEAM_END = 62;
const BEAM_R = 1.5;
const BEAM_OPACITY = 0.28;

function beamPath() {
  const x0 = BAR.x + BAR.w;
  const y1 = BEAM_Y + BEAM_H;
  const r = BEAM_R;
  const f = (n) => +n.toFixed(2);
  return `M${x0} ${f(BEAM_Y)} H${BEAM_END - r} A${r} ${r} 0 0 1 ${BEAM_END} ${f(BEAM_Y + r)} V${f(y1 - r)} A${r} ${r} 0 0 1 ${BEAM_END - r} ${f(y1)} H${x0} Z`;
}

const b9 = (p) =>
  [
    `<rect x="14" y="6" width="44" height="52" rx="8" fill="${p.paper}"/>`,
    `<rect x="22" y="15" width="28" height="4" rx="2" fill="${p.line}" opacity="0.3"/>`,
    `<rect x="22" y="26" width="22" height="4" rx="2" fill="${p.line}"/>`,
    `<rect x="22" y="37" width="26" height="4" rx="2" fill="${p.line}" opacity="0.3"/>`,
    `<rect x="22" y="47" width="18" height="4" rx="2" fill="${p.line}" opacity="0.3"/>`,
    `<rect x="${BAR.x}" y="${BAR.y}" width="${BAR.w}" height="${BAR.h}" rx="2.5" fill="${p.brand}"/>`,
    `<path d="${beamPath()}" fill="${p.brand}" opacity="${BEAM_OPACITY}"/>`,
  ].join('');

const c2 = (p) =>
  [
    `<rect x="13" y="6" width="38" height="52" rx="8" fill="${p.line}"/>`,
    `<rect x="20" y="14" width="20" height="4" rx="2" fill="${p.paper}" opacity="0.6"/>`,
    `<rect x="20" y="46" width="24" height="4" rx="2" fill="${p.paper}" opacity="0.6"/>`,
    `<g fill="none" stroke="${p.brand}" stroke-width="3" stroke-linecap="round">`,
    '<path d="M56 24 L61 18"/><path d="M58 32 H63"/><path d="M56 40 L61 46"/>',
    '<path d="M8 24 L3 18"/><path d="M6 32 H1"/><path d="M8 40 L3 46"/></g>',
    `<rect x="9" y="28" width="46" height="8" rx="4" fill="${p.brand}" stroke="${p.cut}" stroke-width="2" paint-order="stroke"/>`,
  ].join('');

export const marks = {
  b9: { name: 'B9', role: 'primary', title: 'Margin with soft beam', draw: b9 },
  c2: { name: 'C2', role: 'candidate', title: 'Scan with rays', draw: c2 },
};

export const PRIMARY = 'b9';

export function markSvg(id, paint, { size = 64, title = 'pagebeam' } = {}) {
  const label = title ? ` role="img" aria-label="${title}"` : ' aria-hidden="true"';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}"${label}>${marks[id].draw(paint)}</svg>`;
}

import { readFileSync } from 'node:fs';

export const TOKENS_PATH = new URL('../tokens.css', import.meta.url);

const OKLCH = /^oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+))?\s*\)$/;

function declarations(block) {
  const out = {};
  for (const m of block.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/g)) out[m[1]] = m[2].trim();
  return out;
}

function blockAfter(css, selector) {
  const start = css.indexOf(`${selector} {`);
  if (start < 0) throw new Error(`tokens.css has no ${selector} block`);
  return css.slice(start, css.indexOf('}', start));
}

export function parseColour(value) {
  const m = OKLCH.exec(value);
  if (!m) return null;
  return { l: Number(m[1]) / 100, c: Number(m[2]), h: Number(m[3]), alpha: m[4] === undefined ? 1 : Number(m[4]) };
}

/** Colour tokens per theme; dark inherits every light token it does not redefine. */
export function readTokens(css = readFileSync(TOKENS_PATH, 'utf8')) {
  const light = declarations(blockAfter(css, ':root'));
  const dark = { ...light, ...declarations(blockAfter(css, ":root[data-theme='dark']")) };
  const colours = (decls) =>
    Object.fromEntries(
      Object.entries(decls)
        .map(([k, v]) => [k, parseColour(v)])
        .filter(([, v]) => v !== null),
    );
  return { raw: { light, dark }, light: colours(light), dark: colours(dark) };
}

export function toSrgb({ l, c, h }) {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;
  const [L, M, S] = [l_ ** 3, m_ ** 3, s_ ** 3];
  const linear = [
    4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
    -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
    -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S,
  ];
  const encode = (x) => {
    const v = Math.min(1, Math.max(0, x));
    return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
  };
  return linear.map((x) => Math.round(encode(x) * 255));
}

export function hex(colour) {
  return `#${toSrgb(colour)
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('')}`;
}

function luminance(colour) {
  const [r, g, b] = toSrgb(colour).map((v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2 contrast of two opaque colours. */
export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

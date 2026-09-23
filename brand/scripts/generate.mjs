// Every brand file a site serves is written here, from tokens.css and the mark
// geometry, so no favicon or card can drift from the logo by hand.
//
//   node brand/scripts/generate.mjs --name "pagebeam docs" --label Documentation
//
// Writes public/brand/ and public/favicon.ico in the repository holding brand/.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import opentype from 'opentype.js';
import sharp from 'sharp';
import { readTokens, hex } from '../src/tokens.mjs';
import { marks, markSvg, PRIMARY } from '../src/marks.mjs';

const { values: args } = parseArgs({
  options: {
    name: { type: 'string', default: 'pagebeam' },
    label: { type: 'string', default: '' },
  },
});

const require = createRequire(import.meta.url);
const repo = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const pub = join(repo, 'public');

const font = (pkg, file) => opentype.parse(readFileSync(require.resolve(`${pkg}/files/${file}`)).buffer);
const ubuntuBold = font('@fontsource/ubuntu', 'ubuntu-latin-700-normal.woff');
const ubuntuMedium = font('@fontsource/ubuntu', 'ubuntu-latin-500-normal.woff');
const monoBold = font('@fontsource/ubuntu-mono', 'ubuntu-mono-latin-700-normal.woff');

const { light, dark } = readTokens();
const paint = (t) => ({
  paper: hex(t['mark-paper']),
  line: hex(t['mark-line']),
  brand: hex(t.brand),
  cut: hex(t.surface),
});
const ink = (t) => ({ word: hex(t.ink), beam: hex(t['brand-ink']) });

function text(f, s, x, y, size, fill) {
  return `<path fill="${fill}" d="${f.getPath(s, x, y, size).toPathData(2)}"/>`;
}

function wordmark(x, baseline, size, colours) {
  const page = ubuntuBold.getAdvanceWidth('page', size);
  const width = page + ubuntuBold.getAdvanceWidth('beam', size);
  return {
    width,
    svg:
      text(ubuntuBold, 'page', x, baseline, size, colours.word) +
      text(ubuntuBold, 'beam', x + page, baseline, size, colours.beam),
  };
}

function lockup(id, t) {
  const w = wordmark(76, 45, 40, ink(t));
  const width = Math.ceil(76 + w.width + 4);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 64" width="${width}" height="64" role="img" aria-label="pagebeam"><g>${marks[id].draw(paint(t))}</g>${w.svg}</svg>`;
}

// One file that follows the browser's colour scheme, for the tab icon.
function adaptiveFavicon(id) {
  const roles = ['paper', 'line', 'brand', 'cut'];
  const vars = Object.fromEntries(roles.map((r) => [r, `var(--${r})`]));
  const decl = (t) => roles.map((r) => `--${r}:${paint(t)[r]}`).join(';');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><style>svg{${decl(light)}}@media (prefers-color-scheme:dark){svg{${decl(dark)}}}</style>${marks[id].draw(vars)}</svg>`;
}

function card(label, width = 1200, height = 630) {
  const w = wordmark(300, 262, 108, { word: hex(light['band-dark-ink']), beam: hex(light['band-dark-brand']) });
  const mark = `<g transform="translate(96 150) scale(2.9)">${marks[PRIMARY].draw(paint(light))}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<rect width="${width}" height="${height}" fill="${hex(light['band-dark'])}"/>
<rect x="0" y="${height - 10}" width="${width}" height="10" fill="${hex(light.brand)}"/>
${mark}${w.svg}
${text(ubuntuMedium, 'Docs that keep up with your product.', 100, 430, 50, hex(light['band-dark-ink']))}
${text(monoBold, '$ npx pagebeam check', 100, 510, 38, hex(light['band-dark-brand']))}
${label ? text(ubuntuMedium, label, 300, 150, 34, hex(light['band-dark-muted'])) : ''}
</svg>`;
}

// ICO whose single entry is a PNG, which every current browser reads.
function ico(png, size) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(size, 6);
  header.writeUInt8(size, 7);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18);
  return Buffer.concat([header, png]);
}

const png = (svg, size) =>
  sharp(Buffer.from(svg), { density: 384 })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

const files = new Map();
for (const id of Object.keys(marks)) {
  const prefix = id === PRIMARY ? '' : `candidates/${id}-`;
  for (const [theme, t] of [
    ['light', light],
    ['dark', dark],
  ]) {
    files.set(`${prefix}mark-${theme}.svg`, markSvg(id, paint(t)));
    files.set(`${prefix}lockup-${theme}.svg`, lockup(id, t));
  }
  files.set(`${prefix}favicon.svg`, adaptiveFavicon(id));
}

const touch = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 84 84"><rect x="-10" y="-10" width="84" height="84" fill="${hex(light.surface)}"/>${marks[PRIMARY].draw(paint(light))}</svg>`;
files.set('apple-touch-icon.png', await png(touch, 180));
files.set('icon-192.png', await png(touch, 192));
files.set('icon-512.png', await png(touch, 512));
const favicon32 = await png(markSvg(PRIMARY, paint(light)), 32);
files.set('favicon-32.png', favicon32);
files.set(
  'og.png',
  await sharp(Buffer.from(card(args.label)))
    .png()
    .toBuffer(),
);
files.set(
  'site.webmanifest',
  JSON.stringify(
    {
      name: args.name,
      short_name: 'pagebeam',
      icons: [
        { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      theme_color: hex(light.brand),
      background_color: hex(light.ground),
      display: 'browser',
    },
    null,
    2,
  ),
);

rmSync(join(pub, 'brand'), { recursive: true, force: true });
for (const [name, data] of files) {
  mkdirSync(dirname(join(pub, 'brand', name)), { recursive: true });
  writeFileSync(join(pub, 'brand', name), data);
}
writeFileSync(join(pub, 'favicon.ico'), ico(favicon32, 32));

// Frameworks that import the logo as an asset read it from src/, not public/.
const assets = join(repo, 'src', 'assets', 'brand');
rmSync(assets, { recursive: true, force: true });
mkdirSync(assets, { recursive: true });
for (const name of ['lockup-light.svg', 'lockup-dark.svg', 'mark-light.svg', 'mark-dark.svg']) {
  writeFileSync(join(assets, name), files.get(name));
}

console.log(`brand: ${files.size} files written to public/brand`);

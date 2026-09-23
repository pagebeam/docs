/** Every foreground that is read as text, on every ground it is placed on. */
const grounds = ['ground', 'surface', 'surface-sunken'];

export const textPairs = [
  ...['ink', 'ink-muted', 'brand-ink'].flatMap((fg) => grounds.map((bg) => [fg, bg])),
  ['ink', 'band-mist'],
  ['ink-muted', 'band-mist'],
  ['brand-ink', 'band-mist'],
  ['ink', 'brand-soft'],
  ['brand-ink', 'brand-soft'],
  ['on-brand', 'brand'],
  ['band-dark-ink', 'band-dark'],
  ['band-dark-muted', 'band-dark'],
  ['band-dark-brand', 'band-dark'],
  ['band-dark-ink', 'band-dark-raised'],
  ['band-dark-muted', 'band-dark-raised'],
  ['band-dark-brand', 'band-dark-raised'],
  ['on-hero', 'hero-from'],
  ['on-hero', 'hero-to'],
  ...['proven', 'review', 'info', 'clear'].flatMap((s) => [
    [`${s}-ink`, `${s}-soft`],
    [`${s}-ink`, 'surface'],
    ['ink', `${s}-soft`],
  ]),
  ...['start', 'checks', 'config', 'propose', 'cli'].flatMap((a) => [
    [`area-${a}-ink`, `area-${a}-tile`],
    [`area-${a}-ink`, 'surface'],
    [`area-${a}-ink`, 'ground'],
  ]),
  ...['term-fg', 'term-dim', 'term-red', 'term-yellow', 'term-blue', 'term-green'].map((fg) => [fg, 'term-bg']),
  ['term-fg', 'term-raised'],
  ['term-dim', 'term-raised'],
];

/** Marks that carry meaning without being text: 3:1. */
export const markPairs = [
  ['brand', 'surface'],
  ['brand', 'ground'],
  ['brand', 'band-dark'],
  ['mark-line', 'mark-paper'],
];

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync('src/styles/theme.css', 'utf8');
const config = readFileSync('astro.config.mjs', 'utf8');

test('the theme maps Starlight to brand tokens and declares no colour of its own', () => {
  const literal = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(/gi;
  assert.deepEqual(css.match(literal) ?? [], []);
});

test('each top-level sidebar group has an area colour, and each area colour has a group', () => {
  const coloured = [...css.matchAll(/\.top-level > li:nth-child\((\d+)\)/g)].map((m) => Number(m[1]));
  const sidebar = config.slice(config.indexOf('sidebar: ['), config.indexOf('plugins: ['));
  const groups = sidebar.match(/\{\s*label: '[^']+',\s*items:/g) ?? [];
  assert.ok(groups.length > 0, 'no sidebar groups found');
  assert.deepEqual(
    coloured,
    groups.map((_, i) => i + 1),
  );
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readTokens, contrast } from '../src/tokens.mjs';
import { textPairs, markPairs } from '../src/pairs.mjs';

const tokens = readTokens();

function failures(pairs, min) {
  const out = [];
  for (const theme of ['light', 'dark']) {
    for (const [fg, bg] of pairs) {
      const a = tokens[theme][fg];
      const b = tokens[theme][bg];
      assert.ok(a, `${fg} is not a colour token`);
      assert.ok(b, `${bg} is not a colour token`);
      const ratio = contrast(a, b);
      if (ratio < min) out.push(`${theme}: ${fg} on ${bg} is ${ratio.toFixed(2)}, needs ${min}`);
    }
  }
  return out;
}

test('every text pair holds 4.5:1 in both themes', () => {
  assert.deepEqual(failures(textPairs, 4.5), []);
});

test('every meaningful mark holds 3:1 in both themes', () => {
  assert.deepEqual(failures(markPairs, 3), []);
});

test('the checker rejects a pair that is known to fail', () => {
  const yellow = { l: 0.86, c: 0.14, h: 90 };
  const white = { l: 1, c: 0, h: 0 };
  assert.ok(contrast(yellow, white) < 2);
});

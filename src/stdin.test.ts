import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseStdin } from './stdin.js';

describe('parseStdin', () => {
  it('parses valid JSON input', () => {
    const raw = JSON.stringify({ model: { display_name: 'Opus' }, cwd: '/tmp' });
    const result = parseStdin(raw);
    assert.deepStrictEqual(result, { model: { display_name: 'Opus' }, cwd: '/tmp' });
  });

  it('returns null for empty input', () => {
    assert.strictEqual(parseStdin(''), null);
    assert.strictEqual(parseStdin('  '), null);
  });

  it('returns null for invalid JSON', () => {
    assert.strictEqual(parseStdin('not json'), null);
  });
});

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildLine } from './render.js';

describe('buildLine', () => {
  it('joins all three segments', () => {
    const result = buildLine('calendar-text', 'weather-text', 'spotify-text');
    assert.ok(result.includes('calendar-text'));
    assert.ok(result.includes('weather-text'));
    assert.ok(result.includes('spotify-text'));
    assert.ok(result.includes('│'));
  });

  it('omits null segments', () => {
    const result = buildLine('calendar-text', 'weather-text', null);
    assert.ok(result.includes('calendar-text'));
    assert.ok(result.includes('weather-text'));
    assert.ok(!result.includes('null'));
  });

  it('handles single segment', () => {
    const result = buildLine(null, 'weather-text', null);
    assert.ok(result.includes('weather-text'));
    assert.ok(!result.includes('│'));
  });

  it('returns empty string when all null', () => {
    assert.strictEqual(buildLine(null, null, null), '');
  });
});

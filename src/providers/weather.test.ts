import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseWeatherOutput, formatWeather, getLocaleUnitsParam } from '../providers/weather.js';

describe('parseWeatherOutput', () => {
  it('parses weather string', () => {
    const result = parseWeatherOutput('☀️ +72°F');
    assert.deepStrictEqual(result, { display: '☀️ +72°F' });
  });

  it('trims whitespace', () => {
    const result = parseWeatherOutput('  🌤 65°C  \n');
    assert.deepStrictEqual(result, { display: '🌤 65°C' });
  });

  it('returns null for empty output', () => {
    assert.strictEqual(parseWeatherOutput(''), null);
  });

  it('returns null for error output', () => {
    assert.strictEqual(parseWeatherOutput('Unknown location'), null);
  });
});

describe('formatWeather', () => {
  it('formats weather with yellow color', () => {
    const result = formatWeather({ display: '🌤 72°F' });
    assert.ok(result.includes('🌤 72°F'));
    assert.ok(result.includes('\x1b[33m')); // yellow
  });
});

describe('getLocaleUnitsParam', () => {
  it('returns u for en-US locale', () => {
    assert.strictEqual(getLocaleUnitsParam('en-US'), 'u');
  });

  it('returns m for non-US locale', () => {
    assert.strictEqual(getLocaleUnitsParam('en-GB'), 'm');
    assert.strictEqual(getLocaleUnitsParam('de-DE'), 'm');
  });
});

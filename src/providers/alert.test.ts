import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseAlerts, formatAlert } from '../providers/alert.js';

// Use a fixed "now" by creating recent alert dates
function recentDate(): string {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

describe('parseAlerts', () => {
  it('finds active alert for matching city', () => {
    const date = recentDate();
    const json = JSON.stringify([
      { alertDate: date, title: 'ירי רקטות וטילים', data: 'רעננה', category: 1 },
    ]);
    const result = parseAlerts(json, 'רעננה');
    assert.ok(result);
    assert.strictEqual(result.active, true);
    assert.strictEqual(result.title, 'Rockets and Missiles');
  });

  it('ignores event ended (category 13)', () => {
    const date = recentDate();
    const json = JSON.stringify([
      { alertDate: date, title: 'האירוע הסתיים', data: 'רעננה', category: 13 },
    ]);
    const result = parseAlerts(json, 'רעננה');
    assert.strictEqual(result, null);
  });

  it('ignores alerts for other cities', () => {
    const date = recentDate();
    const json = JSON.stringify([
      { alertDate: date, title: 'ירי רקטות וטילים', data: 'שלומי', category: 1 },
    ]);
    const result = parseAlerts(json, 'רעננה');
    assert.strictEqual(result, null);
  });

  it('ignores old alerts (> 5 minutes)', () => {
    const json = JSON.stringify([
      { alertDate: '2020-01-01 00:00:00', title: 'ירי רקטות וטילים', data: 'רעננה', category: 1 },
    ]);
    const result = parseAlerts(json, 'רעננה');
    assert.strictEqual(result, null);
  });

  it('returns null for empty array', () => {
    assert.strictEqual(parseAlerts('[]', 'רעננה'), null);
  });

  it('returns null for invalid JSON', () => {
    assert.strictEqual(parseAlerts('not json', 'רעננה'), null);
  });

  it('detects hostile aircraft alerts', () => {
    const date = recentDate();
    const json = JSON.stringify([
      { alertDate: date, title: 'חדירת כלי טיס עוין', data: 'רעננה', category: 2 },
    ]);
    const result = parseAlerts(json, 'רעננה');
    assert.ok(result);
    assert.strictEqual(result.title, 'Hostile Aircraft');
  });
});

describe('formatAlert', () => {
  it('formats alert with rocket emoji', () => {
    const result = formatAlert({ active: true, title: 'Rockets and Missiles', area: 'רעננה' });
    assert.ok(result.includes('🚀'));
    assert.ok(result.includes('ALERT'));
    assert.ok(result.includes('Rockets and Missiles'));
  });
});
